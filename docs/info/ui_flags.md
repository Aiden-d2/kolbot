# UI 플래그 (`getUIFlag`)

게임 UI 창이 열려 있는지 확인하는 번호(`getUIFlag(번호)`, 261104).

- 출처: D2MOO(1.10f) `source/D2CommonDefinitions/include/D2Constants.h`의 `UI_` 목록. d2bsng PR #60 설명에 1.14d `getUIFlag` 값이 이것과 같다고 컴파일 때 검사한다고 되어 있다.
- kolbot 사용처와 맞음: 0x08 `npc.openMenu`, 0x0C `startTrade`, 0x14 `Pather.js` 웨이포인트 화면, 0x19 창고, 0x1A 큐브.

| 번호 | D2MOO 이름 | D2MOO 설명 | MapThread 멈춤 |
|---|---|---|---|
| 0x00 | `UI_GAME` | Game |  |
| 0x01 | `UI_INVENTORY` | Player Inventory | ○ |
| 0x02 | `UI_STATSCREEN` | Player Stat Screen | ○ |
| 0x03 | `UI_MINISKILL` | Skill Selection |  |
| 0x04 | `UI_SKILLTREE` | Player Skill Tree |  |
| 0x05 | `UI_CHATBOX` | Chat Box |  |
| 0x06 | `UI_NEWSTATS` | Red NewStats Button |  |
| 0x07 | `UI_NEWSKILLS` | Red NewSkills Button |  |
| 0x08 | `UI_NPCMENU` | NPC options menu |  |
| 0x09 | `UI_ESCMENU` | Esc Menu | ○ |
| 0x0A | `UI_AUTOMAP` | Automap |  |
| 0x0B | `UI_CONFIG` | Key Configuration Menu |  |
| 0x0C | `UI_NPCSHOP` | NPC Trade | ○ |
| 0x0D | `UI_HOLDALT` | Alt Items Highlight | ○ |
| 0x0E | `UI_ANVIL` | Anvil |  |
| 0x0F | `UI_QUESTSCREEN` | Quest Screen | ○ |
| 0x10 | `UI_INISCROLL` | Inifuss Tree Scroll |  |
| 0x11 | `UI_QUESTLOG` | Quest Log Red Button |  |
| 0x12 | `UI_UNKNOWN18` |  |  |
| 0x13 | `UI_HIRICONS` |  |  |
| 0x14 | `UI_WAYPOINT` | Waypoint Screen |  |
| 0x15 | `UI_MINIPANEL` | CtrlPnl7 Mini Popop Menu |  |
| 0x16 | `UI_PARTYSCREEN` | Multiplayer Party Screen |  |
| 0x17 | `UI_MPTRADE` | Multiplayer Trade |  |
| 0x18 | `UI_MSGLOG` | Messages Log | ○ |
| 0x19 | `UI_STASH` | Player Stash | ○ |
| 0x1A | `UI_CUBE` | Horadric Cube | ○ |
| 0x1B | `UI_STEEGSTONE` | Guild Steeg Stone |  |
| 0x1C | `UI_GUILDVAULT` | Guild Vault |  |
| 0x1D | `UI_UNKNOWN29` |  |  |
| 0x1E | `UI_UNKNOWN30` |  |  |
| 0x1F | `UI_BELTROWS` | Belt Rows Popup |  |
| 0x20 | `UI_UNKNOWN32` |  |  |
| 0x21 | `UI_HELPSCREEN` | Help Screen | ○ |
| 0x22 | `UI_HELPBUTTON` | Help Button |  |
| 0x23 | `UI_HIREICONS` | Party Icons |  |
| 0x24 | `UI_MERCINV` | Mercenary Inventory |  |
| 0x25 | `UI_RECIPESCROLL` | Unused Recipe Scroll |  |

## MapThread·MapHelper에서 쓰는 곳
- `threads/MapThread.js` 메인 루프(20ms)는 `hideFlags`(위 표 ○ 10개) 중 하나라도 열려 있으면 닫힐 때까지 `Hooks.flush(); delay(100)`으로 기다린다. 0x0D는 Alt 키를 누르고 있는 동안이다.
- 자동맵(0x0A)은 멈춤 조건이 아니다. 열리면 그리고(`Hooks.update`), 닫히면 지운다(`Hooks.flush`).
- `threads/MapHelper.js`는 ESC 메뉴(0x09)가 열리면 MapThread를 `pause()`, 닫히면 `resume()`한다.
