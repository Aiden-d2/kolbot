# 아이템 (`item.itemType`, `item.classid`, `item.quality`, `item.location`, `getFlag`)

nip 키워드(타입·이름·품질·클래스·플래그·스탯)와 번호·한글, 아이템 위치, 착용 부위, 아이템 플래그 (261104).

- 출처:
  - nip 키워드 표: 사용자 자료 `아이템 코드.txt`. 근거: 사용자 자료. 키워드와 번호는 kolbot `tools/NTItemAlias.dbl`이 실제 정의다(아래 대조).
  - 아이템 위치: 사용자 자료 `아이템로케이션.txt`. 근거: 사용자 자료
  - 착용 부위·아이템 플래그: kolbot 옛 sdk `bodylocations.txt`·`itemflags.txt`. 근거: 웹 미검증
- kolbot 사용처: nip 규칙(`NTItemParser.dbl`), `Pickit`, `Storage`, `item.getFlag`, `item.bodylocation`

## 아이템 위치 (`item.location`)

| 번호 | 위치 |
|---|---|
| 1 | 착용 |
| 2 | 벨트 |
| 3 | 인벤 |
| 5 | 거래창 |
| 6 | 큐브 |
| 7 | 스태쉬 |

## 착용 부위 (`item.bodylocation`)

| 번호 | 이름 |
|---|---|
| 0 | `BODYLOC_NONE` |
| 1 | `BODYLOC_HEAD` |
| 2 | `BODYLOC_NECK` |
| 3 | `BODYLOC_TORSO` |
| 4 | `BODYLOC_RIGHT_ARM` |
| 5 | `BODYLOC_LEFT_ARM` |
| 6 | `BODYLOC_RIGHT_RING` |
| 7 | `BODYLOC_LEFT_RING` |
| 8 | `BODYLOC_BELT` |
| 9 | `BODYLOC_FEET` |
| 10 | `BODYLOC_GLOVES` |
| 11 | `BODYLOC_RIGHT_ARM_SECONDARY` |
| 12 | `BODYLOC_LEFT_ARM_SECONDARY` |

## 아이템 플래그 (`item.getFlag(값)`)

원본 영어 설명 그대로(원본 끝: "thanks to bluemind for testing").

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

### NTItemAlias 대조 (261104)

원본 키워드·번호를 `tools/NTItemAlias.dbl`(`NTIPAliasType`·`NTIPAliasClassID`·`NTIPAliasQuality`·`NTIPAliasClass`·`NTIPAliasStat`)과 하나씩 대조했다. 타입 101개, 이름 1297개(코드+별칭), 품질 8, 클래스 3, 스탯 642개.

- 품질·클래스: 모두 같다.
- 타입: `bow quiver`·`crossbow quiver`는 NTItemAlias에 없다(띄어쓰기 없는 이름으로 정의돼 있다). `notused`는 원본이 14·17 두 줄인데 NTItemAlias는 한 이름이라 마지막 값 23이다.
- 이름: `std`(Standard of Heroes)는 원본 653, NTItemAlias 658. mpqdata로 계산하면 무기 306 + 방어구 202 + `misc.txt` 150번째 = 658이라, 아래 표는 658로 고쳤다. `demonhead`는 원본 417(네크 머리)인데 NTItemAlias는 같은 이름을 417·428 두 번 정의해 마지막 값 428(바바리안 헬름)이다. 원본 별칭 `cpa`(306)는 NTItemAlias에 없다(코드 `cap`은 있다).
- 스탯: `itemlightcolor`는 원본에 번호가 `[90`으로 잘려 있다. NTItemAlias 값 90.

## nip 키워드

- 원본은 `[Type] == 키워드`처럼 nip 규칙 모양으로 적었다. 아래 표의 "키워드"가 그 자리에 들어간다.

## 타입 (`[Type]`)

| 키워드 | 번호 | 한글 |
|---|---|---|
| `shield` | 2 | 방패 |
| `armor` | 3 | 갑옷 |
| `gold` | 4 | 골드 |
| `bow quiver` | 5 | 보우 화살통 |
| `crossbow quiver` | 6 | 크로스보우 화살통 |
| `playerbodypart` | 7 |  |
| `herb` | 8 |  |
| `potion` | 9 | 포션 |
| `ring` | 10 | 링 |
| `elixir` | 11 |  |
| `amulet` | 12 | 아뮬렛 |
| `charm` | 13 | 참 |
| `notused` | 14 |  |
| `boots` | 15 | 부츠 |
| `gloves` | 16 | 글러브 |
| `notused` | 17 |  |
| `book` | 18 | 책 |
| `belt` | 19 | 벨트 |
| `gem` | 20 | 보석 |
| `torch` | 21 | 횃불 |
| `scroll` | 22 | 스크롤 |
| `notused` | 23 |  |
| `scepter` | 24 | 셉터 |
| `wand` | 25 | 완드 |
| `staff` | 26 | 스태프 |
| `bow` | 27 | 보우 |
| `axe` | 28 | 도끼 |
| `club` | 29 | 클럽 |
| `sword` | 30 | 검 |
| `hammer` | 31 | 해머 |
| `knife` | 32 | 나이프 |
| `spear` | 33 | 스피어 |
| `polearm` | 34 | 폴암 |
| `crossbow` | 35 | 크로스보우 |
| `mace` | 36 | 메이스 |
| `helm` | 37 | 헬름 |
| `missilepotion` | 38 | 던지는 포션 |
| `quest` | 39 | 퀘스트아이템(공포/증오/파괴키도 줍게됨) |
| `bodypart` | 40 |  |
| `key` | 41 |  |
| `throwingknife` | 42 | 쓰로잉 나이프 |
| `throwingaxe` | 43 | 쓰로잉 액스 |
| `javelin` | 44 | 자벨린 |
| `weapon` | 45 | 모든 무기류 |
| `meleeweapon` | 46 | 근접무기 (아마존 전용창/완드/스태프/메이스/검/어세신 전용무기/오브/액스/스피어/폴암 등) |
| `missileweapon` | 47 | 원거리무기 (아마존 전용보우/보우/크로스보우/아마존 전용 자벨린) |
| `thrownweapon` | 48 |  |
| `comboweapon` | 49 |  |
| `anyarmor` | 50 |  |
| `anyshield` | 51 |  |
| `miscellaneous` | 52 |  |
| `socketfiller` | 53 |  |
| `secondhand` | 54 |  |
| `stavesandrods` | 55 | 셉터/완드/스태프 |
| `missile` | 56 |  |
| `blunt` | 57 |  |
| `jewel` | 58 | 주얼 |
| `classspecific` | 59 |  |
| `amazonitem` | 60 | 아마존 전용 아이템 |
| `barbarianitem` | 61 | 바바리안 전용 아이템 |
| `necromanceritem` | 62 | 네크로맨서 전용 아이템 |
| `paladinitem` | 63 | 팔라딘 전용 아이템 |
| `sorceressitem` | 64 | 소서리스 전용 아이템 |
| `assassinitem` | 65 | 어쌔씬 전용 아이템 |
| `druiditem` | 66 | 드루이드 전용 아이템 |
| `handtohand` | 67 | 어쌔씬 전용 클러 |
| `orb` | 68 | 소서리스 전용 오브 |
| `voodooheads` | 69 | 네크로맨서 전용 방패 |
| `auricshields` | 70 | 팔라딘 전용 방패 |
| `primalhelm` | 71 | 바바리안 전용 헬름 |
| `pelt` | 72 | 드루이드 전용 헬름 |
| `cloak` | 73 |  |
| `rune` | 74 | 룬 |
| `circlet` | 75 | 써클릿(써클릿/코로닛/티아라/다이아뎀) |
| `healingpotion` | 76 | 힐링 포션 |
| `manapotion` | 77 | 마나 포션 |
| `rejuvpotion` | 78 | 활력 포션 |
| `staminapotion` | 79 | 스테미나 포션 |
| `antidotepotion` | 80 | 해독 포션 |
| `thawingpotion` | 81 | 해동 포션 |
| `smallcharm` | 82 | 스몰참 |
| `mediumcharm` | 83 | 라지참 |
| `largecharm` | 84 | 그랜드참 |
| `amazonbow` | 85 | 아마존 전용 보우 |
| `amazonspear` | 86 | 아마존 전용 스피어 |
| `amazonjavelin` | 87 | 아마존 전용 자벨린 |
| `assassinclaw` | 88 | 어쌔씬 전용 클러 |
| `magicbowquiv` | 89 |  |
| `magicxbowquiv` | 90 |  |
| `chippedgem` | 91 | 모든 최하급 보석 (7가지 보석 종류 모두 포함) |
| `flawedgem` | 92 | 모든 하급  보석 (7가지 보석 종류 모두 포함) |
| `standardgem` | 93 | 모든 중급 보석 (7가지 보석 종류 모두 포함) |
| `flawlessgem` | 94 | 모든 상급 보석 (7가지 보석 종류 모두 포함) |
| `perfectgem` | 95 | 모든 최상급 보석 (7가지 보석 종류 모두 포함) |
| `amethyst` | 96 | 모든 자수정 (최하 ~ 최상) |
| `diamond` | 97 | 모든 다이아몬드 (최하 ~ 최상) |
| `emerald` | 98 | 모든 에메랄드 (최하 ~ 최상) |
| `ruby` | 99 | 모든 루비 (최하 ~ 최상) |
| `sapphire` | 100 | 모든 사파이어 (최하 ~ 최상) |
| `topaz` | 101 | 모든 토파즈 (최하 ~ 최상) |
| `skull` | 102 | 모든 스컬 (최하 ~ 최상) |

## 이름 (`[Name]`)

| 코드 | classid | 별칭 | 한글 |
|---|---|---|---|
| `hax` | 0 | `handaxe` |  |
| `axe` | 1 |  |  |
| `2ax` | 2 | `doubleaxe` |  |
| `mpi` | 3 | `militarypick` |  |
| `wax` | 4 | `waraxe` |  |
| `lax` | 5 | `largeaxe` |  |
| `bax` | 6 | `broadaxe` |  |
| `btx` | 7 | `battleaxe` |  |
| `gax` | 8 | `greataxe` |  |
| `gix` | 9 | `giantaxe` |  |
| `wnd` | 10 | `wand` |  |
| `ywn` | 11 | `yewwand` |  |
| `bwn` | 12 | `bonewand` |  |
| `gwn` | 13 | `grimwand` |  |
| `clb` | 14 | `club` |  |
| `scp` | 15 | `scepter` |  |
| `gsc` | 16 | `grandscepter` |  |
| `wsp` | 17 | `warscepter` |  |
| `spc` | 18 | `spikedclub` |  |
| `mac` | 19 | `mace` |  |
| `mst` | 20 | `morningstar` |  |
| `fla` | 21 | `flail` |  |
| `whm` | 22 | `warhammer` |  |
| `mau` | 23 | `maul` |  |
| `gma` | 24 | `greatmaul` |  |
| `ssd` | 25 | `shortsword` |  |
| `scm` | 26 | `scimitar` |  |
| `sbr` | 27 | `sabre` |  |
| `flc` | 28 | `falchion` |  |
| `crs` | 29 | `crystalsword` |  |
| `bsd` | 30 | `broadsword` |  |
| `lsd` | 31 | `longsword` |  |
| `wsd` | 32 | `warsword` |  |
| `2hs` | 33 | `twohandedsword` |  |
| `clm` | 34 | `claymore` |  |
| `gis` | 35 | `giantsword` |  |
| `bsw` | 36 | `bastardsword` |  |
| `flb` | 37 | `flamberge` |  |
| `gsd` | 38 | `greatsword` |  |
| `dgr` | 39 | `dagger` |  |
| `dir` | 40 | `dirk` |  |
| `kri` | 41 | `kris` |  |
| `bld` | 42 | `blade` |  |
| `tkf` | 43 | `throwingknife` |  |
| `tax` | 44 | `throwingaxe` |  |
| `bkf` | 45 | `balancedknife` |  |
| `bal` | 46 | `balancedaxe` |  |
| `jav` | 47 | `javelin` |  |
| `pil` | 48 | `pilum` |  |
| `ssp` | 49 | `shortspear` |  |
| `glv` | 50 | `glaive` |  |
| `tsp` | 51 | `throwingspear` |  |
| `spr` | 52 | `spear` |  |
| `tri` | 53 | `trident` |  |
| `brn` | 54 | `brandistock` |  |
| `spt` | 55 | `spetum` |  |
| `pik` | 56 | `pike` |  |
| `bar` | 57 | `bardiche` |  |
| `vou` | 58 | `voulge` |  |
| `scy` | 59 | `scythe` |  |
| `pax` | 60 | `poleaxe` |  |
| `hal` | 61 | `halberd` |  |
| `wsc` | 62 | `warscythe` |  |
| `sst` | 63 | `shortstaff` |  |
| `lst` | 64 | `longstaff` |  |
| `cst` | 65 | `gnarledstaff` |  |
| `bst` | 66 | `battlestaff` |  |
| `wst` | 67 | `warstaff` |  |
| `sbw` | 68 | `shortbow` |  |
| `hbw` | 69 | `hunter'sbow` |  |
| `lbw` | 70 | `longbow` |  |
| `cbw` | 71 | `compositebow` |  |
| `sbb` | 72 | `shortbattlebow` |  |
| `lbb` | 73 | `longbattlebow` |  |
| `swb` | 74 | `shortwarbow` |  |
| `lwb` | 75 | `longwarbow` |  |
| `lxb` | 76 | `lightcrossbow` |  |
| `mxb` | 77 | `crossbow` |  |
| `hxb` | 78 | `heavycrossbow` |  |
| `rxb` | 79 | `repeatingcrossbow` |  |
| `gps` | 80 | `rancidgaspotion` |  |
| `ops` | 81 | `oilpotion` |  |
| `gpm` | 82 | `chokinggaspotion` |  |
| `opm` | 83 | `explodingpotion` |  |
| `gpl` | 84 | `stranglinggaspotion` |  |
| `opl` | 85 | `fulminatingpotion` |  |
| `d33` | 86 | `decoygidbinn` |  |
| `g33` | 87 | `thegidbinn` |  |
| `leg` | 88 | `wirt'sleg` |  |
| `hdm` | 89 | `horadricmalus` |  |
| `hfh` | 90 | `hellforgehammer` |  |
| `hst` | 91 | `horadricstaff` |  |
| `msf` | 92 | `shaftofthehoradricstaff` |  |
| `9ha` | 93 | `hatchet` |  |
| `9ax` | 94 | `cleaver` |  |
| `92a` | 95 | `twinaxe` |  |
| `9mp` | 96 | `crowbill` |  |
| `9wa` | 97 | `naga` |  |
| `9la` | 98 | `militaryaxe` |  |
| `9ba` | 99 | `beardedaxe` |  |
| `9bt` | 100 | `tabar` |  |
| `9ga` | 101 | `gothicaxe` |  |
| `9gi` | 102 | `ancientaxe` |  |
| `9wn` | 103 | `burntwand` |  |
| `9yw` | 104 | `petrifiedwand` |  |
| `9bw` | 105 | `tombwand` |  |
| `9gw` | 106 | `gravewand` |  |
| `9cl` | 107 | `cudgel` |  |
| `9sc` | 108 | `runescepter` |  |
| `9qs` | 109 | `holywatersprinkler` |  |
| `9ws` | 110 | `divinescepter` |  |
| `9sp` | 111 | `barbedclub` |  |
| `9ma` | 112 | `flangedmace` |  |
| `9mt` | 113 | `jaggedstar` |  |
| `9fl` | 114 | `knout` |  |
| `9wh` | 115 | `battlehammer` |  |
| `9m9` | 116 | `warclub` |  |
| `9gm` | 117 | `marteldefer` |  |
| `9ss` | 118 | `gladius` |  |
| `9sm` | 119 | `cutlass` |  |
| `9sb` | 120 | `shamshir` |  |
| `9fc` | 121 | `tulwar` |  |
| `9cr` | 122 | `dimensionalblade` |  |
| `9bs` | 123 | `battlesword` |  |
| `9ls` | 124 | `runesword` |  |
| `9wd` | 125 | `ancientsword` |  |
| `92h` | 126 | `espandon` |  |
| `9cm` | 127 | `dacianfalx` |  |
| `9gs` | 128 | `tusksword` |  |
| `9b9` | 129 | `gothicsword` |  |
| `9fb` | 130 | `zweihander` |  |
| `9gd` | 131 | `executionersword` |  |
| `9dg` | 132 | `poignard` |  |
| `9di` | 133 | `rondel` |  |
| `9kr` | 134 | `cinquedeas` |  |
| `9bl` | 135 | `stiletto` |  |
| `9tk` | 136 | `battledart` |  |
| `9ta` | 137 | `francisca` |  |
| `9bk` | 138 | `wardart` |  |
| `9b8` | 139 | `hurlbat` |  |
| `9ja` | 140 | `warjavelin` |  |
| `9pi` | 141 | `greatpilum` |  |
| `9s9` | 142 | `simbilan` |  |
| `9gl` | 143 | `spiculum` |  |
| `9ts` | 144 | `harpoon` |  |
| `9sr` | 145 | `warspear` |  |
| `9tr` | 146 | `fuscina` |  |
| `9br` | 147 | `warfork` |  |
| `9st` | 148 | `yari` |  |
| `9p9` | 149 | `lance` |  |
| `9b7` | 150 | `lochaberaxe` |  |
| `9vo` | 151 | `bill` |  |
| `9s8` | 152 | `battlescythe` |  |
| `9pa` | 153 | `partizan` |  |
| `9h9` | 154 | `becdecorbin` |  |
| `9wc` | 155 | `grimscythe` |  |
| `8ss` | 156 | `jostaff` |  |
| `8ls` | 157 | `quarterstaff` |  |
| `8cs` | 158 | `cedarstaff` |  |
| `8bs` | 159 | `gothicstaff` |  |
| `8ws` | 160 | `runestaff` |  |
| `8sb` | 161 | `edgebow` |  |
| `8hb` | 162 | `razorbow` |  |
| `8lb` | 163 | `cedarbow` |  |
| `8cb` | 164 | `doublebow` |  |
| `8s8` | 165 | `shortsiegebow` |  |
| `8l8` | 166 | `largesiegebow` |  |
| `8sw` | 167 | `runebow` |  |
| `8lw` | 168 | `gothicbow` |  |
| `8lx` | 169 | `arbalest` |  |
| `8mx` | 170 | `siegecrossbow` |  |
| `8hx` | 171 | `ballista` |  |
| `8rx` | 172 | `chukonu` |  |
| `qf1` | 173 | `khalim'sflail` |  |
| `qf2` | 174 | `khalim'swill` |  |
| `ktr` | 175 | `katar` |  |
| `wrb` | 176 | `wristblade` |  |
| `axf` | 177 | `hatchethands` |  |
| `ces` | 178 | `cestus` |  |
| `clw` | 179 | `claws` |  |
| `btl` | 180 | `bladetalons` |  |
| `skr` | 181 | `scissorskatar` |  |
| `9ar` | 182 | `quhab` |  |
| `9wb` | 183 | `wristspike` |  |
| `9xf` | 184 | `fascia` |  |
| `9cs` | 185 | `handscythe` |  |
| `9lw` | 186 | `greaterclaws` |  |
| `9tw` | 187 | `greatertalons` |  |
| `9qr` | 188 | `scissorsquhab` |  |
| `7ar` | 189 | `suwayyah` |  |
| `7wb` | 190 | `wristsword` |  |
| `7xf` | 191 | `warfist` |  |
| `7cs` | 192 | `battlecestus` |  |
| `7lw` | 193 | `feralclaws` |  |
| `7tw` | 194 | `runictalons` |  |
| `7qr` | 195 | `scissorssuwayyah` |  |
| `7ha` | 196 | `tomahawk` |  |
| `7ax` | 197 | `smallcrescent` |  |
| `72a` | 198 | `ettinaxe` |  |
| `7mp` | 199 | `warspike` |  |
| `7wa` | 200 | `berserkeraxe` |  |
| `7la` | 201 | `feralaxe` |  |
| `7ba` | 202 | `silveredgedaxe` |  |
| `7bt` | 203 | `decapitator` |  |
| `7ga` | 204 | `championaxe` |  |
| `7gi` | 205 | `gloriousaxe` |  |
| `7wn` | 206 | `polishedwand` |  |
| `7yw` | 207 | `ghostwand` |  |
| `7bw` | 208 | `lichwand` |  |
| `7gw` | 209 | `unearthedwand` |  |
| `7cl` | 210 | `truncheon` |  |
| `7sc` | 211 | `mightyscepter` |  |
| `7qs` | 212 | `seraphrod` |  |
| `7ws` | 213 | `caduceus` |  |
| `7sp` | 214 | `tyrantclub` |  |
| `7ma` | 215 | `reinforcedmace` |  |
| `7mt` | 216 | `devilstar` |  |
| `7fl` | 217 | `scourge` |  |
| `7wh` | 218 | `legendarymallet` |  |
| `7m7` | 219 | `ogremaul` |  |
| `7gm` | 220 | `thundermaul` |  |
| `7ss` | 221 | `falcata` |  |
| `7sm` | 222 | `ataghan` |  |
| `7sb` | 223 | `elegantblade` |  |
| `7fc` | 224 | `hydraedge` |  |
| `7cr` | 225 | `phaseblade` |  |
| `7bs` | 226 | `conquestsword` |  |
| `7ls` | 227 | `crypticsword` |  |
| `7wd` | 228 | `mythicalsword` |  |
| `72h` | 229 | `legendsword` |  |
| `7cm` | 230 | `highlandblade` |  |
| `7gs` | 231 | `balrogblade` |  |
| `7b7` | 232 | `championsword` |  |
| `7fb` | 233 | `colossussword` |  |
| `7gd` | 234 | `colossusblade` |  |
| `7dg` | 235 | `boneknife` |  |
| `7di` | 236 | `mithrilpoint` |  |
| `7kr` | 237 | `fangedknife` |  |
| `7bl` | 238 | `legendspike` |  |
| `7tk` | 239 | `flyingknife` |  |
| `7ta` | 240 | `flyingaxe` |  |
| `7bk` | 241 | `wingedknife` |  |
| `7b8` | 242 | `wingedaxe` |  |
| `7ja` | 243 | `hyperionjavelin` |  |
| `7pi` | 244 | `stygianpilum` |  |
| `7s7` | 245 | `balrogspear` |  |
| `7gl` | 246 | `ghostglaive` |  |
| `7ts` | 247 | `wingedharpoon` |  |
| `7sr` | 248 | `hyperionspear` |  |
| `7tr` | 249 | `stygianpike` |  |
| `7br` | 250 | `mancatcher` |  |
| `7st` | 251 | `ghostspear` |  |
| `7p7` | 252 | `warpike` |  |
| `7o7` | 253 | `ogreaxe` |  |
| `7vo` | 254 | `colossusvoulge` |  |
| `7s8` | 255 | `thresher` |  |
| `7pa` | 256 | `crypticaxe` |  |
| `7h7` | 257 | `greatpoleaxe` |  |
| `7wc` | 258 | `giantthresher` |  |
| `6ss` | 259 | `walkingstick` |  |
| `6ls` | 260 | `stalagmite` |  |
| `6cs` | 261 | `elderstaff` |  |
| `6bs` | 262 | `shillelagh` |  |
| `6ws` | 263 | `archonstaff` |  |
| `6sb` | 264 | `spiderbow` |  |
| `6hb` | 265 | `bladebow` |  |
| `6lb` | 266 | `shadowbow` |  |
| `6cb` | 267 | `greatbow` |  |
| `6s7` | 268 | `diamondbow` |  |
| `6l7` | 269 | `crusaderbow` |  |
| `6sw` | 270 | `wardbow` |  |
| `6lw` | 271 | `hydrabow` |  |
| `6lx` | 272 | `pelletbow` |  |
| `6mx` | 273 | `gorgoncrossbow` |  |
| `6hx` | 274 | `colossuscrossbow` |  |
| `6rx` | 275 | `demoncrossbow` |  |
| `ob1` | 276 | `eagleorb` |  |
| `ob2` | 277 | `sacredglobe` |  |
| `ob3` | 278 | `smokedsphere` |  |
| `ob4` | 279 | `claspedorb` |  |
| `ob5` | 280 | `jared'sstone` |  |
| `am1` | 281 | `stagbow` |  |
| `am2` | 282 | `reflexbow` |  |
| `am3` | 283 | `maidenspear` |  |
| `am4` | 284 | `maidenpike` |  |
| `am5` | 285 | `maidenjavelin` |  |
| `ob6` | 286 | `glowingorb` |  |
| `ob7` | 287 | `crystallineglobe` |  |
| `ob8` | 288 | `cloudysphere` |  |
| `ob9` | 289 | `sparklingball` |  |
| `oba` | 290 | `swirlingcrystal` |  |
| `am6` | 291 | `ashwoodbow` |  |
| `am7` | 292 | `ceremonialbow` |  |
| `am8` | 293 | `ceremonialspear` |  |
| `am9` | 294 | `ceremonialpike` |  |
| `ama` | 295 | `ceremonialjavelin` |  |
| `obb` | 296 | `heavenlystone` |  |
| `obc` | 297 | `eldritchorb` |  |
| `obd` | 298 | `demonheart` |  |
| `obe` | 299 | `vortexorb` |  |
| `obf` | 300 | `dimensionalshard` |  |
| `amb` | 301 | `matriarchalbow` |  |
| `amc` | 302 | `grandmatronbow` |  |
| `amd` | 303 | `matriarchalspear` |  |
| `ame` | 304 | `matriarchalpike` |  |
| `amf` | 305 | `matriarchaljavelin` |  |
| `cap` | 306 | `cpa` | 캡 |
| `skp` | 307 | `skullcap` | 스컬 캡 |
| `hlm` | 308 | `helm` | 헬름 |
| `fhl` | 309 | `fullhelm` | 풀 헬름 |
| `ghm` | 310 | `greathelm` | 그레이트 헬름 |
| `crn` | 311 | `crown` | 크라운 |
| `msk` | 312 | `mask` | 마스크 |
| `qui` | 313 | `quiltedarmor` | 퀄트 아머 |
| `lea` | 314 | `leatherarmor` | 레더 아머 |
| `hla` | 315 | `hardleatherarmor` | 하드 레더 아머 |
| `stu` | 316 | `studdedleather` | 스터디드 레더 |
| `rng` | 317 | `ringmail` | 링 메일 |
| `scl` | 318 | `scalemail` | 스케일 메일 |
| `chn` | 319 | `chainmail` | 체인 메일 |
| `brs` | 320 | `breastplate` | 브레스트 플레이트 |
| `spl` | 321 | `splintmail` | 스플린트 메일 |
| `plt` | 322 | `platemail` | 플레이트 메일 |
| `fld` | 323 | `fieldplate` | 필드 플레이트 |
| `gth` | 324 | `gothicplate` | 고딕 플레이트 |
| `ful` | 325 | `fullplatemail` | 풀 플레이트 메일 |
| `aar` | 326 | `ancientarmor` | 에인션트 아머 |
| `ltp` | 327 | `lightplate` | 라이트 플레이트 |
| `buc` | 328 | `buckler` | 버클러 |
| `sml` | 329 | `smallshield` | 스몰 쉴드 |
| `lrg` | 330 | `largeshield` | 라지 쉴드 |
| `kit` | 331 | `kiteshield` | 카이트 쉴드 |
| `tow` | 332 | `towershield` | 타워 쉴드 |
| `gts` | 333 | `gothicshield` | 고딕 쉴드 |
| `lgl` | 334 | `leathergloves` | 레더 글러브 |
| `vgl` | 335 | `heavygloves` | 헤비 글러브 |
| `mgl` | 336 | `chaingloves` | 체인 글러브 |
| `tgl` | 337 | `lightgauntlets` | 라이트 건틀렛 |
| `hgl` | 338 | `gauntlets` | 건틀렛 |
| `lbt` | 339 | `boots` | 레더 부츠 |
| `vbt` | 340 | `heavyboots` | 헤비 부츠 |
| `mbt` | 341 | `chainboots` | 체인 부츠 |
| `tbt` | 342 | `lightplatedboots` | 라이트 플레이트 부츠 |
| `hbt` | 343 | `greaves` | 그리브 |
| `lbl` | 344 | `sash` | 섀시 |
| `vbl` | 345 | `lightbelt` | 라이트 벨트 |
| `mbl` | 346 | `belt` | 벨트 |
| `tbl` | 347 | `heavybelt` | 헤비 벨트 |
| `hbl` | 348 | `platedbelt` | 플레이트 벨트 |
| `bhm` | 349 | `bonehelm` | 본 헬름 |
| `bsh` | 350 | `boneshield` | 본 쉴드 |
| `spk` | 351 | `spikedshield` | 스파이크 쉴드 |
| `xap` | 352 | `warhat` | 워 햇 |
| `xkp` | 353 | `sallet` | 샐릿 |
| `xlm` | 354 | `casque` | 캐스트 |
| `xhl` | 355 | `basinet` | 바시넷 |
| `xhm` | 356 | `wingedhelm` | 윙드 헬름 |
| `xrn` | 357 | `grandcrown` | 그랜드 크라운 |
| `xsk` | 358 | `deathmask` | 데스 마스크 |
| `xui` | 359 | `ghostarmor` | 고스트 아머 |
| `xea` | 360 | `serpentskinarmor` | 서펜스킨 아머 |
| `xla` | 361 | `demonhidearmor` | 데몬하이드 아머 |
| `xtu` | 362 | `trellisedarmor` | 트릴리스트 아머 |
| `xng` | 363 | `linkedmail` | 링크드 메일 |
| `xcl` | 364 | `tigulatedmail` | 티귤레이티드 메일 |
| `xhn` | 365 | `mesharmor` |  |
| `xrs` | 366 | `cuirass` | 퀴레스 |
| `xpl` | 367 | `russetarmor` |  |
| `xlt` | 368 | `templarcoat` |  |
| `xld` | 369 | `sharktootharmor` |  |
| `xth` | 370 | `embossedplate` |  |
| `xul` | 371 | `chaosarmor` |  |
| `xar` | 372 | `ornateplate` |  |
| `xtp` | 373 | `mageplate` |  |
| `xuc` | 374 | `defender` |  |
| `xml` | 375 | `roundshield` |  |
| `xrg` | 376 | `scutum` |  |
| `xit` | 377 | `dragonshield` |  |
| `xow` | 378 | `pavise` |  |
| `xts` | 379 | `ancientshield` |  |
| `xlg` | 380 | `demonhidegloves` |  |
| `xvg` | 381 | `sharkskingloves` |  |
| `xmg` | 382 | `heavybracers` |  |
| `xtg` | 383 | `battlegauntlets` |  |
| `xhg` | 384 | `wargauntlets` |  |
| `xlb` | 385 | `demonhideboots` |  |
| `xvb` | 386 | `sharkskinboots` |  |
| `xmb` | 387 | `meshboots` |  |
| `xtb` | 388 | `battleboots` |  |
| `xhb` | 389 | `warboots` |  |
| `zlb` | 390 | `demonhidesash` |  |
| `zvb` | 391 | `sharkskinbelt` |  |
| `zmb` | 392 | `meshbelt` |  |
| `ztb` | 393 | `battlebelt` |  |
| `zhb` | 394 | `warbelt` |  |
| `xh9` | 395 | `grimhelm` | 그림 헬름 |
| `xsh` | 396 | `grimshield` |  |
| `xpk` | 397 | `barbedshield` |  |
| `dr1` | 398 | `wolfhead` |  |
| `dr2` | 399 | `hawkhelm` |  |
| `dr3` | 400 | `antlers` |  |
| `dr4` | 401 | `falconmask` |  |
| `dr5` | 402 | `spiritmask` |  |
| `ba1` | 403 | `jawbonecap` |  |
| `ba2` | 404 | `fangedhelm` |  |
| `ba3` | 405 | `hornedhelm` |  |
| `ba4` | 406 | `assaulthelmet` |  |
| `ba5` | 407 | `avengerguard` |  |
| `pa1` | 408 | `targe` |  |
| `pa2` | 409 | `rondache` |  |
| `pa3` | 410 | `heraldicshield` |  |
| `pa4` | 411 | `aerinshield` |  |
| `pa5` | 412 | `crownshield` |  |
| `ne1` | 413 | `preservedhead` |  |
| `ne2` | 414 | `zombiehead` |  |
| `ne3` | 415 | `unravellerhead` |  |
| `ne4` | 416 | `gargoylehead` |  |
| `ne5` | 417 | `demonhead` |  |
| `ci0` | 418 | `circlet` |  |
| `ci1` | 419 | `coronet` |  |
| `ci2` | 420 | `tiara` |  |
| `ci3` | 421 | `diadem` |  |
| `uap` | 422 | `shako` |  |
| `ukp` | 423 | `hydraskull` |  |
| `ulm` | 424 | `armet` |  |
| `uhl` | 425 | `giantconch` |  |
| `uhm` | 426 | `spiredhelm` |  |
| `urn` | 427 | `corona` |  |
| `usk` | 428 | `demonhead` |  |
| `uui` | 429 | `duskshroud` |  |
| `uea` | 430 | `wyrmhide` |  |
| `ula` | 431 | `scarabhusk` |  |
| `utu` | 432 | `wirefleece` |  |
| `ung` | 433 | `diamondmail` |  |
| `ucl` | 434 | `loricatedmail` |  |
| `uhn` | 435 | `boneweave` |  |
| `urs` | 436 | `greathauberk` |  |
| `upl` | 437 | `balrogskin` |  |
| `ult` | 438 | `hellforgeplate` |  |
| `uld` | 439 | `krakenshell` |  |
| `uth` | 440 | `lacqueredplate` |  |
| `uul` | 441 | `shadowplate` |  |
| `uar` | 442 | `sacredarmor` |  |
| `utp` | 443 | `archonplate` |  |
| `uuc` | 444 | `heater` |  |
| `uml` | 445 | `luna` |  |
| `urg` | 446 | `hyperion` |  |
| `uit` | 447 | `monarch` | 모너크 |
| `uow` | 448 | `aegis` |  |
| `uts` | 449 | `ward` |  |
| `ulg` | 450 | `bramblemitts` |  |
| `uvg` | 451 | `vampirebonegloves` |  |
| `umg` | 452 | `vambraces` |  |
| `utg` | 453 | `crusadergauntlets` |  |
| `uhg` | 454 | `ogregauntlets` |  |
| `ulb` | 455 | `wyrmhideboots` |  |
| `uvb` | 456 | `scarabshellboots` |  |
| `umb` | 457 | `boneweaveboots` |  |
| `utb` | 458 | `mirroredboots` |  |
| `uhb` | 459 | `myrmidongreaves` |  |
| `ulc` | 460 | `spiderwebsash` |  |
| `uvc` | 461 | `vampirefangbelt` |  |
| `umc` | 462 | `mithrilcoil` |  |
| `utc` | 463 | `trollbelt` |  |
| `uhc` | 464 | `colossusgirdle` |  |
| `uh9` | 465 | `bonevisage` |  |
| `ush` | 466 | `trollnest` |  |
| `upk` | 467 | `bladebarrier` |  |
| `dr6` | 468 | `alphahelm` |  |
| `dr7` | 469 | `griffonheaddress` |  |
| `dr8` | 470 | `hunter'sguise` |  |
| `dr9` | 471 | `sacredfeathers` |  |
| `dra` | 472 | `totemicmask` |  |
| `ba6` | 473 | `jawbonevisor` |  |
| `ba7` | 474 | `lionhelm` |  |
| `ba8` | 475 | `ragemask` |  |
| `ba9` | 476 | `savagehelmet` |  |
| `baa` | 477 | `slayerguard` |  |
| `pa6` | 478 | `akarantarge` |  |
| `pa7` | 479 | `akaranrondache` |  |
| `pa8` | 480 | `protectorshield` |  |
| `pa9` | 481 | `gildedshield` |  |
| `paa` | 482 | `royalshield` |  |
| `ne6` | 483 | `mummifiedtrophy` |  |
| `ne7` | 484 | `fetishtrophy` |  |
| `ne8` | 485 | `sextontrophy` |  |
| `ne9` | 486 | `cantortrophy` |  |
| `nea` | 487 | `hierophanttrophy` |  |
| `drb` | 488 | `bloodspirit` |  |
| `drc` | 489 | `sunspirit` |  |
| `drd` | 490 | `earthspirit` |  |
| `dre` | 491 | `skyspirit` |  |
| `drf` | 492 | `dreamspirit` |  |
| `bab` | 493 | `carnagehelm` |  |
| `bac` | 494 | `furyvisor` |  |
| `bad` | 495 | `destroyerhelm` |  |
| `bae` | 496 | `conquerorcrown` |  |
| `baf` | 497 | `guardiancrown` |  |
| `pab` | 498 | `sacredtarge` | 세이크리드 타아지 |
| `pac` | 499 | `sacredrondache` | 세이크리드 론다쉬 |
| `pad` | 500 | `kurastshield` | 쿠라스트 쉴드 |
| `pae` | 501 | `zakarumshield` | 자카럼 쉴드 |
| `paf` | 502 | `vortexshield` | 보어텍스 쉴드 |
| `neb` | 503 | `minionskull` |  |
| `neg` | 504 | `hellspawnskull` |  |
| `ned` | 505 | `overseerskull` |  |
| `nee` | 506 | `succubusskull` |  |
| `nef` | 507 | `bloodlordskull` |  |
| `elx` | 508 | `elixir` |  |
| `hpo` | 509 |  |  |
| `mpo` | 510 |  |  |
| `hpf` | 511 |  |  |
| `mpf` | 512 |  |  |
| `vps` | 513 | `staminapotion` |  |
| `yps` | 514 | `antidotepotion` |  |
| `rvs` | 515 | `rejuvenationpotion` |  |
| `rvl` | 516 | `fullrejuvenationpotion` |  |
| `wms` | 517 | `thawingpotion` |  |
| `tbk` | 518 | `tomeoftownportal` |  |
| `ibk` | 519 | `tomeofidentify` |  |
| `amu` | 520 | `amulet` |  |
| `vip` | 521 | `topofthehoradricstaff` |  |
| `rin` | 522 | `ring` |  |
| `gld` | 523 | `gold` |  |
| `bks` | 524 | `scrollofinifuss` |  |
| `bkd` | 525 | `keytothecairnstones` |  |
| `aqv` | 526 | `arrows` |  |
| `tch` | 527 | `torch` |  |
| `cqv` | 528 | `bolts` |  |
| `tsc` | 529 | `scrolloftownportal` |  |
| `isc` | 530 | `scrollofidentify` |  |
| `hrt` | 531 | `heart` |  |
| `brz` | 532 | `brain` |  |
| `jaw` | 533 | `jawbone` |  |
| `eyz` | 534 | `eye` |  |
| `hrn` | 535 | `horn` |  |
| `tal` | 536 | `tail` |  |
| `flg` | 537 | `flag` |  |
| `fng` | 538 | `fang` |  |
| `qll` | 539 | `quill` |  |
| `sol` | 540 | `soul` |  |
| `scz` | 541 | `scalp` |  |
| `spe` | 542 | `spleen` |  |
| `key` | 543 |  |  |
| `luv` | 544 | `theblacktowerkey` |  |
| `xyz` | 545 | `potionoflife` |  |
| `j34` | 546 | `ajadefigurine` |  |
| `g34` | 547 | `thegoldenbird` |  |
| `bbb` | 548 | `lamesen'stome` |  |
| `box` | 549 | `horadriccube` |  |
| `tr1` | 550 | `horadricscroll` |  |
| `mss` | 551 | `mephisto'ssoulstone` |  |
| `ass` | 552 | `bookofskill` |  |
| `qey` | 553 | `khalim'seye` |  |
| `qhr` | 554 | `khalim'sheart` |  |
| `qbr` | 555 | `khalim'sbrain` |  |
| `ear` | 556 |  |  |
| `gcv` | 557 | `chippedamethyst` | 최하급 자수정 |
| `gfv` | 558 | `flawedamethyst` | 하급 자수정 |
| `gsv` | 559 | `amethyst` | 자수정 |
| `gzv` | 560 | `flawlessamethyst` | 상급 자수정 |
| `gpv` | 561 | `perfectamethyst` | 최상급 자수정 |
| `gcy` | 562 | `chippedtopaz` | 최하급 토파즈 |
| `gfy` | 563 | `flawedtopaz` | 하급 토파즈 |
| `gsy` | 564 | `topaz` | 토파즈 |
| `gly` | 565 | `flawlesstopaz` | 상급 토파즈 |
| `gpy` | 566 | `perfecttopaz` | 최상급 토파즈 |
| `gcb` | 567 | `chippedsapphire` | 최하급 사파이어 |
| `gfb` | 568 | `flawedsapphire` | 하급 사파이어 |
| `gsb` | 569 | `sapphire` | 사파이어 |
| `glb` | 570 | `flawlesssapphire` | 상급 사파이어 |
| `gpb` | 571 | `perfectsapphire` | 최상급 사파이어 |
| `gcg` | 572 | `chippedemerald` | 최하급 에메랄드 |
| `gfg` | 573 | `flawedemerald` | 하급 에메랄드 |
| `gsg` | 574 | `emerald` | 에메랄드 |
| `glg` | 575 | `flawlessemerald` | 상급 에메랄드 |
| `gpg` | 576 | `perfectemerald` | 최상급 에메랄드 |
| `gcr` | 577 | `chippedruby` | 최하급 루비 |
| `gfr` | 578 | `flawedruby` | 하급 루비 |
| `gsr` | 579 | `ruby` | 루비 |
| `glr` | 580 | `flawlessruby` | 상급 루비 |
| `gpr` | 581 | `perfectruby` | 최상급 루비 |
| `gcw` | 582 | `chippeddiamond` | 최하급 다이아몬드 |
| `gfw` | 583 | `flaweddiamond` | 하급 다이아몬드 |
| `gsw` | 584 | `diamond` | 다이아몬드 |
| `glw` | 585 | `flawlessdiamond` | 상급 다이아몬드 |
| `gpw` | 586 | `perfectdiamond` | 최상급 다이아몬드 |
| `hp1` | 587 | `minorhealingpotion` |  |
| `hp2` | 588 | `lighthealingpotion` |  |
| `hp3` | 589 | `healingpotion` |  |
| `hp4` | 590 | `greaterhealingpotion` |  |
| `hp5` | 591 | `superhealingpotion` |  |
| `mp1` | 592 | `minormanapotion` |  |
| `mp2` | 593 | `lightmanapotion` |  |
| `mp3` | 594 | `manapotion` |  |
| `mp4` | 595 | `greatermanapotion` |  |
| `mp5` | 596 | `supermanapotion` |  |
| `skc` | 597 | `chippedskull` | 최하급 스컬 |
| `skf` | 598 | `flawedskull` | 하급 스컬 |
| `sku` | 599 | `skull` | 스컬 |
| `skl` | 600 | `flawlessskull` | 상급 스컬 |
| `skz` | 601 | `perfectskull` | 최상급 스컬 |
| `hrb` | 602 | `herb` |  |
| `cm1` | 603 | `smallcharm` | 스몰 차암 |
| `cm2` | 604 | `largecharm` | 라지 차암 |
| `cm3` | 605 | `grandcharm` | 그랜드 차암 |
| `rps` | 606 |  |  |
| `rpl` | 607 |  |  |
| `bps` | 608 |  |  |
| `bpl` | 609 |  |  |
| `r01` | 610 | `elrune` | 엘 룬 |
| `r02` | 611 | `eldrune` | 엘드 룬 |
| `r03` | 612 | `tirrune` | 티르 룬 |
| `r04` | 613 | `nefrune` | 네프 룬 |
| `r05` | 614 | `ethrune` | 에드 룬 |
| `r06` | 615 | `ithrune` | 아이드 룬 |
| `r07` | 616 | `talrune` | 탈 룬 |
| `r08` | 617 | `ralrune` | 랄 룬 |
| `r09` | 618 | `ortrune` | 오르트 룬 |
| `r10` | 619 | `thulrune` | 주울 룬 |
| `r11` | 620 | `amnrune` | 앰 룬 |
| `r12` | 621 | `solrune` | 솔룬 |
| `r13` | 622 | `shaelrune` | 샤엘 룬 |
| `r14` | 623 | `dolrune` | 돌 룬 |
| `r15` | 624 | `helrune` | 헬 룬 |
| `r16` | 625 | `iorune` | 포 룬(아이오 룬) |
| `r17` | 626 | `lumrune` | 룸 룬 |
| `r18` | 627 | `korune` | 코 룬 |
| `r19` | 628 | `falrune` | 팔 룬 |
| `r20` | 629 | `lemrune` | 렘 룬 |
| `r21` | 630 | `pulrune` | 풀 룬 |
| `r22` | 631 | `umrune` | 움 룬(우움 룬) |
| `r23` | 632 | `malrune` | 말 룬 |
| `r24` | 633 | `istrune` | 아이스트 룬(이슷 룬) |
| `r25` | 634 | `gulrune` | 굴 룬 |
| `r26` | 635 | `vexrune` | 벡스 룬 |
| `r27` | 636 | `ohmrune` | 옴 룬(오움 룬) |
| `r28` | 637 | `lorune` | 로 룬 |
| `r29` | 638 | `surrune` | 수르 룬 |
| `r30` | 639 | `berrune` | 베르 룬 |
| `r31` | 640 | `jahrune` | 자 룬(조 룬) |
| `r32` | 641 | `chamrune` | 참 룬(차암 룬) |
| `r33` | 642 | `zodrune` | 조드룬 |
| `jew` | 643 | `jewel` | 주얼 |
| `ice` | 644 | `malah'spotion` |  |
| `0sc` | 645 | `scrollofknowledge` |  |
| `tr2` | 646 | `scrollofresistance` |  |
| `pk1` | 647 | `keyofterror` |  |
| `pk2` | 648 | `keyofhate` |  |
| `pk3` | 649 | `keyofdestruction` |  |
| `dhn` | 650 | `diablo'shorn` |  |
| `bey` | 651 | `baal'seye` |  |
| `mbr` | 652 | `mephisto'sbrain` |  |
| `std` | 658 | `standardofheroes` |  |

## 품질 (`[Quality]`)

| 키워드 | 번호 | 한글 |
|---|---|---|
| `lowquality` | 1 | 로우퀄리티 |
| `normal` | 2 | 노말 |
| `superior` | 3 | 슈페리어 |
| `magic` | 4 | 매직 |
| `set` | 5 | 세트 |
| `rare` | 6 | 레어 |
| `unique` | 7 | 유니크 |
| `crafted` | 8 | 크래프트 |

## 클래스 (`[Class]`)

| 키워드 | 번호 | 한글 |
|---|---|---|
| `normal` | 0 | 노멀 |
| `exceptional` | 1 | 익셉셔널 |
| `elite` | 2 | 엘리트 |

## 에테리얼·룬워드 (`[Flag]`)

| 키워드 | 번호 | 한글 |
|---|---|---|
| `eth = ethereal` | 0x400000 | 에테리얼 |
| `runeword` | 0x4000000 | 룬워드 |

## 스탯 (nip 스탯 키워드)

- 번호가 `[16,0]`처럼 두 개인 것은 `[스탯 번호, 하위 번호]`. 괄호 줄은 원본의 덧붙임 설명.

| 키워드 | 번호 | 한글 |
|---|---|---|
| `strength` | 0 | 힘 |
| `energy` | 1 | 에너지 |
| `dexterity` | 2 | 덱스 |
| `vitality` | 3 | 바이탈(=생명력) |
| `statpts` | 4 | 스텟 |
| `newskills` | 5 | 새로운 스킬..? |
| `hitpoints` | 6 | 체력 |
| `maxhp` | 7 | 최대 생명력 |
| `mana` | 8 | 마나 |
| `maxmana` | 9 | 최대 마나 |
| `stamina` | 10 | 스태미나 |
| `maxstamina` | 11 | 최대스태미나증가 |
| `level` | 12 | 레벨 |
| `experience` | 13 | 경험치 |
| `gold` | 14 | 골드 |
| `goldbank` | 15 |  |
| `itemarmorpercent` = `enhanceddefense` | 16,0 | 방어상승 |
| `itemmaxdamagepercent` | 17,0 | %증가된 최대데미지 |
| `itemmindamagepercent` = `enhanceddamage` | 18,0 | %증뎀 |
| `tohit` | 19 | 어택레이팅 |
| `toblock` | 20 | 공격 저지 성공률(쌍패옵션) (적용방법[20]>=20) |
| `mindamage` | 21 | 원핸드 중 최소 추가 데미지 |
| `maxdamage` | 22 | 원핸드 중 최대 추가 데미지(추뎀) |
| `secondarymindamage` | 23 | 투핸드 중 최소 추가 데미지 |
| `secondarymaxdamage` | 24 | 투핸드 중 최대 추가 데미지 |
| `damagepercent` | 25 | % 증가된 최대 데미지 |
| `manarecovery` | 26 | 마나 재생 |
| `manarecoverybonus` | 27 | 마나 회복속도 증가 (적용방법[27]>=1) |
| `staminarecoverybonus` | 28 | 스테미나 회복속도 증가 (적용방법[28]>=1) |
| `lastexp` | 29 | 마지막 경험치? |
| `nextexp` | 30 | 다음 경험치? |
| `armorclass` = `defense` | 31 | 기본방어 |
| `plusdefense` | 31,0 | + 디펜스 |
| `armorclassvsmissile` | 32 | 원거리 공격에 대한 방어 (적용방법[32]>=1) |
| `armorclassvshth` | 33 | 근거리 공격에 대한 방어 |
| `normaldamagereduction` | 34 | 노멀 데미지 감소 = 데미지감소 |
| `magicdamagereduction` | 35 | 매직 데미지 감소 |
| `damageresist` | 36 | %데미지 감소(=데미지 리듀스) |
| `magicresist` | 37 | 마법저항력 |
| `maxmagicresist` | 38 | 최대마법저항력 |
| `fireresist` | 39 | 파이어 레지 |
| `maxfireresist` | 40 | 최대 파이어 레지 상승 |
| `lightresist` | 41 | 라이트닝 레지 (저항력) |
| `maxlightresist` | 42 | 최대 라이트닝 레지 상승 |
| `coldresist` | 43 | 콜드 레지 |
| `maxcoldresist` | 44 | 최대 콜드 레지 상승 |
| `poisonresist` | 45 | 포이즌 레지 |
| `maxpoisonresist` | 46 | 최대 포이즌 레지 상승 |
| `damageaura` | 47 | 오오라 데미지 |
| `firemindam` | 48 | 파이어 최소 데미지 (민뎀) |
| `firemaxdam` | 49 | 파이어 최대 데미지 (맥뎀) |
| `lightmindam` | 50 | 라이트닝 최소 데미지 (민뎀) |
| `lightmaxdam` | 51 | 라이트닝 최대 데미지 (맥뎀) |
| `magicmindam` | 52 | 매직 최소 데미지 (민뎀) |
| `magicmaxdam` | 53 | 매직 최대 데미지 (맥뎀) |
| `coldmindam` | 54 | 콜드 최소 데미지 (민뎀) |
| `coldmaxdam` | 55 | 콜드 최대 데미지 (맥뎀) |
| `coldlength` | 56 | 콜드 지속시간 (느려지는 시간)? |
| `poisonmindam` | 57 | 포이즌 최소 데미지 (민뎀) |
| `poisonmaxdam` | 58 | 포이즌 최대 데미지 (맥뎀) |
| `poisonlength` | 59 | 매초당 +xx 포이즌 데미지 추가 -이 옵션은 다 줍습니다.(적용방법:59>=1) 독참도 데미지관계없이주워옴 |
| `lifedrainmindam` = `lifeleech` | 60 | 라이프 스틸 |
| `lifedrainmaxdam` | 61 | 라이프 스틸 맥스 데미지? |
| `manadrainmindam` = `manaleech` | 62 | 마나 스틸 |
| `manadrainmaxdam` | 63 | 마나 스틸 맥스 데미지? |
| `stamdrainmindam` | 64 | 스테미나 스틸 최소 데미지? |
| `stamdrainmaxdam` | 65 | 스테미나 스틸 최대 데미지? |
| `stunlength` | 66 | 스턴(기절) 시간 |
| `velocitypercent` | 67 | % 속도 증가? |
| `attackrate` | 68 | 공격 성공률? |
| `otheranimrate` | 69 |  |
| `quantity` | 70 | 수량? |
| `value` | 71 | 벨류 (값..?) |
| `durability` | 72 | 최소 내구력 |
| `maxdurability` | 73 | 최대 내구력 |
| `hpregen` | 74 | 라이프 재생 |
| `itemmaxdurabilitypercent` | 75 | 최대 내구력 증가 |
| `itemmaxhppercent` | 76 | % 최대 라이프 증가 |
| `itemmaxmanapercent` | 77 | % 최대 마나 증가 |
| `itemattackertakesdamage` | 78 | 공격자가 받는 데미지 (쏜즈) |
| `itemgoldbonus` | 79 | 추가 골드획득 (삥) |
| `itemmagicbonus` | 80 | 매직 찬스 증가 (매찬) |
| `itemknockback` | 81 | 적을 밀쳐냄 (=넉백) (적용방법:81>=1) |
| `itemtimeduration` | 82 | 초당 지속시간 |
| `itemaddclassskills` | 83 | 각 케릭별 기본스킬 (케릭별로 크게3가지스킬)--참종류 |
| `itemaddamazonskills` = `amazonskills` | 83,0 | 아마존 모든스킬 |
| `itemaddsorceressskills` = `sorceressskills` | 83,1 | 소서리스 모든스킬 |
| `itemaddnecromancerskills` = `necromancerskills` | 83,2 | 네크로멘서 모든스킬 |
| `itemaddpaladinskills` = `paladinskills` | 83,3 | 팔라딘 모든스킬 |
| `itemaddbarbarianskills` = `barbarianskills` | 83,4 | 바바리안 모든스킬 |
| `itemadddruidskills` = `druidskills` | 83,5 | 드루이드 모든스킬 |
| `itemaddassassinskills` = `assassinskills` | 83,6 | 어쌔신 모든스킬 |
| `unsentparam1` | 84 |  |
| `itemaddexperience` | 85 | 추가 경험 획득 |
| `itemhealafterkill` | 86 | 적 제거시 라이프 상승 |
| `itemreducedprices` | 87 | 상점 팔고 사는 아이템 가격하락 |
| `itemdoubleherbduration` | 88 |  |
| `itemlightradius` | 89 | 시야증가 |
| `itemlightcolor` | 90 |  |
| `itemreqpercent` | 91 | 리콰이어먼트(착용가능요구치) |
| `itemlevelreq` | 92 | 아이템 착용 가능 레벨 |
| `itemfasterattackrate` = `ias` | 93 | 공격 속도 증가(=공속) |
| `itemlevelreqpct` | 94 |  |
| `lastblockframe` | 95 |  |
| `itemfastermovevelocity` = `frw` | 96 | 달리기 속도 증가 |
| `itemnonclassskill` | 97 | 스킬(예:-5 휠윈드) |
| `plusskillguidedarrow` | 97,22 | +가이드 애로우 |
| `plusskillwerewolf` | 97,223 | +위어 울프 |
| `plusskillshapeshifting` = `plusskilllycanthropy` | 97,224 | +쉐입프팅 |
| `plusskillsummonspiritwolf` | 97,227 | +스피릿 울프 |
| `state` | 98 |  |
| `itemfastergethitrate` = `fhr` | 99 | 회복 속도 증가(=패힛) |
| `monsterplayercount` | 100 |  |
| `skillpoisonoverridelength` | 101 |  |
| `itemfasterblockrate` = `fbr` | 102 | 매우빠른 방어 속도 증가 (쌍패옵션)(적용방법[102]>=30) |
| `skillbypassundead` | 103 |  |
| `skillbypassdemons` | 104 |  |
| `itemfastercastrate` = `fcr` | 105 | 패스터 캐스트 레이트(=패캐) |
| `skillbypassbeasts` | 106 |  |
| `itemsingleskill` | 107 |  |
| **Amazon skills** |  |  |
| `skillmagicarrow` | 107,6 | 매직 에로우 |
| `skillfirearrow` | 107,7 | 파이어 에로우 |
| `skillinnersight` | 107,8 | 이너 사이트 |
| `skillcriticalstrike` | 107,9 | 크리티컬 스트라이크 |
| `skilljab` | 107,10 | 잽 |
| `skillcoldarrow` | 107,11 | 콜드 에로우 |
| `skillmultipleshot` | 107,12 | 멀티플 샷 |
| `skilldodge` | 107,13 | 닷지 |
| `skillpowerstrike` | 107,14 | 파워 스트라이크 |
| `skillpoisonjavelin` | 107,15 | 포이즌 자벨린 |
| `skillexplodingarrow` | 107,16 | 익스플로딩 에로우 |
| `skillslowmissiles` | 107,17 | 슬로우 미사일 |
| `skillavoid` | 107,18 | 어보이드 |
| `skillimpale` | 107,19 | 임페일 |
| `skilllightningbolt` | 107,20 | 라이트닝 볼트 |
| `skillicearrow` | 107,21 | 아이스 에로우 |
| `skillguidedarrow` | 107,22 | 가이드 에로우 |
| `skillpenetrate` | 107,23 | 페네트레이트 |
| `skillchargedstrike` | 107,24 | 차지드 스트라이크 |
| `skillplaguejavelin` | 107,25 | 플레이그 자벨린 |
| `skillstrafe` | 107,26 | 스트레이프 |
| `skillimmolationarrow` | 107,27 | 이몰레이션 에로우 |
| `skilldecoy` | 107,28 | 디코이 |
| `skillevade` | 107,29 | 이베이드 |
| `skillfend` | 107,30 | 펜드 |
| `skillfreezingarrow` | 107,31 | 프리징 에로우 |
| `skillvalkyrie` | 107,32 | 발키리 |
| `skillpierce` | 107,33 | 피어스 |
| `skilllightningstrike` | 107,34 | 라이트닝 스트라이크 |
| `skilllightningfury` | 107,35 | 라이트닝 퓨리 |
| **Sorceress skills** |  |  |
| `skillfirebolt` | 107,36 | 파이어볼트 |
| `skillwarmth` | 107,37 | 웜스 |
| `skillchargedbolt` | 107,38 | 차지드 볼트 |
| `skillicebolt` | 107,39 | 아이스 볼트 |
| `skillfrozenarmor` | 107,40 | 프로즌 아머 |
| `skillinferno` | 107,41 | 인페르노 |
| `skillstaticfield` | 107,42 | 스태틱 필드 |
| `skilltelekinesis` | 107,43 | 텔레키네시스 |
| `skillfrostnova` | 107,44 | 프로스트 노바 |
| `skilliceblast` | 107,45 | 아이스 블래스트 |
| `skillblaze` | 107,46 | 블레이즈 |
| `skillfireball` | 107,47 | 파이어볼 |
| `skillnova` | 107,48 | 노바 |
| `skilllightning` | 107,49 | 라이트닝 |
| `skillshiverarmor` | 107,50 | 실버 아머 |
| `skillfirewall` | 107,51 | 파이어 월 |
| `skillenchant` | 107,52 | 인첸트 |
| `skillchainlightning` | 107,53 | 체인 라이트닝 |
| `skillteleport` | 107,54 | 텔레포트 |
| `skillglacialspike` | 107,55 | 글레셜 스파이크 |
| `skillmeteor` | 107,56 | 메테오 |
| `skillthunderstorm` | 107,57 | 썬더 스톰 |
| `skillenergyshield` | 107,58 | 에너지 쉴드 |
| `skillblizzard` | 107,59 | 블리자드 |
| `skillchillingarmor` | 107,60 | 칠링 아머 |
| `skillfiremastery` | 107,61 | 파이어 마스터리 |
| `skillhydra` | 107,62 | 히드라 |
| `skilllightningmastery` | 107,63 | 라이트닝 마스터리 |
| `skillfrozenorb` | 107,64 | 프로즌 오브 |
| `skillcoldmastery` | 107,65 | 콜드 마스터리 |
| **Necromancer skills** |  |  |
| `skillamplifydamage` | 107,66 | 앰플리파이데미지 |
| `skillteeth` | 107,67 | 티쓰 |
| `skillbonearmor` | 107,68 | 본아머 |
| `skillskeletonmastery` | 107,69 | 스켈레톤마스터리 |
| `skillraiseskeleton` | 107,70 | 레이즈스켈레톤 |
| `skilldimvision` | 107,71 | 딤비젼 |
| `skillweaken` | 107,72 | 위큰 |
| `skillpoisondagger` | 107,73 | 포이즌대거 |
| `skillcorpseexplosion` | 107,74 | 콥스익스플로젼 |
| `skillclaygolem` | 107,75 | 클레이골렘 |
| `skillironmaiden` | 107,76 | 아이언메이든 |
| `skillterror` | 107,77 | 테러 |
| `skillbonewall` | 107,78 | 본월 |
| `skillgolemmastery` | 107,79 | 골렘마스터리 |
| `skillskeletalmage` | 107,80 | 스켈레탈메이지 |
| `skillconfuse` | 107,81 | 컨퓨즈 |
| `skilllifetap` | 107,82 | 라이프탭 |
| `skillpoisonexplosion` | 107,83 | 포이즌익스플로젼 |
| `skillbonespear` | 107,84 | 본스피어 |
| `skillbloodgolem` | 107,85 | 블러드골렘 |
| `skillattract` | 107,86 | 어트랙트 |
| `skilldecrepify` | 107,87 | 디크레피파이 |
| `skillboneprison` | 107,88 | 본프리즌 |
| `skillsummonresist` | 107,89 | 서몬레지스트 |
| `skillirongolem` | 107,90 | 아이언골렘 |
| `skilllowerresist` | 107,91 | 로워레지스트 |
| `skillpoisonnova` | 107,92 | 포이즌노바 |
| `skillbonespirit` | 107,93 | 본스피릿 |
| `skillfiregolem` | 107,94 | 파이어골렘 |
| `skillrevive` | 107,95 | 리바이브 |
| **Paladinskills** |  |  |
| `skillsacrifice` | 107,96 | 세크리파이스 |
| `skillsmite` | 107,97 | 스마이트 |
| `skillmight` | 107,98 | 마이트 |
| `skillprayer` | 107,99 | 프레이어 |
| `skillresistfire` | 107,100 | 레지스트파이어 |
| `skillholybolt` | 107,101 | 홀리볼트 |
| `skillholyfire` | 107,102 | 홀리파이어 |
| `skillthorns` | 107,103 | 쏜즈 |
| `skilldefiance` | 107,104 | 디파이언스 |
| `skillresistcold` | 107,105 | 레지스트콜드 |
| `skillzeal` | 107,106 | 질 |
| `skillcharge` | 107,107 | 차지 |
| `skillblessedaim` | 107,108 | 블레스드에임 |
| `skillcleansing` | 107,109 | 클린징 |
| `skillresistlightning` | 107,110 | 레지스트라이트닝 |
| `skillvengeance` | 107,111 | 벤전스 |
| `skillblessedhammer` | 107,112 | 블레스드해머 |
| `skillconcentration` | 107,113 | 컨센트레이션 |
| `skillholyfreeze` | 107,114 | 홀리프리즈 |
| `skillvigor` | 107,115 | 비거 |
| `skillconversion` | 107,116 | 컨버젼 |
| `skillholyshield` | 107,117 | 홀리쉴드 |
| `skillholyshock` | 107,118 | 홀리쇼크 |
| `skillsanctuary` | 107,119 | 생츄어리 |
| `skillmeditation` | 107,120 | 메디테이션 |
| `skillfistoftheheavens` | 107,121 | 피스트오브더헤븐즈 |
| `skillfanaticism` | 107,122 | 파낙티시즘 |
| `skillconviction` | 107,123 | 컨빅션 |
| `skillredemption` | 107,124 | 리뎀션 |
| `skillsalvation` | 107,125 | 셀베이션 |
| **Barbarianskills** |  |  |
| `skillbash` | 107,126 | 배쉬 |
| `skillswordmastery` | 107,127 | 스워드마스터리 |
| `skillaxemastery` | 107,128 | 액스마스터리 |
| `skillmacemastery` | 107,129 | 메이스마스터리 |
| `skillhowl` | 107,130 | 하울 |
| `skillfindpotion` | 107,131 | 파인드포션 |
| `skillleap` | 107,132 | 리프 |
| `skilldoubleswing` | 107,133 | 더블스윙 |
| `skillpolearmmastery` | 107,134 | 폴암마스터리 |
| `skillthrowingmastery` | 107,135 | 쓰로잉마스터리 |
| `skillspearmastery` | 107,136 | 스피어마스터리 |
| `skilltaunt` | 107,137 | 타운트 |
| `skillshout` | 107,138 | 샤우트 |
| `skillstun` | 107,139 | 스턴 |
| `skilldoublethrow` | 107,140 | 더블쓰로우 |
| `skillincreasedstamina` | 107,141 | 인크리즈드스태미나 |
| `skillfinditem` | 107,142 | 파인드아이템 |
| `skillleapattack` | 107,143 | 리프어택 |
| `skillconcentrate` | 107,144 | 컨센트레이트 |
| `skillironskin` | 107,145 | 아이언스킨 |
| `skillbattlecry` | 107,146 | 배틀크라이 |
| `skillfrenzy` | 107,147 | 프렌지 |
| `skillincreasedspeed` | 107,148 | 인크리즈드스피드 |
| `skillbattleorders` | 107,149 | 배틀오더스 |
| `skillgrimward` | 107,150 | 그림와드 |
| `skillwhirlwind` | 107,151 | 휠윈드 |
| `skillberserk` | 107,152 | 버서크 |
| `skillnaturalresistance` | 107,153 | 내츄럴레지스턴스 |
| `skillwarcry` | 107,154 | 워크라이 |
| `skillbattlecommand` | 107,155 | 배틀커맨드 |
| **Druidskills** |  |  |
| `skillraven` | 107,221 | 레이븐 |
| `skillpoisoncreeper` | 107,222 | 포이즌크리퍼 |
| `skillwerewolf` | 107,223 | 워울프 |
| `skilllycanthropy` | 107,224 | 라이칸스로피 |
| `skillfirestorm` | 107,225 | 파이어스톰 |
| `skilloaksage` | 107,226 | 오크세이지 |
| `skillsummonspiritwolf` | 107,227 | 서몬스피릿울프 |
| `skillwerebear` | 107,228 | 워베어 |
| `skillmoltenboulder` | 107,229 | 몰턴보우더 |
| `skillarcticblast` | 107,230 | 아틱블래스트 |
| `skillfissure` | 107,231 | 피셔 |
| `skillferalrage` | 107,232 | 피어럴레이지 |
| `skillmaul` | 107,233 | 마울 |
| `skillcarrionvine` | 107,234 | 케리언바인 |
| `skillcyclonearmor` | 107,235 | 사이클론아머 |
| `skillheartofwolverine` | 107,236 | 하트오브울버린 |
| `skillsummondirewolf` | 107,237 | 서몬다이어울프 |
| `skillrabies` | 107,238 | 레이비즈 |
| `skillfireclaws` | 107,239 | 파이어클러 |
| `skilltwister` | 107,240 | 트위스터 |
| `skillsolarcreeper` | 107,241 | 솔라크리퍼 |
| `skillhunger` | 107,242 | 헝거 |
| `skillshockwave` | 107,243 | 쇼크웨이브 |
| `skillvolcano` | 107,244 | 볼케이노 |
| `skilltornado` | 107,245 | 토네이도 |
| `skillspiritofbarbs` | 107,246 | 스피릿오브바브스 |
| `skillsummongrizzly` | 107,247 | 서먼그리즐리 |
| `skillfury` | 107,248 | 퓨리 |
| `skillarmageddon` | 107,249 | 아마겟돈 |
| `skillhurricane` | 107,250 | 허리케인 |
| **Assassinskills** |  |  |
| `skillfireblast` | 107,251 | 파이어블라스트 |
| `skillclawmastery` | 107,252 | 클러마스터리 |
| `skillpsychichammer` | 107,253 | 사이킥해머 |
| `skilltigerstrike` | 107,254 | 타이거스트라이크 |
| `skilldragontalon` | 107,255 | 드래곤탈론 |
| `skillshockweb` | 107,256 | 쇼크웹 |
| `skillbladesentinel` | 107,257 | 블래이드센티넬 |
| `skillburstofspeed` | 107,258 | 버스트오브스피드 |
| `skillfistsoffire` | 107,259 | 피스트오브파이어 |
| `skilldragonclaw` | 107,260 | 드래곤클러 |
| `skillchargedboltsentry` | 107,261 | 차지드볼트센트리 |
| `skillwakeoffire` | 107,262 | 웨이크오브파이어 |
| `skillweaponblock` | 107,263 | 웨폰블럭 |
| `skillcloakofshadows` | 107,264 | 클럭오브쉐도우 |
| `skillcobrastrike` | 107,265 | 코브라스트라이크 |
| `skillbladefury` | 107,266 | 블래이드퓨리 |
| `skillfade` | 107,267 | 페이드 |
| `skillshadowwarrior` | 107,268 | 쉐도우워리어 |
| `skillclawsofthunder` | 107,269 | 클러오브썬더 |
| `skilldragontail` | 107,270 | 드래곤테일 |
| `skilllightningsentry` | 107,271 | 라이트닝센트리 |
| `skillwakeofinferno` | 107,272 | 웨이크오브인페르노 |
| `skillmindblast` | 107,273 | 마인드블라스트 |
| `skillbladesofice` | 107,274 | 블레이드오브아이스 |
| `skilldragonflight` | 107,275 | 드레곤플라이트 |
| `skilldeathsentry` | 107,276 | 데스센트리 |
| `skillbladeshield` | 107,277 | 블레이드쉴드 |
| `skillvenom` | 107,278 | 베놈 |
| `skillshadowmaster` | 107,279 | 쉐도우마스터 |
| `skillphoenixstrike` | 107,280 | 피닉스스트라이크 |
| `itemrestinpeace` | 108 | 평화를되찾기위해몬스터를무찔러라 |
| `curseresistance` | 109 |  |
| `itempoisonlengthresist` | 110 | 방어상승/중독시간감 |
| `itemnormaldamage` | 111 | 노멀데미지 |
| `itemhowl` | 112 | 명중시몬스터가달아남 |
| `itemstupidity` | 113 | 명중시목표물시야감소 |
| `itemdamagetomana` | 114 | 데미지를마나로돌림 |
| `itemignoretargetac` | 115 | 목표물방어력무시 |
| `itemfractionaltargetac` | 116 | 목표물방어력-%로깍음(=에드룬무기장착시효과) |
| `itempreventheal` | 117 | 몬스터회복저지 |
| `itemhalffreezeduration` | 118 | 결빙시간1/2감소 |
| `itemtohitpercent` | 119 | %어택레이팅상승 |
| `itemdamagetargetac` | 120 |  |
| `itemdemondamagepercent` | 121 | 데몬에대하여%데미지상승 |
| `itemundeaddamagepercent` | 122 | 언데드에대하여%데미지상승 |
| `itemdemontohit` | 123 | 데몬에대하여어레증가 |
| `itemundeadtohit` | 124 | 언데드에대하여어레증가 |
| `itemthrowable` | 125 |  |
| `itemelemskill` | 126 |  |
| `itemallskills` | 127 | 모든스킬상승 |
| `itemattackertakeslightdamage` | 128 | 공격자가에게받는라이트닝데미지돌려줌 |
| `ironmaidenlevel` | 129 |  |
| `lifetaplevel` | 130 |  |
| `thornspercent` | 131 |  |
| `bonearmor` | 132 |  |
| `bonearmormax` | 133 |  |
| `itemfreeze` | 134 | 목표물결빙 |
| `itemopenwounds` | 135 | 상처악화 |
| `itemcrushingblow` | 136 | 강한타격(=강타) |
| `itemkickdamage` | 137 | 킥데미지 |
| `itemmanaafterkill` | 138 | 적제거시마나상승 |
| `itemhealafterdemonkill` | 139 | 데몬제거시피상승 |
| `itemextrablood` | 140 |  |
| `itemdeadlystrike` | 141 | 치명적공격 |
| `itemabsorbfirepercent` | 142 | %파이어흡수 |
| `itemabsorbfire` | 143 | 파이어흡수 |
| `itemabsorblightpercent` | 144 | %라이트닝흡수 |
| `itemabsorblight` | 145 | 라이트닝흡수 |
| `itemabsorbmagicpercent` | 146 | %매직흡수 |
| `itemabsorbmagic` | 147 | 매직흡수 |
| `itemabsorbcoldpercent` | 148 | %콜드흡수 |
| `itemabsorbcold` | 149 | 콜드흡수 |
| `itemslow` | 150 | 목표물속도둔화(=슬타)(적용방법[150]>=1)) |
| `itemaura` | 151 | 장착시xx레벨의오오라효과적용(Might/HolyFire/BlessedAim/HolyFreeze/HolyShock/Conviction/Fanaticism) |
| `itemindestructible` | 152 | (파괴불가)(적용방법[152]>=1) |
| `itemcannotbefrozen` | 153 | 결빙되지않음(적용방법[153]>=1) |
| `itemstaminadrainpct` | 154 | %스테미나소모율감소 |
| `itemreanimate` | 155 |  |
| `itempierce` | 156 | 날카로운관통공격 |
| `itemmagicarrow` | 157 | 매직화살발사 |
| `itemexplosivearrow` | 158 | 폭발화살발사 |
| `itemthrowmindamage` | 159 |  |
| `itemthrowmaxdamage` | 160 |  |
| `itemskillhandofathena` | 161 |  |
| `itemskillstaminapercent` | 162 |  |
| `itemskillpassivestaminapercent` | 163 |  |
| `itemskillconcentration` | 164 |  |
| `itemskillenchant` | 165 |  |
| `itemskillpierce` | 166 |  |
| `itemskillconviction` | 167 |  |
| `itemskillchillingarmor` | 168 |  |
| `itemskillfrenzy` | 169 |  |
| `itemskilldecrepify` | 170 |  |
| `itemskillarmorpercent` | 171 |  |
| `alignment` | 172 |  |
| `target0` | 173 |  |
| `target1` | 174 |  |
| `goldlost` | 175 |  |
| `conversionlevel` | 176 |  |
| `conversionmaxhp` | 177 |  |
| `unitdooverlay` | 178 |  |
| `attackvsmontype` | 179 | 몬스터에대한공격등급(악의세력) |
| `damagevsmontype` | 180 | 몬스터에대한데미지(악의세력) |
| `fade` | 181 |  |
| `armoroverridepercent` | 182 |  |
| `unused183` | 183 |  |
| `unused184` | 184 |  |
| `unused185` | 185 |  |
| `unused186` | 186 |  |
| `unused187` | 187 |  |
| `itemaddskilltab` | 188 |  |
| `itemaddbowandcrossbowskilltab` = `bowandcrossbowskilltab` | 188,0 | 보우&크로스보우 스킬 |
| `itemaddpassiveandmagicskilltab` = `passiveandmagicskilltab` | 188,1 | 패시브 스킬 |
| `itemaddjavelinandspearskilltab` = `javelinandspearskilltab` | 188,2 | 자벨린 스킬 |
| `itemaddfireskilltab` = `fireskilltab` | 188,8 | 파이어 스킬 |
| `itemaddlightningskilltab` = `lightningskilltab` | 188,9 | 라이트닝 스킬 |
| `itemaddcoldskilltab` = `coldskilltab` | 188,10 | 콜드 스킬 |
| `itemaddcursesskilltab` = `cursesskilltab` | 188,16 | 저주 스킬 |
| `itemaddpoisonandboneskilltab` = `poisonandboneskilltab` | 188,17 | 포이즌&노바 스킬 |
| `itemaddnecromancersummoningskilltab` = `necromancersummoningskilltab` | 188,18 | 네크 소환 스킬 |
| `itemaddpalicombatskilltab` = `palicombatskilltab` | 188,24 | 팔라 전투스킬 |
| `itemaddoffensiveaurasskilltab` = `offensiveaurasskilltab` | 188,25 | 공격오오라 스킬 |
| `itemadddefensiveaurasskilltab` = `defensiveaurasskilltab` | 188,26 | 방어오오라 스킬 |
| `itemaddbarbcombatskilltab` = `barbcombatskilltab` | 188,32 | 바바 전투스킬 |
| `itemaddmasteriesskilltab` = `masteriesskilltab` | 188,33 | 마스터리 스킬 |
| `itemaddwarcriesskilltab` = `warcriesskilltab` | 188,34 | 워크라이 스킬 |
| `itemadddruidsummoningskilltab` = `druidsummoningskilltab` | 188,40 | 드루 소환스킬 |
| `itemaddshapeshiftingskilltab` = `shapeshiftingskilltab` | 188,41 | 쉐입프팅 스킬 |
| `itemaddelementalskilltab` = `elementalskilltab` | 188,42 | 엘리멘탈 스킬 |
| `itemaddtrapsskilltab` = `trapsskilltab` | 188,48 | 트랩 스킬 |
| `itemaddshadowdisciplinesskilltab` = `shadowdisciplinesskilltab` | 188,49 | 쉐도우 스킬 |
| `itemaddmartialartsskilltab` = `martialartsskilltab` | 188,50 | 마샬 스킬 |
| `unused189` | 189 |  |
| `unused190` | 190 |  |
| `unused191` | 191 |  |
| `unused192` | 192 |  |
| `unused193` | 193 |  |
| `itemnumsockets` = `sockets` | 194 | 소켓 |
| `itemskillonattack` | 195 | 데미지추가 |
| `itemskillonkill` | 196 | 몬스터죽었을시스킬시전 |
| `itemskillondeath` | 197 | 케릭터가죽었을시스킬시전(유닉다이주얼) |
| `itemskillonhit` | 198 | 공격시스킬시전 |
| `itemskillonlevelup` | 199 | 레벨업때마다스킬시전 |
| `unused200` | 200 |  |
| `itemskillongethit` | 201 | xxx기회로xx반격시스킬이름시전 |
| `unused202` | 202 |  |
| `unused203` | 203 |  |
| `itemchargedskill` | 204 |  |
| `unused204` | 205 |  |
| `unused205` | 206 |  |
| `unused206` | 207 |  |
| `unused207` | 208 |  |
| `unused208` | 209 |  |
| `unused209` | 210 |  |
| `unused210` | 211 |  |
| `unused211` | 212 |  |
| `unused212` | 213 |  |
| `itemarmorperlevel` | 214 | 레벨당방어증가 |
| `itemarmorpercentperlevel` | 215 | 레벨당%방어증가 |
| `itemhpperlevel` | 216 | 레벨당라이프증가(적용방법[216]>=1) |
| `itemmanaperlevel` | 217 | 레벨당마나증가 |
| `itemmaxdamageperlevel` | 218 | 레벨당최대데미지증가 |
| `itemmaxdamagepercentperlevel` | 219 | 레벨당%최대데미지증가 |
| `itemstrengthperlevel` | 220 | 레벨당힘증가 |
| `itemdexterityperlevel` | 221 | 레벨당덱스증가 |
| `itemenergyperlevel` | 222 | 레벨당에너지증가 |
| `itemvitalityperlevel` | 223 | 레벨당바이탈증가 |
| `itemtohitperlevel` | 224 | 레벨당어레증가 |
| `itemtohitpercentperlevel` | 225 | 레벨당%어레증가 |
| `itemcolddamagemaxperlevel` | 226 | 레벨당콜드데미지증가 |
| `itemfiredamagemaxperlevel` | 227 | 레벨당파이어데미지증가 |
| `itemltngdamagemaxperlevel` | 228 | 레벨당라이트닝데미지증가 |
| `itempoisdamagemaxperlevel` | 229 | 레벨당포이즌데미지증가 |
| `itemresistcoldperlevel` | 230 | 레벨당콜드레지증가 |
| `itemresistfireperlevel` | 231 | 레벨당파이어레지증가 |
| `itemresistltngperlevel` | 232 | 레벨당라이트닝레지증가 |
| `itemresistpoisperlevel` | 233 | 레벨당포이즌레지증 |
| `itemabsorbcoldperlevel` | 234 | 레벨당콜드흡수 |
| `itemabsorbfireperlevel` | 235 | 레벨당파이어흡수 |
| `itemabsorbltngperlevel` | 236 | 레벨당라이트닝흡수 |
| `itemabsorbpoisperlevel` | 237 | 레벨당포이즌흡수 |
| `itemthornsperlevel` | 238 |  |
| `itemfindgoldperlevel` | 239 | 레벨당추가골드획득증가 |
| `itemfindmagicperlevel` | 240 | 레벨당매직찬스증가 |
| `itemregenstaminaperlevel` | 241 | 레벨당스테미나회복증가 |
| `itemstaminaperlevel` | 242 | 레벨당스테미나증가 |
| `itemdamagedemonperlevel` | 243 | 레벨당데몬에대하여주는데미지증가 |
| `itemdamageundeadperlevel` | 244 | 레벨당언데드에대하여주는데미지증가 |
| `itemtohitdemonperlevel` | 245 | 레벨당데몬에대하여어택레이팅증가 |
| `itemtohitundeadperlevel` | 246 | 레벨당언데드에대하여어택레이팅증가 |
| `itemcrushingblowperlevel` | 247 | 레벨당강한타격증가 |
| `itemopenwoundsperlevel` | 248 | 레벨당상처악화증가 |
| `itemkickdamageperlevel` | 249 | 레벨당킥데미지증가 |
| `itemdeadlystrikeperlevel` | 250 | 레벨당치명적공격증가 |
| `itemfindgemsperlevel` | 251 | 아이템찾을확률증가 |
| `itemreplenishdurability` | 252 | 내구력회복(적용방법[252]>=1) |
| `itemreplenishquantity` | 253 | 자동수량회복(적용방법[253]>=1) |
| `itemextrastack` | 254 | 보관량증가(=IncreasedStackSize)(적용방법[254]>=1) |
| `itemfinditem` | 255 |  |
| `itemslashdamage` | 256 |  |
| `itemslashdamagepercent` | 257 |  |
| `itemcrushdamage` | 258 |  |
| `itemcrushdamagepercent` | 259 |  |
| `itemthrustdamage` | 260 |  |
| `itemthrustdamagepercent` | 261 |  |
| `itemabsorbslash` | 262 |  |
| `itemabsorbcrush` | 263 |  |
| `itemabsorbthrust` | 264 |  |
| `itemabsorbslashpercent` | 265 |  |
| `itemabsorbcrushpercent` | 266 |  |
| `itemabsorbthrustpercent` | 267 |  |
| `itemarmorbytime` | 268 |  |
| `itemarmorpercentbytime` | 269 |  |
| `itemhpbytime` | 270 |  |
| `itemmanabytime` | 271 |  |
| `itemmaxdamagebytime` | 272 |  |
| `itemmaxdamagepercentbytime` | 273 |  |
| `itemstrengthbytime` | 274 |  |
| `itemdexteritybytime` | 275 |  |
| `itemenergybytime` | 276 |  |
| `itemvitalitybytime` | 277 |  |
| `itemtohitbytime` | 278 |  |
| `itemtohitpercentbytime` | 279 |  |
| `itemcolddamagemaxbytime` | 280 |  |
| `itemfiredamagemaxbytime` | 281 |  |
| `itemltngdamagemaxbytime` | 282 |  |
| `itempoisdamagemaxbytime` | 283 |  |
| `itemresistcoldbytime` | 284 |  |
| `itemresistfirebytime` | 285 |  |
| `itemresistltngbytime` | 286 |  |
| `itemresistpoisbytime` | 287 |  |
| `itemabsorbcoldbytime` | 288 |  |
| `itemabsorbfirebytime` | 289 |  |
| `itemabsorbltngbytime` | 290 |  |
| `itemabsorbpoisbytime` | 291 |  |
| `itemfindgoldbytime` | 292 |  |
| `itemfindmagicbytime` | 293 |  |
| `itemregenstaminabytime` | 294 |  |
| `itemstaminabytime` | 295 |  |
| `itemdamagedemonbytime` | 296 |  |
| `itemdamageundeadbytime` | 297 |  |
| `itemtohitdemonbytime` | 298 |  |
| `itemtohitundeadbytime` | 299 |  |
| `itemcrushingblowbytime` | 300 |  |
| `itemopenwoundsbytime` | 301 |  |
| `itemkickdamagebytime` | 302 |  |
| `itemdeadlystrikebytime` | 303 |  |
| `itemfindgemsbytime` | 304 |  |
| `itempiercecold` | 305 |  |
| `itempiercefire` | 306 |  |
| `itempierceltng` | 307 |  |
| `itempiercepois` | 308 |  |
| `itemdamagevsmonster` | 309 |  |
| `itemdamagepercentvsmonster` | 310 |  |
| `itemtohitvsmonster` | 311 |  |
| `itemtohitpercentvsmonster` | 312 |  |
| `itemacvsmonster` | 313 |  |
| `itemacpercentvsmonster` | 314 |  |
| `firelength` | 315 |  |
| `burningmin` | 316 |  |
| `burningmax` | 317 |  |
| `progressivedamage` | 318 |  |
| `progressivesteal` | 319 |  |
| `progressiveother` | 320 |  |
| `progressivefire` | 321 |  |
| `progressivecold` | 322 |  |
| `progressivelightning` | 323 |  |
| `itemextracharges` | 324 |  |
| `progressivetohit` | 325 |  |
| `poisoncount` | 326 |  |
| `damageframerate` | 327 |  |
| `pierceidx` | 328 |  |
| `passivefiremastery` | 329 | 파이어스킬데미지증가 |
| `passiveltngmastery` | 330 | 라이트닝스킬데미지증가 |
| `passivecoldmastery` | 331 | 콜드스킬데미지증가 |
| `passivepoismastery` | 332 | 포이즌스킬데미지증가 |
| `passivefirepierce` | 333 | 파이어저항력감소 |
| `passiveltngpierce` | 334 | 라이트닝저항력감소 |
| `passivecoldpierce` | 335 | 콜드저항력감소 |
| `passivepoispierce` | 336 | 포이즌저항력감소 |
| `passivecriticalstrike` | 337 |  |
| `passivedodge` | 338 |  |
| `passiveavoid` | 339 |  |
| `passiveevade` | 340 |  |
| `passivewarmth` | 341 |  |
| `passivemasterymeleeth` | 342 |  |
| `passivemasterymeleedmg` | 343 |  |
| `passivemasterymeleecrit` | 344 |  |
| `passivemasterythrowth` | 345 |  |
| `passivemasterythrowdmg` | 346 |  |
| `passivemasterythrowcrit` | 347 |  |
| `passiveweaponblock` | 348 |  |
| `passivesummonresist` | 349 |  |
| `modifierlistskill` | 350 |  |
| `modifierlistlevel` | 351 |  |
| `lastsenthppct` | 352 |  |
| `sourceunittype` | 353 |  |
| `sourceunitid` | 354 |  |
| `shortparam1` | 355 |  |
| `questitemdifficulty` | 356 |  |
| `passivemagmastery` | 357 | 매직데미지증가 |
| `passivemagpierce` | 358 | 매직저항력감소 |
