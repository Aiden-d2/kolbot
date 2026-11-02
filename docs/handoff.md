# 인수인계

새 대화는 이 문서부터 읽는다. 절과 흐름은 `CLAUDE.md` 5절을 따른다.
- 1절 `진행 여부 대기`: 문제(사례) / 확인된 것 / 판단에 필요한 것
- 2절 `구현 검토·수정 대기`: 확인된 것 / 가설 / 구현안(대상 함수, 수정 규모) / 검증 방법
- 3절 `인게임 검증 대기`: 바꾼 것(커밋) / 검증 방법 / 결과(로그 묶음별)
- 흐름: 1 → 2(진행 결정) → 3(수정 완료) → 코드 노트(검증 통과). 3 검증 실패는 실패 사례를 붙여 2로. 기각은 `rejected.md`. 같은 내용은 한 항목에만, 옮길 때 `옛 N-N`. 지운 번호는 다시 쓰지 않는다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

**마지막으로 분석한 로그**: 261102 묶음(11/01 13:43 ~ 11/02 09:25, 8프로필 각 93게임, 노말 → 헬 파밍, 아시아 서버), `log_results.md` 261102. 코드는 main `6a9f1b6`(PR #131·#132 반영, 줄 형식으로 확인). **다음 사이클**은 261102 수정(3-55 용병 물약 상태 기준, 3-57 trace, 3-60 같은 id 계단)이 들어간 main으로 돈다. 다음 분석 때 `Pather.moveTo`가 실패(false)로 끝나 호출부가 오류를 던지거나 더 진행할 수 없게 된 사례도 리뷰한다(사용자 261102, handoff 3-61, `log_guide.md` 5절).

## 1. 진행 여부 대기 (진행할지 말지 검토)

### 1-2. Monastery Gate 동선 H1 (`AutoSmurf.outer`, `Pather.moveToExit`)
- **문제**(사용자 261022): Tamoe Highland(7) → Monastery Gate(26) → Outer Cloister(27)로 갈 때 26의 모양이 특수해서, 가장 짧은 길이 아니라 벽 쪽으로 들어간 뒤 중앙 게이트를 거쳐 27로 넘어간다. 벽 쪽 진입 자리에서 게이트까지 가는 거리를 줄일 수 있는가(게이트로 바로 도착).
- **확인된 것**
  - 261022 로그(`[exit] 26 -> 27`, 2게임 9줄, 모두 통과): 26 → 27 출구 점 `15140,5000`(보정 칸 `15140,5001`) = 게이트 위치(사용자). 26 진입 뒤 위치 약 `15180,5087` = 벽 쪽 진입 자리(사용자). 차이 x 40, y 87(직선 약 96).
  - `[exit]`는 26 안에서 26 → 27 출구를 고를 때만 찍었다. 벽 쪽 진입을 정하는 7 → 26 출구 점은 찍히지 않았다. 옛 가설 "출구 점이 게이트 옆 벽인가"는 시험되지 않았다(틀렸다고 판정된 것 아님). `[exit]`는 261022 삭제.
- **판단에 필요한 것**: 진행할지, 한다면 7 → 26 출구 점·동선을 볼 검증 방법. 사용자 아이디어(결정 아님): "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다."

### 1-16. 벨트에 아무 등급 물약이나 들어감 (`Town.clearBelt` 벨트 넣기, 사용자 261025)
- **문제**(사용자): 인벤토리 물약을 벨트에 넣을 때 등급을 보지 않아 낮은 등급도 들어간다. 원래 동작이라 당장 고칠 것은 아니고, 나중에 맞지 않는 등급은 버리기로 넓히면 된다(사용자 261025).
- **확인된 것**(코드)
  - 벨트 넣기(261025 `81d5b43`부터 `clearBelt` 끝, 원본 kolbot은 `clearInventory` 앞)는 물약을 종류(hp·mp·rv)로만 골라 이름이 맞는 열에 넣는다. 등급은 보지 않는다.
  - `buyPotions`는 빈 칸만 채우므로, 낮은 등급이 칸을 차지하면 그 칸에 상점 최고 등급을 사지 않는다. 게임이 벨트 안에서 어떤 등급을 먼저 마시는지는 확인하지 않음.
  - 상점 최고 등급은 `Town.getPotion(npc, type)`(상점 품목을 5 → 1등급 순으로 찾음)으로만 알고, `buyPotions`가 상점을 연 뒤에만 부른다. `clearBelt`는 heal 앞, 상점을 열기 전이다.
  - 등급 기준이 이미 두 곳에 있다: `X.nip` 138~148줄(회복·마나 1등급 노멀 1~2막, 2등급 노멀 1~3막, 3등급 노멀 1~4막, 4·5등급 항상)과 `clearBelt`의 노멀 마나 규칙(2막 mp1, 3막 mp1·mp2를 벨트에서 버림). 두 기준이 한 막씩 어긋난다(nip은 2막에서 mp1, 3막에서 mp2를 줍는다).
- **판단에 필요한 것**: 진행할지. 한다면 기준(① 같은 게임에서 연 상점의 막별 최고 등급을 기록해 씀 — 새 상태 1개, 게임 첫 방문엔 적용 안 됨, ② 막·난이도 고정 표 — `clearBelt` 마나 정리 규칙처럼 제외할 등급을 코드에 적음(상점 데이터 불필요, 사용자 261028), ③ nip 판정 `Pickit.checkItem`이 0이면 넣지 않음 — 새 상태 없음), 넣지 않은 물약을 버릴지, nip과 `clearBelt` 마나 규칙의 어긋남을 어느 쪽으로 맞출지.

### 1-17. 경로 보정 10회 실패 뒤 오류 줄 없음 (`Pather.moveTo`, `Attack`, 사용자 261026)
- **문제**: `Pather.moveTo`는 `no adjusted path` 10번째에도 경로가 없으면 throw(`moveTo: Failed to generate path`)하는데, 261026 로그 2건은 오류 줄 없이 다음 구간으로 넘어갔다.
- **확인된 것**
  - 사례: a3 10/26 00:29:09~00:29:22 Abaddon(목표 12659,6098, 10회 모두 12645,6106 부근) → 00:29:29 `=== [POA] ===`. a7 03:37:10~03:37:23 Infernal Pit(목표 12660,9099) → 03:37:29 `=== [DIABLO] ===`. 두 건 모두 `fixed path`·`[Error]`·`Failed to generate path` 0.
  - 코드: `Attack.js`에 `Pather.moveTo` throw를 trace 없이 받는 catch가 3곳(잃은 목표 마지막 위치로 이동 `searches = 99`, 자리 잡기 이동 `moved = false` 2곳). 이번 2건이 어느 호출부였는지는 로그로 모름. CLAUDE.md 4절: 잡힌 오류는 `Misc.caughtError`.
  - 261027 로그: `no adjusted path` 10회 2건은 모두 `[Error] moveTo: Failed to generate path`가 찍힘(a6 Pz-6 Stony Field, a7 Pz-55 Abaddon `usePortal → moveToUnit`) — 오류 줄 없는 위 2건과 다른 호출 자리. 261028 로그: `no adjusted path` 0.
- **판단에 필요한 것**: 진행할지. 한다면 조용한 catch 3곳에 `Misc.caughtError`를 넣을지(콘솔은 게임당 자리별 1회).
  - 261101 로그: a6 11/01 10:13:11~10:13:21 Pit of Acheron(목표 12781,7542) `no original path` 뒤 `no adjusted path` 10회(모두 12785,7565) → `fixed path`·`[Error]` 없이 10:14:20 `=== [INFERNAL] ===`(오류 줄 없는 모양). 같은 묶음 a8 05:06 Harrogath는 `[Error] moveTo: Failed to generate path: 12641,6349`(찍힌 모양).

### 1-19. 대기 자리에 와 있는데 okCount 미도착 (`AutoSmurf.okCount`, 사용자 261029)
- **문제(사례)**: 261029 — a3 Chaos Sanctuary 4게임(10/29 04:38·06:09·09:31·12:15, 퇴장한 프로필과 4~27칸, 그 앞 150초 a3 trace 줄 없음, 06:09만 87초 전 `Town check (direct)` 다녀옴), a6 Pz-27 Travincal(10/28 19:41, 120초 전 `Town check (direct)` 다녀온 뒤). 261027에도 같은 모양(Pz-103 a3 Ancient's Way, Pz-117 a6 Catacombs 4).
- **확인된 것**: okCount 보내기는 `sendCopyData` 한 번, 결과 확인·재전송 없음(261027 코드 읽음). 지금 로그로는 보내지 않았는지·유실됐는지·단계가 어긋났는지 모름.
- **결정**(사용자 261029): 한 사이클 더 본다. 그래도 나오면 어디서 빠지는지 검증 방법을 세운다.
- **261030 사례**(91게임, desync 10게임 중 피겨린 Pz-38·무덤 안 Pz-21을 뺀 8게임): 퇴장 순간 빠진 프로필과 퇴장한 프로필의 거리, 그 앞 5분 trace.
  - 마을 다녀오기 관련 3: Pz-55 a6 Travincal 9칸(00:36:15 `Town check (direct)` → 00:36:33 복귀, 그 뒤 2분 20초 trace 없이 거의 제자리), Pz-49 a3 Harrogath 8칸(23:21:03 Pit of Acheron에서 `visitTown start`, `back` 없음), Pz-64 a5 Chaos 16~26칸(상대가 기다린 지 91초 뒤 마을행, 퇴장 6초 전 복귀).
  - 그 밖 5: Pz-25 a6 Harrogath 3칸, Pz-47 a4 Harrogath 4칸, Pz-58 a7 Ancient's Way 9칸, Pz-59 리더 a1 Rogue Encampment 0칸(3분 반 전 Worldstone Chamber `Town check` 뒤 COUNTESS·PIT 정상 진행), Pz-71 a3 Rogue Encampment(퇴장한 둘과 72칸, okCount를 보낸 다른 5명과 같은 자리). 모두 그 앞 5분 trace에 마을 다녀오기 없음.
- **261031 사례**(95게임, desync 10게임 중 피겨린 Pz-26 제외): Chaos a3 Pz-73(27칸)·Pz-86(16~23칸, 퇴장 1분 안 `Town check (direct)` 2번)·Pz-89(23칸, 51초 전 Town check), a8 Pz-78(37칸, 48초 전 Town check). Ancient's Way Pz-66 a3 12칸·Pz-77 a7 9칸(게임 시작 2~3분, 앞 trace 없음). Pz-81 a4 Throne에 남음(리더 Worldstone Chamber, 5분 안 Town chicken 2·Town check 3, 마지막 복귀 13초 뒤 퇴장). Pz-1 a6·a7 Burial Grounds에 못 들어가고 Cold Plains(3분 trace 없음). Pz-10 a8 Catacombs 2층 도착 자리 근처 3분 반(퇴장한 a3과 271칸).
- **261102 사례**(93게임, desync 9게임): Pz-10 a4가 Catacombs 2층에 남음(퇴장한 a6은 3층). Pz-35 a8 Harrogath 4칸(Pit of Acheron `visitTown start`, `back` 없음). Pz-39 a8(Chaos에서 Town check 2번, 퇴장 때 마을). Pz-44 POA: a1(리더)·a4·a8이 같은 자리(12640,7595)에서 180초 동안 목표에 못 닿음(`POA failed: moveTo`, 경로 실패 줄 없음), 나머지 5명은 먼저 INFERNAL로 넘어가 a5가 Harrogath에서 퇴장. Pz-54 a1 Chaos 약 34칸(46초 전 Town check). Pz-59 a7 Ancient's Way 12칸·Pz-89 a7 8칸(게임 시작 2분 반, 앞 trace 없음). Pz-67 a6 Rogue Encampment 66칸. Pz-92 a8 Chaos: 3분 안 Town check 3번 뒤 a8 자신이 `missing(okCount):  teamOk true`로 퇴장(다 모인 뒤 같은 회차에서 120초 초과 검사, 사용자 261102: 정상).
- **261101 사례**(63게임, desync 5게임): Pz-33 a6 Pit of Acheron에 남음(2분 안 Town chicken 2·Town check 1, 마지막 복귀 45초 뒤 퇴장, 리더는 Harrogath). Pz-38 a3 Ancient's Way 7~15칸(게임 시작 2분 반, 앞 trace 없음). Pz-43 a6 퇴장 12초 전 Catacombs 4층에서 `Town check (direct)` → Rogue Encampment에서 퇴장. Pz-52 a3 Harrogath 1칸(10:03:23 Pit of Acheron `visitTown start`, `back` 없음).

## 2. 구현 검토·수정 대기 (진행은 확정, 로직과 구현 방식 검토)

### 2-2. print/trace 중복 정리 (여러 파일)
- **구현안**: 범위(print·trace 중복 / 콘솔+print 중복 / 로그 규칙 위반)는 그때 정한다.
- **선행 조건**: 없음. 처음에는 3절 검증용 줄이 바뀌지 않도록 3절 검증이 끝난 뒤로 했으나(사용자 결정 261021), 남은 3절 항목에 영향이 없다고 보고 가능으로 바꿈(사용자 261023). 남은 3절 항목의 검증 줄도 2-2 정책에 맞춰 바꿔도 된다(줄 모양보다 판단에 필요한 정보가 남는 것이 중요, 사용자 261023). 바꾸면 해당 3절 항목의 검증 방법과 `log_guide.md` 줄 이름을 함께 고친다.

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
- **가설**: 없음(검토에서 정한다).
- **구현안**: 검토에서 정한다.
- **검증 방법**: 검토에서 정한다.

### 2-28. 0이 될 수 있는 delay 정리 (여러 파일, 2-2 연장, 사용자 261029)
- **문제**(사용자): `me.ping`만 쓰는 delay는 서버 상태에 따라 0이 되어 strict 경고가 난다. delay 값이 0이거나 0이 될 수 있는 곳을 정리한다.
- **확인된 것**(261029 main, 글자 그대로 찾은 결과만): `delay(me.ping)` 0곳(`Misc.js` 1곳은 주석), `delay(me.ping * 2)` 2곳(`Unit.prototype.openMenu`), `delay(0)` 0곳, 인자를 그대로 넘기는 곳 2곳(`Misc.poll`의 sleep 기본 40, `Packet.flash`의 wait 기본 `300 + 2 * me.ping`, 호출 쪽에서 넘기는 값은 안 봄). 다른 계산식(뺄셈·변수 조합)으로 만든 delay는 찾지 않았다.
- **가설**: 없음.
- **구현안**: 검토에서 정한다(찾을 범위, 0을 막는 방식).
- **검증 방법**: 검토에서 정한다.

## 3. 인게임 검증 대기 (구현이 끝난 것을 실제 게임에서 검증)

### 3-53. 피겨린 주운 사람이 블록을 건너뜀: `Packet.openMenu` 재시도 로그 (`AutoSmurf.figurine`, `Packet.openMenu`·`skipTalk`, 사용자 261101)
- **문제(사례)**: 261030 Pz-38 a6, 261031 Pz-26 a4 — 피겨린을 주운 사람만 `if (!me.getQuest(20, 0))` 블록을 건너뛰어(그 게임 `!!! [POTION] !!!` 없음, 다음 게임 시작 `preparation`에서 물약을 마심) `teamFigurine`을 보내지 않고 혼자 끝 okCount에서 `Party desynced 1`(나머지 7명 missing). 같은 주운 사람이 블록을 탄 게임도 있다(261031 Pz-63 a4, 261030 Pz-23·55).
- **확인된 것**
  - 괄호 구조는 `bots/AutoSmurf.js`가 저장소에 들어온 `a4e1b05`(09/14)부터 같다(최근 수정으로 생긴 것 아님).
  - `quest_flags.md` 20번: Alkor 대화(534, 황금새 전달)는 bit1, 완료 대화(538)는 bit0·bit5(물약). 건너뛴 2건은 블록 판정 전에 물약을 가졌으므로 첫 Alkor `openMenu` 안에서 538까지 일어났다.
  - `Config.PacketShopping = true` → `Unit.prototype.openMenu`는 `Packet.openMenu`(`libs/Misc.js`). 상호작용(0x13) 뒤 1초 안에 메뉴(`getUIFlag(0x08)`)를 못 보면 취소 패킷 뒤 다시 상호작용(최대 5회). 대사 중에는 `skipTalk`이 스페이스를 대기 없이 보낸다(`continue`, 한도 20). 261001 전에는 대사 중 키를 보내지 않았다.
- **가설**: 스페이스 연타가 534 뒤 열린 메뉴를 닫고, 이를 못 본 재시도 상호작용이 538(완료)이 되었다. 앞 단계(연타가 실제로 여러 번 나감, 스페이스가 메뉴를 닫음, 루프가 메뉴를 놓침)는 게임·엔진 동작이라 코드로 확인 못 함.
- **바꾼 것**(261101): `Packet.openMenu` 다시 상호작용하기 직전(회차 1 이상)에 trace `[openMenu] retry i:N keys:K npc:이름`(K = 그때까지 보낸 스페이스 수). 모든 NPC에서 찍힘. 피겨린 코드 수정(물약·`teamFigurine` 블록 밖으로)과 `skipTalk` 대기는 이번에 넣지 않음(사용자 261101).
- **판정**(사용자 261101): 건너뛴 사례에서 그 게임 FIGURINE 시작 ~ 주운 사람의 okCount 사이에 `npc:Alkor` `retry` 줄이 있으면 첫 `openMenu` 안에서 Alkor에게 두 번 말을 건 것(줄 = 두 번째 0x13 직전에만 찍힘), 두 번째가 완료 대화(538)였다는 것은 판정 때 이미 완료였다는 결과와 "말 한 번에 퀘스트 대화 하나" 전제에서의 추론. `keys`는 참고(534 대사가 여러 줄이면 2 이상도 정상). 줄이 있으면 → `skipTalk`(스페이스 1회 뒤 대사 끝·메뉴 열림까지 대기, 상한 뒤에만 다시) 수정. Alkor `retry`가 없으면 가설이 틀림 → 원인 다시 찾기, 그동안 피겨린 블록 밖으로 빼기. 제거 조건: 건너뛴 사례 1건 판정(2사이클 동안 사례가 없으면 그때 다시 정함).
- **결과**: 261101 **케이스 미발견** — 피겨린 3게임(주운 사람 a6 04:07·a6 07:48·a8 11:27) 모두 8명이 블록 안에서 물약(`!!! [POTION] !!!` trace). `[openMenu] retry` 119줄 모두 `keys:0`(대사 없이 1초 안에 메뉴를 못 봄: Malah 33, Larzuk 18, Fara 16, Akara 13, Warriv 10 …, Alkor 2는 블록 안 반복). 발견될 때까지 유지(사용자 261101).
  - 261102 **케이스 미발견** — 피겨린 3게임(주운 사람 a7 17:30·a3 21:14·a3 01:04) 모두 8명 블록 안에서 물약. `[openMenu] retry` 222줄 모두 `keys:0`(Malah 54, Akara 52, Larzuk 22 …, Alkor 2는 a1 21:08·01:06, 주운 사람 아님). 사례가 나올 때까지 관찰(사용자 261102).

### 3-55. 용병 물약: 실제로 주는지 trace → 상태 100이 없을 때만 주기 (`ToolsThread` `drinkPotion`·main 용병 분기, 사용자 261101·261102)
- **문제**(사용자 관찰): 용병 HP가 70% 미만인데 회복이 안 되는 것처럼 보인다.
- **확인된 것**(코드): `UseMerc`는 `mercLvl`(캐릭터 69레벨 이상)일 때만 켜지고 `UseMercHP = 70`. 용병 HP < 70%면 `drinkPotion(3)` → 벨트 생명 물약만(인벤토리 제외) `clickItem(2, 물약)`, 최소 8초 간격(근거 미기재). 용병 활력 물약은 `UseMercRejuv = 0`이라 안 씀. 성공 여부를 보는 로그는 없었다. 용병이 맞는 중이면 HP로는 판정 못 함(사용자).
- **mpq**(`misc.txt`, len ÷ 25프레임): Greater 320 / 약 10.2초, Strong 180 / 약 7.7초, Healing 100 / 약 6.8초, 모두 상태 `healthpot`(100). 용병에게 같은 양·상태가 적용되는지는 mpq에서 못 찾음.
- **바꾼 것**(261101): 용병에게 준 직후 그 물약 gid와 시각을 기억(새 변수 `mercPotGid`·`mercPotTick`), 용병 분기에서 `me.ping + 200`ms가 지나면 trace `[mercPot] gone:true/false state100:true/false mercHP:N` 후 기억을 지움(ToolsThread는 기다리지 않음).
- **판정**: `gone:true` = 벨트에서 빠짐(실제로 줌), `gone:false` = 클릭이 먹히지 않음. `state100`으로 용병의 물약 상태를 인식하는지 확인. 결과를 보고 간격(8초 → 4초 등 또는 용병 상태 100이 없을 때만 주기)을 정함(사용자 261101). `[mercPot]` 줄이 없으면 용병 HP가 70% 아래로 내려가지 않았거나 벨트에 생명 물약이 없었음(구분 안 됨). 제거 조건: 한 사이클 로그에서 판정이 나오면.
- **결과**(261102 로그, 11/01 23:47부터): `[mercPot]` 550줄(a1 96 ~ a7 39). `gone:true` 547(실제로 줌), 그중 `state100:true` 539. `gone:false` 3. 연속 투약 간격 9초 이하 272회(8초 간격으로 계속 줌), 줄 때 용병 HP 중간 53%, Chaos Sanctuary 249줄. 실제로 줌(판정 나옴).
- **바꾼 것 2**(261102): 8초 간격 → 플레이어(type 0)처럼 최소 1초 + 용병(`me.getMerc()`)에게 상태 100이 있으면 주지 않음(사용자 261102). `drinkPotion`에 type 3 분기·지역 변수 `merc`. `[mercPot]` trace는 검증용으로 그대로 둠(사용자 261102).
- **검증 방법 2**: `[mercPot]` 줄 사이 간격이 물약 지속 시간(약 7~10초) 근처로 모이고 상태 100이 켜진 동안 다시 준 모양이 없으면 맞음. 1초 간격 연속 줄이 반복되면 상태 인식이 안 되는 것 → 기준 다시. 제거 조건: 이 판정.

### 3-57. 트라빈컬 `portalReset`을 피겨린 미완료일 때만 (`AutoSmurf.travincal`, 사용자 261101)
- **문제**(사용자): 피겨린이 eye·tome에서 끝났는데도 트라빈컬 Cain 대화 앞에서 `portalReset`이 실행된다(피겨린 전용).
- **바꾼 것**(261101): `if (!me.getQuest(20, 0))`일 때만 `this.portalReset()`. 캐릭터마다 자기 퀘스트 상태로 판정. 시그니처(`travincal(fig)`)는 팔로워가 메시지 플래그로 인자 없이 부르는 구조라 새 메시지·플래그가 필요해 택하지 않음(사용자 261101).
- **검증 방법**(261101): 피겨린 완료 게임의 트라빈컬에서 2막 웨이 왕복·6초 대기가 없는지(사용자 육안), 피겨린 미완료 게임은 그대로 리셋하는지.
- **결과**: 261102 **알 수 없음** — 피겨린 완료 뒤 트라빈컬은 Pz-18 하나였는데 `portalReset`에 로그 줄이 없어 판정 못 함. 구현 때 trace를 넣었어야 했다(사용자 261102).
- **바꾼 것 2**(261102): 게이트 앞에 trace `[travincal] portalReset run|skip q20:<getQuest(20,0)>`(새 변수 없음).
- **검증 방법 2**: 피겨린 완료 게임에서 `skip`, 미완료 게임에서 `run`이면 맞음. 완료 게임에서 `run`이면 틀림 → 2절. 제거 조건: `skip`·`run` 각 1건 이상.

### 3-59. 칸 옮기기(MoveToSlot)에서 아이템 유실 → 인벤토리 밖 아이템은 건드리지 않음 (`Storage.MoveToSlot`, `AutoSmurf.start`, 사용자 261029·261101, 옛 1-18·3-17·1-6)
- **문제(증상)**: 게임 시작 정리 뒤 큐브(0,0)·TP 책(0,2)·회복 물약(1,2 / 1,3 / 2,3 / 3,3)을 정해진 칸으로 옮기다가, 집은 아이템이 칸에 놓이지 않고 커서에 남아 바닥에 버려진다. 착용 장비가 버려진 사례 1건.
  - 이력: 260930~261020 실패 34건(게임 시작, 대부분 회복 물약), 261022~261028 일곱 묶음 0건, 261029 24건(109게임).
  - 261029: 21건은 헬 회복 물약(Rejuvenation 17·Full 4, 20건 Harrogath·1건 Rogue Encampment), 1건 TP 책(a5 Pz-2 Rogue Encampment), 2건 아이템 이름 `undefined`. 모두 게임 시작 13~38초. 회복 물약 21건 줄 끝은 `slot:empty dropped:<그 물약> item:loc 0 mode 5`. 같은 게임 2번 연속 실패 4게임(a1 Pz-82, a4 Pz-59, a5 Pz-66, a8 Pz-61).
  - 장비 유실: a8 Pz-61 10/29 01:15:25 Full Rejuvenation 실패(바닥) → 01:15:27 `undefined FAILED slot:Rejuvenation Potion dropped:Cobalt Demonhide Gloves item:loc 1 mode 1 at 10,0`(착용 칸 10 = 장갑). ItemLog a3 01:15:29 같은 장갑 `Kept` → 01:18:24 `Equipped`. a8 다음 게임 print `equipped: [Gloves] -1`(앞 게임 12). 그 사이 a8 ItemLog에 장갑 줄 없음(01:15:21 `Equipped`는 지팡이 `[ArmG]`).
- **확인된 것**
  - 호출(코드 읽음, `AutoSmurf.start`): `Town.doChores(true)`(장비 교체 포함) 뒤 큐브 → TP 책 → 회복 물약 목록(`findItems(516)` + `findItems(515)`, 루프 전에 한 번 만듦) 순서로 `Storage.Inventory.MoveToSlot`.
  - `MoveToSlot`(코드 읽음, `libs/Storage.js`)이 아이템을 바닥에 버리는 곳 세 군데:
    1. 막는 아이템(목표 칸을 차지한 인벤토리 아이템, 종류 무관)을 빈 칸으로 옮기다가 1초(`max(1000, ping×3+500)`) 안에 놓이지 않으면 `blocker.drop()` — **trace·ItemLog 없음**.
    2. 막는 아이템을 둘 빈 칸이 없으면 trace `[MoveToSlot] no room, dropped blocker` 뒤 버림(261029 0건).
    3. 옮길 아이템을 놓은 뒤 1.5초(`max(1500, ping×3+1000)`) + 200ms에도 커서에 무언가 있으면, 그것이 무엇이든 버림(`getUnit(100).drop()`, 실패 줄의 `dropped:`).
  - 옮길 아이템은 `getUnit(4, -1, -1, item.gid)`로 다시 찾는다. 실패 줄의 `item:`은 버린 뒤 이 방식으로 다시 찾은 결과.
  - 파티 수락 가설(옛 3-17): 수락은 게임 시작 0~1초, 실패는 13~38초, 실패 앞뒤 10초 안 수락 0 → 틀림. 판별 trace `party accept` 삭제(261029).
- **추정**(로그로 확인 못 함): a8 장갑은 ① 첫 호출에서 두 번째 회복 물약이 막는 아이템으로 옮겨지다 1번 경로로 조용히 버려져 목록의 그 객체가 깨지고(`undefined`) ② 깨진 객체의 gid로 찾은 결과가 장갑이 되어 그것을 집었다가 3번 경로로 버려진 것. 단, 두 번째 호출의 목표 칸(1,3)에 Rejuvenation이 남아 있어(`slot:Rejuvenation Potion`) 이 순서와 맞지 않을 수 있음. 깨진 gid로 `getUnit`이 무엇을 돌려주는지는 엔진 동작을 확인하지 않음. 클릭이 놓이지 않는 원인은 모름.
- **판단에 필요한 것**(폐기할지 고칠지)
  - 칸 고정이 필요한 이유: 큐브·TP 책·회복 물약 자리에 기대는 코드가 있는지(아직 찾지 않음). 없으면 함수 호출 자체를 지우는 안(폐기)이 가능.
  - 고칠 경우 정해야 할 것: 커서에 남은 것을 버리지 않고 되돌릴지, 막는 아이템 옮기기가 실패하면 그 자리에서 멈출지, 옮기기 전에 아이템 객체가 살아 있는지(gid로 다시 찾은 것이 같은 아이템인지) 확인할지, 1번 경로에 기록을 남길지.
  - 다음 사이클 실패 줄(유지)로 같은 모양이 반복되는지.
- **261031 사례**: 실패 21(회복 물약 20, TP 책 1). 그중 `dropped:none item:loc 0 mode 3`(물약이 이미 바닥) 4(a3 22:13, a6 21:33, a8 20:29·03:00), `undefined … item:gone` 2(a8 20:29:42·20:46:18) — 261029(모두 `dropped:<물약> mode 5`)와 다른 모양.
- **261101 사례**: 실패 21(회복 물약 15, Horadric Cube 2(a4·a5 02:29 Lut Gholein, ItemLog상 바로 다시 주움), `undefined … item:gone` 3, 반지 1).
  - 장비 유실: a1 Pz-56 10:42:16 시작 `equipped: [RingG] 11`·`[RingB] 11` → 10:42:50 `[MoveToSlot] undefined FAILED slot:Russet Ring dropped:none item:loc 1 mode 1 at 7,0` → 10:46:37 ItemLog `Sold … Russet Ring (60)`(08:18 착용한 반지) → 10:55:46 다음 게임 `[RingB] -1`. 그 사이 다른 반지 착용·해제 줄 없음.
  - 팔린 경로(코드 읽음): nip 티어 판정(`NTItemParser` 330줄 근처)은 착용 캐시 `Config.TierNow`를 본다. 캐시는 게임 시작(`Equip.updateTiers`)·장착·소켓 때만 갱신되고 MoveToSlot이 착용 장비를 빼도 그대로 → 인벤토리 반지(11)가 캐시(오른쪽 11)보다 높지 않아 "필요 없음". `Town.doChores`는 `shopItems`가 false면 `autoEquip`(실제 착용 상태를 봄)이 판매(`clearInventory`) 뒤. 10:46:37 판매가 어느 호출의 정리였는지는 확인 못 함.
- **원인**(추정, 사용자 261101 확인 요청에 대한 분석): `AutoSmurf.start`의 물약 목록은 루프 전에 한 번 만든다. 앞 호출 실패로 물약이 버려지면 목록의 객체가 깨지고(`undefined`·`mode 3`·`gone`), 그 `item.gid`로 `getUnit(4, -1, -1, item.gid)`를 부르면 엉뚱한 유닛(착용 장비)이 돌아오는 것으로 봄(엔진 동작 확인 안 함). MoveToSlot은 다시 찾은 유닛이 이 인벤토리 안인지 보지 않고 `toCursor()`로 집어 목표 칸에 놓았다. 두 장비 사례 모두 이름 `undefined`, 잡힌 것은 착용 칸(10, 7). 칸 고정(큐브 0,0 / TP 책 0,2 / 물약)을 읽는 코드는 없고 `Config.Inventory`는 전부 1(정리 목적으로 보임).
- **바꾼 것**(261101, A안 채택): `Storage.MoveToSlot`에서 다시 찾은 유닛이 이 컨테이너 안(`location === this.location && mode === 0`)도 아니고 커서(`mode === 4`, `toCursor`가 바로 true → 목표 칸에 놓음)도 아니면 trace `[MoveToSlot] skip <이름> gid:<item.gid> got:<잡힌 이름> loc L mode M at x,y`를 남기고 `false`(착용·바닥 아이템은 집지 않음). 칸 고정 호출은 그대로. 이 분기에서 커서에 다른 아이템이 있으면 그대로 둔다(물약·책은 가치가 낮고 드문 경우, 사용자 261101). 클릭이 놓이지 않아 커서 것을 버리는 원래 경로(큐브 2건 포함)는 그대로. `toCursor`는 착용 아이템(`mode === 1`)이면 `clickItem(0, bodylocation)`으로 몸에서 집는다(`libs/Prototypes.js`, 큐빙용) — 깨진 객체로 착용 장비를 잡으면 빠지는 경로.
- **결과**: 261102 **케이스 미발견** — `[MoveToSlot] skip` 0, `undefined … FAILED` 0. 실패 13(회복 물약 12, TP 책 1)은 모두 `dropped:<그 아이템> item:loc 0 mode 5`. 다음 게임 `equipped: [칸] -1`로 바뀐 경우 0. 다시 관찰(사용자 261102).
- **검증 방법**(CLAUDE.md 4절): skip 줄의 `gid:`가 비정상이고 `got:`이 착용(`loc 1 mode 1`)이면 가설(깨진 객체로 다른 유닛을 잡음)이 맞고 유실을 막은 것 — 다음 게임 `equipped:` 티어 그대로인지 함께 본다. skip 줄 없이 착용 장비가 빠지면(`equipped: [칸] -1`, 그 사이 ItemLog 착용 줄 없음) 조건으로는 부족 → 원인 다시. 제거 조건: 착용 장비를 잡은 skip 줄 1건 이상 + 장비 유실 0이면 skip 줄을 지울지 실패 기록용으로 남길지 정한다.

### 3-60. 같은 id 계단 중 출구 좌표에 가까운 것 (`Pather.moveToExit`·`useUnit`, 사용자 261102)
- **문제(사례)**: 261102 Pz-6 15:01~15:03 — Jail Level 3에서 Inner Cloister로 갈 때 8명 모두 도착한 계단(17580,8271)을 다시 클릭해 Jail Level 2로 돌아감 → Level 2에서 Level 3 좌표로 경로를 찾다 `[Error] AutoSmurf.moveToExit 32: moveTo: Failed to generate path` 8줄 → 아무도 32에 없어 a4 `Area reversed`로 퇴장. 같은 경로 Pz-7은 정상. 사용자: Stony Field → Underground Passage → Dark Wood에서도 같은 일이 있어 두 곳에 폴백(포털 열고 합류)이 있다.
- **확인된 것**
  - mpq(`levels.txt` Vis·Warp): Jail Level 3은 Jail Level 2·Inner Cloister 둘 다 Warp 13("Act 1 Jail Up"), Underground Passage Level 1은 Stony Field·Dark Wood 둘 다 4. 다른 지역으로 같은 id를 쓰는 곳은 Spider Forest(Spider Cave·Spider Cavern 51), Kurast Bazaar·Upper Kurast·Kurast Causeway(사원 61)도 있다.
  - 코드: `moveToExit`는 목표 출구 좌표(`getArea().exits`) 근처로 간 뒤 `useUnit(5, tileid)`. `useUnit`은 `getUnit(5, id)`로 처음 나온 유닛을 쓰고(거리 안 봄), 멀면 그 유닛까지 다시 걸어가 클릭한다. type 5 `useUnit` 호출은 `moveToExit` 한 곳.
  - Pz-6 `useUnit` timeout의 `unit:` 좌표가 도착 자리와 같음. 도착부터 첫 timeout까지 67초(Pz-7 같은 구간 25초)라 Inner 출구까지 갔다가 되돌아온 것으로 추정(사이 trace 없음).
- **바꾼 것**(261102): `useUnit`에 인자 `exit`({x, y}, 생략 가능). 주면 같은 id 유닛을 `getNext`로 모두 보고 `exit`에 가장 가까운 유닛을 쓴다(기존 지역 변수 `spot`을 이 비교에 먼저 씀). `moveToExit` 계단 분기가 `currExit`을 넘김. 다른 호출부는 인자가 없어 그대로. 폴백(Stony Field·Jail 포털 합류)은 그대로.
- **검증 방법**: 위 지역에서 `[useUnit] timeout`의 `unit:` 좌표가 도착 자리인 사례와 `Area reversed`가 0인지. 다른 계단 이동에서 `useUnit` timeout·`moveToExit failed`가 늘지 않는지.

### 3-61. moveTo 재시도 초과 trace: 실패 뒤 호출부가 오류를 던지거나 진행 불가가 되는 사례 리뷰 (`Pather.moveTo`, 사용자 261102)
- **문제**(사용자): `moveTo`가 실패로 끝나면 false를 돌려주는데, 이것이 호출부에서 오류를 던지거나 더 진행할 수 없는 상태가 되는 경우가 있는가.
- **확인된 것**(코드): `moveTo`는 경로 재계산 횟수가 `retry`(생략 3)에 닿으면 멈추고, 목표 5칸 밖이면 false를 돌려준다. trace는 없었다(머리 위 `move retry N`만). AutoSmurf `moveTo` 호출 retry: 3 65곳, 생략(3) 30곳, 5 34곳, 10 13곳, 15 6곳(261102 코드 읽음).
- **바꾼 것**(261102): `fail >= retry`로 멈추는 자리에 trace `[moveTo] retry N over -> x,y in 지역 dist:D`(새 변수 없음).
- **검증 방법**: 줄이 찍힌 시각 뒤 같은 프로필의 `[Error]`·`[Quit]`·`X failed:` print·desync·30분 시간 초과를 이어 보고, 그 호출부 코드가 false를 받으면 throw하는지·반복이나 대기에 갇히는지 본다. 특정 호출 자리·지역에 몰리면 그 호출의 retry 값과 실패 처리를 검토한다. 흩어지기 이동(`moveTo(me.x, me.y, 3, …)`)에서도 찍힐 수 있다. 제거 조건: 한 사이클 리뷰를 마치면.


### 3-62. nip 점수식 통일·무기 타입·줄 끝 주석 삭제 (`nips/*.nip`, 사용자 261102)
- **바꾼 것**(261102, 내용은 `docs/code/nips.md` 261102): 빌드 nip 11개 헬름·목걸이를 X.nip 양식(순서·공통부)으로, 직업 전용 방어구 4종 공통부·`[fhr]/2`·`[fcr]/2`, 무기 12개 파일 타입(공통 8종 + 직업 전용)·양손 거르기(바바리안 `[mindamage] > 0`, 나머지 `[secondarymindamage] == 0`)·tier 11~30 `[fcr]/2`(A `[ias]/2`)·공통부, `[FCR]` → `[fcr]`, 규칙 줄 뒤 주석 삭제(T·Y·Z `[Runeword]` 제외), V.nip `[armg]` → `[mercarmg]`. 사용자 업로드(X·A.TRAP·M.BOWF·V 양식, 빌드 이름 변경)는 같은 묶음.
- **검증 방법**: ① nip 로드 오류 0(ScriptErrorLog·회색 콘솔 `Error`·trace `[Error]`). ② tier 11~30 구간에서 양손무기를 끼지 않고 한손무기는 계속 바꿔 끼는지(print `equipped:`, 8프로필), 바바리안은 순수 양손무기를 끼지 않는지(`[mindamage] > 0` 전제 확인). ③ 공통부 변경으로 헬름·목걸이·직업 전용 방어구 tier가 이상하게 오르내리지 않는지(`equipped:` tier 값). ④ 용병 인사이트 베이스: 용병 무기 tier가 11(에테리얼 12) 미만일 때만 줍는지(ItemLog `(MercArmG<11)` 표시 줄).
