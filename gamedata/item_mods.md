# 아이템 생성 규칙 (auto mod, staff mod, 소켓, 에테리얼, 겜블, 참 접사, 매직 찬스, 우버·횃불)

아이템 종류에 따라 자동으로 붙는 옵션(auto mod)과 직업 스킬 옵션(staff mod), 아이템 레벨별 소켓 수, 에테리얼 규칙과 방어력 계산식, 겜블 아이템 레벨, 참 접사 공식 (261104), 매직 찬스, 우버 디아블로·헬파이어 토치 (261105).

- 이름 주의: 여기서 mod는 아이템 옵션(modifier)이다. 코드의 `unit.mode`(유닛 동작 상태, `ids.md`)와 다른 말이다.
- kolbot 사용처: nip 규칙의 스킬·저항·소켓 조건(`nips/*.nip`), `Pickit`, `Cubing`(소켓 뚫기), `Runewords`

## auto mod

- 출처: mpqdata `automagic.txt`(1.14d). 대상 아이템은 `weapons.txt`·`armor.txt`의 `auto prefix` 열(= `group`). 효과는 게임 표시로 바꿔 적었다(독: 내부 값 × 길이 / 256, 반올림, 길이 / 25 = 초). 그룹(`group`)과 아이템: 300 아마존 활, 302 아마존 창·재블린, 303 소서리스 오브(라이프·마나), 304 팔라딘 방패(모든 저항 / 공격 등급+증뎀), 305 네크로맨서 머리(독 데미지). `weapons.txt`·`armor.txt`의 `auto prefix` 열이 그 아이템의 그룹이다.
- 대조(261104):
  - Fandom "Auto Mod" 표(https://diablo.fandom.com/wiki/Auto_Mod, 위키 API로 가져옴)는 `automagic.txt` 36줄과 이름·레벨·빈도·수치가 모두 같다.
  - 그룹 301(아마존 패시브·매직 스킬)은 `automagic.txt`에 있지만 `auto prefix`가 301인 아이템이 0개라 실제로 붙지 않는다. Fandom 표에도 없다.
  - `rare` 열이 빈 줄(레어에 안 붙음): Archer's, Lancer's, of the Colossus, Great Wyrm's, Chromatic, of Anthrax. Fandom의 "cannot spawn on rare"와 같다.
  - 팔라딘 방패 Sharp~Knight's는 `rare`=1이다. Knight's(공격 등급 101~121, 증뎀 51~65%)는 레어에도 붙는다. 인벤 글의 "51~65증댐/101~121어레는 레어에 안 붙는다"는 `automagic.txt`와 다르다(아래 인벤 글 요약).

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

- mpqdata `itemtypes.txt`의 `StaffMods` 열(261104):

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

- 인벤 글의 목록에는 망토(Cloak)가 없다.

### 굴림 (D2MOO 코드)

- 출처: D2MOO(1.10f 소스 재구성) `source/D2Game/src/ITEMS/Items.cpp`의 `sub_6FC52410`·`sub_6FC52650`(D2Game.0x6FC52650). 근거: D2MOO 코드. 1.14d에서 바뀌지 않았다는 것은 사용자 판단(261104).
- `sub_6FC52410`은 아이템 형식(`ITEMS_GetItemFormat`)이 0이 아닐 때 `sub_6FC52650`을 부르고, 0이면 `sub_6FC55060`을 부른다(`sub_6FC55060`은 읽지 않았다).
- "드롭 레벨 보너스" = 찰시 임뷰(`SUnitNpc.cpp`, `ITEMDROPFLAG_STAFFMODUSEILVL`)일 때만 아이템 레벨, 그 밖은 0.

1. 스킬 개수: r = 드롭 레벨 보너스 + 난수(0~99). r > 90 → 3개, r > 70 → 2개, r > 30 또는 보너스 있음 → 1개, 그 밖 → 0개. 보너스가 0이면 3개 9%, 2개 20%, 1개 40%, 0개 31%.
2. 기준 티어: 아이템 레벨 > 36이고 확장팩 아이템(형식 ≥ 100) → 5, > 24 → 4, > 18 → 3, > 11 → 2, 그 밖 → 1.
3. 스킬마다 티어: 난수(0~99) > 80 → 기준+1(19%), > 30 → 기준(50%), > 10 → 기준−1(20%), 그 밖 → 기준−2(11%). 1보다 작으면 1. 저품질(Inferior) 아이템은 최대 4.
4. 스킬 고르기: 그 직업 첫 스킬 번호 + 5 × (티어−1) + 난수(0~4). 최대 6번 다시 뽑는다. 스킬의 `skills.txt` `itypea1`이 있으면 그 아이템 종류여야 하고, 이미 고른 스킬과 겹치면 안 된다(같은 티어는 겹칠 수 있다).
5. 스킬 포인트: 확장팩 저품질 아이템이 아니면 r = 보너스/2 + 난수(0~99), r ≥ 90 → +3, ≥ 60 → +2, 그 밖 +1. 보너스가 0이면 +3 10%, +2 30%, +1 60%. 확장팩 저품질은 항상 +1.

- 인벤 표(아래)와 대조: 3번 식으로 계산한 기준 티어별 비율(예: 레벨 0~11은 1티어 81%·2티어 19%)을 반올림하면 인벤 표의 5줄 모두와 같다. D2MOO에서 37 이상 줄은 확장팩 아이템만 해당한다(클래식 아이템은 25 이상과 같다).

### 인벤 글 요약

- 출처: 인벤 "아이템의 오토모드와 스태프모드에 관한 정보"(https://www.inven.co.kr/board/diablo2/5734/5298), 2022-06-01, 레저렉션 인벤 팁 게시판. 근거: 웹 미검증. 오토모드·스태프모드 규칙은 클래식과 같다는 것은 사용자 판단, 위 D2MOO·mpqdata 대조로 맞는 곳과 다른 곳을 적었다(261104).
- 원문 전문은 지웠다(git 기록 `6e15969`의 이 파일). 주장마다 위 D2MOO 굴림·mpqdata와 대조한 결과(261105):

| 원문 주장 | 판정 |
|---|---|
| 스태프 모드는 한 아이템에 0~3개, 노멀·매직·레어 모두 붙는다 | 맞음: 굴림 1번 |
| 6티어가 붙으면 1·2티어는 같이 못 붙고, 5티어면 1티어는 못 붙는다 | 맞음: 굴림 3번(스킬 티어 = 기준 −2 ~ +1, 기준 최대 5) |
| 티어 = 그 스킬을 배울 수 있는 레벨(1·6·12·18·24·30) | 원문 그대로(미대조) |
| 바바리안 헬름에 전투 기술이 붙지 않는다 | 대부분 맞음: 전투 기술은 `skills.txt` `itypea1` = `mele`(근접 무기 전용)라 헬름에 안 붙는다. 단 Leap은 제한이 없다 |
| 완드에 포이즌 대거가 붙지 않는다 | 맞음: `itypea1` = `knif`(단검 전용) |
| 셉터에 스마이트가 붙지 않는다 | 맞음: `itypea1` = `shld`(방패 전용). 홀리 실드도 같다 |
| 같은 기술 탭의 스킬 3개가 다 붙지는 않는다(오브 제외) | 근거 없음: 굴림에 탭을 보는 조건이 없다(D2MOO 1.10f, 1.14d 미확인) |
| 최상급 오토 모드는 레어에 붙지 않는다 | 일부만 맞음: 레어에 안 붙는 것은 auto mod 표의 `rare` X 6줄. 팔라딘 방패 Knight's(51~65 증뎀·101~121 AR)는 레어에도 붙는다 |

- 아이템 레벨별 스태프 모드 티어 확률(원문 그림, 굴림 3번 계산값을 반올림한 것과 5줄 모두 같음):

| 아이템 레벨 | 1 티어 | 2 티어 | 3 티어 | 4 티어 | 5 티어 | 6 티어 |
|---|---|---|---|---|---|---|
| 0 ~ 11 | 80% | 20% |  |  |  |  |
| 12 ~ 18 | 30% | 50% | 20% |  |  |  |
| 19 ~ 24 | 10% | 20% | 50% | 20% |  |  |
| 25 ~ 36 |  | 10% | 20% | 50% | 20% |  |
| 37 ~ 99 |  |  | 10% | 20% | 50% | 20% |

## 아이템 레벨별 소켓 수

- 계산(D2MOO `ITEMS_GetMaxSockets`): 아이템 레벨 1~25 → `itemtypes.txt` `MaxSock1`, 26~40 → `MaxSock25`, 41 이상 → `MaxSock40`. 그 값과 `weapons.txt`·`armor.txt` `gemsockets` 중 작은 값. 큐브 소켓 뚫기와 라주크 퀘스트가 이 값을 쓴다.
- 표 출처: 카오스큐브 "라주크가 뚫어주는 아이템 소켓 정보"(글쓴이 올웨이즈, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941739) 그림 "라주크가 뚫어주는 소켓 개수 v2.0". 이름은 영문(원본 표기 그대로).
- 대조(261104): 422줄 1266칸을 위 계산값과 대조해 모두 같다. 원본 머리말의 구간 "A = ilvl 1-24, B = 25-39, C = 40+"는 D2MOO 코드(1~25 / 26~40 / 41+)와 다르다. 아래 표 머리는 D2MOO 구간으로 적었다. 같은 정보인 사용자 그림 `socket.png`(카오스큐브, 제작 무한의공갈, 구간 1~25 / 26~40 / 41+)는 칸 대조를 하지 않았다.
- `socket.png` 머리말(원문): "매직, 레어, 유니크, 세트, 크래프트등의 아이템은 적용되지 않습니다. / 투척하는 무기는 소켓이 뚫리지 않습니다. / 드랍되는 아이템의 소켓은 숨렙을 따라가나 노멀은 3개, 나이트는 4개의 제한이 있습니다."
- 이름은 게임 화면 이름(원본 그림 표기)이라 `weapons.txt`·`armor.txt` `name`과 다른 것이 있다: Espandon = `Espadon`, Mithril Point = `Mithral Point`, Kurast Shield = `Ancient Shield`(코드 `pad`, 같은 이름의 `xts`와 다름). 값은 코드로 맞춰 대조했다(261105).
- 라주크 퀘스트(카오스큐브 총정리 본문 원문): "노말(흰색) : 그 아이템의 최대 소켓 매직 : 1~2솟(랜덤) 레어, 유니크 : 1솟"

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

### 방어력 계산식

- 기본 방어력·요구 레벨·요구 힘·내구·소켓은 mpqdata `armor.txt`(`minac`·`maxac`·`levelreq`·`reqstr`·`durability`·`gemsockets`).
- 에테리얼: 방어력 = 기본 × 1.5(내림), 요구 힘·민첩 −10. 1.10부터 이 50%는 방어력 증가(%)보다 먼저 붙는다(아래 요약).
- 슈페리어(원본 식, 카오스큐브 늘비 도표): Defense = [(최고 방어도 + 1) × (100 + 방상%) / 100]. 슈페리어 에테리얼: Defense = [[(최고 방어도 + 1) × 3/2] × (100 + 방상%) / 100]. `[ ]`는 내림.
- 큐빙 소켓 버그(1.11·1.11b 이후, 원문 [10]): 에테리얼 갑옷·방패를 큐브로 소켓 뚫으면 50%가 한 번 더 붙는다(= 에테리얼 값 × 1.5, 내림).
- 사용자 자료 `갑옷 별 디펜.png`의 "인내" 줄 값은 모두 (큐빙 소켓 버그 값) × 3 + 15와 같았다(값에서 맞춘 식, 원본에 설명 없음, 261104 대조).

### 에테리얼 요약

- 출처: 카오스큐브 "에테리얼(무형)에 관한 고찰!"(글쓴이 penny♡, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/944029). 근거: 웹 미검증. 원문 전문은 지웠다(git 기록 `6e15969`의 이 파일, 261105).
- 확장팩 아이템에만 있다. 원문: 링·아뮬렛, 세트, 파괴 불가인 페이즈 블레이드, 활·석궁에는 없다(활·석궁은 옛 버전 기준 주장으로 보이며 미확인).
- 장점: 방어력·데미지 ×1.5(1.09부터 증가% 앞에 붙음, 위 계산식). 요구 힘·민첩 −10.
- 단점: 수리 불가, 내구 약 절반(원문 예: 50 → 27). 슈페리어 에테리얼은 슈페리어 내구 보너스 뒤에 줄어든다.
- 발견 시 내구는 꽉 차 있다. 수량 아이템(재블린 등)은 최대 수량이 아니다.
- 용병이 들면 내구가 닳지 않는다. 내구·수량 회복 옵션이나 파괴 불가(조드, 일부 룬워드)가 있으면 계속 쓸 수 있다.
- 룬워드·임뷰는 에테리얼이 유지되고, 크래프트하면 에테리얼이 사라진다.
- 상점에 팔면 값이 크게 떨어지고(원문: 약 75% 이상) 되살 수 없다.
- 큐브 소켓 버그(1.11 이후): 위 계산식 참고.

## 겜블 아이템 레벨

### 코드 (D2MOO)

- 출처: D2MOO(1.10f 소스 재구성) `source/D2Game/src/UNIT/SUnitNpc.cpp`의 겜블 목록 만드는 함수. 근거: D2MOO 코드(261104).
- 겜블 아이템 레벨 = 캐릭터 레벨 + 난수(0~9) − 5 → **캐릭터 레벨 −5 ~ +4**. 5보다 작으면 5, 99보다 크면 99.
- 품질: 난수(0~99999) < `difficultylevels.txt` `GambleUniq`+`GambleSet`+`GambleRare` 이면 그 안에서 유니크/세트/레어, 그 밖은 매직.
- 확장팩: 익셉셔널 확률 = `GambleUber` × (아이템 레벨 − 익셉셔널 기본 아이템 레벨) + 1 (/10000), 실패하면 엘리트 `GambleUltra`로 같은 식.

### 실험 글 요약 (제타_마크)

- 출처: 카오스큐브 "겜블/크레프트에 관한 케릭렙과 숨은렙의 진실"(글쓴이 제타_마크, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/942119). 근거: 웹 미검증. 원문 전문은 지웠다(261105).
- 실험: 91레벨 소서리스로 아뮬렛 98개를 겜블 → 아이템 레벨 86~95. 위 코드의 캐릭터 레벨 −5 ~ +4와 같다(블리자드가 밝힌 −3 ~ +6은 맞지 않는다).
- 결론: 아이템 레벨 90 이상(접두 90 등)은 캐릭터 레벨 86부터 나올 수 있고, 95 이상이면 겜블한 모든 아이템이 90 이상이다.

## 참 접사 공식

- 참 접사별 수치·접사 레벨: mpqdata `magicprefix.txt`·`magicsuffix.txt`(`itype`이 `scha`·`mcha`·`lcha` = 스몰·라지·그랜드, `spawnable`=1)의 `level`·`mod1min`·`mod1max`.
- 참의 기본 아이템 레벨(qlvl): 스몰 28, 라지 14, 그랜드 1(`misc.txt` `level` = `cm1`·`cm2`·`cm3`, 261105). 원문의 24·12·1은 틀려 지웠다.
- 접사 레벨(alvl) 식. 출처: 카오스큐브 "참 (부적) 아이템의 접미사 접두사 최대 수치 정보"(글쓴이 윈드포수, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/945293)가 인용한 d2nt 글. 근거: 웹 미검증. ilvl = 아이템 레벨.
  - ilvl > 99면 99, qlvl > ilvl이면 ilvl = qlvl
  - magic lvl > 0이면 alvl = ilvl + magic lvl (참은 magic lvl 없음)
  - 아니면 ilvl < 99 − qlvl/2 이면 alvl = ilvl − qlvl/2, 아니면 alvl = 2 × ilvl − 99
  - 접사 레벨 ≤ alvl인 접사만 붙는다.
- 높은 접사와 필요한 아이템 레벨(접사 레벨은 데이터, 필요 레벨은 위 식으로 계산, 261105):

| 참 | 접사 | 접사 레벨 | 필요 아이템 레벨 |
|---|---|---|---|
| 스몰 | Pestilent: 175 독 데미지 / 6초 | 88 | 94 (디아블로 94) |
| 스몰 | Flaming: 불 10~19 / 20~29 | 89 | 94 |
| 스몰 | Shocking: 번개 1 / 44~71 | 90 | 95 (니라탁 95, 바알 99) |
| 스몰 | Red: 최소 데미지 +1 | 90 | 95 |
| 스몰 | Hibernal: 냉기 8~10 / 15~20 | 91 | 95 |
| 그랜드 | of Vita: 라이프 41~45 | 91 | 91 |

- 원문은 그랜드 라이프 41~45가 아이템 레벨 89부터 나온다고 적었으나 위 식으로는 91이다(어느 쪽이 맞는지 미확인).
- 큐빙으로 만든 참은 접사 결정 방식이 드랍과 다르다(원문).

## 매직 찬스

- `magic_chance.md`에서 옮겨 핵심만 남겼다(261105). 원문(카오스큐브 "매직 찬스 (매찬)의 작동 원리", 글쓴이 Malic, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/944044, 근거: 웹 미검증)은 git 기록(`6e15969`의 `magic_chance.md`)에 있다.
- 룬은 매직 찬스의 영향을 받지 않는다(사용자 확인 261105, PureDiablo 원문도 같다, `tc.md` 원문 메모).
- 매직 찬스는 아이템 종류(TC)가 정해진 뒤 **등급을 정할 때만** 쓰인다. 등급은 유니크 → 세트 → 레어 → 매직 → 슈페리어 → 노멀 → 저품질 순으로 하나씩 확인한다(원문).
- **실효 매직 찬스**(MF = 장비의 매직 찬스 %, 근거: 일반 지식·웹 미검증. 원문의 0.5배 단위 수치를 이 식으로 계산하면 모두 맞다, 261105):
  - 유니크 = MF × 250 / (MF + 250), 세트 = MF × 500 / (MF + 500), 레어 = MF × 600 / (MF + 600), 매직 = MF 그대로
  - 그 등급의 확률 배수 = 1 + 실효 / 100. 예: MF 167 → 유니크 2배, MF 334 → 세트 3배, MF 300 → 레어 3배
- **몬스터별 최소 등급**(TC 품질 계수 1024, `treasureclassex.txt` 대조 261105): 챔피언·유니크·슈퍼유니크·보스 = 매직 이상, 액트 보스 퀘스트 TC = 레어 이상, 그리스월드·스미스 = 하한 없음. 일반 몬스터는 하한 없음.
- **강등**(원문): 유니크·세트로 정해졌는데 그 아이템의 유니크·세트가 없거나 레벨이 안 되면 유니크 → 내구 3배 레어, 세트 → 내구 2배 매직.
- 앞 등급에서 뽑힐수록 뒤 등급은 배수만큼 오르지 않는다. 그래서 최소 등급이 매직인 몬스터는 MF가 높을수록 매직 비율이 오히려 준다(원문).
- 지운 것: 원문 "매찬 대비 드랍율" 표(200% → 171% 등). 뜻이 적혀 있지 않고 위 식 어느 것과도 맞지 않는다(261105).

## 우버 디아블로·헬파이어 토치

- `monsters.md`에서 옮겨 핵심만 남겼다(261105). 원문은 git 기록(`6e15969`의 `monsters.md`)에 있다.

**우버 디아블로 (애니힐러스)**
- 출처: 카오스큐브 "클래식 전용 우버(애니참) 획득 정보"(글쓴이 Aliase, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941820). 근거: 웹 미검증. Battle.net 기준.
- 상점에 조던을 팔아 서버(게임 IP)마다 누적 수가 차면 "Diablo walks the earth" 메시지가 뜨고, 같은 IP의 헬 게임에 우버 디아블로가 나온다. 필요한 수는 정해져 있지 않고(원문: 보통 80~120개), 같은 IP의 다른 게임에서 판 것도 합쳐진다. 우버는 한 게임에 한 번.
- 나오는 곳: 원문은 슈퍼유니크·보스 자리를 나열했다(미검증).
- 애니힐러스(`uniqueitems.txt` 대조 맞음 261105): 스몰 참, 모든 스킬 +1, 모든 능력치 +10~20, 모든 저항 +10~20, 경험치 +5~10%. 한 캐릭터에 1개만 가질 수 있다(원문).

**헬파이어 토치**
- 출처: 카오스큐브 "횃불(헬파이어토치) 획득 정보(클래식)"(글쓴이 Aga, 인터넷 아카이브 2023-09-25 사본). 근거: 웹 미검증.
- 열쇠: 헬 카운테스 → 공포의 열쇠(`pk1`), 헬 소환술사 → 증오의 열쇠(`pk2`), 헬 니라탁 → 파괴의 열쇠(`pk3`). 열쇠는 헬 TC에만 있다(데이터 대조 261105).
- 열쇠 확률(데이터 계산 261105, 혼자일 때 처치 1회에 하나 이상): 카운테스 약 7.1%, 소환술사 약 8.6%, 니라탁 약 7.9%. 그 TC를 5번 뽑고(`Picks` 5) 열쇠 비율이 1 / 합계(카운테스 68, 소환술사 56, 니라탁 61)라서다. 인원이 늘면 `NoDrop`이 줄어 오른다(`tc.md` 5절). 원문의 "1/34"는 틀려 지웠다.
- 열쇠 3종을 큐브하면(원문: 액트5에서) 포탈 3곳 중 하나가 열린다. 한 자리에서 여러 번 열면 포탈이 겹칠 수 있다(원문).
- 장기(데이터 대조 261105, 100%): 릴리스(`Uber Andariel` TC) → 디아블로의 뿔(`dhn`), 우버 듀리엘 → 바알의 눈(`bey`), 우버 이주얼 → 메피스토의 뇌(`mbr`).
- 장기 3종 큐브 → 우버 트리스트럼(지역 136) 포탈, 우버 메피스토·디아블로·바알을 잡으면 토치가 나온다.
- 헬파이어 토치(`uniqueitems.txt` 대조 261105): 라지 참, 무작위 직업 하나의 스킬 +3(+3은 원문), 모든 능력치 +10~20, 모든 저항 +10~20, 시야 +8, 타격 시 5% 확률로 레벨 10 파이어스톰, 레벨 30 히드라(10 충전). 원문의 "25% 확률 레벨 25"는 틀려 지웠다.
- 원문: 열쇠·토치 모두 거래 가능, 토치는 한 캐릭터에 1개, 스탠다드·래더 구분 없음.
