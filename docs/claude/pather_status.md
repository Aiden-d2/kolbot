# Pather 현황 (260930 정적 분석)

기준: main `ee7d5c0` (줄 번호도 이 기준). 게임 확인 없이 코드만 읽은 결과다. **코드는 고치지 않았다.** 결정된 항목도 수정 요청을 받은 뒤에 고친다(261001: 결정을 요청으로 보고 고쳤던 `303b432`는 `8c33a7b`로 되돌림. 다시 적용하려면 이 커밋의 코드 부분을 쓰면 된다).

## 1. SafeTele(`safeCheckNode`)와 setPosition 대조

| 항목 | SafeTele (`Pather.moveTo` 안) | setPosition | 판단 |
|---|---|---|---|
| 몹 수 | `Attack.getMonsterCount`, `SafeTele.Range` 10 **이하** (261003) | 같은 함수, min(사거리, `Dodge.Range` 10) − 2 이하 (261003) | 같은 함수 (260930 통일, 261003 미만 → 이하) |
| 불장판 | 몹 수 +100 (반경 4 이하) | 회피: +100 같음 / 접근: `checkFire` 반경 4 이하 제외 | 같음 |
| 착지 | `checkSpot(0x1)` | 텔레 `checkSpot(0x1)`, 걷기 `getCollision & 0x1` | 텔레는 같음 |
| 발동 | 목표 노드 몹 수 < `SafeTele.Count`(1)면 그대로 | 내 자리 몹 수 0이면 그대로 (Dodge.Count 삭제) | Count 1이면 동작 같음 |
| 후보 링 | 나 중심, 35→10(5 간격, 261002 Min 10), 노드 방향 ±75°(261003), 호 간격 5 | 대상 중심, 링 간격 5, 앞쪽 반 → 뒤쪽 반, 호 간격 5 | 목적이 달라 다름 |
| 고르기 | 원래 노드에 가까운 순(261003)으로 검사, **최소** (0이면 즉시) | 순서상 **처음으로** 기준보다 1 이상 적은 자리 | 4절 참고 |
| 되풀이 방지 | `excludedNodes` 최근 5개 자리(5칸 이내) 제외 | 없음 | setPosition 차용 안 함 (260930 사용자) |
| 나→후보 시야 | 검사 없음 (벽 너머 착지 가능) | 텔레 접근 SWEEP만 0x4 | SafeTele 차용 **기각** (261001) |
| 텔레 거리 | 링 최대 `teleDistance` 35 | 35 이하 teleportTo, 초과 moveTo | 7개 지역의 30은 둘 다 모름 (3-1) |
| 실패 | teleportTo 실패 → 원래 노드로 계속 | 회피 실패 → 제자리 공격, 접근 실패 → `moveFailed` | 문제 없음 |
| clearPath | 보지 않음. clearPath true인 텔레 이동에서도 돈다. 옮긴 노드는 `continue`라 NodeAction(clear·상자) 없음 | – | 결함 아님. 끌지는 3-6 재검토 |

## 2. SafeTele가 setPosition에서 가져올 것 (260930 검토)
setPosition에만 있는 검사: 타깃 시야(`coll`), 박스 울타리, SWEEP 접근의 나→후보 0x4 시야, 걷기 직선(0x5)·우회.
- 타깃 시야·박스·걷기 검사: SafeTele에는 해당 없음.
- **나→후보 0x4 시야**: 유일한 후보였으나 **기각** (261001 사용자: 0x4는 SafeTele와 연관 없음). 결론: SafeTele가 setPosition에서 가져올 것은 없음.

## 3. 결정·제안 현황
| # | 항목 | 상태 |
|---|---|---|
| 1 | setPosition 자리 기억(`excludedNodes`) | **탈락** (260930 사용자: 질문 취지는 SafeTele가 가져올 것) |
| 2 | `SafeTele.Count` 삭제, 몹 1마리부터 발동(`baseline === 0`이면 그대로) | **반영 (261001, 사용자 요청)**. 동작 변화 없음 |
| 3 | 지역별 텔레 간격 한 곳에서 관리 (= 3-1 결함 수정) | **반영 (261001, 사용자 요청)**. setPosition(`Attack.js:674`)은 35 그대로 |
| 4 | `"killMonsters"` 반환 | **유지** (260930 사용자: false 대응은 카우뿐) |
| 5 | `journeyTo` 방어 | **기각·보류** (261001 사용자). 지금 코드는 원본 kolbot과 같다 |
| 6 | 죽은 코드 삭제(`cleared`, `MainLoop:`, `j`/`wp`) | **기각·보류** (261001 사용자). PathDebug 포함 |
| 7 | Warriv 1막 경유 | **의도** (260930 사용자: 2막 시작점에서 WP가 멀어 1막 WP가 빠름) |
| 8 | setPosition 회피: 구역 안 몹 수 최소 자리 | **반영 (261001, 사용자 요청)**. 4절 |
| 9 | SafeTele: clearPath true면 끄기 | **기각** (261001 사용자). 3-6 |
| 10 | 상자 제외: 트랩·불 옆 | **반영 (261001, 사용자 요청)**. 3-8 |
| 11 | `NodeAction.go`의 주석 처리된 `prevNode` 규칙(260903)과 `prevNode` 갱신, `moveTo`의 `errorReport //260922 temp` | **기각·보류** (261001 사용자) |

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

`SafeTele.Skip`에 62·63·64는 있어 SafeTele가 안 돈다(261003부터 Skip에서 빠져 돈다, 아래 "SafeTele.Skip 62~64 삭제"). 88·89·91(Flayer Dungeon 1~3), 74(Arcane)는 SafeTele가 돌고, 한 번 발동하면 나머지 경로가 35 간격이 된다. 이동 실패 뒤에는 7개 지역 모두 25~35 간격이 된다.

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
| `Attack.js:674` | **그대로 35** (261001 사용자 결정) | 없음 |

## 3-2. 반환값 `"killMonsters"` (유지)
문자열이라 `if (!moveTo(...))`는 성공으로 읽는다(`moveToExit` `:792`). clear가 false인 경우는 사망·카우킹·스킬 미습득 정지뿐이고, false에 대응하는 호출부는 카우 레벨뿐이라 유지한다(사용자 260930).

## 3-3. 죽은 코드
| 대상 | 줄 | 삭제 영향 |
|---|---|---|
| `if (!cleared) { cleared = true; }`, `cleared` 선언, "Don't go berserk" 주석 | `:406`, `:227` | 없음. 안의 `//Attack.clear(5)`가 260929 정리 때 지워져 빈 블록(`fcd2713:libs/Pather.js:407`) |
| `teleportTo`의 `MainLoop:` 레이블 | `:464` | 없음. `break MainLoop`/`continue MainLoop`가 없다. 원본 kolbot에서 남은 것 |
| `goWP`의 `j`, `wp` 선언 | `goWP` 첫 줄 | 없음. 선언 줄 외 사용 0 (`getWP`는 261002에 다시 짜서 해당 없음) |
| `NodeAction.go`의 `/* ... arg.prevNode ... */`(260903)와 `prevNode` 갱신·전달 | `:13`, `:383`, `:377` | 사용자가 꺼 둔 규칙인지 확인 필요 |
| `PathDebug.coordsInPath` | `:121` | 없음. 호출 0곳 |
| `moveTo` 좌표 없음 분기의 `Misc.errorReport(... //260922 temp)` | `:238` | temp 표시. 뒤 throw가 Loader에서 다시 보고될 수 있음 |

**PathDebug** (D2BS 소스 `JSScreenHook.cpp` `line_ctor`, `ScreenHook.cpp` 확인)
- `drawPath(path)`: 경로 노드를 이은 선을 `new Line(x1, y1, x2, y2, 0x84, true)`로 만든다. 여섯째 인자 true = 자동지도(automap) 좌표. D2BS는 automap 훅을 **자동지도가 켜져 있을 때만**(`*p_D2CLIENT_AutomapOn`, Tab 지도) 그린다. 게임 화면(월드)에는 안 그린다. MapThread의 몹 표시·방향선과 같은 방식.
- 선은 `moveTo`가 도는 동안만 남는다. `drawPath`는 먼저 이전 선을 지우고, `moveTo` 끝에서 지운다. 경로를 다시 계산할 때마다 새로 그린다.
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

**플래그**: 3-7 전체 표.

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

**엔진 `getCollision`과 `CollMap.getColl` 비교 (기능은 같다: 한 칸의 충돌 플래그를 돌려준다)**
| 항목 | 엔진 `getCollision` | `CollMap.getColl` |
|---|---|---|
| 읽는 곳 | D2BS `ActMap`이 지역의 방을 찾아 그 방의 충돌 지도에서 읽음 | `getRoom(x, y).getCollision()`으로 방 충돌 지도를 JS 배열로 복사해 두고 읽음 |
| 값의 시점 | 부를 때마다 게임의 현재 값 | 복사해 둔 값(최대 25개 방). `CollMap.reset()`(방 25개 초과, `getNearestWalkable` 끝) 전까지 그대로 |
| 회피 레이어 | 74·111·112·117 지역은 더함 (Arcane, 바바리안 방책 지역) | 없음 |
| 모르는 칸 | 0xFFFF | 5 (0x1 \| 0x4) |
| 비용 | 호출마다 엔진 진입 + 정리(`CleanUp`) | 첫 방 복사 뒤에는 배열 조회 |
| 주 용도 | 한두 칸 검사(`validSpot`, setPosition 걷기, `getRandCoordinate`) | 여러 칸 검사(`checkSpot` 4칸, `getNearestWalkable` 탐색, `checkColl` 직선) |

- 겹침: 같은 질문에 답하는 두 함수다. 같은 칸을 두 함수로 같이 검사하는 곳은 없고, 호출부마다 한쪽만 쓴다(원본 kolbot부터).
- 복사본이라 생기는 차이(추정): 충돌 지도에는 유닛·문 비트(3-7의 "변함" 표시)도 들어 있다. CollMap은 복사 시점 값이라, 7개 지역 노드 보정(`0x800|0x1000`)은 복사 뒤 움직인 유닛·열린 문을 반영하지 못할 수 있다. 벽(0x1)·시야(0x4)는 변하지 않아 영향 없음.
- 74(Arcane)에서 텔레 착지(`checkSpot`, CollMap)는 회피 레이어를 모르고, 걷기 착지(`getCollision`)는 안다. 같은 자리가 텔레로는 통과, 걷기로는 막힘일 수 있다(추정).
- `checkSpot`은 가운데 칸을 안 봐서 1칸짜리 기둥 위를 통과시킬 수 있다(원본 kolbot 동작).

**walkTo 옆걸음** (`Pather.js` `walkTo`, `ModeLoop`)
- 목표를 클릭한 뒤 500ms 안에 걷기/달리기 동작(mode 2·3·6)이 시작되지 않으면 "막혔다"고 본다(3번이면 false).
- 목표→나 방향에 직각(±90°)으로 **내 자리에서 5칸** 떨어진 두 점을 차례로 보고, `validSpot`을 통과한 첫 점을 클릭해 최대 1초 옆으로 비켜선 뒤 목표를 다시 클릭한다. 몹·오브젝트에 몸이 걸렸을 때 빠져나오는 동작이다. 코드의 TODO는 "getNearestWalkable로 바꿀 수도"라는 원본 메모.

## 3-6. SafeTele를 clearPath true 이동에서 끌지 (261001 재검토 → 기각)
이전 답에서 "끄면 이렇게 된다"만 적어 끄는 쪽으로 읽히게 했다. 끌 근거를 제시한 것은 아니다. 다시 정리한다.

**clear 안의 이동** — setPosition만이 아니다. 모두 clearPath false라 이 결정과 무관하다.
| 이동 | 줄 | 방식 | SafeTele |
|---|---|---|---|
| setPosition 텔레 35 이하 / 걷기 | `Attack.js:673`, `:675` | `teleportTo` / `walkTo` | 안 거침 |
| setPosition 텔레 35 초과, 걷기 우회 | `Attack.js:677`, `:704` | `moveTo(…, 1)` | 중간 노드에 적용 (마지막 노드 제외) |
| 시야 잃은 MUST 찾기 | `Attack.js:284` | `moveTo(lastPos, 3)` | 적용 |
| clear 끝 줍기 | `Attack.js:428` → `Pickit.js:307` | `moveToUnit` / `moveTo(item, 0)` | 적용 |
| 해머 자리, 바바 시체 | `Paladin.js:276`, `Barbarian.js:189` | `teleportTo` / `walkTo` | 안 거침 |

**바뀌는 동작 (clearPath true인 텔레 이동만)**
| | 지금 (SafeTele 켜짐) | 끄면 |
|---|---|---|
| 중간 노드 반경 10 미만에 몹 1마리 이상 | 나에게서 15~35(노드 방향 ±60°) 안에서 몹이 더 적은 자리로 텔레. 그 자리에서는 NodeAction(clear·상자·제단·우물) 없이 경로 재계산 | 노드에 그대로 착지 |
| clear(25) 시점 | 반경 10 안이 조용한 노드, 더 나은 자리가 없던 노드, 마지막 노드에서만 | 모든 노드 |
| 전투 시작 위치 | 무리에서 10 이상 떨어진 자리 → 이후 setPosition | 무리 한가운데 → 첫 틱 setPosition 회피(켜진 빌드·사거리 5 이상) |
| 경로 위 무리 | 다음 clear 지점에서 25 밖이면 지나칠 수 있음(추정, SafeTele 성공 로그가 없어 빈도 모름) | 모두 clear 대상 |
| 상자·제단·우물 | 옮긴 노드에서는 안 함 | 모든 노드 |

- 이전 답의 "회피가 꺼진 구간(18레벨 전)" 정정: 소서는 텔레포트와 `Dodge.Enabled`(빌드 18레벨, 예: `S.FIRE.js:143`)가 같은 레벨에 켜져 그 구간이 사실상 없다. 해당되는 경우는 아이템 텔레포트 차지를 가진 18레벨 전 캐릭터뿐. (261002: 회피를 25레벨에 켜도록 바꿔 소서 18~24레벨은 텔레포트만 있고 회피는 없다)
- **끌 필요가 있는가**: 결함 근거는 없다. "안전하게 착지(켜 둠)"와 "경로 위 무리를 빠짐없이 치기(끔)" 중 어느 쪽을 택할지의 방침 문제다. 경로 위 무리를 놓친다는 관찰이나 trace가 없으므로 **지금대로 유지**를 권한다. 판단 자료가 필요하면 SafeTele 이동 성공 때 trace 한 줄(옮긴 거리·몹 수)을 임시로 남겨 빈도를 보는 방법이 있다.

## 3-7. 충돌 플래그 전체
출처: D2MOO(`source/D2Common/include/D2Collision.h`, 게임 코드 역공학)의 이름·주석, D2BS(`Map/Diablo_II/ActMap.h`)의 이름. 두 곳의 이름이 다른 비트가 있다. D2MOO 주석 자체도 "일관성 없이 쓰임", "가끔" 같은 단서가 붙어 있어 의미는 이름과 주석 수준이다.

| 값 | D2MOO 이름 (주석) | D2BS 이름 | 의미 | 변함 | kolbot 사용 |
|---|---|---|---|---|---|
| 0x0001 | WALL (아케인 허공·절벽 벽 등, 사실상 플레이어를 막음) | BlockWalk | 걸을 수 없는 칸 | 고정 | 착지·걷기 검사 전부, `0x5` |
| 0x0002 | VISIBLE (위로 쏠 수 없는 타일 장애물) | BlockLineOfSight | 시야 막힘 | 고정 | 없음 |
| 0x0004 | MISSILE_BARRIER (일관성 없이 쓰임, 미사일·비행 막음?) | Wall | 미사일 막힘 | 고정 | "시야·원거리 막힘"으로 51곳, `0x5`, 해머, Druid `0x405`, Paladin `0x2004` |
| 0x0008 | NOPLAYER | BlockPlayer | 플레이어만 못 지나감(이름 기준) | 고정 | 없음 |
| 0x0010 | PRESET (일부 바닥에만 있음) | AlternateTile | 바닥 종류 표시 | 고정 | 없음 |
| 0x0020 | BLANK (칸이 유효하지 않을 때) | Blank | 빈 칸 | 고정 | 없음 |
| 0x0040 | MISSILE | Missile | 미사일 유닛 자리 | 변함 | 없음 |
| 0x0080 | PLAYER | Player | 플레이어 유닛 자리 | 변함 | 없음 |
| 0x00C0 | WATER (= MISSILE \| PLAYER 조합) | – | 물 | – | 없음 |
| 0x0100 | MONSTER | NPCLocation | 몬스터 유닛 자리 | 변함 | 없음 |
| 0x0200 | ITEM | Item | 아이템 자리 | 변함 | 없음 |
| 0x0400 | OBJECT | Object | 오브젝트(상자·횃불 등) 자리 | 거의 고정 | `validSpot`, Druid `0x405` |
| 0x0800 | DOOR | ClosedDoor | 닫힌 문 | 문 열리면 변함 | 7개 지역 노드 보정 |
| 0x1000 | NO_PATH (유닛에 가끔 설정, 항상은 아님) | NPCCollision | 유닛 관련 경로 막힘 | 변함 | 7개 지역 노드 보정 |
| 0x2000 | PET (공격 가능한 몬스터 존재와 연관) | FriendlyNPC | 이름이 서로 다름 | 변함 | Paladin `0x2004` |
| 0x4000 | 4000 (이름 없음) | Unknown | 모름 | – | 없음 |
| 0x8000 | CORPSE (포털도 씀, 죽은 몹) | DeadBody | 시체·포털 | 변함 | 없음 |
| 0xFFFF | ALL_MASK | Avoid | 전부. D2BS `getCollision`이 모르는 칸에 돌려줌 | – | – |

"변함"은 이름으로 본 추정이다(유닛·문 상태에 따라 바뀌는 비트).

**게임 자체가 쓰는 조합 (D2MOO)** — 참고
| 이름 | 값 | 구성 |
|---|---|---|
| PLAYER_PATH (플레이어 이동) | 0x1C09 | WALL \| NOPLAYER \| OBJECT \| DOOR \| NO_PATH |
| PLAYER_FLYING | 0x0804 | DOOR \| MISSILE_BARRIER |
| PLAYER_WW (훨윈드) | 0x0C01 | WALL \| OBJECT \| DOOR |
| RADIAL_BARRIER | 0x0805 | DOOR \| MISSILE_BARRIER \| WALL |
| FLYING_UNIT | 0x1804 | MISSILE_BARRIER \| DOOR \| NO_PATH |
| MONSTER_MISSILE | 0x0101 | MONSTER \| WALL |
| MONSTER_PATH | 0x3C01 | WALL \| OBJECT \| NO_PATH \| PET \| DOOR |
| DOOR_BLOCK_VIS | 0x0806 | DOOR \| MISSILE_BARRIER \| VISIBLE |
| BLOCKS_DOOR | 0x8180 | PLAYER \| MONSTER \| CORPSE |
| SPAWN | 0x3E01 | WALL \| ITEM \| OBJECT \| DOOR \| NO_PATH \| PET |
| PLACEMENT | 0x3F11 | SPAWN \| PRESET \| MONSTER |
| INVALID | 0x0027 | BLANK \| MISSILE_BARRIER \| VISIBLE \| WALL |

- kolbot의 걷기·착지 검사는 0x1만 본다. 게임의 플레이어 이동 조합(0x1C09)은 0x8·0x400·0x800·0x1000도 막힘으로 본다. 차이만 기록(수정 제안 아님).
- kolbot은 0x4를 시야로 쓰는데, 게임 코드상 0x4는 미사일 막힘이고 시야는 0x2다. 원본 kolbot부터 이렇게 써 왔고 동작해 왔다(원거리 스킬에는 미사일 막힘이 맞는 기준일 수 있음, 추정).

## 3-8. 상자 제외: 트랩·불 옆 (261001 반영)
대상: `Misc.openChests`(`Misc.js:1423`) 목록을 만드는 `getUnit(2)` 루프.
- **트랩 전부 제외**: `unit.objtype & 0x7F`가 0이 아니면 뺀다. 게임은 이 값으로 트랩을 고른다(D2MOO `ObjMode.cpp:373`): 1 라이트닝, 2·6 파이어볼트, 3 독구름, 4 노바, 5·7 불 오브젝트 생성, 8·9 트랩 몬스터 1~2마리. D2BS `objtype`이 같은 바이트이고 `islocked`는 그 최상위 비트(0x80). 클라이언트가 같은 값을 받는지는 추정(잠김 비트가 동작하는 것이 근거) → 게임 확인 필요.
- **`"explodingchest"`**: 목록에서 뺀다(트랩으로 취급).
- **불 옆 상자 제외**: 같은 루프에서 이름 `"fire"`인 오브젝트 중 나에게서 range+4(기본 19) 안의 좌표를 모으고, 후보 상자마다 `Attack.checkFire(x, y, 모은 불)`(반경 4 이하)이면 뺀다. `getUnit` 추가 호출 없음.
- 근거: `CorpseOnStick`(57·58)은 InitFn 0·Lit 0으로 불·데미지가 없는 시체 상자다. 불과 바닥 데미지는 옆의 `fire` 오브젝트(160·161·162 등, InitFn 22 → 모드 변경 이벤트가 반경 Parm0+1 안 플레이어에게 데미지, `ObjMode.cpp:328`). D2BS 오브젝트 이름 = objects.txt Name, 대소문자 무시(`D2Helpers.cpp:87`). 지금 상자 경로에는 불 검사가 없다.
- 이름으로 `corpseonstick`을 빼는 안은 기각: 불 없는 시체도 빠지고 다른 상자는 못 거른다.
- **컨테이너별 트랩 값 확인 (261001, objects.txt + D2MOO `Objects.cpp`)**: 목록 54종의 초기화 함수(InitFn)를 대조했다.
  | InitFn | 목록의 컨테이너 | InteractType |
  |---|---|---|
  | 03 Chest | chest, chest3, chestl/r, woodchest, burialchest, tomb 계열, groundtomb, casket 일부, deadperson, object2, hidden stash 일부, barrel wilderness 일부, evilurn | (몬스터 레벨/8+5)% 확률로 트랩 1~8, 잠김 가능이면 0x80 |
  | 02 Urn | urn, largeurn, jar1~3, icecavejar1~4, basket 일부, bonechest, cocoon, corpse 일부, hungskeleton, ratnest 일부, skeleton 일부, guardcorpse, stash(정글) | 같은 확률로 트랩 1~8 |
  | 27 GooPile | goo pile | 33.3%로 3 |
  | 57 SparklyChest | 반짝이는 상자 | 03과 같음 |
  | 없음 | barrel(일반·폭발), armorstand, weaponrack, holeanim, casket·sarcophagus 일부, roguecorpse, corpseonstick, loose rock·boulder, hollow log, pillar, skull pile, jug, 퀘스트 상자(큐브·스크롤·지팡이·칼림) | 0 (걸러지지 않음) |
  - 이 함수들은 값을 0 또는 트랩 번호로만 쓴다(다른 용도는 우물·제단·포털뿐, 목록에 없음). 값이 들어가는 컨테이너의 동작 함수는 모두 열 때 `SetTrapCallback(InteractType & 0x7F)`를 부르고(`ObjMode.cpp:1247`, 2468, 2516, 2578, 2609, 정글 은닉처), 트랩 번호 1~8은 모두 트랩 함수에 연결된다. → **0이 아니면 진짜 트랩, 트랩 없는 컨테이너는 걸러지지 않는다.**
  - Countess 탑 5층(25): 프리셋 580(`Objects.cpp:172` `OBJECTS_SpawnSpecialChest`) 자리에는 classid 371 `ForgottenTowerChest`가 생긴다(`ObjectsIds.h` `OBJECT_CHEST = 371`, 다른 층은 반짝이 상자). 371은 OperateFn 0·Selectable 0으로 열 수 없는 **퀘스트 소품**이다(InitFn 47 `CountessChest`가 퀘스트에 등록, 최초 퀘스트 완료 때 한 번 열리는 연출, 이후 모양만 남음 — 사용자 확인 261001). 원본·블리즈해커 kolbot의 `Misc.openChest` Countess 좌표(12526, 12565) 막기는 이 때문이다. 패킷(0x13)으로 상호작용하면 서버 `D2_ASSERT(pOperateFn)`(`ObjMode.cpp:2968~2970`)에 걸릴 수 있다(추정). → **열지 않음, 원본 막기 유지** (261001, 여는 코드 `7971b20`은 `61e4e1b`로 되돌림).
  - 남은 추정: 클라이언트 `objtype`이 서버 값과 같은지. 확인용 trace `[chest] skip trap|fire name: classid: objtype: dist:`(상자당 1회, `Misc.traceChestSkip`, `//261001 temp`)를 넣었다. 확인되면 지운다.

## 4. setPosition 회피 "가장 적은 자리" (261001 반영)
- **지금 코드**: 정해진 순서(곧게 물러나기 → 좌우)대로 보다가 기준(내 자리 몹 수)보다 1 이상 적은 **첫** 자리를 채택(`Attack.js:644`). 기준 3, 채택 자리 2면 다음 틱도 2 > 0이라 다시 회피.
- **결정 (사용자 261001)**: 구역 순서(물러나는 반 → 반대편 반)는 그대로. 구역 안에서 싼 검사(착지·시야·직선)를 통과한 후보의 몹 수를 세어, 기준보다 적은 것 중 **최소**를 채택. 동점은 기존 순서. 0을 만나면 바로 채택. 반대편(관통)은 물러나는 반에 기준보다 적은 자리가 하나도 없을 때만 — 사용자: "관통한다면 후퇴 전멸일 때".
- 12-2 기각 "몹 없는 자리(0) 무조건 우선"과 다른 점: 그 안은 구역 순서와 무관하게 0을 찾아 먼 쪽·관통 쪽을 골랐다. 이번 안은 구역 순서를 지킨다.
- 효과 범위: 회피→회피 반복이 줄어든다(몹이 따라오면 다시 발동). 접근→회피 반복은 그대로(접근은 몹 수를 안 셈, 12-2 기각 유지). 회피→접근은 대상이 움직이지 않으면 생기지 않음(회피 후보는 사거리·대상 시야를 통과한 자리).
- 비용: 물러나는 반의 통과 후보 전부 `getMonsterCount`(링 R 10이면 약 7개).
- 구현: 몹 수 검사 자리에서 최소를 갱신하고 0이면 `break` (261001 반영).

## 5. 최근 변경 상태 (260930까지)
- `teleportTo`: `me.attacking` 기준 대기, 회차당 최대 2초 × 10회, maxTeleDistance(45) 검사 삭제.
- `moveTo`: 텔레 경로가 마을로 들어가면 걷기로 전환.
- `useUnit`/`usePortal`/`makePortal`: max(1000, ping×2+300) 대기 + 로딩 중 대기. 빨간 포털 1500ms, `//260926 temp` trace 남아 있음(사용자 코드, handoff 4절 2번).
- `NodeAction`: killMonsters(108은 20, 그 외 25) → popChests(15) → getShrines → useWells 순서.
- `useWaypoint`: 루트 골레인(40)에서 Warriv가 50 안이면 1막 경유 — 의도(2막 시작점에서 WP가 멂).
- 원본 kolbot과 같은 동작: `moveTo` 반환은 마지막 처리 노드와의 거리 ≤5, `moveToUnit`은 PresetUnit이면 `pop`을 안 넘김, `plotCourse`의 `visitedNodes.indexOf`는 키가 아닌 값을 찾음(트리 구조라 실제 문제 없음).

## SafeTele.Min 15 → 10 (261002, 사용자 수정)
- 쓰는 곳은 `Pather.moveTo`의 `safeCheckNode` 하나(`Pather.js:178`, 링 거리 하한). 링: 35(좁은 지역 30)부터 5씩 → 15였다가 **10 링 하나 추가**. 10 링 후보는 각도 간격 5/10 rad ≈ 29°라 0°, ±29°, ±57° 5개.
- 바깥 링에서 몹 0 자리를 못 찾았을 때만 내려오고, 더 적을 때만 바꾸므로(`mc < baseline`) 10칸 자리는 바깥 링보다 몹이 확실히 적을 때만 고른다. 목표 방향 ±60° 안이라 최소 약 5칸 전진, 최근 5자리 5칸 안 제외로 맴돌지 않음, 착지 검사 `checkSpot(0x1)` 같음.
- 감수: 몹이 많은 곳에서 짧은 텔레포트가 늘 수 있다(횟수·마나). 빈도는 게임 확인.

## SafeTele 후보 순서 (261003, 사용자 결정·요청)
- 바뀐 것: `SafeTele.Angle` 60 → 75, `SafeTele.Range` 10 이하(`getMonsterCount` `<=`), `safeCheckNode`가 후보 좌표를 모두 만든 뒤 **원래 타겟노드와의 거리(제곱) 오름차순, 동점은 먼 링, 그다음 생성 순서**로 정렬해 한 번에 검사. 0마리면 즉시 채택, 없으면 최소(동점은 먼저 검사한 자리). Step 5·Min 10·제외 반경 5·링 시작(`getTeleDistance()`)은 그대로.
- 이유: 전에는 바깥 링이 각도보다 먼저라, 각도를 넓히면 바깥 링의 옆자리(예: 35@50°)가 안쪽 링 0°보다 먼저 뽑혔다. 원래 타겟노드는 경로상 최적 지점이므로 거기서 멀수록 목적지에서 멀어진다고 보고, 각도·거리를 따로 저울질하지 않고 그 거리 하나로 순서를 정한다. 예(노드 35칸): 30@0°·35@8.2° 5.0 → 30@9.5° 7.3 → 25@0°·35@16.4° 10 → 20@0° 15 → 15@0° 20 → 35@40° 23.9 → 10@0° 25 → 35@60° 35.
- 비용: 후보 좌표 생성·정렬(75°에서 일반 70개 / 좁은 지역 51개, 게임 호출 없음)이 몹이 있는 노드에서만 추가. 후보당 검사(제외 노드·`checkSpot`·몹 수)는 같고, 0마리 자리를 찾으면 멈추는 것도 같다. 타겟노드 근처 후보가 몹 때문에 먼저 탈락하는 건 전에도 같았다(35@0°부터 검사).
- 검토 후 유지: Step 5(호·링 공통). 링·호 간격을 나누면 커버가 고르지 않다. 간격을 넓히면(6: 최대 어긋남 4.2, 7: 4.9, 지금 3.5) 좁은 땅·통로를 후보가 건너뛰어 `checkSpot`을 통과하는 자리를 놓치고, 후보가 없으면 위험한 원래 노드로 간다. 검사 비용은 원래 작아 아낄 몫이 적다. Min 7·Step 7안도 같은 이유로 기각.
- 마지막 노드는 SafeTele를 거치지 않는다(`path.length > 0` 조건).

## SafeTele.Skip 62~64 삭제 (261003, 사용자 요청)
- `Skip` `[62, 63, 64, 120, 132]` → `[120, 132]`. 매고트 굴(62~64)에서도 SafeTele가 돈다.
- 근거: 세이프노드 텔레가 성공하면 그 자리에서 경로를 다시 계산하고(`continue`), 후보가 없거나 텔레가 실패하면 원래 노드가 그대로 narrowAreas 보정(`getNearestWalkable`)을 거쳐 텔레한다. Skip이 없어도 보정 경로는 남는다. 착지한 뒤에는 보정이 필요 없다(보정은 텔레 전 목표 고르기).
- 차이: 세이프노드 후보 검사는 `checkSpot(0x1)`, 보정은 `checkSpot(0x1|0x4|0x800|0x1000)`. 같은 함수·같은 칸(상하좌우 4칸)이고 플래그만 다르다. checkSpot의 0x4는 직선 시야가 아니라 옆 칸의 비트 검사라 보통 벽은 0x1과 중복(추정), 실제 차이는 닫힌 문(0x800)·유닛 자리(0x1000).
- 확인: trace `[SafeTele] teleportTo FAILED`의 62~64 줄 수. 잦으면 narrowAreas에서 후보 검사 플래그를 보정과 같게(사후 보정은 몹 수 재검사가 없어 기각).
- 120(Arreat Summit)·132(Worldstone Chamber)는 Config에 유지: 보스(고대인·바알)에게 일부러 다가가는 곳이라 중간 노드에서 비켜 가면 접근만 늦어진다(추정, Skip을 넣은 기록은 260829 표기뿐). 하드코딩보다 Config가 낫다: Skip 검사가 `safeCheckNode` 바깥(`:338`)이라 몹 목록 만들기도 건너뛴다.

## getPath 빈 배열 (261002)
- 목표에 닿을 수 없으면 `getPath`는 `false`가 아니라 빈 배열을 돌려준다(D2BS 소스, `handoff.md` 6절). `moveTo`의 `if (!path) throw`(`:273`)는 빈 배열을 통과시켜 `while (path.length > 0)`을 한 번도 안 돌고 `:455`에서 false. 거리와 무관하게 한 걸음도 안 움직인다.
- 트리스트람 경로 건너뛰기의 원인이었다. 대응은 Pather가 아니라 AutoSmurf 호출부의 오프셋 정리로 했다(`handoff.md` 5절 오프셋 정리). `moveTo` 안에서 대체 좌표를 쓰는 안은 setPosition 등 다른 이동의 판단을 우회해 기각.

## 웨이 누락 복구 (261002, 사용자 요청)
증상: trace 261002 a1. Pz-28·29는 `useWaypoint(118)`, Pz-30~32는 INFERNAL의 `useWaypoint(117)`에서 `Failed to go to waypoint`로 게임 종료.

경로:
1. Pz-28 travel(9): 113에서 `moveToExit(115)` 도중 `townCheck`로 마을에 다녀옴(trace 17:40:12~33). 돌아온 뒤 115로 못 넘어감. `useUnit` trace도 예외도 없어 `moveToExit`가 false를 돌려준 것으로 추정(도착 10298,5008이 목표 10296,5002에서 6.3, `moveTo`는 5 이하만 true).
2. travel case 115~129는 반환값을 안 봐서 그대로 진행. `clickWP()`는 `me.area`(113) 웨이만 다시 찍고, 117·118도 113에 출구가 없어 false. travel이 "성공"으로 끝남.
3. `syncBO` "act5+ BO" → `syncWP(118)` → `useWaypoint(118)`. 웨이가 없으면 `goWP(118)`로 복구하는데 `goWP`는 접근만 하고 항상 false라 throw.
4. 118은 Pz-30에 생겼지만(경위 미확인, Pz-29 오류 뒤 1분 39초 trace 없음) 엑트5 진입 조건이 118만 봐서 115·117은 계속 비어 INFERNAL이 매 게임 실패.

반영:
- `goWP`는 **일부러 웨이를 안 찍는 함수**다(사용자). 파티 이동 때 `goWP(me.area, true)`로 접근 → 싱크(`okCount`) → `clickWP()` 순서라 여기서 찍으면 싱크가 깨진다. 원본 그대로 둔다.
- `getWP`: `goWP(area, clearPath)`로 접근한 뒤 웨이를 클릭(메뉴가 열리면 닫음, 최대 5회)하고 `getWaypoint` 결과를 돌려준다. 실패 trace `[getWP] waypoint unit not found`/`waypoint menu not opened`. 원래 `getWP`도 클릭 코드가 빠져 있었다(남은 `j`, `wp` 선언이 흔적, 이 저장소 첫 커밋부터).
- `useWaypoint`의 웨이 누락 복구와 `journeyTo`의 지나가는 구역 웨이 처리를 `goWP` → `getWP`. `journeyTo`는 복구 경로처럼 혼자 이동할 때만 돌고(호출부: `goWP`·`getWP`의 다른 구역 이동, `clickWP(78)`, `Misc.openChestsInArea`), 싱크 4곳은 `goWP(me.area, true)`라 `journeyTo`를 안 탄다.
- `getWP`의 다른 호출부는 `MapHelper`(D2BotMap 수동 모드 숫자패드 2) 하나. 웨이 찍기가 목적이었던 것으로 본다(사용자).
- travel case 115/117/118/120/128/129: 기존 try 안에서 `moveToExit` 3회 재시도(`me.area` 확인, `default` case와 같은 방식), 그래도 못 넘어가면 try/catch **밖**에서 `throw new Error("Travel failed: area N")`. 안에서 던지면 기존 catch가 129 포털을 무한 대기한다.

그대로 남은 것:
- travel case 115~129의 catch(`usePortal(129)` 무한 대기)는 travel(9)에서 예외가 나면 멈춘다. 손대지 않음.
- 엑트5 진입 조건 확장은 보류(`handoff.md` 4절 23번).

실수 기록: 처음에 `goWP`에 클릭을 넣었다(`e7b919c`). 싱크 구조를 보고도 "클릭이 겹칠 뿐"이라고 판단했다. 사용자 지적 뒤 `goWP`를 원본으로 돌리고 `getWP`로 옮김(`4dcb5a5`).
