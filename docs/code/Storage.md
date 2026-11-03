# libs/Storage.js

## MoveToSlot

### 261101 Claude: 인벤토리·커서 밖 아이템은 집지 않음 (`c18dca5`, 사용자 요청, 옛 handoff 3-59, 옛 1-18·3-17·1-6)
- 문제: `AutoSmurf.start`가 게임 시작 정리(`Town.doChores(true)`) 뒤 큐브(0,0)·TP 책(0,2)·회복 물약을 정해진 칸으로 옮길 때(`Storage.Inventory.MoveToSlot`, 물약 목록은 루프 전에 한 번 만듦) 집은 아이템이 칸에 놓이지 않고 커서에 남아 바닥에 버려진다. 261029 a8 장갑(착용 칸 10)·261101 a1 반지(착용 칸 7, 뒤에 판매)처럼 착용 장비가 빠진 사례가 있었다(두 건 모두 이름 `undefined`).
- 원인(추정): 앞 호출 실패로 물약이 버려지면 목록의 객체가 깨지고, 그 gid로 `getUnit(4, -1, -1, item.gid)`를 다시 찾으면 다른 유닛(착용 장비)이 돌아오며, `toCursor`는 착용 아이템이면 몸에서 집는다(`libs/Prototypes.js`). 엔진 동작은 확인 안 함.
- 바꾼 것: 다시 찾은 유닛이 이 컨테이너 안(`location === this.location && mode === 0`)도 커서(`mode === 4`)도 아니면 `toCursor` 전에 trace `[MoveToSlot] skip <이름> gid:<item.gid> got:<잡힌 이름> loc L mode M at x,y`를 남기고 `false`(착용·바닥 아이템은 집지 않음). 칸 고정 호출, 커서 것을 버리는 원래 경로는 그대로.
- 확인: 코드상 이 분기는 집기 전에 끝난다. 261102 로그 `skip` 0, 261103 로그 `skip` 4줄(모두 바닥 회복 물약 `loc 0 mode 3`, Pz-56 a3·Pz-59 a1·a6·a7, 앞에 같은 게임 FAILED 줄 없음), 두 사이클 동안 착용 칸이 -1로 바뀐 유실 0(261103의 -1 전환 2건은 a5 화살통, a1 목걸이는 AMULET~STAFF 사이). 착용 장비를 잡은 `skip` 사례는 아직 없음. 확정(사용자 261103), `skip` trace는 나중에 사례를 보려고 남김(사용자 261103).

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- `dropped blocker` trace → `Misc.print("[MoveToSlot] No room, dropped blocker 이름")`(아이템을 버린 기록). `skip`·`FAILED` trace(3-59)는 임시 trace로 그대로. `Storage.MoveTo` retry·catch trace → `[Storage.MoveTo] Retry: 이름 loc=`·`[Storage.MoveTo] Failed: 메시지 | item= loc=`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.
