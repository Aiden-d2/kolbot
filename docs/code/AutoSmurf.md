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

## this.okCount / this.teamCount

### 261004 Claude: 죽은 사람도 타임아웃, 타임아웃 상세
- 죽은 사람도 120초 타임아웃(`&& !me.dead` 삭제, 사유 `Dead wait timeout`). 타임아웃 trace 상세에 `okCount`/`teamCount`/`teamOk` 값.
- 확인: 261006 로그. 261021 이름 수집 방식은 `handoff.md` 3-1(검증 대기).

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

## this.den

### 260928 Claude: `Attack.clearLevel` → den 내부 `clearDen`
- Attack의 `clearLevel`을 없애고 den 안의 함수(`clearDen`, 방마다 `clear(30)`)로 옮겼다.

## this.summoner

### 261004 Claude: 공통 보스 보호로 교체
- 기존 `setLifeChicken(0)`·죽음 퇴장·치킨 복구를 `bossGuard(0)`·`bossEnd(10)`으로 교체, `okCount(10)` 유지.

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

## this.ancients

### 260928 Claude: 고대인 배열 호출
- `clear(0, [540, 541, 542])`. 예전 배열 호출이 놓친 원인(빈 목록 즉시 종료, 첫 성공 전 refresh 없음, shift)이 해소됨.

### 261004 Claude: 리더 포탈 위치와 루프 끝 갱신
- 리더가 118의 120 출구 앞에서 포탈을 열고 전원 들어감(팔로워 `usePortal(118)` → `moveToExit(120)`). 제단을 누르면 정상의 TP가 모두 닫히고, 전투 중 120에서 TP를 열면 고대인이 리셋된다.
- 루프 끝(okCount 뒤)에 `sendPacket(1, 0x40)` + 대기: 죽은 사람의 마지막 퀘스트 갱신이 킬 전이라 루프 조건이 낡은 값을 볼 수 있음(추정, 보험).
- 확인: 261013·261020 로그에서 루프 1회.


## this.farmingCows (followDriver)

### 260928 사용자: followDriver 교체
- 드라이버(리더)가 보이면 거리 > 30 → moveTo(clear 없이 따라붙기) + BO, 15~30 → `moveTo(..., 3, true)`(경로 노드마다 clear, `"killMonsters"`면 false), 15 이하 → `Attack.clear(25)`. 안 보이고 msgNode가 있으면 같은 규칙으로 msgNode 기준, 둘 다 없으면 `Attack.clear(15)`.
- 사용자 원문의 msgNode 분기 `getDistance(me, driver) > 15`는 driver가 없는 분기라 `getDistance(me, msgNode[0], msgNode[1]) > 15`로 고쳐 반영(Claude).
