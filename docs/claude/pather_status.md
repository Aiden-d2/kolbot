# Pather 현황 (260930 정적 분석)

기준: main `ee7d5c0`. 게임 확인 없이 코드만 읽은 결과다. **코드는 고치지 않았다.** 항목별 수정은 사용자 결정 뒤에 한다.

## 1. SafeTele(`safeCheckNode`)와 setPosition 대조

| 항목 | SafeTele (`Pather.moveTo` 안) | setPosition | 판단 |
|---|---|---|---|
| 몹 수 | `Attack.getMonsterCount`, `SafeTele.Range` 10 **미만** | 같은 함수, R = min(사거리, `Dodge.Range` 10) 미만 | 같음 (260930 통일) |
| 불장판 | 몹 수 +100 (반경 4 이하) | 회피: +100 같음 / 접근: `checkFire` 반경 4 이하 제외 | 같음 |
| 착지 | `checkSpot(0x1)` | 텔레 `checkSpot(0x1)`, 걷기 `getCollision & 0x1` | 텔레는 같음 |
| 발동 | 목표 노드 몹 수 < `SafeTele.Count`(1)면 그대로 | 내 자리 몹 수 0이면 그대로 (Dodge.Count 삭제) | Count 1이면 동작 같음. `SafeTele.Count` 키만 남음 |
| 후보 링 | 나 중심, 35→15(5 간격), 노드 방향 ±60°, 호 간격 5 | 대상 중심, 링 간격 5, 앞쪽 반 → 뒤쪽 반, 호 간격 5 | 목적이 달라 다름 |
| 고르기 | 모든 후보 중 **최소** (0이면 즉시) | 순서상 **처음으로** 기준보다 1 이상 적은 자리 | 다름. setPosition은 260927 "순서가 자리를 정한다" 결정 |
| 되풀이 방지 | `excludedNodes` 최근 5개 자리(5칸 이내) 제외 | 없음 | 차용 후보 (아래 2-1) |
| 나→후보 시야 | 검사 없음 (벽 너머 착지 가능) | 텔레 접근 SWEEP만 0x4 | 회피·SafeTele는 둘 다 검사 없음 |
| 텔레 거리 | 링 최대 `teleDistance` 35 | 35 이하 teleportTo, 초과 moveTo | 같음. 단 7개 지역의 30은 둘 다 모름 (3-1) |
| 실패 | teleportTo 실패 → 원래 노드로 계속 | 회피 실패 → 제자리 공격, 접근 실패 → `moveFailed` | 문제 없음 |

## 2. 제안 (결정 대기)
1. **회피 되풀이 방지**: SafeTele의 `excludedNodes`처럼 최근 회피 착지점 몇 개를 기억해 5칸 이내 후보를 뺀다. handoff 3절 10번(FONV·D.FGOM 진동)이 게임에서 확인될 때만 검토. 없으면 넣지 않는다.
2. **`SafeTele.Count` 삭제**: `Dodge.Count`를 지운 것과 맞춘다. Count 1에서는 `baseline < 1`과 `baseline === 0`이 같아 동작 변화 없음.
3. **지역별 텔레 간격 한 곳으로**: 3-1 참고.

## 3. Pather 결함·정리 후보

### 3-1. 7개 지역(62·63·64·88·89·91·74)의 텔레 간격 30이 일부 경로에만 적용
- 첫 `getPath`(`Pather.js:265`)만 30이다. SafeTele 뒤 재계산(`:339`)은 `teleDistance` 35, 실패 재계산(`:417`)은 `rand(25, 35)`.
- SafeTele 후보 링도 35부터다. `SafeTele.Skip`에 62·63·64는 있지만 88·89·91(Flayer Dungeon)·74(Arcane)는 없어 SafeTele가 돈다.
- 같은 지역 목록이 `:265`와 `:361`(getNearestWalkable 보정)에 두 번 쓰여 있다. SafeTele 착지점은 이 보정을 거치지 않는다.
- 영향(추정): 해당 지역에서 SafeTele가 한 번 발동하면 나머지 경로가 35 간격이 된다. 30으로 줄인 이유(260716·260823·260921 표기)가 텔레 실패였다면 그 효과가 줄어든다. trace로 확인할 방법: 이 지역의 `[teleportTo failed]`.

### 3-2. 반환값 `"killMonsters"`가 참으로 읽힘
- `killMonsters`는 `Attack.clear(25)`가 false면 문자열 `"killMonsters"`를 돌려주고 moveTo도 그대로 돌려준다(`:380`). 문자열이라 `if (!moveTo(...))`는 성공으로 읽는다.
- `moveToExit`(`:792`)가 이 형태라, 이동이 중단돼도 출구 사용(`useUnit`/방 이동)으로 넘어간다.
- clear가 false인 경우는 사망·카우킹(39)·스킬 미습득 정지뿐이라 실제 영향은 작다(카우 레벨에서 moveToExit를 쓰지 않는 한).

### 3-3. 죽은 코드 (260929 주석 정리의 잔여)
- `moveTo` 실패 분기 `if (!cleared) { cleared = true; }`(`:406`): 안에 있던 `//Attack.clear(5)`가 정리 때 지워져 빈 블록이 됐다(`fcd2713:libs/Pather.js:407`). `cleared` 변수와 "Don't go berserk" 주석도 함께 의미 없음.
- `NodeAction.go`의 `/* if (me.area !== 39 && arg.prevNode ...) */`(`:13`, 260903): 주석 처리된 옛 코드가 남아 있다. 이것만 `prevNode`를 읽으므로 `moveTo`의 `prevNode` 갱신(`:383`)과 인자 전달도 쓰이지 않는다. 사용자가 일부러 둔 "꺼 둔 규칙"인지 확인 필요.
- `PathDebug.coordsInPath`: 호출 0곳. (`drawPath`/`removeHooks`는 `enableHooks: false` 디버그 스위치라 유지 대상)
- `teleportTo`의 `MainLoop:` 레이블: 쓰는 곳 없음.
- `goWP`의 `j`, `wp`, `getWP`의 `j`, `wp`: 선언만 있음.
- `moveTo` 좌표 없음 분기의 `Misc.errorReport(... //260922 temp)`: 바로 뒤 throw가 Loader에서 다시 보고될 수 있음(중복 여부는 호출 경로에 따라 다름).

### 3-4. 예외·방어
- `journeyTo`(`:1626`): `plotCourse`가 false를 돌려주면 `target.course`에서 TypeError. AutoSmurf `:1068`도 같은 형태.
- `journeyTo` Arcane→Canyon: `getUnit(2, 357)`이 null이어도 `Misc.click(0, 0, unit)`. 저널 대사 뒤 `me.cancel()`(handoff 7절 유형 B와 같은 패턴).
- `moveTo` 도중 `getPath` 실패는 throw다(SafeTele 재계산 포함). handoff 4절 9번(while + catch 무한 루프)의 원천.

### 3-5. 원본(kolbot)과 같은 동작, 알고만 둘 것
- `checkSpot(x, y, coll, _, size=1)`은 `|dx| !== |dy|` 조건 때문에 **상하좌우 4칸만** 보고 가운데 칸은 안 본다. `getNearestWalkable`은 시작 좌표도 이 검사로 통과시킨다. 텔레 착지(SafeTele·setPosition 공통)도 마찬가지.
- "설 수 있는 칸" 검사가 네 가지다: `checkSpot(0x1)`(텔레), `getCollision & 0x1`(setPosition 걷기), `Attack.validSpot`(0x1 | 0x400, 해머·walkTo 옆걸음), `getNearestWalkable(…, 0x1|0x4|0x800|0x1000)`(7개 지역 노드 보정).
- `getNearestWalkable`은 끝에서 `CollMap.reset()`을 한다(캐시 비움, 7개 지역에서는 노드마다).
- `moveTo`의 반환은 마지막으로 처리한 노드와의 거리(≤5)다. `pop`이면 목적지 한 노드 앞 기준.
- `moveToUnit`은 PresetUnit이면 `pop`을 넘기지 않는다.
- `plotCourse`의 `visitedNodes.indexOf(prevArea)`는 키가 아니라 값을 찾는다(바로 위의 `=== undefined` 검사가 실제로 막음).

### 3-6. 확인 필요 (사용자 코드)
- `useWaypoint`(`:1083`, 260914 사용자 업로드): 루트 골레인(40)에서 Warriv가 50 안에 있으면 목적지와 상관없이 1막으로 먼저 간다. 2막 WP로 가는 호출도 1막을 거친다. 의도(2막 WP 문제 회피 등)인지 확인 필요.

## 4. 최근 변경 상태 (260930까지)
- `teleportTo`: `me.attacking` 기준 대기, 회차당 최대 2초 × 10회, maxTeleDistance(45) 검사 삭제.
- `moveTo`: 텔레 경로가 마을로 들어가면 걷기로 전환.
- `useUnit`/`usePortal`/`makePortal`: max(1000, ping×2+300) 대기 + 로딩 중 대기. 빨간 포털 1500ms, `//260926 temp` trace 남아 있음(사용자 코드, handoff 4절 2번).
- `NodeAction`: killMonsters(108은 20, 그 외 25) → popChests(15) → getShrines → useWells 순서. SafeTele로 옮겨 간 노드에서는 `continue`라 NodeAction이 돌지 않는다(다음 노드에서 clear).
