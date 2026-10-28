/**
*	@filename	Amazon.js
*	@author		kolton
*	@desc		Amazon attack sequence
*/

var ClassAttack = {
	bowSkills: [6, 7, 11, 12, 16, 21, 22, 26, 27, 31],	//261028 bow and crossbow skills (Magic, Fire, Cold, Multiple Shot, Exploding, Ice, Guided, Strafe, Immolation, Freezing). bowCheck removed (unused)
	lightFuryTick: 0,
	decoyPosition: {},

	doAttack: function (unit, preattack) {
		var needRepair = Town.needRepair();

		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}
		
		if (needRepair && needRepair.length > 0) {	//261016
			Town.visitTown();
		}

		if (Config.Decoy && (typeof Config.Decoy === "number" && Config.Decoy > 0 ? me.getSkill(28, 1) >= Config.Decoy : !!Config.Decoy) && getDistance(me, unit) <= 25) {	//261016
			if (me.getMinionCount(8) === 0 || !this.decoyPosition.hasOwnProperty("x") || getDistance(unit.x, unit.y, this.decoyPosition.x, this.decoyPosition.y) > 15) {
				if (Skill.cast(28, 0, unit)) {
					this.decoyPosition = {x: unit.x, y: unit.y};
				} else {
					this.decoyPosition = {};
				}
			}
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

		// no bow yet (early levels): a bow skill does nothing, use the normal attack	//261028
		if (!Attack.usingBow()) {
			if (this.bowSkills.indexOf(timedSkill) > -1) {
				timedSkill = 0;
			}

			if (this.bowSkills.indexOf(untimedSkill) > -1) {
				untimedSkill = 0;
			}
		}

		// base range: the shorter of the two picked skills, so both stand at one distance and a long one does not back off between casts of a short one	//261003
		baseRange = Math.min(timedSkill > -1 ? Skill.getRange(timedSkill) : 99, untimedSkill > -1 ? Skill.getRange(untimedSkill) : 99);

		result = this.doCast(unit, timedSkill, untimedSkill, baseRange);	//261003

		return result;
	},

	afterAttack: function () {
		Misc.unShift();
		Precast.doPrecast(false);
		this.lightFuryTick = 0;
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill, baseRange) {	//261003
		var i;

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			switch (timedSkill) {
			case 35:
				if (!this.lightFuryTick || getTickCount() - this.lightFuryTick > Config.LightningFuryDelay * 1000) {
						if (!Attack.setPosition(unit, baseRange, 0x4)) {	//260826	//261003 base range
							return 0;
						}

					if (!unit.dead && Skill.cast(timedSkill, Skill.getHand(timedSkill), unit)) {
						this.lightFuryTick = getTickCount();
					}

					return 1;
				}

				break;
			default:
				if (Skill.getRange(timedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
					return 0;
				}

					// Allow short-distance walking for melee skills

					if (!Attack.setPosition(unit, baseRange, 0x4)) {	//260826	//261003 base range
						return 0;
					}

				if (!unit.dead) {
					Skill.cast(timedSkill, Skill.getHand(timedSkill), unit);
				}

				return 1;
			}
		}

		if (untimedSkill > -1) {
			if (Skill.getRange(untimedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
				return 0;
			}

				// Allow short-distance walking for melee skills

				if (!Attack.setPosition(unit, baseRange, 0x4)) {	//260826	//261003 base range
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

		// Wait for Lightning Fury timeout
		while (this.lightFuryTick && getTickCount() - this.lightFuryTick < Config.LightningFuryDelay * 1000) {
			delay(40);
		}

		return 1;
	}
};