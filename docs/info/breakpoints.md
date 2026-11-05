# 프레임 (FCR·FHR·FBR, 어쌔신 스킬 공속, 용병 잽 DPS)

직업별 FCR·FHR·FBR 프레임, 어쌔신 스킬별 공격 속도, 액트2 용병 폴암별 잽 초당 데미지 (261104).

- kolbot 사용처: 빌드·장비 판단(`builds/*.js`, nip 규칙), `Skill.cast` 시전 간격
- 표 읽는 법: 칸 = 그 프레임(열)이 되는 데 필요한 수치(%). 프레임이 작을수록 빠르다.

## 직업별 프레임

- 출처: 사용자 자료 `패힛패케패블럭.png`(카오스큐브 "캐릭별 프레임 정보", 제작 무한의공갈, 업데이트 2019.03.16). 근거: 웹 미검증. 원본 그림을 2배 확대로 칸마다 읽었다.
- 한 직업에 같은 종류가 두 열이면 "1열·2열"로 나누고, 원본 그림 주석이 가리키는 열을 적었다.
- 카오스큐브 "디아블로2 정보 총정리" 본문 표와 다른 줄: FHR Amazon(본문 9f부터 13·32·52·86·174), Barbarian(본문 9f부터 7·15·27·48·86). 그 밖의 FCR·FHR은 같다.

| 직업 | 종류 | 19 | 18 | 17 | 16 | 15 | 14 | 13 | 12 | 11 | 10 | 9 | 8 | 7 | 6 | 5 | 4 | 3 | 2 | 1 |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Amazon | FBR (1열, "swinging 1-hand weapon") |  |  | 0 | 4 | 6 | 11 | 15 | 23 | 29 | 40 | 56 | 80 | 120 | 200 | 480 |  |  |  |  |
| Amazon | FBR (2열) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 13 | 32 | 86 | 600 |
| Amazon | FCR | 0 | 7 | 14 | 22 | 32 | 48 | 68 | 99 | 152 |  |  |  |  |  |  |  |  |  |  |
| Amazon | FHR |  |  |  |  |  |  |  |  | 0 | 6 | 13 | 20 | 32 | 52 | 86 | 174 | 600 |  |  |
| Assassin | FBR |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 13 | 32 | 86 | 600 |
| Assassin | FCR |  |  |  | 0 | 8 | 16 | 27 | 42 | 65 | 102 | 174 |  |  |  |  |  |  |  |  |
| Assassin | FHR |  |  |  |  |  |  |  |  |  |  | 0 | 7 | 15 | 27 | 48 | 86 | 200 | 4680 |  |
| Necromancer | FBR |  |  |  |  |  |  |  |  | 0 | 6 | 13 | 20 | 32 | 52 | 86 | 174 | 600 |  |  |
| Necromancer | FCR |  |  |  |  | 0 | 9 | 18 | 30 | 48 | 75 | 125 |  |  |  |  |  |  |  |  |
| Necromancer | FHR |  |  |  |  |  |  | 0 | 2 | 10 | 16 | 26 | 39 | 56 | 86 | 152 | 377 |  |  |  |
| Barbarian | FBR |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 9 | 20 | 42 | 86 | 280 |  |
| Barbarian | FCR |  |  |  |  |  |  | 0 | 9 | 20 | 37 | 63 | 105 | 200 |  |  |  |  |  |  |
| Barbarian | FHR |  |  |  |  |  |  |  |  |  |  | 0 | 7 | 15 | 27 | 48 | 86 | 200 | 4680 |  |
| Sorceress | FBR |  |  |  |  |  |  |  |  |  |  | 0 | 7 | 15 | 27 | 48 | 86 | 200 |  |  |
| Sorceress | FCR (1열, "(Chain) Lightning") | 0 | 7 | 15 | 23 | 35 | 52 | 78 | 117 | 194 |  |  |  |  |  |  |  |  |  |  |
| Sorceress | FCR (2열) |  |  |  |  |  |  | 0 | 9 | 20 | 37 | 63 | 105 | 200 |  |  |  |  |  |  |
| Sorceress | FHR |  |  |  |  | 0 | 5 | 9 | 14 | 20 | 30 | 42 | 60 | 86 | 142 | 280 | 1480 |  |  |  |
| Paladin | FBR (1열, "Holy Shield") |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 86 |
| Paladin | FBR (2열) |  |  |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 13 | 32 | 86 | 600 |
| Paladin | FCR |  |  |  |  | 0 | 9 | 18 | 30 | 48 | 75 | 125 |  |  |  |  |  |  |  |  |
| Paladin | FHR |  |  |  |  |  |  |  |  |  |  | 0 | 7 | 15 | 27 | 48 | 86 | 200 | 4680 |  |
| Druid (human) | FBR |  |  |  |  |  |  |  |  | 0 | 6 | 13 | 20 | 32 | 52 | 86 | 174 | 600 |  |  |
| Druid (human) | FCR |  | 0 | 4 | 10 | 19 | 30 | 46 | 68 | 99 | 163 |  |  |  |  |  |  |  |  |  |
| Druid (human) | FHR (3열) |  |  |  |  |  | 0 | 3 | 7 | 13 | 19 | 29 | 42 | 63 | 99 | 174 | 456 |  |  |  |
| Druid (human) | FHR (4열, "with Wizardspike") |  |  |  |  |  |  | 0 | 5 | 10 | 16 | 26 | 39 | 56 | 86 | 152 | 377 |  |  |  |
| Druid (wolf) | FBR |  |  |  |  |  |  |  |  |  |  | 0 | 7 | 15 | 27 | 48 | 86 | 200 |  |  |
| Druid (wolf) | FCR |  |  |  | 0 | 6 | 14 | 26 | 40 | 60 | 95 | 157 |  |  |  |  |  |  |  |  |
| Druid (wolf) | FHR |  |  |  |  |  |  |  |  |  |  |  |  | 0 | 9 | 20 | 42 | 86 | 280 |  |
| Druid (bear) | FBR |  |  |  |  |  |  |  | 0 | 5 | 10 | 16 | 27 | 40 | 65 | 109 | 223 |  |  |  |
| Druid (bear) | FCR |  |  |  | 0 | 7 | 15 | 26 | 40 | 63 | 99 | 163 |  |  |  |  |  |  |  |  |
| Druid (bear) | FHR |  |  |  |  |  |  | 0 | 5 | 10 | 16 | 24 | 37 | 54 | 86 | 152 | 360 |  |  |  |

## 어쌔신 스킬별 공격 속도

- 출처: 사용자 자료 `트랩공속.png`(출처 표시 없음). 근거: **출처 불명**. 원본 그대로 옮겼다(4표 25줄).
- 값 = 그 프레임(f)에 필요한 공격 속도(IAS) 수치. 열 이름 "3/3/3/3/7" 등은 원본 그대로다.
- 스킬·무기 이름은 원본 한글을 영문으로 바꿨다(덫 = Traps, 용의발톱 = Dragon Talon, 불사조 = Phoenix Strike, 호랑이일격 = Tiger Strike, 사용자 확인 261105).

| 스킬 | 무기 종류 | 주무기 | 보조 | 9f | 10f | 11f |
|---|---|---|---|---|---|---|
| Traps | 1-hand sword | Phase Blade | Shield | 42 | 20 | 5 |
| Traps | Mace | Scourge | Shield | 89 | 54 | 30 |
| Traps | Dagger | Bone Knife | Shield | 63 | 35 | 16 |
| Traps | Claw | Runic Talons / Greater Talons | Runic Talons / Greater Talons | 42 | 20 | 5 |
| Traps | Claw | Runic Talons / Greater Talons | Suwayyah / Scissors Suwayyah | 75 | 44 | 23 |
| Traps | Claw | Runic Talons / Greater Talons | Wrist Sword / Battle Cestus | 63 | 35 | 16 |
| Traps | Claw | Runic Talons / Greater Talons | Feral Claws / Greater Claws | 52 | 27 | 10 |

| 스킬 | 무기 종류 | 주무기 | 보조 | 3/3/3/3/7 | 3/3/3/3/8 | 3/3/3/3/9 |
|---|---|---|---|---|---|---|
| Dragon Talon | 1-hand sword | Phase Blade | Shield | 46 | 18 | 5 |
| Dragon Talon | Mace | Scourge | Shield | 95 | 50 | 30 |
| Dragon Talon | Claw | Runic Talons / Greater Talons | Runic Talons / Greater Talons | 46 | 18 | 5 |
| Dragon Talon | Claw | Runic Talons / Greater Talons | Suwayyah / Scissors Suwayyah | 80 | 40 | 23 |
| Dragon Talon | Claw | Runic Talons / Greater Talons | Wrist Sword / Battle Cestus | 68 | 32 | 16 |
| Dragon Talon | Claw | Runic Talons / Greater Talons | Feral Claws / Greater Claws | 56 | 24 | 10 |

| 스킬 | 무기 종류 | 주무기 | 보조 | 7f | 8f | 9f |
|---|---|---|---|---|---|---|
| Phoenix Strike | 1-hand sword | Phase Blade | Shield | 113 | 54 | 24 |
| Phoenix Strike | Mace | Scourge | Shield | 223 | 109 | 60 |
| Phoenix Strike | Claw | Runic Talons / Greater Talons | Runic Talons / Greater Talons | 60 | 26 | 7 |
| Phoenix Strike | Claw | Runic Talons / Greater Talons | Suwayyah / Scissors Suwayyah | 102 | 52 | 26 |
| Phoenix Strike | Claw | Runic Talons / Greater Talons | Wrist Sword / Battle Cestus | 86 | 42 | 19 |
| Phoenix Strike | Claw | Runic Talons / Greater Talons | Feral Claws / Greater Claws | 72 | 34 | 13 |

| 스킬 | 무기 종류 | 주무기 | 보조 | 7f | 8f | 9f |
|---|---|---|---|---|---|---|
| Tiger Strike | 1-hand sword | Phase Blade | Shield | 113 | 54 | 24 |
| Tiger Strike | Mace | Scourge | Shield | 223 | 109 | 60 |
| Tiger Strike | Claw | Runic Talons / Greater Talons | Runic Talons / Greater Talons | 60 | 26 | 7 |
| Tiger Strike | Claw | Runic Talons / Greater Talons | Suwayyah / Scissors Suwayyah | 102 | 52 | 26 |
| Tiger Strike | Claw | Runic Talons / Greater Talons | Wrist Sword / Battle Cestus | 86 | 42 | 19 |
| Tiger Strike | Claw | Runic Talons / Greater Talons | Feral Claws / Greater Claws | 72 | 34 | 13 |

## 액트2 용병 잽 DPS (폴암별)

- 출처: 사용자 자료 `용병DPS.png`(카오스큐브, 제작 무한의공갈, 업데이트 2020.02.15). 근거: 웹 미검증. 원본 그대로 옮겼다(15종 × 2줄).
- 원본 머리말: "바디쉬 베이스는 제외하였음 / 공속은 공속 계산 사이트를 이용함 / 강타와, 기타 디버프는 무시함 / 노작 기준(증뎀은 곱해서 계산) / 용병 착용 시 사거리는 모두 같음 / 회색 배경은 에테리얼"
- 대조(261104): 요구 힘·민첩, 평균 데미지(`2handmindam`·`2handmaxdam` 평균, 에테리얼은 각각 × 1.5 내림), 에테리얼 요구치(−10)를 mpqdata `weapons.txt`와 대조, 초당 데미지 = 평균 × 초당 공격 횟수로 계산해 180칸 모두 같다. 초당 공격 횟수(공속 계산 사이트 값)는 대조하지 않았다.

| 등급 | 이름 | 구분 | 요구 힘 | 요구 민첩 | 평균 데미지 | +0% 초당 공격 | +0% 초당 데미지 | +20% 초당 공격 | +20% 초당 데미지 | +35% 초당 공격 | +35% 초당 데미지 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| Normal | Voulge | 일반 | 50 |  | 13.5 | 3.12 | 42.1 | 3.57 | 48.2 | 3.57 | 48.2 |
| 〃 | 〃 | 에테리얼 | 40 |  | 20.0 | 〃 | 62.4 | 〃 | 71.4 | 〃 | 71.4 |
| Normal | Scythe | 일반 | 41 | 41 | 14.0 | 3.33 | 46.6 | 3.33 | 46.6 | 3.84 | 53.8 |
| 〃 | 〃 | 에테리얼 | 31 | 31 | 21.0 | 〃 | 69.9 | 〃 | 69.9 | 〃 | 80.6 |
| Normal | Poleaxe | 일반 | 62 |  | 28.5 | 2.77 | 78.9 | 3.12 | 88.9 | 3.57 | 101.7 |
| 〃 | 〃 | 에테리얼 | 52 |  | 42.5 | 〃 | 117.7 | 〃 | 132.6 | 〃 | 151.7 |
| Normal | Halberd | 일반 | 75 | 47 | 28.5 | 3.12 | 88.9 | 3.57 | 101.7 | 3.57 | 101.7 |
| 〃 | 〃 | 에테리얼 | 65 | 37 | 42.5 | 〃 | 132.6 | 〃 | 151.7 | 〃 | 151.7 |
| Normal | War Scythe | 일반 | 80 | 80 | 25.5 | 3.33 | 84.9 | 3.57 | 91.0 | 3.84 | 97.9 |
| 〃 | 〃 | 에테리얼 | 70 | 70 | 38.0 | 〃 | 126.5 | 〃 | 135.7 | 〃 | 145.9 |
| Exceptional | Bill | 일반 | 95 |  | 33.5 | 3.12 | 104.5 | 3.57 | 119.6 | 3.57 | 119.6 |
| 〃 | 〃 | 에테리얼 | 85 |  | 50.0 | 〃 | 156.0 | 〃 | 178.5 | 〃 | 178.5 |
| Exceptional | Battle Scythe | 일반 | 82 | 82 | 31.5 | 3.33 | 104.9 | 3.33 | 104.9 | 3.84 | 121.0 |
| 〃 | 〃 | 에테리얼 | 72 | 72 | 47.0 | 〃 | 156.5 | 〃 | 156.5 | 〃 | 180.5 |
| Exceptional | Partizan | 일반 | 113 | 67 | 54.5 | 2.77 | 151.0 | 3.12 | 170.0 | 3.57 | 194.6 |
| 〃 | 〃 | 에테리얼 | 103 | 57 | 81.5 | 〃 | 225.8 | 〃 | 254.3 | 〃 | 291.0 |
| Exceptional | Bec-de-Corbin | 일반 | 133 | 91 | 49.0 | 3.12 | 152.9 | 3.57 | 174.9 | 3.57 | 174.9 |
| 〃 | 〃 | 에테리얼 | 123 | 81 | 73.0 | 〃 | 227.8 | 〃 | 260.6 | 〃 | 260.6 |
| Exceptional | Grim Scythe | 일반 | 140 | 140 | 50.0 | 3.33 | 166.5 | 3.57 | 178.5 | 3.84 | 192.0 |
| 〃 | 〃 | 에테리얼 | 130 | 130 | 75.0 | 〃 | 249.8 | 〃 | 267.8 | 〃 | 288.0 |
| Elite | Colossus Voulge | 일반 | 210 | 55 | 91.0 | 2.77 | 252.1 | 3.12 | 283.9 | 3.57 | 324.9 |
| 〃 | 〃 | 에테리얼 | 200 | 45 | 136.0 | 〃 | 376.7 | 〃 | 424.3 | 〃 | 485.5 |
| Elite | Thresher | 일반 | 152 | 118 | 76.5 | 3.33 | 254.7 | 3.57 | 273.1 | 3.84 | 293.8 |
| 〃 | 〃 | 에테리얼 | 142 | 108 | 114.5 | 〃 | 381.3 | 〃 | 408.8 | 〃 | 439.7 |
| Elite | Cryptic Axe | 일반 | 165 | 103 | 91.5 | 2.77 | 253.5 | 3.12 | 285.5 | 3.57 | 326.7 |
| 〃 | 〃 | 에테리얼 | 155 | 93 | 137.0 | 〃 | 379.5 | 〃 | 427.4 | 〃 | 489.1 |
| Elite | Great Poleaxe | 일반 | 179 | 99 | 86.5 | 3.12 | 269.9 | 3.57 | 308.8 | 3.57 | 308.8 |
| 〃 | 〃 | 에테리얼 | 169 | 89 | 129.5 | 〃 | 404.0 | 〃 | 462.3 | 〃 | 462.3 |
| Elite | Giant Thresher | 일반 | 188 | 140 | 77.0 | 3.33 | 256.4 | 3.57 | 274.9 | 3.84 | 295.7 |
| 〃 | 〃 | 에테리얼 | 178 | 130 | 115.5 | 〃 | 384.6 | 〃 | 412.3 | 〃 | 443.5 |
