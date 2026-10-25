# tools/NTItemParser.dbl

## EvaluateItem

### 261025 사용자: 기어 tier 게이트 (`[body] < 21`, `[mercbody] < 21`)
- 목적: 재료 줄의 경쟁과 개수 제한을 홀드 없이 짧게 쓴다. 그 칸의 착용 tier가 미달일 때만 재료를 줍는다. 홀드의 개수 세기(`CheckQuantityOwned`, 매번 아이템 전체를 훑음) 대신 저장된 tier 값만 읽는다.
- 동작: `[tiered]` 게이트 바로 다음(gate1b)에서 규칙의 `TierCheck`(비교식)를 계산해, 거짓이면 그 줄을 건너뛴다. 맞은 줄의 결과 줄 글자에 `TierCheckStr`를 넘긴다.
- `GetScore`(tier·용병 점수)에는 넣지 않는다. 점수는 착용 칸 tier 갱신(`Equip.updateTier` → `getEquippedItem` → `GetScore`)에도 쓰이므로, 자기 칸을 보는 조건이 들어가면 직전 저장값에 따라 결과가 바뀌며 되풀이된다.

## buildLineStr

### 261025 사용자: 기어 tier 게이트 (`[body] < 21`, `[mercbody] < 21`)
- 인자 `tierCheck` 추가. 값이 있으면 줄 끝에 ` / (ArmR<41)` 모양으로 붙인다. 조건이 여럿이면 `(Body<=20)(RingL>=3)`, 용병은 `(MercBody<21)`. 맞은 줄에만 찍힌다.

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

