# libs/Attacks/Barbarian.js

## doAttack

### 260928 Claude: preattack 선참조 수정
- preattack이 대입 전 `attackSkill`을 참조 → `Config.AttackSkill[0]` 사거리.

### 260929 Claude: 선공격 setPosition 실패 시 `return 0`
- Howl 사거리 밖일 때 setPosition이 실패하면 return 0. 리턴 없이 본공격으로 넘어가 `tick.fail = "unreachable"`이 남아 본공격이 성공한 틱도 unreachable로 판정됐다. 사거리 안이면 setPosition을 안 부르는 거리 조건(진동 방지)은 그대로.

## doCast

### 261002 Claude: War Cry 회피 없음
- War Cry(154)는 사거리 밖이거나 0x4로 막혔을 때만 setPosition. 261003에 `MinSkillRange`로 회피가 없어져 가드 지움(동작 같음).

## findItem

### 260928 Claude: clear 호출 정리
- `clear(10, false×4)` → `clear(10)`.
