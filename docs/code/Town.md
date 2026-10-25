# libs/Town.js

## socketGems

### 261021~261023 사용자 결정: 소켓 보석 장착 (`02662d5`·`8730a5b`·`132bc5e`·`e9279d9`, 이름 정리 PR #73·#74, 옛 handoff 3-15)
- `doChores`의 `stash()` 뒤. 대상은 `Pickit.socketTargets`(`Pickit.md`). 보관함을 열지 않고 `sendPacket(1, 0x28, 4, 보석 gid, 4, 장비 gid)`.
- 성공: ItemLog `Socketed {nip 라인}`(넣은 뒤 `NTIP.Evaluate`), 매니저 아이템 로그 `Misc.logItem("Socketed", 장비, 라인)`, 매니저 콘솔 `[Socket] 보석 베이스 (찬/전체)` 색 5(베이스는 `getLocaleString(getBaseStat(0, classid, "namestr"))`), print `equipped: [칸] 티어`(`Equip.updateTier`). 261023 전 이름은 `Gemmed`·`# [Gem]`.
- 실패: 커서 보석은 인벤토리로, 안 되면 `Packet.dropItem` 뒤 `Pickit.pickItems()`, trace `socketGems failed: <보석> -> [칸] <장비>`(`(dropped)`).
- 경위(261021 사용자 로그): 장착 칸 클릭 `clickItem(0, 칸)`은 창을 닫아도·보관함을 열어도 커서에 남아 실패. 패킷 0x28은 보관함을 연 채·열지 않고도 성공. 참고: kolbot-SoloPlay도 0x28을 씀.
- 확인: 261022 0x28 성공 23건·261023 14건, 실패 0, 빈 소켓보다 많이 줍지 않음. 검증 통과(사용자 261023). `(cursor)` 표시와 `onCursor`는 261023 `0f6da09`에서 삭제(옛 handoff 3-28). 261025 로그에 `(cursor)` 0, 콘솔 `[Socket]` 29 = ItemLog `Socketed` 29(검증 통과 사용자 261025). 261023 이름 정리 뒤 모양은 지금 도는 로그(`33d3ae3`)에서 처음 보인다.

## heal

### 261021 Claude: 끝의 `me.cancel()` 삭제
- 260908 사용자가 넣은 heal 끝 `me.cancel()`을 지움(chores 멈춤 판별 정리 때). 다른 cancel은 유지(`stash` 시작의 cancel은 원본에도 있음). 261022 로그까지 문제 보고 없음.

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

### 261021 Claude: Town check 직접 처리 (`ab94751`·`3c31a5a`, 옛 handoff 3-5)
- `goToTown` 동안 `Config.TownCheck`를 꺼(끝나면 원래 값) 포털로 가는 moveTo 안의 재진입을 막음(직접 호출·화살통 경로 모두). 호출 쪽은 `Misc.md` townCheck.
- 확인: 261022 58건·261023 114건 모두 바로 출발, 마을행 중 또 마을행 0. 검증 통과(사용자 261023). 261023에 직접 마을행 중 TownChicken(HP)도 출발한 3건은 모두 0~7초 안에 Life Chicken으로 끝남(TownChicken은 별도 스레드).
