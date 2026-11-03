# threads/TownChicken.js

## main 루프

### 261004 Claude: Arreat Summit(120) 제외
- 루프 조건에 `me.area !== 120`. 없으면 HP 조건이 참인 동안 `Town.visitTown`이 120에서 거부해 매 틱 일시정지가 토글된다.

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `Town check`·`Town chicken`: 머리 위 글자·trace 삭제, print → `Misc.print("[TownChicken] Town check|Town chicken")`. scriptmsg의 Uber Tristram·Arreat Summit 분기 print·콘솔 3줄 삭제(`Misc.townCheck`가 두 지역에서 메시지를 보내지 않아 찍히지 않던 자리, 머리 위 글자 `Cannot open TP`는 `Misc.townCheck`로). 분기는 그대로. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.
