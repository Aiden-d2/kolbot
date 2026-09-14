/**
*	@filename	Assassin.js
*	@author		kolton
*	@desc		Assassin attack sequence
*/

var ClassAttack = {
	lastTrapPos: {},
	trapRange: 20,

	doAttack: function (unit, preattack) {
		
		//print("[DBG] - doAttack");

		if (Config.MercWatch && Town.needMerc()) {
			Town.visitTown();
		}

		if (preattack && Config.AttackSkill[0] > 0 && Attack.checkResist(unit, Config.AttackSkill[0]) && (!me.getState(121) || !Skill.isTimed(Config.AttackSkill[0]))) {
			//if (Math.round(getDistance(me, unit)) > Skill.getRange(Config.AttackSkill[0]) || checkCollision(me, unit, 0x4)) {
				//if (!Attack.getIntoPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {
				if (!Attack.setPosition(unit, Skill.getRange(Config.AttackSkill[0]), 0x4)) {	//260826
					return 0;
				}
			//}

			Skill.cast(Config.AttackSkill[0], Skill.getHand(Config.AttackSkill[0]), unit);

			return 1;
		}

		var index, checkTraps, checkSkill, result,
			mercRevive = 0,
			timedSkill = -1,
			untimedSkill = -1;

		index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3;

		// Cloak of Shadows (Aggressive) - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (Config.AggressiveCloak && Config.UseCloakofShadows && me.getSkill(264, 1) && !me.getState(121) && !me.getState(153)) {
			if (getDistance(me, unit) < 20) {
				Skill.cast(264, 0);
			//} else if (!Attack.getIntoPosition(unit, 20, 0x4)) {
			} else if (!Attack.setPosition(unit, 20, 0x4)) {	//260826
				return 0;
			}
		}

		checkTraps = this.checkTraps(unit);

		if (checkTraps) {
			if (getDistance(me, unit) > this.trapRange || checkCollision(me, unit, 0x4)) {	//260902
				//if (!Attack.getIntoPosition(unit, this.trapRange, 0x4) || (checkCollision(me, unit, 0x1) && (getCollision(unit.area, unit.x, unit.y) & 0x1))) {
				if (!Attack.setPosition(unit, this.trapRange, 0x4) || (checkCollision(me, unit, 0x1) && (getCollision(unit.area, unit.x, unit.y) & 0x1))) {	//260826
					return 0;
				}
			}

			this.placeTraps(unit, checkTraps);
		}

		// Cloak of Shadows (Defensive; default) - can't be cast again until previous one runs out and next to useless if cast in precast sequence (won't blind anyone)
		if (!Config.AggressiveCloak && Config.UseCloakofShadows && me.getSkill(264, 1) && getDistance(me, unit) < 20 && !me.getState(121) && !me.getState(153)) {
			Skill.cast(264, 0);
		}

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

		result = this.doCast(unit, timedSkill, untimedSkill);

		return result;
	},

	afterAttack: function () {
		Misc.unShift();
		Precast.doPrecast(false);
	},

	// Returns: 0 - fail, 1 - success, 2 - no valid attack skills
	doCast: function (unit, timedSkill, untimedSkill) {
		var i;

		// No valid skills can be found
		if (timedSkill < 0 && untimedSkill < 0) {
			return 2;
		}

		if (timedSkill > -1 && (!me.getState(121) || !Skill.isTimed(timedSkill))) {
			switch (timedSkill) {
			case 151: // Whirlwind
				//if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x1)) {
					//if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x1)) {
					if (!Attack.setPosition(unit, Skill.getRange(timedSkill), 0x1)) {	//260826
						return 0;
					}
				//}

				if (!unit.dead) {
					this.whirlwind(unit);
				}

				return 1;
			default:
				if (Skill.getRange(timedSkill) < 4 && !Attack.validSpot(unit.x, unit.y)) {
					return 0;
				}

				//if (Math.round(getDistance(me, unit)) > Skill.getRange(timedSkill) || checkCollision(me, unit, 0x4)) {
					// Allow short-distance walking for melee skills
					//walk = Skill.getRange(timedSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

					//if (!Attack.getIntoPosition(unit, Skill.getRange(timedSkill), 0x4)) {
					if (!Attack.setPosition(unit, Skill.getRange(timedSkill), 0x4)) {	//260826
						return 0;
					}
				//}

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

			//if (Math.round(getDistance(me, unit)) > Skill.getRange(untimedSkill) || checkCollision(me, unit, 0x4)) {
				// Allow short-distance walking for melee skills
				//walk = Skill.getRange(untimedSkill) < 4 && getDistance(me, unit) < 10 && !checkCollision(me, unit, 0x1);

				//if (!Attack.getIntoPosition(unit, Skill.getRange(untimedSkill), 0x4)) {
				if (!Attack.setPosition(unit, Skill.getRange(untimedSkill), 0x4)) {	//260826
					return 0;
				}
			//}

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
	},

	checkTraps: function (unit) {
		if (!Config.UseTraps) {
			return false;
		}
		
		// getDistance crashes when using an object with x, y props, that's why it's unit.x, unit.y and not unit
		if (me.getMinionCount(17) === 0 || !this.lastTrapPos.hasOwnProperty("x") || getDistance(unit.x, unit.y, this.lastTrapPos.x, this.lastTrapPos.y) > 20 || CollMap.checkColl(this.lastTrapPos, unit, 0x4, 0)) {	//260907
			return 5;
		}

		return 5 - me.getMinionCount(17);
	},
	
	placeTraps: function (unit, amount) {	//260902
		var i, j, tx, ty, angle, baseAngle, step, tmp, spot,
			traps = 0,
			trapRing = 10,
			trapArc = 60,
			trapStep = 2,
			list = [],
			valid = [];
		
		// unit can be an object with x, y props too, that's why having "type" prop is checked
		if (unit.hasOwnProperty("type")) {
			baseAngle = Math.atan2(me.y - unit.y, me.x - unit.x);
			step = trapStep / trapRing * 180 / Math.PI;

			for (angle = -trapArc; angle <= trapArc; angle += step) {
				list.push(baseAngle + angle * Math.PI / 180);
			}

			for (i = list.length - 1; i > 0; i -= 1) {
				j = rand(0, i);
				tmp = list[i];
				list[i] = list[j];
				list[j] = tmp;
			}

			for (i = 0; i < list.length && valid.length < amount; i += 1) {
				tx = Math.round(unit.x + Math.cos(list[i]) * trapRing);
				ty = Math.round(unit.y + Math.sin(list[i]) * trapRing);

				if (!Attack.validSpot(tx, ty)) {
					continue;
				}

				if (CollMap.checkColl({x: tx, y: ty}, unit, 0x4, 0)) {
					continue;
				}

				if (CollMap.checkColl(me, {x: tx, y: ty}, 0x4, 0)) {
					continue;
				}

				valid.push({x: tx, y: ty});
			}
		}

		while (traps < amount) {
			if (unit.hasOwnProperty("mode") && (unit.mode === 0 || unit.mode === 12)) {
				return true;
			}

			spot = valid[traps] || {x: unit.x, y: unit.y};

			if ((unit.hasOwnProperty("classid") && [211, 242, 243, 544].indexOf(unit.classid) > -1) || (unit.hasOwnProperty("type") && unit.type === 0)) { // Duriel, Mephisto, Diablo, Baal, other players
				if (traps >= Config.BossTraps.length) {
					return true;
				}

				Skill.cast(Config.BossTraps[traps], 0, spot.x, spot.y);
			} else {
				if (traps >= Config.Traps.length) {
					return true;
				}

				Skill.cast(Config.Traps[traps], 0, spot.x, spot.y);
			}
			
			if (traps === 0) {	//260907
				this.lastTrapPos = {x: spot.x, y: spot.y};
			}
			
			traps += 1;
		}

		return true;
	},

	whirlwind: function (unit) {
		if (!Attack.checkMonster(unit)) {
			return true;
		}

		var i, coords, angle,
			angles = [180, 175, -175, 170, -170, 165, -165, 150, -150, 135, -135, 45, -45, 90, -90];

		if (unit.spectype & 0x7) {
			angles.unshift(120);
		}

		me.runwalk = me.gametype;
		angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI);

		for (i = 0; i < angles.length; i += 1) { // get a better spot
			coords = [Math.round((Math.cos((angle + angles[i]) * Math.PI / 180)) * 4 + unit.x), Math.round((Math.sin((angle + angles[i]) * Math.PI / 180)) * 4 + unit.y)];

			if (!CollMap.checkColl(me, {x: coords[0], y: coords[1]}, 0x1, 1)) {
				return Skill.cast(151, 0, coords[0], coords[1]);
			}
		}

		if (!Attack.validSpot(unit.x, unit.y)) {
			return false;
		}

		return Skill.cast(151, 0, me.x, me.y);
	}
};