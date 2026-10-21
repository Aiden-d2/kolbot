# libs/Pather.js

(Pather 정리 단계에서 나머지 함수를 채운다.)

## NodeAction.killMonsters

### 260927 사용자: spectype 인자 제거, 이동 중단 반환
- 카오스(108)는 `clear(20)`, 그 외 `clear(25)`. clear가 false면 `"killMonsters"`를 돌려 이동을 멈춘다(false는 사망·카우킹·스킬 미보유 정지일 때만).
