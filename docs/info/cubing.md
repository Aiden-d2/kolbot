# 큐브 조합 (룬 업그레이드, 소켓, 아이템 업그레이드, 크래프트)

큐브 조합식 (261104).

- 출처: mpqdata(1.14d) `cubemain.txt` 중 `enabled`=1인 줄. 룬·보석 코드는 `misc.txt`·`gems.txt` 이름으로 바꿨다. 아이템 코드(`fhl` 등)와 괄호 안 조건 코드(`nor`·`nos`·`mag`·`upg`·`bas`·`exc`·`uni`·`rar`·`low`·`sock`·`qty=N` 등)는 원본 그대로다.
- kolbot 사용처: `libs/Cubing.js`(조합식 목록), `libs/Runewords.js`
- **래더 전용:** `cubemain.txt` `ladder`=1. Battle.net 래더 캐릭터만 쓸 수 있다.
- 원문 메모(카오스큐브, 자멜라 "룬 업그레이드 정보" 그림 주석): "노멀아이템 조합시.. 같은 종류의 소켓아이템으로 변하고, 생성되는 소켓의 수는 무작위 그리고 슈페리어 옵션이 붙은 노멀 아이템은 조합 불가능!!"
- 생성되는 소켓 수 규칙은 `item_mods.md` "아이템 레벨별 소켓 수".

## 룬 업그레이드 (32)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| 3 rune 01 -> rune 02 | El Rune (qty=3) | Eld Rune |  |
| 3 rune 02 -> rune 03 | Eld Rune (qty=3) | Tir Rune |  |
| 3 rune 03 -> rune 04 | Tir Rune (qty=3) | Nef Rune |  |
| 3 rune 04 -> rune 05 | Nef Rune (qty=3) | Eth Rune |  |
| 3 rune 05 -> rune 06 | Eth Rune (qty=3) | Ith Rune |  |
| 3 rune 06 -> rune 07 | Ith Rune (qty=3) | Tal Rune |  |
| 3 rune 07 -> rune 08 | Tal Rune (qty=3) | Ral Rune |  |
| 3 rune 08 -> rune 09 | Ral Rune (qty=3) | Ort Rune |  |
| 3 rune 09 -> rune 10 | Ort Rune (qty=3) | Thul Rune |  |
| 3 rune 10 + 1 chipped topaz -> rune 11 | Thul Rune (qty=3) + Chipped Topaz | Amn Rune |  |
| 3 rune 11 + 1 chipped amethyst -> rune 12 | Amn Rune (qty=3) + Chipped Amethyst | Sol Rune |  |
| 3 rune 12 + 1 chipped sapphire -> rune 13 | Sol Rune (qty=3) + Chipped Saphire | Shael Rune |  |
| 3 rune 13 + 1 chipped ruby -> rune 14 | Shael Rune (qty=3) + Chipped Ruby | Dol Rune |  |
| 3 rune 14 + 1 chipped emerald -> rune 15 | Dol Rune (qty=3) + Chipped Emerald | Hel Rune | O |
| 3 rune 15 + 1 chipped diamond -> rune 16 | Hel Rune (qty=3) + Chipped Diamond | Io Rune | O |
| 3 rune 16 + 1 flawed topaz -> rune 17 | Io Rune (qty=3) + Flawed Topaz | Lum Rune | O |
| 3 rune 17 + 1 flawed amethyst -> rune 18 | Lum Rune (qty=3) + Flawed Amethyst | Ko Rune | O |
| 3 rune 18 + 1 flawed sapphire -> rune 19 | Ko Rune (qty=3) + Flawed Saphire | Fal Rune | O |
| 3 rune 19 + 1 flawed ruby -> rune 20 | Fal Rune (qty=3) + Flawed Ruby | Lem Rune | O |
| 3 rune 20 + 1 flawed emerald -> rune 21 | Lem Rune (qty=3) + Flawed Emerald | Pul Rune | O |
| 2 rune 21 + 1 flawed diamond -> rune 22 | Pul Rune (qty=2) + Flawed Diamond | Um Rune | O |
| 2 rune 22 + 1 standard topaz -> rune 23 | Um Rune (qty=2) + Topaz | Mal Rune | O |
| 2 rune 23 + 1 standard amethyst -> rune 24 | Mal Rune (qty=2) + Amethyst | Ist Rune | O |
| 2 rune 24 + 1 standard sapphire -> rune 25 | Ist Rune (qty=2) + Saphire | Gul Rune | O |
| 2 rune 25 + 1 standard ruby -> rune 26 | Gul Rune (qty=2) + Ruby | Vex Rune | O |
| 2 rune 26 + 1 standard emerald -> rune 27 | Vex Rune (qty=2) + Emerald | Ohm Rune | O |
| 2 rune 27 + 1 standard diamond -> rune 28 | Ohm Rune (qty=2) + Diamond | Lo Rune | O |
| 2 rune 28 + 1 flawless topaz -> rune 29 | Lo Rune (qty=2) + Flawless Topaz | Sur Rune | O |
| 2 rune 29 + 1 flawless amethyst -> rune 30 | Sur Rune (qty=2) + Flawless Amethyst | Ber Rune | O |
| 2 rune 30 + 1 flawless sapphire -> rune 31 | Ber Rune (qty=2) + Flawless Saphire | Jah Rune | O |
| 2 rune 31 + 1 flawless ruby -> rune 32 | Jah Rune (qty=2) + Flawless Ruby | Cham Rune | O |
| 2 rune 32 + 1 flawless emerald -> rune 33 | Cham Rune (qty=2) + Flawless Emerald | Zod Rune | O |

## 소켓 생성 (노멀) (4)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r07 + r10 + 1 perfect topaz + normal torso -> socketed torso | tors (nor,nos) + Tal Rune + Thul Rune + Perfect Topaz | useitem |  |
| r08 + r11 + 1 perfect amethyst + normal weapon -> socketed weapon | weap (nor,nos) + Ral Rune + Amn Rune + Perfect Amethyst | useitem |  |
| r08 + r10 + 1 perfect sapphire + normal helm -> socketed helm | helm (nor,nos) + Ral Rune + Thul Rune + Perfect Saphire | useitem |  |
| r07 + r11 + 1 perfect ruby + normal shield -> socketed shield | shld (nor,nos) + Tal Rune + Amn Rune + Perfect Ruby | useitem |  |

## 저품질 → 노멀 (2)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r02 + 1 chipped gem + low weapon -> normal weapon | weap (low) + Eld Rune + gem0 | usetype (nor) |  |
| r01 + 1 chipped gem + low armor -> normal armor | armo (low) + El Rune + gem0 | usetype (nor) |  |

## 유니크·레어 업그레이드 (8)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r08 + r12 + perfect emerald + basic unique weapon -> exceptional unique weapon | weap (bas,uni) + Ral Rune + Sol Rune + Perfect Emerald | useitem (mod,exc) |  |
| r07 + r13 + perfect diamond + basic unique armor -> exceptional unique armor | armo (bas,uni) + Tal Rune + Shael Rune + Perfect Diamond | useitem (mod,exc) |  |
| r17 + r21 + perfect emerald + exceptional unique weapon -> elite unique weapon | weap (exc,uni) + Lum Rune + Pul Rune + Perfect Emerald | useitem (mod,eli) | O |
| r18 + r20 + perfect diamond + exceptional unique armor -> elite unique armor | armo (exc,uni) + Ko Rune + Lem Rune + Perfect Diamond | useitem (mod,eli) | O |
| r09 + r11 + perfect sapphire + basic rare weapon -> exceptional rare weapon | weap (bas,rar) + Ort Rune + Amn Rune + Perfect Saphire | useitem (mod,exc) |  |
| r08 + r10 + perfect amethyst + basic rare armor -> exceptional rare armor | armo (bas,rar) + Ral Rune + Thul Rune + Perfect Amethyst | useitem (mod,exc) |  |
| r19 + r22 + perfect sapphire + exceptional rare weapon -> elite rare weapon | weap (exc,rar) + Fal Rune + Um Rune + Perfect Saphire | useitem (mod,eli) |  |
| r18 + r21 + perfect amethyst + exceptional rare armor -> elite rare armor | armo (exc,rar) + Ko Rune + Pul Rune + Perfect Amethyst | useitem (mod,eli) |  |

## 크래프트 (36)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| magic full helm + jewel + rune 06 + perfect sapphire -> hitpower helm | fhl (mag,upg) + Jewel + Ith Rune + Perfect Saphire | usetype (crf) |  |
| magic chain boots + jewel + rune 08 + perfect sapphire -> hitpower boots | mbt (mag,upg) + Jewel + Ral Rune + Perfect Saphire | usetype (crf) |  |
| magic chain gloves + jewel + rune 09 + perfect sapphire -> hitpower gloves | mgl (mag,upg) + Jewel + Ort Rune + Perfect Saphire | usetype (crf) |  |
| magic heavy belt + jewel + rune 07 + perfect sapphire -> hitpower belt | tbl (mag,upg) + Jewel + Tal Rune + Perfect Saphire | usetype (crf) |  |
| magic gothic shield + jewel + rune 05 + perfect sapphire -> hitpower shield | gts (mag,upg) + Jewel + Eth Rune + Perfect Saphire | usetype (crf) |  |
| magic field plate + jewel + rune 04 + perfect sapphire -> hitpower body | fld (mag,upg) + Jewel + Nef Rune + Perfect Saphire | usetype (crf) |  |
| magic amulet + jewel + rune 10 + perfect sapphire -> hitpower amulet | amul (mag) + Jewel + Thul Rune + Perfect Saphire | usetype (crf) |  |
| magic ring + jewel + rune 11 + perfect sapphire -> hitpower ring | ring (mag) + Jewel + Amn Rune + Perfect Saphire | usetype (crf) |  |
| magic blunt + jewel + rune 03 + perfect sapphire -> hitpower weapon | blun (mag) + Jewel + Tir Rune + Perfect Saphire | usetype (crf) |  |
| magic helm + jewel + rune 08 + perfect ruby -> blood helm | hlm (mag,upg) + Jewel + Ral Rune + Perfect Ruby | usetype (crf) |  |
| magic light plated boots + jewel + rune 05 + perfect ruby -> blood boots | tbt (mag,upg) + Jewel + Eth Rune + Perfect Ruby | usetype (crf) |  |
| magic heavy gloves + jewel + rune 04 + perfect ruby -> blood gloves | vgl (mag,upg) + Jewel + Nef Rune + Perfect Ruby | usetype (crf) |  |
| magic belt + jewel + rune 07 + perfect ruby -> blood belt | mbl (mag,upg) + Jewel + Tal Rune + Perfect Ruby | usetype (crf) |  |
| magic spiked shield + jewel + rune 06 + perfect ruby -> blood shield | spk (mag,upg) + Jewel + Ith Rune + Perfect Ruby | usetype (crf) |  |
| magic plate mail + jewel + rune 10 + perfect ruby -> blood body | plt (mag,upg) + Jewel + Thul Rune + Perfect Ruby | usetype (crf) |  |
| magic amulet + jewel + rune 11 + perfect ruby -> blood amulet | amul (mag) + Jewel + Amn Rune + Perfect Ruby | usetype (crf) |  |
| magic ring + jewel + rune 12 + perfect ruby -> blood ring | ring (mag) + Jewel + Sol Rune + Perfect Ruby | usetype (crf) |  |
| magic axe + jewel + rune 09 + perfect ruby -> blood weapon | axe (mag) + Jewel + Ort Rune + Perfect Ruby | usetype (crf) |  |
| magic mask + jewel + rune 04 + perfect amethyst -> caster helm | msk (mag,upg) + Jewel + Nef Rune + Perfect Amethyst | usetype (crf) |  |
| magic boots + jewel + rune 10 + perfect amethyst -> caster boots | lbt (mag,upg) + Jewel + Thul Rune + Perfect Amethyst | usetype (crf) |  |
| magic leather gloves + jewel + rune 09 + perfect amethyst -> caster gloves | lgl (mag,upg) + Jewel + Ort Rune + Perfect Amethyst | usetype (crf) |  |
| magic light belt + jewel + rune 06 + perfect amethyst -> caster belt | vbl (mag,upg) + Jewel + Ith Rune + Perfect Amethyst | usetype (crf) |  |
| magic small shield + jewel + rune 05 + perfect amethyst -> caster shield | sml (mag,upg) + Jewel + Eth Rune + Perfect Amethyst | usetype (crf) |  |
| magic light plate + jewel + rune 07 + perfect amethyst -> caster body | ltp (mag,upg) + Jewel + Tal Rune + Perfect Amethyst | usetype (crf) |  |
| magic amulet + jewel + rune 08 + perfect amethyst -> caster amulet | amul (mag) + Jewel + Ral Rune + Perfect Amethyst | usetype (crf) |  |
| magic ring + jewel + rune 11 + perfect amethyst -> caster ring | ring (mag) + Jewel + Amn Rune + Perfect Amethyst | usetype (crf) |  |
| magic rod + jewel + rune 03 + perfect amethyst -> caster weapon | rod (mag) + Jewel + Tir Rune + Perfect Amethyst | usetype (crf) |  |
| magic crown + jewel + rune 06 + perfect emerald -> safety helm | crn (mag,upg) + Jewel + Ith Rune + Perfect Emerald | usetype (crf) |  |
| magic plate boots + jewel + rune 09 + perfect emerald -> safety boots | hbt (mag,upg) + Jewel + Ort Rune + Perfect Emerald | usetype (crf) |  |
| magic gauntlets + jewel + rune 08 + perfect emerald -> safety gloves | hgl (mag,upg) + Jewel + Ral Rune + Perfect Emerald | usetype (crf) |  |
| magic sash + jewel + rune 07 + perfect emerald -> safety belt | lbl (mag,upg) + Jewel + Tal Rune + Perfect Emerald | usetype (crf) |  |
| magic kite shield + jewel + rune 04 + perfect emerald -> safety shield | kit (mag,upg) + Jewel + Nef Rune + Perfect Emerald | usetype (crf) |  |
| magic breastplate + jewel + rune 05 + perfect emerald -> safety body | brs (mag,upg) + Jewel + Eth Rune + Perfect Emerald | usetype (crf) |  |
| magic amulet + jewel + rune 10 + perfect emerald -> safety amulet | amul (mag) + Jewel + Thul Rune + Perfect Emerald | usetype (crf) |  |
| magic ring + jewel + rune 11 + perfect emerald -> safety ring | ring (mag) + Jewel + Amn Rune + Perfect Emerald | usetype (crf) |  |
| magic spear + jewel + rune 12 + perfect emerald -> safety weapon | spea (mag) + Jewel + Sol Rune + Perfect Emerald | usetype (crf) |  |

## 소켓 제거 (1)

| 설명 (cubemain `description`) | 재료 | 결과 | 래더 전용 |
|---|---|---|---|
| r15 + tsc + any socketed item -> unsocket (destroy gems) | any (sock) + Hel Rune + Town Portal Scroll | useitem (uns) |  |
