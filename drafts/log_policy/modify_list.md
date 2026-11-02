# 로그 정책 수정 목록 (261102, main `1253963` 기준, 승인 대기)

정책은 `log_policy_draft.md`(사용자 261102 전부 승인). 이 문서는 그 정책을 코드에 옮기는 **수정 목록**이다. 승인 범위는 이 목록이며, 구현 중 목록 밖 동작이 필요하면 멈추고 묻는다.

## 1. 새로 만들거나 구조를 바꾸는 것

| # | 파일 | 함수 | 바꿀 동작 | 새로 만드는 것 |
|---|---|---|---|---|
| S1 | `tools/OOG.js` | `D2Bot.printToConsole` | ① `print("[console] " + msg)` 삭제 ② 매니저로 보낸 뒤 같은 줄을 `_cache/trace/Console.txt`에 덧붙임: `[YYYY/MM/DD HH:MM:SS] <프로필> <분류> msg`. 분류: 게임 밖 `OOG` / 색 7 `Flow` / 8·5 `Item` / 4 `Exp` / 0 `Quit` / 9 `Red` / 10 `Error`. 쓰기는 `Misc.fileAction(…, 2, …)`(Misc가 없는 스레드에서는 쓰지 않음: `typeof Misc` 확인), `_cache/trace` 폴더가 없으면 만듦(`Misc.trace`와 같은 방식) | 지역 변수(날짜 문자열, 분류) |
| S2 | `libs/Misc.js` | **`Misc.print(msg)` (새 함수)** | 색 코드(`ÿc.`) 지움 → 게임 안(`me.ingame`)이면 끝에 ` (지역 x,y)`(`Misc.where()`) → `print` | 함수 1개 |
| S3 | `libs/Misc.js` | `Misc.quitGame` | trace `[Quit] 이유: 상세` → `Misc.print("Quit: 이유 - 상세")`. 콘솔 줄은 그대로 | - |
| S4 | `libs/Misc.js` | `Misc.caughtError` | trace `[Error] …` → `Misc.print("Error: 자리: 메시지 (파일 #줄)")`. 콘솔(게임당 자리별 1회)은 그대로 | - |
| S5 | `libs/Misc.js` | `Misc.errorReport` | trace `[Error]` → `print("Error: " + oogmsg + " Stack: …")`(스택이 있으면). `_cache/trace/ScriptErrorLog.txt` 쓰기 삭제(`filemsg`·`dateString` 계산 함께 삭제). 콘솔은 그대로 | - |
| S6 | `tools/OOG.js` | `OOGLog.print` | trace → `print(text + (detail ? " - " + detail : "") + " (loc N)")`. 콘솔은 그대로 | - |
| S7 | `threads/ToolsThread.js` | `main` 루프 | 살아 있다가 죽은 순간 1회: 콘솔 빨강 `Died (지역 x,y)` + `Misc.print("Died")`. 부활하면 다음 죽음도 찍음 | 변수 `wasDead` 1개 |
| S8 | `D2BotLead.dbj` | `main` 게임 안 루프의 `if (!ingame)` 블록 | 콘솔 `Game: 게임 이름 [레벨]`(색 7, 리더만) | 호출 1개 |
| S9 | `default.dbj` | `main` | trace `=== [게임 이름] ===` → `print`(위치 없음, 모든 프로필) | - |
| S10 | `libs/Attack.js` | `clear`, `setPosition` | 조용한 catch 3곳에 `Misc.caughtError("Attack.clear lostPos" / "Attack.setPosition move" / "Attack.setPosition detour", e)` (handoff 1-17, 사용자 확정) | 호출 3개 |
| S11 | `bots/AutoSmurf.js` | 구간 함수들, `getQuestItem` | 리더 콘솔 `=== X ===`(구간 끝) → `X: completed`(31곳, 아래 표). `=== START ===`, `=== FARMING ===`, `=== LEVELING ===`은 그대로 | - |
| S12 | `D2BotLead.dbj`, `D2BotFollow.dbj` | `main` | `debugLog(me.profile)` 삭제 | - |
| S13 | `libs/Misc.js` | `Misc.debugLog` | 함수 삭제(호출 0) | - |
| S14 | `D2BotLead.dbj` | `sayMsg`, `locationAction` | `sayMsg` 함수와 호출 3곳(게임 뒤 메시지 반복, 채널 첫 메시지, `AnnounceGames`) 삭제. 채널 입장(`ControlAction.joinChannel`)은 그대로 | - |
| S15 | `D2BotFollow.dbj` | `locationAction` | `say("/j …")`, `FirstJoinMessage` `say`와 그 `delay` 삭제 | - |
| S16 | `libs/Pickit.js` | `pickItems` | `Not enough room for 이름`(2곳) 머리 위 글자 옆에 `Misc.print("Pickit failed: not enough room for 이름")` 추가 | 호출 2개 |

`You died in last game`(`default.dbj:69`)은 첫 사이클 동안 그대로 둔다(사용자 261102).

## 2. 줄별 처리 (콘솔·print·trace·머리 위 글자·채팅 전부)

처리 종류

- **→ Misc.print**: `print`·`Misc.trace`·`me.overhead`를 `Misc.print(바뀐 내용)`로. "같은 내용"은 문장은 그대로, 색 코드만 지움.
- **색 코드 지움**: 구간 헤더·`!!! … !!!`는 `print` 그대로 두고 색 코드만 지움(위치 없음).
- **삭제(같은 줄 print 있음)**: 헤더처럼 print와 trace가 같은 줄에 있으면 trace만 지움.
- **trace 유지(임시)**: 검증·진단 줄. 그대로.
- **유지**: 매 틱·아이템마다·수동(키 입력) 머리 위 글자, Misc가 없는 스레드의 print(`AutoBuildThread`, `MapThread`, `Reload`, `HeartBeat`, `MapHelper`, `AutoBuild`), 게임 밖 `OOG.js`의 디버그 print.
- 문장 모양은 정책 2-3(`주체: 일` / `주체 failed: 이유` / `주체 retry N/M: 이유` / `키:값`). 줄 안의 `area:` + 번호는 지움(끝에 위치가 붙음).


### 콘솔 (68곳)

그대로 37 / → 구간 끝 줄 31

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| D2BotLead.dbj:357 | addPlayTime | `text + " / " + me.gamename.split('-')[1] + "r (Avg. " + Math.floor(total / 60000 / me.gamename.split('-')[1...` | 그대로 |  |
| bots/AutoSmurf.js:184 | AutoSmurf.preparation | `"=== START ===", 7` | 그대로 |  |
| bots/AutoSmurf.js:190 | AutoSmurf.preparation | `"!!! BOOK !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:196 | AutoSmurf.preparation | `"!!! POTION !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:202 | AutoSmurf.preparation | `"!!! SCROLL !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:1651 | AutoSmurf.getQuestItem | `"===" + name + "===", 7` | → 구간 끝 줄 | name + ": completed", 7 |
| bots/AutoSmurf.js:1655 | AutoSmurf.getQuestItem | `"=== STAFF ===", 7` | → 구간 끝 줄 | "STAFF: completed", 7 |
| bots/AutoSmurf.js:1836 | AutoSmurf.placeFlail | `"=== TRAVINCAL ===", 7` | → 구간 끝 줄 | "TRAVINCAL: completed", 7 |
| bots/AutoSmurf.js:2055 | AutoSmurf.den | `"=== DEN ===", 7` | → 구간 끝 줄 | "DEN: completed", 7 |
| bots/AutoSmurf.js:2143 | AutoSmurf.blood | `"=== BLOOD ===", 7` | → 구간 끝 줄 | "BLOOD: completed", 7 |
| bots/AutoSmurf.js:2390 | AutoSmurf.cain | `"=== CAIN ===", 7` | → 구간 끝 줄 | "CAIN: completed", 7 |
| bots/AutoSmurf.js:2491 | AutoSmurf.trist | `"=== TRIST ===", 7` | → 구간 끝 줄 | "TRIST: completed", 7 |
| bots/AutoSmurf.js:2562 | AutoSmurf.outer | `"=== OUTER ===", 7` | → 구간 끝 줄 | "OUTER: completed", 7 |
| bots/AutoSmurf.js:2622 | AutoSmurf.smith | `"=== SMITH ===", 7` | → 구간 끝 줄 | "SMITH: completed", 7 |
| bots/AutoSmurf.js:2719 | AutoSmurf.malus | `"=== MALUS ===", 7` | → 구간 끝 줄 | "MALUS: completed", 7 |
| bots/AutoSmurf.js:2769 | AutoSmurf.jail | `"=== JAIL ===", 7` | → 구간 끝 줄 | "JAIL: completed", 7 |
| bots/AutoSmurf.js:2907 | AutoSmurf.inner | `"=== INNER ===", 7` | → 구간 끝 줄 | "INNER: completed", 7 |
| bots/AutoSmurf.js:2967 | AutoSmurf.cathedral | `"=== CATHEDRAL ===", 7` | → 구간 끝 줄 | "CATHEDRAL: completed", 7 |
| bots/AutoSmurf.js:3110 | AutoSmurf.andy | `"=== ANDY ===", 7` | → 구간 끝 줄 | "ANDY: completed", 7 |
| bots/AutoSmurf.js:3212 | AutoSmurf.cube | `"=== CUBE ===", 7` | → 구간 끝 줄 | "CUBE: completed", 7 |
| bots/AutoSmurf.js:3303 | AutoSmurf.amulet | `"=== AMULET ===", 7` | → 구간 끝 줄 | "AMULET: completed", 7 |
| bots/AutoSmurf.js:3445 | AutoSmurf.summoner | `"=== SUMMONER ===", 7` | → 구간 끝 줄 | "SUMMONER: completed", 7 |
| bots/AutoSmurf.js:3580 | AutoSmurf.tombs | `"=== TOMBS ===", 7` | → 구간 끝 줄 | "TOMBS: completed", 7 |
| bots/AutoSmurf.js:3802 | AutoSmurf.radament | `"!!! BOOK !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:3814 | AutoSmurf.radament | `"=== RADAMENT ===", 7` | → 구간 끝 줄 | "RADAMENT: completed", 7 |
| bots/AutoSmurf.js:4025 | AutoSmurf.duriel | `"=== DURIEL ===", 7` | → 구간 끝 줄 | "DURIEL: completed", 7 |
| bots/AutoSmurf.js:4115 | AutoSmurf.figurine | `"!!! POTION !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:4131 | AutoSmurf.figurine | `"=== FIGURINE ===", 7` | → 구간 끝 줄 | "FIGURINE: completed", 7 |
| bots/AutoSmurf.js:4449 | AutoSmurf.tome | `"=== TOME ===", 7` | → 구간 끝 줄 | "TOME: completed", 7 |
| bots/AutoSmurf.js:4708 | AutoSmurf.mephisto | `"=== MEPHISTO ===", 7` | → 구간 끝 줄 | "MEPHISTO: completed", 7 |
| bots/AutoSmurf.js:4808 | AutoSmurf.izual | `"=== IZUAL ===", 7` | → 구간 끝 줄 | "IZUAL: completed", 7 |
| bots/AutoSmurf.js:5257 | AutoSmurf.diablo | `"=== DIABLO ===", 7` | → 구간 끝 줄 | "DIABLO: completed", 7 |
| bots/AutoSmurf.js:5356 | AutoSmurf.shenk | `"=== SHENK ===", 7` | → 구간 끝 줄 | "SHENK: completed", 7 |
| bots/AutoSmurf.js:5464 | AutoSmurf.barbs | `"=== BARBS ===", 7` | → 구간 끝 줄 | "BARBS: completed", 7 |
| bots/AutoSmurf.js:5670 | AutoSmurf.anya | `"!!! SCROLL !!!", 8` | 그대로 |  |
| bots/AutoSmurf.js:5699 | AutoSmurf.anya | `"=== ANYA ===", 7` | → 구간 끝 줄 | "ANYA: completed", 7 |
| bots/AutoSmurf.js:5799 | AutoSmurf.ancients | `"=== ANCIENTS ===", 7` | → 구간 끝 줄 | "ANCIENTS: completed", 7 |
| bots/AutoSmurf.js:5943 | AutoSmurf.baal | `"=== FARMING ===", 7` | 그대로 |  |
| bots/AutoSmurf.js:5947 | AutoSmurf.baal | `"=== LEVELING ===", 7` | 그대로 |  |
| bots/AutoSmurf.js:6189 | AutoSmurf.baal | `"=== BAAL ===", 7` | → 구간 끝 줄 | "BAAL: completed", 7 |
| bots/AutoSmurf.js:6958 | AutoSmurf.farmingCows | `"=== COWS ===", 7` | → 구간 끝 줄 | "COWS: completed", 7 |
| bots/AutoSmurf.js:7783 | AutoSmurf | `"Radament off: tombs, quit at 10 min (" + Misc.where() + ")"` | 그대로 |  |
| default.dbj:57 | main | `"Init failed in default.dbj. Stopping", 9` | 그대로 |  |
| default.dbj:69 | main | `"You died in last game", 9` | 그대로 |  |
| libs/Attack.js:76 | Attack.clear | `"AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping", 9` | 그대로 |  |
| libs/Cubing.js:1080 | Cubing.doCubing | `string, 5` | 그대로 |  |
| libs/Merc.js:498 | Merc.hire | `"[Hired] Level " + target.level + " " + skill, 5` | 그대로 |  |
| libs/Misc.js:2348 | Misc.quitGame | `reason + " (" + this.where() + ")"` | 그대로 |  |
| libs/Misc.js:2366 | Misc.caughtError | `place + ": " + msg + " (" + this.where() + ")", 10` | 그대로 |  |
| libs/Misc.js:2419 | Misc.errorReport | `oogmsg, 10` | 그대로 |  |
| libs/Misc.js:2679 | Experience.log | `string, 4` | 그대로 |  |
| libs/Misc.js:2685 | Experience.log | `"no exp" + getGameTime, 4` | 그대로 |  |
| libs/Runewords.js:426 | Runewords.makeRunewords | `"[Runeword] " + logString, 5` | 그대로 |  |
| libs/Runewords.js:482 | Runewords.rerollRunewords | `"[Reset] " + logString, 5` | 그대로 |  |
| libs/Town.js:190 | Town.socketGems | `"[Socket] " + name + " " + base + " (" + (filled + 1) + "/" + t.item.getStat(194) + ")", 5` | 그대로 |  |
| libs/Town.js:1651 | Town.getCorpse | `"Failed to get corpse, stopping.", 9` | 그대로 |  |
| libs/Town.js:2262 | Town.moveToSpot | `"alkor error", 9` | 그대로 |  |
| threads/MapThread.js:841 | main.keyEvent | `me.x+","+me.y` | 그대로 |  |
| threads/MapThread.js:847 | main.keyEvent | `Math.round(getDistance(me.x, me.y, player.x, player.y))` | 그대로 |  |
| threads/ToolsThread.js:72 | main.checkPing | `"High ping " + me.ping + "/" + Config.PingQuit[i].Ping + " (" + Misc.where() + ")", 9` | 그대로 |  |
| threads/ToolsThread.js:416 | main.runMeter | `line` | 그대로 |  |
| threads/ToolsThread.js:501 | main.keyEvent | `me.x + "," + me.y` | 그대로 |  |
| threads/ToolsThread.js:596 | main | `"Life Chicken " + me.hp + "/" + me.hpmax + " (" + Misc.where() + ")", 9` | 그대로 |  |
| threads/ToolsThread.js:619 | main | `"Mana Chicken " + me.mp + "/" + me.mpmax + " (" + Misc.where() + ")", 9` | 그대로 |  |
| threads/ToolsThread.js:639 | main | `"Iron Golem Chicken (" + Misc.where() + ")", 9` | 그대로 |  |
| threads/ToolsThread.js:665 | main | `"Merc Chicken (" + Misc.where() + ")", 9` | 그대로 |  |
| threads/TownChicken.js:65 | main | `"cannot open TP"` | 그대로 |  |
| tools/OOG.js:1282 | OOGLog.print | `text + " (loc " + getLocation() + ")", 10` | 그대로 |  |

### 콘솔(게임 밖) (45곳)

그대로 45

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| D2BotFollow.dbj:114 | badKey | `text + " - switch key"` | 그대로 |  |
| D2BotFollow.dbj:118 | badKey | `text` | 그대로 |  |
| D2BotFollow.dbj:209 | main | `"Crash: " + JSON.parse(gameInfo.crashInfo).currScript + " " + JSON.parse(gameInfo.crashInfo).area + " - wai...` | 그대로 |  |
| D2BotFollow.dbj:252 | joinCheck | `"Game finished: " + joinInfo.gameName + " - stop wait"` | 그대로 |  |
| D2BotFollow.dbj:396 | locationAction | `"Join game failed: " + joinInfo.gameName + " - wait " + StarterConfig.JoinRetryDelay + "s"` | 그대로 |  |
| D2BotFollow.dbj:502 | locationAction | `"Login failed: " + Profile(me.profile).character, e` | 그대로 |  |
| D2BotFollow.dbj:526 | locationAction | `"Invalid password: " + Profile(me.profile).username` | 그대로 |  |
| D2BotFollow.dbj:531 | locationAction | `"Invalid account: " + Profile(me.profile).username + " - create"` | 그대로 |  |
| D2BotFollow.dbj:561 | locationAction | `"Disconnected - retry"` | 그대로 |  |
| D2BotFollow.dbj:567 | locationAction | `"Login error: " + string + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.RetryKeyDe...` | 그대로 |  |
| D2BotFollow.dbj:613 | locationAction | `"Realm down - wait " + StarterConfig.RealmDownDelay + "m, " + (gameInfo.switchKeys && !gameInfo.rdBlocker ?...` | 그대로 |  |
| D2BotFollow.dbj:643 | locationAction | `"CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo...` | 그대로 |  |
| D2BotFollow.dbj:679 | locationAction | `"LoD CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (game...` | 그대로 |  |
| D2BotFollow.dbj:764 | locationAction | `"Game not found"` | 그대로 |  |
| D2BotFollow.dbj:765 | locationAction | `"CDKey flagged: " + gameInfo.mpq + (gameInfo.switchKeys ? " - switch key" : "")` | 그대로 |  |
| D2BotFollow.dbj:772 | locationAction | `"Game not found - wait " + StarterConfig.GameDoesNotExistTimeout + "s"` | 그대로 |  |
| D2BotFollow.dbj:780 | locationAction | `"Game full: " + joinInfo.gameName + " - skip"` | 그대로 |  |
| D2BotFollow.dbj:789 | locationAction | `"Unhandled location - restart"` | 그대로 |  |
| D2BotLead.dbj:201 | badKey | `text + " - switch key"` | 그대로 |  |
| D2BotLead.dbj:205 | badKey | `text` | 그대로 |  |
| D2BotLead.dbj:231 | teamWait | `"Team wait: " + missing.join(", ") + " - wait"` | 그대로 |  |
| D2BotLead.dbj:324 | restCheck | `"Rest: " + info.count + " games - wait " + Math.ceil(remain / 60000) + "m"` | 그대로 |  |
| D2BotLead.dbj:400 | main | `"Crash: " + JSON.parse(gameInfo.crashInfo).currScript + " " + JSON.parse(gameInfo.crashInfo).area + " - wai...` | 그대로 |  |
| D2BotLead.dbj:687 | locationAction | `"Create game failed - wait " + StarterConfig.FTJDelay + "s"` | 그대로 |  |
| D2BotLead.dbj:752 | locationAction | `"Login failed: " + Profile(me.profile).character, e` | 그대로 |  |
| D2BotLead.dbj:776 | locationAction | `"Invalid password: " + Profile(me.profile).username` | 그대로 |  |
| D2BotLead.dbj:781 | locationAction | `"Invalid account: " + Profile(me.profile).username + " - create"` | 그대로 |  |
| D2BotLead.dbj:811 | locationAction | `"Disconnected - retry"` | 그대로 |  |
| D2BotLead.dbj:817 | locationAction | `"Login error: " + string + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.RetryKeyDe...` | 그대로 |  |
| D2BotLead.dbj:863 | locationAction | `"Realm down - wait " + StarterConfig.RealmDownDelay + "m, " + (gameInfo.switchKeys && !gameInfo.rdBlocker ?...` | 그대로 |  |
| D2BotLead.dbj:893 | locationAction | `"CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo...` | 그대로 |  |
| D2BotLead.dbj:929 | locationAction | `"LoD CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (game...` | 그대로 |  |
| D2BotLead.dbj:1019 | locationAction | `"Game not found"` | 그대로 |  |
| D2BotLead.dbj:1020 | locationAction | `"CDKey flagged: " + gameInfo.mpq + (gameInfo.switchKeys ? " - switch key" : "")` | 그대로 |  |
| D2BotLead.dbj:1027 | locationAction | `"Game not found - wait " + StarterConfig.GameDoesNotExistTimeout + "s"` | 그대로 |  |
| D2BotLead.dbj:1039 | locationAction | `"Unhandled location - restart"` | 그대로 |  |
| tools/AutoCreate.js:43 | AutoCreate.account | `"No account info"` | 그대로 |  |
| tools/AutoCreate.js:79 | AutoCreate.character | `"Character slots full: " + Profile(me.profile).character` | 그대로 |  |
| tools/AutoCreate.js:88 | AutoCreate.character | `"No character info"` | 그대로 |  |
| tools/AutoCreate.js:92 | AutoCreate.character | `"Character name taken: " + info.charName + " \"" + ControlAction.charNameTaken + "\""` | 그대로 |  |
| tools/AutoCreate.js:95 | AutoCreate.character | `"Create character: " + info.charName + " " + info.charClass` | 그대로 |  |
| tools/OOG.js:857 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"" + this.readText(4, 199, 377, 402, 140) + "\""` | 그대로 |  |
| tools/OOG.js:870 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"" + this.readText(4, 268, 320, 264, 120) + "\""` | 그대로 |  |
| tools/OOG.js:905 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"(timeout)\""` | 그대로 |  |
| tools/OOG.js:1237 | ControlAction.makeCharacter | `"Create character timeout: " + info.charName + " - retry"` | 그대로 |  |

### print (199곳)

→ Misc.print 111 / 색 코드 지움(print 그대로, 위치 없음) 45 / 그대로(Misc 없는 스레드) 15 / 그대로 11 / 삭제(trace 유지, 사용자 261102) 10 / 그대로(수동) 3 / 삭제(OOGLog "Login failed" 상세와 같음) 2 / 삭제(Quit: Life Chicken print로 대체) 1 / 삭제([console] 한 벌) 1

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| D2BotFollow.dbj:139 | ReceiveCopyData | `"Recieved Game Info"` | → Misc.print | 같은 내용 |
| D2BotFollow.dbj:423 | locationAction | `"joining game " + joinInfo.gameName` | → Misc.print | "Join game: " + joinInfo.gameName |
| D2BotFollow.dbj:505 | locationAction | `e + " " + getLocation()` | 삭제(OOGLog "Login failed" 상세와 같음) |  |
| D2BotLead.dbj:120 | ReceiveCopyData | `"Recieved Game Info"` | → Misc.print | 같은 내용 |
| D2BotLead.dbj:622 | locationAction | `"\c1Unable to join channel, disabling chat messages."` | → Misc.print | 같은 내용 (색 코드 지움) |
| D2BotLead.dbj:755 | locationAction | `e + " " + getLocation()` | 삭제(OOGLog "Login failed" 상세와 같음) |  |
| bots/AutoSmurf.js:87 | AutoSmurf.checkRole | `"SafeTele: " + Config.SafeTele.Enabled` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:158 | AutoSmurf.start | `"hireMerc: " + hireMerc` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:208 | AutoSmurf.preparation | `"MiniShopBot: " + Config.MiniShopBot` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:214 | AutoSmurf.preparation | `"farmingON"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:218 | AutoSmurf.preparation | `"Tiered: " + Config.Tiered` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:225 | AutoSmurf.preparation | `"UseMerc: " + Config.UseMerc + " HP: " + Config.UseMercHP` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:267 | AutoSmurf.toggle | `"Token needed"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:293 | AutoSmurf.toggle | `keyMsg` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:602 | AutoSmurf.syncBO | `"syncBO failed: invalid act"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:607 | AutoSmurf.syncBO | `"syncBO failed: no Boer in my team"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:612 | AutoSmurf.syncBO | `"syncBO failed: lower level"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:719 | AutoSmurf.syncBO | `msg` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:769 | AutoSmurf.syncWP | `msg` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1197 | AutoSmurf.travel | `"Traveling to " + Pather.getAreaName(destination)` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1756 | AutoSmurf.cubeFlail | `"cubeFlail failed: missing ingredient(s)"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1802 | AutoSmurf.equipFlail | `"No room to keep weapon by force"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1924 | AutoSmurf.den | `"\c4=== [DEN] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [DEN] ===" |
| bots/AutoSmurf.js:2071 | AutoSmurf.blood | `"\c4=== [BLOOD] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [BLOOD] ===" |
| bots/AutoSmurf.js:2156 | AutoSmurf.cain | `"\c4=== [CAIN] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [CAIN] ===" |
| bots/AutoSmurf.js:2432 | AutoSmurf.trist | `"\c4=== [TRIST] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [TRIST] ===" |
| bots/AutoSmurf.js:2502 | AutoSmurf.outer | `"\c4=== [OUTER] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [OUTER] ===" |
| bots/AutoSmurf.js:2573 | AutoSmurf.smith | `"\c4=== [SMITH] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [SMITH] ===" |
| bots/AutoSmurf.js:2599 | AutoSmurf.smith | `"Smith failed: moveTo"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:2609 | AutoSmurf.smith | `"Smith failed: getUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:2613 | AutoSmurf.smith | `"Smith failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:2678 | AutoSmurf.malus | `"\c4=== [MALUS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [MALUS] ===" |
| bots/AutoSmurf.js:2710 | AutoSmurf.malus | `"Malus failed"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:2727 | AutoSmurf.jail | `"\c4=== [JAIL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [JAIL] ===" |
| bots/AutoSmurf.js:2779 | AutoSmurf.inner | `"\c4=== [INNER] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [INNER] ===" |
| bots/AutoSmurf.js:2917 | AutoSmurf.cathedral | `"\c4=== [CATHEDRAL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [CATHEDRAL] ===" |
| bots/AutoSmurf.js:2976 | AutoSmurf.andy | `"\c4=== [ANDY] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [ANDY] ===" |
| bots/AutoSmurf.js:3123 | AutoSmurf.cube | `"\c4=== [CUBE] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [CUBE] ===" |
| bots/AutoSmurf.js:3223 | AutoSmurf.amulet | `"\c4=== [AMULET] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [AMULET] ===" |
| bots/AutoSmurf.js:3316 | AutoSmurf.summoner | `"\c4=== [SUMMONER] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [SUMMONER] ===" |
| bots/AutoSmurf.js:3456 | AutoSmurf.tombs | `"\c4=== [TOMBS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [TOMBS] ===" |
| bots/AutoSmurf.js:3541 | AutoSmurf.tombs | `"Tombs: chest not found"` | → Misc.print | "Tombs failed: chest not found" |
| bots/AutoSmurf.js:3554 | AutoSmurf.tombs | `"Tombs: incorrect chest cord"` | → Misc.print | "Tombs failed: incorrect chest coord" |
| bots/AutoSmurf.js:3584 | AutoSmurf.tombs | `"Not ready to start Duriel"` | → Misc.print | "Tombs failed: not ready to start Duriel" |
| bots/AutoSmurf.js:3607 | AutoSmurf.staff | `"\c4=== [STAFF] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [STAFF] ===" |
| bots/AutoSmurf.js:3641 | AutoSmurf.radament | `"\c4=== [RADAMENT] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [RADAMENT] ===" |
| bots/AutoSmurf.js:3801 | AutoSmurf.radament | `"\c8!!! [BOOK] !!!"` | 색 코드 지움(print 그대로, 위치 없음) | "!!! [BOOK] !!!" |
| bots/AutoSmurf.js:3825 | AutoSmurf.duriel | `"\c4=== [DURIEL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [DURIEL] ===" |
| bots/AutoSmurf.js:4050 | AutoSmurf.figurine | `"\c4=== [FIGURINE] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [FIGURINE] ===" |
| bots/AutoSmurf.js:4114 | AutoSmurf.figurine | `"\c8!!! [POTION] !!!"` | 색 코드 지움(print 그대로, 위치 없음) | "!!! [POTION] !!!" |
| bots/AutoSmurf.js:4140 | AutoSmurf.heart | `"\c4=== [HEART] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [HEART] ===" |
| bots/AutoSmurf.js:4174 | AutoSmurf.brain | `"\c4=== [BRAIN] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [BRAIN] ===" |
| bots/AutoSmurf.js:4208 | AutoSmurf.eye | `"\c4=== [EYE] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [EYE] ===" |
| bots/AutoSmurf.js:4307 | AutoSmurf.tome | `"\c4=== [TOME] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [TOME] ===" |
| bots/AutoSmurf.js:4459 | AutoSmurf.travincal | `"\c4=== [TRAVINCAL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [TRAVINCAL] ===" |
| bots/AutoSmurf.js:4500 | AutoSmurf.travincal | `"Travincal failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:4518 | AutoSmurf.travincal | `"Travincal failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:4602 | AutoSmurf.mephisto | `"\c4=== [MEPHISTO] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [MEPHISTO] ===" |
| bots/AutoSmurf.js:4719 | AutoSmurf.izual | `"\c4=== [IZUAL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [IZUAL] ===" |
| bots/AutoSmurf.js:5140 | AutoSmurf.diablo | `"\c4=== [DIABLO] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [DIABLO] ===" |
| bots/AutoSmurf.js:5287 | AutoSmurf.shenk | `"\c4=== [SHENK] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [SHENK] ===" |
| bots/AutoSmurf.js:5369 | AutoSmurf.barbs | `"\c4=== [BARBS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [BARBS] ===" |
| bots/AutoSmurf.js:5475 | AutoSmurf.anya | `"\c4=== [ANYA] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [ANYA] ===" |
| bots/AutoSmurf.js:5669 | AutoSmurf.anya | `"\c8!!! [SCROLL] !!!"` | 색 코드 지움(print 그대로, 위치 없음) | "!!! [SCROLL] !!!" |
| bots/AutoSmurf.js:5709 | AutoSmurf.ancients | `"\c4=== [ANCIENTS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [ANCIENTS] ===" |
| bots/AutoSmurf.js:5939 | AutoSmurf.baal | `"\c4=== [BAAL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [BAAL] ===" |
| bots/AutoSmurf.js:5970 | AutoSmurf.baal | `"Baal failed: souls found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:5982 | AutoSmurf.baal | `"Baal failed: souls found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:5994 | AutoSmurf.baal | `"Baal failed: souls found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6020 | AutoSmurf.baal | `"Baal failed: souls found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6134 | AutoSmurf.baal | `"Hiring needed"` | → Misc.print | "Baal failed: hiring needed" |
| bots/AutoSmurf.js:6136 | AutoSmurf.baal | `"Not ready to kill Baal"` | → Misc.print | "Baal failed: not ready" |
| bots/AutoSmurf.js:6224 | AutoSmurf.farmingCountess | `"\c4=== [COUNTESS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [COUNTESS] ===" |
| bots/AutoSmurf.js:6300 | AutoSmurf.farmingPit | `"\c4=== [PIT] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [PIT] ===" |
| bots/AutoSmurf.js:6361 | AutoSmurf.farmingAndy | `"\c4=== [ANDY] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [ANDY] ===" |
| bots/AutoSmurf.js:6626 | AutoSmurf.farmingCows | `"\c4=== [COWS] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [COWS] ===" |
| bots/AutoSmurf.js:6633 | AutoSmurf.farmingCows | `"Cows failed: King killed"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6640 | AutoSmurf.farmingCows | `"Cows failed: Cain incomplete"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6647 | AutoSmurf.farmingCows | `"Cows failed: Baal incomplete"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6655 | AutoSmurf.farmingCows | `"Cows failed: quest unmatched"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6697 | AutoSmurf.farmingCows | `"Cows failed: enter Tristram"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6732 | AutoSmurf.farmingCows | `"Cows failed: get leg"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6762 | AutoSmurf.farmingCows | `"Cows failed: init akara"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6785 | AutoSmurf.farmingCows | `"Cows failed: get tome"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6797 | AutoSmurf.farmingCows | `"Cows failed: empty cube"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6804 | AutoSmurf.farmingCows | `"Cows failed: transmute leg and tome"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6824 | AutoSmurf.farmingCows | `"Cows failed: open portal"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6839 | AutoSmurf.farmingCows | `"Cows failed: open portal"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6899 | AutoSmurf.farmingCows | `"Cows failed: clearCowLevel"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6918 | AutoSmurf.farmingCows | `"Cows failed: followDriver"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:6973 | AutoSmurf.farmingSummoner | `"\c4=== [SUMMONER] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [SUMMONER] ===" |
| bots/AutoSmurf.js:6996 | AutoSmurf.farmingSummoner | `"Summoner failed: Invalid Path"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7022 | AutoSmurf.farmingSummoner | `"Summoner failed: Invalid Path"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7088 | AutoSmurf.farmingMephisto | `"\c4=== [MEPHISTO] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [MEPHISTO] ===" |
| bots/AutoSmurf.js:7154 | AutoSmurf.farmingAbaddon | `"\c4=== [ABADDON] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [ABADDON] ===" |
| bots/AutoSmurf.js:7195 | AutoSmurf.farmingAbaddon | `"Abaddon failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7203 | AutoSmurf.farmingAbaddon | `"Abaddon failed: moveTo"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7237 | AutoSmurf.farmingPOA | `"\c4=== [POA] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [POA] ===" |
| bots/AutoSmurf.js:7278 | AutoSmurf.farmingPOA | `"POA failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7286 | AutoSmurf.farmingPOA | `"POA failed: moveTo"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7320 | AutoSmurf.farmingInfernal | `"\c4=== [INFERNAL] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [INFERNAL] ===" |
| bots/AutoSmurf.js:7361 | AutoSmurf.farmingInfernal | `"Infernal failed: getPresetUnit"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7369 | AutoSmurf.farmingInfernal | `"Infernal failed: moveTo"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7402 | AutoSmurf.farmingNihlathak | `"\c4=== [NIHLATHAK] ==="` | 색 코드 지움(print 그대로, 위치 없음) | "=== [NIHLATHAK] ===" |
| bots/AutoSmurf.js:7422 | AutoSmurf.farmingNihlathak | `"Nihlathak failed: Vipers found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7443 | AutoSmurf.farmingNihlathak | `"Nihlathak failed: Vipers found"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7529 | AutoSmurf.onCopyData | `"hireMerc"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7542 | AutoSmurf.onCopyData | `"farmingON"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:7993 | AutoSmurf | `"Helping straggler complete act3"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:8117 | AutoSmurf | `"Script ended"` | → Misc.print | 같은 내용 |
| default.dbj:100 | main | `e1` | → Misc.print | "Error: MinGameTime " + e1 |
| libs/Attack.js:24 | Attack.init | `"\c1Bad attack config. Don't expect your bot to attack."` | → Misc.print | "Attack failed: bad attack config" |
| libs/Attack.js:935 | Attack.getCowKing | `"Cow King found"` | → Misc.print | 같은 내용 |
| libs/Attack.js:973 | Attack.skipCheck | `"\c1Skip Exception: " + unit.name` | → Misc.print | "Skip exception: " + unit.name |
| libs/Attacks/Necromancer.js:95 | ClassAttack.initCurses | `"Invalid curse id"` | → Misc.print | "initCurses failed: invalid curse id" |
| libs/Attacks/Paladin.js:10 | ClassAttack.doAttack | `"mercwatch"` | → Misc.print | 같은 내용 |
| libs/Attacks/Sorceress.js:10 | ClassAttack.doAttack | `"mercwatch"` | → Misc.print | 같은 내용 |
| libs/AutoBuild.js:99 | AutoBuild.initialize | `"Loaded \c9[" + Build.getBuildType() + ".js]"` | 그대로(Misc 없는 스레드) |  |
| libs/Config.js:56 | Config.init | `"\c8Error: Config cache not found for " + me.profile` | → Misc.print | "Config failed: cache not found for " + me.profile |
| libs/Config.js:61 | Config.init | `"\c8Error in Config.init"` | → Misc.print | "Config failed: Config.init" |
| libs/Config.js:62 | Config.init | `e3.toSource()` | → Misc.print | "Config failed: " + e3.toSource() |
| libs/Cubing.js:1077 | Cubing.doCubing | `string` | → Misc.print | 같은 내용 |
| libs/Loader.js:124 | Loader.loadScripts | `"Loaded \c9[" + script + ".js]"` | → Misc.print | 같은 내용 (색 코드 지움) |
| libs/Loader.js:130 | Loader.loadScripts | `"\c2Copying Config properties from " + script + " object."` | → Misc.print | 같은 내용 (색 코드 지움) |
| libs/Loader.js:137 | Loader.loadScripts | `"\c2Reverting back unmodified config properties."` | → Misc.print | 같은 내용 (색 코드 지움) |
| libs/Merc.js:340 | Merc.checkSkill | `"Merc unmatched"` | → Misc.print | 같은 내용 |
| libs/Merc.js:345 | Merc.checkSkill | `"Revive needed"` | → Misc.print | 같은 내용 |
| libs/Merc.js:350 | Merc.checkSkill | `"Merc not found"` | → Misc.print | "Merc failed: not found" |
| libs/Merc.js:354 | Merc.checkSkill | `"Merc matched: " + stats.Merc` | → Misc.print | 같은 내용 |
| libs/Merc.js:371 | Merc.hire | `"[hire] no skill specified"` | → Misc.print | "hire failed: no skill specified" |
| libs/Merc.js:378 | Merc.hire | `"[hire] invalid skill"` | → Misc.print | "hire failed: invalid skill" |
| libs/Merc.js:395 | Merc.hire | `"[hire] invalid difficulty"` | → Misc.print | "hire failed: invalid difficulty" |
| libs/Merc.js:429 | Merc.hire | `"[hire] openMenu failed"` | → Misc.print | "hire failed: openMenu" |
| libs/Merc.js:454 | Merc.hire | `"[hire] removeItems failed"` | → Misc.print | "hire failed: removeItems" |
| libs/Merc.js:465 | Merc.hire | `"[hire] openMenu failed"` | → Misc.print | "hire failed: openMenu" |
| libs/Merc.js:470 | Merc.hire | `"[hire] no candidates: " + skill` | → Misc.print | "hire failed: no candidates " + skill |
| libs/Merc.js:499 | Merc.hire | `"[Hired] Level " + target.level + " " + skill` | → Misc.print | 같은 내용 |
| libs/Merc.js:515 | Merc.hire | `"[hire] hiring failed"` | → Misc.print | "hire failed: hiring" |
| libs/Misc.js:398 | Skill.setSkill | `'[\c9Warning\c0] charged skills must be cast from right hand'` | → Misc.print | "Skill: charged skills must be cast from right hand" |
| libs/Misc.js:494 | Equip.updateTier | `"equipped: [" + key + "] " + eq.tier` | → Misc.print | 같은 내용 |
| libs/Misc.js:873 | Grant.updateTier | `"granted: [" + key + "] " + eq.tier` | → Misc.print | 같은 내용 |
| libs/Misc.js:882 | Grant.updateStat | `"updateMercStat"` | → Misc.print | 같은 내용 |
| libs/Misc.js:2153 | Misc.townCheck | `"Town check (direct)"` | → Misc.print | 같은 내용 |
| libs/Misc.js:2274 | Misc.spy | `"player not found"` | → Misc.print | "spy failed: player not found" |
| libs/Misc.js:2680 | Experience.log | `string` | → Misc.print | 같은 내용 |
| libs/Misc.js:2686 | Experience.log | `"no exp" + getGameTime` | → Misc.print | 같은 내용 |
| libs/Pather.js:1712 | Pather.goWP | `"going to nearest WP"` | → Misc.print | "goWP: going to nearest WP" |
| libs/Pickit.js:27 | Pickit.init | `"Loaded \c9[" + loaded.join("] [") + "]"` | → Misc.print | 같은 내용 (색 코드 지움) |
| libs/Precast.js:477 | enchant | `"enchant: " + unit.name` | → Misc.print | 같은 내용 |
| libs/Precast.js:493 | enchant | `"enchant: " + unit.classid` | → Misc.print | 같은 내용 |
| libs/Runewords.js:425 | Runewords.makeRunewords | `"\c4[Runeword] \c0" + logString` | → Misc.print | "[Runeword] " + logString |
| libs/Runewords.js:481 | Runewords.rerollRunewords | `"\c4[Reset] \c0" + logString` | → Misc.print | "[Reset] " + logString |
| libs/Storage.js:396 | Container.Dump | `this.name + " has the width of " + this.width + " and the height of " + this.height` | 그대로(수동) |  |
| libs/Storage.js:397 | Container.Dump | `this.name + " has " + this.itemList.length + " items inside, and has " + this.openPositions + " spots left."` | 그대로(수동) |  |
| libs/Storage.js:406 | Container.Dump | `string` | 그대로(수동) |  |
| libs/Town.js:1171 | Town.repair | `"interact closed"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1191 | Town.repair | `"not enough quiver: " + (equipQuiver ? equipQuiver.getStat(70) : 0) + (invQuiver ? " + " + invQuiver.getSta...` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1196 | Town.repair | `"equipQuiver moved"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1201 | Town.repair | `"equipQuiver dropped"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1206 | Town.repair | `"invQuiver dropped"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1222 | Town.repair | `"equipQuiver sold"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1229 | Town.repair | `"equipQuiver"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1234 | Town.repair | `"invQuiver sold"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1241 | Town.repair | `"invQuiver"` | 삭제(trace 유지, 사용자 261102) |  |
| libs/Town.js:1248 | Town.repair | `(equipQuiver ? "equipQuiver " + equipQuiver.getStat(70) : "no quiver") + (invQuiver ? " / invQuiver " + inv...` | 삭제(trace 유지, 사용자 261102) |  |
| threads/AutoBuildThread.js:323 | main | `"Something broke!"` | 그대로(Misc 없는 스레드) |  |
| threads/AutoBuildThread.js:324 | main | `"Error:"+ err.toSource()` | 그대로(Misc 없는 스레드) |  |
| threads/AutoBuildThread.js:325 | main | `"Stack trace: \n"+ err.stack` | 그대로(Misc 없는 스레드) |  |
| threads/HeartBeat.js:12 | main | `"Heartbeat loaded"` | 그대로(Misc 없는 스레드) |  |
| threads/HeartBeat.js:21 | main.togglePause | `"\c1Pausing \c0" + script.name` | 그대로(Misc 없는 스레드) |  |
| threads/HeartBeat.js:24 | main.togglePause | `"\c2Resuming \c0" + script.name` | 그대로(Misc 없는 스레드) |  |
| threads/MapHelper.js:33 | main | `"pause mapthread"` | 그대로(Misc 없는 스레드) |  |
| threads/MapHelper.js:38 | main | `"resume mapthread"` | 그대로(Misc 없는 스레드) |  |
| threads/MapThread.js:803 | main | `"\c9Map Thread Loaded."` | 그대로(Misc 없는 스레드) |  |
| threads/MapThread.js:840 | main.keyEvent | `me.x+","+me.y` | 그대로(Misc 없는 스레드) |  |
| threads/MapThread.js:846 | main.keyEvent | `Math.round(getDistance(me.x, me.y, player.x, player.y))` | 그대로(Misc 없는 스레드) |  |
| threads/PartyThread.js:124 | partyInGame | `"party has left: " + (lost.length ? lost.join(", ") : names.join(", "))` | → Misc.print | 같은 내용 |
| threads/Reload.js:41 | main | `"\c2D2BS\c0 :: Stopping scripts"` | 그대로(Misc 없는 스레드) |  |
| threads/Reload.js:45 | main | `"\c2D2BS\c0 :: Reloading default.dbj"` | 그대로(Misc 없는 스레드) |  |
| threads/Reload.js:52 | main | `"Script ended, cleaning up"` | 그대로(Misc 없는 스레드) |  |
| threads/ToolsThread.js:346 | main.startMeter | `"[MM] armed at " + me.x + "," + me.y + " me.gid:" + me.gid` | 그대로 |  |
| threads/ToolsThread.js:387 | main.runMeter | `"[MM] no missile seen"` | 그대로 |  |
| threads/ToolsThread.js:415 | main.runMeter | `line` | 그대로 |  |
| threads/ToolsThread.js:474 | main.keyEvent | `s.name` | 그대로 |  |
| threads/ToolsThread.js:487 | main.keyEvent | `"\c4MF: \c0" + me.getStat(80) + " \c4GF: \c0" + me.getStat(79) + " \c1FR: \c0" + me.getStat(39) + " \c3CR: ...` | 그대로 |  |
| threads/ToolsThread.js:500 | main.keyEvent | `me.x + "," + me.y` | 그대로 |  |
| threads/ToolsThread.js:598 | main | `"[Chicken] Life (" + me.hp + "/" + me.hpmax + ") area:" + me.area + " (" + me.x + "," + me.y + ")"` | 삭제(Quit: Life Chicken print로 대체) |  |
| threads/ToolsThread.js:718 | main | `"[MM] " + e2` | 그대로 |  |
| threads/TownChicken.js:62 | main | `"Can't tp from uber trist."` | → Misc.print | "TownChicken failed: can't tp from uber trist" |
| threads/TownChicken.js:64 | main | `"cannot open TP"` | → Misc.print | "TownChicken failed: cannot open TP" |
| threads/TownChicken.js:94 | main | `"Town check"` | → Misc.print | 같은 내용 |
| threads/TownChicken.js:98 | main | `"Town chicken"` | → Misc.print | 같은 내용 |
| tools/NTItemParser.dbl:114 | NTIP.CheckQuantityOwned | `"I can't find my items!"` | → Misc.print | "NTIP failed: can't find my items" |
| tools/OOG.js:38 | D2Bot.printToConsole | `"[console] " + msg` | 삭제([console] 한 벌) |  |
| tools/OOG.js:423 | DataFile.getObj | `"Error reading DataFile. Using null values."` | 그대로 |  |
| tools/OOG.js:526 | ControlAction.click | `"control not found " + type + " " + x + " " + y + " location " + getLocation()` | 그대로 |  |
| tools/OOG.js:686 | ControlAction.createGame | `"Creating Game: " + name` | → Misc.print | "Create game: " + name |
| tools/OOG.js:813 | ControlAction.loginAccount | `getLocation()` | 그대로 |  |
| tools/OOG.js:900 | ControlAction.makeAccount | `"makeAccount: location " + getLocation()` | 그대로 |  |

### trace (136곳)

→ Misc.print 58 / 삭제(같은 줄 print 있음) 46 / trace 유지(임시) 27 / 삭제(print에 같은 줄 있음) 5

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| bots/AutoSmurf.js:101 | AutoSmurf.start | `"dropping radament book"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:819 | AutoSmurf.pickGold | `"Picking up " + amount + " Gold"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:858 | AutoSmurf.giveGold | `"Dropping " + Math.round(dropGold) + " Gold"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:880 | AutoSmurf.giveGold | `"Retaking " + amount + " Gold"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:914 | AutoSmurf.bossGuard | `"bossGuard on: " + pct + "%"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:917 | AutoSmurf.bossGuard | `"bossGuard chicken off: pct 0 (now)"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:932 | AutoSmurf.bossGuard.Attack.bossScan | `"bossGuard found: " + unit.name + " " + hp + "%"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:961 | AutoSmurf.bossGuard.Attack.bossScan | `"bossGuard chicken off: " + unit.name + " " + hp + "%@" + ((getTickCount() - guardStart) / 1000).toFixed(1)...` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:980 | AutoSmurf.traceGuardSeen | `"bossGuard last: " + last.name + " " + last.hp1 + "%@" + (last.t1 / 1000).toFixed(1) + "s"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1006 | AutoSmurf.bossEnd | `"revive start"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1025 | AutoSmurf.bossEnd | `"bossGuard chicken on: " + guardChicken + "%"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1074 | AutoSmurf.bossEnd | `"corpse picked"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1077 | AutoSmurf.bossEnd | `"bossGuard chicken on: " + guardChicken + "%"` | → Misc.print | 같은 내용 |
| bots/AutoSmurf.js:1624 | AutoSmurf.getQuestItem | `classid + " vanished"` | → Misc.print | "getQuestItem failed: " + classid + " vanished" |
| bots/AutoSmurf.js:1633 | AutoSmurf.getQuestItem | `"Trying to make room for " + item.name` | → Misc.print | "getQuestItem: making room for " + item.name |
| bots/AutoSmurf.js:1638 | AutoSmurf.getQuestItem | `"Not enough room for " + item.name` | → Misc.print | "getQuestItem failed: not enough room for " + item.name |
| bots/AutoSmurf.js:1644 | AutoSmurf.getQuestItem | `classid + " not found"` | → Misc.print | "getQuestItem failed: " + classid + " not found" |
| bots/AutoSmurf.js:1924 | AutoSmurf.den | `"=== [DEN] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2071 | AutoSmurf.blood | `"=== [BLOOD] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2156 | AutoSmurf.cain | `"=== [CAIN] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2432 | AutoSmurf.trist | `"=== [TRIST] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2502 | AutoSmurf.outer | `"=== [OUTER] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2573 | AutoSmurf.smith | `"=== [SMITH] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2678 | AutoSmurf.malus | `"=== [MALUS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2727 | AutoSmurf.jail | `"=== [JAIL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2779 | AutoSmurf.inner | `"=== [INNER] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2917 | AutoSmurf.cathedral | `"=== [CATHEDRAL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:2976 | AutoSmurf.andy | `"=== [ANDY] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3123 | AutoSmurf.cube | `"=== [CUBE] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3223 | AutoSmurf.amulet | `"=== [AMULET] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3316 | AutoSmurf.summoner | `"=== [SUMMONER] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3456 | AutoSmurf.tombs | `"=== [TOMBS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3607 | AutoSmurf.staff | `"=== [STAFF] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3641 | AutoSmurf.radament | `"=== [RADAMENT] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3666 | AutoSmurf.radament | `"radament atma: 9,0 " + me.getQuest(9, 0) + " 9,1 " + me.getQuest(9, 1) + " 9,5 " + me.getQuest(9, 5)` | trace 유지(임시) |  |
| bots/AutoSmurf.js:3675 | AutoSmurf.radament | `"radament gate: 9,0 " + me.getQuest(9, 0) + " 9,1 " + me.getQuest(9, 1) + " 9,5 " + me.getQuest(9, 5) + " b...` | trace 유지(임시) |  |
| bots/AutoSmurf.js:3801 | AutoSmurf.radament | `"!!! [BOOK] !!!"` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:3825 | AutoSmurf.duriel | `"=== [DURIEL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4050 | AutoSmurf.figurine | `"=== [FIGURINE] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4114 | AutoSmurf.figurine | `"!!! [POTION] !!!"` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4140 | AutoSmurf.heart | `"=== [HEART] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4174 | AutoSmurf.brain | `"=== [BRAIN] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4208 | AutoSmurf.eye | `"=== [EYE] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4307 | AutoSmurf.tome | `"=== [TOME] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4459 | AutoSmurf.travincal | `"=== [TRAVINCAL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4471 | AutoSmurf.travincal | `"[travincal] portalReset " + (me.getQuest(20, 0) ? "skip" : "run") + " q20:" + me.getQuest(20, 0)` | trace 유지(임시) |  |
| bots/AutoSmurf.js:4602 | AutoSmurf.mephisto | `"=== [MEPHISTO] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:4719 | AutoSmurf.izual | `"=== [IZUAL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5140 | AutoSmurf.diablo | `"=== [DIABLO] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5287 | AutoSmurf.shenk | `"=== [SHENK] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5369 | AutoSmurf.barbs | `"=== [BARBS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5475 | AutoSmurf.anya | `"=== [ANYA] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5669 | AutoSmurf.anya | `"!!! [SCROLL] !!!"` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5709 | AutoSmurf.ancients | `"=== [ANCIENTS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:5939 | AutoSmurf.baal | `"=== [BAAL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:6224 | AutoSmurf.farmingCountess | `"=== [COUNTESS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:6300 | AutoSmurf.farmingPit | `"=== [PIT] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:6361 | AutoSmurf.farmingAndy | `"=== [ANDY] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:6626 | AutoSmurf.farmingCows | `"=== [COWS] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:6973 | AutoSmurf.farmingSummoner | `"=== [SUMMONER] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7088 | AutoSmurf.farmingMephisto | `"=== [MEPHISTO] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7154 | AutoSmurf.farmingAbaddon | `"=== [ABADDON] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7237 | AutoSmurf.farmingPOA | `"=== [POA] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7320 | AutoSmurf.farmingInfernal | `"=== [INFERNAL] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7402 | AutoSmurf.farmingNihlathak | `"=== [NIHLATHAK] ===", true` | 삭제(같은 줄 print 있음) |  |
| bots/AutoSmurf.js:7782 | AutoSmurf | `"radamentOff -> tombs"` | trace 유지(임시) |  |
| bots/AutoSmurf.js:8120 | AutoSmurf | `"Script ended"` | 삭제(print에 같은 줄 있음) |  |
| default.dbj:46 | main | `"=== [" + me.gamename + "] ===", true` | 삭제(같은 줄 print 있음) |  |
| default.dbj:58 | main | `"Init failed in default.dbj. Stopping", true` | → Misc.print | "Stop: Init failed in default.dbj" |
| libs/Attack.js:77 | Attack.clear | `"AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping"` | → Misc.print | "Stop: AttackSkill[" + i + "] " + id + " not learned (lvl " + me.charlvl + ")" |
| libs/Attack.js:472 | Attack.clear | `"boss not found: " + spec.ids.join(", ")` | → Misc.print | "clear failed: boss not found " + ids |
| libs/Merc.js:505 | Merc.hire | `"[hire] hiring retry (" + (retry) + "/5)"` | → Misc.print | "hire retry " + retry + "/5" |
| libs/Misc.js:2154 | Misc.townCheck | `"Town check (direct)"` | 삭제(print에 같은 줄 있음) |  |
| libs/Misc.js:2350 | Misc.quitGame | `"[Quit] " + reason + (detail ? ": " + detail : "")` | → Misc.print | "Quit: " + reason + (detail ? " - " + detail : "") |
| libs/Misc.js:2362 | Misc.caughtError | `"[Error] " + place + ": " + msg + (e && e.fileName ? " (" + e.fileName.substring(e.fileName.lastIndexOf("\\...` | → Misc.print | "Error: " + place + ": " + msg + " (파일 #줄)" |
| libs/Misc.js:2422 | Misc.errorReport | `"[Error] " + oogmsg.trim(), true` | → Misc.print | "Error: " + oogmsg + (stackLog ? " Stack: " + stackLog : "")  ※ 위치는 붙이지 않음(print 직접) |
| libs/Misc.js:2710 | Packet.openMenu | `"[openMenu] retry i:" + i + " keys:" + talk.keys + " npc:" + unit.name` | trace 유지(임시) |  |
| libs/Misc.js:2769 | Packet.endTalk | `"[TK] talk skipped " + talk.keys + " npc:" + npc.name` | → Misc.print | "endTalk: talk skipped keys:" + talk.keys + " npc:" + npc.name |
| libs/Pather.js:311 | Pather.moveTo | `"no original path -> " + x + "," + y + " in " + Pather.getAreaName(me.area) + " adjusting..."` | trace 유지(임시) |  |
| libs/Pather.js:322 | Pather.moveTo | `"adjusted path -> " + x + "," + y + " in " + Pather.getAreaName(me.area)` | trace 유지(임시) |  |
| libs/Pather.js:329 | Pather.moveTo | `"no adjusted path -> " + me.x + "," + me.y + " in " + Pather.getAreaName(me.area) + " fixing..."` | trace 유지(임시) |  |
| libs/Pather.js:341 | Pather.moveTo | `"fixed path -> " + x + "," + y + " in " + Pather.getAreaName(me.area)` | trace 유지(임시) |  |
| libs/Pather.js:430 | Pather.moveTo | `"[SafeTele] teleportTo FAILED - safeNode:(" + checkedNode.x + "," + checkedNode.y + ") dist:" + Math.floor(...` | → Misc.print | "SafeTele failed: teleportTo safeNode:" + x + "," + y + " dist:" + d |
| libs/Pather.js:515 | Pather.moveTo | `"[moveTo] retry " + retry + " over -> " + x + "," + y + " in " + Pather.getAreaName(me.area) + " dist:" + M...` | trace 유지(임시) |  |
| libs/Pather.js:575 | Pather.teleportTo | `"[teleportTo failed] attempt:" + (i + 1) + " dist:" + Math.floor(getDistance(me.x, me.y, x, y)) + " ping:" ...` | → Misc.print | "teleportTo retry " + (i + 1) + ": dist:" + d + " ping:" + me.ping  (area 지움) |
| libs/Pather.js:1134 | Pather.useUnit | `"ArreatSummit Gate"` | → Misc.print | "Pather: Arreat Summit gate" |
| libs/Pather.js:1163 | Pather.useUnit | `"[useUnit] timeout iter:" + i + " dist:" + Math.floor(getDistance(me, unit)) + " ping:" + me.ping + " area:...` | → Misc.print | "useUnit retry " + i + ": timeout dist:… ping:… id:… target:… unit:x,y"  (area 지움) |
| libs/Pather.js:1333 | Pather.useWaypoint | `"[WP] wp.area:" + (wp ? wp.area : "null") + " me.area:" + me.area + " target:" + targetArea + " retry:" + i` | → Misc.print | "useWaypoint retry " + i + ": wp.area:" + … + " target:" + targetArea  (me.area 지움) |
| libs/Pather.js:1394 | Pather.makePortal | `"makePortal " + (i > 0 ? "late" : "existing") + " portal used try:" + i + " gid:" + portal.gid` | → Misc.print | "makePortal: " + (late\|existing) + " portal used try:" + i + " gid:" + gid |
| libs/Pather.js:1399 | Pather.makePortal | `"makePortal cast again try:" + i` | → Misc.print | "makePortal retry " + i + ": cast again" |
| libs/Pather.js:1546 | Pather.usePortal | `"usePortal failed target:" + targetArea + " owner:" + owner + " unit:" + (unit ? unit.gid : "-") + " pre:" ...` | → Misc.print | 같은 내용 |
| libs/Pather.js:1717 | Pather.goWP | `"[goWP] Failed to reach WP after 10 attempts. area:" + me.area` | → Misc.print | "goWP failed: 10 attempts"  (area 지움) |
| libs/Pather.js:1762 | Pather.getWP | `"[getWP] waypoint unit not found. area:" + me.area` | → Misc.print | "getWP failed: waypoint unit not found"  (area 지움) |
| libs/Pather.js:1779 | Pather.getWP | `"[getWP] waypoint menu not opened. try:" + i + " area:" + me.area` | → Misc.print | "getWP retry " + i + ": menu not opened"  (area 지움) |
| libs/Pather.js:1797 | Pather.journeyTo | `target.course` | trace 유지(임시) |  |
| libs/Pickit.js:722 | Pickit.canPick | `"undefined item (!?)"` | → Misc.print | "Pickit failed: undefined item" |
| libs/Prototypes.js:337 | Unit.prototype.drop | `"[DBG] drop"` | trace 유지(임시) |  |
| libs/Storage.js:218 | Container.MoveTo | `"[Storage.MoveTo] retry item:" + item.name + " loc:" + this.location` | → Misc.print | "Storage.MoveTo retry: " + item.name + " loc:" + location |
| libs/Storage.js:221 | Container.MoveTo | `"[Storage.MoveTo] catch: " + e.message + " item:" + (item ? item.name : "?") + " loc:" + this.location` | → Misc.print | "Storage.MoveTo failed: " + e.message + " item:" + … + " loc:" + location |
| libs/Storage.js:328 | Container.MoveToSlot | `"[MoveToSlot] no room, dropped blocker " + blocker.fname` | → Misc.print | "MoveToSlot: no room, dropped blocker " + blocker.fname |
| libs/Storage.js:343 | Container.MoveToSlot | `"[MoveToSlot] skip " + item.fname + " gid:" + item.gid + " got:" + target.fname + " loc " + target.location...` | trace 유지(임시) |  |
| libs/Storage.js:384 | Container.MoveToSlot | `"[MoveToSlot] " + item.fname + " FAILED slot:" + (occupant ? occupant.fname : "empty") + " dropped:" + drop...` | trace 유지(임시) |  |
| libs/Town.js:176 | Town.socketGems | `"socketGems failed: " + name + " -> [" + Config.Gear[t.bodyLoc] + "] " + t.item.name + (dropped ? " (droppe...` | → Misc.print | 같은 내용 |
| libs/Town.js:757 | Town.identify | `"identify stopped: no ID scroll for " + item.name + " (gold " + me.gold + ")"` | → Misc.print | "identify failed: no ID scroll for " + item.name + " gold:" + me.gold |
| libs/Town.js:765 | Town.identify | `"identify failed: " + item.name + " (" + (scroll.classid === 519 ? "tome" : "scroll") + ", " + (getTickCoun...` | → Misc.print | "identify failed: " + item.name + " " + 종류 + " " + ms + "ms" |
| libs/Town.js:767 | Town.identify | `"identify slow: " + item.name + " (" + (scroll.classid === 519 ? "tome" : "scroll") + ", " + (getTickCount(...` | → Misc.print | "identify slow: " + item.name + " " + 종류 + " " + ms + "ms" |
| libs/Town.js:1172 | Town.repair | `"interact closed"` | trace 유지(임시) |  |
| libs/Town.js:1192 | Town.repair | `"not enough quiver: " + (equipQuiver ? equipQuiver.getStat(70) : 0) + (invQuiver ? " + " + invQuiver.getSta...` | trace 유지(임시) |  |
| libs/Town.js:1197 | Town.repair | `"equipQuiver moved"` | trace 유지(임시) |  |
| libs/Town.js:1202 | Town.repair | `"equipQuiver dropped"` | trace 유지(임시) |  |
| libs/Town.js:1207 | Town.repair | `"invQuiver dropped"` | trace 유지(임시) |  |
| libs/Town.js:1223 | Town.repair | `"equipQuiver sold"` | trace 유지(임시) |  |
| libs/Town.js:1230 | Town.repair | `"equipQuiver"` | trace 유지(임시) |  |
| libs/Town.js:1235 | Town.repair | `"invQuiver sold"` | trace 유지(임시) |  |
| libs/Town.js:1242 | Town.repair | `"invQuiver"` | trace 유지(임시) |  |
| libs/Town.js:1249 | Town.repair | `(equipQuiver ? "equipQuiver " + equipQuiver.getStat(70) : "no quiver") + (invQuiver ? " / invQuiver " + inv...` | trace 유지(임시) |  |
| libs/Town.js:1960 | Town.clearInventory | `"moved from cube to drop " + items[i].name` | trace 유지(임시) |  |
| libs/Town.js:1968 | Town.clearInventory | `"moved from cube to sell " + items[i].name` | trace 유지(임시) |  |
| libs/Town.js:2294 | Town.goToTown | `"goToTown take TP failed start tick:" + startTick + " made:" + made` | → Misc.print | "goToTown failed: take TP startTick:" + startTick + " made:" + made |
| libs/Town.js:2329 | Town.visitTown | `"visitTown refused: Arreat Summit"` | → Misc.print | "visitTown failed: Arreat Summit" |
| libs/Town.js:2338 | Town.visitTown | `"visitTown start by:" + getScript(true).name + " tick:" + getTickCount()` | → Misc.print | "visitTown: start by:" + 스크립트 + " tick:" + tick |
| libs/Town.js:2362 | Town.visitTown | `"visitTown back tick:" + getTickCount()` | → Misc.print | "visitTown: back tick:" + tick |
| threads/PartyThread.js:125 | partyInGame | `"party has left: " + (lost.length ? lost.join(", ") : names.join(", "))` | 삭제(print에 같은 줄 있음) |  |
| threads/ToolsThread.js:73 | main.checkPing | `"[Quit] High ping " + me.ping + "/" + Config.PingQuit[i].Ping` | → Misc.print | "Quit: High ping " + me.ping + "/" + 기준 |
| threads/ToolsThread.js:249 | main.drinkPotion | `"Couldn't give the potion to merc."` | → Misc.print | "drinkPotion failed: merc potion" |
| threads/ToolsThread.js:597 | main | `"[Quit] Life Chicken " + me.hp + "/" + me.hpmax` | → Misc.print | "Quit: Life Chicken " + me.hp + "/" + me.hpmax |
| threads/ToolsThread.js:620 | main | `"[Quit] Mana Chicken " + me.mp + "/" + me.mpmax` | → Misc.print | "Quit: Mana Chicken " + me.mp + "/" + me.mpmax |
| threads/ToolsThread.js:640 | main | `"[Quit] Iron Golem Chicken"` | → Misc.print | "Quit: Iron Golem Chicken" |
| threads/ToolsThread.js:660 | main | `"[mercPot] gone:" + !getUnit(4, -1, 2, mercPotGid) + " state100:" + !!merc.getState(100) + " mercHP:" + mer...` | trace 유지(임시) |  |
| threads/ToolsThread.js:666 | main | `"[Quit] Merc Chicken"` | → Misc.print | "Quit: Merc Chicken" |
| threads/TownChicken.js:95 | main | `"Town check"` | 삭제(print에 같은 줄 있음) |  |
| threads/TownChicken.js:99 | main | `"Town chicken"` | 삭제(print에 같은 줄 있음) |  |
| tools/NTItemParser.dbl:738 | NTIP.ParseRule | `"NTIP: duplicate gear key [" + key + "]" + where` | → Misc.print | 같은 내용 (nip 경고) |
| tools/NTItemParser.dbl:811 | NTIP.ParseRule | `"NTIP: gear tier ignored on tier/merc line File: " + info.file + " Line: " + info.line` | → Misc.print | 같은 내용 (nip 경고) |
| tools/OOG.js:1220 | ControlAction.makeCharacter | `"Character name taken: " + info.charName + " \"" + this.charNameTaken + "\""` | → Misc.print | 같은 내용 |
| tools/OOG.js:1283 | OOGLog.print | `text + (detail ? " \` | → Misc.print | print(text + (detail ? " - " + detail : "") + " (loc " + getLocation() + ")")  ※ 게임 밖, Misc.print 아님 |

### 머리 위 글자 (121곳)

→ Misc.print, 머리 위 글자 삭제 62 / 유지(아이템마다) 23 / 삭제(print에 같은 줄 있음/생김) 14 / 유지(매 틱) 12 / 유지(수동·키 입력) 8 / 유지 + Misc.print 추가 2

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| bots/AutoSmurf.js:84 | AutoSmurf.checkRole | `"I am the Leader"` | → Misc.print, 머리 위 글자 삭제 | "Role: Leader" |
| bots/AutoSmurf.js:90 | AutoSmurf.checkRole | `"I am the Boer"` | → Misc.print, 머리 위 글자 삭제 | "Role: Boer" |
| bots/AutoSmurf.js:92 | AutoSmurf.checkRole | `"I am a Follower"` | → Misc.print, 머리 위 글자 삭제 | "Role: Follower" |
| bots/AutoSmurf.js:457 | AutoSmurf.teamCount | `"OK"` | → Misc.print, 머리 위 글자 삭제 | "teamCount: OK" |
| bots/AutoSmurf.js:481 | AutoSmurf.buffCount | `"Buying antidote potions"` | → Misc.print, 머리 위 글자 삭제 | "buffCount: buying antidote potions" |
| bots/AutoSmurf.js:505 | AutoSmurf.buffCount | `"Antidote potions ready"` | → Misc.print, 머리 위 글자 삭제 | "buffCount: antidote potions ready" |
| bots/AutoSmurf.js:524 | AutoSmurf.buffCount | `"Buying thawing potions"` | → Misc.print, 머리 위 글자 삭제 | "buffCount: buying thawing potions" |
| bots/AutoSmurf.js:548 | AutoSmurf.buffCount | `"Thawing potions ready"` | → Misc.print, 머리 위 글자 삭제 | "buffCount: thawing potions ready" |
| bots/AutoSmurf.js:581 | AutoSmurf.buffCount | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:720 | AutoSmurf.syncBO | `msg` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:770 | AutoSmurf.syncWP | `msg` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:818 | AutoSmurf.pickGold | `"Picking up " + amount + " Gold"` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:857 | AutoSmurf.giveGold | `"Dropping " + Math.round(dropGold) + " Gold"` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:879 | AutoSmurf.giveGold | `"Retaking " + amount + " Gold"` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:1198 | AutoSmurf.travel | `"Traveling to " + Pather.getAreaName(destination)` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:1213 | AutoSmurf.travel | `"Travel course: " + target.course` | → Misc.print, 머리 위 글자 삭제 | "travel: course " + target.course |
| bots/AutoSmurf.js:1224 | AutoSmurf.travel | `"nextAreaIndex: " + nextAreaIndex` | 유지(매 틱) |  |
| bots/AutoSmurf.js:1227 | AutoSmurf.travel | `"Next location name: " + Pather.getAreaName(areaIDs[nextAreaIndex])` | → Misc.print, 머리 위 글자 삭제 | "travel: next " + 지역 이름 |
| bots/AutoSmurf.js:1294 | AutoSmurf.travel | `"Attempting to use any portal"` | → Misc.print, 머리 위 글자 삭제 | "travel: attempting to use any portal" |
| bots/AutoSmurf.js:1412 | AutoSmurf.changeAct | `"changeAct " + act` | → Misc.print, 머리 위 글자 삭제 | "changeAct: " + act |
| bots/AutoSmurf.js:1557 | AutoSmurf.changeAct | `"Checking player in..."` | → Misc.print, 머리 위 글자 삭제 | "changeAct: checking player in" |
| bots/AutoSmurf.js:1632 | AutoSmurf.getQuestItem | `"Trying to make room for " + item.name` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:1637 | AutoSmurf.getQuestItem | `"Not enough room for " + item.name` | 삭제(print에 같은 줄 있음/생김) |  |
| bots/AutoSmurf.js:1679 | AutoSmurf.offEquip | `"offEquip"` | → Misc.print, 머리 위 글자 삭제 | "offEquip" |
| bots/AutoSmurf.js:1694 | AutoSmurf.cubeStaff | `"cubingStaff"` | → Misc.print, 머리 위 글자 삭제 | "cubeStaff" |
| bots/AutoSmurf.js:1718 | AutoSmurf.placeStaff | `"placeStaff"` | → Misc.print, 머리 위 글자 삭제 | "placeStaff" |
| bots/AutoSmurf.js:1749 | AutoSmurf.cubeFlail | `"cubeFlail"` | → Misc.print, 머리 위 글자 삭제 | "cubeFlail" |
| bots/AutoSmurf.js:1797 | AutoSmurf.equipFlail | `"Keeping weapon by force"` | → Misc.print, 머리 위 글자 삭제 | "equipFlail: keeping weapon by force" |
| bots/AutoSmurf.js:1820 | AutoSmurf.placeFlail | `"Smashing the Compelling Orb"` | → Misc.print, 머리 위 글자 삭제 | "placeFlail: smashing the Compelling Orb" |
| bots/AutoSmurf.js:1958 | AutoSmurf.den | `"Clearing retry " + i` | → Misc.print, 머리 위 글자 삭제 | "Den retry " + i + ": clearing" |
| bots/AutoSmurf.js:2007 | AutoSmurf.den | `"Clearing retry " + i` | → Misc.print, 머리 위 글자 삭제 | "Den retry " + i + ": clearing" |
| bots/AutoSmurf.js:2103 | AutoSmurf.blood | `"Getting waypoint..."` | → Misc.print, 머리 위 글자 삭제 | "Blood: getting waypoint" |
| bots/AutoSmurf.js:2167 | AutoSmurf.cain | `"Getting waypoint..."` | → Misc.print, 머리 위 글자 삭제 | "Cain: getting waypoint" |
| bots/AutoSmurf.js:2229 | AutoSmurf.cain | `"Getting scroll..."` | → Misc.print, 머리 위 글자 삭제 | "Cain: getting scroll" |
| bots/AutoSmurf.js:2291 | AutoSmurf.cain | `"Getting redportal..."` | → Misc.print, 머리 위 글자 삭제 | "Cain: getting redportal" |
| bots/AutoSmurf.js:2347 | AutoSmurf.cain | `"Rescue cain"` | → Misc.print, 머리 위 글자 삭제 | "Cain: rescue" |
| bots/AutoSmurf.js:2656 | AutoSmurf.smith | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:3349 | AutoSmurf.summoner | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:3729 | AutoSmurf.radament | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:3882 | AutoSmurf.duriel | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:3888 | AutoSmurf.duriel | `"Waiting for Orifice TP..."` | → Misc.print, 머리 위 글자 삭제 | "Duriel: waiting for Orifice TP" |
| bots/AutoSmurf.js:3964 | AutoSmurf.duriel | `"Waiting for Duriel TP..."` | → Misc.print, 머리 위 글자 삭제 | "Duriel: waiting for Duriel TP" |
| bots/AutoSmurf.js:4250 | AutoSmurf.eye | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:4330 | AutoSmurf.tome | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:4746 | AutoSmurf.izual | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:4894 | AutoSmurf.diablo.seisSeal | `"Seis layout " + this.seisLayout` | → Misc.print, 머리 위 글자 삭제 | "Diablo: Seis layout " + n |
| bots/AutoSmurf.js:4940 | AutoSmurf.diablo.infectorSeal | `"Inf layout " + this.infLayout` | → Misc.print, 머리 위 글자 삭제 | "Diablo: Inf layout " + n |
| bots/AutoSmurf.js:4978 | AutoSmurf.diablo.vizierSeal | `"Viz layout " + this.vizLayout` | → Misc.print, 머리 위 글자 삭제 | "Diablo: Viz layout " + n |
| bots/AutoSmurf.js:5159 | AutoSmurf.diablo | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:5305 | AutoSmurf.shenk | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:5394 | AutoSmurf.barbs | `"Going to barbspot " + (k + 1) + "/" + barbSpots.length` | → Misc.print, 머리 위 글자 삭제 | "Barbs: going to barbspot " + k + "/" + n |
| bots/AutoSmurf.js:5519 | AutoSmurf.anya | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:5722 | AutoSmurf.ancients | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:6008 | AutoSmurf.baal | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:6501 | AutoSmurf.farmingCows.followDriver | `"followDriver start"` | → Misc.print, 머리 위 글자 삭제 | "followDriver: start" |
| bots/AutoSmurf.js:6518 | AutoSmurf.farmingCows.followDriver | `"driver: " + driver.x + "." + driver.y + " distance: " + Math.round(getDistance(me, driver))` | 유지(매 틱) |  |
| bots/AutoSmurf.js:6538 | AutoSmurf.farmingCows.followDriver | `"msgNode: " + msgNode[0] + "." + msgNode[1] + " distance: " + Math.round(getDistance(me, msgNode[0], msgNod...` | 유지(매 틱) |  |
| bots/AutoSmurf.js:6570 | AutoSmurf.farmingCows.followDriver | `"followDriver end"` | → Misc.print, 머리 위 글자 삭제 | "followDriver: end" |
| bots/AutoSmurf.js:6829 | AutoSmurf.farmingCows | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:7009 | AutoSmurf.farmingSummoner | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:7434 | AutoSmurf.farmingNihlathak | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady" |
| bots/AutoSmurf.js:7605 | AutoSmurf.onCopyData | `"tpReady"` | → Misc.print, 머리 위 글자 삭제 | "tpReady: received" |
| bots/AutoSmurf.js:7660 | AutoSmurf.onCopyData | `"msgLeader"` | → Misc.print, 머리 위 글자 삭제 | "msgLeader: received" |
| bots/AutoSmurf.js:7994 | AutoSmurf | `"Helping straggler complete act3"` | 삭제(print에 같은 줄 있음/생김) |  |
| default.dbj:96 | main | `"Stalling for " + Math.round(((startTime + (Config.MinGameTime * 1000)) - getTickCount()) / 1000) + " Secon...` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:378 | ClassAttack.raiseArmy | `"[ARMY] REVIVE " + corpse.name + " " + me.getMinionCount(6) + " / " + maxRevives` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:402 | ClassAttack.raiseArmy | `"[ARMY] SKELETON " + me.getMinionCount(4) + " / " + maxSkeletons` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:425 | ClassAttack.raiseArmy | `"[ARMY] MAGE " + me.getMinionCount(5) + " / " + maxMages` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:477 | ClassAttack.explodeCorpses | `"Exploding: " + corpse.classid + " " + corpse.name + " id:" + corpse.gid` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:496 | ClassAttack.explodeCorpses | `"Exploding Cow: " + corpse.classid + " " + corpse.name` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:514 | ClassAttack.explodeCorpses | `"Exploding Max: " + corpse.classid + " " + corpse.name` | 유지(매 틱) |  |
| libs/Attacks/Necromancer.js:532 | ClassAttack.explodeCorpses | `"Exploding: " + corpse.classid + " " + corpse.name` | 유지(매 틱) |  |
| libs/Cubing.js:1076 | Cubing.doCubing | `string` | 유지(아이템마다) |  |
| libs/Misc.js:819 | Equip.autoEquip | `"[Tier " + tier + "] " + items[0].name` | 유지(아이템마다) |  |
| libs/Misc.js:1107 | Grant.autoEquip | `"[Granted " + tier + "] " + grant.name` | 유지(아이템마다) |  |
| libs/Misc.js:2118 | Misc.townCheck | `"We need healing potions"` | → Misc.print, 머리 위 글자 삭제 | "townCheck: need healing potions" |
| libs/Misc.js:2138 | Misc.townCheck | `"We need mana potions"` | → Misc.print, 머리 위 글자 삭제 | "townCheck: need mana potions" |
| libs/Misc.js:2152 | Misc.townCheck | `"Town check (direct)"` | 삭제(print에 같은 줄 있음/생김) |  |
| libs/Pather.js:510 | Pather.moveTo | `"move retry " + fail` | 유지(매 틱) |  |
| libs/Pather.js:727 | Pather.openDoors | `"Opened a door!"` | 유지(아이템마다) |  |
| libs/Pather.js:1284 | Pather.useWaypoint | `"Trying to get the waypoint"` | → Misc.print, 머리 위 글자 삭제 | "useWaypoint: trying to get the waypoint" |
| libs/Pather.js:1300 | Pather.useWaypoint | `"waypoint retry " + (i + 1)` | → Misc.print, 머리 위 글자 삭제 | "useWaypoint retry " + (i + 1) |
| libs/Pickit.js:211 | Pickit.pickItems | `"Trying to make room for " + pickList[0].name` | 유지(아이템마다) |  |
| libs/Pickit.js:222 | Pickit.pickItems | `"Not enough room for " + pickList[0].name` | 유지 + Misc.print 추가 | "Pickit failed: not enough room for " + 이름 |
| libs/Pickit.js:227 | Pickit.pickItems | `"Not enough room for " + pickList[0].name` | 유지 + Misc.print 추가 | "Pickit failed: not enough room for " + 이름 |
| libs/Pickit.js:429 | Pickit.pickItem | `"Picked up " + (item.getStat(14) ? (item.getStat(14) - stats.gold) : stats.gold) + " " + stats.name` | 유지(아이템마다) |  |
| libs/Pickit.js:438 | Pickit.pickItem | `"Picked up " + stats.name + " (" + Town.checkKeys() + "/12)"` | 유지(아이템마다) |  |
| libs/Pickit.js:443 | Pickit.pickItem | `"Picked up " + stats.name + " (" + Town.checkScrolls(stats.classid === 529 ? "tbk" : "ibk") + "/20)"` | 유지(아이템마다) |  |
| libs/Pickit.js:465 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + (status.line ? ") (" + status.line + ")" : ")")` | 유지(아이템마다) |  |
| libs/Pickit.js:477 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` | 유지(아이템마다) |  |
| libs/Pickit.js:484 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` | 유지(아이템마다) |  |
| libs/Pickit.js:491 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` | 유지(아이템마다) |  |
| libs/Runewords.js:424 | Runewords.makeRunewords | `"[Runeword] " + logString` | 삭제(print에 같은 줄 있음/생김) |  |
| libs/Runewords.js:480 | Runewords.rerollRunewords | `"[Reset] " + logString` | 삭제(print에 같은 줄 있음/생김) |  |
| libs/Storage.js:207 | Container.MoveTo | `"Successfully placed " + item.name + " at X: " + nPos.x + " Y: " + nPos.y` | 유지(아이템마다) |  |
| libs/Town.js:257 | Town.initNPC | `"initNPC: " + reason` | → Misc.print, 머리 위 글자 삭제 | "initNPC: " + reason |
| libs/Town.js:884 | Town.shopItems | `"MiniShopBot: Scanning " + npc.itemcount + " items."` | → Misc.print, 머리 위 글자 삭제 | "MiniShopBot: scanning " + n + " items" |
| libs/Town.js:997 | Town.gamble | `"Buy: " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:1023 | Town.gamble | `"Sell: " + newItem.name` | 유지(아이템마다) |  |
| libs/Town.js:1313 | Town.needRepair | `"Town: Can't afford repairs."` | → Misc.print, 머리 위 글자 삭제 | "repair failed: can't afford" |
| libs/Town.js:1451 | Town.reviveMerc | `"MercWatch precast"` | → Misc.print, 머리 위 글자 삭제 | "MercWatch: precast" |
| libs/Town.js:1892 | Town.clearScrolls | `"clearInventory sell " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:1961 | Town.clearInventory | `"moved from cube to drop " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:1969 | Town.clearInventory | `"moved from cube to sell " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:1997 | Town.clearInventory | `"moved from stash to drop " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:2004 | Town.clearInventory | `"moved from stash to sell " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:2034 | Town.clearInventory | `"clearInventory sell " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:2038 | Town.clearInventory | `"clearInventory drop " + items[i].name` | 유지(아이템마다) |  |
| libs/Town.js:2046 | Town.clearInventory | `"LowGold sell " + items[i].name` | 유지(아이템마다) |  |
| threads/ToolsThread.js:64 | main.checkPing | `"High Ping"` | → Misc.print, 머리 위 글자 삭제 | "checkPing: high ping" |
| threads/ToolsThread.js:104 | main.getPotion | `"Drinking potion from inventory."` | → Misc.print, 머리 위 글자 삭제 | "getPotion: drinking potion from inventory" |
| threads/ToolsThread.js:132 | main.togglePause | `"Pausing."` | 유지(수동·키 입력) |  |
| threads/ToolsThread.js:138 | main.togglePause | `"Resuming."` | 유지(수동·키 입력) |  |
| threads/ToolsThread.js:345 | main.startMeter | `"Meter: cast now"` | 유지(수동·키 입력) |  |
| threads/ToolsThread.js:388 | main.runMeter | `"Meter: nothing"` | 유지(수동·키 입력) |  |
| threads/ToolsThread.js:420 | main.runMeter | `"Meter: done"` | 유지(수동·키 입력) |  |
| threads/ToolsThread.js:504 | main.keyEvent | `"Revealing " + Pather.getAreaName(me.area)` | 유지(수동·키 입력) |  |
| threads/TownChicken.js:39 | main.togglePause | `"Pausing."` | 유지(수동·키 입력) |  |
| threads/TownChicken.js:45 | main.togglePause | `"Resuming."` | 유지(수동·키 입력) |  |
| threads/TownChicken.js:93 | main | `"Town check"` | 삭제(print에 같은 줄 있음/생김) |  |
| threads/TownChicken.js:97 | main | `"Town chicken"` | 삭제(print에 같은 줄 있음/생김) |  |

### 채팅 (3곳)

삭제(say, 사용자 261102) 3

| 위치 | 함수 | 지금 | 처리 | 바뀐 내용 |
|---|---|---|---|---|
| D2BotFollow.dbj:343 | locationAction | `"/j " + StarterConfig.JoinChannel` | 삭제(say, 사용자 261102) |  |
| D2BotFollow.dbj:347 | locationAction | `StarterConfig.FirstJoinMessage` | 삭제(say, 사용자 261102) |  |
| D2BotLead.dbj:105 | sayMsg | `string` | 삭제(say, 사용자 261102) |  |

## 3. 노트 (같은 커밋)

| 파일 | 바꿀 것 |
|---|---|
| `CLAUDE.md` 4절 | 아래 새 문안으로 바꿈(콘솔·print·trace 세 줄과 형식 조항). 첫 조항(근거 없는 로그 제안 금지, 제거 조건, 정리 목록 출처)과 마지막 줄(엔진 메시지)은 그대로 |
| `docs/log_guide.md` | 받을 데이터 표(콘솔 파일 `Console.txt` 추가, `ScriptErrorLog` 삭제), 줄 이름(trace `[Quit]`·`[Error]`·게임 경계 → print `Quit:`·`Error:`·`=== [게임] ===`, 구간 끝 `X: completed`, `Died`), "콘솔 줄은 d2bs `[console]`에서 찾는다" → `Console.txt` |
| `docs/log_types.md` (새 파일) | 로그 종류 11가지의 목적·보는 곳·파일·코드·설정(정보 파일) |
| `docs/handoff.md` | 1-17 → 3절(옛 1-17), 2-2 → 3절(옛 2-2, 이번 작업). 검증 방법: 아래 4절 |
| `docs/code/*.md` | 고친 파일 노트(`Misc`, `OOG`, `ToolsThread`, `D2BotLead`, `D2BotFollow`, `default.dbj`, `Attack`, `AutoSmurf`, `Pickit`, `Pather`, `Town`, `Merc`, `Storage` 등)에 `261102 Claude: 로그 정책` 항목 |
| `drafts/` | 노트로 옮긴 뒤 삭제 |

### CLAUDE.md 4절 새 문안 (첫 조항 뒤, 엔진 줄 앞을 바꿈)

```
- **로그 4가지.** 사람이 보는 곳은 매니저(콘솔 색, 아이템 탭 그래픽), 분석은 파일(`Console.txt`, `ItemLog.txt`, d2bs 로그, trace).
- **콘솔** (`D2Bot.printToConsole`) = **흐름과 끝**. 매니저 화면 + 전 프로필 공유 파일 `_cache/trace/Console.txt`(`[YYYY/MM/DD HH:MM:SS] <프로필> <분류> 내용`, 분류는 색과 게임 안/밖으로 `printToConsole`이 정함: OOG/Flow/Item/Exp/Quit/Red/Error). 형식 `내용 (지역 x,y)`, 말머리 없이 색으로 구분.
  - 흐름은 **리더만**: 게임 입장 `Game: 이름 [레벨]`, 구간 끝 `X: completed`, 팀 대기·휴식, 플레이 시간 요약. 팔로워 흐름은 print로 본다.
  - 모든 프로필: 조기 종료 이유(기본색, `Misc.quitGame(이유, 상세)`, 모든 quit은 이 함수), 치킨·핑·죽음(`Died`)·`You died in last game`·멈춤(빨강 9), 오류(회색 10, `Misc.errorReport`·`Misc.caughtError(자리, e)` 콘솔은 게임당 자리별 1회), 퀘스트 아이템 `!!! … !!!`, `[Hired]`·`[Socket]`·`[Runeword]`·`[Reset]`·큐브, 경험치(모든 끝).
  - 정상 종료는 찍지 않는다(경험치 줄 앞에 조기 종료·빨강·오류 줄이 없으면 정상).
  - **게임 바깥**(Starter `D2Bot*.dbj`, `tools/OOG.js`, `tools/AutoCreate.js`) 콘솔은 모두 회색(10), 형식 `사건: 대상 - 처리 (loc N)`. 영어, 마침표 없음, `CDKey` 표기, 처리는 `stop`/`restart`/`retry`/`wait 30s`/`wait 5m`/`switch key`/`skip`/`create`. 예외: 게임 뒤 플레이 시간 요약은 기존 색.
- **print** (d2bs 로그 = 게임 화면 콘솔, 프로필·날짜별, 엔진이 시각을 붙임) = **상세 기록 전부**: 진행, 실패·재시도, 오류 상세(`Error:`), 조기 종료 상세(`Quit: 이유 - 상세`), 게임 경계 `=== [게임 이름] ===`, 구간 헤더 `=== [X] ===`.
  - 게임 안 줄은 `Misc.print(msg)`로 찍는다(끝에 `(지역 x,y)`, 색 코드 없음). 게임 경계·구간 헤더·게임 밖 줄은 위치 없이 `print`.
  - 문장: 진행 `주체: 일`, 실패 `주체 failed: 이유`, 재시도 `주체 retry N/M: 이유`, 값 `키:값`.
- **`Misc.trace`** (`_cache/trace/trace-<프로필>-<날짜>.txt`) = **임시 검증용만**. 줄 끝 메모에 handoff 번호와 제거 조건을 적는다. 형식 `[MM/DD/YY HH:MM:SS] 내용 (지역 x,y)`(게임 밖 `(OOG loc N)`).
- **머리 위 글자** (`me.overhead`) = 매 틱 반복되는 표시, 아이템마다의 표시, 키 입력 표시만. 한 번씩 일어나는 사건은 print로.
```

## 4. 검증 (handoff 3절에 적을 것)

- 커밋 전: 저장소 `.js`·`.dbj`·`.dbl` 55개 모두 `node --check` 통과(지금 55/55 통과).
- 첫 사이클 로그:
  - `_cache/trace/Console.txt`가 생기고 8프로필 줄이 섞여도 깨지지 않는지(줄 수, 모양).
  - 매니저 콘솔과 `Console.txt`가 1:1인지(매니저 크래시 줄 제외).
  - d2bs 로그에 `Misc.print` 줄의 `(지역 x,y)`, 게임 밖 줄에는 없음, `ÿc` 글자 없음.
  - `Error in`·`is not defined`(Misc·Pather가 없는 곳에서 불림) 0.
  - `Died` 줄과 다음 게임 `You died in last game`이 짝지어지는지.
  - 리더 `Game: 이름`과 각 프로필 print `=== [이름] ===`이 게임마다 있는지.
