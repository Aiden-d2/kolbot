# Pather 현황 (260930 정적 분석)

기준: main `ee7d5c0` (줄 번호도 이 기준). 게임 확인 없이 코드만 읽은 결과다. 261001 사용자 결정으로 3절의 2·3·8번을 작업 브랜치에 반영했다. 나머지는 기록만.

## 1. SafeTele(`safeCheckNode`)와 setPosition 대조

| 항목 | SafeTele (`Pather.moveTo` 안) | setPosition | 판단 |
|---|---|---|---|
| 몹 수 | `Attack.getMonsterCount`, `SafeTele.Range` 10 **미만** | 같은 함수, R = min(사거리, `Dodge.Range` 10) 미만 | 같음 (260930 통일) |
| 불장판 | 몹 수 +100 (반경 4 이하) | 회피: +100 같음 / 접근: `checkFire` 반경 4 이하 제외 | 같음 |
| 착지 | `checkSpot(0x1)` | 텔레 `checkSpot(0x1)`, 걷기 `getCollision & 0x1` | 텔레는 같음 |
| 발동 | 목표 노드 몹 수 0이면 그대로 (261001 `SafeTele.Count` 삭제) | 내 자리 몹 수 0이면 그대로 (Dodge.Count 삭제) | 같음 |
| 후보 링 | 나 중심, 35→15(5 간격), 노드 방향 ±60°, 호 간격 5 | 대상 중심, 링 간격 5, 앞쪽 반 → 뒤쪽 반, 호 간격 5 | 목적이 달라 다름 |
| 고르기 | 모든 후보 중 **최소** (0이면 즉시) | 회피: 구역(물러나기 → 반대편) 안 **최소** (261001). 접근: 순서상 첫 자리 | 회피는 같아짐 |
| 되풀이 방지 | `excludedNodes` 최근 5개 자리(5칸 이내) 제외 | 없음 | setPosition 차용 안 함 (260930 사용자) |
| 나→후보 시야 | 검사 없음 (벽 너머 착지 가능) | 텔레 접근 SWEEP만 0x4 | SafeTele 차용 **기각** (261001) |
| 텔레 거리 | 링 최대 `getTeleDistance()` (7개 지역 30, 261001) | 35 이하 teleportTo, 초과 moveTo (사용자: 35 그대로) | 3-1 |
| 실패 | teleportTo 실패 → 원래 노드로 계속 | 회피 실패 → 제자리 공격, 접근 실패 → `moveFailed` | 문제 없음 |
| clearPath | 보지 않음. clearPath true인 텔레 이동에서도 돈다. 옮긴 노드는 `continue`라 NodeAction(clear·상자) 없음 | – | clearPath true면 끄기: 사용자 제안, 결정 대기 (3-6) |

## 2. SafeTele가 setPosition에서 가져올 것 (260930 검토)
setPosition에만 있는 검사: 타깃 시야(`coll`), 박스 울타리, SWEEP 접근의 나→후보 0x4 시야, 걷기 직선(0x5)·우회.
- 타깃 시야·박스·걷기 검사: SafeTele에는 해당 없음.
- **나→후보 0x4 시야**: 유일한 후보였으나 **기각** (261001 사용자: 0x4는 SafeTele와 연관 없음).

## 3. 결정·제안 현황
| # | 항목 | 상태 |
|---|---|---|
| 1 | setPosition 자리 기억(`excludedNodes`) | **탈락** (260930 사용자: 질문 취지는 SafeTele가 가져올 것) |
| 2 | `SafeTele.Count` 삭제, 몹 1마리부터 발동 | **반영 (261001)**. 동작 변화 없음 |
| 3 | 지역별 텔레 간격 한 곳에서 관리 (= 3-1 결함 수정) | **반영 (261001)**. setPosition(`Attack.js:674`)은 35 그대로 (사용자) |
| 4 | `"killMonsters"` 반환 | **유지** (260930 사용자: false 대응은 카우뿐) |
| 5 | `journeyTo` 방어 | 제안 3-4, 결정 대기 |
| 6 | 죽은 코드 삭제(`cleared`, `MainLoop:`, `j`/`wp`) | **기록만, 보류** (261001). PathDebug는 사용자가 더 알아본 뒤 결정 |
| 7 | Warriv 1막 경유 | **의도** (260930 사용자: 2막 시작점에서 WP가 멀어 1막 WP가 빠름) |
| 8 | setPosition 회피 최소 자리 | **반영 (261001)**. 4절 |
| 9 | SafeTele: clearPath true면 끄기 | 사용자 제안, 결정 대기 (3-6) |

## 3-1. 7개 지역(62·63·64·88·89·91·74)의 텔레 간격 30이 첫 경로에만 적용 → 261001 반영
**반영 전**
| 자리 | 줄 | 텔레 간격 |
|---|---|---|
| 첫 경로 `getPath` | `Pather.js:265` | 7개 지역 30, 그 외 35 |
| SafeTele 후보 링 시작 | `:172` | 35 |
| SafeTele 뒤 재계산 | `:339` | 35 |
| 이동 실패 뒤 재계산 | `:417` | `rand(25, 35)` |
| setPosition 한 번 텔레 한계 | `Attack.js:674` | 35 |
| 노드 보정 `getNearestWalkable(…, 0x1\|0x4\|0x800\|0x1000)` | `:361` | (같은 지역 목록을 다시 적음. 걷기·텔레 공통) |

`SafeTele.Skip`에 62·63·64는 있어 SafeTele가 안 돈다. 88·89·91(Flayer Dungeon 1~3), 74(Arcane)는 SafeTele가 돌고, 한 번 발동하면 나머지 경로가 35 간격이 된다. 이동 실패 뒤에는 7개 지역 모두 25~35 간격이 된다.

**반영 (261001, 한 곳에서 관리)**
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
| `Attack.js:674` | **그대로 35** (261001 사용자) | 없음 |

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

**PathDebug** (D2BS 소스 `JSScreenHook.cpp` `line_ctor`, `ScreenHook.cpp` 확인)
- `drawPath(path)`: 경로 노드를 이은 선을 `new Line(x1, y1, x2, y2, 0x84, true)`로 만든다. 여섯째 인자 true = 자동지도(automap) 좌표. D2BS는 automap 훅을 **자동지도가 켜져 있을 때만**(`*p_D2CLIENT_AutomapOn`, Tab 지도) 그린다. 게임 화면(월드)에는 안 그린다. MapThread의 몹 표시·방향선과 같은 방식.
- 선은 `moveTo`가 도는 동안만 남는다. `drawPath`는 먼저 이전 선을 지우고(`removeHooks`), `moveTo` 끝에서 지운다. 경로를 다시 계산할 때마다 새로 그린다.
- 안쪽 moveTo(setPosition 우회 등)가 돌면 바깥 경로 선이 지워지고 안쪽 경로로 바뀐다. `"killMonsters"`·사망 return, throw로 끝나면 선이 남았다가 다음 moveTo나 스크립트 종료 때 사라진다(표시 문제뿐).
- 켜려면 `PathDebug.enableHooks = true` 한 줄. 지금 켜는 곳 없음. 꺼져 있을 때 비용은 `drawPath` 첫 줄 return뿐.
- 게임에서 실제로 보이는지는 확인하지 않았다(코드상 동작).
- `coordsInPath(path, x, y)`: 좌표가 경로 노드 5칸 안인지 보는 보조 함수. 호출 0곳(원본 kolbot에도 있음).

## 3-4. journeyTo 방어 (제안)
- `plotCourse`가 false면 `target.course`에서 TypeError(`:1631`). **지금 코드가 원본 kolbot과 같다**(원본도 검사 없음). 아래 제안은 원본과 달라지는 수정이다. `plotCourse`가 false가 되는 경우는 출발 지역을 못 찾을 때뿐이다(로딩 중 `me.area` undefined, 표에 없는 지역).
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
| `Attack.validSpot(x, y)` | 가운데 1칸 | 0x1 \| 0x400 (object) | getCollision | 해머 자리(`Paladin.js:263`), `walkTo` 옆걸음(`:591`, 3-5 끝 설명), `Misc.js:2924`, 시체 폭발 등 대상 칸 검사(직업 파일 대부분은 **몹이 선 칸**을 검사) |
| `getRandCoordinate` | 가운데 1칸 | 0x1 | getCollision | `useUnit`·`openUnit`·`useWaypoint` 재시도 이동 |

**선(직선) 검사** (참고)
| 검사 | 방식 | 쓰는 곳 |
|---|---|---|
| `CollMap.checkColl(a, b, coll)` | a→b 직선의 각 점마다 3×3 (두께 1) | setPosition(타깃 시야, 나→후보 0x4/0x5), `Misc.openChests` 0x5, 해머 0x4(두께 0) |
| 엔진 `checkCollision(a, b, coll)` | D2BS 내부 | setPosition 이동 필요 판정, `useWells` 0x4, Assassin |

**엔진 `getCollision`과 `CollMap.getColl` 비교 (기능은 같다: 한 칸의 충돌 플래그를 돌려준다)**
| 항목 | 엔진 `getCollision` | `CollMap.getColl` |
|---|---|---|
| 읽는 곳 | D2BS `ActMap`이 지역(level)의 방을 찾아 그 방의 충돌 지도에서 읽음 | `getRoom(x, y).getCollision()`으로 방 충돌 지도를 JS 배열로 복사해 두고 읽음 |
| 갱신 | 부를 때마다 게임의 현재 값 | 복사해 둔 값(최대 25개 방). `CollMap.reset()`(방 25개 초과, `getNearestWalkable` 끝) 전까지 그대로 |
| 회피 레이어 | 74·111·112·117 지역은 더함 (Arcane, 바바리안 방책 지역) | 없음 |
| 모르는 칸 | 0xFFFF | 5 (0x1 \| 0x4) |
| 비용 | 호출마다 엔진 진입 + 정리(`CleanUp`) | 첫 방 복사 뒤에는 배열 조회 |
| 주 용도 | 한두 칸 검사(`validSpot`, setPosition 걷기, `getRandCoordinate`) | 여러 칸 검사(`checkSpot` 4칸, `getNearestWalkable` 탐색, `checkColl` 직선) |

- 겹침: 두 함수는 같은 질문에 답한다. 같은 칸을 두 함수로 검사하는 곳은 없고, 호출부마다 한쪽만 쓴다(원본 kolbot부터 그렇다).
- 복사본이라 생기는 차이(추정): 충돌 지도에는 움직이는 유닛·문 상태 비트(0x80 플레이어, 0x100/0x1000 NPC, 0x800 닫힌 문)도 들어 있다. CollMap은 복사 시점 값이라, 7개 지역 노드 보정(`0x800|0x1000` 검사)은 복사 뒤 움직인 몹·열린 문을 반영하지 못할 수 있다. 벽(0x1)·시야(0x4)는 변하지 않아 영향 없음.
- 74(Arcane)에서 텔레 착지(`checkSpot`, CollMap)는 회피 레이어를 모르고, 걷기 착지(`getCollision`)는 안다. 같은 자리가 텔레로는 통과, 걷기로는 막힘일 수 있다(추정).
- `checkSpot`은 가운데 칸을 안 봐서 1칸짜리 기둥 위를 통과시킬 수 있다(원본 kolbot 동작).

**walkTo 옆걸음** (`Pather.js` `walkTo`, `ModeLoop`)
- 목표를 클릭한 뒤 500ms 안에 걷기/달리기 동작(mode 2·3·6)이 시작되지 않으면 "막혔다"고 본다(3번이면 false).
- 목표→나 방향에 직각(±90°)으로 **내 자리에서 5칸** 떨어진 두 점을 차례로 보고, `validSpot`을 통과한 첫 점을 클릭해 최대 1초 옆으로 비켜선 뒤 목표를 다시 클릭한다. 몹·오브젝트에 몸이 걸렸을 때 빠져나오는 동작이다. 코드의 TODO는 "getNearestWalkable로 바꿀 수도"라는 원본 메모.

## 3-6. SafeTele와 clearPath (사용자 제안 260930, 결정 대기)
**clear 안의 이동 (확인)** — setPosition만이 아니다.
| 이동 | 줄 | 방식 | SafeTele |
|---|---|---|---|
| setPosition 텔레 35 이하 / 걷기 | `Attack.js:673`, `:675` | `teleportTo` / `walkTo` | 안 거침 |
| setPosition 텔레 35 초과, 걷기 우회 | `Attack.js:677`, `:704` | `moveTo(…, 1)` clearPath false | 중간 노드에 적용 (마지막 노드 제외) |
| 시야 잃은 MUST 찾기 | `Attack.js:284` | `moveTo(lastPos, 3)` clearPath false | 적용 |
| clear 끝 줍기 | `Attack.js:428` → `Pickit.js:307` | `moveToUnit(item)` / `moveTo(item, 0)` | 적용 |
| 해머 자리, 바바 시체 | `Paladin.js:276`, `Barbarian.js:189` | `teleportTo` / `walkTo` | 안 거침 |

- 제안("clearPath true면 SafeTele 끔")은 NodeAction이 도는 이동(clearPath true)에만 걸린다. 위 clear 안 이동은 모두 clearPath false라 **영향 없음**.
- clearPath true 텔레 이동에서 끄면: 경로 노드에 그대로 착지하고, 노드마다 `killMonsters`(clear 25) → setPosition이 자리를 잡는다. 착지 자리 자체는 setPosition이 보지 않는다. 회피가 켜진 빌드(Dodge.Enabled, 빌드 대부분 18레벨부터, 사거리 5 이상)는 첫 틱에 회피로 물러나고, 회피가 꺼진 구간(18레벨 전)은 착지 자리에서 그대로 싸운다.
- 수정은 `Pather.js` SafeTele 조건에 `&& !clearPath` 한 줄.

## 4. setPosition 회피 "가장 적은 자리" (261001 반영)
- **반영 전**: 정해진 순서(곧게 물러나기 → 좌우)대로 보다가 기준(내 자리 몹 수)보다 1 이상 적은 **첫** 자리를 채택. 기준 3, 채택 자리 2면 다음 틱도 2 > 0이라 다시 회피.
- **반영**: 구역 순서(물러나는 반 → 반대편 반)는 그대로. 구역 안에서 싼 검사(착지·시야·직선)를 통과한 후보의 몹 수를 세어, 기준보다 적은 것 중 **최소**를 채택. 동점은 기존 순서(곧게 물러나는 쪽). 0을 만나면 바로 채택. 반대편(관통)은 물러나는 반에 기준보다 적은 자리가 하나도 없을 때만(막혔거나 모두 나아지지 않음) — 사용자: "관통한다면 후퇴 전멸일 때".
- 12-2 기각 "몹 없는 자리(0) 무조건 우선"과 다른 점: 그 안은 구역 순서와 무관하게 0을 찾아 먼 쪽·관통 쪽을 골랐다. 이번 안은 구역 순서를 지킨다.
- 효과 범위: 회피→회피 반복이 줄어든다(몹이 따라오면 다시 발동). 접근→회피 반복은 그대로(접근은 몹 수를 안 셈, 12-2 기각 유지).
- 비용: 물러나는 반의 통과 후보 전부 `getMonsterCount`(링 R 10이면 약 7개).
- 게임 확인: FONV·D.FGOM·B.WCRY 회피가 한 번에 멀리(옆으로) 가는지, 반복 횟수가 줄었는지.

## 5. 최근 변경 상태 (260930까지)
- `teleportTo`: `me.attacking` 기준 대기, 회차당 최대 2초 × 10회, maxTeleDistance(45) 검사 삭제.
- `moveTo`: 텔레 경로가 마을로 들어가면 걷기로 전환.
- `useUnit`/`usePortal`/`makePortal`: max(1000, ping×2+300) 대기 + 로딩 중 대기. 빨간 포털 1500ms, `//260926 temp` trace 남아 있음(사용자 코드, handoff 4절 2번).
- `NodeAction`: killMonsters(108은 20, 그 외 25) → popChests(15) → getShrines → useWells 순서.
- `useWaypoint`: 루트 골레인(40)에서 Warriv가 50 안이면 1막 경유 — 의도(2막 시작점에서 WP가 멂).
- 원본 kolbot과 같은 동작: `moveTo` 반환은 마지막 처리 노드와의 거리 ≤5, `moveToUnit`은 PresetUnit이면 `pop`을 안 넘김, `plotCourse`의 `visitedNodes.indexOf`는 키가 아닌 값을 찾음(트리 구조라 실제 문제 없음).
