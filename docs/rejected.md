# 기각 노트

기각한 안만 둔다. 코드 파일·함수 순서로 묶고, 항목마다 무엇을, 이유를 적는다. 코드를 고치는 안을 내기 전에 해당 함수 항목을 확인한다.

## bots/AutoSmurf.js

### this.bossGuard / this.bossEnd
- **261024 퀘스트 게이트로 가드를 건너뛴 프로필이 bossEnd okCount도 건너뛰는 경로를 handoff 항목으로** — 디아(`getQuest(26, 0)`)·바알(`getQuest(40, 0)`)에서 보스가 죽은 뒤 도착한 프로필은 가드가 켜지지 않아 `bossEnd`가 okCount 전에 끝나고, 나머지는 120초 뒤 desync(근거 `log_results.md` 261024 Pz-86). 이유: 사용자 기각.

### this.travel
- **261021 엑트5 travel(9) 진입 조건 확장** — `Leader && !getWaypoint(37)`(118만 봄)에 115·117 웨이도 검사. 이유: 빠진 웨이는 쓰는 시점에 `getWP`가 찍어 오류가 나지 않는다.

### this.malus / this.shenk(Qual-Kehk) / this.anya(Malah)
- **261021 재시도 실패 때 게임을 나가지 않고 그 구간만 건너뛰기** — Malus 30회, Qual-Kehk 5회, Malah 10회 실패 시 `quitGame` 대신 건너뜀. 이유: 사용자 기각. 260930에 leveling 구간(Andy·Tombs)의 quit → return도 하지 않기로 함(Tombs는 return하면 두리엘로 넘어감).

### this.diablo / this.diabloPrep
- **261001 디아 판정 위치 되돌리기** — `Diablo not found`는 봉인 단계(diabloPrep)에서 바로 quit. 예전처럼 그 뒤 `Attack.clear(0, 243)`으로 한 번 더 찾기. 이유: 사용자 결정 "지금대로".

### 오프셋 흩어지기 (261002 오프셋 정리)
- **Pather `moveTo` 안의 대체 좌표** — 이유: setPosition 등 다른 이동까지 바뀐다.
- **`getNearestWalkable`로 흩어질 대체 칸 찾기** — 이유: 걸을 수 있는지만 보고 닿을 수 있는지는 보지 않는다.

## libs/Attack.js

### clear
- **clearList의 대응 단계(각도 변경, 보조 스킬, 걷기 허용)** — 이유: 뒤로 보내기와 flash로 대부분 대체.
- **스킬 미보유 시 이전 레벨 스킬로 대체** — 이유: 도움이 안 됨(사용자).
- **스킬 미보유를 리더에게 통보해 팀 정지** — 이유: 실시간 수신 경로가 추가로 필요. 반복은 60분 10게임 제한으로 충분.
- **부활·소환형(샤먼) 우선** — 보류(옛 `handoff.md` 1-3). 무리 속 파고들기, MUST와 충돌, 근접은 사실상 무효. 261022 범위를 노말 액트 1 Fallen Shaman으로 좁혀 진행 결정(`handoff.md` 2-11).
- **261022 샤먼 우선을 "지금 자리에서 칠 수 있을 때"(거리 15 이하·시야)로 제한하는 변형** — 근접 캐릭 영향을 줄이려는 Claude 제안. 이유: 사용자 불채택.
- **MUST 시간 한도(30초)** — 이유: 못 죽이면 진행 불가인 대상이라 계속 공격이 맞다.
- **보스 id를 하나의 배열로 전 호출부 통일** — 이유: 얻는 것이 적고, 의도치 않은 MUST가 생길 수 있음.
- **must 박스+id 조합** — 이유: 쓸 곳이 없음.
- **소탕 범위를 "나 기준"으로** — 이유: 추적할수록 범위가 따라와 무한 추적.
- **clear의 사전 스킵 게이트(벽 뒤 몹, Angle ±90°/360°, Detour)** — S37~260928 사이 도입·제거를 반복했다. 이유: 이동 필요 여부를 아는 곳은 setPosition뿐이라 그쪽 접근 판정으로 옮김(`code/Attack.md` clear 260928).
- **HP skip에 보스 포함(S57)** — 이유: MUST는 어떤 스킵으로도 버리지 않는다. HP skip은 SWEEP만.
- **clearList refresh(목록 교체)** — 이유: 버린 몹이 다시 들어와 무한 루프. 폐지하고 매 틱 합류 스캔.

### setPosition
- **261001 setPosition 자리 기억** — 이유: 탈락(검토 결과 이득 없음).
- **접근 시 위협 최소 자리 우선** — 이유: 접근은 짧게, 안전은 다음 틱 회피가 맡음.
- **텔레 캐릭 걷기 폴백** — 이유: 텔레 실패 원인(시야, 착지)은 걷기로도 해결 안 됨. 거리 초과만 moveTo(여러 번 텔레).
- **회피 "몹 없는 자리(0) 무조건 우선"** — 이유: 순서와 무관하게 먼 자리를 뽑아 몹을 관통. 261001 채택한 "최소"는 구역 순서를 지킨다.
- **회피 경로상 몹 관통 검사** — 이유: 불필요(사용자).
- **이동 비용 가중치** — 이유: 후보가 같은 링 위라 거리 차이의 실익이 작다.
- **틱당 setPosition 1회 제한** — 이유: 저주·Static은 호출부가 사거리 밖일 때만 부른다. 진동 없음.
- **`Dodge.Radius` 분리(260930 당시)** — 이유: 그때 사용자 의도는 한 값으로 두 역할. 261008에 사용자가 `Range`/`Move`로 나눔.
- **260930 회피 링 안쪽 추가** — 이유: 막다른 곳에서 반대편 전환을 한 번 늦출 뿐.
- **261003 걷기 도착 minDist 2** — 이유: R − 2 감지에 걸려 다시 회피(진동). 261008에 사용자가 3으로 바꿈.

## libs/Attacks/*.js

### doAttack 기준 거리 (261003)
- **A안: 빌드 자리 기준으로 모든 몹에 같은 거리** — 이유: 면역 몹에 못 쓰는 스킬 거리까지 붙어 위험하다. 채택은 B안(면역 몹은 맞을 수 있는 스킬 거리에 선다).

### Barbarian.js War Cry (261002)
- **사거리를 5로 낮추고 회피 유지(B안)** — 이유: 그때 워크라이 상태 그대로라 버벅임이 남음.
- **`Dodge.Enabled = false`로 회피 끄기** — 이유: 다른 스킬에도 걸리고 탈라샤 무덤 토글이 무조건 true로 되돌림.
- **`MinSkillRange` 비교를 `>`로** — 이유: 정확히 5인 모든 스킬(Twister·Tornado 포함)에 걸림.

### Wereform.js 쇼크웨이브 경로 (261002)
- **121 중 인간 상태 쇼크웨이브 경로 수정** — 121 중이면 untimed(쇼크웨이브)로 가는데 앞의 `shapeShift`가 121에 막혀 2초 × 3 헛시도 뒤 인간 상태로 시도. 이유: 허리케인 차단·아마게돈 가드로 원인 대부분이 없어져 고치지 않음.

## builds/*.js

### 18레벨 이후 `LowManaSkill = [-1, -1]`
- **대체 공격 넣기** — 이유: 설계 의도(마나가 없으면 기다린다). 결함 아님.

### TownHP / LifeChicken
- **261021 TownHP 40 / LifeChicken 35 간격 조정** — 이유: 사용자 기각.

## libs/Pather.js

### NodeAction.go
- **261001 `prevNode` 주석 규칙** — 이유: 기각·보류(261001 Pather 검토).

### moveTo
- **261001 죽은 코드 정리** — `moveTo`의 빈 `if (!cleared)` 블록, `teleportTo`의 쓰이지 않는 `MainLoop:` 레이블, `goWP`의 쓰이지 않는 `j`·`wp` 선언, `PathDebug.coordsInPath`(호출 0곳, 원본에도 있음), `moveTo` 좌표 없음 분기의 `errorReport //260922 temp`. 지워도 동작 영향은 없다. 이유: 사용자 기각·보류(261001).

### moveTo safeCheckNode (SafeTele)
- **261001 SafeTele 후보에 나→후보 0x4 시야 검사** — 이유: 0x4는 SafeTele와 연관 없음(사용자).
- **261001 clearPath true 이동에서 SafeTele 끄기** — 끄면 중간 노드에 그대로 착지해 모든 노드에서 clear·상자를 한다. 이유: 결함 근거가 없고 "안전하게 착지"와 "경로 위 무리를 빠짐없이 치기" 중 방침 문제라 지금대로(재검토 뒤 사용자 기각).

### useUnit
- **261022 첫 클릭 전 유닛과 3칸 미만이면 물러난 뒤 클릭** — 이유: 주원인을 클릭 앞 딜레이로 보고, 첫 클릭 실패 빈도를 그대로 보기 위해(사용자 철회).

### getWP
- **261022 `[getWP] waypoint unit not found` 줄에 웨이 프리셋 좌표·거리 추가(옛 handoff 2-6)** — 목적은 "웨이 앞에 못 감(> 10)"과 "갔는데 유닛 조회 실패(≤ 10)"를 가르는 것. 이유: 내 위치는 `Misc.trace`가 이미 붙이고, `goWP` while은 프리셋 10칸 안이거나 10회 뒤 `[goWP] Failed` trace로만 끝나므로 실패 줄이 없으면 코드상 ≤ 10(Pz-49는 `going to nearest WP`로 프리셋 찾음도 확인). 남는 "프리셋 못 찾음"은 d2bs 로그의 `going to nearest WP` 유무로 가려진다. 판정이 나와도 다음 할 일이 바뀌지 않는다(Claude 검토, 사용자 수용 261022).

### journeyTo
- **261001 journeyTo throw 방어** — 이유: 기각·보류.

## libs/Pickit.js

### pickItems (gid 줍기)
- **261003 gid 방식 줍기(itemaction 리스너 + `gidList`) — 다시 도입하지 않음.** 도입(PR #36) 뒤 첫 3게임 안에 세 프로필의 메인 스크립트가 `too much recursion`(`itemEvent` 안)으로 죽어 원복. 원인(D2BS 소스): 리스너는 메인 스크립트 스택 위에서 끼어들어 돌고 재진입 방지가 없으며 스택 한도가 50,000바이트라, 아이템 이벤트가 몰리는 곳(드롭·줍기·상점)에서 넘친다.
  - 검토한 해결안(채택 안 함): D2BS 수정(재진입 방지·스택 한도 상향, 재빌드 필요), clear 싸움 구간에만 리스너 켜기(위험을 줄일 뿐 없애지 못함), 주기적 `getUnit` 훑기(비용), 마을에서만 끄기(필드 건을 못 막음).

## libs/Misc.js

### openChest (Countess 상자)
- **261001 Countess 탑 5층 상자 열기** — 프리셋 580 자리의 classid 371 `ForgottenTowerChest`는 OperateFn 0·Selectable 0인 퀘스트 소품이다(최초 퀘스트 완료 때 한 번 열리는 연출). 패킷으로 상호작용하면 서버 assert에 걸릴 수 있다(추정). 이유: 열지 않음, 원본의 좌표(12526, 12565) 막기 유지(여는 코드 `7971b20`은 `61e4e1b`로 되돌림).

### townCheck
- **261021 TownCheck를 TownChicken으로 옮기기** — 이유: 사용자 기각. 채택은 default.dbj면 `visitTown` 직접.

### trace 위치 (`Pather.getAreaName`)
- **261021 Strict Warning `areas[area]`(입장 직후 trace) 고치기** — 이유: 치명적이지 않음.

## libs/Town.js

### repair
- **261001 shopItems 방문에 골드 검사** — 노멀 2막 이상 `doChores(true)`면 골드와 관계없이 수리 NPC에 가서 벨트를 훑는다. 이유: 사용자 결정 "그대로 둠"(살 수 있는지는 도착 뒤 `shopItems`에서 본다).

### getCorpse
- **261001 `Failed to get corpse, stopping.`을 로그 규칙에 맞추기** — 30초 넘게 못 주우면 빨간 콘솔 + `D2Bot.stop()`, trace·위치 없음. 이유: 발생한 적 없음(메모만). 261004에 보스 보호 회수 경로(`getCorpse(true)`)만 정지 대신 퇴장으로 바꿈.

### moveToSpot
- **261001 `alkor error`를 `Misc.quitGame`으로** — 알코어 자리 이동이 90초 넘고 알코어가 안 보일 때만 `quit()` 직접 호출. 이유: 발현 없음(메모만).

### socketGems
- **261022 아이템 작업 콘솔 줄을 `[종류] 공식 -> 베이스`로 통일**(룬워드·리셋·큐빙·젬드) — 이유: 사용자 기각(원안 유지). 큐빙 `[Socket]`·`[Rune]`·`[Token Of Absolution]`은 공식 이름이 없어 일부 줄만 화살표 모양이 되고, `CLAUDE.md` 4절 "진행 요약은 기존대로"와도 부딪힌다. 젬드는 기존 형식 `# [Gem] 보석 베이스 (n/m)`.

## threads/ToolsThread.js

### togglePause
- **261021 Pause 키를 default 기준으로 전부 같게 토글** — 이유: 수동 Pause 없이는 꼬일 경로가 없다.

## threads/TownChicken.js
- **261021 TownChicken을 ToolsThread로 이관** — 이유: 사용자 기각. 261013·261020 로그에서 TownChicken을 끄면 HP 마을행 146건 중 도착한 95건(65%)이 전투에 남는다(`log_results.md`).

## tools/OOG.js

### printToConsole
- **261022 콘솔 줄의 print 색을 콘솔 색과 맞춤(옛 handoff 2-3)** — `print("[console] " + msg)`에 색 번호에 맞는 `ÿc` 코드를 붙이는 안(대응표는 `D2BS_Structure.md` OOG.js). 이유: 색이 쓸모 있는 곳은 게임 화면 콘솔뿐이고, 같은 줄은 매니저 콘솔(색)·trace에 이미 있으며 줄 종류는 글자로 구분된다. d2bs 로그 파일에는 코드가 글자로 남아 군더더기가 된다(사용자 기각).

## D2BotLead.dbj / D2BotFollow.dbj (게임 밖)
- **261001 로그인 대기 창 무한 대기 처리** — 내장 `login()`(D2BS 엔진) 안이라 손댈 수 없다. JS 교체는 비밀번호를 얻을 방법이 없어 기각, 감시 스레드도 기각. 서버 다운 처리도 기각.
