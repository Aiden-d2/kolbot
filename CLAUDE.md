# kolbot (Diablo II D2Bot# / D2BS 스크립트)

- 주 봇 스크립트: `bots/AutoSmurf.js` / 공격 로직: `libs/Attack.js`, `libs/Attacks/<Class>.js`
- 코드 주석의 `//260916` 형태는 수정 일자(YYMMDD) 표기다.
- 삭제 대상은 지우지 않고 주석 처리하는 것이 이 저장소의 관례다 (복구용).
- 게임 실행 환경이 없으므로 검증은 정적 분석으로만 가능하다.

## 작업 규칙 (사용자 지시)
- **사용자가 올린 파일(`main`)은 어떤 경우에도 덮어쓰지 않는다.** 모든 변경은 작업 브랜치에만 남긴다. 통합·덮어쓰기는 사용자가 직접 검토하고 실행한다. PR 생성이나 `main` 병합도 요청이 있을 때만 한다.
- 브랜치에 반영된 내용은 확정으로 본다.
- `AutoSmurf.js`, `Reload.js`, `nips/*.nip`은 LF다 (260928 main 반영). 사용자의 로컬 파일은 CRLF일 수 있으므로 비교 시 `git diff --ignore-cr-at-eol`로 본다.

## 분석 노트
- Attack 계열(clear / clearList / setPosition / dodge) 현황과 미해결 결함: `docs/claude/attack_status.md`
- Attack 리팩터링 설계안(로직 흐름, 재검토 지점): `docs/claude/attack_design.md`
- 이전 코드와 현재 코드의 동작 대조표(모의 실행 결과): `docs/claude/attack_compare.md`
  작업 전 반드시 먼저 읽고, 결론이 바뀌면 이 노트를 갱신한다.
