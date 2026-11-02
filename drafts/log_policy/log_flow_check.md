# 로그 흐름 점검 (261102, main `b69b657`, `log_inventory.md` 기준)

- 표의 줄은 `log_inventory.md`에서 찾은 호출이다. "없음"은 그 목록에 해당 호출이 없다는 뜻이다.
- 확인 범위: 목록 + 아래에 따로 적은 코드 읽기. 실제 게임 로그와 대조하지 않았다.
- 상태 칸(`updateStatus`)과 머리 위 글자(`overhead`)는 파일에 남지 않으므로 "파일 없음"으로 본다.

---

## 1. 흐름 단계별 현황

### 1-1. 게임 밖 (클라이언트 시작 ~ 게임 입장)

| 단계 | 리더(D2BotLead) | 팔로워(D2BotFollow) | 콘솔 | 파일에 남는 것 | 빠진 것 |
|---|---|---|---|---|---|
| 클라이언트 시작 | 같음 | 같음 | 없음 | d2bs 로그 엔진 줄(`Engine startup complete`, `Starting D2BotLead.dbj`), print `Recieved Game Info` | 콘솔·공유 파일에 시작 표시 없음 |
| 로그인 | 같음 | 같음 | 실패 때만(`Login error`, `Invalid account`, `Realm down`, `CDKey in use` …) | 정상: print `getLocation()` 숫자만(`OOG.js:813`), 상태 칸 `Logging In` | 정상 로그인 표시 없음 |
| 방 만들기 | print `Creating Game: 이름`(`OOG.js:686`) | - | 실패 때만 `Create game failed - wait` | print | 콘솔에 없음 |
| 팀 대기 | `Team wait: 이름 - wait`(콘솔), 휴식 `Rest: N games - wait`(콘솔) | - | 있음 | trace | - |
| 방 입장 | - | print `joining game 이름`(`D2BotFollow.dbj:423`) | 실패 때만(`Join game failed`, `Game not found`, `Game full`) | print | 콘솔에 없음 |
| 게임 입장 확인 | 상태 칸 `[레벨] 게임 이름 시간` | 상태 칸 `Game: 이름` → `[레벨] 게임 이름 시간` | 없음 | trace `=== [게임 이름] ===`(`default.dbj:46`)만 | **콘솔·print에 게임 이름 없음** |

### 1-2. 게임 안: 시작

| 단계 | 리더 | 팔로워 | 콘솔 | print | 빠진 것 |
|---|---|---|---|---|---|
| 지난 게임 사망 | 같음 | 같음 | `You died in last game`(빨강, **다음 게임 시작 때** 찍힘, `default.dbj:69`) | 없음 | 죽은 그 시점·위치는 남지 않음(아래 1-5) |
| 역할 | `I am the Leader` | `I am a Follower` / `Boer` | 없음 | 없음(머리 위 글자만), `SafeTele:` print는 리더만 | 역할이 파일에 없음 |
| 시작 설정 | 같음 | 같음 | 새 캐릭 리더만 `=== START ===` | `hireMerc:`, `MiniShopBot:`, `Tiered:`, `UseMerc:`, `farmingON` | - |
| 시작 퀘스트 아이템 | 같음 | 같음 | `!!! BOOK/POTION/SCROLL !!!` | 있음 | - |

### 1-3. 게임 안: 구간 진행 ↔ 마을 일

| 단계 | 리더 | 팔로워 | 콘솔 | print / trace | 빠진 것 |
|---|---|---|---|---|---|
| 구간 시작 | 모두 | 모두 | 없음 | print·trace `=== [X] ===` (모든 프로필, **시작**) | - |
| 구간 끝 | 콘솔 `=== X ===` (**리더만, 구간 끝**에 찍힘. 예: `den` 2055줄은 함수 끝, `baal` 6189줄은 `bossEnd` 뒤) | 없음 | 리더만 | 없음 | **콘솔 헤더와 print 헤더가 모양은 같은데 뜻이 다름(끝 / 시작)**. 팔로워의 구간 끝은 어디에도 없음 |
| 구간 실패 | 일부 구간만 print `X failed: 이유` | 같음 | 조기 종료면 `quitGame` 줄 | print | 실패 print가 있는 구간: syncBO, cubeFlail, Smith, Malus, Tombs, Travincal, Baal, Cows, Summoner(파밍), Abaddon, POA, Infernal, Nihlathak. **나머지 구간은 목록에 실패 print 없음**(실패하면 어떻게 끝나는지는 함수마다 읽어야 함, 이번에 안 읽음) |
| 팀 맞추기 `okCount` | 모두 | 모두 | 시간 초과면 `Party desynced 1` | **없음**(기다림 시작·끝 기록 없음, 시간 초과 때만 `[Quit]`) | 대기 시작·도착 |
| 팀 맞추기 `teamCount` | 모두 | 모두 | 시간 초과면 `Party desynced 2` | 없음(머리 위 `OK`만) | 같음 |
| 포털 준비 | 머리 위 `tpReady` 16곳 | 머리 위 `Waiting for … TP`, 받은 쪽 `tpReady` | 없음 | 없음 | 포털을 열고 받은 시점이 파일에 없음 |
| 이동 | `travel`: print `Traveling to 지역`, 머리 위 경로·다음 지역 | 같음 | 없음 | print 1줄 | 경로·다음 지역은 머리 위 글자만 |
| 액트 이동 | 머리 위 `changeAct N`, `Checking player in...` | 같음 | 실패면 `changeAct N failed` 조기 종료 | 없음 | 액트 이동 시작·성공 |
| 웨이 | 머리 위 `Getting waypoint...`, `Trying to get the waypoint`, `waypoint retry N` | 같음 | - | 실패 trace `[WP]`, `[getWP]`, `[goWP]` | 정상 웨이 획득 |
| 마을 일(구간 사이) `Town.doChores` | 모두 | 모두 | 없음 | **없음**(시작·끝 기록 없음). 안에서 판매·버림은 아이템 로그, 상점·수리·NPC는 머리 위 글자만 | 마을 일 시작·끝, 수리·물약 구매·용병 부활 |
| 구간 중 마을 다녀오기 `visitTown` | 모두 | 모두 | 없음 | trace `visitTown start by: tick:` / `back tick:` | - (형식만: tick 숫자) |
| TownChicken(마을 확인·치킨) | 모두 | 모두 | 포털 못 열면 `cannot open TP`(quitGame 아님) | print+trace+머리 위 `Town check` / `Town chicken` (3중) | - |
| 용병 | 모두 | 모두 | `[Hired] Level N 스킬` | print `[hire] …`, `Merc matched/unmatched/not found` | 용병 죽음·부활 |
| 장비 교체 | 모두 | 모두 | 없음 | 아이템 로그 `<Equipped>`, `<Granted>`(머리 위 `[Tier N]`) | - |
| 소켓·룬워드·큐브 | 모두 | 모두 | `[Socket]`, `[Runeword]`, `[Reset]`, 큐브 줄 | print | - |
| 레벨 업 | 모두 | 모두 | 없음 | AutoBuild `Level up detected`(꺼져 있음) | **레벨 업 기록 없음**(경험치 줄의 `[Level N]`로만 알 수 있음) |
| 보스 보호 | 모두 | 모두 | 없음 | trace `bossGuard …` | - |

### 1-4. 게임 안: 끝

| 끝 종류 | 콘솔 | print | trace | 비고 |
|---|---|---|---|---|
| 정상 종료 | 없음(규칙) | `Script ended` | `Script ended` | 경험치 줄로 판단 |
| 조기 종료 | `이유 (지역 x,y)` | 없음 | `[Quit] 이유: 상세` | `quitGame` 62곳 |
| 따라 나감 | 없음(규칙) | `party has left: 이름` | 같음 | `PartyThread` |
| 치킨 | `Life/Mana/Iron Golem/Merc Chicken … (지역 x,y)` | **Life만** `[Chicken] Life (hp/max) area:N (x,y)` | `[Quit] …` | Mana·Golem·Merc는 print 없음 |
| 핑 | `High ping N/M (지역)` | 없음 | `[Quit] High ping` | - |
| 오류 | `자리: 메시지 (지역)` | 없음 | `[Error] …` | - |
| 경험치(모든 끝) | `시간 +x% / [Level N] y%` 또는 `no exp시간` | 같은 줄 | 없음 | - |
| 리더 플레이 시간 요약 | 게임 뒤 콘솔 1줄(`addPlayTime`) | - | - | 리더만 |
| 팔로워 | `Game finished: 이름 - stop wait` | - | - | 팔로워만 |

### 1-5. 흐름 밖 사건

| 사건 | 지금 | 빠진 것 |
|---|---|---|
| 죽음 | 그 순간의 기록 없음. 보스 보호 중이면 trace `revive start`. 다음 게임에 `You died in last game` | 죽은 시각·위치·원인 |
| 크래시 | 매니저 콘솔 `Window has unexpectedly exited`(매니저가 찍음), 재시작 후 `Crash: 스크립트 지역 - wait`(콘솔), d2bs 엔진 재시작 줄 | - |
| 클라이언트 종료 | d2bs `D2BS Shutdown complete`만 | 콘솔·공유 파일에 없음 |

---

## 2. 일관성 문제

| # | 내용 | 예 |
|---|---|---|
| 1 | 실패 줄 모양이 섞임 | `X failed: 이유`(구간), `[hire] openMenu failed`, `[teleportTo failed] attempt:`, `[MoveToSlot] … FAILED`, `[SafeTele] … FAILED`, `Tombs: chest not found`, `Merc not found`, `cannot open TP`, `Can't tp from uber trist.` |
| 2 | 지역 표기가 섞임 | 번호(`area:` + `me.area`: Pather 575, 1163, 1333, 1717, 1762, 1779, ToolsThread 598) / 이름(`Pather.getAreaName`) / 붙이지 않음. 새 규칙으로 `(지역 x,y)`를 자동으로 붙이면 줄 안의 `area:`는 겹친다 |
| 3 | 꼬리표 모양이 섞임 | `[Quit]`, `[Error]`, `[hire]`, `[WP]`, `[getWP]`, `[SafeTele]`, `[MM]`, `[DBG]` / 꼬리표 없음 / `X:` 접두 |
| 4 | 같은 사건을 2~3군데에 같은 문장으로 | `Town check`(머리 위+print+trace), `[Runeword]`(머리 위+print+콘솔), `[Hired]`(콘솔+print), 경험치(콘솔+print), 구간 헤더(print+trace) |
| 5 | 같은 모양, 다른 뜻 | 콘솔 `=== X ===`(리더, 구간 끝) / print `=== [X] ===`(모두, 구간 시작) |
| 6 | 같은 종류인데 한쪽만 | 치킨 print가 Life만 있음 |
| 7 | 색 코드가 print에 섞임 | `ÿc4=== [X] ===`, `ÿc8!!! …`, `ÿc1Error …` 등. d2bs 로그 파일에는 글자로 남음(`D2BS_Structure.md`) |
| 8 | 게임 밖 줄 규칙(`사건: 대상 - 처리`)을 안 따르는 것 | `Game not found`(처리 없이 바로 다음 줄에 `Game not found - wait`), `Invalid password: 계정`(처리 없음), `badKey`의 `text`(처리 없음), `Login failed: 캐릭`(처리 없음) |
| 9 | 콘솔 분류에 맞지 않는 줄 | `alkor error`(빨강, 위치 없음), `cannot open TP`(quitGame 아님), `Radament off: …`(quitGame 아님) |
| 10 | print에 오류 줄(지금 규칙상 print에 넣지 않음) | `Config.js` `Error: Config cache not found`, `AutoBuildThread` `Something broke!` / `Error:` / `Stack trace`, `D2Bot*.dbj` 로그인 catch의 `e + getLocation()` |

---

## 3. 리더 / 팔로워 차이 (로그만)

| 리더만 | 팔로워만 |
|---|---|
| 콘솔 구간 끝 헤더 `=== X ===`, `=== FARMING/LEVELING ===`, 새 캐릭 `=== START ===` | `joining game 이름`(print) |
| `Creating Game: 이름`(print), `Team wait`·`Rest`(콘솔) | `Game finished: 이름 - stop wait`(콘솔) |
| 게임 뒤 플레이 시간 요약(콘솔) | `Waiting for Orifice/Duriel TP...`(머리 위) |
| `tpReady`(머리 위), `Going to barbspot`(머리 위), `Helping straggler`(print) | 받은 `tpReady`·`msgLeader`(머리 위) |
| `SafeTele:` 설정 print | - |

팔로워의 콘솔에는 구간 진행이 하나도 남지 않는다. 팔로워 흐름은 print(d2bs 로그)로만 볼 수 있다.
