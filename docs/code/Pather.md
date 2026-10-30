# libs/Pather.js

(값(SafeTele·Dodge 등)은 자주 바뀌므로 적지 않는다. 지금 값은 `libs/Config.js`를 본다.)

## NodeAction.killMonsters

### 260927 사용자: spectype 인자 제거, 이동 중단 반환
- 카오스(108)는 `clear(20)`, 그 외 `clear(25)`. clear가 false면 `"killMonsters"`를 돌려 이동을 멈춘다(false는 사망·카우킹·스킬 미보유 정지일 때만).
- 260930 유지 결정(사용자): 문자열이라 `if (!moveTo(...))`는 성공으로 읽지만, false에 대응하는 호출부는 카우 레벨뿐이다.

## NodeAction.popChests

### 260928 Claude: 상자는 Pather가 연다
- clearPath 이동 노드마다 `Misc.openChests(15)`(`Config.OpenChests: 2`). NodeAction 순서: killMonsters → popChests → getShrines → useWells. 상자 제외 조건은 `Misc.md` openChests.

## PathDebug.drawPath

### 261013 사용자: 경로 그리기 켬 (`enableHooks = true`)
- 경로 노드를 이은 선을 자동지도 좌표 `Line`으로 그린다. D2BS는 automap 훅을 자동지도(Tab)가 켜져 있을 때만 그리고, 게임 화면에는 안 그린다. 선은 moveTo가 도는 동안만 남는다(새로 계산할 때마다 다시 그림, 끝에서 지움). 안쪽 moveTo(setPosition 우회 등)가 돌면 바깥 경로 선이 안쪽 경로로 바뀐다.

## moveTo

### 260930 Claude: 텔레 경로가 마을로 들어가면 걷기
- `useTeleport`는 시작 때 한 번 정해진다. 텔레포트 경로가 마을로 들어가면(a2 Blood Moor → 로그 캠프, teleportTo failed 3회) 걷기로 바꾸고 걷기 경로로 다시 계산.

### 261001 Claude: SafeTele 발동 조건 (`SafeTele.Count` 삭제)
- 목표 노드 몹 수가 0이면 그대로, 1마리부터 발동. 동작 변화 없음(Count가 1이었다).
- SafeTele와 setPosition 회피는 같은 몹 수 함수(`Attack.getMonsterCount`, 반경 이하)를 쓰지만, SafeTele는 나 중심 링(노드 방향 ±Angle)에서 노드 대신 설 자리를, setPosition은 대상 중심 링에서 시전 자리를 고른다. 목적이 달라 후보 방식이 다르다(260930 대조).

### 261003 Claude: SafeTele 후보 순서 (사용자 결정·요청)
- `safeCheckNode`가 후보 좌표를 모두 만든 뒤 원래 타겟노드와의 거리 오름차순(동점은 먼 링, 그다음 생성 순서)으로 한 번에 검사한다. 0마리면 즉시 채택, 없으면 최소. 최근 5자리 5칸 안은 제외(맴돌기 방지). 마지막 노드는 SafeTele를 거치지 않는다.
- 이유: 전에는 바깥 링이 각도보다 먼저라, 각도를 넓히면 바깥 링의 옆자리가 안쪽 링 정면보다 먼저 뽑혔다. 원래 타겟노드는 경로상 최적 지점이므로 거기서 멀수록 목적지에서 멀어진다고 보고, 그 거리 하나로 순서를 정한다.

### 261022 Claude: SafeTele 후보 검사 순서·설정 복원 (`482171b`, 옛 handoff 2-12·3-24)
- `safeCheckNode`가 후보마다 몹 수를 먼저 세고 `mc >= baseline`이면 건너뛴다. 적을 때만 `checkSpot`(처음 보는 방이면 `room.getCollision()` 복사)을 하고 통과하면 채택. 고르는 자리는 전과 같다.
- `Config.SafeTele`의 Angle·Step·Min을 10-03~10-19 값으로 되돌림(후보 35 → 70개).
- 목적: 후보 70개 설정에서 렉이 있었으므로, 몹 수로 먼저 걸러 `checkSpot`을 부르는 횟수를 줄인다.
- 확인: 261023 사용자 육안 검증 통과.

### 261021 Claude: SafeTele 몹 목록 범위 (`eddab3a`·`ab94751`, 옛 handoff 3-4)
- 몹 목록을 내 위치에서 `max(teleDistance, 노드 거리) + SafeTele.Range` 안으로 거름. 후보는 모두 내 위치에서 `teleDistance` 안, 몹은 후보에서 Range 안만 세므로 고르는 자리는 같다(남는 차이는 후보 좌표 반올림의 1칸 미만 경계).
- 확인: 261022·261023 `[SafeTele] monsters`(a1 평균 26 → 12마리, 29 → 14마리). 검증 통과(사용자 261023). 확인 줄과 `monAll`은 261023 `0f6da09`에서 삭제(옛 handoff 3-28). 261025 로그에 `[SafeTele] monsters` 0(검증 통과 사용자 261025).

### 261025 Claude: SafeTele 발밑 노드 제외·excludedNodes 삭제 (`d93027d`·`13ebf32`, 사용자 결정, 옛 handoff 2-8·3-34)
- SafeTele는 내 위치에서 5칸 넘게 떨어진 노드에서만 발동한다(`getDistance(me, node) > 5`). 경로를 처음 만들 때와 안전 좌표(`safeNode`)로 텔레한 뒤 다시 만들 때 첫 노드가 내 위치라, 거기서 `safeCheckNode`가 돌면 방향이 `atan2(0, 0)` = 0(동쪽) ±75°가 되어 경로와 무관한 안전 좌표로 텔레했다(코드 읽음). 기준 5칸은 엔진이 막힌 출발 칸을 옮겨(`MutatePoint`) 첫 노드가 2.8칸까지 어긋날 수 있는 것과 `teleportTo` 도착 판정 5칸에 맞춤. 5칸 안 노드는 후보가 최소 10칸(`Min`)이라 SafeTele가 쓸모없다.
- 최근 5자리 5칸 안 후보 제외(`excludedNodes`) 삭제(261003 항목의 "맴돌기 방지"). 몹이 움직여 예전 자리를 막는 것이 안전 판단이 아니고, 발밑 노드를 막으면 실효가 없다.
- 원래 노드로 이동하는 조건(`getDistance(me, node) > 2`)과 나은 자리가 없으면 원래 노드로 텔레하는 흐름은 그대로.
- 확인: 사용자 육안 검증 통과(261028). 261026~261028 Life Chicken 46·47·46(261025 54).

### 261030 Claude: 경로 콘솔 줄·random 되돌림 trace 삭제 (사용자 요청, 옛 handoff 3-50)
- 콘솔 5줄 삭제(`no random path`, `original path`, `no original path`, `adjusted path`, `fixed path`, 사용자 임시 확인용이었음). random 되돌림 trace `no random path`·`original path`와 trace만 있던 `if` 블록 삭제(3-50 검증 통과, 되돌림 동작은 그대로).
- 남김(trace만): 원래 좌표에도 경로가 없을 때의 사슬 `no original path` → `adjusted path` / `no adjusted path` → `fixed path` → throw. 아케인처럼 목표에 길이 없는 경우를 추적한다(사용자 261030).

## teleportTo

### 260930 Claude: 시전 동작 기준 대기
- 고정 대기 대신 `me.attacking` 기준: max(200, ping×2) 안에 시전 동작이 안 시작되면 바로 재시전, 시작됐으면 끝날 때까지 기다리고(겹쳐 시전 안 함), 끝났는데 제자리면 바로 재시전. 회차당 최대 2초 × 10회. maxTeleDistance(45) 검사 삭제.
- 근거: 서버가 받아들인 요청도 1초 가까이 걸릴 수 있어, 짧은 대기는 느린 요청을 겹쳐 보내게 만들었다.

## moveToUnit

### 261029 Claude: PresetUnit 분기 random 전달 (`f23417c`, PR #113, 사용자 요청, 옛 handoff 3-50)
- PresetUnit 분기에서 `pop`·`random`을 `moveTo`로 넘긴다. 전에는 버려져 프리셋을 넘긴 random 호출(anya `moveToUnit(프리셋 460, …, true)`)에 random이 적용되지 않았다.
- 확인은 `AutoSmurf.md` 흩어지기 261029와 같다. 검증 통과(사용자 261030).

## useUnit

### 260930 Claude: 대기와 로딩
- 대기 max(1000, ping×2+300) + 로딩 중(`gameReady` false) 대기. 회차 시작에 "이미 넘어갔으면 끝"(로딩 중·직후 옛 유닛으로 이동·클릭 방지, 판데모니움→해로가스 포털 `dist:74` 사례).

### 261021 Claude: timeout trace 상세 (`ab94751`, 옛 handoff 3-9)
- `[useUnit] timeout iter: dist: ping: area: id: target: unit:x,y`에 id(LvlWarp `Id`)·target·unit 좌표 추가.

### 261022 Claude: 계단 클릭 앞 대기·옆 자리 이동 (`482171b`, 사용자 확정, 옛 handoff 2-4 ④·3-20)
- 계단 타일(type 5) 클릭 앞 `delay(600)`(오브젝트는 그대로), 클릭 뒤 대기에 걷기 가드(모드 2·3·6이면 상한 4초), 회차 7 → 8, 유닛 위로 붙이는 판정 `> 5` → `> 7`. timeout 뒤 무작위 걸음(내 위치 ±3칸) 대신 유닛 좌표 기준 4방향(±x, ±y) 4칸 자리를 차례로(막힌 자리·내 위치 2칸 이하 자리 건너뜀, 텔레 `teleportTo(x, y, 2)` / 걷기 `walkTo(x, y, 2)`). timeout 직후 이미 넘어갔으면 옆 이동 없이 return(옛 지역 좌표로 텔레 반복 방지). 첫 클릭은 지금 자리에서.
- 근거(`log_results.md` 261022 묶음 2): timeout 414줄 중 a1 350줄, 걷는 프로필은 39연속 중 36개가 1회 뒤 성공 → "텔레 직후 클릭이 무시됨"(추정)에 가까움. 원본 kolbot은 클릭 앞 300ms, 대기 3000ms.
- 확인: 261023 로그(119게임) timeout 34줄(a1 15줄·12연속), 8회 모두 실패 0. 검증 통과(사용자 261023). 다음 단계 `me.attacking` 게이트는 handoff 2-19.

## useWaypoint

### 260930 사용자: 루트 골레인 Warriv 경유 (의도)
- 루트 골레인(40)에서 Warriv가 50 안이면 1막 경유. 2막 시작점에서 WP가 멀어 1막 WP가 빠르다.

## makePortal

### 260930 Claude: 늦게 뜬 포털 처리
- `oldGid`를 첫 시전 전에 한 번만 잡는다(매 회차 다시 잡아 늦게 뜬 내 포털을 옛것으로 보고 다시 시전하던 문제). 회차 시작에 늦게 뜬 포털이 있으면 다시 시전하지 않고 쓴다. 대기 max(1000, ping×2+300).

## usePortal

### 260930 Claude: 대기와 로딩, 빨간 포털
- 파란 포털 대기 max(1000, ping×2+300), 빨간 포털 1500ms. 로딩 중(`gameReady` false)엔 대기·재전송 없음. 성공 판정은 로딩 뒤(`me.area`는 로딩 중 undefined). flash(3회마다)는 유지.
- 근거: 260926 `usePortal 342` 로그 47회 전부 102→103 성공, 1회 35·2회 9·3~5회 3, 성공은 전송 뒤 약 1초 안. 확인: 261006 로그에서 빨간 포털 통과(옛 인게임 검증 2번).

## goWP / getWP

### 261021 Claude: 웨이 앞 random 이동
- goWP(프리셋까지 > 10)·getWP(웨이까지 > 5) 이동에 random(프로필별 오프셋 `Pather.myX/myY`)을 줘 팀이 웨이 앞 한 칸에 겹쳐 서지 않게 함. 같이 `AutoSmurf.clickWP`를 지우고 `Pather.getWP`(area 없으면 `me.area`)로. getWP 쪽 random은 왕복 우려로 제거하기로 함(handoff 2-5).

### 261022 Claude: getWP 웨이 앞 random 제거 (`ae1767b`, 옛 handoff 2-5·3-18)
- getWP가 웨이까지 > 5일 때 부르는 `moveToUnit(wp, 0, 0, false, false, true)`에서 random 인자를 지움. goWP(프리셋 > 10)의 random은 유지.
- 이유: 대각 오프셋(약 7.1) 프로필은 도착해도 늘 5를 넘고, 오프셋 5 프로필도 1칸 어긋나면 넘어 부를 때마다 반대편으로 왕복했다(플라이 소서 웨이 착지 버벅임, 사용자 관찰).
- 확인: 261023 사용자 육안 검증 통과.
