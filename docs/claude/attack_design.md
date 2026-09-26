# Attack 리팩터링 설계안 (260926 초안, 재검토용)

`attack_status.md`의 [확정] 항목을 하나의 흐름으로 정리한 문서다.
재검토 결과는 7절에 있다.

---

## 1. 구성

```
clear(range, spectype, bossId, sortFunc, openChest)   ─┐  기존 시그니처 유지
clearList(mainArg, sortFunc, refresh)                  ─┤  (호출부 무변경)
                                                        ▼
                                   Attack.fight(opts)   단일 전투 엔진
                                        │
                                        ├─ ClassAttack.doAttack → doCast
                                        │       ├─ Attack.setPosition   (이동 기록)
                                        │       └─ Skill.cast            (시전 기록)
                                        └─ Attack.tick  (사이드채널: 틱 단위 기록)

clearLevel  →  AutoSmurf로 이전 (den 전용)
```

### 1-1. 대상 등급은 호출 모드가 아니라 **유닛 단위**
| 등급 | 출처 | 포기 |
|---|---|---|
| **MUST** | `clear`의 bossId, `clearList`의 목록/스캔 결과 | 포기하지 않음. 버림·뒤로 보내기·HP skip·시간 한도 모두 없음. 죽을 때까지 공격 |
| **SWEEP** | `clear`의 range 스캔 | 조건 충족 시 버림 (이번 호출 동안 재진입 불가) |

- `clear(35, 0, 보스명)` = 보스는 MUST, 주변은 SWEEP. **AutoSmurf 호출부 수정 불필요**
- `clearList(scanList(박스), null, 1)` = 박스 안 전원 MUST

### 1-2. opts
```
{
  must:   { ids: [bossId...] } | { scan: fn, interval: refresh } | null,
  sweep:  { origin: {x,y}, range, spectype } | null,     // origin 고정 (호출 시점)
  sort:   sortFunc (기본 sortByDistance),
  chests: openChest
}
```

---

## 2. 전투 루프 (`Attack.fight`)

```
[진입]
  gameReady 대기, AttackSkill 검증
  gidSkip 리셋 판정 (현행: 지역 변경 or 마지막 스킵 위치에서 40 초과)
  state = {}        // gid별: retry, casts, hpMark, lastPos
  dropped = {}      // 이번 호출에서 버린 gid (SWEEP)
  must 대상 최초 확보 (bossId: 5회 재시도, 실패 시 throw — 현행 유지)

[틱 루프] while (대상 남음)
  0. me.dead → return false / TownCheck (현행)

  1. 스캔 (틱당 getUnit 1회)
     all = checkMonster 통과 전체              → 위협 목록 (setPosition 공용)
     SWEEP 합류: sweep 범위(고정 origin) 안 && spectype && !dropped && !gidSkip
                 && skipCheck && 사용 가능 스킬 있음(1단)      → 목록에 merge
     MUST 합류: scan 함수 결과 merge (interval 주기) — 교체 아님

  2. 정리
     죽음/무효 → 제거
     SWEEP이 sweep 범위를 벗어남 → 제거 (다시 들어오면 재합류 가능)
     MUST가 안 보임 → 제거하지 않고 lastPos 유지

  3. 목줄 (이동만, 대상 선정과 무관)
     MUST가 나와 25 이상 → MUST 쪽으로 거리만 좁힘 (주변 10 이내 유닛이 있으면 그 처리가 먼저)
     MUST가 안 보이면 → lastPos로 moveTo 후 재스캔, 틱 종료

  3b. 대상 선정
     (a) 내 주변 10 이내 유닛이 있으면 → 그중 정렬 1순위   (위험 반경)
     (b) 그 외 → sort 1순위 (거리순)
     ※ MUST도 거리순 그대로. 가장 가까우면 그냥 공격

  4. 공격
     Attack.tick 초기화 {cast:false, moved:false, fail:null}
     result = ClassAttack.doAttack(target, castTotal % 10 === 0)

  5. 평가 (result + Attack.tick)
     ┌ result 2 (유효 스킬 없음)        SWEEP: drop     MUST: 유지 (다음 틱 재시도)
     ├ fail == "unreachable"           SWEEP: drop     MUST: flash 후 유지
     ├ result 0 / fail == "moveFailed" state.retry++, flash
     │                                  retry > 4 →  SWEEP: drop  MUST: 유지 (retry 리셋)
     └ result 1 && tick.cast           state.casts++, retry = 0, castTotal++
                                        근접 스킬 10캐스트마다 flash (현행)
                                        HP 판정 (시전한 캐스트만 셈)
                                          SWEEP: 10캐스트마다 20% 미만 감소 → HP skip(gidSkip)
                                          MUST: HP skip 없음 (사망까지 계속)
       result 1 && !tick.cast          카운트 없음 (이동만 했거나 딜레이 대기)

     MUST 종료 조건은 사망뿐. 다른 캐릭도 공격 중이므로 계속 공격
     최종 안전장치는 게임 최대 시간(Config.MaxGameTime → me.maxgametime)

  drop  = 목록 제거 + dropped[gid]

[종료]
  SWEEP 목록이 비면 1회 재스캔 → 합류 없으면 종료
  MUST 전원 사망 확인
  castTotal > 0 → pickItems(range) → afterAttack (현행 순서)
  chests → openChests (현행 동작, Config.OpenChests 미결)
  return true
```

---

## 3. setPosition

```
setPosition(unit, distance, coll, minDist)

  1. moveNeeded = dist > distance || checkCollision(me, unit, coll)
     scoring    = Dodge.Enabled && hp% <= Dodge.HP && classid != 243
                  && distance >= Dodge.Range   (현행 게이트 유지, R9)
     !moveNeeded && !scoring → return true

  2. 위협 목록 = 루프 스캔 재사용 (없으면 buildMonsterList), fireList 1회
     scoring이면 baseline = count(me)  (baseline 0 && !moveNeeded → return true)

  3. 후보: unit 원점 링
     반경 [distance, round(distance × 0.75)]   (distance ≤ 3 이면 [distance])
     각도 step = Dodge.Step / r (호 간격 5칸)
     접근: |offset| ≤ 90 / 회피: ≤ 90, 포위(count(me,4) > 2)면 360

  4. 채점·정렬
     threat = scoring ? count(후보, Dodge.Range) : 0     (불장판 +100)
     정렬: threat ↑, |offset| ↑ (정면 우선), 반경 ↓ (먼 쪽 우선)

  5. 순서대로 검사 → 첫 통과 채택
     회피: threat >= baseline 이면 중단 (문턱 1마리)
     착지: tele checkSpot(0x1) / walk getCollision & 0x1
     타깃 LOS: CollMap.checkColl(unit, 후보, coll)
     접근 시 불장판 하드 배제
     walk: 나→후보 직선(0x5) 막힘 → 경로 후보로 1개만 기억하고 계속

  6. 이동
     tele: 거리 ≤ maxTeleDistance → teleportTo / 초과 → moveTo (다중 텔레)
     walk: 직선 후보 → walkTo(minDist)
           경로 후보만 있음 → getPath 1회, 경로/직선 > DetourPath(4) → unreachable
                                            이내 → moveTo
     텔레 캐릭은 걷기 폴백 없음

  7. 반환 + 기록
     이동 성공 / 이동 불필요           → true
     회피 후보 없음 or 회피 이동 실패   → true  (제자리 시전, 3-2 수정)
     접근 후보 없음 / 우회 초과         → false, tick.fail = "unreachable"
     접근 이동 실패 (moveTo throw 포함) → false, tick.fail = "moveFailed"
```

---

## 4. Skill.cast 기록
`Misc.js:247` 시전 성공 경로에서 `Attack.tick.cast = true`. 루프가 doAttack 직전에 초기화하므로 프리캐스트 등 다른 호출은 영향 없음.

## 5. 동봉 수정
- `getSkillElement`: 43(Telekinesis) → `"none"`
- `clearLevel` → AutoSmurf로 이전
- Barbarian preattack의 `attackSkill` 선참조 수정 (`Barbarian.js:25-26`)
- 교체되는 기존 본문은 주석 보존 (저장소 관례), 신규 코드 `//260926`

## 6. 제거되는 것
- clear의 306 이외 Angle / Detour 게이트 (306 Skip 유지)
- 공유 retry, gidAttack 배열 → gid별 state
- refresh의 목록 교체 방식 → merge
- **attackCount 개념 폐지 (사용자 결정)**. 999 상한 삭제. 결과 1을 공격으로 세던 오판도 함께 제거
  - preattack 주기 → 이번 호출의 실제 시전 횟수(castTotal) % 10
  - refresh 주기 → 폐지 (매 틱 합류 스캔)
  - afterAttack/pickItems 가드 → castTotal > 0
  - SWEEP 종료는 버림(스킬 없음·도달 불가·재시도·HP skip)이나 처치로 보장

---

## 7. 재검토 결과 (260926)

| # | 내용 | 결정 |
|---|---|---|
| R1 | MUST와 HP skip | **[확정]** MUST는 HP skip 없음. MUST가 아니면 보스·유니크·챔피언 모두 스킵 가능 |
| R2 | 틱당 스캔 비용 | **[확정]** 틱당 1회 스캔. Dodge 활성 시절에도 틱마다 스캔했으므로 문제 없음 |
| R3 | 실패 시 반환 | **[확정]** 현행 유지 (시작 시 보스 미발견 throw, 추적 실패 false) |
| R5 | 목줄과 defer | **[확정]** 목줄(25)은 거리만 좁히는 이동이고 대상 선정은 거리순 유지. MUST는 뒤로 보내지 않는다. 가장 가까우면 그냥 공격 |
| R7 | MUST 시간 한도 | **[확정] 폐지.** clearList의 MUST는 못 죽이면 진행이 막히는 대상이므로 계속 공격한다. 다른 캐릭도 공격 중. 최종 안전장치는 게임 최대 시간 |
| R8 | HP skip 기준 | **[확정]** SWEEP은 10캐스트마다 20% 미만이면 skip. MUST는 HP skip 없음 |
| R9 | 회피 게이트 `distance >= Dodge.Range` (495) | **[확정] 유지.** 사거리 13 미만은 회피해도 위협을 해소하지 못하고 동작만 낭비 |
| R10 | 잔여 항목 | **[확정]** Static 사거리 불일치는 추후. Sorc 260917(사거리 20)은 **의도된 동작**. Barbarian 선참조는 이번에 함께 수정. openChests는 의도 있음, 현행 유지 후 추후 수정 |

---

## 8. 파일별 변경 계획

| 파일 | 대상 | 변경 |
|---|---|---|
| `libs/Attack.js` | `clear` (33-268) | 래퍼로 교체. bossId 확보/throw는 유지하고 `fight`에 위임. 기존 본문 주석 보존 |
| | `clearList` (341-455) | 래퍼로 교체. 배열이나 스캔 함수를 MUST로 넘긴다. `refresh` 인자는 받되 무시 |
| | `clearLevel` (271-339) | 주석 처리 (AutoSmurf로 이전) |
| | 신규 `fight` | 2절 루프. 소 지역(39) 카우킹 감지 시 false 반환 유지 (`Pather.NodeAction` 의존) |
| | 신규 `tick` 객체와 헬퍼 | 사이드채널 `{cast, moved, fail}`, 틱 스캔 목록(위협 공용), `hasUsableSkill(unit)` (1단) |
| | `setPosition` (477-684) | 3절로 재작성. 기존 본문 주석 보존 |
| | `getSkillElement` | 43 → `"none"` |
| `libs/Misc.js` | `Skill.cast` (247) | `setSkill` 성공 후 시전 단계에서 `Attack.tick.cast = true` |
| `libs/Attacks/Barbarian.js` | preattack (25-26) | `attackSkill` 선참조 → `Config.AttackSkill[0]` 사거리로 |
| `bots/AutoSmurf.js` | `clearLevel` 이전 | 함수를 AutoSmurf 내부로 옮기고 호출 2곳(1788, 1839) 교체 |

변경 없음: 직업 파일(Barbarian 제외), `Pather.js`, `Config.js`, 호출부 약 100곳

---

## 9. 구현 반영 (260926, 1차 구현 완료, 인게임 미검증)

### 9-1. 최종 시그니처
```js
Attack.clear(range, must)
// range: 소탕 반경 (호출 시점 위치 고정). 0 = 지역 소탕 없음
// must : classid | 이름 | [classid...] | {box: {x1, x2, y1, y2}} | "all"   (생략 가능)
```
- **[확정]** 보스를 지정하는 호출은 전부 `range = 0` (카오스 봉인 포함). 보스 처치가 목적이고, 잡몹 처리는 위험 반경(10)만으로 충분하다
- 제거: `clearList`, `scanList`, spectype·sortFunc·openChest 인자 (호출부에서 모두 미사용이거나 고정값 확인)
- `clearLevel` → `AutoSmurf.clearLevel` (den 2곳)

### 9-2. 호출부 변환 (AutoSmurf 42곳, Pather 3곳, Barbarian 1곳)
| 현행 | 신규 |
|---|---|
| `clear(N, 0, 이름)` | `clear(0, 이름)` |
| `clear(range, undefined, undefined, undefined, false)`, `clear(10, false, false, false, false)` | `clear(range)`, `clear(10)` |
| `clear(N, spectype)` (Pather NodeAction) | `clear(N)` (spectype 항상 0이었음. clearPath 숫자 0은 여전히 "소탕 켜기") |
| `clearList(scanList(id), null, 1)` | `clear(0, id)` |
| `clearList(scanList(null, 박스), null, 1)` | `clear(0, {box: 박스})` |
| `clearList(scanList(null), null, 1)` | `clear(0, "all")` |

### 9-3. 구현하면서 정한 세부 (검토 필요)
| 항목 | 동작 |
|---|---|
| 시작 시 must 미발견 | 5회 대기 후 없으면 **throw하지 않는다**. 소탕만 하거나 바로 true 반환. 봉인 catch 경로(`clear(35)` 폴백)는 더 이상 타지 않는다 |
| must를 시야에서 놓침 | 마지막 위치로 moveTo, 최대 3회. 도착했는데도 안 보이면 죽었거나 멀리 간 것으로 보고 목록에서 제거 |
| 박스 must | 박스 안에 있을 때만 must. 박스를 벗어나면 목록에서 제거(버림 아님, 재진입 시 재합류). refresh 결함(3-1b) 해소 |
| 결과 1인데 시전 없음 (idle) | SWEEP: 10회 누적 시 버림. MUST: 5회마다 flash (CollMap과 엔진의 LOS 판정 불일치 대비) |
| NoSkipArea | "도달 불가"도 즉시 버리지 않고 재시도 경로로 (현행 NoSkipArea 의미 유지) |
| 1단 확정 제외 | checkSkipped / skipCheck / hasUsableSkill 불합격은 이번 호출 동안 재평가하지 않는다 |
| 위험 반경 합류 | must가 살아 있을 때만. 내 주변 10을 벗어나면 목록에서 제거 |
| 종료 후 | 시전이 1회라도 있으면 pickItems(range, 0이면 기본값 25) → afterAttack. 상자는 range > 0일 때만 min(range, 15) |
| 반환 | false는 사망, 카우킹 감지, AttackSkill 설정 오류뿐. 나머지는 true |
| Skill.cast 기록 | `setSkill` 성공 직후 `Attack.tick.cast = true`. Attack이 없는 스레드 대비 `typeof` 가드 |
| 로그 | `Misc.trace`로 `[AC]` (join, drop 사유, lost, search, leash, end), `[SP] detour`. 전부 `//260926 temp` |

### 9-4. 검증 상태
- `node --check` 통과: Attack.js, Misc.js, Pather.js, Barbarian.js, AutoSmurf.js
- 활성 코드에 `clearList` / `scanList` / `Attack.clearLevel` / `gidAttack` 참조 없음
- `AutoSmurf.js`는 CRLF 파일이다. 편집 도구가 LF로 바꾸지 않도록 주의 (이번 작업에서 한 번 발생, 복구함)
- 인게임 확인 필요: 보스 추적(카운테스, 드 세이스), 바알 웨이브 박스, 회피 동작, `[AC] drop` 사유 분포
