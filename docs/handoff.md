# 인수인계

새 대화는 이 문서부터 읽는다. 절과 흐름은 `CLAUDE.md` 5절을 따른다.
- 1절 `진행 여부 대기`: 문제(사례) / 확인된 것 / 판단에 필요한 것
- 2절 `구현 검토·수정 대기`: 확인된 것 / 가설 / 구현안(대상 함수, 수정 규모) / 검증 방법
- 3절 `인게임 검증 대기`: 바꾼 것(커밋) / 검증 방법 / 결과(로그 묶음별)
- 흐름: 1 → 2(진행 결정) → 3(수정 완료) → 코드 노트(검증 통과). 3 검증 실패는 실패 사례를 붙여 2로. 기각은 `rejected.md`. 같은 내용은 한 항목에만, 옮길 때 `옛 N-N`. 지운 번호는 다시 쓰지 않는다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

**마지막으로 분석한 로그**: 261027 묶음(10/26 14:24 ~ 10/27 18:49, main `152e5ea`)과 261028 묶음(10/27 18:54 ~ 10/28 13:07, 사용자 업로드 `8144c74`까지, 10/28 09:51 전 프로필 재시작), `log_results.md` 261027·261028. 261027의 handoff 판정은 261028과 함께 반영(사용자 261028). **다음 사이클**은 3-39 파서(`4a1738d` 외), 3-40~3-46(`dfc884b`·`9c48f56`), 3-47 syncBO 순서·3-48 상자 재시도(`68483de`), 3-49 판별 줄 삭제가 들어간 코드로 돈다.

## 1. 진행 여부 대기 (진행할지 말지 검토)

### 1-2. Monastery Gate 동선 H1 (`AutoSmurf.outer`, `Pather.moveToExit`)
- **문제**(사용자 261022): Tamoe Highland(7) → Monastery Gate(26) → Outer Cloister(27)로 갈 때 26의 모양이 특수해서, 가장 짧은 길이 아니라 벽 쪽으로 들어간 뒤 중앙 게이트를 거쳐 27로 넘어간다. 벽 쪽 진입 자리에서 게이트까지 가는 거리를 줄일 수 있는가(게이트로 바로 도착).
- **확인된 것**
  - 261022 로그(`[exit] 26 -> 27`, 2게임 9줄, 모두 통과): 26 → 27 출구 점 `15140,5000`(보정 칸 `15140,5001`) = 게이트 위치(사용자). 26 진입 뒤 위치 약 `15180,5087` = 벽 쪽 진입 자리(사용자). 차이 x 40, y 87(직선 약 96).
  - `[exit]`는 26 안에서 26 → 27 출구를 고를 때만 찍었다. 벽 쪽 진입을 정하는 7 → 26 출구 점은 찍히지 않았다. 옛 가설 "출구 점이 게이트 옆 벽인가"는 시험되지 않았다(틀렸다고 판정된 것 아님). `[exit]`는 261022 삭제.
- **판단에 필요한 것**: 진행할지, 한다면 7 → 26 출구 점·동선을 볼 검증 방법. 사용자 아이디어(결정 아님): "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다."

### 1-15. 상점에서 큐빙 재료(크래프트 매직 베이스 등)를 사지 않음 (`Town.shopItems`, `Pickit.checkItem`, 사용자 261024)
- **문제**(사용자): 크래프트의 매직 베이스는 상점에서 충분히 살 수 있는데, 상점은 판정 결과 1만 사서 큐빙 재료는 사지 않는다.
- **확인된 것**(코드)
  - `Town.shopItems`는 `Pickit.checkItem` 결과가 1인 것만 산다. 노말 난이도는 벨트(itemType 19)만, 나이트메어·헬은 `Config.MiniShopBot`이 켜졌을 때만 산다(기본값 `false`, 빌드에서 바꾸는 곳 없음).
  - `Pickit.checkItem`은 `Cubing.checkItem`이 참이면 nip 판정보다 먼저 2(큐빙 재료)를 돌려준다 → 크래프트 베이스(nip이 원하지 않는 매직 아이템, `validItem`의 크래프트 조건 `result === 0`)처럼 재료에 해당하는 아이템은 2가 되어 상점이 사지 않는다.
  - 갬블(`Town.gamble`)·감정(`Town.identify`)은 얻은 아이템이 2이면 `Cubing.update()`를 부른다(재료가 들어오는 자리). 상점에는 재료가 들어오지 않아 업데이트도 없다.
  - `shopItems`를 부르는 곳: `buyPotions`, `repair`(그 안의 호출 조건은 읽지 않음).
- **판단에 필요한 것**: 진행할지. 한다면 상점에서 살 큐빙 재료의 범위(크래프트 베이스만인지, 레시피 전체인지), 살 때 골드 조건, 산 뒤 `Cubing.update()`.

### 1-16. 벨트에 아무 등급 물약이나 들어감 (`Town.clearBelt` 벨트 넣기, 사용자 261025)
- **문제**(사용자): 인벤토리 물약을 벨트에 넣을 때 등급을 보지 않아 낮은 등급도 들어간다. 원래 동작이라 당장 고칠 것은 아니고, 나중에 맞지 않는 등급은 버리기로 넓히면 된다(사용자 261025).
- **확인된 것**(코드)
  - 벨트 넣기(261025 `81d5b43`부터 `clearBelt` 끝, 원본 kolbot은 `clearInventory` 앞)는 물약을 종류(hp·mp·rv)로만 골라 이름이 맞는 열에 넣는다. 등급은 보지 않는다.
  - `buyPotions`는 빈 칸만 채우므로, 낮은 등급이 칸을 차지하면 그 칸에 상점 최고 등급을 사지 않는다. 게임이 벨트 안에서 어떤 등급을 먼저 마시는지는 확인하지 않음.
  - 상점 최고 등급은 `Town.getPotion(npc, type)`(상점 품목을 5 → 1등급 순으로 찾음)으로만 알고, `buyPotions`가 상점을 연 뒤에만 부른다. `clearBelt`는 heal 앞, 상점을 열기 전이다.
  - 등급 기준이 이미 두 곳에 있다: `X.nip` 138~148줄(회복·마나 1등급 노멀 1~2막, 2등급 노멀 1~3막, 3등급 노멀 1~4막, 4·5등급 항상)과 `clearBelt`의 노멀 마나 규칙(2막 mp1, 3막 mp1·mp2를 벨트에서 버림). 두 기준이 한 막씩 어긋난다(nip은 2막에서 mp1, 3막에서 mp2를 줍는다).
- **판단에 필요한 것**: 진행할지. 한다면 기준(① 같은 게임에서 연 상점의 막별 최고 등급을 기록해 씀 — 새 상태 1개, 게임 첫 방문엔 적용 안 됨, ② 막·난이도 고정 표 — 상점 데이터 필요(2-13), ③ nip 판정 `Pickit.checkItem`이 0이면 넣지 않음 — 새 상태 없음), 넣지 않은 물약을 버릴지, nip과 `clearBelt` 마나 규칙의 어긋남을 어느 쪽으로 맞출지.

### 1-17. 경로 보정 10회 실패 뒤 오류 줄 없음 (`Pather.moveTo`, `Attack`, 사용자 261026)
- **문제**: `Pather.moveTo`는 `no adjusted path` 10번째에도 경로가 없으면 throw(`moveTo: Failed to generate path`)하는데, 261026 로그 2건은 오류 줄 없이 다음 구간으로 넘어갔다.
- **확인된 것**
  - 사례: a3 10/26 00:29:09~00:29:22 Abaddon(목표 12659,6098, 10회 모두 12645,6106 부근) → 00:29:29 `=== [POA] ===`. a7 03:37:10~03:37:23 Infernal Pit(목표 12660,9099) → 03:37:29 `=== [DIABLO] ===`. 두 건 모두 `fixed path`·`[Error]`·`Failed to generate path` 0.
  - 코드: `Attack.js`에 `Pather.moveTo` throw를 trace 없이 받는 catch가 3곳(잃은 목표 마지막 위치로 이동 `searches = 99`, 자리 잡기 이동 `moved = false` 2곳). 이번 2건이 어느 호출부였는지는 로그로 모름. CLAUDE.md 4절: 잡힌 오류는 `Misc.caughtError`.
  - 261027 로그: `no adjusted path` 10회 2건은 모두 `[Error] moveTo: Failed to generate path`가 찍힘(a6 Pz-6 Stony Field, a7 Pz-55 Abaddon `usePortal → moveToUnit`) — 오류 줄 없는 위 2건과 다른 호출 자리. 261028 로그: `no adjusted path` 0.
- **판단에 필요한 것**: 진행할지. 한다면 조용한 catch 3곳에 `Misc.caughtError`를 넣을지(콘솔은 게임당 자리별 1회).

## 2. 구현 검토·수정 대기 (진행은 확정, 로직과 구현 방식 검토)

### 2-2. print/trace 중복 정리 (여러 파일)
- **구현안**: 범위(print·trace 중복 / 콘솔+print 중복 / 로그 규칙 위반)는 그때 정한다.
- **선행 조건**: 없음. 처음에는 3절 검증용 줄이 바뀌지 않도록 3절 검증이 끝난 뒤로 했으나(사용자 결정 261021), 남은 3절 항목에 영향이 없다고 보고 가능으로 바꿈(사용자 261023). 남은 3절 항목의 검증 줄도 2-2 정책에 맞춰 바꿔도 된다(줄 모양보다 판단에 필요한 정보가 남는 것이 중요, 사용자 261023). 바꾸면 해당 3절 항목의 검증 방법과 `log_guide.md` 줄 이름을 함께 고친다.

### 2-13. MPQ 데이터 완전 추출 (사용자 요청 261022)
- **확인된 것**: 사용자가 쓴 1.14d listfile(MPQEditor용)에 이름 없는 항목(`File00000127.dc6`, `File00000133.xxx` 등) 약 80개가 있고, excel 목록에 `lvlwarp`·`belts`·`cubemod` 등이 없다. listfile에 이름이 없는 파일은 이름으로 꺼내지지 않는다. 추출본에는 lvlmaze·lvlprest·lvlsub·lvltypes·levels만 있고 LvlWarp가 없다(사용자).
- **구현안**: 더 완전한 listfile(커뮤니티 listfile 등)로 다시 추출해 excel 전체(`.bin`·`.txt`)를 확보한다. 그 전까지 LvlWarp는 외부 `d2data`로 대신한다.
- **검증 방법**: 이름 없는 항목 0개, `LvlWarp.bin`이 있고 `d2data` 값과 같은가.

### 2-16. 생추어리 도입 (모저가 최종인 빌드 9개, 사용자 261023)
- **확인된 것**
  - 대상: A.TRAP, D.FGOM, D.WIND, N.SUMM, S.COLD, S.FIRE, S.FONV, S.LTNG, S.SFFW. 방패 tier는 에인션트 플레지 26, 모저 41. 생추어리는 만들어지면 모저와 같은 급 이상(사용자 261023) → 에인션트 플레지 다음 단계로 들이되, tier 번호는 구현할 때 정한다.
  - 재료는 에인션트 플레지와 같다(3소켓 카이트·라지·고딕 쉴드, `Config.js` 생추어리·에인션트 플레지 레시피).
  - 룬워드는 레시피 목록 순서대로 베이스·룬이 다 갖춰진 첫 레시피를 만든다(`Runewords.checkRunewords`). 생추어리가 목록에서 먼저지만, Ko Ko Mal이 없고 Ral Ort Tal이 있으면 생추어리용 베이스로 에인션트 플레지를 또 만든다(Ral·Ort·Tal은 `[Rune]` 절에서 미리 모음, Ko는 주석).
  - Mal은 `[name] >= malrune && [name] <= zodrune` 줄로 모음(D.WIND도 PR #77에서 D.FGOM과 같게).
  - 261023 코드 확인: `Config.Tiered`는 매 게임 시작 때 빌드 1레벨 Update의 `Equip.updateTiers()`에서 정해지고(모든 칸이 `TierGoal` 이상), 그 뒤 `Runewords.init()`이 레시피를 읽는다(`default.dbj` `Config.init` → `Runewords.init`). 빌드 24레벨이 이미 `if (!Config.Tiered)`로 큐빙 레시피를 나눈다(S.COLD). 에인션트 플레지·생추어리 레시피는 빌드가 아니라 `Config.js` 공통 `RunewordRecipe`에 있고 팔라딘 빌드 3개도 에인션트 플레지를 쓴다(nip 16줄씩).
  - 룬: Ral·Ort·Tal은 `[qty] == 1 && [tiered] != 0`(파서상 `!=`는 티어드가 아닐 때만 켜짐, `NTItemParser.dbl` tiered 게이트) → 티어드 전에만 줍는다. Ko 줄은 주석, Mal 이상은 늘 줍는다.
  - 홀드: `NTIP.CheckQuantityOwned`는 보관품과 착용 장비(mode 1)·용병 장비를 센다. 지금 3소켓 베이스 줄 홀드(`@ (유니크 라운드 쉴드 || 노말·슈페리어 방패) # (3소켓 || 화염 저항 ≥ 45) # [qty] < 1`, S.COLD.nip)는 착용 중인 에인션트 플레지·모저를 세어 베이스를 줍지 않는다.
  - 261028 nip 문법 변경(3-39): `[tiered]`는 연산자·값 없는 표시(전 칸 `TierGoal` 도달 = `Config.Tiered`)만 남고 `[tiered] != 0`·부위 번호 형태는 없어짐 → "티어드 전에만"은 기어 조건(`[armb] < goal` 등)으로 쓴다. 홀드 끝 칸 `[qty]`는 `[owned]`(없으면 `< 1`). 칸 이름 `ArmL` → `ArmB`(`TierGoal.ArmB`, 261027 사용자 업로드에서 9개 빌드 모두 25). 아래 구현안의 줄 모양은 옛 문법이다.
  - 9개 빌드 모두 `TierGoal.ArmL = 21`(X.nip 매직·레어 방패 tier 21~25)이라 에인션트 플레지(26) 없이도 티어드가 될 수 있다.
- **구현안**(방향 사용자 261023, 옛 A·B·C 안 대체)
  - 레시피: 대상 빌드 9개의 24레벨 Update에서 티어드 전에는 에인션트 플레지만, 티어드 뒤에는 생추어리만 남긴다(`Config.RunewordRecipe`에서 다른 쪽을 거름. 공통 목록은 팔라딘도 쓰므로 `Config.js`는 그대로).
  - 베이스 줄(nip 9개)을 둘로: 티어드 전은 지금 그대로 `# [qty] < 1 && [tiered] != 0`. 티어드 뒤는 홀드가 에인션트 플레지를 세지 않고, 룬워드가 아닌 노말·슈페리어 3소켓 베이스 **또는** 생추어리를 세어 1개까지 줍는다(생추어리가 있으면 줍지 않음 → 두 번째 생추어리 없음).
    - 줄 모양(Claude 초안): `(3소켓 베이스) # [sockets] == 3 @ ([type] == shield && ([quality] == normal || [quality] == superior)) # ([flag] != runeword && [sockets] == 3) || ([flag] == runeword && [itemdamagetomana] == 0) # [qty] < 1 && [tiered] == 0`. 생추어리와 에인션트 플레지는 데미지→마나 유무로 가름(에인션트 플레지 tier 26 줄과 같은 기준). 같은 기준에 다른 룬워드 방패(공통 목록의 Rhyme 그림 쉴드)도 세어짐 — 대상 빌드가 끼는지는 미확인.
    - 확인할 것: 홀드 안의 `[flag]` 평가를 `NTIP.ParseLineInt`로 파싱 확인(지금 홀드 줄에 `[flag]` 예 없음).
  - Ko 줄: 티어드 뒤에만 `[name] == korune # # [qty] == 2 && [tiered] == 0`(옛 메모의 `[tiered] != 0`은 티어드 전에만이라 이 안과 반대).
  - 생추어리 tier 줄 추가.
  - 수정 규모: 빌드 9개, nip 9개. 새 변수·함수 없음.
  - **남은 결정**: ① 생추어리 tier 번호(모저 41과 같은 급 이상) ② ArmL 목표 21 그대로(tier 21~25 방패로 티어드가 되면 에인션트 플레지를 건너뛰고 생추어리를 기다림) / 26으로 올림(티어드에 묶인 MiniShopBot·farmingON·큐빙 레시피도 늦어짐) ③ tier 줄 옵션(맞을 때 회복 20·민첩 20은 게임 지식, 확인 필요).
- **검증 방법**: 검토에서 정한다.

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

### 3-13. 라다먼트 북 버리기 (`AutoSmurf.start`, `dropping radament book`)
- **바꾼 것**(`47816e6`): 시작 단계 북 버리기 무한 루프 수정. 버릴 때마다 trace `dropping radament book`.
- **검증 방법**: 북을 가진 채 시작한 게임에서 이 줄 뒤 정상 진행(무한 반복 없음). 확인 뒤 줄 삭제.
- **결과**: 261024 케이스 미발견 — `dropping radament book` 0. 사유: 북을 가진 채 시작한 게임이 없었음. 더 봄.
  - 261025 케이스 미발견 — `dropping radament book` 0. 더 봄(사용자 261025).
  - 261026 케이스 미발견 — `dropping radament book` 0. 케이스가 나올 때까지 계속 관찰(사용자 261026).
  - 261027·261028 케이스 미발견 — `dropping radament book` 0.

### 3-17. MoveToSlot 실패 원인 판별 (`Storage` MoveToSlot, `PartyThread` 파티 수락, 옛 1-6)
- **바꾼 것**: 실패 줄 유지, `inv:` 필드 삭제(261020). 판별 trace `party accept: 이름`(261021 `ab94751`, 팔로워 `PartyThread`). 실패 34건 중 33건 `closed`·1건 `-`이고 창을 여는 코드가 없어 성공도 `closed`일 것 → 창 상태로는 판별 불가라 수락 시각으로 가른다.
- **검증 방법**: 실패 줄 `[MoveToSlot] ... FAILED`와 같은 시각(같은 초)에 수락이 있으면 수락 클릭이 옮기던 물약을 방해한 것(가설). 겹침이 없으면 가설은 틀림.
- **결과**: 261022 `party accept` 579줄, MoveToSlot 실패 0건(65게임) → 판정할 사례 없음. 실패가 다시 나오면 판정.
  - 261024 케이스 미발견 — `party accept` 918줄, 실패 0(105게임). 사유: 세 묶음(289게임) 연속 0. 그 사이 관련 코드 변경은 `82ede23`(사용자 업로드 10/20 09:57, 큐브·TP 칸 옮기기를 게임 입장 직후에서 `doChores` 뒤로) 하나. 이 변경으로 사라졌는지는 옛 로그(261013·261020)가 남아 있지 않아 확인할 수 없음. 실패 줄에 아이템 이름·시각이 있어 다시 나오면 그대로 판정 가능. 더 봄(사용자 261024).
  - 261025 케이스 미발견 — 실패 0, `party accept` 933줄(110게임). 네 묶음 399게임 연속 0. 더 봄(사용자 261025).
  - 261026 케이스 미발견 — 실패 0, `party accept` 1,044줄(117게임). 다섯 묶음 연속 0. 케이스가 나올 때까지 계속 관찰(사용자 261026).
  - 261027 케이스 미발견 — 실패 0, `party accept` 1,276줄(146게임). 261028 케이스 미발견 — 실패 0, `party accept` 923줄(105게임). 일곱 묶음 연속 0.

### 3-29. useUnit 계단 클릭 앞 대기를 `me.attacking` 게이트로 (`Pather.useUnit`, 옛 2-19·3-20 다음 단계)
- **바꾼 것**(261024 `be4f0e2`): 계단(type 5) 클릭 앞 고정 `delay(600)` → 시전 중(`me.attacking`)일 때만 최대 600ms 대기. 걷는 캐릭터·시전이 끝난 경우는 기다리지 않음. 근거: `teleportTo`는 목표 거리 안에 들면 시전 동작이 끝나기 전에도 true를 돌려준다(코드 읽음). 옛 3-20(고정 600ms)의 효과: 261023 timeout 34줄(261022 묶음 2 414줄), 261024 42줄, 8회 모두 실패 0.
- **검증 방법**: `[useUnit] timeout` 줄 수를 261023(34)·261024(42)와 비교, 8회 모두 실패 0인가. 크게 늘면 600ms 효과가 시전 때문이 아니었던 것(가설 틀림) → 고정 600ms로 되돌림.
- **결과**: 261025 실패 기준에 해당 — timeout 283줄(a1 210줄·145회, 걷는 프로필 a2~a8 73줄, 261023 걷는 프로필 19줄). 많은 곳 a1 Worldstone Keep 2→3층 22회·3층→Throne 14회. 걷는 프로필은 바뀐 뒤 기다리지 않는데 함께 늘어 600ms 효과가 시전 때문만은 아니었던 것으로 보임(추정). 8회 모두 실패 2건은 게이트와 무관(a1 Pz-14 Lut Gholein → 궁전 `dist:21` 그대로 도달 못 함, a1 Pz-47 Tal Rasha's Tomb → 두리엘 방 오브젝트 type 2). 로그로 모르는 것: 텔레 직후 `me.attacking`이 참이 되는지. 한 사이클 더 보고 같은 결과면 고정 600ms로 되돌리는 것을 재검토(사용자 261025). 로그 변경 없음(대기 ms를 붙여도 결론이 같은 재검토로 감).
  - 261026 timeout 275줄(a1 215, 걷는 프로필 60), 8회 모두 실패 2(a1 Spider Forest → Spider Cave, Flayer Dungeon 1 → 2, 둘 다 다시 불러 통과) — 261025와 같은 수준. **보류**(사용자 261026): 핑 관련이 높아 보이고 계단(층 변경) 대기가 길어 보이는데, 지금 테스트 서버가 아시아가 아니라서인 것으로 봄. 아시아 서버 결과로 다시 본다.
  - 261027 timeout 526줄(a1 461, 걷는 프로필 75), 8회 모두 실패 3줄(a1 Black Marsh → Forgotten Tower). 261028 260줄(a1 198, 걷는 프로필 62), 8회 모두 실패 0. 두 묶음 모두 핑 150~340(아시아 서버 아님) → 보류 유지.

### 3-32. 착용 중인 베이스로 룬워드·펀치 (`Misc.takeOff`·`wornItems`, `Runewords.makeRunewords`·`buildLists`, `Cubing.doCubing`·`buildLists`, 사용자 261023·261024·261025, 옛 2-15)
- **문제**: 보유 개수(`NTIP.CheckQuantityOwned`)는 보관품·플레이어 착용 장비·용병 장비를 모두 세는데, 룬워드 베이스 찾기(`getBase`, `me.getItem(base, 0)`)와 큐빙 재료(`Cubing.buildLists`, `me.findItems(-1, 0)`)는 보관품만 본다. → 착용 중인 재료 베이스(플레이어 또는 용병)는 홀드를 차지해 새 베이스 줍기를 막으면서 재료로는 쓰이지 않는다. 용병도 헬름·갑옷을 입으므로 플레이어용 재료와 겹친다(사용자).
- **결정**(사용자 261024)
  - 모든 동작은 현행 그대로, 착용 장비 중 재료 베이스를 빼는 것만 넣는다. 고르는 조건: 레시피 베이스에 해당하고 그 레시피의 나머지 재료가 모두 모였을 때(재료가 없을 때 빼면 쓰지 못하고 다시 입기만 함).
  - 플레이어·용병 모두. 보유 개수는 나누지 않고 공유.
  - 인벤토리 자리가 없으면 빼지 않는다.
  - 착용이 바뀌면(빼기 포함) `updateTier`로 tier 기록을 갱신한다(상위 원칙).
  - 레시피에는 있지만 보유 개수 줄이 없는 베이스(대조 결과 빌드마다 약 50개)는 그대로 둔다 — 우연히 착용하고 룬이 모였을 때만 만들어진다. 보유 개수 줄의 재료 베이스는 모두 레시피에 있음(대조 261024, 스크립트로 이름 대조).
  - 받아들이는 위험: 반쯤 만든 베이스가 팔림(기존 흐름), 펀치 뒤 원하지 않는 소켓 수로 판정 0 → 버림(노말 품질 낮은 tier라 손해 아님).
  - 큐빙은 **펀치 레시피(Recipe.Punch 45~48)만** 착용품을 쓴다. 다른 큐빙(크래프트 1~36·리롤 49~51은 재료가 `result === 0`이라 착용 중인 tier 장비가 재료로 잡혀 옵션이 바뀌어 사라짐, 유니크·레어 업그레이드 37~44·Moser2 56은 베이스가 바뀜)은 보관품만(사용자 261023). 화이트 업그레이드(LowToNorm 54·55)는 착용품을 써도 되지만 그 로직이 없어 그대로(사용자). 다시 굴리기(`rerollRunewords`)는 보관품만(착용 중인 룬워드는 자기 tier를 넘지 못해 "맞지 않는 룬워드"로 판정될 수 있음).
  - 부작용 검토(261023): 제작 중 실패 시 반쯤 찬 베이스는 손해 없음(재료 옵션 0, 잃는 것은 룬 — 보관품과 같음). 무기 교체 칸(11·12)은 봇이 쓰지 않음. 뺀 동안 스탯 변화 없음(재료에 옵션 없음).
  - 착용 중 펀치 대상은 무기와 착용 가능한 스피릿 재료 방패(아카란 론다쉬 등). 아머 펀치는 이더리얼만이라 착용 대상 아님, 세이크리드 타지·볼텍스 실드는 힘 부족(사용자).
- **바꾼 것**(261024 `789d80d`)
  - `Misc.takeOff(item, merc, tag)`(새 함수, 룬워드·큐빙 공통): 인벤토리 자리 확인 → 빼기(플레이어 `Storage.Inventory.MoveTo` — `toCursor`가 착용 칸에서 집음, 용병 `clickItem(4, 칸)` → 커서 → 인벤토리) → 실패로 커서에 남으면 `cursorCheck` → `Equip.updateTier`/`Grant.updateTier` → trace.
  - `Runewords.makeRunewords` 앞: 착용 장비(플레이어 머리·몸·양손, 용병 장착품) 중 `getBase` 조건에 맞고 룬이 보관품에 모두 있는 베이스를 뺀다. 같은 룬을 두 베이스에 세지 않게 뺀 만큼 룬을 차감.
  - `Cubing.doCubing` 앞: 착용 장비 중 펀치 레시피 베이스(노말·0소켓·이더리얼 조건, `validItem` 펀치 조건과 같음)이고 나머지 재료가 보관품에 있는 것을 뺀다. 재료는 classid가 같고 룬워드용으로 잡아 둔 룬(`Runewords.validGids`)이 아닌 것(`validItem`의 룬·보석 조건은 보관품에 베이스가 있어야 켜지는 `recipe.Enabled`에 기대므로 쓰지 않음).
  - 그 뒤 제작·마을 정리(`clearInventory`, 칸이 빈 칸 -1이라 tier 줄에 맞으면 남음)·재장착(`doChores`의 `Equip.autoEquip`·`Grant.autoEquip`)은 기존 동작. `node --check` 통과(3파일).
- **후속 수정**(261024 `aafbe50`, 검증 전 결함): 베이스를 입고만 있으면 보관품에 베이스가 없는 것으로 보아 ① 룬워드는 그 레시피 룬을 잡아 두지도(`validGids`) 줍지도(`needList`) 않고 ② 펀치는 레시피가 꺼져(`Enabled`, `Cubing.buildLists`가 보관품 베이스로만 켬) 재료를 줍지 않았다. 완성 보석은 nip이 줍지 않아(Y.nip 주석) 펀치 쪽 빼기가 거의 일어나지 않을 상태였다(추정).
  - `Misc.wornItems()`(새 함수): 플레이어 머리·몸·양손 + 용병 장착품 목록. `makeRunewords`·`doCubing` 앞단, `Runewords.buildLists`, `Cubing.buildLists` 4곳에서 씀.
  - `Runewords.buildLists`: 입은 장비가 `getBase` 조건에 맞으면 보관품 베이스처럼 룬을 잡아 두고 모자란 룬을 줍는다(다시 굴리기용 Hel 판단 `baseCheck`는 보관품 기준 그대로).
  - `Cubing.buildLists`: 펀치 레시피만, 입은 장비가 베이스 조건(노말·0소켓·이더리얼)에 맞으면 레시피를 켠다 → 재료와 완성 보석 하위 레시피를 줍는다.
  - `doCubing` 앞단: 재료 확인을 기존 `validItem`으로 되돌림.
  - 261024 삭제: `aafbe50`에서 승인 없이 넣은 앞단 직전 `this.update()`. 펀치 베이스는 줍기·도박으로 들어올 때 목록이 다시 만들어져 레시피가 켜지므로(상점은 큐빙 재료를 사지 않음) 실익이 없음(사용자 261024).
  - 확인한 영향: 픽잇이 아이템마다 판정할 때는 목록을 다시 만들지 않는다(큐빙 재료를 주웠을 때·마을·큐빙 중에만, 룬은 `Runewords.update`로 목록만 조정). 방패 펀치의 완성 루비·흠 없는 루비는 소켓 넣기(헬름·몸·무기 루비)와 겹치나, 큐빙이 먼저 쓰는 순서일 뿐 해가 아님(사용자). 보관품 베이스일 때도 같다. `node --check` 통과(3파일).
- **후속 수정 2**(261025 `9c0d445`, PR #98, 인게임 오류): `aafbe50`의 `Misc.wornItems` 용병 부분 `(merc.getItems() || []).forEach(...)`가 게임에서 작동하지 않았다 — `Error in AutoSmurf (misc.js #2269) [].forEach is not a function`(a4·a5 같은 시각, Pz-3, 1막 마을), 바로 뒤 경험치 줄로 그 게임이 끝남. 설계 때 `merc.getItems()`가 배열을 돌려준다고 가정했고, 저장소에서 용병 장비를 읽는 기존 방식(`getItem`/`getNext`, `length` 반복)과 대조하지 않았다. `node --check`는 문법만 본다.
  - 원인은 확정하지 못함: 공개 소스 `noah-/d2bs`(f4b99bb, SpiderMonkey 1.8.5)의 `unit_getItems`는 진짜 배열 또는 값 없음(`undefined`)을 돌려주므로 이 오류가 나지 않아야 한다. kolbot에 화살표 함수가 있어 사용 중인 D2BS는 이 소스와 다른 버전으로 추정. 사용 중인 버전의 소스는 확인하지 못함.
  - 수정: 용병 장비를 `merc.getItem()` + `getNext()`로 하나씩 읽음(`Grant.getEquippedItem`과 같은 방식). `getNext`가 같은 객체를 다음 아이템으로 바꾸므로 목록에는 `copyUnit`으로 복사해 넣음. 새 변수 `mercItem`. 고르는 조건(`location === 1`)과 목록 형태는 그대로.
  - 인게임 검증(261025, 사용자가 임시 trace `[Worn] merc:`를 `default.dbj`에 넣어 게임당 1번 기록, 저장소에는 넣지 않음): 장비 0개 → 빈칸, 1개 → `[Body] Hard Leather Armor of Thorns`, 2개(a1) → `[Body]`·`[Head]`, 3개(a5) → `[Body] Quilted Armor, [Head] Cap, [ArmR] Short Bow`. 실제 장비와 일치(사용자 확인), 같은 아이템 반복 없음. 오류 재발 없음. trace 제거 조건(한 게임 이상 실제와 일치) 충족.
- **검증 방법**: trace `[Runeword] takeOff [칸] 이름 (player|merc): ok | fail (no room | still equipped | stuck on cursor)`, `[Cube] takeOff ...`. ok 뒤 같은 방문에 룬워드면 `[Runeword] 이름`·ItemLog `Runeworded`, 펀치면 `[Punch]`·`Transmuted`, 이어서 그 칸 재장착(ItemLog `Equipped`, 용병은 `Granted`). fail이면 그 장비가 착용 그대로인가. 입은 베이스가 있을 때 그 레시피 재료를 줍는가(ItemLog `Ingredient`, 펀치는 완성 보석·흠 없는 보석, 룬워드는 그 룬). 제거 조건: 룬워드·펀치 각각 ok 1건 이상, fail 0이면 trace 삭제.
- **결과**: 261025 이번 로그에 적용되지 않음(실행 시작 10/24 13:47이 `789d80d` 병합 13:57보다 앞, 실행 중 파일 변경 없음 — 사용자). `takeOff` 0, 룬워드 11·펀치 1 모두 보관함 베이스.
  - 261026 룬워드 확정: a1 10/25 20:36:27 `[Runeword] takeOff [ArmR] Double Axe (player): ok` → 20:36:45 ItemLog `Runeworded` Steel → 20:36:52 `Equipped`. fail 0. 펀치 케이스 미발견: takeOff 0, `Transmuted` 0(보관함 베이스 포함 펀치 자체가 0). 착용한 펀치 베이스는 있었음(a4 Targe, a2 Broad Sword, a1 Crystal Sword). 재료의 완성 자수정·루비가 한 번도 없었음(ItemLog 0, 흠 없는 자수정은 프로필당 최대 2개 — 완성에 3개 필요, 흠 없는 루비는 판매됨).
  - trace는 펀치 확인 전까지 그대로 둔다(사용자 261026, 나중에 지움).
  - 261027 `takeOff` 0, 펀치 1(보관함 베이스, a3 Crystal Sword). 261028 룬워드 `takeOff` ok 1(a3 00:05:18 `[Body] Breast Plate` → 00:05:27 ItemLog `Runeworded` Stealth → 00:05:36 `Equipped`), fail 0. 펀치 2(a8 04:44:51·a7 07:40:58 Crystal Sword)는 모두 보관함 베이스(`Stashed` 00:20:32·01:05:04), `[Cube] takeOff` 0 → 착용 베이스 펀치는 케이스 미발견.

### 3-34. SafeTele 발밑 노드 제외·excludedNodes 삭제 (`Pather.moveTo` 안 `safeCheckNode`, 사용자 261023·261025, 옛 2-8)
- **바꾼 것**(261025 `d93027d`, `libs/Pather.js`)
  - SafeTele 발동 조건에 `getDistance(me, node) > 2` 추가. 경로를 처음 만들 때와 안전 좌표(`safeNode`)로 텔레한 뒤 다시 만들 때 첫 노드가 내 위치라, 그 노드에서 `safeCheckNode`가 돌면 방향이 `atan2(0, 0)` = 0(동쪽) ±75°, 10칸 링부터 뽑혀 경로와 무관한 안전 좌표로 텔레했다(코드 읽음, 로그 미확인). 밀집 지역의 후퇴·재방문 반복(사용자 관찰 261023)의 원인으로 본다(추정).
  - 최근 5자리 5칸 안 후보 제외(`excludedNodes`) 삭제. 몹이 움직여 예전 자리를 막는 것이 안전 판단이 아니고, 발밑 노드를 막으면 실효가 없다(사용자 결정 261025).
  - 나은 자리가 없으면 원래 노드로 텔레하는 흐름은 그대로. `node --check` 통과.
  - (261025 `13ebf32`) 발동 조건 `> 2` → `> 5`. 엔진이 막힌 출발 칸을 옮기면(`MutatePoint`, `D2BS_Structure.md`) 첫 노드가 대각선 (2,2) = 2.8칸 어긋날 수 있어서, `teleportTo` 도착 판정 5칸에 맞췄다. 5칸 안 노드는 후보가 최소 10칸(`Min`)이라 SafeTele가 쓸모없고, 원래 노드로 이동은 그대로 한다(사용자 결정 261025).
  - 원래 노드로 이동하는 조건(`getDistance(me, node) > 2`)은 그대로. 이 조건은 텔레·걷기, 중간 노드·목적지 모두에 걸려서, 올리면 목적지가 3~5칸 앞일 때 이동하지 않고 성공(`<= 5`)으로 끝난다(사용자 결정 261025).
  - 옛 2-8의 제자리 텔레(`[teleportTo failed]`)는 핑 문제일 수 있어 항목에서 삭제(사용자 261025).
- **검증 방법**: 밀집 지역에서 후퇴·안전 좌표 텔레 반복이 줄고 앞으로 나아가는지 육안으로 본다(후보를 고른 trace 없음). 치킨 사례가 밀집 지역 텔레 이동 중에 나오는지 본다.
- **결과**: 아직 없음(`d93027d`·`13ebf32` 병합 뒤 main으로 돈 로그부터).
  - 261026: 육안으로 크게 나아졌는지는 모르겠고 치킨은 조금 준 것 같음(사용자). 계속 관찰(사용자 261026). 참고: Life Chicken 46(a1 30), 261025는 54(a1 40).
  - 261027 Life Chicken 47(a1 26), 261028 46(a1 27).

### 3-35. default.dbj 시작부 오류를 멈춤으로 (`default.dbj` main, 사용자 261026, 옛 2-24)
- **문제**: `Config.init`·`Runewords.init`·`Cubing.init`(default.dbj main, `Loader.init` 앞)은 try 밖이라 여기서 오류가 나면 default.dbj만 죽고 trace·콘솔에 아무것도 남지 않은 채 게임이 최대 게임 시간(30분)까지 서 있다.
- **확인된 것**: 261026 로그 10/25 13:57~16:18 Pz-4~8. 용병이 있는 a1·a4·a5·a6이 게임마다 d2bs 로그에만 `[Error] Code(22) … misc.js:2269 TypeError: [].forEach is not a function`(3-32 후속 수정 2의 오류)을 남기고 멈춤 → 5게임 × 30분. 콘솔은 플레이 시간 요약뿐(퇴장 사유 줄 없음). 나머지 프로필은 120초 뒤 `Party desynced 1`. 다시 시작해도 같은 코드라 복구되지 않는다.
- **결정**(사용자 261026): 이 구간의 오류는 재시작이 아니라 멈춤(`D2Bot.stop`, CLAUDE.md 4절 멈춤 = 빨강 콘솔 + trace)으로 뺀다.
- **바꾼 것**(261026 `d87cfcb`): `default.dbj` main의 `Config.init`~`Cubing.init` 5줄을 try로 감싸고, catch에서 `Misc.errorReport(e, "default.dbj")`(회색 콘솔 + `[Error]` trace) → 빨강 콘솔 `Init failed in default.dbj. Stopping`(위치 없음) + trace → `D2Bot.stop()` → `return false`.
- **검증 방법**: 시작부 오류가 나면 빨강 `Init failed … Stopping`과 매니저 멈춤(30분 서 있지 않음).
- **결과**: 아직 없음.
  - 261027·261028 케이스 미발견 — `Init failed` 0, 시작부 오류 없음.

### 3-38. 소켓용 완성 보석 큐빙 (`Cubing.buildRecipes`·`buildLists`, `Town.socketGems`, 사용자 261026, 옛 2-27)
- **문제**: 소켓 설정(`Config.SocketRecipe`)에 완성 보석을 넣어도 흠 없는 보석 3개를 모아 완성 보석을 만드는 연결이 없다(소켓 줍기와 큐빙은 별개).
- **확인된 것**(코드 읽음): 큐빙 결과물은 인벤토리로 감(`Cubing.emptyCube`). `Town.stash`는 판정 1~3이나 큐빙·룬워드 보관 대상(`keepItem`)만 보관함으로 → 다른 레시피(펀치 등) 재료로 잡힌 완성 보석은 보관함으로 가고 `socketGems`(인벤토리 보석만)는 못 쓴다. `clearInventory`는 판정 0·4만 버리거나 팔아 소켓 보석(판정 5)은 남는다. `me.findItems`는 엔진이 넘겨주는 순서의 배열(정렬 없음, `Prototypes.js`). `socketGems`는 큐빙 목록을 갱신하지 않는다(처음부터 없음). 보관함 보석은 보존하고 소켓에 쓰지 않는다(사용자).
- **바꾼 것**(261026 `d87cfcb`): ① `buildRecipes`: `Config.SocketRecipe`에 완성 보석 번호(561·566·571·576·581·586·601)가 있을 때만 흠 없는 보석 3개 → 완성 레시피 추가(새 속성 `Socket`). 보석 종류 번호(아무 등급)는 대상 아님. ② `buildLists`: 완성 보석별 "그 번호를 받는 빈 소켓 수 − 인벤토리 보유 수"만큼 인벤토리 완성 보석을 다른 레시피 후보에서 빼고, 0 이하이면 소켓 레시피를 건너뜀(줍기 안 함). ③ `socketGems`: 넣은 것이 있으면 끝에서 `Cubing.update()`. (261026 사용자 `30c9b4e`) `Config.Cubing`일 때만 부름 — 큐빙이 꺼져 있으면 `Cubing.init`이 레시피를 만들지 않아 갱신할 것이 없다. 수정 `libs/Cubing.js`·`libs/Town.js`.
- **검증 방법**: 빌드가 `Config.SocketRecipe`에 완성 보석 번호를 넣은 경우에만 해당. 빈 소켓이 있을 때 ItemLog `Ingredient` 흠 없는 보석 → `Transmuted` 완성 보석 → 콘솔 `[Socket]`·ItemLog `Socketed`. 소켓이 찬 뒤에는 그 흠 없는 보석 `Ingredient`가 없어야 한다. 지금 빌드 설정에는 완성 보석 번호가 없음(`Config.js` 기본은 종류 번호) → 설정을 바꾼 뒤부터.
- **결과**: 아직 없음.
  - 261027·261028 케이스 미발견 — 소켓 설정에 완성 보석 번호 없음(`Config.js` 기본값 종류 번호, 빌드에서 바꾸는 곳 없음).

### 3-39. NTIP 파서 읽기 통일·문법 검사 (`NTItemParser.dbl`, nip 문법, `Config.js`, `builds/*.js`, 사용자 261028, 옛 2-22)
- **바꾼 것**
  - (같은 항목이던 사용자 업로드 261027~261028 소켓 우선 tier·기어 조건 nip은 검증 통과로 `docs/code/nips.md`로 옮김, 사용자 261028)
  - Claude 261028 `4a1738d` 외(PR #103 이후 커밋 포함, 노트는 `docs/code/NTItemParser.md`·`Config.md`·`Misc.md`·`builds.md`·`nips.md`)
    - 파서 `ParseLineInt` 재작성: 속성·스탯 칸 `NTIP.ParseExpr`, 끝 칸 `NTIP.ParseRule`(본문·홀드 공통). 틀린 줄은 `Misc.errorReport` 후 버림, `#` 3개 이상·`@` 2개 이상·값 키 중복은 표시만(`Misc.errorReport`), 기어 키 중복(범위 등)은 trace `NTIP: duplicate gear key`만.
    - 홀드 끝 칸 `[owned]`(없으면 `< 1`), 기어 조건 값 `goal`(`Config.TierGoal.<칸>`, 용병 칸은 오류), `[tiered]`는 표시(`Config.Tiered`)만.
    - 칸 이름 `Helm Amulet Armor ArmG ArmB RingG RingB Belt Boots Gloves`(nip 키는 소문자, 용병 `[merchelm]`·`[mercarmor]`·`[mercarmg]`), `Config.TieredGear` 삭제.
    - nip: 홀드 `[qty] < 1` 29곳 삭제·3곳 `[owned]`, 기어 키 201줄, `[tiered] == 0` → `[tiered]` 28줄(주석 2 포함), P.FIST 주석 줄 `[tiered] != 0` 삭제.
  - 확인(node, 게임 아님): 수정 전후 파서로 nip 전체 6012줄 파싱 결과 비교 차이 0(이름 변경·`[owned]`·`[tiered]` 정규화 뒤), 로드 오류 0. 틀린 줄 시험 71줄 기대와 불일치 0. 가짜 아이템으로 `EvaluateItem`의 `[tiered]`·`goal`·홀드 기본값 판정 확인.
- **검증 방법**
  - 로드: 게임 시작 때 회색 콘솔·`_cache/trace/ScriptErrorLog.txt`에 nip 오류(`Unknown …`, `Bad rule`, `Syntax error`, `Unexpected symbol`, `Missing ]`, `Unclosed (` 등) 0. 표시 줄(`Duplicate rule key`, `More than two #`, `More than one @`)도 0. 기어 키 범위 줄의 trace `NTIP: duplicate gear key`는 정상.
  - 칸 이름: print `equipped: [ArmG] N` 등 새 이름으로 찍힘.
  - 기어 조건: 재료 줄 ItemLog 줄 끝 `(ArmG<31)` 등이 찍히고, 그 칸 tier가 기준 이상이 된 뒤에는 같은 재료를 줍지 않음.
  - 홀드 기본값: `[qty] < 1`을 지운 29줄이 지금처럼 홀드 대상을 가졌을 때 베이스를 줍지 않음.
  - `[tiered]`: print `Tiered: true` 게임에서만 HotO 베이스 등 그 줄이 켜짐(ItemLog 줄 끝 `(Tiered)`).
- **결과**: 261028 이번 로그에 적용되지 않음 — 실행 코드가 `8144c74`까지(사용자 261028), 마지막 게임(13:01:58)까지 print `equipped: [ArmL]`·ItemLog `(ArmL<25)` 옛 이름.

### 3-40. 인챈트 대상을 빌드 이름으로 (`Precast.enchant`, `Build.getBuildType`, 사용자 261028)
- **바꾼 것**(261028 `dfc884b`): `Build.getBuildType(profile)`(Settings.js, 인자 없으면 `me.profile`). `Config.Enchant.Player`는 직업 번호 → 빌드 이름(S.SFFW 65레벨 `["M.HYBR"]`). `Precast.enchant`가 처음 부를 때 한 번만 `Team.Profiles` 중 빌드가 목록에 있는 프로필의 `Profile(p).character`로 `Precast.enchantNames`(새 속성)를 만들고, 플레이어는 이 이름만 인챈트. 용병·소환수는 그대로(40칸 안 파티원 전원의 용병·소환수).
- **검증 방법**: S.SFFW 65레벨 이상 게임에서 print `enchant: <M.HYBR 캐릭터 이름>`만 찍히고(다른 플레이어 이름 없음) 오류 0. 용병·소환수 `enchant: <classid>`는 전과 같음.
- **결과**: 아직 없음.

### 3-41. 랜덤무브를 moveTo 계열 random 인자로 통일 (`AutoSmurf` 41곳, `Pather.moveTo` random, 사용자 261028)
- **바꾼 것**(261028 `dfc884b`): `Pather.moveTo(me.x + myX, me.y + myY)` 41곳을 random 인자로. 고정 지점 이동 바로 뒤의 흩어지기 11곳은 앞 이동(`moveTo`/`moveToPreset`)에 random을 주고 흩어지기 줄을 지움, 제자리 흩어지기 30곳은 `moveTo(me.x, me.y, 3, false, false, true)`(기존 261007 4곳과 같음). `AutoSmurf`의 `myX`·`myY` 삭제(이를 쓰던 옛 주석 줄 5개도 261028 삭제) → 오프셋은 `Pather.myX/myY`(reflection 유지). 프로필별 자리는 Pather 표 순서로 바뀜.
- **검증 방법**: 웨이·포탈 자리·보스 대기 자리에서 팀이 흩어져 서는가(육안). 오류(`moveTo` throw) 증가 없음. 막힌 오프셋은 `no random path` → `original path`(콘솔 줄, 곧 삭제 예정 — 사용자).
- **결과**: 아직 없음.

### 3-42. 아마존 활이 없을 때 활 스킬 → 일반 공격 (`Amazon.doAttack`, 사용자 261028)
- **바꾼 것**(261028 `dfc884b`): 새 속성 `ClassAttack.bowSkills`(6·7·11·12·16·21·22·26·27·31, alias `Amazon skills`·skills.txt 이름 대조), 쓰이지 않던 `bowCheck` 삭제. `doAttack`에서 스킬 선택(로우마나 포함) 뒤 `!Attack.usingBow()`이면 활 스킬을 0(일반 공격)으로. 면역 검사 없음(극초반 대비, -1이면 몹을 건너뜀 — 사용자).
- **검증 방법**: M.HYBR가 활 없이 Cold Arrow 단계(6레벨~)일 때 일반 공격으로 싸우는가(육안). 활을 든 뒤에는 전과 같음.
- **결과**: 아직 없음.

### 3-43. 써모너 일지 전원 1회 읽기·듀리엘 Atma 대화 삭제 (`AutoSmurf.summoner`·`duriel`, 1단계, 사용자 261028)
- **문제**(사용자 관찰): 듀리엘에서 일부 팔로워(간헐적으로 1명 또는 여럿)가 오리피스 무덤 포탈(첫 포탈)을 못 탄다. 퀘스트 창은 캐니언 웨이를 찍고 마을에 오면 끝나 있는데도 못 타고, 그때 멈추고 수동으로 NPC 대화를 하면 탈 수 있다. 일지를 직접 읽지 않은 프로필로 추정(사용자). `quest_flags.md` 12번 bit0(일지 조작 = 2막 파티원에게도 설정)과 다른 결과다.
- **확인된 것**(코드): 써모너 일지 반복은 46번 포탈이 이미 있으면 바로 끝나 리더가 연 뒤에는 팔로워가 일지를 누르지 않았다. 261027 Atma 대화는 무덤에 들어간 뒤(두리엘 방 포탈 대기 전)라 첫 포탈과 무관했다.
- **바꾼 것**(261028 `dfc884b`): `summoner` 일지 반복 앞에 일지 1회 누르기(포탈 유무 무관). `duriel` 팔로워 Atma 대화 삭제.
- **검증 방법**: 못 탄 팔로워는 마을에서 끝없이 기다리므로 리더의 구멍 앞 okCount에서 DURIEL 구간 `Party desynced`와 그 프로필의 `party has left … town:true`가 남는다. 이 사례가 없어지면 일지가 원인. 그대로면 2단계(리더가 무덤에 도착한 시점에 NPC 대화).
- **바꾼 것 2**(261028, 판별 trace): 일지를 누른 뒤의 대기(`me.ping * 2 + 1000`)를 같은 시간 동안 10ms마다 `getIsTalkingNPC()`를 보는 대기로 바꿈(대사는 끊지 않음, 동작 같음). trace `[Summoner] journal: dialog at Nms dist:D` / `no dialog dist:D` / `none`(일지 유닛 없음). 퀘스트 플래그(12번 bit0)는 파티원에게도 켜져 직접 읽었는지 가르지 못하므로, 그 프로필 화면에 일지 대사가 떴는지(상호작용 성공)로 본다. 근거: 260929 `[OD]` a8 일지 대사가 누른 뒤 약 922ms에 떠서 약 78ms 만에 닫힘(`crash_analysis.md` 유형 B, 관찰 1건). 새 지역 변수 `tick`·`talked`.
- **판정**: DURIEL 실패 프로필의 그 게임 써모너 줄이 `dialog at`이면 읽었는데도 못 들어감(가설 틀림) → 2단계. `no dialog`·`none`이면 못 읽음(가설 맞음) → 일지 앞으로 다가가 누르게 고침. 제거 조건: 실패 1건 판정, 또는 두 사이클 실패 0.
- **결과**: 아직 없음.

### 3-44. 소켓 로그: 매니저 아이템 로그는 tier가 오를 때만, ItemLog 소켓 상태 (`Town.socketGems`, 사용자 261028)
- **바꾼 것**(261028 `dfc884b`): 보석마다 넣기 전 tier(`NTIP.GetScore`, 새 지역 변수 `tierBefore`)와 넣은 뒤 tier(`Equip.getEquippedItem(칸).tier`)를 비교해 올랐을 때만 `Misc.logItem("Socketed")`. 콘솔 `[Socket]`·print·ItemLog는 보석마다 그대로. ItemLog `Socketed` 줄 끝 `{nip 줄 / (찬/전체)}`(매칭 줄 없으면 `{(찬/전체)}`).
- **검증 방법**: ItemLog `Socketed` 줄 끝 `(n/m)`이 콘솔 `[Socket] … (n/m)`과 같고, 두 수가 같다. 매니저 아이템 로그 `Socketed`는 tier가 오른 넣기에만(같은 시각 print `equipped: [칸] N`이 전보다 큼).
- **결과**: 아직 없음.

### 3-45. MiniShopBot·용병 부활을 LowGold로 (`Town.buyPotions`·`repair`·`reviveMerc`, 사용자 261028)
- **바꾼 것**(261028 `dfc884b`): `MiniShopBot` 호출 조건 4곳(`buyPotions` 2, `repair` 2)에 `me.gold >= Config.LowGold`(노말 벨트 쇼핑 조건은 그대로). `reviveMerc`의 `Config.MercMinGold`(20만) → `Config.LowGold`, `MercMinGold` 삭제. 목적: 나이트메어 끝~헬은 용병 사용 구간이라 부활 골드를 남겨 둠. 45레벨부터 `LowGold = charlvl × 3000`(70레벨 21만, 빌드 14개 같음).
- **검증 방법**: 골드가 `LowGold` 미만인 나이트메어·헬 방문에서 `MiniShopBot: Scanning` 머리 글자·ItemLog `Shopped`가 없고, 용병이 죽었을 때 골드 `LowGold` 이상이면 부활(`[Hired]`/용병 장비 그대로).
- **결과**: 아직 없음.

### 3-46. 고대인 팔로워 tpReady 대기 (`AutoSmurf.ancients`, 사용자 261028)
- **문제**(사용자): 시체 회수 때문에 포탈을 정상 앞(118)에서 열게 바꾼 뒤(261004) 팔로워가 tpReady 없이 118로 가는 아무 포탈이나 타서, 리더의 타운치킨 포탈에 합류했다.
- **바꾼 것**(261028 `dfc884b`): 리더 `makePortal` 뒤 `tpReady` 전송, 팔로워는 `while (me.inTown) { if (tpReady) usePortal(118, null) }` 뒤 `tpReady = false`(다른 보스와 같은 방식). 나머지 tpReady 없는 대기 목록은 기각(`rejected.md`).
- **검증 방법**: 고대인 구간에서 팔로워가 리더 포탈 뒤에만 118에 들어가고(리더 타운치킨 중 합류 없음), 정상 진입·킬이 전과 같다.
- **결과**: 아직 없음.

### 3-47. 팀 대기 okCount 통일·리더 웨이 모으기 10분, 팔로워 syncBO 신호 유실 (`AutoSmurf` okCount·travel·onCopyData·2·3막 팔로워 루프, 사용자 261021·261025·261026·261028, 옛 3-36)
- **바꾼 것**(`f26ef73`, `bots/AutoSmurf.js`)
  - 팀 대기를 `this.okCount()`로: `start`(readyCount·teamReady, 2분 퇴장), `buffCount`(buffCount·teamBuff, 타임아웃 없음), `syncBO`(BOCount·BOReady, 30초 퇴장), `syncBO` 안 syncWP 10회 대기.
  - syncBO 결정: 리더는 BO가 필요할 때(`!me.getState(32)`)만 `BOing`을 한 번 보내고 okCount. 모두 okCount 뒤 `BOing`이 아니면 `return false`, 맞으면 `BOing = false`로 지우고 진행. `BOed` 변수·메시지 삭제. 리더의 BOing은 리더의 teamCount보다 먼저 오므로 okCount가 끝나면 도착해 있다(같은 사람 메시지는 순서대로).
  - 카우: 리더는 `msgLeader`를 한 번만 보냄(반복·msgFollower 답장 삭제). 팀 대기는 뒤의 기존 okCount.
  - 지운 변수: `imReady`·`readyCount`·`teamReady`·`BOed`·`BOCount`·`BOReady`·`myBuff`·`buffCount`·`teamBuff`·`msgFollower`. 한 방향 신호(tpReady·msgLeader·earlyReturn·좌표·teamFigurine)와 스위치는 그대로. 이름은 그대로(옛 이름 통일 지시는 대상이 사라져 지움).
  - 알려진 위험(추정): 5막처럼 syncBO가 연달아 불릴 때 리더 BO가 그 사이(수백 ms)에 꺼지면 다음 회차 BOing이 앞 회차에 읽힐 수 있다. 팀원 간 `partyLevel`·퀘스트 상태가 다르면 지금도 어긋나며, 바뀐 뒤에는 그 자리 okCount에서 120초 퇴장한다.
- **검증 방법**
  - 각 싱크 자리에서 `Party desynced 1/2`가 없는지, 있으면 안 온 이름과 자리(start·buffCount·syncBO·syncWP·cows).
  - syncBO: `act* BO` print가 팀 전원에 나오는지(BO가 필요한 회차), 리더 BO 상태에서 팀 전원이 바로 넘어가는지.
  - 카우: 팔로워 `followDriver end` 뒤 okCount를 통과하는지.
  - `syncBO timeout`·`Team didn't join the game within 2 minutes`는 더 나오지 않아야 한다(사유 바뀜).
- **결과**: 261026 **실패**(최종 코드 구간).
  - 정상: `Party desynced 2` 0, `syncBO timeout`·`Team didn't join` 0, 버프 맞추기 91회 모두 8명이 같은 분에 `act* BO`, 카우 2게임 정상 종료.
  - 실패 사례 6게임: 리더가 웨이를 모으는(`travel`) 동안 팔로워가 다음 okCount에서 120초 퇴장 — Pz-40 22:33(travel 9), Pz-59 02:19(travel 2 → `buffCount(1)`), Pz-65 03:12·Pz-66 03:15·Pz-90 07:54·Pz-91 08:09(travel 9 → `shenk` 안 `syncBO`). 바뀌기 전(`f26ef73^`)에는 팔로워가 `buffCount`의 `teamBuff`, `syncBO`의 `while (!BOed && !BOing)`에서 타임아웃 없이 기다렸다(코드 읽음). Ancient's Way 웨이 모으기가 난이도마다 3~4게임에 걸쳐 끝남(조각 합계 약 5~5분 45초).
  - 다른 낙오 사례는 옛 3-37(261028 기각, `rejected.md` PartyThread).
- **확인된 것**(261026 코드 읽음): `travel` 호출 10곳 중 팔로워의 다음 대기가 리더를 기다리는 okCount인 곳은 travel(2)(`buffCount(1)`)·(5)(`buffCount(2)`)·(8)(`izual` 안 `syncBO`)·(9)(`shenk` 안 `syncBO`)·(10)(`baal` 안 `syncBO`). 나머지(1·3 포탈 대기, 4 팔로워 안 감, 6·7 3막 메시지 대기)는 타임아웃 없는 대기.
- **바꾼 것 2**(261026 `d87cfcb`, 안 A, `bots/AutoSmurf.js`): 새 변수 `leaderTravel`, `travel`의 실제 이동 분기(`nextAreaIndex < areaIDs.length`) 첫 줄에서 메시지 `travel` 보냄, onCopyData `case "travel"`, `okCount` 타임아웃 `leaderTravel ? 600 : 120`초, 퇴장 상세에 `travel` 값, okCount 단계 끝에서 `leaderTravel = false`. 받은 표시는 다음 okCount 하나에만 쓰인다 → 타임아웃 없는 대기 뒤(1·3·4·6·7)에는 웨이 모으기 뒤 첫 okCount 하나가 10분(리더가 실제로 웨이를 모으는 게임만).
- **검증 방법 2**: 리더가 웨이를 모으는 게임(`Traveling to` 뒤 `[getWP]`·`going to nearest WP`)에서 120초 퇴장이 없는가. `Party desynced 1`이 나오면 상세 끝 `travel true/false`.
- **결과 2**
  - 261027: 리더가 실제로 웨이를 모은 게임 21개에서 그 뒤 120초 퇴장 0(Ancient's Way Pz-26·50·51·52·80·81 포함), 퇴장 25줄 모두 `travel false`, `Party desynced 2`·`syncBO timeout` 0, `act* BO` 8명 모두 135회. Pz-73·74에 아래 실패와 같은 모양(Kurast Docktown 웨이 자리 낙오).
  - 261028: 웨이 모으기 10분 통과 — Pz-32 리더 Ancient's Way 웨이 모으기 221초(23:58:06 → 00:01:47 SHENK) 뒤 shenk syncBO에서 8명 모두 00:02:13 `act5 BO`(261026 실패 유형). `travel true` 0, `Party desynced 2`·`syncBO timeout`·`Team didn't join` 0.
  - 261028 **실패**: Kurast Docktown 10게임 연속(Pz-76~82·84~86, 08:29~09:33). 리더 `act3 BO` → `Traveling to Travincal`(웨이가 이미 있어 이동 없음) → 121~122초 뒤 `Party desynced 1`. 빠진 팔로워(a4 8회, a5·a7·a8·a6)는 모두 마을 웨이 자리(5161,5051)에 서 있음(`town:true`).
- **확인된 것 2**(261028 코드 읽음): 2·3막 팔로워 루프가 `if (syncBO) { this.syncBO(); syncBO = false; }` 순서라, 팔로워가 앞 syncBO의 끝(웨이로 마을 복귀 + 대기)을 도는 동안 받은 다음 `syncBO` 신호를 끝난 뒤 지운다. 리더는 travel(6)이 바로 돌아오면 앞 syncBO 복귀 1초 안팎에 다음 신호를 보낸다(퇴장이 `Traveling` 뒤 121~122초). 옛 코드(`f26ef73^`)는 `BOing`·`BOed`를 받는 메시지 처리에서 바로 `BOCount`로 답해 팔로워가 syncBO 안에 없어도 리더가 넘어갔다.
- **가설**: 위 순서로 신호가 지워져 팔로워가 두 번째 syncBO의 okCount에 오지 않는다(신호 도착 시각은 로그에 없음).
- **바꾼 것 3**(261028 `68483de`, 사용자 수정): `bots/AutoSmurf.js` 2·3막 팔로워 루프 2곳을 `syncBO = false; this.syncBO();` 순서로. 새 변수·함수·로그 없음. 부작용 검토(코드 읽음): 신호는 리더가 자기 syncBO 직전에 한 번만 보내고(2막 1곳·3막 6곳), 다른 구간(duriel·shenk·izual)은 신호 없이 syncBO를 직접 부른다. 리더가 BO 상태면 다음 syncBO는 okCount만 하고 끝난다.
- **검증 방법 3**: 웨이를 이미 가진 게임의 3막 `Traveling to Travincal` 직후 desync 0. 위 검증 방법(싱크 자리별 desync, `act* BO` 전원, 웨이 모으기 10분)도 함께 본다.

### 3-48. 탈라샤 무덤 상자 이동 재시도 (`AutoSmurf.tombs`, 사용자 261028)
- **문제**: 무덤 안에서 상자까지 못 가 `[Quit] Tomb chest not reached` — 261023 4건, 261027 4건, 261028 4건(10/27 22:04·22:31 a3, 22:15·23:01 a6).
- **확인된 것**: `exitTo`로 무덤에 들어가 okCount 뒤 상자 프리셋까지 `Pather.moveTo(…, 3, true)`(경로 이동 실패 때 경로를 3번까지 다시 만듦)를 최대 3번, 그래도 25칸 넘게 남으면 퇴장. `482171b`(261022)에서 무한 while을 3회 상한으로 바꾼 자리(`docs/code/AutoSmurf.md` exitTo). 261028 4건 모두 앞에 `[Error]`·경로 보정 줄 없음 → `moveTo`가 오류 없이 도착하지 못한 채 3번 돌아옴. 남은 거리는 줄에 없음. 261023 판정: 미로형 지역에서 8명 동선이 꼬여 다시 시도가 많은 탓(사용자).
- **바꾼 것**(261028 `68483de`, 사용자 수정): 바깥 반복 `j < 3` → `j < 10`(최대 `moveTo` 10번 × 경로 재시도 3 = 30). 같은 3회 상한의 다른 5곳(Arcane·Cube chest·Radament chest·Orifice·Red portal)은 그대로.
- **검증 방법**: `Tomb chest not reached` 수. 상자 다음에는 대기가 없고 다음 무덤 입구 okCount(120초)에서 기다리므로, 늘어난 시간으로 퇴장 사유가 desync로 바뀌는지 함께 본다.

### 3-49. 판별 줄 삭제 (옛 3-27 벨트·`chores` 판별, 옛 3-37 상태·단계 표시, 사용자 261028)
- **결정**: 3-27 검증 통과로 판별 줄 삭제(사용자 261028, 경위는 `docs/code/Town.md` clearBelt), 옛 3-37 기각으로 표시 삭제(사용자 261028, `rejected.md` PartyThread).
- **바꾼 것**(261028 `4e6087b`, Claude, 사용자 요청. `node --check` 2파일 통과, 남긴 줄은 원래 형태 — `pot.buy` 호출, 넣기 성공 뒤 `break` 조건은 같은 뜻으로 `!== total`)
  - `libs/Town.js`: `Town.chores` 객체(`doChores`의 `c`)와 `doChores`·`buyPotions`·`clearBelt`·`clearInventory`의 기록 줄 전부, `chores N.Ns: …` trace, `buyPotions: buy failed` trace 4줄, `clearBelt`의 `shiftFails`와 `belt shift fail` trace. `clearBelt` 넣기 성공 뒤 `break`(261025, 동작)와 그 판정용 빈칸 합계 비교는 남긴다.
  - `libs/Town.js`: `scriptBroadcast("chores:…")` 11줄(`doChores`), `scriptBroadcast("town:…")` 4줄(`visitTown`).
  - `threads/PartyThread.js`: `lastStep`, `scriptmsg` 리스너(3-37 때 새로 만듦), `party has left` trace의 `town:`·`mode:`·`ui:`·`step:`(위치는 남김, 사용자 261024).
- **검증 방법**: 삭제 뒤 로그에 `chores`·`belt shift fail`·`buy failed`·`step:` 줄 0, 벨트 넣기·정리 동작 변화 없음.
