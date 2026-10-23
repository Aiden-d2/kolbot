# tools/OOG.js

## D2Bot.printToConsole

### 261021 Claude: d2bs 로그에도 남김 (`ab94751`, 옛 handoff 3-9)
- 콘솔에 찍을 때 `print("[console] " + msg)`도 해서 d2bs 로그에 같은 줄이 남는다. 확인: 261022·261023 로그. 검증 통과(사용자 261023).

## ControlAction

### 261001 Claude: 화면 문구 읽기
- 10·30 화면 문구를 `ControlAction.readText`로 읽는다(계정 생성 실패 문구 등).

## OOGLog

### 261001 Claude: 게임 밖 로그 (게임 밖 흐름)
- `OOGLog.print`/`OOGLog.stop`이 콘솔(회색, `사건: 대상 - 처리 (loc N)`)과 같은 줄을 trace에 남긴다. `Misc.trace`는 게임 밖이면 `[OOG loc N]`.
- 확인: 261006 로그 통과.
