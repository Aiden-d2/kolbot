# 엔진 번호 (코드에서 쓰는 번호표)

아이템 플래그·위치·착용 부위, 유닛 동작 상태(mode), NPC 메뉴, 상점 화면, 아이템 기본 스탯 인덱스, UI 플래그 (261104), 몬스터 spectype·슈퍼유니크 프리셋 번호(261105).

- 번호와 이름은 원본 그대로 영문. 출처는 절마다 적었다.

## 아이템 플래그 (`item.getFlag(값)`)

- 출처: kolbot 옛 sdk `itemflags.txt`(원본 끝 "thanks to bluemind for testing"). 설명은 원본 영어 그대로.
- 쓰는 법: `item.getFlag(값)`이 0이 아니면 그 플래그가 켜져 있다. 예: `if (item.getFlag(0x10)) { ... }` = 감정된 아이템(`Town.js`), `item.getFlag(0x400000)` = 에테리얼(261105).

| 값 | 이름 | 원본 설명 |
|---|---|---|
| 0x4000000 | isRuneword | set if it is a runeword (note that 'ith' qualifies ;) |
| 0x1000000 | isNamed | has a custom name "Player's item" |
| 0x800000 | ? | was set for all items tested (tested in inv, stash, store) |
| 0x400000 | isEthereal | 0 if not ethereal |
| 0x200000 | isRuneOrPot | rune or potion, also set for mephisto's soulstone |
| 0x20000 | isStartItem | an item that a new character starts with (like javelin and buckler, and the minor healings at the start) |
| 0x10000 | isEar | a player ear |
| 0x4000 | isNotInSocket | 0 if in socket, 0 if in belt, 0 if equipped or equipped by merc, 0 for gems/charms/.. |
| 0x2000 | isInStore | in trade or gamble screen |
| 0x800 | isSocketed | the item has sockets (they can be full or empty) |
| 0x400 | isRejuv | only seen set for full rejuvs for now |
| 0x100 | isBroken | just a bet, but i'm pretty sure it's correct |
| 0x80 | isSwitchOut | a weapon switch command was performed, and this item is no longer being used |
| 0x40 | isSwitchIn | a weapon switch command was performed, and this item is now being used |
| 0x10 | isIdentified | 0 if unid |
| 0x8 | isInSocket | 8 if in socket, valid for rune and jewels, not gems |
| 0x1 | isEquipped | player or merc is wearing the item (don't trust too much, especially when bit 9 is set) |

## 아이템 위치 (`item.location`)

- 출처: 사용자 자료 `아이템로케이션.txt`. 4번은 원본에 없다.
- 쓰는 법: `item.location === 7` = 창고에 있는 아이템(`Misc.js`)(261105).

| 번호 | 위치 |
|---|---|
| 1 | Equipped |
| 2 | Belt |
| 3 | Inventory |
| 5 | Trade |
| 6 | Cube |
| 7 | Stash |

## 착용 부위 (`item.bodylocation`)

- 0~10: mpqdata `bodylocs.txt` 줄 순서(머리줄 다음 첫 줄이 0). 11·12: kolbot 옛 sdk `bodylocations.txt`(mpqdata에 없음, 무기 스왑 칸).
- 쓰는 법: `item.bodylocation === 4` = 오른손 무기(`Precast.js`)(261105).

| 번호 | 이름 | Code |
|---|---|---|
| 0 | None |  |
| 1 | Head | head |
| 2 | Neck | neck |
| 3 | Torso | tors |
| 4 | Right Arm | rarm |
| 5 | Left Arm | larm |
| 6 | Right Ring | rrin |
| 7 | Left Ring | lrin |
| 8 | Belt | belt |
| 9 | Feet | feet |
| 10 | Gloves | glov |
| 11 | RIGHT_ARM_SECONDARY | |
| 12 | LEFT_ARM_SECONDARY | |

## 유닛 동작 상태 (`unit.mode`)

- 출처: mpqdata `plrmode.txt`·`monmode.txt`·`ObjMode.txt` 줄 순서(머리줄 다음 첫 줄이 0). 옛 sdk `modes.txt`의 플레이어 0~19·몬스터 0~15와 개수·앞부분 이름이 같다(261104).
- 쓰는 법: `unit.mode === 0 || unit.mode === 12` = 죽은 몬스터(`Attack.js`), `me.mode === 10` = 내가 시전 중(플레이어 표)(261105).

**플레이어**

| 번호 | Name | Token |
|---|---|---|
| 0 | Death | DT |
| 1 | Neutral | NU |
| 2 | Walk | WL |
| 3 | Run | RN |
| 4 | Get Hit | GH |
| 5 | Town Neutral | TN |
| 6 | Town Walk | TW |
| 7 | Attack1 | A1 |
| 8 | Attack2 | A2 |
| 9 | Block | BL |
| 10 | Cast | SC |
| 11 | Throw | TH |
| 12 | Kick | KK |
| 13 | Skill1 | S1 |
| 14 | Skill2 | S2 |
| 15 | Skill3 | S3 |
| 16 | Skill4 | S4 |
| 17 | Dead | DD |
| 18 | Sequence | GH |
| 19 | Knock back | GH |

**몬스터**

| 번호 | Name | Token |
|---|---|---|
| 0 | death | DT |
| 1 | neutral | NU |
| 2 | walk | WL |
| 3 | gethit | GH |
| 4 | attack1 | A1 |
| 5 | attack2 | A2 |
| 6 | block | BL |
| 7 | cast | SC |
| 8 | skill1 | S1 |
| 9 | skill2 | S2 |
| 10 | skill3 | S3 |
| 11 | skill4 | S4 |
| 12 | dead | DD |
| 13 | knockback | GH |
| 14 | sequence | xx |
| 15 | run | RN |

**오브젝트**

| 번호 | Name | Token |
|---|---|---|
| 0 | Neutral | NU |
| 1 | Operating | OP |
| 2 | Opened | ON |
| 3 | Special1 | S1 |
| 4 | Special2 | S2 |
| 5 | Special3 | S3 |
| 6 | Special4 | S4 |
| 7 | Special5 | S5 |

## NPC 메뉴 번호

- 출처: kolbot 옛 sdk `npcmenuid.txt`. 원본 표기 그대로(`Ressurect Merc` 철자 포함).
- 쓰는 법: NPC와 대화창을 연 뒤 `Misc.useMenu(0x0D44)`(`Misc.js` `useMenu`가 안에서 `npc.useMenu(번호)`를 부른다). 예: `Town.js` 감정 `Misc.useMenu(0x0FB4)`(261105).

| 번호 | 메뉴 |
|---|---|
| 0x0D35 | Talk |
| 0x0D44 | Trade |
| 0x0D06 | Trade/Repair |
| 0x0FB1 | Imbue |
| 0x0D46 | Gamble |
| 0x0D45 | Hire |
| 0x0D36 | Go East |
| 0x0D37 | Go West |
| 0x0FB4 | Identify Items |
| 0x0D38 | Sail East |
| 0x0D39 | Sail West |
| 0x1507 | Ressurect Merc |
| 0x58DC | Add Sockets |
| 0x58DD | Personalize |
| 0x58D2 | Travel to Harrogath |

## 상점 화면 상태

- 출처: kolbot 옛 sdk `miscscreenmodes.txt`. 원본 표기 그대로.
- 쓰는 법: 미확인. kolbot 코드에 쓰는 곳이 없고, 이 값을 돌려주는 D2BS 함수는 엔진 소스가 이 저장소에 없어 찾지 못했다(261105).

| 번호 | 상태 |
|---|---|
| 1 | npc trade open |
| 2 | buy cursor |
| 3 | sell cursor |
| 4 | repair cursor |
| 5 | sell/buy confirm |
| 10 | trade confirm |
| 11 | trade screen |
| 12 | Stash Open |

## 아이템 기본 스탯 인덱스

- 출처: kolbot 옛 sdk `basestats.txt`(원본 끝: "Initial compilation done by njaguar"). 빈 번호는 원본에 이름이 없는 칸. 괄호 안은 원본 메모.
- 쓰는 법: kolbot은 `getBaseStat("items", classid, "levelreq")`처럼 **열 이름**으로 읽는다(`Pickit.js`·`Town.js`). 아래 번호를 셋째 인자로 넣어 같은 값이 나오는지는 미확인(번호가 `weapons.txt`·`armor.txt` 열 순서와 다르다, 261105).

| 인덱스 | 이름 |
|---|---|
| 0 | AlternateGfx (this is actually a 3-4 letter word) |
| 1 | WeaponClass (this is actually a 3-4 letter word) |
| 2 | TwoHandedWeaponClass (this is actually a 3-4 letter word) |
| 4 | MinAC |
| 5 | MaxAC |
| 6 | BaseGambleCost |
| 7 | BaseAttackSpeed |
| 8 | DurabilityWarning       (ItemRarity in weapons?) |
| 9 | BaseCost |
| 14 | (always FFFFFFFF, probably just a terminator between the DWORDs and single BYTEs) |
| 15 | Version (64 for xpac, 0 for norm) |
| 21 | ItemRarity |
| 22 | BaseItemLevel |
| 23 | MinDmg (also applies to shields dmg) |
| 24 | MaxDmg (also applies to shields dmg) |
| 27 | MinTwoHandDmg |
| 28 | MaxTwoHandDmg |
| 29 | AttackRange |
| 30 | StrBonus |
| 31 | DexBonus |
| 32 | StrReq |
| 33 | DexReq |
| 35 | SizeX |
| 36 | SizeY |
| 37 | BaseBlock |
| 38 | BaseDurability |
| 41 | Component |
| 48 | TwoHanded |
| 50 | Type |
| 51 | (255 in weapons?) |
| 53 | SoundId |
| 55 | Quest |
| 57 | TransTable |
| 59 | LightRadius |
| 65 | DurationWarningWep |
| 68 | MaxSockets |
| 75 | BaseLevelReq |
| 76 | MagicLvl |
| 77 | Transform |
| 78 | InvTrans |
| 167 | Last few of these are probably the NPC sell values (all seem to be 255, which is what it is in the mpq) |
- 원본 79~167: "Last few of these are probably the NPC sell values (all seem to be 255, which is what it is in the mpq)"

## UI 플래그 (`getUIFlag`)

게임 UI 창이 열려 있는지 확인하는 번호(`getUIFlag(번호)`, 261104).

- 출처: D2MOO(1.10f) `source/D2CommonDefinitions/include/D2Constants.h`의 `UI_` 목록. d2bsng PR #60 설명에 1.14d `getUIFlag` 값이 이것과 같다고 컴파일 때 검사한다고 되어 있다.
- 쓰는 법: 함수로 부른다. `getUIFlag(0x0C)` = 상점 창이 열려 있으면 참(`Town.js`). `getUIFlag == 0x0C` 형태가 아니다(261105).
- kolbot 사용처와 맞음: 0x08 `npc.openMenu`, 0x0C `startTrade`, 0x14 `Pather.js` 웨이포인트 화면, 0x19 창고, 0x1A 큐브.

| 번호 | D2MOO 이름 | D2MOO 설명 | MapThread 멈춤 |
|---|---|---|---|
| 0x00 | `UI_GAME` | Game |  |
| 0x01 | `UI_INVENTORY` | Player Inventory | ○ |
| 0x02 | `UI_STATSCREEN` | Player Stat Screen | ○ |
| 0x03 | `UI_MINISKILL` | Skill Selection |  |
| 0x04 | `UI_SKILLTREE` | Player Skill Tree |  |
| 0x05 | `UI_CHATBOX` | Chat Box |  |
| 0x06 | `UI_NEWSTATS` | Red NewStats Button |  |
| 0x07 | `UI_NEWSKILLS` | Red NewSkills Button |  |
| 0x08 | `UI_NPCMENU` | NPC options menu |  |
| 0x09 | `UI_ESCMENU` | Esc Menu | ○ |
| 0x0A | `UI_AUTOMAP` | Automap |  |
| 0x0B | `UI_CONFIG` | Key Configuration Menu |  |
| 0x0C | `UI_NPCSHOP` | NPC Trade | ○ |
| 0x0D | `UI_HOLDALT` | Alt Items Highlight | ○ |
| 0x0E | `UI_ANVIL` | Anvil |  |
| 0x0F | `UI_QUESTSCREEN` | Quest Screen | ○ |
| 0x10 | `UI_INISCROLL` | Inifuss Tree Scroll |  |
| 0x11 | `UI_QUESTLOG` | Quest Log Red Button |  |
| 0x12 | `UI_UNKNOWN18` |  |  |
| 0x13 | `UI_HIRICONS` |  |  |
| 0x14 | `UI_WAYPOINT` | Waypoint Screen |  |
| 0x15 | `UI_MINIPANEL` | CtrlPnl7 Mini Popop Menu |  |
| 0x16 | `UI_PARTYSCREEN` | Multiplayer Party Screen |  |
| 0x17 | `UI_MPTRADE` | Multiplayer Trade |  |
| 0x18 | `UI_MSGLOG` | Messages Log | ○ |
| 0x19 | `UI_STASH` | Player Stash | ○ |
| 0x1A | `UI_CUBE` | Horadric Cube | ○ |
| 0x1B | `UI_STEEGSTONE` | Guild Steeg Stone |  |
| 0x1C | `UI_GUILDVAULT` | Guild Vault |  |
| 0x1D | `UI_UNKNOWN29` |  |  |
| 0x1E | `UI_UNKNOWN30` |  |  |
| 0x1F | `UI_BELTROWS` | Belt Rows Popup |  |
| 0x20 | `UI_UNKNOWN32` |  |  |
| 0x21 | `UI_HELPSCREEN` | Help Screen | ○ |
| 0x22 | `UI_HELPBUTTON` | Help Button |  |
| 0x23 | `UI_HIREICONS` | Party Icons |  |
| 0x24 | `UI_MERCINV` | Mercenary Inventory |  |
| 0x25 | `UI_RECIPESCROLL` | Unused Recipe Scroll |  |

### MapThread·MapHelper에서 쓰는 곳
- `threads/MapThread.js` 메인 루프(20ms)는 `hideFlags`(위 표 ○ 10개) 중 하나라도 열려 있으면 닫힐 때까지 `Hooks.flush(); delay(100)`으로 기다린다. 0x0D는 Alt 키를 누르고 있는 동안이다.
- 자동맵(0x0A)은 멈춤 조건이 아니다. 열리면 그리고(`Hooks.update`), 닫히면 지운다(`Hooks.flush`).
- `threads/MapHelper.js`는 ESC 메뉴(0x09)가 열리면 MapThread를 `pause()`, 닫히면 `resume()`한다.

## spectype (`unit.spectype`)

- 쓰는 법: 비트를 `&`로 본다. `unit.spectype & 0x7` = 보스·챔피언·유니크 중 하나(`Attack.js`), `unit.spectype & 0x1` = "Normal" Boss(아래 표). monsters.md에서 옮김(261105).
- 출처: 사용자 자료 `spectype.png`(원본 표, 출처 표시 없음). 근거: **출처 불명**. 원본 그대로 옮겼다(16줄).
- 원본 열 이름 "monster types to kill" 그대로. 비트: 0x1 "Normal" Boss, 0x2 Champion, 0x4 Boss, 0x8 Minion.

| spectype | monster types to kill |
|---|---|
| 0x0 | all |
| 0x1 | "Normal" Boss |
| 0x2 | Champion |
| 0x3 | "Normal" Boss + Champion |
| 0x4 | Boss |
| 0x5 | "Normal" Boss + Boss |
| 0x6 | Champion + Boss |
| 0x7 | "Normal" Boss + Champion + Boss |
| 0x8 | Minion |
| 0x9 | "Normal" Boss + Minion |
| 0xA | Champion + Minion |
| 0xB | "Normal" Boss + Champion + Minion |
| 0xC | Boss + Minion |
| 0xD | "Normal" Boss + Boss + Minion |
| 0xE | Champion + Boss + Minion |
| 0xF | "Normal" Boss + Champion + Boss + Minion |

## 슈퍼유니크 프리셋 유닛 번호 (`getPresetUnit`)

- 쓰는 법: `getPresetUnit(지역, 1, 번호)`(1 = 몬스터). 예: `getPresetUnit(me.area, 1, 773)`(`AutoSmurf.js`). monsters.md에서 옮김(261105).
- 출처: kolbot 옛 sdk `superunique_presetunitids.txt`(원본 머리말: "this list is correct to the best of my knowledge"). 근거: 웹 미검증. mpqdata에 없는 번호다.

| Id | Name |
|---|---|
| 250 | The Summoner |
| 704 | Bishibosh |
| 705 | Bonebreak |
| 706 | Coldcrow |
| 707 | Rakanishu |
| 708 | Treehead WoodFist |
| 709 | Griswold |
| 710 | The Countess |
| 711 | Pitspawn Fouldog |
| 712 | Flamespike the Crawler |
| 713 | Boneash |
| 714 | Radament |
| 715 | Bloodwitch the Wild |
| 716 | Fangskin |
| 717 | Beetleburst |
| 718 | Leatherarm |
| 719 | Coldworm the Burrower |
| 720 | Fire Eye |
| 721 | Dark Elder |
| 723 | Ancient Kaa the Soulless |
| 724 | The Smith |
| 725 | Web Mage the Burning |
| 726 | Witch Doctor Endugu |
| 727 | Stormtree |
| 728 | Sarina the Battlemaid |
| 729 | Icehawk Riftwing |
| 730 | Ismail Vilehand |
| 731 | Geleb Flamefinger |
| 732 | Bremm Sparkfist |
| 733 | Toorc Icefist |
| 734 | Wyand Voidfinger |
| 735 | Maffer Dragonhand |
| 736 | Winged Death |
| 737 | The Tormentor |
| 738 | Taintbreeder |
| 739 | Riftwraith the Cannibal |
| 740 | Infector of Souls |
| 741 | Lord De Seis |
| 742 | Grand Vizier of Chaos |
| 743 | The Cow King |
| 744 | Corpsefire |
| 745 | Hephasto (The Feature Creep) |
| 746 | Siege Boss |
| 747 | Ancient Barbarian 1 |
| 748 | Ancient Barbarian 2 |
| 749 | Ancient Barbarian 3 |
| 750 | Axe Dweller |
| 751 | Bonesaw Breaker |
| 752 | Dac Farren |
| 753 | Eldritch (Megaflow Rectifier) |
| 754 | Eyeback Unleashed |
| 755 | Threash Socket |
| 756 | Pindleskin |
| 757 | Snapchip Shatter |
| 758 | Anodized Elite |
| 759 | Vinvear Molech |
| 760 | Sharp Tooth Sayer |
| 761 | Magma Torquer |
| 762 | Blaze Ripper |
| 763 | Frozenstein |
| 764 | Nihlathak Boss |
| 765 | Baal Subject 1 |
| 766 | Baal Subject 2 |
| 767 | Baal Subject 3 |
| 768 | Baal Subject 4 |
| 769 | Baal Subject 5 |
| 772 | random boss pack? |
| 773 | random champ pack? |
| 774 | Flavie |
| 775 | Blood Raven |
| 778 | maggot queen (broken?) |
| 787 | flayers |
| 788 | flayer+shaman |
| 792 | ratmen |
| 793 | ratmen+shaman |
| 794 | demonimp pack |
| 796 | enslaved pack |
| 799 | dead enslaved |
| 800 | dead demonimp |
| 801 | dead barb |
| 802 | dead prowlingdead |
