# libs/Config.js

## 파일 전체

### 261102 사용자: 날짜 표기·이력 주석 삭제
- 줄 끝의 날짜 표기(`//261008` 등)와 이력 메모(`60 -> 75 (...)`, `renamed`, `Recipes -> CubeRecipe`, `was class ids` 등)를 지움. 날짜와 사용법 설명이 섞인 주석은 사용법 설명만 남김(`OpenChests`, `UseKeys`, `Socketing`, `SocketRecipe`, `Gear`, 꺼 둔 룬워드의 이유). 값은 바꾸지 않음.
- 이 파일은 수정한 줄에 날짜 표기를 달지 않음(사용자 결정 261102).

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `Config.init` 오류 print → `Misc.print("[Config] Failed: …")`(색 코드 지움). 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.

## Gear / TierGoal / TierNow / TierMerc

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 칸 이름(칸 번호 1~10): `Helm`, `Amulet`, `Armor`, `ArmG`(4, 무기·장갑 쪽), `ArmB`(5, 방패·부츠 쪽), `RingG`(6), `RingB`(7), `Belt`, `Boots`, `Gloves`. 옛 이름 `Head Neck Body ArmR ArmL RingR RingL Belt Boots Mitts`.
- `TierMerc` 칸: `Helm`, `Armor`, `ArmG`.
- nip 기어 조건 키는 이 이름의 소문자(`[armg]`, 용병 `[mercarmg]`), 값 `goal`은 `TierGoal.<칸>`(`NTItemParser.md` ParseRule).
- 로그 칸 이름도 이 이름(`equipped: [ArmG]`, takeOff·socketGems trace, 아이템 로그 `(ArmG<41)`).
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

### 261102 사용자: 기어 칸 이름 (`Head Neck Body ArmA ArmB RingA RingB Waist Shoes Hands`)
- 칸 이름이 아이템 타입·이름(`[type] == armor` 등)과 겹치지 않게 바꿈. 칸 번호 1~10: `Head`, `Neck`, `Body`, `ArmA`(4, 무기·장갑 쪽), `ArmB`(5, 방패·부츠 쪽), `RingA`(6), `RingB`(7), `Waist`, `Shoes`, `Hands`. 바로 전 이름 `Helm Amulet Armor ArmG ArmB RingG RingB Belt Boots Gloves`.
- `TierMerc` 칸: `Head`, `Body`, `ArmA`.
- nip 기어 조건 키는 이 이름의 소문자(`[body]`, `[arma]`, `[armb]`, 용병 `[mercarma]`). 새 키 10개는 `tools/NTItemAlias.dbl` 별칭과 겹치지 않음.
- 로그 칸 이름도 이 이름(`equipped: [ArmA]`, 아이템 로그 `(ArmA<41)`).

## TieredGear

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 삭제. 읽던 곳은 nip `[tiered] == 1~10`·`!= N` 판정뿐이었고, 그 형태가 없어짐(`[tiered]`는 `Config.Tiered`만 봄).

## PublicMode

### 261030 사용자: `PublicMode` 삭제
- `//Party` 주석과 `PublicMode: 2` 삭제. 읽는 곳이 없었다(261030 `.js`·`.dbj` grep: 이 기본값과 빌드 14개의 대입뿐). 파티 초대·수락은 `PartyThread` partyCheck가 `Team.Leader` 기준으로 한다(리더: 초대만, 그 밖: 수락만).
- 동작은 바꾸지 않음.

## CastStatic / StaticHP / StaticBossHP / StaticList

### 261029 사용자·Claude: 스태틱 필드 로직 통합 (`0b06f24`·`63f59af`, PR #122·#124, 옛 handoff 3-52)
- `CastStatic` = `true`/`false` 스위치(옛 % 값 겸용 삭제). 새 키 `StaticHP: [25, 33, 50]`(일반 몹), `StaticBossHP: [10, 33, 50]`(보스), [노멀, 나이트메어, 헬] — 이 %까지 스태틱. `StaticList`가 비면 전체.
- 확인: 261031·261101 로그 `[teleportTo failed]` 7·4(261029 13, 261030 6, 늘지 않음), 동작은 사용자 육안. 검증 통과(사용자 261101).
