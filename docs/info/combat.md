# 전투 (명중률, 방어력 감소, 독 데미지, getUnit 범위)

명중률 공식과 방어력 감소 수단, 독 데미지 계산(1.10), getUnit이 잡히는 범위 측정 (261104).

- kolbot 사용처: `Attack`(공격 판단), `ClassAttack`(직업 공격), `Attack.getMonsterCount`·`getUnit` 탐색 범위

## 명중률과 방어력 감소

- 출처: 사용자 자료 `targetdef&AR.jpg`(어느 포럼 글의 캡처, 주소·날짜 없음). 근거: **출처 불명**.
- 원문 그대로(영어). 글쓴이가 질문하는 글이라, 공식 뒤의 "bug" 이야기는 질문자의 추측이다.
- 마지막 줄 일부는 캡처의 위로 가기 버튼에 가려 원문에서 읽을 수 없다(`[가려짐]`).

> **-x% Target Defense (percentage)**, as found on:
>
> *item-based* only:
> Fleshripper (elite dagger) = -50% Target Defense
> Heaven's Light (elite scepter) = -33% Target Defense
>
> Eth *rune only* in a weapon:
> Eth rune = -25% Target Defense in regular monsters, and -12.5% Target Defense against Bosses, Hostile Players
>
> *Eth runeword* based only:
> Lawbringer (sword/hammer/scepter runeword) = -50% Target Defense
> Obedience (polearm runeword) = -25% Target Defense
>
> *Skill* based only:
> Conviction Aura (Paladin Skill) = level 20, -90% Target Defense
> Weaken (Necromancer Skill) = level 20, -33% Target Defense
> Battle Cry (Barbarian Skill) = level 20, -88% Target Defense
>
> **-x Enemy Defense (integer)**, as found with:
> Inner Sight (Amazon Skill) = level 20, Enemy Defense −X = 815
>
> **- x% Enemy Defense (percentage)**, as found with:
> Cloak of Shadow (Assassin Skill) = level 20, Enemy Defense -X% = 72%
>
> **- x to Monster Defense per Hit**, as found on:
> Soul Drainers (elite gloves) = -50 To Monster Defense Per Hit
>
> *Items with both -x to Monster Defense mod and -x% Target Defense modifiers:*
> Stone Crusher (elite mace) = -100 To Monster Defense Per Hit, -25% Target Defense
> Malice (Ith + El + Eth) = -100 To Monster Defense Per Hit, -25% Target Defense
>
> Basically, I'm wonder what the "bug" does? Does it take out the DR part of the Chance to Hit % formula? Or only after so many successful hit, does it take out the DR part of the formula?
>
> Chance to Hit% = 100 x AR / (AR + DR) x 2 x Alvl / (Alvl + Dlvl)
>
> So the hit to formula, would then be, equal to:
>
> 100 x AR / (AR + **0**) x 2 x Alvl / (Alvl + Dlvl)
>
> Then would this enemy's DR be equal to zero, for only that one attacker? So the other 7 characters in the game, would not benefit from this bug (e.g.: DR = zero)?
>
> ----
>
> Here's a related question, about the order of operations for figuring out when an enemies' Defense Rating starts & stops, and then an Attacke[가려짐]cial modifiers apply.

- 기호: AR = 공격 등급(Attack Rating), DR = 대상 방어력(Defense Rating), Alvl = 공격자 레벨, Dlvl = 대상 레벨.

## 독 데미지 계산 (1.10)

- 출처: diablowiki "Guide:Calculating Poison Damage v1.10, by onderduiker" (https://diablo2.diablowiki.net/Guide:Calculating_Poison_Damage_v1.10,_by_onderduiker). 현재 사이트는 봇 차단 페이지를 돌려줘, 인터넷 아카이브의 2011-12-11 사본(https://web.archive.org/web/20111211062507/http://diablo2.diablowiki.net/Guide:Calculating_Poison_Damage_v1.10,_by_onderduiker)에서 가져왔다(261104). 근거: 웹 미검증.
- 원문 그대로(영어). 표의 `〃`는 원문에서 위 칸과 합쳐진 칸이다.

Some (if not all) of what follows may already be known, but to the best of my knowledge it hasn't all been collected in one place on this site. Bkelly's The Tao of Poison was an excellent source of information about poison damage for v1.09, but there are a number of changes in Diablo II: Lord of Destruction v1.10+ and the Tao hasn't been updated.

I've also posted Poison damage calculator.xls, a Microsoft Excel worksheet, in the Diablo Files forum of the Diablo III Community Forums. Even if you know how to calculate poison damage, this should make it easier.

*Diablo II Strategy Guide Info:*

- **Patch:** v1.10
- **Gametype:** PvE/PvM and PvP
- **Guide Topic:** Poison damage
- **Class:** Amazon, Assassin, Barbarian, Druid, Necromancer, Paladin, Sorceress
- **Author:** onderduiker
- **Related Article(s):** Poison damage calculator.xls, The Tao of Poison

### Introduction

While damage is displayed in points and length in seconds, both are calculated and applied using more precise units of measurement. Damage is calculated and applied in bits, and length in frames.

| Damage |  | Length |  |
|---|---|---|---|
| Points | Bits | Seconds | Frames |
| 1 | 256 | 1 | 25 |

Poison damage is displayed as the total damage applied over a length of time, but it's calculated by applying a bit rate (bit damage per frame) for a specified number of frames: a **Toxic Small Charm** applies 205 bit rate for 125 frames, which is displayed as 100 Poison Damage Over 5 Seconds (205\*125/256 over 125/25).

Poison damage from multiple attacks doesn't stack. If a target is already poisoned, then the rate and length of that poison will be overwritten by that of any subsequent attack which has an equal or greater rate. Rates are compared after all modifiers have been applied.

When players, hirelings or pets apply poison to a poisoned monster, their poison is applied for one frame instead of the current poison: if their poison has an equal or greater rate, it then overwrites the current poison and it gets applied for its length; if their poison has a lower rate, the current poison then continues for its remaining length. Rates are compared after all modifiers have been applied.

When monsters apply poison to a poisoned player, hireling or pet, their poison is applied for one frame as well as the current poison: if their poison has an equal or greater rate, it then overwrites the current poison and it gets applied for its length; if their poison has a lower rate, the current poison then continues for its remaining length. Rabies and Poison Creeper can also apply additional frames of poison damage when applied to more than one monster.

A monster's damage regeneration is stopped if at least one bit of poison damage is applied per frame: monsters won't turn green if less than one bit of poison damage is applied per frame. Poison damage can kill monsters, hirelings and pets but will only reduce players to 1 hit point (although poison damage from a subsequent attack would kill them if they remained on 1 hit point).  

### Items

If a single item has both a prefix and a suffix applying poison damage, then the rates and lengths of both are simply added.

| Small Charm | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm | 100 Poison Damage Over 5 Seconds | 205 | 205 | 125 |
| Small Charm of Anthrax | 50 Poison Damage Over 6 Seconds | 86 | 86 | 150 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |

Displayed damage is rounded to the nearest point, although it should always be rounded down. When multiple items applying poison damage are equipped, then the rates are added and the lengths are averaged.

| Item | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |
| Blackbog's Sharp Cinquedeas | 488 Poison Damage Over 10 Seconds | 500 | 500 | 250 |
| Perfect Emerald | 100 Poison Damage Over 7 Seconds | 143 | 143 | 179 |
| Total |  | 934 | 934 | 704 |

| Frames | = [704/3] |
|---|---|
| 〃 | = 234 |

Thus 853 poison damage is applied over 9.36 seconds (934\*234/256 over 234/25). Bits and frames are the smallest units of measurement, and so calculations are rounded down to the nearest bit and frame. Gems, jewels and runes all count as separate items, even if they're socketed in a single item.

**ERROR:** Length is calculated differently when multiple items applying poison damage are used with skills that apply a fraction of weapon damage. This applies to the following following skills:

- Multiple Shot
- Strafe
- Blade Sentinel
- Blade Fury
- Blade Shield

Two items will apply poison damage over the sum of their lengths, while three or more items will just apply poison damage over the longest length of any of those items.

- Poison damage items

### Skills

Poison damage skills add bit rate with every additional skill level. The bit rate added also increases beyond certain skill levels. Some skills also add length with every additional skill level, although the increase is linear. Others are synergised by other skills, which apply a percentage increase to bit rate dependent on the number of skill points invested in the synergy skill(s). Skill level is set at the point the player uses the skill. Adding or removing skill bonuses won't have any effect on rate or length if there's a delay between using the skill and applying the poison.

| Skill | Bit rate |  |  |  |  |  |  | Frames |  | Synergy |  |
|---|---|---|---|---|---|---|---|---|---|---|---|
| 〃 | /Level | 1 | 2-8 | 9-16 | 17-22 | 23-28 | >28 | 1 | 2+ | Skill | +% |
| Poison Javelin (Pn) | Min Max | 32 48 | +16 +16 | +32 +36 | +48 +52 | +64 +68 | +96 +84 | 200 | +50 | Pe | 12 |
| Plague Javelin (Pe) | Min Max | 80 128 | +48 +48 | +96 +96 | +160 +160 | +320 +320 | +480 +480 | 75 | +10 | Pn | 10 |
| Poison Dagger (PD) | Min Max | 36 80 | +20 +20 | +30 +30 | +40 +40 | +46 +46 | +52 +52 | 50 | +10 | PE PN | 20 20 |
| Poison Explosion (PE) | Min Max | 128 384 | +32 +32 | +64 +64 | +96 +96 | +128 +128 | +160 +160 | 50 | +10 | PD PN | 15 15 |
| Poison Nova (PN) | Min Max | 256 464 | +64 +64 | +96 +96 | +144 +144 | +224 +224 | +256 +256 | 50 |  | PD PE | 10 10 |
| Poison Creeper (PC) | Min Max | 12 16 | +7 +7 | +12 +12 | +15 +15 | +17 +17 | +19 +19 | 100 |  |  |  |
| Rabies | Min Max | 48 112 | +32 +32 | +40 +40 | +56 +56 | +88 +88 | +128 +128 | 100 | +10 | PC | 18 |
| Venom | Min Max | 1,536 2,048 | +384 +384 | +512 +512 | +640 +640 | +768 +768 | +896 +896 | 10 |  |  |  |

**ERROR:** Level \>36 Poison Javelin displays higher minimum than maximum damage because the minimum bit rate added per level for level \>28 is higher than the maximum bit rate added. When this occurs, the minimum damage becomes the maximum and the maximum damage becomes the minimum.

Level 30 Poison Dagger applies the following:

| Frames | = 50+(10*(30-1)) |
|---|---|
| 〃 | = 50+290 |
| 〃 | = 340 |

| Min bit rate | = 36+(20*7)+(30*8)+(40*6)+(46*6)+(52*2) |
|---|---|
| 〃 | = 36+140+240+240+276+104 |
| 〃 | = 1,036 |
| Min damage | = 1,036*340/256 |
| 〃 | = 1,375 |

| Max bit rate | = 80+(20*7)+(30*8)+(40*6)+(46*6)+(52*2) |
|---|---|
| 〃 | = 80+140+240+240+276+104 |
| 〃 | = 1,080 |
| Max damage | = 1,080*340/256 |
| 〃 | = 1,434 |

Thus 1,375-1,434 Poison Damage Over 13.6 Seconds is displayed. Fully synergised level 30 Poison Dagger (20 points each in Poison Explosion and Nova) has +800% (20\*(20+20)) applied to its rate:

| Min bit rate | = 1,036*(100+800)/100 |
|---|---|
| 〃 | = 1,036*9 |
| 〃 | = 9,324 |
| Min damage | = 9,324*340/256 |
| 〃 | = 12,383 |

| Max bit rate | = 1,080*(100+800)/100 |
|---|---|
| 〃 | = 1,080*9 |
| 〃 | = 9,720 |
| Max damage | = 9,720*340/256 |
| 〃 | = 12,909 |

Thus 12,383-12,909 Poison Damage Over 13.6 Seconds is displayed.  

### Skills and items

Most skills are treated as separate sources of poison damage whose rates (and accompanying lengths) compete with those of other skills and items. However, Poison Dagger and the javelins (but **not** the clouds) of Poison and Plague Javelins combine the skill's rate with any item rates. Length is calculated by summing skill and item lengths and dividing by the number of items.

| Source | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |
| Blackbog's Sharp Cinquedeas | 488 Poison Damage Over 10 Seconds | 500 | 500 | 250 |
| Perfect Emerald | 100 Poison Damage Over 7 Seconds | 143 | 143 | 179 |
| Level 30 Poison Dagger | 12,383-12,909 Poison Damage Over 13.6 Seconds | 9,324 | 9,720 | 340 |
| Total |  | 10,258 | 10,654 | 1,044 |

| Frames | = [1,044/3] |
|---|---|
| 〃 | = 348 |

| Min damage | = 10,258*348/256 |
|---|---|
| 〃 | = 13,944 |

| Max damage | = 10,654*348/256 |
|---|---|
| 〃 | = 14,482 |

Thus 13,944-14,482 poison damage is applied over 13.92 (348/25) seconds.

If the only item used were **Blackbog's Sharp Cinquedeas**, 9,824-10,220 bit rate for 590 ((250+340)/1) frames would apply 22,641-23,553 poison damage over 23.6 (590/25) seconds. Although the rate is lower with only one item, the length can be significantly longer and results in far more damage from a single stab.  

### Venom

Venom's rate is applied to any weapon's attack made between its casting and expiration, and adds to any rate applied by items. However, its 10 frame length overrides those of any items.

| Source | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |
| Blackbog's Sharp Cinquedeas | 488 Poison Damage Over 10 Seconds | 500 | 500 | 250 |
| Perfect Emerald | 100 Poison Damage Over 7 Seconds | 143 | 143 | 179 |
| Level 15 Venom | 305-325 Poison Damage Over 0.4 Seconds | 7,808 | 8,320 | 10 |
| Total |  | 8,742 | 9,254 | 10 |

| Min damage | = 8,742*10/256 |
|---|---|
| 〃 | = 341 |

| Max damage | = 9,254*10/256 |
|---|---|
| 〃 | = 361 |

Thus just 341-361 poison damage is applied over 0.4 (10/25) seconds.

However, Venom's length does **not** override those of the skills Poison Dagger and Poison and Plague Javelins. Casting Venom can thus significantly increase the rate applied by these skills while not reducing length. Since Venom effectively creates a *single* source which sums the rates of Venom and items but which only applies for Venom's length, the length is the sum of the skill length and that of Venom.

| Source | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |
| Blackbog's Sharp Cinquedeas | 488 Poison Damage Over 10 Seconds | 500 | 500 | 250 |
| Perfect Emerald | 100 Poison Damage Over 7 Seconds | 143 | 143 | 179 |
| Level 30 Poison Dagger | 12,383-12,909 Poison Damage Over 13.6 Seconds | 9,324 | 9,720 | 340 |
| Level 15 Venom | 305-325 Poison Damage Over 0.4 Seconds | 7,808 | 8,320 | 10 |
| Total |  | 18,066 | 18,974 | 350 |

| Min damage | = 18,066*350/256 |
|---|---|
| 〃 | = 24,699 |

| Max damage | = 18,974*350/256 |
|---|---|
| 〃 | = 25,941 |

Thus 24,699-25,941 poison damage is applied over 14 (350/25) seconds. Classes other than the Assassin can gain the ability to cast Venom by equipping certain items, which allow it to be cast by various methods.

| Item | Source | Duration (seconds) | Bit rate |  | Frames |
|---|---|---|---|---|---|
| 〃 | 〃 | 〃 | Min | Max | 〃 |
| Arachnid Mesh Spiderweb Sash | Level 3 Venom (11 Charges) | 128 | 2,304 | 2,816 | 10 |
| Andariel's Visage Demonhead | Level 3 Venom (20 Charges) | 128 | 2,304 | 2,816 | 10 |
| Treachery 'ShaelThulLem' Armor | 25% Chance to Cast Level 15 Venom on Striking | 176 | 7,808 | 8,320 | 10 |
| Grief 'EthTirLoMalRal' Sword/Axe | 35% Chance to Cast Level 15 Venom on Striking | 176 | 7,808 | 8,320 | 10 |
| Dragon 'SurLoSol' Armor/Shield | 20% Chance to Cast Level 18 Venom When Struck | 188 | 9,600 | 10,112 | 10 |
| Rainbow Facet Jewel | 100% Chance to Cast Level 23 Venom When You Level-up | 208 | 12,928 | 13,440 | 10 |

### +% Poison Skill Damage

+% Poison Skill Damage is gained by equipping certain items and applies a percentage increase to the rate which is multiplicative with any synergies. It's also applied to the rate from items when applied with mêlée weapons, but **not** when applied with ranged weapons.

The point at which +% PSD is applied varies for each skill, although it is **not** applied to Poison Creeper. For more details about the mechanics of each skill, see the individual skill descriptions.

| Skill | Point of application |
|---|---|
| Poison Javelin | Javelin: throwing Clouds: creation |
| Plague Javelin | Javelin: throwing Clouds: creation |
| Poison Dagger | Striking |
| Poison Explosion | Casting |
| Poison Nova | Casting |
| Rabies | Bite: striking Contagion: creation |
| Venom | Casting |

Equipping **Trang-Oul's Claws Heavy Bracers** applies +25% PSD to level 15 Venom when cast:

| Min bit rate | = 7,808*(100+25)/100 |
|---|---|
| 〃 | = 7,808*1.25 |
| 〃 | = 9,760 |

| Max bit rate | = 8,320*(100+25)/100 |
|---|---|
| 〃 | = 8,320*1.25 |
| 〃 | = 10,400 |

| Source | Displayed damage | Bit rate |  | Frames |
|---|---|---|---|---|
| 〃 | 〃 | Min | Max | 〃 |
| Toxic Small Charm of Anthrax | 313 Poison Damage Over 11 Seconds | 291 | 291 | 275 |
| Blackbog's Sharp Cinquedeas | 488 Poison Damage Over 10 Seconds | 500 | 500 | 250 |
| Perfect Emerald | 100 Poison Damage Over 7 Seconds | 143 | 143 | 179 |
| Level 15 Venom | 305-325 Poison Damage Over 0.4 Seconds | 9,760 | 10,400 | 10 |
| Total |  | 10,694 | 11,334 | 10 |
| Level 30 Poison Dagger | 12,383-12,909 Poison Damage Over 13.6 Seconds | 9,324 | 9,720 | 340 |

+25% PSD is now applied:

| Min bit rate | = (10,694*(100+25)/100)+(9,324*(100+25)/100) |
|---|---|
| 〃 | = (10,694*1.25)+(9,324*1.25) |
| 〃 | = 13,367+11,655 |
| 〃 | = 25,022 |
| Min damage | = 25,022*(340+10)/256 |
| 〃 | = 34,209 |

| Max bit rate | = (11,334*(100+25)/100)+(9,720*(100+25)/100) |
|---|---|
| 〃 | = (11,334*1.25)+(9,720*1.25) |
| 〃 | = 14,167+12,150 |
| 〃 | = 26,317 |
| Max damage | = 26,317*(340+10)/256 |
| 〃 | = 35,980 |

Thus 34,209-35,980 poison damage is applied over 14 (350/25) seconds. +% PSD can only be found on the following items:

| Item | +% PSD |
|---|---|
| Rainbow Facet Jewel | 3-5 |
| Trang-Oul's Claws Heavy Bracers | 25 |
| Bramble 'RalOhmSurEth' armor | 25-50 |

### Lower Resist

A target's Poison Resist (PR) % reduces poison's rate, and PR 100+% makes a monster Immune to Poison (players and hirelings are capped at PR 95%). Lower Resist (LR) applies PR -%, although it's applied at 1/5 effectiveness against Immune to Poison monsters: level 10 LR's PR -55% is reduced to PR -11% (55/5). PR -100% is the absolute minimum to which a target can be reduced, doubling the rate.

25,022-26,317 bit rate for 350 frames results in 34,209-35,980 poison damage being applied over 14 seconds to a target with PR 0%. PR 50% would halve the rate, but casting level 10 LR (PR -55%) results in the following:

| Min bit rate | = 25,022*(100-(50-55))/100 |
|---|---|
| 〃 | = 25,022*1.05 |
| 〃 | = 26,273 |
| Min damage | = 26,273*350/256 |
| 〃 | = 35,920 |

| Max bit rate | = 26,317*(100-(50-55))/100 |
|---|---|
| 〃 | = 26,317*1.05 |
| 〃 | = 27,632 |
| Max damage | = 27,632*350/256 |
| 〃 | = 37,778 |

Thus 35,920-37,778 poison damage is applied over 14 (350/25) seconds. LR is applied when the target is poisoned, so it can be overwritten by another curse immediately afterwards. Even if LR is required to break immunity, once poison has been applied its rate and length remain unchanged, even if the monster becomes Immune to Poison again.  

### -% Enemy Poison Resistance

-% Enemy Poison Resistance (EPR) reduces a target's poison resistance like LR, but only if PR \< 100% i.e. not Immune to Poison. However, unlike LR -% EPR also applies to length, effectively applying Poison Length Reduced (PLR) by -%.

Monsters have no PLR % so -% EPR *increases* poison length by the displayed amount, although -100% is the absolute minimum to which a target can be reduced, doubling the length. The only exceptions are the Ancients, whose equipment can spawn with PLR % suffixes. **Talic** and **Korlic** can spawn with PLR \>99%, which cannot be reduced by -% EPR. However, this doesn't result in effective immunity, since a frame of poison damage is still applied.

Players and hirelings are capped at PLR 75%, although the same difficulty penalties that apply to Resist % apply (-40% in Nightmare and -100% in Hell).

-% EPR is applied when the target is poisoned, like LR. Once poison has been applied its rate and length remain unchanged, so -% EPR can be removed afterwards without affecting damage or length.

25,022-26,317 bit rate for 350 frames results in 34,209-35,980 poison damage being applied over 14 seconds to a target with PR 0%. PR 110% makes a monster Immune to Poison, but casting level 10 LR (PR -11%) breaks that immunity and, combined with **Trang-Oul's Wing Cantor Trophy's** -25% EPR partial set bonus when equipping two other items from **Trang-Oul's Avatar**, results in the following:

| Frames | = 350*(100-(0-25))/100 |
|---|---|
| 〃 | = 350*1.25 |
| 〃 | = 437 |

| Min bit rate | = 25,022*(100-(110-11-25))/100 |
|---|---|
| 〃 | = 25,022*0.26 |
| 〃 | = 6,505 |
| Min damage | = 6,505*437/256 |
| 〃 | = 11,104 |

| Max bit rate | = 26,317*(100-(110-11-25))/100 |
|---|---|
| 〃 | = 26,317*0.26 |
| 〃 | = 6,842 |
| Max damage | = 6,842*437/256 |
| 〃 | = 11,679 |

Thus 11,104-11,679 poison damage is applied over 17.48 (437/25) seconds. -% EPR can only be found on the following items:

| Item | -% EPR |
|---|---|
| Rainbow Facet Jewel | 3-5 |
| Trang-Oul's Wing Cantor Trophy (3 Items) | 25 |
| Grief 'EthTirLoMalRal' Sword/Axe | 20-25 |
| Death's Web Unearthed Wand | 40-50 |

### Calculation

This is a summary of all the individual steps in the calculation of poison damage outlined in the preceding sections. To express total damage in points applied over a length in seconds:

**Points = \[Rate\*Frames/256\]**

**Second = Frames/25**

Ideally damage is calculated measuring rate in bits and length in frames. It's also possible to calculate damage measuring rate in poison damage/second and length in seconds, which can be derived directly from displayed damage. However, the result will only be an approximation and rounding down should only be done at the end of the calculation for the maximum accuracy possible.

**Rate = \[(\[\[B\*S\]\*M\]+\[(I+\[V\*M\])\*M\])\*R\]**

| 기호 | 뜻 | 식 |
|---|---|---|
| \[\] | Round down |  |
| B | Skill rate |  |
| I | Sum of item rates |  |
| V | Venom rate |  |
| M | Mastery (+X% Poison Skill Damage) | M = (100+X)/100 |
| S | Synergy (+X% poison damage) | S = (100+X)/100 |
| R | Resistance | R = (100-X)/100 |

R의 X:

- If P >= 100 and P-(L/5) < 100 then X = P-(L/5), else R = 0
- If P < 100 then X = Max(P-(L+E),-100)
- P = Poison Resist X%, L = Lower Resist (Poison Resist -X%), E = -X% Enemy Poison Resistance

- If a single item has both a prefix and a suffix applying poison damage, then the rates and lengths of both are simply added.
- Gems, jewels and runes all count as separate items, even if they're socketed in a single item.
- Item and Venom rate are only added to the skill rates of Poison Dagger and the javelins (but **not** the clouds) of Poison and Plague Javelins.
- +% PSD isn't applied to item and Venom rate when applied by ranged attacks.

**Frames = \[F\*R\]**

| 기호 | 뜻 | 식 |
|---|---|---|
| \[\] | Round down |  |
| F | Frames: Items | F = sum of item lengths/number of items |
| 〃 | Frames: Items + Skill | F = (skill length + sum of item lengths)/number of items |
| 〃 | Frames: Items + Venom | F = Venom length |
| 〃 | Frames: Skill + Venom | F = skill length + Venom length |
| R | Resistance | R = (100-X)/100 |

R의 X:

- If P < 100 then X = Max(P-E,-100), else F = 1
- P = Poison Length Reduced by X%, E = -X% Enemy Poison Resistance

- **ERROR:** Length is calculated differently when multiple items applying poison damage are used with skills that apply a fraction of weapon damage. Two items will apply poison damage over the sum of their lengths, while three or more items will just apply poison damage over the longest length of any of those items.

## getUnit 범위 (사용자 측정)

- 출처: 사용자 자료 `260413 getUnit range.txt`. 근거: 사용자 측정(260413).
- 원문 그대로. 같은 파일의 화면 해상도·야드 환산 부분은 같은 폴더 `skill_range.md` 0절(야드)로 옮겼다.

```
- = 마이너스 좌표에 있는 겟유닛
+ = 플러스 좌표에 있는 겟유닛

Y +45	//	49	//60	//62
Y -70	//	69	//56	//50

X +70	//	75	//53	//52
X -45	//	40	//66	//65

내좌표 기준 겟유닛
우측 84
좌측 75
상측 74
하측 84

중심좌표 기준 한화면

우상 = 30
좌상 = 30
우하 = 30
좌하 = 30

상 = 28
하 = 30
좌 = 18
우 = 18

가장큰 맹점은 x/y 값이 모두변하는 곳에서는 디스턴스가 크게 계산됨
```
