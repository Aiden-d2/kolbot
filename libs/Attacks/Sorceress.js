/**
*	@filename	Sorceress.js
*	@author		kolton
*	@desc		Sorceress attack sequence
*/

var ClassAttack = {
	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			print("mercwatch");
			Town.visitTown();
		}

		if (!me.getState(30) && me.getSkill(58, 1)) {
			Skill.cast(58, 0);
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			if (!Attack.setPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {	//260826
				return 0;
			}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return 1;
		}

		var index, staticRange, checkSkill, result, baseRange,
			mercRevive = 0,
			timedSkill = -1,
			untimedSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		// Get timed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[0];
		} else {
			checkSkill = Config.AttackSkill[index];
		}

		if (Attack.checkResist(unit, checkSkill) && ([56, 59].indexOf(checkSkill) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedSkill = checkSkill;
		} else if (Config.AttackSkill[5] > -1 && Attack.checkResist(unit, Config.AttackSkill[5]) && ([56, 59].indexOf(Config.AttackSkill[5]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			timedSkill = Config.AttackSkill[5];
		}

		// Get untimed skill
		if (Attack.getCustomAttack(unit)) {
			checkSkill = Attack.getCustomAttack(unit)[1];
		} else {
			checkSkill = Config.AttackSkill[index + 1];
		}

		if (Attack.checkResist(unit, checkSkill) && ([56, 59].indexOf(checkSkill) === -1 || Attack.validSpot(unit.x, unit.y))) {
			untimedSkill = checkSkill;
		} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, Config.AttackSkill[6]) && ([56, 59].indexOf(Config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			untimedSkill = Config.AttackSkill[6];
		}

		// Static: replaces the untimed skill until the hp % for its difficulty (boss / other), then the attack skills take over	//261029
		if (Config.CastStatic === true && me.getSkill(42, 1) && Attack.checkResist(unit, "lightning") && (!Config.StaticList.length || Config.StaticList.some(	//261029 empty list = every monster
				function (id) {
					if (unit) {
						switch (typeof id) {
						case "number":
							if (unit.classid && unit.classid === id) {
								return 1;
							}

							break;
						case "string":
							if (unit.name && unit.name.toLowerCase() === id.toLowerCase()) {
								return 1;
							}

							break;
						default:
							throw new Error("Bad Config.StaticList settings.");
						}
					}

					return 0;
				}
			)) && unit.hp * 100 / 128 > (index === 1 ? Config.StaticBossHP : Config.StaticHP)[me.diff]) {	//261029 hp / 128
			untimedSkill = 42;	//261029
			staticRange = me.getSkill(42, 1) + 2;	//261029 range level + 4, less the arrival margin 2
		}

		// Low mana timed skill
		if (Config.LowManaSkill[0] > -1 && Skill.getManaCost(timedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[0])) {
			timedSkill = Config.LowManaSkill[0];
		}

		// Low mana untimed skill
		if (Config.LowManaSkill[1] > -1 && Skill.getManaCost(untimedSkill) > me.mp && Attack.checkResist(unit, Config.LowManaSkill[1])) {
			untimedSkill = Config.LowManaSkill[1];
		}

		// base range: the shorter of the two picked skills, so both stand at one distance and a long one does not back off between casts of a short one	//261003
		baseRange = Math.min(timedSkill > -1 ? Skill.getRange(timedSkill) : 99, untimedSkill === 42 ? staticRange : untimedSkill > -1 ? Skill.getRange(untimedSkill) : 99);	//261029 static: level + 2

		result = this.doCast(unit, timedSkill, untimedSkill, baseRange);	//261003

		return result;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill, baseRange) {	//261003
		var i,
			arrival = untimedSkill === 42 ? 2 : undefined;	//261029 static: arrival within 2 (teleport too), both skills stand on it

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			if (Skill.getRange(timedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

				// Allow short-distance walking for melee skills

				if (!Attack.setPosition(unit, baseRange, 0x4, arrival)) {	//260826	//261003 base range	//261029 arrival
					return 0;
				}

			if (!unit.dead && !checkCollision(me, unit, 0x4)) {
				Skill.cast(timedSkill, Skill.getHand(timedSkill), unit);
			}

			return 1;
		}

		if (untimedSkill > -1) {
			if (Skill.getRange(untimedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}
			
				// Allow short-distance walking for melee skills

				if (!Attack.setPosition(unit, baseRange, 0x4, arrival)) {	//260826	//261003 base range (static/telek exception removed)	//261029 arrival
					return 0;
				}

			if (!unit.dead) {
				Skill.cast(untimedSkill, Skill.getHand(untimedSkill), unit);
			}

			return 1;
		}

		for (i = 0; i < 25; i += 1) {
			if (!me.getState(121)) {
				break;
			}

			delay(40);
		}

		return 1;
	}
};