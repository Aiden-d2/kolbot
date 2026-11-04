# tools/OOG.js

## D2Bot.printToConsole

### 261021 Claude: d2bs 로그에도 남김 (`ab94751`, 옛 handoff 3-9)
- 콘솔에 찍을 때 `print("[console] " + msg)`도 해서 d2bs 로그에 같은 줄이 남는다. 확인: 261022·261023 로그. 검증 통과(사용자 261023).

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- d2bs 로그 한 벌 `print("[console] " + msg)` 삭제. 매니저로 보낸 뒤 같은 줄을 `_cache/trace/Console.txt`(전 프로필 한 파일)에 `[YYYY/MM/DD HH:MM:SS] <프로필> <분류> msg`로 덧붙인다. 분류: 게임 밖 `OOG`, 색 7 `Flow`, 8·5 `Item`, 4 `Exp`, 9 `Red`, 10 `Error`, 그 밖(0) `Quit`. `Misc.fileAction`(덧붙이기, 실패 시 30회 재시도)으로 쓰고 `Misc`가 없는 스레드(`MapThread`)에서는 쓰지 않는다. 폴더가 없으면 만든다. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.
- 확인: 261104 로그 `Console.txt` 1,231줄(8프로필 섞임) 깨진 줄 0, 분류 7종 모두 나옴, 리더 `=== [게임] ===` 89 = 각 프로필 print 게임 경계 89, `[Quit] Max game time 30 min` 2줄(리더). 매니저 콘솔과의 대조는 안 함(받지 않음). 검증 통과(사용자 261104, 3-64 같은 헤더 항목 공통).

## ControlAction

### 261001 Claude: 화면 문구 읽기
- 10·30 화면 문구를 `ControlAction.readText`로 읽는다(계정 생성 실패 문구 등).

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `Creating Game: 이름` → `Misc.print("[Starter] Create game: 이름")`, trace `Character name taken` → `Misc.print("[makeCharacter] Failed: name taken 이름 | 문구")`.

## OOGLog

### 261001 Claude: 게임 밖 로그 (게임 밖 흐름)
- `OOGLog.print`/`OOGLog.stop`이 콘솔(회색, `사건: 대상 - 처리 (loc N)`)과 같은 줄을 trace에 남긴다. `Misc.trace`는 게임 밖이면 `[OOG loc N]`.
- 확인: 261006 로그 통과.

### 261102 사용자: 주석의 `CLAUDE.md` 언급 삭제
- 설명 주석 `(CLAUDE.md log rules, 261001)` → `(log rules, 261001)`. 코드 변경 없음.

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `OOGLog.print`의 trace → `print(text + " | " + detail + " (loc N)")`. 콘솔 줄은 그대로.
