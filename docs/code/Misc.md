# libs/Misc.js

## Packet.openMenu

### 261001 Claude: 대사 중이면 스페이스로 넘김 (유형 B 크래시)
- 문제: 대사 중 `me.cancel()`은 게임의 대사 입력 처리 표를 거치지 않고 화면을 지워 대사 콜백이 남는다 → 뒤에 NULL 메뉴 목록으로 크래시(Game.exe 0x661406, `crash_analysis.md` 유형 B).
- 동작: 대사 중이면 `Packet.skipTalk`(스페이스) → 메뉴가 뜨면 `Packet.endTalk`. 20번 넘으면 예전 `me.cancel()`.
- 클릭 대신 키: 클릭은 마우스 아래 유닛 조건이 있어 대사를 끝내지 않을 수 있다. ESC는 대사가 막 끝난 뒤 눌리면 게임 메뉴가 열린다. 스페이스는 허공에 눌리면 오토맵이 꺼져 endTalk에서 다시 켠다.
- 확인: 261001 a2 trace `[TK] talk skipped 1` 4건(모두 스페이스 한 번), `[TK] cancel during talk` 0건. 261004까지 덤프로 본 크래시 4건 중 유형 B 0건.

## Packet.skipTalk

### 261001 Claude: 대사 넘기기 (openMenu 항목 참고)
- 스페이스를 보내 대사를 정상 종료한다.

## Packet.endTalk

### 261001 Claude: 대사 끝 처리 (openMenu 항목 참고)
- trace `[TK] talk skipped <횟수> npc:<이름>`, 오토맵이 꺼져 있으면 다시 켬.
