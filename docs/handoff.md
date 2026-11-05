# 인수인계

새 대화는 이 문서부터 읽는다. 절과 흐름은 `CLAUDE.md` 5절을 따른다.
- 1절 `진행 여부 대기`: 문제(사례) / 확인된 것 / 판단에 필요한 것
- 2절 `구현 검토·수정 대기`: 확인된 것 / 가설 / 구현안(대상 함수, 수정 규모) / 검증 방법
- 3절 `인게임 검증 대기`: 바꾼 것(커밋) / 검증 방법 / 결과(로그 묶음별)
- 흐름: 1 → 2(진행 결정) → 3(수정 완료) → 코드 노트(검증 통과). 3 검증 실패는 실패 사례를 붙여 2로. 기각은 `rejected.md`. 같은 내용은 한 항목에만, 옮길 때 `옛 N-N`. 지운 번호는 다시 쓰지 않는다.

trace·콘솔(`Console.txt`)·아이템 로그는 게임 PC의 `kolbot/_cache/trace/`에, print는 d2bs 로그(`d2bs/logs/d2bs-<프로필>-<날짜>.log`)에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

**마지막으로 분석한 로그**: 261104 묶음(11/03 14:40 ~ 11/04 09:40, 8프로필 각 89게임, 노말 → 헬 파밍, 아시아 서버), `log_results.md` 261104. 코드는 현재 main(사용자 261104: 버전은 따로 확인하지 않는다). 3-64 로그 정책·3-63 피겨린 확정(261104). **다음 사이클**: 3-60·3-65 케이스 미발견으로 계속 본다.

## 1. 진행 여부 대기 (진행할지 말지 검토)

### 1-2. Monastery Gate 동선 H1 (`AutoSmurf.outer`, `Pather.moveToExit`)
- **문제**(사용자 261022): Tamoe Highland(7) → Monastery Gate(26) → Outer Cloister(27)로 갈 때 26의 모양이 특수해서, 가장 짧은 길이 아니라 벽 쪽으로 들어간 뒤 중앙 게이트를 거쳐 27로 넘어간다. 벽 쪽 진입 자리에서 게이트까지 가는 거리를 줄일 수 있는가(게이트로 바로 도착).
- **확인된 것**
  - 261022 로그(`[exit] 26 -> 27`, 2게임 9줄, 모두 통과): 26 → 27 출구 점 `15140,5000`(보정 칸 `15140,5001`) = 게이트 위치(사용자). 26 진입 뒤 위치 약 `15180,5087` = 벽 쪽 진입 자리(사용자). 차이 x 40, y 87(직선 약 96).
  - `[exit]`는 26 안에서 26 → 27 출구를 고를 때만 찍었다. 벽 쪽 진입을 정하는 7 → 26 출구 점은 찍히지 않았다. 옛 가설 "출구 점이 게이트 옆 벽인가"는 시험되지 않았다(틀렸다고 판정된 것 아님). `[exit]`는 261022 삭제.
- **판단에 필요한 것**: 진행할지, 한다면 7 → 26 출구 점·동선을 볼 검증 방법. 사용자 아이디어(결정 아님): "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다."
- **261103 사례**(3-61 리뷰): a2 Pz-7 11/02 18:24:49 Monastery Gate → Outer Cloister — `Pather.moveToExit`의 지나가는 출구 이동(`moveTo` retry 3)이 게이트 자리(15139,5009)에서 목표(15140,4980) 29칸 앞에 멈춤 → `AutoSmurf.outer`가 한 번만 시도하고 `[Quit] moveToExit failed: Monastery Gate -> Outer Cloister`(261021 설계: 옛 `clearToExit` 무한 재시도 대신 1회 시도 뒤 퇴장). 나머지 7명은 Outer Cloister에 있었음. 사용자 아이디어(결정 아님, 261103): 1회 시도 뒤 퇴장보다 재시도를 늘리는 편이 나을 수 있다.

### 1-16. 벨트에 아무 등급 물약이나 들어감 (`Town.clearBelt` 벨트 넣기, 사용자 261025)
- **문제**(사용자): 인벤토리 물약을 벨트에 넣을 때 등급을 보지 않아 낮은 등급도 들어간다. 원래 동작이라 당장 고칠 것은 아니고, 나중에 맞지 않는 등급은 버리기로 넓히면 된다(사용자 261025).
- **확인된 것**(코드)
  - 벨트 넣기(261025 `81d5b43`부터 `clearBelt` 끝, 원본 kolbot은 `clearInventory` 앞)는 물약을 종류(hp·mp·rv)로만 골라 이름이 맞는 열에 넣는다. 등급은 보지 않는다.
  - `buyPotions`는 빈 칸만 채우므로, 낮은 등급이 칸을 차지하면 그 칸에 상점 최고 등급을 사지 않는다. 게임이 벨트 안에서 어떤 등급을 먼저 마시는지는 확인하지 않음.
  - 상점 최고 등급은 `Town.getPotion(npc, type)`(상점 품목을 5 → 1등급 순으로 찾음)으로만 알고, `buyPotions`가 상점을 연 뒤에만 부른다. `clearBelt`는 heal 앞, 상점을 열기 전이다.
  - 등급 기준이 이미 두 곳에 있다: `X.nip` 138~148줄(회복·마나 1등급 노멀 1~2막, 2등급 노멀 1~3막, 3등급 노멀 1~4막, 4·5등급 항상)과 `clearBelt`의 노멀 마나 규칙(2막 mp1, 3막 mp1·mp2를 벨트에서 버림). 두 기준이 한 막씩 어긋난다(nip은 2막에서 mp1, 3막에서 mp2를 줍는다).
- **판단에 필요한 것**: 진행할지. 한다면 기준(① 같은 게임에서 연 상점의 막별 최고 등급을 기록해 씀 — 새 상태 1개, 게임 첫 방문엔 적용 안 됨, ② 막·난이도 고정 표 — `clearBelt` 마나 정리 규칙처럼 제외할 등급을 코드에 적음(상점 데이터 불필요, 사용자 261028), ③ nip 판정 `Pickit.checkItem`이 0이면 넣지 않음 — 새 상태 없음), 넣지 않은 물약을 버릴지, nip과 `clearBelt` 마나 규칙의 어긋남을 어느 쪽으로 맞출지.

### 1-19. 대기 자리에 와 있는데 waitParty 미도착 (`AutoSmurf.waitParty`, 옛 okCount, 사용자 261029)
- **문제(사례)**: 261029 — a3 Chaos Sanctuary 4게임(10/29 04:38·06:09·09:31·12:15, 퇴장한 프로필과 4~27칸, 그 앞 150초 a3 trace 줄 없음, 06:09만 87초 전 `Town check (direct)` 다녀옴), a6 Pz-27 Travincal(10/28 19:41, 120초 전 `Town check (direct)` 다녀온 뒤). 261027에도 같은 모양(Pz-103 a3 Ancient's Way, Pz-117 a6 Catacombs 4).
- **확인된 것**: okCount 보내기는 `sendCopyData` 한 번, 결과 확인·재전송 없음(261027 코드 읽음). 지금 로그로는 보내지 않았는지·유실됐는지·단계가 어긋났는지 모름.
- **결정**(사용자 261029): 한 사이클 더 본다. 그래도 나오면 어디서 빠지는지 검증 방법을 세운다.
- **261030 사례**(91게임, desync 10게임 중 피겨린 Pz-38·무덤 안 Pz-21을 뺀 8게임): 퇴장 순간 빠진 프로필과 퇴장한 프로필의 거리, 그 앞 5분 trace.
  - 마을 다녀오기 관련 3: Pz-55 a6 Travincal 9칸(00:36:15 `Town check (direct)` → 00:36:33 복귀, 그 뒤 2분 20초 trace 없이 거의 제자리), Pz-49 a3 Harrogath 8칸(23:21:03 Pit of Acheron에서 `visitTown start`, `back` 없음), Pz-64 a5 Chaos 16~26칸(상대가 기다린 지 91초 뒤 마을행, 퇴장 6초 전 복귀).
  - 그 밖 5: Pz-25 a6 Harrogath 3칸, Pz-47 a4 Harrogath 4칸, Pz-58 a7 Ancient's Way 9칸, Pz-59 리더 a1 Rogue Encampment 0칸(3분 반 전 Worldstone Chamber `Town check` 뒤 COUNTESS·PIT 정상 진행), Pz-71 a3 Rogue Encampment(퇴장한 둘과 72칸, okCount를 보낸 다른 5명과 같은 자리). 모두 그 앞 5분 trace에 마을 다녀오기 없음.
- **261031 사례**(95게임, desync 10게임 중 피겨린 Pz-26 제외): Chaos a3 Pz-73(27칸)·Pz-86(16~23칸, 퇴장 1분 안 `Town check (direct)` 2번)·Pz-89(23칸, 51초 전 Town check), a8 Pz-78(37칸, 48초 전 Town check). Ancient's Way Pz-66 a3 12칸·Pz-77 a7 9칸(게임 시작 2~3분, 앞 trace 없음). Pz-81 a4 Throne에 남음(리더 Worldstone Chamber, 5분 안 Town chicken 2·Town check 3, 마지막 복귀 13초 뒤 퇴장). Pz-1 a6·a7 Burial Grounds에 못 들어가고 Cold Plains(3분 trace 없음). Pz-10 a8 Catacombs 2층 도착 자리 근처 3분 반(퇴장한 a3과 271칸).
- **261102 사례**(93게임, desync 9게임): Pz-10 a4가 Catacombs 2층에 남음(퇴장한 a6은 3층). Pz-35 a8 Harrogath 4칸(Pit of Acheron `visitTown start`, `back` 없음). Pz-39 a8(Chaos에서 Town check 2번, 퇴장 때 마을). Pz-44 POA: a1(리더)·a4·a8이 같은 자리(12640,7595)에서 180초 동안 목표에 못 닿음(`POA failed: moveTo`, 경로 실패 줄 없음), 나머지 5명은 먼저 INFERNAL로 넘어가 a5가 Harrogath에서 퇴장. Pz-54 a1 Chaos 약 34칸(46초 전 Town check). Pz-59 a7 Ancient's Way 12칸·Pz-89 a7 8칸(게임 시작 2분 반, 앞 trace 없음). Pz-67 a6 Rogue Encampment 66칸. Pz-92 a8 Chaos: 3분 안 Town check 3번 뒤 a8 자신이 `missing(okCount):  teamOk true`로 퇴장(다 모인 뒤 같은 회차에서 120초 초과 검사, 사용자 261102: 정상).
- **261101 사례**(63게임, desync 5게임): Pz-33 a6 Pit of Acheron에 남음(2분 안 Town chicken 2·Town check 1, 마지막 복귀 45초 뒤 퇴장, 리더는 Harrogath). Pz-38 a3 Ancient's Way 7~15칸(게임 시작 2분 반, 앞 trace 없음). Pz-43 a6 퇴장 12초 전 Catacombs 4층에서 `Town check (direct)` → Rogue Encampment에서 퇴장. Pz-52 a3 Harrogath 1칸(10:03:23 Pit of Acheron `visitTown start`, `back` 없음).
- **261103 사례**(90게임, desync 10게임): 3-61 `[moveTo] retry … over` trace로 빠진 프로필이 마을에서 같은 목표로 `moveTo`(retry 3)를 약 13초마다 되풀이하며 위치가 그대로(이동하지 못함)인 것이 보임, 3게임 — Pz-84 a2 Rogue Encampment(목표 4390,5630, 4452,5604에서 거리 67, 08:16:01~08:17:37 8회, 퇴장한 리더와 1칸), Pz-85 a4 Rogue Encampment(4860,4575, 4921,4553에서 65, 08:23:50~08:25:10 7회), Pz-49 a1(리더) Harrogath(5129,5061, 5071,5022에서 70, 01:24:20~01:24:57 4회). 세 건 모두 구간(ANDY·MEPHISTO·ABADDON) 시작 27~30초 뒤부터, a4는 직전 08:23:37 `equipped: [Head] 16`. 호출 자리(`Town.doChores` 안 이동으로 추정)와 못 움직인 원인은 모름(줄에 호출부 없음). 비슷한 상태 진단(퇴장 줄 상태·`Town.move` 실패 trace)은 `rejected.md` 261028 기각. 그 밖: 피겨린 Pz-46(2-29), Ancient's Way 게임 시작 2분 반 Pz-28 a6·Pz-56 a7·Pz-89 a3(앞 trace 없음), Chaos Pz-69·Pz-72 a3, Pz-76 a1·a5·a8(a5·a8은 퇴장 2~24초 전 마을 다녀옴), Pz-62 a8 Den of Evil(퇴장 2분 전 마을 다녀옴).
- **261104 사례**(89게임, desync 6게임, 빠진 프로필은 `[okCount] Waiting`이 하나 모자란 프로필로 확인 6/6): Pz-35 a4 Harrogath(POA 시작 뒤 21:14:17 `[initNPC] identify`를 끝으로 2분 동안 줄 없음), Pz-45 a3 Ancient's Way(게임 시작 2분 42초, 마지막 줄 23:21:10 `[okCount] Waiting`, 8명 모두 퇴장), Pz-58 a3 Rogue Encampment(ANDY 시작 02:16:18 `[okCount] Waiting` 뒤 4분 줄 없음), Pz-71 a6 Rogue Encampment(ANDY 시작 05:25:02 `[okCount] Waiting` 뒤 2분 40초 줄 없음), Pz-62 a4 Chaos Sanctuary(`[visitTown] Back` 37초 뒤 퇴장). Pz-11 a8은 2-23(`goWP` 10회 실패).

## 2. 구현 검토·수정 대기 (진행은 확정, 로직과 구현 방식 검토)

### 2-23. 웨이 유닛 못 찾음 (`Pather.getWP`·`useWaypoint`, 옛 1-14·2-9·1-11·3-7 실패 2건)
- **문제**(사용자 261022): a1 Pz-49·50 Catacombs Level 2 `[getWP] waypoint unit not found` → `useWaypoint`가 그 자리에서 `wp.area:null` 12회 → throw → 게임 종료.
- **확인된 것**
  - 코드: `goWP` while은 프리셋 10칸 안이거나 10회 뒤 `[goWP] Failed` trace로만 끝난다 → 실패 줄이 없었으니 프리셋을 찾았다면 10칸 안에서 유닛 조회가 실패한 것. Pz-49는 `going to nearest WP`(프리셋 찾음) 확인. 웨이는 `useUnit`을 쓰지 않는다(`getUnit(2, "waypoint")` 직접).
  - Pz-49는 06:35:20 1층 → 2층 `useUnit` timeout iter:0 뒤 넘어가 06:35:22 goWP, 06:35:28 웨이 못 찾음(2층에 못 간 채 getWP는 아님).
  - 261023·261024 로그: `waypoint unit not found` 0. 판별 trace 안(옛 2-6)은 기각(`rejected.md` getWP).
  - 261022 노트 정리(`fae6b2b`)에서 1절을 결정 대기만 두던 때 2-9로 옮겼으나 진행 결정·가설·구현안이 없어 1절로 되돌림(사용자 261024).
  - 261026 로그(새 사례 3건): Pz-22 10/25 17:50 8명 모두 Catacombs Level 2의 거의 같은 자리(22519,6639 부근)에서 `going to nearest WP` 뒤 `[WP] wp.area:null me.area:35 target:1` 87줄 → a1·a2·a3·a4·a6 `[Error] useWaypoint: Failed to use waypoint`(한 프로필의 일시적 조회 실패로는 설명되지 않음). a1 10/26 07:22 Durance of Hate Level 2 `waypoint unit not found` + `wp.area:null` 8줄, 9초 뒤 그 자리에서 Life Chicken. a1 06:59 Sewers Level 2 `waypoint unit not found` 1줄(오류 없이 진행).
  - 진행 확정(사용자 261026) → 1절에서 2절로.
  - 261027 로그: a1 Pz-47 Durance of Hate Level 2 도착 직후 `waypoint unit not found` → `wp.area:null` 12회 → `[Error] useWaypoint`. 261028 로그: a1 Pz-49 10/28 03:31 Catacombs Level 2(22648,6513) `waypoint unit not found` → `wp.area:null` 12회 → `[Error] useWaypoint`로 게임 종료(261022 사례와 게임 번호·지역이 같음).
  - 261103 로그: Pz-9 11/02 18:42:57 Jail Level 1에서 8명 모두 같은 초 `[getWP] waypoint unit not found. area:29`(17701~17706, 5275~5280). `wp.area:null`·`[Error]`·`goWP Failed` 없이 같은 초 INNER로 넘어감(`useWaypoint` throw가 아니라 `getWP`가 웨이를 못 얻은 채 지나간 모양). 다음 게임 Pz-10에서 JAIL을 한 번 더 돎(JAIL은 `if (!getWaypoint(6))`일 때만, 코드 읽음), Pz-10은 `going to nearest WP` 뒤 정상. 8명이 함께 못 찾은 모양은 261026 Pz-22와 같다.
  - 261104 로그: Pz-41 a1 11/03 22:04:47 Catacombs Level 2 `[goWP] Going to nearest WP` → 22:04:50 `[getWP] Failed: waypoint unit not found`(22514,6524) → `[useWaypoint] Retry 0~11: wp.area=null target=1` → `[Error] AutoSmurf: useWaypoint: Failed to use waypoint` → 게임 종료. 그 자리는 Pz-44에서 팔로워들이 이 웨이를 쓴 자리(22514~22521, 6521~6526)와 같다. Catacombs Level 2 a1 사례는 261022 Pz-49·50, 261028 Pz-49에 이어 4번째. Pz-11 a8 16:22:50 같은 Catacombs Level 2 `Going to nearest WP` 뒤 22555,6588(웨이 자리에서 약 81칸)에 3분 그대로 있다가 16:25:57 `[goWP] Failed: 10 attempts`(`Pather.goWP` caughtError 0, 그동안 줄은 물약 2번뿐) → 나머지 7명이 16:22:49에 웨이로 간 뒤 a8 missing으로 `Party desynced 1`. `[goWP] Failed`는 261022 기록에서 0이었다(그 뒤 묶음은 대조 안 함). 10번 모두 못 닿은 이유는 로그로 모름.
  - 261105 로그: Pz-37 a1 11/04 20:50 나이트메어 첫 게임 웨이 모으기(`[travel] Next Catacombs Level 2`) 중 20:50:10 Catacombs Level 2 `[goWP] Going to nearest WP` → 20:50:13 `[getWP] Failed: waypoint unit not found`(22579,6514) → `[useWaypoint] Retry 0~11: wp.area=null target=1` → `[Error] AutoSmurf: useWaypoint: Failed to use waypoint`(area=35) → 게임 종료. 261104 Pz-41(나이트메어 첫 게임 무렵, 같은 지역)과 같은 모양.
- **가설**: 없음(검토에서 정한다).
- **구현안**: 검토에서 정한다.
- **검증 방법**: 검토에서 정한다.

## 3. 인게임 검증 대기 (구현이 끝난 것을 실제 게임에서 검증)

### 3-68. 끝 줄 정리: Script ended 리더 콘솔·팔로워 waitParty, Max game time 콘솔 리더만, 게임 이름 print 삭제 (`AutoSmurf` main 끝, `ToolsThread` main, `default.dbj` main, 사용자 261105)
- **문제**(사용자 261105): 정상 종료가 콘솔에 없어, 경험치 줄 앞에 종료 사유가 없는 게임을 구별할 수 없었다. 리더만 `Script ended`를 찍으면 팔로워가 먼저 끝난 게임에서 리더는 `PartyThread`로 따라 나가 줄이 빠진다. `[Quit] Max game time`은 모든 프로필이 콘솔에 찍어 지저분했다. 게임 이름 print는 `[Starter] Create game`·`Join game`과 중복.
- **바꾼 것**(261105, 이 커밋): 팔로워·Boer는 끝에서 `this.waitParty()` 뒤 print `[AutoSmurf] Script ended`, 리더는 print + 콘솔 `[AutoSmurf] Script ended (지역 x,y)`(기본색). `Max game time` 콘솔은 리더만(print는 모두). `default.dbj`의 주석 처리된 게임 이름 print 삭제. 내용은 코드 노트의 같은 헤더.
- **검증 방법**: `Console.txt` — 리더 경험치 줄 앞에 `[AutoSmurf] Script ended`·`[Quit]`·`[Stop]`·`[Chicken]`·`[Died]`·`[Error]` 중 하나가 있는지. 아무것도 없는 게임은 따로 원인을 본다. `[Quit] Max game time`은 게임마다 리더 1줄(팔로워 0). `[AutoSmurf] Script ended`는 `<Flow>`. d2bs 로그 — 팔로워 끝 `[waitParty] Waiting` 뒤 `[AutoSmurf] Script ended` 또는 `Party has left`. `Party desynced in`의 `missing`이 리더면 리더가 끝에 못 온 것. 게임 이름 단독 줄 0.
- **결과**: (로그 대기)

### 3-67. 팀 대기 이름 정리: okCount·teamCount → waitParty (`AutoSmurf.waitParty`, 사용자 261105)
- **문제**(사용자 261105): 개수를 세지 않는데 이름이 `okCount`·`teamCount`라 뜻이 맞지 않았다.
- **바꾼 것**(261105, 이 커밋): 두 함수를 `this.waitParty` 하나로 합치고(두 단계 유지), 메시지·변수를 `waitPartyIn`·`waitPartyAll`·`waitPartyOut`·`waitPartyNames`로, 로그를 `[waitParty] Waiting`·`Party desynced in/out`으로 바꿈. 퇴장 상세의 ` teamOk X` 삭제. 동작(순서·타임아웃·버리기 조건)은 그대로. 내용은 코드 노트의 같은 헤더.
- **검증 방법**: d2bs 로그 — `[okCount]`·`Party desynced 1`·`Party desynced 2`·`teamOk` 0줄, 게임마다 프로필별 `[waitParty] Waiting` 수가 같고 구간 진행이 끝까지 감(대기가 풀림). desync가 나오면 `Party desynced in|out`과 `missing(waitPartyIn|waitPartyOut): 프로필`이 찍히고, in의 이름이 `[waitParty] Waiting`이 모자란 프로필과 같은지. `ReferenceError`·`[Error]`에 `waitParty`·`okCount`·`teamCount` 0.
- **결과**: (로그 대기)

### 3-65. 경로 보정 10회 실패 뒤 오류 줄 없음 → `Attack` 조용한 catch 3곳에 `Misc.caughtError` (`Pather.moveTo`, `Attack.clear`·`setPosition`, 옛 1-17, 사용자 261026·261103)
- **문제**: `Pather.moveTo`는 `no adjusted path` 10번째에도 경로가 없으면 throw(`moveTo: Failed to generate path`)하는데, 261026 로그 2건은 오류 줄 없이 다음 구간으로 넘어갔다.
- **확인된 것**
  - 사례: a3 10/26 00:29:09~00:29:22 Abaddon(목표 12659,6098, 10회 모두 12645,6106 부근) → 00:29:29 `=== [POA] ===`. a7 03:37:10~03:37:23 Infernal Pit(목표 12660,9099) → 03:37:29 `=== [DIABLO] ===`. 두 건 모두 `fixed path`·`[Error]`·`Failed to generate path` 0.
  - 코드: `Attack.js`에 `Pather.moveTo` throw를 trace 없이 받는 catch가 3곳(잃은 목표 마지막 위치로 이동 `searches = 99`, 자리 잡기 이동 `moved = false` 2곳). 이번 2건이 어느 호출부였는지는 로그로 모름. CLAUDE.md 4절: 잡힌 오류는 `Misc.caughtError`.
  - 261027 로그: `no adjusted path` 10회 2건은 모두 `[Error] moveTo: Failed to generate path`가 찍힘(a6 Pz-6 Stony Field, a7 Pz-55 Abaddon `usePortal → moveToUnit`) — 오류 줄 없는 위 2건과 다른 호출 자리. 261028 로그: `no adjusted path` 0.
- **판단에 필요한 것**: 진행할지. 한다면 조용한 catch 3곳에 `Misc.caughtError`를 넣을지(콘솔은 게임당 자리별 1회).
  - 261101 로그: a6 11/01 10:13:11~10:13:21 Pit of Acheron(목표 12781,7542) `no original path` 뒤 `no adjusted path` 10회(모두 12785,7565) → `fixed path`·`[Error]` 없이 10:14:20 `=== [INFERNAL] ===`(오류 줄 없는 모양). 같은 묶음 a8 05:06 Harrogath는 `[Error] moveTo: Failed to generate path: 12641,6349`(찍힌 모양).
  - 261103 로그(3-61 리뷰, 파밍 `farmingAbaddon`·`farmingPOA`의 `while (거리 > 15) moveTo` 루프, 180초 상한): a1 Pz-55 11/03 02:54:06~02:54:16 Pit of Acheron 목표 12659,7599(루프 목표 12680,7640과 다른 좌표) `no adjusted path` 10회(12645,7603) → `[Error]` 없이 02:54:23 `=== [INFERNAL] ===`(오류 줄 없는 모양). a4 Pz-37 11/02 23:26:56~23:27:07 Abaddon 목표 12674,6094(루프 목표) 10회(12700,6084) → `[Error] Error in AutoSmurf (pather.js #346) moveTo: Failed to generate path` → a4가 나가 팀 전체가 다음 게임으로(찍힌 모양, 루프의 `moveTo`에는 catch 없음, 코드 읽음).
- **결정**(사용자 261103): 진행. 동작(목표 버림·`moveFailed`)은 그대로 두고 기록만 남긴다. catch는 이동 실패를 `clear`의 재시도·포기 판단에 넘기려는 설계(`docs/code/Attack.md` 260928)이고, 261021에 10회 보정 뒤 throw가 들어오면서 `Attack`에서 부른 경우에만 기록 없이 사라지게 됐다.
- **바꾼 것**(261103, `4aae2ef` 로그 정책과 같은 커밋): `Attack.clear` 잃은 목표 이동 catch에 `Misc.caughtError("Attack.clear lostPos", e1)`, `Attack.setPosition` 자리 이동 catch에 `"Attack.setPosition move"`, 우회 후보 이동 catch에 `"Attack.setPosition detour"`.
- **검증 방법**: `no adjusted path` 10회 뒤(trace) 같은 시각 print에 `[Error] Attack.clear lostPos|Attack.setPosition move|Attack.setPosition detour: moveTo: Failed to generate path …`가 있고, 콘솔에 같은 자리 첫 1회 `[Error] …`. 오류 줄 없이 다음 구간으로 넘어간 10회 사례가 0이면 통과. 메시지가 `Failed to generate path`가 아닌 `[Error]`(다른 실행 중 오류)는 따로 본다.
- **결과**: 261104 **케이스 미발견** — `no adjusted path`는 1회뿐(a8 Pz-30 20:24:05 Infernal Pit, 1회째 직후 리더가 나가 게임 끝), 10회 0, `[Error] Attack.` 0. 한 사이클 더 본다(사용자 261104).
- **결과 2**: 261105 **케이스 미발견** — `no adjusted path` 0, `no original path` 4(모두 바로 `adjusted path`), `[Error] Attack.` 0. 한 사이클 더 본다(사용자 261105).

### 3-60. 같은 id 계단 중 출구 좌표에 가까운 것 (`Pather.moveToExit`·`useUnit`, 사용자 261102)
- **문제(사례)**: 261102 Pz-6 15:01~15:03 — Jail Level 3에서 Inner Cloister로 갈 때 8명 모두 도착한 계단(17580,8271)을 다시 클릭해 Jail Level 2로 돌아감 → Level 2에서 Level 3 좌표로 경로를 찾다 `[Error] AutoSmurf.moveToExit 32: moveTo: Failed to generate path` 8줄 → 아무도 32에 없어 a4 `Area reversed`로 퇴장. 같은 경로 Pz-7은 정상. 사용자: Stony Field → Underground Passage → Dark Wood에서도 같은 일이 있어 두 곳에 폴백(포털 열고 합류)이 있다.
- **확인된 것**
  - mpq(`levels.txt` Vis·Warp): Jail Level 3은 Jail Level 2·Inner Cloister 둘 다 Warp 13("Act 1 Jail Up"), Underground Passage Level 1은 Stony Field·Dark Wood 둘 다 4. 다른 지역으로 같은 id를 쓰는 곳은 Spider Forest(Spider Cave·Spider Cavern 51), Kurast Bazaar·Upper Kurast·Kurast Causeway(사원 61)도 있다.
  - 코드: `moveToExit`는 목표 출구 좌표(`getArea().exits`) 근처로 간 뒤 `useUnit(5, tileid)`. `useUnit`은 `getUnit(5, id)`로 처음 나온 유닛을 쓰고(거리 안 봄), 멀면 그 유닛까지 다시 걸어가 클릭한다. type 5 `useUnit` 호출은 `moveToExit` 한 곳.
  - Pz-6 `useUnit` timeout의 `unit:` 좌표가 도착 자리와 같음. 도착부터 첫 timeout까지 67초(Pz-7 같은 구간 25초)라 Inner 출구까지 갔다가 되돌아온 것으로 추정(사이 trace 없음).
- **바꾼 것**(261102): `useUnit`에 인자 `exit`({x, y}, 생략 가능). 주면 같은 id 유닛을 `getNext`로 모두 보고 `exit`에 가장 가까운 유닛을 쓴다(기존 지역 변수 `spot`을 이 비교에 먼저 씀). `moveToExit` 계단 분기가 `currExit`을 넘김. 다른 호출부는 인자가 없어 그대로. 폴백(Stony Field·Jail 포털 합류)은 그대로.
- **검증 방법**: 위 지역에서 `[useUnit] timeout`의 `unit:` 좌표가 도착 자리인 사례와 `Area reversed`가 0인지. 다른 계단 이동에서 `useUnit` timeout·`moveToExit failed`가 늘지 않는지.
- **결과**: 261103 **알 수 없음** — 검증 방법이 실패 없음만 보는데, 옛 코드도 처음 돌려받은 계단이 맞으면 정상으로 간다(261102 Pz-7). 어느 계단을 골랐는지 남는 줄이 없어 새 코드의 효과를 가를 수 없음. `Area reversed` 0. Jail Level 3 → Inner Cloister는 노말 Pz-10 한 게임(Pz-9는 a3 Jail Level 1 치킨으로 그 전에 끝남): Jail Level 3 `useUnit` timeout 0, 8명 모두 18:54:53 CATHEDRAL 시작(INNER 끝 okCount는 Inner Cloister 안). 계단으로 들어갔는지 대비책(마을 → 32 포털)으로 들어갔는지는 줄이 없어 모름(성공 줄 `[useUnit] ok`는 261102 삭제, 대비책 경로에는 trace 없음). Underground Passage Level 1 timeout 2줄(Pz-4 a3·a6 18:02, 유닛 7757,8390 = Dark Wood 쪽 계단)은 둘 다 Dark Wood 도착. timeout 45줄(261102 79), `moveToExit failed` 1(Monastery Gate, 계단 아님, 1-2).
- **바꾼 것 2**(261103): `useUnit`의 `exit` 분기에서 처음 돌려받은 계단(`getUnit(type, id)`, 옛 코드가 쓰던 것)의 좌표가 고른 계단(`spot`)과 다를 때만 trace `[useUnit] nearest id:N first:x,y chosen:x,y exit:x,y target:지역`(새 변수 없음).
- **검증 방법 2**: 줄이 찍히고 그 프로필이 `target` 지역에 도착하면(`Area reversed` 없음, 다음 구간 진행) 옛 코드라면 되돌아갔을 사례를 막은 것 → 확정. 줄이 찍혔는데 되돌아가면 고르는 방식이 틀림 → 2절. 줄이 0이면 첫 계단이 늘 맞았음 → 케이스 미발견. 제거 조건: 확정 사례 1건.
- **결과 2**: 261104 **케이스 미발견** — `[useUnit] nearest` 0줄. 해당 구간 통과는 Jail Level 3 → Inner Cloister 4게임 17회, Underground Passage Level 1 → Dark Wood 3게임 10회(지역이 바뀐 print 줄로 셈, 줄이 없는 통과는 빠짐), Spider Cavern·Ruined Temple 진입 있음. `Area reversed` 0, useUnit timeout 76줄(261103 45, 261102 79) 모두 Retry 0~1, 8회 모두 실패 0. 한 사이클 더 본다(사용자 261104).
- **결과 3**: 261105 **케이스 미발견** — `[useUnit] nearest` 0줄. Jail Level 3 → Inner Cloister 3게임 10회, Underground Passage Level 1 → Dark Wood 3게임 10회, Spider Forest → Spider Cavern 2회 통과(지역이 바뀐 print 줄로 셈). `Area reversed` 0, useUnit timeout 59줄(Retry 0 48·1 6·2 4·3 1). 한 사이클 더 본다(사용자 261105).

