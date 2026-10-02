/**
*	@filename	Wereform.js
*	@author		kolton
*	@desc		Wereform attack sequence
*/

var ClassAttack = {
	doAttack: function (unit, preattack) {
		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
				if (!Attack.setPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {	//260826
					return 0;
				}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return 1;
		}

		var index, checkSkill, result, baseRange,
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

		if (Attack.checkResist(unit, checkSkill)) {
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

		if (Attack.checkResist(unit, checkSkill)) {
			untimedSkill = checkSkill;
		} else if (Config.AttackSkill[6] > -1 && Attack.checkResist(unit, Config.AttackSkill[6]) && ([56, 59].indexOf(Config.AttackSkill[6]) === -1 || Attack.validSpot(unit.x, unit.y))) {
			untimedSkill = Config.AttackSkill[6];
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
		baseRange = Math.min(timedSkill > -1 ? Skill.getRange(timedSkill) : 99, untimedSkill > -1 ? Skill.getRange(untimedSkill) : 99);

		result = this.doCast(unit, timedSkill, untimedSkill, baseRange);	//261003

		return result;
	},

	afterAttack: function () {
		Precast.doPrecast(false);
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill, baseRange) {	//261003
		var i, angle, tx, ty;	//261002

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			if (Skill.getRange(timedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

			// Teleport closer

			Misc.shapeShift(Config.Wereform);

			// Armageddon: approach only when out of range or blocked, so it never dodges	//261002
			if (timedSkill !== 249 || getDistance(me, unit) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
				if (!Attack.setPosition(unit, timedSkill === 249 ? Skill.getRange(timedSkill) : baseRange, 0x4)) {	//260826	//260930 minDist 1 is the default now	//261003 base range (Armageddon keeps its own)
					return 0;
				}
			}

			if (!unit.dead) {
				Skill.cast(timedSkill, Skill.getHand(timedSkill), unit);
			}

			return 1;
		}

		if (untimedSkill > -1) {
			if (Skill.getRange(untimedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

			// Teleport closer

			Misc.shapeShift(Config.Wereform);

			// Shock Wave: approach only when out of range or blocked, so it never dodges	//261002
			if (untimedSkill !== 243 || getDistance(me, unit) > Skill.getRange(untimedSkill) || checkCollision(me, unit, 0x4)) {
				if (!Attack.setPosition(unit, untimedSkill === 243 ? Skill.getRange(untimedSkill) : baseRange, 0x4)) {	//260826	//260930 minDist 1 is the default now	//261003 base range (Shock Wave keeps its own)
					return 0;
				}
			}

			if (!unit.dead) {
				// Shock Wave aims its 5 missiles at the cursor and 1, 2 tiles to each side of it: a cursor closer than 5 spreads them too far apart	//261002
				// to leave no gap (measured), so a close target is cast at 5 tiles in its direction
				if (untimedSkill === 243 && getDistance(me, unit) < 5) {
					angle = Math.atan2(unit.y - me.y, unit.x - me.x);
					tx = Math.round(me.x + Math.cos(angle) * 5);
					ty = Math.round(me.y + Math.sin(angle) * 5);

					if (!Attack.validSpot(tx, ty)) {
						tx = unit.x;
						ty = unit.y;
					}

					Skill.cast(untimedSkill, Skill.getHand(untimedSkill), tx, ty);
				} else {
					Skill.cast(untimedSkill, Skill.getHand(untimedSkill), unit);
				}
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