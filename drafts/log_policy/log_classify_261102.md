# 로그 분류 (261102, main `b69b657` 기준)

새 정책 설계를 위한 분류표다. 결정이 아니며, "제안" 칸은 Claude 제안이다.
위치는 `파일:줄`, 출처 칸의 날짜는 줄 끝 날짜 표기(누가 넣었는지는 확인하지 않음, 표기 없으면 `-`).

---

## A. trace (실행되는 호출 134곳 + 주석 2곳)

### A-1. 임시: 검증·진단용 (trace에 남길 후보)

| 위치 | 줄 | 근거 |
|---|---|---|
| Pather.js:515 | `[moveTo] retry N over -> x,y in 지역 dist:D` | handoff 3-61, 제거 조건 있음(261102) |
| Misc.js:2710 | `[openMenu] retry i:N keys:K npc:이름` | handoff 3-53 |
| ToolsThread.js:660 | `[mercPot] gone: state100: mercHP:` | handoff 3-55 |
| AutoSmurf.js:4471 | `[travincal] portalReset run/skip q20:` | handoff 3-57, 제거 조건 있음 |
| Storage.js:343 | `[MoveToSlot] skip …` | handoff 3-59, 제거 조건 있음 |
| AutoSmurf.js:7782 | `radamentOff -> tombs` | 줄 끝 "remove once seen"(261021) |
| Prototypes.js:337 | `[DBG] drop` | 디버그 표시 |
| Storage.js:384 | `[MoveToSlot] … FAILED slot:… dropped:…` | 줄 끝 "260930 temp detail" |
| Storage.js:328 | `[MoveToSlot] no room, dropped blocker 이름` | 줄 끝 "temp: this drop leaves no ItemLog line". 아이템을 버린 기록이라 영구일 수도 있음 → **판단 필요** |
| AutoSmurf.js:3666, 3675 | `radament atma/gate: 9,0 … 9,1 … 9,5 …` | 퀘스트 비트 출력(진단 모양) → **판단 필요** |
| Pather.js:1797 | `target.course` (내용만) | 같은 출력을 하던 AutoSmurf 1212·1223은 이미 주석 처리됨 → 임시 후보 |
| Town.js:1172~1249 (10곳) | `interact closed`, `not enough quiver`, `equipQuiver moved/dropped/sold`, `invQuiver …`, 화살통 수량 | 261017 화살통 구매. 같은 줄을 print로도 찍음 → **판단 필요** |
| Pather.js:311, 322, 329, 341 | `no original path` → `adjusted path` / `no adjusted path` → `fixed path` | "목표에 길이 없는 경우를 추적하려고 남김"(사용자 261030) → **판단 필요** |

### A-2. 콘솔 사건의 상세 (print로 옮김, 콘솔 줄과 짝)

| 위치 | 줄 |
|---|---|
| Misc.js:2350 | `[Quit] 이유: 상세` (`quitGame`) |
| ToolsThread.js:73, 597, 620, 640, 666 | `[Quit] High ping / Life·Mana·Iron Golem·Merc Chicken` |
| Misc.js:2362 | `[Error] 자리: 메시지 (파일 #줄)` (`caughtError`) |
| Misc.js:2422 | `[Error] …` (`errorReport`, 위치 없이) |
| tools/OOG.js:1283 | 게임 밖 줄 + 상세 (`OOGLog.print`, 호출 35곳이 지나감) |
| Attack.js:77, default.dbj:58 | 멈춤 (`AttackSkill … not learned`, `Init failed`) |
| PartyThread.js:125 | `party has left: …` |

### A-3. 경계·헤더 (print로 옮김)

| 위치 | 줄 | 비고 |
|---|---|---|
| default.dbj:46 | `=== [게임 이름] ===` | 게임 경계. 지금 print에는 없음 |
| AutoSmurf.js 42곳 | `=== [DEN] ===` 등 구간 헤더 | **print와 같은 줄에 이미 같이 찍힘** → trace 쪽만 지우면 됨 |
| AutoSmurf.js:3801, 4114, 5669 | `!!! [BOOK/POTION/SCROLL] !!!` | print와 이미 같이 찍힘 |
| AutoSmurf.js:8120 | `Script ended` | print 있음(규칙상 trace는 조기 종료가 없을 때만) |

### A-4. 실패·재시도·이상 기록 (영구 → print)

| 위치 | 줄 |
|---|---|
| Merc.js:505 | `[hire] hiring retry (N/5)` |
| Pickit.js:722 | `undefined item (!?)` |
| Town.js:176 | `socketGems failed: …` |
| Town.js:757, 765, 767 | `identify stopped / failed / slow` |
| Town.js:1960, 1968 | `moved from cube to drop/sell 이름` (overhead와 짝) |
| Town.js:2294 | `goToTown take TP failed …` |
| Town.js:2329 | `visitTown refused: Arreat Summit` |
| Pather.js:430 | `[SafeTele] teleportTo FAILED …` |
| Pather.js:575 | `[teleportTo failed] attempt: …` |
| Pather.js:1134 | `ArreatSummit Gate` |
| Pather.js:1163 | `[useUnit] timeout iter: …` |
| Pather.js:1333 | `[WP] wp.area: … retry:` |
| Pather.js:1394, 1399 | `makePortal late/existing portal used`, `makePortal cast again` |
| Pather.js:1546 | `usePortal failed …` |
| Pather.js:1717 | `[goWP] Failed to reach WP after 10 attempts` |
| Pather.js:1762, 1779 | `[getWP] waypoint unit not found / menu not opened` |
| Storage.js:218, 221 | `[Storage.MoveTo] retry / catch` |
| Attack.js:472 | `boss not found: …` |
| ToolsThread.js:249 | `Couldn't give the potion to merc.` |
| OOG.js:1220 | `Character name taken: …` |
| AutoSmurf.js:1624, 1633, 1638, 1644 | 퀘스트 아이템 `vanished / Trying to make room / Not enough room / not found` |

### A-5. 진행 기록 (영구 → print)

| 위치 | 줄 |
|---|---|
| Town.js:2338, 2362 | `visitTown start by:스크립트 tick:` / `visitTown back tick:` (261004, 누가 언제 마을에 가는지) |
| Misc.js:2154, TownChicken.js:95, 99 | `Town check (direct)`, `Town check`, `Town chicken` (print와 이미 같이 찍힘) |
| AutoSmurf.js:101 | `dropping radament book` |
| AutoSmurf.js:819, 858, 880 | 골드 `Picking up / Dropping / Retaking N Gold` (overhead와 짝) |
| AutoSmurf.js:914, 917, 932, 961, 980, 1025, 1077 | `bossGuard on/found/chicken off/last/chicken on` |
| AutoSmurf.js:1006, 1074 | `revive start`, `corpse picked` |

**합계**: A-1 임시 7곳 + 판단 필요 약 20곳 / A-2 12곳 / A-3 47곳(이미 print에도 있는 것 45) / A-4 32곳 / A-5 17곳.

---

## B. overhead (121곳)

### B-1. 매 틱·반복 (제외)

| 위치 | 내용 |
|---|---|
| Pather.js:510 | `move retry N` (이동 재시도마다) |
| Attacks/Necromancer.js:378, 402, 425 | `[ARMY] REVIVE/SKELETON/MAGE n / max` (시전마다) |
| Attacks/Necromancer.js:477, 496, 514, 532 | `Exploding …` (시전마다) |
| AutoSmurf.js:6518, 6538 | `driver: x.y distance:`, `msgNode: … distance:` (따라가기 루프) |
| AutoSmurf.js:1224 | `nextAreaIndex: N` (이동 루프, 옆 trace는 주석 처리됨) |
| default.dbj:96 | `Stalling for N Seconds` (최소 게임 시간 대기 루프) |

### B-2. 아이템마다 (아이템 로그와 겹침 → 제외 후보)

| 위치 | 내용 | 아이템 로그 |
|---|---|---|
| Pickit.js:465, 477, 484, 491 | `Picked up 이름 (ilvl)`, `(Ingredient)` | `<Kept>`·`<Ingredient>` 있음 |
| Misc.js:819, 1107 | `[Tier N] 이름`, `[Granted N] 이름` | `<Equipped>`·`<Granted>` 있음 |
| Town.js:1892, 2034, 2038, 2046 | `clearInventory sell/drop`, `LowGold sell` | `<Sold>`·`<Dropped>` 있음 |
| Town.js:997, 1023 | 도박 `Buy:` / `Sell:` | 확인 안 함 |
| Pickit.js:429, 438, 443 | 골드·열쇠·스크롤 줍기 | 없음(골드 등은 기록 안 됨) |
| Storage.js:207 | `Successfully placed 이름 at X Y` (칸 옮기기마다) | 없음 |
| Pather.js:727 | `Opened a door!` (문마다) | - |

### B-3. 이미 print·trace·콘솔과 같이 찍힘 (형식만 통일)

Town.js:1961, 1969 / Misc.js:2152 / Cubing.js:1076 / Runewords.js:424, 480 / AutoSmurf.js:720, 770 (`syncBO`·`syncWP` msg), 818, 857, 879 (골드), 1198 (`Traveling to`), 1632, 1637, 7994 / ToolsThread.js:345, 388 (`[MM]` 측정) / TownChicken.js:93, 97

### B-4. 한 번씩 일어나는 사건 (print로 옮길 후보)

| 묶음 | 위치 |
|---|---|
| 역할 | AutoSmurf.js:84, 90, 92 (`I am the Leader/Boer/Follower`) |
| 팀 동기화 | AutoSmurf.js:457 (`OK`), 1557 (`Checking player in...`), 7660 (`msgLeader` 받음), 7605 (`tpReady` 받음) |
| 포털 준비(리더) | `tpReady` 16곳: AutoSmurf.js:581, 2656, 3349, 3729, 3882, 4250, 4330, 4746, 5159, 5305, 5519, 5722, 6008, 6829, 7009, 7434 |
| 포털 대기 | AutoSmurf.js:3888, 3964 (`Waiting for Orifice/Duriel TP...`) |
| 이동 | AutoSmurf.js:1213 (`Travel course`), 1227 (`Next location name`), 1294 (`Attempting to use any portal`), 1412 (`changeAct N`), 5394 (`Going to barbspot k/n`), 6501, 6570 (`followDriver start/end`) |
| 웨이 | Pather.js:1284 (`Trying to get the waypoint`), 1300 (`waypoint retry N`), AutoSmurf.js:2103, 2167 (`Getting waypoint...`) |
| 퀘스트 진행 | AutoSmurf.js:1679, 1694, 1718, 1749, 1797, 1820 (스태프·플레일), 1958, 2007 (`Clearing retry`), 2229, 2291, 2347 (케인), 4894, 4940, 4978 (봉인 배치) |
| 마을 | Town.js:257 (`initNPC: 이유`), 884 (`MiniShopBot: Scanning`), 1313 (`Can't afford repairs`), 1451 (`MercWatch precast`), Misc.js:2118, 2138 (`We need healing/mana potions`), AutoSmurf.js:481, 505, 524, 548 (해독·해동 물약) |
| 물약 | ToolsThread.js:104 (`Drinking potion from inventory.`) |
| 핑 | ToolsThread.js:64 (`High Ping`, 퀵 직전. 콘솔 `High ping` 줄 있음) |
| 일시정지 | ToolsThread.js:132, 138, TownChicken.js:39, 45 (`Pausing.` / `Resuming.`) |
| 퀘스트 아이템 | AutoSmurf.js:1632, 1637 (B-3과 같음) |

### B-5. 수동·측정용 (판단 필요)

ToolsThread.js:345, 388, 420 (`Meter: …`, 줄 끝 "260930 temp") / ToolsThread.js:504 (`Revealing 지역`, 숫자패드 + 키) / Pickit.js:211, 222, 227 (`Trying to make room / Not enough room`, 줍기 루프 안)

---

## C. 콘솔 (호출 68곳, 게임 밖 `OOGLog.print` 35곳은 OOG.js:1282 한 곳으로 셈)

### C-1. 내용으로 구분되는 것

| 분류(색) | 위치 |
|---|---|
| 조기 종료(검정) | Misc.js:2348 `quitGame` (호출 62곳) |
| 치킨·사망·핑(빨강 9) | ToolsThread.js:72, 596, 619, 639, 665, default.dbj:69 |
| 멈춤(빨강 9) | Town.js:1651 `Failed to get corpse, stopping.`, Attack.js:76, default.dbj:57 |
| 오류(회색 10) | Misc.js:2366 `caughtError`, 2419 `errorReport` |
| 게임 밖(회색 10) | OOG.js:1282 `OOGLog.print`, 줄 끝 `(loc N)` |
| 구간 헤더(7) | AutoSmurf.js 40곳 `=== X ===`, 184 `=== START ===`(새 캐릭 리더만) |
| 퀘스트 아이템(8) | AutoSmurf.js:190, 196, 202, 3802, 4115, 5670 |
| 진행(5) | Merc.js:498 `[Hired]`, Town.js:190 `[Socket]`, Cubing.js:1080, Runewords.js:426, 482 |
| 경험치(4) | Misc.js:2679, 2685 |
| 플레이 시간 요약(기본) | D2BotLead.dbj:357 |

### C-2. 분류에 맞지 않는 것 (정리 대상)

| 위치 | 줄 | 문제 |
|---|---|---|
| Town.js:2262 | `alkor error` (빨강) | 멈춤인지 오류인지 알 수 없음, 위치 없음 |
| TownChicken.js:65 | `cannot open TP` (기본색) | 조기 종료 모양이지만 `quitGame`을 거치지 않음, 위치 없음 |
| AutoSmurf.js:7783 | `Radament off: tombs, quit at 10 min (지역)` | `quitGame`을 거치지 않는 종료 이유(엔진이 내보냄) |
| ToolsThread.js:416 | `[MM] …` | 측정 줄이 콘솔로 감 |
| ToolsThread.js:501, MapThread.js:841, 847 | 좌표·거리 숫자만 | 키 입력 디버그 |
| Misc.js:2348 vs 2366 | 조기 종료와 잡힌 오류 | 둘 다 `X: Y (지역 x,y)` 모양이 있음. 오류 자리 이름에 점(`Town.fillTome`)이 들어가는 관례로만 갈림 |

---

## D. 흐름을 보는 데 콘솔에 없는 것

| 무엇 | 지금 |
|---|---|
| 게임 입장(게임 이름) | trace `=== [게임 이름] ===`에만 있음 |
| 게임 밖 정상 흐름(로그인, 방 만들기·입장) | 문제가 생겼을 때만 찍힘 |
| 클라이언트 시작·종료 | d2bs 로그 엔진 줄(`D2BS Engine startup complete`, `Shutdown complete`)에만 있음 |
| 매니저 종료 | 스크립트가 알 수 없음 |
