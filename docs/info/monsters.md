# 몬스터 (spectype, 슈퍼유니크, 인챈트, classid, 우버·횃불)

몬스터 종류 비트(spectype), 슈퍼유니크 번호, 몬스터 인챈트, 몬스터 classid, 우버 디아블로·헬파이어 토치 절차 (261104).

- kolbot 사용처: `unit.spectype`(`Attack.js`: `spectype & 0x7`로 보스·챔피언 판단, `& 0x1`로 일반 보스 판단), `getUnit(1, 이름 또는 classid)`, `Attack.kill`, `Config.SkipException`

## spectype (`unit.spectype`)

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

## 슈퍼유니크 번호

- 출처: kolbot 옛 sdk `SuperUniques.txt`·`superunique_presetunitids.txt`. 근거: 웹 미검증.
- 대조(261104): `SuperUniques.txt` 66줄을 mpqdata `superuniques.txt`(구분 줄 `Expansion` 뺀 순서)와 대조, 65줄 같다. 60은 원본 `Nihlathak`, mpq `Nihlathak Boss`.
- `superunique_presetunitids.txt`는 프리셋 유닛(`getPresetUnit`) 번호표다. mpqdata로 대조하지 않았다(원본 머리말: "this list is correct to the best of my knowledge").

원본 `SuperUniques.txt`:

```
Name	hcIdx
Bishibosh	0
Bonebreak	1
Coldcrow	2
Rakanishu	3
Treehead WoodFist	4
Griswold	5
The Countess	6
Pitspawn Fouldog	7
Flamespike the Crawler	8
Boneash	9
Radament	10
Bloodwitch the Wild	11
Fangskin	12
Beetleburst	13
Leatherarm	14
Coldworm the Burrower	15
Fire Eye	16
Dark Elder	17
The Summoner	18
Ancient Kaa the Soulless	19
The Smith	20
Web Mage the Burning	21
Witch Doctor Endugu	22
Stormtree	23
Sarina the Battlemaid	24
Icehawk Riftwing	25
Ismail Vilehand	26
Geleb Flamefinger	27
Bremm Sparkfist	28
Toorc Icefist	29
Wyand Voidfinger	30
Maffer Dragonhand	31
Winged Death	32
The Tormentor	33
Taintbreeder	34
Riftwraith the Cannibal	35
Infector of Souls	36
Lord De Seis	37
Grand Vizier of Chaos	38
The Cow King	39
Corpsefire	40
The Feature Creep	41

Siege Boss	42
Ancient Barbarian 1	43
Ancient Barbarian 2	44
Ancient Barbarian 3	45
Axe Dweller	46
Bonesaw Breaker	47
Dac Farren	48
Megaflow Rectifier	49
Eyeback Unleashed	50
Threash Socket	51
Pindleskin	52
Snapchip Shatter	53
Anodized Elite	54
Vinvear Molech	55
Sharp Tooth Sayer	56
Magma Torquer	57
Blaze Ripper	58
Frozenstein	59
Nihlathak	60
Baal Subject 1	61
Baal Subject 2	62
Baal Subject 3	63
Baal Subject 4	64
Baal Subject 5	65
```

원본 `superunique_presetunitids.txt`:

```
Super Unique PresetUnit Ids:

*this list is correct to the best of my knowledge

Id	Name
250	The Summoner
704	Bishibosh
705	Bonebreak
706	Coldcrow
707	Rakanishu
708	Treehead WoodFist
709	Griswold
710	The Countess
711	Pitspawn Fouldog
712	Flamespike the Crawler
713	Boneash
714	Radament
715	Bloodwitch the Wild
716	Fangskin
717	Beetleburst
718	Leatherarm
719	Coldworm the Burrower
720	Fire Eye
721	Dark Elder
723	Ancient Kaa the Soulless
724	The Smith
725	Web Mage the Burning
726	Witch Doctor Endugu
727	Stormtree
728	Sarina the Battlemaid
729	Icehawk Riftwing
730	Ismail Vilehand
731	Geleb Flamefinger
732	Bremm Sparkfist
733	Toorc Icefist
734	Wyand Voidfinger
735	Maffer Dragonhand
736	Winged Death
737	The Tormentor
738	Taintbreeder
739	Riftwraith the Cannibal
740	Infector of Souls
741	Lord De Seis
742	Grand Vizier of Chaos
743	The Cow King
744	Corpsefire
745	Hephasto (The Feature Creep)
746	Siege Boss
747	Ancient Barbarian 1
748	Ancient Barbarian 2
749	Ancient Barbarian 3
750	Axe Dweller
751	Bonesaw Breaker
752	Dac Farren
753	Eldritch (Megaflow Rectifier)
754	Eyeback Unleashed
755	Threash Socket
756	Pindleskin
757	Snapchip Shatter
758	Anodized Elite
759	Vinvear Molech
760	Sharp Tooth Sayer
761	Magma Torquer
762	Blaze Ripper
763	Frozenstein
764	Nihlathak Boss
765	Baal Subject 1
766	Baal Subject 2
767	Baal Subject 3
768	Baal Subject 4
769	Baal Subject 5



--- not in super unique list, but still have a weird Ids: (thanks to mousepad for helping fill this in!)

772 random boss pack?
773 random champ pack?
774 Flavie
775 Blood Raven
778 maggot queen (broken?)
780,781 tenticles
787 flayers
788 flayer+shaman
792 ratmen
793 ratmen+shaman
794 demonimp pack
796 enslaved pack
795,797,798 ??
799 dead enslaved
800 dead demonimp
801 dead barb
802 dead prowlingdead
```

## 몬스터 인챈트

- 출처: kolbot 옛 sdk `enchants.txt`. 근거: 웹 미검증. 원본은 C 소스 조각이고, `aszEnchantDescs[번호]`의 번호가 인챈트 번호다. 원본 그대로.

```
	{"Extra Strong Desc", 0,			&aszEnchantDescs[5], 0, 1},
	{"Extra Fast Desc", 0,				&aszEnchantDescs[6], 0, 1},
	{"Cursed Desc", 0,				&aszEnchantDescs[7], 0, 1},
	{"Magic Resistant Desc", 0,			&aszEnchantDescs[8], 0, 1},
	{"Fire Enchanted Desc", 0,			&aszEnchantDescs[9], 0, 1},
	{"Champion Desc", 0,				&aszEnchantDescs[16], 0, 1},
	{"Lightning Enchanted Desc", 0,			&aszEnchantDescs[17], 0, 1},
	{"Cold Enchanted Desc", 0,			&aszEnchantDescs[18], 0, 1},
	{"Thief Desc", 0,				&aszEnchantDescs[24], 0, 1},
	{"Mana Burn Desc", 0,				&aszEnchantDescs[25], 0, 1},
	{"Teleportation Desc", 0,			&aszEnchantDescs[26], 0, 1},
	{"Spectral Hit Desc", 0,			&aszEnchantDescs[27], 0, 1},
	{"Stone Skin Desc", 0,				&aszEnchantDescs[28], 0, 1},
	{"Multiple Shots Desc", 0,			&aszEnchantDescs[29], 0, 1},
	{"Ghostly Desc", 0,				&aszEnchantDescs[36], 0, 1},
	{"Fanatic Desc", 0,				&aszEnchantDescs[37], 0, 1},
	{"Possessed Desc", 0,				&aszEnchantDescs[38], 0, 1},
	{"Berserker Desc", 0,				&aszEnchantDescs[39], 0, 1},
```

## 몬스터 classid

- 출처: kolbot 옛 sdk `monster classID's.txt`. 근거: 웹 미검증.
- 대조(261104): 704줄의 `Id`·`hcIdx`를 mpqdata `monstats.txt`(구분 줄 `Expansion` 뺀 순서)와 대조, 모두 같다. mpq는 734줄이라 705번부터는 원본에 없다. 몬스터 정보는 mpqdata `monstats.txt`를 본다.
- 원본 열: `Id`(내부 이름), `hcIdx`(classid), `BaseId`, `NextInClass`, `TransLvl`, `NameStr`(문자열 이름, `game_ids.md`의 `getLocaleString` 표).

```
Id                  hcIdx   BaseId              NextInClass        TransLvl  NameStr
skeleton1           0       skeleton1           skeleton2          0         Skeleton
skeleton2           1       skeleton1           skeleton3          1         Returned
skeleton3           2       skeleton1           skeleton4          2         BoneWarrior
skeleton4           3       skeleton1           skeleton5          3         BurningDead
skeleton5           4       skeleton1           skeleton6          4         Horror
zombie1             5       zombie1             zombie2            0         Zombie
zombie2             6       zombie1             zombie3            1         HungryDead
zombie3             7       zombie1             zombie4            2         Ghoul
zombie4             8       zombie1             zombie5            3         DrownedCarcass
zombie5             9       zombie1                                4         PlagueBearer
bighead1            10      bighead1            bighead2           0         Afflicted
bighead2            11      bighead1            bighead3           1         Tainted
bighead3            12      bighead1            bighead4           2         Misshapen
bighead4            13      bighead1            bighead5           3         Disfigured
bighead5            14      bighead1            bighead6           4         Damned
foulcrow1           15      foulcrow1           foulcrow2          0         FoulCrow
foulcrow2           16      foulcrow1           foulcrow3          1         BloodHawk
foulcrow3           17      foulcrow1           foulcrow4          2         BlackRaptor
foulcrow4           18      foulcrow1           foulcrow5          3         CloudStalker
fallen1             19      fallen1             fallen2            0         Fallen
fallen2             20      fallen1             fallen3            1         Carver
fallen3             21      fallen1             fallen4            2         Devilkin
fallen4             22      fallen1             fallen5            3         DarkOne
fallen5             23      fallen1             fallen6            4         WarpedFallen
brute2              24      brute2              brute3             0         Brute
brute3              25      brute2              brute4             1         Yeti
brute4              26      brute2              brute5             2         Crusher
brute5              27      brute2              brute1             3         WailingBeast
brute1              28      brute2                                 4         GargantuanBeast
sandraider1         29      sandraider1         sandraider2        0         SandRaider
sandraider2         30      sandraider1         sandraider3        1         Marauder
sandraider3         31      sandraider1         sandraider4        2         Invader
sandraider4         32      sandraider1         sandraider5        3         Infidel
sandraider5         33      sandraider1         sandraider6        4         Assailant
gorgon1             34      gorgon1             gorgon2            0         unused
gorgon2             35      gorgon1             gorgon3            1         unused
gorgon3             36      gorgon1             gorgon4            2         unused
gorgon4             37      gorgon1                                3         unused
wraith1             38      wraith1             wraith2            0         Ghost
wraith2             39      wraith1             wraith3            1         Wraith
wraith3             40      wraith1             wraith4            2         Specter
wraith4             41      wraith1             wraith5            3         Apparition
wraith5             42      wraith1             wraith6            4         DarkShape
corruptrogue1       43      corruptrogue1       corruptrogue2      0         DarkHunter
corruptrogue2       44      corruptrogue1       corruptrogue3      1         VileHunter
corruptrogue3       45      corruptrogue1       corruptrogue4      2         DarkStalker
corruptrogue4       46      corruptrogue1       corruptrogue5      3         BlackRogue
corruptrogue5       47      corruptrogue1                          4         FleshHunter
baboon1             48      baboon1             baboon2            0         DuneBeast
baboon2             49      baboon1             baboon3            1         RockDweller
baboon3             50      baboon1             baboon4            2         JungleHunter
baboon4             51      baboon1             baboon5            3         DoomApe
baboon5             52      baboon1             baboon7            4         TempleGuard
goatman1            53      goatman1            goatman2           0         MoonClan
goatman2            54      goatman1            goatman3           1         NightClan
goatman3            55      goatman1            goatman4           2         BloodClan
goatman4            56      goatman1            goatman5           3         HellClan
goatman5            57      goatman1            goatman6           4         DeathClan
fallenshaman1       58      fallenshaman1       fallenshaman2      0         FallenShaman
fallenshaman2       59      fallenshaman1       fallenshaman3      1         CarverShaman
fallenshaman3       60      fallenshaman1       fallenshaman4      2         DevilkinShaman
fallenshaman4       61      fallenshaman1       fallenshaman5      3         DarkShaman
fallenshaman5       62      fallenshaman1       fallenshaman6      4         WarpedShaman
quillrat1           63      quillrat1           quillrat2          0         QuillRat
quillrat2           64      quillrat1           quillrat3          1         SpikeFiend
quillrat3           65      quillrat1           quillrat4          2         ThornBeast
quillrat4           66      quillrat1           quillrat5          3         RazorSpine
quillrat5           67      quillrat1           quillrat6          4         JungleUrchin
sandmaggot1         68      sandmaggot1         sandmaggot2        0         SandMaggot
sandmaggot2         69      sandmaggot1         sandmaggot3        1         RockWorm
sandmaggot3         70      sandmaggot1         sandmaggot4        2         Devourer
sandmaggot4         71      sandmaggot1         sandmaggot5        3         GiantLamprey
sandmaggot5         72      sandmaggot1         sandmaggot6        4         WorldKiller
clawviper1          73      clawviper1          clawviper2         0         TombViper
clawviper2          74      clawviper1          clawviper3         1         ClawViper
clawviper3          75      clawviper1          clawviper4         2         Salamander
clawviper4          76      clawviper1          clawviper5         3         PitViper
clawviper5          77      clawviper1          clawviper6         4         SerpentMagus
sandleaper1         78      sandleaper1         sandleaper2        0         SandLeaper
sandleaper2         79      sandleaper1         sandleaper3        1         CaveLeaper
sandleaper3         80      sandleaper1         sandleaper4        2         TombCreeper
sandleaper4         81      sandleaper1         sandleaper5        3         TreeLurker
sandleaper5         82      sandleaper1         sandleaper6        4         RazorPitDemon
pantherwoman1       83      pantherwoman1       pantherwoman2      0         Huntress
pantherwoman2       84      pantherwoman1       pantherwoman3      1         SaberCat
pantherwoman3       85      pantherwoman1       pantherwoman4      2         NightTiger
pantherwoman4       86      pantherwoman1       pantherwoman5      3         HellCat
swarm1              87      swarm1              swarm2             0         Itchies
swarm2              88      swarm1              swarm3             1         BlackLocusts
swarm3              89      swarm1              swarm4             2         PlagueBugs
swarm4              90      swarm1                                 3         HellSwarm
scarab1             91      scarab1             scarab2            0         DungSoldier
scarab2             92      scarab1             scarab3            1         SandWarrior
scarab3             93      scarab1             scarab4            2         Scarab
scarab4             94      scarab1             scarab5            3         SteelWeevil
scarab5             95      scarab1             scarab6            4         AlbinoRoach
mummy1              96      mummy1              mummy2             0         DriedCorpse
mummy2              97      mummy1              mummy3             1         Decayed
mummy3              98      mummy1              mummy4             2         Embalmed
mummy4              99      mummy1              mummy5             3         PreservedDead
mummy5              100     mummy1              mummy6             4         Cadaver
unraveler1          101     unraveler1          unraveler2         0         HollowOne
unraveler2          102     unraveler1          unraveler3         1         Guardian
unraveler3          103     unraveler1          unraveler4         2         Unraveler
unraveler4          104     unraveler1          unraveler5         3         Horadrim Ancient
unraveler5          105     unraveler1          unraveler6         4         Baal Subject Mummy
chaoshorde1         106     chaoshorde1         chaoshorde2        0         unused
chaoshorde2         107     chaoshorde1         chaoshorde3        1         unused
chaoshorde3         108     chaoshorde1         chaoshorde4        2         unused
chaoshorde4         109     chaoshorde1                            3         unused
vulture1            110     vulture1            vulture2           0         CarrionBird
vulture2            111     vulture1            vulture3           1         UndeadScavenger
vulture3            112     vulture1            vulture4           2         HellBuzzard
vulture4            113     vulture1            vulture5           3         WingedNightmare
mosquito1           114     mosquito1           mosquito2          0         Sucker
mosquito2           115     mosquito1           mosquito3          1         Feeder
mosquito3           116     mosquito1           mosquito4          2         BloodHook
mosquito4           117     mosquito1                              3         BloodWing
willowisp1          118     willowisp1          willowisp2         0         Gloam
willowisp2          119     willowisp1          willowisp3         1         SwampGhost
willowisp3          120     willowisp1          willowisp4         2         BurningSoul
willowisp4          121     willowisp1          willowisp5         3         BlackSoul
arach1              122     arach1              arach2             0         Arach
arach2              123     arach1              arach3             1         SandFisher
arach3              124     arach1              arach4             2         PoisonSpinner
arach4              125     arach1              arach5             3         FlameSpider
arach5              126     arach1              arach6             4         SpiderMagus
thornhulk1          127     thornhulk1          thornhulk2         0         ThornedHulk
thornhulk2          128     thornhulk1          thornhulk3         1         BrambleHulk
thornhulk3          129     thornhulk1          thornhulk4         2         Thrasher
thornhulk4          130     thornhulk1          thornhulk5         3         Spikefist
vampire1            131     vampire1            vampire2           0         GhoulLord
vampire2            132     vampire1            vampire3           1         NightLord
vampire3            133     vampire1            vampire4           2         DarkLord
vampire4            134     vampire1            vampire5           3         BloodLord
vampire5            135     vampire1            vampire6           4         Banished
batdemon1           136     batdemon1           batdemon2          0         DesertWing
batdemon2           137     batdemon1           batdemon3          1         Fiend
batdemon3           138     batdemon1           batdemon4          2         Gloombat
batdemon4           139     batdemon1           batdemon5          3         BloodDiver
batdemon5           140     batdemon1           batdemon6          4         DarkFamiliar
fetish1             141     fetish1             fetish2            0         RatMan
fetish2             142     fetish1             fetish3            1         Fetish
fetish3             143     fetish1             fetish4            2         Flayer
fetish4             144     fetish1             fetish5            3         SoulKiller
fetish5             145     fetish1             fetish6            4         StygianDoll
cain1               146     cain1                                  0         DeckardCain
gheed               147     gheed                                  0         Gheed
akara               148     akara                                  0         Akara
chicken             149     chicken                                0         dummy
kashya              150     kashya                                 0         Kashya
rat                 151     rat                                    0         dummy
rogue1              152     rogue1                                 0         Dummy
hellmeteor          153     hellmeteor                             0         Dummy
charsi              154     charsi                                 0         Charsi
warriv1             155     warriv1                                0         Warriv
andariel            156     andariel                               0         Andariel
bird1               157     bird1                                  0         dummy
bird2               158     bird2                                  0         dummy
bat                 159     bat                                    0         dummy
cr_archer1          160     cr_archer1          cr_archer2         0         DarkRanger
cr_archer2          161     cr_archer1          cr_archer3         1         VileArcher
cr_archer3          162     cr_archer1          cr_archer4         2         DarkArcher
cr_archer4          163     cr_archer1          cr_archer5         3         BlackArcher
cr_archer5          164     cr_archer1          cr_archer6         4         FleshArcher
cr_lancer1          165     cr_lancer1          cr_lancer2         0         DarkSpearwoman
cr_lancer2          166     cr_lancer1          cr_lancer3         1         VileLancer
cr_lancer3          167     cr_lancer1          cr_lancer4         2         DarkLancer
cr_lancer4          168     cr_lancer1          cr_lancer5         3         BlackLancer
cr_lancer5          169     cr_lancer1          cr_lancer6         4         FleshLancer
sk_archer1          170     sk_archer1          sk_archer2         0         SkeletonArcher
sk_archer2          171     sk_archer1          sk_archer3         1         ReturnedArcher
sk_archer3          172     sk_archer1          sk_archer4         2         BoneArcher
sk_archer4          173     sk_archer1          sk_archer5         3         BurningDeadArcher
sk_archer5          174     sk_archer1          sk_archer6         4         HorrorArcher
warriv2             175     warriv2                                0         Warriv
atma                176     atma                                   0         Atma
drognan             177     drognan                                0         Drognan
fara                178     fara                                   0         Fara
cow                 179     cow                                    0         dummy
maggotbaby1         180     maggotbaby1         maggotbaby2        0         SandMaggotYoung
maggotbaby2         181     maggotbaby1         maggotbaby3        1         RockWormYoung
maggotbaby3         182     maggotbaby1         maggotbaby4        2         DevourerYoung
maggotbaby4         183     maggotbaby1         maggotbaby5        3         GiantLampreyYoung
maggotbaby5         184     maggotbaby1         maggotbaby6        4         WorldKillerYoung
camel               185     camel                                  0         dummy
blunderbore1        186     blunderbore1        blunderbore2       0         Blunderbore
blunderbore2        187     blunderbore1        blunderbore3       1         Gorbelly
blunderbore3        188     blunderbore1        blunderbore4       2         Mauler
blunderbore4        189     blunderbore1        blunderbore5       3         Urdar
maggotegg1          190     maggotegg1          maggotegg2         0         SandMaggotEgg
maggotegg2          191     maggotegg1          maggotegg3         1         RockWormEgg
maggotegg3          192     maggotegg1          maggotegg4         2         DevourerEgg
maggotegg4          193     maggotegg1          maggotegg5         3         GiantLampreyEgg
maggotegg5          194     maggotegg1          maggotegg6         4         WorldKillerEgg
act2male            195     act2male                               0         dummy
act2female          196     act2female                             0         Dummy
act2child           197     act2child                              0         dummy
greiz               198     greiz                                  0         Greiz
elzix               199     elzix                                  0         Elzix
geglash             200     geglash                                0         Geglash
jerhyn              201     jerhyn                                 0         Jerhyn
lysander            202     lysander                               0         Lysander
act2guard1          203     act2guard1                             0         Dummy
act2vendor1         204     act2vendor1                            0         dummy
act2vendor2         205     act2vendor2                            0         dummy
crownest1           206     crownest1           crownest2          0         FoulCrowNest
crownest2           207     crownest1           crownest3          1         BloodHawkNest
crownest3           208     crownest1           crownest4          2         BlackVultureNest
crownest4           209     crownest1                              3         CloudStalkerNest
meshif1             210     meshif1                                0         Meshif
duriel              211     duriel                                 0         Duriel
bonefetish1         212     bonefetish1         bonefetish2        0         Undead RatMan
bonefetish2         213     bonefetish1         bonefetish3        1         Undead Fetish
bonefetish3         214     bonefetish1         bonefetish4        2         Undead Flayer
bonefetish4         215     bonefetish1         bonefetish5        3         Undead SoulKiller
bonefetish5         216     bonefetish1         bonefetish6        4         Undead StygianDoll
darkguard1          217     darkguard1          darkguard2         0         unused
darkguard2          218     darkguard1          darkguard3         1         unused
darkguard3          219     darkguard1          darkguard4         2         unused
darkguard4          220     darkguard1          darkguard5         3         unused
darkguard5          221     darkguard1                             4         unused
bloodmage1          222     bloodmage1          bloodmage2         0         unused
bloodmage2          223     bloodmage1          bloodmage3         1         unused
bloodmage3          224     bloodmage1          bloodmage4         2         unused
bloodmage4          225     bloodmage1          bloodmage5         3         unused
bloodmage5          226     bloodmage1                             4         unused
maggot              227     maggot                                 0         Maggot
sarcophagus         228     sarcophagus                            0         MummyGenerator
radament            229     radament                               0         Radament
firebeast           230     firebeast                              0         unused
iceglobe            231     iceglobe                               0         unused
lightningbeast      232     lightningbeast                         0         unused
poisonorb           233     poisonorb                              0         unused
flyingscimitar      234     flyingscimitar                         0         FlyingScimitar
zealot1             235     zealot1             zealot2            0         Zakarumite
zealot2             236     zealot1             zealot3            1         Faithful
zealot3             237     zealot1             zealot4            2         Zealot
cantor1             238     cantor1             cantor2            0         Sexton
cantor2             239     cantor1             cantor3            1         Cantor
cantor3             240     cantor1             cantor4            2         Heirophant
cantor4             241     cantor1             cantor5            3         Heirophant
mephisto            242     mephisto                               0         Mephisto
diablo              243     diablo                                 0         Diablo
cain2               244     cain2                                  0         DeckardCain
cain3               245     cain3                                  0         DeckardCain
cain4               246     cain4                                  0         DeckardCain
frogdemon1          247     frogdemon1          frogdemon2         0         Swamp Dweller
frogdemon2          248     frogdemon1          frogdemon3         1         Bog Creature
frogdemon3          249     frogdemon1                             2         Slime Prince
summoner            250     summoner                               0         Summoner
tyrael1             251     tyrael1                                0         tyrael
asheara             252     asheara                                0         asheara
hratli              253     hratli                                 0         hratli
alkor               254     alkor                                  0         alkor
ormus               255     ormus                                  0         ormus
izual               256     izual                                  0         izual
halbu               257     halbu                                  0         halbu
tentacle1           258     tentacle1           tentacle2          0         WaterWatcherLimb
tentacle2           259     tentacle1           tentacle3          1         RiverStalkerLimb
tentacle3           260     tentacle1                              2         StygianWatcherLimb
tentaclehead1       261     tentaclehead1       tentaclehead2      0         WaterWatcherHead
tentaclehead2       262     tentaclehead1       tentaclehead3      1         RiverStalkerHead
tentaclehead3       263     tentaclehead1                          2         StygianWatcherHead
meshif2             264     meshif2                                0         meshif
cain5               265     cain5                                  0         DeckardCain
navi                266     navi                                   0         navi
bloodraven          267     bloodraven                             0         Bloodraven
bug                 268     bug                                    0         Dummy
scorpion            269     scorpion                               0         Dummy
rogue2              270     rogue2                                 0         RogueScout
roguehire           271     roguehire                              0         Dummy
rogue3              272     rogue3                                 0         Dummy
gargoyletrap        273     gargoyletrap                           0         GargoyleTrap
skmage_pois1        274     skmage_pois1        skmage_pois2       1         ReturnedMage
skmage_pois2        275     skmage_pois1        skmage_pois3       2         BoneMage
skmage_pois3        276     skmage_pois1        skmage_pois4       3         BurningDeadMage
skmage_pois4        277     skmage_pois1        skmage_pois5       4         HorrorMage
fetishshaman1       278     fetishshaman1       fetishshaman2      0         RatManShaman
fetishshaman2       279     fetishshaman1       fetishshaman3      1         FetishShaman
fetishshaman3       280     fetishshaman1       fetishshaman4      2         FlayerShaman
fetishshaman4       281     fetishshaman1       fetishshaman5      3         SoulKillerShaman
fetishshaman5       282     fetishshaman1       fetishshaman6      4         StygianDollShaman
larva               283     larva                                  0         larva
maggotqueen1        284     maggotqueen1        maggotqueen2       0         SandMaggotQueen
maggotqueen2        285     maggotqueen1        maggotqueen3       1         RockWormQueen
maggotqueen3        286     maggotqueen1        maggotqueen4       2         DevourerQueen
maggotqueen4        287     maggotqueen1        maggotqueen5       3         GiantLampreyQueen
maggotqueen5        288     maggotqueen1                           4         WorldKillerQueen
claygolem           289     claygolem                              0         ClayGolem
bloodgolem          290     bloodgolem                             0         BloodGolem
irongolem           291     irongolem                              0         IronGolem
firegolem           292     firegolem                              0         FireGolem
familiar            293     familiar                               0         Dummy
act3male            294     act3male                               0         Dummy
baboon6             295     baboon6                                0         NightMarauder
act3female          296     act3female                             0         Dummy
natalya             297     natalya                                0         Natalya
vilemother1         298     vilemother1         vilemother2        0         FleshSpawner
vilemother2         299     vilemother1         vilemother3        1         StygianHag
vilemother3         300     vilemother1         vilemother4        2         Grotesque
vilechild1          301     vilechild1          vilechild2         0         FleshBeast
vilechild2          302     vilechild1          vilechild3         1         StygianDog
vilechild3          303     vilechild1          vilechild4         2         GrotesqueWyrm
fingermage1         304     fingermage1         fingermage2        0         Groper
fingermage2         305     fingermage1         fingermage3        1         Strangler
fingermage3         306     fingermage1         fingermage4        2         StormCaster
regurgitator1       307     regurgitator1       regurgitator2      0         Corpulent
regurgitator2       308     regurgitator1       regurgitator3      1         CorpseSpitter
regurgitator3       309     regurgitator1       regurgitator4      2         MawFiend
doomknight1         310     doomknight1         dkfig1             0         DoomKnight
doomknight2         311     doomknight2                            0         AbyssKnight
doomknight3         312     doomknight3         dkmag1             0         OblivionKnight
quillbear1          313     quillbear1          quillbear2         0         QuillBear
quillbear2          314     quillbear1          quillbear3         1         SpikeGiant
quillbear3          315     quillbear1          quillbear4         2         ThornBrute
quillbear4          316     quillbear1          quillbear5         3         RazorBeast
quillbear5          317     quillbear1                             4         GiantUrchin
snake               318     snake                                  0         Dummy
parrot              319     parrot                                 0         Dummy
fish                320     fish                                   0         Dummy
evilhole1           321     evilhole1           evilhole2          0         Dummy
evilhole2           322     evilhole1           evilhole3          1         Dummy
evilhole3           323     evilhole1           evilhole4          2         Dummy
evilhole4           324     evilhole1           evilhole5          3         Dummy
evilhole5           325     evilhole1                              4         Dummy
trap-firebolt       326     trap-firebolt                          0         a trap
trap-horzmissile    327     trap-horzmissile                       0         a trap
trap-vertmissile    328     trap-vertmissile                       0         a trap
trap-poisoncloud    329     trap-poisoncloud                       0         a trap
trap-lightning      330     trap-lightning                         0         a trap
act2guard2          331     act2guard2                             0         Kaelan
invisospawner       332     invisospawner                          0         Dummy
diabloclone         333     diablo                                 0         Diablo
suckernest1         334     suckernest1         suckernest2        0         SuckerNest
suckernest2         335     suckernest1         suckernest3        1         FeederNest
suckernest3         336     suckernest1         suckernest4        2         BloodHookNest
suckernest4         337     suckernest1                            3         BloodWingNest
act2hire            338     act2hire                               0         Guard
minispider          339     minispider                             0         Dummy
boneprison1         340     boneprison1                            0         
boneprison2         341     boneprison2                            0         
boneprison3         342     boneprison3                            0         
boneprison4         343     boneprison4                            0         
bonewall            344     bonewall                               0         Dummy
councilmember1      345     councilmember1      councilmember2     0         Council Member
councilmember2      346     councilmember1      councilmember3     1         Council Member
councilmember3      347     councilmember1                         2         Council Member
turret1             348     turret1             turret2            0         Turret
turret2             349     turret1             turret3            1         Turret
turret3             350     turret1                                2         Turret
hydra1              351     hydra1                                 0         Hydra
hydra2              352     hydra2                                 0         Hydra
hydra3              353     hydra3                                 0         Hydra
trap-melee          354     trap-melee                             0         a trap
seventombs          355     seventombs                             0         Dummy
dopplezon           356     dopplezon                              0         Dopplezon
valkyrie            357     valkyrie                               0         Valkyrie
act2guard3          358     act2guard3                             0         Dummy
act3hire            359     act3hire                               0         Iron Wolf
megademon1          360     megademon1          megademon2         0         Balrog
megademon2          361     megademon1          megademon3         1         PitLord
megademon3          362     megademon1          megademon4         2         VenomLord
necroskeleton       363     necroskeleton                          0         NecroSkeleton
necromage           364     necromage                              0         NecroMage
griswold            365     griswold                               0         Griswold
compellingorb       366     compellingorb                          0         compellingorb
tyrael2             367     tyrael2                                0         tyrael
darkwanderer        368     darkwanderer                           0         youngdiablo
trap-nova           369     trap-nova                              0         a trap
spiritmummy         370     spiritmummy                            0         Dummy
lightningspire      371     lightningspire                         0         LightningSpire
firetower           372     firetower                              0         FireTower
slinger1            373     slinger1            slinger2           0         Slinger
slinger2            374     slinger1            slinger3           1         SpearCat
slinger3            375     slinger1            slinger4           2         NightSlinger
slinger4            376     slinger1            slinger7           3         HellSlinger
act2guard4          377     act2guard4                             0         Dummy
act2guard5          378     act2guard5                             0         Dummy
skmage_cold1        379     skmage_cold1        skmage_cold2       1         ReturnedMage
skmage_cold2        380     skmage_cold1        skmage_cold3       2         BoneMage
skmage_cold3        381     skmage_cold1        skmage_cold4       3         BaalColdMage
skmage_cold4        382     skmage_cold1        skmage_cold5       4         HorrorMage
skmage_fire1        383     skmage_fire1        skmage_fire2       1         ReturnedMage
skmage_fire2        384     skmage_fire1        skmage_fire3       2         BoneMage
skmage_fire3        385     skmage_fire1        skmage_fire4       3         BurningDeadMage
skmage_fire4        386     skmage_fire1        skmage_fire5       4         HorrorMage
skmage_ltng1        387     skmage_ltng1        skmage_ltng2       1         ReturnedMage
skmage_ltng2        388     skmage_ltng1        skmage_ltng3       2         BoneMage
skmage_ltng3        389     skmage_ltng1        skmage_ltng4       3         BurningDeadMage
skmage_ltng4        390     skmage_ltng1        skmage_ltng5       4         HorrorMage
hellbovine          391     hellbovine                             0         Hell Bovine
window1             392     window1                                0         
window2             393     window2                                0         
slinger5            394     slinger5            slinger6           0         SpearCat
slinger6            395     slinger5                               1         NightSlinger
fetishblow1         396     fetishblow1         fetishblow2        0         RatMan
fetishblow2         397     fetishblow1         fetishblow3        1         Fetish
fetishblow3         398     fetishblow1         fetishblow4        2         Flayer
fetishblow4         399     fetishblow1         fetishblow5        3         SoulKiller
fetishblow5         400     fetishblow1         fetishblow6        4         StygianDoll
mephistospirit      401     mephistospirit                         0         Dummy
smith               402     smith                                  0         The Smith
trappedsoul1        403     trappedsoul1                           0         TrappedSoul
trappedsoul2        404     trappedsoul2                           0         TrappedSoul
jamella             405     jamella                                0         Jamella
izualghost          406     izualghost                             0         Izual
fetish11            407     fetish11                               0         RatMan
malachai            408     malachai                               0         Malachai
hephasto            409     hephasto                               0         The Feature Creep
Expansion
wakeofdestruction   410     wakeofdestruction                      0         Wake of Destruction
chargeboltsentry    411     chargeboltsentry                       0         Charged Bolt Sentry
lightningsentry     412     lightningsentry                        0         Lightning Sentry
bladecreeper        413     bladecreeper                           0         Blade Creeper
invisopet           414     invisopet                              0         Invis Pet
infernosentry       415     infernosentry                          0         Inferno Sentry
deathsentry         416     deathsentry                            0         Death Sentry
shadowwarrior       417     shadowwarrior                          0         Shadow Warrior
shadowmaster        418     shadowmaster                           0         Shadow Master
druidhawk           419     druidhawk                              0         Druid Hawk
spiritwolf          420     spiritwolf          fenris             0         Druid Spirit Wolf
fenris              421     spiritwolf                             1         Druid Fenris
spiritofbarbs       422     spiritofbarbs       heartofwolverine   0         Spirit of Barbs
heartofwolverine    423     spiritofbarbs       oaksage            1         Heart of Wolverine
oaksage             424     spiritofbarbs                          2         Oak Sage
plaguepoppy         425     plaguepoppy                            0         Druid Plague Poppy
cycleoflife         426     cycleoflife                            0         Druid Cycle of Life
vinecreature        427     vinecreature                           0         Vine Creature
druidbear           428     druidbear                              0         Druid Bear
eagle               429     eagle                                  0         Eagle
wolf                430     wolf                                   0         Wolf
bear                431     bear                                   0         Bear
barricadedoor1      432     barricadedoor1      barricadedoor2     0         Barricade Door
barricadedoor2      433     barricadedoor1                         1         Barricade Door
prisondoor          434     prisondoor                             0         Prison Door
barricadetower      435     barricadetower                         0         Barricade Tower
reanimatedhorde1    436     reanimatedhorde1    reanimatedhorde2   0         RotWalker
reanimatedhorde2    437     reanimatedhorde1    reanimatedhorde3   1         ReanimatedHorde
reanimatedhorde3    438     reanimatedhorde1    reanimatedhorde4   2         ProwlingDead
reanimatedhorde4    439     reanimatedhorde1    reanimatedhorde5   3         UnholyCorpse
reanimatedhorde5    440     reanimatedhorde1    reanimatedhorde6   4         DefiledWarrior
siegebeast1         441     siegebeast1         siegebeast2        0         Siege Beast
siegebeast2         442     siegebeast1         siegebeast3        1         CrushBiest
siegebeast3         443     siegebeast1         siegebeast4        2         BloodBringer
siegebeast4         444     siegebeast1         siegebeast5        3         GoreBearer
siegebeast5         445     siegebeast1                            4         DeamonSteed
snowyeti1           446     snowyeti1           snowyeti2          0         SnowYeti1
snowyeti2           447     snowyeti1           snowyeti3          1         SnowYeti2
snowyeti3           448     snowyeti1           snowyeti4          2         SnowYeti3
snowyeti4           449     snowyeti1                              3         SnowYeti4
wolfrider1          450     wolfrider1          wolfrider2         0         WolfRider1
wolfrider2          451     wolfrider1          wolfrider3         1         WolfRider2
wolfrider3          452     wolfrider1                             2         WolfRider3
minion1             453     minion1             minion2            0         Minionexp
minion2             454     minion1             minion3            2         Slayerexp
minion3             455     minion1             minion4            1         IceBoar
minion4             456     minion1             minion5            3         FireBoar
minion5             457     minion1             minion6            4         HellSpawn
minion6             458     minion1             minion7            5         IceSpawn
minion7             459     minion1             minion8            6         GreaterHellSpawn
minion8             460     minion1             minion9            7         GreaterIceSpawn
suicideminion1      461     suicideminion1      suicideminion2     0         FanaticMinion
suicideminion2      462     suicideminion1      suicideminion3     1         BerserkSlayer
suicideminion3      463     suicideminion1      suicideminion4     2         ConsumedIceBoar
suicideminion4      464     suicideminion1      suicideminion5     3         ConsumedFireBoar
suicideminion5      465     suicideminion1      suicideminion6     4         FrenziedHellSpawn
suicideminion6      466     suicideminion1      suicideminion7     5         FrenziedIceSpawn
suicideminion7      467     suicideminion1      suicideminion8     6         InsaneHellSpawn
suicideminion8      468     suicideminion1                         7         InsaneIceSpawn
succubus1           469     succubus1           succubus2          0         Succubusexp
succubus2           470     succubus1           succubus3          1         VileTemptress
succubus3           471     succubus1           succubus4          2         StygianHarlot
succubus4           472     succubus1           succubus5          3         Hell Temptress
succubus5           473     succubus1           succubus6          4         Blood Temptress
succubuswitch1      474     succubuswitch1      succubuswitch2     0         Dominus
succubuswitch2      475     succubuswitch1      succubuswitch3     1         VileWitch
succubuswitch3      476     succubuswitch1      succubuswitch4     2         StygianFury
succubuswitch4      477     succubuswitch1      succubuswitch5     3         Blood Witch
succubuswitch5      478     succubuswitch1      succubuswitch6     4         Hell Witch
overseer1           479     overseer1           overseer2          0         OverSeer
overseer2           480     overseer1           overseer3          1         Lasher
overseer3           481     overseer1           overseer4          2         OverLord
overseer4           482     overseer1           overseer5          3         BloodBoss
overseer5           483     overseer1                              4         HellWhip
minionspawner1      484     minionspawner1      minionspawner2     0         MinionSpawner
minionspawner2      485     minionspawner1      minionspawner3     1         MinionSlayerSpawner
minionspawner3      486     minionspawner1      minionspawner4     2         MinionIce/fireBoarSpawner
minionspawner4      487     minionspawner1      minionspawner5     3         MinionIce/fireBoarSpawner
minionspawner5      488     minionspawner1      minionspawner6     4         Minionice/hellSpawnSpawner
minionspawner6      489     minionspawner1      minionspawner7     5         MinionIce/fireBoarSpawner
minionspawner7      490     minionspawner1      minionspawner8     6         MinionIce/fireBoarSpawner
minionspawner8      491     minionspawner1                         7         Minionice/hellSpawnSpawner
imp1                492     imp1                imp2               0         Imp1
imp2                493     imp1                imp3               1         Imp2
imp3                494     imp1                imp4               2         Imp3
imp4                495     imp1                imp5               3         Imp4
imp5                496     imp1                imp6               4         Imp5
catapult1           497     catapult1           catapult2          0         CatapultS
catapult2           498     catapult1           catapult3          1         CatapultE
catapult3           499     catapult1           catapult4          2         CatapultSiege
catapult4           500     catapult1                              3         CatapultW
frozenhorror1       501     frozenhorror1       frozenhorror2      0         Frozen Horror1
frozenhorror2       502     frozenhorror1       frozenhorror3      1         Frozen Horror2
frozenhorror3       503     frozenhorror1       frozenhorror4      2         Frozen Horror3
frozenhorror4       504     frozenhorror1       frozenhorror5      3         Frozen Horror4
frozenhorror5       505     frozenhorror1                          4         Frozen Horror5
bloodlord1          506     bloodlord1          bloodlord2         0         Blood Lord1
bloodlord2          507     bloodlord1          bloodlord3         1         Blood Lord2
bloodlord3          508     bloodlord1          bloodlord4         2         Blood Lord3
bloodlord4          509     bloodlord1          bloodlord5         3         Blood Lord4
bloodlord5          510     bloodlord1          bloodlord6         4         Blood Lord5
larzuk              511     larzuk                                 0         Larzuk
drehya              512     drehya                                 0         Drehya
malah               513     malah                                  0         Malah
nihlathak           514     nihlathak                              0         Nihlathak Town
qual-kehk           515     qual-kehk                              0         Qual-Kehk
catapultspotter1    516     catapultspotter1    catapultspotter2   0         Catapult Spotter S
catapultspotter2    517     catapultspotter1    catapultspotter3   1         Catapult Spotter E
catapultspotter3    518     catapultspotter1    catapultspotter4   2         Catapult Spotter Siege
catapultspotter4    519     catapultspotter1                       3         Catapult Spotter W
cain6               520     cain6                                  0         DeckardCain
tyrael3             521     tyrael3                                0         tyrael
act5barb1           522     act5barb1                              0         Act 5 Combatant
act5barb2           523     act5barb2                              0         Act 5 Combatant
barricadewall1      524     barricadewall1      barricadewall2     0         Barricade Wall Right
barricadewall2      525     barricadewall1                         1         Barricade Wall Left
nihlathakboss       526     nihlathakboss                          0         Nihlathak
drehyaiced          527     drehyaiced                             0         Drehya
evilhut             528     evilhut                                0         Evil hut
deathmauler1        529     deathmauler1        deathmauler2       0         Death Mauler1
deathmauler2        530     deathmauler1        deathmauler3       1         Death Mauler2
deathmauler3        531     deathmauler1        deathmauler4       2         Death Mauler3
deathmauler4        532     deathmauler1        deathmauler5       3         Death Mauler4
deathmauler5        533     deathmauler1        deathmauler6       4         Death Mauler5
act5pow             534     act5pow                                0         POW
act5barb3           535     act5barb3           act5barb4          0         Act 5 Townguard
act5barb4           536     act5barb3                              1         Act 5 Townguard
ancientstatue1      537     ancientstatue1      ancientstatue2     0         Ancient Statue 1
ancientstatue2      538     ancientstatue1      ancientstatue3     1         Ancient Statue 2
ancientstatue3      539     ancientstatue1                         2         Ancient Statue 3
ancientbarb1        540     ancientbarb1        ancientbarb2       0         Ancient Barbarian 1
ancientbarb2        541     ancientbarb1        ancientbarb3       1         Ancient Barbarian 2
ancientbarb3        542     ancientbarb1                           2         Ancient Barbarian 3
baalthrone          543     baalthrone                             0         Baal Throne
baalcrab            544     baalcrab                               0         Baal Crab
baaltaunt           545     baaltaunt                              0         Baal Taunt
putriddefiler1      546     putriddefiler1      putriddefiler2     0         Putrid Defiler1
putriddefiler2      547     putriddefiler1      putriddefiler3     1         Putrid Defiler2
putriddefiler3      548     putriddefiler1      putriddefiler4     2         Putrid Defiler3
putriddefiler4      549     putriddefiler1      putriddefiler5     3         Putrid Defiler4
putriddefiler5      550     putriddefiler1                         4         Putrid Defiler5
painworm1           551     painworm1           painworm2          0         Pain Worm1
painworm2           552     painworm1           painworm3          1         Pain Worm2
painworm3           553     painworm1           painworm4          2         Pain Worm3
painworm4           554     painworm1           painworm5          3         Pain Worm4
painworm5           555     painworm1                              4         Pain Worm5
bunny               556     bunny                                  0         Bunny
baalhighpriest      557     baalhighpriest                         0         Council Member
venomlord           558     venomlord                              0         VenomLord
baalcrabstairs      559     baalcrabstairs                         0         Baal Crab to Stairs
act5hire1           560     act5hire1           act5hire2          0         Act 5 Hireling 1hs
act5hire2           561     act5hire1                              1         Act 5 Hireling 2hs
baaltentacle1       562     baaltentacle1       baaltentacle2      0         Baal Tentacle
baaltentacle2       563     baaltentacle1       baaltentacle3      1         Baal Tentacle
baaltentacle3       564     baaltentacle1       baaltentacle4      2         Baal Tentacle
baaltentacle4       565     baaltentacle1       baaltentacle5      3         Baal Tentacle
baaltentacle5       566     baaltentacle1                          4         Baal Tentacle
injuredbarb1        567     injuredbarb1                           0         Injured Barbarian 1
injuredbarb2        568     injuredbarb2                           0         Injured Barbarian 2
injuredbarb3        569     injuredbarb3                           0         Injured Barbarian 3
baalclone           570     baalclone                              0         Baal Crab Clone
baalminion1         571     baalminion1         baalminion2        0         Baals Minion
baalminion2         572     baalminion1         baalminion3        1         Baals Minion
baalminion3         573     baalminion1                            2         Baals Minion
worldstoneeffect    574     worldstoneeffect                       0         Worldstone Effect
sk_archer6          575     sk_archer1          sk_archer7         3         BurningDeadArcher
sk_archer7          576     sk_archer1          sk_archer8         2         BoneArcher
sk_archer8          577     sk_archer1          sk_archer9         3         BurningDeadArcher
sk_archer9          578     sk_archer1          sk_archer10        1         ReturnedArcher
sk_archer10         579     sk_archer1                             4         HorrorArcher
bighead6            580     bighead1            bighead7           4         Afflicted
bighead7            581     bighead1            bighead8           1         Tainted
bighead8            582     bighead1            bighead9           2         Misshapen
bighead9            583     bighead1            bighead10          3         Disfigured
bighead10           584     bighead1                               0         Damned
goatman6            585     goatman1            goatman7           0         MoonClan
goatman7            586     goatman1            goatman8           1         NightClan
goatman8            587     goatman1            goatman9           2         HellClan
goatman9            588     goatman1            goatman10          3         BloodClan
goatman10           589     goatman1                               4         DeathClan
foulcrow5           590     foulcrow1           foulcrow6          0         FoulCrow
foulcrow6           591     foulcrow1           foulcrow7          1         BloodHawk
foulcrow7           592     foulcrow1           foulcrow8          2         BlackRaptor
foulcrow8           593     foulcrow1                              3         CloudStalker
clawviper6          594     clawviper1          clawviper7         4         ClawViper
clawviper7          595     clawviper1          clawviper8         4         PitViper
clawviper8          596     clawviper1          clawviper9         0         Salamander
clawviper9          597     clawviper1          clawviper10        1         TombViper
clawviper10         598     clawviper1                             1         SerpentMagus
sandraider6         599     sandraider1         sandraider7        0         Marauder
sandraider7         600     sandraider1         sandraider8        1         Infidel
sandraider8         601     sandraider1         sandraider9        4         SandRaider
sandraider9         602     sandraider1         sandraider10       3         Invader
sandraider10        603     sandraider1                            2         Assailant
deathmauler6        604     deathmauler1                           0         Death Mauler1
quillrat6           605     quillrat1           quillrat7          0         QuillRat
quillrat7           606     quillrat1           quillrat8          1         SpikeFiend
quillrat8           607     quillrat1                              4         RazorSpine
vulture5            608     vulture1                               0         CarrionBird
thornhulk5          609     thornhulk1                             0         ThornedHulk
slinger7            610     slinger1            slinger8           0         Slinger
slinger8            611     slinger1            slinger9           1         Slinger
slinger9            612     slinger1                               1         Slinger
cr_archer6          613     cr_archer1          cr_archer7         1         VileArcher
cr_archer7          614     cr_archer1                             2         DarkArcher
cr_lancer6          615     cr_lancer1          cr_lancer7         1         VileLancer
cr_lancer7          616     cr_lancer1          cr_lancer8         2         DarkLancer
cr_lancer8          617     cr_lancer1                             3         BlackLancer
blunderbore5        618     blunderbore1        blunderbore6       0         Blunderbore
blunderbore6        619     blunderbore1                           2         Mauler
skmage_fire5        620     skmage_fire1        skmage_fire6       1         ReturnedMage
skmage_fire6        621     skmage_fire1                           3         BurningDeadMage
skmage_ltng5        622     skmage_ltng1        skmage_ltng6       1         ReturnedMage
skmage_ltng6        623     skmage_ltng1                           3         HorrorMage
skmage_cold5        624     skmage_cold1                           2         BoneMage
skmage_pois5        625     skmage_pois1        skmage_pois6       4         HorrorMage
skmage_pois6        626     skmage_pois1                           0         HorrorMage
pantherwoman5       627     pantherwoman1       pantherwoman6      0         Huntress
pantherwoman6       628     pantherwoman1                          1         SaberCat
sandleaper6         629     sandleaper1         sandleaper7        1         CaveLeaper
sandleaper7         630     sandleaper1                            3         TombCreeper
wraith6             631     wraith1             wraith7            0         Ghost
wraith7             632     wraith1             wraith8            0         Wraith
wraith8             633     wraith1                                0         Specter
succubus6           634     succubus1           succubus7          0         Succubusexp
succubus7           635     succubus1                              2         Hell Temptress
succubuswitch6      636     succubuswitch1      succubuswitch7     3         Dominus
succubuswitch7      637     succubuswitch1      succubuswitch8     4         Hell Witch
succubuswitch8      638     succubuswitch1                         1         VileWitch
willowisp5          639     willowisp1          willowisp6         0         Gloam
willowisp6          640     willowisp1          willowisp7         3         BlackSoul
willowisp7          641     willowisp1                             0         BurningSoul
fallen6             642     fallen1             fallen7            1         Carver
fallen7             643     fallen1             fallen8            2         Devilkin
fallen8             644     fallen1                                0         DarkOne
fallenshaman6       645     fallenshaman1       fallenshaman7      1         CarverShaman
fallenshaman7       646     fallenshaman1       fallenshaman8      2         DevilkinShaman
fallenshaman8       647     fallenshaman1                          0         DarkShaman
skeleton6           648     skeleton1           skeleton7          2         BoneWarrior
skeleton7           649     skeleton1                              1         Returned
batdemon6           650     batdemon1           batdemon7          1         Gloombat
batdemon7           651     batdemon1                              0         Fiend
bloodlord6          652     bloodlord1          bloodlord7         2         Blood Lord1
bloodlord7          653     bloodlord1                             3         Blood Lord4
scarab6             654     scarab1             scarab7            2         Scarab
scarab7             655     scarab1                                0         SteelWeevil
fetish6             656     fetish1             fetish7            1         Flayer
fetish7             657     fetish1             fetish8            0         StygianDoll
fetish8             658     fetish1                                2         SoulKiller
fetishblow6         659     fetishblow1         fetishblow7        1         Flayer
fetishblow7         660     fetishblow1         fetishblow8        0         StygianDoll
fetishblow8         661     fetishblow1                            2         SoulKiller
fetishshaman6       662     fetishshaman1       fetishshaman7      1         FlayerShaman
fetishshaman7       663     fetishshaman1       fetishshaman8      0         StygianDollShaman
fetishshaman8       664     fetishshaman1                          2         SoulKillerShaman
baboon7             665     baboon1             baboon8            4         TempleGuard
baboon8             666     baboon1                                3         TempleGuard
unraveler6          667     unraveler1          unraveler7         4         Guardian
unraveler7          668     unraveler1          unraveler8         2         Unraveler
unraveler8          669     unraveler1          unraveler9         4         Horadrim Ancient
unraveler9          670     unraveler1                             2         Horadrim Ancient
zealot4             671     zealot1             zealot5            1         Zealot
zealot5             672     zealot1                                2         Zealot
cantor5             673     cantor1             cantor6            1         Heirophant
cantor6             674     cantor1                                2         Heirophant
vilemother4         675     vilemother1         vilemother5        2         Grotesque
vilemother5         676     vilemother1                            0         FleshSpawner
vilechild4          677     vilechild1          vilechild5         2         GrotesqueWyrm
vilechild5          678     vilechild1                             0         FleshBeast
sandmaggot6         679     sandmaggot1                            4         WorldKiller
maggotbaby6         680     maggotbaby1                            4         WorldKillerYoung
maggotegg6          681     maggotegg1                             4         WorldKillerEgg
minion9             682     minion1             minion10           2         Slayerexp
minion10            683     minion1             minion11           3         HellSpawn
minion11            684     minion1                                2         GreaterHellSpawn
arach6              685     arach1                                 0         Arach
megademon4          686     megademon1          megademon5         0         Balrog
megademon5          687     megademon1                             0         PitLord
imp6                688     imp1                imp7               0         Imp1
imp7                689     imp1                                   3         Imp4
bonefetish6         690     bonefetish1         bonefetish7        2         Undead StygianDoll
bonefetish7         691     bonefetish1                            2         Undead SoulKiller
fingermage4         692     fingermage1         fingermage5        1         Strangler
fingermage5         693     fingermage1                            1         StormCaster
regurgitator4       694     regurgitator1                          2         MawFiend
vampire6            695     vampire1            vampire7           3         BloodLord
vampire7            696     vampire1            vampire8           0         GhoulLord
vampire8            697     vampire1                               3         DarkLord
reanimatedhorde6    698     reanimatedhorde1                       0         UnholyCorpse
dkfig1              699     doomknight1         dkfig2             0         DoomKnight
dkfig2              700     doomknight1                            0         DoomKnight
dkmag1              701     doomknight3         dkmag2             0         OblivionKnight
dkmag2              702     doomknight3                            0         OblivionKnight
mummy6              703     mummy1                                 3         Cadaver
```

## 우버 디아블로 (애니힐러스)

- 출처: 카오스큐브 "클래식 전용 우버(애니참) 획득 정보"(글쓴이 Aliase, https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941820). 근거: 웹 미검증. 원문 그대로(IP 확인 화면 그림 1장은 뺐다). Battle.net 기준 글이다.

== 우버디아란 ==

블리자드 사에서 수없이 복사된 조던의 수를 줄이기 위해 만든 하나의 이벤트입니다.
우버디아는 헬방에서 모든것이 이루어져야 합니다..
단 우버디아는 헬난이도에서 나오나 조던의 투척은 난이도와 상관없이 아이피만 동일한곳에서
투척해두됩니다

== 우버디아 소환 ==

마을에 있는 NPC(물건을 판매하는 모든 상점)에 조던을 판매합니다..
이때 조던 판매시 조던의 수는 랜덤이며 보통 80개~120개 정도면 우버디아가 출연합니다..
(NPC에 판매하는 조던의수는 랜덤입니다..더 많이 또는 더 적게 사용할수 있습니다..)
조던을 판매하고 있을때 '조던 XXXX개를 상점에 팔았습니다.' 라는 메시지가 나옵니다..
"디아블로가 이 땅을 배회하고 있다"라는 문구가 나올때까지 투척해야 합니다.
만약 조던투척후 조던 물량이 부족할때 같은 아이피 속한 다른방에서 조던을 이어서 판매 한다면 마찬가지로 이전 누적된 조던의 수와 합쳐져 우버디아를 소환할수 있습니다..

== 우버방 획득 ==

우선 우버방 획득은 우버 투척 아이피랑 동일해야 우버를 만날수 있습니다..

예)우버 투척방 아이피 끝자리 " 000 " 이라 가정

자신의 개설방 방 아이피 확인시 " 000 " 과 동일하다면 우버방 입니다..

기본적으로 아이피 세자리를 우버진행시 공개를 합니다...우버 진행시 불상사를 미연에 방지하고자
숫자 보다는 숫자위에 표기하고 있는 문자를 기재합니다..

예:숫자1 = ! , 숫자 = 5 % , 숫자 = 7 &

아이피 공개합니다 !%& 라고 표기 풀이하자면 157 입니다..

보통 우버이벤을 할 때 공개하는 아이피는 XXX.XXX.XX.OOO.4000 에서 제일 마지막의 "000"세자리숫자를 뜻합니다.
각 방에는 고유한 아이피가 있는데 일단 아시아 1 에서 나올 수 있는 아이피는 130~229 까지로 알고 있습니다.
한 아이피당 만들 수 있는 방의 개수는 200여개 정도로 알려져 있고 아이피 의 방이 전부
개설된 상황에서 방을 만들면 다른 아이피만 나오게 됩니다.우버는 한방에 한번만 가능합니다..

== 아이피 확인방법 ==

상단 샷 참조 (가장 기본적인 방법이며 다른 방법도 있음을 알려드립니다)

아이피를 확인할 수 방법을 알려드리자면 윈도우 하단 시작 클릭-\> 실행 클릭-\> command(아니면 cmd) 란
글자를 쓰고 확인-\>도스창이 뜨는데 거기서 netstat -na 또는 netstat라는 명령어를 치고 엔터-\>아이피 뒤에 4000이라는 숫자가 보이면 그 앞에 세자리숫자가 아이피입니다.
아이피는 방 개설할때마다 변합니다..이때 우버 공개 아이피랑 일치 하게 방을 지속적으로 개설하면 우버방을 획득할수 있습니다..

== 애니참이란 ==

우버디아를 사냥하신다면 유닉스몰참을 획득하게 됩니다..이것은 한캐릭에 한개씩만 소지 가능합니다..

옵션: 1모든스킬 ( 고정 )

10~20 모든 능력치 ( 변동 )

10~20 모든 저항력 ( 변동 )

5~10추가 경험치 ( 변동 )

== 우버디아 출연시 만날수 있는 장소 ==

-= 액트1 =-
덴오브이블의 불타는 시체
콜드플레인의 비쉬보쉬
스토니필드의 라키니슈
트리스트럼의 그리스월드
다크우드의 트리헤드 우드피스트
수도원안쪽의 본에쉬 등이 있으며,

-= 액트2 =-
하수도3층의 라다먼트
죽음의홀 3층 미치광이 블러드리치
클러바이퍼템플 2층 펭스킨 등이,

-= 액트3 =-
프레이어정글 출구의 스톰트리
폐허의사원의 베틀메이드 사리나
트라빈컬의 하이카운실
증오의사원3층의 하이카운실 등.

-= 액트4 =-
절망의 평원 이주얼
불길의강 대장장이 헤파스토
카오스 생츄어리 Grand Vizier of Chaos
Lord De Seis
Infector of Souls
디아블로

-= 액트5 =-
블러디풋힐의 쉥크 더 오버시어
블러디풋힐 닥 페런
프리지드 하이랜드의 엘드리치 더 렉터파이어
프리지드하이랜드 샤크투스 슬레이어
아리앗고원의 쓰레쉬 소켓
글레이셜트레일의 본에쉬
니라트하크사원 입구의 핀들스킨

## 헬파이어 토치 (클래식)

- 출처: 카오스큐브 "횃불(헬파이어토치) 획득 정보(클래식)"(글쓴이 Aga). 지금 주소(https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941636)는 서버 오류(500)라, 인터넷 아카이브 2023-09-25 사본(https://web.archive.org/web/20230925035821/https://www.chaoscube.co.kr/board/d2-commu-lab-lab/941636)에서 가져왔다(261104). 근거: 웹 미검증. 원문 그대로.
- 횃불 지역 번호(`areas.md`): 133~136 (mpq `LevelName` Pandemonium Run 1~3, Tristram. 옛 sdk 이름 Matron's Den, Fogotten Sands, Furnace of Pain, Tristram).

★ 유닉라지참 : 헬파이어 토치 획득 정보 총정리 Ver1.3★

지금까지 나온 유닉라지참 획득정보를 각 사이트 및 카오스큐브 회원들의 정보등을
토대로 정리를 하였습니다.
참고하시길 바랍니다.
아래의 사항은 정보수집으로 인한것이오니 완전하지는 않은 사실입니다.
다만 대부분의 내용이 정황상 일치하오니 참고하시기엔 부담이 없을듯 합니다.

1. 카운테스(액트1 블랙마쉬 포가튼 타워 5층)를 죽여서 Key of Terror(공포의키)를 얻습니다.
2. 소환술사(액트2 아케인생츄어리)를 죽여서 Key of Hatred(증오의키)를 얻습니다.
3. 나라하크(액트5 홀스 오브 보우트 : 나라하크사원 3층)를 죽여서 Key of Destruction(파괴의키)를 얻습니다.

세가지를 얻으신 후에 액트 5에 가셔서 큐브에 넣고 돌리시면
3가지의 포탈중에 하나가 랜덤으로 나온답니다

그 세가지의 포탈은 각각
감시자의포탈 - 이곳에 나타나는 몬스터 Lilith (릴리쓰)
잊혀진 사막 - 이곳에 나타나는 몬스터 Clone Duriel (듀리엘)
고통의 용광로 - 이곳에 나타나는 몬스터 Izual (이쥬얼)
이라고 합니다.

각 포탈에 위치한 세마리의 몬스터를 잡게되면

릴리쓰를 죽이면 Diablo's horn (디아블로의 뿔)
듀리엘을 죽이면 Baal's eye (바알의 눈)
이쥬얼을 죽이면 Mephisto's brain (메피스토의 뇌)
를 준다고 하네요.

이 세가지를 모두 얻은후에 액트5에서 조합을 하게 되면
새로운 붉은포탈이 열리고 그 포탈안에 들어가서 바알, 메피, 디아블로를 죽이게 되면
마지막 잡은 보스몹에서 새로운 아이템(유닉 라지참 : 헬파이어 토치)를 얻을수 있습니다.

유닉라지참 : 헬파이어 토치
25% 확율로 레벨 25 파이어 스톰 시전 (공격시)
+3 (각 계열 캐릭터중 하나) 모든 스킬 증가
+10-20 모든 능력치 (변함)
+10-20% 모든 저항력 (변함)
+8 시야 증가
레벨 30 히드라 (10/10 차지)

★ 각종 Tip 정리 ★
1. 키 1세트(공포,증오,파괴)를 가지고 포탈을 열면 세가지 포탈(감시자의포탈,잊혀진사막,고통의용광로)중
한개가 랜덤으로 열립니다.
3세트를 가지고 있을때 한방에서 한번씩 포탈을 열게되면 중복된 포탈이 나올수 있습니다.
그러한 관계로 한방에서 3세트를 가지고 3번 포탈을 열면 각기 다른 세가지 포탈이 나옵니다.

2. 위에 1번 Tip에서 세가지 포탈을 열때 한자리에서 세번 포탈을 열면 포탈이 겹칠수도 있사오니
약간의 자리이동을 하셔서 3개의 포탈을 열면 포탈이 겹치지 않습니다.

3. 이주얼은 매직데미지 이뮨으로 햄딘이 잘 통하지 않습니다. 슴딘이나 강타세팅을 한 전사캐릭으로
사냥하는것이 좋습니다.

4. 메피스토의 경우에는 컨빅션오라를 켜고 소환을 하므로 누적레지를 많이 맞추시거나
셀베이션 오라를 켠 팔라를 대동하고 간다면 쉽게 사냥을 할 수 있습니다.

★ 각종 질문들 정리 ★

Q : 열쇠는 거래창에 올려지나요?
A : 거래창에 올릴 수 있습니다.

Q : 유닉참은 거래창에 올려지나요?
A : 거래창에 올릴 수 있습니다.

Q : 유닉참은 플레이어당 1개를 가질수 있나요?
A : 애니참과 마찬가지로 플레이어당 1개를 가질수 있습니다.

Q : 소환술사, 나라하크, 카운테스가 열쇠를 안주는데요?
A : 각각의 몬스터가 무조건 열쇠를 주는것은 아닙니다.
일정확률(지금까지 알려진것은 1/34)로 열쇠를 떨굽니다.
간혹 2개가 동시에 떨어지는 경우도 있습니다.

Q : 유닉참은 래더만 되나요?
A : 스탠/래더 구분없이 된다고 합니다.

Q : 노멀/나이트/헬에서 다 되나요?
A : 헬 엑트5에서만 가능합니다.
