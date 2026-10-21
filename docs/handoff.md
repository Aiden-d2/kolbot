# 인수인계 (미결만)

새 대화는 이 문서부터 읽는다. 항목 상태는 `결정됨, 수정 요청 대기` / `반영됨, 검증 대기` / `로그 검증 중` 중 하나다. 결정 대기·원인 미확인은 따로 묶었다. 확인되면 지우고 `docs/code/`로, 기각되면 `docs/rejected.md`로 옮긴다.

trace 파일은 게임 PC의 `kolbot/_cache/trace/`에 있다. 사용자가 올려 주면 분석한다(방법은 `log_guide.md`, 결과는 `log_results.md`).

## 1. 결정 대기·원인 미확인

### 1-1. getPath 빈 경로 (`Pather.moveTo`)
- **사례**
  - 아케인(261013 Pz-37): a1이 같은 자리(25447,5450)에서 `moveTo no path -> 25019,5454` → `adjusted path -> 25019,5454`(보정 칸 = 원래 목표)를 5,932회 반복. 손으로 캐릭터를 옮기자 경로가 생김 → 출발 위치에 따라 경로가 달라짐. 써모너 리더 while은 사용자가 throw로 끝나게 고침(main `3900f04`·`c002b48`). 남은 경우: 경로는 있는데 `moveTo`가 false(throw 없음)면 while이 계속 돈다(코드 확인, 사례 없음).
  - Jail 2층(4건: 261006 17770,8131 / 10/14 17530,8071 / 10/19 17770,8011, 모두 목표 y 8000대): 사용자 가설(3층 대신 1층 쪽으로 돌아간 뒤 3층 출구로 경로 없음)과 맞는 자료이나 경로가 없는 이유는 미확인.
- **관찰 로그 안(결정 없음):** `moveTo no path` 줄에 엔진 `getCollision(area, 목표)`·`getCollision(area, 내 위치)`(목표가 0xFFFF면 맵 미로드, 내 칸에 막힘·회피 비트면 출발 칸 문제). 그 뒤 사용자 업로드(`b1b5887`)로 빈 경로 처리 줄과 랜덤 걸음이 바뀌어, 이 안을 쓸지 다시 봐야 한다.

### 1-2. 팀 싱크 확장
- okCount(2-1)가 문제없으면 readyCount·buffCount·syncBO(답장 BOCount·BOReady 대신 도착 이름)·카우(`msgFollower`)를 `teamNames`로. 한 단계로 둬도 됨(같은 이름이 연달아 불리지 않음).
- 확장 뒤 싱크 변수·플래그·메시지 이름 통일(`teamOk`/`teamReady`/`teamBuff`/`BOReady`, `imReady`/`myBuff`, `msgLeader`/`msgFollower`, 메시지 이름과 변수·함수 이름 겹침) (사용자 지시 261021).

### 1-3. 소켓 (`Town.socketGems`)
- 재료 제외는 `Runewords.getBase`, 실패 시 커서 보석만 인벤토리로, 보관함 연 상태에서 장착 칸 클릭.

### 1-4. print/trace 중복 정리 (18(2))

### 1-5. Monastery Gate 출구 (`AutoSmurf.js`, 사용자 아이디어)
- "Outer Cloister까지 경로를 만들면 게이트를 반드시 지난다." H1 판별 trace(2-8) 결과를 보고 판단.

### 1-6. 부활·소환형(샤먼) 우선 (보류)
- 거리순 대전제와 충돌한다. 무리 속 파고들기, 근접은 사실상 효과 없음 등 어느 안도 트레이드오프라 사용자가 보류함.

### 1-7. while + catch 무한 루프 (보류, 기록만)
- `AutoSmurf.js`의 `while (목표까지 거리 > N) { try { moveToPreset/moveTo/moveToExit } catch { print } }`는 탈출 조건이 없다. 경로 계산이 계속 실패하면 같은 자리에서 무한 반복(260930 기준 10곳: Arcane, moveToExit, WP, Cube 상자, 저널 2곳, 탈무덤 상자, 3557, Orifice, 빨간 포털). 써모너 리더 while은 1-1처럼 사용자가 고침.

### 1-8. `getQuest` bit 점검 (발견만, 수정 요청 대기)
- `quest_flags.md` 끝의 "kolbot 코드 참조 점검": 14,1·26,1은 항상 거짓, 4,1은 보상 뒤 꺼짐, 22,12는 레드포탈 조건(22,0 또는 22,13)과 다름, 20,6 주석은 의미가 다름.

### 1-9. MoveToSlot 실패 원인 (판별 불가)
- 실패 줄 유지, `inv:` 필드는 삭제(261020). 실패 34건 중 33건 `closed`·1건 `-`, 창을 여는 코드가 없어 성공도 `closed`일 것 → 원인 판별 불가.

## 2. 반영됨, 검증 대기 (261021, 커밋 `eddab3a`·`ab94751`, 정적 분석만)

### 2-1. okCount 이름 수집 (`AutoSmurf.okCount`·`teamCount`·`missing`)
- 바꾼 것: 개수 대신 보낸 프로필 이름(`teamNames`, `this.missing(name)`). 두 단계 유지. ok 이름은 1단계 끝(teamCount 보내기 전)에, teamCount 이름과 teamOk는 2단계 끝에 비운다. 2단계 중 그 프로필의 teamCount보다 먼저 온 okCount는 버린다. 대기 delay 1000 → 200ms. teamOk는 게임 시작 첫 okCount(늦게 들어온 프로필은 앞사람들 ok를 못 받음) 때문에 유지.
- 근거: 끝 일괄 리셋은 연달아 호출(`okCount; doPrecast(true); okCount`)에서 가장 빠른 프로필의 다음 ok를 모두가 지우면 teamOk도 못 나와 멈출 수 있었다(코드 추론). 같은 사람의 메시지는 보낸 순서대로 도착(`sendCopyData` = 동기 `SendMessage`, 이벤트 큐 FIFO).
- 확인: 타임아웃 줄 `[Quit] Party desynced 1/2: missing(okCount|teamCount): 프로필, ... teamOk X`로 안 온 프로필이 남는가. 그 프로필의 같은 시각 trace로 무엇을 하던 중인지(마을행·포털 실패 등) 본다. 261021 전 로그는 `okCount N teamCount N teamOk X`(개수). `log_results.md` desync 분석의 판별 불가 5건(B 실제 지각 / C 리셋 경쟁)을 가르는 용도.

### 2-2. 메시지 중계 (`ToolsThread`, `AutoSmurf.onCopyData`)
- 바꾼 것: 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). ToolsThread가 default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). AutoSmurf 처리 본문은 `onCopyData`로 빼서 copydata·scriptmsg에서 부른다.
- 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → 1-2 확장 때 해소).
- 확인: okCount 대기 중 마을행(TownChicken·Pause)이 있었던 게임에서 desync 타임아웃이 없는가.

### 2-3. `clearToExit` 삭제 (`AutoSmurf.js`)
- 바꾼 것: 20곳은 `moveToExit` 한 번 + 실패 시 `quitGame("moveToExit failed: A -> B")`(moveTo throw는 잡지 않음, 게임 종료). 지역 확인(`me.area === A`)은 유지. 옛 바깥 while 4곳(언더패스 10→5, Jail 29→30·30→31·31→32)은 뒤에 보정 구간(목표 층이 아니면 마을 → 목표 층 포털, `Area reversed` 대기)이 있어 퇴장 없이 한 번 시도(throw도 잡음)하고 보정에 맡김.
- 확인: 콘솔 `moveToExit failed: A -> B` 빈도와 지역.

### 2-4. SafeTele 몹 목록 범위 (`Pather` safeCheckNode)
- 바꾼 것: 몹 목록을 내 위치에서 `max(teleDistance, 노드 거리) + SafeTele.Range` 안으로(후보는 내 위치 35 안, 몹은 후보 Range 안만 셈 → 결과 같음).
- 확인: SafeTele 동작이 이전과 같은가(텔레 이동 중 멈칫·되돌아감 없음).

### 2-5. Town check 직접 처리 (`Misc.townCheck`, `Town.visitTown`)
- 바꾼 것: default.dbj면 `visitTown` 직접(멈춤 없음). `visitTown`이 `goToTown` 동안 `Config.TownCheck`를 꺼(끝나면 원래 값) 포털로 가는 moveTo 안의 재진입을 막음(직접 호출·화살통 경로 모두). TownChicken(visitTown 안에서만 부름)·MapHelper(default와 동시에 움직임)는 기존 메시지.
- 확인: `Town check` 마을행이 정상 왕복하는가, 재진입(마을행 중 또 마을행) 없음.

### 2-6. getQuestItem 사라진 유닛 (`AutoSmurf.getQuestItem`)
- 바꾼 것: `CanFit` 전에 유닛이 사라졌으면(`sizex` undefined, `JSUnit.cpp:191-194`) 다시 찾기 3회, 넘으면 `<classid> vanished`(`Not enough room`으로 가지 않음).
- 확인: trace `vanished` 줄, `Not enough room for undefined`가 사라졌는가.

### 2-7. `clickWP` 삭제, 웨이 random (`Pather.getWP`·`goWP`)
- 바꾼 것: `clickWP` 삭제 → `Pather.getWP`(area 없으면 `me.area`). `goWP`·`getWP` random 이동.
- 확인: 웨이 찍기·이용이 정상인가, 웨이 앞에서 겹쳐 서지 않는가.

### 2-8. 판별 trace와 cancel 삭제
- 바꾼 것: H1 판별 trace(26 Monastery Gate 출구), chores 멈춤 판별 trace, heal 뒤 `me.cancel()`(260908 사용자 추가) 삭제. cancel 15곳 중 나머지는 유지(`stash` 시작의 cancel은 원본에도 있음).
- 확인: H1 trace 결과로 1-5 판단, chores 멈춤 재발 여부.

### 2-9. 콘솔·trace 추가
- 바꾼 것: 눈·심장·뇌 `!!! X !!!`(getQuestItem 성공, 리더), `D2Bot.printToConsole`이 `print("[console] " + msg)`도 함, `[useUnit] timeout`에 id·target·unit 좌표, 팔로워 파티 수락 trace, Life Chicken `mode`·`near` 삭제(`nearMonsters` 함수 삭제).
- 확인: 줄이 형식대로 찍히는가.

### 2-10. 라다먼트 `radamentOff` (`AutoSmurf.radament`)
- 바꾼 것: N+1 `Radament book reset` 직전 리더 캐시 `radamentOff = true`. N+2 리더가 라다먼트 차례에 읽고 지운 뒤 콘솔 `Radament off: tombs, quit at 10 min` → `me.maxgametime = 10분`(엔진이 게임 시작부터 10분에 나감, 다음 게임에 default.dbj가 원래 값으로) → tombs 한 번. 라다먼트 차례엔 써모너가 끝나 리더는 캐니언 WP가 있고, 없는 팔로워는 리더 포털로 들어감. D2BS는 게임 단위 퀘스트 상태(완료 불가)를 읽는 함수가 없어 캐시 표시로 함.
- 확인: 북 분실 뒤 N+2 게임에서 콘솔 줄과 10분 퇴장, N+3에서 북 획득.

## 3. 반영됨, 검증 대기 — 확인용 로그 (261020)

### 3-1. 보스가드·시체 회수 trace (`AutoSmurf.bossGuard`·`bossScan`·`bossEnd`, 261020)
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

### 3-2. 골드 나눔 줄 (`AutoSmurf.giveGold`, 261020 사용자)
- 동작: 주는 양 = 골드 − LowGold, 그것이 1000 미만이면 골드 − 5000. 리더가 골드를 받는 것이 LowGold보다 우선(사용자 의도). 예전 식은 LowGold 아래 팔로워의 양이 음수가 되어 실제로 주고받지 못했음.
- 확인: trace `Picking up/Dropping/Retaking N Gold`가 음수 없이 찍히고 리더가 받는가. 확인 뒤 줄 삭제.

### 3-3. 그 밖의 확인용 줄
- `dropping radament book`(시작 단계 북 버리기 무한 루프 수정 확인용, 47816e6). 확인 뒤 삭제.
- `Not enough room for <이름>`(이름 undefined) → 2-6과 함께 본다.
