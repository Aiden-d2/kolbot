# default.dbj

## main

### 261026 Claude: 시작부 오류를 멈춤으로 (`d87cfcb`, 사용자 결정, 옛 handoff 2-24·3-35)
- `Config.init`·`Attack.init`·`Storage.Init`·`Runewords.init`·`Cubing.init`(`Loader.init` 앞)을 try로 감싸고, catch에서 `Misc.errorReport(e, "default.dbj")`(회색 콘솔 + `[Error]` trace) → 빨강 콘솔 `Init failed in default.dbj. Stopping`(위치 없음) + trace → `D2Bot.stop()` → `return false`.
- 이유: 전에는 여기서 오류가 나면 default.dbj만 죽고 trace·콘솔에 아무것도 남지 않은 채 게임이 최대 게임 시간(30분)까지 서 있었다. 다시 시작해도 같은 코드라 복구되지 않는다(261026 로그 10/25 Pz-4~8, `Runewords` 쪽 `[].forEach is not a function`).
- 범위: 던져진 오류만. nip 로드(`Config.init` → `AutoBuild.initialize` → `Pickit.init`)도 이 안이지만, nip 줄 문법 오류는 파서가 던지지 않고 회색 콘솔로 알린 뒤 그 규칙만 건너뛴다(`NTItemParser.md`).
- 확인: 261027~261030 케이스 미발견(`Init failed` 0). 사용자 확정(261030), 줄은 재발 추적용으로 남김.
