# default.dbj

## main

### 261026 Claude: 시작부 오류를 멈춤으로 (`d87cfcb`, 사용자 결정, 옛 handoff 2-24·3-35)
- `Config.init`·`Attack.init`·`Storage.Init`·`Runewords.init`·`Cubing.init`(`Loader.init` 앞)을 try로 감싸고, catch에서 `Misc.errorReport(e, "default.dbj")`(회색 콘솔 + `[Error]` trace) → 빨강 콘솔 `Init failed in default.dbj. Stopping`(위치 없음) + trace → `D2Bot.stop()` → `return false`.
- 이유: 전에는 여기서 오류가 나면 default.dbj만 죽고 trace·콘솔에 아무것도 남지 않은 채 게임이 최대 게임 시간(30분)까지 서 있었다. 다시 시작해도 같은 코드라 복구되지 않는다(261026 로그 10/25 Pz-4~8, `Runewords` 쪽 `[].forEach is not a function`).
- 범위: 던져진 오류만. nip 로드(`Config.init` → `AutoBuild.initialize` → `Pickit.init`)도 이 안이지만, nip 줄 문법 오류는 파서가 던지지 않고 회색 콘솔로 알린 뒤 그 규칙만 건너뛴다(`NTItemParser.md`).
- 확인: 261027~261030 케이스 미발견(`Init failed` 0). 사용자 확정(261030), 줄은 재발 추적용으로 남김.

### 261103 Claude: 로그 정책 (사용자 승인 261103, handoff 3-64)
- 게임 경계 trace `=== [게임 이름] ===` → `print`(위치 없음, 모든 프로필). 초기화 실패: 콘솔 `[Stop] Init failed in default.dbj`, trace → print. 지난 게임 사망 콘솔 `You died in last game` → `[Died] Last game`(첫 사이클 동안 `[Died]`와 짝 확인 뒤 지울지 정함, 사용자 261103). MinGameTime catch `print(e1)` → `Misc.print("[Error] MinGameTime: " + e1)`. 줄별 목록은 커밋 `26b36ba`의 `drafts/log_policy/modify_list.md`(git 기록). 정책은 `CLAUDE.md` 4절.

### 261104 Claude: 로그 모양 정리 (사용자 승인 261104, handoff 3-66)
- 게임 경계 print `=== [게임 이름] ===` → `[게임 이름]`. 지난 게임 사망 콘솔 `[Died] Last game` 옆에 같은 문장 `print`(위치 없음). 두 `[Died]` 줄(죽은 순간 `lost=`, 다음 게임 `Last game`)은 둘 다 유지(사용자 261104: 죽음이 한쪽에서 안 잡힐 수 있다). `Last game`의 기준은 지난 게임 시작 때 저장한 경험치라 죽어서 잃은 양은 알 수 없다.

### 261105 사용자: 게임 경계 print 끔 (`1e53c1b`·`f10e021`)
- 게임 경계 print `[게임 이름]` → `게임 이름`(`1e53c1b`) → 주석 처리(`f10e021`). 주석 줄은 아래 3-68에서 삭제.

### 261105 Claude: 끝 줄 정리 — Script ended 리더 콘솔·팔로워 waitParty, Max game time 콘솔 리더만, 게임 이름 print 삭제 (사용자 승인 261105, handoff 3-68)
- 게임 이름 print(사용자가 261105 main에서 주석 처리한 `//print(me.gamename)`) 삭제. 이유(사용자 261105): 리더는 `[Starter] Create game: 이름`(`tools/OOG.js` createGame), 팔로워는 `[Starter] Join game: 이름`(`D2BotFollow.dbj`)이 같은 d2bs 로그에 이미 찍힌다. 이 두 줄은 입장 시도 때 찍히고, 실패는 다음 시도의 `Create game failed`·`Join game failed`로 남는다.
