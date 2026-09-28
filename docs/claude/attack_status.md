# Attack 분석 노트 (리팩터링 이전 `main` 기준)

- **현재 코드 명세는 `attack_design.md`** 다. 이 문서는 리팩터링 이전(260926 업로드본, 이하 "이전 코드") 코드의 분석과 결함, 그리고 각 결함이 리팩터링(260928 main 반영)에서 어떻게 됐는지를 기록한다.
- 줄 번호는 이전 코드(커밋 `a40271a`)의 `libs/Attack.js` 기준 (다른 파일은 파일명 명시). 현재 코드에는 원래 본문이 주석(`//`)으로 보존돼 있다.
- 상태 표기: **해소**(리팩터링에서 구조적으로 해결, 인게임 미검증) / **의도**(사용자 확인, 결함 아님) / **추후**(사용자가 미룸) / **해당 없음**(사용자 확인, 문제 아님) / **잔재**(삭제된 기능의 흔적)

---

## 0. 결함 상태 요약

| # | 결함 | 상태 | 리팩터링에서의 처리 |
|---|---|---|---|
| 3-1 | clearList `refresh=1` 무한 루프 (버린 몹 재진입) | 해소 | 이번 호출에서 버린 gid는 다시 받지 않음. 목록 교체 대신 합류 |
| 3-1b | clearList가 범위 밖 몹 추적 (빈 스캔이면 이전 목록 유지) | 해소 | 박스 MUST는 매 틱 박스 안인지 확인 |
| 3-2 | 텔레 회피 실패 시 공격 실패 → 대상 제거 | 해소 | 회피 실패는 true (제자리 시전) |
| 3-3 | `clear(bossId)`가 보스 생존 상태로 true | 해소 | MUST는 어떤 스킵으로도 버리지 않음. HP skip도 SWEEP만 |
| 3-4 | clearList 999 throw 미처리 | 해소 | 상한 폐지, throw 없음 |
| 3-5 | retry 카운터 대상 간 공유 | 해소 | 대상별 retry |
| 3-6 | 보스 무효화 시 NaN으로 범위 필터 소멸 | 해소 | 마지막 위치 사용 |
| 3-7 | Static 사거리 불일치 | 추후 | `Sorceress.js` 260917 예외(사거리 20)는 의도 |
| 3-8 | D.FGOM 46레벨 Wereform이 게임 중 미적용 | 해소 | `AutoBuild.levelUpHandler`에서 `Attack.init()` 재호출 (260928) |
| 3-9a | Barbarian preattack `attackSkill` 선참조 | 해소 | `Config.AttackSkill[0]` 사거리 |
| 3-9b | Paladin `dollAvoid` 미정의 | 잔재 | 사용자가 기능을 삭제한 흔적. `Config.AvoidDolls` 키가 없어 실행 안 됨 |
| 3-9c | `skillRange` 직전 값 잔존, getPath 스냅샷 좌표 | 해소 | Angle/Detour 게이트 자체 제거 |
| 3-9d | getPath 빈 배열이면 우회 판정 통과 | 해소(부분) | setPosition은 `path.length`까지 확인. `Pather.moveTo`의 `if (!path)`는 그대로 |
| 3-9e | `while (!me.gameReady)` 타임아웃 없음 | 해당 없음 | 사용자: 무한 대기일 수 없음 |
| 3-9f | `bossId > 999`로 gid/classid 구분 | 해소 | 규칙 제거 |
| 3-9g | `openChests`의 `Config.OpenChests` 무시 | 추후 | 의도 있음 |
| 3-9h | 걷기 회피가 타깃 쪽으로 전진 (5차 C-2) | 해소 | 회피는 바깥 링(타깃에서 먼 쪽)부터 |
| 3-9i | 텔레 접근 후보 0이면 폴백 없음 (5차 D-4) | 해소 | 후면 구역, 45 초과는 moveTo(여러 번 텔레) |
| 3-10 | 0x1만 막힌 지형에서 접근 시 장거리 우회 | 해소 | 우회는 `DetourPath`(4배) 이내만, 순서: 정면 직선 → 정면 우회 → 후면. MUST만 마지막 수단으로 한도 초과 우회 허용 |
| 3-11 | 설정된 공격 스킬을 실제로 보유하지 않으면(AutoBuild 오류, goal 배분) 시전이 조용히 실패해 모든 몹을 스킵 | 해소 | `clear` 시작 시 보유 검사 → 콘솔 메시지 + `D2Bot.stop()` (260928) |

### 0-1. 1차 구현의 회귀 (260928 점검에서 발견, 수정됨)
| 항목 | 기존 동작 | 1차 구현 | 수정 |
|---|---|---|---|
| MUST 걷기 우회 | clearList → setPosition이 경로 길이와 무관하게 `moveTo` | 4배 한도로 영구 도달 불가 가능 | MUST는 한도 초과 우회 중 짧은 쪽을 마지막 수단으로 |
| 카오스(108) StormCaster(306) | 보스 아니고 벽 뒤면 즉시 스킵 | 규칙 누락 | 복원 |
| HP skip | 5타 20% | 10시전 20% | 5시전 20% (실제 시전만 셈) |
| 박스 안 면역 몹 | shift로 포기 | MUST라 무한 대기, 나머지 못 침 | deferred(뒤로 보내기) |

---

## 1. 운영 환경

- **D2 Legacy 1.14d** (Resurrected 아님). 8캐릭 멀티프로필 팀, 매니저 `D2Bot_LD_patch.exe`
- 프로필: a1 S.FIRE(리더, 텔레 패서), a2 S.COLD, a3 P.CONC, a4 P.CONV, a5 A.TRAP, a6 D.FGOM, a7 N.SUMM, a8 B.WCRY(BO 담당)
- `D.WIND`는 파일만 있고 `Build.getBuildType`에 매핑되지 않았다. `Build.js`는 이 저장소에 없다
- D2BS.dll은 include 경로(`%s\libs\%s` → `%s\%s`)가 패치돼 있다. 모든 경로는 `kolbot/` 기준
- `default.dbj`가 게임마다 `Attack.js`를 다시 include한다. `Attack` 모듈 상태(gidSkip 등)는 게임 단위로 초기화된다
- 스레드: default.dbj(봇 본체), ToolsThread(치킨·포션), TownChicken, PartyThread, AutoBuildThread, HeartBeat. ToolsThread와 TownChicken은 각자 `Attack.init()`을 수행한다. Config는 `_cache/config.<profile>.json`으로 동기화된다
- 빌드 10종(S.LTNG, S.SFFW, S.FIRE, S.COLD, A.TRAP, D.WIND, D.FGOM, P.CONC, N.SUMM, B.WCRY)이 18레벨에서 `Dodge.Enabled = true`, `Dodge.HP`는 100
- Skip*, CustomAttack, BossPriority는 모든 빌드에서 빈 기본값

### 1-1. 엔진 사실 (d2bs 소스, `noah-/d2bs`)
- `File.readLine`/`readAllLines`는 `\n`에서 줄을 끊고 `\r`을 버린다 (`File.cpp:31`). CRLF와 LF는 같은 결과
- `getPath`는 null을 반환하는 경로가 없다 (배열, 에러, 실패 반환). `checkCollision`은 유닛을 ID로 재조회해 **현재 위치**로 판정하고, 못 찾으면 undefined(충돌 없음)
- `CollMap.checkColl`은 입력 좌표(스냅샷)로 선분 3×3 밴드를 보고, 방 정보가 없으면 막힘(5)
- 사용 중인 DLL이 이 소스로 빌드됐는지는 미확인

---

## 2. 리팩터링 이전 구조 (`main`)

- 진입점: `clear`(33-268), `clearList`(341-455), `clearLevel`(271-339, 방마다 `clear(30, spectype)`). `kill`은 이미 없음. 액트 보스는 `clearList(scanList(id), null, 1)`
- **clear**: 수집 필터 spectype → checkSkipped → checkMonster → skipCheck (113). range 초과 shift (146). 0x4로 막히면 306 / Angle / Detour Skip (151-188). `doAttack(target, attackCount % 10 === 0)`. 결과 0: 공유 retry 5회째 shift + 매번 flash. 결과 2: shift. 결과 1: 5타마다 HP 감소 20% 미만이면 gidSkip + shift (보스 포함). 종료: pickItems → afterAttack, openChests. 상한 999, 보스 지정 시에만 throw
- **clearList**: HP / Angle / Detour / skipCheck / range 처리 없음. refresh 주기마다 목록 교체(빈 결과면 유지). 999 throw
- **ClassAttack**: index = `spectype & 0x7` ? 1 : 3. timed [index]→[5], untimed [index+1]→[6], LowMana 대체. doCast 반환 0/1/2. timed/untimed는 doCast 안에서 상호배타(Sorceress, Amazon, Assassin, Druid, Wereform). Necromancer는 한 틱에 setPosition 최대 2회, 저주 후 `return 1` 주석(//260919)
- **setPosition**(477-684): 이동 필요와 회피 채점이 배타. 회피는 `distance >= Dodge.Range(13)`일 때만. 링 생성 → 슬롯 채움 → 슬롯 소비

---

## 3. 결함 상세 (`main`)

### 3-1. clearList refresh=1 무한 루프
- 근거: 379, 414-416, 436-439, `scanList` 457-475
- `refresh=1`이면 첫 성공 이후 매 틱 목록을 새 스캔 결과로 **교체**한다. 면역(결과 2)이나 도달 불가(5회 실패)로 뺀 몹이 곧바로 다시 들어온다
- attackCount가 늘지 않아 999 상한에도 걸리지 않는다. AutoSmurf의 clearList 호출은 전부 `refresh=1`이었다

### 3-1b. clearList가 범위 밖 몹을 추적
- 382 `if (refreshed && refreshed.length)`: 새 스캔이 0마리면 **교체하지 않고 지금 목록을 그대로 쓴다**
- 박스 안의 몹을 다 잡은 마지막 순간, 목록에 남은 "박스 밖으로 도망간 몹"을 쫓게 된다 (사용자 관찰과 일치)
- `scanList`의 "나 기준 range"는 실제 호출부가 쓰지 않았다 (호출부는 id만 또는 박스만)

### 3-2. 텔레 캐릭 회피 실패 시 공격 실패
- 659-667: 회피 채점 중 텔레 후보가 없으면 `return false` → doCast 0 → retry + flash → 5회째 shift. 18레벨 이상 텔레 빌드 전부 해당

### 3-3. clear(bossId)가 보스 생존 상태로 true
- 보스가 빠지는 경로: HP skip(보스 포함, S57 사용자 결정), skipCheck, Angle/Detour, 공유 retry
- HP skip 오판 요인: doCast가 시전 없이 1을 반환하는 경로(마나 부족, LOS 막힘으로 시전 생략, timed 딜레이 대기, 해머 거리 9 초과)

### 3-4 ~ 3-6
- 3-4: 바알 웨이브 호출(`AutoSmurf.js` 5880, 5911, 5982, `main` 기준)은 try가 없어 999 throw 시 스크립트 중단
- 3-5: retry가 대상별이 아니라서 재정렬 후 다른 대상이 1회 실패만으로 shift될 수 있음
- 3-6: 120-123 `orgx = boss.x`가 undefined → NaN → range 필터 소멸

### 3-7. Static 사거리 불일치 (추후)
- `Skill.getRange(42)` = `lvl + 4` (`Misc.js`, skills.txt 파라미터와 일치), `Sorceress.js:64` staticRange = `(lvl + 4) × 2/3` (설명창 표시값)
- S.FIRE는 Static 1포인트라 StaticList 보스의 3칸 안까지 접근
- Static은 나이트메어 33%, 헬 50% 아래로 깎지 못한다

### 3-8. D.FGOM 46레벨 Wereform (해소)
- `AutoBuild.levelUpHandler`는 `applyConfigUpdates`만 호출하고 `Attack.init()`은 다시 부르지 않는다. 46레벨이 된 게임에서는 Druid ClassAttack이 249/243을 쓰고, 다음 게임부터 Wereform.js가 로드된다
- 브랜치: 핸들러에서 `Attack.init()`을 무조건 다시 부른다. 엔진이 이미 include한 파일은 건너뛰므로(`d2bs Script.cpp:308`) 46레벨 전에는 변화가 없다. 이 핸들러는 default.dbj에만 등록된다(다른 스레드는 `Config.js`의 별도 핸들러로 json만 다시 읽는다)

### 3-10. 접근 시 장거리 우회
- 0x4는 뚫리고 0x1만 막힌 지형에서는 Detour 게이트(151)에 걸리지 않는다. setPosition의 `slotMove`가 나 기준 검사 없이 확정돼 `moveTo`가 크게 우회했다

---

## 4. 이전 문서 정정

| 항목 | 정정 |
|---|---|
| 260509/260510 전반 | 상한 300 → 999, preattack `%15` → `%10`, HP skip은 gidSkip 구조로 clear 전용 |
| 4차 7-2 "retry 4회" | 실제로는 5회째 shift |
| 4차 7-1 Static `×2/3`, "lvl16 = 13" | `Skill.getRange(42)` = `lvl + 4` |
| 5차 A-1 `getMonsterCount` 경량화 "미반영" | 이미 해소돼 있었다 (checkMonster는 buildMonsterList에서 1회) |
| 4차 `maxTeleDistance` 42 | 45 |
| 6차 A절 "scoring 상시 거짓" | 빌드 10종이 18레벨에서 Dodge를 켠다 |
| 260909 구조 문서 doAttack 반환 "1 실패 / 2 계속 / 3 처치" | 0/1/2 |
| `RushThread.js:824` getIntoPosition 잔존 | 이 저장소에 RushThread.js가 없다 |

---

## 5. 설계 이력 (Session 34~57, 260828~260926)

같은 축에서 결정이 여러 번 뒤집혔다. 같은 시행착오를 반복하지 않기 위한 기록이다.

| 주제 | 변천 |
|---|---|
| 벽 뒤 몹 사전 스킵 | S37 도입 → S42 제거(doCast 위임) → S51 collPath 재도입 → S52 `collList`(보류 후 복귀) → `main`: Detour 즉시 shift → **브랜치: 게이트 제거, setPosition의 "도달 불가"로 판정** |
| Angle Skip | S57 ±90° → 360° → **브랜치: 제거** |
| HP skip | S37 무변화(10타) → S42 3단 → S51 2단 → S56 연속 3회 영구 → S57 즉시 영구, 보스 포함 → `main`: 5타 20% → **브랜치: SWEEP만 10시전 20%** |
| retry | Attack 계열 5회, Pather 계열 3회 → **브랜치: 대상별 5회, MUST는 포기 없음** |
| afterAttack | S57 `attackCount > 0` 가드(Necro raiseArmy 블로킹) → **브랜치: 실제 시전 1회 이상** |
| clearList refresh | S53 바알 쓰론 박스 재검증용 → **브랜치: 폐지, 매 틱 합류 스캔** |
| GIP / dodge | S37~S47 → 260826 setPosition 통합(배타) → **브랜치: 한 기준, 순서는 이동·위협은 통과 조건** |

유의점: 스킵 정책은 사용자가 운영 관찰을 근거로 직접 결정해 왔다. 결함은 "결정의 부작용"으로 제시하고, 원칙부터 합의한다.

---

## 6. 참고 자료

| 자료 | 성격 |
|---|---|
| 260509 `attack_analysis.md`, 260510 `attack_tree_summary.txt` | 2425줄 판 기준, 대부분 낡음 |
| 260828 `GIP_dodge_summary.txt` (4차) | setPosition 통합 설계 |
| 260910 `GIP_dodge_patch.txt` (5차) | 4차 패치, F절 신설계 |
| 260926 `GIP_dodge_detour.txt` (6차) | Detour 분리 설계, 엔진 함수 조사 |
| 260621 `D2BS_Master_Full` (16차) | Session 1~57 수정 이력 |
| 260909 `D2BS_Structure.md` | 파일·스레드·함수 계약 구조 |
| 260926 claude.ai 채팅 요약 | 공격 로직 전반 검토 |
| 원본 kolbot (`kolton/d2bot-with-kolbot`) | 트라빈컬 평의회 classid 345~347 확인 |
