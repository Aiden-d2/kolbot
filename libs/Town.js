/**
*	@filename	Town.js
*	@author		kolton
*	@desc		do town chores like buying, selling and gambling
*/

var NPC = {
	Akara: getLocaleString(2892).toLowerCase(),
	Gheed: getLocaleString(2891).toLowerCase(),
	Charsi: getLocaleString(2894).toLowerCase(),
	Kashya: getLocaleString(2893).toLowerCase(),
	Warriv: getLocaleString(2895).toLowerCase(),

	Fara: getLocaleString(3025).toLowerCase(),
	Drognan: getLocaleString(3023).toLowerCase(),
	Elzix: getLocaleString(3030).toLowerCase(),
	Greiz: getLocaleString(3031).toLowerCase(),
	Lysander: getLocaleString(3026).toLowerCase(),
	Jerhyn: getLocaleString(3027).toLowerCase(),
	Meshif: getLocaleString(3032).toLowerCase(),
	Atma: getLocaleString(3024).toLowerCase(),

	Ormus: getLocaleString(1011).toLowerCase(),
	Alkor: getLocaleString(1010).toLowerCase(),
	Hratli: getLocaleString(1009).toLowerCase(),
	Asheara: getLocaleString(1008).toLowerCase(),

	Jamella: getLocaleString(1016).toLowerCase(),
	Halbu: getLocaleString(1017).toLowerCase(),
	Tyrael: getLocaleString(1013).toLowerCase(),

	Malah: getLocaleString(22478).toLowerCase(),
	Anya: getLocaleString(22477).toLowerCase(),
	Larzuk: getLocaleString(22476).toLowerCase(),
	Qual_Kehk: getLocaleString(22480).toLowerCase(),
	Nihlathak: getLocaleString(22483).toLowerCase(),

	Cain: getLocaleString(2890).toLowerCase()
};

var Town = {
	telekinesis: true,
	sellTimer: getTickCount(), // shop speedup test

	tasks: [
		{Heal: NPC.Akara, Shop: NPC.Akara, Gamble: NPC.Gheed, Repair: NPC.Charsi, Merc: NPC.Kashya, Key: NPC.Akara},
		{Heal: NPC.Fara, Shop: NPC.Drognan, Gamble: NPC.Elzix, Repair: NPC.Fara, Merc: NPC.Greiz, Key: NPC.Lysander},
		{Heal: NPC.Ormus, Shop: NPC.Ormus, Gamble: NPC.Alkor, Repair: NPC.Hratli, Merc: NPC.Asheara, Key: NPC.Hratli},
		{Heal: NPC.Jamella, Shop: NPC.Jamella, Gamble: NPC.Jamella, Repair: NPC.Halbu, Merc: NPC.Tyrael, Key: NPC.Jamella},
		{Heal: NPC.Malah, Shop: NPC.Malah, Gamble: NPC.Anya, Repair: NPC.Larzuk, Merc: NPC.Qual_Kehk, Key: NPC.Malah}
	],

	ignoredItemTypes: [ // Items that won't be stashed
		5, // Arrows
		6, // Bolts
		18, // Book (Tome)
		22, // Scroll
		38, // Missile Potion
		41, // Key
		76, // Healing Potion
		77, // Mana Potion
		78, // Rejuvenation Potion
		79, // Stamina Potion
		80, // Antidote Potion
		81 // Thawing Potion
	],

	// Do town chores
	doChores: function (shopItems) {
		if (shopItems === undefined) {
			shopItems = false;
		}
		
		//print("[DBG] - doChores");
		
		if (!me.inTown) {
			this.goToTown();
		}

		//Attack.weaponSwitch(Attack.getPrimarySlot());
		//Merc.updateTiers();
		
		if (shopItems) {
			this.gamble();
			//this.buyKeys();
			this.reviveMerc();
		
			Equip.autoEquip();
			Grant.autoEquip();
			
			Cubing.doCubing();
			Runewords.makeRunewords();
		}
		
		this.clearBelt();
		this.removeUnwearableItems();
		this.heal();
		this.identify();
		this.clearInventory();
		this.fillTome(518);
		this.buyPotions(shopItems);
		this.repair(shopItems);
		
		var i,
			cancelFlags = [0x01, 0x02, 0x04, 0x08, 0x14, 0x16, 0x0c, 0x0f, 0x19, 0x1a];

		for (i = 0; i < cancelFlags.length; i += 1) {
			if (getUIFlag(cancelFlags[i])) {
				delay(me.ping * 2 + 500);
				me.cancel();

				break;
			}
		}

		me.cancel();

		Pickit.pickItems();
		
		Equip.autoEquip();
		Grant.autoEquip();
		
		this.stash();
		
		return true;
	},

	removeUnwearableItems: function () {	//260913 
		var i, item,
			list = [];

		item = me.findItem(null, 1, 1);

		if (item) {
			do {
				if (!Equip.canEquip(item) || (!(NTIP.GetScore(item, "Tier") > 0) && me.charlvl > 17)) {	//260815
					list.push(copyUnit(item));	//collect
				}
			} while (item.getNext());
		}

		if (!list.length) {
			return;
		}

		for (i = 0; i < list.length; i += 1) {	//drop
			item = list[i];

			//print("Removing an item I can no longer wear: " + item.name + ".");
			me.overhead("Removing an item I can no longer wear: " + item.name + ".");

			item.drop();
			delay(me.ping * 2 + 100);
		}

		Pickit.pickItems();
	},

	/*removeUnwearableItems: function () {	//eom
		var item = me.findItem(null, 1, 1);

		if (item) {
			do {
				//if (!Item.canEquip(item) || (!Item.hasTier(item) && me.charlvl > 17)) {
				if (!Equip.canEquip(item) || (!(NTIP.GetScore(item, "Tier") > 0) && me.charlvl > 17)) {	//260815
					//print("Removing an item I can no longer wear: " + item.name + ".");
					me.overhead("Removing an item I can no longer wear: " + item.name + ".");

					if (Storage.Inventory.CanFit(item)) {
						if (!Storage.Inventory.MoveTo(item)) {	//260817
							delay(me.ping * 2 + 100);
							Storage.Inventory.MoveTo(item);
							delay(1000);
							//Storage.Stash.MoveTo(item);
							me.cancel();
							while (me.itemoncursor) {
								delay(1000);
								while (getUIFlag(0x19) || getUIFlag(0x01)) {
									delay(1000);
									me.cancel();
								}
								Packet.dropItem(item);
								item.drop();
								delay(me.ping * 2 + 100);
							}
						}
						
						Pickit.pickItems();
					} else {
						item.toCursor();	//eom
						while (me.itemoncursor) {
							delay(1000);
							while(getUIFlag(0x19) || getUIFlag(0x01)) {
								delay(1000);
								me.cancel();
							}
							Packet.dropItem(item);
							item.drop();
							delay(me.ping * 2 + 100);
						}
						Pickit.pickItems();
					}
				}
			} while (item.getNext());
		}
	},*/

	checkQuestItems: function () {
		var i, npc, item;

		// golden bird stuff
		if (me.getItem(546)) {
			this.goToTown(3);
			this.move(NPC.Meshif);

			npc = getUnit(1, NPC.Meshif);

			if (npc) {
				npc.openMenu();
				me.cancel();
			}
		}

		if (me.getItem(547)) {
			this.goToTown(3);
			this.move(NPC.Alkor);

			npc = getUnit(1, NPC.Alkor);

			if (npc) {
				for (i = 0; i < 2; i += 1) {
					npc.openMenu();
					me.cancel();
				}
			}
		}

		if (me.getItem(545)) {
			item = me.getItem(545);

			if (item.location > 3) {
				this.openStash();
			}

			item.interact();
		}
	},

	// Start a task and return the NPC Unit
	initNPC: function (task, reason) {
		//print("initNPC: " + reason);	//eom
		me.overhead("initNPC: " + reason);	//eom

		var npc = getInteractedNPC();

		if (npc && npc.name.toLowerCase() !== this.tasks[me.act - 1][task]) {
			me.cancel();

			npc = null;
		}

		// Jamella gamble fix
		if (task === "Gamble" && npc && npc.name.toLowerCase() === NPC.Jamella) {
			me.cancel();

			npc = null;
		}

		if (!npc) {
			npc = getUnit(1, this.tasks[me.act - 1][task]);

			if (!npc) {
				this.move(this.tasks[me.act - 1][task]);

				npc = getUnit(1, this.tasks[me.act - 1][task]);
			}
		}

		if (!npc || npc.area !== me.area || (!getUIFlag(0x08) && !npc.openMenu())) {
			return false;
		}

		switch (task) {
		case "Shop":
		case "Repair":
		case "Gamble":
			if (!getUIFlag(0x0C) && !npc.startTrade(task)) {
				return false;
			}

			break;
		case "Key":
			if (!getUIFlag(0x0C) && !npc.startTrade(me.act === 3 ? "Repair" : "Shop")) {
				return false;
			}

			break;
		case "CainID":
			Misc.useMenu(0x0FB4);
			me.cancel();

			break;
		}

		return npc;
	},

	// Go to a town healer
	heal: function () {
		if (!this.needHealing()) {
			return true;
		}

		if (!this.initNPC("Heal", "heal")) {
			return false;
		}
		
		me.cancel();	//260908
		
		return true;
	},

	// Check if healing is needed, based on character config
	needHealing: function () {
		if (me.hp * 100 / me.hpmax <= Config.HealHP || me.mp * 100 / me.mpmax <= Config.HealMP) {
			return true;
		}

		// Status effects
		if (Config.HealStatus && (me.getState(2) || me.getState(9) || me.getState(61))) {
			return true;
		}

		return false;
	},

	buyPotions: function (shopItems) {
		if (me.gold < 1000) { // Ain't got money fo' dat shyt
			return false;
		}

		var i, j, npc, useShift, col, beltSize, pot,
			needPots = false,
			//needBuffer = true,
			needBuffer = false,	//260525
			buffer = {
				hp: 0,
				mp: 0
			};

		beltSize = Storage.BeltSize();
		col = this.checkColumns(beltSize);

		// HP/MP Buffer
		if (Config.HPBuffer > 0 || Config.MPBuffer > 0) {
			pot = me.getItem(-1, 0);

			if (pot) {
				do {
					if (pot.location === 3) {
						switch (pot.itemType) {
						case 76:
							buffer.hp += 1;

							break;
						case 77:
							buffer.mp += 1;

							break;
						}
					}
				} while (pot.getNext());
			}
		}

		// Check if we need to buy potions based on Config.MinColumn
		for (i = 0; i < 4; i += 1) {
			if (["hp", "mp"].indexOf(Config.BeltColumn[i]) > -1 && col[i] > (beltSize - Math.min(Config.MinColumn[i], beltSize))) {
				needPots = true;
			}
		}
		
		if (needPots && (buffer.mp < Config.MPBuffer || buffer.hp < Config.HPBuffer)) {	// 260525
			needBuffer = true;
		}
		
		// No columns to fill
		if (!needPots && !needBuffer) {
			if ((me.act === 4 || me.act === 5) && Config.MiniShopBot && shopItems) {	//eom
				npc = this.initNPC("Shop", "shopItems");
				
				if (!npc) {
					return false;
				}
				
				this.shopItems();
				
				return true;
			} else {
				return true;
			}
		}

		if (me.diff === 0 && Pather.accessToAct(4) && me.act < 4) {
			this.goToTown(4);
		}

		npc = this.initNPC("Shop", "buyPotions");

		if (!npc) {
			return false;
		}

		for (i = 0; i < 4; i += 1) {
			if (col[i] > 0) {
				useShift = this.shiftCheck(col, beltSize);
				pot = this.getPotion(npc, Config.BeltColumn[i]);

				if (pot) {
					//print("ÿc2column ÿc0" + i + "ÿc2 needs ÿc0" + col[i] + " ÿc2potions");

					// Shift+buy will trigger if there's no empty columns or if only the current column is empty
					if (useShift) {
						pot.buy(true);
						delay(me.ping * 2 + 200);
					} else {
						for (j = 0; j < col[i]; j += 1) {
							pot.buy(false);
						}
					}
				}
			}

			col = this.checkColumns(beltSize); // Re-initialize columns (needed because 1 shift-buy can fill multiple columns)
		}

		if (needBuffer && buffer.hp < Config.HPBuffer) {
			for (i = 0; i < Config.HPBuffer - buffer.hp; i += 1) {
				pot = this.getPotion(npc, "hp");

				if (Storage.Inventory.CanFit(pot)) {
					pot.buy(false);
				}
			}
		}

		if (needBuffer && buffer.mp < Config.MPBuffer) {
			for (i = 0; i < Config.MPBuffer - buffer.mp; i += 1) {
				pot = this.getPotion(npc, "mp");

				if (Storage.Inventory.CanFit(pot)) {
					pot.buy(false);
				}
			}
		}
		
		if ((me.act === 4 || me.act === 5) && Config.MiniShopBot && shopItems) {	//eom
			npc = this.initNPC("Shop", "shopItems");
			
			if (!npc) {
				return true;
			}
			
			this.shopItems();
			
		}
		
		return true;
	},

	// Check when to shift-buy potions
	shiftCheck: function (col, beltSize) {
		var i, fillType;

		for (i = 0; i < col.length; i += 1) {
			// Set type based on non-empty column
			if (!fillType && col[i] > 0 && col[i] < beltSize) {
				fillType = Config.BeltColumn[i];
			}

			if (col[i] >= beltSize) {
				switch (Config.BeltColumn[i]) {
					case "hp":
						// Set type based on empty column
						if (!fillType) {
							fillType = "hp";
						}

						// Can't shift+buy if we need to get differnt potion types
						if (fillType !== "hp") {
							return false;
						}

						break;
					case "mp":
						if (!fillType) {
							fillType = "mp";
						}

						if (fillType !== "mp") {
							return false;
						}

						break;
					case "rv": // Empty rejuv column = can't shift-buy
						return false;
				}
			}
		}

		return true;
	},

	// Return column status (needed potions in each column)
	checkColumns: function (beltSize) {
		var col = [beltSize, beltSize, beltSize, beltSize],
			pot = me.getItem(-1, 2); // Mode 2 = in belt

		if (!pot) { // No potions
			return col;
		}

		do {
			col[pot.x % 4] -= 1;
		} while (pot.getNext());

		return col;
	},

	// Get the highest potion from current npc
	getPotion: function (npc, type) {
		var i, result;

		if (!type) {
			return false;
		}

		if (type === "hp" || type === "mp") {
			for (i = 5; i > 0; i -= 1) {
				result = npc.getItem(type + i);

				if (result) {
					return result;
				}
			}
		}

		return false;
	},
	
	myPotion: function (type) {
		var item,
			hp = 0,
			mp = 0,
			rv = 0;

		if (!type) {
			return false;
		}
		
		item = me.findItem(-1, 0, 3);
		
		if (item) {
			do {
				switch (item.itemType) {
					case 76: // Healing
						hp += 1;
						break;
					case 77: // Mana
						mp += 1;
						break;
					case 78: // Rejuvenation
						rv += 1;
						break;
				}
			} while (item.getNext());
		}
		
		switch (type) {
			case "hp":
				return hp;
			case "mp":
				return mp;
			case "rv":
				return rv;
		}

		return false;
	},
	
	fillTome: function (code) {
		if (this.checkScrolls(code) >= 5) {
			return true;
		}

		var scroll, tome, myTP, tp,
			buffer = {
				tp: 0
			},
			npc = this.initNPC("Shop", "fillTome");

		if (!npc) {
			return false;
		}

		delay(me.ping * 2 + 200);	//eom
		
		if (me.gold < 400 && code === 518 && !me.findItem(518, 0, 3)) {

			myTP = me.getItem(-1, 0);

			if (myTP) {
				do {
					if (myTP.location === 3) {
						switch (myTP.itemType) {
						case 22:
							buffer.tp += 1;

							break;
						}
					}
				} while (myTP.getNext());
			}
			
			if (buffer.tp >= 3) {
				return true;
			}
			
			tp = npc.getItem(529);
			
			try {
				tp.buy();
			} catch (e1) {
				print(e1);

				return false;
			}
			
			return true;
		}

		if (code === 518 && !me.findItem(518, 0, 3)) {
			tome = npc.getItem(518);

			if (tome && Storage.Inventory.CanFit(tome)) {
				try {
					tome.buy();
					delay(me.ping * 2 + 200);
				} catch (e1) {
					print(e1);

					// Couldn't buy the tome, don't spam the scrolls
					return false;
				}
			} else {
				return false;
			}
		}

		scroll = npc.getItem(code === 518 ? 529 : 530);

		if (!scroll) {
			return false;
		}

		try {
			scroll.buy(true);
			delay(me.ping * 2 + 200);
		} catch (e2) {
			print(e2.message);

			return false;
		}

		return true;
	},

	checkScrolls: function (id) {
		var tome = me.findItem(id, 0, 3);

		if (!tome) {
			switch (id) {
			case 519:
			case "ibk":
				return 20; // Ignore missing ID tome
			case 518:
			case "tbk":
				return 0; // Force TP tome check
			}
		}

		return tome.getStat(70);
	},

	identify: function () {
		var i, item, tome, scroll, npc, list, timer, tpTome, result,
			tpTomePos = {};

		list = Storage.Inventory.Compare(Config.Inventory);

		if (!list) {
			return false;
		}

		// Avoid unnecessary NPC visits
		for (i = 0; i < list.length; i += 1) {
			// Only unid items or sellable junk (low level) should trigger a NPC visit
			//if ((!list[i].getFlag(0x10) || Config.LowGold > 0) && ([-1, 4].indexOf(Pickit.checkItem(list[i]).result) > -1 || (!list[i].getFlag(0x10) && Item.hasTier(list[i])))) {
			if ((!list[i].getFlag(0x10) || Config.LowGold > 0) && ([-1, 4].indexOf(Pickit.checkItem(list[i]).result) > -1)) {	//260814
				break;
			}
		}

		if (i === list.length) {
			return false;
		}

		npc = this.initNPC("Shop", "identify");

		if (!npc) {
			return false;
		}

		tome = me.findItem(530, 0, 3) || me.findItem(519, 0, 3);	//260715

		if (tome && tome.getStat(70) < list.length) {
			this.fillTome(519);
		}

MainLoop:
		while (list.length > 0) {
			item = list.shift();

			if (!item.getFlag(0x10) && item.location === 3 && this.ignoredItemTypes.indexOf(item.itemType) === -1) {
				result = Pickit.checkItem(item);

				switch (result.result) {
				// Items for gold, will sell magics, etc. w/o id, but at low levels
				// magics are often not worth iding.
				case 4:	// 260821 below lvl 20 the Pickit.js:74-83 cost gate is under the 80g id scroll price -> sell unid as before
					if (me.charlvl < 25) {
						Misc.itemLogger("Sold", item);
						//Misc.logItem("Sold", item, result.line);
						item.sell();
						//delay(me.ping * 2 + 100);	//eom
						delay(me.ping * 2);	//260411

						break;
					}

					// falls through
				case -1:
					if (tome) {
						this.identifyItem(item, tome);
					} else {
						scroll = npc.getItem(530);

						if (scroll) {
							if (!Storage.Inventory.CanFit(scroll)) {
								tpTome = me.findItem(518, 0, 3);

								if (tpTome) {
									tpTomePos = {x: tpTome.x, y: tpTome.y};

									tpTome.sell();
									//delay(me.ping * 2 + 100);	//eom
									delay(me.ping * 2);	//260411
								}
							}

							//delay(me.ping * 2 + 100);	//eom
							delay(me.ping * 2);	//260411

							if (Storage.Inventory.CanFit(scroll)) {
								scroll.buy();
							}
						}

						scroll = me.findItem(530, 0, 3);

						if (!scroll) {
							break MainLoop;
						}

						this.identifyItem(item, scroll);
					}

					result = Pickit.checkItem(item);

					switch (result.result) {
					case 1:
						Misc.itemLogger("Kept", item, result.line);	//eom 260412
						
						if (!result.tier && !result.merc) {	//260805
							Misc.logItem("Kept", item, result.line);
						}
						
						break;
					case -1: // unidentified
						break;
					case 2: // cubing
						//Misc.itemLogger("Kept", item, "Cubing-Town");
						Misc.itemLogger("Ingredient", item, me.findItems(item.classid, 0).length);	//eom
						//Misc.logItem("Kept", item, result.line);
						Cubing.update();

						break;
					case 3: // runeword (doesn't trigger normally)
						Misc.itemLogger("Ingredient", item, me.findItems(item.classid, 0).length);	//eom
						
						break;
					default:
						//print("Sold " + item.name + " " + result.line);
						Misc.itemLogger("Sold", item, result.line);
						//Misc.logItem("Sold", item, result.line);
						item.sell();
						//delay(me.ping * 2 + 100);	//eom
						delay(me.ping * 2);	//260411
						
						break;
					}

					break;
				}
			}
		}

		return true;
	},

	identifyItem: function (unit, tome) {
		if (Config.PacketShopping) {
			return Packet.identifyItem(unit, tome);
		}

		var i, tick;

		if (!unit || unit.getFlag(0x10)) {
			return false;
		}

		this.sellTimer = getTickCount(); // shop speedup test

CursorLoop:
		for (i = 0; i < 3; i += 1) {
			clickItem(1, tome);

			tick = getTickCount();

			while (getTickCount() - tick < 500) {
				if (getCursorType() === 6) {
					break CursorLoop;
				}

				//delay(10);
				delay(me.ping);	//260411
			}
		}

		if (getCursorType() !== 6) {
			return false;
		}

		//delay(270);
		delay(me.ping * 2 + 200);	//260411

		for (i = 0; i < 3; i += 1) {
			if (getCursorType() === 6) {
				clickItem(0, unit);
			}

			tick = getTickCount();

			while (getTickCount() - tick < 500) {
				if (unit.getFlag(0x10)) {
					//delay(50);
					delay(me.ping * 2);	//260411

					return true;
				}

				//delay(10);
				delay(me.ping);	//260411
			}

			//delay(300);
			delay(me.ping * 2 + 200);	//260411
		}

		return false;
	},

	shopItems: function () {
		if (!Config.MiniShopBot && me.diff > 0) {
			return true;
		}
		
		var i, item, result,
			items = [],
			npc = getInteractedNPC();

		if (!npc || !npc.itemcount) {
			return false;
		}

		item = npc.getItem();

		if (!item) {
			return false;
		}

		//print("ÿc4MiniShopBotÿc0: Scanning " + npc.itemcount + " items.");	//eom
		me.overhead("MiniShopBot: Scanning " + npc.itemcount + " items.");	//eom

		do {
			if (this.ignoredItemTypes.indexOf(item.itemType) === -1) {
				items.push(copyUnit(item));
			}
		} while (item.getNext());

		for (i = 0; i < items.length; i += 1) {
			if (me.diff === 0 && items[i].itemType !== 19) {	//260712 norm belt shopping
				continue;
			}
			
			result = Pickit.checkItem(items[i]);
			
			if (result.result === 1) {	// && Item.autoEquipCheck(items[i])) {	//eom
				try {
					if (Storage.Inventory.CanFit(items[i]) && me.getStat(14) + me.getStat(15) >= items[i].getItemCost(0)) {
						Misc.itemLogger("Shopped", items[i], result.line);	//eom 260412
						
						//if (!Item.hasTier(items[i]) && !Merc.hasTier(items[i])) {
						//if (!(result.tier > 0 || result.merc > 0)) {	//260814
						if (!result.tier && !result.merc) {	//260911
							Misc.logItem("Shopped", items[i], result.line);
						}
						
						if (me.diff === 0 && items[i].itemType === 19) {	//260712 norm belt shopping, buy only one
							print("Shopped " + items[i].name + " " + result.result + " " + result.tier + " " + result.line);	//260805
							items[i].buy();
							return true;
						}
						
						items[i].buy();
						
						delay(me.ping + 100);	//eom
					}
				} catch (e) {
					print(e);
				}
			}
			//delay(200);
			delay(10);	//eom
		}

		return true;
	},
	
	gambleIds: [],

	gamble: function () {
		if (!this.needGamble() || Config.GambleItems.length === 0) {
			return true;
		}

		var i, item, items, npc, newItem, result,
			list = [];

		if (this.gambleIds.length === 0) {
			// change text to classid
			for (i = 0; i < Config.GambleItems.length; i += 1) {
				if (isNaN(Config.GambleItems[i])) {
					if (NTIPAliasClassID.hasOwnProperty(Config.GambleItems[i].replace(/\s+/g, "").toLowerCase())) {
						this.gambleIds.push(NTIPAliasClassID[Config.GambleItems[i].replace(/\s+/g, "").toLowerCase()]);
					} else {
						Misc.errorReport("ÿc1Invalid gamble entry:ÿc0 " + Config.GambleItems[i]);
					}
				} else {
					this.gambleIds.push(Config.GambleItems[i]);
				}
			}
		}

		if (this.gambleIds.length === 0) {
			return true;
		}

		// Fuck Alkor
		if (me.act === 3) {
			return true;
		}

		npc = this.initNPC("Gamble", "gamble");

		if (!npc) {
			return false;
		}

		items = me.findItems(-1, 0, 3);

		while (items && items.length > 0) {
			list.push(items.shift().gid);
		}

		while (me.gold >= Config.GambleGoldStop) {
			if (!getInteractedNPC()) {
				npc.startTrade("Gamble");
			}

			item = npc.getItem();
			items = [];

			if (item) {
				do {
					if (this.gambleIds.indexOf(item.classid) > -1) {
						items.push(copyUnit(item));
					}
				} while (item.getNext());

				for (i = 0; i < items.length; i += 1) {
					if (!Storage.Inventory.CanFit(items[i])) {
						return false;
					}

					me.overhead("Buy: " + items[i].name);
					items[i].buy(false, true);

					newItem = this.getGambledItem(list);

					if (newItem) {
						result = Pickit.checkItem(newItem);	//eom
						
						switch (result.result) {
						case 1:
							Misc.itemLogger("Gambled", newItem, result.line);	//eom 260412
								
							//if (!Item.hasTier(newItem) && !Merc.hasTier(newItem)) {
							//if (!(result.tier > 0 || result.merc > 0)) {	//260814
							if (!result.tier && !result.merc) {	//260911
								Misc.logItem("Gambled", newItem, result.line);
							}
							
							list.push(newItem.gid);

							break;
						case 2:
							list.push(newItem.gid);
							Cubing.update();

							break;
						default:
							Misc.itemLogger("Sold", newItem, "Gambling");
							me.overhead("Sell: " + newItem.name);
							newItem.sell();

							if (!Config.PacketShopping) {
								delay(500);
							}

							break;
						}
					}
				}
			}

			me.cancel();
		}
		
		//this.move("portalspot");
		
		return true;
	},

	needGamble: function () {
		return Config.Gamble && me.gold >= Config.GambleGoldStart;
	},

	getGambledItem: function (list) {
		var i, j,
			items = me.findItems(-1, 0, 3);

		for (i = 0; i < items.length; i += 1) {
			if (list.indexOf(items[i].gid) === -1) {
				for (j = 0; j < 3; j += 1) {
					if (items[i].getFlag(0x10)) {
						break;
					}

					delay(100);
				}

				return items[i];
			}
		}

		return false;
	},

	buyKeys: function () {
		if (!this.wantKeys()) {
			return true;
		}

		// Fuck Hratli
		if (me.act === 3) {
			return true;
		}

		var key,
			npc = this.initNPC("Key", "buyKeys");

		if (!npc) {
			return false;
		}

		key = npc.getItem("key");

		if (!key) {
			return false;
		}

		try {
			key.buy(true);
		} catch (e) {
			print(e.message);

			return false;
		}

		return true;
	},

	checkKeys: function () {
		if (!Config.OpenChests || me.classid === 6 || me.gold < 540 || (!me.getItem("key") && !Storage.Inventory.CanFit({sizex: 1, sizey: 1}))) {
			return 12;
		}

		var i,
			count = 0,
			key = me.findItems(543, 0, 3);

		if (key) {
			for (i = 0; i < key.length; i += 1) {
				count += key[i].getStat(70);
			}
		}

		return count;
	},

	needKeys: function () {
		return this.checkKeys() <= 0;
	},

	wantKeys: function () {
		return this.checkKeys() <= 6;
	},

	repair: function (shopItems) {
		var i, quiver, myQuiver, npc, repairAction, bowCheck;
		
		// Fuck Hratli
		if (me.act === 3) {
			return true;
		}

		repairAction = this.needRepair();

		//if (force && repairAction.indexOf("repair") === -1) {
			//repairAction.push("repair");
		//}

		if (!repairAction || !repairAction.length) {
			if (((me.act !== 1 && me.diff === 0) || ((me.act === 4 || me.act === 5) && Config.MiniShopBot)) && shopItems) {	//260712
				npc = this.initNPC("Repair", "shopItems");
				
				if (!npc) {
					return false;
				}
				
				this.shopItems();
				
				return true;
			} else {
				return true;
			}
		}

		for (i = 0; i < repairAction.length; i += 1) {
			switch (repairAction[i]) {
			case "repair":
				npc = this.initNPC("Repair", "repair");

				if (!npc) {
					return false;
				}

				me.repair();

				break;
			case "buyQuiver":
				bowCheck = Attack.usingBow();

				if (bowCheck) {
					if (bowCheck === "bow") {
						quiver = "aqv"; // Arrows
					} else {
						quiver = "cqv"; // Bolts
					}

					myQuiver = me.getItem(quiver, 1);

					if (myQuiver) {
						myQuiver.drop();
					}

					npc = this.initNPC("Repair", "repair");

					if (!npc) {
						return false;
					}

					quiver = npc.getItem(quiver);

					if (quiver) {
						quiver.buy();
					}
				}

				break;
			}
		}
		
		if (((me.act !== 1 && me.diff === 0) || ((me.act === 4 || me.act === 5) && Config.MiniShopBot)) && shopItems) {	//260712
			npc = this.initNPC("Repair", "shopItems");
			
			if (!npc) {
				return true;
			}
			
			this.shopItems();
		}
		
		if (me.classid === 0 && me.act === 1) {
			npc = this.initNPC("Repair", "shopItems");
			
			if (!npc) {
				return true;
			}
			
			this.shopItems();
		}
		
		return true;
	},

	needRepair: function () {
		var quiver, bowCheck, quantity,
			repairAction = [],
			canAfford = me.gold >= me.getRepairCost();

		// Arrow/Bolt check
		bowCheck = Attack.usingBow();

		if (bowCheck) {
			switch (bowCheck) {
			case "bow":
				quiver = me.getItem("aqv", 1); // Equipped arrow quiver

				break;
			case "crossbow":
				quiver = me.getItem("cqv", 1); // Equipped bolt quiver

				break;
			}

			if (!quiver) { // Out of arrows/bolts
				repairAction.push("buyQuiver");
			} else {
				quantity = quiver.getStat(70);

				if (typeof quantity === "number" && quantity * 100 / getBaseStat("items", quiver.classid, "maxstack") <= Config.RepairPercent) {
					repairAction.push("buyQuiver");
				}
			}
		}

		// Repair durability/quantity/charges
		if (canAfford) {
			if (this.getItemsForRepair(Config.RepairPercent, true).length > 0) {
				repairAction.push("repair");
			}
		} else {
			if (me.inTown) {
				//print("ÿc4Town: ÿc1Can't afford repairs.");	//eom
				me.overhead("Town: Can't afford repairs.");	//eom
			}
		}

		return repairAction;
	},

	getItemsForRepair: function (repairPercent, chargedItems) {
		var i, charge, quantity, durability, spare,
			itemList = [],
			item = me.getItem(-1, 1),
			stack = 0;
		
		if (me.classid === 0) {	//260702
			spare = me.getItem(-1, 0);
			
			if (spare) {
				do {
					if (!spare.getStat(152)) {
						switch (spare.classid) {
							case 47:
							case 140:
								stack += spare.getStat(70);
								
								break;
						}
					}
				} while (spare.getNext());
			}
			
			//print(stack);
		}
		
		if (item) {
			do {
				if (!item.getFlag(0x400000)) { // Skip ethereal items
					if (!item.getStat(152)) { // Skip indestructible items
						switch (item.itemType) {
						// Quantity check
						case 42: // Throwing knives
						case 43: // Throwing axes
						case 44: // Javelins
						case 87: // Amazon javelins
							quantity = item.getStat(70) + stack;
							//print(quantity);

							if (typeof quantity === "number" && quantity * 100 / (getBaseStat("items", item.classid, "maxstack") + item.getStat(254)) <= repairPercent) { // Stat 254 = increased stack size
								itemList.push(copyUnit(item));
							}

							break;
						// Durability check
						default:
							durability = item.getStat(72);

							if (typeof durability === "number" && durability * 100 / item.getStat(73) <= repairPercent) {
								itemList.push(copyUnit(item));
							}

							break;
						}
					}

					if (chargedItems) {
						// Charged item check
						charge = item.getStat(-2)[204];

						if (typeof (charge) === "object") {
							if (charge instanceof Array) {
								for (i = 0; i < charge.length; i += 1) {
									if (charge[i] !== undefined && charge[i].hasOwnProperty("charges") && charge[i].charges * 100 / charge[i].maxcharges <= repairPercent) {
										itemList.push(copyUnit(item));
									}
								}
							} else if (charge.charges * 100 / charge.maxcharges <= repairPercent) {
								itemList.push(copyUnit(item));
							}
						}
					}
				}
			} while (item.getNext());
		}

		return itemList;
	},

	reviveMerc: function () {
		if (!this.needMerc()) {
			return false;	//260727
		}

		// Fuck Aheara
		if (me.act === 3) {
			return false;	//260727
		}

		var i, tick, dialog, lines,
			//tick = getTickCount(),	//260820
			preArea = me.area,
			npc = this.initNPC("Merc", "reviveMerc");

		if (!npc) {
			return false;
		}

MainLoop:
		for (i = 0; i < 3; i += 1) {
			tick = getTickCount();	//260820
			dialog = getDialogLines();

			for (lines = 0; lines < dialog.length; lines += 1) {
				if (dialog[lines].text.match(":", "gi")) {
					dialog[lines].handler();
					delay(Math.max(750, me.ping * 2));
				}

				// "You do not have enough gold for that."
				if (dialog[lines].text.match(getLocaleString(3362), "gi")) {
					return false;
				}
			}

			while (getTickCount() - tick < 2000) {
				if (!!me.getMerc()) {
					delay(Math.max(750, me.ping * 2));

					break MainLoop;
				}

				delay(200);
			}
		}

		Attack.checkInfinity();

		if (!!me.getMerc()) {
			if (Config.MercWatch) { // Cast BO on merc so he doesn't just die again
				//print("MercWatch precast");	//eom
				me.overhead("MercWatch precast");	//eom
				Pather.useWaypoint("random");
				Precast.doPrecast(true);
				Pather.useWaypoint(preArea);
			}

			Grant.updateTiers();  //260804
			
			return true;
		}
		
		return false;
	},

	needMerc: function () {
		var i, merc;

		if (me.gametype === 0 || !Config.UseMerc || me.gold < me.mercrevivecost) { // gametype 0 = classic
			//print("[needMerc] gametype=" + me.gametype + " config=" + Config.UseMerc + " gold=" + me.gold + " cost=" + me.mercrevivecost);	//260817
			return false;
		}

		// me.getMerc() might return null if called right after taking a portal, that's why there's retry attempts
		for (i = 0; i < 3; i += 1) {
			merc = me.getMerc();

			if (merc && merc.mode !== 0 && merc.mode !== 12) {
				//print("[needMerc] merc=" + !!merc + " mode=" + merc.mode);	//260817
				return false;
			}

			delay(me.ping * 2 + 500);	//260817
		}

		if (!me.mercrevivecost) { // In case we never had a merc and Config.UseMerc is still set to true for some odd reason
			//print("[needMerc] gold=" + me.gold + " cost=" + me.mercrevivecost);	//260817
			return false;
		}

		return true;
	},

	canStash: function (item) {
		var ignoredClassids = [47, 140, 91, 174, 549]; // Some quest items that have to be in inventory or equipped

		if (this.ignoredItemTypes.indexOf(item.itemType) > -1 || ignoredClassids.indexOf(item.classid) > -1 || !Storage.Stash.CanFit(item)) {
			return false;
		}

		return true;
	},

	stash: function (stashGold) {
		if (stashGold === undefined) {
			stashGold = true;
		}

		if (!this.needStash()) {
			return true;
		}
		
		//print("stash");
		
		me.cancel();

		var i, result, keep,
			items = Storage.Inventory.Compare(Config.Inventory);

		if (items) {
			for (i = 0; i < items.length; i += 1) {
				if (this.canStash(items[i])) {
					result = Pickit.checkItem(items[i]);
					
					keep = Cubing.keepItem(items[i]) || Runewords.keepItem(items[i]);	//eom 260404

					//if (result) {	// && !Item.hasTier(items[i])) {	//eom
					//if (keep || (result.result > 0 && result.result < 4 && !(result.tier > 0 || result.merc > 0))) {	//260814
					if (keep || (result.result > 0 && result.result < 4)) {	//260821
						//Misc.logItem("Stashed", items[i], result.line);
						Misc.itemLogger("Stashed", items[i], result.line);	//eom 260412
						Storage.Stash.MoveTo(items[i]);
					}
				}
			}
		}

		// Stash gold
		if (stashGold) {
			if (me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5 && this.openStash()) {
				//print("stash gold @ " + me.getStat(14) + " / " + Config.StashGold);
				gold(me.getStat(14), 3);
				delay(1000); // allow UI to initialize
				me.cancel();
			}
		}

		return true;
	},

	needStash: function () {
		if (Config.StashGold && me.getStat(14) >= Config.StashGold && me.getStat(15) < 25e5) {
			//print("need stash gold @ " + me.getStat(14) + " / " + Config.StashGold);
			return true;
		}

		var i,
			items = Storage.Inventory.Compare(Config.Inventory);
		
		if (items) {	//eom
			for (i = 0; i < items.length; i += 1) {
				if (Storage.Stash.CanFit(items[i])) {
					//print("true: " + items[i].name);
					return true;
				}
			}
		}
		
		return false;
	},

	openStash: function () {
		var i, tick, stash;

		if (getUIFlag(0x1a) && !Cubing.closeCube()) {
			return false;
		}

		if (getUIFlag(0x19)) {
			return true;
		}

		for (i = 0; i < 5; i += 1) {
			me.cancel();

			if (this.move("stash")) {
				stash = getUnit(2, 267);

				if (stash) {
					Misc.click(0, 0, stash);
					//stash.interact();

					tick = getTickCount();

					while (getTickCount() - tick < 1000) {
						if (getUIFlag(0x19)) {
							delay(100 + me.ping * 2); // allow UI to initialize

							return true;
						}

						delay(100);
					}
				}
			}

			Packet.flash(me.gid);
		}

		return false;
	},

	getCorpse: function () {
		var i, corpse, gid, coord,
			corpseList = [],
			timer = getTickCount();

		// No equipped items - high chance of dying in last game, force retries
		if (!me.getItem(-1, 1)) {
			for (i = 0; i < 5; i += 1) {
				corpse = getUnit(0, me.name, 17);

				if (corpse) {
					break;
				}

				delay(500);
			}
		} else {
			corpse = getUnit(0, me.name, 17);
		}

		if (!corpse) {
			return true;
		}

		do {
			if (corpse.dead && corpse.name === me.name && (getDistance(me.x, me.y, corpse.x, corpse.y) <= 20 || me.inTown)) {
				corpseList.push(copyUnit(corpse));
			}
		} while (corpse.getNext());

		while (corpseList.length > 0) {
			if (me.dead) {
				return false;
			}

			gid = corpseList[0].gid;

			Pather.moveToUnit(corpseList[0]);
			Misc.click(0, 0, corpseList[0]);
			delay(500);

			if (getTickCount() - timer > 3000) {
				coord = CollMap.getRandCoordinate(me.x, -1, 1, me.y, -1, 1, 4);
				Pather.moveTo(coord.x, coord.y);
			}

			if (getTickCount() - timer > 30000) {
				D2Bot.printToConsole("Failed to get corpse, stopping.", 9);
				D2Bot.stop();
			}

			if (!getUnit(0, -1, -1, gid)) {
				corpseList.shift();
			}
		}

		if (me.gametype === 0) {
			this.checkShard();
		}

		return true;
	},

	checkShard: function () {
		var shard,
			check = {left: false, right: false},
			item = me.getItem("bld", 0);

		if (item) {
			do {
				if (item.location === 3 && item.quality === 7) {
					shard = copyUnit(item);

					break;
				}
			} while (item.getNext());
		}

		if (!shard) {
			return true;
		}

		item = me.getItem(-1, 1);

		if (item) {
			do {
				if (item.bodylocation === 4) {
					check.right = true;
				}

				if (item.bodylocation === 5) {
					check.left = true;
				}
			} while (item.getNext());
		}

		if (!check.right) {
			shard.toCursor();

			while (me.itemoncursor) {
				clickItem(0, 4);
				delay(500);
			}
		} else if (!check.left) {
			shard.toCursor();

			while (me.itemoncursor) {
				clickItem(0, 5);
				delay(500);
			}
		}

		return true;
	},

	clearBelt: function () {
		while (!me.gameReady) {
			delay(100);
		}

		var item = me.getItem(-1, 2),
			clearList = [],
			bufferList = [];	// 260822

		if (item) {
			do {
				switch (item.itemType) {
				case 76: // Healing
					/*if (Config.BeltColumn[item.x % 4] !== "hp") {
						if (Config.HPBuffer > this.myPotion("hp")) {
							Storage.Inventory.MoveTo(item);
							print("move buffer: " + item.name);
							delay(me.ping * 2 + 1000);
						} else {
							clearList.push(copyUnit(item));
						}
					}*/
					
					if (Config.BeltColumn[item.x % 4] !== "hp") {	//260822
						bufferList.push(copyUnit(item));
					}

					break;
				case 77: // Mana
					/*if (Config.BeltColumn[item.x % 4] !== "mp") {
						if (Config.MPBuffer > this.myPotion("mp")) {
							Storage.Inventory.MoveTo(item);
							print("move buffer: " + item.name);
							delay(me.ping * 2 + 1000);
						} else {
							clearList.push(copyUnit(item));
						}
					}*/
					
					//260822 normal only - drop mana tiers the current act's vendor no longer sells
					if (me.diff === 0 && ((me.act === 2 && item.code === "mp1") || (me.act === 3 && (item.code === "mp1" || item.code === "mp2")))) {
						clearList.push(copyUnit(item));

						break;
					}

					if (Config.BeltColumn[item.x % 4] !== "mp") {
						bufferList.push(copyUnit(item));
					}

					break;
				case 78: // Rejuvenation
					/*if (Config.BeltColumn[item.x % 4] !== "rv") {
						if (Config.RejuvBuffer > this.myPotion("rv")) {
							Storage.Inventory.MoveTo(item);
							print("move buffer: " + item.name);
							delay(me.ping * 2 + 1000);
						} else {
							clearList.push(copyUnit(item));
						}
					}*/
					
					if (Config.BeltColumn[item.x % 4] !== "rv") {	//260822
						bufferList.push(copyUnit(item));
					}

					break;
				}
			} while (item.getNext());
			
			//260822 process after iteration - MoveTo mutates the unit and breaks item.getNext()
			while (bufferList.length > 0) {
				item = bufferList.shift();

				if (item.itemType === 76 ? Config.HPBuffer > this.myPotion("hp") : item.itemType === 77 ? Config.MPBuffer > this.myPotion("mp") : Config.RejuvBuffer > this.myPotion("rv")) {
					Storage.Inventory.MoveTo(item);
					print("move buffer: " + item.name);
					delay(me.ping * 2 + 1000);
				} else {
					clearList.push(item);
				}
			}
			
			while (clearList.length > 0) {
				clearList.shift().drop();	//260901
				delay(200);
			}
		}

		return true;
	},

	clearScrolls: function () {
		var i,
			items = me.getItems();

		for (i = 0; !!items && i < items.length; i += 1) {
			if (items[i].location === 3 && items[i].mode === 0 && items[i].itemType === 22) {
				if (getUIFlag(0xC) || (Config.PacketShopping && getInteractedNPC() && getInteractedNPC().itemcount > 0)) { // Might as well sell the item if already in shop
					//print("clearInventory sell " + items[i].name);	//eom
					me.overhead("clearInventory sell " + items[i].name);	//eom
					
					Misc.itemLogger("Sold", items[i]);
					items[i].sell();
				} else {
					Misc.itemLogger("Dropped", items[i], "clearScrolls");
					items[i].drop();
				}
			}
		}

		return true;
	},

	ignoredCheck: function (item) {
		var ignoredTypes = [18, 22, 76, 77, 78]; // tomes, potions
		var ignoredClassids = [
			524, // Scroll of Inifuss
			525, // Key to Cairn Stones
			89,  // Horadric Malus
			549, // Horadric Cube
			92,  // Staff of Kings
			521, // Viper Amulet
			91,  // Horadric Staff
			552, // Book of Skill
			545, // Potion of Life
			546, // A Jade Figurine
			547, // The Golden Bird
			548, // Lam Esen's Tome
			553, // Khalim's Eye
			554, // Khalim's Heart
			555, // Khalim's Brain
			173, // Khalim's Flail
			174, // Khalim's Will
			644, // Malah's Potion
			646  // Scroll of Resistance
		];

		if (ignoredTypes.indexOf(item.itemType) > -1) return false;
		if (!Config.OpenChests && item.itemType === 41) return false; // Keys only when OpenChests
		if (ignoredClassids.indexOf(item.classid) > -1) return false;
		if (item.code === "529" && !me.findItem(518, 0, 3)) return false;
		if (item.code === "530" && !me.findItem(519, 0, 3)) return false;
		if (Cubing.keepItem(item)) return false;
		if (Runewords.keepItem(item)) return false;
		if ((!me.getQuest(7, 0) && item.classid === 514) || (!me.getQuest(13, 0) && item.classid === 517)) return false;	//eom 260412

		return true;
	},

	clearInventory: function () {
		var i, col, result, item, beltSize,
			items = [];

		//this.checkQuestItems(); // only golden bird quest for now

		// Return potions to belt
		item = me.getItem(-1, 0);

		if (item) {
			do {
				if (item.location === 3 && [76, 77, 78].indexOf(item.itemType) > -1) {
					items.push(copyUnit(item));
				}
			} while (item.getNext());

			beltSize = Storage.BeltSize();
			col = this.checkColumns(beltSize);

			// Sort from HP to RV
			items.sort(function (a, b) {
				return a.itemType - b.itemType;
			});

			while (items.length) {
				item = items.shift();

				for (i = 0; i < 4; i += 1) {
					if (item.code.indexOf(Config.BeltColumn[i]) > -1 && col[i] > 0) {
						if (col[i] === beltSize) { // Pick up the potion and put it in belt if the column is empty
							if (item.toCursor()) {
								clickItem(0, i, 0, 2);
							}
						} else {
							clickItem(2, item.x, item.y, item.location); // Shift-click potion
						}

						delay(me.ping * 2 + 200);

						col = this.checkColumns(beltSize);
					}
				}
			}
		}

		// Cleanup remaining potions
		item = me.getItem(-1, 0);

		if (item) {
			items = [
				[], // array for hp
				[], // array for mp
				[]  // array for rv	//260901
			];

			do {
				if (item.itemType === 76) {
					items[0].push(copyUnit(item));
				}

				if (item.itemType === 77) {
					items[1].push(copyUnit(item));
				}
				
				if (item.itemType === 78) {	//260901
					if (item.classid === 515) {
						items[2].unshift(copyUnit(item));
					} else {
						items[2].push(copyUnit(item));
					}
				}
			} while (item.getNext());

			// Cleanup healing potions
			while (items[0].length > Config.HPBuffer) {
				//items[0].shift().interact();
				items[0].shift().drop();	//eom
				delay(200 + me.ping * 2);
			}

			// Cleanup mana potions
			while (items[1].length > Config.MPBuffer) {
				//items[1].shift().interact();
				items[1].shift().drop();	//eom
				delay(200 + me.ping * 2);
			}
			
			// Cleanup rejuv potions	//260901
			while (items[2].length > Config.RejuvBuffer) {
				items[2].shift().drop();
				delay(200 + me.ping * 2);
			}
		}

		// eom stash clear
		items = Storage.Stash.Compare(Config.Stash);
		
		for (i = 0; !!items && i < items.length; i += 1) {
			if (this.ignoredCheck(items[i])) {
				result = Pickit.checkItem(items[i]).result;
				
				switch (result) {
				case 0: // Drop item
					if ((getUIFlag(0x0C) || getUIFlag(0x08)) && (items[i].getItemCost(1) <= 1 || items[i].itemType === 39)) { // Quest items and such
						me.cancel();
						delay(me.ping * 2 + 200);
					}
					
					//print("moved to inventory to drop " + items[i].name);	//eom
					me.overhead("moved to inventory to drop " + items[i].name);	//eom
					
					Storage.Inventory.MoveTo(items[i]);

					break;
				case 4: // Sell item
					try {
						//print("moved to inventory to sell " + items[i].name);	//eom
						me.overhead("moved to inventory to sell " + items[i].name);	//eom
						
						Storage.Inventory.MoveTo(items[i]);
						delay(me.ping * 2 + 200);
					} catch (e) {
						print(e);
					}

					break;
				}
			}
		}
		
		// Any leftover items from a failed ID (crashed game, disconnect etc.)
		items = Storage.Inventory.Compare(Config.Inventory);
		
		for (i = 0; !!items && i < items.length; i += 1) {
			if (this.ignoredCheck(items[i])) {

				result = Pickit.checkItem(items[i]).result;

				switch (result) {
				case 0: // Drop item
					if ((getUIFlag(0x0C) || getUIFlag(0x08)) && (items[i].getItemCost(1) <= 1 || items[i].itemType === 39)) {
						me.cancel();
						delay(me.ping * 2 + 200);
					}

					if (getUIFlag(0xC) || (Config.PacketShopping && getInteractedNPC() && getInteractedNPC().itemcount > 0)) {
						me.overhead("clearInventory sell " + items[i].name);
						//print("clearInventory sell " + items[i].name);
						Misc.itemLogger("Sold", items[i]);
						items[i].sell();
					} else {
						me.overhead("clearInventory drop " + items[i].name);
						//print("clearInventory drop " + items[i].name);
						Misc.itemLogger("Dropped", items[i]);
						items[i].drop();
					}

					break;
				case 4: // Sell item
					try {
						me.overhead("LowGold sell " + items[i].name);
						//print("LowGold sell " + items[i].name);
						this.initNPC("Shop", "clearInventory");
						Misc.itemLogger("Sold", items[i]);
						items[i].sell();
						delay(me.ping * 2 + 200);
					} catch (e) {
						print(e);
					}

					break;
				}
			}
		}

		return true;
	},

	act : [{}, {}, {}, {}, {}],

	initialize: function () {
		//print("Initialize town " + me.act);

		switch (me.act) {
		case 1:
			var fire,
				wp = getPresetUnit(1, 2, 119),
				fireUnit = getPresetUnit(1, 2, 39);

			if (!fireUnit) {
				return false;
			}

			fire = [fireUnit.roomx * 5 + fireUnit.x, fireUnit.roomy * 5 + fireUnit.y];

			this.act[0].spot = {};
			this.act[0].spot.stash = [fire[0] - 7, fire[1] - 12];
			this.act[0].spot[NPC.Warriv] = [fire[0] - 5, fire[1] - 2];
			this.act[0].spot[NPC.Cain] = [fire[0] + 6, fire[1] - 5];
			this.act[0].spot[NPC.Kashya] = [fire[0] + 14, fire[1] - 4];
			this.act[0].spot[NPC.Akara] = [fire[0] + 56, fire[1] - 30];
			this.act[0].spot[NPC.Charsi] = [fire[0] - 39, fire[1] - 25];
			this.act[0].spot[NPC.Gheed] = [fire[0] - 34, fire[1] + 36];
			this.act[0].spot.portalspot = [fire[0] + 10, fire[1] + 18];
			this.act[0].spot.waypoint = [wp.roomx * 5 + wp.x, wp.roomy * 5 + wp.y];
			this.act[0].initialized = true;

			break;
		case 2:
			this.act[1].spot = {};
			this.act[1].spot[NPC.Fara] = [5124, 5082];
			this.act[1].spot[NPC.Cain] = [5124, 5082];
			this.act[1].spot[NPC.Lysander] = [5118, 5104];
			this.act[1].spot[NPC.Greiz] = [5033, 5053];
			this.act[1].spot[NPC.Elzix] = [5032, 5102];
			this.act[1].spot.palace = [5088, 5153];
			this.act[1].spot.sewers = [5221, 5181];
			this.act[1].spot[NPC.Meshif] = [5205, 5058];
			this.act[1].spot[NPC.Drognan] = [5097, 5035];
			this.act[1].spot[NPC.Atma] = [5137, 5060];
			this.act[1].spot[NPC.Warriv] = [5152, 5201];
			this.act[1].spot.portalspot = [5168, 5060];
			this.act[1].spot.stash = [5124, 5076];
			this.act[1].spot.waypoint = [5070, 5083];
			this.act[1].initialized = true;

			break;
		case 3:
			this.act[2].spot = {};
			this.act[2].spot[NPC.Meshif] = [5118, 5168];
			this.act[2].spot[NPC.Hratli] = [5223, 5048, 5127, 5172];
			this.act[2].spot[NPC.Ormus] = [5129, 5093];
			this.act[2].spot[NPC.Asheara] = [5043, 5093];
			this.act[2].spot[NPC.Alkor] = [5083, 5016];
			this.act[2].spot[NPC.Cain] = [5148, 5066];
			this.act[2].spot.stash = [5144, 5059];
			this.act[2].spot.portalspot = [5150, 5063];
			this.act[2].spot.waypoint = [5158, 5050];
			this.act[2].initialized = true;

			break;
		case 4:
			this.act[3].spot = {};
			this.act[3].spot[NPC.Cain] = [5027, 5027];
			this.act[3].spot[NPC.Halbu] = [5089, 5031];
			this.act[3].spot[NPC.Tyrael] = [5027, 5027];
			this.act[3].spot[NPC.Jamella] = [5088, 5054];
			this.act[3].spot.stash = [5022, 5040];
			this.act[3].spot.portalspot = [5045, 5042];
			this.act[3].spot.waypoint = [5043, 5018];
			this.act[3].initialized = true;

			break;
		case 5:
			this.act[4].spot = {};
			this.act[4].spot.portalspot = [5098, 5019];
			this.act[4].spot.stash = [5129, 5061];
			this.act[4].spot[NPC.Larzuk] = [5141, 5045];
			this.act[4].spot[NPC.Malah] = [5078, 5029];
			this.act[4].spot[NPC.Cain] = [5119, 5061];
			this.act[4].spot[NPC.Qual_Kehk] = [5066, 5083];
			this.act[4].spot[NPC.Anya] = [5112, 5120];
			this.act[4].spot.portal = [5118, 5120];
			this.act[4].spot.waypoint = [5113, 5068];
			this.act[4].spot[NPC.Nihlathak] = [5071, 5111];
			this.act[4].initialized = true;

			break;
		}

		return true;
	},

	move: function (spot) {
		if (!me.inTown) {
			this.goToTown();
		}

		var i, path;

		if (!this.act[me.act - 1].initialized) {
			this.initialize();
		}

		// Act 3 figurine optimization - eom
		if (me.act === 3 && spot === "figurine") {
			path = [5073, 5040, 5083, 5093];

			for (i = 0; i < path.length; i += 2) {
				Pather.walkTo(path[i], path[i + 1]);
			}

			return true;
		}

		// Act 5 wp->portalspot override - ActMap.cpp crash
		if (me.act === 5 && spot === "portalspot" && getDistance(me.x, me.y, 5113, 5068) <= 8) {
			path = [5113, 5068, 5108, 5051, 5106, 5046, 5104, 5041, 5102, 5027, 5098, 5018];

			for (i = 0; i < path.length; i += 2) {
				Pather.walkTo(path[i], path[i + 1]);
			}

			return true;
		}

		for (i = 0; i < 3; i += 1) {
			if (this.moveToSpot(spot)) {
				return true;
			}

			Packet.flash(me.gid);
		}

		return false;
	},

	moveToSpot: function (spot) {
		var i, path, townSpot,
			longRange = (spot === "waypoint"),
			tick = getTickCount();

		if (!this.act[me.act - 1].hasOwnProperty("spot") || !this.act[me.act - 1].spot.hasOwnProperty(spot)) {
			return false;
		}

		if (typeof (this.act[me.act - 1].spot[spot]) === "object") {
			townSpot = this.act[me.act - 1].spot[spot];
		} else {
			return false;
		}

		if (longRange) {
			path = getPath(me.area, townSpot[0], townSpot[1], me.x, me.y, 1, 8);

			if (path && path[1]) {
				townSpot = [path[1].x, path[1].y];
			}
		}

		for (i = 0; i < townSpot.length; i += 2) {
			//print("moveToSpot: " + spot + " from " + me.x + ", " + me.y);

			if (getDistance(me, townSpot[i], townSpot[i + 1]) > 2) {
				Pather.moveTo(townSpot[i], townSpot[i + 1], 3, false, true);
			}
			
			switch (spot) {
			case "stash":
				if (!!getUnit(2, 267)) {
					return true;
				}

				break;
			case "palace":
				if (!!getUnit(1, NPC.Jerhyn)) {
					return true;
				}

				break;
			case "portalspot":
			case "sewers":
				if (getDistance(me, townSpot[i], townSpot[i + 1]) < 10) {
					return true;
				}

				break;
			case "waypoint":
				if (!!getUnit(2, "waypoint")) {
					return true;
				}

				break;
			case "alkor":
				if (!!getUnit(1, spot)) {	//eom
					return true;
				}
				
				if (getTickCount() - tick > 90000) {
					D2Bot.printToConsole("alkor error", 9);
					quit();
				}

				break;
			default:
				if (!!getUnit(1, spot)) {
					return true;
				}

				break;
			}
		}

		return false;
	},

	goToTown: function (act) {	//eom
		var towns = [1, 40, 75, 103, 109];

		//print("[DBG] - goToTown");
		
		if (!me.inTown) {
			if (!Pather.makePortal()) {
				throw new Error("Town.goToTown: Failed to make TP");
				//return false;	//eom
			}

			if (!Pather.usePortal(null, me.name)) {
				throw new Error("Town.goToTown: Failed to take TP");
				//return false;	//eom
			}
		}

		if (act === undefined) {
			return true;
		}

		if (act < 1 || act > 5) {
			throw new Error("Town.goToTown: Invalid act");
			//return false;	//eom
		}

		if (act !== me.act) {
			try {
				Pather.useWaypoint(towns[act - 1]);
			} catch (WPError) {
				throw new Error("Town.goToTown: Failed use WP");
				//return false;	//eom
			}
		}

		return true;
	},

	visitTown: function () {

		//print("[DBG] - visitTown");
		
		if (me.inTown) {
			//this.doChores();	//prevent recursion	//260821
			//this.move("stash");	//prevent recursion	//260821
			
			Equip.autoEquip();	//260821
			Grant.autoEquip();
			this.stash();

			return true;
		}

		var preArea = me.area,
			preAct = me.act;

		try { // not an essential function -> handle thrown errors
			this.goToTown();
		} catch (e) {
			return false;
		}

		this.doChores();
		
		if (me.act !== preAct) {
			this.goToTown(preAct);
		}

		this.move("portalspot");

		if (!Pather.usePortal(preArea, me.name)) { // this part is essential
			throw new Error("Town.visitTown: Failed to go back from town");
		}

		/*if (Config.PublicMode) {
			Pather.makePortal();
		}*/

		return true;
	}
};