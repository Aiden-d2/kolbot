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

	clear: function (range, spectype, bossId, sortFunc, openChest) { // 260727
		while (!me.gameReady) {
			delay(40);
		}

		if (range === undefined) {
			range = 25;
		}

		if (spectype === undefined) {
			spectype = 0;
		}

		if (bossId === undefined) {
			bossId = false;
		}

		if (sortFunc === undefined) {
			sortFunc = false;
		}

		//if (pickit === undefined) {
			//pickit = true;
		//}

		if (openChest === undefined) {	//260727
			openChest = true;
		}

		if (typeof (range) !== "number") {
			throw new Error("Attack.clear: range must be a number.");
		}

		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			return false;
		}

		if (!sortFunc) {
			//sortFunc = this.sortMonsters;
			sortFunc = this.sortByDistance;	//260812
		}

		var i, boss, orgx, orgy, target, result, monsterList, attackSkill,
			retry = 0,
			attackCount = 0,
			needSort = true;	//260901

		this.gidAttack = [];
		
		if (!this.gidSkip || (this.gidSkipPos && (this.gidSkipPos.area !== me.area || getDistance(me, this.gidSkipPos.x, this.gidSkipPos.y) > 40))) {	//260902
			//print("[HP Skip Reset] area: " + me.area);
			this.gidSkip = {};
			this.gidSkipPos = null;
		}
		
		if (bossId) {
			for (i = 0; !boss && i < 5; i += 1) {	//260722
				boss = bossId > 999 ? getUnit(1, -1, -1, bossId) : getUnit(1, bossId);
				
				if (!boss) {
					delay(me.ping * 2 + 100);
				}
			}

			if (!boss) {
				throw new Error("Attack.clear: " + bossId + " not found");
			}

			orgx = boss.x;
			orgy = boss.y;
		} else {
			orgx = me.x;
			orgy = me.y;
		}
		
		monsterList = [];
		target = getUnit(1);

		if (target) {
			do {
				if ((!spectype || (target.spectype & spectype)) && !this.checkSkipped(target) && this.checkMonster(target) && this.skipCheck(target)) {
					monsterList.push(copyUnit(target));
				}
			} while (target.getNext());
		}

		while (monsterList.length > 0 && attackCount < 999) {	// 260521
			if (boss) {
				orgx = boss.x;
				orgy = boss.y;
			}

			if (me.dead) {
				return false;
			}
			
			if (me.area === 39 && this.getCowKing(range)) {	//260727
				return false;
			}

			if (Config.TownCheck) {
				Misc.townCheck();
			}
			
			if (needSort) {	//260901
				monsterList.sort(sortFunc);
				needSort = false;
			}

			target = copyUnit(monsterList[0]);
			
			attackSkill = Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3];

			if (!this.checkMonster(target) || getDistance(target, orgx, orgy) > range) {	//260530
				monsterList.shift();
				continue;
			}
			
			if (Config.NoSkipArea.indexOf(me.area) < 0 && checkCollision(me, target, 0x4)) {
				if (me.area === 108 && target.classid === 306 && !(target.spectype & 0x1)) {	//260829
					//print("[306 Skip] " + target.name);
					monsterList.shift();
					
					continue;	//260816
				}
				
				var cx, cy,	//260726
					skillRange = Skill.getRange(attackSkill),	//260829
					blocked = true,
					angle = Math.round(Math.atan2(me.y - target.y, me.x - target.x) * 180 / Math.PI),
					angles = [15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 165, -165, 180];	//260618
				
				for (i = 0; i < angles.length; i += 1) {
					cx = Math.round(Math.cos((angle + angles[i]) * Math.PI / 180) * skillRange + target.x);
					cy = Math.round(Math.sin((angle + angles[i]) * Math.PI / 180) * skillRange + target.y);

					if (!CollMap.checkColl(target, {x: cx, y: cy}, 0x4) && !CollMap.checkColl(me, {x: cx, y: cy}, 0x4)) {
						blocked = false;
						break;
					}
				}

				if (blocked) {
					//print("[Angle Skip] " + target.name + " dist: " + Math.floor(getDistance(me, target)) + " area: " + me.area);
					monsterList.shift();
					continue;
				}
				
				var collPath = getPath(me.area, target.x, target.y, me.x, me.y, 0, Pather.walkDistance);
				
				if (!collPath || collPath.length * Pather.walkDistance > getDistance(me, target) * Config.DetourPath) {
					//print("[Detour Skip] " + target.name + " path: " + (collPath ? collPath.length * Pather.walkDistance : "null") + " ratio: " + (collPath ? (collPath.length * Pather.walkDistance / Math.floor(getDistance(me, target))).toFixed(1) : "-") + " dist: " + Math.floor(getDistance(me, target)) + " area: " + me.area);
					monsterList.shift();
					continue;
				}
			}
			
			//if (Config.Dodge.Enabled && me.hp * 100 / me.hpmax <= Config.Dodge.HP && Skill.getRange(attackSkill) > 5) {
				//this.dodge(target, Skill.getRange(attackSkill), 1, Config.Dodge.Range);
			//}

			result = ClassAttack.doAttack(target, attackCount % 10 === 0);	//260906
			
			needSort = true;	//260901

			if (result) {
				retry = 0;

				if (result === 2) {
					monsterList.shift();
					continue;
				}

				for (i = 0; i < this.gidAttack.length; i += 1) {
					if (this.gidAttack[i].gid === target.gid) {
						break;
					}
				}

				if (i === this.gidAttack.length) {
					this.gidAttack.push({gid: target.gid, attacks: 0, name: target.name, hp: target.hp});
				}

				this.gidAttack[i].attacks += 1;
				attackCount += 1;

				if (this.gidAttack[i].attacks % 10 === 0 && Skill.getRange(attackSkill) < 4) {	//260902
					Packet.flash(me.gid);
				}
				
				if (Config.NoSkipArea.indexOf(me.area) < 0) {	//!(target.spectype & 0x7)) {
					if (this.gidAttack[i].attacks % 5 === 0) {	//260902
						if ((this.gidAttack[i].hp - target.hp) / 128 < 0.2) {
							this.gidSkip[target.gid] = (this.gidSkip[target.gid] || 0) + 1;	//260621
							this.gidSkipPos = {x: me.x, y: me.y, area: me.area};
							
							if (this.gidSkip[target.gid] > 0) {
								//print("[HP Skip]: " + target.name + " classid: " + target.classid + " HP: " + target.hp + " / " + this.gidAttack[i].hp + " gid: " + target.gid + " area: " + me.area);
							} else {
								//print("[HP Skip]: " + target.name + " HP: " + target.hp + " / " + this.gidAttack[i].hp + " count: " + this.gidSkip[target.gid] + " area: " + me.area);
							}
							
							monsterList.shift();
						} else {
							this.gidAttack[i].hp = target.hp;
							//this.gidSkip[target.gid] = 0;
						}
					}
				}
			} else {
				if (retry++ > 3) {
					//print("[Retry Skip]: " + target.name + " area: " + me.area);	// 260523
					monsterList.shift();
					retry = 0;
				}

				Packet.flash(me.gid);
			}
		}
		
		if (boss && attackCount >= 999) {
			throw new Error("Failed to clear boss " + bossId);
		}

		if (attackCount > 0) {
			Pickit.pickItems(range);
			
			ClassAttack.afterAttack();
		}
		
		if (openChest) {	//260727
			this.openChests(Math.min(range, 15), orgx, orgy);
		}

		return true;
	},

	// Clear an entire area based on monster spectype
	clearLevel: function (spectype) {
		var room, result, rooms, myRoom, currentArea, previousArea;

		function RoomSort(a, b) {
			return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
		}

		room = getRoom();

		if (!room) {
			return false;
		}

		if (spectype === undefined) {
			spectype = 0;
		}

		rooms = [];

		currentArea = getArea().id;

		do {
			rooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
		} while (room.getNext());

		while (rooms.length > 0) {
			// for Den questing
			if (me.area === 8 && me.getQuest(1, 1)) {	//260627
				break;
			}
			
			// get the first room + initialize myRoom var
			if (!myRoom) {
				room = getRoom(me.x, me.y);
			}

			if (room) {
				if (room instanceof Array) { // use previous room to calculate distance
					myRoom = [room[0], room[1]];
				} else { // create a new room to calculate distance (first room, done only once)
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}
			}

			rooms.sort(RoomSort);
			room = rooms.shift();

			result = Pather.getNearestWalkable(room[0], room[1], 20, 3);	//260826 prev. 18/3

			if (result) {
				Pather.moveTo(result[0], result[1], 3, spectype);
				previousArea = result;

				if (!this.clear(30, spectype)) {	//40	//260910
					break;
				}
			}
			// Make sure bot does not get stuck in different area.
			else if (currentArea !== getArea().id) {
				Pather.moveTo(previousArea[0], previousArea[1], 3, spectype);
			}
			
			if (me.area === 8 && !me.getQuest(1, 1)) {	//260627
				sendPacket(1, 0x40);
			}
		}

		return true;
	},

	clearList: function (mainArg, sortFunc, refresh) { // 260510
		if (Config.AttackSkill[1] < 0 || Config.AttackSkill[3] < 0) {
			return false;
		}

		var i, target, result, monsterList, attackSkill,
			retry = 0,
			attackCount = 0,
			needSort = true;	//260901

		this.gidAttack = [];

		if (!sortFunc) {
			//sortFunc = this.sortMonsters;
			sortFunc = this.sortByDistance;	//260812
		}

		if (typeof mainArg === "function") {
			monsterList = mainArg.call();
		} else if (mainArg && typeof mainArg === "object") {
			monsterList = mainArg.slice(0);
		} else {
			return false;
		}

		if (!monsterList || !monsterList.length) {
			return false;
		}

		while (monsterList.length > 0 && attackCount < 999) {
			if (me.dead) {
				return false;
			}

			if (Config.TownCheck) {
				Misc.townCheck();
			}

			if (refresh && typeof mainArg === "function" && attackCount > 0 && attackCount % refresh === 0) {
				var refreshed = mainArg.call();
				
				if (refreshed && refreshed.length) {
					//monsterList = refreshed.filter(function (u) { return Attack.checkMonster(u); });
					monsterList = refreshed;	//260901
					needSort = true;
				}
			}

			if (needSort) {	//260901
				monsterList.sort(sortFunc);
				needSort = false;
			}
			
			target = copyUnit(monsterList[0]);

			if (!this.checkMonster(target)) {
				monsterList.shift();
				continue;
			}
			
			attackSkill = Config.AttackSkill[(target.spectype & 0x7) ? 1 : 3];

			//if (Config.Dodge.Enabled && me.hp * 100 / me.hpmax <= Config.Dodge.HP && Skill.getRange(attackSkill) > 5) {
				//this.dodge(target, Skill.getRange(attackSkill), 1, Config.Dodge.Range);
			//}

			result = ClassAttack.doAttack(target, attackCount % 10 === 0);	//260906
			
			needSort = true;

			if (result) {
				retry = 0;

				if (result === 2) {
					monsterList.shift();
					continue;
				}

				for (i = 0; i < this.gidAttack.length; i += 1) {
					if (this.gidAttack[i].gid === target.gid) {
						break;
					}
				}

				if (i === this.gidAttack.length) {
					this.gidAttack.push({gid: target.gid, attacks: 0, name: target.name});
				}

				this.gidAttack[i].attacks += 1;
				attackCount += 1;

				if (this.gidAttack[i].attacks % 10 === 0 && Skill.getRange(attackSkill) < 4) {	//260902
					Packet.flash(me.gid);
				}
			} else {
				if (retry++ > 3) {
					monsterList.shift();
					retry = 0;
				}

				Packet.flash(me.gid);
			}
		}
		
		if (attackCount >= 999) {
			throw new Error("attackCount exceeded");
		}

		if (attackCount > 0) {
			ClassAttack.afterAttack();
			Pickit.pickItems();
		}
		
		return true;
	},

	scanList: function (classids, box, range) {	// 260629
		var isArray = classids && typeof classids === "object";
		return function () {
			var list = [],
				monster = (!classids || isArray) ? getUnit(1) : getUnit(1, classids);

			if (monster) {
				do {
					if (!Attack.checkMonster(monster)) { continue; }
					if (isArray && classids.indexOf(monster.classid) === -1) { continue; }
					if (box && (monster.x < box.x1 || monster.x > box.x2 || monster.y < box.y1 || monster.y > box.y2)) { continue; }
					if (range !== undefined && getDistance(me, monster) > range) { continue; }
					list.push(copyUnit(monster));
				} while (monster.getNext());
			}

			return list;
		};
	},

	setPosition: function (unit, distance, coll, minDist) {	//260828
		if (!unit || !copyUnit(unit).x) {
			return false;
		}

		minDist = (typeof minDist === "number" && minDist > 0) ? minDist : 3;

		var i, c, fit, n, adj, prev, useTele, monList,
			list = [],
			fireList = null,
			baseline = 0,
			teleCount = 0,
			slotTele = null,
			slotWalk = null,
			slotMove = null,
			slotRev = null,
			revGate = false,
			moveNeeded = getDistance(me, unit) > distance || checkCollision(me, unit, coll),
			scoring = Config.Dodge.Enabled && !moveNeeded && distance >= Config.Dodge.Range && me.hp * 100 / me.hpmax <= Config.Dodge.HP && unit.classid !== 243,	//260915
			angle = Math.atan2(me.y - unit.y, me.x - unit.x);

		if (!moveNeeded && !scoring) {
			return true;
		}

		useTele = Pather.useTeleport();
		fireList = this.getFireList();

		if (scoring) {
			monList = this.buildMonsterList();

			baseline = this.getMonsterCount(me.x, me.y, Config.Dodge.Range, monList, fireList);

			if (baseline === 0) {
				return true;
			}

			revGate = this.getMonsterCount(me.x, me.y, 4, monList, fireList) > 2;
		}

		function add(d, offset) {
			var rad = angle + offset * Math.PI / 180,
				cx = Math.round(Math.cos(rad) * d + unit.x),
				cy = Math.round(Math.sin(rad) * d + unit.y);

			if (useTele && getDistance(me.x, me.y, cx, cy) > Pather.maxTeleDistance) {
				return;
			}

			list.push({x: cx, y: cy, dist: d, offset: offset});
		}

		function build(d) {
			var k, step, offset;

			if (d < 1) {
				return;
			}

			step = Config.Dodge.Step / d * 180 / Math.PI;

			for (k = 0; ; k += 1) {
				offset = k === 0 ? 0 : (k % 2 ? Math.ceil(k / 2) : -Math.ceil(k / 2)) * step;

				if (Math.abs(offset) > 180) {
					break;
				}

				add(d, offset);
			}

			if (d < 4) {
				add(d, 180);
			}
		}

		if (useTele) {
			build(distance);
			teleCount = list.length;

			if (scoring && distance !== Config.Dodge.Range) {
				build(Config.Dodge.Range);
			}
		} else if (moveNeeded) {
			build(distance);
			prev = distance;

			for (n = 1; n < 3; n += 1) {
				adj = distance - n * Math.floor(distance / 3 - 1);

				if (adj > 0 && adj < prev) {
					build(adj);
					prev = adj;
				}
			}
		} else {
			build(Config.Dodge.Range);
		}

		for (i = 0; i < list.length; i += 1) {
			c = list[i];

			if (slotTele && i >= teleCount) {
				break;
			}
			
			if (slotMove && c.dist !== distance) {
				break;
			}

			if (i < teleCount) {
				if (!Pather.checkSpot(c.x, c.y, 0x1, false)) {
					continue;
				}
			} else {
				fit = c.dist === (moveNeeded ? distance : Config.Dodge.Range)
					&& (Math.abs(c.offset) <= 90 || revGate);

				if (!fit && (scoring || slotMove)) {
					continue;
				}
				
				if (getCollision(me.area, c.x, c.y) & 0x1) {
					continue;
				}
			}

			if (CollMap.checkColl(unit, {x: c.x, y: c.y}, coll)) {
				continue;
			}

			if (!scoring) {
				if (this.checkFire(c.x, c.y, fireList)) {
					continue;
				}

				if (useTele) {
					slotTele = c;

					break;
				}

				if (!slotMove) {
					slotMove = c;
				}
			}

			if (i >= teleCount) {
				if (!fit || CollMap.checkColl(me, {x: c.x, y: c.y}, 0x5)) {
					continue;
				}
			}

			if (!scoring) {
				slotWalk = c;

				break;
			}

			c.mc = this.getMonsterCount(c.x, c.y, Config.Dodge.Range, monList, fireList);

			if (c.mc >= baseline) {
				continue;
			}

			if (i < teleCount) {
				if (!slotTele || c.mc < slotTele.mc) {
					slotTele = c;
				}
			} else if (Math.abs(c.offset) <= 90) {
				if (!slotWalk || c.mc < slotWalk.mc) {
					slotWalk = c;
				}
			} else if (!slotRev || c.mc < slotRev.mc) {
				slotRev = c;
			}

			if (c.mc === 0) {
				break;
			}
		}

		if (useTele) {
			if (slotTele) {
				return Pather.teleportTo(slotTele.x, slotTele.y) || !moveNeeded;
			}

			//if (!scoring) {
				return false;
			//}
		}

		c = slotWalk || slotRev;

		if (c) {
			return Pather.walkTo(c.x, c.y, minDist) || !moveNeeded;
		}

		if (slotMove) {
			try {
				return Pather.moveTo(slotMove.x, slotMove.y, 1);
			} catch (e) {
				return false;
			}
		}

		return !moveNeeded;
	},

	getIntoPosition: function (unit, distance, coll, minDist) {	// 260508
		if (!unit || !unit.x || !unit.y) {
			return false;
		}
		
		if (me.charlvl < 24) {
			//distance = Math.min(distance, Config.Dodge.Range);	//260813
		}
		
		minDist = (typeof minDist === "number" && minDist > 0) ? minDist : 3;	// 260613
		
		var i, cx, cy, n, adj,
			angle = Math.round(Math.atan2(me.y - unit.y, me.x - unit.x) * 180 / Math.PI),
			angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 135, -135, 180],	//260715
			//angles = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90, 105, -105, 120, -120, 135, -135, 150, -150, 165, -165, 180];
			fireList = this.getFireList();	//260806
		
		//print("[GIP] dist: " + Math.floor(getDistance(me, unit)) + " range: " + Math.floor(distance) + " area: " + me.area);	// 260528
		
		if (Pather.useTeleport()) {
			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round(Math.cos((angle + angles[i]) * Math.PI / 180) * distance + unit.x);
				cy = Math.round(Math.sin((angle + angles[i]) * Math.PI / 180) * distance + unit.y);

				if (Pather.checkSpot(cx, cy, 0x1, false) && !CollMap.checkColl(unit, {x: cx, y: cy}, coll) && !this.checkFire(cx, cy, fireList)) {	//260806
					//print("[GIP] result:TELE->(" + cx + ", " + cy + ") offset:" + angles[i] + " dist:" + Math.floor(getDistance(unit, cx, cy)));	// 260528
					return Pather.teleportTo(cx, cy);
				}
			}
		}
		
		// walkTo fallback
		for (i = 0; i < 13; i += 1) {
			cx = Math.round(Math.cos((angle + angles[i]) * Math.PI / 180) * distance + unit.x);
			cy = Math.round(Math.sin((angle + angles[i]) * Math.PI / 180) * distance + unit.y);
		
			if (!(getCollision(me.area, cx, cy) & 0x1) && !CollMap.checkColl(unit, {x: cx, y: cy}, coll) && !CollMap.checkColl(me, {x: cx, y: cy}, 0x5) && !this.checkFire(cx, cy, fireList)) {	//260806
				//print("[GIP] result:WALK->(" + cx + ", " + cy + ") offset: " + angles[i] + " dist: " + Math.floor(getDistance(unit, cx, cy))); // 260528
				return Pather.walkTo(cx, cy, minDist);	//260613
			}
		}
		
		// moveTo fallback
		for (n = 0; n < 3; n += 1) { // 260530
			adj = distance - n * Math.floor(distance / 3 - 1);
			
			for (i = 0; i < angles.length; i += 1) {
				cx = Math.round(Math.cos((angle + angles[i]) * Math.PI / 180) * adj + unit.x);
				cy = Math.round(Math.sin((angle + angles[i]) * Math.PI / 180) * adj + unit.y);
				
				if (!(getCollision(me.area, cx, cy) & 0x1) && !CollMap.checkColl(unit, {x: cx, y: cy}, coll) && !this.checkFire(cx, cy, fireList)) {	//260806
					//print("[GIP] result:MOVE->(" + cx + ", " + cy + ") offset: " + angles[i] + " dist: " + Math.floor(getDistance(unit, cx, cy)) + " range: " + adj);	//260528
					return Pather.moveTo(cx, cy, 1);
				}
			}
		}

		//print("[GIP]: no valid point area: " + me.area);	// 260524
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
	
	dodge: function (unit, distance, spread, range) { // 260501
		if (arguments.length < 4) {
			throw new Error("dodge: Not enough arguments supplied");
		}

		if (me.charlvl < 24) {
			distance = Math.min(distance, Config.Dodge.Range);
		}

		var i, count, grid, currCount, index, offsets, rad, tx, ty, wx, wy, col, angle, idealPos, monList, fireList;	//260806
			
			monList = this.buildMonsterList();
			fireList = this.getFireList();	//260806
			count = this.getMonsterCount(me.x, me.y, Config.Dodge.Range, monList, fireList);	// 260505

			if (count < Config.Dodge.Count) {
				return true;
			}
			
			monList.sort(Sort.units);
			unit = monList[0];	//260508
			
			angle = Math.atan2(me.y - unit.y, me.x - unit.x);	// 260505
			idealPos = {
				x: Math.round(Math.cos(angle) * distance + unit.x),	// 260505
				y: Math.round(Math.sin(angle) * distance + unit.y)	// 260505
			};

		function gridSort(a, b) {
			return getDistance(a.x, a.y, idealPos.x, idealPos.y) - getDistance(b.x, b.y, idealPos.x, idealPos.y);
		}
		
		col = 0;	//260508
		
		//print("[DGE] count: " + count + " dist: " + Math.floor(getDistance(me, unit)) + " range: " + distance + " area: " + me.area);	// 260528
		
		// teleport // 260505
		if (Pather.useTeleport() && distance >= Config.Dodge.Range) {	// 260505
			CollMap.getNearbyRooms(unit.x, unit.y);

			grid = this.buildGrid(unit.x - distance, unit.x + distance, unit.y - distance, unit.y + distance, spread);

			if (!grid.length) {
				return false;
			}

			grid.sort(gridSort);

			for (i = 0; i < grid.length; i += 1) {
				if (Pather.checkSpot(grid[i].x, grid[i].y, 0x1, true) && !CollMap.checkColl(unit, {x: grid[i].x, y: grid[i].y}, 0x4)) {//260806 && !this.checkFire(grid[i].x, grid[i].y)) { // 260530
					currCount = this.getMonsterCount(grid[i].x, grid[i].y, range, monList, fireList);	//260806

					if (currCount < count) {
						index = i;
						count = currCount;
					}

					if (currCount === 0) {
						break;
					}
				}
			}

			if (typeof index === "number") {
				//print("[DGE] result:TELE->(" + grid[index].x + ", " + grid[index].y + ") count: " + count + " dist: " + Math.floor(getDistance(unit, grid[index].x, grid[index].y)));	// 260528
				return Pather.teleportTo(grid[index].x, grid[index].y);
			}
		}
		
		// walk fallback
		if (getDistance(me, unit) < distance) {
			offsets = [0, 15, -15, 30, -30, 45, -45, 60, -60, 75, -75, 90, -90];	// 260512

			for (i = 0; i < offsets.length; i += 1) {
				rad = angle + offsets[i] * Math.PI / 180;
				tx = Math.round(unit.x + Math.cos(rad) * Math.min(distance, Config.Dodge.Range));
				ty = Math.round(unit.y + Math.sin(rad) * Math.min(distance, Config.Dodge.Range));

				if (!(getCollision(me.area, tx, ty) & 0x1) && !CollMap.checkColl(me, {x: tx, y: ty}, 0x5)) {//260806 && !this.checkFire(tx, ty)) {	//260530
					col += 1;
					if (!CollMap.checkColl(unit, {x: tx, y: ty}, 0x4)) {
						currCount = this.getMonsterCount(tx, ty, Config.Dodge.Range, monList, fireList);	//260806
						if (currCount < count) {
							wx = tx;
							wy = ty;
							count = currCount;
						}
						
						if (currCount === 0) {
							break;
						}
					}
				}
			}
			
			if (wx === undefined && this.getMonsterCount(me.x, me.y, 4, monList, fireList) > 2 && col < Math.ceil(offsets.length / 3)) {	//260806
				//print("[DGE] WALK: reverse fallback col: " + col);
				for (i = 0; i < offsets.length; i += 1) {
					rad = (angle + Math.PI) + offsets[i] * Math.PI / 180;
					tx = Math.round(unit.x + Math.cos(rad) * Math.min(distance, Config.Dodge.Range) * 1.5);
					ty = Math.round(unit.y + Math.sin(rad) * Math.min(distance, Config.Dodge.Range) * 1.5);

					if (!(getCollision(me.area, tx, ty) & 0x1) && !CollMap.checkColl(me, {x: tx, y: ty}, 0x5) && !CollMap.checkColl(unit, {x: tx, y: ty}, 0x4)) {//260806 && !this.checkFire(tx, ty)) {	//260530
						currCount = this.getMonsterCount(tx, ty, Config.Dodge.Range, monList, fireList);	//260806
						if (currCount < count) {
							wx = tx;
							wy = ty;
							count = currCount;
						}
						
						if (currCount === 0) {
							break;
						}
					}
				}
			}
			
			if (wx !== undefined) {
				//print("[DGE] result:WALK->(" + wx + ", " + wy + ") count: " + count + " dist: " + Math.floor(getDistance(unit, wx, wy)));	// 260528
				return Pather.walkTo(wx, wy);	//260517
			}
		} else {
			//print("[DGE] WALK skip: dist " + Math.floor(getDistance(me, unit)) + " >= skillRange " + distance); // 260506
			return false;
		}
		
		//print("[DGE]: no valid point area: " + me.area);	// 260528
		return false;
	},

	buildGrid: function (xmin, xmax, ymin, ymax, spread) {
		if (xmin >= xmax || ymin >= ymax || spread < 1) {
			throw new Error("buildGrid: Bad parameters");
		}

		var i, j, coll,
			grid = [];

		for (i = xmin; i <= xmax; i += spread) {
			for (j = ymin; j <= ymax; j += spread) {
				coll = CollMap.getColl(i, j, true);

				if (typeof coll === "number") {
					grid.push({x: i, y: j, coll: coll});
				}
			}
		}

		return grid;
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
			if (getDistance(x, y, list[i].x, list[i].y) <= range) {
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

	getScarinessLevel: function (unit) {
		var scariness = 0; //, ids = [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676];

		// Only handling monsters for now
		if (unit.type !== 1) {
			return undefined;
		}

		// Minion
		if (unit.spectype & 0x08) {
			scariness += 1;
		}

		// Champion
		if (unit.spectype & 0x02) {
			scariness += 2;
		}

		// Boss
		if (unit.spectype & 0x04) {
			scariness += 4;
		}

		// Summoner or the like
		if (Attack.ids.indexOf(unit.classid) > -1) {	//260806
			scariness += 8;
		}

		return scariness;
	},

	sortByDistance: function (unitA, unitB) {
		return getDistance(me, unitA) - getDistance(me, unitB);
	},

	// Sort monsters based on distance, spectype and classId (summoners are attacked first)
	sortMonsters: function (unitA, unitB) {
		// No special sorting for were-form
		if (Config.Wereform) {
			return getDistance(me, unitA) - getDistance(me, unitB);
		}

		// Barb optimization
		if (me.classid === 4) {
			/*if (!Attack.checkResist(unitA, Attack.getSkillElement(Config.AttackSkill[(unitA.spectype & 0x7) ? 1 : 3]))) {
				return 1;
			}

			if (!Attack.checkResist(unitB, Attack.getSkillElement(Config.AttackSkill[(unitB.spectype & 0x7) ? 1 : 3]))) {
				return -1;
			}*/
			var resistA = !Attack.checkResist(unitA, Attack.getSkillElement(Config.AttackSkill[(unitA.spectype & 0x7) ? 1 : 3]));
			var resistB = !Attack.checkResist(unitB, Attack.getSkillElement(Config.AttackSkill[(unitB.spectype & 0x7) ? 1 : 3])); // 260419

			if (resistA && !resistB) {
				return 1;
			}

			if (resistB && !resistA) {
				return -1;
			}
		}

		//var ids = [58, 59, 60, 61, 62, 101, 102, 103, 104, 105, 278, 279, 280, 281, 282, 298, 299, 300, 645, 646, 647, 662, 663, 664, 667, 668, 669, 670, 675, 676];

		if (me.area !== 61 && Attack.ids.indexOf(unitA.classid) > -1 && Attack.ids.indexOf(unitB.classid) > -1) {	//260806
			// Kill "scary" uniques first (like Bishibosh)
			if ((unitA.spectype & 0x04) && (unitB.spectype & 0x04)) {
				return getDistance(me, unitA) - getDistance(me, unitB);
			}

			if (unitA.spectype & 0x04) {
				return -1;
			}

			if (unitB.spectype & 0x04) {
				return 1;
			}

			return getDistance(me, unitA) - getDistance(me, unitB);
		}

		if (Attack.ids.indexOf(unitA.classid) > -1) {	//260806
			return -1;
		}

		if (Attack.ids.indexOf(unitB.classid) > -1) {	//260806
			return 1;
		}

		if (Config.BossPriority) {
			if ((unitA.spectype & 0x5) && (unitB.spectype & 0x5)) {
				return getDistance(me, unitA) - getDistance(me, unitB);
			}

			if (unitA.spectype & 0x5) {
				return -1;
			}

			if (unitB.spectype & 0x5) {
				return 1;
			}
		}

		return getDistance(me, unitA) - getDistance(me, unitB);
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
	
	// Filter monsters based on classId, spectype and range
	getMob: function (classid, spectype, range, center) {
		var monsterList = [],
			monster = getUnit(1);

		if (range === undefined) {
			range = 25;
		}

		if (!center) {
			center = me;
		}

		switch (typeof classid) {
		case "number":
		case "string":
			monster = getUnit(1, classid);

			if (monster) {
				do {
					if (getDistance(center.x, center.y, monster.x, monster.y) <= range && (!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
						monsterList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			break;
		case "object":
			monster = getUnit(1);

			if (monster) {
				do {
					if (classid.indexOf(monster.classid) > -1 && getDistance(center.x, center.y, monster.x, monster.y) <= range && (!spectype || (monster.spectype & spectype)) && this.checkMonster(monster)) {
						monsterList.push(copyUnit(monster));
					}
				} while (monster.getNext());
			}

			break;
		}

		if (!monsterList.length) {
			return false;
		}

		return monsterList;
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
				//print("Skip Enchanted: " + unit.name);

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
		//this.elements = ["physical", "fire", "lightning", "magic", "cold", "poison", "none"];	//260816

		switch (skillId) {
		case 74: // Corpse Explosion
		case 144: // Concentrate
		case 147: // Frenzy
		case 273: // Minge Blast
		case 500: // Summoner
			return "physical";
		case 101: // Holy Bolt
			return "holybolt"; // no need to use this.elements array because it returns before going over the array
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
					//delay(me.ping + 1);

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
	
	// Open chests when clearing
	openChests: function (range, orgx, orgy) {	//260807
		//if (!Config.OpenChests) {
			//return false;
		//}

		if (orgx === undefined || orgy === undefined) {
			orgx = me.x;
			orgy = me.y;
		}

		var unit, chest,
			opened = false,
			list = [],
			ids = ["chest", "loose rock", "hidden stash", "loose boulder", "corpseonstick", "casket", "armorstand", "weaponrack", "barrel", "holeanim", "tomb2",
				"tomb3", "roguecorpse", "ratnest", "corpse", "goo pile", "largeurn", "urn", "chest3", "jug", "skeleton", "guardcorpse", "sarcophagus", "object2",
				"cocoon", "basket", "stash", "hollow log", "hungskeleton", "pillar", "skull pile", "jar3", "jar2", "jar1", "bonechest", "woodchestl",
				"woodchestr", "barrel wilderness", "burialchestr", "burialchestl", "explodingchest", "chestl", "chestr", "groundtomb", "icecavejar1", "icecavejar2",
				"icecavejar3", "icecavejar4", "deadperson", "deadperson2", "evilurn", "tomb1l", "tomb3l", "groundtombl"];	//eom
			//ids = ["chest", "chest3", "weaponrack", "armorstand"];//, "skullpile"

		unit = getUnit(2);

		if (unit) {
			do {
				if (unit.name && !unit.mode && getDistance(unit, orgx, orgy) <= range && ids.indexOf(unit.name.toLowerCase()) > -1 && !CollMap.checkColl(me, unit, 0x5)) {	//260806
					list.push(copyUnit(unit));
				}
			} while (unit.getNext());
		}

		while (list.length) {
			list.sort(Sort.units);
			
			if (Misc.openChest(list.shift())) {
				opened = true;
			}
		}
		
		if (opened) {
			Pickit.pickItems(range, orgx, orgy);
		}
		
		return true;
	}
};
