# 인수인계

새 대화는 이 문서부터 읽는다. 절과 흐름은 `CLAUDE.md` 5절을 따른다.
- 1절 `진행 여부 대기`: 문제(사례) / 확인된 것 / 판단에 필요한 것
- 2절 `구현 검토·수정 대기`: 확인된 것 / 가설 / 구현안(대상 함수, 수정 규모) / 검증 방법
- 3절 `인게임 검증 대기`: 바꾼 것(커밋) / 검증 방법 / 결과(로그 묶음별)
- 흐름: 1 → 2(진행 결정) → 3(수정 완료) → 코드 노트(검증 통과). 3 검증 실패는 실패 사례를 붙여 2로. 기각은 `rejected.md`. 같은 내용은 한 항목에만, 옮길 때 `옛 N-N`. 지운 번호는 다시 쓰지 않는다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

**마지막으로 분석한 로그**: 261029 묶음(10/28 15:55 ~ 10/29 12:20, 8프로필 각 109게임, main 10/28 15:48까지 + 실행 중 nip 업로드, 아시아 서버), `log_results.md` 261029. 20:46~20:53(Pz-35~37)은 사용자 PC 부하(다른 컴파일 작업)로 제외. **다음 사이클**은 3-43 2단계(`59bf6c8`), 3-50 random 복원(`f23417c`), 3-51 피겨린 파티 사냥·포털 리셋이 들어간 코드로 돈다.

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

### 1-18. 칸 옮기기(MoveToSlot)에서 아이템 유실 (`Storage` MoveToSlot, `AutoSmurf.start`, 사용자 261029, 옛 3-17·1-6)
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

### 1-19. 대기 자리에 와 있는데 okCount 미도착 (`AutoSmurf.okCount`, 사용자 261029)
- **문제(사례)**: 261029 — a3 Chaos Sanctuary 4게임(10/29 04:38·06:09·09:31·12:15, 퇴장한 프로필과 4~27칸, 그 앞 150초 a3 trace 줄 없음, 06:09만 87초 전 `Town check (direct)` 다녀옴), a6 Pz-27 Travincal(10/28 19:41, 120초 전 `Town check (direct)` 다녀온 뒤). 261027에도 같은 모양(Pz-103 a3 Ancient's Way, Pz-117 a6 Catacombs 4).
- **확인된 것**: okCount 보내기는 `sendCopyData` 한 번, 결과 확인·재전송 없음(261027 코드 읽음). 지금 로그로는 보내지 않았는지·유실됐는지·단계가 어긋났는지 모름.
- **결정**(사용자 261029): 한 사이클 더 본다. 그래도 나오면 어디서 빠지는지 검증 방법을 세운다.

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

### 3-10. 라다먼트 `radamentOff`·`forceTombs` (`AutoSmurf.radament`·`tombs`)
- **바꾼 것**
  - 261021 `ab94751`: N+1 `Radament book reset` 직전 리더 캐시 `radamentOff = true`. N+2 리더가 라다먼트 차례에 읽고 지운 뒤 콘솔 `Radament off: tombs, quit at 10 min` → `me.maxgametime = 10분`(엔진이 게임 시작부터 10분에 나감, 다음 게임에 default.dbj가 원래 값으로) → tombs 한 번. 라다먼트 차례엔 써모너가 끝나 리더는 캐니언 WP가 있고, 없는 팔로워는 리더 포털로 들어감. D2BS는 게임 단위 퀘스트 상태(완료 불가)를 읽는 함수가 없어 캐시 표시로 함.
  - 261022 사용자 `8a7ff56`: N+2의 tombs는 `partyLevel(tombsLvl)`이 참이면 바로 break해 아무것도 안 했다 → `tombs(force)` 인자, 메시지 `forceTombs`(팔로워 `forceTombs` 플래그 → `tombs(true)`), 리더는 라다먼트 꺼짐 때 `forceTombs`를 보내고 `tombs(true)`.
- **검증 방법**: 북 분실 뒤 N+2 게임에서 콘솔 줄과 10분 퇴장, tombs가 실제로 돈다(구간 헤더 `=== [TOMBS] ===`와 이동 줄), N+3에서 북 획득.
- **결과**: 261024 케이스 미발견 — 북 분실 0(북 24게임 모두 visible → read). 사유: 일어나는 조건(북 분실)이 없었음. 더 봄.
  - 261025 케이스 미발견 — `radamentOff` 0, 북 24게임 모두 visible → read. 더 봄(사용자 261025).
  - 261026 케이스 미발견 — `radamentOff` 0, 북 24줄 모두 visible → read. 케이스가 나올 때까지 계속 관찰(사용자 261026).
  - 261027·261028 케이스 미발견 — `radamentOff` 0, 북 24줄씩 모두 visible → read.
  - 261029 케이스 미발견 — `radamentOff` 0, 북 24줄 모두 visible → read.

### 3-13. 라다먼트 북 버리기 (`AutoSmurf.start`, `dropping radament book`)
- **바꾼 것**(`47816e6`): 시작 단계 북 버리기 무한 루프 수정. 버릴 때마다 trace `dropping radament book`.
- **검증 방법**: 북을 가진 채 시작한 게임에서 이 줄 뒤 정상 진행(무한 반복 없음). 확인 뒤 줄 삭제.
- **결과**: 261024 케이스 미발견 — `dropping radament book` 0. 사유: 북을 가진 채 시작한 게임이 없었음. 더 봄.
  - 261025 케이스 미발견 — `dropping radament book` 0. 더 봄(사용자 261025).
  - 261026 케이스 미발견 — `dropping radament book` 0. 케이스가 나올 때까지 계속 관찰(사용자 261026).
  - 261027·261028 케이스 미발견 — `dropping radament book` 0.
  - 261029 케이스 미발견 — `dropping radament book` 0.

### 3-29. useUnit 계단 클릭 앞 대기를 `me.attacking` 게이트로 (`Pather.useUnit`, 옛 2-19·3-20 다음 단계)
- **바꾼 것**(261024 `be4f0e2`): 계단(type 5) 클릭 앞 고정 `delay(600)` → 시전 중(`me.attacking`)일 때만 최대 600ms 대기. 걷는 캐릭터·시전이 끝난 경우는 기다리지 않음. 근거: `teleportTo`는 목표 거리 안에 들면 시전 동작이 끝나기 전에도 true를 돌려준다(코드 읽음). 옛 3-20(고정 600ms)의 효과: 261023 timeout 34줄(261022 묶음 2 414줄), 261024 42줄, 8회 모두 실패 0.
- **검증 방법**: `[useUnit] timeout` 줄 수를 261023(34)·261024(42)와 비교, 8회 모두 실패 0인가. 크게 늘면 600ms 효과가 시전 때문이 아니었던 것(가설 틀림) → 고정 600ms로 되돌림.
- **결과**: 261025 실패 기준에 해당 — timeout 283줄(a1 210줄·145회, 걷는 프로필 a2~a8 73줄, 261023 걷는 프로필 19줄). 많은 곳 a1 Worldstone Keep 2→3층 22회·3층→Throne 14회. 걷는 프로필은 바뀐 뒤 기다리지 않는데 함께 늘어 600ms 효과가 시전 때문만은 아니었던 것으로 보임(추정). 8회 모두 실패 2건은 게이트와 무관(a1 Pz-14 Lut Gholein → 궁전 `dist:21` 그대로 도달 못 함, a1 Pz-47 Tal Rasha's Tomb → 두리엘 방 오브젝트 type 2). 로그로 모르는 것: 텔레 직후 `me.attacking`이 참이 되는지. 한 사이클 더 보고 같은 결과면 고정 600ms로 되돌리는 것을 재검토(사용자 261025). 로그 변경 없음(대기 ms를 붙여도 결론이 같은 재검토로 감).
  - 261026 timeout 275줄(a1 215, 걷는 프로필 60), 8회 모두 실패 2(a1 Spider Forest → Spider Cave, Flayer Dungeon 1 → 2, 둘 다 다시 불러 통과) — 261025와 같은 수준. **보류**(사용자 261026): 핑 관련이 높아 보이고 계단(층 변경) 대기가 길어 보이는데, 지금 테스트 서버가 아시아가 아니라서인 것으로 봄. 아시아 서버 결과로 다시 본다.
  - 261027 timeout 526줄(a1 461, 걷는 프로필 75), 8회 모두 실패 3줄(a1 Black Marsh → Forgotten Tower). 261028 260줄(a1 198, 걷는 프로필 62), 8회 모두 실패 0. 두 묶음 모두 핑 150~340(아시아 서버 아님) → 보류 유지.
  - 261029(아시아 서버, 핑 16~94) timeout 45줄(a1 16, 걷는 프로필 29), 회차 0 40·1 5, 8회 모두 실패 0 — 261023(34)·261024(42, 고정 600ms)과 같은 수준. 아시아 서버에서 고정 600ms는 돌려 보지 않음.

### 3-35. default.dbj 시작부 오류를 멈춤으로 (`default.dbj` main, 사용자 261026, 옛 2-24)
- **문제**: `Config.init`·`Runewords.init`·`Cubing.init`(default.dbj main, `Loader.init` 앞)은 try 밖이라 여기서 오류가 나면 default.dbj만 죽고 trace·콘솔에 아무것도 남지 않은 채 게임이 최대 게임 시간(30분)까지 서 있다.
- **확인된 것**: 261026 로그 10/25 13:57~16:18 Pz-4~8. 용병이 있는 a1·a4·a5·a6이 게임마다 d2bs 로그에만 `[Error] Code(22) … misc.js:2269 TypeError: [].forEach is not a function`(3-32 후속 수정 2의 오류)을 남기고 멈춤 → 5게임 × 30분. 콘솔은 플레이 시간 요약뿐(퇴장 사유 줄 없음). 나머지 프로필은 120초 뒤 `Party desynced 1`. 다시 시작해도 같은 코드라 복구되지 않는다.
- **결정**(사용자 261026): 이 구간의 오류는 재시작이 아니라 멈춤(`D2Bot.stop`, CLAUDE.md 4절 멈춤 = 빨강 콘솔 + trace)으로 뺀다.
- **바꾼 것**(261026 `d87cfcb`): `default.dbj` main의 `Config.init`~`Cubing.init` 5줄을 try로 감싸고, catch에서 `Misc.errorReport(e, "default.dbj")`(회색 콘솔 + `[Error]` trace) → 빨강 콘솔 `Init failed in default.dbj. Stopping`(위치 없음) + trace → `D2Bot.stop()` → `return false`.
- **검증 방법**: 시작부 오류가 나면 빨강 `Init failed … Stopping`과 매니저 멈춤(30분 서 있지 않음).
- **결과**: 아직 없음.
  - 261027·261028 케이스 미발견 — `Init failed` 0, 시작부 오류 없음.
  - 261029 케이스 미발견 — `Init failed` 0.

### 3-38. 소켓용 완성 보석 큐빙 (`Cubing.buildRecipes`·`buildLists`, `Town.socketGems`, 사용자 261026, 옛 2-27)
- **문제**: 소켓 설정(`Config.SocketRecipe`)에 완성 보석을 넣어도 흠 없는 보석 3개를 모아 완성 보석을 만드는 연결이 없다(소켓 줍기와 큐빙은 별개).
- **확인된 것**(코드 읽음): 큐빙 결과물은 인벤토리로 감(`Cubing.emptyCube`). `Town.stash`는 판정 1~3이나 큐빙·룬워드 보관 대상(`keepItem`)만 보관함으로 → 다른 레시피(펀치 등) 재료로 잡힌 완성 보석은 보관함으로 가고 `socketGems`(인벤토리 보석만)는 못 쓴다. `clearInventory`는 판정 0·4만 버리거나 팔아 소켓 보석(판정 5)은 남는다. `me.findItems`는 엔진이 넘겨주는 순서의 배열(정렬 없음, `Prototypes.js`). `socketGems`는 큐빙 목록을 갱신하지 않는다(처음부터 없음). 보관함 보석은 보존하고 소켓에 쓰지 않는다(사용자).
- **바꾼 것**(261026 `d87cfcb`): ① `buildRecipes`: `Config.SocketRecipe`에 완성 보석 번호(561·566·571·576·581·586·601)가 있을 때만 흠 없는 보석 3개 → 완성 레시피 추가(새 속성 `Socket`). 보석 종류 번호(아무 등급)는 대상 아님. ② `buildLists`: 완성 보석별 "그 번호를 받는 빈 소켓 수 − 인벤토리 보유 수"만큼 인벤토리 완성 보석을 다른 레시피 후보에서 빼고, 0 이하이면 소켓 레시피를 건너뜀(줍기 안 함). ③ `socketGems`: 넣은 것이 있으면 끝에서 `Cubing.update()`. (261026 사용자 `30c9b4e`) `Config.Cubing`일 때만 부름 — 큐빙이 꺼져 있으면 `Cubing.init`이 레시피를 만들지 않아 갱신할 것이 없다. 수정 `libs/Cubing.js`·`libs/Town.js`.
- **검증 방법**: 빌드가 `Config.SocketRecipe`에 완성 보석 번호를 넣은 경우에만 해당. 빈 소켓이 있을 때 ItemLog `Ingredient` 흠 없는 보석 → `Transmuted` 완성 보석 → 콘솔 `[Socket]`·ItemLog `Socketed`. 소켓이 찬 뒤에는 그 흠 없는 보석 `Ingredient`가 없어야 한다. 지금 빌드 설정에는 완성 보석 번호가 없음(`Config.js` 기본은 종류 번호) → 설정을 바꾼 뒤부터.
- **결과**: 아직 없음.
  - 261027·261028 케이스 미발견 — 소켓 설정에 완성 보석 번호 없음(`Config.js` 기본값 종류 번호, 빌드에서 바꾸는 곳 없음).
  - 261029 케이스 미발견 — 같은 이유.

### 3-43. 듀리엘 첫 포탈 못 탐: 써모너 일지 전원 1회 읽기(1단계) → 듀리엘 시작 때 Atma 대화(2단계) (`AutoSmurf.summoner`·`duriel`, 사용자 261028·261029)
- **문제**(사용자 관찰): 듀리엘에서 일부 팔로워(간헐적으로 1명 또는 여럿)가 오리피스 무덤 포탈(첫 포탈)을 못 탄다. 퀘스트 창은 캐니언 웨이를 찍고 마을에 오면 끝나 있는데도 못 타고, 그때 멈추고 수동으로 NPC 대화를 하면 탈 수 있다. 일지를 직접 읽지 않은 프로필로 추정(사용자). `quest_flags.md` 12번 bit0(일지 조작 = 2막 파티원에게도 설정)과 다른 결과다.
- **확인된 것**(코드): 써모너 일지 반복은 46번 포탈이 이미 있으면 바로 끝나 리더가 연 뒤에는 팔로워가 일지를 누르지 않았다. 261027 Atma 대화는 무덤에 들어간 뒤(두리엘 방 포탈 대기 전)라 첫 포탈과 무관했다.
- **바꾼 것**(261028 `dfc884b`): `summoner` 일지 반복 앞에 일지 1회 누르기(포탈 유무 무관). `duriel` 팔로워 Atma 대화 삭제.
- **검증 방법**: 못 탄 팔로워는 마을에서 끝없이 기다리므로 리더의 구멍 앞 okCount에서 DURIEL 구간 `Party desynced`와 그 프로필의 `party has left … town:true`가 남는다. 이 사례가 없어지면 일지가 원인. 그대로면 2단계(리더가 무덤에 도착한 시점에 NPC 대화).
- **바꾼 것 2**(261028, 판별 trace): 일지를 누른 뒤의 대기(`me.ping * 2 + 1000`)를 같은 시간 동안 10ms마다 `getIsTalkingNPC()`를 보는 대기로 바꿈(대사는 끊지 않음, 동작 같음). trace `[Summoner] journal: dialog at Nms dist:D` / `no dialog dist:D` / `none`(일지 유닛 없음). 퀘스트 플래그(12번 bit0)는 파티원에게도 켜져 직접 읽었는지 가르지 못하므로, 그 프로필 화면에 일지 대사가 떴는지(상호작용 성공)로 본다. 근거: 260929 `[OD]` a8 일지 대사가 누른 뒤 약 922ms에 떠서 약 78ms 만에 닫힘(`crash_analysis.md` 유형 B, 관찰 1건). 새 지역 변수 `tick`·`talked`.
- **판정**: DURIEL 실패 프로필의 그 게임 써모너 줄이 `dialog at`이면 읽었는데도 못 들어감(가설 틀림) → 2단계. `no dialog`·`none`이면 못 읽음(가설 맞음) → 일지 앞으로 다가가 누르게 고침. 제거 조건: 실패 1건 판정, 또는 두 사이클 실패 0.
- **결과**: 261029 **1단계 실패**(사용자 확인) — DURIEL 구간 desync 2게임, 빠진 프로필은 모두 Lut Gholein에 남음.
  - Pz-53(나이트메어, 10/28 23:52): a3·a4·a6·a7. 그 게임 일지 줄 a3 `dialog at 94ms`, a4·a6·a7 `no dialog`. 통과한 a2·a5·a8은 `dialog at`.
  - Pz-72(헬, 10/29 03:47): a3. 그 게임 일지 줄 a3 `no dialog`, 통과한 a2·a4~a8도 모두 `no dialog`.
  - 노말(10/28 17:52 써모너, 4명 `no dialog`)은 두리엘 desync 0. 두 실패 게임 모두 다음 게임 DURIEL은 통과.
- **바꾼 것 3**(261029 사용자 `59bf6c8`, 2단계): `duriel` 시작(syncBO·마을 이동 뒤, 리더·팔로워 분기 앞)에 전원 `Town.move(NPC.Atma)` → `openMenu` → `me.cancel()`, 그 뒤 기존 대기(리더 웨이 앞 okCount, 팔로워 포탈 대기).
  - 같은 커밋에서 `summoner`의 판별 trace(`[Summoner] journal`)와 1단계 1회 누르기를 지우고, 일지 반복을 "누르기 → 46번 포탈이 있으면 끝"(최대 3번)으로 바꿈. 남은 지역 변수 `talked`는 261029 삭제.
- **판단**(사용자 261029): 노말은 써모너와 두리엘 사이에 tombs가 끼어 있어 대부분 그 사이 NPC를 이미 만난다. 나이트메어·헬은 써모너 뒤 다른 작업 없이 리더가 스태프를 구하고 라다먼트가 끝나면 바로 두리엘에 들어가 NPC 대화를 하지 않았을 수 있다.
- **검증 방법 3**: 다음 사이클 나이트메어·헬 DURIEL 같은 시점(리더 무덤 구멍 앞 okCount)에서 `Party desynced 1`과 빠진 프로필이 Lut Gholein에 남는 사례가 없는가.

### 3-50. moveTo 계열 random 복원·moveToUnit 프리셋 분기 random 전달 (`AutoSmurf` 여러 함수, `Pather.moveToUnit`, 사용자 261029)
- **문제**(사용자 지적): 261028 random 통일(`dfc884b`)은 `me.x + myX` 줄만 바꿔, 261002(`f7d9337`)에 오프셋만 뺀 `no offset` 줄(farmingCows followDriver 등)이 오프셋 없이 남았다.
- **바꾼 것**(261029 `f23417c`, PR #113):
  - `AutoSmurf` 44줄에 random 인자. ① `no offset` 14곳: farmingCows followDriver 5, cain 737 2, smith, tombs, mephisto, farmingMephisto, farmingAbaddon·POA·Infernal. ② 대기 중 복귀: duriel 오리피스(8칸 넘으면), baal 왕좌 대기 `15092,5028`. ③ 경로·집결: cathedral 2, andy 노멀 5, travincal 팔로워, seis 4(전원), infector·vizier 팔로워 각 2, baal 챔버 입장 뒤 `15134,5923`, farmingPit 6. ④ 오브젝트 접근: blood 무덤, cain 나무 2, cube 상자, duriel 오리피스 첫 도착.
  - `Pather.moveToUnit`: PresetUnit 분기에서 `pop`·`random`을 `moveTo`로 넘김. 전에는 버려져 프리셋을 넘긴 random 호출(anya 5365 `moveToUnit(프리셋 460, …, true)`, 261026)에 random이 적용되지 않았다.
  - 그대로 둔 것(사용자 결정): 다음 동작이 대화·상호작용인 이동(anya 물약 가진 사람의 앤야 접근, farmingSummoner 일지, duriel 티리얼, mephisto·farmingMephisto 빨간 포탈), okCount·teamCount(들어갈 때 자리로 복귀, 앞 이동의 random으로 충분), checkHydra·baal·diablo 직업별 자리, 리더 전용 이동, `Town.move`·`moveToExit`.
- **검증 방법**: 위 지점에서 팀이 한 칸에 겹쳐 서지 않는지(사용자 육안), 앤야 프리셋·듀리엘 오리피스에서 흩어지는지. trace·콘솔 `no random path -> x,y in 지역 reverting...` 줄의 지점과 수(막힌 오프셋 → 원래 좌표). 반복 안에 넣은 곳(followDriver, smith·tombs·Abaddon·POA·Infernal 거리 반복, duriel 오리피스 대기, baal 왕좌 대기)은 부를 때마다 오프셋 방향이 바뀌므로(`reflection`) 왕복·지연이 없는지.
- **결과**: 아직 없음.

### 3-51. 피겨린 파티 사냥·포털 리셋 (`AutoSmurf.eye`·`tome`·`travincal`·`portalReset`, Act 3 리더 흐름·팔로워 루프, 사용자 261029)
- **문제**: Travincal 뒤 `[Quit] Figurine incompleted`(261006~261028 묶음마다 1~6건). 피겨린이 나오는 곳을 찾으려고 Travincal을 반복.
- **확인된 것**(D2MOO 1.10f 복원 소스, 1.14d 미대조):
  - 지정: Act 3에서 유니크·챔피언·슈퍼유니크가 생성·복원될 때(`MONSTERUNIQUE_SpawnUniqueMonster` → `QUESTS_SetJadeFigurineBoss`) 자리가 비어 있으면 그 몹 하나가 지정된다. 날아다니는 몹(`monstats` flying)·기드빈 페티시 보스 제외, 게임당 1개. 지정 몹을 잡으면 100% 드랍(`ACT3Q4_Callback08_MonsterKilled`). 게임 만든 사람이 완료(bit0)·보상 대기(bit1)면 지정 없음, 잡은 사람(용병·소환수는 주인)이 완료했으면 드랍 없이 끝남.
  - 해제: 지정 몹의 방이 클라이언트 없이 12프레임 검사 11회(약 5.3초) 지나 해제(untile)되면 지정이 풀린다(`GAME_UpdateProgress` → `SUNITINACTIVE_CompressUnitIfNeeded` → `QUESTS_SetGoldenBirdSpawn`). **포털이 있는 방은 해제되지 않아** 그 방의 지정 몹은 계속 지정된 채 남는다(`DRLGACTIVATE_TestRoomCanUnTile`). 마을 밖에서 새 포털을 열면 옛 포털이 지워진다(`PLAYER_RemoveTownPortal`). Act 3가 아닌 몹은 지정 대상이 아니다.
  - 지역: Spider Cavern은 16×16 타일 방 약 4개(`lvlmaze`), 헬 보스 Sszark 포함 4~5(levels MonUMin/Max 4/5). 사원은 8×8 방 9칸, 헬 보스 2.
- **바꾼 것**(261029, 사용자 요청·승인):
  - `portalReset`(새 함수, `//SUPPORTING` 끝): Act 3 마을 포털 자리에서 자기 이름 포털(`Pather.getPortal(null, me.name)`)이 있으면 웨이포인트 46 → 포털만 열기 → 웨이포인트 75 → 6초 대기. 없으면 아무것도 안 함.
  - `eye(fig)`: 전원 `portalReset` → okCount. 리더가 Cavern 상자 근처에서 눈(없을 때만) → 포털 → `tpReady`, 팔로워는 `usePortal(85)`. 전원 `Attack.clear(10)` → `Attack.clear(25, getLocaleString(2868))`(Sszark, 번호는 blizzhackers/kolbot `LocaleStringID.js`, 2852·2875·22435 일치로 대조) → 피겨린 알림 → 포털 귀환. `fig` 없으면 기존 그대로.
  - `tome(fig)`: 전원 `portalReset` → okCount. 리더가 사원 도착 즉시 포털 → `tpReady`, 팔로워 `usePortal(94)`. 전원 걷기로 `moveToPreset(94, 2, 193, 0, 0, true)` 최대 10회(경로 재시도 3 → 최대 30). 책·Alkor는 처음 1회만(리더). 이동 실패는 기존과 같은 throw. 피겨린 알림 → 포털 귀환.
  - `travincal`: Cain 대화 앞에 `portalReset`.
  - 리더 Act 3 순서: heart → brain → eye → tome → travincal. `!getQuest(20,0) && !figurine`이면 `figurineEye`·`figurineTome` 신호 + `eye(true)`·`tome(true)`, 뒤에 `figurine`이면 바로 `this.figurine()`. 아니면 기존 조건으로 `eye()`·`tome()`.
  - 팔로워 루프: `figurineEye`·`figurineTome` 플래그로 `eye(true)`·`tome(true)`. 팔로워도 두 함수 맨 앞의 `doChores`를 탄다.
- **검증 방법**: `Figurine incompleted` 수. 콘솔 `=== FIGURINE ===`이 Travincal 전(EYE·TOME 뒤)에 나오는지. `portalReset` 뒤 okCount에서 `Party desynced 1`(missing(okCount))이 늘지 않는지. eye(true)에서 Sszark가 범위 25 안에서 잡히는지(사용자 육안). 사원 걷기 이동이 10회 안에 제단에 닿는지.
- **결과**: 아직 없음.

### 3-52. 스태틱 필드 로직 통합 (`Sorceress.js` `doAttack`·`doCast`, `Attack.setPosition`·`checkResist`, `Config.js`, S.SFFW·S.FIRE, 사용자 261029)
- **문제**(사용자): 스태틱이 두 경로로 나뉘어 있었다. ① 컨피그 선시전 루프(`CastStatic` %까지 스태틱만 반복, `StaticList` 대상만, 빌드는 노멀 보스 6만) ② 어택스킬 칸 42(`checkResist`의 42 게이트가 `CastStatic`으로 % 판정, `CastStatic`이 `false`인 나이트메어·헬은 "HP% > 0"이라 % 없이 계속 씀).
- **확인된 것**: 스태틱 반경 mpq `skills.txt` `aurarangecalc = ln12`, Param1 5·Param2 1 → 레벨 + 4(좌표 거리). 게임 화면 야드 = × 2/3(Might·Resist Fire·Holy Shock의 ln12 값과 위키 야드 대조). 텔레 도착 판정은 `teleportTo`의 `maxRange`(기본 5), `setPosition`의 `minDist`는 걷기에만 쓰였다.
- **바꾼 것**(261029, 사용자 요청·승인):
  - `Sorceress.js` `doAttack`: 선시전 루프 삭제. 언타임드를 고른 뒤·로우마나 판정 앞에서 `CastStatic === true`, 스태틱 습득, 대상(`StaticList`가 비면 전체, 아니면 이름·classid 일치), 번개 면역 아님(`checkResist(unit, "lightning")`), `unit.hp × 100 / 128 > (보스 ? StaticBossHP : StaticHP)[me.diff]`이면 `untimedSkill = 42`. 보스 = `index === 1`(`spectype & 0x7`, 어택스킬 보스 칸과 같은 판정). 타임드는 기존 어택스킬 그대로라 `doCast`가 타임드(딜레이 없을 때) ↔ 스태틱을 번갈아 쓴다. 스태틱을 쓰는 동안 기준 거리 = min(타임드 사거리, 레벨 + 2).
  - `doCast`: 언타임드가 42면 타임드·언타임드 두 `setPosition`에 도착 오차 2.
  - `Attack.setPosition`: 호출부가 `minDist`를 넘기면 텔레(`teleportTo`)에도 도착 오차로 넘긴다(안 넘기면 5 그대로). 레벨 + 2와 오차 2로 실제 거리 ≤ 레벨 + 4.
  - `Attack.checkResist`: 42 게이트(`// Static handler`) 삭제.
  - `Config.js`: `CastStatic` = `true`/`false` 스위치. 새 키 `StaticHP: [25, 33, 50]`(일반), `StaticBossHP: [10, 33, 50]`(보스), [노멀, 나이트메어, 헬].
  - S.SFFW: 18레벨 노멀 `CastStatic = true`(보스 6 리스트 유지). 46레벨 `AttackSkill = [-1, 51, -1, 51, -1, -1, 43]`, `CastStatic = true`, `StaticList = []`(전 난이도 전체).
  - S.FIRE: 6레벨의 주석 블록(옛 `CastStatic` %) 삭제, 46레벨 `CastStatic = true`, `StaticList = []`(세부 조정은 사용자).
- **검증 방법**: S.SFFW 46레벨 이상에서 스태틱 → %(노멀 일반 25·보스 10, 나이트메어 33, 헬 50) 도달 뒤 파이어월·텔레키네시스로 넘어가는지, 스태틱 사이에 파이어월(타임드)이 나가는지, 번개 면역 몹에 스태틱을 쓰지 않는지(사용자 육안). 스태틱이 사거리 밖에서 나가는 미스캐스팅이 없는지(낮은 스킬 레벨). trace `[teleportTo failed]` 수가 늘지 않는지(도착 오차 2). 노멀 18~45레벨 보스 6에서만 스태틱.
- **결과**: 아직 없음.
