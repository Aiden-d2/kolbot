# tools/NTItemParser.dbl

## GetScore

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 홀드 판정은 `holdRule.Owned`(옛 `Qty`)를 `eval(보유 개수 + Owned)`로 본다.
- tiered 판정: 규칙에 `Tiered`가 있으면 `Config.Tiered`가 참일 때만 통과(부위별 `Config.TieredGear`·반대 형태 삭제).
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

## EvaluateItem

### 261025 사용자: 기어 tier 게이트 (`[body] < 21`, `[mercbody] < 21`)
- 목적: 재료 줄의 경쟁과 개수 제한을 홀드 없이 짧게 쓴다. 그 칸의 착용 tier가 미달일 때만 재료를 줍는다. 홀드의 개수 세기(`CheckQuantityOwned`, 매번 아이템 전체를 훑음) 대신 저장된 tier 값만 읽는다.
- 동작: `[tiered]` 게이트 바로 다음(gate1b)에서 규칙의 `TierCheck`(비교식)를 계산해, 거짓이면 그 줄을 건너뛴다. 맞은 줄의 결과 줄 글자에 `TierCheckStr`를 넘긴다.
- `GetScore`(tier·용병 점수)에는 넣지 않는다. 점수는 착용 칸 tier 갱신(`Equip.updateTier` → `getEquippedItem` → `GetScore`)에도 쓰이므로, 자기 칸을 보는 조건이 들어가면 직전 저장값에 따라 결과가 바뀌며 되풀이된다.

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- tiered 게이트는 `Config.Tiered`만 본다. 홀드 게이트(gate5)는 `holdRule.Owned`. 기어 조건 게이트(gate1b)는 그대로이며 값이 `goal`이면 식이 `Config.TierGoal.<칸>`과 비교한다(실시간 `TierNow`와 빌드 목표).

## buildLineStr

### 261025 사용자: 기어 tier 게이트 (`[body] < 21`, `[mercbody] < 21`)
- 인자 `tierCheck` 추가. 값이 있으면 줄 끝에 ` / (ArmR<41)` 모양으로 붙인다. 조건이 여럿이면 `(Body<=20)(RingL>=3)`, 용병은 `(MercBody<21)`. 맞은 줄에만 찍힌다.

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 인자 `tieredNegate` 삭제. `[tiered]` 줄이면 ` / (Tiered)`. 기어 조건 표시는 새 칸 이름(` / (ArmG<goal)`).

## IsSyntaxInt

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 삭제(새 읽기 함수는 쓰지 않음).

## ParseLineInt

### 261025 사용자: 기어 tier 게이트 (`[body] < 21`, `[mercbody] < 21`)
- 끝 칸(세 번째 `#`)의 새 키: 플레이어 `[head] [neck] [body] [armr] [arml] [ringr] [ringl] [belt] [boots] [mitts]` → `Config.TierNow.<칸>.tier`. 용병 `[merchead] [mercbody] [mercarmr]` → `Config.TierMerc.<칸>.merc`.
- 부등호 `<` `>` `<=` `>=` `==`, 오른쪽은 숫자. `&&`로 여러 개를 잇고 모두 맞아야 한다(끝 칸의 `||`는 기존 키와 같이 `&&`처럼 묶임 → "R 또는 L"은 줄 두 개로 쓴다).
- 용병 키는 비교식 앞에 `Config.UseMerc&&`를 붙인다 → 용병을 쓰지 않으면 그 줄을 건너뛴다.
- 틀린 부등호·숫자, 용병 세 칸 밖의 키는 `Misc.errorReport` 후 줄을 버린다.
- 기어 키만 있는 줄은 일반 묶음, `[qty]`와 같이 있으면 수량 묶음(기존 분류 그대로). 게이트는 묶음과 상관없이 맨 앞에서 거른다.
- 쓰는 예(바바리안 스피릿 두 자루): `(베이스) && [flag] != runeword # [sockets] == 4 # [qty] == 1 && [armr] < 41`과 같은 줄의 `[arml] < 41`. 한쪽을 완성해 끼우면 다른 줄이 남아 1개를 더 줍는다. `[flag] != runeword`가 없으면 완성품이 개수에 들어가 두 번째 베이스를 줍지 못한다.
- 같은 줄에 `[tier]`나 `[merc]`가 있으면 기어 조건(`TierCheck`·`TierCheckStr`)을 지우고 줄은 남긴다. trace `NTIP: gear tier ignored on tier/merc line File: … Line: …`. `GetScore`가 기어 조건을 보지 않으므로 줍기 판정과 점수를 맞추기 위함.
- 확인: node로 예시 줄 파싱·게이트 켜짐/꺼짐·`UseMerc` 꺼짐·tier/merc 줄에서 빠짐(키 순서 무관)·수량 줄은 유지, nip 전체 6351줄 파싱 결과가 수정 전과 같음. 인게임 검증은 nip 줄을 바꾼 뒤.
- 이전 `[tiered] == N`(칸 번호, `TierGoal` 도달 여부)은 그대로 둔다. nip에서 N ≠ 0으로 쓰는 줄은 없다.

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 줄을 `@`로 본문·홀드, `#`로 속성·스탯·끝 칸으로 나누고, 속성·스탯 칸은 `NTIP.ParseExpr`, 끝 칸은 `NTIP.ParseRule`로 읽는다. 홀드도 같은 함수(홀드용 복사 코드 삭제).
- `@` 뒤가 비면 홀드 없음(기존과 같음). `@` 2개 이상, `#` 3개 이상이면 `Misc.errorReport`로 표시만 하고 넘친 부분은 기존처럼 버린다.
- 함수 하나라도 `false`면 줄을 버린다(오류 내용은 각 함수가 `Misc.errorReport`로 남김: 회색 콘솔, trace `[Error]`, `ScriptErrorLog.txt`).
- 반환 형태(`[속성식, 스탯식, 규칙, 홀드 속성식, 홀드 스탯식, 홀드 규칙]`)는 그대로. 확인: 수정 전후 nip 전체 파싱 결과가 같음(이름·`[owned]`·`[tiered]` 정규화 뒤).
- 바뀐 경계: 1~4글자짜리 속성·스탯 칸도 읽는다(옛 코드는 무시). `[prefix]`·`[suffix]`에 숫자 값도 식이 된다(옛 코드는 괄호가 닫히지 않아 조용히 무시됨).

## ParseExpr

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 새 함수. 속성 칸(`kind` "property")·스탯 칸("stat")을 식으로 바꾸고 문법을 검사한다. 빈 칸은 `""`.
- 속성 칸: `[키워드] 연산자 값`. 키워드 `color type name class quality flag level prefix suffix`, 연산자 `== != < <= > >=`(`flag`·`prefix`·`suffix`는 `==`·`!=`만, `!=`면 `!item.getFlag(…)`), 값은 별칭 또는 숫자(`prefix`·`suffix`는 이름 문자열).
- 스탯 칸: `[별칭]`·`[번호]`·`[번호,번호]` → `item.getStatEx(…)`.
- 키워드 밖 글자는 허용 목록만: `&& || == != >= <= > < ( ) + - * /`, 숫자, 이름(`me.diff` 등). `=` 하나, `&`·`|` 하나, `===`, `^`, `%`, `~`, `!`, `;` 등은 오류.
- 같은 괄호 높이(또는 괄호 밖)에 `&&`와 `||`가 같이 있으면 오류. 닫히지 않은 `(`, 남는 `)`는 오류.
- 마지막에 `new Function`으로 컴파일 검사.

## ParseRule

### 261028 사용자: 파서 읽기 통일·문법 검사, 홀드 `[owned]`, 기어 칸 이름·`goal`, `[tiered]` 표시 (handoff 3-39)
- 새 함수. 끝 칸(본문·홀드 공통)을 `[키] 연산자 값` 조각으로 `&&`로만 이어 읽는다(앞뒤 남는 글자, `||`, `[` 빠짐은 오류).
- 본문 키: `[tier]`·`[merc]`·`[qty]`는 `==` 정수. `[tiered]`는 연산자·값 없이 표시만(`Tiered: true`), `[tiered] == 0` 등 옛 형태는 오류. 기어 조건 `[helm] [amulet] [armor] [armg] [armb] [ringg] [ringb] [belt] [boots] [gloves]`, 용병 `[merchelm] [mercarmor] [mercarmg]`는 `< <= > >= ==` 정수 또는 `goal`(용병 칸 `goal`은 오류), 식은 `Config.TierNow.<칸>.tier 연산자 값`(용병은 `Config.UseMerc&&Config.TierMerc.<칸>.merc …`).
- 홀드 키: `[owned]`만, `< <= > >= ==` 정수 → `Owned: "<1"` 모양. 없으면 `< 1`(홀드 조건에 맞는 아이템을 1개 이상 가지면 건너뜀). 홀드에 다른 키(`[qty]` 포함)는 오류.
- 같은 키가 두 번 나오면: 값 키(`[tier]`·`[merc]`·`[qty]`·`[tiered]`·`[owned]`)는 뒤 값이 덮어쓰는 실수라 `Duplicate rule key`를 `Misc.errorReport`로 표시(줄은 남김). 기어 키는 조건이 모두 `&&`로 적용되어 범위(`[armg] > 10 && [armg] < 31`)로 쓸 수 있으므로 trace `NTIP: duplicate gear key [키]`만 남김(`a599048`).
- tier·merc 줄의 기어 조건은 기존처럼 빼고 trace `NTIP: gear tier ignored on tier/merc line`.
