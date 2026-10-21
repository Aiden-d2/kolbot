# D2BotLead.dbj

## locationAction / badKey / locationTimeout

### 261001 Claude: 게임 밖 흐름 (D2BotFollow.dbj 공통)
- 캐릭터 선택 화면(12): `login()`이 실패하고 목록(`findCharacter`, 24칸)에 프로필 캐릭터가 없으면 `AutoCreate.character`로 생성. 슬롯 가득 참 → 정지. 이름 중복 뒤에도 없으면 → 정지. `makeCharacter`가 처리하지 않는 화면에 1분 → 취소 후 재시도. 계정·캐릭터 정보 없음 → 정지.
- 로그인: 재시도(`loginRetry` 2회) 소진 → 정지. 비밀번호 틀림 → 정지(예전엔 무한 대기). 나쁜 CDKey(다른 제품용·Disabled·Disabled LoD·22 잘못된 키·42 렐름 차단)는 키 교체 켜짐이면 교체 재시작, 꺼짐이면 정지(`badKey`).
- 대기값: `RetryKeyDelay` 30초, `RealmDownDelay` 5분. 키 사용 중 1분·연결 불가·R/D Blocker 동작·Starter의 16/21/25 처리는 그대로.
- 남은 시간 표시: 계정 생성 전 대기(`timeoutDelay`), `makeAccount`(30초), `makeCharacter`(1분, 멈춘 화면에서만), `locationTimeout`(화면 이름은 `OOGLog.names`). 끝난 뒤 덮어쓰지 않는다.
- 확인: 261006 로그에서 게임 밖 trace `[OOG loc N]` 형식 통과. 계정 생성 팝업 문구·캐릭터 생성 대기 창(16·17번)은 상황 없음.
