# libs/Config.js

## Gear / TierGoal / TierNow / TierMerc

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 칸 이름(칸 번호 1~10): `Helm`, `Amulet`, `Armor`, `ArmG`(4, 무기·장갑 쪽), `ArmB`(5, 방패·부츠 쪽), `RingG`(6), `RingB`(7), `Belt`, `Boots`, `Gloves`. 옛 이름 `Head Neck Body ArmR ArmL RingR RingL Belt Boots Mitts`.
- `TierMerc` 칸: `Helm`, `Armor`, `ArmG`.
- nip 기어 조건 키는 이 이름의 소문자(`[armg]`, 용병 `[mercarmg]`), 값 `goal`은 `TierGoal.<칸>`(`NTItemParser.md` ParseRule).
- 로그 칸 이름도 이 이름(`equipped: [ArmG]`, takeOff·socketGems trace, 아이템 로그 `(ArmG<41)`).
- 확인: 261029 로그 — nip 로드 오류·표시 줄 0(ScriptErrorLog·회색 콘솔), print `equipped:` 새 칸 이름만, ItemLog 기어 조건 표시 124줄(그중 100줄을 그 시각 착용 tier와 대조, 기준 이상이 된 뒤 줍기 0). `[tiered]`(ItemLog `(Tiered)` 0)·홀드 기본값은 사례를 확인하지 않음. 검증 통과(사용자 261029, 같은 헤더 항목 공통).

## TieredGear

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 삭제. 읽던 곳은 nip `[tiered] == 1~10`·`!= N` 판정뿐이었고, 그 형태가 없어짐(`[tiered]`는 `Config.Tiered`만 봄).
