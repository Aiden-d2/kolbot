# 엔진 번호 (코드에서 쓰는 번호표)

아이템 플래그·위치·착용 부위, 유닛 동작 상태(mode), NPC 메뉴, 상점 화면, 아이템 기본 스탯 인덱스, UI 플래그, 몬스터 spectype, 슈퍼유니크 프리셋 번호, 게임 밖 화면 번호.

- 번호와 이름은 영문 그대로.
- 절마다 "쓰는 법"(함수·속성을 쓰는 모양)과 "반환값"(돌려주는 값과 판정 방법)을 적었다. 반환값은 kolbot 코드가 그 값을 쓰는 모양으로 확인한 것이다(D2BS 엔진 소스는 이 저장소에 없다).

## 아이템 플래그 (`item.getFlag(값)`)

- **미검증**: kolbot이 쓰는 0x10(감정)·0x400000(에테리얼) 말고는 확인하지 않았다(`next_steps.md`). 설명 열은 옛 sdk 원문 영어.
- 쓰는 법: `item.getFlag(값)`. 예: `if (item.getFlag(0x10)) { ... }` = 감정된 아이템(`Town.js`), `if (!item.getFlag(0x400000))` = 에테리얼이 아님(`Town.js`).
- 반환값: 켜져 있으면 참, 꺼져 있으면 거짓. kolbot은 `if (…)`·`!`로 참·거짓만 보고 `===`로 비교하지 않는다(코드 38곳). 참일 때의 정확한 값(true인지 숫자인지)은 미확인.

| 값 | 이름 | 설명 |
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

- 쓰는 법: 속성 `item.location`.
- 반환값: 아래 번호(숫자). `===`로 비교한다. 예: `item.location === 7` = 창고에 있는 아이템(`Misc.js`).
- 4번은 뜻을 모른다(`next_steps.md`).

| 번호 | 위치 |
|---|---|
| 1 | Equipped |
| 2 | Belt |
| 3 | Inventory |
| 5 | Trade |
| 6 | Cube |
| 7 | Stash |

## 착용 부위 (`item.bodylocation`)

- 0~10은 mpqdata `bodylocs.txt` 줄 순서(머리줄 다음 첫 줄이 0). 11·12는 무기 스왑 칸(mpqdata에 없음, kolbot `Precast.js`가 `item.bodylocation === 11 || item.bodylocation === 12`로 쓴다).
- 쓰는 법: 속성 `item.bodylocation`(착용하지 않은 아이템은 0).
- 반환값: 아래 번호(숫자). `===`나 `switch`로 비교한다. 예: `item.bodylocation === 4` = 오른손 무기(`Precast.js`).

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

- 번호 = mpqdata `plrmode.txt`·`monmode.txt`·`ObjMode.txt` 줄 순서(머리줄 다음 첫 줄이 0).
- 쓰는 법: 속성 `unit.mode`(`me.mode`도 같다). 유닛 종류(플레이어·몬스터·오브젝트·아이템)마다 아래 표가 다르다.
- 반환값: 아래 번호(숫자). `===`로 비교한다. 예: `unit.mode === 0 || unit.mode === 12` = 죽은 몬스터(`Attack.js`), `me.mode === 10` = 내가 시전 중.

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

**아이템**

- mpqdata에 아이템 mode 표가 없어 kolbot 옛 sdk 번호를 쓴다. kolbot이 쓰는 0·3·5는 아래 뜻과 맞게 쓰인다: `item.mode === 3 || item.mode === 5` = 바닥에 있거나 떨어지는 중인 아이템, `item.mode === 0 && item.location === 3` = 인벤토리 안 아이템(`Pickit.js`).

| 번호 | 설명 |
|---|---|
| 0 | Item inven stash cube store |
| 1 | Item equipped self or merc |
| 2 | Item in belt |
| 3 | Item on ground |
| 4 | Item on cursor |
| 5 | Item being dropped |
| 6 | Item socketed in item |

## NPC 메뉴 번호

- 쓰는 법: NPC와 대화창을 연 뒤 `Misc.useMenu(번호)`. 예: `Town.js` 감정 `Misc.useMenu(0x0FB4)`.
  - `Misc.useMenu`는 대화창 줄(`getDialogLines()`) 중 글자가 `getLocaleString(번호)`를 포함하는 줄을 골라 누른다. 그래서 번호는 메뉴 글자의 문자열 번호다. 0x1507·0x0D44만 줄을 찾지 않고 `npc.useMenu(번호)`를 바로 부른다.
- 반환값(`Misc.useMenu`): 메뉴를 눌렀으면 `true`, 대화창 줄이 없거나 그 메뉴가 없으면 `false`. kolbot은 대부분 반환값을 보지 않는다.
- `Ressurect Merc`은 옛 sdk 철자 그대로.

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

- **미검증**: 이 값을 돌려주는 D2BS 함수를 모른다. kolbot 코드에 쓰는 곳이 없다(`next_steps.md`).

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

- **미검증**: 아래 번호를 셋째 인자로 넣어 같은 값이 나오는지 확인하지 않았다(번호가 `weapons.txt`·`armor.txt` 열 순서와 다르다, `next_steps.md`). 빈 번호는 이름이 없는 칸, 괄호 안은 옛 sdk 메모.
- 쓰는 법: kolbot은 `getBaseStat("items", classid, "levelreq")`처럼 셋째 인자를 **열 이름**으로 준다(`Pickit.js`·`Town.js`). 첫 인자는 표 이름(`"items"`) 또는 번호(`0`)를 쓴다.
- 반환값: 그 칸의 값. 숫자 칸은 숫자(`<=`·`*` 등 계산에 바로 쓴다), `namestr`은 문자열 번호(`getLocaleString`에 넣어 이름을 얻는다).

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
| 79~167 | Last few of these are probably the NPC sell values (all seem to be 255, which is what it is in the mpq) |

## UI 플래그 (`getUIFlag`)

게임 UI 창이 열려 있는지 확인하는 번호.

- 쓰는 법: 함수로 부른다. `getUIFlag(0x0C)` = 상점 창이 열려 있으면 참(`Town.js`). `getUIFlag == 0x0C` 형태가 아니다.
- 반환값: 열려 있으면 참, 아니면 거짓. kolbot은 `if (getUIFlag(…))`·`!getUIFlag(…)`·`return getUIFlag(0x14)`처럼 참·거짓으로만 쓴다(코드 52곳).
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

- **미검증**: 비트마다의 뜻(`next_steps.md`). 비트: 0x1 "Normal" Boss, 0x2 Champion, 0x4 Boss, 0x8 Minion. 표는 비트 조합(열 이름 "monster types to kill"은 원래 표 그대로).
- 쓰는 법: 속성 `unit.spectype`.
- 반환값: 비트를 합친 숫자. 비트는 `&`로 본다: `unit.spectype & 0x7` = 보스·챔피언·유니크 중 하나(`Attack.js`). 일반 몬스터는 0이라 `unit.spectype === 0`으로 본다(`Attacks/Barbarian.js`).

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

- **미검증**: mpqdata에 없는 번호다(`next_steps.md`).
- 쓰는 법: `getPresetUnit(지역, 1, 번호)`(1 = 몬스터, 2 = 오브젝트). 예: `getPresetUnit(me.area, 1, 773)`(`AutoSmurf.js`).
- 반환값: 프리셋 유닛 객체, 없으면 거짓값. kolbot은 `if (!presetUnit)`으로 없음을 보고, 좌표는 `presetUnit.roomx * 5 + presetUnit.x`, `presetUnit.roomy * 5 + presetUnit.y`로 계산한다(`Pather.moveToPreset`).

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

## 게임 밖 화면 번호 (`getLocation()`)

- 이름 = kolbot 다른 판(blizzhackers 계열) `sdk.js` `locations`. 오른쪽 열은 `tools/OOG.js`의 `switch (getLocation())` `case` 주석이고, 주석이 있는 21개는 이름과 뜻이 같다. 주석이 없는 번호는 **미검증**(`next_steps.md`).
- 쓰는 법: 함수 `getLocation()`(인자 없음). 쓰는 곳: `tools/OOG.js`, `D2Bot*.dbj`.
- 반환값: 지금 게임 밖 화면 번호(숫자). `switch (getLocation())`나 `getLocation() === 42`로 비교한다. 게임 밖 콘솔 줄 끝 `(loc N)`의 N이 이 번호다.

| 번호 | sdk.js 이름 | `tools/OOG.js` 주석 |
|---|---|---|
| 0 | None |  |
| 1 | Lobby | Lobby |
| 2 | InLine |  |
| 3 | LobbyChat | Chat |
| 4 | CreateGame |  |
| 5 | JoinGame |  |
| 6 | Ladder |  |
| 7 | Channel | Channel |
| 8 | MainMenu | main menu |
| 9 | Login | login screen |
| 10 | LoginError | login error |
| 11 | UnableToConnect |  |
| 12 | CharSelect | char screen - break |
| 13 | RealmDown | realm down |
| 14 | Disconnected | disconnected? |
| 15 | NewChar | new character |
| 16 | CharacterSelectWait | please wait |
| 17 | LostConnection |  |
| 18 | Splash | splash |
| 19 | KeyInUse |  |
| 20 | Difficulty |  |
| 21 | MainMenuConnecting | connecting |
| 22 | InvalidCDKey |  |
| 23 | Connecting | char screen connecting |
| 24 | ServerDown |  |
| 25 | PleaseWait |  |
| 26 | GameExists |  |
| 27 | Gateway |  |
| 28 | GameDoesNotExist |  |
| 29 | CharacterCreate | Char create |
| 30 | CharacterCreateAlreadyExists | popup |
| 31 | AgreeToTerms | ToU |
| 32 | CreateNewAccount | new account |
| 33 | PleaseRead | please read |
| 34 | RegisterEmail | e-mail |
| 35 | Credits |  |
| 36 | Cinematics |  |
| 37 | CharacterChangeRealm |  |
| 38 | GameIsFull |  |
| 39 | OtherMultiplayer |  |
| 40 | TCPIP |  |
| 41 | EnterIP |  |
| 42 | CharacterSelectNoChars | empty char screen |
| 43 | CharacterSelectChangeRealm |  |
| 44 | CantConnectTCP |  |
