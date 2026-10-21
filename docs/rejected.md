# 기각 노트

기각한 안만 둔다. 코드 파일·함수 순서로 묶고, 항목마다 무엇을, 이유를 적는다. 코드를 고치는 안을 내기 전에 해당 함수 항목을 확인한다.

## bots/AutoSmurf.js

### this.travel
- **261021 엑트5 travel(9) 진입 조건 확장** — `Leader && !getWaypoint(37)`(118만 봄)에 115·117 웨이도 검사. 이유: 빠진 웨이는 쓰는 시점에 `getWP`가 찍어 오류가 나지 않는다.

### this.getQuestItem
- **261021 `canMakeRoom` 0·4** — 이유: 사용자 기각(0-13 검토).

### this.malus / this.shenk(Qual-Kehk) / this.anya(Malah)
- **261021 재시도 실패 때 게임을 나가지 않고 그 구간만 건너뛰기** — Malus 30회, Qual-Kehk 5회, Malah 10회 실패 시 `quitGame` 대신 건너뜀. 이유: 사용자 기각. 260930에 leveling 구간(Andy·Tombs)의 quit → return도 하지 않기로 함(Tombs는 return하면 두리엘로 넘어감).

### this.diablo / this.diabloPrep
- **261001 디아 판정 위치 되돌리기** — `Diablo not found`는 봉인 단계(diabloPrep)에서 바로 quit. 예전처럼 그 뒤 `Attack.clear(0, 243)`으로 한 번 더 찾기. 이유: 사용자 결정 "지금대로".

### 오프셋 흩어지기 (261002 오프셋 정리)
- **Pather `moveTo` 안의 대체 좌표** — 이유: setPosition 등 다른 이동까지 바뀐다.
- **`getNearestWalkable`로 흩어질 대체 칸 찾기** — 이유: 걸을 수 있는지만 보고 닿을 수 있는지는 보지 않는다.

## libs/Attack.js

### setPosition
- **261001 setPosition 자리 기억** — 이유: 탈락(검토 결과 이득 없음).

## libs/Attacks/*.js

### doAttack 기준 거리 (261003)
- **A안: 빌드 자리 기준으로 모든 몹에 같은 거리** — 이유: 면역 몹에 못 쓰는 스킬 거리까지 붙어 위험하다. 채택은 B안(면역 몹은 맞을 수 있는 스킬 거리에 선다).

### Wereform.js 쇼크웨이브 경로 (261002)
- **121 중 인간 상태 쇼크웨이브 경로 수정** — 121 중이면 untimed(쇼크웨이브)로 가는데 앞의 `shapeShift`가 121에 막혀 2초 × 3 헛시도 뒤 인간 상태로 시도. 이유: 허리케인 차단·아마게돈 가드로 원인 대부분이 없어져 고치지 않음.

## builds/*.js

### 18레벨 이후 `LowManaSkill = [-1, -1]`
- **대체 공격 넣기** — 이유: 설계 의도(마나가 없으면 기다린다). 결함 아님.

### TownHP / LifeChicken
- **261021 TownHP 40 / LifeChicken 35 간격 조정** — 이유: 사용자 기각.

## libs/Pather.js

### NodeAction.go
- **261001 `prevNode` 주석 규칙** — 이유: 기각·보류(261001 Pather 검토).

### moveTo
- **261001 죽은 코드 정리(`cleared`·`MainLoop:`·`j`/`wp`), PathDebug, `errorReport //260922 temp`** — 이유: 기각·보류(261001 Pather 검토).

### moveTo safeCheckNode (SafeTele)
- **261001 SafeTele 후보에 0x4 시야 검사** — 이유: 기각(`pather_status.md` 검토).
- **261001 clearPath true 이동에서 SafeTele 끄기** — 이유: 재검토 뒤 기각(`pather_status.md` 3-6).

### journeyTo
- **261001 journeyTo throw 방어** — 이유: 기각·보류.

## libs/Pickit.js

### pickItems (gid 줍기)
- **261003 gid 방식 줍기(itemaction 리스너 + `gidList`) — 다시 도입하지 않음.** 도입(PR #36) 뒤 첫 3게임 안에 세 프로필의 메인 스크립트가 `too much recursion`(`itemEvent` 안)으로 죽어 원복. 원인(D2BS 소스): 리스너는 메인 스크립트 스택 위에서 끼어들어 돌고 재진입 방지가 없으며 스택 한도가 50,000바이트라, 아이템 이벤트가 몰리는 곳(드롭·줍기·상점)에서 넘친다.
  - 검토한 해결안(채택 안 함): D2BS 수정(재진입 방지·스택 한도 상향, 재빌드 필요), clear 싸움 구간에만 리스너 켜기(위험을 줄일 뿐 없애지 못함), 주기적 `getUnit` 훑기(비용), 마을에서만 끄기(필드 건을 못 막음).

## libs/Misc.js

### townCheck
- **261021 TownCheck를 TownChicken으로 옮기기** — 이유: 사용자 기각. 채택은 default.dbj면 `visitTown` 직접.

### trace 위치 (`Pather.getAreaName`)
- **261021 Strict Warning `areas[area]`(입장 직후 trace) 고치기** — 이유: 치명적이지 않음.

## libs/Town.js

### repair
- **261001 shopItems 방문에 골드 검사** — 노멀 2막 이상 `doChores(true)`면 골드와 관계없이 수리 NPC에 가서 벨트를 훑는다. 이유: 사용자 결정 "그대로 둠"(살 수 있는지는 도착 뒤 `shopItems`에서 본다).

### getCorpse
- **261001 `Failed to get corpse, stopping.`을 로그 규칙에 맞추기** — 30초 넘게 못 주우면 빨간 콘솔 + `D2Bot.stop()`, trace·위치 없음. 이유: 발생한 적 없음(메모만). 261004에 보스 보호 회수 경로(`getCorpse(true)`)만 정지 대신 퇴장으로 바꿈.

### moveToSpot
- **261001 `alkor error`를 `Misc.quitGame`으로** — 알코어 자리 이동이 90초 넘고 알코어가 안 보일 때만 `quit()` 직접 호출. 이유: 발현 없음(메모만).

## threads/ToolsThread.js

### togglePause
- **261021 Pause 키를 default 기준으로 전부 같게 토글** — 이유: 수동 Pause 없이는 꼬일 경로가 없다.

## threads/TownChicken.js
- **261021 TownChicken을 ToolsThread로 이관** — 이유: 사용자 기각. 261013·261020 로그에서 TownChicken을 끄면 HP 마을행 146건 중 도착한 95건(65%)이 전투에 남는다(`log_results.md`).

## tools/NTItemParser.dbl
- **261021 NTIP `Qty`/`.Tier` 게이트** — 이유: 사용자 기각.

## D2BotLead.dbj / D2BotFollow.dbj (게임 밖)
- **261001 로그인 대기 창 무한 대기 처리** — 내장 `login()`(D2BS 엔진) 안이라 손댈 수 없다. JS 교체는 비밀번호를 얻을 방법이 없어 기각, 감시 스레드도 기각. 서버 다운 처리도 기각.
