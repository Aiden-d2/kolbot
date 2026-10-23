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
  - 대상(`Pickit.socketTargets`): 내 장착 칸 1(머리: 투구·바바·드루 전용·서클릿)·3(몸)·4·5(양손 칸은 종류로: 방패류 2·69·70이면 방패, 그 밖은 무기 — 활·지팡이·양손 무기·바바 두 번째 무기가 칸 5에 있어서) 중 티어가 있고(`NTIP.GetScore > 0`) 빈 소켓이 있으며 룬워드 베이스 재료가 아닌 것(`Config.RunewordRecipe`에서 classid 같고 `getBase` 참). 용병 제외. 부위별 보석 `Config.SocketRecipe`(261023 값은 아래)(itemType 96~102 = 전 등급, classid 557~601 = 그 등급만, 빌드에서 덮어씀). 보석 관문은 96~102 전체. 무기 레벨 18 제한 제거.
  - 줍기(`checkItem` 결과 5, Cubing 판정 앞): 바닥·인벤토리 보석만, 보석 레벨 제한 ≤ 캐릭 레벨. 인벤토리 보석(자기 제외, gid 순)을 대상 순서대로 미리 배정하고, 빈칸이 남은 대상이 이 보석을 받으면 5. nip 무관, 스태시로 가지 않음. 필요 없어지면 기존 판정. 줍기 직후 overhead `(Ingredient)`, ItemLog `Ingredient {가진 개수}`.
  - 장착(`Town.socketGems`, `doChores`의 `stash()` 뒤): 보관함을 열지 않고 `sendPacket(1, 0x28, 4, 보석 gid, 4, 장비 gid)`. 성공 시 ItemLog `Socketed {nip 라인}`(넣은 뒤 `NTIP.Evaluate`), 매니저 아이템 로그 `Misc.logItem("Socketed", 장비, 라인)`(지역 포함), 매니저 콘솔 `[Socket] 보석 베이스 (찬/전체)`(261023 전 `# [Gem]`) 색 5(베이스는 `getLocaleString(getBaseStat(0, classid, "namestr"))`), print `equipped: [칸] 티어`(`Equip.updateTier`). 실패 시 커서 보석은 인벤토리로, 안 되면 `Packet.dropItem` 뒤 `Pickit.pickItems()`, trace `socketGems failed: <보석> -> [칸] <장비>`(`(dropped)`, `(cursor)`).
  - 261023 사용자: 이름 통일(Config `ing` 스위치 + `*Recipe`). `Gemmed` → `Socketing`(ItemLog·매니저 아이템 로그, `Misc.itemLogger` case·`logItem` match) — 노멀 아이템은 이름에 이미 `Gemmed`가 붙어 콘솔에 `Gemmed Gemmed …`로 두 번 찍혔다. 스위치 `Config.Socketing: true` 신설(`Pickit.socketTargets`가 꺼져 있으면 빈 목록 → 장착·보석 줍기 모두 안 함, 보석은 nip 판정). `Config.SocketGems` → `Config.SocketRecipe`, 자리는 `//Cubing` 바로 위, 기본값 `{Head: [100, 99], Body: [100, 99], Shield: [97], Weapon: [101, 98, 99, 100]}`(머리·몸 사파이어 추가, 무기 순서 변경). 함께 `Config.Recipes` → `CubeRecipe`, `Config.Runewords` → `RunewordRecipe`, `Config.MakeRunewords` → `Runewording`(빌드 14개 push 포함).
  - 261023 사용자(2차): ItemLog·매니저 아이템 로그 `Socketing` → `Socketed`(로그는 `ed` 형태로 통일). 콘솔 `# [Gem]` → `[Socket]`. 큐빙 소켓 레시피를 `Punch`로(`RecipeName` `[Socket]` → `[Punch]`, `Recipe.Socket.*` → `Recipe.Punch.*`, Config `CubeRecipe` 포함) — 소켓 보석 줄과 겹치지 않게. 큐빙 `[Rune]` → `[Upgrade]`(뒤에 룬 이름이 붙음). 콘솔 앞 기호 삭제: 큐빙 `@`, 룬워드 `# [Runeword]`·`# [Reset]`, 보석 `# [Gem]`의 `#`.
  - 경위(261021 사용자 로그): 장착 칸 클릭 `clickItem(0, 칸)`은 창을 닫아도·보관함을 열어도 `(cursor)` 실패 → 창 가설 틀림. 패킷 0x28은 보관함을 연 채(5건)·열지 않고도(a6 Wolf Head 2건) 성공. D2MOO 0x28 처리의 상호작용 조건(`PlrMsg.cpp:2543-2556`, 1.10f 재구성)은 1.14d와 다르거나 재구성 차이(추정). 참고: kolbot-SoloPlay도 0x28을 씀.
- **검증 방법**
  - ItemLog `Ingredient`로 빈 소켓 수만큼만 줍는가.
  - `Socketed`(261023 전 로그는 `Gemmed`)가 남고 매니저 콘솔에 `Gemmed`가 한 번만 찍히며, 옵션에 보석 효과가 바로 보이며 티어가 오르는가(노멀은 고정일 수 있음).
  - 콘솔 `[Socket]`의 베이스 이름이 접두·접미 없이 나오는가, 매니저 아이템 로그에 그림·옵션·라인·지역이 다른 로그처럼 나오는가.
  - `socketGems failed` 빈도와 이유, `(dropped)` 뒤 다시 주웠는가. `(cursor)`(Claude 추가 261021): 다음 로그 묶음도 0x28 실패 0건이면 삭제(사용자 결정 261022).
  - 룬워드 베이스·티어 없는 장비에는 넣지 않는가.
  - 261023 이름 바꾼 뒤: 큐빙(`CubeRecipe`)·룬워드(`RunewordRecipe`, 빌드 push 포함)가 이전처럼 돈다(Transmuted·Runeworded 줄). `Socketing: false`면 `Socketed`·`[Socket]`·보석 `Ingredient`가 없다. 콘솔 줄 앞 `@`·`#`가 없고 큐빙이 `[Punch] 베이스`, 룬 합성이 `[Upgrade] Tal Rune` 모양으로 찍힌다.
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

### 3-19. 이동 무한 반복 막기 (`AutoSmurf.exitTo` 외, 옛 2-4 ①②③)
- **바꾼 것**(261022 `482171b`): 새 함수 `AutoSmurf.exitTo(areas, clearPath)` — `moveToExit` 3회(throw도 한 번의 실패로 셈, 배열 경로는 남은 구간부터, "Souls"는 그대로 반환), 실패면 `[Quit] moveToExit failed: A -> B`. 결과를 안 보던 `moveToExit`·`while (me.area …)` 루프를 `exitTo`로: syncBO 2, bossEnd, travel 53·78 대체·110·default(3회 + throw였음 → quitGame), den 2+[2,8], andy 2, cube, amulet 2, tombs, staff, radament [47,48](40·47 외 지역에서 끝없이 돌던 while)·49, duriel 무덤, eye·heart·brain, mephisto, anya, ancients 120 2·[128,129], baal 130·131, farming Countess·Pit·Andy·Mephisto·Nihlathak. 거리 while + catch 6곳은 3회 상한, 못 가면 quitGame(`Arcane portal not reached`, `Cube chest not reached`, `Tomb chest not reached`, `Radament chest not reached`, `Orifice not reached`, `Red portal not reached`). duriel 오리피스 `useUnit(2, 100, 73)` 실패면 `Duriel chamber not entered`. 그대로 둔 것: `Pather.goWP`의 catch(10회 상한), 옛 clearToExit 자리 21곳, travel case 32·100/101·115~129, changeAct, cain·inner 한 번 시도, tome, izual, ancients `moveToExit(120, false)`. 실패 처리를 throw가 아닌 quitGame으로 한 이유: throw는 Loader에서 `MinGameTime` 300초 대기 후 종료라 다른 조기 종료와 어긋남(사용자 결정 261022).
- **배경**(옛 2-4): 사례 `AutoSmurf.brain`(a1 Pz-52, Flayer Dungeon 1 → 2 useUnit 7회 실패 뒤 3층 프리셋으로 이동 → 경로 없음 종료), `AutoSmurf.radament` 리더(10/22 11:30 a1, 49 결과를 안 보고 3층 상자로 가는 while + catch 무한 반복, 손으로 풀림). `moveTo`는 노드 이동 실패·빈 경로에 throw 없이 false도 돌려줘 catch만 지워서는 거리 while이 멈추지 않는다(코드 확인 261022).
- **검증 방법**: 이동 실패가 무한 반복 없이 `[Quit] moveToExit failed` 또는 위 사유 줄로 끝나는가. `[Error] AutoSmurf.exitTo: ...`(throw를 실패로 센 경우)도 함께 본다. 정상 경로가 막히지 않는가(구간 진행).
- **결과**: 기록 없음.

### 3-20. useUnit 조정 (`Pather.useUnit`, 옛 2-4 ④)
- **바꾼 것**(261022 `482171b`, 사용자 확정): 계단 타일(type 5) 클릭 앞 `delay(600)`(오브젝트는 그대로), 클릭 뒤 대기에 걷기 가드(모드 2·3·6이면 상한 4초), 회차 7 → 8, 유닛 위로 붙이는 판정 `> 5` → `> 7`, timeout 뒤 무작위 걸음(내 위치 ±3칸) 대신 유닛 좌표 기준 4방향(±x, ±y) 4칸 자리를 차례로(막힌 자리·내 위치 2칸 이하 자리 건너뜀, 텔레 `teleportTo(x, y, 2)` / 걷기 `walkTo(x, y, 2)`). timeout 직후 이미 넘어갔으면 옆 이동 없이 return(Claude 추가: 옛 지역 좌표로 텔레 반복 방지). 첫 클릭은 지금 자리에서.
- **근거**(`log_results.md` 261022 묶음 2): timeout 414줄 중 a1 350줄, 걷는 프로필은 39연속 중 36개가 1회 뒤 성공(유닛에 0~2칸 붙어 있어도) → "붙어서 안 먹힘"보다 "텔레 직후 클릭이 무시됨"(추정)에 가까움. 원본 kolbot은 클릭 앞 300ms, 대기 3000ms. 소서 시전 FCR 0 기준 13프레임 약 0.52초. 계단 id = LvlWarp `Id`(외부 `d2data`, `ExitWalk`는 진입 방향과 무관). `moveToExit`의 `getNearestWalkable(출구, 10, 2)`(원본 5, 1)는 같거나 더 먼 자리만 고름.
- **검증 방법**: 텔레 캐릭터(a1)의 `[useUnit] timeout` 수와 0회차 timeout 비율(첫 클릭 실패 빈도), 8회 모두 실패 건수. 효과가 있으면 다음에 `me.attacking` 게이트(시전 끝까지, 상한 600ms)로 바꾼다(사용자 261022).
- **결과**: 기록 없음.

### 3-21. chores 물약 마시기·단계별 로그 (`Town.doChores`·`clearInventory`·`buyPotions`, 옛 2-7)
- **바꾼 것**(261022 `482171b`): 남는 물약 정리 세 루프 `.drop()` → `.interact()`(원본 kolbot 동작. NPC 메뉴가 열린 상태에서는 드롭이 안 먹힘, 사용자 퀴버 테스트). 판별 로그: `chores slow` 두 줄 대신 `doChores` 전체가 10초를 넘으면 한 줄 `chores Ns: pre heal id inv [npc:<시작 시 NPC> 08/0C belt Ns/클릭 pots Ns/개수 cube Ns/n stash Ns/n left Ns/n] tome buy [npc Ns buys n shift n fail n] repair rest stash gems`. 단계 값은 `Town.chores` 객체(새 속성)에 모음.
- **근거**(`log_results.md` 261022 묶음 2): buyPotions 5초 초과 580건(중앙값 8~10초, 20초 이상 7건 모두 Lut Gholein 같은 시각), clearInventory 255건(20초 이상 25건, Rogue Encampment 13).
- **검증 방법**: 한 싸이클로 단계별 원인 판정(사용자: 반복 없이 한 번에). 마시기 뒤 inv의 pots 시간이 짧아졌는가, buy가 npc(걷기·열기)인지 구매인지. 제거 조건: 이 싸이클 분석 뒤 삭제.
- **결과**: 기록 없음.

### 3-22. getQuestItem 사라짐 확인 위치 (`AutoSmurf.getQuestItem`, 옛 2-10)
- **바꾼 것**(261022 `482171b`): `item.sizex === undefined` 확인을 `CanFit` 앞에서 `CanFit` 실패 뒤(`canMakeRoom` 앞)로. `CanFit`이 인벤토리를 다시 읽는 동안 유닛이 사라지면 크기가 undefined라 `CanFit`이 false가 되고 `Not enough room for undefined`로 끝나던 경우(261022 a1 하수구 3층)를 vanished로 받음.
- **검증 방법**: `quest item vanished`·`<classid> vanished`가 찍히고 `Not enough room for undefined`가 없어지는가. `quest item vanished, retry N`은 사례를 본 뒤 삭제.
- **결과**: 기록 없음.

### 3-23. 샤먼 우선 (`Attack.clear`, 옛 2-11)
- **바꾼 것**(261022 `482171b`): 4단계 `target = nearestLive || nearest` 뒤, leash 루프 앞. 노말 액트 1이고 target이 MUST가 아니면, entries 중 MUST·deferred가 아닌 샤먼 58·59·60·61(Fallen·Carver·Devilkin·Dark, 외부 `d2data` levels의 액트 1 노말 몬스터 목록) 중 가장 가까운 것을 target으로. MUST가 leash 밖이면 그대로 MUST가 이김.
- **검증 방법**: 노말 액트 1 구간(Den·Blood·Cain·Cathedral 등) 구간 시간, 낙오·`Party desynced` 빈도 전후 비교. 근접 캐릭이 무리 속으로 들어가 맞는 것은 감수(사용자).
- **결과**: 기록 없음.

### 3-24. SafeTele 후보 검사 순서·설정 복원 (`Pather.moveTo` 안 `safeCheckNode`, `Config.SafeTele`, 옛 2-12)
- **바꾼 것**(261022 `482171b`): 후보마다 몹 수를 먼저 세고 `mc >= baseline`이면 건너뜀, 적을 때만 `checkSpot`(처음 보는 방이면 `room.getCollision()` 복사) → 통과하면 채택. 고르는 자리는 전과 같다. `Config.SafeTele` Angle 60 → 75, Step 7 → 5, Min 7 → 10(10-03~10-19 값, 후보 35 → 70개, 링 35·30·25·20·15·10).
- **검증 방법**: 렉이 있던 설정(후보 70개)에서 렉이 줄었는가(Bloody Foothills 등 육안). Min 7 → 10으로 짧은 텔레가 빠져 a1 치킨 비중 변화는 이 변경과 섞여 보인다.
- **결과**: 기록 없음.
