/**
*	@filename	Attack.js
*	@author		kolton
*	@desc		handle player attacks
*/

var Attack = {
	classes: ["Amazon", "Sorceress", "Necromancer", "Paladin", "Barbarian", "Druid", "Assassin"],
	infinity: false,
	ids: [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676],	//260806
	elements: ["physical", "fire", "lightning", "magic", "cold", "poison", "none"],	//260816

	// Initialize attacks
	init: function () {
		if (Config.Wereform) {
			include("libs/Attacks/wereform.js");
		} else {
			include("libs/Attacks/" + this.classes[me.classid] + ".js");
		}

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			showConsole();
			print("ÿc1Bad attack config. Don't expect your bot to attack.");
		}

		if (me.gametype === 1) {
			this.checkInfinity();
			this.getCharges();
			this.getPrimarySlot();
		}
	},

	// Per-tick side channel written by setPosition / Skill.cast and read by clear	//260926
	tick: {
		cast: false,
		moved: false,
		fail: null,
		must: false,	//260928
		box: null,	//260929 box of a box call: setPosition only lands inside it
		monList: null
	},

	dangerRange: 10,	//260926 units this close are handled first while a must target is alive
	leashRange: 25,	//260926 a must target farther than this is chased before the sweep continues

	/*
		Attack.clear(range, must)	//260926
		range - sweep radius around the call position. 0 = no area sweep
		must  - optional. classid | name | [classid or name, ...] | {x1, x2, y1, y2}	//260929 box passed as is (no "box" wrapper); a box forces range 0
		        with a must id/name and range > 0, the sweep area follows the must target
		        must targets are never skipped; the call ends when they are dead
		        while a must target is alive, monsters within dangerRange of me are handled too
	*/
	clear: function (range, must) {	//260926
		while (!me.gameReady) {
			delay(40);
		}

		if (range === undefined) {
			range = 25;
		}

		if (typeof range !== "number") {
			throw new Error("Attack.clear: range must be a number.");
		}

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			return false;
		}

		// a configured attack skill that is not actually learned (AutoBuild / goal allocation error) makes every cast fail silently: stop the profile	//260928
		for (i = 0; i < Config.AttackSkill.length; i += 1) {	//260928 array length differs per build
			if (Config.AttackSkill[i] > -1 && !me.getSkill(Config.AttackSkill[i], 1) && Config.AttackSkill[i] !== 500) {
				D2Bot.printToConsole("AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping", 9);
				Misc.trace("AttackSkill[" + i + "] " + Config.AttackSkill[i] + " not learned (lvl " + me.charlvl + "). Stopping");	//261001
				D2Bot.stop();

				return false;
			}
		}

		var i, unit, gid, entry, target, result, attackSkill, mustAlive, nearest, nearestLive, dist, lostEntry,
			mustSeen = false,
			orgx = me.x,
			orgy = me.y,
			entries = {},
			dropped = {},
			castTotal = 0,
			spec = this.mustSpec(must);

		// a box already defines the area; a sweep range on top would pull in targets outside it	//260927
		if (spec && spec.box && range > 0) {
			range = 0;
		}

		if (!this.gidSkip || (this.gidSkipPos && (this.gidSkipPos.area !== me.area || getDistance(me, this.gidSkipPos.x, this.gidSkipPos.y) > 40))) {	//260902
			this.gidSkip = {};
			this.gidSkipPos = null;
		}

		// A named/classid boss may need a moment to show up. Keep fighting what is close meanwhile instead of idling	//260927
		var mustPendingUntil = spec && spec.ids ? getTickCount() + 5 * (me.ping * 2 + 100) : 0;

		function drop(e, reason) {
			dropped[e.gid] = true;
			delete entries[e.gid];
		}

		try {
			while (true) {
				if (me.dead) {
					return false;
				}

				if (me.area === 39 && this.getCowKing(range)) {	//260727
					return false;
				}

				if (Config.TownCheck) {
					Misc.townCheck();
				}

				// 1. scan once per tick. The full list doubles as the threat list for setPosition
				this.tick.monList = [];
				mustAlive = !mustSeen && getTickCount() < mustPendingUntil;	//260927 treat a pending boss as alive so the danger radius stays on

				for (gid in entries) {
					if (entries.hasOwnProperty(gid) && entries[gid].must) {
						mustAlive = true;

						break;
					}
				}

				unit = getUnit(1);

				if (unit) {
					do {
						if (!this.checkMonster(unit)) {
							continue;
						}

						this.tick.monList.push(copyUnit(unit));

						if (entries[unit.gid] || dropped[unit.gid]) {
							continue;
						}

						if (spec && this.mustMatch(spec, unit)) {
							entries[unit.gid] = {unit: copyUnit(unit), gid: unit.gid, must: true, box: !!spec.box, retry: 0, idle: 0, casts: 0, lastPos: {x: unit.x, y: unit.y}};
							mustAlive = true;
							mustSeen = true;

							continue;
						}

						dist = range > 0 && getDistance(unit, orgx, orgy) <= range;

						if (!dist && !(mustAlive && getDistance(me, unit) <= this.dangerRange)) {
							continue;
						}

						// 1st tier: certain and cheap. Rejected units never come back in this call
						if (this.checkSkipped(unit) || !this.skipCheck(unit) || !this.hasUsableSkill(unit)) {
							dropped[unit.gid] = true;

							continue;
						}

						entries[unit.gid] = {unit: copyUnit(unit), gid: unit.gid, must: false, danger: !dist, retry: 0, idle: 0, casts: 0, hpMark: unit.hp, markCast: 0};	//260928 HP mark taken at join, so the check lands on the 5th cast
					} while (unit.getNext());
				}

				// 2. prune
				target = null;
				nearest = null;
				nearestLive = null;	//260928 nearest that is not deferred
				mustAlive = false;

				// the sweep area moves with the must target (nearest one; last seen spot if out of sight). Once they are dead it stays where they fell	//260927
				if (range > 0 && spec && spec.ids) {
					lostEntry = null;

					for (gid in entries) {
						if (entries.hasOwnProperty(gid) && entries[gid].must && (!lostEntry || getDistance(me, entries[gid].lastPos.x, entries[gid].lastPos.y) < getDistance(me, lostEntry.lastPos.x, lostEntry.lastPos.y))) {
							lostEntry = entries[gid];
						}
					}

					if (lostEntry) {
						if (copyUnit(lostEntry.unit).x) {
							lostEntry.lastPos = {x: lostEntry.unit.x, y: lostEntry.unit.y};
						}

						orgx = lostEntry.lastPos.x;
						orgy = lostEntry.lastPos.y;
					}
				}

				for (gid in entries) {
					if (!entries.hasOwnProperty(gid)) {
						continue;
					}

					entry = entries[gid];

					if (entry.must) {
						if (!copyUnit(entry.unit).x || entry.unit.area !== me.area) {
							// lost from sight: go to where it was last seen. Still gone there -> it is dead or far away
							if (getDistance(me, entry.lastPos.x, entry.lastPos.y) < 5) {
								delete entries[gid];

								continue;
							}

							entry.lost = true;
							mustAlive = true;

							continue;
						}

						if (!this.checkMonster(entry.unit)) {
							delete entries[gid];

							continue;
						}

						if (entry.box && !this.mustMatch(spec, entry.unit)) {
							delete entries[gid];

							continue;
						}

						entry.lost = false;
						entry.lastPos = {x: entry.unit.x, y: entry.unit.y};
						mustAlive = true;
					} else {
						if (!this.checkMonster(entry.unit)) {
							delete entries[gid];

							continue;
						}

						if (entry.danger ? getDistance(me, entry.unit) > this.dangerRange : getDistance(entry.unit, orgx, orgy) > range) {
							delete entries[gid];

							continue;
						}
					}

					if (!nearest || getDistance(me, entry.unit) < getDistance(me, nearest.unit)) {
						nearest = entry;
					}

					if (!entry.deferred && (!nearestLive || getDistance(me, entry.unit) < getDistance(me, nearestLive.unit))) {	//260928
						nearestLive = entry;
					}
				}

				// 3. nothing visible left: a lost must target is searched at its last known position
				if (!nearest) {
					lostEntry = null;

					for (gid in entries) {
						if (entries.hasOwnProperty(gid) && entries[gid].lost) {
							lostEntry = entries[gid];

							break;
						}
					}

					if (!lostEntry) {
						if (!mustSeen && getTickCount() < mustPendingUntil) {	//260927 boss not in sight yet: wait a moment, then scan again
							delay(me.ping + 50);

							continue;
						}

						break;
					}

					lostEntry.searches = (lostEntry.searches || 0) + 1;

					try {
						Pather.moveTo(lostEntry.lastPos.x, lostEntry.lastPos.y, 3);
					} catch (e1) {
						lostEntry.searches = 99;
					}

					if (lostEntry.searches > 3) {
						delete entries[lostEntry.gid];
					}

					continue;
				}

				// 4. target: nearest first. A must target drifting past leashRange wins right away; what is close to me is handled once I am next to it	//260929
				// deferred must targets (no usable skill last time) go to the back: picked only when nothing else is left	//260928
				target = nearestLive || nearest;

				if (!target.must) {	//260929 no "nothing within dangerRange" condition: clearing around me first only let the boss drift away, the way there is not cleared anyway
					for (gid in entries) {
						if (entries.hasOwnProperty(gid) && entries[gid].must && !entries[gid].lost && !entries[gid].deferred && getDistance(me, entries[gid].unit) >= this.leashRange) {	//260928 !deferred
							target = entries[gid];

							break;
						}
					}
				}

				// Chaos Sanctuary: a non-boss Storm Caster behind a wall is not worth the walk (restored from the old clear)	//260928
				if (!target.must && me.area === 108 && target.unit.classid === 306 && !(target.unit.spectype & 0x1) && checkCollision(me, target.unit, 0x4)) {	//260929 NoSkipArea removed
					drop(target, "306");

					continue;
				}

				// 260928: the Angle/Detour gate lives in setPosition now (sweep approach: spot in sight from me; walk around only within DetourPath of the target).
				// Here it did not know whether a move was needed at all, and dropped targets that could be hit from where I stand (0x1 in between)

				// 5. attack
				this.tick.cast = false;
				this.tick.moved = false;
				this.tick.fail = null;
				this.tick.must = !!target.must;	//260928 setPosition lets a must target take any detour
				this.tick.box = spec && spec.box ? spec.box : null;	//260929 the box is a fence: I do not step out of it

				attackSkill = Config.AttackSkill[(target.unit.spectype & 0x7) ? 1 : 3];
				result = ClassAttack.doAttack(target.unit, castTotal % 10 === 0);

				// 6. evaluate
				if (result === 2) {	// no usable skill
					if (target.must) {
						// never given up: to the back of the queue. Wait only when nothing else is left (immunity may break, others may kill it)	//260928
						target.deferred = true;

						if (!nearestLive) {
							delay(me.ping + 50);
						}
					} else {
						drop(target, "noskill");
					}

					continue;
				}

				if (this.tick.fail === "unreachable") {	//260929 NoSkipArea removed
					if (target.must) {
						// no spot to hit it from: to the back of the queue like "no usable skill". My spot or its spot may change while the rest is cleared	//260929 was flash and pick it again
						target.deferred = true;

						if (!nearestLive) {
							delay(me.ping + 50);
						}
					} else {
						drop(target, "unreachable");
					}

					continue;
				}

				target.deferred = false;	//260928

				if (!result || this.tick.fail) {
					target.retry += 1;
					Packet.flash(me.gid);

					if (target.retry > 4) {
						if (target.must) {
							target.retry = 0;
						} else {
							drop(target, "retry");
						}
					}

					continue;
				}

				if (!this.tick.cast) {
					// doAttack said 1 without casting (no LOS after moving, skill delay, low mana)
					target.idle += 1;

					if (target.idle >= 5 && !target.must) {	//260928 5, same count as the old HP skip that used to catch these ticks
						drop(target, "idle");
					} else if (target.idle % 5 === 0) {
						Packet.flash(me.gid);	// CollMap and the engine can disagree on LOS; resync before trying again
					}

					continue;
				}

				target.retry = 0;
				target.idle = 0;
				target.casts += 1;
				castTotal += 1;

				if (target.casts % 10 === 0 && Skill.getRange(attackSkill) < 4) {	//260902
					Packet.flash(me.gid);
				}

				// HP skip (sweep only): less than 20% HP lost over 5 casts	//260928 10 -> 5 (casts are real casts now, no misses counted)
				if (!target.must) {	//260929 NoSkipArea removed
					if (target.hpMark === undefined) {
						target.hpMark = target.unit.hp;
						target.markCast = target.casts;
					} else if (target.casts - target.markCast >= 5) {	//260928
						if ((target.hpMark - target.unit.hp) / 128 < 0.2) {
							this.gidSkip[target.gid] = (this.gidSkip[target.gid] || 0) + 1;	//260621
							this.gidSkipPos = {x: me.x, y: me.y, area: me.area};
							drop(target, "hp");
						} else {
							target.hpMark = target.unit.hp;
							target.markCast = target.casts;
						}
					}
				}
			}
		} finally {
			this.tick.monList = null;
			this.tick.must = false;	//260928
			this.tick.box = null;	//260929
		}

		if (spec && spec.ids && !mustSeen) {	//260930 clear returns true either way: note a boss that never showed up
			Misc.trace("boss not found: " + spec.ids.join(", "));
		}

		if (castTotal > 0) {
			Pickit.pickItems(range > 0 ? range : undefined, orgx, orgy);	//261003 around me and around org (the cleared area; a boss call's org is where it fell)
			ClassAttack.afterAttack();
		}

		// 260928: chests are opened by Pather (NodeAction.popChests) on clearPath moves, after killMonsters has cleared the node

		return true;
	},

	// Normalize the must argument of clear	//260926
	mustSpec: function (must) {
		if (must === undefined || must === null || must === false) {
			return null;
		}

		if (must instanceof Array) {
			return {ids: must};
		}

		// arrays are taken above, so any other object is a box	//260929
		if (typeof must === "object") {
			return {box: must};
		}

		return {ids: [must]};
	},

	mustMatch: function (spec, unit) {	//260926

		if (spec.box) {
			return unit.x >= spec.box.x1 && unit.x <= spec.box.x2 && unit.y >= spec.box.y1 && unit.y <= spec.box.y2;
		}

		return spec.ids.some(function (id) {
			return typeof id === "string" ? unit.name === id : unit.classid === id;
		});
	},

	// Does any configured attack skill work on this unit (resist only; mirrors doAttack skill slots)	//260926
	hasUsableSkill: function (unit) {
		var i, custom,
			index = ((unit.spectype & 0x7) || unit.type === 0) ? 1 : 3,
			skills = [index, index + 1, 5, 6].filter(function (n) { return n < Config.AttackSkill.length; }).map(function (n) { return Config.AttackSkill[n]; });

		custom = this.getCustomAttack(unit);

		if (custom) {
			skills = skills.concat(custom);
		}

		for (i = 0; i < skills.length; i += 1) {
			if (skills[i] > -1 && this.checkResist(unit, skills[i])) {
				return true;
			}
		}

		return false;
	},

	/*
		Attack.setPosition(unit, distance, coll, minDist)	//260926
		Candidates are ring spots that keep unit in range and in sight (arc spacing 5; approach rings every 5).	//260930
		  approach (out of range or no LOS): front straight > front detour (moveTo) > back straight > back detour.
		           Outer ring first, then small offset; fire tiles excluded	//260930 no threat tie-break (safety is the next tick's dodge)
		           sweep target only: the spot must be in sight from me (0x4), and a detour is taken only if
		           my walking path to the target <= straight distance * DetourPath (the old clear's Angle/Detour gate)	//260928
		  dodge (in range, Dodge on, skill range >= Dodge.MinSkillRange 9, 1+ monster within R - 2, R = min(skill range, Dodge.Range 10)):	//260930	//261003 R - 2, within
		           one ring at R (teleport: at the skill range), back straight away first,
		           taking the spot with the fewest monsters (within R - 2) in the backing-away half, 1+ fewer than where I stand	//261001	//261003 R - 2
		           (ties: straighter back first); if that half has none, the fewest on the far side	//260927
		  box call (Attack.tick.box): only spots inside the box, for approach and dodge alike	//260929
		Returns false only when an approach fails. Attack.tick.fail says why: "unreachable" | "moveFailed"
	*/
	setPosition: function (unit, distance, coll, minDist) {	//260926
		if (!unit || !copyUnit(unit).x) {
			return false;
		}

		minDist = (typeof minDist === "number" && minDist > 0) ? minDist : 1.5;	//260930 3 -> 1 (a dodge that stops 3 short lands inside the threat radius again)	//261003 1 -> 1.5: the 8 tiles around the spot count as arrived (diagonal 1.41); a dodge stays outside R - 2 (2 would sit on it)

		var i, k, r, c, step, offset, radii, useTele, monList, fireList, choice, pathCand, moved, tier, dodgeRange, threatRange, count,	//260930	//261001 count	//261003 dodgeRange
			detourOk, detourPath,	//260928
			fence = this.tick.box,	//260929
			pathOk = false,
			list = [],
			baseline = 0,
			moveNeeded = getDistance(me, unit) > distance || checkCollision(me, unit, coll),
			scoring = Config.Dodge.Enabled && distance >= Config.Dodge.MinSkillRange && unit.classid !== 243,	//260915	//260930 HP condition removed
			angle = Math.atan2(me.y - unit.y, me.x - unit.x);

		if (!moveNeeded && !scoring) {
			return true;
		}

		useTele = Pather.useTeleport();
		fireList = this.getFireList();

		if (!moveNeeded) {	//260930 threat is a dodge matter only (approach no longer counts monsters)
			dodgeRange = Math.min(distance, Config.Dodge.Range);	//260930	//261003 dodge distance only (walking ring)
			threatRange = dodgeRange - 2;	//261003 count radius and trigger: R - 2, so the target at the ring (R, rounding +-0.7) is not counted
			monList = this.tick.monList || this.buildMonsterList();
			baseline = this.getMonsterCount(me.x, me.y, threatRange, monList, fireList);

			if (baseline === 0) {	//260930 Dodge.Count removed
				return true;
			}
		}

		if (moveNeeded) {
			// approach: rings every 5 inward; reduced rings below 5 are dropped, the skill-range ring is always kept	//260927
			radii = [distance];

			for (r = distance - 5; r >= 5; r -= 5) {	//260930 Dodge.Step -> 5
				radii.push(r);
			}
		} else {
			// dodge: one ring at R (narrow ground: backing off to the skill range took too long). Teleport lands at once, so the skill range	//260930
			radii = [useTele ? distance : dodgeRange];	//261003 dodgeRange
		}

		choice = null;
		pathCand = null;
		pathOk = false;

		// candidates with lo < |offset| <= hi on every ring (arc spacing 5)	//260930
		function build(lo, hi) {
			var out = [];

			for (i = 0; i < radii.length; i += 1) {
				r = radii[i];

				if (r < 1) {
					continue;
				}

				step = 5 / r * 180 / Math.PI;	//260930 Dodge.Step -> 5

				for (k = 0; ; k += 1) {
					offset = k === 0 ? 0 : (k % 2 ? Math.ceil(k / 2) : -Math.ceil(k / 2)) * step;

					if (Math.abs(offset) > hi) {
						break;
					}

					if (Math.abs(offset) > lo) {
						out.push({
							x: Math.round(Math.cos(angle + offset * Math.PI / 180) * r + unit.x),
							y: Math.round(Math.sin(angle + offset * Math.PI / 180) * r + unit.y),
							r: r,
							offset: Math.abs(offset)
						});
					}
				}

				if (hi === 180 && r < 4) {
					out.push({x: Math.round(Math.cos(angle + Math.PI) * r + unit.x), y: Math.round(Math.sin(angle + Math.PI) * r + unit.y), r: r, offset: 180});
				}
			}

			return out;
		}

		// front half first, back half only when the front has nothing usable (built and scored lazily)	//260927
		// approach: a short walk around to a front spot beats going to the back
		// dodge: front = backing away from the target; if that side is walled off or no safer, go through to the far side
		for (tier = 0; tier < 2 && !choice && !pathOk; tier += 1) {
			pathCand = null;

			list = tier === 0 ? build(-1, 90) : build(90, 180);

			for (i = list.length - 1; i >= 0; i -= 1) {
				c = list[i];

				// box call: the landing spot stays inside the box (the path may cross outside)	//260929
				if (fence && (c.x < fence.x1 || c.x > fence.x2 || c.y < fence.y1 || c.y > fence.y2)) {
					list.splice(i, 1);

					continue;
				}

			}

			// approach: order decides the spot (outer ring first, then straight ahead)	//260927
			// dodge: one ring, the spot with the fewest monsters in this half (ties: back straight away first); it must beat the current one by 1+	//261001 fewest instead of the first better
			list.sort(function (a, b) {
				return (b.r - a.r) || (a.offset - b.offset);
			});

			for (i = 0; i < list.length; i += 1) {
				c = list[i];

				if (useTele ? !Pather.checkSpot(c.x, c.y, 0x1, false) : (getCollision(me.area, c.x, c.y) & 0x1)) {
					continue;
				}

				if (CollMap.checkColl(unit, {x: c.x, y: c.y}, coll)) {
					continue;
				}

				if (moveNeeded && this.checkFire(c.x, c.y, fireList)) {
					continue;
				}

				// sweep approach: the spot must be in sight from me (the old clear's Angle gate, moved here)	//260928
				if (moveNeeded && !this.tick.must && useTele && CollMap.checkColl(me, {x: c.x, y: c.y}, 0x4)) {
					continue;
				}

				if (!useTele && CollMap.checkColl(me, {x: c.x, y: c.y}, 0x5)) {
					// a walk around is only for a spot in sight (0x1 in the way); behind a wall (0x4) it is not a spot for a sweep target	//260928
					if (moveNeeded && !pathCand && (this.tick.must || !CollMap.checkColl(me, {x: c.x, y: c.y}, 0x4))) {
						pathCand = c;	// reachable only by walking around. Checked once below
					}

					continue;
				}

				if (!moveNeeded) {	//261001 dodge: keep the fewest (a dodge that only drops 3 -> 2 dodges again next tick)
					count = this.getMonsterCount(c.x, c.y, threatRange, monList, fireList);	//260930 after the cheap checks	//261003 counts within R - 2

					if (count >= baseline) {
						continue;	// not safer than where I stand, or than the best spot so far
					}

					choice = c;
					baseline = count;

					if (count === 0) {
						break;
					}

					continue;
				}

				choice = c;

				break;
			}

			// walking around (the old clear's Detour gate, moved here so it runs only when a walk around is really needed)	//260928
			// must: any length. sweep: my walking path to the target <= straight distance to the target * DetourPath, one getPath per call
			if (!choice && pathCand) {
				if (this.tick.must) {
					pathOk = true;
				} else {
					if (detourOk === undefined) {
						detourPath = getPath(me.area, unit.x, unit.y, me.x, me.y, 0, Pather.walkDistance);
						detourOk = !!(detourPath && detourPath.length && detourPath.length * Pather.walkDistance <= getDistance(me, unit) * Config.DetourPath);
					}

					pathOk = detourOk;
				}
			}

		}

		if (choice) {
			try {
				if (!useTele) {
					moved = Pather.walkTo(choice.x, choice.y, minDist);
				} else if (getDistance(me.x, me.y, choice.x, choice.y) <= Pather.teleDistance) {	//260930 maxTeleDistance removed
					moved = Pather.teleportTo(choice.x, choice.y);
				} else {
					moved = Pather.moveTo(choice.x, choice.y, 1);	// several hops
				}
			} catch (e1) {
				moved = false;
			}

			if (moved) {
				this.tick.moved = true;

				return true;
			}

			if (!moveNeeded) {
				return true;	// failed dodge: attack from here
			}

			this.tick.fail = "moveFailed";

			return false;
		}

		if (!moveNeeded) {
			return true;	// no better spot: attack from here
		}

		if (pathOk) {
			try {
				moved = Pather.moveTo(pathCand.x, pathCand.y, 1);
			} catch (e2) {
				moved = false;
			}

			if (moved) {
				this.tick.moved = true;

				return true;
			}

			this.tick.fail = "moveFailed";

			return false;
		}

		this.tick.fail = "unreachable";

		return false;
	},

	checkFire: function (x, y, fireList) {	//260806
		var i;

		if (fireList === undefined) {	//260806
			fireList = this.getFireList();
		}

		for (i = 0; i < fireList.length; i += 1) {
			if (getDistance(x, y, fireList[i].x, fireList[i].y) <= 4) {
				return true;
			}
		}

		return false;
	},
	
	getFireList: function () {	//260806
		var fire = getUnit(2, "fire"),
			list = [];

		if (fire) {
			do {
				list.push({x: fire.x, y: fire.y});
			} while (fire.getNext());
		}

		return list;
	},
	
	buildMonsterList: function () {
		var monster,
			monList = [];

		monster = getUnit(1);

		if (monster) {
			do {
				if (this.checkMonster(monster)) {
					monList.push(copyUnit(monster));
				}
			} while (monster.getNext());
		}

		return monList;
	},

	getMonsterCount: function (x, y, range, list, fireList) {	//260829
		var i,
			count = 0;
		
		for (i = 0; i < list.length; i += 1) {
			if (getDistance(x, y, list[i].x, list[i].y) <= range) {	//260930	//261003 < -> <= (within range; dodge and SafeTele alike)
				count += 1;
			}
		}

		for (i = 0; i < fireList.length; i += 1) {
			if (getDistance(x, y, fireList[i].x, fireList[i].y) <= 4) {
				count += 100;
			}
		}

		return count;
	},

	checkSkipped: function (unit) {	//260824
		return this.gidSkip && this.gidSkip.hasOwnProperty(unit.gid) && this.gidSkip[unit.gid] > 0;
	},

	// Check if a monster is attackable
	checkMonster: function (unit) {
		if (!unit || !copyUnit(unit).x) {
			return false;
		}
		
		if (unit.area !== me.area) {
			return false;
		}

		if (unit.type === 0 && unit.mode !== 17) { // Player
			return true;
		}

		if (unit.hp === 0 || unit.mode === 0 || unit.mode === 12) { // Dead monster
			return false;
		}

		if (unit.getStat(172) === 2) {	// Friendly monster/NPC
			return false;
		}

		if (unit.charlvl < 1) { // catapults were returning a level of 0 and hanging up clear scripts
			return false;
		}

		if (getBaseStat("monstats", unit.classid, "neverCount")) { // neverCount base stat - hydras, traps etc.
			return false;
		}

		switch (unit.classid) {
		case 179: // An evil force - cow (lol)
			return false;
		case 543: // Baal in Throne
			if (me.area === 131) {
				return false;
			}

			break;
		case 110: // Vultures
		case 111:
		case 112:
		case 113:
		case 114:
		case 608:
			if (unit.mode === 8) { // Flying
				return false;
			}

			break;
		case 68: // Sand Maggots
		case 69:
		case 70:
		case 71:
		case 72:
		case 679:
		case 258: // Water Watchers
		case 259:
		case 260:
		case 261:
		case 262:
		case 263:
			if (unit.mode === 14) { // Submerged/Burrowed
				return false;
			}

			break;
		}

		return true;
	},

	getCowKing: function (range) {
		var king = getUnit(1, 391);
		
		if (king) {
			do {
				if ((king.spectype & 0x1 || king.name === "The Cow King") && getDistance(me, king) <= Math.max(range, 40)) {
					print("Cow King found");
					
					return true;
				}
			} while (king.getNext());
		}
		
		return false;
	},
	
	// Check if a set of coords is valid/accessable
	validSpot: function (x, y) {
		var result;

		if (!me.area || !x || !y) { // Just in case
			return false;
		}

		try { // Treat thrown errors as invalid spot
			result = getCollision(me.area, x, y);
		} catch (e) {
			return false;
		}

		// Avoid non-walkable spots, objects
		if (result === undefined || (result & 0x1) || (result & 0x400)) {
			return false;
		}

		return true;
	},

	skipCheck: function (unit) {
		if (me.area === 131) {
			return true;
		}

		if ((unit.spectype & 0x7) && Config.SkipException && Config.SkipException.indexOf(unit.name) > -1) {
			print("ÿc1Skip Exception: " + unit.name);
			return true;
		}

		var i, j, rval,
			tempArray = [];

EnchantLoop: // Skip enchanted monsters
		for (i = 0; i < Config.SkipEnchant.length; i += 1) {
			tempArray = Config.SkipEnchant[i].toLowerCase().split(" and ");

			for (j = 0; j < tempArray.length; j += 1) {
				switch (tempArray[j]) {
				case "extra strong":
					tempArray[j] = 5;

					break;
				case "extra fast":
					tempArray[j] = 6;

					break;
				case "cursed":
					tempArray[j] = 7;

					break;
				case "magic resistant":
					tempArray[j] = 8;

					break;
				case "fire enchanted":
					tempArray[j] = 9;

					break;
				case "lightning enchanted":
					tempArray[j] = 17;

					break;
				case "cold enchanted":
					tempArray[j] = 18;

					break;
				case "mana burn":
					tempArray[j] = 25;

					break;
				case "teleportation":
					tempArray[j] = 26;

					break;
				case "spectral hit":
					tempArray[j] = 27;

					break;
				case "stone skin":
					tempArray[j] = 28;

					break;
				case "multiple shots":
					tempArray[j] = 29;

					break;
				}
			}

			for (j = 0; j < tempArray.length; j += 1) {
				if (!unit.getEnchant(tempArray[j])) {
					break;
				}
			}

			if (j === tempArray.length) {

				return false;
			}
		}

ImmuneLoop: // Skip immune monsters
		for (i = 0; i < Config.SkipImmune.length; i += 1) {
			tempArray = Config.SkipImmune[i].toLowerCase().split(" and ");

			for (j = 0; j < tempArray.length; j += 1) {
				if (this.checkResist(unit, tempArray[j])) { // Infinity calculations are built-in
					break;
				}
			}

			if (j === tempArray.length) {
				return false;
			}
		}

AuraLoop: // Skip monsters with auras
		for (i = 0; i < Config.SkipAura.length; i += 1) {
			rval = true;

			switch (Config.SkipAura[i].toLowerCase()) {
			case "fanaticism":
				if (unit.getState(49)) {
					rval = false;
				}

				break;
			case "might":
				if (unit.getState(33)) {
					rval = false;
				}

				break;
			case "holy fire":
				if (unit.getState(35)) {
					rval = false;
				}

				break;
			case "blessed aim":
				if (unit.getState(40)) {
					rval = false;
				}

				break;
			case "conviction":
				if (unit.getState(28)) {
					rval = false;
				}

				break;
			case "holy freeze":
				if (unit.getState(43)) {
					rval = false;
				}

				break;
			case "holy shock":
				if (unit.getState(46)) {
					rval = false;
				}

				break;
			}

			if (!rval) {
				return false;
			}
		}

		return true;
	},

	// Check if a monster is immune to specified attack type
	checkResist: function (unit, val, maxres) {
		// Ignore player resistances
		if (unit.type === 0) {
			return true;
		}

		var damageType = typeof val === "number" ? this.getSkillElement(val) : val;

		if (maxres === undefined) {
			maxres = 100;
		}

		// Static handler
		if (val === 42 && this.getResist(unit, damageType) < 100) {
			return (unit.hp * 100 / 128) > Config.CastStatic;
		}

		if (this.infinity && ["fire", "lightning", "cold"].indexOf(damageType) > -1 && unit.getState) { // baal in throne room doesn't have getState
			if (!unit.getState(28)) {
				return this.getResist(unit, damageType) < 117;
			}

			return this.getResist(unit, damageType) < maxres;
		}

		return this.getResist(unit, damageType) < maxres;
	},

	// Get element by skill number
	getSkillElement: function (skillId) {

		switch (skillId) {
		case 74: // Corpse Explosion
		case 144: // Concentrate
		case 147: // Frenzy
		case 273: // Minge Blast
		case 500: // Summoner
			return "physical";
		case 101: // Holy Bolt
			return "holybolt"; // no need to use this.elements array because it returns before going over the array
		case 43: // Telekinesis - works regardless of immunities	//260926
		case 243: // Shock Wave	//260620
		case 249: // Armageddon	//260620
			return "none";
		}

		var eType = getBaseStat("skills", skillId, "etype");

		if (typeof (eType) === "number") {
			return this.elements[eType];
		}

		return false;
	},

	// Get a monster's resistance to specified element
	getResist: function (unit, type) {
		if (!unit || !unit.getStat) {	// some scripts pass empty units in throne room
			return 100;
		}

		if (unit.type === 0) { // player
			return 0;
		}

		switch (type) {
		case "physical":
			return unit.getStat(36);
		case "fire":
			return unit.getStat(39);
		case "lightning":
			return unit.getStat(41);
		case "magic":
			return unit.getStat(37);
		case "cold":
			return unit.getStat(43);
		case "poison":
			return unit.getStat(45);
		case "none":
			return 0;
		case "holybolt": // check if a monster is undead
			if (getBaseStat("monstats", unit.classid, "lUndead") || getBaseStat("monstats", unit.classid, "hUndead")) {
				return 0;
			}

			return 100;
		}

		return 100;
	},

	getPrimarySlot: function () {
		if (Config.PrimarySlot === -1) { // determine primary slot if not set
			if ((Precast.haveCTA > -1) || Precast.checkCTA()) { // have cta
				if (this.checkSlot(Precast.haveCTA ^ 1)) { // have item on non-cta slot
					Config.PrimarySlot = Precast.haveCTA ^ 1; // set non-cta slot as primary
				} else { // other slot is empty
					Config.PrimarySlot = Precast.haveCTA; // set cta as primary slot
				}
			} else if (!this.checkSlot(0) && this.checkSlot(1)) { // only slot II has items
				Config.PrimarySlot = 1;
			} else { // both slots have items, both are empty, or only slot I has items
				Config.PrimarySlot = 0;
			}
		}

		return Config.PrimarySlot;
	},

	checkSlot: function (slot = me.weaponswitch) { // check if slot has items
		var item = me.getItem(-1, 1);

		if (item) {
			do {
				if (me.weaponswitch !== slot) {
					if (item.bodylocation === 11 || item.bodylocation === 12) {
						return true;
					}
				} else {
					if (item.bodylocation === 4 || item.bodylocation === 5) {
						return true;
					}
				}
			} while (item.getNext());
		}

		return false;
	},

	weaponSwitch: function (slot) {
		if (me.gametype === 0 || me.weaponswitch === slot) {
			return true;
		}

		var i, tick;

		if (slot === undefined) {
			slot = me.weaponswitch ^ 1;
		}

		delay(500);

		for (i = 0; i < 5; i += 1) {
			weaponSwitch();

			tick = getTickCount();

			while (getTickCount() - tick < 2000 + me.ping) {
				if (me.weaponswitch === slot) {

					return true;
				}

				delay(10);
			}
		}

		return false;
	},

	// Get items with charges
	getCharges: function () {
		if (!Skill.charges) {
			Skill.charges = [];
		}

		var i, stats,
			item = me.getItem(-1, 1);

		if (item) {
			do {
				stats = item.getStat(-2);

				if (stats.hasOwnProperty(204)) {
					if (stats[204] instanceof Array) {
						for (i = 0; i < stats[204].length; i += 1) {
							if (stats[204][i] !== undefined) {
								Skill.charges.push({
									unit: copyUnit(item),
									gid: item.gid,
									skill: stats[204][i].skill,
									level: stats[204][i].level,
									charges: stats[204][i].charges,
									maxcharges: stats[204][i].maxcharges
								});
							}
						}
					} else {
						Skill.charges.push({
							unit: copyUnit(item),
							gid: item.gid,
							skill: stats[204].skill,
							level: stats[204].level,
							charges: stats[204].charges,
							maxcharges: stats[204].maxcharges
						});
					}
				}
			} while (item.getNext());
		}

		return true;
	},

	// Check if player or his merc are using Infinity, and adjust resistance checks based on that
	checkInfinity: function () {
		var i, merc, item;

		for (i = 0; i < 3; i += 1) {
			merc = me.getMerc();

			if (merc) {
				break;
			}

			delay(50);
		}

		// Check merc infinity
		if (merc) {
			item = merc.getItem();

			if (item) {
				do {
					if (item.getPrefix(20566)) {
						this.infinity = true;

						return true;
					}
				} while (item.getNext());
			}
		}

		// Check player infinity
		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.getPrefix(20566)) {
					this.infinity = true;

					return true;
				}
			} while (item.getNext());
		}

		return false;
	},

	getCustomAttack: function (unit) {
		var i;

		// Check if unit got invalidated
		if (!unit || !unit.name || !copyUnit(unit).x) {
			return false;
		}

		for (i in Config.CustomAttack) {
			if (Config.CustomAttack.hasOwnProperty(i) && unit.name.toLowerCase() === i.toLowerCase()) {
				return Config.CustomAttack[i];
			}
		}

		return false;
	},

	// Detect use of bows/crossbows
	usingBow: function () {
		var item;

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.bodylocation === 4 || item.bodylocation === 5) {
					switch (item.itemType) {
					case 27: // Bows
					case 85: // Amazon Bows
						return "bow";
					case 35: // Crossbows
						return "crossbow";
					}
				}
			} while (item.getNext());
		}

		return false;
	},
	
};
