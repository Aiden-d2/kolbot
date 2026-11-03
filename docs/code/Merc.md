# libs/Merc.js

## checkSkill

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- print `Merc unmatched`·`Revive needed`·`Merc not found`·`Merc matched: 이름` → `Misc.print("[Merc] Unmatched|Revive needed|Failed: not found|Matched: 이름")`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.

## hire

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `[hire] … failed` print → `Misc.print("[hire] Failed: …")`, retry trace → `[hire] Retry N/5`, `[Hired] Level N 스킬` print → `Misc.print`(콘솔은 그대로).
