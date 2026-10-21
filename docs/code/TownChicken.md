# threads/TownChicken.js

## main 루프

### 261004 Claude: Arreat Summit(120) 제외
- 루프 조건에 `me.area !== 120`. 없으면 HP 조건이 참인 동안 `Town.visitTown`이 120에서 거부해 매 틱 일시정지가 토글된다.
