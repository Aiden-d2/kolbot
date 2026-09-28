# Attack 설계 명세 (현재 브랜치 기준)

- 기준: `main` (260928 사용자 반영본). **이 문서가 현재 코드의 명세다.** 작업 브랜치 `claude/claude-code-capabilities-3xx7yz`는 main 반영 후 삭제했다.
- 리팩터링 이전(`main`) 구조와 결함 분석은 `attack_status.md`에 있다.
- 브랜치에 반영된 내용은 모두 확정이다 (사용자 규칙). 결정 경위는 12절과 git 커밋 이력에 있다.
- 인게임 검증 전이다. 검증은 문법 검사와 모의 환경 실행(12-3)까지만 했다.

---

## 1. 구성

```
Attack.clear(range, must)               단일 전투 엔진 (clear / clearList / kill 통합)
  └ ClassAttack.doAttack → doCast
       ├ Attack.setPosition             위치 선정. 이동 결과를 Attack.tick에 기록
       └ Skill.cast                     실제 시전 시 Attack.tick.cast = true
Attack.tick                             틱 단위 사이드채널 {cast, moved, fail, must, monList}

AutoSmurf.den 내부 clearDen             den 전용 (Attack.clearLevel → AutoSmurf.clearLevel → den 내부 함수)
AutoSmurf.getBoss(name)                 카오스 봉인 보스 대기 + 처치
```

- 제거: `clearList`, `scanList`, `clearLevel`(Attack), `kill`(이전에 이미 제거), `attackCount`와 999 상한, `gidAttack`
- 기존 함수 본문은 롤백용 주석으로 보존 (`// ---- 260926: replaced by ...`)
- 새 엔진 기준 죽은 코드도 주석 처리 (`// ---- 260928: ... is dead`): `getIntoPosition`, `dodge`, `buildGrid`, `sortMonsters`, `sortByDistance`, `getScarinessLevel`, `getMob`. 나중에 사용자가 일괄 정리 (`Config.Dodge.Count`는 main에서 값 유지, 미사용)

---

## 2. 시그니처

```js
Attack.clear(range, must)
```

| 인자 | 의미 |
|---|---|
| `range` | 소탕(SWEEP) 반경. 생략 시 25. **0이면 지역 소탕 없음** |
| `must` | 생략 가능. 반드시 죽일 대상 |

### 2-1. must 형태
| 형태 | 예 | 매칭 | 비고 |
|---|---|---|---|
| classid | `156` | `unit.classid === 156` | 같은 classid 전부 |
| 이름 | `getLocaleString(2852)` | `unit.name === 이름` | 같은 이름 전부 |
| 배열 | `[345, 346, 347]` | 하나라도 맞으면 | classid·이름 혼용 가능 |
| 박스 | `{box: {x1, x2, y1, y2}}` | 좌표가 박스 안 | **range는 강제 0** |

- `"all"`은 제거했다. gid 지정(`> 999`) 규칙도 없다.

### 2-2. 반환
- `false`: 사망, 소 레벨(39)에서 카우킹 감지, `AttackSkill[1]` 또는 `[3]` 미설정, **설정된 공격 스킬을 실제로 보유하지 않음**(이때 `D2Bot.stop()`)
- 그 외 `true`
- **throw하지 않는다.** 보스를 못 찾아도, 오래 싸워도 예외가 없다 (`range`가 숫자가 아닐 때만 throw)

---

## 3. 대상 등급

| 등급 | 출처 | 포기 | 목록 유지 조건 |
|---|---|---|---|
| **MUST** | `must` 매칭 | **없음.** 사망 또는 시야 상실 후 탐색 포기까지. 쓸 스킬이 없으면 뒤로 보냄(deferred) | id·이름·배열: gid로 끝까지 / 박스: 박스 안에 있을 때만 |
| **SWEEP** | `range` 안 (기준점 5절) | 조건 충족 시 버림 (이번 호출 동안 재진입 불가) | 기준점에서 `range` 이내 |
| **SWEEP (위험)** | MUST가 살아 있거나 대기 중일 때 **내 주변 `dangerRange`(10)** | SWEEP과 같음 | 나와 10 이내 (벗어나면 제거, 추적 안 함) |

---

## 4. 전투 루프 (한 틱)

```
[진입]
  gameReady 대기, range 검증, AttackSkill 검증
  스킬 보유 검사: AttackSkill 배열 길이만큼(빌드마다 다름, B.WCRY는 5칸), -1이 아닌 슬롯마다 me.getSkill(id, 1) (기본 스킬 0~3은 레벨 1로 보유). 없으면 콘솔 메시지 + D2Bot.stop() + false
  박스면 range = 0
  gidSkip 리셋: 지역 변경 or 마지막 스킵 위치에서 40 초과
  MUST 대기 창: id·이름·배열이면 now + 5 × (ping×2 + 100)ms. 이 동안 "MUST가 있다"고 간주 (멈추지 않음)

[틱]
 0. 사망 → false / 소 레벨 카우킹 → false / TownCheck

 1. 스캔 (getUnit 1회)
    checkMonster 통과 전체 → Attack.tick.monList (setPosition 위협 목록)
    목록에 없는 유닛:
      이번 호출에서 버린 gid → 무시
      must 매칭 → MUST 합류
      기준점 range 이내 or (MUST 있음/대기 중 && 나와 10 이내)
        → 1단 확정 제외: checkSkipped / skipCheck / 사용 가능 스킬 없음 → 버림
        → 통과 시 SWEEP 합류 (range 안이 아니면 "위험" 표시)

 2. 정리
    기준점 갱신: range > 0 && must가 id·이름·배열 → 가장 가까운 MUST 위치 (안 보이면 마지막 위치)
    MUST: 안 보임 → 마지막 위치 기억 (그 위치 5 이내에 도착했는데도 안 보이면 제거)
          사망 → 제거 / 박스 MUST가 박스 밖 → 제거
    SWEEP: 사망 → 제거 / 위험 표시는 나와 10 초과, 일반은 기준점에서 range 초과 → 제거

 3. 보이는 대상이 없음
    시야 잃은 MUST 있음 → 마지막 위치로 moveTo (최대 3회, 넘으면 제거)
    MUST 대기 창 중 → 짧게 대기 후 다음 틱
    그 외 → 종료

 4. 대상 선정 (거리순이 대전제)
    후보: deferred 아닌 대상. 없으면 deferred 포함
    가장 가까운 대상
    단, 그 대상이 MUST가 아니고 나와 10 초과이면
      → 나와 25(leashRange) 이상 떨어진 MUST(deferred 제외)가 있으면 그 MUST (목줄)
    카오스(108): 보스 아닌(spectype & 0x1 없음) StormCaster(306)가 나와 0x4로 막혀 있으면 SWEEP 버림 (NoSkipArea 제외, 기존 규칙 복원)
    (이전 clear의 Angle/Detour 게이트는 setPosition 접근 판정으로 옮김. 6절. 해머는 getHammerPosition 게이트)

 5. 공격
    tick 초기화, tick.must = 대상이 MUST인지 → ClassAttack.doAttack(대상, 이번 호출 실제 시전 수 % 10 === 0)

 6. 평가
    결과 2 (유효 스킬 없음)            SWEEP 버림 / MUST deferred(뒤로). 다른 후보가 없을 때만 짧게 대기
    결과 2가 아니면                    deferred 해제
    tick.fail == "unreachable"        SWEEP 버림 / MUST flash 후 계속   (NoSkipArea에서는 아래 재시도 경로)
    결과 0 or tick.fail               대상별 retry + flash. 5회째: SWEEP 버림 / MUST retry 리셋
    결과 1 && 시전 없음 (idle)         SWEEP 5회 연속이면 버림(이전 HP 스킵과 같은 횟수) / MUST는 5회마다 flash (시전하면 0으로)
    결과 1 && 실제 시전               대상별 시전 수 +1
                                      근접 스킬(사거리 < 4) 10시전마다 flash
                                      SWEEP HP skip: 5시전 동안 HP 감소 20% 미만 → gidSkip 등록 + 버림 (NoSkipArea 제외, 기준 HP는 합류 시점)

[종료]
  실제 시전 1회 이상 → Pickit.pickItems(range, 0이면 기본 25) → ClassAttack.afterAttack()
  range > 0 → openChests(min(range, 15), 기준점)   ※ Config.OpenChests 무시는 현행 유지 (추후)
  return true
```

---

## 5. 소탕 기준점

| 호출 | 기준점 |
|---|---|
| must 없음 (`clear(25)`) | 호출 위치 고정 |
| 박스 | range 0이라 해당 없음 |
| id·이름·배열 + range > 0 (`clear(35, 이름)`) | **가장 가까운 MUST의 현재 위치**, 안 보이면 마지막 위치. 모두 죽으면 마지막 자리에 고정 |

- 보스가 도망가면 소탕 범위도 따라간다. 처치 후 원래 호출 위치로 되돌아가지 않는다.
- "나 기준" 범위는 채택하지 않는다. 추적할수록 범위가 따라와 무한 추적이 된다.

---

## 6. setPosition

```
setPosition(unit, distance, coll, minDist = 3)

판정
  이동 필요(접근) = 나와 unit 거리 > distance || checkCollision(me, unit, coll)
  회피 채점     = Dodge.Enabled && distance >= Dodge.Range(9) && HP% <= Dodge.HP && unit.classid != 243
  둘 다 아님 → true
  회피 채점이면 기준선 = 내 위치 Dodge.Range(9) 안 몹 수 (불장판 +100). 기준선 0이고 접근 아님 → true

후보
  unit 중심 링. 반경 distance, distance-5, distance-10, … (5 미만 링은 버림, distance 링은 항상 유지)
  각 링에서 unit→나 방향(offset 0)부터 좌우 교대, 호 간격 Dodge.Step(5)칸
  구역: 정면(|offset| ≤ 90) 먼저, 후면(90 < |offset| ≤ 180)은 정면에서 못 찾았을 때만 생성·채점
  텔레 회피: 나에게서 maxTeleDistance(45) 초과 후보 제외

정렬 (순서가 "어디로", 위협은 "가도 되는지")
  접근: 바깥 링 → 정면에 가까운 순 → 위협 적은 순(좌우 동점일 때만)  (260928, 회피와 같은 링 우선)
  회피: 바깥 링(타깃에서 먼 쪽) → 곧게 물러나는 순. 기준선보다 1마리 이상 적은 후보만 통과

후보 검사 (정렬 순서대로, 첫 통과 채택)
  착지: 텔레 checkSpot(0x1) / 걷기 getCollision & 0x1
  타깃 시야: CollMap.checkColl(unit, 후보, coll)
  접근이면 불장판(4칸) 제외
  SWEEP 접근(Angle): 나→후보가 0x4로 막힌 자리는 후보 아님 (텔레·걷기 모두, 우회 후보도 포함). MUST는 이 조건 없음
  걷기: 나→후보 직선(0x5) 막힘 → 접근이면 "우회 후보"로 1개 기억, 회피면 제외

구역 진행 (접근·회피 공통)
  정면 채택 → 이동
  정면 채택 없음 + 우회 후보 → MUST: moveTo (길이 무관) / SWEEP(Detour): 나→대상 걷는 경로 ≤ 나→대상 직선 × DetourPath(4)일 때만 moveTo. getPath는 호출당 1회, 우회가 필요할 때만
  그래도 없음 → 후면 구역 같은 방식
  접근 결과 순서: 정면 직선 → 정면 우회(moveTo). 정면에 후보가 없을 때만 후면 직선 → 후면 우회
  회피 결과 순서: 물러나기(정면) → 타깃 너머로 뚫고 지나가기(후면). 회피는 우회 없음

이동
  걷기: walkTo(minDist) / 우회: moveTo
  텔레: 45 이내 teleportTo, 초과 moveTo(여러 번 텔레)

반환
  이동 성공 / 이동 불필요 / 회피 후보 없음 / 회피 이동 실패 → true (제자리 시전)
  접근 후보 없음 → false, tick.fail = "unreachable"
  접근 이동 실패 (throw 포함) → false, tick.fail = "moveFailed"
```

### 6-1. 링 예
| 사거리 | 링 |
|---|---|
| 3 | 3 |
| 5 | 5 |
| 9 (Nova, Frozen Orb) | 9 |
| 10 | 10, 5 |
| 13 | 13, 8 |
| 20 | 20, 15, 10, 5 |
| 25 | 25, 20, 15, 10, 5 |

---

## 7. 사이드채널 `Attack.tick`

| 필드 | 쓰는 곳 | 의미 |
|---|---|---|
| `cast` | `Skill.cast` (`Misc.js`, `setSkill` 성공 직후) | 이번 틱에 실제 시전 단계에 도달 |
| `moved` | `setPosition` | 이번 틱에 이동 |
| `fail` | `setPosition` | `"unreachable"` / `"moveFailed"` |
| `must` | `clear` | 이번 대상이 MUST (setPosition의 Angle·Detour 판정, 해머 게이트 면제) |
| `monList` | `clear` 스캔 | 위협 목록 (루프 밖이면 null → setPosition이 직접 스캔) |

- `clear`가 `doAttack` 직전에 `cast`, `moved`, `fail`을 초기화한다. 프리캐스트 등 다른 시전은 영향 없다
- `Attack`이 없는 스레드를 위해 `Skill.cast`는 `typeof Attack` 가드

---

## 8. 설정값

| 이름 | 값 | 위치 | 의미 |
|---|---|---|---|
| `Config.Dodge.Enabled` | false (빌드 10종이 18레벨에서 true) | Config.js | 회피 사용 |
| `Config.Dodge.Range` | **9** | Config.js | 회피하는 스킬 사거리 기준이자 몹 수 반경 |
| `Config.Dodge.HP` | 100 | Config.js | HP% 이하일 때 회피 (100 = 항상) |
| `Config.Dodge.Step` | 5 | Config.js | 링 간격, 호 간격 |
| `Config.Dodge.Count` | 1 | Config.js | 미사용 (구 `dodge` 전용). `SafeTele.Count`와는 별개 |
| `Config.DetourPath` | 4 | Config.js | 우회 한도: 나→몹 걷는 경로 ≤ 나→몹 직선 × 4 (SWEEP만. setPosition 걷기 우회, 해머 게이트) |
| `Config.NoSkipArea` | `[17]` | Config.js | 도달 불가 즉시 버림과 HP skip을 하지 않는 지역 |
| `Attack.dangerRange` | 10 | Attack.js | 위험 반경 |
| `Attack.leashRange` | 25 | Attack.js | 목줄 |
| `Pather.maxTeleDistance` | 45 | Pather.js | 한 번의 텔레 한계 |
| MUST 대기 창 | 5 × (ping×2+100)ms | Attack.js | 시작 시 보스 등장 대기 (전투는 계속) |
| 시야 잃은 MUST 탐색 | 3회 | Attack.js | |
| SWEEP 재시도 | 5회 | Attack.js | 대상별 |
| SWEEP idle | 5회 연속 | Attack.js | 결과 1인데 시전 없음. 예전 HP skip이 잡던 "헛돌기"를 대신함 |
| SWEEP HP skip | 5시전, 20% 미만 | Attack.js | 실제 시전만 센다 |

---

## 9. 호출부 (현재 브랜치)

| 형태 | 개수 | 예 |
|---|---|---|
| `clear(N)` | 34 | 일반 소탕, Pather 경로 이동(25/20), den `clearDen`(30), 팀 대기, 소 `followDriver`(25/15) |
| `clear(0, classid)` | 12 | Andariel(2), Summoner(2), Radament, Duriel, Mephisto(2), Izual, Diablo, Nihlathak, Baal(544) |
| `clear(0, 이름)` | 2 | Blood Raven, Shenk |
| `clear(0, [345, 346, 347])` | 1 | 트라빈컬 평의회 (박스 5곳 대체) |
| `clear(0, [540, 541, 542])` | 1 | 고대인. 개별 호출 3개는 주석 (다시 놓치면 `"all"` 자리와 개별 호출 복원) |
| `clear(0, {box})` | 12 | 바알 웨이브(3), Tombs(4), Duriel(2), Summoner(2), Khalim's Will 대기 루프(1) |
| `clear(35, 이름)` | 1 | `getBoss` (카오스 봉인 3곳) |

### 9-1. getBoss (카오스 봉인)
```
최대 50 × 200ms 동안 보스 대기
  보이면   → Attack.clear(35, 이름)   보스 MUST + 주변 35 (기준점은 보스)
  끝내 없음 → Attack.clear(35)         "일단 다 잡고 보자" (기존 throw → catch 폴백과 같음)
```
봉인 함수 뒤의 `try { clear(0, 이름) } catch { clear(35) }` 3곳은 주석 처리.

---

## 10. 그 외 변경 파일

| 파일 | 변경 |
|---|---|
| `libs/Misc.js` | `Skill.cast`에 시전 기록 |
| `libs/Pather.js` | `NodeAction.killMonsters`: spectype 인자 제거. 카오스(108)는 `clear(20)`, 그 외는 `clear(25)`가 false면 `"killMonsters"` 반환(이동 중단). false는 사망·카우킹·스킬 미보유 정지일 때만 (사용자 정리, 260927) |
| `libs/Attacks/Paladin.js` | `getHammerPosition` 맨 앞에 이전 clear의 Angle/Detour 게이트 (해머는 setPosition을 안 거침). 조건 0x5 (해머는 몹 옆에 서야 하므로 0x1로 막혀도 이동이 필요). 막히면 `tick.fail = "unreachable"`. MUST·NoSkipArea는 게이트 없음
| `libs/Attacks/Barbarian.js` | preattack이 대입 전 `attackSkill`을 참조 → `Config.AttackSkill[0]`. `findItem`의 `clear(10, false×4)` → `clear(10)` |
| `libs/Attack.js` | `getSkillElement`: Telekinesis(43) → `"none"` (면역과 무관하게 사용) |
| `libs/Config.js` | `Dodge.Range` 13 → 9 |
| `libs/AutoBuild.js` | `levelUpHandler`에서 `Attack.init()` 재호출 (46레벨 Wereform이 그 게임부터 적용) |
| `bots/AutoSmurf.js` | 호출부 변환, `clearLevel` → den 내부 `clearDen`, `getBoss`, 트라빈컬·고대인 배열, 소 `followDriver` 교체(아래) |
| `bots/AutoSmurf.js`, `threads/Reload.js` | 줄바꿈 CRLF → LF (내용 변경 없음, 별도 커밋) |

---

## 11. 남은 일

| 항목 | 상태 |
|---|---|
| 인게임 검증 | 필요. `_cache/trace/`의 `[AC]`, `[SP]` 로그 |
| 임시 로그 삭제 | 검증 후 `//260926 temp` 일괄 삭제 |
| Static 사거리 불일치 (`Misc.js` lvl+4 vs `Sorceress.js` ×2/3) | 추후 (사용자) |
| `openChests`의 `Config.OpenChests` 무시 | 추후 (사용자, 의도 있음) |
| 소 레벨 치킨 잦음 (`clearCowLevel`, `followDriver`) | 개선 대상 (사용자). `followDriver`는 1차 교체 완료 |
| 부활·소환형 우선(scariness) | 보류. 거리순 대전제와 충돌, 어느 안도 트레이드오프 |
| `.nip` LF 변환 | main 반영 완료 (260928) |
| `main` 통합 | 완료 (260928, 사용자). builds 스탯 목표 조정도 함께 반영됨 |

---

## 12. 결정 요약 (경위)

### 12-1. 주요 결정
| 주제 | 결정 | 근거 |
|---|---|---|
| 포기 판단 주체 | 루프 | 목록을 줄여 비용 절감이 주 축, 8봇이라 비용 8배 |
| 판단 단계 | 1단 확정 제외 / 2단 추정(도달 불가) / 3단 사후(HP, 재시도) | 확실하고 쌀 때만 미리 버린다 |
| MUST | 버림·HP skip·시간 한도·999 상한 모두 없음. 쓸 스킬이 없을 때만 뒤로 보냄(deferred) | 못 죽이면 진행이 막히는 대상. 다른 캐릭도 공격 중. 박스 안 면역 몹 때문에 나머지를 못 치는 일을 막음 |
| MUST 우회 | 길이와 무관하게 moveTo | 기존 clearList와 같음 (게이트 없음) |
| 스킬 미보유 | 콘솔 메시지 + `D2Bot.stop()` | 대체 스킬로 쳐도 도움이 안 됨. throw는 Loader가 잡아 매 게임 반복되거나 중간 try에 삼켜짐 |
| HP skip | 5시전 20% | 실제 시전만 세므로 5회로 오탐 없음. 10회는 너무 오래 끎 |
| 대상 우선순위 | 목줄(멀어진 MUST) → 거리순 | 거리순이 대전제. 위협이 붙어 있으면 그쪽 먼저 |
| 보스 호출 반경 | 0 | 보스 처치가 목적, 잡몹은 위험 반경(10)으로 충분 |
| 목줄 | 25 이상이면 보스 우선 (거리만 좁힘), 한계 35 | getUnit 가시 거리 약 40 (사용자 경험값) |
| 반환 계약 | 0/1/2 유지 + 사이드채널 | 직업 파일 8개 무수정 |
| Angle/Detour 게이트 | **setPosition 접근 판정으로 (260928)**. Angle = 나에게서 보이는 자리만, Detour = 실제 우회가 필요할 때만 나→대상 기준 4배 | 1차: 게이트 제거 후 우회 비율을 착지 좌표 기준으로 잘못 계산 → 벽 너머까지 돌아감. 2차: clear에 0x5로 복원 → 이동이 필요 없는 사거리 안 몹까지 버림. 이동 필요 여부를 아는 곳은 setPosition뿐 |
| setPosition 기준 | 접근·회피 한 함수, 순서는 이동, 위협은 통과 조건 | 위협 우선이면 걷는 캐릭이 몹을 관통 |
| 회피 | 물러나기 우선, 1마리 이상 줄면 채택, 없으면 반대편으로 | 사용자 의도 (원안 dodge의 역방향 탈출) |
| 접근 | 정면 직선 → 정면 우회 → 후면 직선 → 후면 우회 | 작은 장애물이면 정면 우회가 후면보다 짧다 |
| 링 | 5칸 간격, 5 미만 제외 | 호 간격과 같은 격자, 중복 링 제거 |
| `Dodge.Range` | 9 (사거리 기준과 반경 공용) | 사거리 9~12 스킬(Frozen Orb, Nova 포함) 회피 |
| 트라빈컬 | `[345, 346, 347]` | 새 엔진은 위험 우선 + 거리순이라 박스 분할이 불필요 |
| 고대인 | `[540, 541, 542]` 시험 | 예전 배열 호출이 놓친 원인(빈 목록 즉시 종료, 첫 성공 전 refresh 없음, shift)이 해소됨 |
| 레벨업 | `Attack.init()` 무조건 재호출 | 이미 include한 파일은 엔진이 건너뜀. 부작용 없음 (핸들러는 default.dbj에만 등록) |
| 박스 + range | range 강제 0 | 박스 밖 대상이 섞이지 않게 |

### 12-2. 기각 (반복 금지)
| 안 | 기각 이유 |
|---|---|
| clearList의 대응 단계(각도 변경, 보조 스킬, 걷기 허용) | 뒤로 보내기와 flash로 대부분 대체 |
| 스킬 미보유 시 이전 레벨 스킬로 대체 | 도움이 안 됨 (사용자) |
| 스킬 미보유를 리더에게 통보해 팀 정지 | 실시간 수신 경로가 추가로 필요. 반복은 60분 10게임 제한으로 충분 |
| 부활·소환형 우선 | 보류. 무리 속 파고들기, MUST와 충돌, 근접은 사실상 무효 등 어느 안도 트레이드오프 |
| 접근 시 위협 최소 자리 우선 | 접근은 짧게, 안전은 다음 틱 회피가 맡음 (원안 유지) |
| MUST 시간 한도(30초) | 못 죽이면 진행 불가인 대상이라 계속 공격이 맞다 |
| 텔레 캐릭 걷기 폴백 | 텔레 실패 원인(시야, 착지)은 걷기로도 해결 안 됨. 거리 초과만 moveTo(여러 번 텔레)로 해결 |
| 회피 "몹 없는 자리(0) 무조건 우선" | 순서와 무관하게 먼 자리를 뽑아 몹을 관통 |
| 회피 경로상 몹 관통 검사 | 사용자: 불필요 |
| 이동 비용 가중치 | 후보가 같은 링 위라 거리 차이의 실익이 작다 |
| 틱당 setPosition 1회 제한 | 저주·Static은 호출부가 사거리 밖일 때만 부른다. 현 구성에서 진동 없음 |
| `Dodge.Radius` 분리 | 사용자 의도는 한 값(9)으로 두 역할 |
| 보스 id를 하나의 배열로 전 호출부 통일 | 얻는 것이 적고, 의도치 않은 MUST가 생길 수 있음 |
| must 박스+id 조합 | 쓸 곳이 없음 |
| 범위를 "나 기준"으로 | 추적할수록 범위가 따라와 무한 추적 |

### 12-3. 모의 환경 검증 (엔진 함수를 흉내 낸 Node 실행)
- setPosition: 텔레 정면 막힘 → 후면 / 정면만 채점 / 전부 막힘 → 도달 불가 / 걷기 짧은 정면 우회 → 정면 moveTo / 긴 우회 → 후면 직선 / 회피 물러나기·옆-뒤·반대편 뚫기·전부 막힘 제자리
- clear: 보스 없음 + 옆 몹 → 몹 처치 후 종료 / 먼 몹 → 대기 후 종료 / 대기 중 보스 등장 → 처치 / 보스 도주 시 호출 위치로 복귀 안 함 / 일반 소탕은 호출 위치 기준 / 박스+반경 → 박스만
- 260928: 스킬 미보유 → 정지·false / 박스 안 면역 몹 → 나머지 먼저, 면역 몹은 마지막 / 카오스 벽 뒤 StormCaster → 버림, 보스 StormCaster → 공격 / HP skip 5시전째 / 걷기 우회 전부 한도 초과: SWEEP → unreachable, MUST → 짧은 우회로 moveTo
- 실제 지형, 엔진 판정(checkCollision, getPath 등)은 모의가 아니므로 인게임 확인 필요

---

## 13. 소 레벨 `followDriver` (260928, 사용자 지정)
```
드라이버(리더)가 보이면
  거리 > 30   → moveTo (clear 없이 따라붙기) + BO
  15 ~ 30     → moveTo(..., 3, true)  경로 노드마다 clear. "killMonsters"(카우킹)면 false
  15 이하     → Attack.clear(25)
드라이버가 안 보이고 msgNode가 있으면 → 같은 규칙으로 msgNode 기준
둘 다 없으면 → Attack.clear(15)
```
- 사용자 원문의 msgNode 분기 `getDistance(me, driver) > 15`는 driver가 없는 분기라 `getDistance(me, msgNode[0], msgNode[1]) > 15`로 고쳐 반영했다. 원문 줄은 주석으로 남겼다.
