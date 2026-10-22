# libs/Pickit.js

## canMakeRoom

### 261021 Claude: 0·4는 clearInventory와 같은 판정
- 문제: 0은 건너뛰고 4는 스태시 빈자리(`canStash`)로 판정해, 마을에서 비울 수 있는데도 `Not enough room`으로 줍기를 포기했다. 261021 사용자 기각이었으나 소켓 작업에서 같은 판정이 걸려 다시 보고 반영(사용자 결정 261021).
- 동작: 인벤토리 물건(`Storage.Inventory.Compare`)의 `checkItem` 결과가 0·4이고 `Town.ignoredCheck`가 참이면 자리를 만들 수 있다고 본다. clearInventory 인벤토리 정리와 같은 판정(0은 팔거나 버림, 4는 팖). 5(소켓 보석)는 건너뜀. 마을에서 돌아오면 `pickItems(10)`이 다시 줍는다.
- 감수: clearInventory의 4 판매가 계속 실패하면 마을 왕복이 반복된다(기존 코드도 스태시에 자리가 있으면 같음).
- 확인(261022 로그): trace `make room` 21건(4가 15, 0이 6) 모두 그 물건이 ItemLog `Sold`/`Dropped`, 같은 물건 되풀이 0. 확인용 trace `make room`·`make room skip`은 261022 삭제(skip은 보석을 훑을 때마다 찍혀 목적을 재지 못함).
