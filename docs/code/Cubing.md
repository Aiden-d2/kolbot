# libs/Cubing.js

## buildLists

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 펀치 레시피(Recipe.Punch 45~48)만, 입은 장비가 베이스 조건(노말·0소켓·이더리얼)에 맞으면 레시피를 켠다 → 재료와 완성 보석 하위 레시피를 줍는다. 다른 큐빙(크래프트·리롤·업그레이드·Moser2)은 보관품만(사용자 261023).
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

## doCubing

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 앞단: 착용 장비 중 펀치 레시피 베이스이고 나머지 재료가 보관품에 있는 것을 `Misc.takeOff`로 뺀다. 재료 확인은 기존 `validItem`.
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

### 261029 Claude: takeOff trace 삭제 (사용자 요청)
- 검증 통과(옛 handoff 3-32)로 `[Runeword]/[Cube] takeOff …` trace 삭제. 그 줄에서만 쓰던 `Misc.takeOff`의 지역 변수 `name`·인자 `tag`도 지우고, 호출 2곳(`Runewords.makeRunewords`·`Cubing.doCubing`)의 셋째 인자를 뺌. 동작 같음.
