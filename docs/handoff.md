# 인수인계 (미결만)

새 대화는 이 문서부터 읽는다. 항목은 상태별로 세 절에 둔다: 1절 `결정 대기`(논의했지만 진행할지 결정하지 않음) / 2절 `결정됨, 수정 대기`(진행하기로 결정했고 수정 작업 전) / 3절 `수정됨, 검증 대기`(수정 작업을 했고 게임에서 검증 전). 검증되면 지우고 `docs/code/`로, 기각되면 `docs/rejected.md`로 옮긴다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

## 1. 결정 대기 (논의했지만 진행할지 결정하지 않음)

### 1-1. getPath 빈 경로 (`Pather.moveTo`)
- **사례**
  - 아케인(261013 Pz-37): a1이 같은 자리(25447,5450)에서 `moveTo no path -> 25019,5454` → `adjusted path -> 25019,5454`(보정 칸 = 원래 목표)를 5,932회 반복. 손으로 캐릭터를 옮기자 경로가 생김 → 출발 위치에 따라 경로가 달라짐. 써모너 리더 while은 사용자가 throw로 끝나게 고침(main `3900f04`·`c002b48`). 남은 경우: 경로는 있는데 `moveTo`가 false(throw 없음)면 while이 계속 돈다(코드 확인, 사례 없음).
  - Jail 2층(4건: 261006 17770,8131 / 10/14 17530,8071 / 10/19 17770,8011, 모두 목표 y 8000대): 사용자 가설(3층 대신 1층 쪽으로 돌아간 뒤 3층 출구로 경로 없음)과 맞는 자료이나 경로가 없는 이유는 미확인.
- **관찰 로그 안(결정 없음):** `moveTo no path` 줄에 엔진 `getCollision(area, 목표)`·`getCollision(area, 내 위치)`(목표가 0xFFFF면 맵 미로드, 내 칸에 막힘·회피 비트면 출발 칸 문제). 그 뒤 사용자 업로드(`b1b5887`)로 빈 경로 처리 줄과 랜덤 걸음이 바뀌어, 이 안을 쓸지 다시 봐야 한다.

### 1-2. Monastery Gate 출구 (`AutoSmurf.js`, 사용자 아이디어)
- "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다." H1 판별 trace(3-8) 결과를 보고 판단.

### 1-3. 부활·소환형(샤먼) 우선 (보류)
- 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류함.

### 1-4. while + catch 무한 루프 (보류, 기록만)
- `AutoSmurf.js`의 `while (목표까지 거리 > N) { try { moveToPreset/moveTo/moveToExit } catch { print } }`는 탈출 조건이 없다. 경로 계산이 계속 실패하면 같은 자리에서 무한 반복(260930 기준 10곳: Arcane, moveToExit, WP, Cube 상자, 저널 2곳, 탈무덤 상자, 3557, Orifice, 빨간 포털). 써모너 리더 while은 1-1처럼 사용자가 고침.

### 1-5. `getQuest` bit 점검 (발견만)
- `quest_flags.md` 끝의 "kolbot 코드 참조 점검": 14,1·26,1은 항상 거짓, 4,1은 보상 뒤 꺼짐, 22,12는 레드포탈 조건(22,0 또는 22,13)과 다름, 20,6 주석은 의미가 다름.

### 1-6. MoveToSlot 실패 원인 (판별 불가)
- 실패 줄 유지, `inv:` 필드는 삭제(261020). 실패 34건 중 33건 `closed`·1건 `-`, 창을 여는 코드가 없어 성공도 `closed`일 것 → 원인 판별 불가.

## 2. 결정됨, 수정 대기 (진행하기로 결정했고 수정 작업 전)

261021 사용자 결정, 머지 뒤 다음 대화로 미룸.

### 2-1. 팀 싱크 확장 (3-1 검증 뒤)
- okCount(3-1)가 검증되면 readyCount·buffCount·syncBO(답장 BOCount·BOReady 대신 도착 이름)·카우(`msgFollower`)를 `teamNames`로. 한 단계로 둬도 됨(같은 이름이 연달아 불리지 않음).
- 확장 뒤 싱크 변수·플래그·메시지 이름 통일(`teamOk`/`teamReady`/`teamBuff`/`BOReady`, `imReady`/`myBuff`, `msgLeader`/`msgFollower`, 메시지 이름과 변수·함수 이름 겹침) (사용자 지시 261021).

### 2-2. print/trace 중복 정리 (18(2), 3절 검증 뒤)
- 3절 검증용 줄이 바뀌지 않도록 3절 검증이 끝난 뒤에 한다(사용자 결정 261021). 범위(print·trace 중복 / 콘솔+print 중복 / 로그 규칙 위반)는 그때 정한다.

### 2-3. 소켓 장착을 매니저 아이템 로그에도 (`Town.socketGems`, 사용자 메모 261021)
- 지금 소켓 성공은 `_cache/ItemLog.txt`(`Misc.itemLogger("Socketed")`)에만 남는다. 매니저(D2Bot#) 아이템 로그에도 나오게 한다(`Misc.logItem`, 장착 성공의 `Misc.logItem("Equipped [티어]")`와 같은 방식). 범위(소켓만인지, 다른 ItemLog 줄도인지)와 표시 형식은 작업할 때 정한다.

## 3. 수정됨, 검증 대기 (수정 작업을 했고 게임에서 검증 전)

261021 수정분(커밋 `eddab3a`·`ab94751`, 정적 분석만)과 261020 확인용 로그.

### 3-1. okCount 이름 수집 (`AutoSmurf.okCount`·`teamCount`·`missing`)
- 바꾼 것: 개수 대신 보낸 프로필 이름(`teamNames`, `this.missing(name)`). 두 단계 유지. ok 이름은 1단계 끝(teamCount 보내기 전)에, teamCount 이름과 teamOk는 2단계 끝에 비운다. 2단계 중 그 프로필의 teamCount보다 먼저 온 okCount는 버린다. 대기 delay 1000 → 200ms. teamOk는 게임 시작 첫 okCount(늦게 들어온 프로필은 앞사람들 ok를 못 받음) 때문에 유지.
- 근거: 끝 일괄 리셋은 연달아 호출(`okCount; doPrecast(true); okCount`)에서 가장 빠른 프로필의 다음 ok를 모두가 지우면 teamOk도 못 나와 멈출 수 있었다(코드 추론). 같은 사람의 메시지는 보낸 순서대로 도착(`sendCopyData` = 동기 `SendMessage`, 이벤트 큐 FIFO).
- 확인: 타임아웃 줄 `[Quit] Party desynced 1/2: missing(okCount|teamCount): 프로필, ... teamOk X`로 안 온 프로필이 남는가. 그 프로필의 같은 시각 trace로 무엇을 하던 중인지(마을행·포털 실패 등) 본다. 261021 전 로그는 `okCount N teamCount N teamOk X`(개수). `log_results.md` desync 분석의 판별 불가 5건(B 실제 지각 / C 리셋 경쟁)을 가르는 용도.

### 3-2. 메시지 중계 (`ToolsThread`, `AutoSmurf.onCopyData`)
- 바꾼 것: 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). ToolsThread가 default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). AutoSmurf 처리 본문은 `onCopyData`로 빼서 copydata·scriptmsg에서 부른다.
- 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → 2-1 확장 때 해소).
- 확인: okCount 대기 중 마을행(TownChicken·Pause)이 있었던 게임에서 desync 타임아웃이 없는가.

### 3-3. `clearToExit` 삭제 (`AutoSmurf.js`)
- 바꾼 것: 20곳은 `moveToExit` 한 번 + 실패 시 `quitGame("moveToExit failed: A -> B")`(moveTo throw는 잡지 않음, 게임 종료). 지역 확인(`me.area === A`)은 유지. 옛 바깥 while 4곳(언더패스 10→5, Jail 29→30·30→31·31→32)은 뒤에 보정 구간(목표 층이 아니면 마을 → 목표 층 포털, `Area reversed` 대기)이 있어 퇴장 없이 한 번 시도(throw도 잡음)하고 보정에 맡김.
- 확인: 콘솔 `moveToExit failed: A -> B` 빈도와 지역.

### 3-4. SafeTele 몹 목록 범위 (`Pather` safeCheckNode)
- 바꾼 것: 몹 목록을 내 위치에서 `max(teleDistance, 노드 거리) + SafeTele.Range` 안으로(후보는 내 위치 35 안, 몹은 후보 Range 안만 셈 → 결과 같음).
- 확인: SafeTele 동작이 이전과 같은가(텔레 이동 중 멈칫·되돌아감 없음).

### 3-5. Town check 직접 처리 (`Misc.townCheck`, `Town.visitTown`)
- 바꾼 것: default.dbj면 `visitTown` 직접(멈춤 없음). `visitTown`이 `goToTown` 동안 `Config.TownCheck`를 꺼(끝나면 원래 값) 포털로 가는 moveTo 안의 재진입을 막음(직접 호출·화살통 경로 모두). TownChicken(visitTown 안에서만 부름)·MapHelper(default와 동시에 움직임)는 기존 메시지.
- 확인: `Town check` 마을행이 정상 왕복하는가, 재진입(마을행 중 또 마을행) 없음.

### 3-6. getQuestItem 사라진 유닛 (`AutoSmurf.getQuestItem`)
- 바꾼 것: `CanFit` 전에 유닛이 사라졌으면(`sizex` undefined, `JSUnit.cpp:191-194`) 다시 찾기 3회, 넘으면 `<classid> vanished`(`Not enough room`으로 가지 않음).
- 확인: trace `vanished` 줄, `Not enough room for undefined`가 사라졌는가.

### 3-7. `clickWP` 삭제, 웨이 random (`Pather.getWP`·`goWP`)
- 바꾼 것: `clickWP` 삭제 → `Pather.getWP`(area 없으면 `me.area`). `goWP`·`getWP` random 이동.
- 확인: 웨이 찍기·이용이 정상인가, 웨이 앞에서 겹쳐 서지 않는가.

### 3-8. 판별 trace와 cancel 삭제
- 바꾼 것: H1 판별 trace(26 Monastery Gate 출구), chores 멈춤 판별 trace, heal 뒤 `me.cancel()`(260908 사용자 추가) 삭제. cancel 15곳 중 나머지는 유지(`stash` 시작의 cancel은 원본에도 있음).
- 확인: H1 trace 결과로 1-2 판단, chores 멈춤 재발 여부.

### 3-9. 콘솔·trace 추가
- 바꾼 것: 눈·심장·뇌 `!!! X !!!`(getQuestItem 성공, 리더), `D2Bot.printToConsole`이 `print("[console] " + msg)`도 함, `[useUnit] timeout`에 id·target·unit 좌표, 팔로워 파티 수락 trace, Life Chicken `mode`·`near` 삭제(`nearMonsters` 함수 삭제).
- 확인: 줄이 형식대로 찍히는가.

### 3-10. 라다먼트 `radamentOff` (`AutoSmurf.radament`)
- 바꾼 것: N+1 `Radament book reset` 직전 리더 캐시 `radamentOff = true`. N+2 리더가 라다먼트 차례에 읽고 지운 뒤 콘솔 `Radament off: tombs, quit at 10 min` → `me.maxgametime = 10분`(엔진이 게임 시작부터 10분에 나감, 다음 게임에 default.dbj가 원래 값으로) → tombs 한 번. 라다먼트 차례엔 써모너가 끝나 리더는 캐니언 WP가 있고, 없는 팔로워는 리더 포털로 들어감. D2BS는 게임 단위 퀘스트 상태(완료 불가)를 읽는 함수가 없어 캐시 표시로 함.
- 확인: 북 분실 뒤 N+2 게임에서 콘솔 줄과 10분 퇴장, N+3에서 북 획득.


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

### 3-12. 골드 나눔 줄 (`AutoSmurf.giveGold`, 261020 사용자)
- 동작: 주는 양 = 골드 − LowGold, 그것이 1000 미만이면 골드 − 5000. 리더가 골드를 받는 것이 LowGold보다 우선(사용자 의도). 예전 식은 LowGold 아래 팔로워의 양이 음수가 되어 실제로 주고받지 못했음.
- 확인: trace `Picking up/Dropping/Retaking N Gold`가 음수 없이 찍히고 리더가 받는가. 확인 뒤 줄 삭제.

### 3-13. 그 밖의 확인용 줄
- `dropping radament book`(시작 단계 북 버리기 무한 루프 수정 확인용, 47816e6). 확인 뒤 삭제.
- `Not enough room for <이름>`(이름 undefined) → 3-6과 함께 본다.

### 3-14. `canMakeRoom` 0·4 (`Pickit.canMakeRoom`, 261021)
- 바꾼 것: 0·4는 `Town.ignoredCheck`가 참이면 자리를 만들 수 있다고 본다(마을 clearInventory 인벤토리 정리와 같은 판정: 0은 팔거나 버림, 4는 팖). 예전에는 0은 건너뛰고 4는 스태시 빈자리(`canStash`)로 판정해, 비울 수 있는데도 `Not enough room`으로 포기했다. 5(소켓 보석, 3-15)는 건너뜀. 261021 사용자 기각이었으나 소켓 작업(3-15)에서 같은 판정이 걸려 다시 보고 반영(사용자 결정 261021).
- 감수: clearInventory의 4 판매가 계속 실패하면 마을 왕복이 반복된다(기존 코드도 스태시에 자리가 있으면 같음).
- 확인 로그(Claude 추가 261021, 사용자 승인): trace `make room: <이름> (result 0|4)`(마을로 가게 한 물건), `make room skip: <이름> (result 5)`(소켓 보석이 자리를 막음, 3-15 도입 뒤 관찰).
- 확인: `make room` 뒤 같은 물건의 ItemLog `Sold`·`Dropped`가 있고 돌아와 줍는가 → 맞음. 같은 이름의 `make room`이 되풀이되면 왕복 반복 → 그 물건이 왜 안 치워졌는지 본다. `make room skip`은 보석 때문에 줍기를 포기한 빈도. 확인 뒤 두 줄 삭제.

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
- 나중(사용자 결정): 빌드별 보석 종류 Config(itemType 또는 classid로 등급 지정 가능), 무기 룬 확장, 용병.
- 참고(Claude 조사): kolbot-SoloPlay `SoloWants.js`·`ItemUtils.js`가 비슷한 설계(퍼펙트만 기다림, 장착 해제 뒤 패킷 0x28). D2MOO 서버는 장착 중 아이템 소켓을 허용(`Rcv0x28_SocketItem`), 보석 스탯은 장비 스탯에 합쳐짐(`STATLIST_MergeStatLists`, 클라이언트는 미확인).
- 확인:
  - ItemLog `Ingredient {socket}`로 빈 소켓 수만큼만 줍는가(넘게 줍지 않는가).
  - ItemLog `Socketed`가 남고, 옵션에 보석 효과(루비 생명, 다이아 저항 등)가 바로 보이며 `Tier 전 -> 후`가 오르는가(노멀 등급은 티어 고정이라 같을 수 있음). 장착 칸 클릭으로 실제 들어가는가.
  - trace `socketGems failed` 빈도와 이유, `(dropped)` 뒤 다시 주웠는가.
  - 룬워드 베이스(예: 빈 3소켓 브레스트플레이트)·티어 없는 장비에는 넣지 않는가. 레벨 19 이후 무기용 보석이 정리되는가.
  - `make room skip ... (result 5)`(3-14) 빈도.
