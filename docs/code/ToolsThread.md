# threads/ToolsThread.js

## main (copydata 중계)

### 261021 Claude: default.dbj가 멈춘 동안의 메시지 중계 (`eddab3a`, 옛 handoff 3-2)
- 엔진은 멈춘 스크립트의 copydata를 버린다(`Events.cpp:230`). default.dbj가 멈춰 있을 때 받은 copydata 55·56을 `relayMsgs`에 쌓았다가, 다시 돌면 `Messaging.sendToScript`로 순서대로 넘긴다(실패하면 남김). 받는 쪽은 `AutoSmurf.md` onCopyData.
- 감수: 재개 직후 수 ms 틈의 유실, 같은 틈의 중복(이름·플래그는 무해, 아직 개수인 readyCount·buffCount·BOCount는 넘칠 수 있음 → handoff 2-1 확장 때 해소).
- 확인: 261022 `relay` 6건, 261023 5건 모두 Town chicken으로 마을에 다녀온 직후, 중계한 프로필로 인한 desync 0. 검증 통과(사용자 261023). 확인 줄 `relay N msgs`는 261023 `0f6da09`에서 삭제(옛 handoff 3-28). 261025 로그에 `relay` 0(삭제 확인). 중계 자체를 보는 줄은 없고, desync 5건은 모두 다른 사유로 판별됨(handoff 3-31). 검증 통과(사용자 261025).

## main (Life Chicken)

### 261021 Claude: Life Chicken 상세 삭제 (`ab94751`, 옛 handoff 3-9)
- `[Quit] Life Chicken H/M` 뒤의 `| mode:N near: ...`와 `nearMonsters` 함수 삭제(사용자 결정).
- 확인: 261022·261023 로그. 검증 통과(사용자 261023).
