# 1.14d Game.exe 주소 색인

1.14d `Game.exe`(FileVersion 1.14.3.71, ImageBase `0x400000`)에서 확인한 함수·표·구조체 위치. 분석 방법·스크립트는 `tools/README.md`.

- 근거: 역어셈블로 직접 읽은 것만 적는다. "D2MOO 이름"은 D2MOO(1.10f 재구성, 판 `4a60fca`)의 같은 함수 이름이다.
- 결과로 정한 규칙은 각 정보 파일에 있다(`tc.md`, `experience.md`). 여기는 위치만.

## 1. 데이터 표·구조체

| 대상 | 위치 | 비고 |
|---|---|---|
| 데이터 표 묶음(`sgptDataTables`) | `[0x744304]` | 아래 `+` 위치는 이 묶음 기준 |
| `monstats` 기록 | `+0xA78`(배열), `+0xA80`(개수), 기록 크기 `0x1A8` | 기록 안: TC `+0x86 + 난이도×8 + 종류×2`(종류 0 일반·1 챔피언·2 유니크·3 퀘스트), `TCQuestId` `+0x9E`, `TCQuestCP` `+0x9F`, `Level` `+0xAA + 난이도×2`, `Exp` `+0xD4 + 난이도×2` |
| 슈퍼유니크 번호 → 몬스터 번호 표 | `+0xAE0 + hcIdx×2` | 이 칸을 읽는 곳으로 소환 코드를 찾는다 |
| `superuniques` 기록 | `0x6556E0`(번호로 기록 얻기) | 기록 안: `Class` `+4`, `MinGrp` `+0x1C`, `MaxGrp` `+0x20`, `AutoPos` `+0x24`, `Stacks` `+0x26`, TC `+0x2C + 난이도×2` |
| `experience` 기록 | `[0x96C8A8]` | `+0`(최대 레벨), `+0x1C`(기준 `ExpRatio`), 레벨 L 기록 `+0x20 + L×0x20`(직업 7칸 + `ExpRatio` `+0x1C`) |
| 오브젝트 프리셋 → `objects.txt` 번호 | `0x748AD8` | `int[5][150]`(액트별). 예: 액트5 56 → 462 |
| 게임 구조체 | - | 난이도 `+0x6D`(byte), 확장판 `+0x70`, 슈퍼유니크 나온 기록 비트 `+0x1D30` |
| 지역(DRLG level) 구조체 | - | 지역 번호 `+0x1D0`, 지역 종류 `+0x1C0` |
| DRLG 구조체 | - | 지팡이 무덤 `+0x94`, 보스(카아) 무덤 `+0x484`, 액트 `+0x480` |

## 2. 지도 생성 (슈퍼유니크 지역, `tc.md` 3절)

| 함수·표 | 위치 | D2MOO 이름 |
|---|---|---|
| 미로 지도 배열 50개 | `0x6EF8A8`~`0x6F05D8` | `DrlgMaze.cpp` `nAct*Ids` |
| 지도 배열 바꾸기 | `0x6724E0` | `DRLGMAZE_ScanReplaceSpecialPreset` |
| 미로 지역 종류 분기 | `0x673B85`(종류 − 3, 바이트 표 `0x673FBC`, 분기 표 `0x673F70`) | `DrlgMaze.cpp` 지역 종류 `switch` |
| 미로 뒤처리(28 Barracks·107 River Of Flame) | `0x673F14` → `0x673120`·`0x673320` | `DRLGMAZE_PlaceAct1Barracks`·`PlaceAct4Lava` |
| 액트1 미로(동굴·지하실·감옥) | `0x672550`~`0x672790` | 각 `case LVLTYPE_ACT1_*` |
| 액트2 하수도·무덤·굴 | `0x672873`(지역 − 47 분기), `0x672C0A`~`0x672D8B`, `0x672DED` | `ScanReplaceSpecialAct2SewersPresets`, `PlaceAct2TombStuff`, `PlaceAct2LairStuff` |
| 액트3 하수도 배수로 | `0x672F00` | `PlaceAct3SewerStuff` |
| 액트5 얼음 동굴 | `0x673E52`, `0x6735A1` | 얼음 동굴 `case`, `PlaceAct5IceStuff` |
| 방 지도 재배치(지하실 3층·거미 굴) | `0x670A56`~`0x670AF7` | `sSetChamberPreset` 안 |
| 바깥 지역 액트 분기 | `0x67541C`(134는 액트2로) → 액트1 `0x6807F0`, 액트2 `0x67F980`, 액트3 `0x67F450`, 액트4 `0x67E890`, 액트5 `0x67E600` | `DRLGOUTDOORS_*` |
| 액트1 바깥 | `0x680580`(지역 − 2 분기) | `DrlgOutWild.cpp` |
| 액트2 사막 | `0x67F99B`(지역 − 41 분기), 변형 배치 `0x67F470` | `DRLGOUTDESR_InitAct2OutdoorLevel`, `PlacePresetVariants` |
| 액트3 정글 | `0x67EA0B` | `DrlgOutJung.cpp` |
| 액트4 Chaos Sanctum 지도(날개 4개) | `0x67E8BF` → `0x67E840`, 표 `0x6F22C0` | `nLavaLvlPrestIds` |
| 액트5 바깥 | `0x67E600`, Siege `0x67E560`, 출구 `0x67DB50`, 동굴 `0x67DA70`(표 `0x6F1F9C`), 감옥 `0x67E240`, 바리케이드→Siege `0x67E4B0` | `DrlgOutSiege.cpp` |
| 바깥 지도 놓기 | `0x674730`, `0x6743C0`, 무작위 `0x674920` | `DRLGOUTDOORS_SpawnOutdoorLevelPreset(Ex)`, `SpawnRandomOutdoorDS1` |

## 3. 몬스터 생성·슈퍼유니크

| 함수·표 | 위치 | D2MOO 이름 |
|---|---|---|
| 프리셋·소환 몬스터 만들기 | `0x54E600` | `D2GAME_SpawnPresetMonster_6FC66560` |
| 슈퍼유니크 만들기(게임당 한 번, 부하 수) | `0x5A49B0`(부르는 곳 `0x54E67E` 하나), 부하 수 `0x5A4B6C`, hcIdx 분기 `0x5A4BE4` | `D2GAME_SpawnSuperUnique_6FC6F690` |
| 부하 소환 | `0x5A2120`(부하 만들기 `0x5A0C00`, 부하 종류 `0x5A0BB0`, umod 1~4 표 `0x6E2168`을 보스·부하에 적용, umod 함수 표 `0x73C008`) | `MONSTERUNIQUE_SpawnMinions` |
| 부하 목록에 함수 실행 | `0x58F380` | `AIGENERAL_ExecuteCallbackOnMinions` |
| umod 적용 | `0x5A2100` | `MONSTERUNIQUE_InitializeUMod` |
| 유니크 무리 만들기 | `0x5A43E0` | `MONSTERUNIQUE_SpawnUniqueGroup` |
| 비율 계산 a × b ÷ c | `0x483360` | `MONSTERUNIQUE_CalculatePercentage` |
| 퀘스트 소환 | `0x545C30` | `QUESTS_SpawnMonster` |
| 디아블로 봉인 보스 | `0x5B5750` | `ACT4Q2_SpawnSealBoss` |
| 고대인 석상 | `0x58C114` | `A5Q5.cpp` 석상 함수 |
| 니라탁(오브젝트 462) | `0x58A6EE`~`0x58A70D` | `OBJECTS_InitFunction69_NihlathakStartOutsideTown` |
| 바알 왕좌 AI, 부하 표 | `0x5EF320`, 표 `0x6E3528`(hcIdx 61~65) | `AITHINK_Fn134_BaalThrone` |
| 바알 부하 소환 미사일 | `0x5ACAF0`(`0x5ACB43`) | `MissMode.cpp` |
| 지역 몬스터 목록 | `0x5475F0` | `MonsterRegion.cpp` 지역 초기화 |
| 방 채우기(밀집도) | `0x54EC90`(상한 `0x54ECE2`, ÷100,000 `0x54EDC6`) | `D2GAME_PopulateRoom_6FC67190` |
| 유니크·챔피언 판정 | `0x5BE020`(최소 `+0x2BC`, 최대 `+0x2BD`, 지금 수 `+0x2C8`) | `MONSTERCHOOSE_GetBossSpawnType` |
| 노말 `umon` 고르기 | `0x5BDE80` | `MONSTERCHOOSE_GetPresetMonsterId` |
| 몬스터 레벨·스탯 | `0x573E18`(`monstats` 레벨), `0x61DCA0`(지역 레벨), `0x6538A0`(monlvl × monstats) | `Monster.cpp` 몬스터 스탯 초기화, 지역 레벨 읽기, `DATATBLS_CalculateMonsterStatsByLevel` |
| 인원 보너스 | `0x573910`(표 `0x6E15B4`), `0x573930` | `MONSTER_GetExperienceBonus`, `MONSTER_GetPlayerCountBonus` |
| umod 레벨 가산·챔피언 | `0x5A0E40`(+3, 경험치 × 5), `0x5A0E80`(−1, 경험치 × 3/5) | `MONSTERUNIQUE_UMod4_LevelBonus`, `UMod16_Champion` |

## 4. 드랍·아이템

| 함수 | 위치 | D2MOO 이름 |
|---|---|---|
| 몬스터 드랍 TC 고르기 | `0x5A6600` | `MONSTERMODE_DropTreasure` |
| TC 올림 | `0x55AFA0`(조건), `0x654E00`(루프) | - |
| TC 드랍(Picks, NoDrop 인원식) | `0x55A6D0` | `D2GAME_DropTC_6FC51360` |
| 품질 판정(계수 ÷ 1024) | `0x5586DB`~`0x558974` | `Items.cpp` 품질 부분 |
| 아이템 레벨 | `0x558200` | `ITEMS_GetItemLevelForNewItem` |
| 상자 TC | `0x585B90`(액트 첫·끝 지역 표 `0x6E1988`) | - |
| 헬포지 보상 | `0x5B6710`(룬 표 `0x73E114`·`0x73E514`·`0x73E540`) | `ACT4Q3_CreateReward` |
| Rescue on Mount Arreat 보상 | `0x587B00`(룬 표 `0x732FEC`) | `ACT5Q2_Callback11_ScrollMessage` |

## 5. 경험치 (`experience.md` 1절)

| 함수·표 | 위치 | D2MOO 이름 |
|---|---|---|
| 경험치 분배 | `0x57E990` | `SUNITDMG_DistributeExperience` |
| 경험치 계산 | `0x57E480`(레벨 차이 `0x57E2F0`, `ExpRatio` `0x57E390`, 용병 상한 `0x57E3F0`) | `SUNITDMG_ComputeExperienceGain` |
| 레벨 차이 표 | `0x6E1668`(내 레벨 ≥ 몬스터), `0x6E1694`(몬스터 > 나) | `experienceFactors` |
| 파티 분배 | `0x57E6C0`(32비트 곱 `0x57E739`), 파티원 조건 `0x57E5A0` | `SUNITDMG_PartyCallback_ComputePartyExperience` 등 |
| 플레이어 경험치 더하기 | `0x57E510` | `SUNITDMG_AddExperienceForPlayer` |
| `ExpRatio` 읽기 | `0x613E60` | `DATATBLS_GetExpRatio` |
| 최대 레벨 | `0x611830` | `DATATBLS_GetMaxLevel` |
