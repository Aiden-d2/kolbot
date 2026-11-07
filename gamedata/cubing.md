# 큐브 조합 (룬 업그레이드, 소켓, 아이템 업그레이드, 크래프트)

mpqdata(1.14d) `cubemain.txt` 중 `enabled`=1인 조합식.

- kolbot 사용처: `libs/Cubing.js`(조합식 목록), `libs/Runewords.js`
- **래더 전용:** `cubemain.txt` `ladder`=1. Battle.net 래더 캐릭터만 쓸 수 있다.
- 생성되는 소켓 수 규칙은 `item_mods.md` "아이템 레벨별 소켓 수".
- 이 노트에 없는 `enabled`=1 조합: 보석·스컬 등급 올리기(28), 퀘스트(호라드릭 스태프, 칼림의 의지, 카우방 포탈), 우버(판데모니움 열쇠·장기 포탈). 그 밖의 `enabled`=1 조합은 모두 있다(146개 중 113개).
- kolbot(`libs/Cubing.js`)이 하는 조합: 크래프트 4종, 유니크·레어 업그레이드, 노멀 소켓 생성(`Punch`), 룬 업그레이드, 저품질 → 노멀, 리롤 3종(퍼펙트 보석 3 + 매직, 퍼펙트 스컬 6 + 레어, 퍼펙트 스컬 + 조던 + 레어), 토큰, 소켓 보석용 보석 올리기. 아래 "매직 무기 소켓"·"룬 수리·충전"·"물약"·"그 밖"과 레어 소켓 추가는 없다.

## 표 읽는 법

- 설명 = `cubemain.txt` `description` 원문(영어).
- 재료·결과의 이름: 아이템 하나면 그 이름(`Full Helm`, `Perfect Saphire` 등, 데이터 표기 그대로), 종류면 한글(갑옷·무기·투구·방패, 방어구 = 갑옷·투구·방패 등 방어구 전부, 아무 아이템 = 종류 무관). `×N` = 개수.
- 보석: 칩·플로드·보석(일반)·플로리스·퍼펙트 보석 = 그 등급의 보석(색 무관). 스컬·루비·다이아몬드 = 등급 무관. 정수 4종 = Twisted Essence of Suffering(고통)·Charged Essense of Hatred(증오)·Burning Essence of Terror(공포)·Festering Essence of Destruction(파괴).
- 괄호 안 조건(재료):

| 표기 | 뜻 |
|---|---|
| 노멀 / 매직 / 레어 / 유니크 / 저품질 | 아이템 품질 |
| 노멀 등급 / 익셉셔널 / 엘리트 | 베이스 등급 |
| 소켓 없음 / 소켓 있음 | 소켓 유무 |
| 에테리얼 아님 | 에테리얼은 넣을 수 없음 |
| 상위 베이스 포함 | 같은 계열의 익셉셔널·엘리트 베이스도 받음(예: Full Helm → Basinet·Winged Helm). 근거: 일반 지식(미검증, `next_steps.md`) |

- 결과:

| 표기 | 뜻 |
|---|---|
| `useitem` | 넣은 아이템을 그대로 바꾼다 |
| `usetype` | 넣은 아이템과 같은 베이스로 새 아이템을 만든다(옵션은 새로 뽑힘, 아래 "매직 무기 소켓" 동작) |
| 옵션 유지 | 원래 옵션을 유지한 채 베이스 등급만 올림 |
| 크래프트 | 크래프트 아이템이 됨 |
| 접두 N / 접미 N | 그 번호의 접두·접미(`magicprefix.txt`·`magicsuffix.txt` 줄 번호)가 붙음 |
| 수리 / 충전 / 소켓 비움 / 소켓 +1 | 내구 수리 / 충전 스킬 충전 / 소켓 안의 것을 없앰 / 소켓 1개 추가 |
| 수량 255 | 데이터 값 그대로(뜻 미확인, `next_steps.md`) |

## 룬 업그레이드 (32)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 3 rune 01 -> rune 02 | El 룬 ×3 | Eld 룬 |  |
| 3 rune 02 -> rune 03 | Eld 룬 ×3 | Tir 룬 |  |
| 3 rune 03 -> rune 04 | Tir 룬 ×3 | Nef 룬 |  |
| 3 rune 04 -> rune 05 | Nef 룬 ×3 | Eth 룬 |  |
| 3 rune 05 -> rune 06 | Eth 룬 ×3 | Ith 룬 |  |
| 3 rune 06 -> rune 07 | Ith 룬 ×3 | Tal 룬 |  |
| 3 rune 07 -> rune 08 | Tal 룬 ×3 | Ral 룬 |  |
| 3 rune 08 -> rune 09 | Ral 룬 ×3 | Ort 룬 |  |
| 3 rune 09 -> rune 10 | Ort 룬 ×3 | Thul 룬 |  |
| 3 rune 10 + 1 chipped topaz -> rune 11 | Thul 룬 ×3 + Chipped Topaz | Amn 룬 |  |
| 3 rune 11 + 1 chipped amethyst -> rune 12 | Amn 룬 ×3 + Chipped Amethyst | Sol 룬 |  |
| 3 rune 12 + 1 chipped sapphire -> rune 13 | Sol 룬 ×3 + Chipped Saphire | Shael 룬 |  |
| 3 rune 13 + 1 chipped ruby -> rune 14 | Shael 룬 ×3 + Chipped Ruby | Dol 룬 |  |
| 3 rune 14 + 1 chipped emerald -> rune 15 | Dol 룬 ×3 + Chipped Emerald | Hel 룬 | O |
| 3 rune 15 + 1 chipped diamond -> rune 16 | Hel 룬 ×3 + Chipped Diamond | Io 룬 | O |
| 3 rune 16 + 1 flawed topaz -> rune 17 | Io 룬 ×3 + Flawed Topaz | Lum 룬 | O |
| 3 rune 17 + 1 flawed amethyst -> rune 18 | Lum 룬 ×3 + Flawed Amethyst | Ko 룬 | O |
| 3 rune 18 + 1 flawed sapphire -> rune 19 | Ko 룬 ×3 + Flawed Saphire | Fal 룬 | O |
| 3 rune 19 + 1 flawed ruby -> rune 20 | Fal 룬 ×3 + Flawed Ruby | Lem 룬 | O |
| 3 rune 20 + 1 flawed emerald -> rune 21 | Lem 룬 ×3 + Flawed Emerald | Pul 룬 | O |
| 2 rune 21 + 1 flawed diamond -> rune 22 | Pul 룬 ×2 + Flawed Diamond | Um 룬 | O |
| 2 rune 22 + 1 standard topaz -> rune 23 | Um 룬 ×2 + Topaz | Mal 룬 | O |
| 2 rune 23 + 1 standard amethyst -> rune 24 | Mal 룬 ×2 + Amethyst | Ist 룬 | O |
| 2 rune 24 + 1 standard sapphire -> rune 25 | Ist 룬 ×2 + Saphire | Gul 룬 | O |
| 2 rune 25 + 1 standard ruby -> rune 26 | Gul 룬 ×2 + Ruby | Vex 룬 | O |
| 2 rune 26 + 1 standard emerald -> rune 27 | Vex 룬 ×2 + Emerald | Ohm 룬 | O |
| 2 rune 27 + 1 standard diamond -> rune 28 | Ohm 룬 ×2 + Diamond | Lo 룬 | O |
| 2 rune 28 + 1 flawless topaz -> rune 29 | Lo 룬 ×2 + Flawless Topaz | Sur 룬 | O |
| 2 rune 29 + 1 flawless amethyst -> rune 30 | Sur 룬 ×2 + Flawless Amethyst | Ber 룬 | O |
| 2 rune 30 + 1 flawless sapphire -> rune 31 | Ber 룬 ×2 + Flawless Saphire | Jah 룬 | O |
| 2 rune 31 + 1 flawless ruby -> rune 32 | Jah 룬 ×2 + Flawless Ruby | Cham 룬 | O |
| 2 rune 32 + 1 flawless emerald -> rune 33 | Cham 룬 ×2 + Flawless Emerald | Zod 룬 | O |

## 소켓 생성 (노멀) (4)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r07 + r10 + 1 perfect topaz + normal torso -> socketed torso | 갑옷 (노멀, 소켓 없음) + Tal 룬 + Thul 룬 + Perfect Topaz | useitem |  |
| r08 + r11 + 1 perfect amethyst + normal weapon -> socketed weapon | 무기 (노멀, 소켓 없음) + Ral 룬 + Amn 룬 + Perfect Amethyst | useitem |  |
| r08 + r10 + 1 perfect sapphire + normal helm -> socketed helm | 투구 (노멀, 소켓 없음) + Ral 룬 + Thul 룬 + Perfect Saphire | useitem |  |
| r07 + r11 + 1 perfect ruby + normal shield -> socketed shield | 방패 (노멀, 소켓 없음) + Tal 룬 + Amn 룬 + Perfect Ruby | useitem |  |

## 저품질 → 노멀 (2)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r02 + 1 chipped gem + low weapon -> normal weapon | 무기 (저품질) + Eld 룬 + 칩 보석 | usetype (노멀) |  |
| r01 + 1 chipped gem + low armor -> normal armor | 방어구 (저품질) + El 룬 + 칩 보석 | usetype (노멀) |  |

## 유니크·레어 업그레이드 (8)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r08 + r12 + perfect emerald + basic unique weapon -> exceptional unique weapon | 무기 (노멀 등급, 유니크) + Ral 룬 + Sol 룬 + Perfect Emerald | useitem (옵션 유지, 익셉셔널) |  |
| r07 + r13 + perfect diamond + basic unique armor -> exceptional unique armor | 방어구 (노멀 등급, 유니크) + Tal 룬 + Shael 룬 + Perfect Diamond | useitem (옵션 유지, 익셉셔널) |  |
| r17 + r21 + perfect emerald + exceptional unique weapon -> elite unique weapon | 무기 (익셉셔널, 유니크) + Lum 룬 + Pul 룬 + Perfect Emerald | useitem (옵션 유지, 엘리트) | O |
| r18 + r20 + perfect diamond + exceptional unique armor -> elite unique armor | 방어구 (익셉셔널, 유니크) + Ko 룬 + Lem 룬 + Perfect Diamond | useitem (옵션 유지, 엘리트) | O |
| r09 + r11 + perfect sapphire + basic rare weapon -> exceptional rare weapon | 무기 (노멀 등급, 레어) + Ort 룬 + Amn 룬 + Perfect Saphire | useitem (옵션 유지, 익셉셔널) |  |
| r08 + r10 + perfect amethyst + basic rare armor -> exceptional rare armor | 방어구 (노멀 등급, 레어) + Ral 룬 + Thul 룬 + Perfect Amethyst | useitem (옵션 유지, 익셉셔널) |  |
| r19 + r22 + perfect sapphire + exceptional rare weapon -> elite rare weapon | 무기 (익셉셔널, 레어) + Fal 룬 + Um 룬 + Perfect Saphire | useitem (옵션 유지, 엘리트) |  |
| r18 + r21 + perfect amethyst + exceptional rare armor -> elite rare armor | 방어구 (익셉셔널, 레어) + Ko 룬 + Pul 룬 + Perfect Amethyst | useitem (옵션 유지, 엘리트) |  |

## 크래프트 (36)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| magic full helm + jewel + rune 06 + perfect sapphire -> hitpower helm | Full Helm (매직, 상위 베이스 포함) + Jewel + Ith 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic chain boots + jewel + rune 08 + perfect sapphire -> hitpower boots | Chain Boots (매직, 상위 베이스 포함) + Jewel + Ral 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic chain gloves + jewel + rune 09 + perfect sapphire -> hitpower gloves | Chain Gloves (매직, 상위 베이스 포함) + Jewel + Ort 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic heavy belt + jewel + rune 07 + perfect sapphire -> hitpower belt | Heavy Belt (매직, 상위 베이스 포함) + Jewel + Tal 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic gothic shield + jewel + rune 05 + perfect sapphire -> hitpower shield | Gothic Shield (매직, 상위 베이스 포함) + Jewel + Eth 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic field plate + jewel + rune 04 + perfect sapphire -> hitpower body | Field Plate (매직, 상위 베이스 포함) + Jewel + Nef 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic amulet + jewel + rune 10 + perfect sapphire -> hitpower amulet | 아뮬렛 (매직) + Jewel + Thul 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic ring + jewel + rune 11 + perfect sapphire -> hitpower ring | 반지 (매직) + Jewel + Amn 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic blunt + jewel + rune 03 + perfect sapphire -> hitpower weapon | 둔기 (매직) + Jewel + Tir 룬 + Perfect Saphire | usetype (크래프트) |  |
| magic helm + jewel + rune 08 + perfect ruby -> blood helm | Helm (매직, 상위 베이스 포함) + Jewel + Ral 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic light plated boots + jewel + rune 05 + perfect ruby -> blood boots | Light Plated Boots (매직, 상위 베이스 포함) + Jewel + Eth 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic heavy gloves + jewel + rune 04 + perfect ruby -> blood gloves | Heavy Gloves (매직, 상위 베이스 포함) + Jewel + Nef 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic belt + jewel + rune 07 + perfect ruby -> blood belt | Belt (매직, 상위 베이스 포함) + Jewel + Tal 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic spiked shield + jewel + rune 06 + perfect ruby -> blood shield | Spiked Shield (매직, 상위 베이스 포함) + Jewel + Ith 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic plate mail + jewel + rune 10 + perfect ruby -> blood body | Plate Mail (매직, 상위 베이스 포함) + Jewel + Thul 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic amulet + jewel + rune 11 + perfect ruby -> blood amulet | 아뮬렛 (매직) + Jewel + Amn 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic ring + jewel + rune 12 + perfect ruby -> blood ring | 반지 (매직) + Jewel + Sol 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic axe + jewel + rune 09 + perfect ruby -> blood weapon | 도끼 (매직) + Jewel + Ort 룬 + Perfect Ruby | usetype (크래프트) |  |
| magic mask + jewel + rune 04 + perfect amethyst -> caster helm | Mask (매직, 상위 베이스 포함) + Jewel + Nef 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic boots + jewel + rune 10 + perfect amethyst -> caster boots | Boots (매직, 상위 베이스 포함) + Jewel + Thul 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic leather gloves + jewel + rune 09 + perfect amethyst -> caster gloves | Leather Gloves (매직, 상위 베이스 포함) + Jewel + Ort 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic light belt + jewel + rune 06 + perfect amethyst -> caster belt | Light Belt (매직, 상위 베이스 포함) + Jewel + Ith 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic small shield + jewel + rune 05 + perfect amethyst -> caster shield | Small Shield (매직, 상위 베이스 포함) + Jewel + Eth 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic light plate + jewel + rune 07 + perfect amethyst -> caster body | Light Plate (매직, 상위 베이스 포함) + Jewel + Tal 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic amulet + jewel + rune 08 + perfect amethyst -> caster amulet | 아뮬렛 (매직) + Jewel + Ral 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic ring + jewel + rune 11 + perfect amethyst -> caster ring | 반지 (매직) + Jewel + Amn 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic rod + jewel + rune 03 + perfect amethyst -> caster weapon | 지팡이·로드 (매직) + Jewel + Tir 룬 + Perfect Amethyst | usetype (크래프트) |  |
| magic crown + jewel + rune 06 + perfect emerald -> safety helm | Crown (매직, 상위 베이스 포함) + Jewel + Ith 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic plate boots + jewel + rune 09 + perfect emerald -> safety boots | Plate Boots (매직, 상위 베이스 포함) + Jewel + Ort 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic gauntlets + jewel + rune 08 + perfect emerald -> safety gloves | Gauntlets (매직, 상위 베이스 포함) + Jewel + Ral 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic sash + jewel + rune 07 + perfect emerald -> safety belt | Sash (매직, 상위 베이스 포함) + Jewel + Tal 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic kite shield + jewel + rune 04 + perfect emerald -> safety shield | Kite Shield (매직, 상위 베이스 포함) + Jewel + Nef 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic breastplate + jewel + rune 05 + perfect emerald -> safety body | Breast Plate (매직, 상위 베이스 포함) + Jewel + Eth 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic amulet + jewel + rune 10 + perfect emerald -> safety amulet | 아뮬렛 (매직) + Jewel + Thul 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic ring + jewel + rune 11 + perfect emerald -> safety ring | 반지 (매직) + Jewel + Amn 룬 + Perfect Emerald | usetype (크래프트) |  |
| magic spear + jewel + rune 12 + perfect emerald -> safety weapon | 창 (매직) + Jewel + Sol 룬 + Perfect Emerald | usetype (크래프트) |  |

## 소켓 제거 (1)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r15 + tsc + any socketed item -> unsocket (destroy gems) | 아무 아이템 (소켓 있음) + Hel 룬 + Town Portal Scroll | useitem (소켓 비움) |  |

## 리롤·소켓 추가 (4)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 3 perfect gems + 1 magic item -> magic item | 아무 아이템 (매직) + 퍼펙트 보석 ×3 | usetype (매직) |  |
| 6 perfect skulls + 1 rare item -> 1 low level rare item | 아무 아이템 (레어) + Perfect Skull ×6 | usetype (레어) |  |
| 1 perfect skull + 1 rare item + soj -> 1 high level rare item | 아무 아이템 (레어) + Perfect Skull + The Stone of Jordan | usetype (레어) |  |
| 3 perfect skull + 1 rare item + stone of jordan-> add 1 socket to rare | 아무 아이템 (레어, 소켓 없음) + Perfect Skull ×3 + The Stone of Jordan | useitem (소켓 +1) |  |

## 매직 무기 소켓 (3)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 3 standard gems + 1 socketed weapon ->  magic, socketable weapon | 무기 (소켓 있음) + 보석(일반) ×3 | usetype (매직) |  |
| 3 flawless gems + 1 magic weapon -> socketed, magic weapon | 무기 (매직) + 플로리스 보석 ×3 | usetype (매직) |  |
| 3 chipped gems + 1 magic weapon -> socketed, magic weapon | 무기 (매직) + 칩 보석 ×3 | usetype (매직) |  |

### 동작

- 근거: D2MOO(1.10f 소스 재구성) 코드와 mpqdata(1.14d) 데이터. 1.14d 코드 확인은 하지 않았다(`next_steps.md`).
- **결과 아이템 레벨** (D2MOO `PLRTRADE_CreateCubeOutputs`. 모든 큐브 조합식에 같은 규칙)
  - `lvl`이 있으면 결과 레벨 = `lvl`이다. 이때 `plvl`·`ilvl`은 쓰지 않는다.
  - `lvl`이 없으면 결과 레벨 = 캐릭터 레벨 × `plvl`% + 원래 아이템 레벨 × `ilvl`%이다. 1보다 작으면 1, 최대 레벨보다 크면 최대 레벨로 맞춘다.
  - 이 절의 조합식(`cubemain.txt` 값):
    - 스탠다드·플로리스 조합식은 `lvl`=30, `ilvl`=60이라 결과 레벨이 **30**이다.
    - 칩 조합식은 `lvl`=25, `ilvl`=50이라 결과 레벨이 **25**이다.
    - 넣은 무기의 아이템 레벨은 결과에 영향이 없다.
  - 위 절의 퍼펙트 보석 리롤은 `lvl`이 없고 `ilvl`=100이라, 결과 레벨이 원래 레벨 그대로다.
- **결과는 새 아이템**(`usetype`): 넣은 무기와 같은 베이스로 매직 아이템을 새로 만든다. 접두·접미는 새로 뽑히고 원래 옵션은 남지 않는다.
- **소켓**: `mod 1=sock`(최소 1, 최대 2)은 `properties.txt`의 `sock`(→ `item_numsockets`) 속성을 `ITEMMODS_AddCraftPropertyList`로 직접 더한다.
  - 접두를 뽑는 과정이 아니어서 이름이 바뀌지 않고 접두 자리도 쓰지 않는다.
  - Mechanist's·Artificer's·Jeweler's(`magicprefix.txt`, 속성 `sock`)는 접두이고, 접두를 새로 뽑을 때 따로 뽑힐 수 있다.
- **넣는 조건**(`cubemain.txt` 표기)
  - 스탠다드 조합식은 `weap (sock)`이다. 품질 조건이 없어 노멀 전용이 아니다.
  - 플로리스·칩 조합식은 `weap (mag)`로 매직 무기만 받는다.
  - 세 조합식 모두 `nos`(소켓 없음) 조건이 없어, 소켓이 있는 매직 무기도 다시 넣을 수 있다.
- **붙을 수 있는 접사**: 결과 레벨이 30(칩은 25)으로 고정이라, 접사 레벨은 베이스 기본 레벨(`weapons.txt` `level`)만으로 정해진다. 식은 `item_mods.md` "매직 접사 레벨".
  - 기본 레벨 66 이상이면 접사 레벨 = 2 × 기본 레벨 − 99이고, 66 미만이면 33 이하다.
  - 접사 레벨 50 이상은 기본 레벨 75 이상인 베이스에서만 나온다.

## 룬 수리·충전 (4)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r09 + weapon -> repair | 무기 (에테리얼 아님) + Ort 룬 | useitem (수리, 수량 255) |  |
| r08 + armor -> repair | 방어구 (에테리얼 아님) + Ral 룬 | useitem (수리, 수량 255) |  |
| r09 + weapon + chipped gem -> repair + recharge | 무기 (에테리얼 아님) + Ort 룬 + 칩 보석 | useitem (수리, 충전, 수량 255) |  |
| r08 + armor + flawed gem -> repair + recharge | 방어구 (에테리얼 아님) + Ral 룬 + 플로드 보석 | useitem (수리, 충전, 수량 255) |  |

## 물약 (4)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 3 health potions + 3 mana potions + 1 standard gem -> full rejuvenate potion | 체력 물약 ×3 + 마나 물약 ×3 + 보석(일반) | 최대 회복 물약 |  |
| 3 health potions +  3 mana potions + 1 chipped gem -> rejuvenate potion | 체력 물약 ×3 + 마나 물약 ×3 + 칩 보석 | 회복 물약 |  |
| 3 small rejuvs -> one large | 회복 물약 ×3 | 최대 회복 물약 |  |
| 1 strangling gas potion + 1 health potion -> antidote potion | Strangling Gas Potion + 체력 물약 | Antidote Potion |  |

## 그 밖 (14)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 1 perfect gem of each type + 1 amulet -> prismatic amulet | 아뮬렛 (매직) + Perfect Amethyst + Perfect Topaz + Perfect Saphire + Perfect Emerald + Perfect Ruby + Perfect Diamond | 아뮬렛 (매직, 접두 331) |  |
| 1 ring + 1 perfect ruby + 1 exploding potions -> garnet ring | 반지 (매직) + Perfect Ruby + Exploding Potion | 반지 (매직, 접두 372) |  |
| 1 ring + 1 perfect sapphire + 1 thawing potions-> cobalt ring | 반지 (매직) + Perfect Saphire + Thawing Potion | 반지 (매직, 접두 353) |  |
| 1 ring + 1 perfect topaz + 1 rejuvenation -> coral ring | 반지 (매직) + Perfect Topaz + 회복 물약 | 반지 (매직, 접두 392) |  |
| 1 ring + 1 emerald + 1 antidote potions -> jade ring | 반지 (매직) + Perfect Emerald + Antidote Potion | 반지 (매직, 접두 412) |  |
| 1 axe + 1 dagger -> throwing axe | 도끼 + 단검 | Throwing Axe (노멀) |  |
| 1 spear + 1 arrow quiver -> javelins | 창 + 화살 | Javelin (노멀) |  |
| 3 rings -> amulet | 반지 (매직) ×3 | 아뮬렛 (매직) |  |
| 3 amulets -> ring | 아뮬렛 (매직) ×3 | 반지 (매직) |  |
| 1 magic small shield + 1 spiked club + 2 skulls -> shield of spikes | 방패 (매직) + 스컬 ×2 + Spiked Club | usetype (매직, 접미 162) |  |
| 4 health potion + 1 ruby + 1 magic sword -> sword of the leech | 검 (매직) + 루비 + 체력 물약 ×4 | usetype (매직, 접미 352) |  |
| 1 diamond + 1 kriss + 1 staff + 1 belt -> savage polearm | Kriss + 다이아몬드 + 지팡이 + 벨트 | 폴암 (매직, 접두 191) |  |
| 2 arrows -> bolts | 화살 ×2 | 볼트 |  |
| 2 bolts -> arrows | 볼트 ×2 | 화살 |  |

## 토큰 (1)

| 설명 | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| Token of Absolution | 고통의 정수 + 증오의 정수 + 공포의 정수 + 파괴의 정수 | Token of Absolution |  |
