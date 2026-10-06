/**
*	@filename	ToolsThread.js
*	@author		kolton
*	@desc		several tools to help the player - potion use, chicken, Diablo clone stop, map reveal, quit with player
*/

js_strict(true);

include("tools/json2.js");
include("tools/NTItemParser.dbl");
include("tools/OOG.js");
include("libs/Attack.js");
include("libs/Cubing.js");
include("libs/Config.js");
include("libs/CollMap.js");
include("libs/Loader.js");
include("libs/Misc.js");
include("libs/Pickit.js");
include("libs/Pather.js");
include("libs/Precast.js");
include("libs/Prototypes.js");
include("libs/Runewords.js");
include("libs/Storage.js");
include("libs/Town.js");

function main() {
	var i, mercHP, ironGolem, merc,
		debugInfo = {area: 0, currScript: "no entry"},
		pingTimer = [],
		quitFlag = false,
		timerLastDrink = [];

	D2Bot.init();
	Config.init(false);
	Pickit.init(false);
	Attack.init();
	Storage.Init();
	Runewords.init();
	Cubing.init();

	for (i = 0; i < 5; i += 1) {
		timerLastDrink[i] = 0;
	}

	// Reset core chicken
	me.chickenhp = -1;
	me.chickenmp = -1;

	// General functions
	this.checkPing = function (print) {
		// Quit after at least 5 seconds in game
		if (getTickCount() - me.gamestarttime < 5000) {
			return false;
		}

		var i;

		for (i = 0; i < Config.PingQuit.length; i += 1) {
			if (Config.PingQuit[i].Ping > 0) {
				if (me.ping >= Config.PingQuit[i].Ping) {
					me.overhead("High Ping");

					if (pingTimer[i] === undefined || pingTimer[i] === 0) {
						pingTimer[i] = getTickCount();
					}

					if (getTickCount() - pingTimer[i] >= Config.PingQuit[i].Duration * 1000) {
						if (print) {
							D2Bot.printToConsole("High ping " + me.ping + "/" + Config.PingQuit[i].Ping + " (" + Misc.where() + ")", 9);	//260930 where it happened, same form as the other quit reasons
							Misc.trace("[Quit] High ping " + me.ping + "/" + Config.PingQuit[i].Ping);	//260930
						}

						scriptBroadcast("pingquit");

						return true;
					}
				} else {
					pingTimer[i] = 0;
				}
			}
		}

		return false;
	};

	this.getPotion = function (pottype, type) {
		var i,
			items = me.getItems();

		if (!items || items.length === 0) {
			return false;
		}

		// Get highest id = highest potion first
		items.sort(function (a, b) {
			return b.classid - a.classid;
		});

		for (i = 0; i < items.length; i += 1) {
			if (type < 3 && items[i].mode === 0 && items[i].location === 3 && items[i].itemType === pottype) {
				me.overhead("Drinking potion from inventory.");	//eom

				return copyUnit(items[i]);
			}

			if (items[i].mode === 2 && items[i].itemType === pottype) {
				return copyUnit(items[i]);
			}
		}

		return false;
	};

	this.togglePause = function () {
		var i,	script,
			scripts = [
				"threads/AutoBuildThread.js",
				"threads/PartyThread.js",
				"threads/TownChicken.js",
				"default.dbj"
			];
		
		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script) {
				if (script.running) {
					if (i === 0) { // default.dbj
						me.overhead("Pausing.");	//eom
					}

					script.pause();
				} else {
					if (i === 0) { // default.dbj
						me.overhead("Resuming.");	//eom
					}

					script.resume();
				}
			}
		}

		return true;
	};

	this.stopDefault = function () {	//260908
		var i, script,
			scripts = [
				"threads/AutoBuildThread.js",
				"threads/PartyThread.js",
				"threads/TownChicken.js",
				"default.dbj"
			];

		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script && script.running) {
				script.stop();
			}
		}

		return true;
	};

	this.exit = function () {
		var tick = getTickCount();	//261006

		this.stopDefault();
		Misc.trace("[Quit] stopDefault " + (getTickCount() - tick) + "ms");	//261006 time spent before quit() (deaths right after a chicken)
		quit();
	};

	// what was around at a chicken: my mode (teleport, attack, walk...) and the nearest live monsters (name, distance, spectype bits)	//261006
	this.nearMonsters = function () {
		var unit, list = [];

		try {
			unit = getUnit(1);

			if (unit) {
				do {
					if (unit.hp > 0 && unit.mode !== 0 && unit.mode !== 12 && unit.getStat(172) !== 2 && getDistance(me, unit) <= 30) {
						list.push({name: unit.name, d: Math.round(getDistance(me, unit)), s: unit.spectype});
					}
				} while (unit.getNext());
			}
		} catch (e) {
		}

		list.sort(function (a, b) {
			return a.d - b.d;
		});

		return " | mode:" + me.mode + " near:" + (list.slice(0, 5).map(function (m) {
			return m.name + " d" + m.d + " s" + m.s;
		}).join(", ") || "none") + (list.length > 5 ? " (+" + (list.length - 5) + ")" : "");
	};

	this.drinkPotion = function (type) {
		var pottype, potion,
			tNow = getTickCount();

		switch (type) {
		case 0:
		case 1:
			if ((timerLastDrink[type] && (tNow - timerLastDrink[type] < 1000)) || me.getState(type === 0 ? 100 : 106)) {
				return false;
			}

			break;
		case 2:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 300)) { // small delay for juvs just to prevent using more at once
				return false;
			}

			break;
		case 4:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 2000)) { // larger delay for juvs just to prevent using more at once, considering merc update rate
				return false;
			}

			break;
		default:
			if (timerLastDrink[type] && (tNow - timerLastDrink[type] < 8000)) {
				return false;
			}

			break;
		}

		if (me.mode === 0 || me.mode === 17 || me.mode === 18) { // mode 18 - can't drink while leaping/whirling etc.
			return false;
		}

		switch (type) {
		case 0:
		case 3:
			pottype = 76;

			break;
		case 1:
			pottype = 77;

			break;
		default:
			pottype = 78;

			break;
		}

		potion = this.getPotion(pottype, type);

		if (potion) {
			if (me.mode === 0 || me.mode === 17) {
				return false;
			}

			if (type < 3) {
				potion.interact();
			} else {
				try {
					clickItem(2, potion);
				} catch (e) {
					Misc.trace("Couldn't give the potion to merc.");	//260930 print -> trace (diagnostic)
				}
			}

			timerLastDrink[type] = getTickCount();

			return true;
		}

		return false;
	};

	this.getNearestMonster = function () {
		var gid, distance,
			monster = getUnit(1),
			range = 30;

		if (monster) {
			do {
				if (monster.hp > 0 && Attack.checkMonster(monster) && !monster.getParent()) {
					distance = getDistance(me, monster);

					if (distance < range) {
						range = distance;
						gid = monster.gid;
					}
				}
			} while (monster.getNext());
		}

		if (gid) {
			monster = getUnit(1, -1, -1, gid);
		} else {
			monster = false;
		}

		if (monster) {
			return " to " + monster.name;
		}

		return "";
	};

	this.getIronGolem = function () {
		var owner,
			golem = getUnit(1, 291);

		if (golem) {
			do {
				owner = golem.getParent();

				if (owner && owner.name === me.name) {
					return copyUnit(golem);
				}
			} while (golem.getNext());
		}

		return false;
	};

	this.getNearestPreset = function () {
		var i, unit, dist, id, roomX, roomY, absX, absY;	//260704

		unit = getPresetUnits(me.area);
		dist = 99;

		for (i = 0; i < unit.length; i += 1) {
			if (getDistance(me, unit[i].roomx * 5 + unit[i].x, unit[i].roomy * 5 + unit[i].y) < dist) {
				dist = getDistance(me, unit[i].roomx * 5 + unit[i].x, unit[i].roomy * 5 + unit[i].y);
				id = unit[i].type + " " + unit[i].id;
				roomX = unit[i].roomx * 5;
				roomY = unit[i].roomy * 5;
				absX = unit[i].roomx * 5 + unit[i].x;	//260630
				absY = unit[i].roomy * 5 + unit[i].y;	//260630
			}
		}

		return (id + " absX=" + absX + " absY=" + absY + " (" + roomX + "/" + roomY + ")") || "";  // 260630
	};

	// Missile range meter (temp). Pause first, press Numpad 5, then cast the skill once by hand toward open ground	//260930 temp
	// Tracks every new missile (test alone: sub-missiles such as Frozen Orb shards may be owned by the orb, not by me), and prints per missile type
	// the farthest point reached from where I stood and who owns it: me / another missile (its classid) / other	//260930
	this.meter = null;

	this.startMeter = function () {	//260930 temp
		var m = getUnit(3);

		this.meter = {old: {}, list: {}, armed: getTickCount(), lastNew: 0};

		if (m) {
			do {
				this.meter.old[m.gid] = true;	// missiles already flying are not mine to measure
			} while (m.getNext());
		}

		me.overhead("Meter: cast now");
		print("[MM] armed at " + me.x + "," + me.y + " me.gid:" + me.gid);
	};

	this.runMeter = function () {	//260930 temp
		var m, t, gid, cls, line, alive,
			now = getTickCount(),
			seen = {},
			byClass = {};

		m = getUnit(3);

		if (m) {
			do {
				seen[m.gid] = true;
				t = this.meter.list[m.gid];

				if (!t) {
					if (this.meter.old[m.gid]) {	//260930 no owner filter
						continue;
					}

					t = this.meter.list[m.gid] = {name: m.name, classid: m.classid, owner: m.owner, ownertype: m.ownertype, cx: me.x, cy: me.y, sx: m.x, sy: m.y, max: 0, born: now, last: now};
					this.meter.lastNew = now;
				}

				t.max = Math.max(t.max, getDistance(t.cx, t.cy, m.x, m.y));
				t.last = now;
			} while (m.getNext());
		}

		alive = 0;

		for (gid in this.meter.list) {
			if (this.meter.list.hasOwnProperty(gid) && seen[gid]) {
				alive += 1;
			}
		}

		// nothing cast within 15s: give up. Otherwise finish once every tracked missile is gone for 1s
		if (!this.meter.lastNew) {
			if (now - this.meter.armed > 15000) {
				print("[MM] no missile seen");
				me.overhead("Meter: nothing");
				this.meter = null;
			}

			return;
		}

		if (alive > 0 || now - this.meter.lastNew < 1000) {
			return;
		}

		for (gid in this.meter.list) {
			if (this.meter.list.hasOwnProperty(gid)) {
				t = this.meter.list[gid];
				cls = byClass[t.classid] || (byClass[t.classid] = {name: t.name, n: 0, max: 0, life: 0, spawn: 0, owners: {}});
				cls.owners[t.owner === me.gid ? "me" : (this.meter.list[t.owner] ? "missile " + this.meter.list[t.owner].classid : t.owner + "/type " + t.ownertype)] = true;
				cls.n += 1;
				cls.max = Math.max(cls.max, t.max);
				cls.life = Math.max(cls.life, t.last - t.born);
				cls.spawn = Math.max(cls.spawn, getDistance(t.cx, t.cy, t.sx, t.sy));
			}
		}

		for (cls in byClass) {
			if (byClass.hasOwnProperty(cls)) {
				t = byClass[cls];
				line = "[MM] " + t.name + " (classid " + cls + ") x" + t.n + " max:" + t.max.toFixed(1) + " life:" + t.life + "ms (~" + Math.round(t.life / 40) + " frames) spawn:" + t.spawn.toFixed(1) + " owner:" + Object.keys(t.owners).join(",");
				print(line);
				D2Bot.printToConsole(line);
			}
		}

		me.overhead("Meter: done");
		this.meter = null;
	};

	//260903
	this.keyEvent = function (key) {
		switch (key) {
		case 19: // Pause/Break - pause/resume
			this.togglePause();
			break;
			
		case 45: // Insert
			break;
		case 46: // Delete
			break;
		case 33: // Page Up
			break;
		case 34: // Page Down
			break;
		case 35: // End
			break;
			
		case 97: // Numpad 1 (temp)
			print(me.gameReady + " / " + me.dead + " / " + me.mode);
			break;
		case 98: // Numpad 2
			break;
		case 99: // Numpad 3
			break;
		case 100: // Numpad 4
			break;
		case 101: // Numpad 5 (missile range meter, temp)	//260930 temp
			this.startMeter();
			break;
		case 102: // Numpad 6
			break;
		case 103: // Numpad 7
			break;
		case 104: // Numpad 8
			break;
		case 105: // Numpad 9
			break;
		case 96: // Numpad 0 (quit)
			scriptBroadcast("quit");
			break;
			
		case 110: // Numpad . (reload)
			Messaging.sendToScript("threads/HeartBeat.js", "reload");
			break;
		case 111: // Numpad / (active script)
			var s = getScript();

			if (s) {
				do {
					print(s.name);
				} while (s.getNext());
			}
			break;
		case 106: // Numpad * (stat dump)
			showConsole();

			// me.getStat(105) will return real FCR from gear + Config.FCR from char cfg
			var realFCR = me.getStat(105) - Config.FCR;
			var realIAS = me.getStat(93) - Config.IAS;
			var realFBR = me.getStat(102) - Config.FBR;
			var realFHR = me.getStat(99) - Config.FHR;

			print("ÿc4MF: ÿc0" + me.getStat(80) + " ÿc4GF: ÿc0" + me.getStat(79) + " ÿc1FR: ÿc0" + me.getStat(39) +
				" ÿc3CR: ÿc0" + me.getStat(43) + " ÿc9LR: ÿc0" + me.getStat(41) + " ÿc2PR: ÿc0" + me.getStat(45) +
				"\n" +
				"FCR: " + realFCR + " IAS: " + realIAS + " FBR: " + realFBR +
				" FHR: " + realFHR + " FRW: " + me.getStat(96) +
				"\n" +
				"CB: " + me.getStat(136) + " DS: " + me.getStat(141) + " OW: " + me.getStat(135) +
				" ÿc1LL: ÿc0" + me.getStat(60) + " ÿc3ML: ÿc0" + me.getStat(62) +
				" DR: " + me.getStat(36) + "% + " + me.getStat(34) + " MDR: " + me.getStat(37) + "% + " + me.getStat(35) +
				"\n" +
				(me.getStat(153) > 0 ? "ÿc3Cannot be Frozenÿc1" : "" ));
			break;
		case 109: // Numpad - (print coords)
			print(me.x + "," + me.y);
			D2Bot.printToConsole(me.x + "," + me.y);
			break;
		case 107: // Numpad + (reveal level)
			me.overhead("Revealing " + Pather.getAreaName(me.area));
			revealLevel(true);

			break;
		}
	};

	this.scriptEvent = function (msg) {
		var obj;

		switch (msg) {
		case "quit":
			quitFlag = true;

			break;
		default:
			try {
				obj = JSON.parse(msg);
			} catch (e) {
				return;
			}

			if (obj) {
				if (obj.hasOwnProperty("useMerc")) { //260808
					Config.UseMerc = obj.useMerc;
				}

				if (obj.hasOwnProperty("useMercHP")) { //260808
					Config.UseMercHP = obj.useMercHP;
				}

				if (obj.hasOwnProperty("useMercRejuv")) { //260808
					Config.UseMercRejuv = obj.useMercRejuv;
				}
				
				if (obj.hasOwnProperty("lifeChicken")) { //260922
					Config.LifeChicken = obj.lifeChicken;
				}
				
				if (obj.hasOwnProperty("currScript")) {
					debugInfo.currScript = obj.currScript;
				}

				if (obj.hasOwnProperty("lastAction")) {
					debugInfo.lastAction = obj.lastAction;
				}

				DataFile.updateStats("debugInfo", JSON.stringify(debugInfo));
			}

			break;
		}
	};

	// Cache variables to prevent a bug where d2bs loses the reference to Config object
	Config = Misc.copy(Config);

	addEventListener("keyup", this.keyEvent);
	addEventListener("scriptmsg", this.scriptEvent);

	// Load Fastmod
	Packet.changeStat(105, Config.FCR);
	Packet.changeStat(99, Config.FHR);
	Packet.changeStat(102, Config.FBR);
	Packet.changeStat(93, Config.IAS);

	// Start
	while (true) {
		try {
			if (me.gameReady && !me.inTown) {
				if (Config.UseHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseHP / 100)) {
					this.drinkPotion(0);
				}

				if (Config.UseRejuvHP > 0 && me.hp < Math.floor(me.hpmax * Config.UseRejuvHP / 100)) {
					this.drinkPotion(2);
				}

				if (Config.LifeChicken > 0 && me.hp <= Math.floor(me.hpmax * Config.LifeChicken / 100)) {
					D2Bot.printToConsole("Life Chicken " + me.hp + "/" + me.hpmax + " (" + Misc.where() + ")", 9);	//260930
					Misc.trace("[Quit] Life Chicken " + me.hp + "/" + me.hpmax + this.nearMonsters());	//260930	//261006 mode and monsters around
					print("[Chicken] Life (" + me.hp + "/" + me.hpmax + ") area:" + me.area + " (" + me.x + "," + me.y + ")");	//eom 260415
					D2Bot.updateChickens();

					if (Config.LogExperience) {	//261001 the chickened profile also leaves its exp line
						Experience.log();
					}

					this.exit();

					break;
				}

				if (Config.UseMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseMP / 100)) {
					this.drinkPotion(1);
				}

				if (Config.UseRejuvMP > 0 && me.mp < Math.floor(me.mpmax * Config.UseRejuvMP / 100)) {
					this.drinkPotion(2);
				}

				if (Config.ManaChicken > 0 && me.mp <= Math.floor(me.mpmax * Config.ManaChicken / 100)) {
					D2Bot.printToConsole("Mana Chicken " + me.mp + "/" + me.mpmax + " (" + Misc.where() + ")", 9);	//260930
					Misc.trace("[Quit] Mana Chicken " + me.mp + "/" + me.mpmax);	//260930
					D2Bot.updateChickens();

					if (Config.LogExperience) {	//261001 the chickened profile also leaves its exp line
						Experience.log();
					}

					this.exit();

					break;
				}

				if (Config.IronGolemChicken > 0 && me.classid === 2) {
					if (!ironGolem || copyUnit(ironGolem).x === undefined) {
						ironGolem = this.getIronGolem();
					}

					if (ironGolem) {
						if (ironGolem.hp <= Math.floor(128 * Config.IronGolemChicken / 100)) { // ironGolem.hpmax is bugged with BO
							D2Bot.printToConsole("Iron Golem Chicken (" + Misc.where() + ")", 9);	//260930
							Misc.trace("[Quit] Iron Golem Chicken");	//260930
							D2Bot.updateChickens();

							if (Config.LogExperience) {	//261001 the chickened profile also leaves its exp line
								Experience.log();
							}

							this.exit();

							break;
						}
					}
				}

				if (Config.UseMerc) {
					mercHP = getMercHP();
					merc = me.getMerc();
					
					if (mercHP > 0 && merc && merc.mode !== 12) {
						if (mercHP < Config.MercChicken) {
							D2Bot.printToConsole("Merc Chicken (" + Misc.where() + ")", 9);	//260930
							Misc.trace("[Quit] Merc Chicken");	//260930
							D2Bot.updateChickens();

							if (Config.LogExperience) {	//261001 the chickened profile also leaves its exp line
								Experience.log();
							}

							this.exit();

							break;
						}

						if (mercHP < Config.UseMercHP) {
							this.drinkPotion(3);
						}

						if (mercHP < Config.UseMercRejuv) {
							this.drinkPotion(4);
						}
						
						if (Config.AutoEquip && merc.getStat(12) > Config.MercStat.lvl) {						
							Grant.updateStat(merc);
						}
					}
				}

				if (this.checkPing(true)) {
					quitFlag = true;
				}
			}
		} catch (e) {
			Misc.errorReport(e, "ToolsThread");

			quitFlag = true;
		}

		if (quitFlag) {

			if (Config.LogExperience) {
				Experience.log();
			}

			this.checkPing(false);
			this.exit();

			break;
		}

		if (this.meter) {	//260930 temp
			try {
				this.runMeter();
			} catch (e2) {
				print("[MM] " + e2);
				this.meter = null;
			}
		}

		if (debugInfo.area !== Pather.getAreaName(me.area)) {
			debugInfo.area = Pather.getAreaName(me.area);

			DataFile.updateStats("debugInfo", JSON.stringify(debugInfo));
		}

		delay(10);	//260515
	}

	return true;
}