# libs/Attack.js

구성: `Attack.clear(range, must)`가 단일 전투 엔진이다(옛 `clear`/`clearList`/`kill` 통합). `ClassAttack.doAttack → doCast` 안에서 `Attack.setPosition`(위치 선정)과 `Skill.cast`(시전)가 `Attack.tick`에 결과를 남기고, clear가 그것으로 판정한다. 옛 함수 본문은 커밋 `a40271a`·`fcd2713`에 있다. 흐름 해설(공부용)은 `attack_flow.md`.

## init

### 260928 Claude: 레벨업 때 다시 호출
- `AutoBuild.levelUpHandler`가 `Attack.init()`을 무조건 다시 부른다(46레벨 Wereform이 그 게임부터 적용). 엔진이 이미 include한 파일은 건너뛰어 부작용 없음. 핸들러는 default.dbj에만 등록.

## clear

### 260928 Claude: 단일 전투 엔진 (리팩터링)
- **시그니처** `clear(range, must)`. `range`는 소탕(SWEEP) 반경, 생략 시 25, 0이면 지역 소탕 없음. `must`는 반드시 죽일 대상: classid / 이름 / 배열(혼용 가능) / 박스 `{x1, x2, y1, y2}`(range 강제 0). `"all"`과 gid 지정 규칙은 없다.
- **반환** false = 사망, 소 레벨 카우킹 감지, `AttackSkill[1]`·`[3]` 미설정, 설정된 공격 스킬 미보유(콘솔 + `D2Bot.stop()`). 그 외 true. throw하지 않는다(`range`가 숫자가 아닐 때만).
- **대상 등급**
  - MUST(`must` 매칭): 포기 없음. 사망 또는 시야 상실 후 탐색 포기까지. 쓸 스킬이 없으면 뒤로 보냄(deferred). id·이름·배열은 gid로 끝까지, 박스는 박스 안에 있을 때만.
  - SWEEP(기준점 range 안): 조건 충족 시 버림(이번 호출 동안 재진입 불가).
  - SWEEP 위험: MUST가 살아 있거나 대기 중일 때 내 주변 `dangerRange` 10. 나와 10 넘으면 제거.
- **진입** gameReady 대기, range·AttackSkill 검증, 스킬 보유 검사(AttackSkill 배열의 -1 아닌 슬롯마다 `me.getSkill(id, 1)`, 기본 스킬 0~3은 보유로 봄), 박스면 range 0, gidSkip 리셋(지역 변경 또는 마지막 스킵 위치에서 40 초과), MUST 대기 창(id·이름·배열이면 5 × (ping×2 + 100)ms 동안 MUST가 있다고 간주).
- **한 틱**
  1. 사망 → false / 소 레벨 카우킹 → false / TownCheck.
  2. 스캔(getUnit 1회): checkMonster 통과 전체 → `tick.monList`. 목록에 없는 유닛 중 이번 호출에서 버린 gid는 무시, must 매칭은 MUST 합류, 기준점 range 안 또는 (MUST 있음 && 나와 10 이내)는 1단 확정 제외(checkSkipped / skipCheck / 쓸 스킬 없음) 뒤 SWEEP 합류.
  3. 정리: MUST가 안 보이면 마지막 위치 기억(그 위치 5 안에 왔는데도 안 보이면 제거), 사망·박스 밖은 제거. SWEEP은 사망·범위 밖 제거.
  4. 보이는 대상이 없음: 시야 잃은 MUST → 마지막 위치로 moveTo(최대 3회), MUST 대기 창 중 → 짧게 대기, 그 외 → 종료.
  5. 대상 선정: 거리순이 대전제. 후보는 deferred 아닌 대상(없으면 deferred 포함). 카오스(108)에서 보스 아닌 StormCaster(306)가 나와 0x4로 막혀 있으면 SWEEP 버림.
  6. 공격: tick 초기화, `tick.must` → `ClassAttack.doAttack(대상, 실제 시전 수 % 10 === 0)`.
  7. 평가: 결과 2(유효 스킬 없음) → SWEEP 버림 / MUST deferred. `tick.fail == "unreachable"` → SWEEP 버림 / MUST deferred. 결과 0 또는 tick.fail → 대상별 retry + flash, 5회째 SWEEP 버림 / MUST retry 리셋. 결과 1인데 시전 없음 → SWEEP idle 5회 연속이면 버림 / MUST 5회마다 flash. 실제 시전 → 대상별 시전 수 +1, 근접(사거리 < 4) 10시전마다 flash, SWEEP HP skip(5시전 동안 HP 감소 20% 미만 → gidSkip + 버림, 기준 HP는 합류 시점).
- **종료** 실제 시전 1회 이상이면 `Pickit.pickItems` → `ClassAttack.afterAttack()`. 상자는 열지 않는다(Pather `popChests`가 담당).
- 근거(결정): 포기 판단은 루프가 한다(8봇이라 비용 8배, 목록을 줄여 비용 절감). 판단 단계는 1단 확정 제외 / 2단 추정(도달 불가) / 3단 사후(HP, 재시도) — 확실하고 쌀 때만 미리 버린다. MUST는 못 죽이면 진행이 막히는 대상이라 버림·HP skip·시간 한도가 없다. 스킬 미보유는 대체 스킬로 쳐도 도움이 안 되고, throw는 Loader가 잡아 매 게임 반복돼 정지로 한다. 반환은 0/1/2 + 사이드채널로 직업 파일 8개를 고치지 않았다.
- 옛 결함 중 이 구조로 해소된 것: clearList refresh 무한 루프(버린 몹 재진입), 범위 밖 몹 추적, `clear(bossId)`가 보스 생존으로 true, 999 throw, retry 대상 간 공유, 보스 무효화 시 NaN 범위, 텔레 회피 실패 시 대상 제거.
- 확인: 260930 trace 8개(`log_results.md`): 벽·강 너머 스킵, 박스 울타리, MUST deferred 통과.

### 260928 Claude: Angle/Detour 게이트를 setPosition으로
- 옛 clear의 Angle(벽 뒤)·Detour(긴 우회) 게이트를 지우고 setPosition 접근 판정으로 옮겼다. 이동 필요 여부를 아는 곳은 setPosition뿐이다.
- 경위: 1차는 게이트 제거 후 우회 비율을 착지 좌표 기준으로 잘못 계산해 벽 너머까지 돌아감, 2차는 clear에 0x5로 복원해 이동이 필요 없는 사거리 안 몹까지 버림.

### 260929 Claude: 목줄 조건, MUST unreachable, 박스
- 목줄: 가장 가까운 대상이 MUST가 아니고, 나와 `leashRange` 25 이상 떨어진 MUST(deferred·lost 제외)가 있으면 그 MUST. "주변 10에 몹이 없을 때만" 조건은 뺐다(주변을 먼저 치워도 가는 길은 청소하지 않고 보스만 멀어진다).
- MUST unreachable: flash 후 재선택 → deferred(거리순이라 같은 MUST를 계속 골라 나머지를 못 쳤다). 대가: deferred 동안 목줄 제외.
- 박스 울타리: 박스 호출이면 `tick.box`를 채워 setPosition이 박스 밖 착지 자리를 뺀다. 모든 박스 호출에 자동 적용, 새 인자 없음. 박스는 대상 필터보다 "박스 밖으로 나가지 않기"가 주 목적(사용자).
- NoSkipArea 키와 조건 제거(로컬 `[]`로 1막~헬 파밍 한 사이클 문제없음, 사용자 확인).
- 확인: 260930 trace(`[SP] fence` 16건, `[AC] defer` 38건 모두 끝남).

### 261003 Claude: 보스 호출 2단계
- range > 0 + id·이름·배열 호출은 1단계로 시작한다: 기준점을 호출 위치에 고정, 목줄 끔, range 안 정리(보스는 보이면 바로 MUST로 잡고 거리순으로 친다). range 안 SWEEP과 마지막 위치가 range 안인 MUST가 없어지고 보스가 목록에 남아 있으면, 시전이 있었으면 `Pickit.pickItems(range, 호출 위치)` 후 2단계(기준점이 가장 가까운 MUST를 따라감, 안 보이면 마지막 위치, 모두 죽으면 그 자리 고정, 목줄 켜짐).
- 보스가 1단계에서 죽거나 한 번도 안 보이면 2단계 없이 끝난다. 처치 뒤 호출 위치로 돌아가지 않는다.
- 이유: 목줄 때문에 range 안 몹을 남기고 보스를 따라가 몹 무리로 들어가던 위험(디아 봉인에서 원거리 팔로워가 소환몹 한가운데로 들어감). "나 기준" 범위는 추적할수록 범위가 따라와 무한 추적이라 채택하지 않는다.

### 261004 Claude: 보스 보호 훅 (`Attack.onBossLow`, 261020 사용자가 `bossScan`으로 이름 변경)
- 몬스터 스캔이 보스 유닛(`spec.ids` 일치)을 넘길 때 `AutoSmurf.bossGuard`가 넣은 훅을 부른다. 훅이 HP를 보고 치킨을 끈다(`AutoSmurf.md` bossGuard).

### 261015 사용자: 끝 줍기 기준점
- 끝 줍기를 org 기준으로(`pickItems(range > 0 ? range : 기본, orgx, orgy)`). 보스 호출의 org는 보스가 죽은 자리.

## setPosition

### 260928 Claude: 접근·회피를 한 함수로
- 판정: 이동 필요(접근) = 나와 unit 거리 > distance 또는 `checkCollision(me, unit, coll)`. 회피 채점은 아래 값 조건. 둘 다 아니면 true.
- 후보: unit 중심 링. 접근은 반경 distance, distance−5, …(5 미만 링은 버림, distance 링은 항상 유지). 각 링에서 unit→나 방향부터 좌우 교대, 호 간격 5칸. 정면(|offset| ≤ 90) 먼저, 후면은 정면에서 못 찾았을 때만.
- 정렬: 접근은 바깥 링 → 정면에 가까운 순. 순서가 "어디로", 위협은 "가도 되는지"(위협 우선이면 걷는 캐릭이 몹을 관통).
- 후보 검사(정렬 순서대로): 착지(텔레 `checkSpot(0x1)` / 걷기 `getCollision & 0x1`), 타깃 시야(`CollMap.checkColl(unit, 후보, coll)`), 접근이면 불장판 4칸 제외, 박스 밖 착지 제외, SWEEP 텔레 접근은 나→후보 0x4 막힘 제외(Angle), 걷기는 나→후보 직선(0x5) 막힘이면 접근만 "우회 후보" 1개 기억(SWEEP은 0x4로 막힌 자리는 우회 후보도 아님).
- 우회: 정면 채택이 없고 우회 후보가 있으면 MUST는 길이 무관 moveTo, SWEEP은 나→대상 걷는 경로 ≤ 직선 × `DetourPath` 4일 때만(getPath는 호출당 1회, 필요할 때만). 접근 결과 순서: 정면 직선 → 정면 우회 → 후면 직선 → 후면 우회(작은 장애물이면 정면 우회가 후면보다 짧다).
- 이동: 걷기 `walkTo(minDist)` / 우회 moveTo / 텔레 `teleDistance` 35 이내 teleportTo, 넘으면 moveTo(여러 번 텔레).
- 반환: 이동 성공·이동 불필요·회피 후보 없음·회피 이동 실패 → true(제자리 시전). 접근 후보 없음 → false, `tick.fail = "unreachable"`. 접근 이동 실패 → false, `"moveFailed"`.
- 확인: 260930 trace(벽·강 너머 스킵 통과).

### 261001 Claude: 회피는 몹 수 최소 자리
- 회피 후보는 같은 구역(정면 반) 안에서 지금보다 1마리 이상 적은 자리 중 최소를 채택(동점은 곧게 물러나는 순), 0이면 즉시. 첫 통과 채택은 3→2처럼 조금만 줄어도 채택해 다음 틱에 또 회피했다. 반대편(관통)은 물러나는 쪽이 전부 막혔거나 나아지지 않을 때만.

### 261008 사용자: 회피 값과 걷기 도착
- 지금 코드: 회피 채점 = (`Dodge.Enabled` 또는 활 사용) && distance ≥ `Dodge.MinSkillRange`(10) && unit이 243이 아님. 감지·후보 몹 수는 `Dodge.Range`(8) 이하(`getMonsterCount`는 `<=`). 회피 링은 하나: 걷기 min(distance, `Dodge.Move` 13), 텔레 distance. 기준선 0이면 회피 안 함. 걷기 도착 기본 minDist 3.
- 경위: 260930 링 하나·R = min(사거리, 10), 261003 감지 R − 2·MinSkillRange 9·minDist 1.5(프로즌오브가 시전마다 텔레하던 원인 = 공격 대상 자신이 R 안에 세짐), 261008 사용자가 감지 반경(Range 8)과 걷기 회피 거리(Move 13)를 따로 두고 문턱 10·minDist 3으로 바꿈. 261020 활 조건 `usingBow()`의 `()` 빠짐을 사용자가 고침.

## getSkillElement

### 260928 Claude: Telekinesis(43) → `"none"`
- 면역과 무관하게 쓴다.

## 설정값 (지금 코드)
| 이름 | 값 | 위치 |
|---|---|---|
| `Config.Dodge.Enabled` | false (빌드에서 25레벨에 true) | Config.js |
| `Config.Dodge.Range` | 8 (감지·후보 몹 수 반경) | Config.js |
| `Config.Dodge.Move` | 13 (걷기 회피 링 상한) | Config.js |
| `Config.Dodge.MinSkillRange` | 10 | Config.js |
| `Config.DetourPath` | 4 | Config.js |
| `Config.OpenChests` | 2 (Pather가 clearPath 이동 노드마다 연다) | Config.js |
| `Attack.dangerRange` / `leashRange` | 10 / 25 | Attack.js |
| MUST 대기 창 / 시야 잃은 MUST 탐색 | 5 × (ping×2+100)ms / 3회 | Attack.js |
| SWEEP retry / idle / HP skip | 5회 / 5회 연속 / 5시전 20% 미만 | Attack.js |

## Attack.tick (사이드채널)
| 필드 | 쓰는 곳 | 의미 |
|---|---|---|
| `cast` | `Skill.cast`(`setSkill` 성공 직후) | 이번 틱에 실제 시전 |
| `moved` | setPosition | 이번 틱에 이동 |
| `fail` | setPosition | `"unreachable"` / `"moveFailed"` |
| `must` | clear | 이번 대상이 MUST(Angle·Detour 판정, 해머 게이트 면제) |
| `box` | clear | 박스 호출의 박스(착지 자리 제한), finally에서 null |
| `monList` | clear 스캔 | 위협 목록(루프 밖이면 null → setPosition이 직접 스캔) |

- clear가 doAttack 직전에 `cast`·`moved`·`fail`을 초기화한다. Attack이 없는 스레드를 위해 `Skill.cast`는 `typeof Attack` 가드.
