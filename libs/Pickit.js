/**
*	@filename	Pickit.js
*	@author		kolton
*	@desc		handle item pickup
*/

if (!isIncluded("tools/NTItemParser.dbl")) { include("tools/NTItemParser.dbl"); };
if (!isIncluded("libs/Storage.js")) { include("libs/Storage.js"); };

var Pickit = {
	beltSize: 1,
	ignoreLog: [4, 5, 6, 22, 41, 76, 77, 78, 79, 80, 81], // Ignored item types for item logging

	init: function (notify) {
		var i, filename,
			loaded = [];	// 260903
		
		for (i = 0; i < Config.PickitFiles.length; i += 1) {
			filename = "nips/" + Config.PickitFiles[i];

			if (NTIP.OpenFile(filename, notify)) {	// 260903
				loaded.push(Config.PickitFiles[i]);
			}
		}
		
		if (notify) {	// 260903
			print("Loaded ÿc9[" + loaded.join("] [") + "]");
		}

		NTIP.SortLists();	//260803
		
		this.beltSize = Storage.BeltSize();
	},

	// Returns:
	// -1 - Needs iding
	// 0 - Unwanted
	// 1 - NTIP wants
	// 2 - Cubing wants
	// 3 - Runeword wants
	// 4 - Pickup to sell (triggered when low on gold)
	// 5 - Socket gem for an equipped item	//261021
	checkItem: function (unit) {
		if (unit.classid === 549) {	//260805
			return {
				result: 1,
				tier: 0,
				merc: 0,
				qty: null,
				reason: "cube",
				line: null
			};
		}

		//261021 socket gem (ground or inventory only): held gems fill the targets in socketGems order, pick if a target still has an empty socket for it
		if (unit.itemType >= 96 && unit.itemType <= 102 && (unit.mode === 3 || unit.mode === 5 || (unit.mode === 0 && unit.location === 3)) && getBaseStat("items", unit.classid, "levelreq") <= me.charlvl) {	//261021 all gem types (Config.SocketGems picks)
			var t, g, k,
				targets = this.socketTargets(),
				held = (me.findItems(-1, 0, 3) || []).filter(function (gem) {
					return gem.gid !== unit.gid && gem.itemType >= 96 && gem.itemType <= 102 && getBaseStat("items", gem.classid, "levelreq") <= me.charlvl;	//261021 all gem types
				}).sort(function (a, b) {
					return a.gid - b.gid;
				});

			for (t = 0; t < targets.length; t += 1) {
				for (k = targets[t].empty; k > 0; k -= 1) {
					for (g = 0; g < held.length; g += 1) {
						if (targets[t].gems.indexOf(held[g].itemType) > -1 || targets[t].gems.indexOf(held[g].classid) > -1) {	//261021 itemType or classid
							break;
						}
					}

					if (g === held.length) {
						break;
					}

					held.splice(g, 1);
				}

				if (k > 0 && (targets[t].gems.indexOf(unit.itemType) > -1 || targets[t].gems.indexOf(unit.classid) > -1)) {	//261021 itemType or classid
					return {
						result: 5,
						line: null
					};
				}
			}
		}

		var result = NTIP.Evaluate(unit);
		
		if (Cubing.checkItem(unit, result.result)) {	//260805
			return {
				result: 2,
				line: null
			};
		}
		
		if (Runewords.checkItem(unit)) {
			return {
				result: 3,
				line: null
			};
		}

		// If total gold is less than 10k pick up anything worth 10 gold per
		// square to sell in town.
		if (result.result === 0 && Town.ignoredItemTypes.indexOf(unit.itemType) === -1 && me.gold < Config.LowGold && unit.itemType !== 39 && unit.itemType !== 74 && NTIP_QuestItems.indexOf(unit.classid) === -1) {	//261002 quest items: same list as NTIP (was classid !== 90 only)
			if (me.charlvl < 10 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 10) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 20 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 50) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 30 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 200) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 40 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 500) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 50 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 1000) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 60 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 2000) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 70 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 3000) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl < 80 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 4000) {
				return {
					result: 4,
					line: null
				};
			} else if (me.charlvl >= 80 && unit.getItemCost(1) / (unit.sizex * unit.sizey) >= 5000) {
				return {
					result: 4,
					line: null
				};
			}
		}

		return result;
	},

	pickItems: function (range, orgx, orgy) {	//260501
		var status, item, canFit,
			ref = null,
			pickList = [];

		if (range === undefined) {	//260501
			range = 25;	//260907
		}
		
		if (orgx && orgy) {
			ref = {x: orgx, y: orgy};
		}

		if (me.dead) {
			return false;
		}

		while (!me.idle) {
			delay(40);
		}

		item = getUnit(4);

		if (item) {
			do {
				if ((item.mode === 3 || item.mode === 5) && getDistance(ref ? ref : me, item) <= range) {	//260501	//261003 with orgx/orgy: around the given point only
					pickList.push(copyUnit(item));
				}
			} while (item.getNext());
		}

		while (pickList.length > 0) {
			if (me.dead) {
				return false;
			}

			pickList.sort(this.sortItems);

			// Check if the item unit is still valid and if it's on ground or being dropped
			if (copyUnit(pickList[0]).x !== undefined && (pickList[0].mode === 3 || pickList[0].mode === 5) &&
					(Pather.useTeleport() || me.inTown || !checkCollision(me, pickList[0], 0x1))) { // Don't pick items behind walls/obstacles when walking
				// Check if the item should be picked
				status = this.checkItem(pickList[0]);

				if (status.result && this.canPick(pickList[0])) {	// && Item.autoEquipCheck(pickList[0])) {
					// Override canFit for scrolls, potions and gold
					canFit = Storage.Inventory.CanFit(pickList[0]) || [4, 22, 76, 77, 78].indexOf(pickList[0].itemType) > -1;

					// Try to make room by selling items in town
					if (!canFit) {
						// Check if any of the current inventory items can be stashed or need to be identified and eventually sold to make room
						if (this.canMakeRoom()) {
							me.overhead("Trying to make room for " + pickList[0].name);	//eom

							// Go to town and do town chores
							if (Town.visitTown()) {
								// Recursive check after going to town. We need to remake item list because gids can change.
								// Called only if room can be made so it shouldn't error out or block anything.

								return this.pickItems(10);
							}

							// Town visit failed - abort
							me.overhead("Not enough room for " + pickList[0].name);	//eom

							return false;
						}

						me.overhead("Not enough room for " + pickList[0].name);	//eom
					}

					// Item can fit - pick it up
					if (canFit) {
						this.pickItem(pickList[0], status);	//260805
					}
				}
			}

			pickList.shift();
		}
		
		return true;
	},

	// Equipped tiered items with empty sockets (not runeword bases) and the gem types (itemType, any grade) for them, in socketing order	//261021 arms by item type (shield or weapon), not by slot
	socketTargets: function () {
		var i, j, item, gems, empty, base,
			list = [],
			slots = [1, 3, 4, 5];	// head, body, right arm, left arm

		for (i = 0; i < slots.length; i += 1) {
			item = me.getItem(-1, 1);

			if (item) {
				do {
					if (item.bodylocation === slots[i]) {
						break;
					}
				} while (item.getNext());
			}

			if (!item || item.bodylocation !== slots[i]) {
				continue;
			}

			if (slots[i] === 1) {	// helm (incl. primal helm, pelt, circlet)
				gems = Config.SocketGems.Head;	//261021 from Config
			} else if (slots[i] === 3) {	// armor
				gems = Config.SocketGems.Body;	//261021
			} else if ([2, 69, 70].indexOf(item.itemType) > -1) {	// shield, voodoo head, auric shield (either arm)
				gems = Config.SocketGems.Shield;	//261021
			} else {	// weapon in either arm (bows, staves, 2h weapons are in the left arm)	//261021 level 18 limit removed (runes later)
				gems = Config.SocketGems.Weapon;	//261021
			}

			if (!gems || !gems.length) {	//261021 no gems set for this part
				continue;
			}

			empty = item.getStat(194) - item.getItems().length;

			if (empty < 1 || NTIP.GetScore(item, "Tier") < 1) {
				continue;
			}

			base = false;

			for (j = 0; j < Config.Runewords.length; j += 1) {
				if (Config.Runewords[j][1] === item.classid && Runewords.getBase(Config.Runewords[j][0], item, (Config.Runewords[j][2] || 0))) {
					base = true;

					break;
				}
			}

			if (!base) {
				list.push({item: copyUnit(item), bodyLoc: slots[i], gems: gems, empty: empty});
			}
		}

		return list;
	},

	// Check if we can even free up the inventory
	canMakeRoom: function () {
		if (!Config.MakeRoom) {
			return false;
		}

		var i, result,	//261021
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				result = this.checkItem(items[i]).result;	//261021	//261022 make room trace removed

				switch (result) {
				case -1: // Item needs to be identified
					// For low level chars that can't actually get id scrolls -> prevent an infinite loop
					if (me.getStat(14) + me.getStat(15) < 100) {
						return false;
					}

					return true;
				case 0:	//261021 same check as clearInventory (drop/sell)
				case 4:	//261021 sold by clearInventory, stash space not needed
					if (Town.ignoredCheck(items[i])) {
						return true;
					}

					break;
				case 5:	//261021 socket gem: kept in inventory, can't make room
					Misc.trace("make room skip: " + items[i].name + " (result 5)");	//261021 check gems block room: remove once confirmed

					break;
				default: // Check if a kept item can be stashed
					if (Town.canStash(items[i])) {
						return true;
					}

					break;
				}
			}
		}

		return false;
	},

	pickItem: function (unit, status) {	//260805
		function ItemStats(unit) {
			this.ilvl = unit.ilvl;
			this.type = unit.itemType;
			this.classid = unit.classid;
			this.name = unit.name ? unit.name.replace(/ÿc[0-9!"+<:;.*]/g, "") : "";	//eom 260415
			//this.color = Pickit.itemColor(unit);	//261003 not read: the original's print color prefix (messages are me.overhead now)
			this.gold = unit.getStat(14);
			this.useTk = Config.UseTelekinesis && me.classid === 1 && me.getSkill(43, 1) && (this.type === 4 || this.type === 22 || (this.type > 75 && this.type < 82)) &&
						getDistance(me, unit) > 5 && getDistance(me, unit) < 20 && !checkCollision(me, unit, 0x4);
			this.picked = false;
		}

		var i, item, tick, gid, stats,
			cancelFlags = [0x01, 0x08, 0x14, 0x0c, 0x19, 0x1a],
			itemCount = me.itemcount;

		if (unit.gid) {
			gid = unit.gid;
			item = getUnit(4, -1, -1, gid);
		}

		if (!item) {
			return false;
		}

		for (i = 0; i < cancelFlags.length; i += 1) {
			if (getUIFlag(cancelFlags[i])) {
				delay(500);
				me.cancel(0);

				break;
			}
		}

		stats = new ItemStats(item);

MainLoop:
		for (i = 0; i < 3; i += 1) {
			if (!getUnit(4, -1, -1, gid)) {
				break MainLoop;
			}

			if (me.dead) {
				return false;
			}

			while (!me.idle) {
				delay(40);
			}

			if (item.mode !== 3 && item.mode !== 5) {
				break MainLoop;
			}
			
			if (item.x === undefined || item.y === undefined) {	//260926
				break MainLoop;
			}

			if (stats.useTk) {
				Skill.cast(43, 0, item);
			} else {
				if (getDistance(me, item) > 4 || checkCollision(me, item, 0x1)) {	//260907 fastpick removed
					if (Pather.useTeleport()) {
						Pather.moveToUnit(item);
					} else if (!Pather.moveTo(item.x, item.y, 0)) {
						continue MainLoop;
					}
				}

				Misc.click(0, 0, item);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 1000) {
				item = copyUnit(item);

				if (stats.classid === 523) {
					if (!item.getStat(14) || item.getStat(14) < stats.gold) {
						me.overhead("Picked up " + (item.getStat(14) ? (item.getStat(14) - stats.gold) : stats.gold) + " " + stats.name);	//eom

						return true;
					}
				}

				if (item.mode !== 3 && item.mode !== 5) {
					switch (stats.classid) {
					case 543: // Key
						me.overhead("Picked up " + stats.name + " (" + Town.checkKeys() + "/12)");	//eom

						return true;
					case 529: // Scroll of Town Portal
					case 530: // Scroll of Identify
						me.overhead("Picked up " + stats.name + " (" + Town.checkScrolls(stats.classid === 529 ? "tbk" : "ibk") + "/20)");	//eom

						return true;
					}

					break MainLoop;
				}

				delay(20);
			}

			// TK failed, disable it
			stats.useTk = false;
		}

		stats.picked = me.itemcount > itemCount || !!me.getItem(-1, -1, gid);

		if (stats.picked) {
			DataFile.updateStats("lastArea");

			switch (status && status.result) {	//260805
			case 1:
				me.overhead("Picked up " + stats.name + " (ilvl " + stats.ilvl + (status.line ? ") (" + status.line + ")" : ")"));	//260805

				if (this.ignoreLog.indexOf(stats.type) === -1) {
					Misc.itemLogger("Kept", item, status.line);	//260805
					
					if (!status.tier && !status.merc && item.classid !== 549 && item.classid !== 546) {	//260920
						Misc.logItem("Kept", item, status.line);
					}
				}

				break;
			case 2:
				me.overhead("Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)");	//eom
				
				Misc.itemLogger("Ingredient", item, me.findItems(item.classid, 0).length);
				Cubing.update();

				break;
			case 3:
				me.overhead("Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)");	//eom
				
				Misc.itemLogger("Ingredient", item, me.findItems(item.classid, 0).length);
				Runewords.update(stats.classid, gid);

				break;
			case 5:	//261021 socket gem
				me.overhead("Picked up " + stats.name + " (ilvl " + stats.ilvl + ")" + " (Ingredient)");

				Misc.itemLogger("Ingredient", item, "socket");

				break;

			default:
				break;
			}
		}

		return true;
	},

	itemQualityToName: function (quality) {
		var qualNames = ["", "lowquality", "normal", "superior", "magic", "set", "rare", "unique", "crafted"];

		return qualNames[quality];
	},

	itemColor: function (unit, type) {
		if (type === undefined) {
			type = true;
		}

		if (type) {
			switch (unit.itemType) {
			case 4: // gold
				return "ÿc4";
			case 74: // runes
				return "ÿc8";
			case 76: // healing potions
				return "ÿc1";
			case 77: // mana potions
				return "ÿc3";
			case 78: // juvs
				return "ÿc;";
			}
		}

		switch (unit.quality) {
		case 4: // magic
			return "ÿc3";
		case 5: // set
			return "ÿc2";
		case 6: // rare
			return "ÿc9";
		case 7: // unique
			return "ÿc4";
		case 8: // crafted
			return "ÿc8";
		}

		return "ÿc0";
	},

	canPick: function (unit) {
		var tome, charm, i, potion, needPots, buffers, pottype, myKey, key, equiQuiver, invQuiver;	//261014

		switch (unit.classid) {
		case 92: // Staff of Kings
		case 173: // Khalim's Flail
		case 521: // Viper Amulet
		case 546: // Jade Figurine
		case 549: // Cube
		case 551: // Mephisto's Soulstone
		case 552: // Book of Skill
		case 553: // Khalim's Eye
		case 554: // Khalim's Heart
		case 555: // Khalim's Brain
			if (me.getItem(unit.classid)) {
				return false;
			}

			break;
		}

		switch (unit.itemType) {
		case 4: // Gold
			if (me.getStat(14) === me.getStat(12) * 10000) { // Check current gold vs max capacity (cLvl*10000)
				return false; // Skip gold if full
			}

			break;
		case 5: // Arrows	//261020
			equiQuiver = me.getItem("aqv", 1);
			invQuiver = me.getItem("aqv", 0);
			if (equiQuiver && equiQuiver.getStat(70) + (invQuiver ? invQuiver.getStat(70) : 0) > 350) {
				return false;
			}
			
			break;
		case 6: // Bolts	//261020
			equiQuiver = me.getItem("cqv", 1);
			invQuiver = me.getItem("cqv", 0);
			if (equiQuiver && equiQuiver.getStat(70) + (invQuiver ? invQuiver.getStat(70) : 0) > 250) {
				return false;
			}
			
			break;
		case 22: // Scroll
			tome = me.getItem(unit.classid - 11, 0); // 518 - Tome of Town Portal or 519 - Tome of Identify, mode 0 - inventory/stash

			if (tome) {
				do {
					if (tome.location === 3 && tome.getStat(70) === 20) { // In inventory, contains 20 scrolls
						return false; // Skip a scroll if its tome is full
					}
				} while (tome.getNext());
			} else {
				return false; // Don't pick scrolls if there's no tome
			}

			break;
		case 41: // Key (new 26.1.2013)
			if (me.classid === 6) { // Assassins don't ever need keys
				return false;
			}

			myKey = me.getItem(543, 0);
			key = getUnit(4, -1, -1, unit.gid); // Passed argument isn't an actual unit, we need to get it

			if (myKey && key) {
				do {
					if (myKey.location === 3 && myKey.getStat(70) + key.getStat(70) > 12) {
						return false;
					}
				} while (myKey.getNext());
			}

			break;
		case 82: // Small Charm
		case 83: // Large Charm
		case 84: // Grand Charm
			if (unit.quality === 7) { // Unique
				charm = me.getItem(unit.classid, 0);

				if (charm) {
					do {
						if (charm.quality === 7) {
							return false; // Skip Gheed's Fortune, Hellfire Torch or Annihilus if we already have one
						}
					} while (charm.getNext());
				}
			}

			break;
		case 76: // Healing Potion
		case 77: // Mana Potion
		case 78: // Rejuvenation Potion
			needPots = 0;

			for (i = 0; i < 4; i += 1) {
				if (typeof unit.code === "string" && unit.code.indexOf(Config.BeltColumn[i]) > -1) {
					needPots += this.beltSize;
				}
			}

			potion = me.getItem(-1, 2);

			if (potion) {
				do {
					if (potion.itemType === unit.itemType) {
						needPots -= 1;
					}
				} while (potion.getNext());
			}

			if (needPots < 1 && this.checkBelt()) {
				buffers = ["HPBuffer", "MPBuffer", "RejuvBuffer"];

				for (i = 0; i < buffers.length; i += 1) {
					if (Config[buffers[i]]) {
						switch (buffers[i]) {
						case "HPBuffer":
							pottype = 76;

							break;
						case "MPBuffer":
							pottype = 77;

							break;
						case "RejuvBuffer":
							pottype = 78;

							break;
						}

						if (unit.itemType === pottype) {
							if (!Storage.Inventory.CanFit(unit)) {
								return false;
							}

							needPots = Config[buffers[i]];
							potion = me.getItem(-1, 0);

							if (potion) {
								do {
									if (potion.itemType === pottype && potion.location === 3) {
										needPots -= 1;
									}
								} while (potion.getNext());
							}
						}
					}
				}
			}

			if (needPots < 1) {
				potion = me.getItem();

				if (potion) {
					do {
						if (potion.itemType === unit.itemType && ((potion.mode === 0 && potion.location === 3) || potion.mode === 2)) {
							if (potion.classid < unit.classid) {
								potion.interact();
								needPots += 1;

								break;
							}
						}
					} while (potion.getNext());
				}
			}

			if (needPots < 1) {
				return false;
			}

			break;
		case undefined: // Yes, it does happen
			Misc.trace("undefined item (!?)");	//260930 print -> trace (diagnostic)

			return false;
		}

		return true;
	},

	checkBelt: function () {
		var check = 0,
			item = me.getItem(-1, 2);

		if (item) {
			do {
				if (item.x < 4) {
					check += 1;
				}
			} while (item.getNext());
		}

		return check === 4;
	},

	// Just sort by distance for general item pickup
	sortItems: function (unitA, unitB) {
		return getDistance(me, unitA) - getDistance(me, unitB);
	}
};