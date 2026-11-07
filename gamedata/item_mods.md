# 아이템 생성 규칙 (auto mod, staff mod, 소켓, 에테리얼, 겜블, 매직 접사 레벨, 참 접사, 매직 찬스, 우버·횃불)

아이템 종류에 따라 자동으로 붙는 옵션(auto mod)과 직업 스킬 옵션(staff mod), 아이템 레벨별 소켓 수, 에테리얼, 겜블 아이템 레벨, 매직 접사 레벨, 참 접사, 매직 찬스, 우버 디아블로·헬파이어 토치.

- 이름 주의: 여기서 mod는 아이템 옵션(modifier)이다. 코드의 `unit.mode`(유닛 동작 상태, `ids.md`)와 다른 말이다.
- kolbot 사용처: nip 규칙의 스킬·저항·소켓 조건(`nips/*.nip`), `Pickit`, `Cubing`(소켓 뚫기), `Runewords`
- 근거 표기: **데이터** = mpqdata(1.14d), **D2MOO** = 1.10f 소스 재구성 코드(1.14d에서 같은지는 확인하지 않음). 검증되지 않은 주장은 `next_steps.md`에 있다.

## auto mod

- 데이터: `automagic.txt`. 그 아이템의 그룹 = `weapons.txt`·`armor.txt`의 `auto prefix` 열(= `group`). 효과는 게임 표시로 바꿔 적었다(독: 내부 값 × 길이 / 256, 반올림, 길이 / 25 = 초).
- 그룹: 300 아마존 활, 302 아마존 창·재블린, 303 소서리스 오브(라이프·마나), 304 팔라딘 방패(모든 저항 / 공격 등급+증뎀), 305 네크로맨서 머리(독 데미지). 그룹 301(아마존 패시브·매직 스킬)은 `automagic.txt`에 있지만 `auto prefix`가 301인 아이템이 없어 실제로 붙지 않는다.
- `rare` X(레어에 안 붙음): Archer's, Lancer's, of the Colossus, Great Wyrm's, Chromatic, of Anthrax. 팔라딘 방패 Sharp~Knight's는 레어에도 붙는다.

| group | 대상 | Auto Mod | level | levelreq | frequency | rare | 효과 (게임 표시) |
|---|---|---|---|---|---|---|---|
| 300 | Amazon bows | Fletcher's | 1 | 15 | 3 | O | +1 to Bow and Crossbow Skills |
| 300 | Amazon bows | Bowyer's | 40 | 30 | 2 | O | +2 to Bow and Crossbow Skills |
| 300 | Amazon bows | Archer's | 60 | 45 | 1 | X | +3 to Bow and Crossbow Skills |
| 302 | Amazon javelins / spears | Harpoonist's | 1 | 15 | 3 | O | +1 to Javelin and Spear Skills |
| 302 | Amazon javelins / spears | Spearmaiden's | 40 | 30 | 2 | O | +2 to Javelin and Spear Skills |
| 302 | Amazon javelins / spears | Lancer's | 60 | 45 | 1 | X | +3 to Javelin and Spear Skills |
| 303 | Sorceress orbs | of the Jackal | 1 | 3 | 6 | O | +1-5 to Life |
| 303 | Sorceress orbs | of the Fox | 11 | 8 | 5 | O | +6-10 to Life |
| 303 | Sorceress orbs | of the Wolf | 27 | 20 | 4 | O | +11-20 to Life |
| 303 | Sorceress orbs | of the Tiger | 43 | 35 | 3 | O | +21-30 to Life |
| 303 | Sorceress orbs | of the Mammoth | 59 | 51 | 2 | O | +31-40 to Life |
| 303 | Sorceress orbs | of the Colossus | 75 | 67 | 1 | X | +41-60 to Life |
| 303 | Sorceress orbs | Lizard's | 3 | 2 | 4 | O | +1-5 to Mana |
| 303 | Sorceress orbs | Snake's | 12 | 9 | 3 | O | +5-10 to Mana |
| 303 | Sorceress orbs | Serpent's | 23 | 16 | 2 | O | +11-20 to Mana |
| 303 | Sorceress orbs | Drake's | 34 | 26 | 2 | O | +21-30 to Mana |
| 303 | Sorceress orbs | Dragon's | 45 | 37 | 1 | O | +31-40 to Mana |
| 303 | Sorceress orbs | Wyrm's | 56 | 48 | 1 | O | +41-60 to Mana |
| 303 | Sorceress orbs | Great Wyrm's | 67 | 59 | 1 | X | +61-80 to Mana |
| 304 | Paladin shields | Shimmering | 1 | 3 | 8 | O | All Resistances +5-10 |
| 304 | Paladin shields | Rainbow | 18 | 13 | 7 | O | All Resistances +8-15 |
| 304 | Paladin shields | Scintillating | 28 | 21 | 6 | O | All Resistances +16-30 |
| 304 | Paladin shields | Prismatic | 39 | 31 | 5 | O | All Resistances +25-35 |
| 304 | Paladin shields | Chromatic | 50 | 42 | 4 | X | All Resistances +35-45 |
| 304 | Paladin shields | Sharp | 10 | 5 | 3 | O | +15-30 to Attack Rating, +10-20% Enhanced Damage |
| 304 | Paladin shields | Fine | 18 | 13 | 3 | O | +31-60 to Attack Rating, +21-30% Enhanced Damage |
| 304 | Paladin shields | Warrior's | 30 | 23 | 2 | O | +61-80 to Attack Rating, +31-40% Enhanced Damage |
| 304 | Paladin shields | Soldier's | 42 | 34 | 2 | O | +81-100 to Attack Rating, +41-50% Enhanced Damage |
| 304 | Paladin shields | Knight's | 50 | 42 | 2 | O | +101-121 to Attack Rating, +51-65% Enhanced Damage |
| 305 | Necromancer heads | of Blight | 1 | 3 | 3 | O | Adds 2-7 poison damage over 3 seconds |
| 305 | Necromancer heads | of Venom | 15 | 11 | 2 | O | Adds 5-14 poison damage over 3 seconds |
| 305 | Necromancer heads | of Pestilence | 25 | 18 | 2 | O | Adds 13-28 poison damage over 4 seconds |
| 305 | Necromancer heads | of Anthrax | 33 | 25 | 2 | X | Adds 25-50 poison damage over 4 seconds |

- 300 Amazon bows: Stag Bow, Reflex Bow, Ashwood Bow, Ceremonial Bow, Matriarchal Bow, Grand Matron Bow
- 302 Amazon javelins / spears: Maiden Spear, Maiden Pike, Maiden Javelin, Ceremonial Spear, Ceremonial Pike, Ceremonial Javelin, Matriarchal Spear, Matriarchal Pike, MatriarchalJavelin
- 303 Sorceress orbs: Eagle Orb, Sacred Globe, Smoked Sphere, Clasped Orb, Dragon Stone, Glowing Orb, Crystalline Globe, Cloudy Sphere, Sparkling Ball, Swirling Crystal, Heavenly Stone, Eldritch Orb, Demon Heart, Vortex Orb, Dimensional Shard
- 304 Paladin shields: Targe, Rondache, Heraldic Shield, Aerin Shield, Crown Shield, Akaran Targe, Akaran Rondache, Protector Shield, Guilded Shield, Royal Shield, Sacred Targe, Sacred Rondache, Ancient Shield, Zakarum Shield, Vortex Shield
- 305 Necromancer heads: Preserved Head, Zombie Head, Unraveller Head, Gargoyle Head, Demon Head, Mummified Trophy, Fetish Trophy, Sexton Trophy, Cantor Trophy, Heirophant Trophy, Minion Skull, Hellspawn Skull, Overseer Skull, Succubae Skull, Bloodlord Skull

## staff mod

### 붙는 아이템

- 데이터: `itemtypes.txt`의 `StaffMods` 열.

| 아이템 종류 | 코드 | 직업 |
|---|---|---|
| Scepter | `scep` | Paladin |
| Wand | `wand` | Necromancer |
| Staff | `staf` | Sorceress |
| Orb | `orb` | Sorceress |
| Voodoo Heads | `head` | Necromancer |
| Primal Helm | `phlm` | Barbarian |
| Pelt | `pelt` | Druid |
| Cloak | `cloa` | Assassin |
| Hand to Hand 2 | `h2h2` | Assassin |

### 굴림 (D2MOO)

- D2MOO `Items.cpp`의 `sub_6FC52410`·`sub_6FC52650`. `sub_6FC52410`은 아이템 형식(`ITEMS_GetItemFormat`)이 0이 아닐 때 `sub_6FC52650`을 부른다(0이면 `sub_6FC55060`, `next_steps.md`).
- "드롭 레벨 보너스" = 찰시 임뷰(`ITEMDROPFLAG_STAFFMODUSEILVL`)일 때만 아이템 레벨, 그 밖은 0.

1. 스킬 개수: r = 드롭 레벨 보너스 + 난수(0~99). r > 90 → 3개, r > 70 → 2개, r > 30 또는 보너스 있음 → 1개, 그 밖 → 0개. 보너스가 0이면 3개 9%, 2개 20%, 1개 40%, 0개 31%.
2. 기준 티어: 아이템 레벨 > 36이고 확장팩 아이템(형식 ≥ 100) → 5, > 24 → 4, > 18 → 3, > 11 → 2, 그 밖 → 1.
3. 스킬마다 티어: 난수(0~99) > 80 → 기준+1(19%), > 30 → 기준(50%), > 10 → 기준−1(20%), 그 밖 → 기준−2(11%). 1보다 작으면 1. 저품질(Inferior) 아이템은 최대 4.
4. 스킬 고르기: 그 직업 첫 스킬 번호 + 5 × (티어−1) + 난수(0~4). 최대 6번 다시 뽑는다. 스킬의 `skills.txt` `itypea1`이 있으면 그 아이템 종류여야 하고, 이미 고른 스킬과 겹치면 안 된다(같은 티어는 겹칠 수 있다).
5. 스킬 포인트: 확장팩 저품질 아이템이 아니면 r = 보너스/2 + 난수(0~99), r ≥ 90 → +3, ≥ 60 → +2, 그 밖 +1. 보너스가 0이면 +3 10%, +2 30%, +1 60%. 확장팩 저품질은 항상 +1.

- 아이템 레벨별 기준 티어와 스킬 티어 비율(위 2·3번 계산값, 반올림). 37 이상 줄은 확장팩 아이템만(클래식 아이템은 25 이상 줄과 같다):

| 아이템 레벨 | 1 티어 | 2 티어 | 3 티어 | 4 티어 | 5 티어 | 6 티어 |
|---|---|---|---|---|---|---|
| 0 ~ 11 | 80% | 20% |  |  |  |  |
| 12 ~ 18 | 30% | 50% | 20% |  |  |  |
| 19 ~ 24 | 10% | 20% | 50% | 20% |  |  |
| 25 ~ 36 |  | 10% | 20% | 50% | 20% |  |
| 37 ~ 99 |  |  | 10% | 20% | 50% | 20% |

- 스킬마다의 아이템 종류 제한(`skills.txt` `itypea1`) 예: 바바리안 전투 기술은 `mele`(근접 무기 전용)라 헬름에 안 붙는다(Leap은 제한 없음). 포이즌 대거는 `knif`(단검 전용)라 완드에 안 붙는다. 스마이트·홀리 실드는 `shld`(방패 전용)라 셉터에 안 붙는다.

## 아이템 레벨별 소켓 수

- 계산(D2MOO `ITEMS_GetMaxSockets`): 아이템 레벨 1~25 → `itemtypes.txt` `MaxSock1`, 26~40 → `MaxSock25`, 41 이상 → `MaxSock40`. 그 값과 `weapons.txt`·`armor.txt` `gemsockets` 중 작은 값. 큐브 소켓 뚫기와 라주크 퀘스트가 이 값을 쓴다.
- 아래 표는 이 계산값과 칸마다 같다. 이름은 게임 화면 이름이라 데이터 `name`과 다른 것이 있다: Espandon = `Espadon`, Mithril Point = `Mithral Point`, Kurast Shield = `Ancient Shield`(코드 `pad`, 같은 이름의 `xts`와 다름).

| 이름 | 1~25 | 26~40 | 41+ |
|---|---|---|---|
| Aegis | 3 | 3 | 4 |
| Aerin Shield | 3 | 4 | 4 |
| Akaran Rondache | 3 | 4 | 4 |
| Akaran Targe | 3 | 4 | 4 |
| Alpha Helm | 2 | 3 | 3 |
| Ancient Armor | 3 | 4 | 4 |
| Ancient Axe | 4 | 5 | 6 |
| Ancient Shield | 3 | 3 | 3 |
| Ancient Sword | 3 | 3 | 3 |
| Antlers | 2 | 3 | 3 |
| Arbalest | 3 | 3 | 3 |
| Archon Plate | 3 | 4 | 4 |
| Archon Staff | 5 | 6 | 6 |
| Armet | 2 | 2 | 2 |
| Ashwood Bow | 3 | 4 | 5 |
| Assault Helmet | 2 | 3 | 3 |
| Ataghan | 2 | 2 | 2 |
| Avenger Guard | 2 | 3 | 3 |
| Axe | 4 | 4 | 4 |
| Balista | 3 | 4 | 6 |
| Balrog Blade | 3 | 4 | 4 |
| Balrog Skin | 3 | 4 | 4 |
| Barbed Club | 3 | 3 | 3 |
| Barbed Shield | 2 | 2 | 2 |
| Bardiche | 3 | 3 | 3 |
| Basinet | 2 | 2 | 2 |
| Bastard Sword | 3 | 4 | 4 |
| Battle Axe | 4 | 5 | 5 |
| Battle Cestus | 2 | 2 | 2 |
| Battle Hammer | 3 | 4 | 4 |
| Battle Scythe | 3 | 4 | 5 |
| Battle Staff | 4 | 4 | 4 |
| Battle Sword | 3 | 4 | 4 |
| Bearded Axe | 4 | 5 | 5 |
| Bec-de-Corbin | 3 | 4 | 6 |
| Berserker Axe | 4 | 5 | 6 |
| Bill | 3 | 4 | 4 |
| Blade | 2 | 2 | 2 |
| Blade Barrier | 3 | 3 | 3 |
| Blade Bow | 3 | 4 | 4 |
| Blade Talons | 2 | 3 | 3 |
| Blood Spirt | 2 | 3 | 3 |
| Bloodlord Skull | 2 | 2 | 2 |
| Bone Helm | 2 | 2 | 2 |
| Bone Knife | 1 | 1 | 1 |
| Bone Shield | 2 | 2 | 2 |
| Bone Visage | 2 | 2 | 3 |
| Bone Wand | 2 | 2 | 2 |
| Boneweave | 3 | 4 | 4 |
| Brandistock | 3 | 4 | 5 |
| Breast Plate | 3 | 3 | 3 |
| Broad Axe | 4 | 5 | 5 |
| Broad Sword | 3 | 4 | 4 |
| Buckler | 1 | 1 | 1 |
| Burnt Wand | 1 | 1 | 1 |
| Caduceus | 3 | 5 | 5 |
| Cantor Trophy | 2 | 2 | 2 |
| Cap/hat | 2 | 2 | 2 |
| Carnage Helm | 2 | 3 | 3 |
| Casque | 2 | 2 | 2 |
| Cedar Bow | 3 | 4 | 5 |
| Cedar Staff | 4 | 4 | 4 |
| Ceremonial Bow | 3 | 4 | 5 |
| Ceremonial Pike | 3 | 4 | 6 |
| Ceremonial Spear | 3 | 4 | 6 |
| Cestus | 2 | 2 | 2 |
| Chain Mail | 2 | 2 | 2 |
| Champion Axe | 4 | 5 | 6 |
| Champion Sword | 3 | 4 | 4 |
| Chaos Armor | 3 | 4 | 4 |
| Chu-Ko-Nu | 3 | 4 | 5 |
| Cinquedeas | 2 | 3 | 3 |
| Circlet | 1 | 2 | 2 |
| Clasped Orb | 2 | 3 | 3 |
| Claws | 2 | 3 | 3 |
| Claymore | 3 | 4 | 4 |
| Cleaver | 4 | 4 | 4 |
| Cloudy Sphere | 2 | 3 | 3 |
| Club | 2 | 2 | 2 |
| Colossal Sword | 3 | 4 | 5 |
| Colossus Blade | 3 | 4 | 6 |
| Colossus Crossbow | 3 | 4 | 6 |
| Colossus Voulge | 3 | 4 | 4 |
| Composite Bow | 3 | 4 | 4 |
| Conquerer Crown | 2 | 3 | 3 |
| Conquest Sword | 3 | 4 | 4 |
| Corona | 2 | 2 | 3 |
| Coronet | 1 | 2 | 2 |
| Crossbow | 3 | 4 | 4 |
| Crowbill | 4 | 5 | 6 |
| Crown | 2 | 2 | 3 |
| Crown Shield | 3 | 4 | 4 |
| Crusader Bow | 3 | 4 | 6 |
| Cryptic Axe | 3 | 4 | 5 |
| Cryptic Sword | 3 | 4 | 4 |
| Crystal Sword | 3 | 4 | 6 |
| Crystalline Globe | 2 | 3 | 3 |
| Cudgel | 2 | 2 | 2 |
| Cuirass | 3 | 3 | 3 |
| Cutlass | 2 | 2 | 2 |
| Dacian Falx | 3 | 4 | 4 |
| Dagger | 1 | 1 | 1 |
| Death Mask | 2 | 2 | 3 |
| Decapitator | 4 | 5 | 5 |
| Defender | 1 | 1 | 1 |
| Demon Crossbow | 3 | 4 | 5 |
| Demon Head | 2 | 2 | 2 |
| Demon Heart | 2 | 3 | 3 |
| Demonhead | 2 | 2 | 3 |
| Demonhide Armor | 2 | 2 | 2 |
| Destroyer Helm | 2 | 3 | 3 |
| Devil Star | 3 | 3 | 3 |
| Diadem | 1 | 2 | 3 |
| Diamond Bow | 3 | 4 | 5 |
| Diamond Mail | 3 | 4 | 4 |
| Dimensional Blade | 3 | 4 | 6 |
| Dimensional Shard | 2 | 3 | 3 |
| Dirk | 1 | 1 | 1 |
| Divine Scepter | 3 | 5 | 5 |
| Double Axe | 4 | 5 | 5 |
| Double Bow | 3 | 4 | 4 |
| Dragon Shield | 3 | 3 | 3 |
| Dragon Stone | 2 | 3 | 3 |
| Dream Spirit | 2 | 3 | 3 |
| Dusk Shroud | 3 | 4 | 4 |
| Eagle Orb | 2 | 3 | 3 |
| Earth Spirit | 2 | 3 | 3 |
| Edge Bow | 3 | 3 | 3 |
| Elder Staff | 4 | 4 | 4 |
| Eldritch Orb | 2 | 3 | 3 |
| Elegant Blade | 2 | 2 | 2 |
| Embossed Plate | 3 | 4 | 4 |
| Espandon | 3 | 3 | 3 |
| Ettin Axe | 4 | 5 | 5 |
| Executioner Sword | 3 | 4 | 6 |
| Falcata | 2 | 2 | 2 |
| Falchion | 2 | 2 | 2 |
| Falcon Mask | 2 | 3 | 3 |
| Fanged Helm | 2 | 3 | 3 |
| Fanged Knife | 2 | 3 | 3 |
| Fascia | 2 | 2 | 2 |
| Feral Axe | 4 | 4 | 4 |
| Feral Claws | 2 | 3 | 3 |
| Fetish Trophy | 2 | 2 | 2 |
| Field Plate | 2 | 2 | 2 |
| Flail | 3 | 4 | 5 |
| Flamberge | 3 | 4 | 5 |
| Flanged Mace | 2 | 2 | 2 |
| Full Helm | 2 | 2 | 2 |
| Full Plate Mail | 3 | 4 | 4 |
| Fury Visor | 2 | 3 | 3 |
| Fuscina | 3 | 4 | 4 |
| Gargoyle Head | 2 | 2 | 2 |
| Ghost Armor | 2 | 2 | 2 |
| Ghost Spear | 3 | 4 | 6 |
| Ghost Wand | 2 | 2 | 2 |
| Giant Axe | 4 | 5 | 6 |
| Giant Conch | 2 | 2 | 2 |
| Giant Sword | 3 | 4 | 4 |
| Giant Thresher | 3 | 4 | 6 |
| Gladius | 2 | 2 | 2 |
| Glorious Axe | 4 | 5 | 6 |
| Glowing Orb | 2 | 3 | 3 |
| Gnarled Staff | 4 | 4 | 4 |
| Gorgon Crossbow | 3 | 4 | 4 |
| Gothic Axe | 4 | 5 | 6 |
| Gothic Bow | 3 | 4 | 6 |
| Gothic Plate | 3 | 4 | 4 |
| Gothic Shield | 3 | 3 | 3 |
| Gothic Staff | 4 | 4 | 4 |
| Gothic Sword | 3 | 4 | 4 |
| Grand Crown | 2 | 2 | 3 |
| Grand Matron Bow | 3 | 4 | 5 |
| Grand Scepter | 3 | 3 | 3 |
| Grave Wand | 2 | 2 | 2 |
| Great Axe | 4 | 5 | 6 |
| Great Bow | 3 | 4 | 4 |
| Great Hauberk | 3 | 4 | 4 |
| Great Helm | 2 | 2 | 3 |
| Great Maul | 3 | 4 | 6 |
| Great Poleaxe | 3 | 4 | 6 |
| Great Sword | 3 | 4 | 6 |
| Greater Claws | 2 | 3 | 3 |
| Greater Talons | 2 | 3 | 3 |
| Griffon Headress | 2 | 3 | 3 |
| Grim Helm | 2 | 2 | 2 |
| Grim Scythe | 3 | 4 | 6 |
| Grim Shield | 2 | 2 | 2 |
| Grim Wand | 2 | 2 | 2 |
| Guardian Crown | 2 | 3 | 3 |
| Guilded Shield | 3 | 4 | 4 |
| Halberd | 3 | 4 | 6 |
| Hand Axe | 2 | 2 | 2 |
| Hand Scythe | 2 | 2 | 2 |
| Hard Leather Armor | 2 | 2 | 2 |
| Hatchet | 2 | 2 | 2 |
| Hatchet Hands | 2 | 2 | 2 |
| Hawk Helm | 2 | 3 | 3 |
| Heater | 2 | 2 | 2 |
| Heavenly Stone | 2 | 3 | 3 |
| Heavy Crossbow | 3 | 4 | 6 |
| Heirophant Trophy | 2 | 2 | 2 |
| Hellforge Hammer | 3 | 4 | 5 |
| Hellforged Plate | 3 | 4 | 4 |
| Hellspawn Skull | 2 | 2 | 2 |
| Helm | 2 | 2 | 2 |
| Heraldic Shield | 3 | 4 | 4 |
| Highland Blade | 3 | 4 | 4 |
| Holy Water Sprinkler | 3 | 3 | 3 |
| Horned Helm | 2 | 3 | 3 |
| Hunter's Bow | 3 | 4 | 4 |
| Hunter's Guise | 2 | 3 | 3 |
| Hydra Bow | 3 | 4 | 6 |
| Hydra Edge | 2 | 2 | 2 |
| Hydraskull | 2 | 2 | 2 |
| Hyperion | 3 | 3 | 3 |
| Hyperion Spear | 3 | 3 | 3 |
| Jagged Star | 3 | 3 | 3 |
| Jawbone Cap | 2 | 3 | 3 |
| Jawbone Visor | 2 | 3 | 3 |
| Jo Staff | 2 | 2 | 2 |
| Katar | 2 | 2 | 2 |
| KhalimFlail | 3 | 3 | 3 |
| Kite Shield | 3 | 3 | 3 |
| Knout | 3 | 4 | 5 |
| Kraken Shell | 3 | 4 | 4 |
| Kriss | 2 | 3 | 3 |
| Kurast Shield | 3 | 4 | 4 |
| Lacquered Plate | 3 | 4 | 4 |
| Lance | 3 | 4 | 6 |
| Large Axe | 4 | 4 | 4 |
| Large Shield | 3 | 3 | 3 |
| Leather Armor | 2 | 2 | 2 |
| Legend Spike | 2 | 2 | 2 |
| Legend Sword | 3 | 3 | 3 |
| Legendary Mallet | 3 | 4 | 4 |
| Lich Wand | 2 | 2 | 2 |
| Light Crossbow | 3 | 3 | 3 |
| Light Plate | 3 | 3 | 3 |
| Linked Mail | 3 | 3 | 3 |
| Lion Helm | 2 | 3 | 3 |
| Lochaber Axe | 3 | 3 | 3 |
| Long Battle Bow | 3 | 4 | 6 |
| Long Bow | 3 | 4 | 5 |
| Long Siege Bow | 3 | 4 | 6 |
| Long Staff | 3 | 3 | 3 |
| Long Sword | 3 | 4 | 4 |
| Long War Bow | 3 | 4 | 6 |
| Loricated Mail | 3 | 4 | 4 |
| Luna | 2 | 2 | 2 |
| Mace | 2 | 2 | 2 |
| Mage Plate | 3 | 3 | 3 |
| Maiden Pike | 3 | 4 | 6 |
| Maiden Spear | 3 | 4 | 6 |
| Mancatcher | 3 | 4 | 5 |
| Martel de Fer | 3 | 4 | 6 |
| Mask | 2 | 2 | 3 |
| Matriarchal Bow | 3 | 4 | 5 |
| Matriarchal Pike | 3 | 4 | 6 |
| Matriarchal Spear | 3 | 4 | 6 |
| Maul | 3 | 4 | 6 |
| Mesh Armor | 3 | 3 | 3 |
| Mighty Scepter | 2 | 2 | 2 |
| Military Axe | 4 | 4 | 4 |
| Military Pick | 4 | 5 | 6 |
| Minion Skull | 2 | 2 | 2 |
| Mithril Point | 1 | 1 | 1 |
| Monarch | 3 | 3 | 4 |
| Morning Star | 3 | 3 | 3 |
| Mummified Trophy | 2 | 2 | 2 |
| Mythical Sword | 3 | 3 | 3 |
| Naga | 4 | 5 | 6 |
| Ogre Axe | 3 | 3 | 3 |
| Ogre Maul | 3 | 4 | 6 |
| Ornate Armor | 3 | 4 | 4 |
| Overseer Skull | 2 | 2 | 2 |
| Partizan | 3 | 4 | 5 |
| Pavise | 3 | 3 | 3 |
| Pellet Bow | 3 | 3 | 3 |
| Petrified Wand | 2 | 2 | 2 |
| Phase Blade | 3 | 4 | 6 |
| Pike | 3 | 4 | 6 |
| Plate Mail | 2 | 2 | 2 |
| Poignard | 1 | 1 | 1 |
| Poleaxe | 3 | 4 | 5 |
| Polished Wand | 2 | 2 | 2 |
| Preserved Head | 2 | 2 | 2 |
| Protector Shield | 3 | 4 | 4 |
| Quarterstaff | 3 | 3 | 3 |
| Quhab | 2 | 3 | 3 |
| Quilted Armor | 2 | 2 | 2 |
| Rage Mask | 2 | 3 | 3 |
| Razor Bow | 3 | 4 | 4 |
| Reflex Bow | 3 | 4 | 5 |
| Reinforced Mace | 2 | 2 | 2 |
| Repeating Crossbow | 3 | 4 | 5 |
| Ring Mail | 3 | 3 | 3 |
| Rondache | 3 | 4 | 4 |
| Rondel | 1 | 1 | 1 |
| Round Shield | 2 | 2 | 2 |
| Royal Shield | 3 | 4 | 4 |
| Rune Bow | 3 | 4 | 5 |
| Rune Scepter | 2 | 2 | 2 |
| Rune Staff | 5 | 6 | 6 |
| Rune Sword | 3 | 4 | 4 |
| Runic Talons | 2 | 3 | 3 |
| Russet Armor | 3 | 3 | 3 |
| Saber | 2 | 2 | 2 |
| Sacred Armor | 3 | 4 | 4 |
| Sacred Feathers | 2 | 3 | 3 |
| Sacred Globe | 2 | 3 | 3 |
| Sacred Rondache | 3 | 4 | 4 |
| Sacred Targe | 3 | 4 | 4 |
| Sallet | 2 | 2 | 2 |
| Savage Helmet | 2 | 3 | 3 |
| Scale Mail | 2 | 2 | 2 |
| Scarab Husk | 3 | 4 | 4 |
| Scepter | 2 | 2 | 2 |
| Scimitar | 2 | 2 | 2 |
| Scissors Katar | 2 | 3 | 3 |
| Scissors Quhab | 2 | 3 | 3 |
| Scissors Suwayyah | 2 | 3 | 3 |
| Scourge | 3 | 4 | 5 |
| Scutum | 3 | 3 | 3 |
| Scythe | 3 | 4 | 5 |
| Seraph Rod | 3 | 3 | 3 |
| Serpentskin Armor | 2 | 2 | 2 |
| Sexton Trophy | 2 | 2 | 2 |
| Shadow Bow | 3 | 4 | 5 |
| Shadow Plate | 3 | 4 | 4 |
| Shako | 2 | 2 | 2 |
| Shamshir | 2 | 2 | 2 |
| Sharktooth Armor | 3 | 3 | 3 |
| Shillelah | 4 | 4 | 4 |
| Short Battle Bow | 3 | 4 | 5 |
| Short Bow | 3 | 3 | 3 |
| Short Siege Bow | 3 | 4 | 5 |
| Short Staff | 2 | 2 | 2 |
| Short Sword | 2 | 2 | 2 |
| Short War Bow | 3 | 4 | 5 |
| Siege Crossbow | 3 | 4 | 4 |
| Silver Edged Axe | 4 | 5 | 5 |
| Skull Cap | 2 | 2 | 2 |
| Sky Spirit | 2 | 3 | 3 |
| Slayer Guard | 2 | 3 | 3 |
| Small Crescent | 4 | 4 | 4 |
| Small Shield | 2 | 2 | 2 |
| Smoked Sphere | 2 | 3 | 3 |
| Sparkling Ball | 2 | 3 | 3 |
| Spear | 3 | 3 | 3 |
| Spetum | 3 | 4 | 6 |
| Spider Bow | 3 | 3 | 3 |
| Spiked Club | 2 | 2 | 2 |
| Spiked Shield | 2 | 2 | 2 |
| Spired Helm | 2 | 2 | 3 |
| Spirit Mask | 2 | 3 | 3 |
| Splint Mail | 2 | 2 | 2 |
| Stag Bow | 3 | 4 | 5 |
| Stalagmite | 3 | 3 | 3 |
| Stilleto | 2 | 2 | 2 |
| Studded Leather | 2 | 2 | 2 |
| Stygian Pike | 3 | 4 | 4 |
| Succubae Skull | 2 | 2 | 2 |
| Sun Spirit | 2 | 3 | 3 |
| SuperKhalimFlail | 3 | 3 | 3 |
| Suwayyah | 2 | 3 | 3 |
| Swirling Crystal | 2 | 3 | 3 |
| Tabar | 4 | 5 | 5 |
| Targe | 3 | 4 | 4 |
| Templar Coat | 3 | 3 | 3 |
| Thresher | 3 | 4 | 5 |
| Thunder Maul | 3 | 4 | 6 |
| Tiara | 1 | 2 | 3 |
| Tigulated Mail | 3 | 3 | 3 |
| Tomahawk | 2 | 2 | 2 |
| Tomb Wand | 2 | 2 | 2 |
| Totemic Mask | 2 | 3 | 3 |
| Tower Shield | 3 | 3 | 3 |
| Trellised Armor | 2 | 2 | 2 |
| Trident | 3 | 4 | 4 |
| Troll Nest | 3 | 3 | 3 |
| Truncheon | 2 | 2 | 2 |
| Tulwar | 2 | 2 | 2 |
| Tusk Sword | 3 | 4 | 4 |
| Twin Axe | 4 | 5 | 5 |
| Two-Handed Sword | 3 | 3 | 3 |
| Tyrant Club | 3 | 3 | 3 |
| Unearthed Wand | 2 | 2 | 2 |
| Unraveller Head | 2 | 2 | 2 |
| Vortex Orb | 2 | 3 | 3 |
| Vortex Shield | 3 | 4 | 4 |
| Voulge | 3 | 4 | 4 |
| Walking Stick | 2 | 2 | 2 |
| Wand | 1 | 1 | 1 |
| War Axe | 4 | 5 | 6 |
| War Club | 3 | 4 | 6 |
| War Fist | 2 | 2 | 2 |
| War Fork | 3 | 4 | 5 |
| War Hammer | 3 | 4 | 4 |
| War Hat | 2 | 2 | 2 |
| War Pike | 3 | 4 | 6 |
| War Scepter | 3 | 5 | 5 |
| War Scythe | 3 | 4 | 6 |
| War Spear | 3 | 3 | 3 |
| War Spike | 4 | 5 | 6 |
| War Staff | 5 | 6 | 6 |
| War Sword | 3 | 3 | 3 |
| Ward | 3 | 3 | 4 |
| Ward Bow | 3 | 4 | 5 |
| Winged Helm | 2 | 2 | 3 |
| Wire Fleece | 3 | 4 | 4 |
| Wirt's Leg | 3 | 3 | 3 |
| Wolf Head | 2 | 3 | 3 |
| Wrist Blade | 2 | 2 | 2 |
| Wrist Spike | 2 | 2 | 2 |
| Wrist Sword | 2 | 3 | 3 |
| Wyrmhide | 3 | 4 | 4 |
| Yari | 3 | 4 | 6 |
| Yew Wand | 1 | 1 | 1 |
| Zakarum Shield | 3 | 4 | 4 |
| Zombie Head | 2 | 2 | 2 |
| Zweihander | 3 | 4 | 5 |

## 에테리얼

- 기본 방어력·요구 레벨·요구 힘·내구·소켓은 `armor.txt`(`minac`·`maxac`·`levelreq`·`reqstr`·`durability`·`gemsockets`).
- 에테리얼: 방어력·데미지 = 기본 × 1.5(내림), 요구 힘·민첩 −10(`breakpoints.md` 용병 표의 에테리얼 값이 이 규칙으로 `weapons.txt`와 같다).
- 그 밖의 에테리얼 규칙(증가% 순서, 내구, 붙지 않는 아이템, 큐브 소켓 버그 등)은 미검증(`next_steps.md`).

## 겜블 아이템 레벨 (D2MOO)

- D2MOO `SUnitNpc.cpp`의 겜블 목록 만드는 함수.
- 겜블 아이템 레벨 = 캐릭터 레벨 + 난수(0~9) − 5 → **캐릭터 레벨 −5 ~ +4**. 5보다 작으면 5, 99보다 크면 99.
- 품질: 난수(0~99999) < `difficultylevels.txt` `GambleUniq`+`GambleSet`+`GambleRare` 이면 그 안에서 유니크/세트/레어, 그 밖은 매직.
- 확장팩: 익셉셔널 확률 = `GambleUber` × (아이템 레벨 − 익셉셔널 기본 아이템 레벨) + 1 (/10000), 실패하면 엘리트 `GambleUltra`로 같은 식.
- 그래서 아이템 레벨 90 이상은 캐릭터 레벨 86부터 나올 수 있고, 캐릭터 레벨 95 이상이면 겜블한 모든 아이템이 90 이상이다.

## 매직 접사 레벨 (D2MOO)

- D2MOO `ItemsMagic.cpp`.
- **접사 레벨**(`ITEMS_ComputeCraftedMagicAffixLevel`). ilvl = 아이템 레벨, qlvl = 베이스 기본 레벨(`weapons.txt`·`armor.txt`·`misc.txt` `level`).
  - 먼저 ilvl = max(ilvl, qlvl)로 맞춘다.
  - `magic lvl`이 있으면 접사 레벨 = ilvl + `magic lvl`이다.
  - 아니면 ilvl < 99 − qlvl/2 일 때 접사 레벨 = ilvl − qlvl/2, 그 밖에는 2 × ilvl − 99이다.
  - 결과를 1~99로 맞춘다.
- **접사 후보 조건**(`ITEMS_RollMagicAffixesNew`)
  - 확장팩 아이템이 아니면 `version` 100 접사는 빠진다.
  - 접사 `level` ≤ 접사 레벨이어야 하고, `maxlevel`이 있으면 접사 레벨 ≤ `maxlevel`이어야 한다.
  - 레어·크래프트 아이템에는 `rare`가 빈 접사(매직 전용)가 붙지 않는다.
  - 직업 전용 접사(`classspecific`)는 다른 직업의 직업 전용 아이템에는 붙지 않는다. 직업 전용이 아닌 아이템에는 `itype`이 맞으면 붙을 수 있다(`ITEMMODS_AffixPlayerClassisCompatible`).
  - 같은 `group`의 접사가 이미 있으면 그 그룹은 빠진다.
- 매직 무기 소켓 큐브 조합식의 결과 레벨은 `cubing.md` "매직 무기 소켓".

### Fool's

- 데이터: `magicprefix.txt` `Name`=`Trump`(문자열 번호 20734, `LocaleStringID.js`). 영문 표시 이름 Fool's는 일반 지식이다.
- 접두. 옵션 `dmg/lvl`(param 4) + `att/lvl`(param 33). `level` 50, `levelreq` 37, `frequency` 7, `group` 111, `version` 100(확장팩), `spawnable`·`rare` 1. `itype` `weap`, `etype` `staf`·`wand`·`orb`(지팡이·완드·오브 제외).
- 같은 계열인 Knave's·Jack's·Jester's·Joker's는 `spawnable`이 비어 있어 생성되지 않는다.

## 참 접사 공식

- 참 접사별 수치·접사 레벨: `magicprefix.txt`·`magicsuffix.txt`(`itype`이 `scha`·`mcha`·`lcha` = 스몰·라지·그랜드, `spawnable`=1)의 `level`·`mod1min`·`mod1max`.
- 참의 기본 아이템 레벨(qlvl): 스몰 28, 라지 14, 그랜드 1(`misc.txt` `level` = `cm1`·`cm2`·`cm3`).
- 접사 레벨 식은 위 "매직 접사 레벨". 참은 `magic lvl`이 없다.
- 높은 접사와 필요한 아이템 레벨(접사 레벨은 데이터, 필요 레벨은 "매직 접사 레벨" 식으로 계산):

| 참 | 접사 | 접사 레벨 | 필요 아이템 레벨 |
|---|---|---|---|
| 스몰 | Pestilent: 175 독 데미지 / 6초 | 88 | 94 (디아블로 94) |
| 스몰 | Flaming: 불 10~19 / 20~29 | 89 | 94 |
| 스몰 | Shocking: 번개 1 / 44~71 | 90 | 95 (니라탁 95, 바알 99) |
| 스몰 | Red: 최소 데미지 +1 | 90 | 95 |
| 스몰 | Hibernal: 냉기 8~10 / 15~20 | 91 | 95 |
| 그랜드 | of Vita: 라이프 41~45 | 91 | 91 |

## 매직 찬스

- 룬은 매직 찬스의 영향을 받지 않는다(사용자 확인).
- **몬스터별 최소 등급**(TC 품질 계수 1024, `treasureclassex.txt`): 챔피언·유니크·슈퍼유니크·보스 = 매직 이상, 액트 보스 퀘스트 TC = 레어 이상, 그리스월드·스미스 = 하한 없음. 일반 몬스터는 하한 없음. 품질 계수의 뜻은 `tc.md` 1-1절.
- 실효 매직 찬스 식, 등급 결정 순서, 강등 규칙은 미검증(`next_steps.md`).

## 우버 디아블로·헬파이어 토치

- 애니힐러스(`uniqueitems.txt`): 스몰 참, 모든 스킬 +1, 모든 능력치 +10~20, 모든 저항 +10~20, 경험치 +5~10%.
- 열쇠: 헬 카운테스 → 공포의 열쇠(`pk1`), 헬 소환술사 → 증오의 열쇠(`pk2`), 헬 니라탁 → 파괴의 열쇠(`pk3`). 열쇠는 헬 TC에만 있다.
- 열쇠 확률(데이터 계산, 혼자일 때 처치 1회에 하나 이상): 카운테스 약 7.1%, 소환술사 약 8.6%, 니라탁 약 7.9%. 그 TC를 5번 뽑고(`Picks` 5) 열쇠 비율이 1 / 합계(카운테스 68, 소환술사 56, 니라탁 61)라서다. 인원이 늘면 `NoDrop`이 줄어 오른다(`tc.md` 5절).
- 장기(데이터, 100%): 릴리스(`Uber Andariel` TC) → 디아블로의 뿔(`dhn`), 우버 듀리엘 → 바알의 눈(`bey`), 우버 이주얼 → 메피스토의 뇌(`mbr`).
- 열쇠 3종 큐브 → 판데모니움 포탈, 장기 3종 큐브 → 우버 트리스트럼(지역 136) 포탈(`cubemain.txt`, `cubing.md` 머리말).
- 헬파이어 토치(`uniqueitems.txt`): 라지 참, 무작위 직업 하나의 스킬 +3, 모든 능력치 +10~20, 모든 저항 +10~20, 시야 +8, 타격 시 5% 확률로 레벨 10 파이어스톰, 레벨 30 히드라(10 충전).
- 우버 디아블로가 나오는 조건(조던 판매)과 나오는 곳, 토치를 떨구는 몬스터, 한 캐릭터에 1개 제한 등은 미검증(`next_steps.md`).
