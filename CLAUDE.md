# kolbot (Diablo II D2Bot# / D2BS 스크립트)

- 주 봇 스크립트: `bots/AutoSmurf.js` / 공격 로직: `libs/Attack.js`, `libs/Attacks/<Class>.js`
- 코드 주석의 `//260916` 형태는 수정 일자(YYMMDD) 표기다.
- 삭제 대상은 지우지 않고 주석 처리하는 것이 이 저장소의 관례다 (복구용).
- 게임 실행 환경이 없으므로 검증은 정적 분석으로만 가능하다.

## 분석 노트
- Attack 계열(clear / clearList / setPosition / dodge) 현황과 미해결 결함: `docs/claude/attack_status.md`
  작업 전 반드시 먼저 읽고, 결론이 바뀌면 이 노트를 갱신한다.
