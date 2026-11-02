# builds/*.js

## A.TRAP.js · B.WCRY.js · D.FGOM.js · D.WIND.js · M.HYBR.js · N.SUMM.js · P.CONC.js · P.CONV.js · P.FIST.js · S.COLD.js · S.FIRE.js · S.FONV.js · S.LTNG.js · S.SFFW.js (14개 공통)

### 261028 사용자: `TierGoal` 칸 이름 (handoff 3-39)
- 1레벨 Update의 `Config.TierGoal.Head/Neck/Body/ArmR/ArmL/RingR/RingL/Mitts` → `Helm/Amulet/Armor/ArmG/ArmB/RingG/RingB/Gloves`(빌드당 8줄, 주석으로 꺼 둔 M.HYBR `ArmB` 포함). `Belt`·`Boots`는 그대로. 숫자는 바꾸지 않음(261027 사용자 업로드 값).
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

### 261030 사용자: `Config.PublicMode` 삭제
- 1레벨 Update의 `if (me.profile === Team.Leader) { Config.PublicMode = 3; }` 블록 삭제(빌드당 4줄, 뒤 빈 줄 포함). 읽는 곳이 없었다(`Config.md` PublicMode). 동작은 바꾸지 않음.

## A.TRAP.js · B.WCRY.js · D.FGOM.js · D.WIND.js · M.BOWF.js · N.SUMM.js · P.AURA.js · P.HAMM.js · S.COLD.js · S.ENCH.js · S.FIRE.js · S.LTNG.js · S.NORB.js (13개 공통)

### 261102 사용자: 기어 칸 이름 (`Head Neck Body ArmA ArmB RingA RingB Waist Shoes Hands`)
- 1레벨 Update의 `Config.TierGoal.<칸>` 10줄을 새 칸 이름으로(`Config.md` Gear). 주석으로 꺼 둔 M.BOWF `ArmB` 포함. 숫자는 바꾸지 않음.

### 261102 사용자: 날짜 표기·이력 주석 삭제
- 줄 끝의 날짜 표기와 이력 메모(`renamed`, `Recipes -> CubeRecipe`, `Runewords -> RunewordRecipe`, `18 -> 25`, `Config.` 등)를 지움. S.ENCH `// Fire Wall + Telekinesis` 같은 설명은 남김. 값은 바꾸지 않음.
- 빌드 파일은 수정한 줄에 날짜 표기를 달지 않음(사용자 결정 261102).

## S.FIRE.js

### 261029 사용자·Claude: 스태틱 필드 로직 통합 (`0b06f24`·`63f59af`, PR #122·#124, 옛 handoff 3-52)
- 6레벨의 주석 블록(옛 `CastStatic` %) 삭제, 46레벨 `CastStatic = true`, `StaticList = []`.
- 261030 사용자(`38ee175`): 18·46레벨 스태틱 설정은 모두 주석(꺼 둠). `StaticHP`·`StaticBossHP` 주석 줄에 `Config.`(`7972c72`).
- 확인: 261031·261101 로그 `[teleportTo failed]` 7·4(261029 13, 261030 6, 늘지 않음), 동작은 사용자 육안. 검증 통과(사용자 261101).

## S.SFFW.js

### 261028 Claude: 인챈트 대상을 빌드 이름으로 (`dfc884b`, 사용자 요청, 옛 handoff 3-40)
- 65레벨 Update `Config.Enchant.Player = ["M.HYBR"]`(옛 직업 번호 0).
- 확인: `Precast.md` enchant. 검증 통과(사용자 261029).

### 261029 사용자·Claude: 스태틱 필드 로직 통합 (`0b06f24`·`63f59af`, PR #122·#124, 옛 handoff 3-52)
- 18레벨 노멀 `CastStatic = true`(보스 6 리스트 유지). 46레벨 `AttackSkill = [-1, 51, -1, 51, -1, -1, 43]`, `CastStatic = true`, `StaticList = []`.
- 261030 사용자(`38ee175`): 18레벨 `CastStatic = true`를 난이도 조건 없이(보스 6 리스트). `StaticHP`·`StaticBossHP` 주석 줄에 `Config.`(`7972c72`).
- 확인: 261031·261101 로그 `[teleportTo failed]` 7·4(261029 13, 261030 6, 늘지 않음), 동작은 사용자 육안. 검증 통과(사용자 261101).
