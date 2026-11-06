# D2BotLead.dbj

## locationAction / badKey / locationTimeout

### 261001 Claude: 게임 밖 흐름 (D2BotFollow.dbj 공통)
- 캐릭터 선택 화면(12): `login()`이 실패하고 목록(`findCharacter`, 24칸)에 프로필 캐릭터가 없으면 `AutoCreate.character`로 생성. 슬롯 가득 참 → 정지. 이름 중복 뒤에도 없으면 → 정지. `makeCharacter`가 처리하지 않는 화면에 1분 → 취소 후 재시도. 계정·캐릭터 정보 없음 → 정지.
- 로그인: 재시도(`loginRetry` 2회) 소진 → 정지. 비밀번호 틀림 → 정지(예전엔 무한 대기). 나쁜 CDKey(다른 제품용·Disabled·Disabled LoD·22 잘못된 키·42 렐름 차단)는 키 교체 켜짐이면 교체 재시작, 꺼짐이면 정지(`badKey`).
- 대기값: `RetryKeyDelay` 30초, `RealmDownDelay` 5분. 키 사용 중 1분·연결 불가·R/D Blocker 동작·Starter의 16/21/25 처리는 그대로.
- 남은 시간 표시: 계정 생성 전 대기(`timeoutDelay`), `makeAccount`(30초), `makeCharacter`(1분, 멈춘 화면에서만), `locationTimeout`(화면 이름은 `OOGLog.names`). 끝난 뒤 덮어쓰지 않는다.
- 확인: 261006 로그에서 게임 밖 trace `[OOG loc N]` 형식 통과. 계정 생성 팝업 문구·캐릭터 생성 대기 창(16·17번)은 상황 없음.

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- 로비 채팅 삭제(사용자 261103, 채널 설정이 비어 안 쓰임): `sayMsg` 함수, 게임 뒤 메시지(`AfterGameMessage`) 블록, 채널 첫 메시지(`FirstJoinMessage`) `sayMsg`, `AnnounceGames` 블록. 채널 입장(`ControlAction.joinChannel`)과 `useChat`은 그대로. `Unable to join channel` → `Misc.print("[Starter] Failed: unable to join channel, chat disabled")`.
- 로그인 catch의 그 밖 위치 줄 `print(e + " " + getLocation())` → `print("[Starter] Login error: e (loc N)")`(수정 목록에는 `Login failed` 상세와 같은 줄로 보고 삭제로 적었으나, `OOGLog.stop`과 다른 분기의 유일한 기록이라 남김).

## main

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- 게임 안 루프의 `if (!ingame)` 블록(게임마다 1회)에서 리더 콘솔 `=== [게임 이름] ===`(색 7). `debugLog(me.profile)` 삭제. `Recieved Game Info` → `Misc.print("[Starter] Received game info")`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.

### 261104 Claude: 로그 모양 정리 (사용자 승인 261104, handoff 3-66)
- 리더 콘솔 게임 경계 `=== [게임 이름] ===`(색 7) → `[게임 이름]`(기본색 0, `Console.txt` 분류 `Flow`). 로비 플레이 시간 줄(`addPlayTime`) 앞에 `[Total] `(콘솔만, 분류 `OOG`).

### 261104 사용자: 게임 경계·플레이 시간 줄 모양 (실행 중 업로드 `03e4d6d`)
- 리더 콘솔 게임 경계 `[게임 이름]` 줄을 주석 처리(꺼 둠). 콘솔에는 게임 경계 줄이 없다.
- 로비 플레이 시간 줄 `[Total] 시간 / Nr (Avg. Nm)` → `시간 (Nm * Nr)`(예: `18h 44m (12m * 93r)`, 콘솔만, 분류 `OOG`).

### 261105 Claude: 꺼 둔 게임 경계 콘솔 줄 삭제 (사용자 요청 261105, handoff 3-68)
- 게임 안 루프 `if (!ingame)` 블록의 주석 처리된 `D2Bot.printToConsole("[" + me.gamename + "]")` 삭제. 이유(사용자 261105): 게임 이름 줄은 분석에 쓰이지 않는다(`Console.txt`는 시각·프로필과 경험치 줄로 게임을 나눈다).
- 확인: 261106 로그 — 콘솔 게임 경계 줄 0, 플레이 시간 줄 `시간 (Nm * Nr)`. 검증 통과(사용자 261106, 옛 handoff 3-68).
