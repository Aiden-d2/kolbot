# 로그 분석 지침 (Claude 작성 261020)

다른 대화에서 사용자가 올린 로그를 분석할 때 따르는 지침이다. 먼저 `CLAUDE.md`(작업 규칙, 로그 규칙)와 `handoff.md`를 읽는다. 분석 결과는 `docs/log_results.md`에 묶음마다 쌓는다.

**로그 분석은 handoff 3절(인게임 검증 대기)부터 검증하고, 항목마다 판정과 다음 할 일을 정해 handoff를 정리하는 데까지가 끝이다**(6절, 사용자 지시 261024).

---

## 1. 작업 규칙 (CLAUDE.md 요약, 분석에 해당하는 것)
- **본 것만 판정하고, 가설·판별 기준·다음 할 일 없이 로그를 제안하지 않는다**(CLAUDE.md 작업 규칙, 사용자 지시 261020). 줄 개수만 센 것은 검증이 아니다.
- **분석·보고만 한다.** 코드는 사용자가 "수정해/반영해/적용해/고쳐"라고 분명히 말할 때만 고친다. 결정(채택, 그렇게 가자)은 수정 요청이 아니다.
- 확실한 것만 말한다. 추정은 추정이라고 밝히고, 근거(로그 줄, 시각, 프로필, 게임 이름, 코드 줄)를 붙인다.
- 새 변수·함수·인자·로그를 만드는 제안은 그 항목을 밝혀 승인을 받는다. 결정 목록에는 사용자가 정한 것만 올리고 Claude 제안은 "제안"으로 따로 적는다.
- 사용자가 다루지 않은 항목을 정리 목록에 끼워 넣지 않는다. 질문 범위 안에서 답한다.
- 판정은 "다음 할 일" 기준으로 나눈다: handoff 3절은 확정 / 실패 / 케이스 미발견 / 알 수 없음 / 이번 로그에 적용되지 않음(6절 2), 그 밖 관찰은 결과 나옴 / 상황 없음 / 원인 못 찾음.
- 노트 커밋 시점은 CLAUDE.md 1절을 따른다(확정 사항이 생기면 커밋, 확정되지 않은 것은 쓰지 않음).

## 2. 받을 데이터와 준비
| 파일 | 위치(게임 PC) | 용도 |
|---|---|---|
| trace | `kolbot/_cache/trace/trace-<프로필>-<YYYYMMDD>.txt` | 분석의 중심. 프로필별·날짜별 |
| d2bs 로그 | D2BS 로그 폴더 | `print` 진행 기록, 엔진 오류(`Error in ...`), `[Chicken]` print, `enchant:`, 콘솔 줄(`[console] 내용`: 조기 종료 사유, 치킨·사망, 오류, 경험치 줄, 게임 밖 줄) |
| ItemLog | `kolbot/_cache/ItemLog.txt` | 줍기·구매·판매 |

- 매니저 콘솔은 받지 않는다(사용자 261024). 콘솔 줄은 d2bs 로그의 `[console]` 줄로 본다(261021~). 261024 묶음에서 콘솔 복사본과 `[console]` 줄이 내용 기준 1:1로 맞았고, 콘솔에만 있던 줄은 매니저가 찍는 크래시 줄(`Window has unexpectedly exited`) 하나였다. 색은 어느 쪽에도 남지 않으므로 줄 내용(4-8 정상 종료 판정)으로 가른다. 이 문서의 "콘솔 `…`" 줄은 모두 `[console]` 줄에서 찾는다.
- 크래시: d2bs 로그의 `Crash: 스크립트 지역 - wait Ns (loc N)`(매니저가 크래시 정보를 남겼을 때) 또는 엔진 재시작 줄(`D2BS Engine startup complete`, 앞 번호가 바뀜). 크래시 때 하던 일·위치는 재시작 직전의 trace·d2bs 마지막 줄로 본다.

- 이전에는 사용자가 `log` 브랜치 `logs/`에 올렸다. 위치를 사용자에게 확인한다.
- **어느 코드로 돌았는지 먼저 확인한다.** 사용자에게 main 커밋(또는 업로드 시각)을 묻고, 실행 중에 코드가 바뀌었는지도 묻는다(261006 분석 때 실행 중 바뀌었다). trace 형식으로도 시기를 가를 수 있다(3절).
- 분석은 Python으로 trace를 게임·구간·지역·프로필 단위로 묶어 센다(외부 데이터는 별도 폴더, `python3 -I`). 스크립트는 scratchpad에만 둔다.

## 3. trace 형식 (시기별)
| 시기 | 줄 형식 |
|---|---|
| 261011 이후 | `[MM/DD/YY HH:MM:SS] 내용 (지역 x,y)`. 게임 밖은 `(OOG loc N)`. `Misc.trace(msg, true)`인 줄은 위치 없음: 게임 경계, 구간 헤더, `[Error]`, `party has left`(261020 전 로그에는 `[Quit] stopDefault`도) |
| 261001~261010 | `M/D H:M:S [지역 x,y] 내용`(0 채움 없음), 게임 밖 `[OOG loc N]` |

- 게임 경계: `=== [게임이름] ===`(261011 이후), 예전 `=== game 이름 ===`. 이 줄로 게임 단위를 자른다.
- 구간 헤더: `=== [ANDY] ===` 등. 리더 콘솔에도 `=== ANDY ===`(구간 끝, 금색).
- 줄 시계는 초 단위다. 초 미만 순서는 같은 파일 안의 줄 순서로 본다. 프로필 사이 비교는 PC 시계가 같다는 전제(같은 PC).
- 위치 `(지역 x,y)`는 그 줄을 찍은 순간의 위치다. 이동을 **시작한** 줄의 좌표를 그 시각의 위치로 읽지 않는다(걷는 중을 멈춤으로 읽은 적이 있다).

## 4. 관찰 로그와 목적, 판정 방법

### 4-1. 보스가드·시체 회수 (261020 형식)
목적: 치킨 %(보스가드 pct)가 적정한가. 치킨이 꺼져 있던 시간과 그동안의 사망·치킨.
- 줄(`AutoSmurf.js` `bossGuard`·`traceGuardSeen`·`bossEnd`):
  1. `bossGuard on: 15%` — 가드 시작(호출 값)
  2. `bossGuard found: 이름 HP%` — 아무 보스나 처음 본 스캔. 이 시각이 0초
  3. `bossGuard chicken off: 이름 HP%@초` — HP ≤ pct가 된 스캔. found부터 초
  4. `bossGuard last: 이름 HP%@초` — bossEnd 시작에서 찍음. 마지막 보스의 마지막 발견, found부터 초. 보스가드 off를 겸함
  5. `bossGuard chicken on: N%` — 치킨 복구(산 사람 첫 okCount 뒤 / 죽은 사람 부활 직후)
  - 시체 회수(죽어 있던 프로필): `revive start`(줄 끝 위치 = 죽은 지역·좌표) → 5번 → `corpse picked`. 실패는 `[Quit] Revive failed: Ns / Corpse portal not found: area N / Failed to get corpse: not seen·far N·died·timeout`
- 일어나지 않은 사건은 찍히지 않는다: 치킨 off가 없으면 3·5번 없음, 보스를 못 보면 2~4번 없음.
- **치킨이 꺼져 있던 시간 = 4번 @ − 3번 @.** 보스별·난이도별·직업별로 분포를 낸다.
- 보스와 pct(호출 줄): 앤디 15, 라다먼트 85, 써모너 100(발견 즉시 → 3번 `@0.0s`), 메피 15, 이주얼 15, 디아 15(`!getQuest(26,0)`), 쉥크 50, 에인션트 10(살아 있는 고대인 2마리 이하일 때), 바알 15(`!getQuest(40,0)`). 파밍(퀘스트 완료 뒤)에는 가드가 안 켜진다.
- 에인션트: 2번은 처음 본 고대인, 4번은 마지막으로 본 고대인.
- 읽을 때 주의:
  - 4번은 실제 킬보다 스캔 한 번만큼 이르다(스캔 간격은 직업마다 다름, 해머딘 1.5~2초 추정).
  - 보스전 중 죽었거나 타운치킨(`TownHP`, 가드 중에도 켜짐)으로 마을에 다녀온 프로필은 그동안 스캔이 없어 4번이 킬보다 이르다. 같은 게임에 `revive start`·`Town chicken`이 있는지 본다.
  - 늦게 들어온 팔로워는 2번 HP%가 이미 낮다. 값은 "그 프로필이 치킨 없이 버틴 시간"으로 읽는다.
  - 치킨 off가 있어야 할 HP인데 3번이 없는 사례(못 켜진 사례)는 `log_results.md` 261006 보스가드의 못 켜진 13건처럼 표로 정리하고, 같은 시각의 3절(합류) 줄로 원인을 찾는다.
- **261020 이전 형식(이번 로그에 섞여 있을 수 있음):**
  - `bossGuard chicken off: pct N, 이름 HP%` — 261010~261019에는 뒤에 `@<큰 수>s`가 붙는데 계산 오류(절대 틱 − 상대 ms)라 무시한다.
  - `bossGuard seen: 이름 첫HP%@t0-끝HP%@t1, ... (end@초)` — 시각은 **가드 온 기준**. 가드 온 시각 = 이 줄 시각 − end. 치킨이 꺼져 있던 시간은 (가드 온 시각 + t1) − chicken off 줄 시각(초 단위 오차).
  - `bossEnd chicken back: N` / `bossEnd chicken stayed: N (boss never at pct)` / `bossEnd revive: start` / `bossEnd revived: Ns` / `bossEnd portal` / `bossEnd reopen portal` / `bossEnd corpse: at N` / `bossEnd corpse: picked`
- 판정할 것: 보스별 치킨 off HP%와 off→킬 시간 분포, 그 사이 사망·치킨 수(써모너 pct 100이 과한지, 쉥크 50, 에인션트 10·2마리), 시체 회수 성공률과 실패 사유. **pct 값 변경은 제안까지만.**

### 4-2. 치킨·사망 원인 (261006~261007)
목적: 치킨 순간 무엇에 맞았나, 치킨 뒤 사망(종료 지연), 타운치킨과 치킨의 관계.
- `[Quit] Life Chicken H/M` — 콘솔(빨강)은 `Life Chicken H/M (지역 x,y)`. 261021 전 로그는 뒤에 `| mode:N near: 이름 dN sN, ...`(내 모드, 30칸 안 몹 5마리)가 붙는다(261021 삭제, 사용자 결정).
- (261020 삭제) `[Quit] stopDefault Nms` — 261013·261020 로그 1,816건 0~344ms. 종료 지연 원인이 아님을 보고 삭제.
- `Town check` / `Town chicken` — TownChicken이 마을에 간 이유(TownCheck 조건 / HP·MP 조건). 예전 `Going to town`. 261021부터 default.dbj의 TownCheck는 `Town check (direct)`(멈춤 없이 직접 감, `visitTown start by:default.dbj`가 뒤따름).
- `visitTown start by:<스크립트> tick:` / `visitTown back tick:` — 누가(default.dbj / TownChicken) 언제 갔다 왔나.
- `goToTown take TP failed start tick: made:` — TP 실패 기록(추적은 중단됨, 실패 기록용).
- 콘솔 `You died in last game`(빨강) — 다음 게임 시작에 찍힘(사망한 게임은 그 앞 게임).
- 판정: `log_results.md` 261006 치킨과 같은 표(구간별 게임·치킨·게임당, 장소, 프로필), 치킨이 타운치킨 발동 몇 초 뒤인가, 지역 진입 몇 초 안인가(구간 헤더 기준. 261020 전 로그는 `usePortal ok`), near 몹 종류·거리.

### 4-3. 합류·동기화 (261006)
목적: 누가 어느 단계에서 늦었나. 보스가드가 못 켜진 원인(`log_results.md` 261006 못 켜진 13건의 2·3·4·13번: 코드상 설명 안 됨 / River of Flame 1분 기록 없음 / 원인 불명).
- (261020 삭제, 사용자 결정) `syncBO start/end`, `syncWP start/end`, `tpReady received`, `usePortal ok` — Claude가 261006에 합류 분석용으로 넣은 줄. 261020 전 로그에만 있다. syncBO는 노멀 조기 반환(`me.diff === 0`)에 end가 찍히지 않아 start만 있어도 멈춘 것이 아니었다.
- `usePortal failed target: owner: unit: pre: tick: tries:<시도:gid sent/click/none/dead@ms> portals:<gid/classid/주인/지역/좌표/mode/거리>` — 내 포털일 때만.
- `[Quit] Party desynced 1·2: missing(okCount|teamCount): 프로필, ... teamOk X`(261021~, 이름 수집) — 안 온 프로필. 그 프로필의 같은 시각 trace로 무엇을 하던 중인지 본다. 261021 전은 `okCount N teamCount N teamOk X`(개수).
- `relay N msgs`(261021, Claude 추가) — default.dbj가 멈춘 동안 받은 메시지를 ToolsThread가 넘김. 판정: `Town chicken` 뒤에 찍히고 그 게임에 desync가 없으면 동작. 제거 조건: 동작 확인. **261023 `0f6da09` 삭제**(검증 통과, 261023 이후 코드 로그에는 없음).
- `party has left: 이름`(위치 없음) — 퇴장할 때까지 100ms마다 반복될 수 있다(의도). 첫 줄만 센다.
- 판정: 늦은 프로필의 바로 앞 줄(무엇을 하던 중인가: 마을·`Town chicken`·포털 실패). 누가 okCount를 안 보냈는지는 지금 로그로 알 수 없다(사용자 수정 계획 0-11 okCount 대기 방식과 함께 다룸).

### 4-4. 이동·경로 (Pather)
목적: **아케인 등 getPath 오류(사용자가 따로 보기로 한 핵심)**, 텔레포트·유닛·웨이 실패.
- 빈 경로 처리(261020 최종): `moveTo no random path -> x,y in 지역 adjusting...`(random 오프셋 목표에 경로 없음 → 원좌표로) → `moveTo no path -> x,y in 지역 adjusting...` → `moveTo adjusted path -> x,y in 지역`(보정 칸으로 경로가 나왔을 때만) → `invalid path -> 내x,내y in 지역 random move...`(랜덤 걸음, 최대 10회, 10번째 실패면 `[Error] ... moveTo: Failed to generate path`). 앞 세 줄은 콘솔(기본색)에도 찍힌다(사용자 임시 확인용, 정상 종료 판정에서 조기 종료 줄로 착각하지 않는다).
  - **이 형식은 main `72a1980`(261020 15:40) 이후다.** 그 전 코드(261007~261020 오전)는 보정 조건·랜덤 걸음 괄호가 달랐다(`47816e6`에서 사용자가 고친 결함). 로그가 언제 코드인지 먼저 본다.
  - 아케인 사례 판정: 같은 좌표로 `moveTo no path`가 반복되는가, `adjusted`가 있는가, `invalid path`가 몇 번인가, 이를 부른 구간(써모너 `while (거리 > 10) moveToPreset` 등 탈출 조건 없는 루프, `handoff.md` 1-4)과 그때 위치. 목표 좌표가 다른 지역 것인지(261006에 8건 있었음), 보정 칸이 같은 칸인지.
- (261020 삭제) `moveTo entered town` — 5건 정상.
- throw 전파: 랜덤 걸음 10번째의 throw는 catch가 있는 호출부(바뀌기 전 써모너 while)에서만 다시 돌고, 없는 호출부(`usePortal → moveToUnit` 등)에서는 로더까지 올라가 게임이 끝난다(10/20 02:49 a7). 써모너 리더는 261020에 catch를 없애 게임 종료, 파밍 써모너는 `earlyReturn`으로 팀이 다음 구간으로(사용자 수정).
- `[SafeTele] teleportTo FAILED - safeNode:(x,y) dist:N` — SafeTele는 리더만 켜짐(261020). `SafeTele.Skip` 62·63·64·77·78·120·132.
- `[teleportTo failed] attempt:N dist: ping: area:`
- `[useUnit] timeout iter: dist: ping: area: id: target: unit:x,y`(id·target·unit 261021 추가) — 어느 출구 유닛을 잡았나. 261022 `482171b`부터 회차 0~7(8회), 계단 클릭 앞 600ms, 실패 뒤 유닛 기준 4방향 4칸 자리로 옮김(`docs/code/Pather.md` useUnit 261022). 판정: a1 timeout 수, 0회차 비율, 8회 모두 실패 건수. `id`는 LvlWarp `Id`(이름으로 어느 계단인지 알 수 있음, `log_results.md` 261022 묶음 2).
- (261022 삭제) `[exit] 26 -> 27 type: exit:x,y dest:x,y` — H1(Monastery Gate 동선). 좌표는 `handoff.md` 1-2.
- `[SafeTele] monsters N near M`(261021, Claude 추가) — 45 거르기로 빠진 몹 수. 제거 조건: 확인. **261023 `0f6da09` 삭제**.
- `[Quit] moveToExit failed: A -> B`(261021~, 기본색 콘솔) — 옛 `clearToExit` 무한 재시도 대신 한 번 실패로 퇴장. 261022 `482171b`부터 `AutoSmurf.exitTo`(3회 실패)도 같은 줄, throw는 `[Error] AutoSmurf.exitTo: ...`로 먼저 찍힘. 거리 while 3회 실패 사유: `Arcane portal not reached`, `Cube chest not reached`, `Tomb chest not reached`, `Radament chest not reached`, `Orifice not reached`, `Red portal not reached`, `Duriel chamber not entered`(`docs/code/AutoSmurf.md` exitTo).
- `[WP] wp.area: me.area: target: retry:`, `[goWP] Failed to reach WP after 10 attempts`, `[getWP] waypoint unit not found / menu not opened try:N`
- `makePortal late/existing portal used try:N gid:`, `makePortal cast again try:N`
- `ArreatSummit Gate`, journeyTo 경로(course 배열)
- 소울 게이트(261020): 헬 파밍의 아냐·바알에서 리더가 소울을 보면 `[Quit] Souls found in Anya` / print `Baal failed: souls found`(d2bs 로그). 바알은 `earlyReturn`으로 팀이 마을로.

### 4-5. 퀘스트
- 라다먼트 북(261004·261012): `dropping radament book`(게임 시작에 가진 북을 버림) / `radament gate: 9,0 9,1 9,5 book` / `radament atma: ...`(분실 뒤 리더 아트마 대화, N+1) / `radament book visible: true/false 9,5` / `!!! [BOOK] !!!` / `radament book read: 9,5 false`(false = 읽음). 실패: `[Quit] Radament quest item not found`(누가 못 봄), `[Quit] getQuestItem failed`(줍기 실패), `[Quit] Radament book reset`. getQuestItem 줄: `Trying to make room for 이름`, `Not enough room for 이름`, `<classid> not found`, (261021~) `quest item vanished, retry N` / `<classid> vanished`(유닛이 사라짐: 남이 주움 추정, 제거 조건: 발생 확인). 눈·심장·뇌는 `!!! [EYE|HEART|BRAIN] !!!`(261021~, trace·print). 261022 사용자 수정(`d8af14f`)부터 trace·print 없이 리더 콘솔만 `===EYE===`·`===HEART===`·`===BRAIN===`, 스태프는 `=== STAFF ===`(조건 `classid === 92`, `8a7ff56`).
- 라다먼트 꺼짐(261021~): N+1 `radamentOff set` → N+2 `radamentOff -> tombs` + 콘솔 `Radament off: tombs, quit at 10 min (지역 x,y)` → 10분에 엔진이 나감(퇴장 줄 없음). 제거 조건(set/read 줄): 확인.
  - 판정: 정상 경로(visible → read) 비율, 분실 복구 N+1(atma 9,0 true 9,1 false) → N+2(visible false, 퀘스트 꺼짐) → N+3(획득)이 실제로 이어지는가.
- (261020 삭제) `ancients loop` — 48/48 1회.

### 4-6. 마을·아이템
- 화살통(261014~261019, 활 직업 = M.HYBR): `interact closed`(상점 창이 열려 있어 스페이스로 닫음) → `not enough quiver: 장착 + 예비` → 3막 `equipQuiver moved` / 그 밖 `equipQuiver dropped`, `invQuiver dropped` → 3막 `equipQuiver sold`, `invQuiver sold`(Ormus에게 팔고 350개짜리로 되사기) → `equipQuiver`, `invQuiver`(구매 성공) → `equipQuiver N / invQuiver N`(결과). 판정: 구매 실패(결과 줄이 `no quiver`)·같은 게임 반복 방문.
- 골드 나눔(261010): 리더 골드 < 5000(18레벨 이상)이면 팔로워가 `Dropping N Gold`, 리더가 `Picking up N Gold`, 15초 안에 안 주우면 `Retaking N Gold`. 줄 안의 goldPile은 유닛 객체 문자열일 수 있다.
- 감정: `identify failed / slow: 이름 (scroll|tome, Nms)`, `identify stopped: no ID scroll`. (261020 삭제) `sold unid` — 13건 동작.
- 벨트 물약: `[MoveToSlot] 이름 FAILED slot: dropped: item:` — 옮기던 회복 물약이 커서에 남아 바닥에 버려짐(게임 시작, 원인 미결). `inv:` 필드는 261020 삭제: 실패 34건 중 33건 `closed`, 1건 `-`(집기 전에 아이템이 사라짐)였으나 `MoveToSlot`은 창을 열지 않아 성공도 `closed`일 것이라 원인을 가를 수 없음(성공 기록 없음). `[MoveToSlot] no room, dropped blocker`.
- (261022 `482171b`에서 바뀜) `chores slow: clearInventory|buyPotions Ns`(261021~261022 로그) → `chores Ns: pre heal id inv [npc:<NPC> 08/0C belt Ns/클릭 pots Ns/개수 cube Ns/n stash Ns/n left Ns/n] tome buy [npc Ns buys n shift n fail n] repair rest stash gems`(doChores 전체 10초 초과만, Claude 추가). `buyPotions: buy failed 코드 gold: columns:|buffer`(261021)는 그대로. 판정: 어느 단계가 긴가 — inv의 pots(물약 정리, 261022부터 마시기), belt 클릭 수, buy의 npc(상점 NPC까지 걷기·열기)와 구매 횟수·실패, 시작 시 NPC 메뉴(08)·거래창(0C). 제거 조건: handoff 3-27 판정 뒤 삭제 여부 결정. 261023 `0f6da09`부터 belt 뒤에 `cur 시도/실패 put N shift 시도/실패 ui 직전>직후 remain N`(handoff 3-27)이 붙고, 벨트 실패가 1건이라도 있으면 10초 미만이어도 찍힘. `ui`는 `08`(NPC 메뉴)·`01`(인벤토리 창), 없으면 `-`.
- `party accept: 이름`(261021, Claude 추가) — MoveToSlot 실패와 시각이 겹치는가. 제거 조건: 판정.
- `[Storage.MoveTo] retry / catch`, `moved from cube to drop/sell`, `[TK] talk skipped N npc:`(스페이스 20번 다 씀, 261006·261020에 각 1건, 모두 Greiz 20), `[hire] hiring retry (N/5)`.
- d2bs 로그 `enchant: 이름/classid`(S.SFFW 65레벨부터 아마존·2막 용병·발키리·섀도 워리어·그리즐리).

### 4-7. 게임 밖 (회색 콘솔 + trace `(OOG loc N)`)
- `Team wait: a3, a5 - wait`(리더, 팔로워가 5초 넘게 안 들어올 때), `Rest: N games - wait Nm`
- `Create account failed: 계정 "문구"` — 팝업 문구가 읽히는가(`(no text)`면 좌표가 틀림, 261006은 모두 `(timeout)`)
- `Create character timeout: 이름 - retry`(loc N), `Create character:`, `Character name taken`
- 로그인 오류, `Realm down`, `CDKey in use/flagged`, `Crash: 스크립트 지역 - wait`, `Join game failed`, `Create game failed`, `Game not found`, `Unhandled location`

### 4-8. 기본 기록 (관찰용 아님, 게임 흐름 파악에 씀)
게임 경계, 구간 헤더, `[Quit] 사유: 상세`, `[Error] 구간: 메시지 (파일 #줄)`, `Script ended`(조기 종료가 없을 때만), `boss not found: id`, `AttackSkill[N] not learned`, `!!! POTION/SCROLL/BOOK !!!`, `[Quit] High ping / Mana·Iron Golem·Merc Chicken`, `undefined item`, `[DBG] drop`, `Couldn't give the potion to merc`.
- 정상 종료 판정(CLAUDE.md): 경험치 줄 앞에 조기 종료 줄(검정, `(지역 x,y)`)·빨간 줄·`Error in` 줄이 없으면 정상. 단 4-4의 `moveTo ... path` 콘솔 줄(검정)은 조기 종료 줄이 아니다.
- 이유 없이 끝난 게임은 `log_results.md` 261006 "이유 없이 끝난 게임"처럼 분류한다(크래시, 마지막 게임, 30분 시간 초과, 매니저 일시정지, 원인 불명).

## 5. 이번 로그로 볼 확인 항목
확인 항목과 판정 방법은 `handoff.md` 3절에 항목마다 있다. 로그로 볼 줄은 아래와 같다.
| handoff | 항목 | 로그 |
|---|---|---|
| 3-22 | 퀘스트 아이템 사라짐 위치 변경 | 4-5 `quest item vanished`, `Not enough room for undefined` |
| 3-17 | MoveToSlot 실패와 파티 수락 시각이 겹치나(1-6) | 4-6 `party accept` |
| 3-27 | 벨트 넣기 지연 판별 | 4-6 `chores ... cur put shift ui remain` |
| 3-10 | 라다먼트 꺼짐 게임: set → read → tombs → 10분 퇴장 | 4-5 `radamentOff`, 콘솔 `Radament off` |

## 6. 분석 순서와 끝 (사용자 지시 261024)
로그 분석을 요청받으면 아래 순서로 한다. 6번까지 해야 끝난다.

1. **데이터 확인**: 프로필·게임 수·기간·난이도 구간·코드 버전, 실행 중 코드 변경 여부. 3절 항목마다 "바꾼 것"의 커밋이 이 로그에 들어 있는지 줄 형식으로 확인한다.
2. **handoff 3절 검증을 먼저 한다.** 검증 방법과 handoff에 적힌 사용자 판단 기준대로 판정한다. 항목마다 한 줄: 판정 · 근거(본 줄·개수·프로필·게임·시각) · 안 본 것 · 다음 할 일. 흐름은 CLAUDE.md 5절.
   - **확정**: 검증 통과 → handoff에서 지우고 코드 노트로.
   - **실패**: 실패 사례를 붙여 2절로.
   - **케이스 미발견**: 검증할 상황이 생기지 않음. 왜 미발견인지 사유(근거)를 적고 더 볼지 묻는다. 판별 줄은 지우지 않는다.
   - **알 수 없음**: 상황은 생겼는데 판정하지 못함. ① 판정할 수 없는 이유 ② 개선안의 설계와 이유(목적) ③ 개선안으로 얻을 것을 적어 2절로. 개선안이 로그면 ②·③에 CLAUDE.md 4절 네 항목(확인된 사실·가설·어떤 값이면 맞고 틀리는지·결과에 따라 할 일)을 담는다.
   - **이번 로그에 적용되지 않음**: 그 사이클 코드에 해당 수정이 들어 있지 않음. 3절 유지, 다음 사이클.
   - 판정에 걸리는 이상한 사례는 원인이 나올 때까지 따라간 뒤 판정한다. "안 봄"으로 남기지 않는다. 끝까지 못 가면 알 수 없음으로 두고 이유를 적는다.
3. **기존 결정·결론이 흔들리는 사례는 따로 알린다.** handoff·코드 노트·`rejected.md`·`log_results.md`의 앞선 결정이나 결론과 맞지 않는 사례(반증, 다른 원인, 조건이 달라짐)를 "기존 결론과 다른 것"으로 분리해 근거와 함께 보고한다.
4. **그 밖 관찰**(4-1~4-7): 결과 나옴 / 상황 없음 / 원인 못 찾음 표, 숫자마다 근거 줄 예시. 새 문제는 사실만 적고 handoff 1절 후보로 낸다.
5. **보고 순서**: ① 데이터 요약 ② 3절 판정표 ③ 기존 결론과 다른 것 ④ 그 밖 관찰 ⑤ 결정이 필요한 것(사실과 선택지, Claude 제안은 "제안"으로 표시하고 규모: 파일 수, 새 변수·키·로그) ⑥ 로그 정리 후보(목적을 다해 삭제 / 실패 때만 남김 / 새로 필요(승인 필요) / 실패 기록용 유지, 사용자 지시 261006).
6. **handoff 정리**: 사용자가 판정과 다음 할 일을 정하면 handoff(3절 정리, 2절 이동), 코드 노트, `log_results.md`(묶음 결과), 이 문서 5절 표를 고친다. 커밋·푸시는 묻고 한다(CLAUDE.md 1절). 여기까지가 로그 분석이다.
