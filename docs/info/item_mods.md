# 아이템 생성 규칙 (auto mod, staff mod, 소켓, 에테리얼, 겜블, 참 접사)

아이템 종류에 따라 자동으로 붙는 옵션(auto mod)과 직업 스킬 옵션(staff mod), 아이템 레벨별 소켓 수, 에테리얼 규칙과 방어력 계산식, 겜블 아이템 레벨, 참 접사 공식 (261104).

- 이름 주의: 여기서 mod는 아이템 옵션(modifier)이다. 코드의 `unit.mode`(유닛 동작 상태, `ids.md`)와 다른 말이다.
- kolbot 사용처: nip 규칙의 스킬·저항·소켓 조건(`nips/*.nip`), `Pickit`, `Cubing`(소켓 뚫기), `Runewords`

## auto mod

- 출처: mpqdata `automagic.txt`(1.14d). 대상 아이템은 `weapons.txt`·`armor.txt`의 `auto prefix` 열(= `group`). 효과는 게임 표시로 바꿔 적었다(독: 내부 값 × 길이 / 256, 반올림, 길이 / 25 = 초). 그룹(`group`)과 아이템: 300 아마존 활, 302 아마존 창·재블린, 303 소서리스 오브(라이프·마나), 304 팔라딘 방패(모든 저항 / 공격 등급+증뎀), 305 네크로맨서 머리(독 데미지). `weapons.txt`·`armor.txt`의 `auto prefix` 열이 그 아이템의 그룹이다.
- 대조(261104):
  - Fandom "Auto Mod" 표(https://diablo.fandom.com/wiki/Auto_Mod, 위키 API로 가져옴)는 `automagic.txt` 36줄과 이름·레벨·빈도·수치가 모두 같다.
  - 그룹 301(아마존 패시브·매직 스킬)은 `automagic.txt`에 있지만 `auto prefix`가 301인 아이템이 0개라 실제로 붙지 않는다. Fandom 표에도 없다.
  - `rare` 열이 빈 줄(레어에 안 붙음): Archer's, Lancer's, of the Colossus, Great Wyrm's, Chromatic, of Anthrax. Fandom의 "cannot spawn on rare"와 같다.
  - 팔라딘 방패 Sharp~Knight's는 `rare`=1이다. Knight's(공격 등급 101~121, 증뎀 51~65%)는 레어에도 붙는다. 아래 인벤 글의 "51~65증댐/101~121어레는 레어에 안 붙는다"는 `automagic.txt`와 다르다.

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

### 인벤 글 원문

- 출처: 인벤 "아이템의 오토모드와 스태프모드에 관한 정보"(https://www.inven.co.kr/board/diablo2/5734/5298), 2022-06-01, 레저렉션 인벤 팁 게시판. 근거: 웹 미검증. 오토모드·스태프모드 규칙은 클래식과 같다는 것은 사용자 판단, 위 D2MOO·mpqdata 대조로 맞는 곳과 다른 곳을 적었다(261104).
- 원문 그대로. 티어 확률 표는 원문 그림을 표로 옮겼다(5줄 × 6칸, 원본 대조함). 댓글은 스크립트로 불러오는 부분이라 가져오지 못했다.

안녕하세요.

아이템의 **오토모드**와 **스태프모드**에 관하여 글을 써보고자 합니다.

 **\* 오토모드와 오토모드의 종류**
오토모드란, 전용 아이템에 붙는 기본 옵션이라고 생각하시면 됩니다.

1. 아마존 전용 무기에 붙는 활/창 1 ~ 3스킬
2. 소서리스 전용 오브에 붙는 1 ~ 80 마나 & 1 ~ 60 라이프
3. 팔라딘 전용 방패에 붙는 5 ~ 45 모든저항 또는 15 ~ 121 공격등급 + 10 ~ 65% 증댐
4. 네크로맨서 전용 방패에 붙는 독대미지

 **\* 스태프모드와 스태프모드의 종류**
스태프 모드란 전용 아이템에 붙는 추가 부분스킬이라고 생각하시면 됩니다. 또한, 한 아이템에 최대 3개의 스태프모드 옵션이 붙을 수 있습니다., 이는 노말, 매직, 레어아이템 모두 가능합니다. 그리고, 오토모드와 스태프모드는 중복으로 나올 수 있습니다. (ex. 소서 전용 오브에 붙는 피, 마나, 부분스킬)

1. 어쌔신 전용 클러에 붙는 1 ~ 3 어쌔신 부분스킬(클러의 경우, 댓글에 간단히 설명되어있습니다.)
2. 바바리안 전용 헬름에 붙는 1 ~ 3 바바리안 부분스킬(단, 모든 전투 기술 항목은 붙지 않음.)
3. 드루이드 전용 헬름에 붙는 1 ~ 3 드루이드 부분스킬
4. 완드류에 붙는 1 ~ 3 네크로맨서 부분스킬(단, 독과 뼈 기술 항목의 맹독단도는 붙지 않음.)
5. 네크로맨서 전용 방패에 붙는 1 ~ 3 네크로맨서 부분스킬
6. 셉터류에 붙는 1 ~ 3 팔라딘 부분스킬(단, 전투 기술 항목의 강타는 붙지 않음.)
7. 스태프,오브 에 붙는 1 ~ 3 소서리스 부분스킬
 \* 스태프 모드 옵션의 경우, 같은 기술 항목에서 3가지가 전부 붙어 나올 수 없습니다. (소서리스 오브 제외)

위와 같이 구분되어 있지만, 통상적으로 오토모드 혹은 오토옵(오토스킬) 이라고 불립니다.
오토모드와 스태프모드의 차이점은 오토모드는 무조건 나오며, 스태프모드(부분스킬)은 없을수도 있습니다
디아블로를 하면서 많이들 주워서 확인하시는 아이템류가 크게 팔라딘 셉터류, 어쌔신 클러류, 아마존 전용활, 네크로맨서 완드와 방패, 팔라딘 전용 방패등 전용템은 많이 주워보실 것이고, 저 또한 주워서 항상 확인해봅니다.

여기서 예외가 있는데, 바로 일반과 매직 아이템에는 

최상급의 오토모드(3보우, 36~45올레, 51~65증댐/101~121어레 등)은 붙지만, 레어 아이템에는 붙지 않습니다.
예를 들어, 지존 매직자벨린(6스킬 40공속)은 있지만 지존 레어자벨린에는 4(오토2, 아마2)스킬까지밖에 안 붙죠.
또한, 레어 아마존 전용 활의 경우, 3스킬짜리 레어활은 없는게 대표적입니다.
레어 팔라딘 전용 방패의 경우, 최대 55모든 저항까지는 가능하지만, 65모든저항은 없습니다.
레어 소서 전용 오브의 경우, 오토모드의 라이프와 접두사의 마나가 붙은 경우를 제외하고는 붙지 않습니다.
(예외라고 하기에는 너무 많네요.)

오토모드는 따로 설명할게 없으니 넘어가고, 스태프 모드에 대해서 좀 더 자세히 설명하고자 합니다.
스태프 모드는 부분스킬이 붙는 옵션인데, 여기서 우리는 스킬의 **tier(티어)**라는 것에 대해서 알아야 합니다.
**tier는 총 1 ~ 6단계로 나뉘어 구분하**게 되며, 스킬 창에서 확인하실 수 있습니다.
(원문 그림: 네크로맨서 독과 뼈 탭을 1~6티어 줄로 나눈 스킬 창)

**1 tier skill → 1레벨부터 배울 수 있는 스킬
2 tier skill → 6레벨부터 배울 수 있는 스킬
3 tier skill → 12레벨부터 배울 수 있는 스킬
4 tier skill → 18레벨부터 배울 수 있는 스킬
5 tier skill → 24레벨부터 배울 수 있는 스킬
6 tier skill → 30레벨부터 배울 수 있는 스킬**

그리고, 스태프 모드 옵션에 최대 3종류의 옵션(스킬)이 붙을 수 있다고 말씀드렸는데 서로 모든 스킬이 조합가능한게 아닙니다. 또한, 같은 티어의 스킬이 2번 붙을 수 있다고 합니다.(ex. 3축망, 3집중 셉터)
아래의 표는 아이템 레벨에 따른 스태프모드 옵션이 붙게되는 확률이라고 합니다.


| 아이템 레벨 | 1 티어 | 2 티어 | 3 티어 | 4 티어 | 5 티어 | 6 티어 |
|---|---|---|---|---|---|---|
| 0 ~ 11 | 80% | 20% |  |  |  |  |
| 12 ~ 18 | 30% | 50% | 20% |  |  |  |
| 19 ~ 24 | 10% | 20% | 50% | 20% |  |  |
| 25 ~ 36 |  | 10% | 20% | 50% | 20% |  |
| 37 ~ 99 |  |  | 10% | 20% | 50% | 20% |

6티어 스킬이 붙게되면, 시스템 상으로는 1, 2티어 스킬이 붙을 수 없게 됩니다.
5티어 스킬이 붙게 되면, 1티어 스킬은 붙을 수 없습니다.

이런식으로 표를 보시면 될 것 같습니다.

## 아이템 레벨별 소켓 수

- 계산(D2MOO `ITEMS_GetMaxSockets`): 아이템 레벨 1~25 → `itemtypes.txt` `MaxSock1`, 26~40 → `MaxSock25`, 41 이상 → `MaxSock40`. 그 값과 `weapons.txt`·`armor.txt` `gemsockets` 중 작은 값. 큐브 소켓 뚫기와 라주크 퀘스트가 이 값을 쓴다.
- 표 출처: 카오스큐브 "라주크가 뚫어주는 아이템 소켓 정보"(글쓴이 올웨이즈, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941739) 그림 "라주크가 뚫어주는 소켓 개수 v2.0". 이름은 영문(원본 표기 그대로).
- 대조(261104): 422줄 1266칸을 위 계산값과 대조해 모두 같다. 원본 머리말의 구간 "A = ilvl 1-24, B = 25-39, C = 40+"는 D2MOO 코드(1~25 / 26~40 / 41+)와 다르다. 아래 표 머리는 D2MOO 구간으로 적었다. 같은 정보인 사용자 그림 `socket.png`(카오스큐브, 제작 무한의공갈, 구간 1~25 / 26~40 / 41+)는 칸 대조를 하지 않았다.
- `socket.png` 머리말(원문): "매직, 레어, 유니크, 세트, 크래프트등의 아이템은 적용되지 않습니다. / 투척하는 무기는 소켓이 뚫리지 않습니다. / 드랍되는 아이템의 소켓은 숨렙을 따라가나 노멀은 3개, 나이트는 4개의 제한이 있습니다."
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
- 에테리얼: 방어력 = 기본 × 1.5(내림), 요구 힘·민첩 −10. 1.10부터 이 50%는 방어력 증가(%)보다 먼저 붙는다(아래 고찰 [2]).
- 슈페리어(원본 식, 카오스큐브 늘비 도표): Defense = [(최고 방어도 + 1) × (100 + 방상%) / 100]. 슈페리어 에테리얼: Defense = [[(최고 방어도 + 1) × 3/2] × (100 + 방상%) / 100]. `[ ]`는 내림.
- 큐빙 소켓 버그(1.11·1.11b 이후, 아래 고찰 [10]): 에테리얼 갑옷·방패를 큐브로 소켓 뚫으면 50%가 한 번 더 붙는다(= 에테리얼 값 × 1.5, 내림).
- 사용자 자료 `갑옷 별 디펜.png`의 "인내" 줄 값은 모두 (큐빙 소켓 버그 값) × 3 + 15와 같았다(값에서 맞춘 식, 원본에 설명 없음, 261104 대조).

### 에테리얼에 관한 고찰

- 출처: 카오스큐브 "에테리얼(무형)에 관한 고찰!"(글쓴이 penny♡, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/944029). 근거: 웹 미검증. 원문 그대로.

(원문 그림: 반투명한 에테리얼 아이템 스크린샷)

본 설명에 앞서 에테리얼 아이템의 간단한 법칙?! 몇가지 !

하나. "에테레얼" 아이템은 확장팩에서만 볼 수 있습니다.

하나. "에테리얼"은 변경가능한 옵션이 아닙니다. 아이템의 고유의 특성입니다.
("소켓" 또는 "슈페리어" 와 같이 말이죠.)

하나. "에테리얼" 아이템은 내구도를 갖는 노말, 매직, 레어, 또는 유니크 아이템에서 볼수 있습니다. (세트 제외)

하나. "에테리얼" 아이템은 일반적인 노말, 매직, 레어 아이템과는 달리 내구도가 100%로 발견이 됩니다. (50 내구도를 갖는 필드 플레이트를 에테리얼로 주웠을시 27/50 인 내구도가아닌 27/27 내구로 발견이 됩니다.)

하나. 수량이 존재하는 "에테리얼" 아이템은 절대로 100% 수량을 갖지 않는다. 스펠 또한 재사용이 불가능합니다. (호라드릭 큐브를 사용하지 않는 다는 전제하에..)

\*에테리얼이 존재하지 않는 아이템
1. 링 & 아뮬렛
2. 보우 & 크로스보우
3. 페이즈 블레이드 (언제나 파괴불가 옵션을 갖습니다)
4. 세트 아이템

에테리얼의 장. 단점

장점. 무기의 공격력, 갑옷의 방어력의 50% 향상 효과가 있습니다.
단점. 내구도가 45% 낮고, 무엇보다도 수리불가 입니다.

에테리얼 아이템 특성은 5% 의 확률로 뜬다고 알려져 있습니다 (블리자드). 그러나 링 아뮬 주얼 세트 등 에테리얼이 존재아지 않는 아이템까지 고려한다면 5% 이하겠지요.

\[1\] 에테리얼의 모양새

줍기전 에테리얼 아이템의 이름 색깔은 소켓 아이템과 같은 어두운 회색 모양입니다. 땅에 떨어진 이름만 보고서는 소켓인지 에테리얼인지 구분이 불가능 하죠. (물론 부츠, 벨트, 글러브라면 에테리얼 이겠지요? 소켓이 불가능하니까요 ㅎㅎ). 한때 블리자드사에서 에테리얼의 색을 살짝더 연한 회색으로 바꾸겠다는 논의가 있었는데요, 아직 실현 되지는 않았습니다. 땅에 떨어진 매직, 레어, 유니크 아이템들은 다른 특별한 색의 변화는 없습니다.

에테리얼 아이템은 주웠을시 반투명한 모습을 하고 있습니다. 스크린샷에서 보시는 바와 같이 말이죠.

\[2\] 에테리얼의 보너스 적용법!

위에서 잠시 설명했듯이 모든 에테리얼 아이템은 50% 보너스가 붙습니다, 방어 또는 공격력에서 말이죠. 이것은 v1.09 이후와 이전으로 추가되는 방법이 나뉘는데 이것에 대해 잠시 설명드리려 합니다.

v1.09 이전에는 50% 추가 보너스가 마지막에만 붙었습니다. 예를 들자면 440 방어구를 베이스로 갖는 오네이트 아머의 경우 50% 추가인 +220 방어가 추가가 됩니다. 무기 또한 마찬가지 였구요. 나쁘진 않지만 레어아이템의 경우 +100%, 매직의 경우 +200% 까지 옵션으로 갖는데 여기에 에테리얼이어 봤자 +150%, +250% 밖에 되지 않아 그렇게 큰 에테리얼의 메리트는 없었습니다.

v1.09 패치 이후에 이것이 바뀌었는데요, 이제는 이 +50% 향상이 모든 추가 능력치 이전에 적용이 됩니다. 예를들어 v1.08 에서는 세이크리드 플레이트 600방어 베이스, +200% 방어력 향상 옵의경우에 1800방어를 갖는데, 이것이 에테리얼의 경우 +50프로인 (600\*0.5)=+300 이 되어 2100 방어가 됩니다. 그러나 v1.09 부터는 추가 방상 이전에 적용이 되어 +300이 추가가 먼저되고 +900 에서 +200% 즉 2700방어를 갖게 되었죠.

\*무기 또한 적용이 같습니다.

\[3\] 내구도 손실

모든 방어구는 몬스터 또는 플레이어에게 공격이 되었을때 내구도 손실이 납니다. 방어구 종류에 따라 내구도 손실효과가 다른데요,
\*(매직 데미지는 방어구손실에 영향을 받지않고 물리 데미지만 영향을 받습니다.)

갑옷 : 23.1%
뚜껑 : 15.4%
장갑 : 15.4%
벨트 : 11.5%
부츠 : 11.5%

위와 같은 확률로 내구도가 닳습니다.

방패의 경우에는 블록이 성공해야만 내구도의 손실이 있습니다. 또한 스마이트 사용시에도 내구도가 닳지 않습니다 (대신에 무기 내구도가 닳죠). 무기를 착용하시지 않고 스마이트를 쓰신다면 무기, 방패의 내구도 모두 닳지 않습니다. 그러나 공속이 매우 느리겠지요? ㅎㅎ 스마이트의 공속은 무기에 영향을 받으니까요.

무기의 내구도 손실은 타격시에만 있습니다. 모두다 경험이 있으실꺼라 믿습니다 ㅎㅎ
던지는 무기의 경우에도 내구도 손실이 있는데요, 다른종류의 무기에 비해 1/6 배 만큼 손실이 있다고 하네요. 오브 또는 스태프의 경우 스펠만 쓰시면 내구도가 닳지 않기 때문에 일반 오브, 스태프처럼 사용이 가능합니다.

\[4\] 용병 사용시에는 ?

에테리얼 아이템은 용병에게 사용시에 정말 좋습니다. 그 이유는 용병이 사용시에는 내구도의 손실이 전혀 없기 때문이죠. 따라서 방어 향상, 데미지 향상의 효과가 있는 에테리얼은 용병에게 딱 맞는 아이템이라 생각됩니다.

\[5\] 상점에 팔때

에테리얼 아이템을 상점에 팔 시에는 약 75% 또는 그 이상의 가격 하락이 있습니다. 물론 셉터/완즈/ 스태프 등은 그 75% 하락에도 35000골드인 경우가 있지요, 그렇지만 대부분의 다른 무기나 방어구는 그렇지 않습니다.

그리고 모든 에테리얼 아이템은 상점에 넘기는 순간 사라집니다. NPC 들의 인벤에 공간이 있다고 해도 다시 재구매가 불가능합니다.

\[6\] 자가 회복 기능 (수량/내구력 회복)

가끔 에테리얼의 아이템중에 내구도 회복 또는 수량 회복의 옵션이 있는 경우가 있습니다. 이러한 옵션이 있는경우 회복하는 속도보다 빠르게 전부 써버리지만 않는다면 영구 보존이 가능 합니다. 그러나 회복속도 보다 빠르게 전부 사용해버리시면 더 이상 그 에테리얼 아이템은 사용이 불가능 합니다. 당연히 그러한 기능이 있는 아이템의 경우엔 수량 또는 내구력를 조심히 보면서 사용해야겠지요 ㅎㅎ

\*v1.10 패치 이후에 매직 아이템에 한정하여 던지기 무기의 수량이 0이 되어도 회복이 됩니다.

\[7\] 슈페리어 에테리얼

슈페리어 에테리얼의 경우 슈페리어의 +내구도 효과적용 이후에 내구도 감소 효과가 적용 됩니다. 예를들어 50 내구도를 갖는 아이템의 경우 슈페리어에 의해 12% 내구도 보너스 즉, 내구도 56이 된 이후에 에테리얼 내구도 감소 효과가 적용이 되어 그 아이템의 내구도는 31 이 됩니다.

\[8\] 룬워드

에테리얼 재료에 작을 하여 룬워드를 만들어도 에테리얼의 특성은 유지 됩니다. 그 뜻인 즉 +50% 향상의 효과와 수리불가 옵션이 유지가 된다는 뜻이지요.

몇가지 룬워드들이 작을 했을시 파괴불가 또는 내구도 회복을 갖는 아이템이 있는데요, 이 아이템들은 보통의 아이템과 똑 같이 사용이 가능합니다.

-죽음의 숨결. v1.10 패치에서 추가 된, 유일하게 조드룬을 사용하는 룬워드 입니다. 따라서 조드룬이 갖는 파괴불가 옵션을 갖고 있지요.
-죽음, 불멸, 서약은 파괴불가 옵션을 갖고 있습니다.
-망명, Prudence 의 경우에는 내구력 회복의 옵션을 갖고 있습니다.

\[9\] 에테리얼의 임뷰

에테리얼 임뷰잉은 별루 추천드리지 않습니다. 그 이유는 임뷰를 해도 그 아이템은 레어로 변하기에 에테리얼 특성을 그대로 갖고 있습니다. 만약에..그래도 하시게 된다면 다음 세가지의 경우에만 하시길 바라겠습니다.

1. 운이 매우매우 좋아 수량회복/내구력 회복 옵션을 기대한다.
2. 조드룬을 준비한다.
3. 용병에게 줄 아이템이다.

\[10\] 소켓팅

모든 일반적인 에테리얼 아이템은 소켓팅이 가능합니다, 소켓팅시 에테리얼의 특성을 유지하고, 소켓이 뚤리게 되지요. 중요한것은 v1.11 과 v1.11b 이후에 큐빙을 이용한 소켓팅에 관해서 입니다. 큐빙을 이용하여 소켓팅시 버그가 존재 하는데요, 에테리얼 갑옷과 방패에 50% 추가 효과가 한번더 적용이 됩니다. 결과적으로 갑옷과 방패에 정말 높은 방어를 갖게 되지요. 에테리얼 세이크리드 론다쉬에 큐빙의 방식으로 소켓팅후 망명 제작시 방어 +1000 을 얻을수 있죠. 망명은 또한 내구력 회복 기능이 있기 때문에 영구적으로 사용이 가능합니다.

소케팅 큐빙 방법은 우리 모두가 한번쯤은 들어가본 카큐 개발자님께서 주신 "좋은 정보" 링크

http://www.chaoscube.co.kr/community/board/contents.asp?seq=-233&page=1&t_name=cmt_info&keyfield=&keyvalue=&searchand=&calcu_page=1&nchk=1

이곳에 자세히 있습니다.

\[11\] 크래프팅

에테리얼 아이템을 크래프트에 사용시 에테리얼 효과는 사라지게 됩니다. 물론 증가된 방어 또는 공격력 또한 없어지게 됩니다.

\[12\] 에테리얼 아이템 유지법

조드룬을 사용하지 않고 에테리얼 아이템을 일반 아이템처럼 유지 하는것은 불가능 합니다. 또한 내구도가 0이 되기 전에 조드작을 해야 유지가가능합니다. 이미 내구도가 0 이 되어버린 아이템은 조드작을 해도 사용이 불가능 합니다.

\[13\] 아이언 골렘

아이언 골렘은 무기를 재료로 하여 소환하는 네크로맨서 스킬입니다. 에테리얼 아이템을 사용하여 소환시 일반 무기를 사용하여 소환한한 아골과는 사뭇 다르지요. 겉 모습은 아이템처럼 반투명 모습을 하고 있고 추가적인 보너스 스탯을 받습니다.

\[14\] 에테리얼의 사전적 의미

에테리얼 (Ethereal) :

1. 하늘의, 천상의, 천계의
2. 가볍고 여린.
3. 돈의 관심이 없는.
4. 무형의.

뜻을 보니 아이템 이해가 조금 더 잘되네요 ㅎㅎ

이상으로 에테리얼에 관한 고찰 이었습니다.
잘못된 부분이나 수정할 부분이 있다면 말씀해주세요.

읽어주셔서 감사합니다. ^^ 카큐님들 모두 새해복 많이 받으세요 !!

## 겜블 아이템 레벨

### 코드 (D2MOO)

- 출처: D2MOO(1.10f 소스 재구성) `source/D2Game/src/UNIT/SUnitNpc.cpp`의 겜블 목록 만드는 함수. 근거: D2MOO 코드(261104).
- 겜블 아이템 레벨 = 캐릭터 레벨 + 난수(0~9) − 5 → **캐릭터 레벨 −5 ~ +4**. 5보다 작으면 5, 99보다 크면 99.
- 품질: 난수(0~99999) < `difficultylevels.txt` `GambleUniq`+`GambleSet`+`GambleRare` 이면 그 안에서 유니크/세트/레어, 그 밖은 매직.
- 확장팩: 익셉셔널 확률 = `GambleUber` × (아이템 레벨 − 익셉셔널 기본 아이템 레벨) + 1 (/10000), 실패하면 엘리트 `GambleUltra`로 같은 식.

### 겜블·크래프트에 관한 케릭렙과 숨은렙의 진실 (제타_마크)

- 출처: 카오스큐브 "겜블/크레프트에 관한 케릭렙과 숨은렙의 진실"(글쓴이 제타_마크, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/942119). 근거: 웹 미검증. 본문은 그림 2장(실험 글)과 덧붙임 글이다.
- 그림 내용(옮겨 적음): 91레벨 소서리스로 아뮬렛 98개를 겜블(기드 11% + 모서리 15% 할인), 레어 11개·유니크 1개. 아이템 레벨이 86~95로 나왔다. 86 8개, 87 15개(원본은 "총 23번", "전체98개의 아뮬중 4.2%의 확률"이라고 적었다). 글쓴이 결론: "블리자드 명시 캐릭레벨 +6 levels/-3 levels가 맞지 않다", "겜블에 필요한 레벨은 캐릭레벨 +4/-5", "접두 최고치 90을 요구하려면 최소 95렙".
- 글쓴이의 +4/−5는 위 D2MOO 코드와 같다.

덧붙임 글(원문):

추가.
글제주가 없어 참 두서가 없었는데 \[여차여차™\]님의 댓글이 너무
맘에 드는군요^^
\[여차여차™\] 님의 말씀대로 숨은렙이 90을 넘어가기 위해서 케릭렙이
95가 필요한것 입니다.
꼭 95렙이 넘으면 2스킬이 나온다는것이 아니고 86렙이상이면,(+4/-5)
2스킬 아뮬을 겜블(확률상)할 수 있다는것을 다시 한번 말씀드립니다 .

아이템의 숨은렙을(접두90)을 뽑기 위해 또한 2스킬을 뽑을 확률을
높히기 위해.. 95렙 케릭으로 하면 확률상 더높다는것이다 라는것이고.

또한 크렙시 숨은렙(90)이상을 뽑는것은 케릭95렙이상이면 어떠한 겜블을해도 가능하다는것입니다.

글의 의도는 이렇습니다
모든분들이 숨은렙을 알아볼수 있는 프로그램을 사용하는것은 아니기때문에
좀더 확률적으로 높이며.디아머니를 줄이자 라는 의도라는것을 알려드립니다.

## 참 접사 공식

- 출처: 카오스큐브 "참 (부적) 아이템의 접미사 접두사 최대 수치 정보"(글쓴이 윈드포수, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/945293) 글. 근거: 웹 미검증.
- 표 보는 법(원본): "41~45/91 = 그랜드 차암의 피가 41~45 사이로 붙고 접미사 레벨이 91이라는 뜻. 몬스터 드랍시 접사 결정 공식 qlvl(alvl) ≤ ilvl+2에 따라 ilvl89 이상 그랜드 차암에서만 피 41~45 옵션이 나오게 됩니다. 77≤ilvl≤88인 경우엔 피 36~45 옵션이 나오게 됩니다. ※ qlvl(alvl) = 접사 레벨, ilvl = 숨은 아이템 레벨 ※ 주의! 큐빙은 접사 결정 공식이 드랍 할 때와 다릅니다."
- 참 접사별 수치·접사 레벨은 mpqdata `magicprefix.txt`·`magicsuffix.txt`(`itype`이 `scha`·`mcha`·`lcha`, `spawnable`=1)의 `level`·`mod1min`·`mod1max`.

원문:

참알못이라서 주울 때마다 살펴보는 게 힘들어서 정리해봤어요.

위쪽 표는 거래용 득 참인지 확인 할 때 쓰라고 최고 접두사 접미사만 추린 것 입니다.

아래쪽 표는 캐릭터를 키우는 도중에 얻은 참이 내 레벨대에 나올 수 있는 가장 높은 수준의 접두사 접미사를 가진 것인지 아닌지를 판단하기 위한 것입니다.
그랜드 차암의 피 옵션은 45가 최고인데 플레이어의 레벨이 낮을 땐 약한(레벨이 낮은) 몬스터만 잡을 것이고 드랍되는 아이템의 숨은 렙 역시 당연히 낮을 것 입니다.
그래서 접미사 레벨 91에 해당하는 45피 옵션은 절대로 나올 수 없기 때문에 조금 더 낮은 등급의 접미사 레벨을 아래쪽 표에 정리해두었습니다.

극단적인 예는 민뎀, 맥뎀, 어레/맥뎀 관련 옵션에서 볼 수 있습니다.
스몰 차암 민뎀1, 맥뎀1은 접두사 레벨이 90, 81이라 헬 다가서나 볼 수 있는데 비해서
스몰 차암 어레10~20, 맥뎀1~3 옵션에서는 맥뎀3이 접두사 레벨 28에 나오게 됩니다.
맨땅 할 때 스몰 차암 어레/맥뎀 옵션이 나오면 무조건 키핑하는게 좋을 것 같네요.

추가로 접사 레벨이 높은 경우는 다음의 것이 있습니다.
스몰 175 독 - 접두사 레벨 88
스몰 10~19,20~29 파민/맥뎀 - 접두사 레벨 89
스몰 1,44~71 라민/맥뎀 - 접두사 레벨 90
스몰 8~10,15~20 콜민/맥뎀 - 접두사 레벨 91

큐빙 차암의 접사 구하는 공식(출처 http://d2nt.net/diablo/diablo2_tips/280905)
If (ilvl\>99) then ilvl=99}
if (qlvl\>ilvl) then ilvl=qlvl}
if (magic_lvl\>0) then alvl=ilvl+magic_lvl}
else

if (ilvl\<(99-qlvl/2))
then alvl=ilvl-qlvl/2
else alvl=2\*ilvl-99

if는 '만약', then은 '그러면', else는 '아니면' 입니다.
ilvl=아이템의 숨은 레벨, qlvl=퀄리티 레벨(아이템 고유 레벨), alvl=접사 레벨
스몰, 라지, 그랜드 차암의 qlvl은 24, 12, 1

스몰 차암의 175 독 or 10~19,20~29 파민/맥뎀 옵션이 나오려면 ilvl 94이상. 디아블로(94)
스몰 차암의 1,44~71 라민/맥뎀 옵션이 나오려면 ilvl 95이상. 니라트하크(95), 바알(99)
그랜드 차암의 피 100 옵션이 나오려면 ilvl 95이상.

※ malic님의 TC글을 참고하였습니다.
http://www.chaoscube.co.kr/community/board/contents.asp?seq=-4727&page=1&t_name=cmt_info&keyfield=nickname&keyvalue=malic&searchand=&calcu_page=1&bestchk=

자락서스 - 스몰 라지 그랜드 차암 득 정리
http://www.chaoscube.co.kr/community/board/contents.asp?seq=-5055&page=1&t_name=cmt_info&keyfield=subject&keyvalue=%C2%F7%BE%CF&searchand=&calcu_page=1&bestchk=

단비『꼬마♡』- 아뮬렛 / 반지 / 차암의 모양별 호칭 입니다.
http://www.chaoscube.co.kr/community/board/contents.asp?seq=-2723&page=1&t_name=cmt_info&keyfield=subject&keyvalue=%C2%F7%BE%CF&searchand=&calcu_page=1&bestchk=
