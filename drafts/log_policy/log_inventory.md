# 로그 호출 전체 목록 (261102, main `b69b657`, 자동 추출)

- 대상: 저장소의 `.js`·`.dbj`·`.dbl` 전부(`_cache` 제외). 주석 안의 호출은 뺐다.
- 함수 칸: 그 호출을 감싸는 함수(객체.함수). `AutoSmurf.X`는 `this.X`.
- 내용 칸: 호출 인자를 코드 그대로 옮김. 색 코드 `ÿc`는 `\c`로 표기.
- 날짜 칸: 그 줄의 마지막 `//YYMMDD` 표기(없으면 빈칸). 누가 넣었는지는 확인하지 않음.

| # | 종류 | 목적(코드 기준) | 남는 곳 | 호출 수 |
|---|---|---|---|---|
| 1 | 콘솔 | 매니저에서 눈으로 알아챌 사건(종료 사유, 치킨, 오류, 구간, 경험치) | 매니저 콘솔 + d2bs 로그 `[console]` 한 벌(`OOG.js:38`) | 68 |
| 1b | 콘솔(게임 밖) | 게임 밖 사건(로그인·키·방 만들기·크래시). 콘솔 회색 + trace | 위와 같음 + trace | 45 (`OOGLog.print`·`stop`) |
| 2 | print | 게임 진행 기록 | 게임 화면 콘솔, d2bs 로그 | 199 |
| 3 | trace | 분석·검증·오류 상세 | `_cache/trace/trace-<프로필>-<날짜>.txt` | 136 |
| 4 | 머리 위 글자 | 화면에서 지금 하는 일 표시 | 남지 않음 | 121 |
| 5 | 아이템 로그 파일 | 아이템 처리 기록(Kept/Sold/Dropped/Equipped…) | `_cache/trace/ItemLog.txt` (전 프로필 공유) | 28 |
| 6 | 매니저 아이템 탭 | 같은 내용을 매니저 화면에 | 매니저 | 9 |
| 7 | 오류 보고 | 스크립트 오류. 파일 + 콘솔 회색 + trace `[Error]` | `_cache/trace/ScriptErrorLog.txt` | 39 (그중 nip 파서 28) |
| 8 | AutoBuild | 스탯·스킬 찍기 기록. `Verbose`면 print, `DebugMode`면 파일(둘 다 false) | `_cache/AutoBuild.<realm>.<캐릭>.<날짜>.log` | 18 |
| 9 | 매니저 상태 칸 | 지금 상태 한 줄(로비, 방 만들기, 게임 이름…) | 매니저 | 42 |
| 10 | 채팅 | 로비 채널 입장·메시지(채널 설정이 비어 있어 안 쓰임) | 게임 채팅 | 3 |
| 11 | D2BS 엔진 | 엔진 시작·종료, 엔진 오류 | d2bs 로그 | - |

앞서 채팅에서 말한 개수와 다른 것: trace 134 → 136(nip 파서 `.dbl` 2곳), 오류 보고 11 → 39(nip 파서 28곳), 게임 밖 콘솔 35 → 45(`OOGLog.stop` 포함), AutoBuild 1 → 18(`AutoBuild.print` 호출).


## 1. 콘솔 — `D2Bot.printToConsole` 68곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| D2BotLead.dbj:357 | addPlayTime | `text + " / " + me.gamename.split('-')[1] + "r (Avg. " + Math.floor(total / 60000 / me.gamename.split('-')[1]) + "m)"` |  |
| bots/AutoSmurf.js:184 | AutoSmurf.preparation | `"=== START ===", 7` |  |
| bots/AutoSmurf.js:190 | AutoSmurf.preparation | `"!!! BOOK !!!", 8` |  |
| bots/AutoSmurf.js:196 | AutoSmurf.preparation | `"!!! POTION !!!", 8` |  |
| bots/AutoSmurf.js:202 | AutoSmurf.preparation | `"!!! SCROLL !!!", 8` |  |
| bots/AutoSmurf.js:1651 | AutoSmurf.getQuestItem | `"===" + name + "===", 7` |  |
| bots/AutoSmurf.js:1655 | AutoSmurf.getQuestItem | `"=== STAFF ===", 7` |  |
| bots/AutoSmurf.js:1836 | AutoSmurf.placeFlail | `"=== TRAVINCAL ===", 7` |  |
| bots/AutoSmurf.js:2055 | AutoSmurf.den | `"=== DEN ===", 7` |  |
| bots/AutoSmurf.js:2143 | AutoSmurf.blood | `"=== BLOOD ===", 7` |  |
| bots/AutoSmurf.js:2390 | AutoSmurf.cain | `"=== CAIN ===", 7` |  |
| bots/AutoSmurf.js:2491 | AutoSmurf.trist | `"=== TRIST ===", 7` |  |
| bots/AutoSmurf.js:2562 | AutoSmurf.outer | `"=== OUTER ===", 7` |  |
| bots/AutoSmurf.js:2622 | AutoSmurf.smith | `"=== SMITH ===", 7` |  |
| bots/AutoSmurf.js:2719 | AutoSmurf.malus | `"=== MALUS ===", 7` |  |
| bots/AutoSmurf.js:2769 | AutoSmurf.jail | `"=== JAIL ===", 7` |  |
| bots/AutoSmurf.js:2907 | AutoSmurf.inner | `"=== INNER ===", 7` |  |
| bots/AutoSmurf.js:2967 | AutoSmurf.cathedral | `"=== CATHEDRAL ===", 7` |  |
| bots/AutoSmurf.js:3110 | AutoSmurf.andy | `"=== ANDY ===", 7` |  |
| bots/AutoSmurf.js:3212 | AutoSmurf.cube | `"=== CUBE ===", 7` |  |
| bots/AutoSmurf.js:3303 | AutoSmurf.amulet | `"=== AMULET ===", 7` |  |
| bots/AutoSmurf.js:3445 | AutoSmurf.summoner | `"=== SUMMONER ===", 7` |  |
| bots/AutoSmurf.js:3580 | AutoSmurf.tombs | `"=== TOMBS ===", 7` |  |
| bots/AutoSmurf.js:3802 | AutoSmurf.radament | `"!!! BOOK !!!", 8` |  |
| bots/AutoSmurf.js:3814 | AutoSmurf.radament | `"=== RADAMENT ===", 7` |  |
| bots/AutoSmurf.js:4025 | AutoSmurf.duriel | `"=== DURIEL ===", 7` |  |
| bots/AutoSmurf.js:4115 | AutoSmurf.figurine | `"!!! POTION !!!", 8` |  |
| bots/AutoSmurf.js:4131 | AutoSmurf.figurine | `"=== FIGURINE ===", 7` |  |
| bots/AutoSmurf.js:4449 | AutoSmurf.tome | `"=== TOME ===", 7` |  |
| bots/AutoSmurf.js:4708 | AutoSmurf.mephisto | `"=== MEPHISTO ===", 7` |  |
| bots/AutoSmurf.js:4808 | AutoSmurf.izual | `"=== IZUAL ===", 7` |  |
| bots/AutoSmurf.js:5257 | AutoSmurf.diablo | `"=== DIABLO ===", 7` |  |
| bots/AutoSmurf.js:5356 | AutoSmurf.shenk | `"=== SHENK ===", 7` |  |
| bots/AutoSmurf.js:5464 | AutoSmurf.barbs | `"=== BARBS ===", 7` |  |
| bots/AutoSmurf.js:5670 | AutoSmurf.anya | `"!!! SCROLL !!!", 8` |  |
| bots/AutoSmurf.js:5699 | AutoSmurf.anya | `"=== ANYA ===", 7` |  |
| bots/AutoSmurf.js:5799 | AutoSmurf.ancients | `"=== ANCIENTS ===", 7` |  |
| bots/AutoSmurf.js:5943 | AutoSmurf.baal | `"=== FARMING ===", 7` |  |
| bots/AutoSmurf.js:5947 | AutoSmurf.baal | `"=== LEVELING ===", 7` |  |
| bots/AutoSmurf.js:6189 | AutoSmurf.baal | `"=== BAAL ===", 7` |  |
| bots/AutoSmurf.js:6958 | AutoSmurf.farmingCows | `"=== COWS ===", 7` |  |
| bots/AutoSmurf.js:7783 | AutoSmurf | `"Radament off: tombs, quit at 10 min (" + Misc.where() + ")"` | 261021 |
| default.dbj:57 | main | `"Init failed in default.dbj. Stopping", 9` | 261026 |
| default.dbj:69 | main | `"You died in last game", 9` |  |
| libs/Attack.js:76 | Attack.clear | `"AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping", 9` |  |
| libs/Cubing.js:1080 | Cubing.doCubing | `string, 5` | 261023 |
| libs/Merc.js:498 | Merc.hire | `"[Hired] Level " + target.level + " " + skill, 5` | 260911 |
| libs/Misc.js:2348 | Misc.quitGame | `reason + " (" + this.where() + ")"` | 261002 |
| libs/Misc.js:2366 | Misc.caughtError | `place + ": " + msg + " (" + this.where() + ")", 10` |  |
| libs/Misc.js:2419 | Misc.errorReport | `oogmsg, 10` |  |
| libs/Misc.js:2679 | Experience.log | `string, 4` |  |
| libs/Misc.js:2685 | Experience.log | `"no exp" + getGameTime, 4` |  |
| libs/Runewords.js:426 | Runewords.makeRunewords | `"[Runeword] " + logString, 5` | 261023 |
| libs/Runewords.js:482 | Runewords.rerollRunewords | `"[Reset] " + logString, 5` | 261023 |
| libs/Town.js:190 | Town.socketGems | `"[Socket] " + name + " " + base + " (" + (filled + 1) + "/" + t.item.getStat(194) + ")", 5` | 261023 |
| libs/Town.js:1651 | Town.getCorpse | `"Failed to get corpse, stopping.", 9` |  |
| libs/Town.js:2262 | Town.moveToSpot | `"alkor error", 9` |  |
| threads/MapThread.js:841 | main.keyEvent | `me.x+","+me.y` |  |
| threads/MapThread.js:847 | main.keyEvent | `Math.round(getDistance(me.x, me.y, player.x, player.y))` |  |
| threads/ToolsThread.js:72 | main.checkPing | `"High ping " + me.ping + "/" + Config.PingQuit[i].Ping + " (" + Misc.where() + ")", 9` | 260930 |
| threads/ToolsThread.js:416 | main.runMeter | `line` |  |
| threads/ToolsThread.js:501 | main.keyEvent | `me.x + "," + me.y` |  |
| threads/ToolsThread.js:596 | main | `"Life Chicken " + me.hp + "/" + me.hpmax + " (" + Misc.where() + ")", 9` | 260930 |
| threads/ToolsThread.js:619 | main | `"Mana Chicken " + me.mp + "/" + me.mpmax + " (" + Misc.where() + ")", 9` | 260930 |
| threads/ToolsThread.js:639 | main | `"Iron Golem Chicken (" + Misc.where() + ")", 9` | 260930 |
| threads/ToolsThread.js:665 | main | `"Merc Chicken (" + Misc.where() + ")", 9` | 260930 |
| threads/TownChicken.js:65 | main | `"cannot open TP"` |  |
| tools/OOG.js:1282 | OOGLog.print | `text + " (loc " + getLocation() + ")", 10` |  |

## 1b. 콘솔(게임 밖 OOGLog) — `OOGLog.print / stop` 45곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| D2BotFollow.dbj:114 | badKey | `text + " - switch key"` |  |
| D2BotFollow.dbj:118 | badKey | `text` |  |
| D2BotFollow.dbj:209 | main | `"Crash: " + JSON.parse(gameInfo.crashInfo).currScript + " " + JSON.parse(gameInfo.crashInfo).area + " - wait " + StarterConfig.CrashDelay + "s"` | 261001 |
| D2BotFollow.dbj:252 | joinCheck | `"Game finished: " + joinInfo.gameName + " - stop wait"` | 261001 |
| D2BotFollow.dbj:396 | locationAction | `"Join game failed: " + joinInfo.gameName + " - wait " + StarterConfig.JoinRetryDelay + "s"` | 261001 |
| D2BotFollow.dbj:502 | locationAction | `"Login failed: " + Profile(me.profile).character, e` |  |
| D2BotFollow.dbj:526 | locationAction | `"Invalid password: " + Profile(me.profile).username` | 261001 |
| D2BotFollow.dbj:531 | locationAction | `"Invalid account: " + Profile(me.profile).username + " - create"` | 261001 |
| D2BotFollow.dbj:561 | locationAction | `"Disconnected - retry"` | 261001 |
| D2BotFollow.dbj:567 | locationAction | `"Login error: " + string + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.RetryKeyDelay + "s, restart")` | 261001 |
| D2BotFollow.dbj:613 | locationAction | `"Realm down - wait " + StarterConfig.RealmDownDelay + "m, " + (gameInfo.switchKeys && !gameInfo.rdBlocker ? "switch key" : "restart")` | 261001 |
| D2BotFollow.dbj:643 | locationAction | `"CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.CDKeyInUseDelay + "m")` | 261001 |
| D2BotFollow.dbj:679 | locationAction | `"LoD CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.CDKeyInUseDelay + "m")` | 261001 |
| D2BotFollow.dbj:764 | locationAction | `"Game not found"` | 261001 |
| D2BotFollow.dbj:765 | locationAction | `"CDKey flagged: " + gameInfo.mpq + (gameInfo.switchKeys ? " - switch key" : "")` | 261001 |
| D2BotFollow.dbj:772 | locationAction | `"Game not found - wait " + StarterConfig.GameDoesNotExistTimeout + "s"` | 261001 |
| D2BotFollow.dbj:780 | locationAction | `"Game full: " + joinInfo.gameName + " - skip"` | 261001 |
| D2BotFollow.dbj:789 | locationAction | `"Unhandled location - restart"` | 261001 |
| D2BotLead.dbj:201 | badKey | `text + " - switch key"` |  |
| D2BotLead.dbj:205 | badKey | `text` |  |
| D2BotLead.dbj:231 | teamWait | `"Team wait: " + missing.join(", ") + " - wait"` |  |
| D2BotLead.dbj:324 | restCheck | `"Rest: " + info.count + " games - wait " + Math.ceil(remain / 60000) + "m"` | 261001 |
| D2BotLead.dbj:400 | main | `"Crash: " + JSON.parse(gameInfo.crashInfo).currScript + " " + JSON.parse(gameInfo.crashInfo).area + " - wait " + StarterConfig.CrashDelay + "s"` | 261001 |
| D2BotLead.dbj:687 | locationAction | `"Create game failed - wait " + StarterConfig.FTJDelay + "s"` | 261001 |
| D2BotLead.dbj:752 | locationAction | `"Login failed: " + Profile(me.profile).character, e` |  |
| D2BotLead.dbj:776 | locationAction | `"Invalid password: " + Profile(me.profile).username` | 261001 |
| D2BotLead.dbj:781 | locationAction | `"Invalid account: " + Profile(me.profile).username + " - create"` | 261001 |
| D2BotLead.dbj:811 | locationAction | `"Disconnected - retry"` | 261001 |
| D2BotLead.dbj:817 | locationAction | `"Login error: " + string + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.RetryKeyDelay + "s, restart")` | 261001 |
| D2BotLead.dbj:863 | locationAction | `"Realm down - wait " + StarterConfig.RealmDownDelay + "m, " + (gameInfo.switchKeys && !gameInfo.rdBlocker ? "switch key" : "restart")` | 261001 |
| D2BotLead.dbj:893 | locationAction | `"CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.CDKeyInUseDelay + "m")` | 261001 |
| D2BotLead.dbj:929 | locationAction | `"LoD CDKey in use: " + gameInfo.mpq + " by " + ControlAction.readText(4, 158, 310, 485, 40) + " - " + (gameInfo.switchKeys ? "switch key" : "wait " + StarterConfig.CDKeyInUseDelay + "m")` | 261001 |
| D2BotLead.dbj:1019 | locationAction | `"Game not found"` | 261001 |
| D2BotLead.dbj:1020 | locationAction | `"CDKey flagged: " + gameInfo.mpq + (gameInfo.switchKeys ? " - switch key" : "")` | 261001 |
| D2BotLead.dbj:1027 | locationAction | `"Game not found - wait " + StarterConfig.GameDoesNotExistTimeout + "s"` | 261001 |
| D2BotLead.dbj:1039 | locationAction | `"Unhandled location - restart"` | 261001 |
| tools/AutoCreate.js:43 | AutoCreate.account | `"No account info"` | 261001 |
| tools/AutoCreate.js:79 | AutoCreate.character | `"Character slots full: " + Profile(me.profile).character` |  |
| tools/AutoCreate.js:88 | AutoCreate.character | `"No character info"` | 261001 |
| tools/AutoCreate.js:92 | AutoCreate.character | `"Character name taken: " + info.charName + " \"" + ControlAction.charNameTaken + "\""` |  |
| tools/AutoCreate.js:95 | AutoCreate.character | `"Create character: " + info.charName + " " + info.charClass` | 261001 |
| tools/OOG.js:857 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"" + this.readText(4, 199, 377, 402, 140) + "\""` | 261001 |
| tools/OOG.js:870 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"" + this.readText(4, 268, 320, 264, 120) + "\""` | 261001 |
| tools/OOG.js:905 | ControlAction.makeAccount | `"Create account failed: " + info.account + " \"(timeout)\""` | 261001 |
| tools/OOG.js:1237 | ControlAction.makeCharacter | `"Create character timeout: " + info.charName + " - retry"` |  |

## 2. print — `print` 199곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| D2BotFollow.dbj:139 | ReceiveCopyData | `"Recieved Game Info"` |  |
| D2BotFollow.dbj:423 | locationAction | `"joining game " + joinInfo.gameName` |  |
| D2BotFollow.dbj:505 | locationAction | `e + " " + getLocation()` |  |
| D2BotLead.dbj:120 | ReceiveCopyData | `"Recieved Game Info"` |  |
| D2BotLead.dbj:622 | locationAction | `"\c1Unable to join channel, disabling chat messages."` |  |
| D2BotLead.dbj:755 | locationAction | `e + " " + getLocation()` |  |
| bots/AutoSmurf.js:87 | AutoSmurf.checkRole | `"SafeTele: " + Config.SafeTele.Enabled` |  |
| bots/AutoSmurf.js:158 | AutoSmurf.start | `"hireMerc: " + hireMerc` |  |
| bots/AutoSmurf.js:208 | AutoSmurf.preparation | `"MiniShopBot: " + Config.MiniShopBot` |  |
| bots/AutoSmurf.js:214 | AutoSmurf.preparation | `"farmingON"` |  |
| bots/AutoSmurf.js:218 | AutoSmurf.preparation | `"Tiered: " + Config.Tiered` |  |
| bots/AutoSmurf.js:225 | AutoSmurf.preparation | `"UseMerc: " + Config.UseMerc + " HP: " + Config.UseMercHP` |  |
| bots/AutoSmurf.js:267 | AutoSmurf.toggle | `"Token needed"` |  |
| bots/AutoSmurf.js:293 | AutoSmurf.toggle | `keyMsg` | 260831 |
| bots/AutoSmurf.js:602 | AutoSmurf.syncBO | `"syncBO failed: invalid act"` |  |
| bots/AutoSmurf.js:607 | AutoSmurf.syncBO | `"syncBO failed: no Boer in my team"` |  |
| bots/AutoSmurf.js:612 | AutoSmurf.syncBO | `"syncBO failed: lower level"` |  |
| bots/AutoSmurf.js:719 | AutoSmurf.syncBO | `msg` |  |
| bots/AutoSmurf.js:769 | AutoSmurf.syncWP | `msg` |  |
| bots/AutoSmurf.js:1197 | AutoSmurf.travel | `"Traveling to " + Pather.getAreaName(destination)` | 260922 |
| bots/AutoSmurf.js:1756 | AutoSmurf.cubeFlail | `"cubeFlail failed: missing ingredient(s)"` |  |
| bots/AutoSmurf.js:1802 | AutoSmurf.equipFlail | `"No room to keep weapon by force"` |  |
| bots/AutoSmurf.js:1924 | AutoSmurf.den | `"\c4=== [DEN] ==="` | 260930 |
| bots/AutoSmurf.js:2071 | AutoSmurf.blood | `"\c4=== [BLOOD] ==="` | 260930 |
| bots/AutoSmurf.js:2156 | AutoSmurf.cain | `"\c4=== [CAIN] ==="` | 260930 |
| bots/AutoSmurf.js:2432 | AutoSmurf.trist | `"\c4=== [TRIST] ==="` | 260930 |
| bots/AutoSmurf.js:2502 | AutoSmurf.outer | `"\c4=== [OUTER] ==="` | 260930 |
| bots/AutoSmurf.js:2573 | AutoSmurf.smith | `"\c4=== [SMITH] ==="` | 260930 |
| bots/AutoSmurf.js:2599 | AutoSmurf.smith | `"Smith failed: moveTo"` |  |
| bots/AutoSmurf.js:2609 | AutoSmurf.smith | `"Smith failed: getUnit"` |  |
| bots/AutoSmurf.js:2613 | AutoSmurf.smith | `"Smith failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:2678 | AutoSmurf.malus | `"\c4=== [MALUS] ==="` | 260930 |
| bots/AutoSmurf.js:2710 | AutoSmurf.malus | `"Malus failed"` |  |
| bots/AutoSmurf.js:2727 | AutoSmurf.jail | `"\c4=== [JAIL] ==="` | 260930 |
| bots/AutoSmurf.js:2779 | AutoSmurf.inner | `"\c4=== [INNER] ==="` | 260930 |
| bots/AutoSmurf.js:2917 | AutoSmurf.cathedral | `"\c4=== [CATHEDRAL] ==="` | 260930 |
| bots/AutoSmurf.js:2976 | AutoSmurf.andy | `"\c4=== [ANDY] ==="` | 260930 |
| bots/AutoSmurf.js:3123 | AutoSmurf.cube | `"\c4=== [CUBE] ==="` | 260930 |
| bots/AutoSmurf.js:3223 | AutoSmurf.amulet | `"\c4=== [AMULET] ==="` | 260930 |
| bots/AutoSmurf.js:3316 | AutoSmurf.summoner | `"\c4=== [SUMMONER] ==="` | 260930 |
| bots/AutoSmurf.js:3456 | AutoSmurf.tombs | `"\c4=== [TOMBS] ==="` | 260930 |
| bots/AutoSmurf.js:3541 | AutoSmurf.tombs | `"Tombs: chest not found"` |  |
| bots/AutoSmurf.js:3554 | AutoSmurf.tombs | `"Tombs: incorrect chest cord"` |  |
| bots/AutoSmurf.js:3584 | AutoSmurf.tombs | `"Not ready to start Duriel"` |  |
| bots/AutoSmurf.js:3607 | AutoSmurf.staff | `"\c4=== [STAFF] ==="` | 260930 |
| bots/AutoSmurf.js:3641 | AutoSmurf.radament | `"\c4=== [RADAMENT] ==="` | 260930 |
| bots/AutoSmurf.js:3801 | AutoSmurf.radament | `"\c8!!! [BOOK] !!!"` | 261002 |
| bots/AutoSmurf.js:3825 | AutoSmurf.duriel | `"\c4=== [DURIEL] ==="` | 260930 |
| bots/AutoSmurf.js:4050 | AutoSmurf.figurine | `"\c4=== [FIGURINE] ==="` | 260930 |
| bots/AutoSmurf.js:4114 | AutoSmurf.figurine | `"\c8!!! [POTION] !!!"` | 261002 |
| bots/AutoSmurf.js:4140 | AutoSmurf.heart | `"\c4=== [HEART] ==="` | 260930 |
| bots/AutoSmurf.js:4174 | AutoSmurf.brain | `"\c4=== [BRAIN] ==="` | 260930 |
| bots/AutoSmurf.js:4208 | AutoSmurf.eye | `"\c4=== [EYE] ==="` | 260930 |
| bots/AutoSmurf.js:4307 | AutoSmurf.tome | `"\c4=== [TOME] ==="` | 260930 |
| bots/AutoSmurf.js:4459 | AutoSmurf.travincal | `"\c4=== [TRAVINCAL] ==="` | 260930 |
| bots/AutoSmurf.js:4500 | AutoSmurf.travincal | `"Travincal failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:4518 | AutoSmurf.travincal | `"Travincal failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:4602 | AutoSmurf.mephisto | `"\c4=== [MEPHISTO] ==="` | 260930 |
| bots/AutoSmurf.js:4719 | AutoSmurf.izual | `"\c4=== [IZUAL] ==="` | 260930 |
| bots/AutoSmurf.js:5140 | AutoSmurf.diablo | `"\c4=== [DIABLO] ==="` | 260930 |
| bots/AutoSmurf.js:5287 | AutoSmurf.shenk | `"\c4=== [SHENK] ==="` | 260930 |
| bots/AutoSmurf.js:5369 | AutoSmurf.barbs | `"\c4=== [BARBS] ==="` | 260930 |
| bots/AutoSmurf.js:5475 | AutoSmurf.anya | `"\c4=== [ANYA] ==="` | 260930 |
| bots/AutoSmurf.js:5669 | AutoSmurf.anya | `"\c8!!! [SCROLL] !!!"` | 261002 |
| bots/AutoSmurf.js:5709 | AutoSmurf.ancients | `"\c4=== [ANCIENTS] ==="` | 260930 |
| bots/AutoSmurf.js:5939 | AutoSmurf.baal | `"\c4=== [BAAL] ==="` | 260930 |
| bots/AutoSmurf.js:5970 | AutoSmurf.baal | `"Baal failed: souls found"` |  |
| bots/AutoSmurf.js:5982 | AutoSmurf.baal | `"Baal failed: souls found"` |  |
| bots/AutoSmurf.js:5994 | AutoSmurf.baal | `"Baal failed: souls found"` |  |
| bots/AutoSmurf.js:6020 | AutoSmurf.baal | `"Baal failed: souls found"` |  |
| bots/AutoSmurf.js:6134 | AutoSmurf.baal | `"Hiring needed"` |  |
| bots/AutoSmurf.js:6136 | AutoSmurf.baal | `"Not ready to kill Baal"` |  |
| bots/AutoSmurf.js:6224 | AutoSmurf.farmingCountess | `"\c4=== [COUNTESS] ==="` | 260930 |
| bots/AutoSmurf.js:6300 | AutoSmurf.farmingPit | `"\c4=== [PIT] ==="` | 260930 |
| bots/AutoSmurf.js:6361 | AutoSmurf.farmingAndy | `"\c4=== [ANDY] ==="` | 260930 |
| bots/AutoSmurf.js:6626 | AutoSmurf.farmingCows | `"\c4=== [COWS] ==="` | 260930 |
| bots/AutoSmurf.js:6633 | AutoSmurf.farmingCows | `"Cows failed: King killed"` |  |
| bots/AutoSmurf.js:6640 | AutoSmurf.farmingCows | `"Cows failed: Cain incomplete"` |  |
| bots/AutoSmurf.js:6647 | AutoSmurf.farmingCows | `"Cows failed: Baal incomplete"` |  |
| bots/AutoSmurf.js:6655 | AutoSmurf.farmingCows | `"Cows failed: quest unmatched"` |  |
| bots/AutoSmurf.js:6697 | AutoSmurf.farmingCows | `"Cows failed: enter Tristram"` |  |
| bots/AutoSmurf.js:6732 | AutoSmurf.farmingCows | `"Cows failed: get leg"` |  |
| bots/AutoSmurf.js:6762 | AutoSmurf.farmingCows | `"Cows failed: init akara"` |  |
| bots/AutoSmurf.js:6785 | AutoSmurf.farmingCows | `"Cows failed: get tome"` |  |
| bots/AutoSmurf.js:6797 | AutoSmurf.farmingCows | `"Cows failed: empty cube"` |  |
| bots/AutoSmurf.js:6804 | AutoSmurf.farmingCows | `"Cows failed: transmute leg and tome"` |  |
| bots/AutoSmurf.js:6824 | AutoSmurf.farmingCows | `"Cows failed: open portal"` |  |
| bots/AutoSmurf.js:6839 | AutoSmurf.farmingCows | `"Cows failed: open portal"` |  |
| bots/AutoSmurf.js:6899 | AutoSmurf.farmingCows | `"Cows failed: clearCowLevel"` |  |
| bots/AutoSmurf.js:6918 | AutoSmurf.farmingCows | `"Cows failed: followDriver"` |  |
| bots/AutoSmurf.js:6973 | AutoSmurf.farmingSummoner | `"\c4=== [SUMMONER] ==="` | 260930 |
| bots/AutoSmurf.js:6996 | AutoSmurf.farmingSummoner | `"Summoner failed: Invalid Path"` |  |
| bots/AutoSmurf.js:7022 | AutoSmurf.farmingSummoner | `"Summoner failed: Invalid Path"` |  |
| bots/AutoSmurf.js:7088 | AutoSmurf.farmingMephisto | `"\c4=== [MEPHISTO] ==="` | 260930 |
| bots/AutoSmurf.js:7154 | AutoSmurf.farmingAbaddon | `"\c4=== [ABADDON] ==="` | 260930 |
| bots/AutoSmurf.js:7195 | AutoSmurf.farmingAbaddon | `"Abaddon failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:7203 | AutoSmurf.farmingAbaddon | `"Abaddon failed: moveTo"` |  |
| bots/AutoSmurf.js:7237 | AutoSmurf.farmingPOA | `"\c4=== [POA] ==="` | 260930 |
| bots/AutoSmurf.js:7278 | AutoSmurf.farmingPOA | `"POA failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:7286 | AutoSmurf.farmingPOA | `"POA failed: moveTo"` |  |
| bots/AutoSmurf.js:7320 | AutoSmurf.farmingInfernal | `"\c4=== [INFERNAL] ==="` | 260930 |
| bots/AutoSmurf.js:7361 | AutoSmurf.farmingInfernal | `"Infernal failed: getPresetUnit"` |  |
| bots/AutoSmurf.js:7369 | AutoSmurf.farmingInfernal | `"Infernal failed: moveTo"` |  |
| bots/AutoSmurf.js:7402 | AutoSmurf.farmingNihlathak | `"\c4=== [NIHLATHAK] ==="` | 260930 |
| bots/AutoSmurf.js:7422 | AutoSmurf.farmingNihlathak | `"Nihlathak failed: Vipers found"` |  |
| bots/AutoSmurf.js:7443 | AutoSmurf.farmingNihlathak | `"Nihlathak failed: Vipers found"` |  |
| bots/AutoSmurf.js:7529 | AutoSmurf.onCopyData | `"hireMerc"` |  |
| bots/AutoSmurf.js:7542 | AutoSmurf.onCopyData | `"farmingON"` |  |
| bots/AutoSmurf.js:7993 | AutoSmurf | `"Helping straggler complete act3"` | 260923 |
| bots/AutoSmurf.js:8117 | AutoSmurf | `"Script ended"` |  |
| default.dbj:100 | main | `e1` |  |
| libs/Attack.js:24 | Attack.init | `"\c1Bad attack config. Don't expect your bot to attack."` |  |
| libs/Attack.js:935 | Attack.getCowKing | `"Cow King found"` |  |
| libs/Attack.js:973 | Attack.skipCheck | `"\c1Skip Exception: " + unit.name` |  |
| libs/Attacks/Necromancer.js:95 | ClassAttack.initCurses | `"Invalid curse id"` |  |
| libs/Attacks/Paladin.js:10 | ClassAttack.doAttack | `"mercwatch"` |  |
| libs/Attacks/Sorceress.js:10 | ClassAttack.doAttack | `"mercwatch"` |  |
| libs/AutoBuild.js:99 | AutoBuild.initialize | `"Loaded \c9[" + Build.getBuildType() + ".js]"` |  |
| libs/Config.js:56 | Config.init | `"\c8Error: Config cache not found for " + me.profile` |  |
| libs/Config.js:61 | Config.init | `"\c8Error in Config.init"` |  |
| libs/Config.js:62 | Config.init | `e3.toSource()` |  |
| libs/Cubing.js:1077 | Cubing.doCubing | `string` |  |
| libs/Loader.js:124 | Loader.loadScripts | `"Loaded \c9[" + script + ".js]"` | 260903 |
| libs/Loader.js:130 | Loader.loadScripts | `"\c2Copying Config properties from " + script + " object."` |  |
| libs/Loader.js:137 | Loader.loadScripts | `"\c2Reverting back unmodified config properties."` |  |
| libs/Merc.js:340 | Merc.checkSkill | `"Merc unmatched"` |  |
| libs/Merc.js:345 | Merc.checkSkill | `"Revive needed"` |  |
| libs/Merc.js:350 | Merc.checkSkill | `"Merc not found"` |  |
| libs/Merc.js:354 | Merc.checkSkill | `"Merc matched: " + stats.Merc` |  |
| libs/Merc.js:371 | Merc.hire | `"[hire] no skill specified"` |  |
| libs/Merc.js:378 | Merc.hire | `"[hire] invalid skill"` |  |
| libs/Merc.js:395 | Merc.hire | `"[hire] invalid difficulty"` |  |
| libs/Merc.js:429 | Merc.hire | `"[hire] openMenu failed"` |  |
| libs/Merc.js:454 | Merc.hire | `"[hire] removeItems failed"` |  |
| libs/Merc.js:465 | Merc.hire | `"[hire] openMenu failed"` |  |
| libs/Merc.js:470 | Merc.hire | `"[hire] no candidates: " + skill` |  |
| libs/Merc.js:499 | Merc.hire | `"[Hired] Level " + target.level + " " + skill` | 261004 |
| libs/Merc.js:515 | Merc.hire | `"[hire] hiring failed"` |  |
| libs/Misc.js:398 | Skill.setSkill | `'[\c9Warning\c0] charged skills must be cast from right hand'` |  |
| libs/Misc.js:494 | Equip.updateTier | `"equipped: [" + key + "] " + eq.tier` |  |
| libs/Misc.js:873 | Grant.updateTier | `"granted: [" + key + "] " + eq.tier` |  |
| libs/Misc.js:882 | Grant.updateStat | `"updateMercStat"` | 261007 |
| libs/Misc.js:2153 | Misc.townCheck | `"Town check (direct)"` |  |
| libs/Misc.js:2274 | Misc.spy | `"player not found"` |  |
| libs/Misc.js:2680 | Experience.log | `string` | 260610 |
| libs/Misc.js:2686 | Experience.log | `"no exp" + getGameTime` |  |
| libs/Pather.js:1712 | Pather.goWP | `"going to nearest WP"` |  |
| libs/Pickit.js:27 | Pickit.init | `"Loaded \c9[" + loaded.join("] [") + "]"` |  |
| libs/Precast.js:477 | enchant | `"enchant: " + unit.name` |  |
| libs/Precast.js:493 | enchant | `"enchant: " + unit.classid` |  |
| libs/Runewords.js:425 | Runewords.makeRunewords | `"\c4[Runeword] \c0" + logString` |  |
| libs/Runewords.js:481 | Runewords.rerollRunewords | `"\c4[Reset] \c0" + logString` |  |
| libs/Storage.js:396 | Container.Dump | `this.name + " has the width of " + this.width + " and the height of " + this.height` |  |
| libs/Storage.js:397 | Container.Dump | `this.name + " has " + this.itemList.length + " items inside, and has " + this.openPositions + " spots left."` |  |
| libs/Storage.js:406 | Container.Dump | `string` |  |
| libs/Town.js:1171 | Town.repair | `"interact closed"` |  |
| libs/Town.js:1191 | Town.repair | `"not enough quiver: " + (equipQuiver ? equipQuiver.getStat(70) : 0) + (invQuiver ? " + " + invQuiver.getStat(70) : "")` |  |
| libs/Town.js:1196 | Town.repair | `"equipQuiver moved"` |  |
| libs/Town.js:1201 | Town.repair | `"equipQuiver dropped"` |  |
| libs/Town.js:1206 | Town.repair | `"invQuiver dropped"` |  |
| libs/Town.js:1222 | Town.repair | `"equipQuiver sold"` |  |
| libs/Town.js:1229 | Town.repair | `"equipQuiver"` |  |
| libs/Town.js:1234 | Town.repair | `"invQuiver sold"` |  |
| libs/Town.js:1241 | Town.repair | `"invQuiver"` |  |
| libs/Town.js:1248 | Town.repair | `(equipQuiver ? "equipQuiver " + equipQuiver.getStat(70) : "no quiver") + (invQuiver ? " / invQuiver " + invQuiver.getStat(70) : "")` |  |
| threads/AutoBuildThread.js:323 | main | `"Something broke!"` |  |
| threads/AutoBuildThread.js:324 | main | `"Error:"+ err.toSource()` |  |
| threads/AutoBuildThread.js:325 | main | `"Stack trace: \n"+ err.stack` |  |
| threads/HeartBeat.js:12 | main | `"Heartbeat loaded"` |  |
| threads/HeartBeat.js:21 | main.togglePause | `"\c1Pausing \c0" + script.name` |  |
| threads/HeartBeat.js:24 | main.togglePause | `"\c2Resuming \c0" + script.name` |  |
| threads/MapHelper.js:33 | main | `"pause mapthread"` |  |
| threads/MapHelper.js:38 | main | `"resume mapthread"` |  |
| threads/MapThread.js:803 | main | `"\c9Map Thread Loaded."` |  |
| threads/MapThread.js:840 | main.keyEvent | `me.x+","+me.y` |  |
| threads/MapThread.js:846 | main.keyEvent | `Math.round(getDistance(me.x, me.y, player.x, player.y))` |  |
| threads/PartyThread.js:124 | partyInGame | `"party has left: " + (lost.length ? lost.join(", ") : names.join(", "))` |  |
| threads/Reload.js:41 | main | `"\c2D2BS\c0 :: Stopping scripts"` |  |
| threads/Reload.js:45 | main | `"\c2D2BS\c0 :: Reloading default.dbj"` |  |
| threads/Reload.js:52 | main | `"Script ended, cleaning up"` |  |
| threads/ToolsThread.js:346 | main.startMeter | `"[MM] armed at " + me.x + "," + me.y + " me.gid:" + me.gid` |  |
| threads/ToolsThread.js:387 | main.runMeter | `"[MM] no missile seen"` |  |
| threads/ToolsThread.js:415 | main.runMeter | `line` |  |
| threads/ToolsThread.js:474 | main.keyEvent | `s.name` |  |
| threads/ToolsThread.js:487 | main.keyEvent | `"\c4MF: \c0" + me.getStat(80) + " \c4GF: \c0" + me.getStat(79) + " \c1FR: \c0" + me.getStat(39) + " \c3CR: \c0" + me.getStat(43) + " \c9LR: \c0" + me.getStat(41) + " \c2PR: \c0" + me.getStat(45) + "\n" + "FCR: " + rea...` |  |
| threads/ToolsThread.js:500 | main.keyEvent | `me.x + "," + me.y` |  |
| threads/ToolsThread.js:598 | main | `"[Chicken] Life (" + me.hp + "/" + me.hpmax + ") area:" + me.area + " (" + me.x + "," + me.y + ")"` |  |
| threads/ToolsThread.js:718 | main | `"[MM] " + e2` |  |
| threads/TownChicken.js:62 | main | `"Can't tp from uber trist."` |  |
| threads/TownChicken.js:64 | main | `"cannot open TP"` |  |
| threads/TownChicken.js:94 | main | `"Town check"` | 261007 |
| threads/TownChicken.js:98 | main | `"Town chicken"` | 261007 |
| tools/NTItemParser.dbl:114 | NTIP.CheckQuantityOwned | `"I can't find my items!"` |  |
| tools/OOG.js:38 | D2Bot.printToConsole | `"[console] " + msg` | 261021 |
| tools/OOG.js:423 | DataFile.getObj | `"Error reading DataFile. Using null values."` |  |
| tools/OOG.js:526 | ControlAction.click | `"control not found " + type + " " + x + " " + y + " location " + getLocation()` |  |
| tools/OOG.js:686 | ControlAction.createGame | `"Creating Game: " + name` |  |
| tools/OOG.js:813 | ControlAction.loginAccount | `getLocation()` |  |
| tools/OOG.js:900 | ControlAction.makeAccount | `"makeAccount: location " + getLocation()` |  |

## 3. trace — `Misc.trace` 136곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| bots/AutoSmurf.js:101 | AutoSmurf.start | `"dropping radament book"` |  |
| bots/AutoSmurf.js:819 | AutoSmurf.pickGold | `"Picking up " + amount + " Gold"` |  |
| bots/AutoSmurf.js:858 | AutoSmurf.giveGold | `"Dropping " + Math.round(dropGold) + " Gold"` |  |
| bots/AutoSmurf.js:880 | AutoSmurf.giveGold | `"Retaking " + amount + " Gold"` |  |
| bots/AutoSmurf.js:914 | AutoSmurf.bossGuard | `"bossGuard on: " + pct + "%"` | 261020 |
| bots/AutoSmurf.js:917 | AutoSmurf.bossGuard | `"bossGuard chicken off: pct 0 (now)"` | 261004 |
| bots/AutoSmurf.js:932 | AutoSmurf.bossGuard.Attack.bossScan | `"bossGuard found: " + unit.name + " " + hp + "%"` |  |
| bots/AutoSmurf.js:961 | AutoSmurf.bossGuard.Attack.bossScan | `"bossGuard chicken off: " + unit.name + " " + hp + "%@" + ((getTickCount() - guardStart) / 1000).toFixed(1) + "s"` | 261020 |
| bots/AutoSmurf.js:980 | AutoSmurf.traceGuardSeen | `"bossGuard last: " + last.name + " " + last.hp1 + "%@" + (last.t1 / 1000).toFixed(1) + "s"` |  |
| bots/AutoSmurf.js:1006 | AutoSmurf.bossEnd | `"revive start"` | 261020 |
| bots/AutoSmurf.js:1025 | AutoSmurf.bossEnd | `"bossGuard chicken on: " + guardChicken + "%"` |  |
| bots/AutoSmurf.js:1074 | AutoSmurf.bossEnd | `"corpse picked"` | 261020 |
| bots/AutoSmurf.js:1077 | AutoSmurf.bossEnd | `"bossGuard chicken on: " + guardChicken + "%"` | 261020 |
| bots/AutoSmurf.js:1624 | AutoSmurf.getQuestItem | `classid + " vanished"` | 261021 |
| bots/AutoSmurf.js:1633 | AutoSmurf.getQuestItem | `"Trying to make room for " + item.name` | 261012 |
| bots/AutoSmurf.js:1638 | AutoSmurf.getQuestItem | `"Not enough room for " + item.name` | 261012 |
| bots/AutoSmurf.js:1644 | AutoSmurf.getQuestItem | `classid + " not found"` | 261012 |
| bots/AutoSmurf.js:1924 | AutoSmurf.den | `"=== [DEN] ===", true` | 260930 |
| bots/AutoSmurf.js:2071 | AutoSmurf.blood | `"=== [BLOOD] ===", true` | 260930 |
| bots/AutoSmurf.js:2156 | AutoSmurf.cain | `"=== [CAIN] ===", true` | 260930 |
| bots/AutoSmurf.js:2432 | AutoSmurf.trist | `"=== [TRIST] ===", true` | 260930 |
| bots/AutoSmurf.js:2502 | AutoSmurf.outer | `"=== [OUTER] ===", true` | 260930 |
| bots/AutoSmurf.js:2573 | AutoSmurf.smith | `"=== [SMITH] ===", true` | 260930 |
| bots/AutoSmurf.js:2678 | AutoSmurf.malus | `"=== [MALUS] ===", true` | 260930 |
| bots/AutoSmurf.js:2727 | AutoSmurf.jail | `"=== [JAIL] ===", true` | 260930 |
| bots/AutoSmurf.js:2779 | AutoSmurf.inner | `"=== [INNER] ===", true` | 260930 |
| bots/AutoSmurf.js:2917 | AutoSmurf.cathedral | `"=== [CATHEDRAL] ===", true` | 260930 |
| bots/AutoSmurf.js:2976 | AutoSmurf.andy | `"=== [ANDY] ===", true` | 260930 |
| bots/AutoSmurf.js:3123 | AutoSmurf.cube | `"=== [CUBE] ===", true` | 260930 |
| bots/AutoSmurf.js:3223 | AutoSmurf.amulet | `"=== [AMULET] ===", true` | 260930 |
| bots/AutoSmurf.js:3316 | AutoSmurf.summoner | `"=== [SUMMONER] ===", true` | 260930 |
| bots/AutoSmurf.js:3456 | AutoSmurf.tombs | `"=== [TOMBS] ===", true` | 260930 |
| bots/AutoSmurf.js:3607 | AutoSmurf.staff | `"=== [STAFF] ===", true` | 260930 |
| bots/AutoSmurf.js:3641 | AutoSmurf.radament | `"=== [RADAMENT] ===", true` | 260930 |
| bots/AutoSmurf.js:3666 | AutoSmurf.radament | `"radament atma: 9,0 " + me.getQuest(9, 0) + " 9,1 " + me.getQuest(9, 1) + " 9,5 " + me.getQuest(9, 5)` |  |
| bots/AutoSmurf.js:3675 | AutoSmurf.radament | `"radament gate: 9,0 " + me.getQuest(9, 0) + " 9,1 " + me.getQuest(9, 1) + " 9,5 " + me.getQuest(9, 5) + " book " + !!me.findItem(552)` | 261004 |
| bots/AutoSmurf.js:3801 | AutoSmurf.radament | `"!!! [BOOK] !!!"` | 261002 |
| bots/AutoSmurf.js:3825 | AutoSmurf.duriel | `"=== [DURIEL] ===", true` | 260930 |
| bots/AutoSmurf.js:4050 | AutoSmurf.figurine | `"=== [FIGURINE] ===", true` | 260930 |
| bots/AutoSmurf.js:4114 | AutoSmurf.figurine | `"!!! [POTION] !!!"` | 261002 |
| bots/AutoSmurf.js:4140 | AutoSmurf.heart | `"=== [HEART] ===", true` | 260930 |
| bots/AutoSmurf.js:4174 | AutoSmurf.brain | `"=== [BRAIN] ===", true` | 260930 |
| bots/AutoSmurf.js:4208 | AutoSmurf.eye | `"=== [EYE] ===", true` | 260930 |
| bots/AutoSmurf.js:4307 | AutoSmurf.tome | `"=== [TOME] ===", true` | 260930 |
| bots/AutoSmurf.js:4459 | AutoSmurf.travincal | `"=== [TRAVINCAL] ===", true` | 260930 |
| bots/AutoSmurf.js:4471 | AutoSmurf.travincal | `"[travincal] portalReset " + (me.getQuest(20, 0) ? "skip" : "run") + " q20:" + me.getQuest(20, 0)` | 261102 |
| bots/AutoSmurf.js:4602 | AutoSmurf.mephisto | `"=== [MEPHISTO] ===", true` | 260930 |
| bots/AutoSmurf.js:4719 | AutoSmurf.izual | `"=== [IZUAL] ===", true` | 260930 |
| bots/AutoSmurf.js:5140 | AutoSmurf.diablo | `"=== [DIABLO] ===", true` | 260930 |
| bots/AutoSmurf.js:5287 | AutoSmurf.shenk | `"=== [SHENK] ===", true` | 260930 |
| bots/AutoSmurf.js:5369 | AutoSmurf.barbs | `"=== [BARBS] ===", true` | 260930 |
| bots/AutoSmurf.js:5475 | AutoSmurf.anya | `"=== [ANYA] ===", true` | 260930 |
| bots/AutoSmurf.js:5669 | AutoSmurf.anya | `"!!! [SCROLL] !!!"` | 261002 |
| bots/AutoSmurf.js:5709 | AutoSmurf.ancients | `"=== [ANCIENTS] ===", true` | 260930 |
| bots/AutoSmurf.js:5939 | AutoSmurf.baal | `"=== [BAAL] ===", true` | 260930 |
| bots/AutoSmurf.js:6224 | AutoSmurf.farmingCountess | `"=== [COUNTESS] ===", true` | 260930 |
| bots/AutoSmurf.js:6300 | AutoSmurf.farmingPit | `"=== [PIT] ===", true` | 260930 |
| bots/AutoSmurf.js:6361 | AutoSmurf.farmingAndy | `"=== [ANDY] ===", true` | 260930 |
| bots/AutoSmurf.js:6626 | AutoSmurf.farmingCows | `"=== [COWS] ===", true` | 260930 |
| bots/AutoSmurf.js:6973 | AutoSmurf.farmingSummoner | `"=== [SUMMONER] ===", true` | 260930 |
| bots/AutoSmurf.js:7088 | AutoSmurf.farmingMephisto | `"=== [MEPHISTO] ===", true` | 260930 |
| bots/AutoSmurf.js:7154 | AutoSmurf.farmingAbaddon | `"=== [ABADDON] ===", true` | 260930 |
| bots/AutoSmurf.js:7237 | AutoSmurf.farmingPOA | `"=== [POA] ===", true` | 260930 |
| bots/AutoSmurf.js:7320 | AutoSmurf.farmingInfernal | `"=== [INFERNAL] ===", true` | 260930 |
| bots/AutoSmurf.js:7402 | AutoSmurf.farmingNihlathak | `"=== [NIHLATHAK] ===", true` | 260930 |
| bots/AutoSmurf.js:7782 | AutoSmurf | `"radamentOff -> tombs"` | 261021 |
| bots/AutoSmurf.js:8120 | AutoSmurf | `"Script ended"` |  |
| default.dbj:46 | main | `"=== [" + me.gamename + "] ===", true` | 261011 |
| default.dbj:58 | main | `"Init failed in default.dbj. Stopping", true` | 261026 |
| libs/Attack.js:77 | Attack.clear | `"AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping"` | 261001 |
| libs/Attack.js:472 | Attack.clear | `"boss not found: " + spec.ids.join(", ")` |  |
| libs/Merc.js:505 | Merc.hire | `"[hire] hiring retry (" + (retry) + "/5)"` | 260930 |
| libs/Misc.js:2154 | Misc.townCheck | `"Town check (direct)"` |  |
| libs/Misc.js:2350 | Misc.quitGame | `"[Quit] " + reason + (detail ? ": " + detail : "")` |  |
| libs/Misc.js:2362 | Misc.caughtError | `"[Error] " + place + ": " + msg + (e && e.fileName ? " (" + e.fileName.substring(e.fileName.lastIndexOf("\\") + 1) + " #" + e.lineNumber + ")" : "")` |  |
| libs/Misc.js:2422 | Misc.errorReport | `"[Error] " + oogmsg.trim(), true` | 260930 |
| libs/Misc.js:2710 | Packet.openMenu | `"[openMenu] retry i:" + i + " keys:" + talk.keys + " npc:" + unit.name` |  |
| libs/Misc.js:2769 | Packet.endTalk | `"[TK] talk skipped " + talk.keys + " npc:" + npc.name` |  |
| libs/Pather.js:311 | Pather.moveTo | `"no original path -> " + x + "," + y + " in " + Pather.getAreaName(me.area) + " adjusting..."` | 261030 |
| libs/Pather.js:322 | Pather.moveTo | `"adjusted path -> " + x + "," + y + " in " + Pather.getAreaName(me.area)` | 261030 |
| libs/Pather.js:329 | Pather.moveTo | `"no adjusted path -> " + me.x + "," + me.y + " in " + Pather.getAreaName(me.area) + " fixing..."` |  |
| libs/Pather.js:341 | Pather.moveTo | `"fixed path -> " + x + "," + y + " in " + Pather.getAreaName(me.area)` | 261030 |
| libs/Pather.js:430 | Pather.moveTo | `"[SafeTele] teleportTo FAILED - safeNode:(" + checkedNode.x + "," + checkedNode.y + ") dist:" + Math.floor(getDistance(me.x, me.y, checkedNode.x, checkedNode.y))` | 260930 |
| libs/Pather.js:515 | Pather.moveTo | `"[moveTo] retry " + retry + " over -> " + x + "," + y + " in " + Pather.getAreaName(me.area) + " dist:" + Math.round(getDistance(me, x, y))` | 261102 |
| libs/Pather.js:575 | Pather.teleportTo | `"[teleportTo failed] attempt:" + (i + 1) + " dist:" + Math.floor(getDistance(me.x, me.y, x, y)) + " ping:" + me.ping + " area:" + me.area` | 260930 |
| libs/Pather.js:1134 | Pather.useUnit | `"ArreatSummit Gate"` | 260930 |
| libs/Pather.js:1163 | Pather.useUnit | `"[useUnit] timeout iter:" + i + " dist:" + Math.floor(getDistance(me, unit)) + " ping:" + me.ping + " area:" + me.area + " id:" + id + " target:" + targetArea + " unit:" + unit.x + "," + unit.y` | 261021 |
| libs/Pather.js:1333 | Pather.useWaypoint | `"[WP] wp.area:" + (wp ? wp.area : "null") + " me.area:" + me.area + " target:" + targetArea + " retry:" + i` | 260930 |
| libs/Pather.js:1394 | Pather.makePortal | `"makePortal " + (i > 0 ? "late" : "existing") + " portal used try:" + i + " gid:" + portal.gid` | 261004 |
| libs/Pather.js:1399 | Pather.makePortal | `"makePortal cast again try:" + i` | 260930 |
| libs/Pather.js:1546 | Pather.usePortal | `"usePortal failed target:" + targetArea + " owner:" + owner + " unit:" + (unit ? unit.gid : "-") + " pre:" + preArea + " tick:" + startTick + "-" + getTickCount() + " tries:" + tries.join(" ") + " portals:" + (list.jo...` |  |
| libs/Pather.js:1717 | Pather.goWP | `"[goWP] Failed to reach WP after 10 attempts. area:" + me.area` | 260930 |
| libs/Pather.js:1762 | Pather.getWP | `"[getWP] waypoint unit not found. area:" + me.area` |  |
| libs/Pather.js:1779 | Pather.getWP | `"[getWP] waypoint menu not opened. try:" + i + " area:" + me.area` |  |
| libs/Pather.js:1797 | Pather.journeyTo | `target.course` | 260930 |
| libs/Pickit.js:722 | Pickit.canPick | `"undefined item (!?)"` | 260930 |
| libs/Prototypes.js:337 | Unit.prototype.drop | `"[DBG] drop"` | 260930 |
| libs/Storage.js:218 | Container.MoveTo | `"[Storage.MoveTo] retry item:" + item.name + " loc:" + this.location` | 260930 |
| libs/Storage.js:221 | Container.MoveTo | `"[Storage.MoveTo] catch: " + e.message + " item:" + (item ? item.name : "?") + " loc:" + this.location` | 260930 |
| libs/Storage.js:328 | Container.MoveToSlot | `"[MoveToSlot] no room, dropped blocker " + blocker.fname` | 260930 |
| libs/Storage.js:343 | Container.MoveToSlot | `"[MoveToSlot] skip " + item.fname + " gid:" + item.gid + " got:" + target.fname + " loc " + target.location + " mode " + target.mode + " at " + target.x + "," + target.y` | 261101 |
| libs/Storage.js:384 | Container.MoveToSlot | `"[MoveToSlot] " + item.fname + " FAILED slot:" + (occupant ? occupant.fname : "empty") + " dropped:" + dropped + " item:" + (target ? "loc " + target.location + " mode " + target.mode + " at " + target.x + "," + targe...` | 261020 |
| libs/Town.js:176 | Town.socketGems | `"socketGems failed: " + name + " -> [" + Config.Gear[t.bodyLoc] + "] " + t.item.name + (dropped ? " (dropped)" : "")` | 261023 |
| libs/Town.js:757 | Town.identify | `"identify stopped: no ID scroll for " + item.name + " (gold " + me.gold + ")"` | 261001 |
| libs/Town.js:765 | Town.identify | `"identify failed: " + item.name + " (" + (scroll.classid === 519 ? "tome" : "scroll") + ", " + (getTickCount() - timer) + "ms)"` |  |
| libs/Town.js:767 | Town.identify | `"identify slow: " + item.name + " (" + (scroll.classid === 519 ? "tome" : "scroll") + ", " + (getTickCount() - timer) + "ms)"` |  |
| libs/Town.js:1172 | Town.repair | `"interact closed"` |  |
| libs/Town.js:1192 | Town.repair | `"not enough quiver: " + (equipQuiver ? equipQuiver.getStat(70) : 0) + (invQuiver ? " + " + invQuiver.getStat(70) : "")` |  |
| libs/Town.js:1197 | Town.repair | `"equipQuiver moved"` |  |
| libs/Town.js:1202 | Town.repair | `"equipQuiver dropped"` |  |
| libs/Town.js:1207 | Town.repair | `"invQuiver dropped"` |  |
| libs/Town.js:1223 | Town.repair | `"equipQuiver sold"` |  |
| libs/Town.js:1230 | Town.repair | `"equipQuiver"` |  |
| libs/Town.js:1235 | Town.repair | `"invQuiver sold"` |  |
| libs/Town.js:1242 | Town.repair | `"invQuiver"` |  |
| libs/Town.js:1249 | Town.repair | `(equipQuiver ? "equipQuiver " + equipQuiver.getStat(70) : "no quiver") + (invQuiver ? " / invQuiver " + invQuiver.getStat(70) : "")` |  |
| libs/Town.js:1960 | Town.clearInventory | `"moved from cube to drop " + items[i].name` | 260930 |
| libs/Town.js:1968 | Town.clearInventory | `"moved from cube to sell " + items[i].name` | 260930 |
| libs/Town.js:2294 | Town.goToTown | `"goToTown take TP failed start tick:" + startTick + " made:" + made` | 261006 |
| libs/Town.js:2329 | Town.visitTown | `"visitTown refused: Arreat Summit"` |  |
| libs/Town.js:2338 | Town.visitTown | `"visitTown start by:" + getScript(true).name + " tick:" + getTickCount()` | 261004 |
| libs/Town.js:2362 | Town.visitTown | `"visitTown back tick:" + getTickCount()` | 261004 |
| threads/PartyThread.js:125 | partyInGame | `"party has left: " + (lost.length ? lost.join(", ") : names.join(", "))` | 261028 |
| threads/ToolsThread.js:73 | main.checkPing | `"[Quit] High ping " + me.ping + "/" + Config.PingQuit[i].Ping` | 260930 |
| threads/ToolsThread.js:249 | main.drinkPotion | `"Couldn't give the potion to merc."` | 260930 |
| threads/ToolsThread.js:597 | main | `"[Quit] Life Chicken " + me.hp + "/" + me.hpmax` | 261021 |
| threads/ToolsThread.js:620 | main | `"[Quit] Mana Chicken " + me.mp + "/" + me.mpmax` | 260930 |
| threads/ToolsThread.js:640 | main | `"[Quit] Iron Golem Chicken"` | 260930 |
| threads/ToolsThread.js:660 | main | `"[mercPot] gone:" + !getUnit(4, -1, 2, mercPotGid) + " state100:" + !!merc.getState(100) + " mercHP:" + mercHP` | 261101 |
| threads/ToolsThread.js:666 | main | `"[Quit] Merc Chicken"` | 260930 |
| threads/TownChicken.js:95 | main | `"Town check"` | 261007 |
| threads/TownChicken.js:99 | main | `"Town chicken"` | 261007 |
| tools/NTItemParser.dbl:738 | NTIP.ParseRule | `"NTIP: duplicate gear key [" + key + "]" + where` |  |
| tools/NTItemParser.dbl:811 | NTIP.ParseRule | `"NTIP: gear tier ignored on tier/merc line File: " + info.file + " Line: " + info.line` |  |
| tools/OOG.js:1220 | ControlAction.makeCharacter | `"Character name taken: " + info.charName + " \"" + this.charNameTaken + "\""` | 261001 |
| tools/OOG.js:1283 | OOGLog.print | `text + (detail ? " \| " + detail : "")` |  |

## 4. 머리 위 글자 — `me.overhead` 121곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| bots/AutoSmurf.js:84 | AutoSmurf.checkRole | `"I am the Leader"` |  |
| bots/AutoSmurf.js:90 | AutoSmurf.checkRole | `"I am the Boer"` |  |
| bots/AutoSmurf.js:92 | AutoSmurf.checkRole | `"I am a Follower"` |  |
| bots/AutoSmurf.js:457 | AutoSmurf.teamCount | `"OK"` |  |
| bots/AutoSmurf.js:481 | AutoSmurf.buffCount | `"Buying antidote potions"` |  |
| bots/AutoSmurf.js:505 | AutoSmurf.buffCount | `"Antidote potions ready"` |  |
| bots/AutoSmurf.js:524 | AutoSmurf.buffCount | `"Buying thawing potions"` |  |
| bots/AutoSmurf.js:548 | AutoSmurf.buffCount | `"Thawing potions ready"` |  |
| bots/AutoSmurf.js:581 | AutoSmurf.buffCount | `"tpReady"` |  |
| bots/AutoSmurf.js:720 | AutoSmurf.syncBO | `msg` |  |
| bots/AutoSmurf.js:770 | AutoSmurf.syncWP | `msg` |  |
| bots/AutoSmurf.js:818 | AutoSmurf.pickGold | `"Picking up " + amount + " Gold"` |  |
| bots/AutoSmurf.js:857 | AutoSmurf.giveGold | `"Dropping " + Math.round(dropGold) + " Gold"` |  |
| bots/AutoSmurf.js:879 | AutoSmurf.giveGold | `"Retaking " + amount + " Gold"` |  |
| bots/AutoSmurf.js:1198 | AutoSmurf.travel | `"Traveling to " + Pather.getAreaName(destination)` | 260922 |
| bots/AutoSmurf.js:1213 | AutoSmurf.travel | `"Travel course: " + target.course` |  |
| bots/AutoSmurf.js:1224 | AutoSmurf.travel | `"nextAreaIndex: " + nextAreaIndex` |  |
| bots/AutoSmurf.js:1227 | AutoSmurf.travel | `"Next location name: " + Pather.getAreaName(areaIDs[nextAreaIndex])` | 260922 |
| bots/AutoSmurf.js:1294 | AutoSmurf.travel | `"Attempting to use any portal"` |  |
| bots/AutoSmurf.js:1412 | AutoSmurf.changeAct | `"changeAct " + act` |  |
| bots/AutoSmurf.js:1557 | AutoSmurf.changeAct | `"Checking player in..."` |  |
| bots/AutoSmurf.js:1632 | AutoSmurf.getQuestItem | `"Trying to make room for " + item.name` |  |
| bots/AutoSmurf.js:1637 | AutoSmurf.getQuestItem | `"Not enough room for " + item.name` |  |
| bots/AutoSmurf.js:1679 | AutoSmurf.offEquip | `"offEquip"` |  |
| bots/AutoSmurf.js:1694 | AutoSmurf.cubeStaff | `"cubingStaff"` |  |
| bots/AutoSmurf.js:1718 | AutoSmurf.placeStaff | `"placeStaff"` |  |
| bots/AutoSmurf.js:1749 | AutoSmurf.cubeFlail | `"cubeFlail"` |  |
| bots/AutoSmurf.js:1797 | AutoSmurf.equipFlail | `"Keeping weapon by force"` |  |
| bots/AutoSmurf.js:1820 | AutoSmurf.placeFlail | `"Smashing the Compelling Orb"` |  |
| bots/AutoSmurf.js:1958 | AutoSmurf.den | `"Clearing retry " + i` |  |
| bots/AutoSmurf.js:2007 | AutoSmurf.den | `"Clearing retry " + i` |  |
| bots/AutoSmurf.js:2103 | AutoSmurf.blood | `"Getting waypoint..."` |  |
| bots/AutoSmurf.js:2167 | AutoSmurf.cain | `"Getting waypoint..."` |  |
| bots/AutoSmurf.js:2229 | AutoSmurf.cain | `"Getting scroll..."` |  |
| bots/AutoSmurf.js:2291 | AutoSmurf.cain | `"Getting redportal..."` |  |
| bots/AutoSmurf.js:2347 | AutoSmurf.cain | `"Rescue cain"` |  |
| bots/AutoSmurf.js:2656 | AutoSmurf.smith | `"tpReady"` |  |
| bots/AutoSmurf.js:3349 | AutoSmurf.summoner | `"tpReady"` |  |
| bots/AutoSmurf.js:3729 | AutoSmurf.radament | `"tpReady"` |  |
| bots/AutoSmurf.js:3882 | AutoSmurf.duriel | `"tpReady"` |  |
| bots/AutoSmurf.js:3888 | AutoSmurf.duriel | `"Waiting for Orifice TP..."` |  |
| bots/AutoSmurf.js:3964 | AutoSmurf.duriel | `"Waiting for Duriel TP..."` |  |
| bots/AutoSmurf.js:4250 | AutoSmurf.eye | `"tpReady"` |  |
| bots/AutoSmurf.js:4330 | AutoSmurf.tome | `"tpReady"` |  |
| bots/AutoSmurf.js:4746 | AutoSmurf.izual | `"tpReady"` |  |
| bots/AutoSmurf.js:4894 | AutoSmurf.diablo.seisSeal | `"Seis layout " + this.seisLayout` |  |
| bots/AutoSmurf.js:4940 | AutoSmurf.diablo.infectorSeal | `"Inf layout " + this.infLayout` |  |
| bots/AutoSmurf.js:4978 | AutoSmurf.diablo.vizierSeal | `"Viz layout " + this.vizLayout` |  |
| bots/AutoSmurf.js:5159 | AutoSmurf.diablo | `"tpReady"` |  |
| bots/AutoSmurf.js:5305 | AutoSmurf.shenk | `"tpReady"` |  |
| bots/AutoSmurf.js:5394 | AutoSmurf.barbs | `"Going to barbspot " + (k + 1) + "/" + barbSpots.length` |  |
| bots/AutoSmurf.js:5519 | AutoSmurf.anya | `"tpReady"` |  |
| bots/AutoSmurf.js:5722 | AutoSmurf.ancients | `"tpReady"` | 261028 |
| bots/AutoSmurf.js:6008 | AutoSmurf.baal | `"tpReady"` |  |
| bots/AutoSmurf.js:6501 | AutoSmurf.farmingCows.followDriver | `"followDriver start"` |  |
| bots/AutoSmurf.js:6518 | AutoSmurf.farmingCows.followDriver | `"driver: " + driver.x + "." + driver.y + " distance: " + Math.round(getDistance(me, driver))` |  |
| bots/AutoSmurf.js:6538 | AutoSmurf.farmingCows.followDriver | `"msgNode: " + msgNode[0] + "." + msgNode[1] + " distance: " + Math.round(getDistance(me, msgNode[0], msgNode[1]))` |  |
| bots/AutoSmurf.js:6570 | AutoSmurf.farmingCows.followDriver | `"followDriver end"` |  |
| bots/AutoSmurf.js:6829 | AutoSmurf.farmingCows | `"tpReady"` |  |
| bots/AutoSmurf.js:7009 | AutoSmurf.farmingSummoner | `"tpReady"` |  |
| bots/AutoSmurf.js:7434 | AutoSmurf.farmingNihlathak | `"tpReady"` |  |
| bots/AutoSmurf.js:7605 | AutoSmurf.onCopyData | `"tpReady"` |  |
| bots/AutoSmurf.js:7660 | AutoSmurf.onCopyData | `"msgLeader"` | 261025 |
| bots/AutoSmurf.js:7994 | AutoSmurf | `"Helping straggler complete act3"` | 260923 |
| default.dbj:96 | main | `"Stalling for " + Math.round(((startTime + (Config.MinGameTime * 1000)) - getTickCount()) / 1000) + " Seconds"` |  |
| libs/Attacks/Necromancer.js:378 | ClassAttack.raiseArmy | `"[ARMY] REVIVE " + corpse.name + " " + me.getMinionCount(6) + " / " + maxRevives` |  |
| libs/Attacks/Necromancer.js:402 | ClassAttack.raiseArmy | `"[ARMY] SKELETON " + me.getMinionCount(4) + " / " + maxSkeletons` |  |
| libs/Attacks/Necromancer.js:425 | ClassAttack.raiseArmy | `"[ARMY] MAGE " + me.getMinionCount(5) + " / " + maxMages` |  |
| libs/Attacks/Necromancer.js:477 | ClassAttack.explodeCorpses | `"Exploding: " + corpse.classid + " " + corpse.name + " id:" + corpse.gid` |  |
| libs/Attacks/Necromancer.js:496 | ClassAttack.explodeCorpses | `"Exploding Cow: " + corpse.classid + " " + corpse.name` |  |
| libs/Attacks/Necromancer.js:514 | ClassAttack.explodeCorpses | `"Exploding Max: " + corpse.classid + " " + corpse.name` |  |
| libs/Attacks/Necromancer.js:532 | ClassAttack.explodeCorpses | `"Exploding: " + corpse.classid + " " + corpse.name` |  |
| libs/Cubing.js:1076 | Cubing.doCubing | `string` |  |
| libs/Misc.js:819 | Equip.autoEquip | `"[Tier " + tier + "] " + items[0].name` |  |
| libs/Misc.js:1107 | Grant.autoEquip | `"[Granted " + tier + "] " + grant.name` | 260920 |
| libs/Misc.js:2118 | Misc.townCheck | `"We need healing potions"` |  |
| libs/Misc.js:2138 | Misc.townCheck | `"We need mana potions"` |  |
| libs/Misc.js:2152 | Misc.townCheck | `"Town check (direct)"` |  |
| libs/Pather.js:510 | Pather.moveTo | `"move retry " + fail` |  |
| libs/Pather.js:727 | Pather.openDoors | `"Opened a door!"` |  |
| libs/Pather.js:1284 | Pather.useWaypoint | `"Trying to get the waypoint"` |  |
| libs/Pather.js:1300 | Pather.useWaypoint | `"waypoint retry " + (i + 1)` |  |
| libs/Pickit.js:211 | Pickit.pickItems | `"Trying to make room for " + pickList[0].name` |  |
| libs/Pickit.js:222 | Pickit.pickItems | `"Not enough room for " + pickList[0].name` |  |
| libs/Pickit.js:227 | Pickit.pickItems | `"Not enough room for " + pickList[0].name` |  |
| libs/Pickit.js:429 | Pickit.pickItem | `"Picked up " + (item.getStat(14) ? (item.getStat(14) - stats.gold) : stats.gold) + " " + stats.name` |  |
| libs/Pickit.js:438 | Pickit.pickItem | `"Picked up " + stats.name + " (" + Town.checkKeys() + "/12)"` |  |
| libs/Pickit.js:443 | Pickit.pickItem | `"Picked up " + stats.name + " (" + Town.checkScrolls(stats.classid === 529 ? "tbk" : "ibk") + "/20)"` |  |
| libs/Pickit.js:465 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + (status.line ? ") (" + status.line + ")" : ")")` | 260805 |
| libs/Pickit.js:477 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` |  |
| libs/Pickit.js:484 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` |  |
| libs/Pickit.js:491 | Pickit.pickItem | `"Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)"` |  |
| libs/Runewords.js:424 | Runewords.makeRunewords | `"[Runeword] " + logString` |  |
| libs/Runewords.js:480 | Runewords.rerollRunewords | `"[Reset] " + logString` |  |
| libs/Storage.js:207 | Container.MoveTo | `"Successfully placed " + item.name + " at X: " + nPos.x + " Y: " + nPos.y` |  |
| libs/Town.js:257 | Town.initNPC | `"initNPC: " + reason` |  |
| libs/Town.js:884 | Town.shopItems | `"MiniShopBot: Scanning " + npc.itemcount + " items."` |  |
| libs/Town.js:997 | Town.gamble | `"Buy: " + items[i].name` |  |
| libs/Town.js:1023 | Town.gamble | `"Sell: " + newItem.name` |  |
| libs/Town.js:1313 | Town.needRepair | `"Town: Can't afford repairs."` |  |
| libs/Town.js:1451 | Town.reviveMerc | `"MercWatch precast"` |  |
| libs/Town.js:1892 | Town.clearScrolls | `"clearInventory sell " + items[i].name` |  |
| libs/Town.js:1961 | Town.clearInventory | `"moved from cube to drop " + items[i].name` |  |
| libs/Town.js:1969 | Town.clearInventory | `"moved from cube to sell " + items[i].name` |  |
| libs/Town.js:1997 | Town.clearInventory | `"moved from stash to drop " + items[i].name` |  |
| libs/Town.js:2004 | Town.clearInventory | `"moved from stash to sell " + items[i].name` |  |
| libs/Town.js:2034 | Town.clearInventory | `"clearInventory sell " + items[i].name` |  |
| libs/Town.js:2038 | Town.clearInventory | `"clearInventory drop " + items[i].name` |  |
| libs/Town.js:2046 | Town.clearInventory | `"LowGold sell " + items[i].name` |  |
| threads/ToolsThread.js:64 | main.checkPing | `"High Ping"` |  |
| threads/ToolsThread.js:104 | main.getPotion | `"Drinking potion from inventory."` |  |
| threads/ToolsThread.js:132 | main.togglePause | `"Pausing."` |  |
| threads/ToolsThread.js:138 | main.togglePause | `"Resuming."` |  |
| threads/ToolsThread.js:345 | main.startMeter | `"Meter: cast now"` |  |
| threads/ToolsThread.js:388 | main.runMeter | `"Meter: nothing"` |  |
| threads/ToolsThread.js:420 | main.runMeter | `"Meter: done"` |  |
| threads/ToolsThread.js:504 | main.keyEvent | `"Revealing " + Pather.getAreaName(me.area)` |  |
| threads/TownChicken.js:39 | main.togglePause | `"Pausing."` |  |
| threads/TownChicken.js:45 | main.togglePause | `"Resuming."` |  |
| threads/TownChicken.js:93 | main | `"Town check"` | 261007 |
| threads/TownChicken.js:97 | main | `"Town chicken"` | 261007 |

## 5. 아이템 로그 파일 — `Misc.itemLogger` 28곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| libs/Cubing.js:1094 | Cubing.doCubing | `"Transmuted Fail", items[j]` |  |
| libs/Cubing.js:1099 | Cubing.doCubing | `"Transmuted", items[j], result.line` | 260620 |
| libs/Cubing.js:1146 | Cubing.cursorCheck | `"Dropped", item, "cursorCheck"` |  |
| libs/Misc.js:821 | Equip.autoEquip | `"Equipped", items[0], result.line` | 260815 |
| libs/Misc.js:1109 | Grant.autoEquip | `"Granted", grant, result.line` | 260815 |
| libs/Misc.js:2185 | Misc.cursorCheck | `"Dropped", item, "cursorCheck"` |  |
| libs/Pickit.js:468 | Pickit.pickItem | `"Kept", item, status.line` | 260805 |
| libs/Pickit.js:479 | Pickit.pickItem | `"Ingredient", item, me.findItems(item.classid, 0).length` |  |
| libs/Pickit.js:486 | Pickit.pickItem | `"Ingredient", item, me.findItems(item.classid, 0).length` |  |
| libs/Pickit.js:493 | Pickit.pickItem | `"Ingredient", item, me.findItems(item.classid, 0).length` | 261022 |
| libs/Runewords.js:431 | Runewords.makeRunewords | `"Runeworded", items[0], result.line` |  |
| libs/Runewords.js:437 | Runewords.makeRunewords | `"Runeworded Fail", items[0]` |  |
| libs/Town.js:191 | Town.socketGems | `"Socketed", t.item, (result.line ? result.line + " / " : "") + "(" + (filled + 1) + "/" + t.item.getStat(194) + ")"` | 261028 |
| libs/Town.js:703 | Town.identify | `"Sold", item` |  |
| libs/Town.js:750 | Town.identify | `"Sold", item` |  |
| libs/Town.js:774 | Town.identify | `"Kept", item, result.line` |  |
| libs/Town.js:784 | Town.identify | `"Ingredient", item, me.findItems(item.classid, 0).length` |  |
| libs/Town.js:789 | Town.identify | `"Ingredient", item, me.findItems(item.classid, 0).length` |  |
| libs/Town.js:793 | Town.identify | `"Sold", item, result.line` |  |
| libs/Town.js:908 | Town.shopItems | `"Shopped", bought, result.line` |  |
| libs/Town.js:1007 | Town.gamble | `"Gambled", newItem, result.line` |  |
| libs/Town.js:1022 | Town.gamble | `"Sold", newItem, "Gambling"` |  |
| libs/Town.js:1522 | Town.stash | `"Stashed", items[i], result.line` |  |
| libs/Town.js:1894 | Town.clearScrolls | `"Sold", items[i]` |  |
| libs/Town.js:1897 | Town.clearScrolls | `"Dropped", items[i], "clearScrolls"` |  |
| libs/Town.js:2035 | Town.clearInventory | `"Sold", items[i]` |  |
| libs/Town.js:2039 | Town.clearInventory | `"Dropped", items[i]` |  |
| libs/Town.js:2048 | Town.clearInventory | `"Sold", items[i]` |  |

## 6. 매니저 아이템 탭 — `Misc.logItem` 9곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| libs/Cubing.js:1102 | Cubing.doCubing | `"Transmuted", items[j], result.line` |  |
| libs/Misc.js:820 | Equip.autoEquip | `"Equipped [" + tier + "]", items[0], result.line` |  |
| libs/Misc.js:1108 | Grant.autoEquip | `"Granted [" + tier + "]", grant, result.line` |  |
| libs/Pickit.js:471 | Pickit.pickItem | `"Kept", item, status.line` |  |
| libs/Runewords.js:434 | Runewords.makeRunewords | `"Runeworded", items[0], result.line` |  |
| libs/Town.js:194 | Town.socketGems | `"Socketed", t.item, result.line` | 261023 |
| libs/Town.js:777 | Town.identify | `"Kept", item, result.line` |  |
| libs/Town.js:911 | Town.shopItems | `"Shopped", bought, result.line` |  |
| libs/Town.js:1010 | Town.gamble | `"Gambled", newItem, result.line` |  |

## 7. 오류 보고(ScriptErrorLog + 콘솔 + trace) — `Misc.errorReport` 39곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| default.dbj:56 | main | `initError, "default.dbj"` | 261026 |
| libs/Cubing.js:131 | Cubing.init | `"\c1Invalid cubing entry:\c0 " + Config.CubeRecipe[i][1]` | 261023 |
| libs/Loader.js:108 | Loader.loadScripts | `"\c1Script " + script + " doesn't exist."` |  |
| libs/Loader.js:113 | Loader.loadScripts | `"Failed to include script: " + script` |  |
| libs/Loader.js:142 | Loader.loadScripts | `error, script` |  |
| libs/Pather.js:245 | Pather.moveTo | `new Error("moveTo undefined coords (" + x + ", " + y + ")"), "Pather.moveTo"` | 260922 |
| libs/Runewords.js:124 | Runewords.init | `"\c1Invalid runewords entry:\c0 " + Config.RunewordRecipe[i][1]` | 261023 |
| libs/Town.js:948 | Town.gamble | `"\c1Invalid gamble entry:\c0 " + Config.GambleItems[i]` |  |
| threads/PartyThread.js:136 | main | `e, "PartyThread.js"` |  |
| threads/ToolsThread.js:697 | main | `e, "ToolsThread"` |  |
| threads/TownChicken.js:104 | main | `e, "TownChicken.js"` |  |
| tools/NTItemParser.dbl:34 | NTIP.OpenFile | `"\c1NIP file doesn't exist: \c0" + filepath` |  |
| tools/NTItemParser.dbl:49 | NTIP.OpenFile | `"\c1Failed to load NIP: \c0" + filename` |  |
| tools/NTItemParser.dbl:498 | NTIP.ParseLineInt | `"More than one @ (extra part ignored) File: " + info.file + " Line: " + info.line` |  |
| tools/NTItemParser.dbl:504 | NTIP.ParseLineInt | `"More than two # (extra section ignored) File: " + info.file + " Line: " + info.line` |  |
| tools/NTItemParser.dbl:532 | NTIP.ParseLineInt | `"More than two # in hold (extra section ignored) File: " + info.file + " Line: " + info.line` |  |
| tools/NTItemParser.dbl:581 | NTIP.ParseExpr | `"Missing ] after " + sec.substring(pos) + where` |  |
| tools/NTItemParser.dbl:594 | NTIP.ParseExpr | `"Unknown stat: " + key + where` |  |
| tools/NTItemParser.dbl:603 | NTIP.ParseExpr | `"Unknown property: " + key + where` |  |
| tools/NTItemParser.dbl:610 | NTIP.ParseExpr | `"Bad operator after [" + key + "]: " + sec.substring(pos, pos + 3) + where` |  |
| tools/NTItemParser.dbl:618 | NTIP.ParseExpr | `"Only == or != after [" + key + "]: " + op + where` |  |
| tools/NTItemParser.dbl:625 | NTIP.ParseExpr | `"Missing value after [" + key + "]" + op + where` |  |
| tools/NTItemParser.dbl:638 | NTIP.ParseExpr | `"Unknown " + key + ": " + value + where` |  |
| tools/NTItemParser.dbl:656 | NTIP.ParseExpr | `"Unexpected symbol: " + sec.substring(pos, pos + 3) + where` |  |
| tools/NTItemParser.dbl:668 | NTIP.ParseExpr | `"Unbalanced )" + where` |  |
| tools/NTItemParser.dbl:673 | NTIP.ParseExpr | `"&& and \|\| mixed in one ( ): use ( )" + where` |  |
| tools/NTItemParser.dbl:687 | NTIP.ParseExpr | `"Unclosed (" + where` |  |
| tools/NTItemParser.dbl:692 | NTIP.ParseExpr | `"&& and \|\| mixed without ( ): use ( )" + where` |  |
| tools/NTItemParser.dbl:699 | NTIP.ParseExpr | `"Syntax error (" + e.message + ")" + where` |  |
| tools/NTItemParser.dbl:717 | NTIP.ParseRule | `"Duplicate rule key: [tiered]" + where` |  |
| tools/NTItemParser.dbl:728 | NTIP.ParseRule | `"Bad rule: " + parts[i] + " (use [key] op value joined by &&)" + where` |  |
| tools/NTItemParser.dbl:740 | NTIP.ParseRule | `"Duplicate rule key: [" + key + "]" + where` |  |
| tools/NTItemParser.dbl:748 | NTIP.ParseRule | `"Unknown hold rule: " + key + where` |  |
| tools/NTItemParser.dbl:753 | NTIP.ParseRule | `"Bad hold owned value: " + parts[i] + where` |  |
| tools/NTItemParser.dbl:766 | NTIP.ParseRule | `"Bad " + key + " value: " + parts[i] + " (only == number)" + where` |  |
| tools/NTItemParser.dbl:773 | NTIP.ParseRule | `"[tiered] is a marker, write it without op and value: " + parts[i] + where` |  |
| tools/NTItemParser.dbl:787 | NTIP.ParseRule | `"Unknown rule: " + key + where` |  |
| tools/NTItemParser.dbl:792 | NTIP.ParseRule | `"Bad gear value: " + parts[i] + " (< <= > >= == with number or goal)" + where` |  |
| tools/NTItemParser.dbl:797 | NTIP.ParseRule | `"No goal for merc gear: " + parts[i] + where` |  |

## 8. AutoBuild print/log — `AutoBuild.print` 18곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| libs/AutoBuild.js:36 | AutoBuild.applyConfigUpdates | `"Updating Config from level "+configUpdateLevel+" to "+me.charlvl` |  |
| threads/AutoBuildThread.js:83 | spendStats | `"spendStats: failed on " + STAT_ID_TO_NAME[id]` |  |
| threads/AutoBuildThread.js:87 | spendStats | `"spendStats: Increased " + STAT_ID_TO_NAME[id] + " from " + (me.getStat(id) - 1) + " to " + me.getStat(id)` | 260625 |
| threads/AutoBuildThread.js:122 | spendSkills | `"spendSkills: failed on prereq " + prereqs[j]` |  |
| threads/AutoBuildThread.js:131 | spendSkills | `"spendSkills: failed on skill " + id` |  |
| threads/AutoBuildThread.js:135 | spendSkills | `"spendSkills: Increased " + getSkillById(id) + " ("+id+") from " + (me.getSkill(id, 0) - 1) + " to " + me.getSkill(id, 0)` | 260625 |
| threads/AutoBuildThread.js:145 | spendStatPoint | `"useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]` |  |
| threads/AutoBuildThread.js:147 | spendStatPoint | `"Fake useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]` |  |
| threads/AutoBuildThread.js:165 | spendStatPoints | `"Warning: Number of stats specified in your build template at level "+me.charlvl+" exceeds the available unused stat points"+ "\nOnly the first "+len+" stats "+stats.slice(0, len).join(", ")+" will be added"` |  |
| threads/AutoBuildThread.js:181 | spendStatPoints | `"Attempt to spend point "+(i+1)+" in "+STAT_ID_TO_NAME[id]+" may have failed!"` |  |
| threads/AutoBuildThread.js:183 | spendStatPoints | `"Stat ("+(i+1)+"/"+len+") Increased "+STAT_ID_TO_NAME[id]+" from "+preStatValue+" to "+me.getStat(id)` |  |
| threads/AutoBuildThread.js:231 | spendSkillPoint | `"useSkillPoint(): "+skillName` |  |
| threads/AutoBuildThread.js:233 | spendSkillPoint | `"Fake useSkillPoint(): "+skillName` |  |
| threads/AutoBuildThread.js:251 | spendSkillPoints | `"Warning: Number of skills specified in your build template at level "+me.charlvl+" exceeds the available unused skill points"+ "\nOnly the first "+len+" skills "+skills.slice(0, len).join(", ")+" will be added"` |  |
| threads/AutoBuildThread.js:280 | spendSkillPoints | `"Attempt to spend skill point "+(i+1)+" in "+skillName+" may have failed!"` |  |
| threads/AutoBuildThread.js:283 | spendSkillPoints | `"Skill ("+(i+1)+"/"+len+") Increased "+skillName+" by one (level: ", actualSkillLevel+")"` |  |
| threads/AutoBuildThread.js:304 | main | `"Loaded helper thread"` |  |
| threads/AutoBuildThread.js:313 | main | `"Level up detected (", prevLevel, "-->", me.charlvl, ")"` |  |

## 9. 매니저 상태 칸 — `D2Bot.updateStatus` 42곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| D2BotFollow.dbj:87 | locationTimeout | `name + " (" + Math.max(sec, 0) + "s)"` |  |
| D2BotFollow.dbj:227 | main | `"Game: " + me.gamename` |  |
| D2BotFollow.dbj:236 | main | `"[" + me.getStat(12) + "] " + me.gamename + (me.gamepassword ? "/" + me.gamepassword : "") + timer(gameStart) + " $" + Math.floor((me.getStat(14) + me.getStat(15))/1000) + "k @" + Pather.getAreaName(me.area)` |  |
| D2BotFollow.dbj:278 | locationAction | `"Lobby"` |  |
| D2BotFollow.dbj:322 | locationAction | `"Waiting..."` |  |
| D2BotFollow.dbj:328 | locationAction | `"Lobby Chat"` |  |
| D2BotFollow.dbj:370 | locationAction | `"Join Game"` |  |
| D2BotFollow.dbj:471 | locationAction | `"Logging In"` |  |
| D2BotFollow.dbj:525 | locationAction | `"Invalid Password"` |  |
| D2BotFollow.dbj:530 | locationAction | `"Invalid Account"` |  |
| D2BotFollow.dbj:542 | locationAction | `"Invalid CDKey"` |  |
| D2BotFollow.dbj:548 | locationAction | `"Disabled CDKey"` |  |
| D2BotFollow.dbj:554 | locationAction | `"Disabled LoD CDKey"` |  |
| D2BotFollow.dbj:560 | locationAction | `"Disconnected"` |  |
| D2BotFollow.dbj:566 | locationAction | `"Login Error"` |  |
| D2BotFollow.dbj:589 | locationAction | `"Unable To Connect"` |  |
| D2BotFollow.dbj:605 | locationAction | `"Realm Down"` |  |
| D2BotFollow.dbj:626 | locationAction | `"Disconnected"` |  |
| D2BotFollow.dbj:713 | locationAction | `"Realm Disabled CDKey"` |  |
| D2BotLead.dbj:174 | locationTimeout | `name + " (" + Math.max(sec, 0) + "s)"` |  |
| D2BotLead.dbj:239 | teamWait | `"Team wait: " + status` |  |
| D2BotLead.dbj:430 | main | `"[" + me.getStat(12) + "] " + me.gamename + (me.gamepassword ? "/" + me.gamepassword : "") + timer(gameStart) + " $" + Math.floor((me.getStat(14) + me.getStat(15))/1000) + "k @" + Pather.getAreaName(me.area)` |  |
| D2BotLead.dbj:453 | locationAction | `"Lobby"` |  |
| D2BotLead.dbj:533 | locationAction | `"Waiting..."` |  |
| D2BotLead.dbj:539 | locationAction | `"Lobby Chat"` |  |
| D2BotLead.dbj:662 | locationAction | `"Creating Game"` |  |
| D2BotLead.dbj:721 | locationAction | `"Logging In"` |  |
| D2BotLead.dbj:775 | locationAction | `"Invalid Password"` |  |
| D2BotLead.dbj:780 | locationAction | `"Invalid Account"` |  |
| D2BotLead.dbj:792 | locationAction | `"Invalid CDKey"` |  |
| D2BotLead.dbj:798 | locationAction | `"Disabled CDKey"` |  |
| D2BotLead.dbj:804 | locationAction | `"Disabled LoD CDKey"` |  |
| D2BotLead.dbj:810 | locationAction | `"Disconnected"` |  |
| D2BotLead.dbj:816 | locationAction | `"Login Error"` |  |
| D2BotLead.dbj:839 | locationAction | `"Unable To Connect"` |  |
| D2BotLead.dbj:855 | locationAction | `"Realm Down"` |  |
| D2BotLead.dbj:876 | locationAction | `"Disconnected"` |  |
| D2BotLead.dbj:963 | locationAction | `"Realm Disabled CDKey"` |  |
| tools/OOG.js:515 | ControlAction.timeoutDelay | `text + " (" + Math.max(currTime, 0) + "s)"` |  |
| tools/OOG.js:911 | ControlAction.makeAccount | `"Creating account (" + Math.max(0, Math.ceil((30000 - getTickCount() + tick) / 1000)) + "s)"` | 261001 |
| tools/OOG.js:1130 | ControlAction.makeCharacter | `"Creating character"` | 261001 |
| tools/OOG.js:1243 | ControlAction.makeCharacter | `"Creating character (" + Math.max(0, Math.ceil((60000 - getTickCount() + stuckTick) / 1000)) + "s)"` |  |

## 10. 채팅 — `say` 3곳

| 파일:줄 | 함수 | 남기는 내용(인자) | 날짜 |
|---|---|---|---|
| D2BotFollow.dbj:343 | locationAction | `"/j " + StarterConfig.JoinChannel` |  |
| D2BotFollow.dbj:347 | locationAction | `StarterConfig.FirstJoinMessage` |  |
| D2BotLead.dbj:105 | sayMsg | `string` |  |
