# libs/Attacks/*.js (직업 공격)

직업 공격 파일 수정은 이 노트 하나에 둔다(CLAUDE.md 5절). 코드 파일 이름 절 안에 함수별 절, 그 안에 수정 이력을 시간순으로 쌓는다.

## Amazon.js

### doAttack / doCast

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).

## Assassin.js

### doAttack / doCast

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).

## Barbarian.js

### doAttack

#### 260928 Claude: preattack 선참조 수정
- preattack이 대입 전 `attackSkill`을 참조 → `Config.AttackSkill[0]` 사거리.

#### 260929 Claude: 선공격 setPosition 실패 시 `return 0`
- Howl 사거리 밖일 때 setPosition이 실패하면 return 0. 리턴 없이 본공격으로 넘어가 `tick.fail = "unreachable"`이 남아 본공격이 성공한 틱도 unreachable로 판정됐다. 사거리 안이면 setPosition을 안 부르는 거리 조건(진동 방지)은 그대로.

### doCast

#### 261002 Claude: War Cry 회피 없음
- War Cry(154)는 사거리 밖이거나 0x4로 막혔을 때만 setPosition. 261003에 `MinSkillRange`로 회피가 없어져 가드 지움(동작 같음).

### findItem

#### 260928 Claude: clear 호출 정리
- `clear(10, false×4)` → `clear(10)`.

## Druid.js

### doAttack / doCast

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).

## Necromancer.js

### doAttack / doCast

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).

## Paladin.js

### getHammerPosition

#### 260928 Claude: 옛 clear의 Angle/Detour 게이트
- 해머는 setPosition을 안 거치므로 맨 앞에 게이트. 조건 0x5(해머는 몹 옆에 서야 하므로 0x1로 막혀도 이동이 필요). 막히면 `tick.fail = "unreachable"`. MUST는 게이트 없음(260929 NoSkipArea 제거). 박스 울타리는 적용 안 함(설 자리가 몹 옆 5칸 이내, 회피 없음).
- 확인: 260930 trace에서 해머딘 헛돎 없음(`log_results.md`).

## Sorceress.js

### doAttack / doCast

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).
- 소서의 42·43 예외 분기(사용자 261003 업로드)는 지움.

## Wereform.js

### doAttack / doCast

#### 261002 Claude: 쇼크웨이브 시전 좌표, 회피 없는 스킬
- 쇼크웨이브(243): 몹이 5칸보다 가까우면 몹 방향 5칸 지점에 시전(막힌 자리면 몹 좌표). 근거: 측정(커서 거리 1~10 × 3회)에서 미사일 5개가 커서 지점과 좌우 1·2칸을 향하고, 이웃 미사일 간격이 d5부터 2.6 이하(2×2 몹에 빈틈 없음). 세부는 `skill_range.md`.
- Shock Wave·Armageddon(249)은 사거리 밖이거나 0x4로 막혔을 때만 setPosition(회피 반경 안에 몹이 있으면 매 틱 물러난 뒤 시전해 한 턴씩 늦었다). 261003에 Shock Wave 가드는 `MinSkillRange`로 회피가 없어져 지움, Armageddon 가드는 유지.
- 선공격의 249 전용 변신 분기 삭제(`Misc.md` Skill.cast가 맡음).

#### 261003 Claude: 직업 공격 기준 거리 (사용자 요청)
- `doAttack`이 그 몹에게 고른 `timedSkill`·`untimedSkill` 중 짧은 사거리(`baseRange`, -1 제외, 로우마나 교체 뒤 계산)를 구해 `doCast`에 넘기고, 두 스킬 모두 그 거리로 `setPosition`한다. 다가가기만 하는 스킬·자체 위치 스킬은 자기 사거리.
- 이유: 같은 몹에게 타임드와 언타임드의 사거리가 다르면 회피(텔레는 사거리 지점에 착지)로 두 거리를 오간다(예: S.FONV 번개 면역 몹에 오브 ↔ 텔레키네시스 20). 면역 몹은 자기가 맞을 수 있는 스킬 거리에 선다(B안, A안은 `rejected.md`).
- 남는 것(사용자 수용): 면역 몹이 섞인 무리에서 몹이 바뀔 때 거리가 바뀌는 진동, `LowManaSkill` 근접 공격 진동(1~17레벨).
