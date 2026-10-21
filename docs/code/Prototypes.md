# libs/Prototypes.js

## Unit.prototype.openMenu

### 261001 Claude: 대사 중이면 스페이스로 넘김 (유형 B 크래시)
- `Packet.openMenu`와 같은 처리(`Packet.skipTalk` → `Packet.endTalk`, 20번 넘으면 `me.cancel()`). `Config.PacketShopping`이 false일 때만 쓰는 자체 루프라 지금 설정(true)에서는 실행되지 않는다. 설정이 바뀔 경우 대비.
