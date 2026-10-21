# libs/Attack.js

(Attack 정리 단계에서 나머지 함수를 채운다.)

## clear

### 261004 Claude: 보스 보호 훅 (`Attack.onBossLow`, 261020 사용자가 `bossScan`으로 이름 변경)
- 몬스터 스캔이 보스 유닛(`spec.ids` 일치)을 넘길 때 `AutoSmurf.bossGuard`가 넣은 훅을 부른다. 훅이 HP를 보고 치킨을 끈다(`AutoSmurf.md` bossGuard).
