# libs/Pickit.js

## checkItem

### 261021~261023 사용자 결정: 소켓 보석 줍기 (결과 5, 옛 handoff 3-15)
- Cubing 판정 앞. 바닥·인벤토리 보석만, 보석 레벨 제한 ≤ 캐릭 레벨. 인벤토리 보석(자기 제외, gid 순)을 대상 순서대로 미리 배정하고, 빈칸이 남은 대상이 이 보석을 받으면 5. nip 무관, 스태시로 가지 않음. 필요 없어지면 기존 판정. 줍기 직후 overhead `(Ingredient)`, ItemLog `Ingredient {가진 개수}`. 검증 통과(사용자 261023).

## socketTargets

### 261021~261023 사용자 결정: 소켓 보석 대상 (옛 handoff 3-15)
- 내 장착 칸 1(머리)·3(몸)·4·5(방패류 2·69·70이면 방패, 그 밖은 무기 — 활·지팡이·양손 무기·바바 두 번째 무기가 칸 5에 있어서) 중 티어가 있고(`NTIP.GetScore > 0`) 빈 소켓이 있으며 룬워드 베이스 재료가 아닌 것(`Config.RunewordRecipe`에서 classid 같고 `getBase` 참). 용병 제외. 부위별 보석 `Config.SocketRecipe`(261023 전 `SocketGems`, itemType 96~102 = 전 등급, classid 557~601 = 그 등급만, 빌드에서 덮어씀). 무기 레벨 18 제한 없음. `Config.Socketing: false`면 빈 목록(261023).
- 나중(사용자 결정): 빌드별 보석 종류 Config 값, 무기 룬 확장, 용병. 검증 통과(사용자 261023).

## canMakeRoom

### 261021 Claude: 0·4는 clearInventory와 같은 판정
- 문제: 0은 건너뛰고 4는 스태시 빈자리(`canStash`)로 판정해, 마을에서 비울 수 있는데도 `Not enough room`으로 줍기를 포기했다. 261021 사용자 기각이었으나 소켓 작업에서 같은 판정이 걸려 다시 보고 반영(사용자 결정 261021).
- 동작: 인벤토리 물건(`Storage.Inventory.Compare`)의 `checkItem` 결과가 0·4이고 `Town.ignoredCheck`가 참이면 자리를 만들 수 있다고 본다. clearInventory 인벤토리 정리와 같은 판정(0은 팔거나 버림, 4는 팖). 5(소켓 보석)는 건너뜀. 마을에서 돌아오면 `pickItems(10)`이 다시 줍는다.
- 감수: clearInventory의 4 판매가 계속 실패하면 마을 왕복이 반복된다(기존 코드도 스태시에 자리가 있으면 같음).
- 확인(261022 로그): trace `make room` 21건(4가 15, 0이 6) 모두 그 물건이 ItemLog `Sold`/`Dropped`, 같은 물건 되풀이 0. 확인용 trace `make room`·`make room skip`은 261022 삭제(skip은 보석을 훑을 때마다 찍혀 목적을 재지 못함).
