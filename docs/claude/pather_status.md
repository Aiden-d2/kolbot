# Pather 현황 (260930 정적 분석)

기준: main `ee7d5c0` (줄 번호도 이 기준). 게임 확인 없이 코드만 읽은 결과다. **코드는 고치지 않았다.** 결정된 항목도 수정 요청을 받은 뒤에 고친다(261001: 결정을 요청으로 보고 고쳤던 `303b432`는 `8c33a7b`로 되돌림. 다시 적용하려면 이 커밋의 코드 부분을 쓰면 된다).

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
| 2 | `SafeTele.Count` 삭제, 몹 1마리부터 발동(`baseline === 0`이면 그대로) | **결정됨 (261001), 수정 요청 대기**. `Config.js:80`, `Pather.js:166`. 동작 변화 없음 |
| 3 | 지역별 텔레 간격 한 곳에서 관리 (= 3-1 결함 수정) | **결정됨 (261001), 수정 요청 대기**. setPosition(`Attack.js:674`)은 35 그대로 |
| 4 | `"killMonsters"` 반환 | **유지** (260930 사용자: false 대응은 카우뿐) |
| 5 | `journeyTo` 방어 | 제안 3-4, 결정 대기. 지금 코드는 원본 kolbot과 같다(원본도 검사 없음) |
| 6 | 죽은 코드 삭제(`cleared`, `MainLoop:`, `j`/`wp`) | **기록만, 보류** (261001). PathDebug는 사용자가 더 알아본 뒤 결정 |
| 7 | Warriv 1막 경유 | **의도** (260930 사용자: 2막 시작점에서 WP가 멀어 1막 WP가 빠름) |
| 8 | setPosition 회피: 구역 안 몹 수 최소 자리 | **결정됨 (261001), 수정 요청 대기**. 4절 |
| 9 | SafeTele: clearPath true면 끄기 | 재검토 3-6. 끌 필요 없음(권장: 유지) |

## 3-1. 7개 지역(62·63·64·88·89·91·74)의 텔레 간격 30이 첫 경로에만 적용 (결정됨, 수정 요청 대기)
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
| `Attack.js:674` | **그대로 35** (261001 사용자 결정) | 없음 |

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

## 3-6. SafeTele를 clearPath true 이동에서 끌지 (261001 재검토)
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

- 이전 답의 "회피가 꺼진 구간(18레벨 전)" 정정: 소서는 텔레포트와 `Dodge.Enabled`(빌드 18레벨, 예: `S.FIRE.js:143`)가 같은 레벨에 켜져 그 구간이 사실상 없다. 해당되는 경우는 아이템 텔레포트 차지를 가진 18레벨 전 캐릭터뿐.
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

## 4. setPosition 회피 "가장 적은 자리" (261001 결정됨, 수정 요청 대기)
- **지금 코드**: 정해진 순서(곧게 물러나기 → 좌우)대로 보다가 기준(내 자리 몹 수)보다 1 이상 적은 **첫** 자리를 채택(`Attack.js:644`). 기준 3, 채택 자리 2면 다음 틱도 2 > 0이라 다시 회피.
- **결정 (사용자 261001)**: 구역 순서(물러나는 반 → 반대편 반)는 그대로. 구역 안에서 싼 검사(착지·시야·직선)를 통과한 후보의 몹 수를 세어, 기준보다 적은 것 중 **최소**를 채택. 동점은 기존 순서. 0을 만나면 바로 채택. 반대편(관통)은 물러나는 반에 기준보다 적은 자리가 하나도 없을 때만 — 사용자: "관통한다면 후퇴 전멸일 때".
- 12-2 기각 "몹 없는 자리(0) 무조건 우선"과 다른 점: 그 안은 구역 순서와 무관하게 0을 찾아 먼 쪽·관통 쪽을 골랐다. 이번 안은 구역 순서를 지킨다.
- 효과 범위: 회피→회피 반복이 줄어든다(몹이 따라오면 다시 발동). 접근→회피 반복은 그대로(접근은 몹 수를 안 셈, 12-2 기각 유지). 회피→접근은 대상이 움직이지 않으면 생기지 않음(회피 후보는 사거리·대상 시야를 통과한 자리).
- 비용: 물러나는 반의 통과 후보 전부 `getMonsterCount`(링 R 10이면 약 7개).
- 구현안(되돌린 `303b432`의 `Attack.js` 부분): 몹 수 검사 자리에서 `continue`/`break` 대신 최소를 갱신하고 0이면 `break`.

## 5. 최근 변경 상태 (260930까지)
- `teleportTo`: `me.attacking` 기준 대기, 회차당 최대 2초 × 10회, maxTeleDistance(45) 검사 삭제.
- `moveTo`: 텔레 경로가 마을로 들어가면 걷기로 전환.
- `useUnit`/`usePortal`/`makePortal`: max(1000, ping×2+300) 대기 + 로딩 중 대기. 빨간 포털 1500ms, `//260926 temp` trace 남아 있음(사용자 코드, handoff 4절 2번).
- `NodeAction`: killMonsters(108은 20, 그 외 25) → popChests(15) → getShrines → useWells 순서.
- `useWaypoint`: 루트 골레인(40)에서 Warriv가 50 안이면 1막 경유 — 의도(2막 시작점에서 WP가 멂).
- 원본 kolbot과 같은 동작: `moveTo` 반환은 마지막 처리 노드와의 거리 ≤5, `moveToUnit`은 PresetUnit이면 `pop`을 안 넘김, `plotCourse`의 `visitedNodes.indexOf`는 키가 아닌 값을 찾음(트리 구조라 실제 문제 없음).
