# `me.getSkill` 인자

`me.getSkill`의 인자별 반환값 (사용자 자료 `260923 me.getSkill.txt`, 사용자 확인) (261104).

- kolbot 사용처: `libs/Misc.js`, `libs/Precast.js`, `libs/Pickit.js`, `libs/Attacks/*.js`
- 스킬 번호·이름은 mpqdata `skills.txt`(`skill`·`Id` 열)를 본다.

```
me.getSkill(0) = Right(mana) slot skill name
me.getSkill(1) = Left(life) slot skill name
me.getSkill(2) = Right(mana) slot skill id
me.getSkill(3) = Left(life) slot skill id

me.getSkill(4) = all skills [id, hard point, total point]	*item charged skills count as hard points

me.getSkill(id, 0) = hard point
me.getSkill(id, 1) = total point (+item bonus)

[ex]
attack	0,1,1,
throw	2,1,1,
kick	1,1,1,
Scroll of Identify	217,1,1,
Book of Identify	218,1,1,
Scroll of Townportal	219,1,1,
Book of Townportal	220,1,1,
Unsummon	3,1,1,
Warmth	37,7,7,
Ice Bolt	39,1,1,
Frozen Armor	40,1,1,
Inferno	41,1,1,
Static Field	42,5,5,
Telekinesis	43,1,1,
Ice Blast	45,1,1,
Blaze	46,1,1,
Shiver Armor	50,1,1,
Fire Wall	51,12,12,
Teleport	54,1,1,
Enchant	52,0,1,	(+item bonus)
Chain Lightning	53,0,2, (+item bonus)
Frost Nova	44,1,1	(+item charged)
```
