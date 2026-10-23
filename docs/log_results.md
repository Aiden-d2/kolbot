# 로그 분석 결과

받은 로그 묶음마다 분석 결과를 쌓는다. 분석 방법은 `log_guide.md`. 결과로 코드를 바꾸면 해당 코드 노트(`docs/code/`)에, 기각하면 `rejected.md`에 결론을 남기고 여기는 근거로 둔다.

## 260930 trace 8개 (a1~a8)
a4·a5는 해머딘(`[SP] detour` 0건, 해머는 setPosition을 안 거침), a7은 N.SUMM.
- 벽 너머·강 너머 스킵 통과: `[AC] drop unreachable` 3732건(Abaddon·Pit of Acheron·Infernal Pit·탈무덤 순). 같은 몹 반복 제외 최장은 Den of Evil Gargantuan Beast 4:14~4:15(a4 19회)로, 이동 중 clear가 부를 때마다 다시 판정한 것이고 제자리에 묶이지 않았다. `[SP] detour` 464건, 경로/직선 비 중앙값 4.6(DetourPath 4). 이 중 118건은 `path:0`(getPath 빈 배열)이라 우회 과다가 아니라 경로 없음이다.
- 해머딘 헛돎 없음: 같은 자리에서 같은 몹을 5회 넘게 제외한 경우는 3~5초짜리(카우 레벨, 탈무덤 #6 대기 루프)뿐.
- 박스 울타리 통과: `[SP] fence` 16건(a8 트라빈컬 Toorc 15회/2초, a2 1회). 박스 밖 자리를 걸렀고, a8은 2초 뒤 clear가 끝남.
- MUST deferred 통과: `[AC] defer unreachable` 4건, `[AC] defer`(스킬 없음) 34건 모두 0~18초 안에 clear가 끝남(최장: 탈무덤 #2 Apparition 18초).
- 대기 구간: 같은 자리에서 `[AC] end casts:0`이 10회 이상 이어진 구간 845개, 합계 약 9000초. 최장은 카오스 생추어리·증오의 억류지 3층·Frozen River 등 팔로워 대기 루프(최장 121초, 초당 약 2회 clear 호출). 설계상 대기 중 방어이며, 버벅거림 여부는 trace로 판단 불가.

## 261006 150런 (10/4 14:54 ~ 10/5 22:27, 8프로필 179게임)

### 치킨
| 구간 | 게임 | 치킨 | 게임당 |
|---|---|---|---|
| 노멀 | 45 | 17 | 0.38 |
| 나메 | 17 | 0 | 0 |
| 헬 퀘스트 | 18 | 11 | 0.61 |
| 헬 파밍 | 99 | 29 | 0.29 |

- 사망 3건(`You died in last game`) 모두 파밍 a1이 WSK 2층에서 치킨한 직후. 마나·용병 치킨 0.
- 설정: `LifeChicken` 헬 35, 노멀·나메 20. `TownHP` 40(18레벨부터).
- 장소: Chaos Sanctuary 16(파밍 12, 주로 해머딘 a4·a5), WSK 2층 9(전부 a1 리더, 파밍), Arcane 4(노멀 a1 연속, 텔레 실패 직후), Travincal 3, Throne 3 등. 프로필: a1 25, a5 13, a4 12, a6 3, a2 2, a3 1, a8 1, a7 0.
- 확인: 헬 치킨 40건 중 39건이 타운치킨 발동 0~1초 뒤 = HP가 40%→35% 아래로 1초 안에 급락. 헬 타운치킨 239회 중 200회(84%)는 치킨 없이 다녀옴. 치킨 시점 HP는 a1이 12~33%로 깊다.
- 확인: 지역 진입 직후에 많다. 헬 퀘스트 11건 중 8건, 파밍 29건 중 17건이 진입 22초 안.
- 추정: 치킨 뒤 `default.dbj ended`까지 0~1초 48건, 2~4초 9건. 사망 3건은 모두 2~4초 쪽.

### 보스가드 (당시 설정)
| 보스 | 설정 | 난이도 | 켜짐/못 켜짐 | 실제 HP 보통 / 최저 | 꺼진 시간 |
|---|---|---|---|---|---|
| 안다리엘 | 15 | 노멀·나메·헬 | 15/1, 7/1, 8/0 | 13~15/5, 13~14/6, 11~14/2 | 10~19, 12~17, 27~29초 |
| 라다먼트 | 85 | 노멀·나메·헬 | 8/0씩 | 66~84/38, 76~84/72, 52~73/38 | 6~8, 10~12, 13~15초 |
| 써모너 | 0 | 전체 | 31 | - | 도착부터. 사망 1건(회수 성공) |
| 메피스토 | 15 | 노멀·나메·헬 | 8/0씩 | 13~15/7, 13~15/9, 12~14/2 | 6~7, 9~11, 3~5초 |
| 이주얼 | 15 | 전체 | 23/1(헬) | 11~15/10 | 9~15초 |
| 디아블로 | 15 | 노멀·나메·헬 | 8/0, 8/0, 5/3 | 13~15/5, 9~15/9 | 8~25, 4~5초 |
| 쉥크 | 15(노멀) | 노멀 | 7/1 | 10/1 | 10~11초 |
| 쉥크 | 85 | 나메·헬 | 6/2, 8/0 | 73~80/71, 80~84/68 | 27~28, 39~68초 |
| 에인션트 | 15(마지막 1마리) | 노멀·나메·헬 | 8/0, 6/2, 8/0 | 9~13/3, 모두 1, 4~5 | 12~13, 10~12, 13~14초 |
| 바알 | 15 | 노멀·나메·헬 | 7/1, 7/1, 8/0 | 11~15/2, 13~14/1, 13~15/13 | 18~20, 25~27, 9~11초 |

- 팔로워 가드가 지역 진입 3초 안에 켜진 비율: 메피 21/21, 이주얼 20/20, 쉥크 17/18, 라다먼트 19/21, 안다 13/26, 디아·바알·에인션트 1/57. → 메피·이주얼·쉥크는 팔로워가 마을에서 기다리는 동안 리더가 혼자 기준 아래까지 잡아 둔다.
- 못 켜진 13건: 마을 체류 1, 같은 지역 이동 중 킬 2, 주기 사이 사망 추정 4(해머딘이 4), 에인션트 조건이 1초 미만만 성립 2, 원인 불명 1, 코드상 설명 안 됨 2(Pz-46 a4 안다, Pz-72 a5 이주얼: `boss not found`가 없어 산 보스를 봤는데 앞사람들이 이미 기준 아래를 봤음). "주기 사이" 근거(추정): HP 확인은 clear 한 바퀴에 한 번, 해머딘은 한 틱에 해머 3번 연속.
- 이 결과로 사용자가 쉥크 50, 에인션트 10·2마리 이하로 고침(261006~261020).

### 로그 판정 (261006, 확인 항목과 로그 정리)
- 용병 `[MP]`: 고용 8회 모두 NPC 도착 뒤에만 수신 → 통과, 로그 삭제.
- 빨간 포털 `usePortal 342`: 583회 사용, 실패 1회. 첫 전송에 넘어감 60%(1회 351, 2회 124, 3회 66, 4회 32, 5회 10), `loading at:-1` 42%. 원인 추적 중단, 로그 삭제.
- 상자 `[chest] skip`: objtype 하위 7비트 1~8만(825건), fire는 Tristram CorpseOnStick 32건 → 통과, 로그 삭제(제외 동작은 유지).
- `[TK] cancel during talk` 0건, 상점 중복 0건, 레벨 1 첫 시작 fillTome 이동 없음, 좁은 지역 텔레 간격·Tristram 빈 경로 0건 → 통과, 로그 삭제.
- `[TK] talk skipped`: 401건 중 399건이 1, 3이 1건, Greiz(용병 고용 중) 20이 1건 → 20회를 다 쓸 때만 남김.
- moveTo 빈 경로 66건: 흩어지기 목표가 막힌 칸(Kurast Docktown 웨이 주변 27, Canyon 10, Chaos 9, Harrogath 5), 다른 지역 좌표로 이동 시도 8건(a1 Jail 2층 → 17770,8131 6회, a6 Jail 1층 → 15134,4546, a3 Worldstone Chamber → 15090,5005).
- TP 실패(H1~H4) 추적 중단: 원래 사건(하수도)은 재현 안 됨, 179게임에 1건이었고 그것도 TP 타다 사망, H4(`existing`) 0건.
- 벨트(회복) 물약 실패 24건: 1건(a1 TP 책, Rogue)을 빼고 모두 Harrogath 게임 시작의 회복 물약 → 인벤토리 지정 칸(`AutoSmurf.start`, `rejSlots`). `slot:empty`이고 `dropped:<그 물약>`(mode 5) → 옮기던 물약이 커서에 남아 바닥에 버려짐(칸 맞바뀜 가설은 틀림). ItemLog에 회복 물약 기록 0건(버림이 안 남음). 원인 미확정(`handoff.md` 1-6).
- 이동: `moveTo entered town` 2건 정상, `[teleportTo failed]` 10건, `[useUnit] timeout` 84건(지역 30·118·46·35·130 순).
- 계정 생성: 5건 모두 `(timeout)`(8명 동시 생성 중 5명, 재시작 뒤 성공). 팝업 문구 미확인.
- 감정: `identify failed/slow` 0건 → 멈춤 해소로 봄. 팀 대기: a5 크래시 때 약 1분 대기 뒤 생성. 시체 회수 1건(a1 노멀 써모너) 성공. 라다먼트 북 정상 경로 24/24. okCount 타임아웃 29건이 대부분 `okCount 6`(필요 7) = 한 명 없음.

### 그 밖의 관찰 (261006, 결정 없음)
- 이유 없이 끝난 게임 13개: 크래시 2, 마지막 게임 1, 30분 시간 초과 3(Pz-3·Pz-64는 약 20분 기록 없이 멈춘 뒤), 매니저 일시정지 2(Pz-4·8), 원인 불명 5(Pz-13·19·140·141·155, 8명 같은 초 종료).
- 리더 Pz-139 무사유 종료(바알 souls 뒤 치킨, 다음 게임 4초 만에 종료, 팔로워 2분 남아 desync).
- `Baal: Couldn't find portal` 3건, `boss not found: Grand Vizier` 113건(팔로워), 큐브 `Transmuted Fail` 8건, d2bs 경고 `pather.js areas[area]` 7건.
- 바알 파밍 중 `Baal failed: souls found`(print만) 280줄(파밍 99게임 중 약 35게임으로 추정).
- trace 양(정리 전): moveTo 3줄이 약 38만 줄(전체의 80%), doChores 단계 19줄이 약 7.5만 줄(16%).

## 261013·261020 묶음
데이터: 261013(10/12 12:42~10/13 02:13, 74게임, trace·d2bs·ItemLog, 콘솔 없음) + `261014 jail.txt`(10/14 콘솔 발췌) + 261020(10/19 12:13~10/20 19:46, 약 161게임, ScriptErrorLog 포함, 실행 중 코드 바뀜). 두 묶음 모두 261021 수정 전 코드.

### desync 원인 (261013 묶음, 7게임)
타임아웃은 각자 okCount 진입부터 120초라, desync 줄 시각 − 120초 = 그 프로필의 진입 시각. 거의 모두 `okCount 6 ... teamOk false`(아무도 7을 못 채움).
- (A) 확인 2건, okCount 대기 중 마을행으로 default가 멈춰 teamOk·teamCount를 버림(엔진은 멈춘 스크립트의 copydata를 버림, `Events.cpp:230`): Pz-66 a1, Pz-44 a8.
- 판별 불가 5건(나간 프로필 자신은 마을에 안 감, 한 명의 okCount를 못 받음): Pz-38 a6(a4가 Town chicken 4연속 2분 넘게 → B 유력), Pz-21 a4, Pz-19 a7, Pz-23 a2·a4, Pz-11 a3·a5. 가능한 설명: (B) 한 명이 120초 안에 okCount에 못 옴(실제 지각), (C) 보냈지만 받는 쪽 리셋에 지워짐(끝 일괄 리셋 경쟁). 누가 언제 보냈는지 기록이 없어 못 가름.
- 대응(261021): A는 중계, C는 단계 끝 비우기, B는 `missing(...)` trace로 판별(`handoff.md` 3-1·3-2).
- 261020 묶음의 okCount 넘침(14·13)은 사용자가 한 프로필만 계속 재시작한 테스트 탓. 판정에서 제외.

### TownChicken (261013·261020)
- TownChicken이 느린 것은 스레드 탓이 아니라 HP 발동(맞는 중)일 때뿐. 발동~도착 2초 이상 = Town check 8% / HP 발동 42% / default 직접(화살통·용병) 4%.
- 도착 전 치킨 47건의 순간 모드는 4(피격) 29, 1(대기) 13, 10(시전) 4.
- TownChicken을 끄면 HP 마을행 146건 중 도착한 95건(65%)이 전투에 남음 → 유지(`rejected.md`).
- 타운치킨 발동 0~3초 뒤 Life Chicken: 15/29(261013), 30/44(261020).

### 본 흐름에 끼어드는 곳 (261021 코드 확인)
- default 안에서 직접 `visitTown`: 직업 공격 `doAttack`(용병·수리·화살통), `Pickit.pickItems`(자리 부족), `getQuestItem` → 멈춤·유실 없음. Town check(물약)는 261021부터 직접.
- HP/MP 마을행(TownChicken)·Pause 키 → default 멈춤 → 중계로 막음.
- 동시 동작(멈춤 없음, 메시지 무관): ToolsThread(물약·치킨), PartyThread(`clickParty`), AutoBuildThread(스탯·스킬).

## 261022 묶음 (10/21 21:54 ~ 10/22 09:35, 8프로필 65게임)
데이터: trace·d2bs·콘솔·ItemLog·ScriptErrorLog(Pz-1~65, 보스는 대부분 8명 × 2회 = 16건). 실행 중 코드가 바뀐 것으로 보임: 소켓 장착이 23:36까지 장착 칸 클릭판(실패만), 23:40부터 0x28판(성공만). main 병합(#63) 23:55, 사용자 업로드 `d8af14f` 09:34(실행 끝난 뒤). 어느 시각에 어느 판이었는지는 사용자 확인 전.
- 이 절은 분석 결과(근거)만 둔다. 이 결과로 정한 다음 단계(한 싸이클 더 관찰, 2절 결정, 1절 검토 항목)는 `handoff.md`를 따른다. 아래 판정 중 대화에서 바로잡은 것은 "정정(261022)"으로 표시.

### handoff 3절 판정
- 3-1 okCount 이름: 안 온 프로필이 이름으로 남음. desync 2게임 3줄.
  - Pz-5 Tamoe Highland: a1·a7 `missing(okCount): a5, a8`. a5는 같은 시각 아직 Black Marsh에서 화살통 마을행(`visitTown start by:default.dbj` 22:42:28 ~ back 22:43:01) → 실제 지각(B). a8은 그 시간 trace·d2bs 기록 없음(하던 일 모름).
  - Pz-30 Travincal: a6 `missing(okCount): a3`. a3은 구간 시작(02:20:45)부터 퇴장까지 기록 없음.
- 3-2 중계: `relay N msgs` 6건. 5건은 `Town chicken` 다녀온 직후(2~7 msgs), 그 게임들 desync 없음 → 동작. 1건(a6 Pz-13, 23:46:49 Rogue Encampment)은 마을행 없음: 게임 시작 뒤 약 2분 default.dbj 기록 없고 a4 `Team didn't join the game within 2 minutes` → 원인 미확인.
- 3-3 clearToExit 삭제: `moveToExit failed` 0건. moveToExit 안의 moveTo throw로 게임 종료 2건(a7 Pz-15 Claw Viper Temple Level 2, a1 Pz-22 Tal Rasha's Tomb #4, 설계대로 잡지 않음; 둘 다 아래 "추가 분석"의 A유형). 언더패스·Jail 보정 구간이 돈 기록 없음 → 케이스 없음.
- 3-4 SafeTele 범위: 정정(261022) — 결과가 같은 것은 거리 관계로 보장된다(후보 칸은 모두 내 위치에서 `teleDistance` 35 안, 원래 노드는 노드 거리, 몹은 후보에서 Range 안만 셈 → 내 위치에서 `max(teleDistance, 노드 거리) + Range` 밖의 몹은 어느 후보에서도 세어지지 않음, 남는 차이는 후보 좌표 `Math.round`의 1칸 미만 경계뿐). trace의 목적(거르기로 얼마나 빠지나)은 달성: `[SafeTele] monsters`는 a1 5,365줄, 평균 26마리 중 12마리가 범위 안(47%). a2(SafeTele 꺼짐)도 348줄: trace가 `safeCheckNode`의 `Enabled` 검사 앞(`Pather.moveTo`)에 있어서 찍힘, 동작 영향 없음.
- 3-5 Town check 직접: 58건 모두 바로 `visitTown start by:default.dbj`. 50건 back, 7건 마을에 있는 동안 다른 프로필 퇴장으로 게임 종료, 1건 TP 타기 실패(a8 00:02:11 `usePortal failed` 14회 → `goToTown take TP failed`) 뒤 다시 Town check → 00:03:08 back. 마을행 중 또 마을행(중첩) 0건 → 통과.
- 3-6 getQuestItem: `vanished`·`Not enough room` 0건 → 상황 없음. 북 16, 눈·심장·뇌 각 2.
- 3-7 getWP: `menu not opened` 72건(try:0 67, try:1 5, 그 이상 0), `[goWP] Failed` 0. 실패 2건: a1 Pz-49·Pz-50 연속 ANDY Catacombs Level 2 `[getWP] waypoint unit not found` → `[WP] wp.area:null` 12회 → `useWaypoint: Failed to use waypoint`. goWP 실패 줄 없음, Pz-51은 정상 → 원인 못 찾음. 겹쳐 서기는 로그로 못 봄.
  - 추가(261022): 두 건 모두 getWP 때 이미 2층(`area:35`). Pz-49는 06:35:20 1층 → 2층 `useUnit` timeout iter:0 뒤 넘어가 06:35:22 goWP(`going to nearest WP`), 06:35:28 웨이 못 찾음. 코드: goWP는 실패 줄이 없으면 프리셋 10칸 안에 왔다고 판단한 것, `useWaypoint`는 웨이 유닛이 없으면 움직이지 않고 그 자리에서 재시도한 뒤 throw. 웨이 프리셋 좌표·거리가 줄에 없어 "웨이 앞에 못 감"과 "갔는데 유닛 조회 실패"를 못 가름 → 판별 trace(handoff 2-6).
- 3-8 H1 `[exit]`: 2게임 9줄 모두 `type:1 exit:15140,5000 dest:15140,5001`, 모두 Outer Cloister로 넘어감(실패 0). 정정(261022): 판정 못 한 이유는 맵 대조가 아니라, `[exit]`가 26 안에서 26 → 27 출구만 찍고 벽 쪽 진입을 정하는 7 → 26 출구는 찍지 않기 때문. 얻은 것: 게이트 위치 `15140,5000`(사용자), 26 진입 자리(줄을 찍을 때 위치) 약 `15180,5087` = 벽 쪽 진입 자리(사용자), 차이 x 40·y 87(직선 약 96). H1의 문제·목적은 handoff 1-2, `[exit]`는 261022 삭제.
- 3-8 chores 멈춤: clearInventory 226건(중앙 7.8초, 20초 이상 19, 최대 47.4초), buyPotions 302건(중앙 8.9초, 최대 21.6초). `buy failed` 7건은 모두 a2 골드 부족(211·370, mp4). 긴 clearInventory는 판매 수와 무관: 판매는 처음 몇 초에 끝나고 나머지는 기록 없음(예: a6 00:06:18 47.4초, 판매 2건 00:05:28·30). 같은 시각 여러 프로필이 길다(00:06:02~18 a4·a6·a7, 02:05:32~50 a4·a5·a7) → 원인 못 찾음.
  - 추가(261022): 정정 — a6 00:06:18 47.4초의 판매 2건(00:05:28·30)은 clearInventory 시작(00:05:31) 전이다. 긴 사례 여럿(a6 00:06:18 47.4초, a7 00:06:02 21.7초)은 clearInventory 동안 ItemLog·trace가 하나도 없음 → 그 사례에서는 인벤토리 팔기·버리기(ItemLog 남김)·큐브 비우기(trace 남김)가 아님. 남는 것은 기록을 남기지 않는 벨트 물약 되돌리기·보관함 비우기(코드 기준 추정). 20초 이상 19건 중 7건이 게임 시작 40초 안(게임 시작만은 아님). 멈추는 함수는 clearInventory로 특정(buyPotions는 20초 이상 1건). 세부 검토는 handoff 1-8.
- 3-9 콘솔·trace: 리더 콘솔에 `!!! EYE/HEART/BRAIN !!!`와 옛 `=== EYE/HEART/BRAIN ===`가 1~3초 차로 둘 다 찍힘(중복, 사용자 업로드 `d8af14f`에서 하나로 정리). `[console]` 미러, `[useUnit] timeout`의 id·target·unit(189줄), Life Chicken에서 mode·near 빠짐 확인. `party accept` 579줄, MoveToSlot 실패 0건이라 겹침 판정은 상황 없음.
- 3-10 radamentOff: 북 리셋 0건 → 상황 없음. 북 정상 경로(visible → read) 16/16.
- 3-11 보스가드: 사망 0(`You died` 0, `revive start` 0), 가드 중 Life Chicken 0, 가드 중 `Town chicken` 1(a4 쉥크). 시체 회수 상황 없음.

| 보스(pct) | chicken off HP | off → last |
|---|---|---|
| 써모너(100) | 100 12건, 늦게 온 팔로워 87·87·87·15 | 0~4.7초 |
| 라다먼트(85) | 52~84 | 0.8~6.3초 |
| 앤디(15) | 2~14 (9건) | 0~1.5초 |
| 메피·이주얼·디아(15) | 11~15 | 2.4~7.1초 |
| 쉥크(50) | 20~50 (14/16, 2건은 85%·77%에서 마지막으로 봄) | 0~3.7초 |
| 에인션트(10) | 1~9 | 12건 3초 안, 4건 15~21초(마지막 고대인 기준) |
| 바알(15) | 4~15 (7/8, 1건은 25%에 처음 봄) | 0~1.6초 |

- 3-12 골드 나눔: 음수 없음 → 통과. 리더는 일부만 받음: 00:16 7더미 중 3, 02:41 8더미 중 5. 나머지는 15초 뒤 팔로워 `Retaking`이 바닥의 아무 더미(`getUnit(4, 523, 3)`)를 주움(a7이 a2 몫 8493, a4·a7이 같은 더미 동시). 리더 쪽은 더미마다 1초 대기와 보관함 열기를 반복(`AutoSmurf` 골드 받기 루프).
  - 추가(261022, 시각 대조, 원인 확정 아님): 00:16 게임 팔로워 버림 00:16:55~17:02, 리더 줍기 16:59·17:08·17:12(더미당 4~9초), 팔로워 다시 줍기 17:11~17:18(버린 지 15초). 02:41 게임 리더 줍기 사이 19초 빈 곳(41:22 → 41:41)은 원인 모름. 이후 사용자 수정(`bb94fac`·`284a5aa`)은 handoff 3-12.
- 3-13: `dropping radament book` 0건 → 상황 없음.
- 3-14 canMakeRoom 0·4: `make room` 21건(4가 15, 0이 6), 21건 모두 그 물건의 ItemLog `Sold`/`Dropped` → 정리 통과. 같은 물건 되풀이 0, `make room skip` 0. 정정(261022): 다시 줍는지는 확인할 필요 없음 — 돌아오면 `pickItems(10)`이 다시 줍고, 그래도 자리가 없으면 `make room`이 되풀이돼 보인다(되풀이 0). 판정은 clearInventory 인벤토리 정리와 같은 코드(`Storage.Inventory.Compare` + `ignoredCheck` + `checkItem` 0 버림·4 팖)라 반대 방향 확인도 불필요. `make room skip`은 보석을 훑을 때마다 찍혀 "보석 때문에 포기"를 재지 못하는 줄이었다(설계 잘못). 두 줄 261022 삭제, 3-14는 `docs/code/Pickit.md`로 이관.
- 3-15 소켓 0x28: 23:40 이후 `Socketed` 23건, 실패 0(`(cursor)`·`(dropped)` 없음). 23:36까지 클릭판 실패 58건(handoff 1·2차 결과와 같은 시기). 빈 소켓보다 많이 주운 경우 없음. 티어: Wolf Head 1→11, Targe 13→15→17, Beast Visor 13→14→16, War Hammer 17→19, Dread Shell 13→16, 노멀 Cap·Leather Armor 1 고정.
  - a1 22:54 Chipped Sapphire: `Socketed` 없이 Spiked Club이 `Gemmed`(Adds 1-3 cold)로 팔림(00:34:53) → 1차 결과의 사용자 손 장착으로 보임(추정).
  - a1 00:42 Chipped Emerald: 00:45 무기를 Vicious Morning Star로 바꿔 대상이 사라짐 → `Dropped` 2회(00:45:36·00:47:32) 뒤 `Sold`(버린 뒤 다시 주운 것으로 보임, 추정).
  - a1 Cap 머리 칸 23:58 Chipped Sapphire, 00:01 Chipped Ruby. `Config.SocketGems` Head `[99]`(루비)와 사파이어가 안 맞음 → 코드 버전 차이로 보임(추정, 확인 전).
  - 장착 중 빈 소켓 룬워드 베이스 사례 없음 → 베이스 제외는 시험되지 않음.

### 그 밖 (handoff 1-1)
- `Failed to generate path` Error 5건(Pit of Acheron 2, Claw Viper Temple Level 2, Tal Rasha's Tomb #4, Flayer Dungeon Level 1) + `[Quit] changeAct 3 failed: ... Harem Level 1` 1건. Jail 2층 경로 없음 0건.
- 정정(261022): `[useUnit] timeout` 189줄이 "모두 다음 층으로 넘어감"은 틀림. iter 분포 0:100, 1:43, 2:21, 3:12, 4:7, 5:4, 6:2. 7회 모두 실패 2건 — a1 Jail 1층 06:33:57(iter:6) 뒤 travel `default` 분기가 `moveToExit`를 다시 불러(06:33:59 iter:0~2) 06:34:09 Jail 2층 도착(재시도로 복구), a1 Flayer Dungeon 1층 07:03:58 → 게임 종료(아래 B).

### 추가 분석 (261022, 대화 중)
- 빈 경로 폴백: `original path`(랜덤 목표 → 원래 목표) 성공 19, `adjusted path`(보정 칸) 성공 23. 끝내 실패한 6건은 getPath 자체 문제가 아니었다(관찰, 분류 확정 아님, handoff 1-1):
  - A. 지역이 바뀐 직후 옛 지역 좌표로 이동(3건: a1 Tal Rasha #4, a6 Harem 1, a7 Claw Viper 2). `useUnit` timeout 직후 무작위 이동(`moveTo(coord)`)이 옛 지역 좌표로 실행됨. 예: Canyon `12527,5285`에서 timeout → 다음 줄 `no original path -> 12530,5282 in Tal Rashas Tomb #4`. 간격(초 단위): 01:04:08 → 01:04:08, 02:03:40 → 02:03:41, 00:15:25 → 00:15:26 = timeout 뒤 1초 안에 이미 다음 지역. 핑 172~188.
  - B. 지역 이동 실패 뒤 다음 지역 좌표로 이동(1건: a1 Pz-52 Flayer Dungeon 1). `useUnit` 7회 실패(iter:4·5·6, dist 1~5, unit `10116,8024`) → `AutoSmurf.brain`이 `moveToExit([88, 89, 91])` 결과를 보지 않고 3층 프리셋 406(`10014,11879`)로 이동 → 경로 없음 → 게임 종료(handoff 1-7).
  - C. 같은 자리에서 못 움직임(2건: a1 Pz-45·a2 Pz-38 Pit of Acheron). 두 게임 모두 `12700,7584`에서 약 27칸 앞 목표로 경로 없음, 랜덤 걸음 10회 동안 위치가 그대로. 원인 미상.
  - 6건 모두 랜덤 걸음 10회(`no adjusted path ... fixing` 60줄 = 6 × 10) 실패, 4건은 10회 내내 위치가 그대로.
- `Misc.caughtError` 줄(`[Error] 구간: ...`) 0건(8프로필 65게임) → 호출부 catch가 잡아 재시도로 복구된 사례 없음(handoff 2-4의 근거).
- 사용자 콘솔(10/22 11:30~11:31, 이 묶음 밖): a1 하수구 라다먼트에서 `moveToExit(49)` 결과를 보지 않고 3층 상자 좌표로 가는 `while + catch`가 무한 반복, 사용자가 손으로 3층으로 옮겨 풀림(handoff 1-4·1-7).

## 261022 묶음 2 (10/21 21:54 ~ 10/22 15:50, 8프로필, a1 113게임)
데이터: trace·d2bs·콘솔·ItemLog·ScriptErrorLog·`_cache`(config 캐시 포함). 앞 묶음(~09:35)을 포함하고 09:35~15:50이 더해진 것. 이 절은 근거만 두고, 정한 것은 `handoff.md`(2-4·2-7·2-12·2-13)를 따른다.

### 리더(a1) Life Chicken
- a1 36건, 다른 프로필 각 1~5건(콘솔 집계도 같음). 전체 52건 중 a1 69%(261006 묶음은 57건 중 25건 44%, 게임 구성이 달라 직접 비교에 한계).
- 구간별 a1: 10/21 21:54~23:59 15게임 4건, 10/22 00:00~09:35 50게임 12건, 09:35~11:00 9게임 0건, 11:00~15:50 39게임 20건(최대 HP 1,800대).
- 36건 중 31건은 직전 5초 안에 `Town chicken`, 그중 22건은 같은 초. a1 `Town chicken` 55회 중 30회(55%)가 10초 안에 Life Chicken으로 끝남.
- 치킨 직전 15초 활동(`trace` 위치·줄 기준): 텔레 이동 중 약 20건(SafeTele 판정 8~27회, 이동 50~400칸), 마을에서 포털로 돌아온 직후 9건(`visitTown back` 뒤 0~12초), useUnit timeout 3건, getWP 실패 3건, `teleportTo failed` 2건, 노멀 4건은 기록 없음. 직전 활동의 d2bs 표시: travel 중 15건(Ancient's Way 7 등), 혼자 하는 퀘스트 아이템 구간 6건.
- 같은 travel 반복: Pz-88~91(12:39~12:53) Bloody Foothills·Frigid Highlands 4게임 연속 `Traveling to Ancient's Way` 중 치킨, 07:25~07:44에도 같은 모양 4건.
- SafeTele 설정 이력(git `libs/Config.js`): 09-14 Range 9·Angle 60·Step 5·Min 15 → 09-30 Range 10 → 10-02 Min 10 → 10-03 Angle 75·후보를 원래 노드 거리순 → 10-19(사용자 업로드 82ede23) Angle 60·Step 7·Min 7. 후보 수 70개(75/5/10) → 35개(60/7/7). 치킨 설정값(`LifeChicken` 35·`TownHP` 40·`UseHP` 등)과 ToolsThread 치킨 판정 코드는 09-14 이후 로그 줄 말고는 바뀌지 않음.
- 원인 판정: 비중 증가의 원인은 확정 못 함. SafeTele 이동 중이 다수라는 것까지 확인(Min 7 짧은 텔레 영향은 착지 링 거리가 trace에 없어 판정 불가).

### useUnit timeout
- `[useUnit] timeout` 414줄, 연속 시도 164개. 마지막 회차 분포: 0:61, 1:48, 2:21, 3:7, 4:9, 5:5, 6(7회 모두 실패):13(대부분 a1, travel 재시도로 넘어감).
- 0회차 timeout 164건 중 129건(79%)이 유닛에서 0~2칸 = 첫 클릭부터 붙어 선 채 실패.
- 회차 사이 이동 250건 중 190건(76%)이 정확히 무작위 걸음(x·y 각각 −3·0·+3)만큼 = 클릭 뒤 약 1초 동안 제자리.
- 계단 `id:`(`getArea().exits`의 `tileid`)는 LvlWarp `Id`와 같은 번호로 보임(외부 `d2data` `lvlwarp.json`, 19개 이름이 지역 쌍과 모두 맞음). `ExitWalk`는 사용 뒤 다음 지역에서 걸어 나오는 방향이라 진입 방향 근거로 쓰지 않음(사용자).
- 원본 kolbot(kolton 3회, blizzhackers 5회): 클릭 앞 300ms, 대기 3000ms, 같은 무작위 걸음, 뚫린 쪽 처리 없음.
- 프로필별: a1 350줄·연속 110개, a2 22줄·15개, a3~a8 각 3~10줄. 걷는 프로필(a3~a8) 39개 연속 중 36개는 0회차 뒤 바로 성공(0회차 거리 0~2칸 28개). 걷기 무작위 걸음은 `walkTo` 도착 판정 4칸이라 제자리 → 같은 자리 재클릭으로 성공. 실패 반복은 텔레 캐릭터에 몰림.

### chores slow (5초 초과만 찍힘)
- buyPotions 580건. 마을별 중앙값/최대: Harrogath 326건 8.0/15.1, Lut Gholein 146건 9.4/21.7, Pandemonium 60건 8.6/17.4, Kurast Docktown 22건 10.2/14.6, Rogue Encampment 26건 8.9/16.5. 20초 이상 7건은 모두 Lut Gholein이고 여러 프로필이 같은 시각(11:33:13~17 3명, 11:44:56~11:45:01 5명). 힐·상점이 같은 NPC인 막(`Town.tasks`: 1·3·4·5막)에서도 중앙값 8~10초.
- clearInventory 255건. 마을별 20초 이상: Rogue Encampment 79건 중 13, Lut Gholein 63건 중 5, Kurast Docktown 3, Pandemonium 3, Harrogath 1.
- 단계별 시간이 없어 어느 단계인지는 판정 불가(판별 로그는 handoff 2-7).

## 261023 묶음 (10/22 21:43 ~ 10/23 15:24, 8프로필 119게임)
데이터: trace·d2bs·콘솔·ItemLog·ScriptErrorLog·`_cache`(config 캐시 포함). 새 계정으로 노말부터 파밍까지. 코드는 main `9e10ff6`(10/22 21:34 업로드, PR #72 포함, 261023 커밋 없음) — 콘솔 `# [Gem]`, ItemLog `<Gemmed>`, `chores Ns:` 줄로 확인. config 캐시의 보석 설정(`Head:[100,99]` 등, `Socketing` 키)은 `9e10ff6`과 다르며 언제 쓰였는지 모름. 이 절은 근거만 두고, 판정에 따른 이동은 `handoff.md`와 코드 노트를 따른다.

### handoff 3절 판정
- 3-1 okCount 이름 수집: desync 3게임 5줄 모두 빠진 프로필 이름이 남음. 셋 다 그 프로필이 실제로 늦음(B), 리셋 경쟁(C) 0. 늦은 이유는 handoff 3-26.
  - Pz-6 22:12 a4 `missing(okCount): a5, a6`(Stony Field). 22:06:16 BLOOD 시작부터 8명 모두 6분 trace·d2bs 기록 없음 → 하던 일 모름.
  - Pz-14 23:15 a4 `missing: a7`(Outer Cloister). 다른 7명은 23:12:54 `=== [JAIL] ===`, a7은 TRIST(23:09:55)에서 기록 없이 머묾.
  - Pz-42 02:30 a1·a5·a7 `missing: a4`(Durance 3). a4는 02:28:33 마을 정리 뒤 기록 없고 다른 7명에게 있는 `bossGuard on`이 없음 → 메피 포털을 타지 않음.
- 3-2 중계: `relay` 5건(a1 02:25:59, a3 06:53:27, a7 00:29:25·08:01:55·08:02:23) 모두 `Town chicken` → `visitTown back` 직후. 중계한 프로필로 인한 desync 0(Pz-42 desync는 a4 미도착).
- 3-4 SafeTele 범위: `[SafeTele] monsters` a1 9,858줄 평균 29.3마리 중 14.4마리가 범위 안. a2(SafeTele 꺼짐) 514줄.
- 3-5 Town check 직접: 114건 모두 바로 `visitTown start by:default.dbj`. back 102, 마을에 있는 동안 다른 프로필 퇴장 9, Life Chicken 3. 마을행 중 Town check 중첩 0. Life Chicken 3건(a1 12:09:52·13:34:43·14:02:04)은 직접 마을행이 필드에 있는 동안 TownChicken(HP)도 출발한 뒤 0~7초 안에 치킨, 12:09 건은 다음 게임 `You died`.
- 3-9 콘솔·trace: 눈·심장·뇌 콘솔 각 3건 한 번씩(중복 없음), `[useUnit] timeout` 34줄 모두 id·target·unit, Life Chicken 줄에 mode·near 없음, d2bs `[console]` 미러 있음. `party accept` 1,043줄, MoveToSlot 실패 0.
- 3-11 보스가드: 가드 중 사망 0, 시체 회수 0. 가드 중 Life Chicken 2건은 치킨이 켜져 있던 때(a8 Pz-17 앤디 100%, a2 Pz-100 디아 98%). 가드 중 Town chicken 2건(a3·a7 써모너, 둘 다 relay).

| 보스(pct) | 건수 | chicken off HP 최소/중앙/최대 | off → last 최소/중앙/최대 | 5초 초과 |
|---|---|---|---|---|
| 써모너(100) | 24 | 55/100/100 | 0/2.2/6.4초 | 3 |
| 라다먼트(85) | 24 | 46/74/84 | 0.3/4.6/12.4초 | 8 |
| 앤디(15) | 24 | 1/13/15 | 0/1.5/2.3초 | 0 |
| 메피(15) | 23 | 11/14/15 | 1.8/3.7/4.6초 | 0 |
| 이주얼(15) | 24 | 7/14/15 | 0/3.2/6.4초 | 8 |
| 디아(15) | 22 | 13/14/15 | 2.5/3.2/5.3초 | 1 |
| 쉥크(50) | 24 | 7/41/49 | 0/1.0/3.5초 | 0 |
| 에인션트(10, Korlic 먼저) | 16 | 4/4.5/6 | 4.7/7.0/8.8초 | 14 |
| 에인션트(10, Madawc 먼저) | 8 | 4/5/9 | 0/6.3/7.1초 | 7 |
| 바알(15) | 23 | 9/15/15 | 0/6.6/9.7초 | 13 |

  - 바알 1건(a3 Pz-60)은 22%에서 한 번만 보여 chicken off 없음. 처음 본 HP가 이미 pct 이하: 써모너 24, 라다먼트 2, 메피 1, 바알 1. 타운치킨으로 인한 last 이른 기록은 빼지 않음.
- 3-12 골드 나눔(사용자 수정 뒤 코드): 2게임(00:25, 03:14) 버림 12 = 리더 줍기 12, 금액 일치, 더미당 1~3초, `Retaking` 0, 음수 없음.
- 3-15 소켓 보석: 보석 `Ingredient` 14 = `Gemmed` 14, `socketGems failed` 0(`(cursor)`·`(dropped)` 없음). 07:35 이후 Flawless 보석 `Ingredient`는 큐빙 재료(모두 Stashed, Perfect 생김). a8 23:49:56 Chipped Emerald가 몸 칸 Quilted Armor에 들어간 것은 사용자가 중간에 보석 설정을 임시로 바꿨다가 되돌린 것(사용자 261023).
- 3-16 스태프: `=== STAFF ===` 3건.
- 3-19 exitTo: 사유 줄 6건(`moveToExit failed: Outer Cloister -> Barracks` a8 22:52:46, `Tomb chest not reached` a8 00:35:49·a1 00:51:50·a5 01:01:43·a6 01:09:45, `Cube chest not reached` a1 00:13:23), `[Error] AutoSmurf.exitTo` 0. TOMBS 10게임 중 4게임이 상자 미도달로 퇴장, 줄에 좌표·거리가 없어 원인 판정 불가(사용자: 미로형 지역 8명 동선 꼬임). 상자 이동은 `moveTo(retry 3)` × 3회.
- 3-20 useUnit: timeout 34줄(a1 15줄·12연속, a2 2, a3 3, a4 1, a5 5, a6 3, a7 2, a8 3), 8회 모두 실패 0, 마지막 회차 대부분 0. 261022 묶음 2(414줄, a1 350줄·110연속)와 게임 구성이 같은지는 대조 안 함. a5 01:52:18 `dist:10067`은 이미 다음 지역에서 찍힌 줄.
- 3-21 chores(1,729줄, 10초 초과만):
  - 물약 정리(pots, 마시기) 15회 최대 3.9초.
  - buy 5초 초과 458건(중앙 9.0초, 20초 이상 8), 그 시간의 중앙값 75%가 상점 NPC(걷기·열기). 구매 실패 합계 2.
  - inv 5초 초과 202건(중앙 8.0초, 최대 31.4초, 20초 이상 21), 104건은 80% 이상이 벨트 넣기.
  - 벨트 클릭 663건: 느림 56건은 클릭당 3.6~3.8초이고 한 정리 안의 클릭이 모두 느림, 모두 정리 시작 때 NPC 메뉴(08) 열림, 모두 `pots 0/0`. 메뉴 열림 빠름 444, 중간(1.5~3초) 7, 메뉴 닫힘 96(느림 0). 같은 프로필 연속(a1 00:00~00:06 Lut Gholein 5회 6클릭, a7 16회, a2 13회). 가설·판별은 handoff 3-27(옛 2-17).
  - 정리 시작 때 08 열림 1,335/1,729. 같은 시각 여러 프로필이 함께 긴 경우: 00:16~00:17 Lut Gholein(heal 50~60초·repair 38초, 4명), 02:06 Kurast Docktown(heal 20~29초, 4명).
- 상황 없음: 3-10(`radamentOff`·북 리셋 0), 3-13(`dropping radament book` 0), 3-17(MoveToSlot 실패 0), 3-22(`vanished`·`Not enough room` 0).

### 그 밖
- 조기 종료 사유: Life Chicken 67(a1 47, a2 5, a4 4, a8 4, a3·a5·a7 2, a6 1), Tomb chest 4, desync 4줄(3게임), Figurine incompleted 3, Diablo not found 3, Souls found in Anya 2, Not ready to start Duriel 2, moveToExit failed 1, Cube chest 1, Team didn't join 1, Players not in after act change 1.
- 사망 4건 모두 a1(`You died` 06:39·12:10·12:25·13:53, 보스가드 밖).
- `[Error]` 1건: a3 03:33:15 Pit of Acheron `moveTo: Failed to generate path: 12674,7594`(261022 묶음 C유형과 같은 곳 근처).
- `[teleportTo failed]` 10건(Worldstone Keep Level 2 03:11~03:13에 8건), getWP `menu not opened` 104건(try:0 100, a1 90).
