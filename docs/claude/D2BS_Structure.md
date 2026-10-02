# D2BS / Kolbot 구조 참조 문서

작성일 2026-09-29 · 기준 main `23f0d0c` · D2 Legacy 1.14d / 8캐릭 멀티프로필

이 문서는 현재 코드베이스의 **구조와 관계만** 기술한다. 판정 이력·결함 이력·변경 경위는 담지 않는다.

- 모든 내용은 main 코드에서 다시 확인했다. 저장소 밖의 내용(1-3절 DLL 패치, 1-4절 매니저 로그 경로)은 **2026-09-09 판 원문을 그대로 옮겼고 이번에 확인하지 않았다.**
- Attack 전투 루프와 setPosition의 세부는 `attack_design.md`(명세), `attack_flow.md`(줄 번호 해설)에 있다. 이 문서에는 계약과 호출 관계만 둔다.
- **(임시)** 표시는 인게임 검증 뒤 지울 예정인 항목이다 (`handoff.md` 4절).

---

## 1. 파일 인벤토리

### 1-1. 디렉터리

```
<매니저 루트>/                 ※ 저장소 밖. 원문 기준, 이번에 확인 안 함
├─ D2Bot_LD_patch.exe        매니저 실행 파일
├─ data/                     매니저 설정 (cdkeys / patch / profile / schedules / server .json)
└─ d2bs/
   ├─ D2BS.dll  d2bs.ini
   ├─ logs/
   └─ kolbot/                ← 저장소 루트
      ├─ *.dbj                진입 스크립트 4
      ├─ Settings.js          프로필·팀·빌드 매핑
      ├─ _cache/              런타임 생성: config.<profile>.json, AutoBuild 로그, trace/ (임시)
      ├─ bots/                AutoSmurf.js
      ├─ builds/              빌드 템플릿 13
      ├─ libs/                엔진 15
      │  └─ Attacks/          클래스 공격 8
      ├─ nips/                *.nip 20
      ├─ threads/             스레드 8
      └─ tools/               라이브러리 5
```

### 1-2. 파일 목록

| 위치 | 파일 | 역할 |
|---|---|---|
| kolbot | `D2BotLead.dbj` | 게임 **생성** 진입 스크립트. 리더 프로필 전용 |
| kolbot | `D2BotFollow.dbj` | 게임 **참가** 진입 스크립트. 팔로워 전용 |
| kolbot | `D2BotMap.dbj` | 맵 확인 전용 수동 진입 스크립트 |
| kolbot | `default.dbj` | 게임 내 진입점. 게임 입장 시 자동 실행 |
| kolbot | `Settings.js` | 프로필 정의(`prefix` `names` `profiles`) · `Team` · `Build.getBuildType` |
| tools | `AutoCreate.js` | 계정·캐릭터 자동 생성 |
| tools | `json2.js` | JSON polyfill |
| tools | `NTItemParser.dbl` | NIP 파싱·아이템 평가 엔진 |
| tools | `NTItemAlias.dbl` | 스탯 별칭 테이블 (Parser가 include) |
| tools | `OOG.js` | 매니저 IPC(`D2Bot`) · 통계(`DataFile`) · 로비 조작(`ControlAction`) |
| bots | `AutoSmurf.js` | 유일한 봇 스크립트. 전 액트 퀘스트 진행 + 파밍 |
| libs | `Attack.js` | 전투 엔진(`clear`) · 위치 선정(`setPosition`) · 대상 판정 |
| libs | `Pather.js` | 이동·텔레포트·웨이포인트·포탈. `NodeAction`(이동 노드 훅) |
| libs | `Town.js` | 타운 작업 전반. `NPC` `Town.tasks` |
| libs | `Pickit.js` | 아이템 줍기 판정·실행 |
| libs | `Storage.js` | 인벤/스태시/큐브/벨트 격자 관리 (`Container`) |
| libs | `Misc.js` | `Skill` `Equip` `Grant` `Misc` `Sort` `Experience` `Packet` `Messaging` `Events` |
| libs | `Merc.js` | 용병 패킷 기반 아우라 예측 후 선별 고용 |
| libs | `Precast.js` | 버프·소환·CTA |
| libs | `Cubing.js` | 큐브 레시피 |
| libs | `Runewords.js` | 룬워드 제작 |
| libs | `CollMap.js` | 충돌맵 캐시 |
| libs | `Config.js` | 기본 설정값 + `Config.init` + `Scripts` |
| libs | `AutoBuild.js` | 빌드 템플릿 로딩 · 레벨별 Config 갱신 · 캐시 기록 |
| libs | `Loader.js` | `Scripts`를 순회하며 봇 스크립트 실행 |
| libs | `Prototypes.js` | `Unit`/`me`/`Array`/`String` 프로토타입 확장 |
| libs/Attacks | `Sorceress` `Paladin` `Assassin` `Druid` `Necromancer` `Barbarian` `Amazon` `Wereform` | `ClassAttack` 구현체. 한 번에 1개만 적용 |
| builds | `A.TRAP` `B.WCRY` `D.FGOM` `D.WIND` `N.SUMM` `P.CONC` `P.CONV` `P.FIST` `S.COLD` `S.FIRE` `S.FONV` `S.LTNG` `S.SFFW` | 빌드 템플릿 (`AutoBuildTemplate`) |
| nips | `X` `Y` `Z` `V` | 공용 NIP. `Config.PickitFiles` 기본값 |
| nips | 빌드코드 `.nip` 13종 | 빌드별 NIP. 런타임에 추가 로드 |
| nips | `S.STFO` `S.STFW` `T` | 파일만 존재. 로드 경로 없음 (10-3절) |
| threads | `ToolsThread.js` | 치킨·포션·핑·핫키·디버그 정보 |
| threads | `TownChicken.js` | 타운 복귀 요청 처리 |
| threads | `AutoBuildThread.js` | 스탯·스킬 분배 |
| threads | `PartyThread.js` | 파티 초대·수락 + 팀 이탈 감시 |
| threads | `HeartBeat.js` | 매니저 생존 신호 · reload 중계 |
| threads | `Reload.js` | 게임 유지한 채 인게임 스크립트 재시작 |
| threads | `MapThread.js` | 맵 오버레이 (D2BotMap 전용) |
| threads | `MapHelper.js` | 맵 모드 이동 명령 처리 |

### 1-3. 경로 해석 기준

스크립트가 쓰는 경로 문자열은 전부 `kolbot/` 기준이다 (`include("libs/Attack.js")`, `load("threads/ToolsThread.js")`, `dopen("bots/")`, `Misc.fileAction("_cache/...")`). 여기까지는 코드로 확인된다.

아래는 **원문 그대로이며 이번에 확인하지 않았다** (저장소 밖).

> `include()`의 기준 경로는 `ScriptPath` 자체다. `include` `load` `dopen` `File`/`FileTools`가 모두 동일한 root(`kolbot/`)를 쓴다. 상위 참조(`../`)는 불가능하다. 이는 `D2BS.dll`의 경로 조립 포맷 문자열을 패치한 결과다.
>
> | 항목 | 값 |
> |---|---|
> | 파일 오프셋 | `0x2E3050` (`.rdata`, RVA `0x2E3E50`) |
> | 원본 | UTF-16LE `%s\libs\%s` |
> | 현재 | UTF-16LE `%s\%s` + 널 패딩 (24바이트 슬롯) |
> | CheckSum | `0x004B58AC` (오프셋 `0x160`, 원본 `0x004B5AB2`) |
> | 백업 | `D2BS.dll.bak` |
>
> `libs` 문자열은 DLL 전체에서 이 한 곳뿐이다. `load` 계열이 쓰는 `%s\%s`(0x2D8642), `dir.create()`의 `%s\%s\%s`(0x2E3528), 로그의 `%slogs\`(0x2D858C)는 별개이며 패치 대상이 아니다.
>
> `d2bs.ini`의 `ScriptPath=kolbot`은 D2BS.dll이 있는 폴더 기준 상대 경로다. `[settings]`의 `DefaultStarterScript=starter.dbj`는 프로필 섹션 `[a1]`~`[a8]`이 각자 값을 명시하고 `UseProfileScript=true`이므로 사용되지 않는다. `DefaultConsoleScript`는 주석 처리 상태이고, 이때 실행 중 스크립트 목록(ToolsThread Numpad `/`)에 `Command Line`이라는 컨텍스트가 나타난다. 경로 문자열로 스크립트를 찾는 코드와 이름이 겹치지 않아 무해하다.

### 1-4. 매니저 로그 경로

**원문 그대로이며 이번에 확인하지 않았다** (저장소 밖).

> `D2Bot_LD_patch.exe`는 .NET 어셈블리다. 로그 경로는 `Application.StartupPath`에 아래 문자열을 이어 붙여 만든다.
>
> | 파일 | 경로 |
> |---|---|
> | `keyinfo.log` | `\d2bs\logs\keyinfo.log` |
> | `exceptions.log` | `\d2bs\logs\exceptions.log` |
> | `Console.rtf` | `\d2bs\logs\Console.rtf` |
>
> 루트의 `logs/`는 제거했고 `d2bs/logs/`로 통합했다. `d2bs/logs/`는 DLL이 사용하므로 비어 있더라도 존재해야 한다. `D2Bot.Program`의 경로 상수 `EXCEPTIONS` `KEYINFO`는 인라인되므로 실제 동작은 각 메서드의 `ldstr`(`AddToKeyinfo` `RemoveFromLog`(2곳) `ClearLog` `LoadProfile` `LogCrash` `ParseD2BotLog` `importToolStripMenuItem_Click`)이 결정한다. 나머지 고정 경로는 `\d2bs\d2bs.ini` `\d2bs\D2BS.dll` `\data\cdkeys.json` `\data\patch.json` `\data\profile.json` `\data\schedules.json` `\data\server.json` `\data\web\limedrop.json`이다.

---

## 2. 팀 · 프로필 · 빌드 매핑

`Settings.js`가 팀 전체의 근원 데이터다. 다른 파일은 여기서만 프로필 정보를 얻는다.

```
prefix   = "a"
names    = ["1" ... "8"]
profiles = names.map(n => prefix + n)          → ["a1" ... "a8"]

Team = { Size: profiles.length, Profiles: profiles, Leader: profiles[0], Boer: profiles[7] }
```

| 프로필 | 빌드코드 | 클래스 | 역할 | 진입 스크립트 |
|---|---|---|---|---|
| a1 | S.SFFW | 소서리스 | Leader (텔레포트 패서) | `D2BotLead.dbj` |
| a2 | S.COLD | 소서리스 | Follower | `D2BotFollow.dbj` |
| a3 | A.TRAP | 어쌔신 | Follower | `D2BotFollow.dbj` |
| a4 | P.CONC | 팔라딘 | Follower | `D2BotFollow.dbj` |
| a5 | P.CONV | 팔라딘 | Follower | `D2BotFollow.dbj` |
| a6 | D.FGOM | 드루이드 | Follower | `D2BotFollow.dbj` |
| a7 | N.SUMM | 네크로맨서 | Follower | `D2BotFollow.dbj` |
| a8 | B.WCRY | 바바리안 | Boer (배틀오더) | `D2BotFollow.dbj` |

`Build.getBuildType()`은 `me.profile`을 `profiles[n]`과 대조해 `"C.BBBB"` 문자열을 반환하고, 미등록 프로필이면 `false`를 반환한다. 매핑되지 않은 빌드: `D.WIND` `S.FIRE` `P.FIST` `S.FONV` `S.LTNG` (파일만 존재, 10-3절).

`Team` / `profiles` 소비처

| 소비처 | 용도 |
|---|---|
| `D2BotFollow.dbj` | `Team.Leader`를 참가 대상 프로필로 사용 |
| `PartyThread.partyCheck` | `Team.Leader`면 초대만, 아니면 수락만 |
| `PartyThread.partyInGame` | `Team.Size` `Team.Profiles`(캐릭명)와 파티 인원 대조 |
| 빌드 템플릿 13종 | `Team.Leader`일 때 리더 전용 Config 적용 |
| `AutoSmurf` | `Team.Leader`/`Team.Boer` 역할 판정, `Team.Profiles` 브로드캐스트 대상·대기 위치 오프셋, `Team.Size` 동기화 카운트 |
| `AutoCreate.account` | `profiles` 역순 인덱스로 계정 생성 지연 계산 |

`Build.getBuildType()` 소비처는 `AutoCreate.getInfo`(클래스 결정), `AutoBuild.initialize`(클래스 검증 + 템플릿·NIP 파일명 생성) 두 곳이다.

---

## 3. 진입점별 부트 시퀀스

### 3-1. D2BotLead.dbj (게임 생성)

```
include  tools/json2 / tools/OOG / tools/AutoCreate / libs/Misc / libs/Pather / libs/Config / Settings
설정     StarterConfig (파일 상단), ChannelConfig
main()
 ├─ addEventListener("copydata", ReceiveCopyData)     2 게임 정보 / 3 게임 요청 → D2Bot.joinMe / 4 핑
 ├─ addEventListener("scriptmsg", ScriptMsgEvent)     "pingquit" 수신
 ├─ handle 수신 대기 → D2Bot.init() → load("threads/HeartBeat.js")
 ├─ D2Bot.requestGameInfo() 반복 (gameInfo 수신까지)
 ├─ gameInfo.error 이면  CrashDelay 대기 → D2Bot.updateRuns()
 └─ while(true)
      인게임: 게임 시작 시 runs 기록 · restCount() / 1초마다 상태 표시
      아웃게임: locationAction(getLocation())
```

`locationAction` 주요 분기

| location | 처리 |
|---|---|
| 1 로비 | 핑 종료 지연 → `addPlayTime()` → 최소 게임시간 대기 → `D2Bot.updateRuns()` → `restCheck()` → LobbyWaitDelay → 게임 생성 버튼 |
| 3 로비 채팅 | 로비와 같은 게임 종료 처리 후 생성 화면으로 |
| 4 게임 생성 | FTJ 이면 `FTJDelay` 대기 → `ControlAction.createGame(name, pass, difficulty, delay)` → `setNextGame()` |
| 8 / 9 / 12 / 18 로그인·캐릭선택 | `login(me.profile)` |
| 10 로그인 에러 | Invalid Account → `AutoCreate.account()`, 실패 시 `D2Bot.restart()`. CD키 계열은 키 교체·재시도 지연 |
| 42 캐릭터 없음 | `AutoCreate.character()` |

리더 전용 기능

| 함수 | 동작 |
|---|---|
| `restCount()` | 게임 시작마다 `DataFile.restInfo.count` +1 (크래시 게임 포함) |
| `restCheck()` | 로비에서 `RestGameCount`(10)판이 `RestTime`(3600초) 안에 끝났으면 남은 시간만큼 대기 후 초기화 |
| `addPlayTime()` | 정상 종료 게임의 인게임 시간을 `DataFile.playTime`에 누적, 콘솔에 총 시간·판당 평균 출력 |

게임 요청(copydata 3)을 받으면 `D2Bot.joinMe(...)`로 팔로워에게 게임명·비밀번호를 전달한다. 인게임 진입 시 매니저가 `default.dbj`를 실행한다.

### 3-2. D2BotFollow.dbj (게임 참가)

include 구성과 로그인·계정생성 경로(location 10 / 42)는 Lead와 같다. 차이는 게임 생성 대신 참가라는 점이다.

```
location 5 (Join Game)
 ├─ leader = [Team.Leader]
 ├─ D2Bot.requestGame(leader)  →  joinInfo 수신 (copydata 1)
 ├─ 직전 시도가 pending 이면 JoinRetryDelay 동안 joinCheck(leader) 로 재확인
 ├─ 직전 게임 종료 후 5초 이내면 FTJ 방지 지연
 ├─ AdvancedConfig[profile].JoinDelay 가 있으면 추가 지연
 └─ 게임명 / 비밀번호 입력 → lastGame 에 기록
```

### 3-3. D2BotMap.dbj (수동)

`main()` 안에서 `json2 / OOG / Misc`만 include한다. 게임 생성·참가 로직이 없고, `D2Bot.init()` 후 `threads/HeartBeat.js`만 로드한다. copydata 3(게임 요청)에는 게임 준비 상태일 때만 `joinMe`로 응답한다. 인게임에서는 `default.dbj`가 이 스크립트를 감지해 맵 모드로 들어간다(3-4절).

### 3-4. default.dbj (게임 내 진입점)

```
include  tools/: json2 / NTItemParser.dbl / OOG
         libs/:  Attack Cubing CollMap Config Loader Misc Pickit
                 Pather Precast Prototypes Runewords Storage Town Merc

main()
 ├─ D2Bot.init()  →  D2Bot.ingame()
 ├─ while (!me.gameReady) 대기
 ├─ load("threads/HeartBeat.js")                      미로드 시에만
 ├─ getScript("D2BotMap.dbj") 이면
 │     load("threads/MapThread.js") → 무한 대기 (이하 전부 미실행)
 ├─ 초기화   Config.init(true)        → AutoBuild.initialize (Pickit.init 포함, 3-6절)
 │           Attack.init()
 │           Storage.Init()
 │           Runewords.init()
 │           Cubing.init()
 ├─ me.maxgametime = Config.MaxGameTime * 1000
 ├─ DataFile.getStats()  →  경험치 감소 && LifeChicken > 0 이면 사망 기록
 ├─ load("threads/ToolsThread.js")
 ├─ load("threads/PartyThread.js")
 ├─ load("threads/TownChicken.js")
 ├─ Town.getCorpse()                                  (Scripts.UserAddon / Test 가 아니면. 현재 항상 실행)
 ├─ Loader.init()                                     ★ 봇 실행
 ├─ Config.MinGameTime 미달 시 타운에서 대기
 └─ DataFile.updateStats("gold")  →  scriptBroadcast("quit")
```

`AutoBuildThread.js`는 `default.dbj`가 직접 로드하지 않는다. `Config.init` → `AutoBuild.initialize` 경로에서 로드된다.

### 3-5. Config.init(notify)

`Config.AutoBuild.Enabled === true`일 때만 동작한다. `notify` 인자는 쓰이지 않는다.

```
현재 스크립트가 default.dbj 또는 threads\autobuildthread.js
 └─ include("libs/AutoBuild.js") → AutoBuild.initialize()

그 외 스레드 (ToolsThread / TownChicken / PartyThread)
 └─ _cache/config.<profile>.json 을 읽어 Config 에 키 단위로 덮어씀
    addEventListener("scriptmsg")
      {event: "level up"} 수신 시 캐시 재로드 (JSON.parse 실패 시 최대 30회 × 100ms 재시도)
    캐시 파일이 없으면 오류 출력만 하고 기본값 유지
```

빌드 템플릿을 실제로 include하는 것은 `default.dbj`와 `AutoBuildThread.js` 둘뿐이고, 나머지 스레드는 캐시 파일로 동기화된다. `MapHelper`는 `Config.js`를 include하지만 `Config.init`을 호출하지 않아 기본값을 쓴다.

### 3-6. AutoBuild.initialize()

```
1  Build.getBuildType() 의 클래스 문자와 me.classid 대조
     불일치 → throw "Mismatched class"
2  템플릿 경로 = "builds/" + 빌드코드 + ".js"  (소문자)
3  default.dbj 인 경우
     빌드코드 대문자 + ".nip" 을 Config.PickitFiles 에 push (중복 방지)
     Pickit.init(true)
4  include(템플릿)     실패 → throw "Failed to include template"
5  default.dbj 이고 autobuildthread 미실행이면  load("threads/AutoBuildThread.js")
6  autobuildthread 가 아니면  addEventListener("scriptmsg", levelUpHandler)
7  default.dbj 인 경우  applyConfigUpdates()
```

| 함수 | 동작 |
|---|---|
| `applyConfigUpdates()` | `AutoBuildTemplate[configUpdateLevel+1 .. me.charlvl].Update`를 `Config`에 순서대로 적용한 뒤, 함수를 제외한 `Config` 전체를 `_cache/config.<profile>.json`에 기록. 다른 스레드 Config 동기화의 원본 |
| `levelUpHandler(obj)` | `{event: "level up"}` → `applyConfigUpdates()` → `Attack.init()` (46레벨 Wereform 전환 등 공격 파일 재적용) |

`levelUpHandler`를 등록하는 곳은 `Config.init`이 `AutoBuild.initialize`를 부르는 스크립트 중 AutoBuildThread가 아닌 것, 즉 사실상 `default.dbj` 하나다.

빌드 템플릿 구조

```
AutoBuildTemplate = {
  BuildGoal: { Stats: [{stat, target, per}], Skills: [{id, target, from, to}] }   ← AutoBuildThread 가 분배에 사용
  <레벨>: { Update: function () { Config.* 설정; Equip.updateTiers(); Grant.updateTiers(); } }
}
```

13종 모두 `BuildGoal`을 가진다. `BuildGoal`이 없으면 AutoBuildThread는 레벨별 `StatPoints`/`SkillPoints` 방식으로 동작한다.

### 3-7. Loader.init()

```
getScripts()    dopen("bots/") 의 .js 파일명을 fileList 에 수집
loadScripts()
 ├─ Config 원본을 unmodifiedConfig 로 복사
 ├─ Scripts 객체에서 truthy 인 키를 scriptList 로 수집   → 현재 ["AutoSmurf"]
 └─ 각 스크립트마다
      include("bots/<name>.js")
      skipTown(["Test", "Follower"]) 이 아니면 Town.goToTown() 성공 시에만 진행
      Messaging.sendToScript("threads/ToolsThread.js", {currScript: name})
      global[name]()                    ← AutoSmurf() 실행
      Scripts[name] 이 객체였으면 Config 원복
```

---

## 4. 스레드 구조와 통신

### 4-1. 스레드 구성 (일반 운영)

| 스레드 | 로드 주체 | 담당 | 루프 주기 |
|---|---|---|---|
| `default.dbj` | 매니저 | 봇 본체 실행 | — |
| `HeartBeat.js` | 각 `.dbj` 진입 스크립트 (`default.dbj`는 미로드 시에만) | `D2Bot.heartBeat()`, reload 중계 | 1000ms |
| `ToolsThread.js` | `default.dbj` | 치킨·포션·핑·핫키 | 10ms |
| `TownChicken.js` | `default.dbj` | 타운 복귀 | 10ms |
| `PartyThread.js` | `default.dbj` | 파티 초대·수락, 이탈 감시 | 100ms |
| `AutoBuildThread.js` | `AutoBuild.initialize` | 스탯·스킬 분배 | 1000ms |
| `Reload.js` | `HeartBeat.js` | 인게임 스크립트 재시작 | 1000ms |

맵 모드에서는 `MapThread.js`(+`MapHelper.js`)와 `HeartBeat.js`만 돈다.

### 4-2. 스레드별 동작

**ToolsThread** — 자체 `Config.init(false)` `Pickit.init(false)` `Attack.init` `Storage.Init` `Runewords.init` `Cubing.init`을 수행하고 `Config = Misc.copy(Config)`로 사본을 고정한다. 시작 시 `Packet.changeStat`으로 `FCR` `FHR` `FBR` `IAS`를 적용한다.

| 항목 | 내용 |
|---|---|
| 포션 | `UseHP` `UseMP` `UseRejuvHP` `UseRejuvMP`, 용병 `UseMercHP` `UseMercRejuv` |
| 치킨 | `LifeChicken` `ManaChicken` `IronGolemChicken` `MercChicken` → `this.exit()` |
| 핑 | `checkPing(true)`: `Config.PingQuit` 초과 지속 시 `scriptBroadcast("pingquit")` 후 종료 |
| 종료 | `scriptmsg`의 `"quit"` 또는 핑 초과 → `quitFlag` → `LogExperience`면 `Experience.log()` → `exit()` |
| 용병 | `Config.AutoEquip` && 용병 레벨 > `MercStat.lvl`이면 `Grant.updateStat(merc)` |
| 메시지 | JSON `{useMerc, useMercHP, useMercRejuv, lifeChicken}` → 해당 Config 갱신 / `{currScript, lastAction}` → debugInfo |
| 디버그 | `debugInfo{area, currScript, lastAction}` → `DataFile.updateStats("debugInfo")` |

`exit()`는 `stopDefault()`(AutoBuildThread / PartyThread / TownChicken / default.dbj 정지) 후 `quit()`한다.

핫키 (`keyEvent`)

| 키 | 동작 |
|---|---|
| Pause/Break | `default.dbj` + TownChicken + PartyThread 일시정지·재개 |
| Numpad `*` | 스탯 덤프 출력 (MF/GF/저항/FCR/IAS/FBR/FHR/FRW/CB/DS/OW/LL/ML/DR/MDR) |
| Numpad `0` | `scriptBroadcast("quit")` |
| Numpad `1` | `me.gameReady / me.dead / me.mode` 출력 (임시) |
| Numpad `.` | HeartBeat에 `"reload"` 전송 |
| Numpad `/` | 실행 중 스크립트 목록 출력 |
| Numpad `-` | 현재 좌표 출력 (콘솔 포함) |
| Numpad `+` | `revealLevel(true)` |

나머지 키(Insert, Delete, Page Up/Down, End, Numpad 2~9)는 빈 분기다.

**TownChicken** — 자체 `Config.init` `Pickit.init` `Attack.init` `Storage.Init` `Runewords.init` `Cubing.init`. `scriptmsg`로 `"townCheck"`를 받으면 플래그를 세운다(area 136 · 120은 거부). 루프에서 `!me.dead && !me.inTown`이고 (플래그 || `TownHP` 미달 || `TownMP` 미달)이면 `default.dbj`를 pause하고 `Town.visitTown()`을 실행한 뒤 재개한다. `visitTown`이 예외를 던지면 `scriptBroadcast("quit")`.

**AutoBuildThread** — 1초마다 `spendStats()` → `spendSkills()`, 레벨 상승 감지 시 `scriptBroadcast({event: "level up"})`. 분배는 템플릿의 `BuildGoal`을 따른다.

| 함수 | 동작 |
|---|---|
| `spendStats` | `BuildGoal.Stats`를 순서대로 `target`(장비 보너스 제외 수치)까지, `per`가 있으면 한 바퀴에 `per`씩. 5포인트마다 목록 처음부터 다시 |
| `spendSkills` | `BuildGoal.Skills`를 순서대로 `target`까지. 요구 레벨·`from`/`to` 구간·선행 스킬 처리, 레벨당 상한 `charlvl - 요구레벨 + 1` |

**PartyThread** — 파일 최상단에서 `Config.init()`. 100ms 주기로 `partyCheck()` → `partyInGame()`.

- `partyCheck`: `Team.Leader`면 초대만 보내고 수락하지 않으며, 그 외 프로필은 받은 초대를 수락한다.
- `partyInGame`: 자기 `partyid`와 같은 인원을 세어 `Team.Size`와 비교한다. 팀이 한 번도 모이지 않았으면 판단하지 않는다(`teamFormed`). 최초로 인원이 다 찬 뒤부터 감시하고, 미달이 `retry > 2`(약 0.3초)에 이르면 빠진 캐릭명을 출력하고 `scriptBroadcast("quit")`한다. 인원이 다시 차면 `retry`가 0이 된다.

**HeartBeat** — 1초마다 `D2Bot.heartBeat()`. `scriptmsg` `"reload"`를 받으면 `Reload.js`에 전달하거나 로드한다. 아웃게임에서 Pause 키를 누르면 `.dbj` 스크립트를 일시정지·재개한다.

**Reload** — `AutoBuildThread` `PartyThread` `ToolsThread` `TownChicken` `default.dbj`를 정지시키고 3초 뒤 `default.dbj`를 다시 로드한다. HeartBeat와 `.dbj` 진입 스크립트는 의도적으로 대상에서 제외돼 있다. 게임을 나가면 같은 대상을 정지하고 끝난다.

**MapThread / MapHelper** — MapThread가 `Attack` `Pather`를 include하고 `MapHelper.js`를 로드한 뒤 몬스터·아이템·경로 오버레이를 그린다. MapHelper는 `scriptmsg`로 받은 `{type: "area"|"unit"|"wp", dest}`를 `Pather.moveToExit` / `moveToUnit` / `getWP`로 실행하고, 인벤토리 UI(0x09)가 열리면 MapThread를 pause한다.

### 4-3. 통신 경로

| 경로 | 범위 | 용도 |
|---|---|---|
| `scriptBroadcast(msg)` | 같은 프로필의 전 스레드 | `"quit"` `"pingquit"` `"townCheck"` `{event:"level up"}` `{useMerc, useMercHP, useMercRejuv}` `{lifeChicken}` |
| `Messaging.sendToScript(name, msg)` | 지정 스레드 1개 | `{currScript}` → ToolsThread, `"reload"` → HeartBeat → Reload |
| `sendCopyData` / `copydata` | **프로필 간** | AutoSmurf 팀 동기화 |
| `D2Bot.*` | 봇 ↔ 매니저 | 상태·통계·게임 생성/참가 정보 |

`"quit"`을 보내는 곳: `default.dbj` 종료, AutoSmurf(대기 시간 초과 등 여러 곳), PartyThread(이탈), TownChicken(`visitTown` 실패), ToolsThread(Numpad 0). 받는 곳은 ToolsThread다.

프로필 간 통신 `Messaging.sendToList(list, message, mode = 55)`는 `AutoSmurf.js` 안에서 정의되고, 자기 자신을 뺀 프로필에 `{nick, msg}` JSON으로 감싸 보낸다. `Messaging.sendToProfile`(Misc.js)은 쓰이지 않는다.

| mode | 내용 |
|---|---|
| 55 | 문자열 신호. 준비: `readyCount` `teamReady` `okCount` `teamOk` `teamCount` / 버프·이동: `syncBO` `BOing` `BOed` `BOCount` `BOReady` `buffCount` `teamBuff` `syncWP` `tpReady` `earlyReturn` / 준비물: `hireMerc` `giveGold` `farmingON` `essA` `essM` `keyT` `keyH` `keyD` `getCube` / 퀘스트: `cube` `amulet` `summoner` `tombs` `radament` `duriel` `figurine` `teamFigurine` `travincal` `mephisto` `takeRedPortal` / 소 레벨: `msgLeader` `msgFollower` |
| 56 | 좌표 객체 `{x, y}`. 소 레벨에서 리더가 이동 노드를 공유 (`msgNode`) |

---

## 5. 주요 함수 계약

시그니처 · 반환 · 주요 부작용만 기재한다. 내부 헬퍼와 정렬 콜백은 제외한다.

### Settings.js
```
Build.getBuildType()                        → "C.BBBB" | false
전역: prefix, names, profiles, Team{Size, Profiles, Leader, Boer}
```

### AutoCreate.js
```
AutoCreate.getInfo()   → {account, password, realm, charName, charClass,
                          ladder, expansion, hardcore} | false
                         계정·캐릭명은 Profile(me.profile) 에서, 클래스는 빌드코드에서
AutoCreate.account()   → bool   로그인 에러 해제 → (profiles 역순 인덱스 × 8초 + 3초) 지연 →
                                ControlAction.makeAccount
AutoCreate.character() → bool   location 42 에서만. 렐름 다운(컨트롤 비활성) 시 false
```

### Config.js
```
Config.init(notify)                          부작용만 있음. 반환 없음 (3-5절)
전역: Scripts = {AutoSmurf: true}
```

### AutoBuild.js
```
AutoBuild.initialize()          템플릿 include · NIP 추가 · 스레드 로드 · 리스너 등록 (3-6절)
AutoBuild.applyConfigUpdates()  레벨별 Update 적용 후 _cache/config.<profile>.json 기록
AutoBuild.print(...)            Verbose/DebugMode 에 따라 출력·로깅
                                로그 파일은 _cache/AutoBuild.<realm>.<char>.<date>.log
```

### Loader.js
```
Loader.init()                   getScripts() → loadScripts()
Loader.scriptName(offset)       → 실행 중 스크립트명 | null   (호출부 없음)
```

### Attack.js

세부 명세: `attack_design.md` (2절 시그니처, 4절 전투 루프, 6절 setPosition, 7절 tick)

```
상수  classes / infinity / ids / elements
      dangerRange 10      MUST 가 살아 있을 때 함께 처리하는 내 주변 반경
      leashRange  25      MUST 가 이만큼 멀어지면 소탕보다 MUST 를 먼저 쫓음
      tick {cast, moved, fail, must, monList}   틱 단위 사이드채널 (7절 참조)

init()                          Config.Wereform 이면 Attacks/wereform.js,
                                아니면 Attacks/<클래스>.js 를 include
                                확장(gametype 1)이면 checkInfinity / getCharges / getPrimarySlot
                                호출: default.dbj / ToolsThread / TownChicken / AutoBuild.levelUpHandler

clear(range, must)              → bool   단일 전투 엔진
    range   소탕 반경. 0 이면 지역 소탕 없음. 숫자가 아니면 throw (유일한 throw)
    must    생략 가능. classid | 이름 | [classid·이름, ...] | {x1, x2, y1, y2}(박스, range 강제 0)
    false   사망 / 소 레벨(39) 카우킹 감지 / AttackSkill[1]·[3] 미설정 /
            설정된 공격 스킬을 실제로 안 배움 (이때 D2Bot.stop())
    true    그 외. 실제 시전이 1회 이상이면 Pickit.pickItems(range, 0 이면 25) → ClassAttack.afterAttack()
mustSpec(must)                  → null | {ids} | {box}
mustMatch(spec, unit)           → bool
hasUsableSkill(unit)            → bool   AttackSkill 슬롯 중 저항에 막히지 않는 스킬이 있는가

setPosition(unit, distance, coll, minDist) → bool   ★ 위치 선정 단일 창구
    minDist 기본 1 (260930)
    이동 불필요 && 회피 조건 미충족 → 즉시 true
    접근  사거리 밖 또는 시야 차단: 5칸 간격 링 후보, 바깥 링 → 작은 각도 순
          SWEEP 대상은 내 위치에서 0x4 로 보이는 자리만, 걷기 우회는 경로 ≤ 직선 × DetourPath 일 때만
          MUST 대상(tick.must)은 조건 없이 이동
    회피  사거리 안 && Dodge.Enabled && distance ≥ Dodge.MinSkillRange (classid 243 제외)
          && R = min(사거리, Dodge.Range) 미만 몹 1마리 이상: 링 하나(걷기 R, 텔레 사거리)에서
          현재 위치보다 1 이상 적은 자리 중 몹 수 최소로 (동점은 곧게 물러나는 쪽, 261001)
    false 는 접근 실패뿐. 이유는 tick.fail = "unreachable" | "moveFailed"
checkFire(x, y, fireList)       → bool   불장판 좌표 배제
getFireList()                   → Array
buildMonsterList()              → Array  setPosition / Pather.safeCheckNode 위협 목록
getMonsterCount(x, y, range, list, fireList) → Number
checkMonster(unit)              → bool   공격 대상 유효성
checkSkipped(unit) / skipCheck(unit)   → bool   Skip* 설정 기반 제외
getCowKing(range)               → bool
validSpot(x, y)                 → bool
checkResist(unit, val, maxres)  → bool   / getSkillElement(skillId) / getResist(unit, type)
weaponSwitch(slot) / getPrimarySlot() / checkSlot(slot)
checkInfinity() / getCharges() / getCustomAttack(unit) / usingBow()
```

### Pather.js
```
상수  teleport true / walkDistance 5 / teleDistance 35 (maxTeleDistance 260930 삭제)
      cancelFlags / wpAreas / recursion

useTeleport()                   → bool  텔레포트 스킬 또는 아이템 차지 보유 &&
                                        상태이상(139, 140) 없음 && !inTown
moveTo(x, y, retry, clearPath, pop) → bool | "killMonsters"
    clearPath 기본 false, pop 기본 false (true 면 경로 마지막 노드 제거)
    텔레 경로 노드 간격: getTeleDistance() = narrowAreas(62/63/64/88/89/91/74) 30, 그 외 teleDistance (261001 첫 경로·SafeTele 뒤·실패 재계산 모두)
    TownCheck 이면 노드마다 Misc.townCheck()
    텔레 && SafeTele.Skip 지역 아님: 노드마다 safeCheckNode 로 재배치
      Attack.getMonsterCount 가 SafeTele.Range 미만 몬스터를 1마리 이상 세면 (261001 Count 삭제)
      getTeleDistance() 부터 Min 까지 Step 씩 줄이며 대체 노드 탐색 (최근 5개 제외)
    노드 도착마다 NodeAction.go({clearPath, prevNode, node}).
      killMonsters 가 "killMonsters" 를 돌려주면 moveTo 도 그 값을 반환
teleportTo(x, y, maxRange)      → bool  최대 10회 시전(회차당 me.attacking 기준 최대 2초), 기본 maxRange 5
walkTo(x, y, minDist)           → bool  팔라딘은 타운에서 Vigor, 필드에서 Conviction/Meditation/Cleansing/Vigor 오라
openDoors(x, y) / moveToUnit(unit, offX, offY, clearPath, pop)
moveToPreset(area, unitType, unitId, offX, offY, clearPath, pop)
moveToExit(targetArea, use, clearPath) / getNearestRoom(area) / openExit(targetArea)
useUnit(type, id, targetArea) / openUnit(type, id)
useWaypoint(targetArea)         targetArea null 이면 현재 지역 WP 활성화만
makePortal(use) / usePortal(targetArea, owner, unit) / getPortal(targetArea, owner)
getNearestWalkable(x, y, range, step, coll, size) / checkSpot(x, y, coll, cacheOnly, size)
accessToAct(act) / goWP(area, clearPath) / getWP(area, clearPath)
journeyTo(area) / plotCourse(dest, src) / areasConnected(src, dest)
getAreaName(area)               → String

NodeAction   moveTo 가 노드마다 호출하는 훅. clearPath === false 면 모두 건너뜀
  killMonsters   Attack.clear(25) (카오스 108 은 clear(20)). false 면 "killMonsters"
  popChests      Config.OpenChests 면 Misc.openChests(15)
  getShrines     Config.ScanShrines 가 있으면 Misc.scanShrines()
  useWells       Config.UseWells 면 반경(텔레 25 / 걷기 15) 안 우물 사용
PathDebug    drawPath / removeHooks / coordsInPath
```

### Town.js
```
NPC               로케일 문자열 기반 NPC 이름 테이블
Town.tasks        액트별 {Heal, Shop, Gamble, Repair, Merc, Key} NPC 매핑 (5개)
Town.ignoredItemTypes   스태시 제외 아이템 타입

doChores(shopItems)   → true
   shopItems 인 경우 먼저: gamble → (UseKeys) buyKeys → reviveMerc → Equip.autoEquip
                            → Grant.autoEquip → Cubing.doCubing → Runewords.makeRunewords
   항상: clearBelt → heal → identify → clearInventory → fillTome(518)
         → buyPotions → repair → UI 정리
         → Pickit.pickItems → Equip.autoEquip → Grant.autoEquip → stash
   단계마다 Misc.trace (임시)
visitTown()           → bool   타운이면 autoEquip ×2 + stash 만.
                               아니면 goToTown → doChores → (액트 복귀) → 포탈로 원위치. 복귀 실패 시 throw
goToTown(act)         → bool
move(spot) / moveToSpot(spot) / initialize()   타운 내 지정 위치 이동
initNPC(task, reason) → unit | false   Town.tasks 로 NPC 확보 후 메뉴 열기
heal() / needHealing() / identify() / identifyItem() / repair(shopItems) / needRepair()
buyPotions(shopItems) / checkColumns / getPotion / fillTome(code) / checkScrolls
stash(stashGold) / canStash(item) / needStash() / openStash()
reviveMerc()          Config.MercMinGold 미만이면 false. 3막에서는 하지 않음
needMerc() / gamble() / needGamble() / shopItems()
buyKeys() / checkKeys() / wantKeys()   Config.UseKeys 경로
clearBelt() / clearInventory() / ignoredCheck(item)
getCorpse()           30초 안에 시체를 못 찾으면 D2Bot.stop()
```

### Pickit.js
```
init(notify)          Config.PickitFiles 를 "nips/" + 파일명으로 NTIP.OpenFile 에 적재 →
                      NTIP.SortLists() → beltSize 갱신
checkItem(unit)       → {result, tier, merc, qty, reason, line}   (8-2절)
pickItems(range, orgx, orgy)   기본 range 25. 걷기 중에는 0x1 로 막힌 아이템 제외.
                               공간 부족이면 canMakeRoom() → Town.visitTown() 후 pickItems(10) 재귀
pickItem(unit, status) / canPick(unit) / canMakeRoom() / checkBelt()
```

### Storage.js
```
Storage.Init()        Inventory(10×4) / TradeScreen / Stash(6×4 또는 6×8)
                      / Belt(4×BeltSize) / Cube(3×4) 생성 후 Reload()
Storage.Reload()      → bool   me.getItem() 순회하며 각 Container 에 Mark
Storage.BeltSize()    → 1~4

Container.Mark(item) / Reset() / CanFit(item) / FindSpot(item)
Container.MoveTo(item) / MoveToSlot(item, col, row)
Container.UsedSpacePercent() / Compare(baseRef) / IsLocked(item, baseRef) / Dump()
```

### Misc.js
```
Skill.getRange(skillId) / getHand(skillId) / cast(skillId, hand, x, y, item)
Skill.setSkill / isTimed / wereFormCheck / townSkill / getManaCost
      cast 는 setSkill 성공 직후 Attack.tick.cast = true (Attack 이 있는 스레드만)

Equip.autoEquip()            NTIP.GetScore(item,"Tier") 내림차순으로 장착 시도.
                             미감정이면 감정 후 장착, 장착 성공 시 로깅 + updateTier
Equip.updateTier(bodyLoc, skipLog) / updateTiers() / getBodyLoc(item) / canEquip / equip
Equip.getEquippedItem(bodyLoc) → {tier, ...}

Grant.*                      같은 구조의 용병 버전. 점수 키는 "Merc"
Grant.updateStat(merc)       용병 레벨 변화 반영 (ToolsThread 가 호출)
Grant.removeItems()          Merc.hire 가 호출

Misc.townCheck()             → bool   TownCheck && 필드 && 골드 > 1000 에서 벨트 hp/mp 열이 비면
                                      scriptBroadcast("townCheck"). area 136 / 120 / 사망 시 false
Misc.openChest(unit, cain)   → bool   어쌔신이 아니면 잠긴 상자는 열쇠가 없을 때 건너뜀
Misc.openChests(range)       기본 15. OpenChests === 2 면 전체 컨테이너 목록.
                             가까운 순, 0x5 로 막히지 않은 것만 열고 매번 Pickit.pickItems
Misc.scanShrines(range) / getShrine(unit)
Misc.fileAction(path, mode, msg)      mode 0 읽기 / 1 쓰기 / 2 추가
Misc.trace(msg)              (임시) _cache/trace/trace-<profile>-<YYYYMMDD>.txt 에 추가
Misc.errorReport(error, script) / debugLog(msg)
Misc.logItem(action, unit, keptLine) / itemLogger(action, unit, text) / getItemDesc / getItemSockets
Misc.shapeShift(mode) / unShift() / cursorCheck() / useMenu(id) / click / inMyParty
Misc.clone(obj) / copy(from) / poll(check, timeout, sleep)

Sort.units
Packet.openMenu / startTrade / buyItem / sellItem / identifyItem / itemToCursor
Packet.dropItem / castSkill / unitCast / flash / changeStat
Messaging.sendToScript(name, msg)
Experience.log() / progress / gain / gainPercent / runsToLevel / totalRunsToLevel / timeToLevel / getGameTime
```

### Merc.js
```
Merc.mercSkill    스킬명 → {act, id, diff} 매핑 12종
Merc.table        하이어링 원본 테이블 (아우라 예측 기준값)

hire(skill, force, level)  → bool
    skill 미지정·미등록·난이도 불일치 → true (건너뜀)
    이미 해당 스킬 보유 && !force    → true
    액트 접근 퀘스트 미완료 등        → false
    Town.goToTown(act) → gamepacket 리스너(addEventListener 직접) → 하이어 메뉴 개방 →
    패킷 후보 목록에서 아우라 예측 → 일치 후보 고용 → getSkill 로 검증,
    빗나가면 다음 후보로 최대 5회 → Grant.removeItems / updateTiers / Pickit.pickItems / autoEquip →
    원래 액트로 복귀
checkSkill(skill)      → bool   DataFile 기준 보유 판정
candidate(name, seed) / Rnd(seed) / checkActByName(name) / packet(pByte)
```

### Precast.js
```
doPrecast(force)       precastCTA 후 클래스별 버프·소환 일괄 시전
                       BO 는 없거나 만료 30초 전이면 강제 갱신
precastCTA(force) / checkCTA() / getBetterSlot(skillId) / precastSkill(skillId)
summon(skillId) / enchant()
```

### Cubing.js / Runewords.js
```
Cubing.init()          레시피 구축 (buildRecipes → buildLists)
Cubing.checkItem(unit, result) → bool   Pickit 이 호출. 레시피 재료 여부
Cubing.keepItem(unit)  → bool           Town 이 호출. 정리 시 보존 판정
Cubing.doCubing()      실제 큐브 작업. Town.doChores(shopItems) 경로
Cubing.update() / getCube() / emptyCube() / openCube() / closeCube()
전역: Roll, Recipe, RecipeName

Runewords.init()       Config.Runewords 를 파싱해 리스트 구축
Runewords.checkItem(unit) / keepItem(unit)   Pickit / Town 이 호출
Runewords.makeRunewords()                    Town.doChores 경로
Runewords.getBase / socketItem / update / checkRunewords / getScroll / rerollRunewords
전역: Runeword
```

### CollMap.js
```
getColl(x, y, cacheOnly) / checkColl(unitA, unitB, coll, thickness)
getNearbyRooms(x, y) / addRoom(x, y) / getRoomIndex(x, y, cacheOnly) / coordsInRoom
getRandCoordinate(cX, xmin, xmax, cY, ymin, ymax, factor) / reset()
```

### NTItemParser.dbl
```
전역  NTIP_CheckList     전체 파싱 엔트리
      stringArray        엔트리별 메타 {line, file, string}
      NTIP_QuestItems    퀘스트 아이템 classid 목록 (GetScore 에서 0점)
      NTIP_Lists         {common, tier, merc, qty} 4분류

OpenFile(filepath, notify) → bool
SortLists()                tier/merc/qty 를 점수 내림차순 정렬
Evaluate(item)             common → tier → merc → qty 순으로 EvaluateItem, 첫 truthy result 반환
EvaluateItem(item, list)   → {result, tier, merc, qty, reason, line}
                           result  1 매치 / 0 불일치 / -1 감정 필요
GetScore(item, key)        → Number   key = "Tier" | "Merc"
                           퀘스트 아이템·미감정은 0. 점수가 있어도 부서진 아이템이거나
                           힘·민첩 요구치 미달(Tier 는 내 스탯, Merc 는 Config.MercStat)이면 0
IsBroken(item)             → bool   내구도 0 && 최대 내구도 > 0 && 무한 내구 아님
CheckQuantityOwned(item_type, item_stats, selfGid) → 보유 수량
ParseLineInt(input, info) / IsSyntaxInt(ch) / buildLineStr(...)
```

### OOG.js
```
D2Bot   init / ingame / printToConsole / printToItemLog / updateStatus / updateRuns
        updateChickens / updateDeaths / updateCount / restart / stop / start
        requestGameInfo / requestGame / joinMe / getProfile / setProfile / setTag
        CDKeyInUse / CDKeyDisabled / CDKeyRD / heartBeat / store / retrieve / remove 외
DataFile.getStats() / updateStats(arg, value) / create() / getObj()
ControlAction  click / setText / getText / timeoutDelay / joinChannel / createGame
               clickRealm / loginAccount / makeAccount / findCharacter / getCharacters
               getPosition / loginCharacter / makeCharacter / getGameList
```

`DataFile`에 새로 쓰는 키: `restInfo {count, start}`, `playTime` (D2BotLead), `debugInfo` (ToolsThread), `Merc` (Merc.hire).

### Prototypes.js
```
Unit.getStatEx(id, subid) / getItems(...) / getColor() / getPrefix(id) / getSuffix(id)
Unit.openMenu(addDelay) / startTrade(mode) / buy(shiftBuy, gamble) / sell()
Unit.toCursor() / drop() / castChargedSkill(...)
me.findItem(id, mode, loc, quality) / me.findItems(id, mode, loc)
Array.shuffle() / String.trim()
```

### 클래스 공격 (Attacks/*.js)
```
ClassAttack.doAttack(unit, preattack)  → 0 실패 / 1 성공 / 2 쓸 스킬 없음
                                         clear 가 preattack = (이번 호출 시전 수 % 10 === 0) 으로 호출
ClassAttack.doCast(unit, ...)          실제 시전. 위치 확보는 Attack.setPosition
                                         Barbarian (unit, attackSkill) / Paladin (unit, attackSkill, aura)
                                         그 외 (unit, timedSkill, untimedSkill)
ClassAttack.afterAttack()              공격 후 처리 (Barbarian 은 afterAttack(pickit))

추가 멤버
  Paladin      getHammerPosition(unit)  해머 위치. setPosition 대신 자체 게이트(0x5, DetourPath)로
                                        막힌 SWEEP 대상에 tick.fail = "unreachable"
               reposition(x, y)
  Barbarian    whirlwind(unit) / checkCloseMonsters(range) / findItem(range) / checkCorpse(unit)
               findItem 안에서 Attack.clear(10)
  Necromancer  initCurses() / isCursable(unit) / raiseArmy(loop) / explodeCorpses(unit)
               checkCorpseNearMonster / checkCorpse(unit, revive)   curseRange 25 / armyRange 25
  Assassin     checkTraps(unit) / placeTraps(unit, amount) / whirlwind(unit)   trapRange 20
  Sorceress    Config.CastStatic / StaticList 로 스태틱 선시전
```

`Attack.init()`은 `Config.Wereform` 여부로 `Wereform.js`와 클래스 파일 중 하나를 include한다. D2BS의 include는 이미 include한 파일을 다시 실행하지 않으므로, 레벨업 때 `Attack.init()`을 다시 부르면 처음 보는 파일(46레벨 `Wereform.js`)만 새로 적용된다.

### AutoSmurf.js (동기화 계열)
```
checkRole()                  Team.Leader === me.profile → Leader, Team.Boer === me.profile → Boer
start()                      큐브(0,0)·TP 책(0,2) 슬롯 고정 → 진행도에 맞는 액트로 이동 →
                             preparation() → Town.doChores(true) → 회복포션 슬롯 정리 →
                             (mercLvl) Merc.hire, 실패 시 hireMerc 브로드캐스트 →
                             웨이포인트 활성화 → 대기 오프셋(myX, myY)으로 이동 →
                             readyCount 브로드캐스트 → teamReady 대기(2분 초과 시 quit) →
                             toggle() → 골드 수수
preparation()                잔여 퀘스트템 사용(책·포션·스크롤), MiniShopBot/farmingON/UseMerc 결정,
                             리더 골드 부족(레벨 18+, 5000 미만) 시 giveGold 요청
toggle()                     큐브·피규린·엣센스·열쇠 상태를 팀에 브로드캐스트
okCount(range)               기본 range 20. okCount 를 뿌리고 teamOk 까지 대기, 이어서 teamCount(range)
teamCount(range)             teamCount 를 뿌리고 전원 응답까지 대기
                             둘 다 필드에서는 대기 중 Attack.clear(range) 후 원위치, 120초 초과 시 quit
playerIn(area) / partyAct()
partyLevel(level)            → bool   파티 전원이 level 이상인가 (getParty 30회 재시도)
syncBO(act)                  Team.Boer 없음 / 파티에 24 미만 있음 → 즉시 false.
                             리더가 BOing/BOed 를 뿌리고 BOReady 까지 대기(30초 초과 시 quit)
syncWP(destination, home, oneway) / buffCount(act)
pickGold() / giveGold()
setLifeChicken(value)        Config.LifeChicken 변경 → 캐시 json 재기록 → {lifeChicken} 브로드캐스트
                             Summoner 전투 동안 0 으로 끄고 끝나면 복원
Messaging.sendToList(list, message, mode = 55)    프로필 간 송신. 자기 자신은 제외
```

---

## 6. 호출 관계도

### 6-1. 모듈 의존 (include 기준)

```
default.dbj ─┬─ tools/{json2 / NTItemParser.dbl ── NTItemAlias.dbl}
             ├─ tools/OOG
             └─ libs/{Attack Cubing CollMap Config Loader Misc Pickit
                      Pather Precast Prototypes Runewords Storage Town Merc}

ToolsThread / TownChicken / MapHelper ── default.dbj 와 거의 같은 목록 (Merc 제외)
PartyThread ─── json2 / OOG / Config / Misc / Prototypes / Settings
AutoBuildThread  Config / Cubing / Prototypes / Runewords / Town
HeartBeat ───── OOG / json2 / Misc
MapThread ───── json2 / Attack / Pather

Config.js  ─── Settings / Cubing / Prototypes / Runewords / Misc  (+ 런타임 AutoBuild)
AutoBuild.js ─ Settings / Cubing / Prototypes / Runewords / Pickit  (+ 런타임 builds/<빌드>.js)
Pickit.js  ─── tools/NTItemParser.dbl / Storage
Attack.js  ─── (런타임) libs/Attacks/<클래스>.js 또는 libs/Attacks/wereform.js
빌드 템플릿 ── Misc
D2BotLead/Follow ─ json2 / OOG / AutoCreate / Misc / Pather / Config / Settings
D2BotMap ───── json2 / OOG / Misc
```

### 6-2. 함수 단위 호출 관계

**NTIP 소비처**

| 호출부 | 호출 |
|---|---|
| `Pickit.init` | `NTIP.OpenFile` `NTIP.SortLists` |
| `Pickit.checkItem` | `NTIP.Evaluate` |
| `Cubing` | `NTIP.Evaluate` |
| `Town` | `NTIP.GetScore(item, "Tier")` |
| `Misc` (Equip / Grant 계열) | `NTIP.GetScore` `NTIP.Evaluate` |
| `Runewords` | `NTIP.EvaluateItem` `NTIP.ParseLineInt` |

**NTIP → 역방향 의존** — `NTIP.EvaluateItem`은 tier 게이트에서 `Equip.getBodyLoc`, merc 게이트에서 `Grant.getBodyLoc` / `Grant.canEquip`을 호출한다. 파서는 독립 모듈이 아니라 `Misc.js`의 장비 로직에 의존한다.

**Equip / Grant / Merc**

| 함수 | 호출부 |
|---|---|
| `Equip.autoEquip` | `Town.doChores`(2회), `Town.visitTown`(타운 안), `AutoSmurf`(2곳) |
| `Grant.autoEquip` | `Town.doChores`(2회), `Town.visitTown`(타운 안), `Merc.hire`(2곳) |
| `Grant.updateStat` | `ToolsThread` 루프 (유일) |
| `Grant.removeItems` | `Merc.hire` (유일) |
| `Equip.updateTiers` / `Grant.updateTiers` | 빌드 템플릿의 `Update`, `Grant.updateTiers`는 `Town.reviveMerc` `Merc.hire`도 |
| `Merc.hire` | `AutoSmurf.start`(mercLvl), AutoSmurf 액트2 진입(Hell) |
| `Merc` → | `Town.goToTown` / `Town.tasks` / `Grant.*` / `Pickit.pickItems` / `DataFile.*` |

**Attack 계열**

```
AutoSmurf (51곳) ─────────────┐
Pather NodeAction.killMonsters ┼──→ Attack.clear(range, must)
Barbarian.findItem ────────────┘        ├─ 스캔: checkMonster / checkSkipped / skipCheck / hasUsableSkill
                                        │        → tick.monList
                                        ├─ Misc.townCheck (TownCheck)
                                        ├─ ClassAttack.doAttack → doCast
                                        │     ├─→ Attack.setPosition ──┬─→ Pather.useTeleport / moveTo / teleportTo
                                        │     │    (Paladin 해머는     ├─→ Attack.getFireList → checkFire
                                        │     │     getHammerPosition) ├─→ tick.monList 또는 buildMonsterList
                                        │     │                        └─→ Attack.getMonsterCount
                                        │     └─→ Skill.cast → tick.cast = true
                                        └─ 종료: Pickit.pickItems / ClassAttack.afterAttack

Pather.moveTo.safeCheckNode ──→ Attack.buildMonsterList / getFireList / getMonsterCount   (Config.SafeTele)
Pather NodeAction.popChests ──→ Misc.openChests(15) ──→ Misc.openChest / Pickit.pickItems
```

`Attack.getMonsterCount`와 `Attack.buildMonsterList`는 `setPosition`과 `Pather.safeCheckNode` 양쪽이 쓰는 공용 부품이다.

**Cubing / Runewords**

| 함수 | 호출부 |
|---|---|
| `Cubing.checkItem` `Runewords.checkItem` | `Pickit.checkItem` |
| `Cubing.keepItem` `Runewords.keepItem` | `Town.stash`, `Town.ignoredCheck`(clearInventory 경로) |
| `Cubing.doCubing` `Runewords.makeRunewords` | `Town.doChores(true)` |
| `Cubing.update` `Runewords.update` | `Pickit.pickItem` (재료 줍기 후) |

**Config 갱신 경로**

```
AutoBuildThread (레벨업 감지)
   └─ scriptBroadcast({event: "level up"})
         ├─ AutoBuild.levelUpHandler (default.dbj)
         │     → applyConfigUpdates → _cache/config.<profile>.json
         │     → Attack.init()
         └─ Config.init 이 등록한 리스너 (ToolsThread / TownChicken / PartyThread)
               →  캐시 재로드로 Config 동기화

AutoSmurf.setLifeChicken(value)
   ├─ _cache/config.<profile>.json 재기록
   └─ scriptBroadcast({lifeChicken}) → ToolsThread.scriptEvent

AutoSmurf.preparation (mercLvl)
   └─ scriptBroadcast({useMerc, useMercHP, useMercRejuv}) → ToolsThread.scriptEvent
```

---

## 7. 런타임 흐름

### 7-1. 게임 1회 사이클

```
[a1] D2BotLead        게임 생성 → (게임 요청 수신 시) D2Bot.joinMe → 팔로워에게 게임명/비번 전달
[a2~a8] D2BotFollow   D2Bot.requestGame(Team.Leader) → joinInfo → 입장

각 창
  default.dbj  →  초기화 → 스레드 로드 → Loader.init() → AutoSmurf()
                  ├─ ToolsThread   (치킨·포션·핑)
                  ├─ TownChicken   (타운 복귀)
                  ├─ PartyThread   (파티 초대·수락, 이탈 감시)
                  ├─ AutoBuildThread (스탯/스킬)
                  └─ HeartBeat

  AutoSmurf 종료 → default.dbj 복귀
                  MinGameTime 미달 시 타운 대기
                  scriptBroadcast("quit") → ToolsThread 가 게임 종료

[a1] 로비          플레이 시간 누적 → 최소 게임시간 대기 → updateRuns → 휴식 판정 → 다음 게임 생성
```

### 7-2. AutoSmurf 진행 흐름

```
checkRole()
okCount()                     입장 직후 팀 집결 (120초 초과 시 quit)
start()                       타운 정비 + 팀 준비 동기화

액트 1   !getQuest(7,0)         goToTown(1) → syncBO → den
                                Normal: blood → cain → trist → outer → smith → jail → inner → cathedral
                                NM/Hell: cain
                                → andy
액트 2   !getQuest(15,0)        goToTown(2), Hell 이면 Merc.hire
                                리더: syncBO → cube/amulet/summoner/tombs/staff/cubeStaff/radament/duriel
                                팔로워: 브로드캐스트 플래그를 보고 해당 함수 실행 (250ms 대기 루프)
액트 3   !getQuest(23,0)        리더: figurine → travel(6) → tome → eye·heart·brain → travincal
                                     → figurine → travel(7) → mephisto
                                팔로워: travincal / figurine / mephisto / takeRedPortal / syncBO 플래그 대기
                                (주요 단계 전에 리더가 syncBO 브로드캐스트)
액트 4   getQuest(23,0)         리더: partyAct 로 최저 타운 확인, 3막이면 takeRedPortal → mephisto(true)
                                → okCount → syncBO → travel(8) → izual → diablo → changeAct(5)
액트 5   getQuest(28,0)         syncBO → travel(9) → shenk → barbs(Normal) → anya → ancients
바알     getQuest(39,0)         syncBO → travel(10) → baal

소 레벨  Normal/NM && quest 40  farmingCows
파밍     quest 39 완료 후
  Normal               farmingAbaddon / farmingPOA / farmingInfernal
  Nightmare            !hireMerc 이면 위와 같음
  Hell                 keyD || 파티 전원 95+ → farmingNihlathak
                       keyH             → farmingSummoner
                       farmingON || keyT → farmingCountess
                       farmingON        → farmingPit
                       farmingON || essA → farmingAndy
                       farmingON && 파티 전원 90+ → farmingCows
                       farmingON || essM → farmingMephisto
  공통                  runDiablo 0 && (Normal 파티에 37 미만 있음 / NM 파티에 67 미만 있음 / Hell) → diablo

"Script ended" 출력 후 return
```

리더는 이동·퀘스트 개시를 주도하고, 팔로워는 `copydata` 플래그를 받아 대응 함수를 실행하는 구조다. 팀 이탈 감시는 PartyThread가 맡는다(4-2절).

AutoSmurf 퀘스트·파밍 함수 목록: `den`(내부 `clearDen`) `blood` `cain` `trist` `outer` `smith` `malus` `jail` `inner` `cathedral` `andy` / `cube` `amulet` `summoner` `tombs` `staff` `cubeStaff` `placeStaff` `radament` `duriel` / `figurine` `tome` `eye` `heart` `brain` `travincal` `cubeFlail` `equipFlail` `placeFlail` `offEquip` `mephisto` / `izual` `diablo`(`getLayout` `initLayout` `openSeal` `getBoss` `seisSeal` `infectorSeal` `vizierSeal` `diabloPrep` `followPath`) / `shenk` `barbs` `anya` `ancients` `baal`(`preattack` `checkHydra`) / `farmingCountess` `farmingPit` `farmingAndy` `farmingCows`(내부 `buildCowRooms` `getDriverName` `getDriverUnit` `followDriver` `clearCowLevel`) `farmingSummoner` `farmingMephisto` `farmingAbaddon` `farmingPOA` `farmingInfernal` `farmingNihlathak` / 이동 보조 `travel` `clearToExit` `changeAct` `clickWP` `getQuestItem`

### 7-3. 전투 1회 사이클

세부: `attack_design.md` 4절, `attack_flow.md` 1절

```
Attack.clear(range, must)
  [입구]  range 검증 / AttackSkill 검증 / 스킬 보유 검사 / 박스면 range 0 / MUST 대기 창
  [틱 반복]
   0. 사망 → false / 소 레벨 카우킹 → false / TownCheck
   1. 스캔     getUnit 1회 → tick.monList. 새 유닛은 must 매칭 → MUST, range·위험 반경 안 → SWEEP
               (checkSkipped / skipCheck / hasUsableSkill 로 1단 제외)
   2. 정리     소탕 기준점 갱신, 죽거나 벗어난 대상 제거, 시야 잃은 MUST 위치 기억
   3. 대상 없음 시야 잃은 MUST 탐색(3회) / MUST 대기 창이면 대기 / 그 외 종료
   4. 선정     거리순. 단 leashRange 이상 멀어진 MUST 가 있으면 그 MUST
               카오스 StormCaster(306) 0x4 차단 SWEEP 은 버림
   5. 공격     tick 초기화 → ClassAttack.doAttack(대상, 시전수 % 10 === 0)
                 └ doCast → Attack.setPosition → Skill.cast
   6. 평가     2 → SWEEP 버림 / MUST 뒤로(deferred)
               tick.fail "unreachable" → SWEEP 버림
               실패 5회 → SWEEP 버림 / 시전 없는 틱 5회 연속 → SWEEP 버림
               5시전 동안 HP 감소 20% 미만 → SWEEP 버림 (NoSkipArea 제외)
  [출구]  실제 시전 ≥ 1 → Pickit.pickItems → ClassAttack.afterAttack → true
          상자는 열지 않는다 (Pather.NodeAction.popChests 담당)
```

| 대상 등급 | 출처 | 포기 |
|---|---|---|
| MUST | `must` 매칭 | 없음. 사망 또는 시야 상실 후 탐색 포기까지 |
| SWEEP | 기준점에서 `range` 안 | 조건 충족 시 버림 (이번 호출 동안 재진입 불가) |
| SWEEP (위험) | MUST 가 있을 때 내 주변 `dangerRange` 안 | SWEEP 과 같음 |

`setPosition`의 두 모드

| 모드 | 조건 | 동작 |
|---|---|---|
| 접근 | 사거리 밖 또는 시야 차단 | 대상 주변 링 후보(바깥 링 → 작은 각도 순). 앞쪽 직선 > 앞쪽 우회 > 뒤쪽 직선 > 뒤쪽 우회. 불장판 배제, 몹 수는 동점일 때만 비교. SWEEP 대상은 0x4 가시성·DetourPath 제한 |
| 회피 | 이동 불필요 && Dodge 조건 충족 (5절) | 물러나는 쪽(정면 반)에서 현재보다 적은 자리 중 몹 수 최소, 없으면 반대편에서 최소 (261001) |

텔레포트 사용 시 `Pather.teleDistance`(35) 이내 후보는 teleportTo, 넘으면 moveTo(여러 번 텔레)로 간다 (260930 maxTeleDistance 삭제).

### 7-4. 타운 사이클

```
진입 경로 1  AutoSmurf 가 직접 Town.doChores(true) (start 등)
진입 경로 2  Misc.townCheck() 가 벨트 포션 부족 감지 (Attack.clear, Pather.moveTo 에서 호출)
             → scriptBroadcast("townCheck")
             → TownChicken 이 default.dbj 를 pause 하고 Town.visitTown()
진입 경로 3  Config.TownHP / TownMP 미달 → TownChicken 직접 발동
진입 경로 4  Pickit.pickItems 공간 부족 && canMakeRoom → Town.visitTown()

Town.doChores
  (shopItems)  gamble → (UseKeys) buyKeys → reviveMerc → Equip.autoEquip → Grant.autoEquip
               → Cubing.doCubing → Runewords.makeRunewords
  공통          clearBelt → heal → identify → clearInventory → fillTome
               → buyPotions → repair → Pickit.pickItems → autoEquip ×2 → stash
```

열쇠 부족은 타운 복귀 이유가 아니다. 열쇠 구매·보관은 `Config.UseKeys`(기본 false)가 켜져 있을 때만 한다.

---

## 8. 아이템 평가 흐름

### 8-1. NIP 로딩

```
Config.PickitFiles = ["X.nip", "Y.nip", "Z.nip", "V.nip"]
        +  AutoBuild.initialize 가 빌드코드 NIP 을 런타임 push (예: "S.SFFW.nip")
        Pickit.init 이 "nips/" 를 앞에 붙여 NTIP.OpenFile 에 넘긴다

Pickit.init(notify)
  └─ NTIP.OpenFile 로 한 줄씩 파싱
        룰에 Tier/Merc/Qty 키 없음  →  NTIP_Lists.common
        Tier 키 있음                →  NTIP_Lists.tier
        Merc 키 있음                →  NTIP_Lists.merc
        Qty  키 있음                →  NTIP_Lists.qty
  └─ NTIP.SortLists()  각 리스트를 점수 내림차순 정렬
```

| NIP | 성격 (규칙 표본 기준) |
|---|---|
| `X.nip` | 공용 장비 tier 공식(투구·갑옷 등), 포션, 일부 수량 제한 규칙 |
| `Y.nip` | 크래프트·룬워드 소재 등 대량 규칙 |
| `Z.nip` | 고정 유니크·룬워드 완성품 (`[tiered] == 0` 조건 위주) |
| `V.nip` | 용병 무기(`[merc]` 점수), 룬워드 베이스 폴암 |
| 빌드코드 NIP | 해당 빌드 전용 장비 규칙 |

### 8-2. 평가 순서

```
Pickit.checkItem(unit)
 ├─ classid 549 (호라드릭 큐브)          → result 1 (reason "cube")
 ├─ result = NTIP.Evaluate(unit)
 │     common → tier → merc → qty 순으로 EvaluateItem, 첫 매치를 반환
 │     result  1 매치 / 0 불일치 / -1 감정 필요
 ├─ Cubing.checkItem(unit, result.result) → result 2  (큐브 재료, NTIP 결과보다 우선)
 ├─ Runewords.checkItem(unit)             → result 3  (룬워드 베이스/룬)
 ├─ NTIP 불일치 && me.gold < Config.LowGold && 칸당 가치 기준 충족 → result 4 (판매용)
 │     레벨 구간별 칸당 가치: <10: 10 / <20: 50 / <30: 200 / <40: 500 / <50: 1000
 │                            <60: 2000 / <70: 3000 / <80: 4000 / 80+: 5000
 └─ 그 외 NTIP 결과
```

`EvaluateItem`의 게이트 순서

| 게이트 | 내용 |
|---|---|
| tiered | `Config.Tiered` 또는 `Config.TieredGear[...]`로 규칙 활성 여부 판정 |
| 속성 | `[name] [type] [quality] [flag]` 등 속성 조건 평가 |
| 미감정 | 스탯 조건이 있는데 미감정이면 즉시 `result -1` |
| 스탯 | 스탯 조건 평가 |
| hold | 홀드 파트가 있으면 `CheckQuantityOwned`로 보유 수량 비교 |
| tier | `Equip.getBodyLoc` → 부서진 아이템 제외 → `Config.TierNow[...]`의 tier/str/dex 비교 |
| merc | `Config.UseMerc` 가드 → `Grant.getBodyLoc` → 부서진 아이템 제외 → `Config.TierMerc[...]` 비교 + `Grant.canEquip` |
| qty | `CheckQuantityOwned`가 규칙 수량 이상이면 탈락 |

### 8-3. 장착 · 보관 흐름

```
Pickit.pickItem  →  줍기 성공
   ├─ result 1 (NTIP)      →  로그 (tier·merc·큐브·피규린 제외) → Town 에서 감정 → Equip/Grant.autoEquip 또는 stash
   ├─ result 2 (Cubing)    →  Cubing.update → Cubing.doCubing 에서 소비
   ├─ result 3 (Runeword)  →  Runewords.update → Runewords.makeRunewords 에서 소비
   └─ result 4 (판매용)     →  Town.clearInventory 에서 매각

Equip.autoEquip   NTIP.GetScore(item, "Tier") 내림차순
                  현재 장착품 tier 보다 높으면 교체 → Config.TierNow 갱신
Grant.autoEquip   NTIP.GetScore(item, "Merc") 기준. 대상은 용병 → Config.TierMerc 갱신
Town.stash        canStash 통과 후 Cubing.keepItem / Runewords.keepItem 로 보존 대상 확인 후 격납
```

---

## 9. Config 키 → 소비처

빌드 템플릿의 `Update` 함수가 레벨별로 덮어쓰는 키는 소비처와 무관하게 모두 갱신 대상이다. 아래는 코드에서 실제로 읽는 위치다.

| 키 | 소비처 |
|---|---|
| `PickitFiles` | `Pickit.init`, `AutoBuild.initialize`(push) |
| `OpenChests` | `Pather.NodeAction.popChests`, `Misc.openChests`(2 = 전체 컨테이너 목록) |
| `UseKeys` | `Town.doChores`(buyKeys) / `checkKeys` / `ignoredCheck` |
| `ScanShrines` `UseWells` | `Pather.NodeAction`, `Misc.scanShrines` |
| `NoSkipArea` `DetourPath` | `Attack.clear` / `setPosition`, `Paladin.getHammerPosition` |
| `SafeTele{Enabled Range Angle Step Min Skip}` (261001 Count 삭제) | `Pather.moveTo`의 `safeCheckNode` |
| `Dodge{Enabled Range MinSkillRange}` | `Attack.setPosition`. `Enabled`는 `AutoSmurf.duriel` 안(탈라샤 무덤 오리피스 박스 정리 동안)에서 잠시 끄고 다시 켬. 포탈 집결 직후 붙은 몹부터 정리하려는 것 (260930 HP·Step·Max·Count 삭제). 261002: War Cry·Shock Wave·Armageddon은 직업 파일 게이트로 회피 없음 |
| `Gear` `Tiered` `TieredGear` `TierGoal` `TierNow` | `NTIP.EvaluateItem` / `GetScore`, `Equip` 계열, `AutoSmurf.preparation`(`Tiered`) |
| `TierMerc` `MercStat` | `NTIP` merc 게이트·`GetScore`, `Grant`, `ToolsThread` |
| `MercSkill` | `AutoSmurf` → `Merc.hire` |
| `UseMerc` `UseMercHP` `UseMercRejuv` `MercChicken` | `ToolsThread`, `Town`, `NTIP` merc 게이트, `AutoSmurf.preparation`(설정) |
| `MercWatch` | `Town`, 클래스 공격 파일 |
| `MercMinGold` | `Town.reviveMerc` |
| `MinGameTime` `MaxGameTime` | `default.dbj` |
| `LifeChicken` | `ToolsThread`, `default.dbj`(사망 판정), `AutoSmurf.setLifeChicken` |
| `ManaChicken` `IronGolemChicken` | `ToolsThread` |
| `TownHP` `TownMP` | `TownChicken` |
| `TownCheck` | `Misc.townCheck`, `Pather.moveTo`, `Attack.clear` |
| `UseHP` `UseMP` `UseRejuvHP` `UseRejuvMP` | `ToolsThread` |
| `HealStatus` `HealHP` `HealMP` | `Town.needHealing` |
| `LowGold` `StashGold` | `Pickit.checkItem`, `Town`, `AutoSmurf.giveGold` |
| `Stash` `Inventory` `Cube` | `Storage` 격자 마스크 비교 (`Town`, `Pickit`, `Cubing`) |
| `HPBuffer` `MPBuffer` `RejuvBuffer` `BeltColumn` `MinColumn` | `Town.buyPotions` / `checkColumns`, `Misc.townCheck`, `Pickit` |
| `PingQuit` | `ToolsThread.checkPing` → `scriptBroadcast("pingquit")` → `D2BotLead` |
| `Gamble` `GambleItems` `GambleGoldStart` `GambleGoldStop` | `Town.gamble` / `needGamble` |
| `MiniShopBot` `RepairPercent` | `Town.shopItems` / `repair`, `AutoSmurf.preparation`(설정) |
| `MakeRoom` | `Pickit.canMakeRoom` |
| `FCR` `FHR` `FBR` `IAS` | `ToolsThread`의 `Packet.changeStat` |
| `PacketCasting` `PacketShopping` | `Pather.teleportTo`, `Misc`, `Prototypes`, `Town` 상점 경로 |
| `AutoEquip` | `Equip.autoEquip`, `Grant.autoEquip`, `ToolsThread` |
| `AutoBuild{Enabled Verbose DebugMode}` | `Config.init`, `AutoBuild`, `AutoBuildThread` |
| `SkipLogging` `Debug` `ItemInfo` `ItemInfoQuality` `Log*` | `Misc.logItem` / `itemLogger`, `Cubing`(`LogCubingInfo`) |
| `LogExperience` | `ToolsThread` → `Experience.log` |
| `Cubing` `Recipes` | `Cubing.init` / `buildRecipes` |
| `MakeRunewords` `Runewords` | `Runewords.init` / `makeRunewords` |
| `PrimarySlot` `AttackSkill` `LowManaSkill` `CustomAttack` | `Attack`, `ClassAttack`, `Misc`(Skill) |
| `SkipEnchant` `SkipImmune` `SkipAura` `SkipException` | `Attack.skipCheck` |
| `Vigor` `Conviction` `Meditation` `Cleansing` | `Pather.walkTo`(팔라딘 오라), `AutoSmurf` |
| `UseTelekinesis` | `Pickit` |
| 클래스별 키 (`Golem` `Summon*` `UseBoS` `UseFade` `UseVenom` `Curse` `Skeletons` `SkeletonMages` `Revives` `ActiveSummon` `ExplodeCorpses` `PoisonNovaDelay` `ReviveUnstackable` `Traps` `BossTraps` `UseTraps` `AggressiveCloak` `UseCloakofShadows` `CastStatic` `StaticList` `Redemption` `FindItem` `FindItemSwitch` `LightningFuryDelay` `Wereform`) | 해당 `ClassAttack`, `Precast` |

`Scripts = {AutoSmurf: true}`는 `Config.js` 최상단에 있으며 `Loader.loadScripts`가 소비한다. `D2BotLead` / `D2BotFollow`의 `StarterConfig`는 `Config`와 별개인 진입 스크립트 전용 설정이다.

---

## 10. 미사용 · 비활성 · 조건부 항목

호출부 자체가 없는 것(데드)과, 코드는 온전하고 스위치만 꺼진 것(비활성)을 구분한다.

### 10-1. 데드 — 정의만 남고 참조가 없음

| 항목 | 상태 |
|---|---|
| `Packet.addListener` / `removeListener` | 호출부 0곳. `removeListener`는 `addListener`가 등록한 화살표 함수가 아니라 원본 콜백을 받으므로 현재 형태로는 해제가 되지 않는다. `Merc.hire`는 `addEventListener` / `removeEventListener`를 직접 쓴다 |
| `Events.gamePacket` | 등록하는 곳이 없다. 차단 대상: `0x0D` Player Stop(`LifeChicken > 0`일 때), `0x4C`/`0x4D` 스킬 15·25·92 시전 |
| `Loader.scriptName` | 호출부 0곳 |
| `Messaging.sendToProfile` | 호출부 0곳. 프로필 간 송신은 `AutoSmurf`의 `Messaging.sendToList` |
| `Misc.getNearbyPlayerCount` `getPlayerCount` `openChestsInArea` `getShrinesInArea` `spy` `getUIFlags` | 호출부 0곳 (kolbot 원본 헬퍼) |
| `Packet.teleWalk` `moveNPC` | 호출부 0곳 |
| `Sort.presetUnits` `points` `numbers` | 호출부 0곳 |
| `Town.clearScrolls` `checkQuestItems` `needKeys` | 호출부 0곳 |
| `CollMap.getTelePoint` | 호출부 0곳 |
| `Config.BossPriority` | 읽는 곳 없음 |
| `Config.PublicMode` | 빌드 템플릿 13종이 설정하지만 읽는 곳 없음. 파티 초대·수락은 `PartyThread`가 `Team.Leader` 기준으로 한다 |
| `Config.AvoidDolls` | `Paladin.js:82`가 읽지만 `Config.js`에 정의가 없어 항상 undefined |

### 10-2. 비활성 — 코드는 온전하고 스위치만 꺼짐

| 항목 | 스위치 |
|---|---|
| `Config.KeepRunewords` | `Config.js`의 전체 블록이 주석 처리 상태 |
| `Config.UseKeys` | 기본 `false`. 켜면 열쇠 구매·보관 경로가 동작 |
| `Config.Dodge.Enabled` | 기본 `false`. 빌드 템플릿 13종이 레벨 18에서 `true`로 전환 |
| `Config.NoSkipArea` | 기본 `[]`. 지역을 넣으면 해당 지역에서 도달 불가 즉시 버림·HP 스킵·306 스킵·해머 게이트를 하지 않음 (임시, `handoff.md` 4절 1번) |

### 10-3. 조건부 — 구성이 바뀌면 즉시 사용

| 항목 | 조건 |
|---|---|
| `Amazon.js` | 현재 팀에 아마존 프로필 없음. `Attack.init`이 classid로 include하므로 프로필 추가 시 즉시 사용 |
| 빌드 `D.WIND` `S.FIRE` `P.FIST` `S.FONV` `S.LTNG` (.js / .nip) | `Build.getBuildType`의 어느 case에도 매핑돼 있지 않다. 파일만 존재 |
| `S.STFO.nip` / `S.STFW.nip` | 대응하는 빌드 템플릿이 없다 |
| `Wereform.js` | `Config.Wereform`이 설정된 구간에서 클래스 파일 대신 include됨 (`D.FGOM` 레벨 46, `"Werebear"`) |
| `T.nip` | `nips/`에 존재하나 `Config.PickitFiles` 기본값과 빌드코드 NIP 어느 쪽에도 포함되지 않음 |

### 10-4. 기타

| 항목 | 상태 |
|---|---|
| `Misc.trace` 와 `[AC]` `[SP]` trace 줄 | 임시 로그. `//260926 temp` 등 표시. 인게임 검증 뒤 정리 예정 (`handoff.md` 4절 2번) |
| ToolsThread Numpad `1` | 임시 상태 출력 |
| `MapThread` / `MapHelper` / `D2BotMap.dbj` | 맵 확인 전용. 일반 운영 경로에서는 로드되지 않음 |
| 빌드 템플릿의 include | `Misc.js` 1개뿐. 템플릿이 참조하는 것은 `Config.*`, `Team.Leader`, `Equip.updateTiers` / `Grant.updateTiers`이고 `Cubing` `Runewords` `Prototypes`는 include 시점에 이미 `AutoBuild.js` 경로로 로드돼 있다 |
