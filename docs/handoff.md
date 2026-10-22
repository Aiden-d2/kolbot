# 인수인계

새 대화는 이 문서부터 읽는다. 절과 흐름은 `CLAUDE.md` 5절을 따른다.
- 1절 `진행 여부 대기`: 문제(사례) / 확인된 것 / 판단에 필요한 것
- 2절 `구현 검토·수정 대기`: 확인된 것 / 가설 / 구현안(대상 함수, 수정 규모) / 검증 방법
- 3절 `인게임 검증 대기`: 바꾼 것(커밋) / 검증 방법 / 결과(로그 묶음별)
- 흐름: 1 → 2(진행 결정) → 3(수정 완료) → 코드 노트(검증 통과). 3 검증 실패는 실패 사례를 붙여 2로. 기각은 `rejected.md`. 같은 내용은 한 항목에만, 옮길 때 `옛 N-N`. 지운 번호는 다시 쓰지 않는다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

## 1. 진행 여부 대기 (진행할지 말지 검토)

### 1-2. Monastery Gate 동선 H1 (`AutoSmurf.outer`, `Pather.moveToExit`)
- **문제**(사용자 261022): Tamoe Highland(7) → Monastery Gate(26) → Outer Cloister(27)로 갈 때 26의 모양이 특수해서, 가장 짧은 길이 아니라 벽 쪽으로 들어간 뒤 중앙 게이트를 거쳐 27로 넘어간다. 벽 쪽 진입 자리에서 게이트까지 가는 거리를 줄일 수 있는가(게이트로 바로 도착).
- **확인된 것**
  - 261022 로그(`[exit] 26 -> 27`, 2게임 9줄, 모두 통과): 26 → 27 출구 점 `15140,5000`(보정 칸 `15140,5001`) = 게이트 위치(사용자). 26 진입 뒤 위치 약 `15180,5087` = 벽 쪽 진입 자리(사용자). 차이 x 40, y 87(직선 약 96).
  - `[exit]`는 26 안에서 26 → 27 출구를 고를 때만 찍었다. 벽 쪽 진입을 정하는 7 → 26 출구 점은 찍히지 않았다. 옛 가설 "출구 점이 게이트 옆 벽인가"는 시험되지 않았다(틀렸다고 판정된 것 아님). `[exit]`는 261022 삭제.
- **판단에 필요한 것**: 진행할지, 한다면 7 → 26 출구 점·동선을 볼 검증 방법. 사용자 아이디어(결정 아님): "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다."

## 2. 구현 검토·수정 대기 (진행은 확정, 로직과 구현 방식 검토)

### 2-1. 팀 싱크 확장 (`AutoSmurf` readyCount·buffCount·syncBO·카우, 3-1 검증 뒤)
- **구현안**: okCount(3-1)가 검증되면 readyCount·buffCount·syncBO(답장 BOCount·BOReady 대신 도착 이름)·카우(`msgFollower`)를 `teamNames`로. 한 단계로 둬도 됨(같은 이름이 연달아 불리지 않음). 확장 뒤 싱크 변수·플래그·메시지 이름 통일(`teamOk`/`teamReady`/`teamBuff`/`BOReady`, `imReady`/`myBuff`, `msgLeader`/`msgFollower`, 메시지 이름과 변수·함수 이름 겹침) (사용자 지시 261021).
- **선행 조건**: 3-1 검증.

### 2-2. print/trace 중복 정리 (여러 파일, 3절 검증 뒤)
- **구현안**: 범위(print·trace 중복 / 콘솔+print 중복 / 로그 규칙 위반)는 그때 정한다.
- **선행 조건**: 3절 검증용 줄이 바뀌지 않도록 3절 검증이 끝난 뒤(사용자 결정 261021).

### 2-4. 이동 무한 반복 막기, useUnit 조정 (`AutoSmurf.js` 호출부, `Pather.goWP`·`useUnit`, 사용자 결정 261022, 옛 1-1·1-4·1-7)
- **확인된 것**
  - 래핑 함수(`moveToExit`·`moveToUnit`·`moveToPreset`·`useUnit`)에는 catch가 없고, `moveTo` 노드 루프의 try는 `finally`만 있다. `moveTo`는 랜덤 걸음 10회 실패 뒤 throw한다. 막는 곳은 최종 호출부의 catch(`AutoSmurf.js`)와 `Pather.goWP`의 catch.
  - `useUnit`은 7회 실패면 throw 없이 false, `moveToExit`도 false만 돌려준다 → `while (me.area !== N) { moveToExit(N) }` 꼴은 catch를 없애도 계속 돈다.
  - 261022 로그(8프로필 65게임)에 `Misc.caughtError` 0건 → catch로 복구된 사례 없음.
  - 사례: `AutoSmurf.brain`이 `moveToExit([88, 89, 91], true)` 결과를 보지 않고 Level 3 좌표(91 프리셋 406)로 감(a1 Pz-52, Flayer Dungeon 1 → 2 useUnit 7회 실패 → 게임 종료). `AutoSmurf.radament` 리더가 `moveToExit(49, true)` 결과를 보지 않고 `while (거리 > 40) { try { moveToUnit(3층 프리셋 355) } catch }` → 2층에서 무한 반복, 사용자가 손으로 3층으로 옮겨 풀림(10/22 11:30, a1).
  - useUnit 7회 모두 실패 2건(261022): a1 Jail 1층(06:33:57)은 travel `default`(`for (i < 3) { moveToExit; 도착이면 break }`, 못 가면 `throw "Travel failed"`)의 재시도로 06:34:09 2층 도착, a1 Flayer Dungeon 1층(07:03:58)은 게임 종료.
  - useUnit 현재 값: 회차 7회(`//260903`), 열기 뒤 `delay(max(ping*2, 300))`, 회차 대기 `max(1000, ping*2+300)` + 로딩 중(`gameReady` false) 대기(`//260930`). 예전 약 2초였다가 줄였음(사용자 기억, 그 코드는 저장소에 없음).
  - useUnit 실패 A유형(261022): `[useUnit] timeout` 뒤 1초 안에 이미 다음 지역(Tal Rasha #4 01:04:08 → 01:04:08, Harem 1 02:03:40 → 02:03:41, Claw Viper 2 00:15:25 → 00:15:26, 핑 172~188) → 무작위 이동이 옛 지역 좌표로 가 경로 없음. B유형: 유닛 옆(dist 1~5)에서 7회 실패(Flayer Dungeon 1 → 2, unit `10116,8024`).
- **가설**
  - A유형은 대기 중 넘어가는 중이었을 가능성이 크다(추정). 핑·서버 지연인지 로딩 시간인지는 미확인(같은 막 안 층 이동에서 `gameReady`가 false가 되는지 미확인).
  - B유형은 계단 유닛에서 `getNearestWalkable`이 걸을 칸을 못 찾는 것과 관련(사용자 관찰, 미확인: `moveToExit`의 `getNearestWalkable(currExit.x, currExit.y, 10, 2)`, `moveTo`의 `getNearestWalkable(x, y, 15, 2, 0x1)`).
- **구현안**(결정된 방향, 사용자 261022)
  - ① 이동(moveTo 계열)을 감싼 호출부 catch를 없앤다 → throw가 로더까지 올라가 게임 종료. 대상: `AutoSmurf.js`의 이동을 감싼 catch, `Pather.goWP`의 catch. 래핑 함수는 바꾸지 않는다.
  - ② `while (me.area !== N) { moveToExit(N) }` 꼴, `moveToExit` 결과를 보지 않고 다음 지역 좌표로 가는 곳은 travel `default`처럼 "moveToExit 3회 반복, 도착하면 break, 못 가면 throw".
  - ③ `useUnit`에는 throw를 넣지 않는다(7회 실패면 false → ②의 3회 재시도가 받음, Jail 사례처럼 재시도로 넘어가는 경우를 살림).
  - 실패 처리는 `Misc.quitGame`(사용자 결정 261022, 다른 조기 종료와 일관성 우선. 처음 정한 throw에서 바꿈): throw는 Loader가 잡아 default.dbj가 `MinGameTime` 300초까지 마을에서 대기한 뒤 나가고, quitGame은 바로 나간다(realm 보호는 리더 로비 `MinGameTime` 60초). 기존 `moveToExit failed` quitGame 20곳도 같은 방식.
  - ④ useUnit 조정(사용자 확정 261022): 기본 대기는 지금대로 약 1초. 클릭 뒤 대기 루프에 걷기 가드(모드 2·3·6이면 상한 4초까지 계속 대기). timeout 뒤 무작위 걸음(내 위치 기준 ±3칸)을 유닛 둘레 8자리(±3칸, `checkSpot` 통과한 곳) 차례 시도로 바꾼다. 클릭 앞 고정 `delay(300)` 도입(원본 kolbot과 같음, 시전 판정 게이트 없이, 사용자 확정 261022).
  - 근거(261022 로그 10/21~10/22 15:50, `[useUnit] timeout` 414줄·164연속): 실패 회차 사이 이동 250건 중 190건(76%)이 무작위 걸음만큼만 움직임 = 클릭 뒤 1초 동안 제자리. 7회 모두 실패 13건(대부분 a1, travel 재시도로 넘어감). 원본 kolbot(kolton 3회, blizzhackers 5회)은 클릭 앞 300ms, 대기 3000ms, 같은 무작위 걸음이고 뚫린 쪽 처리는 없음.
  - LvlWarp 대조(외부 blizzhackers `d2data` `lvlwarp.json`): 로그의 계단 `id:`(= `getArea().exits`의 `tileid`)는 LvlWarp `Id`와 같은 번호로 보임(19개 이름이 지역 쌍과 모두 맞음: 12 Tower to Crypt 20→21, 14 Jail Down 29→30, 56 Dungeon Down 88→89, 82 Baal Temple Down R 129→130 등). 실패 위치(거리 5 이하)는 대체로 유닛 좌표에서 1~2칸, 그 계단의 `ExitWalkX/Y` 방향 쪽에 몰림(12: +x, 18·14: +y, 23: −y, 56: −x, 38: (1,1) 13건 중 12건). `ExitWalk`의 뜻(도착 때 걸어 나오는 방향 = 앞쪽, 추정)이 맞다면 "반대편이라 안 먹힘"보다 "유닛 바로 위·옆에 붙어 서서 안 먹힘"에 가깝다(추정, 미검증).
  - `ExitWalk`는 계단을 쓴 뒤 다음 지역에서 걸어 나오는 방향이라 진입 방향과는 무관(사용자 지적, 261022) → 위 "ExitWalk 쪽" 해석은 근거로 쓰지 않는다.
  - `moveToExit`의 `getNearestWalkable(출구, 10, 2)`(원본 `5, 1`, 260824 변경, 저장소 이전): 4번째 인자는 size가 아니라 step. 출구 점이 `checkSpot`을 통과하면 두 값 모두 출구 점 그대로, 막혔으면 원본은 1·2·3·4칸 링, 지금은 1·3·5·7·9칸 링을 본다 → 지금 값은 같거나 더 먼 자리만 고른다(더 가까워지지 않음). 함수 본체(`getNearestWalkable`·`checkSpot`)는 원본과 같다. 0회차 timeout 164건 중 129건(79%)이 유닛에서 0~2칸 = 첫 클릭부터 유닛에 붙어 선 채 실패.
  - 수정 규모: `AutoSmurf.js`의 `Pather.moveToExit(` 76곳 중 결과를 확인하는 곳 23곳(261022 셈), catch 31곳 중 이동을 감싼 곳, `Pather.goWP`, `Pather.useUnit`. 문자열 검색 후보(탈출 조건은 하나씩 안 봄): `travel`(10073,8670), `cube` 상자, `tombs`(46 출구·상자), `radament`(48·프리셋 40), `duriel` Orifice, `mephisto` 빨간 포털, `farmingSummoner` 저널, `den`의 지역·마을 while, 옛 `clearToExit` 자리의 바깥 while 4곳(언더패스 10→5, Jail 29→30·30→31·31→32, 한 번 시도하고 throw도 잡음). 공용 함수(3회 시도 후 throw)를 둘지는 목록을 본 뒤 정한다(새 함수는 승인 필요). `while (!usePortal)` 대기 구문은 대상 아님(사용자).
- **검증 방법**(Claude 제안): 이동 실패가 무한 반복 없이 게임 종료로 끝나는가(콘솔 `[Error] moveTo: Failed` 또는 3회 실패 throw 줄 뒤 `Script ended`/다음 게임). ④는 `[useUnit] timeout` 뒤 옛 지역 좌표 `no original path`가 사라지는가.

### 2-7. chores 20초 이상 멈춤 (`Town.doChores`·`clearInventory`·`buyPotions`, 사용자 261022, 옛 1-8·3-8)
- **확인된 것**
  - 261022 로그: clearInventory 226건(5초 초과만 찍힘, 중앙 7.8초, 20초 이상 19, 최대 47.4초), buyPotions 302건(중앙 8.9초, 20초 이상 1(21.6초, a2 Lut Gholein)). `buy failed` 7건은 모두 a2 골드 부족. 긴 clearInventory가 여러 프로필에서 같은 시각에 몰림(22:13 a5·a7, 00:06 a4·a6·a7, 00:13 a2·a3, 02:05 a4·a5·a7). 20초 이상 19건 중 7건이 게임 시작 40초 안. 긴 사례 여럿(a6 00:06:18 47.4초, a7 00:06:02 21.7초)은 clearInventory 동안 ItemLog·trace가 없음 → 인벤토리 팔기·버리기(ItemLog)·큐브 비우기(trace) 단계는 아님.
  - 코드: `doChores` 순서 heal → identify → clearInventory → fillTome → buyPotions. clearInventory 단계: ① 벨트 물약 되돌리기(인벤토리 물약마다 4열을 돌며 맞는 열에 클릭, 클릭마다 `delay(ping*2+200)`, 기록 없음) ② 큐브 비우기(trace) ③ 보관함 비우기(overhead만) ④ 인벤토리 팔기·버리기(ItemLog, `initNPC("Shop")` 뒤 판매). buyPotions: `initNPC("Shop", "buyPotions")` → 벨트 4열마다 shift 구매 또는 열 칸 수만큼 구매 → HP·MP 버퍼 구매. 둘 다 벨트 물약 열(`checkColumns`)을 다룬다.
  - 판별 trace(261021, 코드에 있음): `chores slow: clearInventory/buyPotions Ns`(5초 초과, `Town.doChores`), `buyPotions: buy failed ...`(`Town.buyPotions`). 두 함수 모두 전체 시간만 찍혀 안의 어느 단계인지 모름.
- **가설**: 남는 것은 기록을 남기지 않는 벨트 물약 되돌리기·보관함 비우기(추정, 코드 기준). 사용자 판단: 물약 문제이고 두 함수가 비슷한 로직을 가졌다면 둘 다 설명된다.
- **구현안**(사용자 채택 261022, 수정은 다른 항목 확정 뒤 한꺼번에)
  - 남는 물약 정리(체력·마나·회복 세 루프)를 `.drop()` → `.interact()`(마시기, 원본 kolbot 동작, 09-14 첫 커밋에 주석으로 남아 있음)로. 근거: NPC 메뉴(`0x08`)가 열린 상태에서는 드롭이 안 먹힘(사용자 퀴버 테스트), `heal`이 메뉴를 열어 둔 채 clearInventory로 들어감. `Unit.prototype.drop`은 `0x19`·`0x1A`만 닫는다.
  - 판별 로그: 지금의 `chores slow: clearInventory/buyPotions` 두 줄을, `doChores` 전체가 10초를 넘을 때 한 줄로 바꾼다. 단계별 시간(heal, identify, clearInventory[시작 시 NPC·UI, 벨트 시간·클릭, 물약 정리 시간·개수·실패, 큐브, 보관함, 인벤토리 잔여], fillTome, buyPotions[NPC까지 시간, 구매 횟수·시간·shift·실패], repair, stash, socketGems). 새 지역 객체 1개. 한 싸이클로 끝낸다(사용자).
  - 261022 로그(10/21~10/22 15:50, 5초 초과만): buyPotions 580건, 중앙값 8~10초(힐·상점이 같은 NPC인 Harrogath도 8.0초), 20초 이상 7건은 모두 Lut Gholein(Fara → Drognan, 여러 프로필 같은 시각). clearInventory 255건, 20초 이상 25건(Rogue Encampment 13).
- **검증 방법**: 위 한 줄로 단계별 원인 판정, 마시기 뒤 clearInventory 20초 이상이 사라지는가. 판별 로그 제거 조건: 이 싸이클 분석 뒤 삭제.

### 2-8. 텔레포트가 제자리에 머묾 / 두 번에 한 번 씹힘 (`Pather.teleportTo`·`moveTo`, 사용자 관찰 261022, 옛 1-10)
- **확인된 것**
  - 사용자 관찰: 제자리 텔레포트, 또는 두 번에 한 번 씹히며 제자리를 유지. 화면 전환으로 보아 텔레 자체는 되는 것 같다.
  - 261022 로그: `[teleportTo failed]`(10회 모두 실패) 25건 — a1 Chaos Sanctuary 02:36~02:40 11건, a2 Throne of Destruction 03:12~03:14 10건, a1 Halls of the Dead 1 00:07 3건, a1 Bloody Foothills 1건. 회차마다의 결과는 찍히지 않아 "두 번에 한 번"인지는 모름.
- **가설**: 위치가 거의 바뀌지 않는 좌표로 텔레하거나, 실패해 제자리 착지(사용자). 서버가 West라 핑 차이일 수도 있음(사용자 추정, 핑이면 로그로 안 잡힐 것).
- **구현안**(미정): 볼 곳 — `teleportTo`의 시전·대기(`docs/code/Pather.md` teleportTo 260930), `moveTo` 노드 루프의 SafeTele(`safeCheckNode`가 고른 칸), 노드 간격(`teleDistance` 35). 원인과 수정 방향을 검토한다.
- **검증 방법**: 검토에서 정한다.

### 2-9. 웨이 유닛 못 찾음 (`Pather.getWP`·`useWaypoint`, 사용자 261022, 옛 1-11·3-7 실패 2건)
- **확인된 것**
  - 사례: a1 Pz-49·50 Catacombs Level 2 `[getWP] waypoint unit not found` → `useWaypoint`가 그 자리에서 `wp.area:null` 12회 → throw → 게임 종료.
  - 코드: `goWP` while은 프리셋 10칸 안이거나 10회 뒤 `[goWP] Failed` trace로만 끝난다 → 실패 줄이 없었으니 프리셋을 찾았다면 10칸 안에서 유닛 조회가 실패한 것. Pz-49는 `going to nearest WP`(프리셋 찾음) 확인. 웨이는 `useUnit`을 쓰지 않는다(`getUnit(2, "waypoint")` 직접).
  - Pz-49는 06:35:20 1층 → 2층 `useUnit` timeout iter:0 뒤 넘어가 06:35:22 goWP, 06:35:28 웨이 못 찾음(2층에 못 간 채 getWP는 아님).
- **가설**: 없음(원인 후보 검토 전). Pz-50은 d2bs 로그의 `going to nearest WP` 유무로 "프리셋 못 찾음(goWP가 움직이지 않음)"을 가른다(코드 수정 없음, 확인 전).
- **구현안**(미정): 10칸 안에서 12회 조회가 모두 실패하는 원인 후보와 수정 방향.
- **검증 방법**: 검토에서 정한다. 판별 trace 안(옛 2-6)은 기각(`rejected.md` getWP).

### 2-10. getQuestItem 사라진 유닛 확인 위치 (`AutoSmurf.getQuestItem`, 옛 3-6 검증 실패, 261022)
- **확인된 것**
  - 지금 코드(261021 `ab94751`, 옛 3-6): `CanFit` 전에 `item.sizex === undefined`면 다시 찾기 3회, 넘으면 `<classid> vanished`. 그 밖은 `CanFit` 실패 → `canMakeRoom` 실패 → `Not enough room for <이름>` → `return false` → `[Quit] getQuestItem failed`.
  - 검증 실패(261022 사용자 로그): a1 하수구 3층 `radament book visible: true 9,5 1`(11:32:34) → `Not enough room for undefined`(11:32:37) → `[Quit] getQuestItem failed`. `vanished` 줄 없음, 인벤토리에 빈칸 있었음(사용자).
  - 코드: `CanFit`은 실제 아이템만으로 빈칸을 센다(`Config.Inventory` 잠금 안 봄). `FindSpot`은 `Storage.Reload()`로 내 아이템을 다 훑은 뒤 `item.sizex/sizey`를 읽는다. trace의 이름 undefined = 그때 유닛 속성이 이미 사라짐.
- **가설**(추정): `sizex` 확인 뒤 `FindSpot`이 크기를 읽기 전에 유닛이 사라져 크기가 undefined → 반복이 돌지 않아 "자리 없음". 누가 주웠는지·내가 가졌는지는 이 줄로 모름.
- **구현안**(사용자 채택 261022): 사라짐 확인(`item.sizex === undefined` → vanished 회수, 3회 넘으면 `<classid> vanished` return false, 아니면 delay 뒤 continue)을 `CanFit` 앞에서 `CanFit` 실패 뒤(`canMakeRoom` 판정 앞)로 옮긴다. `CanFit` 앞에서 이미 사라진 경우도 NaN으로 `CanFit`이 false가 되어 같은 갈래로 온다(지금 확인의 상위 집합). `me.findItem` 추가 확인은 하지 않는다(while 조건이 본다). 대상 `AutoSmurf.getQuestItem` 한 함수, 새 변수 없음.
- **검증 방법**: `vanished` 줄이 찍히고 `Not enough room for undefined`가 없어지는가. `quest item vanished, retry N` trace는 사례를 본 뒤 삭제.

### 2-11. Fallen Shaman 우선 (`Attack.clear`, 사용자 채택 261022, 옛 1-3)
- **확인된 것**(코드): `Attack.clear` 4단계는 `target = nearestLive || nearest`(거리순) 뒤에 leash 루프(MUST가 `leashRange` 25 이상 멀어지면 MUST 우선)가 있다. entries에는 소탕 범위(호출 위치 기준) 또는 위험 범위(MUST가 살아 있을 때 내 주변) 안의 몹만 들어온다.
- **구현안**: `target = nearestLive || nearest;` 바로 뒤, leash 루프 앞에 둔다(MUST leash가 그대로 이김). 노말 액트 1(`me.diff === 0 && me.act === 1`)에서 entries 중 MUST가 아니고 deferred가 아닌 샤먼(classid 58·59 = Fallen·Carver Shaman, monstats 기억이라 구현 전 확인 필요) 중 가장 가까운 것을 target으로. 샤먼이 unreachable·noskill이면 기존대로 drop. 수정 규모: `libs/Attack.js` 한 곳 약 8줄, 샤먼 id 목록(새 상수, 승인 필요).
- **알려진 영향**: 근접 캐릭은 무리를 지나 샤먼까지 들어간다(이전 보류 사유, 사용자가 감수). 원거리는 사거리 자리로 이동해 친다.
- **검증 방법**(Claude 제안): 노말 액트 1 구간(Den·Blood·Cain) 구간 시간, 낙오·`Party desynced` 빈도 전후 비교.

### 2-12. SafeTele 후보 검사 순서 (`Pather.moveTo` 안 `safeCheckNode`, 사용자 채택 261022)
- **확인된 것**(코드): 후보는 원래 노드에 가까운 순으로 정렬해 한 번 훑는다. 후보마다 `checkSpot`(십자 4칸 `CollMap.getColl & 0x1`, 처음 보는 방이면 `room.getCollision()` 복사, 방 25개 넘으면 캐시 전체 비움) → 통과하면 몹 수 → `mc < baseline`이면 채택하고 `baseline = mc`, 0이면 끝. 0이 없으면 35개를 다 본다. 결과 = 걸을 수 있는 후보 중 몹 수 최소, 그중 원래 노드에 가장 가까운 것. 후보 수는 Angle 75·Step 5·Min 10에서 70개, 지금 Angle 60·Step 7·Min 7에서 35개(렉 때문에 사용자가 바꿈, Flayer Jungle·Great Marsh는 Skip).
- **구현안**: 두 검사의 순서만 바꾼다(몹 수 먼저 → `mc < baseline`일 때만 `checkSpot` → 통과하면 채택). 고르는 자리는 지금과 같고, `checkSpot`(방 복사)은 그때까지의 최솟값보다 적은 후보에서만 불린다(벽 안 저몹 후보 포함). 새 변수 없음. 남으면 다음 단계로 몹 수로 다시 정렬해 처음 통과하는 하나를 고르는 안(같은 결과, 정렬 한 번 추가).
- **검증 방법**: 텔레 이동 렉 체감(Bloody Foothills 등), 고르는 자리가 같으므로 동작 변화 없음.

### 2-13. MPQ 데이터 완전 추출 (사용자 요청 261022)
- **확인된 것**: 사용자가 쓴 1.14d listfile(MPQEditor용)에 이름 없는 항목(`File00000127.dc6`, `File00000133.xxx` 등) 약 80개가 있고, excel 목록에 `lvlwarp`·`belts`·`cubemod` 등이 없다. listfile에 이름이 없는 파일은 이름으로 꺼내지지 않는다. 추출본에는 lvlmaze·lvlprest·lvlsub·lvltypes·levels만 있고 LvlWarp가 없다(사용자).
- **구현안**: 더 완전한 listfile(커뮤니티 listfile 등)로 다시 추출해 excel 전체(`.bin`·`.txt`)를 확보한다. 그 전까지 LvlWarp는 외부 `d2data`로 대신한다.
- **검증 방법**: 이름 없는 항목 0개, `LvlWarp.bin`이 있고 `d2data` 값과 같은가.

## 3. 인게임 검증 대기 (구현이 끝난 것을 실제 게임에서 검증)

### 3-1. okCount 이름 수집 (`AutoSmurf.okCount`·`teamCount`·`missing`)
- **바꾼 것**(261021 `eddab3a`): 개수 대신 보낸 프로필 이름(`teamNames`, `this.missing(name)`). 두 단계 유지. ok 이름은 1단계 끝(teamCount 보내기 전)에, teamCount 이름과 teamOk는 2단계 끝에 비운다. 2단계 중 그 프로필의 teamCount보다 먼저 온 okCount는 버린다. 대기 delay 1000 → 200ms. teamOk는 게임 시작 첫 okCount(늦게 들어온 프로필은 앞사람들 ok를 못 받음) 때문에 유지. 근거: 끝 일괄 리셋은 연달아 호출(`okCount; doPrecast(true); okCount`)에서 가장 빠른 프로필의 다음 ok를 모두가 지우면 teamOk도 못 나와 멈출 수 있었다(코드 추론). 같은 사람의 메시지는 보낸 순서대로 도착(`sendCopyData` = 동기 `SendMessage`, 이벤트 큐 FIFO).
- **검증 방법**: 타임아웃 줄 `[Quit] Party desynced 1/2: missing(okCount|teamCount): 프로필, ... teamOk X`로 안 온 프로필이 남는가. 그 프로필의 같은 시각 trace로 무엇을 하던 중인지(마을행·포털 실패 등) 본다. `log_results.md` desync 분석의 판별 불가 5건(B 실제 지각 / C 리셋 경쟁)을 가르는 용도. 261021 전 로그는 `okCount N teamCount N teamOk X`(개수).
- **결과**: 261022 한 싸이클 더 본다(사용자 결정).

### 3-2. 메시지 중계 (`ToolsThread`, `AutoSmurf.onCopyData`)
- **바꾼 것**(261021 `eddab3a`): 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). ToolsThread가 default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). AutoSmurf 처리 본문은 `onCopyData`로 빼서 copydata·scriptmsg에서 부른다. 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → 2-1 확장 때 해소).
- **검증 방법**: okCount 대기 중 마을행(TownChicken·Pause)이 있었던 게임에서 desync 타임아웃이 없는가.
- **결과**: 261022 통과(`relay` 6건 중 마을 다녀온 직후 5건, 그 게임 desync 없음). 사례가 적어 한 싸이클 더 관찰 후 이변 없으면 코드 노트로.

### 3-4. SafeTele 몹 목록 범위 (`Pather` safeCheckNode)
- **바꾼 것**(261021 수정분 `eddab3a`·`ab94751` 중, 개별 커밋 미확인): 몹 목록을 내 위치에서 `max(teleDistance, 노드 거리) + SafeTele.Range` 안으로(후보는 내 위치 35 안, 몹은 후보 Range 안만 셈 → 결과 같음).
- **검증 방법**: SafeTele 동작이 이전과 같은가(텔레 이동 중 멈칫·되돌아감 없음, 작동).
- **결과**: 261022 `[SafeTele] monsters`로 거르기 양 확인(a1 평균 26마리 → 12마리). 결과가 같은 것은 거리 관계로 보장. 한 싸이클 더 본다.

### 3-5. Town check 직접 처리 (`Misc.townCheck`, `Town.visitTown`)
- **바꾼 것**(261021 `ab94751`·`3c31a5a`): default.dbj면 `visitTown` 직접(멈춤 없음). `visitTown`이 `goToTown` 동안 `Config.TownCheck`를 꺼(끝나면 원래 값) 포털로 가는 moveTo 안의 재진입을 막음(직접 호출·화살통 경로 모두). TownChicken(visitTown 안에서만 부름)·MapHelper(default와 동시에 움직임)는 기존 메시지.
- **검증 방법**: `Town check` 마을행이 정상 왕복하는가, 재진입(마을행 중 또 마을행) 없음.
- **결과**: 261022 통과(58건, 중첩 0). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로.

### 3-9. 콘솔·trace 추가
- **바꾼 것**(261021 `ab94751`): 눈·심장·뇌 콘솔(getQuestItem 성공, 리더), `D2Bot.printToConsole`이 `print("[console] " + msg)`도 함, `[useUnit] timeout`에 id·target·unit 좌표, 팔로워 파티 수락 trace `party accept: 이름`, Life Chicken `mode`·`near` 삭제(`nearMonsters` 함수 삭제).
- **검증 방법**: 줄이 형식대로 찍히는가.
- **결과**: 261022 통과(눈·심장·뇌 콘솔 중복은 사용자 업로드 `d8af14f`에서 정리). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로.

### 3-10. 라다먼트 `radamentOff`·`forceTombs` (`AutoSmurf.radament`·`tombs`)
- **바꾼 것**
  - 261021 `ab94751`: N+1 `Radament book reset` 직전 리더 캐시 `radamentOff = true`. N+2 리더가 라다먼트 차례에 읽고 지운 뒤 콘솔 `Radament off: tombs, quit at 10 min` → `me.maxgametime = 10분`(엔진이 게임 시작부터 10분에 나감, 다음 게임에 default.dbj가 원래 값으로) → tombs 한 번. 라다먼트 차례엔 써모너가 끝나 리더는 캐니언 WP가 있고, 없는 팔로워는 리더 포털로 들어감. D2BS는 게임 단위 퀘스트 상태(완료 불가)를 읽는 함수가 없어 캐시 표시로 함.
  - 261022 사용자 `8a7ff56`: N+2의 tombs는 `partyLevel(tombsLvl)`이 참이면 바로 break해 아무것도 안 했다 → `tombs(force)` 인자, 메시지 `forceTombs`(팔로워 `forceTombs` 플래그 → `tombs(true)`), 리더는 라다먼트 꺼짐 때 `forceTombs`를 보내고 `tombs(true)`.
- **검증 방법**: 북 분실 뒤 N+2 게임에서 콘솔 줄과 10분 퇴장, tombs가 실제로 돈다(구간 헤더 `=== [TOMBS] ===`와 이동 줄), N+3에서 북 획득.
- **결과**: 기록 없음.

### 3-11. 보스가드·시체 회수 trace (`AutoSmurf.bossGuard`·`bossScan`·`bossEnd`)
- **바꾼 것**(261020 `4af6a3e`): 목적은 발견부터 킬까지 치킨 %가 적정한지 보기. 용어: **보스가드 on/off**(`bossGuard()` 호출 ~ `bossEnd` 시작), **치킨 on/off**(LifeChicken 0 ↔ 원래 값). 일어나지 않은 사건은 찍지 않는다. `@` 시간은 found(아무 보스나 처음 본 때) 기준 초.

| 순서 | 위치 | trace |
|---|---|---|
| 1 | `bossGuard` 호출 | `bossGuard on: 15%` |
| 2 | `bossScan`, 처음 본 스캔 한 번(`guardStart`를 이때 넣음) | `bossGuard found: Andariel 100%` |
| 3 | `bossScan`, HP ≤ pct | `bossGuard chicken off: Andariel 14%@13.0s` |
| 4 | `bossEnd` 시작(`traceGuardSeen`) = 보스가드 off | `bossGuard last: Andariel 0%@16.1s` (마지막 보스의 마지막 발견 ≈ 킬, 스캔 1회 오차) |
| 5 | 치킨 복구(산 사람 okCount 뒤 / 죽은 사람 부활 직후) | `bossGuard chicken on: 35%` (치킨 off가 있었을 때만) |

  - 시체 회수(죽어 있던 프로필): `revive start`(위치 = 죽은 지역·좌표) → 5번 → `corpse picked`. 실패는 `[Quit]` 줄(`Revive failed`, `Corpse portal not found`, `Failed to get corpse: not seen / far N / died / timeout`), okCount 타임아웃 `Dead wait timeout`.
  - 현재 값(사용자 수정): 써모너 100(처음 본 스캔에서 끔), 쉥크 50, 에인션트 10이고 살아 있는 고대인 2마리 이하. bossEnd 시체 회수 동안 `Config.TownCheck` 끔.
- **검증 방법**: 치킨이 꺼져 있던 시간 = 4번 − 3번. 치킨 off가 없으면 3·5번이 없고, 보스를 못 보면 2~4번이 없다. 에인션트는 2번이 처음 본 고대인, 4번이 마지막 고대인. 써모너(pct 100)는 3번이 `@0.0s`. 보스전 중 죽었거나 타운치킨으로 마을에 다녀온 프로필은 그동안 스캔이 없어 4번이 실제 킬보다 이르다(동작 문제 아님). 제거 조건: 치킨 % 판단이 끝나면 삭제(사용자 결정에 따름).
- **결과**: 261022 결과 나옴(사망 0, 가드 중 Life Chicken 0, 보스별 표는 `log_results.md`). 한 싸이클 더 본다.

### 3-12. 골드 나눔 (`AutoSmurf.giveGold`·`pickGold`, 사용자)
- **바꾼 것**
  - 261020 사용자: 주는 양 = 골드 − LowGold, 그것이 1000 미만이면 골드 − 5000. 리더가 골드를 받는 것이 LowGold보다 우선(사용자 의도). 예전 식은 LowGold 아래 팔로워의 양이 음수가 되어 실제로 주고받지 못했음. trace `Picking up/Dropping/Retaking N Gold`.
  - 261022 사용자 `bb94fac`·`284a5aa`: `pickGold` 반복 15회 × 1초 → 50회 × `ping*2+100`, 시작 때 보관함 넣기 삭제, 보관함 넣기 조건 골드 있음 → `charlvl × 10000` 이상, `giveGold` 대기 15초 → 10초(다시 줍기 `i >= 9`), 그 밖 `ping*2+500` → `ping*2+200`.
- **검증 방법**: 리더가 모든 더미를 받는가(`Picking up` 수 = `Dropping` 수), 음수 없음. 확인 뒤 줄 삭제. 그래도 문제면 재논의.
- **결과**: 261022(사용자 수정 전 코드): 음수 없음. 리더가 00:16 게임 7더미 중 3, 02:41 게임 8더미 중 5만 받음. 리더는 더미마다 `delay(1000)` → 줍기 → 보관함 넣기를 반복해 더미당 4~9초, 팔로워는 버린 뒤 15초에 `Retaking`. 시각이 맞는 설명이나 원인 확정 아님(02:41 게임 리더 19초 빈 곳은 원인 모름). 사용자 수정 뒤 결과는 아직 없음.

### 3-13. 라다먼트 북 버리기 (`AutoSmurf.start`, `dropping radament book`)
- **바꾼 것**(`47816e6`): 시작 단계 북 버리기 무한 루프 수정. 버릴 때마다 trace `dropping radament book`.
- **검증 방법**: 북을 가진 채 시작한 게임에서 이 줄 뒤 정상 진행(무한 반복 없음). 확인 뒤 줄 삭제.
- **결과**: 아직 미검증.

### 3-15. 소켓 보석 (`Pickit.checkItem`·`socketTargets`·`pickItem`, `Town.socketGems`·`doChores`, `Misc.itemLogger`·`logItem`)
- **바꾼 것**(사용자 결정, 커밋 `02662d5`·`8730a5b`·`132bc5e`·`e9279d9`, 최종 상태)
  - 대상(`Pickit.socketTargets`): 내 장착 칸 1(머리: 투구·바바·드루 전용·서클릿)·3(몸)·4·5(양손 칸은 종류로: 방패류 2·69·70이면 방패, 그 밖은 무기 — 활·지팡이·양손 무기·바바 두 번째 무기가 칸 5에 있어서) 중 티어가 있고(`NTIP.GetScore > 0`) 빈 소켓이 있으며 룬워드 베이스 재료가 아닌 것(`Config.Runewords`에서 classid 같고 `getBase` 참). 용병 제외. 부위별 보석 `Config.SocketGems = {Head: [99], Body: [99], Shield: [97], Weapon: [99, 101, 100, 98]}`(itemType 96~102 = 전 등급, classid 557~601 = 그 등급만, 빌드에서 덮어씀). 보석 관문은 96~102 전체. 무기 레벨 18 제한 제거.
  - 줍기(`checkItem` 결과 5, Cubing 판정 앞): 바닥·인벤토리 보석만, 보석 레벨 제한 ≤ 캐릭 레벨. 인벤토리 보석(자기 제외, gid 순)을 대상 순서대로 미리 배정하고, 빈칸이 남은 대상이 이 보석을 받으면 5. nip 무관, 스태시로 가지 않음. 필요 없어지면 기존 판정. 줍기 직후 overhead `(Ingredient)`, ItemLog `Ingredient {가진 개수}`.
  - 장착(`Town.socketGems`, `doChores`의 `stash()` 뒤): 보관함을 열지 않고 `sendPacket(1, 0x28, 4, 보석 gid, 4, 장비 gid)`. 성공 시 ItemLog `Gemmed {nip 라인}`(넣은 뒤 `NTIP.Evaluate`), 매니저 아이템 로그 `Misc.logItem("Gemmed", 장비, 라인)`(지역 포함), 매니저 콘솔 `# [Gem] 보석 베이스 (찬/전체)` 색 5(베이스는 `getLocaleString(getBaseStat(0, classid, "namestr"))`), print `equipped: [칸] 티어`(`Equip.updateTier`). 실패 시 커서 보석은 인벤토리로, 안 되면 `Packet.dropItem` 뒤 `Pickit.pickItems()`, trace `socketGems failed: <보석> -> [칸] <장비>`(`(dropped)`, `(cursor)`).
  - 경위(261021 사용자 로그): 장착 칸 클릭 `clickItem(0, 칸)`은 창을 닫아도·보관함을 열어도 `(cursor)` 실패 → 창 가설 틀림. 패킷 0x28은 보관함을 연 채(5건)·열지 않고도(a6 Wolf Head 2건) 성공. D2MOO 0x28 처리의 상호작용 조건(`PlrMsg.cpp:2543-2556`, 1.10f 재구성)은 1.14d와 다르거나 재구성 차이(추정). 참고: kolbot-SoloPlay도 0x28을 씀.
- **검증 방법**
  - ItemLog `Ingredient`로 빈 소켓 수만큼만 줍는가.
  - `Gemmed`가 남고 옵션에 보석 효과가 바로 보이며 티어가 오르는가(노멀은 고정일 수 있음).
  - 콘솔 `# [Gem]`의 베이스 이름이 접두·접미 없이 나오는가, 매니저 아이템 로그에 그림·옵션·라인·지역이 다른 로그처럼 나오는가.
  - `socketGems failed` 빈도와 이유, `(dropped)` 뒤 다시 주웠는가. `(cursor)`(Claude 추가 261021): 다음 로그 묶음도 0x28 실패 0건이면 삭제(사용자 결정 261022).
  - 룬워드 베이스·티어 없는 장비에는 넣지 않는가.
- **결과**: 261022 통과(0x28 `Socketed` 23건, 실패 0). 한 싸이클 더 관찰 후 이변 없으면 코드 노트로. a1 머리 칸 사파이어(23:58)가 코드 버전 차이인지는 사용자 확인 전.
- 나중(사용자 결정, 이 항목 밖): 빌드별 보석 종류 Config 값, 무기 룬 확장, 용병.

### 3-16. 스태프 콘솔 줄 (`AutoSmurf.getQuestItem`)
- **바꾼 것**(261022 사용자 `8a7ff56`): `d8af14f`에서 넣은 `if (classid === 356)`은 상자 id(356)를 봐서 참이 될 수 없었다(호출은 `getQuestItem(92, 356)`, 92 = Staff of Kings) → 조건 `classid === 92`.
- **검증 방법**: 스태프를 주우면 리더 콘솔에 `=== STAFF ===`.
- **결과**: 기록 없음.

### 3-17. MoveToSlot 실패 원인 판별 (`Storage` MoveToSlot, `PartyThread` 파티 수락, 옛 1-6)
- **바꾼 것**: 실패 줄 유지, `inv:` 필드 삭제(261020). 판별 trace `party accept: 이름`(261021 `ab94751`, 팔로워 `PartyThread`). 실패 34건 중 33건 `closed`·1건 `-`이고 창을 여는 코드가 없어 성공도 `closed`일 것 → 창 상태로는 판별 불가라 수락 시각으로 가른다.
- **검증 방법**: 실패 줄 `[MoveToSlot] ... FAILED`와 같은 시각(같은 초)에 수락이 있으면 수락 클릭이 옮기던 물약을 방해한 것(가설). 겹침이 없으면 가설은 틀림.
- **결과**: 261022 `party accept` 579줄, MoveToSlot 실패 0건(65게임) → 판정할 사례 없음. 실패가 다시 나오면 판정.

### 3-18. getWP random 좌표 제거 (`Pather.getWP`, 옛 2-5)
- **바꾼 것**(261022 `ae1767b`): getWP가 웨이까지 > 5일 때 부르는 `moveToUnit(wp, 0, 0, false, false, true)`에서 random 인자를 지움. goWP(프리셋 > 10, random 유지)는 그대로. 근거(가설, 로그 확인 전): 대각 오프셋(약 7.1) 프로필은 도착해도 늘 5를 넘고, 오프셋 5 프로필도 1칸 어긋나면 넘어 부를 때마다 반대편으로 왕복 → 플라이 소서 웨이 착지 버벅임(사용자 관찰).
- **검증 방법**: 웨이 찍을 때 버벅임(왕복)이 없어지는가(작동), `[getWP] waypoint menu not opened` 빈도.
- **결과**: 기록 없음.
