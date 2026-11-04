# 로그 종류 (261103)

코드가 남기는 로그 11가지. 규칙(무엇을 어디에 어떤 모양으로)은 `CLAUDE.md` 4절, 분석 방법은 `log_guide.md`.

| # | 종류 | 목적 | 보는 곳 | 파일 | 코드 | 설정 |
|---|---|---|---|---|---|---|
| 1 | 콘솔 | 흐름과 끝(리더 흐름, 조기 종료·멈춤·치킨·죽음·오류, 아이템 진행, 경험치). 게임 밖 사건 | 매니저 콘솔(색) | `_cache/trace/Console.txt`(전 프로필 한 파일, `[YYYY/MM/DD HH:MM:SS] <프로필> <분류> 내용`) | `D2Bot.printToConsole`(`tools/OOG.js`), 게임 밖은 `OOGLog.print`·`stop` | - |
| 2 | print | 상세 기록 전부(진행, 실패·재시도, 오류·조기 종료 상세, 게임 경계, 구간 시작·끝, 콘솔 줄(261104부터 `[Total]`·키 입력 디버그 빼고)) | 게임 화면 콘솔 | d2bs 로그 `d2bs/logs/d2bs-<프로필>-<YYYYMMDD>.log`(엔진이 시각을 붙임) | 게임 안 `Misc.print(msg)`(위치 붙임, 색 코드 지움), 고정 모양·게임 밖·입장 직후 정보 줄 `print` | - |
| 3 | trace | 임시 검증 줄(handoff 3절, 제거 조건과 함께) | - | `_cache/trace/trace-<프로필>-<YYYYMMDD>.txt` | `Misc.trace` | - |
| 4 | 머리 위 글자 | 화면 표시(매 틱 반복, 아이템마다, 키 입력) | 게임 화면 캐릭터 위 | 없음 | `me.overhead` | - |
| 5 | 아이템 로그 | 아이템 처리 기록(Kept, Ingredient, Sold, Dropped, Stashed, Shopped, Gambled, Equipped, Granted, Socketed, Runeworded, Transmuted). 분석은 이 파일 | - | `_cache/trace/ItemLog.txt`(전 프로필 한 파일) | `Misc.itemLogger` | `Config.ItemInfo` |
| 6 | 매니저 아이템 탭 | 같은 아이템을 게임 그래픽(모양·옵션)으로 보기. `logItem`을 부르는 9곳은 모두 바로 옆에 같은 동작의 `itemLogger`가 있다 | 매니저 아이템 탭 | 없음 | `Misc.logItem` → `D2Bot.printToItemLog` | `Misc.useItemLog`, `Config.LogEssences`·`LogKeys`·`LogOrgans`·룬·보석 등급·`SkipLogging` |
| 7 | 오류 보고 | 스크립트 오류. 콘솔 `[Error] 스크립트: 메시지 (파일 #줄)` + print(지역·핑·게임·스택) | 매니저 콘솔 | 없음(261103 전 `_cache/trace/ScriptErrorLog.txt`) | `Misc.errorReport`, 잡힌 오류 `Misc.caughtError` | `Misc.errorConsolePrint` |
| 8 | AutoBuild | 스탯·스킬 찍기 진단(문제가 의심될 때 켬) | 게임 화면 콘솔 | `_cache/AutoBuild.<realm>.<캐릭>.<날짜>.log` | `AutoBuild.print`(`libs/AutoBuild.js` `myPrint`) | `Config.AutoBuild.Verbose`(print), `DebugMode`(파일), 기본 둘 다 false |
| 9 | 매니저 상태 칸 | 지금 상태 한 줄(로비, 방 만들기, 게임 이름·시간…) | 매니저 상태 칸 | 없음 | `D2Bot.updateStatus` | - |
| 10 | 측정·키 입력 디버그 | 필요할 때 키로 켜는 확인(숫자패드 5 측정기 `[MM]`, 좌표·거리·스탯) | 게임 화면, 일부 콘솔 | 없음 | `ToolsThread` `startMeter`·`runMeter`·`keyEvent`, `MapThread` `keyEvent` | 키 입력 |
| 11 | D2BS 엔진 | 엔진 시작·종료·프로필 전환·엔진 오류 | 게임 화면 콘솔 | d2bs 로그 | 엔진 | 코드로 바꿀 수 없음 |

- 261103에 지운 것: d2bs 로그의 `[console]` 한 벌(콘솔 파일로 대체), `ScriptErrorLog.txt`, `debugLog(me.profile)`(d2bs 로그에 프로필 이름 한 줄), 로비 채팅 `say`(채널 설정이 비어 안 쓰임).
