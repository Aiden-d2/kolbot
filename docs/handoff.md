# 인수인계 (미결만)

새 대화는 이 문서부터 읽는다. 항목은 상태별로 세 절에 둔다: 1절 `진행 여부 대기`(진행할지 말지 검토) / 2절 `구현 검토·수정 대기`(진행은 확정, 로직과 구현 방식 검토) / 3절 `인게임 검증 대기`(구현이 끝난 것을 실제 게임에서 검증). 진행이 정해지면 바로 2절로 옮기고, 같은 내용은 한 항목에만 둔다. 검증되면 지우고 `docs/code/`로, 기각되면 `docs/rejected.md`로 옮긴다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

## 1. 진행 여부 대기 (진행할지 말지 검토)

### 1-2. Monastery Gate 동선 H1 (`AutoSmurf.outer`, `Pather.moveToExit`)
- 문제(사용자 설명 261022): Tamoe Highland(7) → Monastery Gate(26) → Outer Cloister(27)로 갈 때 26의 모양이 특수해서, 가장 짧은 길이 아니라 벽 쪽으로 들어간 뒤 중앙 게이트를 거쳐 27로 넘어간다. 목적: 벽 쪽 진입 자리에서 게이트까지 가는 거리를 줄인다(게이트로 바로 도착하게 할 수 있는가).
- 사용자 아이디어(결정 아님): "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다."
- 261022 로그(`[exit] 26 -> 27`, 2게임 9줄, 모두 통과): 26 → 27 출구 점 `15140,5000`(보정 칸 `15140,5001`) = 게이트 위치(사용자). 26에서 이 줄을 찍을 때의 위치(26 진입 뒤) 약 `15180,5087` = 벽 쪽 진입 자리(사용자). 차이 x 40, y 87(직선 약 96).
- 지금 trace로 판정 못 하는 이유: `[exit]`는 26 안에서 26 → 27 출구를 고를 때만 찍는다(`me.area === 26`). 벽 쪽 진입을 정하는 7 → 26 출구 점(Tamoe Highland 쪽에서 고른 좌표)은 찍히지 않는다. 옛 가설 문구 "출구 점이 게이트 옆 벽인가"는 이 로그로 시험되지 않았다(틀렸다고 판정된 것 아님).
- 다음: `[exit]`는 261022 삭제(게이트·진입 자리 좌표는 위에 기록, 7 → 26 출구·동선은 이 줄에 없음). 새 검증 방법을 정한다(진행 여부 미정).

### 1-3. 부활형 우선: Fallen Shaman만 (검토 필요, 사용자 261022)
- 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류했었다.
- 261022 사용자: 범위를 Fallen Shaman만 우선순위에 두는 안으로 좁혀 검토한다.

## 2. 구현 검토·수정 대기 (진행은 확정, 로직과 구현 방식 검토)

261021 사용자 결정, 머지 뒤 다음 대화로 미룸.

### 2-1. 팀 싱크 확장 (3-1 검증 뒤)
- okCount(3-1)가 검증되면 readyCount·buffCount·syncBO(답장 BOCount·BOReady 대신 도착 이름)·카우(`msgFollower`)를 `teamNames`로. 한 단계로 둬도 됨(같은 이름이 연달아 불리지 않음).
- 확장 뒤 싱크 변수·플래그·메시지 이름 통일(`teamOk`/`teamReady`/`teamBuff`/`BOReady`, `imReady`/`myBuff`, `msgLeader`/`msgFollower`, 메시지 이름과 변수·함수 이름 겹침) (사용자 지시 261021).

### 2-2. print/trace 중복 정리 (18(2), 3절 검증 뒤)
- 3절 검증용 줄이 바뀌지 않도록 3절 검증이 끝난 뒤에 한다(사용자 결정 261021). 범위(print·trace 중복 / 콘솔+print 중복 / 로그 규칙 위반)는 그때 정한다.

### 2-4. 이동 무한 반복 막기, useUnit 조정 (`AutoSmurf.js` 호출부, `Pather.goWP`·`useUnit`, 사용자 결정 261022, 옛 1-1·1-4·1-7 합침)
- 목적: 실패했는데 throw가 없거나 catch가 막아 다음 코드가 실행되고, 없는 경로를 계속 다시 부르는 무한 반복을 막는다.
- ① 이동(moveTo 계열)을 감싼 호출부 catch를 없앤다 → `moveTo`의 경로 실패 throw(랜덤 걸음 10회 뒤)가 로더까지 올라가 게임 종료. 래핑 함수(`moveToExit`·`moveToUnit`·`moveToPreset`·`useUnit`)는 이미 전파하므로 바꾸지 않는다(`moveTo` 노드 루프의 try는 `finally`만). 막는 곳은 `AutoSmurf.js`의 이동을 감싼 catch와 `Pather.goWP`의 catch. 근거: 261022 로그에 `Misc.caughtError` 0건(catch로 복구된 사례 없음).
- ② `while (me.area !== N) { moveToExit(N) }` 꼴, 그리고 `moveToExit` 결과를 보지 않고 다음 지역 좌표로 가는 곳은 travel `default` 분기처럼 "moveToExit 3회 반복, 도착하면 break, 못 가면 throw"로 바꾼다.
- ③ `useUnit`에는 throw를 넣지 않는다(7회 실패면 지금처럼 false → ②의 호출부 3회 재시도가 받음). 근거: 261022 로그 7회 모두 실패 2건 중 a1 Jail 1층(06:33:57)은 travel `default`의 재시도로 06:34:09 2층 도착, a1 Flayer Dungeon 1층(07:03:58)은 게임 종료.
- ④ useUnit 조정(사용자 261022, 방법은 검토): 선택지 — 대기를 1~2초 늘림(대가: 진짜 실패 때 7회 × 늘린 시간) / timeout 뒤 무작위 이동 직전에 `moved()`를 한 번 더 확인 / 계단 유닛에서 `getNearestWalkable` 실패(사용자 관찰, 미확인: `moveToExit`의 `getNearestWalkable(currExit.x, currExit.y, 10, 2)`, `moveTo`의 `getNearestWalkable(x, y, 15, 2, 0x1)`).
  - 현재 값: 회차 7회(`//260903`), 열기 뒤 `delay(max(ping*2, 300))`, 회차 대기 `max(1000, ping*2+300)` + 로딩 중(`gameReady` false) 대기(`//260930`). 예전 약 2초였다가 줄였음(사용자 기억, 그 코드는 저장소에 없음).
  - 261022 로그 A유형: `[useUnit] timeout` 뒤 1초 안에 이미 다음 지역(Tal Rasha #4 01:04:08 → 01:04:08, Harem 1 02:03:40 → 02:03:41, Claw Viper 2 00:15:25 → 00:15:26, 핑 172~188) → 무작위 이동이 옛 지역 좌표로 가 경로 없음. B유형: 유닛 옆(dist 1~5)에서 7회 실패(Flayer Dungeon 1 → 2, unit `10116,8024`).
- 사례: `AutoSmurf.brain`이 `moveToExit([88, 89, 91], true)` 결과를 보지 않고 Level 3 좌표(91 프리셋 406)로 감(a1 Pz-52). `AutoSmurf.radament` 리더가 `moveToExit(49, true)` 결과를 보지 않고 `while (거리 > 40) { try { moveToUnit(3층 프리셋 355) } catch }` → 2층에서 무한 반복, 사용자가 손으로 3층으로 옮겨 풀림(10/22 11:30, a1).
- 범위: `AutoSmurf.js`의 `Pather.moveToExit(` 76곳 중 결과를 확인하는 곳 23곳(261022 셈), catch 31곳 중 이동을 감싼 곳. 문자열 검색 후보(탈출 조건은 하나씩 안 봄): `travel`(10073,8670), `cube` 상자, `tombs`(46 출구·상자), `radament`(48·프리셋 40), `duriel` Orifice, `mephisto` 빨간 포털, `farmingSummoner` 저널, `den`의 지역·마을 while. 공용 함수(3회 시도 후 throw)를 둘지는 수정 때 정한다(새 함수는 승인 필요). `while (!usePortal)` 대기 구문은 대상 아님(대기이지 없는 경로 반복이 아님, 사용자).

### 2-5. getWP random 좌표 제거 (`Pather.getWP`, 사용자 결정 261022, 옛 1-9 합침)
- 사용자 관찰: 플라이 소서가 웨이에 정확히 착지하지 못해 버벅거린다.
- 이유(코드 기준, 로그 확인 전): getWP는 웨이까지 > 5면 random 오프셋(`Pather.myX/myY`, 5 또는 대각 약 7.1, 부를 때마다 부호 반대)으로 최대 5회 이동해 왕복할 수 있다. `AutoSmurf.travel`이 getWP를 여러 번 부른다. goWP는 기준 10이라 10 안에 들어오면 반복하지 않으므로 그대로 둔다. getWP random을 없애면 goWP가 오프셋 자리(5~7칸)에 내린 뒤 getWP가 웨이 자체로 한 번 더 이동하고 끝난다.

### 2-7. chores 20초 이상 멈춤 (`Town.clearInventory`·`buyPotions`, 옛 3-8에서 이어짐, 사용자 261022, 옛 1-8)
- 사용자 판단: clearInventory든 buyPotions든 20초 이상 멈추는 조건이 어디서 생길 수 있는지 파악한다. 물약 문제이고 두 함수가 비슷한 로직을 가졌다면 둘 다 설명된다.
- 261022 로그: clearInventory 226건(5초 초과만 찍힘, 중앙 7.8초, 20초 이상 19, 최대 47.4초), buyPotions 302건(중앙 8.9초, 20초 이상 1(21.6초, a2 Lut Gholein), 최대 21.6초). `buy failed` 7건은 모두 a2 골드 부족. 긴 clearInventory가 여러 프로필에서 같은 시각에 몰림(22:13 a5·a7, 00:06 a4·a6·a7, 00:13 a2·a3, 02:05 a4·a5·a7). 게임 시작 직후만은 아님(20초 이상 19건 중 7건이 게임 시작 40초 안). 긴 사례 여럿(a6 00:06:18 47.4초, a7 00:06:02 21.7초)은 clearInventory 동안 ItemLog·trace가 없음 → 그 사례에서는 인벤토리 팔기·버리기(ItemLog 남김)·큐브 비우기(trace 남김)가 아님.
- 코드(261022 확인): `doChores` 순서 heal → identify → clearInventory → fillTome → buyPotions(제자리에서 돌아 heal NPC 앞에서 멈춘 것처럼 보임).
  - clearInventory 단계: ① 벨트 물약 되돌리기(인벤토리 물약마다 4열을 돌며 맞는 열에 클릭, 클릭마다 `delay(ping*2+200)`, 기록 없음) ② 큐브 비우기(trace) ③ 보관함 비우기(overhead만) ④ 인벤토리 팔기·버리기(ItemLog, 4는 `initNPC("Shop")` 뒤 판매).
  - buyPotions: `initNPC("Shop", "buyPotions")` → 벨트 4열마다 shift 구매(`delay(ping*2+200)`) 또는 열 칸 수만큼 구매 → HP·MP 버퍼 구매. 공통점: 둘 다 벨트 물약 열(`checkColumns`)을 다룬다. buyPotions는 NPC 열기(`initNPC`)도 있다.
- 지금 로그로 못 가르는 이유: 두 함수 모두 전체 시간만 찍혀 안의 어느 단계인지 모름.
- 판별 trace(261021, 옛 3-8, 코드에 있음): `chores slow: clearInventory/buyPotions Ns`(5초 초과, `Town.doChores`), `buyPotions: buy failed ...`(`Town.buyPotions`). 제거 조건: 원인이 정해지면 삭제.
- 검토할 것: 두 함수에서 20초 이상이 날 수 있는 반복·대기 조건(벨트 열 계산, 클릭·구매 실패 시 반복, NPC 열기 재시도)을 코드로 찾고 수정 방향을 정한다. Claude 제안(261022, 미결정): 단계별 시간 trace(5초 초과만) — 벨트 단계가 길면 물약 수·클릭 횟수, 보관함 단계가 길면 옮기던 물건을 본다.

### 2-8. 텔레포트가 제자리에 머묾 / 두 번에 한 번 씹힘 (`Pather.teleportTo`·`moveTo`, 사용자 관찰 261022, 옛 1-10)
- 사용자 관찰: 텔레포트 때 제자리 텔레포트, 또는 텔레가 두 번에 한 번 씹히며 제자리를 유지하는 모습.
- 261022 로그: `[teleportTo failed]`(10회 모두 실패) 25건 — a1 Chaos Sanctuary 02:36~02:40 11건, a2 Throne of Destruction 03:12~03:14 10건, a1 Halls of the Dead 1 00:07 3건, a1 Bloody Foothills 1건. 회차마다의 결과는 찍히지 않아 "두 번에 한 번"인지는 이 로그로 모름.
- 사용자 육안 관찰(261022): 화면 전환으로 보아 텔레 자체는 되는 것 같다. 위치가 거의 바뀌지 않는 좌표로 한 번 텔레하거나, 실패해 제자리 착지하는 경우 둘 중 하나로 보임. 서버가 West라 핑 차이 때문일 수도 있음(사용자 추정). 핑 문제라면 로그로 잡히지 않을 것 같다(사용자).
- 볼 곳(코드): `teleportTo`의 시전·대기(`docs/code/Pather.md` teleportTo 260930 "시전 동작 기준 대기"), `moveTo` 노드 루프의 SafeTele(`safeCheckNode`가 고른 칸), 노드 간격(`teleDistance` 35). 원인과 수정 방향을 검토한다.

### 2-9. 웨이 유닛 못 찾음 (`Pather.getWP`·`useWaypoint`, 옛 3-7 실패 2건, 사용자 261022, 옛 1-11)
- 사례: a1 Pz-49·50 Catacombs Level 2 `[getWP] waypoint unit not found` → `useWaypoint`가 그 자리에서 `wp.area:null` 12회 → throw → 게임 종료.
- 코드로 정해지는 것: `goWP` while은 프리셋 10칸 안이거나 10회 뒤 `[goWP] Failed` trace로만 끝난다 → 실패 줄이 없었으니 프리셋을 찾았다면 10칸 안에서 유닛 조회가 실패한 것. Pz-49는 `going to nearest WP`(프리셋 찾음) 확인. Pz-50은 d2bs 로그의 `going to nearest WP` 유무로 "프리셋 못 찾음(goWP가 움직이지 않음)"을 가른다(코드 수정 없음, 확인 전).
- 웨이는 `useUnit`을 쓰지 않는다(`getWP`·`useWaypoint`가 직접 `getUnit(2, "waypoint")`). 2-4 B유형(유닛을 찾아 옆에서 눌렀는데 못 넘어감)과 증상이 다르다(유닛 자체를 못 찾음).
- 검토할 것: 10칸 안에서 12회 조회가 모두 실패하는 원인 후보와 수정 방향.

## 3. 인게임 검증 대기 (구현이 끝난 것을 실제 게임에서 검증)

**261022 로그 결과와 다음 단계(사용자 결정 261022, 근거는 `log_results.md` 261022 묶음).** 3-2·3-5·3-9·3-15는 이번 로그로 통과했지만 사례가 적어 한 싸이클 더 관찰하고, 이변이 없으면 코드 노트로 옮긴다. 3-1·3-4·3-11도 한 싸이클 더 본다. 3-14는 통과해 `docs/code/Pickit.md`로 옮김.

261021 수정분(커밋 `eddab3a`·`ab94751`, 정적 분석만)과 261020 확인용 로그.

### 3-1. okCount 이름 수집 (`AutoSmurf.okCount`·`teamCount`·`missing`)
- 바꾼 것: 개수 대신 보낸 프로필 이름(`teamNames`, `this.missing(name)`). 두 단계 유지. ok 이름은 1단계 끝(teamCount 보내기 전)에, teamCount 이름과 teamOk는 2단계 끝에 비운다. 2단계 중 그 프로필의 teamCount보다 먼저 온 okCount는 버린다. 대기 delay 1000 → 200ms. teamOk는 게임 시작 첫 okCount(늦게 들어온 프로필은 앞사람들 ok를 못 받음) 때문에 유지.
- 근거: 끝 일괄 리셋은 연달아 호출(`okCount; doPrecast(true); okCount`)에서 가장 빠른 프로필의 다음 ok를 모두가 지우면 teamOk도 못 나와 멈출 수 있었다(코드 추론). 같은 사람의 메시지는 보낸 순서대로 도착(`sendCopyData` = 동기 `SendMessage`, 이벤트 큐 FIFO).
- 확인: 타임아웃 줄 `[Quit] Party desynced 1/2: missing(okCount|teamCount): 프로필, ... teamOk X`로 안 온 프로필이 남는가. 그 프로필의 같은 시각 trace로 무엇을 하던 중인지(마을행·포털 실패 등) 본다. 261021 전 로그는 `okCount N teamCount N teamOk X`(개수). `log_results.md` desync 분석의 판별 불가 5건(B 실제 지각 / C 리셋 경쟁)을 가르는 용도.

### 3-2. 메시지 중계 (`ToolsThread`, `AutoSmurf.onCopyData`)
- 바꾼 것: 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). ToolsThread가 default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). AutoSmurf 처리 본문은 `onCopyData`로 빼서 copydata·scriptmsg에서 부른다.
- 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → 2-1 확장 때 해소).
- 확인: okCount 대기 중 마을행(TownChicken·Pause)이 있었던 게임에서 desync 타임아웃이 없는가.
- 261022: 통과(`relay` 6건 중 마을 다녀온 직후 5건, 그 게임 desync 없음). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로.

### 3-4. SafeTele 몹 목록 범위 (`Pather` safeCheckNode)
- 바꾼 것: 몹 목록을 내 위치에서 `max(teleDistance, 노드 거리) + SafeTele.Range` 안으로(후보는 내 위치 35 안, 몹은 후보 Range 안만 셈 → 결과 같음).
- 확인: SafeTele 동작이 이전과 같은가(텔레 이동 중 멈칫·되돌아감 없음).
- 261022: `[SafeTele] monsters`로 거르기 양 확인(a1 평균 26마리 → 12마리). 결과가 같은 것은 거리 관계로 보장(후보는 내 위치 `teleDistance` 안, 몹은 후보 Range 안만 셈). 한 싸이클 더 본다.

### 3-5. Town check 직접 처리 (`Misc.townCheck`, `Town.visitTown`)
- 바꾼 것: default.dbj면 `visitTown` 직접(멈춤 없음). `visitTown`이 `goToTown` 동안 `Config.TownCheck`를 꺼(끝나면 원래 값) 포털로 가는 moveTo 안의 재진입을 막음(직접 호출·화살통 경로 모두). TownChicken(visitTown 안에서만 부름)·MapHelper(default와 동시에 움직임)는 기존 메시지.
- 확인: `Town check` 마을행이 정상 왕복하는가, 재진입(마을행 중 또 마을행) 없음.
- 261022: 통과(58건, 중첩 0). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로.

### 3-6. getQuestItem 사라진 유닛 (`AutoSmurf.getQuestItem`)
- 바꾼 것: `CanFit` 전에 유닛이 사라졌으면(`sizex` undefined, `JSUnit.cpp:191-194`) 다시 찾기 3회, 넘으면 `<classid> vanished`(`Not enough room`으로 가지 않음).
- 확인: trace `vanished` 줄, `Not enough room for undefined`가 사라졌는가.
- 261022 사용자 로그: 해소 안 됨. a1 하수구 3층 `radament book visible: true 9,5 1`(11:32:34) → `Not enough room for undefined`(11:32:37) → `[Quit] getQuestItem failed`. `vanished` 줄 없음, 인벤토리에 빈칸 있었음(사용자).
  - 코드(261022 확인): `CanFit`은 실제 아이템만으로 빈칸을 센다(`Config.Inventory` 잠금은 안 봄). `sizex` 확인 → `CanFit`(`FindSpot` 안에서 `Storage.Reload()`로 내 아이템을 다 훑은 뒤 `item.sizex/sizey`를 읽음) → 실패면 `canMakeRoom` → trace `item.name`. 이름이 undefined = trace 때 유닛 속성이 이미 사라짐.
  - 가설(추정): `sizex` 확인 뒤 `FindSpot`이 크기를 읽기 전에 유닛이 사라져(누가 주움) 크기가 undefined → 반복이 돌지 않아 "자리 없음". 지금 확인 위치가 너무 이르다. 누가 주웠는지·내가 가졌는지는 이 줄로 모름.
  - 수정 방향은 결정 전.
- `Not enough room for <이름>`(옛 3-13에서 합침): 이름이 undefined면 이 가설 쪽.

### 3-9. 콘솔·trace 추가
- 바꾼 것: 눈·심장·뇌 `!!! X !!!`(getQuestItem 성공, 리더), `D2Bot.printToConsole`이 `print("[console] " + msg)`도 함, `[useUnit] timeout`에 id·target·unit 좌표, 팔로워 파티 수락 trace, Life Chicken `mode`·`near` 삭제(`nearMonsters` 함수 삭제).
- 확인: 줄이 형식대로 찍히는가.
- 261022: 통과(눈·심장·뇌 콘솔 중복은 사용자 업로드 `d8af14f`에서 정리). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로. print 색 맞추기(옛 2-3)는 기각(`rejected.md` printToConsole).

### 3-10. 라다먼트 `radamentOff` (`AutoSmurf.radament`)
- 바꾼 것: N+1 `Radament book reset` 직전 리더 캐시 `radamentOff = true`. N+2 리더가 라다먼트 차례에 읽고 지운 뒤 콘솔 `Radament off: tombs, quit at 10 min` → `me.maxgametime = 10분`(엔진이 게임 시작부터 10분에 나감, 다음 게임에 default.dbj가 원래 값으로) → tombs 한 번. 라다먼트 차례엔 써모너가 끝나 리더는 캐니언 WP가 있고, 없는 팔로워는 리더 포털로 들어감. D2BS는 게임 단위 퀘스트 상태(완료 불가)를 읽는 함수가 없어 캐시 표시로 함.
- 확인: 북 분실 뒤 N+2 게임에서 콘솔 줄과 10분 퇴장, N+3에서 북 획득.
- 261022 사용자 수정(`8a7ff56`): N+2의 tombs는 `partyLevel(tombsLvl)`이 참이면 바로 break해 아무것도 안 했다 → `tombs(force)` 인자, 메시지 `forceTombs`(팔로워 `forceTombs` 플래그 → `tombs(true)`), 리더는 라다먼트 꺼짐 때 `forceTombs`를 보내고 `tombs(true)`. 확인: N+2에서 tombs가 실제로 돈다(구간 헤더 `=== [TOMBS] ===`와 이동 줄).


### 3-11. 보스가드·시체 회수 trace (`AutoSmurf.bossGuard`·`bossScan`·`bossEnd`, 261020)
- 용어: **보스가드 on/off**(`bossGuard()` 호출 ~ `bossEnd` 시작), **치킨 on/off**(LifeChicken 0 ↔ 원래 값). 목적: 발견부터 킬까지 치킨 %가 적정한지 보기. 일어나지 않은 사건은 찍지 않는다. `@` 시간은 found(아무 보스나 처음 본 때) 기준 초.

| 순서 | 위치 | trace |
|---|---|---|
| 1 | `bossGuard` 호출 | `bossGuard on: 15%` |
| 2 | `bossScan`, 처음 본 스캔 한 번(`guardStart`를 이때 넣음) | `bossGuard found: Andariel 100%` |
| 3 | `bossScan`, HP ≤ pct | `bossGuard chicken off: Andariel 14%@13.0s` |
| 4 | `bossEnd` 시작(`traceGuardSeen`) = 보스가드 off | `bossGuard last: Andariel 0%@16.1s` (마지막 보스의 마지막 발견 ≈ 킬, 스캔 1회 오차) |
| 5 | 치킨 복구(산 사람 okCount 뒤 / 죽은 사람 부활 직후) | `bossGuard chicken on: 35%` (치킨 off가 있었을 때만) |

- 치킨이 꺼져 있던 시간 = 4번 − 3번. 치킨 off가 없으면 3·5번이 없고, 보스를 못 보면 2~4번이 없다. 에인션트는 2번이 처음 본 고대인, 4번이 마지막 고대인. 써모너(pct 100)는 3번이 `@0.0s`.
- 읽을 때: 보스전 중 죽었거나 타운치킨으로 마을에 다녀온 프로필은 그동안 스캔이 없어 4번이 실제 킬보다 이르다(동작 문제 아님).
- 시체 회수(죽어 있던 프로필): `revive start`(위치 = 죽은 지역·좌표) → 5번 → `corpse picked`. 실패는 `[Quit]` 줄(`Revive failed`, `Corpse portal not found`, `Failed to get corpse: not seen / far N / died / timeout`), okCount 타임아웃 `Dead wait timeout`.
- 현재 값(사용자 수정): 써모너 100(처음 본 스캔에서 끔), 쉥크 50, 에인션트 10이고 살아 있는 고대인 2마리 이하. bossEnd 시체 회수 동안 `Config.TownCheck` 끔.
- 제거 조건: 다음 로그에서 치킨 % 판단이 끝나면 삭제(사용자 결정에 따름).
- 261022: 결과 나옴(사망 0, 가드 중 Life Chicken 0, 보스별 표는 `log_results.md`). 한 싸이클 더 본다.

### 3-12. 골드 나눔 줄 (`AutoSmurf.giveGold`, 261020 사용자)
- 동작: 주는 양 = 골드 − LowGold, 그것이 1000 미만이면 골드 − 5000. 리더가 골드를 받는 것이 LowGold보다 우선(사용자 의도). 예전 식은 LowGold 아래 팔로워의 양이 음수가 되어 실제로 주고받지 못했음.
- 확인: trace `Picking up/Dropping/Retaking N Gold`가 음수 없이 찍히고 리더가 받는가. 확인 뒤 줄 삭제.
- 261022: 음수 없음. 리더가 00:16 게임 7더미 중 3, 02:41 게임 8더미 중 5만 받음. 리더는 더미마다 `delay(1000)` → 줍기 → 보관함 넣기를 반복해 더미당 4~9초, 팔로워는 버린 뒤 15초에 `Retaking`(바닥의 아무 더미). 시각이 맞는 설명이나 원인 확정 아님(02:41 게임 리더 19초 빈 곳은 원인 모름).
- 261022 사용자 수정(`bb94fac`·`284a5aa`): `pickGold` 반복 15회 × 1초 → 50회 × `ping*2+100`, 시작 때 보관함 넣기 삭제, 보관함 넣기 조건 골드 있음 → `charlvl × 10000` 이상, `giveGold` 대기 15초 → 10초(다시 줍기 `i >= 9`), 그 밖 `ping*2+500` → `ping*2+200`. 그래도 문제면 재논의.
- 확인: 리더가 모든 더미를 받는가(`Picking up` 수 = `Dropping` 수).

### 3-13. 라다먼트 북 버리기 (`AutoSmurf.start`, `dropping radament book`)
- 바꾼 것(`47816e6`): 시작 단계 북 버리기 무한 루프 수정. 버릴 때마다 trace `dropping radament book`.
- 확인: 북을 가진 채 시작한 게임에서 이 줄 뒤 정상 진행(무한 반복 없음). 확인 뒤 줄 삭제.

### 3-15. 소켓 보석 (`Pickit.checkItem`·`socketTargets`·`pickItem`, `Town.socketGems`·`doChores`, `Misc.itemLogger`, 261021)
- 바꾼 것(사용자 결정 261021):
  - 대상(`Pickit.socketTargets`): 내 장착 칸 1(머리: 투구·바바·드루 전용·서클릿)·3(몸)·4·5(양손 칸은 칸이 아니라 종류로: 방패류 2·69·70이면 방패, 그 밖은 무기(캐릭 레벨 18 이하) — 활·지팡이·양손 무기·바바 두 번째 무기가 칸 5에 있어서, 261021 사용자 결정) 중 티어가 있고(`NTIP.GetScore > 0`) 빈 소켓이 있으며 룬워드 베이스 재료가 아닌 것(`Config.Runewords`에서 classid 같고 `getBase` 참). 보석 종류(itemType, 등급 무관): 헬름·아머 루비, 무기 루비·토파즈·사파이어·에메랄드, 방패 다이아. 용병 제외.
  - 줍기(`checkItem` 결과 5, Cubing 판정 앞): 바닥·인벤토리 보석만, 보석 레벨 제한 ≤ 캐릭 레벨. 인벤토리 보석(자기 제외, gid 순)을 대상 순서대로 미리 배정하고, 빈칸이 남은 대상이 이 보석을 받으면 5. nip 무관, 스태시로 가지 않음. 필요 없어지면 기존 판정(큐빙 2 / 0은 팔거나 버림).
  - 줍기 직후(`pickItem` case 5): overhead `(Ingredient)`, ItemLog `Ingredient {socket}`.
  - 장착(`Town.socketGems`, `doChores`의 `stash()` 뒤): `me.cancel()` 뒤 대상마다 인벤토리 보석(gid 순)을 들고 `clickItem(0, 칸)`. 스태시는 열지 않음. 성공 시 ItemLog `Socketed`(장비 옵션 전체 + `{보석 [칸] 찬/전체, Tier 전 -> 후}`), 하나라도 성공한 칸은 `Equip.updateTier(칸, true)`. 실패 시 커서 보석은 인벤토리로, 안 되면 `Packet.dropItem` 뒤 `Pickit.pickItems()`. trace `socketGems failed: <보석> -> [칸] <장비>`(드롭했으면 `(dropped)`).
- 1차 게임 결과(261021, 사용자 로그): 줍기·대상 선정은 됨. 장착은 매번 `socketGems failed: Chipped Sapphire -> [ArmR] Spiked Club`(창을 닫은 채 장착 칸 클릭). 소켓은 비어 있었고 사용자가 인벤토리를 연 채 손으로 넣으니 들어감. `clickItem(0, 칸)`은 클라이언트의 장착 칸 클릭 함수를 그대로 부른다(D2BS `JSGame.cpp:431-439`). 인벤토리만 여는 호출은 D2BS·kolbot 계열에 없음.
  - 가설: 장착 칸 클릭은 인벤토리 창이 닫혀 있으면 소켓을 넣지 않는다(추정).
  - 수정(261021, 사용자 결정): 대상이 있으면 `me.cancel()` 대신 `Town.openStash()`(인벤토리 창도 열림, 못 열면 trace `socketGems failed: stash not opened`), 끝에 `me.cancel()`. 실패 trace에 `(cursor)`(클릭 뒤 커서에 보석이 남음, 원인 가린 뒤 삭제). 드롭했으면 창을 닫고 다시 주운 뒤 이번 방문은 끝.
  - 판정: ItemLog `Socketed`가 나오면 가설 맞음. `(cursor)` 실패가 계속되면 다음은 장착 중 패킷 0x28, 그다음 SoloPlay 방식(장착 해제 → 아이템 좌표 클릭 → 다시 장착).
  - 2차 결과(261021, 사용자 로그): 보관함을 연 채 장착 칸 클릭도 `(cursor)` 실패(1건) → 창 가설은 틀림. 클릭 대신 `sendPacket(1, 0x28, 4, 보석 gid, 4, 장비 gid)`(보관함 연 상태)로 바꾼 시험판은 4개 프로필 5건 모두 ItemLog `Socketed`(툴팁에 보석 옵션 즉시 반영, 한 방문 두 칸 연속 가능, 마법 Targe Tier 13 -> 15, 노멀은 1 고정). 이 변경은 아직 커밋 전(사용자 시험 중).
  - 다음 확인(사용자 시험 중): 보관함을 열지 않고(`me.cancel()`만) 0x28이 되는가. D2MOO 0x28 처리는 상호작용 대상(보관함 등)이 있을 때만 넣는다(`PlrMsg.cpp:2543-2556`, 1.10f 재구성이라 추정)라 안 될 수 있음. SoloPlay도 보관함을 연 뒤 0x28. 결과와 더 모은 로그를 보고 커밋·`(cursor)` 유지 여부·3-15 정리를 정한다.
  - 3차 결과(261021, 사용자 로그): 보관함을 열지 않고(`me.cancel()`만) 0x28 성공. a6 드루 Wolf Head에 사파이어 2개(사용자 로컬 시험으로 머리 보석을 사파이어로 바꿈, 저장소 미반영) `Socketed` 1/2·2/2, Tier 1 -> 1 -> 11. → 보관함 열기는 필요 없다(D2MOO 상호작용 조건은 1.14d와 다르거나 재구성 차이, 추정). 저장소 작업 트리는 아직 보관함 + 0x28 판, 커밋 전.
- 4차 변경(261021, 사용자 결정, 작업 트리·커밋 전): 소켓 뒤 `Equip.updateTier(칸)` 출력(`equipped: [칸] 티어`, 티어 변화는 ItemLog와 따로 알아야 함). 부위별 보석을 `Config.SocketGems = {Head: [99], Body: [99], Shield: [97], Weapon: [99, 101, 100, 98]}`로(itemType 96~102 = 전 등급, classid 557~601 = 그 등급만, 빌드에서 덮어씀, 빌드 값은 나중). 보석 관문은 96~102 전체. 무기 레벨 18 제한 제거(나중에 룬으로 대체).
- 실패 trace `(cursor)`(Claude 추가 261021): 한 사이클(다음 로그 묶음) 더 보고 그때도 0x28 실패가 0건이면 삭제(사용자 결정 261022). 261022 묶음은 0x28 23건 성공, 실패 0.
- 5차 변경(261022, 사용자 결정, 옛 2-3 포함): 로그 이름 `Socketed` → `Gemmed`(룬워드가 안 되는 소켓 작업은 모두 젬드). ItemLog `Gemmed {nip 라인}`(넣은 뒤 `NTIP.Evaluate`, 보석·칸·티어 표시 삭제). 매니저 아이템 로그 `Misc.logItem("Gemmed", 장비, 라인)`(다른 로그와 같은 형식, 지역도 붙임: `logItem` 지역 조건에 gemmed). 매니저 콘솔 `# [Gem] 보석 베이스 (찬/전체)` 색 5(베이스는 `getLocaleString(getBaseStat(0, classid, "namestr"))`, 큐빙 콘솔 줄과 같은 방식). 젬드용 보석 Ingredient `{가진 개수}`(다른 재료와 같게). print `equipped: [칸] 티어`는 그대로.
  - 확인: 콘솔 `# [Gem]`의 베이스 이름이 접두·접미 없이 나오는가, 매니저 아이템 로그에 그림·옵션·라인·지역이 다른 로그처럼 나오는가.
- 나중(사용자 결정): 빌드별 보석 종류 Config(itemType 또는 classid로 등급 지정 가능), 무기 룬 확장, 용병.
- 참고(Claude 조사): kolbot-SoloPlay `SoloWants.js`·`ItemUtils.js`가 비슷한 설계(퍼펙트만 기다림, 장착 해제 뒤 패킷 0x28). D2MOO 서버는 장착 중 아이템 소켓을 허용(`Rcv0x28_SocketItem`), 보석 스탯은 장비 스탯에 합쳐짐(`STATLIST_MergeStatLists`, 클라이언트는 미확인).
- 확인:
  - ItemLog `Ingredient {socket}`로 빈 소켓 수만큼만 줍는가(넘게 줍지 않는가).
  - ItemLog `Socketed`가 남고, 옵션에 보석 효과(루비 생명, 다이아 저항 등)가 바로 보이며 `Tier 전 -> 후`가 오르는가(노멀 등급은 티어 고정이라 같을 수 있음). 장착 칸 클릭으로 실제 들어가는가.
  - trace `socketGems failed` 빈도와 이유, `(dropped)` 뒤 다시 주웠는가.
  - 룬워드 베이스(예: 빈 3소켓 브레스트플레이트)·티어 없는 장비에는 넣지 않는가. 레벨 19 이후 무기용 보석이 정리되는가.
- 261022: 통과(0x28 뒤 `Socketed` 23건, 실패 0). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로. a1 머리 칸 사파이어(23:58)가 코드 버전 차이인지는 사용자 확인 전.

### 3-16. 스태프 콘솔 줄 (`AutoSmurf.getQuestItem`, 261022 사용자 발견·수정)
- 문제: `d8af14f`에서 넣은 `if (classid === 356)`이 상자 id(356)를 봐서 참이 될 수 없었다(호출은 `getQuestItem(92, 356)`, 92 = Staff of Kings).
- 바꾼 것(사용자 `8a7ff56`): 조건 `classid === 92`.
- 확인: 스태프를 주우면 리더 콘솔에 `=== STAFF ===`가 찍힌다.

### 3-17. MoveToSlot 실패 원인 판별 (`Storage` MoveToSlot, `PartyThread` 파티 수락, 옛 1-6)
- 실패 줄 유지, `inv:` 필드는 삭제(261020). 실패 34건 중 33건 `closed`·1건 `-`, 창을 여는 코드가 없어 성공도 `closed`일 것 → 창 상태로는 판별 불가.
- 판별 trace(261021, 3-9에서 추가): 팔로워 파티 수락 `party accept: 이름`(`PartyThread`). 실패 줄 `[MoveToSlot] ... FAILED`와 같은 시각(같은 초)에 수락이 있으면 수락 클릭이 옮기던 물약을 방해한 것으로 본다(가설). 겹침이 없으면 이 가설은 틀림.
- 261022 로그: `party accept` 579줄, MoveToSlot 실패 0건(65게임) → 판정할 사례 없음. 실패가 다시 나오면 판정.
