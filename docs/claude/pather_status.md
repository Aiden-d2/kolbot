# Pather 현황 (260930 정적 분석)

기준: main `ee7d5c0`. 게임 확인 없이 코드만 읽은 결과다. **코드는 고치지 않았다.** 항목별 수정은 사용자 결정 뒤에 한다.

## 1. SafeTele(`safeCheckNode`)와 setPosition 대조

| 항목 | SafeTele (`Pather.moveTo` 안) | setPosition | 판단 |
|---|---|---|---|
| 몹 수 | `Attack.getMonsterCount`, `SafeTele.Range` 10 **미만** | 같은 함수, R = min(사거리, `Dodge.Range` 10) 미만 | 같음 (260930 통일) |
| 불장판 | 몹 수 +100 (반경 4 이하) | 회피: +100 같음 / 접근: `checkFire` 반경 4 이하 제외 | 같음 |
| 착지 | `checkSpot(0x1)` | 텔레 `checkSpot(0x1)`, 걷기 `getCollision & 0x1` | 텔레는 같음 |
| 발동 | 목표 노드 몹 수 < `SafeTele.Count`(1)면 그대로 | 내 자리 몹 수 0이면 그대로 (Dodge.Count 삭제) | Count 1이면 동작 같음 |
| 후보 링 | 나 중심, 35→15(5 간격), 노드 방향 ±60°, 호 간격 5 | 대상 중심, 링 간격 5, 앞쪽 반 → 뒤쪽 반, 호 간격 5 | 목적이 달라 다름 |
| 고르기 | 모든 후보 중 **최소** (0이면 즉시) | 순서상 **처음으로** 기준보다 1 이상 적은 자리 | 4절 참고 |
| 되풀이 방지 | `excludedNodes` 최근 5개 자리(5칸 이내) 제외 | 없음 | setPosition 차용 안 함 (260930 사용자) |
| 나→후보 시야 | 검사 없음 (벽 너머 착지 가능) | 텔레 접근 SWEEP만 0x4 | SafeTele 차용 후보 (2절) |
| 텔레 거리 | 링 최대 `teleDistance` 35 | 35 이하 teleportTo, 초과 moveTo | 7개 지역의 30은 둘 다 모름 (3-1) |
| 실패 | teleportTo 실패 → 원래 노드로 계속 | 회피 실패 → 제자리 공격, 접근 실패 → `moveFailed` | 문제 없음 |
| clearPath | 보지 않음. clearPath true인 텔레 이동에서도 돈다. 옮긴 노드는 `continue`라 NodeAction(clear·상자) 없음 | – | 사실 기록. 결함 아님 |

## 2. SafeTele가 setPosition에서 가져올 것 (260930 검토)
setPosition에만 있는 검사: 타깃 시야(`coll`), 박스 울타리, SWEEP 접근의 나→후보 0x4 시야, 걷기 직선(0x5)·우회.
- 타깃 시야·박스·걷기 검사: SafeTele에는 해당 없음.
- **나→후보 0x4 시야**: 유일한 후보. SafeTele는 벽 너머 자리에도 착지할 수 있고, 착지 뒤 `getPath`를 다시 계산하므로 벽 너머면 경로가 길어질 수 있다(추정, trace 근거 없음). 넣으면 `CollMap.checkColl(me, 후보, 0x4)` 한 줄. 텔레 자체는 시야가 필요 없으므로 이 검사는 "경로에서 벗어난 자리로 뛰지 않기" 용도다. 사용자 결정 대기.

## 3. 결정·제안 현황
| # | 항목 | 상태 |
|---|---|---|
| 1 | setPosition 자리 기억(`excludedNodes`) | **탈락** (260930 사용자: 질문 취지는 SafeTele가 가져올 것) |
| 2 | `SafeTele.Count` 삭제 | 사용자 동의(260930), 수정 요청 대기. `Config.js:80`, `Pather.js:166` 두 곳. 동작 변화 없음 |
| 3 | 지역별 텔레 간격 한 곳에서 관리 (= 3-1 결함 수정) | 설계 3-1, 수정 요청 대기 |
| 4 | `"killMonsters"` 반환 | **유지** (260930 사용자: false 대응은 카우뿐) |
| 5 | `journeyTo` 방어 | 제안 3-4, 수정 요청 대기 |
| 6 | 죽은 코드 삭제(`cleared`, `MainLoop:`, `j`/`wp`) | 동작 무관 확인, 수정 요청 대기 |
| 7 | Warriv 1막 경유 | **의도** (260930 사용자: 2막 시작점에서 WP가 멀어 1막 WP가 빠름) |

## 3-1. 7개 지역(62·63·64·88·89·91·74)의 텔레 간격 30이 첫 경로에만 적용
**현재**
| 자리 | 줄 | 텔레 간격 |
|---|---|---|
| 첫 경로 `getPath` | `Pather.js:265` | 7개 지역 30, 그 외 35 |
| SafeTele 후보 링 시작 | `:172` | 35 |
| SafeTele 뒤 재계산 | `:339` | 35 |
| 이동 실패 뒤 재계산 | `:417` | `rand(25, 35)` |
| setPosition 한 번 텔레 한계 | `Attack.js:674` | 35 |
| 노드 보정 `getNearestWalkable(…, 0x1\|0x4\|0x800\|0x1000)` | `:361` | (같은 지역 목록을 다시 적음. 걷기·텔레 공통) |

`SafeTele.Skip`에 62·63·64는 있어 SafeTele가 안 돈다. 88·89·91(Flayer Dungeon 1~3), 74(Arcane)는 SafeTele가 돌고, 한 번 발동하면 나머지 경로가 35 간격이 된다. 이동 실패 뒤에는 7개 지역 모두 25~35 간격이 된다.

**제안 (한 곳에서 관리)**
```js
teleDistance: 35,
narrowAreas: [62, 63, 64, 88, 89, 91, 74],	// 텔레 간격 30 + 노드 보정 지역

getTeleDistance: function () {
	return this.narrowAreas.indexOf(me.area) > -1 ? 30 : this.teleDistance;
},
```
| 자리 | 바꾼 뒤 | 동작 변화 |
|---|---|---|
| `:265` | `this.getTeleDistance()` | 없음 |
| `:361` | `this.narrowAreas.indexOf(me.area) > -1` | 없음 |
| `:339` | `this.getTeleDistance()` | 88·89·91·74에서 SafeTele 뒤에도 30 |
| `:417` | `rand(25, this.getTeleDistance())` | 7개 지역에서 실패 재계산 25~30 |
| `:172` | `Pather.getTeleDistance()` | 88·89·91·74에서 SafeTele 후보가 30 이내 |
| `Attack.js:674` | `Pather.getTeleDistance()` (선택) | 7개 지역에서 31~35 떨어진 회피·접근 자리는 moveTo(텔레 여러 번). 30으로 줄인 이유가 "긴 텔레가 실패한다"면 같이 바꾸고, 경로 노드 문제였다면 그대로 둔다 — 이유는 코드에 없음(260716·260823·260921 표기만) |

## 3-2. 반환값 `"killMonsters"` (유지)
문자열이라 `if (!moveTo(...))`는 성공으로 읽는다(`moveToExit` `:792`). clear가 false인 경우는 사망·카우킹·스킬 미습득 정지뿐이고, false에 대응하는 호출부는 카우 레벨뿐이라 유지한다(사용자 260930).

## 3-3. 죽은 코드
| 대상 | 줄 | 삭제 영향 |
|---|---|---|
| `if (!cleared) { cleared = true; }`, `cleared` 선언, "Don't go berserk" 주석 | `:406`, `:227` | 없음. 안의 `//Attack.clear(5)`가 260929 정리 때 지워져 빈 블록(`fcd2713:libs/Pather.js:407`) |
| `teleportTo`의 `MainLoop:` 레이블 | `:464` | 없음. `break MainLoop`/`continue MainLoop`가 없다. 원본 kolbot에서 남은 것 |
| `goWP`·`getWP`의 `j`, `wp` 선언 | `:1560`, `:1604` | 없음. 선언 줄 외 사용 0 |
| `NodeAction.go`의 `/* ... arg.prevNode ... */`(260903)와 `prevNode` 갱신·전달 | `:13`, `:383`, `:377` | 사용자가 꺼 둔 규칙인지 확인 필요 |
| `PathDebug.coordsInPath` | `:121` | 없음. 호출 0곳 |
| `moveTo` 좌표 없음 분기의 `Misc.errorReport(... //260922 temp)` | `:238` | temp 표시. 뒤 throw가 Loader에서 다시 보고될 수 있음 |

**PathDebug**: `moveTo`가 계산한 경로를 게임 화면에 선(D2BS `Line` 훅, 색 0x84)으로 그리는 디버그 도구. `enableHooks: true`일 때만 그리고, `moveTo` 끝에서 `removeHooks`로 지운다. 켜는 곳이 없어 지금은 `drawPath`가 바로 return한다. `coordsInPath(path, x, y)`는 좌표가 경로 노드 5칸 안인지 보는 보조 함수로 호출 0곳.

## 3-4. journeyTo 방어 (제안)
- `plotCourse`가 false면 `target.course`에서 TypeError(`:1631`). 원본 kolbot도 같다. `plotCourse`가 false가 되는 경우는 출발 지역을 못 찾을 때뿐이다(로딩 중 `me.area` undefined, 표에 없는 지역).
- 제안: 동작(예외로 끝남)은 그대로 두고 이유가 보이게 한다.
  ```js
  target = this.plotCourse(area, me.area);

  if (!target) {
  	throw new Error("journeyTo: no course " + me.area + " -> " + area);
  }
  ```
  `return false`로 바꾸면 호출부(`goWP`, `getWP`, `Misc.openChestsInArea`, AutoSmurf `clickWP`)가 다른 지역에서 이어서 움직이므로 권하지 않는다.
- AutoSmurf `:1068`(`plotCourse` 직접 호출)도 같은 형태. 같은 방식으로 throw하면 동작 같음.
- Arcane→Canyon(`:1709`): `getUnit(2, 357)`이 null이면 `Misc.click(0, 0, null)`. `if (!unit) break;` 같은 가드 후보.

## 3-5. 설 수 있는 칸 검사

**자료원 두 가지 (D2BS 소스 확인)**
| 자료원 | 쓰는 함수 | 값 | 모르는 칸 |
|---|---|---|---|
| `getCollision(area, x, y)` (D2BS `ActMap::GetMapData`) | `Attack.validSpot`, setPosition 걷기, `CollMap.getRandCoordinate`, AutoSmurf 카우 방 | 방 충돌 값 + **74·111·112·117 지역은 회피 레이어(avoid) OR** (`ActMap.cpp:182`) | 0xFFFF (모든 비트) |
| `CollMap.getColl` (`room.getCollision()` 캐시) | `Pather.checkSpot`, `getNearestWalkable`, `CollMap.checkColl` | 방 충돌 값 그대로 (회피 레이어 없음) | 5 (0x1 \| 0x4) |

**플래그 (D2BS `ActMap.h`)**: 0x1 BlockWalk, 0x2 BlockLineOfSight, 0x4 Wall, 0x8 BlockPlayer, 0x400 Object, 0x800 ClosedDoor, 0x1000 NPCCollision, 0x8000 DeadBody(포털 포함). kolbot은 0x4를 "시야·원거리 막힘"으로 쓴다.

**칸(점) 검사**
| 검사 | 보는 칸 | 플래그 | 자료원 | 쓰는 곳 |
|---|---|---|---|---|
| `Pather.checkSpot(x, y, 0x1)` | 상하좌우 4칸 (가운데 **안 봄**) | 0x1 | CollMap | SafeTele 후보, setPosition 텔레 착지 |
| `getNearestWalkable(x, y, r, step)` | 시작점부터 바깥 사각 테두리로 넓히며 `checkSpot` | 기본 0x1 | CollMap (끝에 `CollMap.reset()`) | `moveToExit` 출구 자리, `getNearestRoom`, AutoSmurf 카우 방 |
| `getNearestWalkable(…, 10, 2, 0x1\|0x4\|0x800\|0x1000)` | 같음 | 벽·시야·닫힌 문·NPC 자리 | CollMap | 7개 지역 경로 노드 보정 (`:362`) |
| `getCollision & 0x1` | 가운데 1칸 | 0x1 | getCollision | setPosition 걷기 착지 |
| `Attack.validSpot(x, y)` | 가운데 1칸 | 0x1 \| 0x400 (object) | getCollision | 해머 자리(`Paladin.js:263`), `walkTo` 옆걸음(`:591`), `Misc.js:2924`, 시체 폭발 등 대상 칸 검사(직업 파일 대부분은 **몹이 선 칸**을 검사) |
| `getRandCoordinate` | 가운데 1칸 | 0x1 | getCollision | `useUnit`·`openUnit`·`useWaypoint` 재시도 이동 |

**선(직선) 검사** (참고)
| 검사 | 방식 | 쓰는 곳 |
|---|---|---|
| `CollMap.checkColl(a, b, coll)` | a→b 직선의 각 점마다 3×3 (두께 1) | setPosition(타깃 시야, 나→후보 0x4/0x5), `Misc.openChests` 0x5, 해머 0x4(두께 0) |
| 엔진 `checkCollision(a, b, coll)` | D2BS 내부 | setPosition 이동 필요 판정, `useWells` 0x4, Assassin |

**차이에서 생길 수 있는 것 (추정)**
- 74(Arcane)에서 텔레 착지(`checkSpot`)는 회피 레이어를 모르고, 걷기 착지(`getCollision`)는 안다. 같은 자리가 텔레로는 통과, 걷기로는 막힘일 수 있다.
- `checkSpot`은 가운데 칸을 안 봐서 1칸짜리 기둥 위를 통과시킬 수 있다(원본 kolbot 동작).

## 4. setPosition "가장 적은 자리" 논의 (260930)
- **회피는 지금 가장 적은 곳을 찾지 않는다.** 정해진 순서(곧게 물러나기 → 좌우)대로 보다가 기준(내 자리 몹 수)보다 1 이상 적은 **첫** 자리를 고른다(`Attack.js:648`).
- **회피→회피 반복**: 기준 3, 채택 자리 2면 다음 틱도 2 > 0이라 다시 회피한다. 최소를 고르면(가능하면 0) 다음 틱 회피 발동이 줄어든다. 몹이 따라오면 결국 다시 발동하므로 없애지는 못하고 간격을 늘린다.
- **접근→회피 반복**: 접근은 몹 수를 안 센다(260930). 최소 고르기를 회피에 넣어도 이 반복은 안 줄어든다. 줄이려면 접근도 몹 수를 세야 하는데, `attack_design.md` 12-2 기각 "접근 시 위협 최소 자리 우선(접근은 짧게, 안전은 다음 틱 회피)"과 부딪힌다.
- **회피→접근 반복**: 회피 후보는 대상 시야(`coll`)와 사거리 안(R ≤ 사거리) 조건을 통과한 자리라, 대상이 움직이지 않으면 다음 틱 접근이 필요 없다.
- **과거 기각과의 관계**: 12-2 "회피 '몹 없는 자리(0) 무조건 우선' — 순서와 무관하게 먼 자리를 뽑아 몹을 관통". 지금은 회피 링이 하나(260930)라 "먼 링" 문제는 없어졌지만, 같은 링의 옆(90° 가까운) 자리를 고를 수 있다. 나중 기각 "회피 경로상 몹 관통 검사: 불필요(사용자)"와 함께 보면 판단은 사용자 몫.
- **변형안**: 구역(정면 → 후면) 순서는 두고, 정면 안에서 통과한 후보 중 몹 수 최소(동점은 지금 순서). 정면에 기준보다 적은 자리가 없을 때만 후면. 비용은 정면 후보 전부의 `getMonsterCount`(링 R 10이면 정면 약 7개).

## 5. 최근 변경 상태 (260930까지)
- `teleportTo`: `me.attacking` 기준 대기, 회차당 최대 2초 × 10회, maxTeleDistance(45) 검사 삭제.
- `moveTo`: 텔레 경로가 마을로 들어가면 걷기로 전환.
- `useUnit`/`usePortal`/`makePortal`: max(1000, ping×2+300) 대기 + 로딩 중 대기. 빨간 포털 1500ms, `//260926 temp` trace 남아 있음(사용자 코드, handoff 4절 2번).
- `NodeAction`: killMonsters(108은 20, 그 외 25) → popChests(15) → getShrines → useWells 순서.
- `useWaypoint`: 루트 골레인(40)에서 Warriv가 50 안이면 1막 경유 — 의도(2막 시작점에서 WP가 멂).
- 원본 kolbot과 같은 동작: `moveTo` 반환은 마지막 처리 노드와의 거리 ≤5, `moveToUnit`은 PresetUnit이면 `pop`을 안 넘김, `plotCourse`의 `visitedNodes.indexOf`는 키가 아닌 값을 찾음(트리 구조라 실제 문제 없음).
