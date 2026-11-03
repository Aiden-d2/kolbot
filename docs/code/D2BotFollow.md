# D2BotFollow.dbj

## locationAction / badKey / locationTimeout

### 261001 Claude: 게임 밖 흐름 (D2BotLead.dbj 공통)
- `D2BotLead.md`와 같은 처리(캐릭터 선택 화면 생성, 복구할 수 없는 로그인 오류에서 정지, 대기 남은 시간 표시).
- 확인: `D2BotLead.md`와 같음.

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- 채팅 `say("/j " + JoinChannel)`, `FirstJoinMessage` `say`와 그 `delay` 삭제(사용자 261103). `joining game 이름` → `Misc.print("[Starter] Join game: 이름")`. 로그인 catch의 그 밖 위치 줄 → `print("[Starter] Login error: e (loc N)")`.

## main

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `debugLog(me.profile)` 삭제. `Recieved Game Info` → `Misc.print("[Starter] Received game info")`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.
