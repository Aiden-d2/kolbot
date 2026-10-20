# 로그 분석 지침 (Claude 작성 261020)

다른 대화에서 사용자가 올린 로그를 분석할 때 따르는 지침이다. 먼저 `CLAUDE.md`(작업 규칙, 로그 규칙)와 `handoff.md` 0절을 읽는다. 이전 분석의 방법과 결과는 `log_review_261006.md`에 있다.

---

## 1. 작업 규칙 (CLAUDE.md 요약, 분석에 해당하는 것)
- **분석·보고만 한다.** 코드는 사용자가 "수정해/반영해/적용해/고쳐"라고 분명히 말할 때만 고친다. 결정(채택, 그렇게 가자)은 수정 요청이 아니다.
- 확실한 것만 말한다. 추정은 추정이라고 밝히고, 근거(로그 줄, 시각, 프로필, 게임 이름, 코드 줄)를 붙인다.
- 새 변수·함수·인자·로그를 만드는 제안은 그 항목을 밝혀 승인을 받는다. 결정 목록에는 사용자가 정한 것만 올리고 Claude 제안은 "제안"으로 따로 적는다.
- 사용자가 다루지 않은 항목을 정리 목록에 끼워 넣지 않는다. 질문 범위 안에서 답한다.
- 판정표는 "다음 할 일" 기준으로 나눈다: 결과 나옴(통과·실패) / 상황 없음 / 원인 못 찾음(추적 계속·중단) (`log_review_261006.md` 8절의 실수).
- 노트(`docs/claude/*.md`)는 대화 중에 쓰지 않고 커밋 요청 때 몰아서 기록한다.

## 2. 받을 데이터와 준비
| 파일 | 위치(게임 PC) | 용도 |
|---|---|---|
| trace | `kolbot/_cache/trace/trace-<프로필>-<YYYYMMDD>.txt` | 분석의 중심. 프로필별·날짜별 |
| d2bs 로그 | D2BS 로그 폴더 | `print` 진행 기록, 엔진 오류(`Error in ...`), `[Chicken]` print, `enchant:` |
| 매니저 콘솔 | D2Bot# 콘솔 로그(`consolelog.txt`) | 조기 종료 사유, 치킨·사망(빨강), 오류(회색), 경험치 줄, 크래시(`Window has unexpectedly exited`) |
| ItemLog | `kolbot/_cache/ItemLog.txt` | 줍기·구매·판매 |

- 이전에는 사용자가 `log` 브랜치 `logs/`에 올렸다. 위치를 사용자에게 확인한다.
- **어느 코드로 돌았는지 먼저 확인한다.** 사용자에게 main 커밋(또는 업로드 시각)을 묻고, 실행 중에 코드가 바뀌었는지도 묻는다(261006 분석 때 실행 중 바뀌었다, `log_review_261006.md` 1절). trace 형식으로도 시기를 가를 수 있다(3절).
- 분석은 Python으로 trace를 게임·구간·지역·프로필 단위로 묶어 센다(외부 데이터는 별도 폴더, `python3 -I`). 스크립트는 scratchpad에만 둔다.

## 3. trace 형식 (시기별)
| 시기 | 줄 형식 |
|---|---|
| 261011 이후 | `[MM/DD/YY HH:MM:SS] 내용 (지역 x,y)`. 게임 밖은 `(OOG loc N)`. `Misc.trace(msg, true)`인 줄은 위치 없음: 게임 경계, 구간 헤더, `[Error]`, `[Quit] stopDefault`, `party has left` |
| 261001~261010 | `M/D H:M:S [지역 x,y] 내용`(0 채움 없음), 게임 밖 `[OOG loc N]` |

- 게임 경계: `=== [게임이름] ===`(261011 이후), 예전 `=== game 이름 ===`. 이 줄로 게임 단위를 자른다.
- 구간 헤더: `=== [ANDY] ===` 등. 리더 콘솔에도 `=== ANDY ===`(구간 끝, 금색).
- 줄 시계는 초 단위다. 초 미만 순서는 같은 파일 안의 줄 순서로 본다. 프로필 사이 비교는 PC 시계가 같다는 전제(같은 PC).
- 위치 `(지역 x,y)`는 그 줄을 찍은 순간의 위치다. 이동을 **시작한** 줄의 좌표를 그 시각의 위치로 읽지 않는다(`log_review_261006.md` 8절 실수: 걷는 중을 멈춤으로 읽음).

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
  - 치킨 off가 있어야 할 HP인데 3번이 없는 사례(못 켜진 사례)는 `log_review_261006.md` 6-2처럼 표로 정리하고, 같은 시각의 3절(합류) 줄로 원인을 찾는다.
- **261020 이전 형식(이번 로그에 섞여 있을 수 있음):**
  - `bossGuard chicken off: pct N, 이름 HP%` — 261010~261019에는 뒤에 `@<큰 수>s`가 붙는데 계산 오류(절대 틱 − 상대 ms)라 무시한다.
  - `bossGuard seen: 이름 첫HP%@t0-끝HP%@t1, ... (end@초)` — 시각은 **가드 온 기준**. 가드 온 시각 = 이 줄 시각 − end. 치킨이 꺼져 있던 시간은 (가드 온 시각 + t1) − chicken off 줄 시각(초 단위 오차).
  - `bossEnd chicken back: N` / `bossEnd chicken stayed: N (boss never at pct)` / `bossEnd revive: start` / `bossEnd revived: Ns` / `bossEnd portal` / `bossEnd reopen portal` / `bossEnd corpse: at N` / `bossEnd corpse: picked`
- 판정할 것: 보스별 치킨 off HP%와 off→킬 시간 분포, 그 사이 사망·치킨 수(써모너 pct 100이 과한지, 쉥크 50, 에인션트 10·2마리), 시체 회수 성공률과 실패 사유. **pct 값 변경은 제안까지만.**

### 4-2. 치킨·사망 원인 (261006~261007)
목적: 치킨 순간 무엇에 맞았나, 치킨 뒤 사망(종료 지연), 타운치킨과 치킨의 관계.
- `[Quit] Life Chicken H/M | mode:N near: 이름 dN sN, ... (+N)` — 내 모드(me.mode)와 30칸 안 가까운 몹 5마리(거리, spectype 비트. 코드는 `& 0x7`이면 보스급(유니크·챔피언·슈퍼유니크), `& 0x1`이면 슈퍼유니크로 씀). 콘솔(빨강)은 `Life Chicken H/M (지역 x,y)`.
- `[Quit] stopDefault Nms` — `quit()` 전에 스크립트 4개를 멈추는 데 걸린 시간. 261006 분석의 "치킨 뒤 2~4초 종료 지연 → 사망 3건"의 원인 확인용.
- `Town check` / `Town chicken` — TownChicken이 마을에 간 이유(TownCheck 조건 / HP·MP 조건). 예전 `Going to town`.
- `visitTown start by:<스크립트> tick:` / `visitTown back tick:` — 누가(default.dbj / TownChicken) 언제 갔다 왔나.
- `goToTown take TP failed start tick: made:` — TP 실패 기록(추적은 중단됨, 실패 기록용).
- 콘솔 `You died in last game`(빨강) — 다음 게임 시작에 찍힘(사망한 게임은 그 앞 게임).
- 판정: `log_review_261006.md` 5절과 같은 표(구간별 게임·치킨·게임당, 장소, 프로필), 치킨이 타운치킨 발동 몇 초 뒤인가, 지역 진입 몇 초 안인가(4-3의 `usePortal ok`·구간 헤더 기준), near 몹 종류·거리, stopDefault 시간과 사망의 관계.

### 4-3. 합류·동기화 (261006)
목적: 누가 어느 단계에서 늦었나. 보스가드가 못 켜진 원인(`log_review_261006.md` 6-2의 2·3·4·13번: 코드상 설명 안 됨 / River of Flame 1분 기록 없음 / 원인 불명).
- `syncBO start` / `syncBO end: ready Ns, at 지역 Ns, okCount Ns, home Ns`(BO를 받은 쪽은 `(BOed)`) — start만 있고 end가 없으면 그 사이에서 멈춤.
- `syncWP start: actN WP` / `syncWP end: there Ns, end Ns`
- `tpReady received` — 리더 포털 신호를 받은 시각.
- `usePortal ok: 출발 -> 도착 tries:N ms:N` — 포털 진입 시각. moveTo 줄이 없어서 지역 전환 시각은 이 줄로 본다.
- `usePortal failed target: owner: unit: pre: tick: tries:<시도:gid sent/click/none/dead@ms> portals:<gid/classid/주인/지역/좌표/mode/거리>` — 내 포털일 때만.
- `[Quit] Party desynced 1·2: okCount N teamCount N teamOk X` — 개수가 모자랐나(한 명 없음) 넘쳤나(호출 횟수 불일치).
- `party has left: 이름`(위치 없음) — 퇴장할 때까지 100ms마다 반복될 수 있다(의도). 첫 줄만 센다.
- 판정: 같은 게임에서 프로필별 tpReady → usePortal ok 간격, 늦은 프로필의 바로 앞 줄(무엇을 하던 중인가: 마을·`Town chicken`·syncBO 단계·포털 실패).

### 4-4. 이동·경로 (Pather)
목적: **아케인 등 getPath 오류(사용자가 따로 보기로 한 핵심)**, 텔레포트·유닛·웨이 실패.
- 빈 경로 처리(261020 최종, `handoff.md` 0-2): `moveTo no random path -> x,y in 지역 adjusting...`(random 오프셋 목표에 경로 없음 → 원좌표로) → `moveTo no path -> x,y in 지역 adjusting...` → `moveTo adjusted path -> x,y in 지역`(보정 칸으로 경로가 나왔을 때만) → `invalid path -> 내x,내y in 지역 random move...`(랜덤 걸음, 최대 10회, 10번째 실패면 `[Error] ... moveTo: Failed to generate path`). 앞 세 줄은 콘솔(기본색)에도 찍힌다(사용자 임시 확인용, 정상 종료 판정에서 조기 종료 줄로 착각하지 않는다).
  - **이 형식은 main `72a1980`(261020 15:40) 이후다.** 그 전 코드(261007~261020 오전)는 보정 조건·랜덤 걸음 괄호가 달랐다(`handoff.md` 0-7 ⑤). 로그가 언제 코드인지 먼저 본다.
  - 아케인 사례 판정: 같은 좌표로 `moveTo no path`가 반복되는가, `adjusted`가 있는가, `invalid path`가 몇 번인가, 이를 부른 구간(써모너 `while (거리 > 10) moveToPreset` 등 탈출 조건 없는 루프, `handoff.md` 4절 9번)과 그때 위치. 목표 좌표가 다른 지역 것인지(261006에 8건 있었음), 보정 칸이 같은 칸인지.
- `moveTo entered town, walk the rest -> x,y path:N`
- `[SafeTele] teleportTo FAILED - safeNode:(x,y) dist:N` — SafeTele는 리더만 켜짐(261020). `SafeTele.Skip` 62·63·64·77·78·120·132.
- `[teleportTo failed] attempt:N dist: ping: area:`
- `[useUnit] timeout iter: dist: ping: area:`
- `[WP] wp.area: me.area: target: retry:`, `[goWP] Failed to reach WP after 10 attempts`, `[getWP] waypoint unit not found / menu not opened try:N`
- `makePortal late/existing portal used try:N gid:`, `makePortal cast again try:N`
- `ArreatSummit Gate`, journeyTo 경로(course 배열)
- 소울 게이트(261020): 헬 파밍의 아냐·바알에서 리더가 소울을 보면 `[Quit] Souls found in Anya` / print `Baal failed: souls found`(d2bs 로그). 바알은 `earlyReturn`으로 팀이 마을로.

### 4-5. 퀘스트
- 라다먼트 북(261004·261012): `dropping radament book`(게임 시작에 가진 북을 버림) / `radament gate: 9,0 9,1 9,5 book` / `radament atma: ...`(분실 뒤 리더 아트마 대화, N+1) / `radament book visible: true/false 9,5` / `!!! [BOOK] !!!` / `radament book read: 9,5 false`(false = 읽음). 실패: `[Quit] Radament quest item not found`(누가 못 봄), `[Quit] getQuestItem failed`(줍기 실패), `[Quit] Radament book reset`. getQuestItem 줄: `Trying to make room for 이름`, `Not enough room for 이름`, `<classid> not found`.
  - 판정: 정상 경로(visible → read) 비율, 분실 복구 N+1(atma 9,0 true 9,1 false) → N+2(visible false, 퀘스트 꺼짐) → N+3(획득)이 실제로 이어지는가.
- `ancients loop: 39,0 X` — 에인션트 루프 회차마다.

### 4-6. 마을·아이템
- 화살통(261014~261019, 활 직업 = M.HYBR): `interact closed`(상점 창이 열려 있어 스페이스로 닫음) → `not enough quiver: 장착 + 예비` → 3막 `equipQuiver moved` / 그 밖 `equipQuiver dropped`, `invQuiver dropped` → 3막 `equipQuiver sold`, `invQuiver sold`(Ormus에게 팔고 350개짜리로 되사기) → `equipQuiver`, `invQuiver`(구매 성공) → `equipQuiver N / invQuiver N`(결과). 판정: 구매 실패(결과 줄이 `no quiver`)·같은 게임 반복 방문.
- 골드 나눔(261010): 리더 골드 < 5000(18레벨 이상)이면 팔로워가 `Dropping N Gold`, 리더가 `Picking up N Gold`, 15초 안에 안 주우면 `Retaking N Gold`. 줄 안의 goldPile은 유닛 객체 문자열일 수 있다.
- 감정: `identify failed / slow: 이름 (scroll|tome, Nms)`, `identify stopped: no ID scroll`, `identify: no gold for ID scroll, sold unid 이름`.
- 벨트 물약: `[MoveToSlot] 이름 FAILED slot: dropped: item: inv:open/closed` — 261006 결과는 옮기던 회복 물약이 커서에 남아 바닥에 버려짐(Harrogath 게임 시작). `inv:`로 인벤토리 창 상태 확인. `[MoveToSlot] no room, dropped blocker`.
- `[Storage.MoveTo] retry / catch`, `moved from cube to drop/sell`, `[TK] talk skipped N npc:`(스페이스 20번 다 씀, 261006에 Greiz 1건), `[hire] hiring retry (N/5)`.
- d2bs 로그 `enchant: 이름/classid`(S.SFFW 65레벨부터 아마존·2막 용병·발키리·섀도 워리어·그리즐리).

### 4-7. 게임 밖 (회색 콘솔 + trace `(OOG loc N)`)
- `Team wait: a3, a5 - wait`(리더, 팔로워가 5초 넘게 안 들어올 때), `Rest: N games - wait Nm`
- `Create account failed: 계정 "문구"` — 팝업 문구가 읽히는가(`handoff.md` 3절 16, `(no text)`면 좌표가 틀림, 261006은 모두 `(timeout)`)
- `Create character timeout: 이름 - retry`(loc N, 3절 17), `Create character:`, `Character name taken`
- 로그인 오류, `Realm down`, `CDKey in use/flagged`, `Crash: 스크립트 지역 - wait`, `Join game failed`, `Create game failed`, `Game not found`, `Unhandled location`

### 4-8. 기본 기록 (관찰용 아님, 게임 흐름 파악에 씀)
게임 경계, 구간 헤더, `[Quit] 사유: 상세`, `[Error] 구간: 메시지 (파일 #줄)`, `Script ended`(조기 종료가 없을 때만), `boss not found: id`, `AttackSkill[N] not learned`, `!!! POTION/SCROLL/BOOK !!!`, `[Quit] High ping / Mana·Iron Golem·Merc Chicken`, `undefined item`, `[DBG] drop`, `Couldn't give the potion to merc`.
- 정상 종료 판정(CLAUDE.md): 경험치 줄 앞에 조기 종료 줄(검정, `(지역 x,y)`)·빨간 줄·`Error in` 줄이 없으면 정상. 단 4-4의 `moveTo ... path` 콘솔 줄(검정)은 조기 종료 줄이 아니다.
- 이유 없이 끝난 게임은 `log_review_261006.md` 7절처럼 분류한다(크래시, 마지막 게임, 30분 시간 초과, 매니저 일시정지, 원인 불명).

## 5. 이번 로그로 볼 확인 항목 (`handoff.md` 3절 중 로그로 판단 가능한 것)
| # | 항목 | 로그 |
|---|---|---|
| 16 | 계정 생성 팝업 문구 | 4-7 |
| 17 | 캐릭터 생성 대기 창 loc | 4-7 |
| 24 | 흩어지기(이제 random 이동) 빈 경로 | 4-4 `moveTo no random path` |
| 27 | 웨이 없는 곳 `getWP` 복구, travel 실패 | 4-4 `[getWP]`, 콘솔 `Travel failed` |
| 31 | 매고트 굴 SafeTele 실패 | 4-4 `[SafeTele]` 지역 62~64 |
| 35 | 리더 팀 대기 | 4-7 `Team wait` |
| 37~41 | 보스가드·시체 회수·에인션트·라다먼트 북·okCount | 4-1, 4-5, 4-3 |
| 42 | 25레벨 미만 ID 스크롤 골드 부족 판매 | 4-6 |

로그로 판단할 수 없는 항목(직접 보기): 3절 1(버벅임), 6(상자), 10·12·20~22·28~30(회피·시전), 25(케인 대기), 32·33·36(보스 주변 정리 순서).

## 6. 보고 형식
1. 데이터 요약: 프로필·게임 수·기간·난이도 구간·코드 버전(시기), 실행 중 코드 변경 여부.
2. 그룹별(4-1~4-7) 결과: 결과 나옴 / 상황 없음 / 원인 못 찾음으로 나눈 표. 숫자에는 근거 줄(프로필·게임·시각) 예시를 붙인다.
3. 사용자 결정이 필요한 것: 사실과 선택지만. 수정 제안은 "제안"으로 표시하고 규모(파일 수, 새 변수·키·로그)를 밝힌다.
4. 로그 정리 후보: 목적을 다한 로그(삭제), 실패 때만 남길 로그, 새로 필요한 로그(승인 필요). `log_review_261006.md` 3절 기준.
