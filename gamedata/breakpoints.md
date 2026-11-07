# 프레임 (FCR·FHR·FBR, 어쌔신 스킬 공속, 용병 잽 DPS)

직업별 FCR·FHR·FBR 프레임, 어쌔신 스킬별 공격 속도, 액트2 용병 폴암별 잽 초당 데미지.

- kolbot 사용처: 빌드·장비 판단(`builds/*.js`, nip 규칙), `Skill.cast` 시전 간격

## 직업별 프레임

- 표 읽는 법: 행 = 프레임(작을수록 빠름), 칸 = 그 프레임이 되는 데 필요한 FCR·FHR·FBR 수치(%). 1초 = 25프레임.
- 직업: AMA 아마존, ASS 어쌔신, NEC 네크로맨서, BAR 바바리안, SOR 소서리스, PAL 팔라딘, DRU 드루이드(인간·늑대·곰 변신 상태마다 따로).
- 공식(표의 0% 칸에서 F·속도를 거꾸로 맞춘 뒤, 각 열의 모든 칸이 표와 같음을 확인했다):
  - 효과 수치 E = ⌊120 × X / (120 + X)⌋ (X = 장비의 FCR·FHR·FBR %)
  - FCR: 프레임 = ⌈256 × F / ⌊속도 × (100 + E) / 100⌋⌉ − 1
  - FHR·FBR: 프레임 = ⌈256 × F / ⌊속도 × (50 + E) / 100⌋⌉ − 1
  - F = 그 동작의 기본 길이(애니메이션 프레임 수), 속도 = 기본 256.

### FCR (시전 속도)

- 공식 대조: AMA F=20, ASS 17, NEC 16, BAR 14, SOR 14, PAL 16, DRU 인간 15(속도 208), SOR 번개 19(끝의 −1 없음). DRU 늑대·곰은 이 공식으로 맞추지 못했다(`next_steps.md`).
- SOR 번개 = 라이트닝·체인 라이트닝 시전, SOR = 그 밖 스킬.

| 프레임 | AMA | ASS | NEC | BAR | SOR 번개 | SOR | PAL | DRU 인간 | DRU 늑대 | DRU 곰 |
|---|---|---|---|---|---|---|---|---|---|---|
| 19 | 0 |  |  |  | 0 |  |  |  |  |  |
| 18 | 7 |  |  |  | 7 |  |  | 0 |  |  |
| 17 | 14 |  |  |  | 15 |  |  | 4 |  |  |
| 16 | 22 | 0 |  |  | 23 |  |  | 10 | 0 | 0 |
| 15 | 32 | 8 | 0 |  | 35 |  | 0 | 19 | 6 | 7 |
| 14 | 48 | 16 | 9 |  | 52 |  | 9 | 30 | 14 | 15 |
| 13 | 68 | 27 | 18 | 0 | 78 | 0 | 18 | 46 | 26 | 26 |
| 12 | 99 | 42 | 30 | 9 | 117 | 9 | 30 | 68 | 40 | 40 |
| 11 | 152 | 65 | 48 | 20 | 194 | 20 | 48 | 99 | 60 | 63 |
| 10 |  | 102 | 75 | 37 |  | 37 | 75 | 163 | 95 | 99 |
| 9 |  | 174 | 125 | 63 |  | 63 | 125 |  | 157 | 163 |

### FHR (타격 회복)

- 공식 대조: AMA F=6, ASS 5, NEC 7, BAR 5, SOR 8, PAL 5, DRU 인간 W 7, DRU 늑대 4. DRU 인간·곰은 이 공식으로 맞추지 못했다(`next_steps.md`).
- DRU 인간 W = 원본 그림 주석 "with Wizardspike"가 붙은 표(뜻 미확인, `next_steps.md`), DRU 인간 = 그 밖.

| 프레임 | AMA | ASS | NEC | BAR | SOR | PAL | DRU 인간 | DRU 인간 W | DRU 늑대 | DRU 곰 |
|---|---|---|---|---|---|---|---|---|---|---|
| 15 |  |  |  |  | 0 |  |  |  |  |  |
| 14 |  |  |  |  | 5 |  | 0 |  |  |  |
| 13 |  |  | 0 |  | 9 |  | 3 | 0 |  | 0 |
| 12 |  |  | 5 |  | 14 |  | 7 | 5 |  | 5 |
| 11 | 0 |  | 10 |  | 20 |  | 13 | 10 |  | 10 |
| 10 | 6 |  | 16 |  | 30 |  | 19 | 16 |  | 16 |
| 9 | 13 | 0 | 26 | 0 | 42 | 0 | 29 | 26 |  | 24 |
| 8 | 20 | 7 | 39 | 7 | 60 | 7 | 42 | 39 |  | 37 |
| 7 | 32 | 15 | 56 | 15 | 86 | 15 | 63 | 56 | 0 | 54 |
| 6 | 52 | 27 | 86 | 27 | 142 | 27 | 99 | 86 | 9 | 86 |
| 5 | 86 | 48 | 152 | 48 | 280 | 48 | 174 | 152 | 20 | 152 |
| 4 | 174 | 86 | 377 | 86 | 1480 | 86 | 456 | 377 | 42 | 360 |
| 3 | 600 | 200 |  | 200 |  | 200 |  |  | 86 |  |
| 2 |  | 4680 |  | 4680 |  | 4680 |  |  | 280 |  |

### FBR (블록 속도)

- 공식 대조: AMA F=3, ASS 3, NEC 6, BAR 4, SOR 5, PAL 3, PAL 홀리 3(FCR 식 100 + E), DRU 인간 6, DRU 늑대 5. AMA 한손·DRU 곰은 이 공식으로 맞추지 못했다(`next_steps.md`).
- AMA 한손 = 한손으로 휘두르는 무기(검·도끼·둔기 등)를 들었을 때, PAL 홀리 = 홀리 실드를 켰을 때.

| 프레임 | AMA 한손 | AMA | ASS | NEC | BAR | SOR | PAL 홀리 | PAL | DRU 인간 | DRU 늑대 | DRU 곰 |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 17 | 0 |  |  |  |  |  |  |  |  |  |  |
| 16 | 4 |  |  |  |  |  |  |  |  |  |  |
| 15 | 6 |  |  |  |  |  |  |  |  |  |  |
| 14 | 11 |  |  |  |  |  |  |  |  |  |  |
| 13 | 15 |  |  |  |  |  |  |  |  |  |  |
| 12 | 23 |  |  |  |  |  |  |  |  |  | 0 |
| 11 | 29 |  |  | 0 |  |  |  |  | 0 |  | 5 |
| 10 | 40 |  |  | 6 |  |  |  |  | 6 |  | 10 |
| 9 | 56 |  |  | 13 |  | 0 |  |  | 13 | 0 | 16 |
| 8 | 80 |  |  | 20 |  | 7 |  |  | 20 | 7 | 27 |
| 7 | 120 |  |  | 32 | 0 | 15 |  |  | 32 | 15 | 40 |
| 6 | 200 |  |  | 52 | 9 | 27 |  |  | 52 | 27 | 65 |
| 5 | 480 | 0 | 0 | 86 | 20 | 48 |  | 0 | 86 | 48 | 109 |
| 4 |  | 13 | 13 | 174 | 42 | 86 |  | 13 | 174 | 86 | 223 |
| 3 |  | 32 | 32 | 600 | 86 | 200 |  | 32 | 600 | 200 |  |
| 2 |  | 86 | 86 |  | 280 |  | 0 | 86 |  |  |  |
| 1 |  | 600 | 600 |  |  |  | 86 | 600 |  |  |  |

## 어쌔신 스킬별 공격 속도

- **미검증**(`next_steps.md`). 값 = 그 프레임(f)에 필요한 공격 속도(IAS) 수치.
- 열 "3/3/3/3/7" 등은 연속 킥 한 번마다 걸리는 프레임으로 보인다(앞의 킥 4번 3프레임씩, 마지막 킥 7·8·9프레임, 추정).

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

- 요구 힘/민첩, 평균 데미지(`2handmindam`·`2handmaxdam` 평균, 에테리얼은 각각 × 1.5 내림), 에테리얼 요구치(−10)는 mpqdata `weapons.txt`와 같다. 데미지/초 = 평균 데미지 × 공격/초.
- 공격/초(초당 공격 횟수)는 **미검증**(`next_steps.md`). 공격 1회의 프레임 = 25 / 공격/초(예: 3.57 → 7프레임).
- 조건: 바디쉬 베이스 제외, 강타·디버프 무시, 노작(증뎀은 곱해서 계산). 용병 착용 시 사거리는 모두 같다.
- 표는 노멀 5종, 익셉셔널 5종, 엘리트 5종 순서.

| 이름 | 요구 힘/민첩 | 평균 데미지 | +0 IAS<br>공격/초 | +0 IAS<br>데미지/초<br>(일반 / eth) | +20 IAS<br>공격/초 | +20 IAS<br>데미지/초<br>(일반 / eth) | +35 IAS<br>공격/초 | +35 IAS<br>데미지/초<br>(일반 / eth) |
|---|---|---|---|---|---|---|---|---|
| Voulge | 50/–<br>40/– (eth) | 13.5 /<br>20.0 (eth) | 3.12 | 42.1 / 62.4 | 3.57 | 48.2 / 71.4 | 3.57 | 48.2 / 71.4 |
| Scythe | 41/41<br>31/31 (eth) | 14.0 /<br>21.0 (eth) | 3.33 | 46.6 / 69.9 | 3.33 | 46.6 / 69.9 | 3.84 | 53.8 / 80.6 |
| Poleaxe | 62/–<br>52/– (eth) | 28.5 /<br>42.5 (eth) | 2.77 | 78.9 / 117.7 | 3.12 | 88.9 / 132.6 | 3.57 | 101.7 / 151.7 |
| Halberd | 75/47<br>65/37 (eth) | 28.5 /<br>42.5 (eth) | 3.12 | 88.9 / 132.6 | 3.57 | 101.7 / 151.7 | 3.57 | 101.7 / 151.7 |
| War Scythe | 80/80<br>70/70 (eth) | 25.5 /<br>38.0 (eth) | 3.33 | 84.9 / 126.5 | 3.57 | 91.0 / 135.7 | 3.84 | 97.9 / 145.9 |
| Bill | 95/–<br>85/– (eth) | 33.5 /<br>50.0 (eth) | 3.12 | 104.5 / 156.0 | 3.57 | 119.6 / 178.5 | 3.57 | 119.6 / 178.5 |
| Battle Scythe | 82/82<br>72/72 (eth) | 31.5 /<br>47.0 (eth) | 3.33 | 104.9 / 156.5 | 3.33 | 104.9 / 156.5 | 3.84 | 121.0 / 180.5 |
| Partizan | 113/67<br>103/57 (eth) | 54.5 /<br>81.5 (eth) | 2.77 | 151.0 / 225.8 | 3.12 | 170.0 / 254.3 | 3.57 | 194.6 / 291.0 |
| Bec-de-Corbin | 133/91<br>123/81 (eth) | 49.0 /<br>73.0 (eth) | 3.12 | 152.9 / 227.8 | 3.57 | 174.9 / 260.6 | 3.57 | 174.9 / 260.6 |
| Grim Scythe | 140/140<br>130/130 (eth) | 50.0 /<br>75.0 (eth) | 3.33 | 166.5 / 249.8 | 3.57 | 178.5 / 267.8 | 3.84 | 192.0 / 288.0 |
| Colossus Voulge | 210/55<br>200/45 (eth) | 91.0 /<br>136.0 (eth) | 2.77 | 252.1 / 376.7 | 3.12 | 283.9 / 424.3 | 3.57 | 324.9 / 485.5 |
| Thresher | 152/118<br>142/108 (eth) | 76.5 /<br>114.5 (eth) | 3.33 | 254.7 / 381.3 | 3.57 | 273.1 / 408.8 | 3.84 | 293.8 / 439.7 |
| Cryptic Axe | 165/103<br>155/93 (eth) | 91.5 /<br>137.0 (eth) | 2.77 | 253.5 / 379.5 | 3.12 | 285.5 / 427.4 | 3.57 | 326.7 / 489.1 |
| Great Poleaxe | 179/99<br>169/89 (eth) | 86.5 /<br>129.5 (eth) | 3.12 | 269.9 / 404.0 | 3.57 | 308.8 / 462.3 | 3.57 | 308.8 / 462.3 |
| Giant Thresher | 188/140<br>178/130 (eth) | 77.0 /<br>115.5 (eth) | 3.33 | 256.4 / 384.6 | 3.57 | 274.9 / 412.3 | 3.84 | 295.7 / 443.5 |
