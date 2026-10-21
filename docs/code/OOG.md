# tools/OOG.js

## ControlAction

### 261001 Claude: 화면 문구 읽기
- 10·30 화면 문구를 `ControlAction.readText`로 읽는다(계정 생성 실패 문구 등).

## OOGLog

### 261001 Claude: 게임 밖 로그 (게임 밖 흐름)
- `OOGLog.print`/`OOGLog.stop`이 콘솔(회색, `사건: 대상 - 처리 (loc N)`)과 같은 줄을 trace에 남긴다. `Misc.trace`는 게임 밖이면 `[OOG loc N]`.
- 확인: 261006 로그 통과.
