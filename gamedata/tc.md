# TC (트레저 클래스: 몬스터·상자 드랍 최대치)

지역별 일반·챔피언·유니크 몬스터와 상자, 슈퍼유니크·액트 보스가 떨어뜨릴 수 있는 최대 장비 TC와 최고 룬 (261104).

- 데이터: mpqdata(1.14d에서 추출) `levels.txt`·`monstats.txt`·`superuniques.txt`·`treasureclassex.txt`. 규칙: 1.14d `Game.exe`(FileVersion 1.14.3.71) 역어셈블로 확인(아래 주소). 값은 모두 이 규칙으로 계산한 것이다(261104). 노말 표 추가, 슈퍼유니크 지역 1.14d 확인, 남은 D2MOO·일반 지식 근거를 모두 1.14d로 확인하고 표 606줄을 규칙대로 다시 계산해 대조(261105).
- kolbot 사용처: 사냥 구간 선택(`bots/*`), 아이템 레벨이 필요한 판단

## 1. 규칙

| 항목 | 규칙 | 1.14d 근거 |
|---|---|---|
| 몬스터 종류별 TC | 일반 `TreasureClass1`, 챔피언 `TreasureClass2`, 유니크 `TreasureClass3`, 퀘스트 첫 처치 `TreasureClass4`(노말은 접미사 없는 열, 나이트메어·헬은 `(N)`·`(H)` 열). 슈퍼유니크는 `superuniques.txt` `TC`·`TC(N)`·`TC(H)` | `0x5A6600`(슈퍼유니크면 `superuniques.txt` TC, 기록이 없으면 TC3; 아니면 챔피언 TC2·유니크 TC3·일반 TC1). D2MOO `MonsterMode.cpp`와 같음 |
| 몬스터 레벨 | 확장팩 나이트메어·헬: 지역 레벨(`levels.txt` `MonLvl2Ex`·`MonLvl3Ex`). `monstats.txt` `boss`·`noRatio` 클래스는 `Level(N)`·`Level(H)`. 노말은 `monstats.txt` `Level`(지역 레벨 아님) | `0x573E18`(`monstats` 레벨), `0x61dca0`(지역 레벨 읽기) |
| 레벨 가산 | 유니크·슈퍼유니크 +3(umod 4 `leveladd`). 챔피언 +2(+3 후 champion umod의 −1). 챔피언 중 berserk는 +3(−1 없음) | `0x5a2120`(umod 1~4를 먼저 적용, `0x6e2168`), `0x5a0e40`(+3), `0x5a0e80`(−1), 적용 함수 표 `0x73c008` |
| TC 올림 | 확장팩·나이트메어 이상·`boss`/`noRatio`가 아닌 몬스터만. 몬스터 TC에서 시작해, 다음 기록이 같은 `group`이고 그 `level` ≤ 몬스터 레벨이면 다음으로 옮긴다. 내리지 않는다 | `0x55afa0`(조건), `0x654e00`(루프) |
| TC 기록 순서 | `treasureclassex.txt` 줄 순서 그대로. 그래서 같은 group이면 난이도를 넘거나(나이트메어 → 헬 TC) 줄 순서상 다음인 "x" TC로 옮겨 갈 수 있다 | `0x654c3d~`(불러오기), `0x653f90`(기록 추가) |
| 상자 | 액트는 지역의 `Act`. F = 그 액트 첫 지역 레벨, L = 끝 지역 레벨(첫·끝 지역 2–37, 41–73, 76–102, 104–108, 109–136), T = (\|L − F\| + 1) ÷ 3(버림). 지역 레벨 < F + T면 A, ≥ F + 2T면 C, 그 사이 B → `Act N (난이도) Chest A/B/C`. 올림 없음. 레벨 없는 지역(마을)은 0 | `0x585b90`(식 `0x585C55`~`0x585C87`), 지역 표 `0x6e1988` |
| 기본 아이템 TC | `weapNN`(무기)·`armoNN`(방어구)·`bowNN`(활·석궁)·`meleNN`(근접 무기) = 아이템 레벨을 3 단위로 올린 값(`weapons.txt`·`armor.txt` `level`) | mpqdata 대조(261104, `bow`·`mele` 261105) |
| 몬스터 목록 | 지역마다 게임이 목록에서 일반 몬스터를 무작위로 최대 `NumMon`(13 이하)종 고른다. 노말은 `mon1~10`, 나이트메어·헬은 `nmon1~10`. 노말 챔피언·유니크만 `umon1~10`에서 고르고, 나이트메어·헬 챔피언·유니크는 고른 일반 몬스터에서 나온다 | `0x5475F0`(목록), `0x5BDE80`(노말 `umon`) |
| 아이템 레벨 | 몬스터가 떨군 것 = 몬스터 레벨(챔피언 +2·유니크 +3 포함). 상자 등 몬스터가 아닌 것 = 지역 레벨(몬스터 레벨 규칙과 같은 열). 1보다 작으면 1 | `0x558200` |

- 지역 값 = 그 지역 목록(위 "몬스터 목록") 몬스터 중 최댓값이다. 장비와 룬은 따로 최댓값을 잡는다(장비 최댓값과 룬 최댓값이 다른 몬스터일 수 있다). 목록이 빈 지역은 `-`. 한 게임에는 목록 중 최대 `NumMon`종만 나오므로, 최댓값을 주는 몬스터가 그 게임에 뽑히지 않으면 그 게임 값은 이보다 낮다.
- 지역 이름은 kolbot `Pather.getAreaName` 이름(게임 화면 이름)이다. `levels.txt` `LevelName`(내부 이름)과 28곳이 다르다(예: 125~127 `Hell1~3` = Abaddon·Pit Of Acheron·Infernal Pit, 133~135 `Pandemonium Run 1~3` = Matron's Den·Fogotten Sands·Furnace of Pain, `Fogotten`은 kolbot 철자 그대로)(261105).

## 1-1. 표 읽는 법 (범례)

**TC 이름** = `Act N (난이도) 종류 단계`(`treasureclassex.txt` 이름 그대로, 261105)

| 부분 | 뜻 |
|---|---|
| 난이도 | 표시 없음 = 노말, `(N)` = 나이트메어, `(H)` = 헬 |
| `H2H`·`Melee`·`Bow`·`Cast`·`Miss`·`Wraith` | 일반 몬스터 TC. 몬스터 공격 방식별로 나뉜 이름이다(`monstats.txt` `TreasureClass1`) |
| `Champ` | 챔피언 TC(`TreasureClass2`) |
| `Unique` | 유니크 몬스터 TC(`TreasureClass3`) |
| `Super` | 슈퍼유니크 TC(`superuniques.txt` `TC`) |
| `Chest` | 상자 TC |
| `Equip`·`Good`·`Junk`·`Citem`·`Uitem`·`Cpot`·`Magic` | 위 TC가 고르는 하위 TC. `Equip` = 장비(`weapNN`·`armoNN`), `Good` = 쥬얼리·보석·룬, `Junk` = 물약·화살 등, `Citem`·`Uitem` = 챔피언·유니크용 아이템 묶음, `Cpot` = 챔피언·유니크용 물약 |
| `A`·`B`·`C` | 같은 액트 안의 레벨 단계(낮음·중간·높음). TC 기록의 `level`이 A < B < C |
| 끝의 `x` | 같은 이름 TC의 변형. 고르는 항목은 같고 품질 계수만 낮다(예: `Act 5 (H) Super C` 유니크 800·세트 800, `Super Cx` 512·654). Pindleskin·Threash Socket의 TC. `x` TC 45개 모두 항목·`Picks`·`NoDrop`이 원래 TC와 같고 품질 계수만 같거나 낮다(데이터 전수, 261105) |
| 보스 이름(`Andariel` 등) | 그 보스 전용 TC. 끝에 `q`(`Andarielq`)는 퀘스트 TC |

**TC 기록의 칸**(`treasureclassex.txt`, 261105)

| 칸 | 뜻 |
|---|---|
| `Picks` | 양수 N = 항목 중 하나를 확률대로 N번 뽑는다. 음수 −N = 항목을 차례로 `Prob` 수만큼 정확히 뽑는다(예: `Act 5 (H) Super C` = −4: `Uitem` 2번 + `Cpot` 2번). 근거 `0x55AABC` |
| `Item1~10`·`Prob1~10` | 뽑을 항목과 그 비율. 항목이 또 TC면 그 TC로 내려간다 |
| `NoDrop` | "아무것도 안 떨굼"의 비율. 인원수가 늘면 줄어든다(5절 식) |
| `Unique`·`Set`·`Rare`·`Magic` | 품질 계수. 클수록 그 등급 이상으로 결정될 확률이 오른다. 등급 확률 기준값 C에서 C × 계수 ÷ 1024를 빼므로(`0x558777`) 1024면 0이 되어 그 등급 이상이 보장된다(예: 챔피언·유니크 `Citem`·`Uitem`의 `Magic` 1024 = 매직 이상, 퀘스트 TC의 `Rare` 1024 = 레어 이상). 매직 찬스와 함께 쓰이는 식은 `item_mods.md` "매직 찬스" |
| `weapNN`·`armoNN` 숫자 | 기본 아이템 레벨을 3 단위로 올린 묶음(`weapons.txt`·`armor.txt` `level`). 예: `weap87` = 기본 아이템 레벨 85~87인 무기들. 표의 숫자는 도달할 수 있는 가장 높은 묶음 |

**표의 값**
- "장비 TC / 룬" = 그 TC에서 끝까지 내려가 도달할 수 있는 가장 높은 `weap`·`armo`·`bow`·`mele` 번호와 가장 높은 룬(261105 전에는 `weap`·`armo`만 세어 헬 지역 일반 몬스터 34칸이 3~6 낮았다. 활·근접 몬스터의 `Bow`·`Melee` 하위 TC가 더 높은 `bow`·`mele` 묶음을 가진다). 확률은 반영하지 않는다(최댓값이지 기댓값이 아니다).
- `-`(룬 칸) = 그 TC 아래 어디에도 룬이 없다 = **룬이 나오지 않는다.** 예: 노말 액트1의 `Act 1 Good`은 쥬얼리·칩 보석뿐이라 노말 액트1 몬스터·상자는 엘 룬도 떨구지 않는다(노말 `Act 1`로 시작하는 TC 전부 확인, 261105). 노말 카운테스만 자기 룬 TC(`Countess Rune` → `Runes 4`, 랄까지)로 룬을 떨군다. 룬은 노말 `Act 2 Good`(`Runes 1`·`Runes 2`)부터 들어간다.
- `- / -`(장비·룬 모두) = 그 칸에 해당하는 몬스터가 없다(아래 "빈 지역").
- 슈퍼유니크·지역 표의 "장비 TC / 룬"은 **올린 TC 기준**이다(예: Bishibosh 헬 = 기본 `Act 1 (H) Super A` 63 / Gul → 올린 `Act 2 (H) Super B` 69 / Lo, 표 69 / Lo). 지역 표의 일반·챔피언·유니크도 각 레벨(+2·+3 포함)로 올린 값이다.
- 올림이 기본보다 낮아지는 경우: 헬 Snapchip Shatter·Frozenstein은 기본 `Act 5 (H) Super C`(87 / Zod)가 줄 순서상 다음인 `x` TC들을 거쳐 `Act 4 (H) Super Bx`(78 / Cham)에서 멈춘다(1절 "TC 올림"·"TC 기록 순서" 규칙대로 계산한 값. 261105 표 전체 재계산에서도 같음).

**빈 지역** (`levels.txt` 몬스터 목록, 261105)
- 목록(`mon`·`nmon`·`umon`)이 비어 있는 지역은 무작위 몬스터가 없고, 몬스터가 지도 프리셋이나 퀘스트 코드로만 놓이는 곳이다: 121 Nihlathak's Temple(Pindleskin 무리), 132 The Worldstone Chamber(바알), 136 Tristram(횃불 우버). 이 몬스터들은 3절(슈퍼유니크)·4절(액트 보스) 표에 있다.
- 120 Arreat Summit은 목록에 고대인 3명뿐이고 고대인은 `monstats.txt` TC가 비어 있어 `- / -`다.
- 노말 110 Bloody Foothills는 `umon`(노말 챔피언·유니크 목록)이 비어 있어 챔피언·유니크가 `-`다.

## 2. 지역 (노말)

- 노말은 TC 올림이 없다(`0x55afa0` 조건: 난이도 > 0). 값 = 그 지역 몬스터의 기본 TC 중 최댓값. 일반은 `mon1~10`, 챔피언·유니크는 `umon1~10`(노말만 이 목록에서 고름, 1절 "몬스터 목록"). 레벨 = `MonLvl1Ex`(상자 판정에 쓰임, `0x61dca0`).

| ID | 지역 | 레벨 | 일반 | 챔피언 | 유니크 | 상자 |
|---|---|---|---|---|---|---|
| 2 | Blood Moor | 1 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 3 | Cold Plains | 2 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 4 | Stony Field | 4 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 5 | Dark Wood | 5 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 6 | Black Marsh | 6 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 7 | Tamoe Highland | 8 | 12 / - | 12 / - | 12 / - | B: 6 / - |
| 8 | Den Of Evil | 1 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 9 | Cave Level 1 | 2 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 10 | Underground Passage Level 1 | 4 | 6 / - | 6 / - | 6 / - | A: 3 / - |
| 11 | Hole Level 1 | 5 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 12 | Pit Level 1 | 7 | 12 / - | 12 / - | 12 / - | B: 6 / - |
| 13 | Cave Level 2 | 2 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 14 | Underground Passage Level 2 | 4 | 6 / - | 6 / - | 6 / - | A: 3 / - |
| 15 | Hole Level 2 | 5 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 16 | Pit Level 2 | 7 | 12 / - | 12 / - | 12 / - | B: 6 / - |
| 17 | Burial Grounds | 3 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 18 | Crypt | 3 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 19 | Mausoleum | 3 | 3 / - | 3 / - | 3 / - | A: 3 / - |
| 21 | Tower Cellar Level 1 | 7 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 22 | Tower Cellar Level 2 | 7 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 23 | Tower Cellar Level 3 | 7 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 24 | Tower Cellar Level 4 | 7 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 25 | Tower Cellar Level 5 | 7 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 26 | Monastery Gate | 8 | 12 / - | 12 / - | 12 / - | B: 6 / - |
| 27 | Outer Cloister | 9 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 28 | Barracks | 9 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 29 | Jail Level 1 | 10 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 30 | Jail Level 2 | 10 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 31 | Jail Level 3 | 10 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 32 | Inner Cloister | 10 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 33 | Cathedral | 11 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 34 | Catacombs Level 1 | 11 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 35 | Catacombs Level 2 | 11 | 12 / - | 12 / - | 12 / - | C: 12 / - |
| 36 | Catacombs Level 3 | 12 | 21 / Ral | 21 / Ral | 21 / Ral | C: 12 / - |
| 37 | Catacombs Level 4 | 12 | 21 / Ral | 21 / Ral | 21 / Ral | C: 12 / - |
| 38 | Tristram | 6 | 6 / - | 6 / - | 6 / - | B: 6 / - |
| 39 | Moo Moo Farm | 28 | 36 / Dol | 36 / Sol | 36 / Sol | C: 12 / - |
| 41 | Rocky Waste | 14 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 42 | Dry Hills | 15 | 15 / Nef | 15 / Nef | 15 / Nef | B: 18 / Nef |
| 43 | Far Oasis | 16 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 44 | Lost City | 17 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 45 | Valley Of Snakes | 18 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 46 | Canyon Of The Magi | 16 | 21 / Ral | 21 / Ral | 21 / Ral | C: 21 / Nef |
| 47 | Sewers Level 1 | 13 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 48 | Sewers Level 2 | 13 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 49 | Sewers Level 3 | 14 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 51 | Harem Level 2 | 13 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 52 | Palace Cellar Level 1 | 13 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 53 | Palace Cellar Level 2 | 13 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 54 | Palace Cellar Level 3 | 13 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 55 | Stony Tomb Level 1 | 12 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 56 | Halls Of The Dead Level 1 | 12 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 57 | Halls Of The Dead Level 2 | 13 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 58 | Claw Viper Temple Level 1 | 14 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 59 | Stony Tomb Level 2 | 12 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 60 | Halls Of The Dead Level 3 | 13 | 15 / Nef | 15 / Nef | 15 / Nef | A: 15 / Nef |
| 61 | Claw Viper Temple Level 2 | 14 | 18 / Nef | 18 / Nef | 18 / Nef | A: 15 / Nef |
| 62 | Maggot Lair Level 1 | 17 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 63 | Maggot Lair Level 2 | 17 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 64 | Maggot Lair Level 3 | 17 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 65 | Ancient Tunnels | 17 | 18 / Nef | 18 / Nef | 18 / Nef | C: 21 / Nef |
| 66 | Tal Rashas Tomb #1 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 67 | Tal Rashas Tomb #2 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 68 | Tal Rashas Tomb #3 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 69 | Tal Rashas Tomb #4 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 70 | Tal Rashas Tomb #5 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 71 | Tal Rashas Tomb #6 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 72 | Tal Rashas Tomb #7 | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 73 | Duriels Lair | 17 | 27 / Ral | 27 / Ral | 27 / Ral | C: 21 / Nef |
| 74 | Arcane Sanctuary | 14 | 21 / Ral | 21 / Ral | 21 / Ral | A: 15 / Nef |
| 76 | Spider Forest | 21 | 24 / Ral | 24 / Ral | 24 / Ral | A: 24 / Ral |
| 77 | Great Marsh | 21 | 24 / Ral | 24 / Ral | 24 / Ral | A: 24 / Ral |
| 78 | Flayer Jungle | 22 | 27 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 79 | Lower Kurast | 22 | 24 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 80 | Kurast Bazaar | 22 | 27 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 81 | Upper Kurast | 23 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 82 | Kurast Causeway | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 83 | Travincal | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 84 | Spider Cave | 21 | 24 / Ral | 24 / Ral | 24 / Ral | A: 24 / Ral |
| 85 | Spider Cavern | 21 | 24 / Ral | 24 / Ral | 24 / Ral | A: 24 / Ral |
| 86 | Swampy Pit Level 1 | 21 | 27 / Ral | 27 / Ral | 27 / Ral | A: 24 / Ral |
| 87 | Swampy Pit Level 2 | 21 | 27 / Ral | 27 / Ral | 27 / Ral | A: 24 / Ral |
| 88 | Flayer Dungeon Level 1 | 22 | 27 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 89 | Flayer Dungeon Level 2 | 22 | 27 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 90 | Swampy Pit Level 3 | 21 | 27 / Ral | 27 / Ral | 27 / Ral | A: 24 / Ral |
| 91 | Flayer Dungeon Level 3 | 22 | 27 / Ral | 27 / Ral | 27 / Ral | B: 27 / Ral |
| 92 | Sewers Level 1 | 23 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 93 | Sewers Level 2 | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 94 | Ruined Temple | 23 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 95 | Disused Fane | 23 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 96 | Forgotten Reliquary | 23 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 97 | Forgotten Temple | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 98 | Ruined Fane | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 99 | Disused Reliquary | 24 | 27 / Ral | 27 / Ral | 27 / Ral | C: 30 / Ral |
| 100 | Durance Of Hate Level 1 | 25 | 30 / Ral | 30 / Ral | 30 / Ral | C: 30 / Ral |
| 101 | Durance Of Hate Level 2 | 25 | 30 / Ral | 30 / Ral | 30 / Ral | C: 30 / Ral |
| 102 | Durance Of Hate Level 3 | 25 | 30 / Ral | 30 / Ral | 30 / Ral | C: 30 / Ral |
| 104 | Outer Steppes | 26 | 36 / Sol | 33 / Sol | 33 / Sol | A: 33 / Sol |
| 105 | Plains Of Despair | 26 | 36 / Sol | 36 / Sol | 36 / Sol | A: 33 / Sol |
| 106 | City Of The Damned | 27 | 36 / Sol | 36 / Sol | 36 / Sol | B: 36 / Sol |
| 107 | River Of Flame | 27 | 36 / Sol | 36 / Sol | 36 / Sol | B: 36 / Sol |
| 108 | Chaos Sanctuary | 28 | 36 / Sol | 36 / Sol | 36 / Sol | C: 36 / Sol |
| 110 | Bloody Foothills | 24 | 36 / Dol | - / - | - / - | B: 39 / Dol |
| 111 | Frigid Highlands | 25 | 39 / Dol | 36 / Dol | 36 / Dol | B: 39 / Dol |
| 112 | Arreat Plateau | 26 | 36 / Dol | 36 / Dol | 36 / Dol | B: 39 / Dol |
| 113 | Crystalline Passage | 29 | 39 / Dol | 36 / Dol | 36 / Dol | B: 39 / Dol |
| 114 | Frozen River | 29 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 115 | Glacial Trail | 29 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 116 | Drifter Cavern | 29 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 117 | Frozen Tundra | 27 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 118 | Ancient's Way | 29 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 119 | Icy Cellar | 29 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 120 | Arreat Summit | 37 | - / - | - / - | - / - | C: 39 / Dol |
| 121 | Nihlathak's Temple | 32 | - / - | - / - | - / - | B: 39 / Dol |
| 122 | Halls Of Anguish | 33 | 39 / Dol | 39 / Dol | 39 / Dol | B: 39 / Dol |
| 123 | Halls Of Pain | 34 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 124 | Halls Of Vaught | 36 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 125 | Abaddon | 39 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 126 | Pit Of Acheron | 39 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 127 | Infernal Pit | 39 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 128 | Worldstone Keep Level 1 | 39 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 129 | Worldstone Keep Level 2 | 40 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 130 | Worldstone Keep Level 3 | 42 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 131 | Throne Of Destruction | 43 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 132 | The Worldstone Chamber | 43 | - / - | - / - | - / - | C: 39 / Dol |
| 133 | Matron's Den | 50 | 36 / Dol | 36 / Dol | 36 / Dol | C: 39 / Dol |
| 134 | Fogotten Sands | 50 | 33 / Sol | 33 / Sol | 33 / Sol | C: 39 / Dol |
| 135 | Furnace of Pain | 50 | 39 / Dol | 39 / Dol | 39 / Dol | C: 39 / Dol |
| 136 | Tristram | 50 | - / - | - / - | - / - | C: 39 / Dol |

## 2. 지역 (나이트메어)

| ID | 지역 | 레벨 | 일반 | 챔피언 (+2) | 유니크 (+3) | 상자 |
|---|---|---|---|---|---|---|
| 2 | Blood Moor | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 3 | Cold Plains | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 4 | Stony Field | 37 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
| 5 | Dark Wood | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 6 | Black Marsh | 38 | 42 / Io | 42 / Io | 42 / Io | B: 42 / Io |
| 7 | Tamoe Highland | 39 | 42 / Io | 42 / Io | 45 / Ko | B: 42 / Io |
| 8 | Den Of Evil | 36 | 42 / Io | 42 / Io | 42 / Io | A: 42 / Io |
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
| 45 | Valley Of Snakes | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 46 | Canyon Of The Magi | 48 | 51 / Lem | 51 / Lem | 54 / Um | C: 48 / Ko |
| 47 | Sewers Level 1 | 43 | 45 / Ko | 48 / Ko | 51 / Lem | A: 45 / Ko |
| 48 | Sewers Level 2 | 43 | 45 / Ko | 48 / Ko | 51 / Lem | A: 45 / Ko |
| 49 | Sewers Level 3 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 51 | Harem Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 52 | Palace Cellar Level 1 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 53 | Palace Cellar Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 54 | Palace Cellar Level 3 | 48 | 51 / Lem | 51 / Lem | 54 / Um | C: 48 / Ko |
| 55 | Stony Tomb Level 1 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 56 | Halls Of The Dead Level 1 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 57 | Halls Of The Dead Level 2 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 58 | Claw Viper Temple Level 1 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 59 | Stony Tomb Level 2 | 44 | 48 / Ko | 51 / Lem | 51 / Lem | A: 45 / Ko |
| 60 | Halls Of The Dead Level 3 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 61 | Claw Viper Temple Level 2 | 47 | 51 / Lem | 51 / Lem | 51 / Lem | C: 48 / Ko |
| 62 | Maggot Lair Level 1 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 63 | Maggot Lair Level 2 | 45 | 48 / Ko | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 64 | Maggot Lair Level 3 | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 65 | Ancient Tunnels | 46 | 51 / Lem | 51 / Lem | 51 / Lem | B: 48 / Ko |
| 66 | Tal Rashas Tomb #1 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 67 | Tal Rashas Tomb #2 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 68 | Tal Rashas Tomb #3 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 69 | Tal Rashas Tomb #4 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 70 | Tal Rashas Tomb #5 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 71 | Tal Rashas Tomb #6 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 72 | Tal Rashas Tomb #7 | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
| 73 | Duriels Lair | 49 | 51 / Lem | 54 / Um | 54 / Um | C: 48 / Ko |
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
| 100 | Durance Of Hate Level 1 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 101 | Durance Of Hate Level 2 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 102 | Durance Of Hate Level 3 | 55 | 57 / Um | 60 / Ist | 60 / Ist | C: 51 / Lem |
| 104 | Outer Steppes | 56 | 57 / Um | 60 / Ist | 60 / Ist | A: 54 / Um |
| 105 | Plains Of Despair | 56 | 57 / Um | 60 / Ist | 60 / Ist | A: 54 / Um |
| 106 | City Of The Damned | 57 | 60 / Ist | 60 / Ist | 60 / Ist | B: 57 / Um |
| 107 | River Of Flame | 57 | 60 / Ist | 60 / Ist | 60 / Ist | B: 57 / Um |
| 108 | Chaos Sanctuary | 58 | 60 / Ist | 60 / Ist | 60 / Ist | C: 57 / Um |
| 110 | Bloody Foothills | 58 | 60 / Ist | 60 / Ist | 60 / Ist | C: 60 / Ist |
| 111 | Frigid Highlands | 59 | 63 / Ist | 63 / Ist | 63 / Ist | C: 60 / Ist |
| 112 | Arreat Plateau | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 113 | Crystalline Passage | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 114 | Frozen River | 61 | 60 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 115 | Glacial Trail | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 116 | Drifter Cavern | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 117 | Frozen Tundra | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 118 | Ancient's Way | 62 | 63 / Vex | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 119 | Icy Cellar | 62 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 120 | Arreat Summit | 68 | - / - | - / - | - / - | C: 60 / Ist |
| 121 | Nihlathak's Temple | 63 | - / - | - / - | - / - | C: 60 / Ist |
| 122 | Halls Of Anguish | 63 | 63 / Vex | 63 / Vex | 66 / Vex | C: 60 / Ist |
| 123 | Halls Of Pain | 64 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 124 | Halls Of Vaught | 64 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 125 | Abaddon | 60 | 63 / Ist | 63 / Ist | 63 / Vex | C: 60 / Ist |
| 126 | Pit Of Acheron | 61 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 127 | Infernal Pit | 62 | 63 / Ist | 63 / Vex | 63 / Vex | C: 60 / Ist |
| 128 | Worldstone Keep Level 1 | 65 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 129 | Worldstone Keep Level 2 | 65 | 63 / Vex | 66 / Vex | 66 / Vex | C: 60 / Ist |
| 130 | Worldstone Keep Level 3 | 66 | 66 / Vex | 66 / Vex | 69 / Lo | C: 60 / Ist |
| 131 | Throne Of Destruction | 66 | 66 / Vex | 66 / Vex | 69 / Lo | C: 60 / Ist |
| 132 | The Worldstone Chamber | 66 | - / - | - / - | - / - | C: 60 / Ist |
| 133 | Matron's Den | 75 | 75 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 134 | Fogotten Sands | 75 | 72 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 135 | Furnace of Pain | 75 | 75 / Ber | 75 / Ber | 78 / Cham | C: 60 / Ist |
| 136 | Tristram | 75 | - / - | - / - | - / - | C: 60 / Ist |

## 2. 지역 (헬)

| ID | 지역 | 레벨 | 일반 | 챔피언 (+2) | 유니크 (+3) | 상자 |
|---|---|---|---|---|---|---|
| 2 | Blood Moor | 67 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 3 | Cold Plains | 68 | 66 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 4 | Stony Field | 68 | 69 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 5 | Dark Wood | 68 | 69 / Vex | 69 / Lo | 69 / Lo | A: 63 / Vex |
| 6 | Black Marsh | 69 | 72 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 7 | Tamoe Highland | 69 | 72 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 8 | Den Of Evil | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 66 / Vex |
| 9 | Cave Level 1 | 77 | 81 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 10 | Underground Passage Level 1 | 69 | 72 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 11 | Hole Level 1 | 80 | 84 / Cham | 84 / Zod | 87 / Zod | C: 66 / Vex |
| 12 | Pit Level 1 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 13 | Cave Level 2 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | C: 66 / Vex |
| 14 | Underground Passage Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 15 | Hole Level 2 | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 16 | Pit Level 2 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 17 | Burial Grounds | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 66 / Vex |
| 18 | Crypt | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 19 | Mausoleum | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 21 | Tower Cellar Level 1 | 75 | 81 / Ber | 75 / Ber | 78 / Cham | C: 66 / Vex |
| 22 | Tower Cellar Level 2 | 76 | 81 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 23 | Tower Cellar Level 3 | 77 | 81 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 24 | Tower Cellar Level 4 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | C: 66 / Vex |
| 25 | Tower Cellar Level 5 | 79 | 84 / Cham | 84 / Zod | 84 / Zod | C: 66 / Vex |
| 26 | Monastery Gate | 70 | 72 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 27 | Outer Cloister | 70 | 69 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 28 | Barracks | 70 | 72 / Lo | 69 / Lo | 69 / Lo | B: 66 / Vex |
| 29 | Jail Level 1 | 71 | 75 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 30 | Jail Level 2 | 71 | 75 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 31 | Jail Level 3 | 71 | 75 / Lo | 69 / Lo | 72 / Ber | C: 66 / Vex |
| 32 | Inner Cloister | 72 | 75 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 33 | Cathedral | 72 | 69 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 34 | Catacombs Level 1 | 72 | 69 / Lo | 72 / Ber | 75 / Ber | C: 66 / Vex |
| 35 | Catacombs Level 2 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 36 | Catacombs Level 3 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 37 | Catacombs Level 4 | 73 | 69 / Lo | 75 / Ber | 75 / Ber | C: 66 / Vex |
| 38 | Tristram | 76 | 81 / Ber | 78 / Cham | 78 / Cham | C: 66 / Vex |
| 39 | Moo Moo Farm | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 66 / Vex |
| 41 | Rocky Waste | 75 | 81 / Ber | 75 / Ber | 78 / Cham | A: 69 / Lo |
| 42 | Dry Hills | 76 | 81 / Ber | 78 / Cham | 78 / Cham | A: 69 / Lo |
| 43 | Far Oasis | 76 | 75 / Ber | 78 / Cham | 78 / Cham | A: 69 / Lo |
| 44 | Lost City | 77 | 81 / Ber | 78 / Cham | 78 / Cham | B: 69 / Lo |
| 45 | Valley Of Snakes | 77 | 75 / Ber | 78 / Cham | 78 / Cham | B: 69 / Lo |
| 46 | Canyon Of The Magi | 79 | 84 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 47 | Sewers Level 1 | 74 | 78 / Ber | 75 / Ber | 75 / Ber | A: 69 / Lo |
| 48 | Sewers Level 2 | 74 | 78 / Ber | 75 / Ber | 75 / Ber | A: 69 / Lo |
| 49 | Sewers Level 3 | 75 | 75 / Ber | 75 / Ber | 78 / Cham | A: 69 / Lo |
| 51 | Harem Level 2 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 52 | Palace Cellar Level 1 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 53 | Palace Cellar Level 2 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 54 | Palace Cellar Level 3 | 78 | 84 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 55 | Stony Tomb Level 1 | 78 | 78 / Cham | 78 / Cham | 84 / Zod | B: 69 / Lo |
| 56 | Halls Of The Dead Level 1 | 79 | 84 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 57 | Halls Of The Dead Level 2 | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 58 | Claw Viper Temple Level 1 | 82 | 84 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 59 | Stony Tomb Level 2 | 79 | 78 / Cham | 84 / Zod | 84 / Zod | C: 69 / Lo |
| 60 | Halls Of The Dead Level 3 | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 61 | Claw Viper Temple Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 62 | Maggot Lair Level 1 | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 63 | Maggot Lair Level 2 | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 64 | Maggot Lair Level 3 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 65 | Ancient Tunnels | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 69 / Lo |
| 66 | Tal Rashas Tomb #1 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 67 | Tal Rashas Tomb #2 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 68 | Tal Rashas Tomb #3 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 69 | Tal Rashas Tomb #4 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 70 | Tal Rashas Tomb #5 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 71 | Tal Rashas Tomb #6 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 72 | Tal Rashas Tomb #7 | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
| 73 | Duriels Lair | 80 | 78 / Cham | 84 / Zod | 87 / Zod | C: 69 / Lo |
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
| 100 | Durance Of Hate Level 1 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 101 | Durance Of Hate Level 2 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 102 | Durance Of Hate Level 3 | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 75 / Ber |
| 104 | Outer Steppes | 82 | 84 / Zod | 87 / Zod | 87 / Zod | A: 78 / Cham |
| 105 | Plains Of Despair | 83 | 87 / Zod | 87 / Zod | 87 / Zod | B: 78 / Cham |
| 106 | City Of The Damned | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 107 | River Of Flame | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 108 | Chaos Sanctuary | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 78 / Cham |
| 110 | Bloody Foothills | 80 | 84 / Zod | 84 / Zod | 87 / Zod | C: 87 / Zod |
| 111 | Frigid Highlands | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 112 | Arreat Plateau | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 113 | Crystalline Passage | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 114 | Frozen River | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 115 | Glacial Trail | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 116 | Drifter Cavern | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 117 | Frozen Tundra | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 118 | Ancient's Way | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 119 | Icy Cellar | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 120 | Arreat Summit | 87 | - / - | - / - | - / - | C: 87 / Zod |
| 121 | Nihlathak's Temple | 83 | - / - | - / - | - / - | C: 87 / Zod |
| 122 | Halls Of Anguish | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 123 | Halls Of Pain | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 124 | Halls Of Vaught | 84 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 125 | Abaddon | 81 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 126 | Pit Of Acheron | 82 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 127 | Infernal Pit | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 128 | Worldstone Keep Level 1 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 129 | Worldstone Keep Level 2 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 130 | Worldstone Keep Level 3 | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 131 | Throne Of Destruction | 85 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 132 | The Worldstone Chamber | 85 | - / - | - / - | - / - | C: 87 / Zod |
| 133 | Matron's Den | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 134 | Fogotten Sands | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 135 | Furnace of Pain | 83 | 87 / Zod | 87 / Zod | 87 / Zod | C: 87 / Zod |
| 136 | Tristram | 83 | - / - | - / - | - / - | C: 87 / Zod |

## 3. 슈퍼유니크

- 레벨(나이트메어·헬) = 기본 레벨 + 3. 기본 레벨은 지역 레벨, `boss`·`noRatio` 클래스(표의 B)는 `monstats` 레벨(올림 없음).
- 지역 = 슈퍼유니크가 놓이는 지도(DS1)의 지역. 근거: 1.14d `d2data.mpq`·`d2exp.mpq`의 DS1 2,384개(사용자 추출)에서 프리셋 몬스터(`monpreset.txt`)를 읽고, 그 DS1을 `lvlprest.txt` → D2MOO 지도 생성 코드(`DrlgMaze.cpp`·`DrlgOutWild.cpp`·`DrlgOutDesr.cpp`·`DrlgOutJung.cpp`·`DrlgOutPlace.cpp`·`DrlgOutSiege.cpp`, 1.10f 재구성)로 지역에 맞췄다. DS1에 없는 것은 D2MOO 소환 코드(디아블로 봉인 `A4Q2.cpp`, 고대인 `A5Q5.cpp`, 니라탁 `A5Q3.cpp`, 바알 부하 `AiThink.cpp`)(261105).
- 지도 → 지역 단계는 1.14d `Game.exe`(FileVersion 1.14.3.71)로 확인했다. 아래 표의 모든 조건이 D2MOO와 같다(261105). 지도 배열(DS1 번호 4개씩 묶은 표) 50개는 D2MOO 값 전체가 exe 안에 그대로 있다(`0x6EF8A8`~`0x6F05D8`).
- 소환 보스도 1.14d로 확인했다(261105). 슈퍼유니크는 지도 프리셋이든 소환이든 모두 한 함수(`0x54E600` → `0x5A49B0`)로 생긴다(`0x5A49B0`을 부르는 곳은 `0x54E67E` 한 곳).
  - 디아블로 봉인: 봉인 오브젝트를 열면 hcIdx 36·37·38(Infector of Souls·Lord De Seis·Grand Vizier of Chaos)을 그 자리에 소환(`0x5B5750`). 봉인 오브젝트(액트4 프리셋 47·49·51)는 디아블로 날개 지도(`lvlprest.txt` 858~861)에만 있고, 이 지도는 108 Chaos Sanctuary에서만 놓인다(`0x67E8BF` → `0x67E840`).
  - 고대인: 석상(`monpreset` 액트5 24~26)은 `MtnTop.ds1`(`lvlprest.txt` 1089, 120 Arreat Summit)에만 있다. 석상 오브젝트 474~476이 hcIdx 44·43·45를 소환(`0x58C114`~`0x58C198`, 소환 함수 `0x545C30` → `0x54E600`).
  - 니라탁: 오브젝트 462(`Nihlathak Start Outside Town`, 액트5 프리셋 56, 프리셋 표 `0x748AD8`)가 hcIdx 60을 소환(`0x58A70D`). 이 오브젝트는 `lvlprest.txt` 864(124 Halls of Vaught)의 지도 4개에만 있다(그 밖에 `temple01.ds1`에도 있으나 어느 `lvlprest`도 쓰지 않음).
  - 바알 부하: 바알 왕좌 AI(`0x5EF320`)가 표 `0x6E3528`(hcIdx 61~65)의 순서로 하나씩 소환 미사일(`0x5ACB43` → `0x54E600`)을 쏜다. 131 Throne Of Destruction.

| 슈퍼유니크 | 지도(`lvlprest.txt` 번호) | 놓는 조건 (1.14d 주소) |
|---|---|---|
| Bishibosh, Rakanishu, Treehead WoodFist, The Cow King | 44, 160, 161, 50 | 액트1 바깥 지역 분기(`0x680580`, 지역 번호 − 2로 표 찾기): 3 Cold Plains, 4 Stony Field, 5 Dark Wood, 39 Moo Moo Farm |
| Corpsefire, Coldcrow, Bonebreak, Pitspawn Fouldog | 95~98, 99~102, 147~150, 252~255 | 지역 번호 비교: 8(`0x67259B`), 9(`0x6725C1`), 18(`0x672655`), 30(`0x672735`) |
| The Smith | 202~205 | 28 Barracks일 때 병영 함수(`0x673F1A` → `0x673120`) |
| Beetleburst, Dark Elder | 396, 413 | 액트2 사막 분기(`0x67F980`, 지역 번호 − 41로 표 찾기): 43 Far Oasis, 44 Lost City(`0x67F830`, 다른 호출 없음) |
| Radament | 341~344 | 액트2 하수도 분기(`0x672873`, 지역 번호 − 47로 표 찾기): 49 Sewers Level 3만 |
| Fire Eye | 359 파일 4번째(`CelSE3.ds1`) | 54 Palace Cellar Level 3일 때 파일 번호 3(0부터)(`0x670A76`) |
| Leatherarm, Bloodwitch the Wild, Ancient Kaa the Soulless | 464~467, 456~459, 468~471 | 59(`0x672CD3`), 60(`0x672CF2`), 보스 무덤(`nBossTombLevel`, 구조체 `+0x484`, `0x672D6D`) |
| Fangskin | 480 | 61 Claw Viper Temple Level 2일 때 첫 방을 이 지도로(`0x673C35`) |
| Coldworm the Burrower | 509 | 64 Maggot Lair Level 3일 때만(`0x672DED`) |
| Stormtree | 574 | 78 Flayer Jungle의 첫 줄(`0x67EA0B`) |
| Web Mage the Burning | 663 | 85 Spider Cavern에서 661을 663으로 바꿈(`0x670AE5`) |
| Icehawk Riftwing | 739~742 | 액트3 하수도 종류(`0x673CC7`)가 92·93 둘 다 배수로 함수(`0x672F00`)를 부른다. 함수 안에 지역 조건 없음 |
| The Feature Creep | 853, 854 | 107 River Of Flame일 때 용암 함수(`0x673F1F` → `0x673320`) |
| Siege Boss, Dac Farren | 878, 871 | 110 Bloody Foothills에서 865 + 0~14 15칸을 차례로 놓음(`0x67E5C8`) |
| Megaflow Rectifier, Sharp Tooth Sayer | 880, 931~938 | 111 Frigid Highlands일 때만(`0x67E630` → `0x67E4B0`, 감옥 `0x67E246`) |
| Eyeback Unleashed | 909, 910 | 110이 아닌 액트5 바깥 지역(111·112·117) 모두 출구 함수(`0x67DB50`)를 부른다. 함수 안에 지역 조건 없음 |
| Threash Socket | 913, 914 | 동굴 표(`0x6F1F9C`)에서 112 Arreat Plateau만 |
| Bonesaw Breaker, Frozenstein, Snapchip Shatter | 1030~1033, 1038·1039, 1041 | 115(`0x6735AD`), 114에서 1038·1039 중 무작위(`0x673EAE`), 119(`0x673E7E`) |
| Blaze Ripper | 952 | 코드·데이터 어디에도 952를 놓는 곳이 없음 |
- 슈퍼유니크는 게임당 한 번만 나온다(`superuniques.txt` `Stacks` 0인 경우, `0x5A4A09`: 이미 나온 기록이 있으면 만들지 않음). `Stacks` 1은 Siege Boss·고대인 3명·Nihlathak Boss·Baal Subject 1~5로, 여러 번 나올 수 있다. 노말·나이트메어·헬 밖의 난이도면 만들지 않는다(`0x5A49C6`). 같은 지도가 여러 지역에 놓이면 먼저 활성화된 곳에서 나온다. 다른 후보 지역으로 계산해도 값은 같다.
  - Icehawk Riftwing: 92 Sewers Level 1·93 Sewers Level 2 둘 다(`DRLGMAZE_PlaceAct3SewerStuff`가 두 층 모두 배수로 방을 놓음)
  - Eyeback Unleashed: 111 Frigid Highlands·112 Arreat Plateau·117 Frozen Tundra의 출구(`DRLGOUTSIEGE_PlaceBarricadeEntrancesAndExits`)
  - Ancient Kaa the Soulless: 66~72 Tal Rashas Tomb #1~#7 중 지팡이 무덤이 아닌 무작위 한 곳(`nBossTombLevel`)
- 지역 칸이 빈 9명은 나오지 않는다: Winged Death·The Tormentor·Taintbreeder·Riftwraith the Cannibal·Axe Dweller·Anodized Elite·Vinvear Molech·Magma Torquer(DS1에 없고, exe에서 이 8명의 hcIdx로 슈퍼유니크를 찾는 코드가 없음: 슈퍼유니크 번호 표 `+0xAE0`의 해당 칸을 읽는 곳 0), Blaze Ripper(DS1은 있으나 `lvlprest.txt` `Act 5 - Barricade Snow Unique`의 `Files`가 0이고 지도 코드가 쓰지 않음).
- The Summoner는 슈퍼유니크 기록이 아니라 `monstats` 몬스터 `summoner`로 놓인다(`monpreset.txt` 액트2). 그래서 +3이 붙지 않고 레벨은 `monstats` `Level(N)`·`Level(H)`다.

### 노말

- 노말은 TC 올림이 없어 레벨이 TC에 영향을 주지 않으므로 레벨을 적지 않는다. 지역은 나이트메어 표와 같다.

| hcIdx | Superunique | 클래스 | TC | 장비 TC / 룬 |
|---|---|---|---|---|
| 0 | Bishibosh | fallenshaman1 | Act 1 Super A | 3 / - |
| 1 | Bonebreak | skeleton1 | Act 1 Super A | 3 / - |
| 2 | Coldcrow | cr_archer1 | Act 1 Super A | 3 / - |
| 3 | Rakanishu | fallen2 | Act 1 Super B | 6 / - |
| 4 | Treehead WoodFist | brute2 | Act 1 Super B | 6 / - |
| 5 | Griswold | griswold (B) | Griswold | 12 / - |
| 6 | The Countess | corruptrogue3 | Countess | 12 / Ral |
| 7 | Pitspawn Fouldog | bighead2 | Act 1 Super B | 6 / - |
| 8 | Flamespike the Crawler | quillrat4 | Act 1 Unique C | 12 / - |
| 9 | Boneash | skmage_pois3 | Act 1 Super C | 12 / - |
| 10 | Radament | radament (B) | Radament | 27 / Ral |
| 11 | Bloodwitch the Wild | pantherwoman1 | Act 2 Super A | 15 / Nef |
| 12 | Fangskin | clawviper3 | Act 2 Super B | 18 / Nef |
| 13 | Beetleburst | scarab2 | Act 2 Super B | 18 / Nef |
| 14 | Leatherarm | mummy2 | Act 2 Super A | 15 / Nef |
| 15 | Coldworm the Burrower | maggotqueen1 | Act 2 Super B | 18 / Nef |
| 16 | Fire Eye | sandraider3 | Act 2 Super B | 18 / Nef |
| 17 | Dark Elder | zombie5 | Act 2 Super B | 18 / Nef |
| 18 | The Summoner | summoner (B) | Summoner | 21 / Nef |
| 19 | Ancient Kaa the Soulless | unraveler3 | Act 2 Super C | 21 / Ral |
| 20 | The Smith | smith | Smith | 12 / - |
| 21 | Web Mage the Burning | arach4 | Act 3 Super A | 24 / Ral |
| 22 | Witch Doctor Endugu | fetishshaman4 | Act 3 Super B | 27 / Ral |
| 23 | Stormtree | thornhulk3 | Act 3 Super B | 27 / Ral |
| 24 | Sarina the Battlemaid | corruptrogue5 | Act 3 Super B | 27 / Ral |
| 25 | Icehawk Riftwing | batdemon3 | Act 3 Super A | 24 / Ral |
| 26 | Ismail Vilehand | councilmember1 | Council | 33 / Sol |
| 27 | Geleb Flamefinger | councilmember2 | Council | 33 / Sol |
| 28 | Bremm Sparkfist | councilmember3 | Council | 33 / Sol |
| 29 | Toorc Icefist | councilmember1 | Council | 33 / Sol |
| 30 | Wyand Voidfinger | councilmember2 | Council | 33 / Sol |
| 31 | Maffer Dragonhand | councilmember3 | Council | 33 / Sol |
| 32 | Winged Death | megademon3 | Act 4 Super A | 33 / Sol |
| 33 | The Tormentor | willowisp3 | Act 4 Super A | 33 / Sol |
| 34 | Taintbreeder | vilemother2 | Act 4 Super A | 33 / Sol |
| 35 | Riftwraith the Cannibal | regurgitator2 | Act 4 Super A | 33 / Sol |
| 36 | Infector of Souls | megademon3 | Act 4 Super B | 36 / Sol |
| 37 | Lord De Seis | doomknight3 | Act 4 Super C | 36 / Sol |
| 38 | Grand Vizier of Chaos | fingermage3 | Act 4 Super B | 36 / Sol |
| 39 | The Cow King | hellbovine | Cow King | 12 / - |
| 40 | Corpsefire | zombie1 | Act 1 Super A | 3 / - |
| 41 | The Feature Creep | hephasto | Haphesto | 36 / Dol |
| 42 | Siege Boss | overseer1 | Act 5 Super A | 36 / Dol |
| 43 | Ancient Barbarian 1 | ancientbarb1 | - | - / - |
| 44 | Ancient Barbarian 2 | ancientbarb2 | - | - / - |
| 45 | Ancient Barbarian 3 | ancientbarb3 | - | - / - |
| 46 | Axe Dweller | bloodlord3 | Act 5 Super C | 39 / Dol |
| 47 | Bonesaw Breaker | reanimatedhorde2 | Act 5 Super A | 36 / Dol |
| 48 | Dac Farren | imp3 | Act 5 Super B | 39 / Dol |
| 49 | Megaflow Rectifier | minion1 | Act 5 Super A | 36 / Dol |
| 50 | Eyeback Unleashed | deathmauler1 | Act 5 Super A | 36 / Dol |
| 51 | Threash Socket | siegebeast3 | Act 5 Super Cx | 39 / Dol |
| 52 | Pindleskin | reanimatedhorde5 | Act 5 Super Cx | 39 / Dol |
| 53 | Snapchip Shatter | frozenhorror1 | Act 5 Super C | 39 / Dol |
| 54 | Anodized Elite | succubus4 | Act 5 Super C | 39 / Dol |
| 55 | Vinvear Molech | succubuswitch2 | Act 5 Super A | 36 / Dol |
| 56 | Sharp Tooth Sayer | overseer3 | Act 5 Super B | 39 / Dol |
| 57 | Magma Torquer | imp5 | Act 5 Super C | 39 / Dol |
| 58 | Blaze Ripper | deathmauler5 | Act 5 Super C | 39 / Dol |
| 59 | Frozenstein | snowyeti4 | Act 5 Super C | 39 / Dol |
| 60 | Nihlathak Boss | nihlathakboss (B) | Nihlathak | 39 / Dol |
| 61 | Baal Subject 1 | fallenshaman5 | Act 5 Champ C | 39 / Dol |
| 62 | Baal Subject 2 | unraveler5 | Act 5 Champ C | 39 / Dol |
| 63 | Baal Subject 3 | baalhighpriest | Act 5 Champ C | 39 / Dol |
| 64 | Baal Subject 4 | venomlord | Act 5 Champ C | 39 / Dol |
| 65 | Baal Subject 5 | baalminion1 | Act 5 Champ C | 39 / Dol |

### 나이트메어

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
| 8 | Flamespike the Crawler | quillrat4 | 32 Inner Cloister | 44 | Act 1 (N) Unique C | Act 2 (N) Unique B | 48 / Ko |
| 9 | Boneash | skmage_pois3 | 33 Cathedral | 45 | Act 1 (N) Super C | Act 2 (N) Super B | 48 / Ko |
| 10 | Radament | radament (B) | 49 Sewers Level 3 | 52 | Radament (N) |  | 51 / Lem |
| 11 | Bloodwitch the Wild | pantherwoman1 | 60 Halls Of The Dead Level 3 | 48 | Act 2 (N) Super A | Act 3 (N) Super A | 51 / Lem |
| 12 | Fangskin | clawviper3 | 61 Claw Viper Temple Level 2 | 50 | Act 2 (N) Super B | Act 3 (N) Super B | 51 / Lem |
| 13 | Beetleburst | scarab2 | 43 Far Oasis | 48 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 14 | Leatherarm | mummy2 | 59 Stony Tomb Level 2 | 47 | Act 2 (N) Super A | Act 2 (N) Super C | 48 / Ko |
| 15 | Coldworm the Burrower | maggotqueen1 | 64 Maggot Lair Level 3 | 49 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 16 | Fire Eye | sandraider3 | 54 Palace Cellar Level 3 | 51 | Act 2 (N) Super B | Act 3 (N) Super C | 51 / Lem |
| 17 | Dark Elder | zombie5 | 44 Lost City | 49 | Act 2 (N) Super B | Act 3 (N) Super A | 51 / Lem |
| 18 | The Summoner | summoner (B) | 74 Arcane Sanctuary | 55 | Summoner (N) |  | 48 / Ko |
| 19 | Ancient Kaa the Soulless | unraveler3 | 66 Tal Rashas Tomb #1 | 52 | Act 2 (N) Super C | Act 3 (N) Super C | 51 / Lem |
| 20 | The Smith | smith | 28 Barracks | 43 | Smith (N) |  | 66 / Vex |
| 21 | Web Mage the Burning | arach4 | 85 Spider Cavern | 53 | Act 3 (N) Super A | Act 3 (N) Super C | 51 / Lem |
| 22 | Witch Doctor Endugu | fetishshaman4 | 91 Flayer Dungeon Level 3 | 54 | Act 3 (N) Super B | Act 4 (N) Super A | 54 / Um |
| 23 | Stormtree | thornhulk3 | 78 Flayer Jungle | 53 | Act 3 (N) Super B | Act 3 (N) Super C | 51 / Lem |
| 24 | Sarina the Battlemaid | corruptrogue5 | 94 Ruined Temple | 56 | Act 3 (N) Super B | Act 4 (N) Super A | 54 / Um |
| 25 | Icehawk Riftwing | batdemon3 | 92 Sewers Level 1 | 55 | Act 3 (N) Super A | Act 4 (N) Super A | 54 / Um |
| 26 | Ismail Vilehand | councilmember1 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 27 | Geleb Flamefinger | councilmember2 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 28 | Bremm Sparkfist | councilmember3 | 102 Durance Of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 29 | Toorc Icefist | councilmember1 | 83 Travincal | 57 | Council (N) |  | 54 / Um |
| 30 | Wyand Voidfinger | councilmember2 | 102 Durance Of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 31 | Maffer Dragonhand | councilmember3 | 102 Durance Of Hate Level 3 | 58 | Council (N) |  | 54 / Um |
| 32 | Winged Death | megademon3 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 33 | The Tormentor | willowisp3 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 34 | Taintbreeder | vilemother2 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 35 | Riftwraith the Cannibal | regurgitator2 |  |  | Act 4 (N) Super A |  | 54 / Um |
| 36 | Infector of Souls | megademon3 | 108 Chaos Sanctuary | 61 | Act 4 (N) Super B | Act 4 (N) Super C | 57 / Um |
| 37 | Lord De Seis | doomknight3 | 108 Chaos Sanctuary | 61 | Act 4 (N) Super C |  | 57 / Um |
| 38 | Grand Vizier of Chaos | fingermage3 | 108 Chaos Sanctuary | 61 | Act 4 (N) Super B | Act 4 (N) Super C | 57 / Um |
| 39 | The Cow King | hellbovine | 39 Moo Moo Farm | 67 | Cow King (N) |  | 66 / Vex |
| 40 | Corpsefire | zombie1 | 8 Den Of Evil | 39 | Act 1 (N) Super A |  | 42 / Io |
| 41 | The Feature Creep | hephasto | 107 River Of Flame | 60 | Haphesto (N) |  | 60 / Ist |
| 42 | Siege Boss | overseer1 | 110 Bloody Foothills | 61 | Act 5 (N) Super A |  | 60 / Ist |
| 43 | Ancient Barbarian 1 | ancientbarb1 | 120 Arreat Summit | 71 | - |  | - / - |
| 44 | Ancient Barbarian 2 | ancientbarb2 | 120 Arreat Summit | 71 | - |  | - / - |
| 45 | Ancient Barbarian 3 | ancientbarb3 | 120 Arreat Summit | 71 | - |  | - / - |
| 46 | Axe Dweller | bloodlord3 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 47 | Bonesaw Breaker | reanimatedhorde2 | 115 Glacial Trail | 64 | Act 5 (N) Super A | Act 5 (N) Super B | 60 / Ist |
| 48 | Dac Farren | imp3 | 110 Bloody Foothills | 61 | Act 5 (N) Super B |  | 60 / Ist |
| 49 | Megaflow Rectifier | minion1 | 111 Frigid Highlands | 62 | Act 5 (N) Super A |  | 60 / Ist |
| 50 | Eyeback Unleashed | deathmauler1 | 111 Frigid Highlands | 62 | Act 5 (N) Super A |  | 60 / Ist |
| 51 | Threash Socket | siegebeast3 | 112 Arreat Plateau | 63 | Act 5 (N) Super Cx |  | 63 / Ist |
| 52 | Pindleskin | reanimatedhorde5 | 121 Nihlathak's Temple | 66 | Act 5 (N) Super Cx |  | 63 / Ist |
| 53 | Snapchip Shatter | frozenhorror1 | 119 Icy Cellar | 65 | Act 5 (N) Super C |  | 63 / Ist |
| 54 | Anodized Elite | succubus4 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 55 | Vinvear Molech | succubuswitch2 |  |  | Act 5 (N) Super A |  | 60 / Ist |
| 56 | Sharp Tooth Sayer | overseer3 | 111 Frigid Highlands | 62 | Act 5 (N) Super B |  | 60 / Ist |
| 57 | Magma Torquer | imp5 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 58 | Blaze Ripper | deathmauler5 |  |  | Act 5 (N) Super C |  | 63 / Ist |
| 59 | Frozenstein | snowyeti4 | 114 Frozen River | 64 | Act 5 (N) Super C |  | 63 / Ist |
| 60 | Nihlathak Boss | nihlathakboss (B) | 124 Halls Of Vaught | 73 | Nihlathak (N) |  | 60 / Ist |
| 61 | Baal Subject 1 | fallenshaman5 | 131 Throne Of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 62 | Baal Subject 2 | unraveler5 | 131 Throne Of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 63 | Baal Subject 3 | baalhighpriest | 131 Throne Of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 64 | Baal Subject 4 | venomlord | 131 Throne Of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |
| 65 | Baal Subject 5 | baalminion1 | 131 Throne Of Destruction | 69 | Act 5 (N) Champ C | Act 2 (H) Champ A | 69 / Lo |

### 헬

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
| 8 | Flamespike the Crawler | quillrat4 | 32 Inner Cloister | 75 | Act 1 (H) Unique C | Act 3 (H) Unique B | 75 / Ber |
| 9 | Boneash | skmage_pois3 | 33 Cathedral | 75 | Act 1 (H) Super C | Act 3 (H) Super B | 75 / Ber |
| 10 | Radament | radament (B) | 49 Sewers Level 3 | 86 | Radament (H) |  | 75 / Ber |
| 11 | Bloodwitch the Wild | pantherwoman1 | 60 Halls Of The Dead Level 3 | 85 | Act 2 (H) Super A | Act 4 (H) Super B | 78 / Cham |
| 12 | Fangskin | clawviper3 | 61 Claw Viper Temple Level 2 | 86 | Act 2 (H) Super B | Act 4 (H) Super B | 78 / Cham |
| 13 | Beetleburst | scarab2 | 43 Far Oasis | 79 | Act 2 (H) Super B | Act 3 (H) Super C | 75 / Ber |
| 14 | Leatherarm | mummy2 | 59 Stony Tomb Level 2 | 82 | Act 2 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 15 | Coldworm the Burrower | maggotqueen1 | 64 Maggot Lair Level 3 | 88 | Act 2 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 16 | Fire Eye | sandraider3 | 54 Palace Cellar Level 3 | 81 | Act 2 (H) Super B | Act 4 (H) Super A | 78 / Cham |
| 17 | Dark Elder | zombie5 | 44 Lost City | 80 | Act 2 (H) Super B | Act 3 (H) Super C | 75 / Ber |
| 18 | The Summoner | summoner (B) | 74 Arcane Sanctuary | 80 | Summoner (H) |  | 72 / Lo |
| 19 | Ancient Kaa the Soulless | unraveler3 | 66 Tal Rashas Tomb #1 | 83 | Act 2 (H) Super C | Act 4 (H) Super A | 78 / Cham |
| 20 | The Smith | smith | 28 Barracks | 73 | Smith (H) |  | 66 / Vex |
| 21 | Web Mage the Burning | arach4 | 85 Spider Cavern | 82 | Act 3 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 22 | Witch Doctor Endugu | fetishshaman4 | 91 Flayer Dungeon Level 3 | 86 | Act 3 (H) Super B | Act 4 (H) Super B | 78 / Cham |
| 23 | Stormtree | thornhulk3 | 78 Flayer Jungle | 83 | Act 3 (H) Super B | Act 4 (H) Super A | 78 / Cham |
| 24 | Sarina the Battlemaid | corruptrogue5 | 94 Ruined Temple | 87 | Act 3 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 25 | Icehawk Riftwing | batdemon3 | 92 Sewers Level 1 | 87 | Act 3 (H) Super A | Act 4 (H) Super C | 78 / Cham |
| 26 | Ismail Vilehand | councilmember1 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 27 | Geleb Flamefinger | councilmember2 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 28 | Bremm Sparkfist | councilmember3 | 102 Durance Of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 29 | Toorc Icefist | councilmember1 | 83 Travincal | 85 | Council (H) |  | 78 / Cham |
| 30 | Wyand Voidfinger | councilmember2 | 102 Durance Of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 31 | Maffer Dragonhand | councilmember3 | 102 Durance Of Hate Level 3 | 86 | Council (H) |  | 78 / Cham |
| 32 | Winged Death | megademon3 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 33 | The Tormentor | willowisp3 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 34 | Taintbreeder | vilemother2 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 35 | Riftwraith the Cannibal | regurgitator2 |  |  | Act 4 (H) Super A |  | 78 / Cham |
| 36 | Infector of Souls | megademon3 | 108 Chaos Sanctuary | 88 | Act 4 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 37 | Lord De Seis | doomknight3 | 108 Chaos Sanctuary | 88 | Act 4 (H) Super C |  | 78 / Cham |
| 38 | Grand Vizier of Chaos | fingermage3 | 108 Chaos Sanctuary | 88 | Act 4 (H) Super B | Act 4 (H) Super C | 78 / Cham |
| 39 | The Cow King | hellbovine | 39 Moo Moo Farm | 84 | Cow King (H) |  | 66 / Vex |
| 40 | Corpsefire | zombie1 | 8 Den Of Evil | 82 | Act 1 (H) Super A | Act 4 (H) Super A | 78 / Cham |
| 41 | The Feature Creep | hephasto | 107 River Of Flame | 88 | Haphesto (H) |  | 84 / Zod |
| 42 | Siege Boss | overseer1 | 110 Bloody Foothills | 83 | Act 5 (H) Super A |  | 84 / Zod |
| 43 | Ancient Barbarian 1 | ancientbarb1 | 120 Arreat Summit | 90 | - |  | - / - |
| 44 | Ancient Barbarian 2 | ancientbarb2 | 120 Arreat Summit | 90 | - |  | - / - |
| 45 | Ancient Barbarian 3 | ancientbarb3 | 120 Arreat Summit | 90 | - |  | - / - |
| 46 | Axe Dweller | bloodlord3 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 47 | Bonesaw Breaker | reanimatedhorde2 | 115 Glacial Trail | 86 | Act 5 (H) Super A |  | 84 / Zod |
| 48 | Dac Farren | imp3 | 110 Bloody Foothills | 83 | Act 5 (H) Super B |  | 87 / Zod |
| 49 | Megaflow Rectifier | minion1 | 111 Frigid Highlands | 84 | Act 5 (H) Super A |  | 84 / Zod |
| 50 | Eyeback Unleashed | deathmauler1 | 111 Frigid Highlands | 84 | Act 5 (H) Super A |  | 84 / Zod |
| 51 | Threash Socket | siegebeast3 | 112 Arreat Plateau | 84 | Act 5 (H) Super Cx |  | 87 / Zod |
| 52 | Pindleskin | reanimatedhorde5 | 121 Nihlathak's Temple | 86 | Act 5 (H) Super Cx |  | 87 / Zod |
| 53 | Snapchip Shatter | frozenhorror1 | 119 Icy Cellar | 86 | Act 5 (H) Super C | Act 4 (H) Super Bx | 78 / Cham |
| 54 | Anodized Elite | succubus4 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 55 | Vinvear Molech | succubuswitch2 |  |  | Act 5 (H) Super A |  | 84 / Zod |
| 56 | Sharp Tooth Sayer | overseer3 | 111 Frigid Highlands | 84 | Act 5 (H) Super B |  | 87 / Zod |
| 57 | Magma Torquer | imp5 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 58 | Blaze Ripper | deathmauler5 |  |  | Act 5 (H) Super C |  | 87 / Zod |
| 59 | Frozenstein | snowyeti4 | 114 Frozen River | 86 | Act 5 (H) Super C | Act 4 (H) Super Bx | 78 / Cham |
| 60 | Nihlathak Boss | nihlathakboss (B) | 124 Halls Of Vaught | 95 | Nihlathak (H) |  | 87 / Zod |
| 61 | Baal Subject 1 | fallenshaman5 | 131 Throne Of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 62 | Baal Subject 2 | unraveler5 | 131 Throne Of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 63 | Baal Subject 3 | baalhighpriest | 131 Throne Of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 64 | Baal Subject 4 | venomlord | 131 Throne Of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |
| 65 | Baal Subject 5 | baalminion1 | 131 Throne Of Destruction | 88 | Act 5 (H) Champ C |  | 87 / Zod |

## 4. 액트 보스 (`monstats.txt` `boss` 클래스)

- 레벨은 `monstats` 레벨, 올림 없음. 퀘스트 TC는 죽인 캐릭터(소환수·용병이면 그 주인)의 그 퀘스트 기록에서 완료(bit 15)·보상 대기(bit 1)·`monstats.txt` `TCQuestCP` bit가 모두 꺼져 있을 때 쓴다(`0x5A6705`~`0x5A67E9`). 퀘스트 번호·CP: 안다리엘 6·1, 듀리엘 14·5, 메피스토 22·0, 디아블로 26·0, 바알 40·0(`TCQuestId`·`TCQuestCP`).
- 퀘스트 TC와 일반 TC의 차이(`treasureclassex.txt`, 5개 보스 3난이도 모두 같은 모양, 261105): `Picks`·`NoDrop`과 장비·좋은 아이템 하위 TC는 같아서 최고 장비 TC·룬은 같다. 다른 점은 둘이다.
  - 항목: 퀘스트 TC에는 골드(`gld`)와 `Junk`가 없다. 그래서 한 번 뽑을 때 장비·`Good`이 나올 비율이 오른다(예: 안다리엘 일반 = 골드 11·장비 19·잡템 15·좋은 3, 퀘스트 = 장비 19·좋은 3).
  - 품질 계수: 유니크·세트 983 → 995(안다리엘) 또는 993(그 밖), 레어 983 → 1024(레어 이상 보장). 듀리엘은 하위 `Duriel - Base`·`Durielq - Base`에서 같은 차이.

| 몬스터 | 난이도 | 레벨 | TC | 장비 TC / 룬 | 퀘스트 TC | 장비 TC / 룬 |
|---|---|---|---|---|---|---|
| bloodraven | 노말 | 10 | Blood Raven | 6 / - | - | - |
| bloodraven | 나이트메어 | 43 | Blood Raven (N) | 42 / Io | - | - |
| bloodraven | 헬 | 88 | Blood Raven (H) | 66 / Vex | - | - |
| andariel | 노말 | 12 | Andariel | 15 / Nef | Andarielq | 15 / Nef |
| andariel | 나이트메어 | 49 | Andariel (N) | 45 / Ko | Andarielq (N) | 45 / Ko |
| andariel | 헬 | 75 | Andariel (H) | 69 / Lo | Andarielq (H) | 69 / Lo |
| duriel | 노말 | 22 | Duriel | 24 / Ral | Durielq | 24 / Ral |
| duriel | 나이트메어 | 55 | Duriel (N) | 51 / Lem | Durielq (N) | 51 / Lem |
| duriel | 헬 | 88 | Duriel (H) | 72 / Ber | Durielq (H) | 72 / Ber |
| mephisto | 노말 | 26 | Mephisto | 33 / Sol | Mephistoq | 33 / Sol |
| mephisto | 나이트메어 | 59 | Mephisto (N) | 54 / Um | Mephistoq (N) | 54 / Um |
| mephisto | 헬 | 87 | Mephisto (H) | 78 / Cham | Mephistoq (H) | 78 / Cham |
| izual | 노말 | 29 | Izual | 36 / Sol | - | - |
| izual | 나이트메어 | 60 | Izual (N) | 57 / Um | - | - |
| izual | 헬 | 86 | Izual (H) | 78 / Cham | - | - |
| diablo | 노말 | 40 | Diablo | 36 / Dol | Diabloq | 36 / Dol |
| diablo | 나이트메어 | 62 | Diablo (N) | 60 / Ist | Diabloq (N) | 60 / Ist |
| diablo | 헬 | 94 | Diablo (H) | 84 / Zod | Diabloq (H) | 84 / Zod |
| baalcrab | 노말 | 60 | Baal | 42 / Io | Baalq | 42 / Io |
| baalcrab | 나이트메어 | 75 | Baal (N) | 63 / Vex | Baalq (N) | 63 / Vex |
| baalcrab | 헬 | 99 | Baal (H) | 87 / Zod | Baalq (H) | 87 / Zod |

## 5. 계산에 넣지 않은 것 (메모)

- **TC 안의 확률:** `treasureclassex.txt` `Picks`·`NoDrop`·`Prob1~10`. 위 표는 최대치만 다룬다.
- **플레이어 수와 NoDrop** (1.14d `0x55A8A1`~`0x55A9D9`, D2MOO `Items.cpp`와 같음):
  - n = (게임 인원 − p) ÷ 2 + p. p = 죽인 캐릭터(소환수면 주인)와 같은 지역의 살아 있는 파티원 수(1~8). 몬스터의 플레이어 수 스탯(생길 때의 게임 인원)을 넘지 않음
  - r = NoDrop / (나머지 확률 합 + NoDrop)
  - 새 NoDrop = 나머지 확률 합 / (1 − rⁿ) × rⁿ
- **아이템 레벨(숨렙):** TC와 아이템 레벨은 하는 일이 다르다. TC 숫자(`weapNN`)는 **어떤 기본 아이템이 나올 수 있는지**(기본 아이템 레벨 상한)를 정하고, 아이템 레벨은 떨어진 그 아이템의 **접사·소켓 수**를 정한다(`item_mods.md`). 몬스터 드랍의 아이템 레벨은 몬스터 레벨(표의 레벨 칸, 챔피언 +2·유니크 +3 포함), 상자는 지역 레벨이라 랜덤이 아니다(1절 "아이템 레벨", 1.14d `0x558200`). TC 올림이 "TC `level` ≤ 몬스터 레벨"이라 보통 아이템 레벨이 TC 숫자보다 높거나 같지만, TC 숫자가 아이템 레벨의 하한이라는 뜻은 아니다.
- **퀘스트 보상 룬:** 헬포지·Rescue on Mount Arreat 보상은 `treasureclassex.txt`에 없다(검색 0건). 1.14d 코드로 확인했다(261105, 아래 6절 원문과 같음).
  - 헬포지(확장판): 노말 El~Amn(r01~r11), 나이트메어 Sol~Um(r12~r22), 헬 Hel~Gul(r15~r25) 중 11개에서 균등하게 하나(`0x5B68AA`, 표 `0x73E114`·`0x73E514`·`0x73E540`). 클래식 경로는 보지 않았다.
  - Rescue on Mount Arreat: Qual-Kehk 대화에서 Tal·Ral·Ort(r07~r09)를 차례로 준다. 이미 일부를 받은 기록(퀘스트 bit)이 있으면 2개(Tal·Ral)나 1개(Tal)(`0x587C32`~`0x587C96`, 표 `0x732FEC`).

## 6. 원문 메모 (PureDiablo "Rune Farming")

- 출처: https://www.purediablo.com/diablo-2/diablo-2-rune-farming (가져온 날 261104). 근거: 웹. 헬포지·Rescue on Mount Arreat 룬은 5절에서 1.14d로 확인(같음). 상자 문단은 대조 대상 아님(원문 설명). 원문 영어 그대로, 위 계산과 겹치는 절(몬스터·카운테스·상자 최고 룬 목록·레벨 85 상자 TC·플레이어 수)은 뺐다.
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
