# libs/Town.js

## fillTome

### 261001 Claude: TP 책 골드 게이트
- 문제: TP 책이 없으면 `checkScrolls(518)`가 0이라 5 게이트를 지나고, 골드 검사 없이 `initNPC`로 Akara에게 갔다. 레벨 1(골드 0)은 살 것이 없어 헛걸음.
- 동작: `initNPC` 앞 TP 전용 게이트 — TP 책 없음 + 골드 400 미만, 또는 TP 책 있음 + 골드 100 미만(TP 스크롤 값 100)이면 `return false`. 낱장 TP 스크롤을 세고 사던 분기는 도달할 수 없어 삭제(책 없이 낱장 사는 건 의미 없음, 사용자).
- 확인: 261006 로그에서 레벨 1 첫 시작에 Akara에 들르지 않음.

## identify

### 261001 Claude: 물건마다 감정 수단 고르기
- 문제: 감정 전 `tome`을 한 번만 정해, 낱장 ID 스크롤 1장이면 첫 물건만 감정하고 이후 물건은 없어진 스크롤로 패킷을 보내 6초씩 헛기다렸다(코드 추론, 멈춤 원인으로 확정은 아님).
- 동작: 물건마다 ID 책 충전(0이면 `fillTome(519)` 후 다시) → 인벤토리 낱장 ID 스크롤 → 상점 1장 구매(공간 없으면 TP 책 판매) → 없으면 중단.
- trace: `identify failed: 이름 (scroll|tome, Nms)`, `identify slow: 이름 (scroll|tome, Nms)`(2초 이상 걸린 성공), `identify stopped: no ID scroll for 이름 (gold N)`.
- 확인: 261006 로그에서 감정 멈춤 해소로 봄.

### 261004 Claude: 골드 부족이면 미감정으로 팔기
- 동작: ID 스크롤이 없고 레벨 25 미만, 상점에 ID 스크롤(530)이 있고 `me.gold < getItemCost(0)`이면 미감정으로 팔고 다음 물건으로. 그 밖은 `identify stopped` 후 중단. 유니크·세트 제외 조건은 없음.
- 확인: 261006·261013 로그 통과.

## getCorpse

### 261004 Claude: `quitOnFail` 인자 (보스 보호 시체 회수)
- `getCorpse(true)`면 실패 시 프로필 정지 대신 false를 돌려준다(`AutoSmurf.bossEnd`가 퇴장 처리). 인자 없이 부르는 곳은 예전대로 정지.
- 확인: `AutoSmurf.md` bossEnd 항목.

## visitTown

### 261004 Claude: Arreat Summit(120)에서 거부
- 정상(120)에서 TP를 열면 고대인이 리셋되므로(`D2BS_Structure.md` 확인된 사실) 120에서는 false. Pickit·화살 확인은 false를 받아도 반복하지 않음.
