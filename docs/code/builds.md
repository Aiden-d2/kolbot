# builds/*.js

## A.TRAP.js · B.WCRY.js · D.FGOM.js · D.WIND.js · M.HYBR.js · N.SUMM.js · P.CONC.js · P.CONV.js · P.FIST.js · S.COLD.js · S.FIRE.js · S.FONV.js · S.LTNG.js · S.SFFW.js (14개 공통)

### 261028 사용자: `TierGoal` 칸 이름 (handoff 3-39)
- 1레벨 Update의 `Config.TierGoal.Head/Neck/Body/ArmR/ArmL/RingR/RingL/Mitts` → `Helm/Amulet/Armor/ArmG/ArmB/RingG/RingB/Gloves`(빌드당 8줄, 주석으로 꺼 둔 M.HYBR `ArmB` 포함). `Belt`·`Boots`는 그대로. 숫자는 바꾸지 않음(261027 사용자 업로드 값).
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

### 261030 사용자: `Config.PublicMode` 삭제
- 1레벨 Update의 `if (me.profile === Team.Leader) { Config.PublicMode = 3; }` 블록 삭제(빌드당 4줄, 뒤 빈 줄 포함). 읽는 곳이 없었다(`Config.md` PublicMode). 동작은 바꾸지 않음.

## S.SFFW.js

### 261028 Claude: 인챈트 대상을 빌드 이름으로 (`dfc884b`, 사용자 요청, 옛 handoff 3-40)
- 65레벨 Update `Config.Enchant.Player = ["M.HYBR"]`(옛 직업 번호 0).
- 확인: `Precast.md` enchant. 검증 통과(사용자 261029).
