# libs/Runewords.js

## buildLists

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 입은 장비(`Misc.wornItems`)가 `getBase` 조건에 맞으면 보관품 베이스처럼 그 레시피 룬을 잡아 두고(`validGids`) 모자란 룬을 줍는다(`needList`). 다시 굴리기용 Hel 판단 `baseCheck`는 보관품 기준 그대로.
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

## makeRunewords

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 앞단: 착용 장비 중 `getBase` 조건에 맞고 룬이 보관품에 모두 있는 베이스를 `Misc.takeOff`로 뺀다. 같은 룬을 두 베이스에 세지 않게 뺀 만큼 룬을 차감. 다시 굴리기(`rerollRunewords`)는 보관품만.
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.
