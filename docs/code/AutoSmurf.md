# bots/AutoSmurf.js

(AutoSmurf 정리 단계에서 나머지 `this.` 함수를 채운다.)

## 보스 호출 range (여러 함수의 `Attack.clear(range, 보스)`)

### 260929 사용자: 뒷정리가 필요한 보스에 range
- range를 주면 보스 기준 원 안을 처치 뒤까지 정리한다. 0이면 보스가 죽는 즉시 끝나고 잡몹이 남는다. Summoner·Duriel·Mephisto·Diablo·고대인·Baal은 뒤에 박스·청소 이동이 있거나 혼자 나오는 보스라 0.

### 261003 Claude: 범위 조정 (사용자 요청)
- Andariel(2곳)·Izual·Shenk·Nihlathak 20 → 25, Radament·Countess 15 → 20, Blood Raven 10 → 0(죽으면 주변 소환몹도 죽어 끝 줍기 25가 유리), Summoner 10 → 0(합류 때 이미 내 10칸 안이라 주변 메이지는 위험 대상으로 잡히고, 뒤에 박스 정리·`okCount(10)`이 있음). 보스 호출의 range는 보스 위치(org) 기준 정리 반경이고 위험 반경(내 10칸)과 다르다.

## 출구 이동 (여러 함수의 `moveToExit`, 옛 `clearToExit`)

### 261021 Claude: `clearToExit` 삭제
- 20곳은 `moveToExit` 한 번 + 실패 시 `quitGame("moveToExit failed: A -> B")`(moveTo throw는 잡지 않음). 지역 확인(`me.area === A`)은 유지. 옛 바깥 while 4곳(언더패스 10→5, Jail 29→30·30→31·31→32)은 뒤에 보정 구간(목표 층이 아니면 마을 → 목표 층 포털, `Area reversed` 대기)이 있어 퇴장 없이 한 번 시도(throw도 잡음)하고 보정에 맡김. 이 4곳의 catch는 handoff 2-4 ① 대상.

## 흩어지기 (여러 함수의 `moveTo` random 인자)

### 261028 Claude: 랜덤무브를 moveTo 계열 random 인자로 통일 (`dfc884b`, 사용자 요청, 옛 handoff 3-41)
- `Pather.moveTo(me.x + myX, me.y + myY)` 41곳을 random 인자로. 고정 지점 이동 바로 뒤의 흩어지기 11곳은 앞 이동(`moveTo`/`moveToPreset`)에 random을 주고 흩어지기 줄을 지움, 제자리 흩어지기 30곳은 `moveTo(me.x, me.y, 3, false, false, true)`(기존 261007 4곳과 같음).
- `AutoSmurf`의 `myX`·`myY` 삭제(이를 쓰던 옛 주석 줄 5개도 삭제) → 오프셋은 `Pather.myX/myY`(reflection 유지). 프로필별 자리는 Pather 표 순서로 바뀜. 막힌 오프셋은 `no random path` → 원래 좌표.
- 확인: 사용자 육안 검증 통과(261028).

## this.start

### 261025 Claude: 팀 대기를 okCount로 통일 (`f26ef73`, 옛 handoff 3-36·3-47)
- 게임 시작 대기(readyCount·teamReady)를 `this.okCount()`로(2분 퇴장). 지운 변수 `imReady`·`readyCount`·`teamReady`.
- 확인: 261026·261027·261028·261029 로그 `Party desynced 2`·`syncBO timeout`·`Team didn't join` 0(261029 Pz-36 크래시 직후 1건은 사용자 PC 부하로 제외), `act* BO` 팀 전원 같은 회수(261029 8명 각 20회), 카우 정상 종료. 검증 통과(사용자 261029).

## this.okCount / this.teamCount

### 261004 Claude: 죽은 사람도 타임아웃, 타임아웃 상세
- 죽은 사람도 120초 타임아웃(`&& !me.dead` 삭제, 사유 `Dead wait timeout`). 타임아웃 trace 상세에 `okCount`/`teamCount`/`teamOk` 값.
- 확인: 261006 로그. 261021 이름 수집 방식은 아래 261021 항목.

### 261021 Claude: 이름 수집 (`eddab3a`, 옛 handoff 3-1)
- 개수 대신 보낸 프로필 이름(`teamNames`, `this.missing(name)`). 두 단계 유지. ok 이름은 1단계 끝(teamCount 보내기 전)에, teamCount 이름과 teamOk는 2단계 끝에 비운다. 2단계 중 그 프로필의 teamCount보다 먼저 온 okCount는 버린다. 대기 delay 1000 → 200ms. teamOk는 게임 시작 첫 okCount(늦게 들어온 프로필은 앞사람들 ok를 못 받음) 때문에 유지.
- 이유: 끝 일괄 리셋은 연달아 호출(`okCount; doPrecast(true); okCount`)에서 가장 빠른 프로필의 다음 ok를 모두가 지우면 teamOk도 못 나와 멈출 수 있었다(코드 추론). 같은 사람의 메시지는 보낸 순서대로 도착(`sendCopyData` = 동기 `SendMessage`, 이벤트 큐 FIFO).
- 타임아웃 줄 `[Quit] Party desynced 1/2: missing(okCount|teamCount): 프로필, ... teamOk X`.
- 확인: 261022·261023 로그. desync 때 안 온 프로필 이름이 남고, 261023 3게임 모두 그 프로필이 실제로 늦음(리셋 경쟁 0). 검증 통과(사용자 261023). 늦은 이유는 다른 증상으로 `handoff.md` 3-26.

### 261025 Claude: 팀 대기를 okCount로 통일 (`f26ef73`, 옛 handoff 3-36·3-47)
- `start`(readyCount·teamReady, 2분 퇴장), `buffCount`(buffCount·teamBuff, 타임아웃 없음), `syncBO`(BOCount·BOReady, 30초 퇴장), `syncBO` 안 syncWP 10회 대기를 모두 `this.okCount()`로. 한 방향 신호(tpReady·msgLeader·earlyReturn·좌표·teamFigurine)와 스위치는 그대로.
- 알려진 위험(추정, 당시 기록): 5막처럼 syncBO가 연달아 불릴 때 리더 BO가 그 사이에 꺼지면 다음 회차 BOing이 앞 회차에 읽힐 수 있다. 팀원 간 `partyLevel`·퀘스트 상태가 다르면 그 자리 okCount에서 120초 퇴장한다.
- 확인: 261026·261027·261028·261029 로그 `Party desynced 2`·`syncBO timeout`·`Team didn't join` 0(261029 Pz-36 크래시 직후 1건은 사용자 PC 부하로 제외), `act* BO` 팀 전원 같은 회수(261029 8명 각 20회), 카우 정상 종료. 검증 통과(사용자 261029).

### 261026 Claude: 리더 웨이 모으기 중 okCount 10분 (`d87cfcb`, 옛 handoff 3-36·3-47)
- 새 변수 `leaderTravel`(onCopyData `case "travel"`에서 켬). 타임아웃 `leaderTravel ? 600 : 120`초, 퇴장 상세 끝에 `travel true/false`, okCount 단계 끝에서 `leaderTravel = false`(다음 okCount 하나에만 쓰임).
- 이유: 리더가 웨이를 모으는(`travel`) 동안 팔로워가 다음 okCount에서 120초 퇴장(261026 6게임). 바뀌기 전(`f26ef73^`)에는 `buffCount`·`syncBO` 대기에 타임아웃이 없었다.
- 확인: 웨이 모으기 뒤 120초 퇴장 0 — 261027 웨이 모은 21게임, 261028 Pz-32 Ancient's Way 221초 모으기 뒤 shenk syncBO 8명 통과. 261029 `travel true` 퇴장 0. 검증 통과(사용자 261029).

### 261029 Claude: 퇴장 상세의 `travel` 삭제 (사용자 요청)
- 검증 통과(옛 handoff 3-47)로 `Party desynced 1` 상세 끝 ` travel true/false` 삭제. `leaderTravel`(10분 대기)은 그대로.

## this.buffCount

### 261025 Claude: 벨트 넣기·남는 물약 정리를 `clearBelt` 끝으로 (`81d5b43`, 사용자 승인, 옛 handoff 3-21·2-17·3-27)
- 노멀에서 해독 물약을 산 뒤 부르는 단독 `Town.clearInventory()` 앞에 `Town.clearBelt()`(벨트 넣기가 `clearBelt`로 옮겨 감, `Town.md` clearBelt). 검증 통과(사용자 261028).

### 261025 Claude: 팀 대기를 okCount로 통일 (`f26ef73`, 옛 handoff 3-36·3-47)
- buffCount·teamBuff 대기를 `this.okCount()`로(타임아웃 없던 대기 → 120초). 지운 변수 `myBuff`·`buffCount`·`teamBuff`.
- 확인: `this.okCount` 같은 헤더 항목. 검증 통과(사용자 261029).

## this.syncBO

### 261025 Claude: 팀 대기를 okCount로 통일 (`f26ef73`, 옛 handoff 3-36·3-47)
- 리더는 BO가 필요할 때(`!me.getState(32)`)만 `BOing`을 한 번 보내고 okCount. 모두 okCount 뒤 `BOing`이 아니면 `return false`, 맞으면 `BOing = false`로 지우고 진행. `BOed` 변수·메시지 삭제. syncWP 10회 대기도 okCount.
- 확인: 261026·261027·261028·261029 로그 `Party desynced 2`·`syncBO timeout`·`Team didn't join` 0(261029 Pz-36 크래시 직후 1건은 사용자 PC 부하로 제외), `act* BO` 팀 전원 같은 회수(261029 8명 각 20회), 카우 정상 종료. 검증 통과(사용자 261029).

## this.pickGold / this.giveGold

### 261020·261022 사용자: 골드 나눔 (`bb94fac`·`284a5aa`, 옛 handoff 3-12)
- 주는 양 = 골드 − LowGold, 그것이 1000 미만이면 골드 − 5000. 리더가 골드를 받는 것이 LowGold보다 우선(사용자 의도). 예전 식은 LowGold 아래 팔로워의 양이 음수가 되어 실제로 주고받지 못했다.
- 261022: `pickGold` 반복 15회 × 1초 → 50회 × `ping*2+100`, 시작 때 보관함 넣기 삭제, 보관함 넣기 조건 골드 있음 → `charlvl × 10000` 이상, `giveGold` 대기 15초 → 10초(다시 줍기 `i >= 9`), 그 밖 `ping*2+500` → `ping*2+200`.
- trace `Picking up/Dropping/Retaking N Gold`는 유지(사용자 261023): 골드 주고받기는 ItemLog에 남지 않아 이 줄이 유일한 기록이고, `Retaking`이 리더가 못 받은 표시다.
- 확인: 261023 로그 2게임, 버린 12더미를 리더가 모두 주움(금액 일치, 더미당 1~3초), `Retaking` 0, 음수 없음. 검증 통과(사용자 261023).

## this.bossGuard

### 261004 Claude: 보스 보호 도입 (치킨 끄고 킬까지 대기)
- 배경: 보스전에서 한 명이 치킨으로 나간 뒤 나머지가 감지해 나가는 약 0.3초 안에 보스가 죽으면, 나간 쪽만 킬을 못 해 다음 게임부터 디싱크. 방장이 끝낸 퀘스트는 그 방에서 꺼지므로 못 잡은 쪽은 따라잡지 못한다(`D2BS_Structure.md` 확인된 사실).
- 동작: 원래 치킨 값을 `guardChicken`에 저장. pct 0이면 바로 치킨 끔. pct > 0이면 `Attack.clear` 스캔 훅(`Attack.md` clear)에서 보스 HP ≤ pct면 한 번 치킨을 끈다. 에인션트(540~542)는 살아 있는 고대인이 한 마리일 때만.
- 적용: 써모너 0, 라다먼트 85, 앤디·메피스토·이주얼·쉥크·에인션트 15, 디아블로 15(`!getQuest(26,0)`일 때만), 바알 15(`!getQuest(40,0)`일 때만). 듀리엘 제외(다음 게임에도 퀘스트가 살아 있어 다시 잡으면 복구됨).
- 리더 포탈: 디아블로 별 자리(`diabloPrep` 전), 앤디 normal `moveTo(22548, 9582)` 뒤, 바알 132 `moveTo(15134, 5923)` 뒤, 에인션트는 118의 120 출구 앞.
- 확인: 261006 로그. 그 뒤 사용자가 값(써모너 100, 쉥크 50, 에인션트 10·2마리 이하)과 trace를 바꿈 → 아래 261020 항목.

### 261020 Claude: 보스가드·시체 회수 trace (`4af6a3e`, 옛 handoff 3-11)
- 목적: 발견부터 킬까지 치킨 %가 적정한지 보기. 줄: `bossGuard on: N%`(호출) → `found: 보스 HP%`(처음 본 스캔, 시간 0) → `chicken off: 보스 HP%@초`(HP ≤ pct) → `last: 보스 HP%@초`(`bossEnd` 시작, 마지막 발견 ≈ 킬) → `chicken on: N%`(치킨 복구, off가 있었을 때만). 시체 회수는 `revive start` → `corpse picked`, 실패는 `[Quit]` 줄. 읽는 법은 `log_guide.md` 4-1.
- 확인: 261022·261023 로그 2싸이클, 가드 중 사망 0. 261023(119게임) 치킨 꺼진 HP 중앙값 / 꺼짐 → 마지막 발견 중앙값(최대): 써모너(100) 100 / 2.2초(6.4), 라다먼트(85) 74 / 4.6초(12.4), 앤디(15) 13 / 1.5초(2.3), 메피 14 / 3.7초(4.6), 이주얼 14 / 3.2초(6.4), 디아 14 / 3.2초(5.3), 쉥크(50) 41 / 1.0초(3.5), 에인션트(10) 4.5~5 / 6.3~7.0초(8.8), 바알(15) 15 / 6.6초(9.7). 가드 중 Life Chicken 2건은 치킨이 켜져 있던 때(보스 HP 100·98%). 검증 통과(사용자 261023).
- trace는 유지(사용자 261023): 보스전 중 Life Chicken이 났을 때 치킨이 켜져 있었는지(`chicken off` 유무), 복구됐는지(`chicken on`)를 가르는 근거라 치킨 분석에 함께 본다.

## this.bossEnd

### 261004 Claude: 킬 확인과 시체 회수
- 동작: 보스 clear의 try/catch 바로 뒤. okCount(킬 확인, 죽은 사람은 시체로 대기해 크레딧을 받음) → 죽었으면 위치 기록 → `me.revive()`(mode 17일 때, 1초 × 10, 실패 `Revive failed`) → 마을 도착 후 치킨 복구 → portalspot → `usePortal(죽은 지역, null)`(120이면 118, 실패 `Corpse portal not found`) → 리더는 그 자리에서 `makePortal` → 120이면 `moveToExit(120)` → `moveTo(x, y)` → 시체 확인(0.5초 × 5) 뒤 `Town.getCorpse(true)`(실패는 `Failed to get corpse`, 상세 `not seen` / `far N` / `died` / `timeout`) → okCount(산 사람이 엄호하며 대기). 산 사람은 첫 okCount 뒤 치킨 복구. 보호를 안 켰으면(파밍) 아무것도 안 함.
- 확인: 261006 로그. 261013에 회수 동안 `Config.TownCheck` 끔(사용자), trace는 261020에 바뀜(this.bossGuard 261020 항목).

## this.exitTo

### 261022 Claude: 이동 무한 반복 막기 (`482171b`, 옛 handoff 2-4 ①②③·3-19)
- `exitTo(areas, clearPath)`: `moveToExit` 3회(throw도 한 번의 실패로 셈, 배열 경로는 남은 구간부터, "Souls"는 그대로 반환), 실패면 `[Quit] moveToExit failed: A -> B`. 결과를 안 보던 `moveToExit`·`while (me.area …)` 루프를 `exitTo`로 바꿈(syncBO, bossEnd, travel, den, andy, cube, amulet, tombs, staff, radament, duriel, eye·heart·brain, mephisto, anya, ancients, baal, farming).
- 거리 while + catch 6곳은 3회 상한, 못 가면 quitGame(`Arcane portal not reached`, `Cube chest not reached`, `Tomb chest not reached`, `Radament chest not reached`, `Orifice not reached`, `Red portal not reached`). duriel 오리피스 `useUnit` 실패면 `Duriel chamber not entered`. 상자까지는 `moveTo(retry 3)` × 3회.
- throw가 아닌 quitGame인 이유: throw는 Loader에서 `MinGameTime` 300초 대기 후 종료라 다른 조기 종료와 어긋남(사용자 결정 261022).
- 확인: 261023 로그(119게임) 사유 줄로 끝남 6건(`moveToExit failed` 1, `Tomb chest not reached` 4, `Cube chest not reached` 1), `[Error] AutoSmurf.exitTo` 0. 무덤 4/10게임 퇴장은 미로형 지역에서 8명 동선이 꼬여 다시 시도가 많은 탓으로 봄(사용자) → 작동 통과(사용자 261023).

## this.travel

### 261026 Claude: 리더 웨이 모으기 중 okCount 10분 (`d87cfcb`, 옛 handoff 3-36·3-47)
- 실제 이동 분기(`nextAreaIndex < areaIDs.length`) 첫 줄에서 메시지 `travel`을 보낸다(웨이가 이미 있어 이동하지 않으면 안 보냄).
- 확인: 웨이 모으기 뒤 120초 퇴장 0 — 261027 웨이 모은 21게임, 261028 Pz-32 Ancient's Way 221초 모으기 뒤 shenk syncBO 8명 통과. 261029 `travel true` 퇴장 0. 검증 통과(사용자 261029).

## this.getQuestItem

### 261021·261022: 퀘스트 아이템 콘솔 (`ab94751`·`d8af14f`·`8a7ff56`, 옛 handoff 3-9·3-16)
- 리더 콘솔 `===EYE===`·`===HEART===`·`===BRAIN===`(눈·심장·뇌, 261021 Claude 추가, 261022 사용자 `d8af14f`에서 하나로 정리)와 `=== STAFF ===`.
- 261022 사용자 `8a7ff56`: 스태프 조건 `classid === 356`(상자 id라 참이 될 수 없었음, 호출은 `getQuestItem(92, 356)`) → `classid === 92`.
- 확인: 261023 로그 눈·심장·뇌 각 3건 한 번씩, STAFF 3건. 검증 통과(사용자 261023).

### 261022 Claude: 사라짐 확인 위치 (`482171b`, 옛 handoff 2-10·3-22)
- `item.sizex === undefined` 확인을 `CanFit` 앞에서 `CanFit` 실패 뒤(`canMakeRoom` 앞)로. `CanFit`이 인벤토리를 다시 읽는 동안 유닛이 사라지면 크기가 undefined라 `CanFit`이 false가 되어 `Not enough room for undefined`로 끝나던 경우(261022 a1 하수구 3층)를 사라짐으로 받아 다시 찾는다(3회 넘으면 `<classid> vanished`).
- 확인: 261026 로그 `quest item vanished, retry 1` 3건(a8 10/25 22:00:49, a7·a5 10/26 02:32:21~22, 모두 Sewers Level 3 라다먼트 북), 3건 모두 그 뒤 `!!! [BOOK] !!!`. `Not enough room` 0. 검증 통과(사용자 261026). `quest item vanished, retry N` trace는 제거 조건(사례 확인)을 채워 삭제(사용자 261026, `d87cfcb`).

## this.den

### 260928 Claude: `Attack.clearLevel` → den 내부 `clearDen`
- Attack의 `clearLevel`을 없애고 den 안의 함수(`clearDen`, 방마다 `clear(30)`)로 옮겼다.

## this.summoner

### 261004 Claude: 공통 보스 보호로 교체
- 기존 `setLifeChicken(0)`·죽음 퇴장·치킨 복구를 `bossGuard(0)`·`bossEnd(10)`으로 교체, `okCount(10)` 유지.

### 261029 사용자·Claude: 일지 판별 trace와 잔재 삭제 (`59bf6c8`, 옛 handoff 3-43 바꾼 것 2)
- 사용자 `59bf6c8`: `[Summoner] journal` trace와 1회 누르기 삭제, 일지 반복은 "누르기 → 46번 포탈이 있으면 끝"(최대 3번). 듀리엘 쪽 변경은 handoff 3-43.
- Claude(사용자 요청): 선언에 남은 지역 변수 `talked` 삭제(쓰는 곳 없음). `tick`은 팔로워 포탈 대기에서 씀.

## this.tombs

### 261028 사용자: 무덤 상자 이동 재시도 3 → 10 (`68483de`, 옛 handoff 3-48)
- 무덤 안 상자 프리셋까지 `Pather.moveTo(…, 3, true)` 바깥 반복 `j < 3` → `j < 10`(최대 moveTo 10번 × 경로 재시도 3). 그래도 25칸 넘으면 `[Quit] Tomb chest not reached`. 같은 3회 상한의 다른 5곳(Arcane·Cube chest·Radament chest·Orifice·Red portal)은 그대로.
- 이유: 261023·261027·261028 묶음마다 `Tomb chest not reached` 4건, 앞에 `[Error]`·경로 보정 줄 없음.
- 확인: 261029 로그 `Tomb chest not reached` 0, 무덤 구간 desync 1건(18:30 a8 Tomb #3, 그 시각 a8 trace 줄 없음). 검증 통과(사용자 261029).

## this.radament

### 261004 Claude: 북 확인·읽기와 분실 복구
- 게이트 `(!9,1 && !9,0) || (9,5 && 북 없음)`(`radament` 안과 리더 쪽). bossEnd 뒤 북이 보이는지 한 번 확인(약 2초, 못 보면 `Radament quest item not found`) → okCount → 줍기·읽기. 누구 하나 못 보면 아무도 줍지 않고 나가 전원이 같은 상태가 된다.
- 복구: 리더가 `9,1 && 9,5 && 북 없음`이면 radament 시작에서 아트마와 대화(9,1 → 9,0) 후 `Radament book reset`으로 퇴장(N+1) → N+2는 퀘스트가 꺼져 북이 안 나옴 → N+3에 북이 필요한 전원에게 드롭.
- 확인: 261006 로그 정상 경로 통과, 261013 로그 분실 복구 경로(Pz-54~58) 통과. 261012에 사용자가 북 확인을 바닥(`getUnit(4, 552)`)만으로 바꿈, 261021 `radamentOff`는 `handoff.md` 3-10(검증 대기).

## this.duriel

### 260812 사용자: 탈라샤 무덤 회피 토글
- 포탈로 파티가 모인 직후 회피가 붙은 몹 사이로 자리를 잡다 치킨이 나서, 오리피스 박스를 먼저 정리한 뒤 회피를 켠다. 박스 울타리로는 막히지 않음. 유지(261002). 되돌릴 때 무조건 `true`지만 `this.duriel`은 파티 전원 25레벨 이상에서만 실행되므로(리더는 `this.tombs` 끝에서 `partyLevel(tombsLvl 25)`까지 대기·미달이면 quit, 팔로워는 리더의 `duriel` 메시지로 진입) 빌드의 25레벨 회피 켜기와 어긋나지 않는다.

## this.travincal

### 260929 Claude: 평의회 배열 must → 박스 2개
- `[345, 346, 347]` → 박스 1~4(정확한 합집합) 먼저, 박스 5 나중에. MUST는 끝까지 쫓아 이동 불가 타일 너머까지 추적한다. 지형: 1~3은 벽으로 막힌 연결 방, 4는 2번에서 이어지는 계단 통로, 5는 4 너머의 트인 마당. 5가 같은 목록에 있으면 0x1 너머 우회로 4를 지나 5로 나갈 수 있다.

## this.diablo (getBoss)

### 261003 Claude: 봉인 보스는 `clear(35, 이름)` 한 번
- 최대 50 × 200ms 동안 보스 대기. 보이면 `Attack.clear(35, 이름)`(1단계 호출 위치 35 정리 → 2단계 기준점은 보스, `Attack.md` clear), 끝내 없으면 `Attack.clear(35)`.
- 경위: 260927 보스 지정 호출로 바뀐 뒤, 보스가 25칸 밖이면 목줄로 보스를 대상으로 바꿔 원거리 팔로워가 소환몹 한가운데로 들어감 → 261003 `clear(35)` 선행 호출을 넣었다가 같은 날 2단계 clear가 같은 역할을 해 지움.

## this.anya

### 261025 Claude: 벨트 넣기·남는 물약 정리를 `clearBelt` 끝으로 (`81d5b43`, 사용자 승인, 옛 handoff 3-21·2-17·3-27)
- 끝의 단독 `Town.clearInventory()` 앞(Larzuk 메뉴를 열기 전)에 `Town.clearBelt()`. 전에는 메뉴가 열린 채라 벨트 넣기가 실패. 검증 통과(사용자 261028).

## this.ancients

### 260928 Claude: 고대인 배열 호출
- `clear(0, [540, 541, 542])`. 예전 배열 호출이 놓친 원인(빈 목록 즉시 종료, 첫 성공 전 refresh 없음, shift)이 해소됨.

### 261004 Claude: 리더 포탈 위치와 루프 끝 갱신
- 리더가 118의 120 출구 앞에서 포탈을 열고 전원 들어감(팔로워 `usePortal(118)` → `moveToExit(120)`). 제단을 누르면 정상의 TP가 모두 닫히고, 전투 중 120에서 TP를 열면 고대인이 리셋된다.
- 루프 끝(okCount 뒤)에 `sendPacket(1, 0x40)` + 대기: 죽은 사람의 마지막 퀘스트 갱신이 킬 전이라 루프 조건이 낡은 값을 볼 수 있음(추정, 보험).
- 확인: 261013·261020 로그에서 루프 1회.

### 261028 Claude: 팔로워 tpReady 대기 (`dfc884b`, 사용자 요청, 옛 handoff 3-46)
- 시체 회수 때문에 포탈을 정상 앞(118)에서 열게 바꾼 뒤(261004) 팔로워가 tpReady 없이 118로 가는 아무 포탈이나 타서 리더의 타운치킨 포탈에 합류했다.
- 리더는 `makePortal` 뒤 `tpReady` 전송, 팔로워는 `while (me.inTown) { if (tpReady) usePortal(118, null) }` 뒤 `tpReady = false`. 다른 보스와 같은 방식. 나머지 tpReady 없는 대기 목록은 기각(`rejected.md`).
- 확인: 다른 보스와 같은 기존 로직이라 검증 통과로 처리(사용자 261028).

## this.farmingCows (followDriver)

### 260928 사용자: followDriver 교체
- 드라이버(리더)가 보이면 거리 > 30 → moveTo(clear 없이 따라붙기) + BO, 15~30 → `moveTo(..., 3, true)`(경로 노드마다 clear, `"killMonsters"`면 false), 15 이하 → `Attack.clear(25)`. 안 보이고 msgNode가 있으면 같은 규칙으로 msgNode 기준, 둘 다 없으면 `Attack.clear(15)`.
- 사용자 원문의 msgNode 분기 `getDistance(me, driver) > 15`는 driver가 없는 분기라 `getDistance(me, msgNode[0], msgNode[1]) > 15`로 고쳐 반영(Claude).

### 261025 Claude: 팀 대기를 okCount로 통일 (`f26ef73`, 옛 handoff 3-36·3-47)
- 리더는 `msgLeader`를 한 번만 보냄(반복·`msgFollower` 답장 삭제). 팀 대기는 뒤의 기존 okCount.
- 확인: `this.okCount` 같은 헤더 항목. 검증 통과(사용자 261029).

## onCopyData (main의 copydata 처리)

### 261021 Claude: ToolsThread 중계 받기 (`eddab3a`, 옛 handoff 3-2)
- 처리 본문을 `onCopyData`로 빼서 copydata와 scriptmsg(`{relay: true, id, data}`, ToolsThread가 넘김)에서 부른다. 중계 쪽은 `ToolsThread.md`.
- 확인: 261022·261023 로그. 검증 통과(사용자 261023).

### 261026 Claude: 리더 웨이 모으기 중 okCount 10분 (`d87cfcb`, 옛 handoff 3-36·3-47)
- `case "travel"`: `leaderTravel = true`(`this.okCount` 참고).
- 확인: 웨이 모으기 뒤 120초 퇴장 0 — 261027 웨이 모은 21게임, 261028 Pz-32 Ancient's Way 221초 모으기 뒤 shenk syncBO 8명 통과. 261029 `travel true` 퇴장 0. 검증 통과(사용자 261029).

## main 2·3막 팔로워 루프

### 261028 사용자: 2·3막 팔로워 syncBO 신호를 먼저 지움 (`68483de`, 옛 handoff 3-47)
- `if (syncBO) { this.syncBO(); syncBO = false; }` → `syncBO = false; this.syncBO();` 2곳(2막·3막). 새 변수·함수·로그 없음.
- 이유(261028 코드 읽음): 팔로워가 앞 syncBO의 끝(웨이로 마을 복귀 + 대기)을 도는 동안 받은 다음 `syncBO` 신호를 끝난 뒤 지웠다. 리더는 웨이가 이미 있으면 travel이 바로 돌아와 1초 안팎에 다음 신호를 보낸다(261028 Kurast Docktown 10게임 퇴장, `Traveling to Travincal` 뒤 121~122초).
- 확인: 261029 로그 `Traveling to Travincal` 16회 뒤 Kurast Docktown 웨이 자리 퇴장 0(261028 10게임 연속). 검증 통과(사용자 261029).
