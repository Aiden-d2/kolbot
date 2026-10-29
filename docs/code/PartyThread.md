# threads/PartyThread.js

## partyCheck

### 261029 Claude: `party accept` trace 삭제 (사용자 요청, 옛 handoff 3-17)
- 261021에 MoveToSlot 실패와 수락 시각을 대조하려고 넣은 파티 수락 trace 1줄 삭제. 261029 로그에서 수락(게임 시작 0~1초)과 실패(13~38초)가 겹치지 않아 판정이 끝남(handoff 1-18).

## partyInGame

### 261028 Claude: 판별 줄 삭제 (`4e6087b`, 사용자 요청, 옛 handoff 3-49)
- `lastStep`, `scriptmsg` 리스너(옛 handoff 3-37 때 새로 만듦), `party has left` trace의 `town:`·`mode:`·`ui:`·`step:` 삭제. 줄 끝 위치 `(지역 x,y)`는 남김(사용자 261024). 경위는 `rejected.md` PartyThread.
- 확인: 코드에 지운 줄이 남지 않음(261028 grep). 동작은 바꾸지 않아 인게임 검증 없이 통과(사용자 261028).
