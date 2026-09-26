# Attack 계열 현황 노트 (260926 기준)

Claude 세션 간 인수인계용. 이전 분석 문서(260509 / 260510 / 260828 4차 / 260910 5차 패치)를
현행 코드와 대조한 결과이며, **본 노트가 최신**이다. 줄 번호는 260926 시점 `libs/Attack.js` 기준.

## 1. 이전 문서 대비 코드 상태 변화

| 항목 | 이전 문서 | 현행 코드 |
|---|---|---|
| `Attack.kill` | 260510 트리에 존재 | **없음**. 액트 보스는 `clearList(scanList(classid), null, 1)` (예: `AutoSmurf.js:3017` Andariel) |
| `Pickit.fastPick` | clear 루프 내 호출 | 없음 |
| 공격 상한 | 300 | 999 (`clear` / `clearList` 공통) |
| HP skip (clear) | S42: `attacks >= 10`, 보스(`spectype & 0x7`) 제외, liveUnit 재조회, `lastHp` / `sameHpCount` 3단 | 5회마다 `(hp이전 - hp)/128 < 0.2`면 `gidSkip` 등록 후 shift. **보스 제외 조건은 주석 처리됨** (`:223`). 1회 등록 시 영구 스킵 (`checkSkipped > 0`) |
| HP skip (clearList) | clear와 동일 3단 | **없음** |
| collision shift (clear) | 260510: 제거됨 / 4차: 존치 | 존치 (Angle Skip `:159-179`, Detour Skip `:181-187`, 306 Skip `:152-157`) |
| 종료 처리 | 260510: `monsterList.length === 0`일 때만 pick/openChests, `afterAttack`는 항상 | `attackCount > 0`이면 `pickItems(range)` 다음 `afterAttack`, `openChest` 인자(기본 true)면 **항상** `openChests(min(range,15))` |
| `openChests`의 `Config.OpenChests` 검사 | 주석 (의도적 유지) | 여전히 주석 (`:1680`). 즉 경로 이동 노드마다 상자 열기 |
| `clearLevel` | 260509: 선제 clear + `clear(40)` | 선제 clear 없음, `clear(30, spectype)` (260910) |
| dodge 호출 | 4차: kill/clear/clearList 3곳 주석 | clear / clearList 주석 유지. `dodge()` 본체는 존치, 호출부 0 |
| `getIntoPosition` | libs 내 호출 0 | 동일. 클래스 파일은 전부 `setPosition`, GIP는 주석 |
| `Pather.maxTeleDistance` | 4차 8-3: 42 | **45** (`Pather.js:146`), `teleDistance` 35 |
| `Config.Dodge` | Enabled false / Range 13 / Count 1 / HP 100 / Step 5 | 동일 (`Config.js:87`) |
| `NoSkipArea` / `DetourPath` | — | `[17]` / `4` |

## 2. 5차 패치(260910) 항목의 현행 반영 여부

| 5차 항목 | 현행 |
|---|---|
| A-1 `getMonsterCount` 경량화 (`N x 1`) | 미반영. 원본 그대로 (`:944`) |
| A-2 `classid 243` 제외 | 형태를 바꿔 반영: 목록 제외가 아니라 `scoring` 게이트에서 타깃 243 제외 (`:495`, 260915) |
| A-3 `:664` `if (!scoring)` 주석 | 여전히 주석 → 아래 3-1 결함의 원인 |
| C-1 `scoring`에서 `!moveNeeded` 제거 | 미반영 |
| C-3 `distance >= Dodge.Range` 게이트 제거 | 미반영 |
| F절 `me` 원점 회피 링 / 링 1개 모델 | 미반영. G절 미결 7건 그대로 |
| D-4 텔레 접근 후보 0 → 폴백 없음 | 그대로 |

## 3. 신규 발견 결함 (이전 문서에 없음)

### 3-1. 텔레 캐릭 회피 실패 → 멀쩡한 타깃을 스킵 [심각]
`setPosition`에서 `useTele && scoring`이고 `slotTele`를 못 찾으면 `:665 return false`.
4차 2-6의 반환 계약은 "회피 실패 → `true`(제자리 시전)"이다.
현행은 `doCast`가 `return 0`을 반환한다. 그러면 `clear`에서 `retry++`와 `Packet.flash`(300ms+)가 일어나고,
5회 실패하면 **사거리 안에서 공격할 수 있는 타깃이 shift**된다.
포위될수록(후보 전멸) 공격을 멈추는 역효과가 난다.
13링 후보(`i >= teleCount`)는 순회하면서 `slotWalk` / `slotRev`를 채우지만 사용되지 않는다.
`Config.Dodge.Enabled`가 true인 빌드에서만 발생한다.
최소 수정: `:664-666`을 `return !moveNeeded;`로 바꾼다.
5차 G-3("텔레 캐릭이 걷는 것을 허용하는가")과는 별개 문제다.

### 3-2. `clear(bossId)` 성공 반환이 보스 처치를 보장하지 않음 [심각]
`kill`이 사라져 bossId 경로가 봉인 보스, Countess, Rakanishu, Smith, Bone Ash, Treehead의 주 경로가 됐다
(`AutoSmurf.js:2239, 2306, 2435, 2581, 2895, 4772, 4816, 4860, 6087`).
보스는 아래 경로로 조용히 빠지고, 그래도 `return true`가 반환된다.
- HP skip (보스 제외 조건 주석)
- `skipCheck`
- Angle / Detour Skip
- 공유 retry

보스 생존 여부를 검증하지 않는다.

### 3-3. 보스 유닛 무효화 시 사거리 필터 소멸
`:120-123` `orgx = boss.x`. 유닛이 무효화되면 `undefined`가 되고, `getDistance`가 `NaN`이 된다.
`NaN > range`는 false이므로 맵 전체 목록을 추격한다.

### 3-4. retry 카운터 공유
`retry`가 대상별이 아니다. 실패 후 `needSort`로 재정렬되어 다른 대상이 [0]에 오면
누적된 retry 때문에 1회 실패로 shift될 수 있다. `clear` / `clearList` 공통.

### 3-5. 기타
- `clear` 999회 도달: 보스가 없으면 조용히 `true`, `clearList`는 throw. 불일치.
- `while (!me.gameReady)`에 타임아웃이 없다.
- `bossId > 999`로 gid와 classid를 구분한다. 문자열 이름은 `NaN` 비교로 우연히 정상 동작한다.
- `skipCheck`가 몬스터마다 `SkipEnchant` 문자열을 재파싱한다. 현재 Config가 빈 배열이라 무영향.
- `:229-233` HP skip 로그 if/else가 죽은 코드다.
- `dodge()`의 `unit` 인자는 사장됐다 (5차 D-2, 호출부 0이라 무영향).
- `pickItems`는 `me` 기준, `openChests`는 `orgx/orgy` 기준이다.

## 4. 유효하게 유지되는 이전 문서 사실
- 4차 제7부 7-1 엔진/API 사실 (`walkTo` / `moveTo` / `teleportTo` / `checkSpot` / `CollMap`). 단 `maxTeleDistance`는 45
- 5차 D-3 (접근 모드 ±90 제한), D-7 (`maxTeleDistance` 배제 필요), D-8 (dodge / GIP 비대칭)
- 5차 H절 확인 항목 전부
- 4차 9-1 / 9-2 별건 목록 (트랩 T1/T2, WW `0x1`, Paladin 101 이중 호출, `RushThread.js:824`)

## 5. 수정 우선순위 제안 (미착수)
1. 3-1: `setPosition :665` → `return !moveNeeded`
2. 3-2: 루프 뒤 `boss && Attack.checkMonster(boss)`면 false 또는 throw. HP skip과 retry-shift에서 보스(`spectype & 0x7` 또는 boss gid) 제외
3. 3-3: 보스 무효화 시 마지막 좌표 유지
4. 3-4: retry를 gid별로 관리
5. `openChest` 기본값을 `!!Config.OpenChests`로 변경할지 사용자 결정 필요 (이전 문서상 "의도적 유지")
6. 5차 G절 미결 7건
