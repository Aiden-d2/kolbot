# TC (트레저 클래스: 몬스터·상자 드랍 최대치)

지역별 일반·챔피언·유니크 몬스터와 상자, 슈퍼유니크·액트 보스가 떨어뜨릴 수 있는 최대 장비 TC와 최고 룬 (261104).

- 데이터: mpqdata(1.14d에서 추출) `levels.txt`·`monstats.txt`·`superuniques.txt`·`treasureclassex.txt`. 규칙: 1.14d `Game.exe`(FileVersion 1.14.3.71) 역어셈블로 확인(아래 주소). 값은 모두 이 규칙으로 계산한 것이다(261104).
- kolbot 사용처: 사냥 구간 선택(`bots/*`), 아이템 레벨이 필요한 판단

## 1. 규칙

| 항목 | 규칙 | 1.14d 근거 |
|---|---|---|
| 몬스터 종류별 TC | 일반 `TreasureClass1`, 챔피언 `TreasureClass2`, 유니크 `TreasureClass3`, 퀘스트 첫 처치 `TreasureClass4`(난이도별 `(N)`·`(H)` 열). 슈퍼유니크는 `superuniques.txt` `TC`·`TC(N)`·`TC(H)` | D2MOO `MonsterMode.cpp` 498~568줄(1.14d 함수 위치는 찾지 않음) |
| 몬스터 레벨 | 확장팩 나이트메어·헬: 지역 레벨(`levels.txt` `MonLvl2Ex`·`MonLvl3Ex`). `monstats.txt` `boss`·`noRatio` 클래스는 `Level(N)`·`Level(H)` | `0x61dca0`(지역 레벨 읽기) |
| 레벨 가산 | 유니크·슈퍼유니크 +3(umod 4 `leveladd`). 챔피언 +2(+3 후 champion umod의 −1). 챔피언 중 berserk는 +3(−1 없음) | `0x5a2120`(umod 1~4를 먼저 적용, `0x6e2168`), `0x5a0e40`(+3), `0x5a0e80`(−1), 적용 함수 표 `0x73c008` |
| TC 올림 | 확장팩·나이트메어 이상·`boss`/`noRatio`가 아닌 몬스터만. 몬스터 TC에서 시작해, 다음 기록이 같은 `group`이고 그 `level` ≤ 몬스터 레벨이면 다음으로 옮긴다. 내리지 않는다 | `0x55afa0`(조건), `0x654e00`(루프) |
| TC 기록 순서 | `treasureclassex.txt` 줄 순서 그대로. 그래서 같은 group이면 난이도를 넘거나(나이트메어 → 헬 TC) 줄 순서상 다음인 "x" TC로 옮겨 갈 수 있다 | `0x654c3d~`(불러오기), `0x653f90`(기록 추가) |
| 상자 | 지역 레벨이 그 액트 첫·끝 지역(2–37, 41–73, 76–102, 104–108, 109–136) 레벨 범위의 아래·가운데·위 1/3인지로 `Act N (난이도) Chest A/B/C`. 올림 없음. 레벨 없는 지역(마을)은 0 | `0x585b90`, 지역 표 `0x6e1988` |
| 기본 아이템 TC | `weapNN`·`armoNN` = 아이템 레벨을 3 단위로 올린 값(`weapons.txt`·`armor.txt` `level`) | mpqdata 대조(261104) |

- 표의 "장비 TC / 룬" = 그 TC에서 도달할 수 있는 가장 높은 `weap`/`armo` 번호와 가장 높은 룬. TC 안의 확률은 반영하지 않았다.
- 지역 값 = 그 지역 `nmon1~10`(나이트메어·헬 몬스터 목록) 몬스터 중 최댓값. 목록이 빈 지역은 `-`.

## 2. 지역 (나이트메어)

| ID | 지역 | 레벨 | 일반 | 챔피언 (+2) | 유니크 (+3) | 상자 |
|---|---|---|---|---|---|---|
| 2 | Blood Moor | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 3 | Cold Plains | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 4 | Stony Field | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 5 | Dark Wood | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 6 | Black Marsh | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 7 | Tamoe Highland | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 8 | Den of Evil | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 9 | Cave Level 1 | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 10 | Underground Passage Level 1 | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 11 | Hole Level 1 | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 12 | Pit Level 1 | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 13 | Cave Level 2 | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 14 | Underground Passage Level 2 | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 15 | Hole Level 2 | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 16 | Pit Level 2 | 40 | 42 / Io | 45 / Ko | 45 / Ko | C: 42 / Io |
| 17 | Burial Grounds | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 18 | Crypt | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 19 | Mausoleum | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 21 | Tower Cellar Level 1 | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 22 | Tower Cellar Level 2 | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 23 | Tower Cellar Level 3 | 40 | 42 / Io | 45 / Ko | 45 / Ko | C: 42 / Io |
| 24 | Tower Cellar Level 4 | 41 | 42 / Io | 45 / Ko | 48 / Ko | C: 42 / Io |
| 25 | Tower Cellar Level 5 | 42 | 45 / Ko | 48 / Ko | 48 / Ko | C: 42 / Io |
| 26 | Monastery Gate | 40 | 42 / Io | 45 / Ko | 45 / Ko | C: 42 / Io |
| 27 | Outer Cloister | 40 | 42 / Io | 45 / Ko | 45 / Ko | C: 42 / Io |
| 28 | Barracks | 40 | 42 / Io | 45 / Ko | 45 / Ko | C: 42 / Io |
| 29 | Jail Level 1 | 41 | 42 / Io | 45 / Ko | 48 / Ko | C: 42 / Io |
| 30 | Jail Level 2 | 41 | 42 / Io | 45 / Ko | 48 / Ko | C: 42 / Io |
| 31 | Jail Level 3 | 41 | 42 / Io | 45 / Ko | 48 / Ko | C: 42 / Io |
| 32 | Inner Cloister | 41 | 42 / Io | 45 / Ko | 48 / Ko | C: 42 / Io |
| 33 | Cathedral | 42 | 45 / Ko | 48 / Ko | 48 / Ko | C: 42 / Io |
| 34 | Catacombs Level 1 | 42 | 45 / Ko | 48 / Ko | 48 / Ko | C: 42 / Io |
| 35 | Catacombs Level 2 | 42 | 45 / Ko | 48 / Ko | 48 / Ko | C: 42 / Io |
| 36 | Catacombs Level 3 | 43 | 48 / Ko | 48 / Ko | 51 / Lem | C: 42 / Io |
| 37 | Catacombs Level 4 | 43 | 48 / Ko | 48 / Ko | 51 / Lem | C: 42 / Io |
| 38 | Tristram | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 39 | Moo Moo Farm | 64 | 60 / Ist | 66 / Vex | 66 / Vex | C: 42 / Io |
| 41 | Rocky Waste | 43 | 45 / Ko | 48 / Ko | 51 / Lem | A: 45 / Ko |
| 42 | Dry Hills | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 43 | Far Oasis | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 44 | Lost City | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 45 | Valley of Snakes | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 46 | Canyon of the Magi | 48 | 51 / Lem | 51 / Lem | 54 / Um | C: 48 / Ko |
| 47 | Sewers Level 1 | 43 | 45 / Ko | 48 / Ko | 51 / Lem | A: 45 / Ko |
| 48 | Sewers Level 2 | 43 | 45 / Ko | 48 / Ko | 51 / Lem | A: 45 / Ko |
| 49 | Sewers Level 3 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 51 | Harem Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 52 | Palace Cellar Level 1 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 53 | Palace Cellar Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 54 | Palace Cellar Level 3 | 48 | 51 / Lem | 51 / Lem | 54 / Um | C: 48 / Ko |
| 55 | Stony Tomb Level 1 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 56 | Halls of the Dead Level 1 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 57 | Halls of the Dead Level 2 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 58 | Claw Viper Temple Level 1 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 59 | Stony Tomb Level 2 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 60 | Halls of the Dead Level 3 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 61 | Claw Viper Temple Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 62 | Maggot Lair Level 1 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 63 | Maggot Lair Level 2 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 64 | Maggot Lair Level 3 | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 65 | Ancient Tunnels | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 66 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 67 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 68 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 69 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 70 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 71 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 72 | Tal Rasha's Tomb | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 73 | Duriel's Lair | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 74 | Arcane Sanctuary | 48 | 51 / Lem | 51 / Lem | 54 / Um | C: 48 / Ko |
| 76 | Spider Forest | 49 | 51 / Lem | 54 / Um | 54 / Um | A: 51 / Lem |
| 77 | Great Marsh | 50 | 51 / Lem | 54 / Um | 54 / Um | A: 51 / Lem |
| 78 | Flayer Jungle | 50 | 51 / Lem | 54 / Um | 54 / Um | A: 51 / Lem |
| 79 | Lower Kurast | 52 | 54 / Um | 57 / Um | 57 / Um | B: 51 / Lem |
| 80 | Kurast Bazaar | 52 | 54 / Um | 57 / Um | 57 / Um | B: 51 / Lem |
| 81 | Upper Kurast | 52 | 54 / Um | 57 / Um | 57 / Um | B: 51 / Lem |
| 82 | Kurast Causeway | 53 | 54 / Um | 57 / Um | 57 / Um | C: 51 / Lem |
| 83 | Travincal | 54 | 57 / Um | 57 / Um | 60 / Ist | C: 51 / Lem |
| 84 | Spider Cave | 50 | 51 / Lem | 54 / Um | 54 / Um | A: 51 / Lem |
| 85 | Spider Cavern | 50 | 51 / Lem | 54 / Um | 54 / Um | A: 51 / Lem |
| 86 | Swampy Pit Level 1 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 87 | Swampy Pit Level 2 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 88 | Flayer Dungeon Level 1 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 89 | Flayer Dungeon Level 2 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 90 | Swampy Pit Level 3 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 91 | Flayer Dungeon Level 3 | 51 | 54 / Um | 54 / Um | 57 / Um | B: 51 / Lem |
| 92 | Sewers Level 1 | 52 | 54 / Um | 57 / Um | 57 / Um | B: 51 / Lem |
| 93 | Sewers Level 2 | 53 | 54 / Um | 57 / Um | 57 / Um | C: 51 / Lem |
| 94 | Ruined Temple | 53 | 54 / Um | 57 / Um | 57 / Um | C: 51 / Lem |
| 95 | Disused Fane | 53 | 54 / Um | 57 / Um | 57 / Um | C: 51 / Lem |
| 96 | Forgotten Reliquary | 53 | 54 / Um | 57 / Um | 57 / Um | C: 51 / Lem |
| 97 | Forgotten Temple | 54 | 57 / Um | 57 / Um | 60 / Ist | C: 51 / Lem |
| 98 | Ruined Fane | 54 | 57 / Um | 57 / Um | 60 / Ist | C: 51 / Lem |
| 99 | Disused Reliquary | 54 | 57 / Um | 57 / Um | 60 / Ist | C: 51 / Lem |
| 100 | Durance of Hate Level 1 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 101 | Durance of Hate Level 2 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 102 | Durance of Hate Level 3 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 104 | Outer Steppes | 56 | 57 / Um | 60 / Ist | 60 / Ist | A: 54 / Um |
| 105 | Plains of Despair | 56 | 57 / Um | 60 / Ist | 60 / Ist | A: 54 / Um |
| 106 | City of the Damned | 57 | 60 / Ist | 60 / Ist | 60 / Ist | B: 57 / Um |
| 107 | River of Flame | 57 | 60 / Ist | 60 / Ist | 60 / Ist | B: 57 / Um |
| 108 | Chaos Sanctum | 58 | 60 / Ist | 60 / Ist | 60 / Ist | C: 57 / Um |
| 110 | Bloody Foothills | 58 | 60 / Ist | 60 / Ist | 60 / Ist | C: 60 / Ist |
| 111 | Rigid Highlands | 59 | 63 / Ist | 63 / Ist | 63 / Ist | C: 60 / Ist |
| 112 | Arreat Plateau | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 113 | Crystalized Cavern Level 1 | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 114 | Cellar of Pity | 61 | 60 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 115 | Crystalized Cavern Level 2 | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 116 | Echo Chamber | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 117 | Tundra Wastelands | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 118 | Glacial Caves Level 1 | 62 | 63 / Vex | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 119 | Glacial Caves Level 2 | 62 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 120 | Rocky Summit | 68 | - / - | - / - | - / - | C: 60 / Ist |
| 121 | Nihlathaks Temple | 63 | - / - | - / - | - / - | C: 60 / Ist |
| 122 | Halls of Anguish | 63 | 63 / Vex | 63 / Vex | 66 / Vex | C: 60 / Ist |
| 123 | Halls of Death's Calling | 64 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 124 | Halls of Vaught | 64 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 125 | Hell1 | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 126 | Hell2 | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 127 | Hell3 | 62 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 128 | The Worldstone Keep Level 1 | 65 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 129 | The Worldstone Keep Level 2 | 65 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 130 | The Worldstone Keep Level 3 | 66 | 66 / Vex | 66 / Vex | 69 / Lo | C: 60 / Ist |
| 131 | Throne of Destruction | 66 | 66 / Vex | 66 / Vex | 69 / Lo | C: 60 / Ist |
| 132 | The Worldstone Chamber | 66 | - / - | - / - | - / - | C: 60 / Ist |
| 133 | Pandemonium Run 1 | 75 | 75 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 134 | Pandemonium Run 2 | 75 | 72 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 135 | Pandemonium Run 3 | 75 | 75 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 136 | Tristram | 75 | - / - | - / - | - / - | C: 60 / Ist |

## 2. 지역 (헬)

| ID | 지역 | 레벨 | 일반 | 챔피언 (+2) | 유니크 (+3) | 상자 |
|---|---|---|---|---|---|---|
| 2 | Blood Moor | 67 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 3 | Cold Plains | 68 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 4 | Stony Field | 68 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 5 | Dark Wood | 68 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 6 | Black Marsh | 69 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 7 | Tamoe Highland | 69 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 8 | Den of Evil | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 66 / Vex |
| 9 | Cave Level 1 | 77 | 75 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 10 | Underground Passage Level 1 | 69 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 11 | Hole Level 1 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 66 / Vex |
| 12 | Pit Level 1 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 13 | Cave Level 2 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | C: 66 / Vex |
| 14 | Underground Passage Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 15 | Hole Level 2 | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 16 | Pit Level 2 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 17 | Burial Grounds | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 66 / Vex |
| 18 | Crypt | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 19 | Mausoleum | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 21 | Tower Cellar Level 1 | 75 | 75 / Ber | 75 / Ber | 78 / Cham | C: 66 / Vex |
| 22 | Tower Cellar Level 2 | 76 | 75 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 23 | Tower Cellar Level 3 | 77 | 75 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 24 | Tower Cellar Level 4 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | C: 66 / Vex |
| 25 | Tower Cellar Level 5 | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 66 / Vex |
| 26 | Monastery Gate | 70 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 27 | Outer Cloister | 70 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 28 | Barracks | 70 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 29 | Jail Level 1 | 71 | 69 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 30 | Jail Level 2 | 71 | 69 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 31 | Jail Level 3 | 71 | 69 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 32 | Inner Cloister | 72 | 69 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 33 | Cathedral | 72 | 69 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 34 | Catacombs Level 1 | 72 | 69 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 35 | Catacombs Level 2 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 36 | Catacombs Level 3 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 37 | Catacombs Level 4 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 38 | Tristram | 76 | 75 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 39 | Moo Moo Farm | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 41 | Rocky Waste | 75 | 75 / Ber | 75 / Ber | 78 / Cham | A: 69 / Lo |
| 42 | Dry Hills | 76 | 75 / Ber | 78 / Cham | 78 / Cham | A: 69 / Lo |
| 43 | Far Oasis | 76 | 75 / Ber | 78 / Cham | 78 / Cham | A: 69 / Lo |
| 44 | Lost City | 77 | 75 / Ber | 78 / Cham | 78 / Cham | B: 69 / Lo |
| 45 | Valley of Snakes | 77 | 75 / Ber | 78 / Cham | 78 / Cham | B: 69 / Lo |
| 46 | Canyon of the Magi | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 47 | Sewers Level 1 | 74 | 72 / Ber | 75 / Ber | 75 / Ber | A: 69 / Lo |
| 48 | Sewers Level 2 | 74 | 72 / Ber | 75 / Ber | 75 / Ber | A: 69 / Lo |
| 49 | Sewers Level 3 | 75 | 75 / Ber | 75 / Ber | 78 / Cham | A: 69 / Lo |
| 51 | Harem Level 2 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 52 | Palace Cellar Level 1 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 53 | Palace Cellar Level 2 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 54 | Palace Cellar Level 3 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 55 | Stony Tomb Level 1 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 56 | Halls of the Dead Level 1 | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 57 | Halls of the Dead Level 2 | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 58 | Claw Viper Temple Level 1 | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 59 | Stony Tomb Level 2 | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 60 | Halls of the Dead Level 3 | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 61 | Claw Viper Temple Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 62 | Maggot Lair Level 1 | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 63 | Maggot Lair Level 2 | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 64 | Maggot Lair Level 3 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 65 | Ancient Tunnels | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 66 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 67 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 68 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 69 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 70 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 71 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 72 | Tal Rasha's Tomb | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 73 | Duriel's Lair | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 74 | Arcane Sanctuary | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 76 | Spider Forest | 79 | 78 / Cham | 84 / Zod | 84 / Zod | A: 72 / Ber |
| 77 | Great Marsh | 80 | 78 / Cham | 84 / Zod | 87 / Zod | B: 75 / Ber |
| 78 | Flayer Jungle | 80 | 78 / Cham | 84 / Zod | 87 / Zod | B: 75 / Ber |
| 79 | Lower Kurast | 80 | 78 / Cham | 84 / Zod | 87 / Zod | B: 75 / Ber |
| 80 | Kurast Bazaar | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 81 | Upper Kurast | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 82 | Kurast Causeway | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 83 | Travincal | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 84 | Spider Cave | 79 | 78 / Cham | 84 / Zod | 84 / Zod | A: 72 / Ber |
| 85 | Spider Cavern | 79 | 78 / Cham | 84 / Zod | 84 / Zod | A: 72 / Ber |
| 86 | Swampy Pit Level 1 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | B: 75 / Ber |
| 87 | Swampy Pit Level 2 | 81 | 78 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 88 | Flayer Dungeon Level 1 | 81 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 89 | Flayer Dungeon Level 2 | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 90 | Swampy Pit Level 3 | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 91 | Flayer Dungeon Level 3 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 92 | Sewers Level 1 | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 93 | Sewers Level 2 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 94 | Ruined Temple | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 95 | Disused Fane | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 96 | Forgotten Reliquary | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 97 | Forgotten Temple | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 98 | Ruined Fane | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 99 | Disused Reliquary | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 100 | Durance of Hate Level 1 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 101 | Durance of Hate Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 102 | Durance of Hate Level 3 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 104 | Outer Steppes | 82 | 84 / Zod | 87 / Zod | 87 / Zod | A: 78 / Cham |
| 105 | Plains of Despair | 83 | 87 / Zod | 87 / Zod | 87 / Zod | B: 78 / Cham |
| 106 | City of the Damned | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 107 | River of Flame | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 108 | Chaos Sanctum | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 110 | Bloody Foothills | 80 | 84 / Zod | 84 / Zod | 87 / Zod | C: 87 / Zod |
| 111 | Rigid Highlands | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 112 | Arreat Plateau | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 113 | Crystalized Cavern Level 1 | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 114 | Cellar of Pity | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 115 | Crystalized Cavern Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 116 | Echo Chamber | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 117 | Tundra Wastelands | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 118 | Glacial Caves Level 1 | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 119 | Glacial Caves Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 120 | Rocky Summit | 87 | - / - | - / - | - / - | C: 87 / Zod |
| 121 | Nihlathaks Temple | 83 | - / - | - / - | - / - | C: 87 / Zod |
| 122 | Halls of Anguish | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 123 | Halls of Death's Calling | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 124 | Halls of Vaught | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 125 | Hell1 | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 126 | Hell2 | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 127 | Hell3 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 128 | The Worldstone Keep Level 1 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 129 | The Worldstone Keep Level 2 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 130 | The Worldstone Keep Level 3 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 131 | Throne of Destruction | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 132 | The Worldstone Chamber | 85 | - / - | - / - | - / - | C: 87 / Zod |
| 133 | Pandemonium Run 1 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 134 | Pandemonium Run 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 135 | Pandemonium Run 3 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 136 | Tristram | 83 | - / - | - / - | - / - | C: 87 / Zod |

## 3. 슈퍼유니크 (나이트메어)

- 레벨 = 기본 레벨 + 3. 기본 레벨은 지역 레벨, `boss`·`noRatio` 클래스(표의 B)는 `monstats` 레벨(올림 없음).
- 지역(슈퍼유니크가 나오는 지역)은 mpqdata에 없는 정보라 따로 지정했다(근거: 웹 미검증). 지역 칸이 빈 13명은 지정하지 못해 레벨·올림을 계산하지 않았다(기본 TC 값만).

| hcIdx | Superunique | 클래스 | 지역 | 레벨 | 기본 TC | 올린 TC | 장비 TC / 룬 |
|---|---|---|---|---|---|---|---|
| 0 | Bishibosh | fallenshaman1 | 3 Cold Plains | 39 | Act 1 (N) Super A |  | 42 / Io |
| 1 | Bonebreak | skeleton1 | 18 Crypt | 40 | Act 1 (N) Super A |  | 42 / Io |
| 2 | Coldcrow | cr_archer1 | 9 Cave Level 1 | 39 | Act 1 (N) Super A |  | 42 / Io |
| 3 | Rakanishu | fallen2 | 4 Stony Field | 40 | Act 1 (N) Super B |  | 42 / Io |
| 4 | Treehead WoodFist | brute2 | 5 Dark Wood | 41 | Act 1 (N) Super B |  | 42 / Io |
| 5 | Griswold | griswold (B) | 38 Tristram | 42 | Griswold (N) |  | 66 / Vex |
| 6 | The Countess | corruptrogue3 | 25 Tower Cellar Level 5 | 45 | Countess (N) |  | 45 / Ko |
| 7 | Pitspawn Fouldog | bighead2 | 30 Jail Level 2 | 44 | Act 1 (N) Super B | Act 2 (N) Super A | 45 / Ko |
| 8 | Flamespike the Crawler | quillrat4 |  |  | Act 1 (N) Unique C |  | 42 / Io |
| 9 | Boneash | skmage_pois3 | 33 Cathedral | 45 | Act 1 (N) Super C | Act 2 (N) Super B | 48 / Ko |
| 10 | Radament | radament (B) | 49 Sewers Level 3 | 52 | Radament (N) |  | 51 / Lem |
| 11 | Bloodwitch the Wild | pantherwoman1 | 60 Halls of the Dead Level 3 | 48 | Act 2 (N) Super A | Act 3 (N) Super A | 51 / Lem |
| 12 | Fangskin | clawviper3 | 61 Claw Viper Temple Level 2 | 50 | Act 2 (N) Super B | Act 3 (N) Super B | 51 / Lem |
| 13 | Beetleburst | scarab2 | 43 Far Oasis | 48 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 14 | Leatherarm | mummy2 | 59 Stony Tomb Level 2 | 47 | Act 2 (N) Super A | Act 2 (N) Super C | 48 / Ko |
| 15 | Coldworm the Burrower | maggotqueen1 | 64 Maggot Lair Level 3 | 49 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 16 | Fire Eye | sandraider3 | 54 Palace Cellar Level 3 | 51 | Act 2 (N) Super B | Act 3 (N) Super C | 51 / Lem |
| 17 | Dark Elder | zombie5 | 44 Lost City | 49 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 18 | The Summoner | summoner (B) | 74 Arcane Sanctuary | 58 | Summoner (N) |  | 48 / Ko |
| 19 | Ancient Kaa the Soulless | unraveler3 | 66 Tal Rasha's Tomb | 52 | Act 2 (N) Super C | Act 3 (N) Super C | 51 / Lem |
| 20 | The Smith | smith | 28 Barracks | 43 | Smith (N) |  | 66 / Vex |
| 21 | Web Mage the Burning | arach4 | 84 Spider Cave | 53 | Act 3 (N) Super A | Act 3 (N) Super C | 51 / Lem |
| 22 | Witch Doctor Endugu | fetishshaman4 | 91 Flayer Dungeon Level 3 | 54 | Act 3 (N) Super B | Act 4 (N) Super A | 54 / Um |
| 23 | Stormtree | thornhulk3 | 78 Flayer Jungle | 53 | Act 3 (N) Super B | Act 3 (N) Super C | 51 / Lem |
| 24 | Sarina the Battlemaid | corruptrogue5 | 94 Ruined Temple | 56 | Act 3 (N) Super B | Act 4 (N) Super A | 54 / Um |
| 25 | Icehawk Riftwing | batdemon3 | 92 Sewers Level 1 | 55 | Act 3 (N) Super A | Act 4 (N) Super A | 54 / Um |
| 26 | Ismail Vilehand | councilmember1 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 27 | Geleb Flamefinger | councilmember2 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 28 | Bremm Sparkfist | councilmember3 | 102 Durance of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 29 | Toorc Icefist | councilmember1 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 30 | Wyand Voidfinger | councilmember2 | 102 Durance of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 31 | Maffer Dragonhand | councilmember3 | 102 Durance of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 32 | Winged Death | megademon3 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 33 | The Tormentor | willowisp3 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 34 | Taintbreeder | vilemother2 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 35 | Riftwraith the Cannibal | regurgitator2 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 36 | Infector of Souls | megademon3 | 108 Chaos Sanctum | 61 | Act 4 (N) Super B | Act 4 (N) Super C | 57 / Um |
| 37 | Lord De Seis | doomknight3 | 108 Chaos Sanctum | 61 | Act 4 (N) Super C |  | 57 / Um |
| 38 | Grand Vizier of Chaos | fingermage3 | 108 Chaos Sanctum | 61 | Act 4 (N) Super B | Act 4 (N) Super C | 57 / Um |
| 39 | The Cow King | hellbovine | 39 Moo Moo Farm | 67 | Cow King (N) |  | 66 / Vex |
| 40 | Corpsefire | zombie1 | 8 Den of Evil | 39 | Act 1 (N) Super A |  | 42 / Io |
| 41 | The Feature Creep | hephasto | 107 River of Flame | 60 | Haphesto (N) |  | 60 / Ist |
| 42 | Siege Boss | overseer1 | 110 Bloody Foothills | 61 | Act 5 (N) Super A |  | 60 / Ist |
| 43 | Ancient Barbarian 1 | ancientbarb1 |  |  | - |  | - / - |
| 44 | Ancient Barbarian 2 | ancientbarb2 |  |  | - |  | - / - |
| 45 | Ancient Barbarian 3 | ancientbarb3 |  |  | - |  | - / - |
| 46 | Axe Dweller | bloodlord3 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 47 | Bonesaw Breaker | reanimatedhorde2 | 115 Crystalized Cavern Level 2 | 64 | Act 5 (N) Super A | Act 5 (N) Super B | 60 / Ist |
| 48 | Dac Farren | imp3 | 110 Bloody Foothills | 61 | Act 5 (N) Super B |  | 60 / Ist |
| 49 | Megaflow Rectifier | minion1 | 111 Rigid Highlands | 62 | Act 5 (N) Super A |  | 60 / Ist |
| 50 | Eyeback Unleashed | deathmauler1 | 111 Rigid Highlands | 62 | Act 5 (N) Super A |  | 60 / Ist |
| 51 | Threash Socket | siegebeast3 | 112 Arreat Plateau | 63 | Act 5 (N) Super Cx |  | 63 / Ist |
| 52 | Pindleskin | reanimatedhorde5 | 121 Nihlathaks Temple | 66 | Act 5 (N) Super Cx |  | 63 / Ist |
| 53 | Snapchip Shatter | frozenhorror1 | 119 Glacial Caves Level 2 | 65 | Act 5 (N) Super C |  | 63 / Ist |
| 54 | Anodized Elite | succubus4 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 55 | Vinvear Molech | succubuswitch2 |  |  | Act 5 (N) Super A |  | 60 / Ist |
| 56 | Sharp Tooth Sayer | overseer3 | 111 Rigid Highlands | 62 | Act 5 (N) Super B |  | 60 / Ist |
| 57 | Magma Torquer | imp5 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 58 | Blaze Ripper | deathmauler5 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 59 | Frozenstein | snowyeti4 | 114 Cellar of Pity | 64 | Act 5 (N) Super C |  | 63 / Ist |
| 60 | Nihlathak Boss | nihlathakboss (B) | 124 Halls of Vaught | 73 | Nihlathak (N) |  | 60 / Ist |
| 61 | Baal Subject 1 | fallenshaman5 | 131 Throne of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 62 | Baal Subject 2 | unraveler5 | 131 Throne of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 63 | Baal Subject 3 | baalhighpriest | 131 Throne of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 64 | Baal Subject 4 | venomlord | 131 Throne of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 65 | Baal Subject 5 | baalminion1 | 131 Throne of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |

## 3. 슈퍼유니크 (헬)

- 레벨 = 기본 레벨 + 3. 기본 레벨은 지역 레벨, `boss`·`noRatio` 클래스(표의 B)는 `monstats` 레벨(올림 없음).
- 지역(슈퍼유니크가 나오는 지역)은 mpqdata에 없는 정보라 따로 지정했다(근거: 웹 미검증). 지역 칸이 빈 13명은 지정하지 못해 레벨·올림을 계산하지 않았다(기본 TC 값만).

| hcIdx | Superunique | 클래스 | 지역 | 레벨 | 기본 TC | 올린 TC | 장비 TC / 룬 |
|---|---|---|---|---|---|---|---|
| 0 | Bishibosh | fallenshaman1 | 3 Cold Plains | 71 | Act 1 (H) Super A | Act 2 (H) Super B | 69 / Lo |
| 1 | Bonebreak | skeleton1 | 18 Crypt | 86 | Act 1 (H) Super A | Act 4 (H) Super B | 78 / Cham |
| 2 | Coldcrow | cr_archer1 | 9 Cave Level 1 | 80 | Act 1 (H) Super A | Act 3 (H) Super C | 75 / Ber |
| 3 | Rakanishu | fallen2 | 4 Stony Field | 71 | Act 1 (H) Super B | Act 2 (H) Super B | 69 / Lo |
| 4 | Treehead WoodFist | brute2 | 5 Dark Wood | 71 | Act 1 (H) Super B | Act 2 (H) Super B | 69 / Lo |
| 5 | Griswold | griswold (B) | 38 Tristram | 87 | Griswold (H) |  | 66 / Vex |
| 6 | The Countess | corruptrogue3 | 25 Tower Cellar Level 5 | 82 | Countess (H) |  | 66 / Lo |
| 7 | Pitspawn Fouldog | bighead2 | 30 Jail Level 2 | 74 | Act 1 (H) Super B | Act 3 (H) Super A | 72 / Ber |
| 8 | Flamespike the Crawler | quillrat4 |  |  | Act 1 (H) Unique C |  | 66 / Vex |
| 9 | Boneash | skmage_pois3 | 33 Cathedral | 75 | Act 1 (H) Super C | Act 3 (H) Super B | 75 / Ber |
| 10 | Radament | radament (B) | 49 Sewers Level 3 | 86 | Radament (H) |  | 75 / Ber |
| 11 | Bloodwitch the Wild | pantherwoman1 | 60 Halls of the Dead Level 3 | 85 | Act 2 (H) Super A | Act 4 (H) Super B | 78 / Cham |
| 12 | Fangskin | clawviper3 | 61 Claw Viper Temple Level 2 | 86 | Act 2 (H) Super B | Act 4 (H) Super B | 78 / Cham |
| 13 | Beetleburst | scarab2 | 43 Far Oasis | 79 | Act 2 (H) Super B | Act 3 (H) Super C | 75 / Ber |
| 14 | Leatherarm | mummy2 | 59 Stony Tomb Level 2 | 82 | Act 2 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 15 | Coldworm the Burrower | maggotqueen1 | 64 Maggot Lair Level 3 | 88 | Act 2 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 16 | Fire Eye | sandraider3 | 54 Palace Cellar Level 3 | 81 | Act 2 (H) Super B | Act 4 (H) Super A | 78 / Cham |
| 17 | Dark Elder | zombie5 | 44 Lost City | 80 | Act 2 (H) Super B | Act 3 (H) Super C | 75 / Ber |
| 18 | The Summoner | summoner (B) | 74 Arcane Sanctuary | 83 | Summoner (H) |  | 72 / Lo |
| 19 | Ancient Kaa the Soulless | unraveler3 | 66 Tal Rasha's Tomb | 83 | Act 2 (H) Super C | Act 4 (H) Super A | 78 / Cham |
| 20 | The Smith | smith | 28 Barracks | 73 | Smith (H) |  | 66 / Vex |
| 21 | Web Mage the Burning | arach4 | 84 Spider Cave | 82 | Act 3 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 22 | Witch Doctor Endugu | fetishshaman4 | 91 Flayer Dungeon Level 3 | 86 | Act 3 (H) Super B | Act 4 (H) Super B | 78 / Cham |
| 23 | Stormtree | thornhulk3 | 78 Flayer Jungle | 83 | Act 3 (H) Super B | Act 4 (H) Super A | 78 / Cham |
| 24 | Sarina the Battlemaid | corruptrogue5 | 94 Ruined Temple | 87 | Act 3 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 25 | Icehawk Riftwing | batdemon3 | 92 Sewers Level 1 | 87 | Act 3 (H) Super A | Act 4 (H) Super C | 78 / Cham |
| 26 | Ismail Vilehand | councilmember1 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 27 | Geleb Flamefinger | councilmember2 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 28 | Bremm Sparkfist | councilmember3 | 102 Durance of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 29 | Toorc Icefist | councilmember1 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 30 | Wyand Voidfinger | councilmember2 | 102 Durance of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 31 | Maffer Dragonhand | councilmember3 | 102 Durance of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 32 | Winged Death | megademon3 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 33 | The Tormentor | willowisp3 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 34 | Taintbreeder | vilemother2 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 35 | Riftwraith the Cannibal | regurgitator2 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 36 | Infector of Souls | megademon3 | 108 Chaos Sanctum | 88 | Act 4 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 37 | Lord De Seis | doomknight3 | 108 Chaos Sanctum | 88 | Act 4 (H) Super C |  | 78 / Cham |
| 38 | Grand Vizier of Chaos | fingermage3 | 108 Chaos Sanctum | 88 | Act 4 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 39 | The Cow King | hellbovine | 39 Moo Moo Farm | 84 | Cow King (H) |  | 66 / Vex |
| 40 | Corpsefire | zombie1 | 8 Den of Evil | 82 | Act 1 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 41 | The Feature Creep | hephasto | 107 River of Flame | 88 | Haphesto (H) |  | 84 / Zod |
| 42 | Siege Boss | overseer1 | 110 Bloody Foothills | 83 | Act 5 (H) Super A |  | 84 / Zod |
| 43 | Ancient Barbarian 1 | ancientbarb1 |  |  | - |  | - / - |
| 44 | Ancient Barbarian 2 | ancientbarb2 |  |  | - |  | - / - |
| 45 | Ancient Barbarian 3 | ancientbarb3 |  |  | - |  | - / - |
| 46 | Axe Dweller | bloodlord3 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 47 | Bonesaw Breaker | reanimatedhorde2 | 115 Crystalized Cavern Level 2 | 86 | Act 5 (H) Super A |  | 84 / Zod |
| 48 | Dac Farren | imp3 | 110 Bloody Foothills | 83 | Act 5 (H) Super B |  | 87 / Zod |
| 49 | Megaflow Rectifier | minion1 | 111 Rigid Highlands | 84 | Act 5 (H) Super A |  | 84 / Zod |
| 50 | Eyeback Unleashed | deathmauler1 | 111 Rigid Highlands | 84 | Act 5 (H) Super A |  | 84 / Zod |
| 51 | Threash Socket | siegebeast3 | 112 Arreat Plateau | 84 | Act 5 (H) Super Cx |  | 87 / Zod |
| 52 | Pindleskin | reanimatedhorde5 | 121 Nihlathaks Temple | 86 | Act 5 (H) Super Cx |  | 87 / Zod |
| 53 | Snapchip Shatter | frozenhorror1 | 119 Glacial Caves Level 2 | 86 | Act 5 (H) Super C | Act 4 (H) Super Bx | 78 / Cham |
| 54 | Anodized Elite | succubus4 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 55 | Vinvear Molech | succubuswitch2 |  |  | Act 5 (H) Super A |  | 84 / Zod |
| 56 | Sharp Tooth Sayer | overseer3 | 111 Rigid Highlands | 84 | Act 5 (H) Super B |  | 87 / Zod |
| 57 | Magma Torquer | imp5 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 58 | Blaze Ripper | deathmauler5 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 59 | Frozenstein | snowyeti4 | 114 Cellar of Pity | 86 | Act 5 (H) Super C | Act 4 (H) Super Bx | 78 / Cham |
| 60 | Nihlathak Boss | nihlathakboss (B) | 124 Halls of Vaught | 95 | Nihlathak (H) |  | 87 / Zod |
| 61 | Baal Subject 1 | fallenshaman5 | 131 Throne of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 62 | Baal Subject 2 | unraveler5 | 131 Throne of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 63 | Baal Subject 3 | baalhighpriest | 131 Throne of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 64 | Baal Subject 4 | venomlord | 131 Throne of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 65 | Baal Subject 5 | baalminion1 | 131 Throne of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |

## 4. 액트 보스 (`monstats.txt` `boss` 클래스)

- 레벨은 `monstats` 레벨, 올림 없음. 퀘스트 TC는 그 퀘스트를 아직 깨지 않은 캐릭터가 처치할 때(D2MOO `MonsterMode.cpp` 536~568줄).

| 몬스터 | 나이트메어 레벨 | TC | 장비 TC / 룬 | 퀘스트 TC | 장비 TC / 룬 | 헬 레벨 | TC | 장비 TC / 룬 | 퀘스트 TC | 장비 TC / 룬 |
|---|---|---|---|---|---|---|---|---|---|---|
| bloodraven | 43 | Blood Raven (N) | 42 / Io | - | - | 88 | Blood Raven (H) | 66 / Vex | - | - |
| andariel | 49 | Andariel (N) | 45 / Ko | Andarielq (N) | 45 / Ko | 75 | Andariel (H) | 69 / Lo | Andarielq (H) | 69 / Lo |
| duriel | 55 | Duriel (N) | 51 / Lem | Durielq (N) | 51 / Lem | 88 | Duriel (H) | 72 / Ber | Durielq (H) | 72 / Ber |
| mephisto | 59 | Mephisto (N) | 54 / Um | Mephistoq (N) | 54 / Um | 87 | Mephisto (H) | 78 / Cham | Mephistoq (H) | 78 / Cham |
| izual | 60 | Izual (N) | 57 / Um | - | - | 86 | Izual (H) | 78 / Cham | - | - |
| diablo | 62 | Diablo (N) | 60 / Ist | Diabloq (N) | 60 / Ist | 94 | Diablo (H) | 84 / Zod | Diabloq (H) | 84 / Zod |
| baalcrab | 75 | Baal (N) | 63 / Vex | Baalq (N) | 63 / Vex | 99 | Baal (H) | 87 / Zod | Baalq (H) | 87 / Zod |

## 5. 계산에 넣지 않은 것 (메모)

- **TC 안의 확률:** `treasureclassex.txt` `Picks`·`NoDrop`·`Prob1~10`. 위 표는 최대치만 다룬다.
- **플레이어 수와 NoDrop** (D2MOO `D2Game/ITEMS/Items.cpp` 2124~2160줄, 1.14d 미확인):
  - n = (게임 인원 − 같은 지역 파티원 수) / 2 + 같은 지역 파티원 수(최대 8), 몬스터의 플레이어 수 스탯을 넘지 않음
  - r = NoDrop / (나머지 확률 합 + NoDrop)
  - 새 NoDrop = 나머지 확률 합 / (1 − rⁿ) × rⁿ
- **아이템 레벨(숨렙):** 떨어진 아이템의 아이템 레벨은 TC와 별개다(D2MOO `ITEMS_GetItemLevelForNewItem`). 접사는 아이템 레벨로 정해진다(`item_mods.md` 참 접사 공식 글).
- **퀘스트 보상 룬:** 헬포지·Rescue on Mount Arreat 보상은 `treasureclassex.txt`에 없다(검색 0건). 아래 원문 값을 둔다.

## 6. 원문 메모 (PureDiablo "Rune Farming")

- 출처: https://www.purediablo.com/diablo-2/diablo-2-rune-farming (가져온 날 261104). 근거: 웹 미검증. 원문 영어 그대로, 위 계산과 겹치는 절(몬스터·카운테스·상자 최고 룬 목록·레벨 85 상자 TC·플레이어 수)은 뺐다.
- 원문 문장(Monsters 절): "Rune hunting is somewhat simplified by the fact that Magic Find is of no benefit."

### The Hellforge

When a character shatters Mephisto’s Soulstone on the Hellforge in Act Four, four gems and one rune drop as part of the quest reward. The runes that may be found from this quest vary by difficulty level. Which one drops is selected randomly from the following possibilities:

- Normal:El (r01) – Amn (r11).
- Nightmare: Sol (r12) – Um (r22).
- Hell: Hel (r15) – Gul (r25).

Unlike the runes from the Countess, or any other monster drops in the game, the lower-level runes are **not** more common. The odds for Hel or Gul  are identical on Hell difficulty, 1/11 for each.

Note: Do not finish this quest with other players in your party if they have not completed the quest already. There are four gems drop for every character completing the quest but only one rune will drop no matter how many are in the party.

### Rescue on Mount Arreat

This second quest in Act Five (Rescue on Mount Arreat) can be easily completed, and players will receive a Tal (r07), a Ral (r08), and an Ort (r09) rune as a reward.

### Chests

Chests are all objects that can contain an item. These include barrels, chests, crates, lootable corpses, hidden stashes etc. These items have different drop rates and quality of item drops.

Doing chest runs in some areas with a lot of chests is a very good way to find multiple high quality items, especially runes. While all chests are potentially useful, the super chests are the ones to hit; you’ll find one or two of those near the campfires in Lower Kurast on Act 3, for example.

### Sparkly Chests

There are a lot of “super chests” in the game, ones that can drop multiple items at once. Most super chests are sparkly chests but it’s not a hard and fast rule. Not all super chests sparkle, and not all sparkling chests are super chests.

For example, some sparkly chests are quest chests that contain quest items. These include the Maggot Lair chest, The Spider Cavern Chest, the Kurast Lvl 2 chest, the Ruined Temple chest (Lam Esen’s Tome). These are not real “sparkly chests”.

There are 24 Sparkly Chests within each difficulty level –or a total of 72 on the path to Hell difficulty Baal. There are five chests with identical characteristics in the False Tal Rasha’s Tombs. The Great Marsh has two Sparkly Chests with identical characteristics. The other 17 chests are each individualistic in their drop odds as they are encountered on Normal, Nightmare (NM) and Hell (H) difficulty levels
