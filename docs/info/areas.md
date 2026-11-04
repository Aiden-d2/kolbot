# 지역 (`me.area`, `Pather.journeyTo`, `Pather.useWaypoint`)

지역 번호와 영문·한글 이름, 지역 레벨, 웨이포인트, 지역별 슈퍼유니크, 지역 출구 타일 번호 (261104).

- 출처:
  - 번호·영문 이름·지역 레벨·웨이포인트 번호: mpqdata `levels.txt` (`Id`, `LevelName`, `MonLvl1Ex`·`MonLvl2Ex`·`MonLvl3Ex`, `Waypoint`). 근거: mpqdata
  - 한글 이름: 사용자 자료 `사냥터 코드.txt`. 웨이포인트 약칭: 사용자 자료 `waypoint.txt`. 근거: 사용자 자료
  - 슈퍼유니크·헬 레벨·최고 룬: 카오스큐브 "지역별 TC 정보"(제작 무한의공갈) 이미지 `TC Area Table.png`. 근거: 웹 미검증
  - 출구 타일 번호: kolbot 옛 sdk `tile.d2l`. 근거: 웹 미검증(판 불명)
- kolbot 사용처: `me.area`, `sdk.areas`, `Pather.journeyTo`, `Pather.useWaypoint`, `Pather.moveToExit`

## 지역 표

- 레벨 = 그 지역 일반 몬스터의 레벨(확장팩 값). 아이템 드랍 TC는 이 레벨로 정해진다(카오스큐브 표 머리말: "아이템의 숨렙 = TC + α", 노멀몹 α=0, 챔피언 2, 유니크 3, 진열대 −1, 상자·시체 0). 마을은 빈칸.
- WP = 웨이포인트 화면 번호(`levels.txt` `Waypoint`, 0부터). 빈칸 = 웨이포인트 없음.
- 슈퍼유니크·헬 레벨·최고 룬은 카오스큐브 표 값(헬 기준). "최고 룬" = 그 몬스터가 헬에서 떨어뜨릴 수 있는 가장 높은 룬.

| ID | 영문 (mpq) | 한글 | 노말 | 나이트메어 | 헬 | WP | WP 약칭 | 슈퍼유니크 (헬) | 헬 레벨 | 최고 룬 |
|---|---|---|---|---|---|---|---|---|---|---|
| 1 | Rogue Encampment | 로그캠프 |  |  |  | 0 |  |  |  |  |
| 2 | Blood Moor | 블루드무어 | 1 | 36 | 67 |  |  |  |  |  |
| 3 | Cold Plains | 콜드플레인 | 2 | 36 | 68 | 1 | 콜드 | 비숴보숴 | 71 | 로 |
| 4 | Stony Field | 스토니필드 | 4 | 37 | 68 | 2 | 스토니 | 라카니슈 | 71 | 로 |
| 5 | Dark Wood | 다크우드 | 5 | 38 | 68 | 3 | 다크 | 트리헤드 우드피스트 | 71 | 로 |
| 6 | Black Marsh | 블랙마쉬 | 6 | 38 | 69 | 4 | 블랙 |  |  |  |
| 7 | Tamoe Highland | 타모에 고지 | 8 | 39 | 69 |  |  |  |  |  |
| 8 | Den of Evil | 덴오브이블 | 1 | 36 | 79 |  |  | 불타는 시체 | 82 | 참 |
| 9 | Cave Level 1 | 케이브 1층(콜드플레인) | 2 | 36 | 77 |  |  | 콜드 크로우 | 80 | 베르 |
| 10 | Underground Passage Level 1 | 지하통로 1층 | 4 | 37 | 69 |  |  |  |  |  |
| 11 | Hole Level 1 | 홀 1층 | 5 | 38 | 80 |  |  |  |  |  |
| 12 | Pit Level 1 | 피트1층 | 7 | 39 | 85 |  |  |  |  |  |
| 13 | Cave Level 2 | 케이브 2층(콜드플레인) | 2 | 37 | 78 |  |  |  |  |  |
| 14 | Underground Passage Level 2 | 지하통로 2층 | 4 | 38 | 83 |  |  |  |  |  |
| 15 | Hole Level 2 | 홀 2층 | 5 | 39 | 81 |  |  |  |  |  |
| 16 | Pit Level 2 | 피트 2층 | 7 | 40 | 85 |  |  |  |  |  |
| 17 | Burial Grounds | 베리얼그라운드 | 3 | 36 | 80 |  |  | 블러드 레이븐 | 88 | 벡스 |
| 18 | Crypt | 크림트 | 3 | 37 | 83 |  |  | 본 브레이커 | 86 | 참 |
| 19 | Mausoleum | 머셜리움 | 3 | 37 | 85 |  |  |  |  |  |
| 20 | Forgotten Tower | 포가든타워(카운테스) |  |  |  |  |  |  |  |  |
| 21 | Tower Cellar Level 1 | 타워 1층 | 7 | 38 | 75 |  |  |  |  |  |
| 22 | Tower Cellar Level 2 | 타워 2층 | 7 | 39 | 76 |  |  |  |  |  |
| 23 | Tower Cellar Level 3 | 타워 3층 | 7 | 40 | 77 |  |  |  |  |  |
| 24 | Tower Cellar Level 4 | 타워 4층 | 7 | 41 | 78 |  |  |  |  |  |
| 25 | Tower Cellar Level 5 | 타워 5층 | 7 | 42 | 79 |  |  | 카운테스 | 82 | 로 |
| 26 | Monastery Gate | 수도원문 | 8 | 40 | 70 |  |  |  |  |  |
| 27 | Outer Cloister | 수도원외곽 | 9 | 40 | 70 | 5 | 수도원외 |  |  |  |
| 28 | Barracks | 병영 | 9 | 40 | 70 |  |  | 스미스 | 73 | 벡스 |
| 29 | Jail Level 1 | 감옥 1층 | 10 | 41 | 71 | 6 | 감옥 |  |  |  |
| 30 | Jail Level 2 | 감옥 2층 | 10 | 41 | 71 |  |  | 핏스폰 파울도그 | 74 | 베르 |
| 31 | Jail Level 3 | 감옥 3층 | 10 | 41 | 71 |  |  |  |  |  |
| 32 | Inner Cloister | 수도원안쪽 | 10 | 41 | 72 | 7 | 수도원안 | 본애쉬 | 75 | 베르 |
| 33 | Cathedral | 대성당 | 11 | 42 | 72 |  |  |  |  |  |
| 34 | Catacombs Level 1 | 카타콤 1층 | 11 | 42 | 72 |  |  |  |  |  |
| 35 | Catacombs Level 2 | 카타콤 2층 | 11 | 42 | 73 | 8 | 카타콤 |  |  |  |
| 36 | Catacombs Level 3 | 카타콤 3층 | 12 | 43 | 73 |  |  |  |  |  |
| 37 | Catacombs Level 4 | 카타콤 4층 | 12 | 43 | 73 |  |  | 안다리엘 | 75 | 로 |
| 38 | Tristram | 트리스트럼 | 6 | 39 | 76 |  |  | 그리스월드 | 87 | 벡스 |
| 39 | Moo Moo Farm | 카우 | 28 | 64 | 81 |  |  | 카우킹 | 84 | 벡스 |
| 40 | Lut Gholein | 루트 콜레인 |  |  |  | 9 | act2 |  |  |  |
| 41 | Rocky Waste | 로키 황무지 | 14 | 43 | 75 |  |  |  |  |  |
| 42 | Dry Hills | 메마른언덕 | 15 | 44 | 76 | 11 | 메마른 |  |  |  |
| 43 | Far Oasis | 파오아시스 | 16 | 45 | 76 | 13 | 파오아시스 | 비틀버스트 | 79 | 베르 |
| 44 | Lost City | 잊혀진도시 | 17 | 46 | 77 | 14 | 잊혀진 | 사악한 장로 | 80 | 베르 |
| 45 | Valley of Snakes | 스네이크사원 | 18 | 46 | 77 |  |  |  |  |  |
| 46 | Canyon of the Magi | 마기의캐니언 | 16 | 48 | 79 | 17 | 마기 |  |  |  |
| 47 | Sewers Level 1 | 하수구1층 | 13 | 43 | 74 |  |  |  |  |  |
| 48 | Sewers Level 2 | 하수구2층 | 13 | 43 | 74 | 10 | 하수구 |  |  |  |
| 49 | Sewers Level 3 | 하수구3층 | 14 | 44 | 75 |  |  | 라다먼트 | 86 | 베르 |
| 50 | Harem Level 1 | 하렘 1층 |  |  |  |  |  |  |  |  |
| 51 | Harem Level 2 | 하렘 2층 | 13 | 47 | 78 |  |  |  |  |  |
| 52 | Palace Cellar Level 1  | 궁전지하 1층 | 13 | 47 | 78 | 15 | 궁전지하 |  |  |  |
| 53 | Palace Cellar Level 2 | 궁전지하 2층 | 13 | 47 | 78 |  |  |  |  |  |
| 54 | Palace Cellar Level 3 | 궁전지하 3층 | 13 | 48 | 78 |  |  | 파이어 아이 | 81 | 참 |
| 55 | Stony Tomb Level 1 | 스토니툼 1층 | 12 | 44 | 78 |  |  |  |  |  |
| 56 | Halls of the Dead Level 1 | 죽음의홀 1층 | 12 | 44 | 79 |  |  |  |  |  |
| 57 | Halls of the Dead Level 2 | 죽음의홀 2층 | 13 | 45 | 81 | 12 | 죽음의홀 |  |  |  |
| 58 | Claw Viper Temple Level 1 | 클러바이퍼 1층 | 14 | 47 | 82 |  |  |  |  |  |
| 59 | Stony Tomb Level 2 | 스토니툼2층 | 12 | 44 | 79 |  |  | 크리핑 피처 | 82 | 참 |
| 60 | Halls of the Dead Level 3 | 죽음의홀3층 | 13 | 45 | 82 |  |  | 미치광이 블러드 윗치 | 85 | 참 |
| 61 | Claw Viper Temple Level 2 | 클러바이퍼 2층 | 14 | 47 | 83 |  |  | 팽스킨 | 86 | 참 |
| 62 | Maggot Lair Level 1 | 마고트동굴 1층 | 17 | 45 | 84 |  |  |  |  |  |
| 63 | Maggot Lair Level 2 | 마고트동굴 2층 | 17 | 45 | 84 |  |  |  |  |  |
| 64 | Maggot Lair Level 3 | 마고트동굴 3층 | 17 | 46 | 85 |  |  | 콜드웜 버로워 | 88 | 참 |
| 65 | Ancient Tunnels | 고대하수도 | 17 | 46 | 85 |  |  |  |  |  |
| 66 | Tal Rasha's Tomb | 탈라샤무덤1 | 17 | 49 | 80 |  |  | 혼없는 고대인 카 | 83 | 참 |
| 67 | Tal Rasha's Tomb | 탈라샤무덤2 | 17 | 49 | 80 |  |  |  |  |  |
| 68 | Tal Rasha's Tomb | 탈라샤무덤3 | 17 | 49 | 80 |  |  |  |  |  |
| 69 | Tal Rasha's Tomb | 탈라샤무덤4 | 17 | 49 | 80 |  |  |  |  |  |
| 70 | Tal Rasha's Tomb | 탈라샤무덤5 | 17 | 49 | 80 |  |  |  |  |  |
| 71 | Tal Rasha's Tomb | 탈라샤무덤6 | 17 | 49 | 80 |  |  |  |  |  |
| 72 | Tal Rasha's Tomb | 탈라샤무덤7 | 17 | 49 | 80 |  |  |  |  |  |
| 73 | Duriel's Lair | 듀리엘 | 17 | 49 | 80 |  |  | 듀리엘 | 88 | 참 |
| 74 | Arcane Sanctuary | 아케인생츄어리 | 14 | 48 | 79 | 16 | 아케인 | 소환술사 | 80 | 로 |
| 75 | Kurast Docktown | 쿠라스트 부두 |  |  |  | 18 | act3 |  |  |  |
| 76 | Spider Forest | 스파이더 포레스트 | 21 | 49 | 79 | 19 | 스파이더 |  |  |  |
| 77 | Great Marsh | 그레이트 마쉬 | 21 | 50 | 80 | 20 | 그레이트 |  |  |  |
| 78 | Flayer Jungle | 플레이어 정글 | 22 | 50 | 80 | 21 | 프레이어 | 스톰트리 | 83 | 참 |
| 79 | Lower Kurast | 남부 쿠라스트 | 22 | 52 | 80 | 22 | 남부 |  |  |  |
| 80 | Kurast Bazaar | 쿠라스트바자 | 22 | 52 | 81 | 23 | 바자 |  |  |  |
| 81 | Upper Kurast | 북부쿠라스트 | 23 | 52 | 81 | 24 | 북부 |  |  |  |
| 82 | Kurast Causeway | 쿠라스트커즈웨이 | 24 | 53 | 81 |  |  |  |  |  |
| 83 | Travincal | 트라빈컬 | 24 | 54 | 82 | 25 | 트라빈컬 | 사악한 손 이스마일, 플레임 핑거 게렙, 아이스피스트 투르크 | 85 | 참 |
| 84 | Spider Cave | 어래크니드 동굴 | 21 | 50 | 79 |  |  | 불타는 스카크 | 82 | 참 |
| 85 | Spider Cavern | 스파이더 동굴 | 21 | 50 | 79 |  |  |  |  |  |
| 86 | Swampy Pit Level 1 | 스웜피핏 1층 | 21 | 51 | 80 |  |  |  |  |  |
| 87 | Swampy Pit Level 2 | 스웜피핏 2층 | 21 | 51 | 81 |  |  |  |  |  |
| 88 | Flayer Dungeon Level 1 | 프레이어던전 1층 | 22 | 51 | 81 |  |  |  |  |  |
| 89 | Flayer Dungeon Level 2 | 프레이어던전 2층 | 22 | 51 | 82 |  |  |  |  |  |
| 90 | Swampy Pit Level 3 | 스웜피핏 3층 | 21 | 51 | 82 |  |  |  |  |  |
| 91 | Flayer Dungeon Level 3 | 프레이어던전 3층 | 22 | 51 | 83 |  |  | 마법사 엔두구 | 86 | 참 |
| 92 | Sewers Level 1 | 하수구 1층 (쿠라스트바자) | 23 | 52 | 84 |  |  | 아이스호크 리프트윙 | 87 | 참 |
| 93 | Sewers Level 2 | 하수구 2층 (쿠라스트바자) | 24 | 53 | 85 |  |  |  |  |  |
| 94 | Ruined Temple | 폐허의 사원 | 23 | 53 | 84 |  |  | 배틀메이드 사리나 | 87 | 참 |
| 95 | Disused Fane | 버려진 신전 | 23 | 53 | 84 |  |  |  |  |  |
| 96 | Forgotten Reliquary | 잊혀진 유적 | 23 | 53 | 84 |  |  |  |  |  |
| 97 | Forgotten Temple | 잊혀진 사원 | 24 | 54 | 85 |  |  |  |  |  |
| 98 | Ruined Fane | 폐허의 신전 | 24 | 54 | 85 |  |  |  |  |  |
| 99 | Disused Reliquary | 버려진 유적 | 24 | 54 | 85 |  |  |  |  |  |
| 100 | Durance of Hate Level 1 | 증오의사원 1층 | 25 | 55 | 83 |  |  |  |  |  |
| 101 | Durance of Hate Level 2 | 증오의사원 2층 | 25 | 55 | 83 | 26 | 증오 |  |  |  |
| 102 | Durance of Hate Level 3 | 증오의사원 3층 | 25 | 55 | 83 |  |  | 스파크피스트 브렘, 허무의 제왕 와이앤드, 드래곤핸드 매퍼 / 메피스토 | 86 / 87 | 참 |
| 103 | The Pandemonium Fortress | 엑4마을 |  |  |  | 27 | act4 |  |  |  |
| 104 | Outer Steppes | 엑4앞마당 | 26 | 56 | 82 |  |  |  |  |  |
| 105 | Plains of Despair | 절망의평원 | 26 | 56 | 83 |  |  | 이주얼 | 86 | 참 |
| 106 | City of the Damned | 지옥망령의도시 | 27 | 57 | 84 | 28 | 지옥 |  |  |  |
| 107 | River of Flame | 불길의강 | 27 | 57 | 85 | 29 | 불길 | 대장장이 헤파스토 | 88 | 조드 |
| 108 | Chaos Sanctum | 카오스생츄어리 | 28 | 58 | 85 |  |  | 혼돈을다스리는자, 로드 드 사이드, 영혼의잠식자 / 디아블로 | 88 / 94 | 조드 |
| 109 | Harrogath | 해로개쓰 |  |  |  | 30 | act5 |  |  |  |
| 110 | Bloody Foothills | 블러디풋힐 | 24 | 58 | 80 |  |  | 닥패런, 쉥크디오버시어 | 83 | 조드 |
| 111 | Rigid Highlands | 프리지드하이랜드 | 25 | 59 | 81 | 31 | 프리지드 | 엘드리치 더 렉티파이어, 아이벡 디 언리쉬드, 샤프투스 슬레이어 | 84 | 조드 |
| 112 | Arreat Plateau | 아리앗고원 | 26 | 60 | 81 | 32 | 아리앗 | 쓰레쉬 소켓 | 84 | 조드 |
| 113 | Crystalized Cavern Level 1 | 크리스탈라인 | 29 | 61 | 82 | 33 | 크리스탈라인 |  |  |  |
| 114 | Cellar of Pity | 프로즌리버 | 29 | 61 | 83 |  |  | 프로즌 스타인 | 86 | 조드 |
| 115 | Crystalized Cavern Level 2 | 글레셜 트레일 | 29 | 61 | 83 | 34 | 글레셜 | 본소우 브리커 | 86 | 조드 |
| 116 | Echo Chamber | 드리프터동굴 | 29 | 61 | 84 |  |  |  |  |  |
| 117 | Tundra Wastelands | 프로즌툰드라 | 27 | 60 | 81 | 36 | 툰드라 |  |  |  |
| 118 | Glacial Caves Level 1 | 고대인의길 | 29 | 62 | 82 | 37 | 고대인의길 |  |  |  |
| 119 | Glacial Caves Level 2 | 아이시셀라 | 29 | 62 | 83 |  |  | 스냅치프 쉐터 | 86 | 조드 |
| 120 | Rocky Summit | 아리앗정상 | 37 | 68 | 87 |  |  |  |  |  |
| 121 | Nihlathaks Temple | 나르하크 사원 | 32 | 63 | 83 |  |  | 핀들스킨 | 86 | 조드 |
| 122 | Halls of Anguish | 홀오브앵귀쉬 | 33 | 63 | 83 |  |  |  |  |  |
| 123 | Halls of Death's Calling | 홀오브페인 | 34 | 64 | 84 | 35 | 홀스 |  |  |  |
| 124 | Halls of Vaught | 홀오브보우트 | 36 | 64 | 84 |  |  | 니라트하크 | 95 | 조드 |
| 125 | Hell1 | 어베던 | 39 | 60 | 81 |  |  |  |  |  |
| 126 | Hell2 | 피트오브아케런 | 39 | 61 | 82 |  |  |  |  |  |
| 127 | Hell3 | 인터널피트 | 39 | 62 | 83 |  |  |  |  |  |
| 128 | The Worldstone Keep Level 1 | 월드스톤성채1층 | 39 | 65 | 85 |  |  |  |  |  |
| 129 | The Worldstone Keep Level 2 | 월드스톤성채2층 | 40 | 65 | 85 | 38 | 월드스톤 |  |  |  |
| 130 | The Worldstone Keep Level 3 | 월드스톤성채3층 | 42 | 66 | 85 |  |  |  |  |  |
| 131 | Throne of Destruction | 쓰론오브디스트럭션 | 43 | 66 | 85 |  |  | 중보스 5종 | 88 | 조드 |
| 132 | The Worldstone Chamber | 월드스톤챔버 | 43 | 66 | 85 |  |  | 바알 | 99 | 조드 |
| 133 | Pandemonium Run 1 | (횃불) | 50 | 75 | 83 |  |  |  |  |  |
| 134 | Pandemonium Run 2 | (횃불) | 50 | 75 | 83 |  |  |  |  |  |
| 135 | Pandemonium Run 3 | (횃불) | 50 | 75 | 83 |  |  |  |  |  |
| 136 | Tristram | 트리스트럼 (횃불) | 50 | 75 | 83 |  |  |  |  |  |

### 원본 대조 (261104)

- 카오스큐브 표의 지역 레벨 351칸(117지역 × 3난이도)을 `levels.txt`와 대조: 1칸 다름. 카오스 생츄어리(108) 노말이 이미지 27, `levels.txt` 28. 표는 `levels.txt` 값.
- 웨이포인트 표시: 이미지는 지옥의 평원 외곽(104)에 웨이포인트 표시가 있으나 `levels.txt` `Waypoint`는 255(없음). 표는 `levels.txt` 값.
- 카오스큐브 표에 없는 지역: 20 Forgotten Tower, 50 Harem Level 1, 67~72 탈 라샤 무덤(66과 같은 줄로 묶임), 133~136 횃불 지역.
- 영문 이름은 mpq `LevelName`을 썼다. kolbot `sdk.areas` 키 이름은 별개다(예: `ChaosSanctuary`).

## 지역 출구 타일 번호 (`tile.d2l`)

- 출처: kolbot 옛 sdk `tile.d2l`. 옛 D2BS 스크립트(판 불명). 근거: 웹 미검증.
- 뜻: `tilelist[출발 지역][도착 지역] = 출구 타일 유닛(`getUnit(5)`)의 classid` (원본 `getTile` 함수가 `tile.classid == tilelist[me.area][n]`으로 찾는다). 일부 줄은 도착 자리에 1000·1001을 쓰고 주석에 "variation"이라 적었다. 원본에 그 뜻의 설명은 없다.
- 지금 kolbot은 출구 타일 번호를 실행 중에 게임에서 읽는다(`Pather.js`의 `exits[j].tileid`). 이 표는 대조용이다.
- 원본 머리말: Act 1 "(Complete)", Act 4 "(Complete)", Act 5 "(NOT Complete)".

| 출발 | 도착 | 타일 classid | 원본 주석 |
|---|---|---|---|
| 2 | 8 | 2 | Den |
| 8 | 2 | 4 | Den Out |
| 3 | 9 | 3 | Cave |
| 9 | 13 | 5 | Cave-Cave level 2 |
| 13 | 9 | 4 | Cave Level 2 - Cave |
| 9 | 3 | 4 | Cave out |
| 4 | 10 | 1 | Undergounrd      - Darien variation 1 |
| 4 | 1000 | 3 | Undergounrd    - Darien variation 1 |
| 4 | 1001 | 0 | Undergounrd    - Darien variation 1 |
| 10 | 4 | 4 | Underground-stoney |
| 10 | 14 | 5 | underground-underground2 |
| 14 | 10 | 4 | underground2-underground |
| 10 | 5 | 4 | Underground-dark wood |
| 5 | 10 | 1 | Dark Wood-Underground |
| 6 | 11 | 3 | Black Marsh - Hole |
| 11 | 6 | 4 | Hole - Black Marsh |
| 11 | 15 | 5 | Hole - Hole Level 2 |
| 15 | 11 | 4 | Hole Level 2 - Hole |
| 6 | 20 | 10 | Black Marsh - Forgotten Tower |
| 20 | 6 | 11 | Forgotten Tower - Black Marsh |
| 20 | 21 | 12 | Forgotten Tower - Tower Level 1 |
| 21 | 20 | 8 | Tower Level 1 - Forgotten Tower |
| 21 | 22 | 9 | Tower Level 1 - Tower Level 2 |
| 22 | 21 | 8 | Tower Level 2- Tower Level 1 |
| 22 | 23 | 9 | Tower Level 2 - Tower Level 3 |
| 23 | 22 | 8 | Tower Level 3 - Tower Level 2 |
| 23 | 24 | 9 | Tower Level 3 - Tower Level 4 |
| 24 | 23 | 8 | Tower Level 4 - Tower Level 3 |
| 24 | 25 | 9 | Tower Level 4 - Tower Level 5 |
| 25 | 24 | 8 | Tower Level 5 - Tower Level 4 |
| 7 | 12 | 2 | Tamoe - Pit |
| 7 | 120 | 3 | Tamoe - Pit    - Darien variation 1 |
| 12 | 7 | 4 | Pit - Tamoe |
| 12 | 16 | 5 | Pit - Pit level 2 |
| 16 | 12 | 4 | Pit Level 2 - Pit |
| 28 | 29 | 14 | Barracks - Jail Level 1 |
| 29 | 28 | 13 | Jail Level 1 - Barracks |
| 29 | 30 | 14 | Jail Level 1 - Jail Level 2 |
| 30 | 29 | 13 | Jail Level 2 - Jail Level 1 |
| 30 | 31 | 14 | Jail Level 2 - Jail Level 3 |
| 31 | 30 | 13 | Jail Level 3 - Jail Level 2 |
| 31 | 32 | 13 | Jail Level 3 - Inner Cloister |
| 32 | 31 | 14 | Inner Cloister - Jail Level 3 |
| 33 | 34 | 15 | Cathedral - Cat Level 1 |
| 34 | 33 | 16 | Cat Level 1 - Cathedral |
| 34 | 35 | 18 | Cat Level 1 - Cat Level 2 |
| 35 | 34 | 17 | Cat Level 2 - Cat Level 1 |
| 35 | 36 | 18 | Cat Level 2 - Cat Level 3 |
| 36 | 35 | 17 | Cat Level 3 - Cat Level 2 |
| 36 | 37 | 18 | Cat Level 3 - Cat Level 4 |
| 37 | 36 | 17 | Cat Level 4 - Cat Level 3 |
| 40 | 47 | 19 | Lut - Sewers Level 1 (trap door) |
| 47 | 40 | 22 | Sewers Level 1- Lut (trap door) |
| 47 | 48 | 23 | Sewers Level 1 - Sewers Level 2 |
| 48 | 47 | 22 | Sewers Level 2 - Sewers Level 1 |
| 48 | 49 | 23 | Sewers Level 2 - Sewers Level 3 |
| 49 | 48 | 22 | Sewers Level 3 - Sewers Level 2 |
| 41 | 55 | 34 | Rocky Waste - Stoney Tomb 1 |
| 55 | 41 | 45 | Stoney Tomb 1 - Rocky Waste |
| 55 | 59 | 46 | Stoney Tomb 1 - Stoney Tomb 2 |
| 59 | 55 | 45 | Stoney Tomb 2 - Stoney Tomb 1 |
| 42 | 56 | 33 | Dry Hills - Halls 1 |
| 42 | 560 | 34 | Dry Hills - Halls 1 - Darien variation 1 |
| 42 | 561 | 35 | Dry Hills - Halls 1 - Darien variation 2 |
| 42 | 562 | 36 | Dry Hills - Halls 1 - Darien variation 3 |
| 56 | 42 | 45 | Halls 1 - Dry Hills |
| 56 | 57 | 46 | Halls 1 - Halls 2 |
| 57 | 56 | 45 | Halls 2 - Halls 1 |
| 57 | 60 | 46 | Halls 2 - Halls 3 |
| 60 | 57 | 45 | Halls 3 - Halls 2 |
| 43 | 62 | 47 | Far Oasis - Maggot 1 |
| 62 | 43 | 48 | Maggot 1 - Far Oasis |
| 62 | 63 | 49 | Maggot 1 - Maggot 2 |
| 63 | 62 | 48 | Maggot 2 - Maggot 1 |
| 63 | 64 | 49 | Maggot 2 - Maggot 3 |
| 64 | 63 | 48 | Maggot 3 - Maggot 2 |
| 44 | 65 | 50 | Lost City - Ancient Tunnels |
| 65 | 44 | 22 | Ancient Tunnels - Lost City |
| 45 | 58 | 37 | Valley of Snakes - Claw Viper 1 |
| 58 | 45 | 45 | Claw Viper 1 - Valley of Snakes |
| 58 | 61 | 46 | Claw Viper 1 - Claw Viper 2       ///Darien Fix |
| 61 | 58 | 45 | Claw Viper 2 - Claw Viper 1       ///Darien Fix |
| 40 | 50 | 24 | Lut - Harem |
| 50 | 40 | 25 | Harem - Lut |
| 50 | 51 | 29 | Harem - Harem 2 (down/left) |
| 51 | 50 | 27 | Harem 2 - Harem  (down/left) |
| 51 | 52 | 29 | Harem 2 - Palace Level 1 (down/left) |
| 52 | 53 | 32 | Palace 1 - Palace 2 (down/left) |
| 53 | 52 | 31 | Palace 2 - Palace 1 (down/left) |
| 53 | 54 | 32 | Palace 2 - Palace 3 (down/left) |
| 54 | 53 | 31 | Palace 3 - Palace 2 (down/left) |
| 46 | 66 | 38 | Canyon - Tomb 1 |
| 46 | 67 | 39 | Canyon - Tomb 2 |
| 46 | 68 | 40 | Canyon - Tomb 3 |
| 46 | 69 | 41 | Canyon - Tomb 4 |
| 46 | 70 | 42 | Canyon - Tomb 5 |
| 46 | 71 | 43 | Canyon - Tomb 6 |
| 46 | 72 | 44 | Canyon - Tomb 7 |
| 66 | 46 | 45 | Tomb 1 - Canyon |
| 67 | 46 | 45 | Tomb 2 - Canyon |
| 68 | 46 | 45 | Tomb 3 - Canyon |
| 69 | 46 | 45 | Tomb 4 - Canyon |
| 70 | 46 | 45 | Tomb 5 - Canyon |
| 71 | 46 | 45 | Tomb 6 - Canyon |
| 72 | 46 | 45 | Tomb 7 - Canyon |
| 101 | 102 | 67 | Durance 3 |
| 101 | 1021 | 68 | Durance 3 - Darien variation 1 |
| 106 | 107 | 69 | City of the Damned - River of Flame |
| 107 | 106 | 70 | River - City |
| 112 | 113 | 71 | Arreat Plateau - Crystaline Passage |
| 113 | 112 | 73 | Crystaline - Arreat Plateau |
| 113 | 115 | 74 | Crystaline - Glacial Trail |
| 113 | 114 | 75 | Crystaline - Frozen River |
| 114 | 113 | 73 | Frozen River - Crystaline |
| 115 | 113 | 73 | Glacial Trail - Crystaline |
| 115 | 116 | 75 | Glacial - Drifter Cavern |
| 116 | 115 | 73 | Drifter - Glacial |
| 115 | 117 | 74 | Glacial - Tundra |
| 117 | 115 | 72 | Tundra - Glacial |
| 117 | 118 | 71 | Tundra - Ancient's Way |
| 118 | 117 | 73 | Ancient's Way - Tundra |
| 118 | 119 | 75 | Ancient's Way - Icey Cellar |
| 119 | 118 | 73 | Icey Cellar - Ancient's Way |
| 118 | 120 | 74 | Ancient's Way - Arreat Summit |
| 120 | 118 | 79 | Arreat Summit - Ancient's Way |
| 120 | 128 | 80 | Arreat Summit - Worldstone Level 1 |
| 128 | 120 | 81 | Worldstone Level 1 - Arreat Summit |
| 121 | 122 | 76 | Nhilithaks Temple - Halls 1 |
| 122 | 121 | 78 | Halls 1 - Nhilithaks Temple |
| 122 | 133 | 77 | Halls 1 - Halls 2 |
| 123 | 122 | 78 | Halls 2 - Halls 1 |
| 123 | 124 | 77 | Halls 2 - Halls 3 |
| 124 | 123 | 78 | Halls 3 - Halls 2 |
| 129 | 130 | 82 | WorldStone Keep Level 2 - WorldStone Keep Level 3  Added by Darien |
| 130 | 129 | 81 | WorldStone Keep Level 3 - WorldStone Keep Level 2  Added by Darien |
| 130 | 131 | 82 | WorldStone Keep Level 3 - Throne of Destruction    Added by Darien |
| 131 | 130 | 81 | Throne of Destruction - WorldStone Keep Level 3    Added by Darien |
