# TC 슈퍼유니크 지역: 1.14d exe 대조 (임시노트)

`docs/info/tc.md` 3절의 슈퍼유니크 지역을 1.14d `Game.exe`로 대조하는 작업 기록 (261105).

## 현재 상태

- 지역은 두 단계로 정했다.
  1. 슈퍼유니크가 들어 있는 지도 파일(DS1): 1.14d DS1(mpqdata `tiles/`)의 프리셋 몬스터를 `monpreset.txt`로 읽음. 근거: **데이터**
  2. 그 DS1이 쓰이는 지역: `lvlprest.txt` 번호 → D2MOO 지도 생성 코드. 근거: **D2MOO(1.10f 재구성), 1.14d 미확인**
- 이 노트의 할 일은 2단계를 1.14d exe로 확인하는 것이다.

## 할 일

- 필요한 파일: 1.14d `Game.exe`(FileVersion 1.14.3.71, 다시 올려야 함), D2MOO 소스(다시 받음)
- 대조할 D2MOO 함수 (근거: D2MOO 코드, 1.14d 주소는 대부분 주석에 없음 — Claude 제안 미결정: 이 함수들의 1.14d 위치를 찾아 지역 조건을 비교)

| 슈퍼유니크 | D2MOO 함수 / 표 | 확인할 조건 |
|---|---|---|
| Bishibosh, Rakanishu, Treehead WoodFist, The Cow King | `DrlgOutWild.cpp` 액트1 바깥 지역 switch | Cold Plains·Stony Field·Dark Wood·Moo Moo Farm |
| Corpsefire, Coldcrow, Bonebreak, Pitspawn Fouldog | `DrlgMaze.cpp` `nAct1CaveDOEIds`·`nAct1CaveColdcrowIds`·`nAct1CryptSpecialIds`·`nAct1JailPitspawnIds` | Den of Evil·Cave Level 1·Crypt·Jail Level 2 |
| The Smith | `DRLGMAZE_PlaceAct1Barracks` | Barracks |
| Beetleburst, Dark Elder | `DRLGOUTDESR_InitAct2OutdoorLevel`(1.14d `0x67F980`), `DRLGOUTDESR_PlaceRuinsInLostCity` | Far Oasis·Lost City |
| Radament, Fire Eye | `nAct2SewerRadamentIds`, 지하실 재배치(`LEVEL_PALACECELLARLEV3`) | Sewers Level 3·Palace Cellar Level 3 |
| Leatherarm, Bloodwitch, Fangskin, Ancient Kaa | `DRLGMAZE_PlaceAct2TombStuff`, `LVLPREST_ACT2_TOMB_TAINTED_SUN_X`, `nBossTombLevel`(`DrlgDrlg.cpp`) | Stony Tomb Level 2·Halls of the Dead Level 3·Claw Viper Temple Level 2·무작위 무덤 |
| Coldworm the Burrower | `DRLGMAZE_PlaceAct2LairStuff` | Maggot Lair Level 3 |
| Stormtree | `DrlgOutJung.cpp` `LVLPREST_ACT3_JUNGLE_TAIL` | Flayer Jungle |
| Web Mage the Burning | 거미 동굴 재배치(`LEVEL_SPIDERCAVERN`) | Spider Cavern |
| Icehawk Riftwing | `DRLGMAZE_PlaceAct3SewerStuff` | Sewers Level 1·2 둘 다인지 |
| The Feature Creep | `DRLGMAZE_PlaceAct4Lava` | River of Flame |
| Siege Boss, Dac Farren | `DrlgOutSiege.cpp` `LVLPREST_ACT5_SIEGE_TO_TOWN` + i | Bloody Foothills |
| Megaflow Rectifier, Sharp Tooth Sayer | `DRLGOUTSIEGE_ConnectBarricadeAndSiege`, `DRLGOUTSIEGE_PlacePrisons` | Rigid Highlands |
| Eyeback Unleashed | `DRLGOUTSIEGE_PlaceBarricadeEntrancesAndExits` | 111·112·117 출구 모두인지 |
| Threash Socket | `DRLGOUTSIEGE_PlaceCaves` | Arreat Plateau |
| Bonesaw Breaker, Frozenstein, Snapchip Shatter | `DRLGMAZE_PlaceAct5IceStuff`, 얼음 동굴 switch(`LEVEL_CELLAROFPITY`·`LEVEL_GLACIALCAVESLEV2`) | Crystalized Cavern Level 2·Cellar of Pity·Glacial Caves Level 2 |
| Blaze Ripper | `LVLPREST_ACT5_BARRICADE_SNOW_UNIQUE`를 쓰는 곳이 없는지 | 나오지 않음 |

- `lvlprest.txt`에 `LevelId`가 적힌 것(Countess 25, Flamespike 32, Boneash 33, Griswold 38, Endugu 91, Sarina 94, Mephisto Complex 102, Pindleskin 121)은 데이터로 정해져 대조 대상이 아니다.
