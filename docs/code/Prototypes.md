# libs/Prototypes.js

## Unit.prototype.openMenu

### 261001 Claude: 대사 중이면 스페이스로 넘김 (유형 B 크래시)
- `Packet.openMenu`와 같은 처리(`Packet.skipTalk` → `Packet.endTalk`, 20번 넘으면 `me.cancel()`). `Config.PacketShopping`이 false일 때만 쓰는 자체 루프라 지금 설정(true)에서는 실행되지 않는다. 설정이 바뀔 경우 대비.

### 261102 Claude: 취소 패킷 사이 delay +100 (사용자 요청, 옛 handoff 2-28)
- 메뉴가 5초 안에 안 열렸을 때 보내는 취소 패킷(0x2f, 0x30) 뒤 `delay(me.ping * 2)` 2곳을 `delay(me.ping * 2 + 100)`으로. `me.ping`이 0이면 `delay(0)`이 되어 strict 경고가 났다.
- 261102 전체 `.js`·`.dbj` 집계(`delay(` 590개, 주석 3개 제외)에서 0이 될 수 있는 곳은 이 2곳뿐이었다. `Misc.poll`의 `sleep`(호출부 100·100·50, 기본 40)과 `Packet.flash`의 `wait`(모든 호출이 기본값 `300 + 2 * me.ping`, `wait > 0` 검사)은 0이 되지 않는다.
- `Config.PacketShopping`이 true(`Config.js`)라 지금은 실행되지 않는 자리여서 인게임 검증 없이 handoff에서 지움(사용자 261102).
