# libs/Attacks/Assassin.js

## doAttack / doCast

### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).
