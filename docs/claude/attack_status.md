# Attack 계열 현황 노트

Claude 세션 간 인수인계용. **본 노트가 최신**이며, 아래 문서와 충돌하면 본 노트를 따른다.
줄 번호는 260926 시점 `libs/Attack.js` 기준 (다른 파일은 파일명 명시).

반영한 이전 자료

| 자료 | 성격 |
|---|---|
| 260509 `attack_analysis.md`, 260510 `attack_tree_summary.txt` | 2425줄 판 기준. 대부분 낡음 (1절) |
| 260828 `GIP_dodge_summary.txt` (4차) | setPosition 설계. 일부 5차에서 철회 |
| 260910 `GIP_dodge_patch.txt` (5차) | 4차 패치 + F절 신설계(미반영) |
| 260926 `GIP_dodge_detour.txt` (6차) | Detour Skip 분리 설계, 엔진 함수 조사 |
| 260926 claude.ai 채팅 요약 (붙여넣기) | 공격 로직 전반 검토, 결정사항 없음 |
| 260926 Claude Code 세션 (본 저장소) | 코드 대조, 신규 결함, 미결 항목 검증 |

상태 표기: **[확정]** 사용자 합의 / **[사실]** 코드로 확인 / **[미결]** 미확인·미합의

---

## 1. 현행 구조 요약 [사실]

- 진입점: `clear` (33-268), `clearList` (341-455), `clearLevel` (271-339, 방마다 `clear(30, spectype)`)
- **`kill` 없음.** 액트 보스는 `clearList(scanList(id), null, 1)`. `canAttack` / `hurt` / `deploy` / `fastPick`도 없음
- `sortMonsters`, `getScarinessLevel` 호출부 0. 기본 정렬 `sortByDistance`, 매 tick 재정렬
- `clear(bossId)` 경로 사용처: 봉인 보스, Countess, Rakanishu, Smith, Bone Ash, Treehead
  (`AutoSmurf.js:2239, 2306, 2435, 2581, 2895, 4772, 4816, 4860, 6087`)

### clear
- 수집 필터 (113): spectype → checkSkipped → checkMonster → skipCheck
- 루프: checkMonster 실패 / range 초과 → shift (146)
- `checkCollision(me, target, 0x4)`이고 NoSkipArea 아님 → 306 / Angle / Detour Skip (151-188)
- `doAttack(target, attackCount % 10 === 0)` (194)
- 결과 0: `retry++ > 3` → **5회째** shift, 매 실패마다 `Packet.flash` (300ms+2ping)
- 결과 2: shift
- 결과 1: gidAttack 누적. 근접 스킬은 10타마다 flash. 5타마다 HP 감소가 20% 미만(`/128 < 0.2`)이면 gidSkip 등록 후 shift
- 종료: `attackCount > 0`이면 pickItems(range) → afterAttack. `openChest`(기본 true)면 항상 `openChests(min(range,15))`
- 상한 999. boss 지정 시에만 throw (253)
- gidSkip 리셋: 지역 변경 또는 마지막 스킵 위치에서 40칸 초과 (82-86)

### clearList
- HP / Angle / Detour / skipCheck / range 처리 없음
- refresh 주기마다 재스캔 (379-387). `scanList`는 checkMonster만 적용
- 999 도달 시 throw. 종료: afterAttack → pickItems. openChests 없음

### ClassAttack 공통
- index: `spectype & 0x7`이면 1, 아니면 3
- timed: [index] → 면역이면 [5]. untimed: [index+1] → 면역이면 [6]. 이후 LowMana 대체
- doCast 반환: 0 실패 / 1 성공 / 2 유효 스킬 없음. 위치 이동은 전부 `setPosition`
- **틱 구조 (6차 D절)**: timed/untimed는 `doCast` 안에서 상호배타
  (Sorceress, Amazon, Assassin, Druid, Wereform)
  - Sorceress는 Energy Shield + preattack + Static 루프가 별도로 붙는다
  - Necromancer는 timed switch가 break로 흘러 한 틱에 `setPosition` 최대 2회
  - `Necromancer.js:146, 159`: 저주 후 `return 1`이 주석 처리됐다 (//260919). 같은 틱에 본 공격까지 진행
  - Barbarian / Paladin은 단일 스킬

### setPosition (477-684)
- `moveNeeded`와 `scoring`은 배타. `scoring`에 `distance >= Dodge.Range`와 `classid ≠ 243` 포함 (495, //260915)
- 링 생성 (517-574) → 한 번 순회하며 슬롯 채움 (576-657) → 슬롯 소비 (659-683)

### Config / 빌드
- `Config.Dodge` = Enabled false / Range 13 / Count 1 / HP 100 / Step 5 (`Config.js:87`)
- 단 **10개 빌드가 18레벨에서 `Dodge.Enabled = true`**:
  S.LTNG, S.SFFW, S.FIRE, S.COLD, A.TRAP, D.WIND, D.FGOM, P.CONC, N.SUMM, B.WCRY.
  HP는 100 그대로라 scoring이 상시 활성이다.
  (6차 A절의 "scoring 상시 거짓"은 Config 기본값만 본 것으로, 틀렸다)
- Skip*, CustomAttack, BossPriority는 모든 빌드에서 빈 기본값 (`Config.js:531-540`)
- `NoSkipArea [17]`, `DetourPath 4`
- `Pather.teleDistance 35`, `maxTeleDistance 45` (`Pather.js:145-146`).
  4차 문서의 42는 낡은 값이며, 42와 45가 다르던 문제는 45로 확정

---

## 2. 이전 문서 정정 [사실]

| 항목 | 정정 |
|---|---|
| 260509/260510 전반 | 상한 300 → 999. preattack `%15` → `%10`. HP skip은 gidSkip 구조로 clear 전용. S42의 lastHp / sameHpCount 3단 구조와 보스 제외는 현행에 없음 (223 보스 조건 주석) |
| 4차 7-2 "retry 4회" | 실제로는 5회째 shift |
| 4차 7-1 Static `×2/3`, "lvl16 = 13" | `Skill.getRange(42)` = `lvl + 4` (`Misc.js:101-102`, //260915). skills.txt 파라미터(기본 반경 5, 레벨당 +1)와 일치하고, ×2/3은 스킬 설명창 표시값이다 |
| 5차 A-1 `getMonsterCount` 경량화 | **해소됨.** 944-961은 checkMonster 없는 단순 카운터이고, checkMonster는 `buildMonsterList`에서 한 번만 수행한다. 목록 단계의 243 제외만 없음 (495의 타깃 조건으로 대체). 이전 본 노트와 붙여넣은 요약의 "미반영" 기재는 틀렸다 |
| 5차 A-3 `:664` | 여전히 주석 처리 → 3-2 결함 |
| 4차 9-1 Paladin 101 이중 호출 | 해소됨. 141에서 한 번 호출 (0x2004) |
| 260909 doAttack 반환값 설명 | 코드는 0/1/2 |
| `RushThread.js:824` getIntoPosition 잔존 | 이 저장소에는 RushThread.js 자체가 없다. libs/threads 전체에서 getIntoPosition 활성 호출 0 |

---

## 3. 결함 목록

### 3-1. clearList refresh=1 무한 루프 [사실, 심각]
- 근거: 379, 414-416, 436-439, `scanList` 457-475
- `refresh=1`이면 첫 성공(`attackCount > 0`) 이후 **매 반복** 재스캔한다. shift한 몬스터가 곧바로 목록에 다시 들어온다
- 결과 2(면역)는 대기 없이 반복되고, 결과 0(도달 불가)은 5회 실패 + flash 주기로 반복된다. attackCount가 늘지 않아 999 상한에도 걸리지 않는다
- 탈출은 사망하거나 해당 몬스터가 사라질 때뿐이다
- 영향: AutoSmurf의 clearList 호출은 **전부** `refresh=1`이다 (액트 보스, 바알 웨이브 `5880/5911/5982`, 봉인 구역 등). 예: S.FIRE 12~49레벨(`S_FIRE.js:137`)은 화염 면역 몬스터에 즉시 2를 반환한다

### 3-1b. clearList refresh가 범위 밖 몹을 추적 [사실, 사용자 관찰과 일치]
- 382 `if (refreshed && refreshed.length)`: 새 스캔이 비면 **이전 목록 유지** → 박스/range를 벗어난 잔여 몹 계속 추적 (주원인)
- `scanList` range 기준이 `getDistance(me, monster)` → 추적하면 범위가 같이 이동, 추적 제한 불가
- `attackCount > 0` 전에는 refresh 미실행 → 첫 대상이 계속 실패하면 최초 스냅샷을 재검증하지 않음
- 목록 잔류 대상은 `checkMonster`만 재확인 (395). 범위 재판정은 refresh 시점에만
- 결론: refresh는 목록 교체 장치일 뿐 범위 이탈 제거 장치가 아니다. 통합 엔진은 대상별·매 틱·고정 기준점으로 범위를 판정해야 한다

### 3-2. 텔레 캐릭 회피 실패 시 공격 실패 [사실, 심각]
- 근거: 659-667, `Sorceress.js:146`
- `scoring` 상태(이미 사거리와 LOS 확보)에서 `slotTele`가 없으면 665 `return false`
- 흐름: doCast 0 → retry + flash → 5회째 shift. 13링의 `slotWalk` / `slotRev`는 채워져도 사용되지 않는다
- 4차 2-6 계약("회피 실패 → true")과 다르다
- 1절대로 10개 빌드가 18레벨부터 Dodge를 켜므로 **텔레 쓰는 18레벨 이상 전 빌드에 해당**한다
- 최소 수정: 665 → `return !moveNeeded;`

### 3-3. clear(bossId)가 보스 생존 상태로 true 반환 [사실, 심각 / 원인 일부는 의도된 결정]
> HP skip이 보스에게도 적용되는 것은 **사용자의 의도된 결정**이다 (Session 57, 260621).
> spectype 조건 제거, 임계 `>0`(1회 즉시 영구 차단), 정상 데미지 시 리셋 제거가 모두 의도적이다.
> 범위는 당시 `Config.CollSkip`(현 `NoSkipArea`)로 제어한다.
> 아래는 그 결정이 `clear(bossId)` 반환 계약과 충돌한다는 지적이며, 토론 대상이다.

- 보스가 빠지는 경로:
  - HP skip (223 보스 조건 주석)
  - skipCheck
  - Angle / Detour Skip
  - 공유 retry
- **HP skip 오판 요인**: doCast가 시전 없이 1을 반환하는 경로
  - 마나 부족 (`Misc.js:261-268`)
  - LOS 막힘으로 시전 생략 (`Sorceress.js:151`)
  - timed 딜레이 대기 (`Sorceress.js:186-194`)
  - 해머 거리 9 초과 (`Paladin.js:110-114`)
- 카오스 봉인 보스가 스킵되면 봉인 진행이 깨진다 (`AutoSmurf.js:4714, 4772`)

### 3-4. clearList 999 throw가 잡히지 않음 [사실]
`AutoSmurf.js:5880, 5911, 5982` (바알 웨이브)는 try가 없다. 3-1로 인해 실제로는 999보다 무한 루프가 먼저 발생할 가능성이 크다.

### 3-5. retry 카운터가 타깃 간 공유 [사실]
199, 246, 196 / clearList 436-439. 재정렬로 [0]이 바뀌어도 retry가 이어져, 한 번만 실패한 몬스터가 shift될 수 있다.

### 3-6. 보스 유닛 무효화 시 range 필터 소멸 [사실]
120-123 `orgx = boss.x`가 undefined → `getDistance`가 NaN → `NaN > range`는 false → 맵 전체를 추격한다.

### 3-7. Static 사거리 불일치 [사실, 의도 미결]
- `Misc.js:102`는 `lvl+4`, `Sorceress.js:64`의 staticRange는 `(lvl+4)*2/3`
- S.FIRE는 Static 1포인트라 staticRange가 3이고, StaticList 보스의 3칸 안까지 접근한다 (`S_FIRE.js:31, 131`)
- `Sorceress.js:168-176` (//260917): untimed가 42이면 **timedSkill 사거리**로 setPosition을 호출한다. timedSkill이 -1(면역)이면 `getRange(-1)` = 20이 되어, 20칸 밖에서 Static을 시전한다
- Static은 나이트메어 33%, 헬 50% 아래로 체력을 깎지 못한다. 63/66의 `Math.round(hp%) > CastStatic` 루프는 CastStatic 설정에 따라 마나가 다 떨어질 때까지 반복할 수 있다 (엔진 hp 스케일 실측 필요)

### 3-8. D.FGOM 46레벨 Wereform 전환이 게임 중 적용되지 않음 [사실]
- `AutoBuild.levelUpHandler`는 `applyConfigUpdates`만 호출하고, `Attack.init()`은 다시 호출하지 않는다
- `Attack.init()` 호출처는 `default.dbj:49`, `ToolsThread.js:37`, `TownChicken.js:80`뿐이다
- 그래서 46레벨이 된 게임에서는 Druid ClassAttack이 AttackSkill 249/243(Armageddon / Shock Wave)을 쓴다. 다음 게임부터 Wereform.js가 로드된다

### 3-9. 기타 [사실]
- `Barbarian.js:25-26`: `attackSkill`을 대입 전에 참조한다(var 호이스팅으로 undefined → `getRange` 20). Howl(130)도 20이라 현재는 결과가 같지만, AttackSkill[0]을 바꾸면 문제가 된다. preattack 분기에 return이 없어 같은 틱에 본 공격으로 이어진다
- `Paladin.js:88` `dollAvoid`는 정의가 없다. `Config.AvoidDolls` 키도 없어 실행되지 않는다
- `clear` 160 `skillRange`는 0x4 블록 안의 var라서, 블록 밖에서 참조하면 직전 타깃 값이 남아 있다 (6차 C-4)
- 181 `getPath`는 **스냅샷** 좌표, 151 `checkCollision`은 **현재** 좌표로 판정한다 (6차 E-2)
- `!collPath` 실효 의문: d2bs 소스상 getPath가 null을 반환하는 경로가 없다. 빈 배열이면 비율 0이 되어 도달 불가 몹이 Detour Skip을 통과한다. `Pather.moveTo:280, 337, 417`의 `if (!path)`도 같은 문제 (6차 G-6, DLL 확인 필요)
- `while (!me.gameReady)` 타임아웃 없음. `bossId > 999`로 gid/classid 구분. clear 999 무보스 시 조용히 true
- `openChests`의 `Config.OpenChests` 검사는 주석 처리돼 있다. 이전 문서상 "의도적 유지"
- `pickItems`는 me 기준, `openChests`는 orgx/orgy 기준
- 5차 C-2: 걷기 회피 링의 원점이 타깃이라 오히려 전진한다. D-4: 텔레 접근 후보 0이면 폴백 없음 (6차 B-5 재확인)

### 3-10. 접근 시 장거리 우회 (6차 B절) [사실]
- 0x4는 뚫리고 0x1만 막힌 지형에서는 151 게이트에 걸리지 않아 Detour Skip에 도달하지 않는다
- setPosition의 `slotMove`는 me 기준 검사 없이 확정된다 (619). 결국 675 `moveTo`가 getPath로 크게 우회한다
- 원안 GIP의 moveTo 폴백을 그대로 물려받은 구조이며, 회귀가 아니다

---

## 4. 설계 결정

### 6차 Detour Skip 분리 [확정]
- C-1: 목적은 크게 우회해야 하는 몹을 건너뛰는 것이다. 접근 가능한 몹을 잡기 위한 설계가 아니다
- C-2: 텔레 캐릭도 동일하게 적용한다
- C-3: Detour Skip만 0x4 블록 밖으로 분리한다. 306 / Angle Skip은 블록 안에 둔다
- C-4: `skillRange` 대입을 144 `attackSkill` 결정 직후로 옮긴다
- C-5: 판정식은 기존 183을 그대로 쓴다
- 작업안(C-6)은 SyntaxError(`,` → `;`)가 있다. 거리 기준, 0x4 케이스 포함, NoSkipArea 제거는 미결

### 철회·기각 (반복 금지)
- 4차 2-2 상호배타, 4-2 `distance >= 13` 게이트, 4-9 caller unit 고정 → 5차에서 철회
- 151 공용 게이트에 사거리 OR 추가 → 기각 (306 / Angle Skip이 함께 열림)
- Detour 조건에 `!useTeleport()` → 기각 (텔레 포함 결정)
- "181 reduction 0이 텔레 캐릭을 오판정" → 철회
- 4차 이후 문서의 기타 기각 항목: 6차 F절, 5차 F-5 참조

---

## 5. 미결

| # | 항목 | 출처 |
|---|---|---|
| 1 | setPosition 재이원화 여부와 축 (원안 복귀 / 기구 유지 분리 / 5차 F절 me 원점 모델). 촉발 실측 근거 | 5차 G, 6차 G-1 |
| 2 | Detour 거리 기준 `getDistance(me, target)` vs `(target, orgx, orgy)`. 후자는 146과 겹쳐 range ≤ skillRange 호출에서 영구 불성립 | 6차 G-2 |
| 3 | 0x4 케이스를 Detour Skip에 포함할지 | 6차 G-3 |
| 4 | NoSkipArea 제거 의도 | 6차 G-4 |
| 5 | 0x1 직선 판정 함수 (`checkCollision` vs `CollMap.checkColl`) | 6차 G-5 |
| 6 | getPath 실패 시 반환값 (빈 배열 여부), radius 의미 → 게임 내 `print(version())`으로 DLL 특정 | 6차 G-6~8 |
| 7 | Static 사거리 의도 (`lvl+4` vs `×2/3`), 260917 예외의 timedSkill 참조 | 3-7 |
| 8 | Telekinesis(43) 속성 → S.FIRE 50+ / S.COLD 24+의 [6]=43 폴백 시 결과 2 빈도 | 채팅 요약 |
| 9 | openChests 설정 무시 유지 여부 | 3-9 |
| 10 | 5차 G절 1~7 (회피 링 기준각, 접근 링 순회 상한, 664 해제, D-4 폴백 등) | 5차 |

## 6. 운영 환경과 설계 이력 (출처: 260621 마스터 문서 16차, 260909 구조 문서)

### 6-1. 운영 환경 [사실]
- **D2 Legacy 1.14d** (Resurrected 아님). 8캐릭 멀티프로필 팀, 매니저 `D2Bot_LD_patch.exe`
- 프로필: a1 S.FIRE(리더, 텔레 패서), a2 S.COLD, a3 P.CONC, a4 P.CONV, a5 A.TRAP, a6 D.FGOM, a7 N.SUMM, a8 B.WCRY(BO 담당)
- `D.WIND`는 파일만 있고 `Build.getBuildType`에 매핑되지 않았다. `Build.js`는 이 저장소에 없다
- D2BS.dll은 include 경로(`%s\libs\%s` → `%s\%s`)가 패치돼 있다. 모든 경로는 `kolbot/` 기준
- `default.dbj`가 게임마다 `Attack.js`를 다시 include한다. `Attack` 모듈 상태(gidSkip 등)는 게임 단위로 초기화된다
- 스레드: default.dbj(봇 본체), ToolsThread(치킨·포션), TownChicken, PartyThread, AutoBuildThread, HeartBeat
  - ToolsThread와 TownChicken은 각자 `Attack.init()`을 수행한다
  - Config는 `_cache/config.<profile>.json`으로 동기화된다
- 260909 구조 문서의 "doAttack → 1 실패 / 2 계속 / 3 처치"는 틀렸다 (코드는 0/1/2)

### 6-2. 전투 루프 설계 이력 요약 [사실]
같은 문제를 두고 설계가 여러 번 뒤집혔다. 리팩터링 토론에서 같은 시행착오를 반복하지 않기 위한 기록이다.

| 주제 | 변천 |
|---|---|
| collision 사전 스킵 | S37 도입 → S42 제거(doCast/GIP에 위임) → S51 collPath 비율 체크 재도입 → S52 `collList`(스킵 대신 보류 후 복귀) → 현행: `collList` 없음, Detour 즉시 shift. `Config.CollPath`는 `DetourPath`, `CollSkip`은 `NoSkipArea`로 이름이 바뀌었다. `MonSkip`은 없다 |
| Angle Skip | S57 ±90° → 360°(23방향). "사방이 막힌 경우만" 거르는 프리필터로 역할 한정 |
| HP skip | S37 HP 무변화(10타) → S42 3단(lastHp -1, sameHpCount) → S51 2단 → S56 gidSkip 영구 차단(연속 3회) → **S57 즉시 영구 차단, 보스 포함(의도)** → 현행: 5타마다 20% 미만 |
| 스킵 분류 원칙 (S56) | 영구화는 "공격은 했는데 못 죽이는" HP skip만. result 2, retry, Angle은 상황 의존적이라 영구화 부적합 |
| retry | Attack 계열은 `retry++ > 3`(5회) 표준. Pather 계열은 3회 |
| afterAttack | S57에서 `attackCount > 0` 가드. Necro `raiseArmy` 블로킹 때문이며, openChests는 가드 밖 |
| clearList refresh | S53 바알 쓰론 잔여몹용으로 도입. 매 성공마다 박스 멤버십을 재검증하는 목적. doll(691)은 스냅샷 유지. 3-1 무한 루프는 이 refresh와 shift의 상호작용에서 생긴다 |
| GIP / 이동 | S37 무력화 → S39 재활성(루프 내 moveTo가 SafeTele 개입) → S47 walk/moveTo 폴백 → 260826 setPosition 통합 |
| dodge | S38~39 설계 → 260828 setPosition에 흡수 |

### 6-3. 토론 시 유의점
- 스킵 정책은 사용자가 운영 관찰을 근거로 여러 차례 직접 결정했다. 결함 지적은 "결정의 결과로 생기는 부작용"으로 제시하고, 결정 자체를 뒤집자고 전제하지 않는다
- 여러 번 뒤집힌 축(collision 사전 스킵 vs doCast 위임, 스킵 영구화 범위)은 원칙부터 합의해야 다시 흔들리지 않는다

## 7. 리팩터링 방향 (사용자 요청 260926, 범위 미합의)
- 사용자 판단: 스킵 정책(1번)은 전투 루프 통합(2번)에 포함한다. 메인은 **전투 루프**와 **setPosition** 두 축
- 제안 순서 (미합의): 루프 틱 구조 → 루프와 setPosition/doCast 사이 계약 → setPosition 내부

### 7-1. 토론 경과 (260926)
- **[확정] 방향**: `kill` 폐지(완료). `clearLevel`은 den 전용(`AutoSmurf.js:1788, 1839`)이므로 Attack에서 분리 대상. 주 루프는 `clear`, `clearList`는 놓치면 안 되는 대상(바알 루프, 트라빈컬, 보스)의 끝까지 추적 전용. 또는 루프 하나로 완전 통합
- **[확정] 포기 판단 주체는 루프.** 근거: 리스트를 줄여 비용을 절감하는 것이 clear의 주요 축이고, 8봇이라 비용이 8배. 단, 미리 버릴 수 있다는 것이 확실할 때만
- **[확정] 판단 3단 구분**
  - 1단 확정 제외: 싸고 확실함 (checkMonster, Skip*, 사용 가능 스킬 없음). 수집 시 버림
  - 2단 추정 제외: 벽/우회. 대상별 1회 계산 후 캐시, 대상이 움직이면 재계산
  - 3단 사후 판단: HP 무진행, 위치 실패. 대상별 카운터. gidSkip처럼 거리/지역 이탈 시 리셋 트리거
- **[확정] 모드별 처리**
  - clear는 2·3단에서 버린다
  - clearList는 2단은 보류하고, 3단은 대응 단계를 올린다: flash → 다른 각도 → 보조 스킬 → 이동 제한 완화(텔레 캐릭 걷기/moveTo 허용) → 명시적 실패
  - 정체 판정은 시간 기준
  - 구현은 1차(flash, 이동 제한 완화: 루프와 setPosition만 수정)와 2차(각도, 보조 스킬: 직업 파일 doAttack/doCast에 opts 전달)로 나눌 수 있다
- **[확정] 엔진 호출 구조**: `targets`(필수 대상, gid 추적)와 `sweep`(주변 소탕, 고정 기준점 range 또는 박스)을 동시에 받는다 (사용자 "일단은 맞다")
- 제안 (미합의): 보스 목줄 규칙. 평소 거리순, 이탈이나 도주 시 보스 우선. 시야를 잃으면 마지막 위치로 이동해 재탐색. 이동 중에도 위험 반경 안 몹은 먼저 처리
- **[확정] 목줄 L = 35.** getUnit 가시 거리는 약 40이 최대(사용자 경험값). 보스가 무한히 도주하지는 않으므로, 놓쳐도 마지막 위치로 가면 재발견 가능
- 사용자 관찰: 도주로 놓치는 보스는 카운테스(Forgotten Tower), 로드 드 세이스(카오스 봉인). 거리 밖이 아닌데 놓치는 경우도 있음 → 3-3의 경로(HP skip, 공유 retry, 결과 2 shift, Angle/Detour)와 부합. targets는 이 경로로 버려지지 않는다
- 제안 (사용자 질의 대응, 미합의): refresh 대체
  - 매 틱 대상별로 고정 기준점 범위를 판정해 즉시 제거
  - 주기적 재스캔은 교체가 아니라 합류(merge). 기존 gid와 이번 호출에서 버린 gid는 제외 → 3-1, 3-1b 해소
  - 목록이 비면 한 번 더 스캔 후 종료
  - 기존 refresh 인자는 스캔 주기로 해석
- 사용자 제공 배경: clear(bossId)는 거리순 정렬 때문에 다른 몹을 치는 사이 보스가 getUnit 범위 밖으로 도주해 실패. 보스를 먼저 노리면 잡몹에 노출되는 트레이드오프. clearList는 인자가 null(전부) 또는 특정 id뿐이라 보스 id를 주면 주변 몹 처리 수단이 없다
- 미결: clearList 대상에 유효 스킬이 없을 때 처리, 위험 반경 값, 보스 목줄 규칙 세부

사용자는 "어택 로직 전반 리팩터링"을 요청했다. 범위와 정책(HP skip, 상자)은 아직 확인하지 못했다.
검토 중인 골격:
- clear / clearList / 보스 처치를 **단일 전투 루프**로 통합
- 대상별 상태를 gid로 관리 (retry, HP 진행, 벽 판정 캐시)
- "반드시 죽일 대상"(보스)을 명시하고 스킵 대상에서 제외하며, 종료 시 생존 여부 검증
- refresh 재스캔 시 이번 호출에서 스킵한 gid 제외 (3-1 해소)
- setPosition 반환 계약 복구 (3-2)
