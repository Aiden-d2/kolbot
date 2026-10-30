# libs/Cubing.js

## buildRecipes

### 261026 Claude: 소켓용 최상급 보석 레시피 (`d87cfcb`, 사용자 결정, 옛 handoff 2-27·3-38)
- `Config.SocketRecipe`에 최상급(Perfect) 보석 번호(561·566·571·576·581·586·601, mpqdata `misc.txt` Perfect Amethyst·Topaz·Sapphire·Emerald·Ruby·Diamond·Skull)가 있을 때만 흠 없는(Flawless) 보석 3개 → 최상급 레시피를 추가(새 속성 `Socket`). 보석 종류 번호(아무 등급)는 대상 아님.
- 확인: 인게임 사례 없음(빌드 설정에 최상급 번호 없음, 261027~261030). 코드 읽음으로 사용자 확정(261030).

## buildLists

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 펀치 레시피(Recipe.Punch 45~48)만, 입은 장비가 베이스 조건(노말·0소켓·이더리얼)에 맞으면 레시피를 켠다 → 재료와 완성 보석 하위 레시피를 줍는다. 다른 큐빙(크래프트·리롤·업그레이드·Moser2)은 보관품만(사용자 261023).
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

### 261026 Claude: 소켓용 최상급 보석 후보 (`d87cfcb`, 사용자 결정, 옛 handoff 2-27·3-38)
- 최상급 보석별 "그 번호를 받는 빈 소켓 수 − 인벤토리 보유 수"만큼 인벤토리 최상급 보석을 다른 레시피 후보에서 빼고, 0 이하이면 소켓 레시피를 건너뜀(흠 없는 보석을 줍지 않음). 보관함 보석은 보존하고 소켓에 쓰지 않는다(사용자).
- 확인: `buildRecipes` 261026과 같다(사용자 확정 261030).

## doCubing

### 261024 Claude: 착용 중인 재료 베이스로 룬워드·펀치 (`789d80d`·`aafbe50`·`9c0d445`, 사용자 결정 261023·261024·261025, 옛 handoff 3-32)
- 앞단: 착용 장비 중 펀치 레시피 베이스이고 나머지 재료가 보관품에 있는 것을 `Misc.takeOff`로 뺀다. 재료 확인은 기존 `validItem`.
- 확인: 룬워드 takeOff ok 3건 — 261026 a1 `[ArmR] Double Axe` → Steel, 261028 a3 `[Body] Breast Plate` → Stealth, 261029 a2 `[ArmG] Double Axe` → Steel(18:05:57 → 18:06:08 `Runeworded` → 18:06:32 `Equipped`), fail 0. 착용 베이스 펀치는 사례 없음(펀치는 모두 보관함 베이스). 검증 통과(사용자 261029). trace `[Runeword] takeOff`·`[Cube] takeOff`는 코드에 남아 있음.

### 261029 Claude: takeOff trace 삭제 (사용자 요청)
- 검증 통과(옛 handoff 3-32)로 `[Runeword]/[Cube] takeOff …` trace 삭제. 그 줄에서만 쓰던 `Misc.takeOff`의 지역 변수 `name`·인자 `tag`도 지우고, 호출 2곳(`Runewords.makeRunewords`·`Cubing.doCubing`)의 셋째 인자를 뺌. 동작 같음.
