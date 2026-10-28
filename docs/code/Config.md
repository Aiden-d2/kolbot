# libs/Config.js

## Gear / TierGoal / TierNow / TierMerc

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 칸 이름(칸 번호 1~10): `Helm`, `Amulet`, `Armor`, `ArmG`(4, 무기·장갑 쪽), `ArmB`(5, 방패·부츠 쪽), `RingG`(6), `RingB`(7), `Belt`, `Boots`, `Gloves`. 옛 이름 `Head Neck Body ArmR ArmL RingR RingL Belt Boots Mitts`.
- `TierMerc` 칸: `Helm`, `Armor`, `ArmG`.
- nip 기어 조건 키는 이 이름의 소문자(`[armg]`, 용병 `[mercarmg]`), 값 `goal`은 `TierGoal.<칸>`(`NTItemParser.md` ParseRule).
- 로그 칸 이름도 이 이름(`equipped: [ArmG]`, takeOff·socketGems trace, 아이템 로그 `(ArmG<41)`).

## TieredGear

### 261028 사용자: 기어 칸 이름·`TieredGear` 삭제 (handoff 3-39)
- 삭제. 읽던 곳은 nip `[tiered] == 1~10`·`!= N` 판정뿐이었고, 그 형태가 없어짐(`[tiered]`는 `Config.Tiered`만 봄).
