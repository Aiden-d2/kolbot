/*
*	@filename	AutoSmurf.js
*	@author		JeanMax/SiC-666/Dark-f
*	@desc		Questing, Leveling & Smurfing
*	@version	YYYY/MM/DD = 2026/08/09 (EOM edition)
*/
/*
	Special thanks to : Alogwe, Imba, Kolton, Larryw, Noah, QQValpen, Sam, YGM
	For a specific thank, search for your <3
	Let me know if I forgot some!
*/

function AutoSmurf() {
//SETTING
// -------- Normal Difficulty -------------
	var tristLvl = 15,
		teleLvl = 18,
		tombsLvl = 25,
		diaLvl = 37,
		baalLvl = 46,
// -------- Nightmare Difficulty ----------
		diaLvlnm = 67,
		baalLvlnm = 71,
		mercLvl = me.charlvl > baalLvlnm - 2,
// -------- Hell Difficulty ----------

//---------------------------------------be-sure-of-what-you-edit-under-this-line--------------------------------------------//
		Leader = false,
		Boer = false,
		myPos = Team.Profiles.slice().reverse().indexOf(me.profile) % 4,
		myX = (myPos === 0 || myPos === 1) ? 5 : -5,
		myY = (myPos === 1 || myPos === 2) ? 5 : -5,
		
		imReady,
		readyCount = 0,
		teamReady,
		
		doneChores = false,
		hireMerc = false,
		
		pickGold = 0,
		giveGold = 0,
		
		farmingON = false,
		
		essA = false,	//260828
		essM = false,	//260828
		
		keyT = false,	//260809
		keyH = false,	//260809
		keyD = false,	//260809
		
		okCount = 0,
		teamOk = false,
		teamCount = 0,
		
		syncBO = false,
		syncWP = false,
		
		BOing = false,
		BOed = false,
		BOCount = 0,
		BOReady = false,
		
		myBuff = false,
		buffCount = 0,
		teamBuff = false,
		
		tpReady = false,
		earlyReturn = false,
		
		cube = false,
		getCube = false,
		amulet = false,
		summoner = false,
		tombs = false,
		radament = false,
		duriel = false,
		
		figurine = false,
		leaderFigurine = false,
		travincal = false,
		mephisto = false,
		takeRedPortal = false,
		
		msgNode = false,	//260903 for cowlevel
		msgLeader = false,	//for cowlevel
		msgFollower = {};	//for cowlevel

//SYNCING
	this.checkRole = function () { // Checks Config settings to determine role.
		if (Team.Leader === me.profile) {
			Leader = true;
			me.overhead("I am the Leader");
		} else if (Team.Boer === me.profile) {
			Boer = true;
			me.overhead("I am the Boer");
		} else {
			me.overhead("I am a Follower");
		}
	};

	this.preparation = function () {
		if (Leader && me.getStat(13) === 0) {
			D2Bot.printToConsole("=== START ===", 7);
		}
		
		// Check and use quest items that might be left over from the previous game
		if (me.findItem(552)) {
			clickItem(1, me.findItem(552));
			D2Bot.printToConsole("!!! BOOK !!!", 8);
			delay(me.ping * 2 + 500);
		}
		
		if (me.findItem(545)) {
			clickItem(1, me.findItem(545));
			D2Bot.printToConsole("!!! POTION !!!", 8);
			delay(me.ping * 2 + 500);
		}
		
		if (me.findItem(646)) {
			clickItem(1, me.findItem(646));
			D2Bot.printToConsole("!!! SCROLL !!!", 8);
			delay(me.ping * 2 + 500);
		}

		if (!Config.Tiered && me.diff > 0) {
			Config.MiniShopBot = true;
			print("shop: " + Config.MiniShopBot);
		}
	
		if (me.diff === 2 && !farmingON && !Config.Tiered) {
			farmingON = true;
			Messaging.sendToList(Team.Profiles, "farmingON");
			print("farmingON");
			me.overhead("farmingON");
		}
		
		if (Config.Tiered) {
			print("tiered: " + Config.Tiered);
		}
		
		if (mercLvl) {
			Config.UseMerc = true;
			Config.UseMercHP = 70;
			scriptBroadcast(JSON.stringify({useMerc: Config.UseMerc, useMercHP: Config.UseMercHP, useMercRejuv: Config.UseMercRejuv})); //260808
			print("UseMerc: " + Config.UseMerc + " HP: " + Config.UseMercHP);
		}
		
		if (Leader && me.charlvl > 17 && me.gold < 5000) {
			Messaging.sendToList(Team.Profiles, "giveGold");
			pickGold = 1;
		}
	};

	this.toggle = function () {	//260810
		if (!Leader && !me.findItem(549) && me.area === 40) { // Don't have cube, am in Act 2.
			Messaging.sendToList(Team.Profiles, "getCube");
		}
		
		if (me.findItem(546) || me.findItem(547)) { // Have A Jade Figurine, The Golden Bird. Tell the Teleporting Sorc so she gets us to process it.
			Messaging.sendToList(Team.Profiles, "figurine");

			figurine = true;
			leaderFigurine = true;
		}
		
		if (me.getQuest(20, 1)) { // Need to Return to Alkor for Reward. Tell the Teleporting Sorc so she gets us to process it.
			Messaging.sendToList(Team.Profiles, "figurine");

			figurine = true;
			leaderFigurine = true;
		}
		
		if (me.diff === 2) {
			if (!essA && !me.findItem(653) && !me.findItem(654)) {	//260828
				essA = true;
				Messaging.sendToList(Team.Profiles, "essA");
			}
			
			if (!essM && !me.findItem(653) && !me.findItem(655)) {	//260828
				essM = true;
				Messaging.sendToList(Team.Profiles, "essM");
			}
			
			if (essA || essM) {	//260828
				print("need token");
				me.overhead("need token");
			}
			
			var kT = (me.findItems(647, 0) || []).length,	//260831
				kH = (me.findItems(648, 0) || []).length,
				kD = (me.findItems(649, 0) || []).length,
				keyMsg = "key: T=" + kT + "/H=" + kH + "/D=" + kD;
			
			if (!farmingON) {	//260831
				if (!keyT && kT !== 3) {
					keyT = true;
					Messaging.sendToList(Team.Profiles, "keyT");
				}
				
				if (!keyH && kH !== 3) {
					keyH = true;
					Messaging.sendToList(Team.Profiles, "keyH");
				}
				
				if (!keyD && kD !== 3) {
					keyD = true;
					Messaging.sendToList(Team.Profiles, "keyD");
				}
			}
			
			if (keyT || keyH || keyD) {	//260809
				print(keyMsg);	//260831
				me.overhead(keyMsg);	//260831
			}
		}
	};

	this.start = function () {
		var cube = me.findItem(549, -1, 3);	//260827
		
		if (cube) {	//260827
			Storage.Inventory.MoveToSlot(cube, 0, 0);	//260827
		}
		
		var tp = me.findItem(518, -1, 3);	//260827
		
		if (tp) {	//260827
			Storage.Inventory.MoveToSlot(tp, 0, 2);	//260827
		}
		
		Pickit.pickItems();	//eom
		
		//moving to last act before party check
		//if (!me.getQuest(7, 0) && this.partyLevel(teleLvl) && (me.getQuest(6, 0) || me.getQuest(6, 1))) {
			//Pickit.pickItems();
			//this.changeAct(2);
		//}
		if (!me.getQuest(15, 0) && me.getQuest(7, 0)) { // if andy done, but not duriel		say(" Here ****** 2 ");
			Pickit.pickItems();
			Town.goToTown(2);
		}
		if (!me.getQuest(15, 0) && (me.getQuest(14, 0) || me.getQuest(14, 1) || me.getQuest(14, 3) || me.getQuest(14, 4))) {
			Pickit.pickItems();
			this.changeAct(3);	//getQuest, (14, 0) = completed (talked to meshif), (14, 3) = talked to tyrael, (14, 4) = talked to jerhyn (<3 Imba)
		}
		if (!me.getQuest(23, 0) && me.getQuest(15, 0)) { // if duriel done, but not meph
			Town.goToTown(3);
		}
		if (!me.getQuest(28, 0) && me.getQuest(23, 0)) { // if meph done, but not diablo
			Town.goToTown(4);
		}
		if (!me.getQuest(28, 0) && (me.getQuest(26, 0) || me.getQuest(26, 1))) {
			Pickit.pickItems();
			this.changeAct(5);
		}
		if (me.getQuest(28, 0)) { // if diablo done
			Town.goToTown(5);
		}
		
		this.preparation();
		
		Town.doChores(true);
		
		doneChores = true;
		
		//260901
		var rej = (me.findItems(516, 0, 3) || []).concat(me.findItems(515, 0, 3) || []),
			rejSlots = [[1, 2], [1, 3], [2, 3], [3, 3]];
		
		for (var i = 0; i < rej.length; i += 1) {
			Storage.Inventory.MoveToSlot(rej[i], rejSlots[i][0], rejSlots[i][1]);
		}
		
		if (mercLvl && !Merc.hire(Config.MercSkill)) {
			hireMerc = true;
			Messaging.sendToList(Team.Profiles, "hireMerc");
			print("hireMerc: " + hireMerc);
			me.overhead("hireMerc: " + hireMerc);
		}
		
		Pather.useWaypoint(null); // Will walk to and interact with waypoint.

		Pather.moveTo(me.x + myX, me.y + myY); // Move off of waypoint so others can reach it.	//260822
		
		Pickit.pickItems();

		imReady = true; // Prevents premature teamReady announcment.
		Messaging.sendToList(Team.Profiles, "readyCount");
		//print("I am ready");
		me.overhead("imReady");
		
		if (imReady && Team.Size === 1) {
			teamReady = true;
			Messaging.sendToList(Team.Profiles, "teamReady");
			//print("Team is ready");
			me.overhead("teamReady");
		}
		
		var tick = getTickCount();
		
		while (!teamReady) {
			if (getTickCount() - tick > 2 * 60 * 1000) { // Quit after 3 minutes of waiting.
				me.overhead("Team wasn't in game within 2 minutes.");
				D2Bot.printToConsole("AutoSmurf: Team didn't join the game within 2 minutes.", 9);
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
			
			delay(1000);
		}
		
		this.toggle();	//260828
		
		if (giveGold === 1) { //teamGold - give
			this.giveGold();
		}
		
		if (pickGold === 1) { //teamGold - pick
			this.pickGold();
		}
		
		return true;
	};

	this.playerIn = function (area) {
		if (!area) {
			area = me.area;
		}

		var count = 1,
			party = getParty(); //this is actually counting in game players(you included), not in party

		if (party) {
			do {
				if (party.area === area) { //counting players rdy
					count += 1;
				}
			} while (party.getNext());
		}

		if (count < Team.Size) {
			return false;
		}

		return true;
	};

	this.needToKeepWaiting = function (area) { // Wait for party members to be in specified area.
		var myPartyId,
			result = false,
			player = getParty();

		if (arguments.length < 1) {
			throw new Error("AutoSmurf.needToKeepWaiting: No area argument supplied.");
		}

		if (player) {
			myPartyId = player.partyid;

			while (player.getNext()) {
				if (player.partyid === myPartyId) {
					if (player.area !== area) {
						result = true; // Someone is still not in specified area. Need to keep waiting.
					}
				}
			}
		} else {
			result = true; // getParty() didn't return anything. Need to keep waiting.
		}

		return result;
	};

	this.waitForPartyMembers = function (area) {
		var tick = getTickCount(),
			orgx = me.x,
			orgy = me.y;

		me.overhead("Waiting for Party Members.");	//eom

		if (arguments.length < 1) {
			area = me.area;
		}

		while (this.needToKeepWaiting(area)) {
			if (!me.inTown) {
				Attack.clear(20);

				Pather.moveTo(orgx, orgy);
			}

			delay(500);

			if (getTickCount() - tick > 2 * 60 * 1000) { // Quit after 2 minutes of waiting.
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
		}
	};

	this.okCount = function () {
		var tick = getTickCount(),
			orgx = me.x,
			orgy = me.y;
		
		Messaging.sendToList(Team.Profiles, "okCount");

		while (!teamOk) {
			if (!me.inTown) {
				Attack.clear(20, undefined, undefined, undefined, false);	//260727
			}

			Pather.moveTo(orgx, orgy);

			delay(500);
			
			if (okCount === Team.Size - 1) {
				teamOk = true;
				Messaging.sendToList(Team.Profiles, "teamOk");
			}
			
			if (getTickCount() - tick > 120 * 1000) { // Quit after 2 minutes of waiting.
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
		}

		this.teamCount();
	};

	this.teamCount = function () {
		var tick = getTickCount(),
			orgx = me.x,
			orgy = me.y;

		Messaging.sendToList(Team.Profiles, "teamCount");
		
		while (teamCount !== Team.Size - 1) {
			if (!me.inTown) {
				Attack.clear(20, undefined, undefined, undefined, false);	//260727
			}
			
			Pather.moveTo(orgx, orgy);

			delay(500);
			
			if (getTickCount() - tick > 120 * 1000) { // Quit after 120s of waiting.
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
		}
		
		me.overhead("OK");
		
		okCount = 0;
		teamCount = 0;
		teamOk = false;
	};

	this.partyLevel = function (level) {
		if (!level) {
			level = me.charlvl;
		}

		var i, player;

		for (i = 0 ; i < 30 ; i += 1) { // Try 30 times because getParty(); can fail once in a while.
			player = getParty();

			if (player) {
				do {
					if (player.level < level) { // Player is not ready.
						return false;
					}
				} while (player.getNext());

				return true;
			}

			delay(250);
		}

		return false;
	};

	this.partyAct = function () { // Cycles thru getParty() and returns the lowest Act (i.e., 1-5) the partied characters are in. Quits if noone is partied. Returns false is someone isn't in a Town.
		var i, player, myPartyID, area,
			lowestAct = 5;
			
		// Dark-f 2018-2-21
		if (Team.Size === 1) {
			lowestAct = [-1, 1, 40, 75, 103, 109].indexOf(me.area);
			return lowestAct;
		}
		// Dark-f 2018-2-21

		for (i = 0 ; i < 30 ; i += 1) { // Try 30 times because getParty(); can fail once in a while.
			player = getParty();

			if (player) {
				myPartyID = player.partyid;

				if (myPartyID === 65535) { // Noone in my Party. Probably a good idea to quit. . .
					throw new Error("AutoSmurf.partyAct: Noone in my Party.");
				}

				while (player.getNext()) {
					if (player.partyid === myPartyID) { // Only check characters in a Party with me.
						area = [-1, 1, 40, 75, 103, 109].indexOf(player.area);

						if (area === -1) { // Player isn't in a Town.
							return false;
						}

						if (area < lowestAct) {
							lowestAct = area;
						}
					}
				}

				break;
			}

			delay(250);
		}

		return lowestAct;
	};

	this.pickGold = function () {
		var i, goldPile;

		Town.goToTown(1);
		Town.move("stash");

		if (me.getStat(14)) {
			Town.openStash();

			gold(me.getStat(14), 3); // Stash my Gold to make sure I have room to pick more up.

			delay(me.ping * 2 + 500);

			me.cancel();
		}

		for (i = 0; i < 15; i += 1) { // Wait up to 15 seconds for someone to drop Gold for me to pick up.
			goldPile = getUnit(4, 523, 3);

			delay(1000);

			if (goldPile) {
				Pickit.pickItem(goldPile);
				//print("Picked " + goldPile + " Gold.");
			}

			if (me.getStat(14)) {
				Town.openStash();

				gold(me.getStat(14), 3); // Stash my Gold.

				delay(me.ping * 2 + 500);

				me.cancel();
			}
		}
	};

	this.giveGold = function () {
		var i, goldPile,
			dropAmount = me.gold - 5000,
			maxDropAmount = me.gold - Config.LowGold;

		Town.goToTown(1);
		Town.move("stash");

		Town.openStash();

		gold(me.getStat(14), 3); // Stash my Gold.

		delay(me.ping * 2 + 500);

		//dropAmount = dropAmount > maxDropAmount ? dropAmount : maxDropAmount; // If dropAmmount is greater than maxDropAmmount override it.
		dropAmount = Math.min(dropAmount, maxDropAmount);

		//print("Dropping " + Math.round(dropAmount) + " Gold.");
		me.overhead("Dropping " + Math.round(dropAmount) + " Gold.");

		gold(Math.round(dropAmount), 4); // Remove Gold from Stash (must be a round number).

		delay(me.ping * 2 + 500);

		while (me.getStat(14)) {
			gold(me.getStat(14)); // Drop Gold

			delay(me.ping * 2 + 500);
		}

		me.cancel();

		for (i = 0 ; i < 15 ; i += 1) { // Wait 15 seconds for someone to pick up the Gold I've dropped.
			delay(1000);

			goldPile = getUnit(4, 523, 3);

			if (!goldPile) {
				break;
			}

			if (i >= 14 && goldPile) {
				Pickit.pickItem(goldPile);
				//print("Got " + goldPile + " Gold.");
			}
		}
	};
	
	this.syncBO = function (act) { //260813
		if (act < 0 || act > 5) {
			print("syncBO: invalid act");
			return false;
		}
		
		if (!Team.Boer) {
			print("syncBO: no boer in my team");
			return false;
		}
		
		if (!this.partyLevel(24)) {
			print("syncBO: lower level");
			return false;
		}
		
		if (Leader) {
			if (!me.getState(32)) {
				while (BOCount < Team.Size - 1) {
					Messaging.sendToList(Team.Profiles, "BOing");
					BOing = true;
					delay(me.ping * 2 + 500);
				}
			} else {
				while (BOCount < Team.Size - 1) {
					Messaging.sendToList(Team.Profiles, "BOed");
					BOed = true;
					delay(me.ping * 2 + 500);
				}
			}
		} else {
			while (!BOed && !BOing) {
				delay(me.ping * 2 + 500);
			}
		}
	
		var tick = getTickCount();
		
		while (!BOReady) {
			if (BOCount === Team.Size - 1) {
				Messaging.sendToList(Team.Profiles, "BOReady");
				BOReady = true;
			}
			
			delay(500);
			
			if (getTickCount() - tick > 30 * 1000) { // Quit after 30s of waiting.
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
		}
		
		BOing = false;
		BOCount = 0;
		BOReady = false;
		
		if (BOed) {
			BOed = false;
			print("BOed");
			return false;
		}
		
		var destination, home, msg;
		
		if (!me.getQuest(7, 0) || act === 0 || (!me.getQuest(7, 0) && act === undefined && me.act === 1)) {
			if (me.diff === 0) {
				return false;
			} else {
				destination = 2;
				home = 1;
				msg = "act0 BO";
			}
		} else if (act === 1 || (me.getQuest(7, 0) && act === undefined && me.act === 1)) {
			destination = 35;
			home = 1;
			msg = "act1 BO";
			
			if (!syncWP && !getWaypoint(8)) {
				syncWP = true;
				Messaging.sendToList(Team.Profiles, "syncWP");
			}
		} else if (!me.getQuest(15, 0) || act === 2 || (!me.getQuest(15, 0) && act === undefined && me.act === 2)) {
			if (me.diff === 0) {
				return false;
			} else {
				destination = 35;
				home = 40;
				msg = "act2 BO";
				
				if (!syncWP && !getWaypoint(8)) {
					syncWP = true;
					Messaging.sendToList(Team.Profiles, "syncWP");
				}
			}
		} else if (!me.getQuest(23, 0) || act === 3 || (!me.getQuest(23, 0) && act === undefined && me.act === 3)) {
			if (me.diff === 0) {
				return false;
			} else {
				destination = 35;
				home = 75;
				msg = "act3 BO";
				
				if (!syncWP && !getWaypoint(8)) {
					syncWP = true;
					Messaging.sendToList(Team.Profiles, "syncWP");
				}
			}
		} else if (!me.getQuest(25, 0) || (!me.getQuest(25, 0) && act === undefined && me.act === 4)) {
			destination = 35;
			home = 103;
			msg = "act4 BO";
			
			if (!syncWP && !getWaypoint(8)) {
				syncWP = true;
				Messaging.sendToList(Team.Profiles, "syncWP");
			}
		} else if (!me.getQuest(28, 0) || act === 4 || (!me.getQuest(28, 0) && act === undefined && me.act === 4)) {
			destination = 107;
			home = 103;
			msg = "act4+ BO";
			
			if (!syncWP && !getWaypoint(29)) {
				syncWP = true;
				Messaging.sendToList(Team.Profiles, "syncWP");
			}
		} else if (me.getQuest(39, 0) || act === 5 || (me.getQuest(39, 0) && act === undefined && me.act === 5)) {
			destination = 118;	//129
			home = 109;
			msg = "act5+ BO";
			
			if (!syncWP && !getWaypoint(37)) {	//38 skip due to burning soul
				syncWP = true;
				Messaging.sendToList(Team.Profiles, "syncWP");
			}
		} else {
			destination = 107;
			home = 109;
			msg = "act5 BO";
			
			if (!syncWP && !getWaypoint(29)) {
				syncWP = true;
				Messaging.sendToList(Team.Profiles, "syncWP");
			}
		}
		
		for (var i = 0 ; i < 10 ; i += 1) {
			if (!syncWP) {
				delay(me.ping * 2 + 200);
			} else {
				break;
			}
		}
		
		if (syncWP) {
			this.syncWP(destination, home, true);
			syncWP = false;
		}
		
		print(msg);
		me.overhead(msg);
		
		if (me.area !== destination) {
			Town.goToTown();
			delay(me.ping * 2 + 200);
		}
		
		if (destination === 2) {
			if (me.area !== home) {
				Pather.useWaypoint(home);
				delay(me.ping * 2 + 200);
			}
			
			while (me.area !== destination) {
				Pather.moveToExit(destination, true);
				Packet.flash(me.gid);
			}
		} else {
			Pather.useWaypoint(destination);
			delay(me.ping * 2 + 200);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
		}
		
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		this.okCount();

		if (destination === 2) {
			while (me.area !== home) {
				Pather.moveToExit(home, true);
				Packet.flash(me.gid);
			}
		} else {
			Pather.useWaypoint(home);
		}
		
		delay(me.ping * 2 + 1000);
		
		return true;
	};

	this.syncWP = function (destination, home, oneway) {
		var msg, act;
		
		if (destination === 35) {
			msg = "act1 WP";
			act = 1;
		} else if (destination === 107) {
			msg = "act4+ WP";
			act = 4;
		} else if (destination === 118) {
			msg = "act5+ WP";
			act = 5;
		}
		
		print(msg);
		me.overhead(msg);

		if (Leader) {
			Pather.useWaypoint(destination);
			delay(me.ping * 2 + 200);
			Pather.makePortal();
		} else {
			Town.goToTown(act);
			delay(me.ping * 2 + 200);
			
			Town.move("portalspot");
			
			while (!Pather.usePortal(destination, null)) {
				delay(me.ping * 2 + 200);
			}
		}
		
		//Pather.moveTo(me.x + myX, me.y + myY);	//260822
		
		this.okCount();
		
		this.clickWP();
		
		if (!oneway) {
			Pather.useWaypoint(home);
			delay(me.ping * 2 + 1000);
			this.okCount();
		}
		
		delay(me.ping * 2 + 200);
		
		return true;
	};

	this.buffCount = function(act) { // Goes to Town, buys three Antidote potions from Akara, drinks them, and returns to Catacombs Level 4.
		var i, akara, lysander, potions, dote, thaw;

		if (act === undefined) {
			act = 1;
		}
		
		dote = me.findItems(514, -1, 3) || [];
		thaw = me.findItems(517, -1, 3) || [];

		//print("Buying Antidote Potions");
		
		if (act === 1) {
			if (!me.inTown) {
				if (!Pather.usePortal(1, null)) {
					Town.goToTown(1);
				}
			}
			
			if (dote.length < 4) {
				me.overhead("Buying Antidote Potions");
				
				while (!akara || !akara.openMenu()) { // Try more than once to interact with Kashya.
					Packet.flash(me.gid);

					Town.move("akara");

					akara = getUnit(1, "akara");

					delay(1000);
				}

				if (akara) {
					akara.startTrade();

					potions = akara.getItem(514);

					for (i = 0; i < (4 - dote.length); i += 1) {
						potions.buy();
					}

					me.cancel();
				}
			} else {
				me.overhead("Enough Antidote Potions");
			}
			
			if (Leader && me.diff > 0) {
				Town.move("waypoint");
			} else {
				Town.move("portalspot");
				Pather.moveTo(me.x + myX, me.y + myY);	//260912
			}
		}

		if (act === 2) {
			if (thaw.length < 4) {
				me.overhead("Buying Thawing Potions");
				
				while (!lysander || !lysander.openMenu()) { // Try more than once to interact with Kashya.
					Packet.flash(me.gid);

					Town.move("lysander");

					lysander = getUnit(1, "lysander");

					delay(1000);
				}
				
				if (lysander) {	//260908
					lysander.startTrade();

					potions = lysander.getItem(517);

					for (i = 0; i < (4 - thaw.length); i += 1) {
						potions.buy();
					}

					me.cancel();
				}
			} else {
				me.overhead("Enough Thawing Potions");
			}
			
			if (Leader) {
				Town.move("waypoint");
			} else {
				Town.move("portalspot");
				Pather.moveTo(me.x + myX, me.y + myY);	//260912
			}
		}
		
		myBuff = true;
		Messaging.sendToList(Team.Profiles, "buffCount");

		while (!teamBuff) {
			delay(250);
		}
		
		if (act === 1) {
			potions = me.findItems(514, -1, 3);
		}

		if (act === 2) {
			potions = me.findItems(517, -1, 3);
		}
		
		if (potions.length) {
			for (i = 0 ; i < potions.length ; i += 1) {
				potions[i].interact();

				delay(me.ping * 2 + 500);
			}
		}
		
		if (act === 1 && me.diff === 0) {
			if (Leader) {
				Pather.usePortal(37, null);
				Pather.makePortal();
				me.overhead("tpReady");
				Messaging.sendToList(Team.Profiles, "tpReady");
				delay(1000);
			} else {
				while (me.inTown) {
					if (tpReady) {
						Pather.usePortal(37, null);
					}
					
					delay(250);
				}
				
				tpReady = false;
			}
		}
		
		myBuff = false;
		teamBuff = false;
		buffCount = 0;
	
		return true;
	};

//PATHING
	this.clearToExit = function (currentarea, targetarea, cleartype) { // SiC-666 TODO: add moving to exit without clearing after XX minutes.
		//print("Start clearToExit");
		me.overhead("Start clearToExit");

		print("Currently in: " + Pather.getAreaName(me.area));
		me.overhead("Currently in: " + Pather.getAreaName(me.area));
		
		//print("Currentarea arg: " + Pather.getAreaName(me.area));
		me.overhead("Currentarea arg: " + Pather.getAreaName(me.area));

		delay(250);
		print("Clearing to: " + Pather.getAreaName(targetarea));
		me.overhead("Clearing to: " + Pather.getAreaName(targetarea));
		
		while (me.area === currentarea) {
			try {
				Pather.moveToExit(targetarea, true, cleartype);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}

			Packet.flash(me.gid);

			delay(me.ping * 2 + 250);
		}

		print("End clearToExit");
		me.overhead("End clearToExit");
	};
	
	this.travel = function (goal) { // 0->9, a custom waypoint getter function
		var i, homeTown, nextAreaIndex, target, destination, unit,
			wpAreas = [],
			areaIDs = [];
		
		Pather.teleport = true;
		
		switch (goal) {
		default:
		case 0:
			destination = 5; // Dark Wood
			wpAreas = [1, 3, 4, 5];
			areaIDs = [2, 3, 4, 10, 5];
			homeTown = 1;
			break;
		case 1:
			destination = 35; // Catacombs Level 2
			wpAreas = [1, 3, 4, 5, 6, 27, 29, 32, 35];
			areaIDs = [2, 3, 4, 10, 5, 6, 7, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35];
			homeTown = 1;
			break;
		case 2:
			destination = 57; // Halls Of The Dead Level 2
			wpAreas = [42, 57]; // Dry Hills, Halls Of The Dead Level 2
			areaIDs = [41, 42, 56, 57]; // Rocky Waste, Dry Hills, Halls Of The Dead Level 1, Halls Of The Dead Level 2
			homeTown = 40;
			break;
		case 3:
			destination = 44; // Lost City
			wpAreas = [42, 43, 44]; // Dry Hills, Far Oasis, Lost City
			areaIDs = [41, 42, 43, 44]; // Dry Hills, Far Oasis, Lost City
			homeTown = 40;
			break;
		case 4:
			destination = 74; // Arcane Sanctuary
			wpAreas = [52, 74];
			areaIDs = [50, 51, 52, 53, 54, 74];
			homeTown = 40;
			break;
		case 6:
			destination = 83; // Travincal
			wpAreas = [75, 76, 78, 79, 80, 81, 83];
			areaIDs = [76, 78, 79, 80, 81, 82, 83];
			homeTown = 75;
			break;
		case 7:
			destination = 101; // Durance Of Hate Level 2
			wpAreas = [75, 76, 78, 79, 80, 81, 83, 101];
			areaIDs = [76, 78, 79, 80, 81, 82, 83, 100, 101];
			homeTown = 75;
			break;
		case 8:
			destination = 107; // River Of Flame
			wpAreas = [103, 106, 107];
			areaIDs = [104, 105, 106, 107];
			homeTown = 103;
			break;
		case 9:
			destination = 118; // Ancient's Way
			wpAreas = [109, 111, 112, 113, 115, 117, 118];
			areaIDs = [110, 111, 112, 113, 115, 117, 118];
			homeTown = 109;
			break;
		case 10:
			destination = 129; // The Worldstone Keep Level 2
			wpAreas = [109, 111, 112, 113, 115, 117, 118, 129];
			areaIDs = [110, 111, 112, 113, 115, 117, 118, 120, 128, 129];
			homeTown = 109;
			break;
		}

		print("Traveling to " + getArea(destination).name);
		me.overhead("Traveling to " + getArea(destination).name);

		Town.goToTown();
	
		Town.clearBelt();	//260822
		Town.fillTome(518);	//260904
		Town.buyPotions();	//260822

		Town.move("waypoint");

		target = Pather.plotCourse(destination, me.area); // Pather.plotCourse(destination area id, starting area id);

		nextAreaIndex = areaIDs.indexOf(target.course[0]) + 1; // Index of next area
		
		print("Travel course = " + target.course);
		me.overhead("Travel course = " + target.course);

		if (nextAreaIndex < areaIDs.length) { // If next area index is invalid, return true.
			//if (me.inTown && wpAreas.indexOf(target.course[0]) > -1 && getWaypoint(wpAreas.indexOf(target.course[0]))) {	// Use waypoint to first area if possible
			if (me.inTown && wpAreas.indexOf(target.course[0]) > -1 && Pather.wpAreas.indexOf(target.course[0]) > -1 && getWaypoint(Pather.wpAreas.indexOf(target.course[0]))) {
				Pather.useWaypoint(target.course[0]);
			}

			for (nextAreaIndex; nextAreaIndex < areaIDs.length; nextAreaIndex += 1) {
				//print("nextAreaIndex = " + nextAreaIndex);
				me.overhead("nextAreaIndex = " + nextAreaIndex);
				
				print("Next location name = " + getArea(areaIDs[nextAreaIndex]).name);
				me.overhead("Next location name = " + getArea(areaIDs[nextAreaIndex]).name);

				switch (areaIDs[nextAreaIndex]) { // Special actions for traveling to some areas
				case 32: // Inner Cloister
					for (i = 0; i < 5; i += 1) {
						switch (me.area) {
						case 31: // Jail Level 3
							Pather.moveToExit(32, true);
							break;
						case 30: // Jail Level 2
							Pather.moveToExit(31, true);
							break;
						}
						
						if (me.area === 32) {
							break;
						}
						
						Packet.flash(me.gid);
						delay(me.ping * 2 + 250);
					}
					
					if (i >= 5) {
						throw new Error("Travel failed");
					}
					
					break;
				case 100: // Durance of Hate Level 1
				case 101: // Durance of Hate Level 2
					try{
						Pather.moveToExit(areaIDs[nextAreaIndex], true);
					} catch (e) {
						print(e);

						Town.goToTown();

						this.mephisto();

						return true;
					}

					break;
				case 115: // Glacial Trail
				case 117: // Frozen Tundra
				case 118: // Ancient's Way
				case 120: // Arreat Summit
				case 128: // The Worldstone Keep Level 1
				case 129: // The Worldstone Keep Level 2
					try{
						Pather.moveToExit(areaIDs[nextAreaIndex], true);
					} catch (e) {
						print(e);

						Town.goToTown();

						Town.move("portalspot");

						delay(10000);

						//print("Attempting to use any portal");
						me.overhead("Attempting to use any portal");

						while (!Pather.usePortal(129, null)) {
							delay(5000);
						}

						this.clickWP();

						Pather.moveToExit([128, 120, 118], true);

						this.clickWP();

						Pather.moveToExit(117, true);

						this.clickWP();

						Pather.moveToExit(115, true);

						this.clickWP();

						return true;
					}

					break;
				case 50: // Harem Level 1
					if (!Pather.moveToExit(50, true)) {
						throw new Error("AutoSmurf.travel: Failed to enter the Palace in Act 2.");
					}

					break;
				case 53: // Palace Cellar Level 2
					if (me.diff === 0) {
						if (!Pather.useWaypoint(40)) {
							Town.goToTown(2);
						}

						Town.doChores();

						Pather.useWaypoint(52);
					}

					Pather.moveToExit(53, true);

					break;
				case 74: // Arcane Sanctuary
					while (getDistance(me.x, me.y, 10073, 8670) > 10) {
						try {
							Pather.moveTo(10073, 8670);
						} catch (e) {
							print("Caught Error.");

							print(e);
						}
					}

					Pather.usePortal(null);

					break;
				case 46: // Canyon Of The Magi
					try {
						this.summoner();
					} catch (e) {
						print(e);

						Town.goToTown();

						Town.move("portalspot");

						delay(10000);

						while (!Pather.usePortal(areaIDs[nextAreaIndex], null)) {
							delay(10000);

							Pather.usePortal(areaIDs[nextAreaIndex]-1, null);

							delay(10000);
						}

						if (me.area === areaIDs[nextAreaIndex]-1 ) {
							Pather.moveToExit(areaIDs[nextAreaIndex], true);
						}

						//delay(me.ping);
						delay(100);
					} finally {
						if (me.area !== areaIDs[nextAreaIndex]) {
							Town.goToTown();

							Town.move("portalspot");

							delay(10000);

							//Messaging.sendToList(Team.Profiles, "tp");

							while (!Pather.usePortal(areaIDs[nextAreaIndex], null)) {
								delay(1000);
							}
						}
					}
					break;
				case 78: // Flayer Jungle
					if (!Pather.moveToExit(78, true)) {	//260908
						Pather.moveToExit([77, 78], true);
					}
					
					this.clickWP(78);

					break;
				case 110: // Harrogath -> Bloody Foothills
					Pather.moveTo(5026, 5095);

					unit = getUnit(2, 449); // Gate

					if (unit) {
						for (i = 0; i < 10; i += 1) {
							if (unit.mode === 0) {
								sendPacket(1, 0x13, 4, unit.type, 4, unit.gid);
							}

							if (unit.mode === 2) {
								break;
							}

							delay(500);
						}
					}

					Pather.moveToExit(areaIDs[nextAreaIndex], true);

					break;
				default:
					//Pather.moveToExit(areaIDs[nextAreaIndex], true);
					for (i = 0; i < 3; i += 1) { // 260511
						Pather.moveToExit(areaIDs[nextAreaIndex], true);
						
						if (me.area === areaIDs[nextAreaIndex]) {
							break;
						}
						
						delay(me.ping * 2 + 500);
					}
					
					if (me.area !== areaIDs[nextAreaIndex]) {	//260511
						throw new Error("Travel failed: area " + areaIDs[nextAreaIndex]);
					}
				}

				if (wpAreas.indexOf(areaIDs[nextAreaIndex]) > -1) { // Check if the next area (which we are now in) has a waypoint. If it does, grab it, go to town, wait for party, run chores, take waypoint, and wait for the party.
					this.clickWP();

				}
			}

			Pather.useWaypoint(homeTown); // Finishes in town. (all desinations have a waypoint)
		}
		
		return true;
	};
	
	this.changeAct = function (act) {
		var npc, time, tpTome, i,
			preArea = me.area;

		//print("change Act " + act);
		me.overhead("change Act " + act);
		
		if (me.act === act) {
			return true;
		}

		try {
			switch (act) {
			case 2:
				if (me.act >= 2) {
					break;
				}

				Town.move("warriv");

				npc = getUnit(1, "warriv");

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D36);
				
				delay(me.ping * 2 + 200);	//260914

				break;
			case 3:
				if (me.act >= 3) {
					break;
				}
				
				Town.move("palace");
				npc = getUnit(1, "jerhyn");
				
				if (!npc || !npc.openMenu()) {
					Pather.moveTo(5166, 5206);

					return false;
				}

				me.cancel();

				tpTome = me.findItem("tbk", 0, 3);
				
				if (tpTome && tpTome.getStat(70) > 0) {
					Pather.moveToExit(50, true);
					//delay(me.ping * 2 + rand(100, 1000));
					
					if (!Pather.getPortal(null, null)) {
						Pather.makePortal();
					}
					
					var tick = getTickCount();

					while (!Pather.usePortal(null, null)) {
						delay(me.ping * 2 + 200);
						
						if (getTickCount() - tick > 3 * 1000) {
							Town.goToTown();
							delay(me.ping * 2 + 100);
							break;
						}
					}
					
					if (me.area === 50) {
						Pather.moveToExit(40, true);
					}
					
					if (!me.inTown) {
						Town.goToTown();
					}
				}
				
				Town.move("meshif");
				npc = getUnit(1, "meshif");
				
				if (npc.openMenu()) {
					me.cancel();
				}

				if (!npc || !npc.openMenu()) {
					return false;
				}

				Misc.useMenu(0x0D38);
				
				delay(me.ping * 2 + 200);

				break;
			case 4:
				if (me.act >= 4) {
					break;
				}
				this.mephisto();
				
				break;
			case 5:
				if (me.act >= 5) {
					break;
				}
				Town.move("tyrael");
				npc = getUnit(1, "tyrael");
				
				if (!npc || !npc.openMenu()) {
					return false;
				}

				delay(me.ping * 2 + 200);

				if (getUnit(2, 566)) {
					me.cancel();
					Pather.useUnit(2, 566, 109);
				} else {
					Misc.useMenu(0x58D2);
				}
				
				delay(me.ping * 2 + 200);

				break;
			}

			delay(me.ping * 2 + 1000);

			while (!me.area) {
				delay(500);
			}

			if (me.area === preArea) {
				me.cancel();
				Town.move("portalspot");
				print("Act change failed.");
				D2Bot.printToConsole("changeAct failed");
				return false;
			}
		} catch (e) {
			return false;
		}

		print("checking player in...");
		me.overhead("checking player in...");
		
		for (time = 0; time < 200; time += 1) {
			if (this.playerIn()) {
				delay(me.ping * 2 + 2000);
				
				break;
			}
			
			if (time > 120) {
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
			
			delay(1000);
		}
		
		return true;
	};
	
	this.clickWP = function (area) { // Move to nearest wp and click it.
		var i, j, wp, presetUnit,
		wpIDs = [119, 145, 156, 157, 237, 238, 288, 323, 324, 398, 402, 429, 494, 496, 511, 539];

		if (area === undefined) {
			area = me.area;
		}
		
		if (area !== me.area) {
			Pather.journeyTo(area);
		}

		for (i = 0 ; i < wpIDs.length ; i += 1) {
			presetUnit = getPresetUnit(me.area, 2, wpIDs[i]);

			if (presetUnit) {
				print("getting nearest WP");
				me.overhead("getting nearest WP");

				while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 10) {
					try {
						Pather.moveToPreset(me.area, 2, wpIDs[i], 0, 0, false, false);
					} catch (e) {
						print("Caught Error.");

						print(e);
					}

					Packet.flash(me.gid);

					delay(me.ping * 2 + 500);
				}

				wp = getUnit(2, "waypoint");

				if (wp) {
					for (j = 0 ; j < 10 ; j += 1) {
						sendPacket(1, 0x13, 4, wp.type, 4, wp.gid);

						delay(me.ping * 2 + 500);

						if (getUIFlag(0x14)) {
							//delay(me.ping);
							delay(me.ping * 2 + 200);

							me.cancel();

							break;
						}

						Packet.flash(me.gid);

						delay(me.ping * 2 + 500);

						Pather.moveToUnit(presetUnit, 0, 0, false, false);
					}
				}
			}
		}
	};

//SUPPORTING
	this.getQuestItem = function (classid, chestid) { // Accepts classid only or a classid/chestid combination.
		var i, chest, item,
			tick = getTickCount();

		if (classid === 173 && me.findItem(174)) {
			return true;
		}

		if (me.findItem(classid)) { // Don't open "chest" or try picking up item if we already have it.
			return true;
		}

		if (me.inTown) {
			return false;
		}

		if (arguments.length > 1) {
			chest = getUnit(2, chestid);

			if (chest) {
				Misc.openChest(chest);
			}
		}

		for (i = 0 ; i < 50 ; i += 1) { // Give the quest item plenty of time (up to two seconds) to drop because if it's not detected the function will end.
			item = getUnit(4, classid);

			if (item) {
				break;
			}

			delay(40);
		}

		while (!me.findItem(classid)) { // Try more than once in case someone beats me to it.
			item = getUnit(4, classid);

			if (item) {
				if (Storage.Inventory.CanFit(item)) {
					Pickit.pickItem(item);

					delay(me.ping * 2 + 500);
				} else {
					if (Pickit.canMakeRoom()) {
						//print("ÿc7Trying to make room for " + Pickit.itemColor(item) + item.name);
						//me.overhead("Trying to make room for " + Pickit.itemColor(item) + item.name);
						me.overhead("Trying to make room for " + item.name);	//eom

						Town.visitTown(); // Go to Town and do chores. Will throw an error if it fails to return from Town.
					} else {
						//print("ÿc7Not enough room for " + Pickit.itemColor(item) + item.name);
						//me.overhead("Not enough room for " + Pickit.itemColor(item) + item.name);
						me.overhead("Not enough room for " + item.name);	//eom

						return false;
					}
				}
			} else {
				return false;
			}
		}

		return true;
	};

	this.toInventory = function () {
		var i,
		items = [],
		item = me.findItem(-1, 0);

		//print("toInventory");
		me.overhead("toInventory");

		if (!Town.openStash()) {
			Town.openStash();
		}
		if (item) {
			do {
				if (item.classid === 91 || item.classid === 174 || item.classid === 553 || item.classid === 554)	 {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}
		for (i = 0; i < items.length; i += 1) {
			if (Storage.Inventory.CanFit(items[i])) {
				Storage.Inventory.MoveTo(items[i]);
			}
		}
		delay(1000);
		me.cancel();

		return true;
	};

	this.offEquip = function () {
		var i,
		items = [],
		item = me.findItem(-1, 1);

		if (item) {
			do {
				if (item.classid === 90 || item.classid === 174) {
					items.push(copyUnit(item));
				}
			} while (item.getNext());
		}
		
		for (i = 0; i < items.length; i += 1) {
			if (Storage.Inventory.CanFit(items[i])) {
				Storage.Inventory.MoveTo(items[i]);
			}
			
			//print("offEquip");
			me.overhead("offEquip");
		}
		
		delay(1000);
		me.cancel();
		
		Equip.autoEquip();

		return true;
	};

	this.cubeStaff = function () {
		var amulet = me.findItem("vip"),
			staff = me.findItem("msf");

		//print("cubing staff");
		me.overhead("cubing staff");

		if (!staff || !amulet) {
			return false;
		}
		Town.move("stash");
		if (!Town.openStash()) {
			Town.openStash();
		}
		Storage.Cube.MoveTo(amulet);
		Storage.Cube.MoveTo(staff);
		Cubing.openCube();
		transmute();
		//delay(750 + me.ping);
		delay(me.ping * 2 + 1000);
		Cubing.emptyCube();
		me.cancel();

		return true; //(<3 kolton)
	};

	this.placeStaff = function () {
		var staff, item, orifice,
			tick = getTickCount(),
			preArea = me.area;

		//print("place staff");
		me.overhead("place staff");
		
		if (!me.findItem(91, 0, 3)) {
			Town.goToTown();
			Town.move("stash");
			this.toInventory();
			Town.move("portalspot");
			if (!Pather.usePortal(preArea, me.name)) {
				throw new Error("placeStaff: Failed to take TP");
			}
			delay(1000);
		}
		
		orifice = getUnit(2, 152);
		
		if (!orifice) {
			return false;
		}
		
		Misc.openChest(orifice);
		staff = me.findItem(91);
		
		if (!staff) {
			if (getTickCount() - tick < 500) {
				delay(500);
			}
			return false;
		}

		staff.toCursor();
		submitItem();
		//delay(750 + me.ping);
		delay(me.ping * 2 + 1000);

		return true;
	};

	this.cubeFlail = function () {
		var eye = me.findItem(553),
			heart = me.findItem(554),
			brain = me.findItem(555),
			flail = me.findItem(173);

		//print("cubing flail");
		me.overhead("cubing flail");
		
		if (me.findItem(174)) { // Already have the finished Flail.
			return true;
		}

		if (!eye || !heart || !brain || !flail) {
			print("cubeFlail failed: missing ingredient(s)");

			return false;
		}
		
		if (!me.inTown) {
			Town.goToTown();
		}

		Town.move("stash");
		
		if (!Town.openStash()) {
			Town.openStash();
		}
		
		Storage.Cube.MoveTo(eye);
		Storage.Cube.MoveTo(heart);
		Storage.Cube.MoveTo(brain);
		Storage.Cube.MoveTo(flail);
		Cubing.openCube();
		transmute();
		//delay(750 + me.ping);
		delay(me.ping * 2 + 1000);
		
		Cubing.emptyCube();
		me.cancel();

		return true;
	};

	this.equipFlail = function () {
		var finishedFlail = me.findItem(174);
		
		if (finishedFlail.mode === 1) {
			return true;
		}

		if (!me.inTown) {
			Town.goToTown();
		}
		
		if (finishedFlail) {
			if (!Equip.equip(finishedFlail, 4)) {
				Pickit.pickItems();

				throw new Error("AutoSmurf.equipFlail: Failed to equip Khalim's Will.");
			}
		} else {
			throw new Error("AutoSmurf.equipFlail: Lost Khalim's Will before trying to equip it.");
		}

		if (me.itemoncursor) { // Seems like Item.equip() doesn't want to keep whatever the sorc has for a weapon, so lets put it into inventory without checking it against Pickit.
			var cursorItem = getUnit(100);

			if (cursorItem) {
				if (Storage.Inventory.CanFit(cursorItem)) {
					//print("Keeping weapon by force.");
					me.overhead("Keeping weapon by force.");

					Storage.Inventory.MoveTo(cursorItem);
				} else {
					me.cancel();
					print("No room to keep weapon by force.");

					cursorItem.drop();
				}
			}
		}

		delay(me.ping * 2 + 200);

		Pickit.pickItems(); // Will hopefully pick up the character's weapon if it was dropped.
		
		Town.move("portalspot");
		
		if (!Pather.usePortal(83, me.name)) {
			throw new Error("AutoSmurf.travincal: Failed to go back from town");
		}

		return true;
	};

	this.placeFlail = function () {
		var i,
			orb = getUnit(2, 404);

		//print("Smashing the Compelling Orb.");
		me.overhead("Smashing the Compelling Orb.");

		if (!orb) {
			throw new Error("AutoSmurf.placeFlail: Couldn't find Compelling Orb.");
		}

		Pather.moveToUnit(orb, 0, 0, false, false);

		for (i = 0; i < 5; i += 1) {
			if (orb) {
				Skill.cast(0, 0, orb);

				delay(500);
			}
		}

		D2Bot.printToConsole("=== TRAVINCAL ===", 7);

		return true;
	};

//QUESTING
	this.den = function () {
		var i, akara;

		print("ÿc4=== [DEN] ===");
		
		if (!me.getQuest(1, 1)) { // Haven't cleared the Den yet.
			if (me.diff === 0) { // All characters grab Cold Plains Waypoint in Normal. Only the Teleporting Sorc grabs it in Nightmare and Hell.
				if (!getWaypoint(1)) {
					while (me.area === 1) {
						Pather.moveToExit(2, true);
						delay(me.ping * 2 + 250);
						Packet.flash(me.gid);
					}
					
					this.waitForPartyMembers();
					
					this.clearToExit(2, 3, 0);
					this.waitForPartyMembers();

					Pather.goWP(me.area, true);
					Pather.moveTo(me.x + myX, me.y + myY);	//260822
					
					this.okCount();
					
					this.clickWP();
					
					Pather.useWaypoint(1);
				}
				
				while (me.area === 1) {
					Pather.moveToExit(2, true);
					delay(me.ping * 2 + 250);
					Packet.flash(me.gid);
				}
				
				this.waitForPartyMembers();
				
				this.clearToExit(2, 8, 0);
				this.waitForPartyMembers();
				
				for (i = 0; i < 2; i += 1) {
					//print("clearing - try number " + i);
					me.overhead("clearing - try number " + i);

					Attack.clearLevel();

					sendPacket(1, 0x40); // Refresh quest status

					delay(me.ping * 2 + 250);

					if (me.getQuest(1, 1)) { // Den is cleared. Return to Akara for a Reward.
						break;
					}
				}
				
				while (!me.inTown) {
					switch (me.area) {
					case 8:
						this.clearToExit(8, 2, 0);
						break;
					case 2:
						this.clearToExit(2, 1, 0);
						break;
					}
					
					delay(me.ping * 2 + 250);
					Packet.flash(me.gid);
				}
			} else { // diff > 0
				if (Leader) {
					if (me.area === 1) {
						Pather.moveToExit(2, true); // Move from Rogue Encampment to Blood Moor
					}
					
					if (me.area === 2) {
						Pather.moveToExit(8, true);
					}
					
					Pather.makePortal();
				} else {
					Town.goToTown();
					Town.move("portalspot");
					while (!Pather.usePortal(8, null)) {
						delay(250);
					}
				}
				
				this.waitForPartyMembers();
				Precast.doPrecast(true);
				
				Pather.teleport = false; // not teleporting in Den
				
				for (i = 0; i < 3; i += 1) {
					//print("clearing - try number " + i);
					me.overhead("clearing - try number " + i);

					Attack.clearLevel();

					sendPacket(1, 0x40); // Refresh quest status

					delay(me.ping * 2 + 250);

					if (me.getQuest(1, 1)) { // Den is cleared. Return to Akara for a Reward.
						break;
					}
				}

				if (Leader) {
					if (!Pather.getPortal(null, null)) {
						Pather.makePortal();
					}
				}
				
				var tick = getTickCount();
				
				while (!Pather.usePortal(null, null)) {
					delay(me.ping * 2 + 200);
					
					if (getTickCount() - tick > 3 * 1000) {
						Town.goToTown();
						delay(me.ping * 2 + 100);
						break;
					}
				}
				
				Pather.teleport = true;
			}
		}
		
		if (me.inTown) {
			Town.move("akara");
		
			akara = getUnit(1, "akara");

			akara.openMenu();

			me.cancel();

			delay(me.ping * 2 + 250);
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== DEN ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.blood = function () {
		var burial, kashya;
		
		if (me.getQuest(2, 1) || me.getQuest(2, 0)) {
			//print("getting waypoints...");
			me.overhead("getting waypoints...");
		} else {
			print("ÿc4=== [BLOOD] ===");
		}
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!me.getQuest(2, 1) && !me.getQuest(2, 0)) {
			Pather.useWaypoint(3);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
			Precast.doPrecast(true);
			
			this.clearToExit(3, 17, 0);
			
			this.waitForPartyMembers();
			Precast.doPrecast(true);
			
			burial = getPresetUnit(17, 1, 805);
			
			//Pather.moveTo(burial.roomx * 5 + burial.x, burial.roomy * 5 + burial.y, 15, true, true);
			Pather.moveTo(burial.roomx * 5 + burial.x, burial.roomy * 5 + burial.y, 15, true);
			
			Attack.clear(15);
			
			try {
				//Attack.clear(15, 0, getLocaleString(3111)); // Blood Raven
				Attack.clearList(Attack.scanList(getLocaleString(3111)), null, 1); // Blood Raven
			} catch (e) {
				print(e);
				//throw new Error("Failed to kill Raven")
			}
			
			this.clearToExit(17, 3, 0);
			this.waitForPartyMembers();
			Precast.doPrecast(true);
		}
		
		if (me.inTown) {
			Pather.useWaypoint(3);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
			Precast.doPrecast(true);
		}

		this.clearToExit(3, 4, 0);
		this.waitForPartyMembers();
		Precast.doPrecast(true);

		Pather.goWP(me.area, true);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
		
		Pather.useWaypoint(1);
		this.waitForPartyMembers();
		
		if (!me.getQuest(2, 0)) {
			while (!kashya || !kashya.openMenu()) { // Try more than once to interact with Kashya.
				Packet.flash(me.gid);

				Town.move("kashya");

				kashya = getUnit(1, "kashya");

				delay(1000);
			}

			me.cancel();
			
			if (Leader) {
				D2Bot.printToConsole("=== BLOOD ===", 7);
			}
		}

		doneChores = false;
		
		return true;
	};
		
		
	this.cain = function () { // Dark-f: rewrite rescue cain
		var i, j, akara, cain, slave, scroll1, scroll2, stoneA, stoneB, stoneC, stoneD, stoneE;

		print("ÿc4=== [CAIN] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (!me.getQuest(4, 1)) { // not rescues Cain
			if (me.diff === 0 && !getWaypoint(3)) {
				
				//print("getting waypoints...");
				me.overhead("getting waypoints...");
				
				Pather.useWaypoint(4);
				Pather.moveTo(me.x + myX, me.y + myY);	//260822
				this.waitForPartyMembers();
				Precast.doPrecast(true);

				this.clearToExit(4, 10, 0);
				this.waitForPartyMembers();
				Precast.doPrecast(true);

				while (me.area === 10) {
					this.clearToExit(10, 5, 0);
				}
				
				if (me.area === 5) {
					delay(me.ping * 2 + rand(100, 1000));
					
					if (!Pather.getPortal(1, null)) {
						Pather.makePortal();
					}
				} else {
					this.clickWP();
					Pather.useWaypoint(1);
					Town.move("portalspot");
					while (!Pather.usePortal(5, null)) {
						delay(250);
						
						if (this.playerIn()) {	//260411
							scriptBroadcast("quit");	//260909
						}
					}
				}

				this.waitForPartyMembers();
				Precast.doPrecast(true);
	
				Pather.goWP(me.area, true);
				Pather.moveTo(me.x + myX, me.y + myY);	//260822

				this.okCount();
				
				this.clickWP();
				
				Pather.useWaypoint(1);
				this.waitForPartyMembers();
				Town.doChores();
				
			}
			
			if (Leader && me.diff !== 0) { //
				this.travel(0);
			}
			
			if (!me.getQuest(4, 3) && !me.getQuest(4, 4)) {
				//4,4redportal already open ; 4,3 holding scroll
				//print("getting scroll...");
				me.overhead("getting scroll...");

				if (!me.inTown) {
					Town.goToTown();
				}
				
				if (me.diff === 0) {	//260812
					Pather.useWaypoint(5); //dark wood
					Pather.moveTo(me.x + myX, me.y + myY);	//260822
					
					this.waitForPartyMembers();
					Precast.doPrecast(true);
					
					Pather.moveToPreset(me.area, 1, 738, 5, 5, true, true); //move to tree
					
					Attack.clear(25); // treehead
					
					Pather.moveToPreset(me.area, 1, 738, 5, 5, true, true); //move to tree
					
					if (Leader) {
						Pather.makePortal();
						this.getQuestItem(524, 30);
					}
					
					var tick = getTickCount();
					
					while (!Pather.usePortal(null, null)) {
						delay(me.ping * 2 + 200);
						
						if (getTickCount() - tick > 3 * 1000) {
							Town.goToTown();
							delay(me.ping * 2 + 100);
							break;
						}
					}
				} else {	//260812
					if (Leader) {
						Pather.useWaypoint(5); //dark wood
						Pather.moveToPreset(me.area, 1, 738, 3, 3); //move to tree
						this.getQuestItem(524, 30);
						Town.goToTown();
					}
				}
				
				if (me.findItem(524)) {
					Town.move("akara");
					akara = getUnit(1, "akara");
					if (akara && akara.openMenu()) {
						me.cancel();
					}
				}
			}
			
			//print("getting redportal...");
			me.overhead("getting redportal...");
			
			if (me.diff === 0) {
				Pather.useWaypoint(4); //stoney field
				Pather.moveTo(me.x + myX, me.y + myY);	//260822
			} else {
				if (Leader) {
					Pather.useWaypoint(4); //stoney field
					Pather.makePortal();
				} else {
					Town.move("portalspot");
					while (!Pather.usePortal(4, null)) {
						delay(250);
					}
					delay(250);
				}
			}
			
			this.waitForPartyMembers();
			Precast.doPrecast(true);
			
			Pather.teleport = false;

			Pather.moveToPreset(me.area, 1, 737, myX, myY, true, true);	//260822
			
			try {
				Attack.clear(25, 0, getLocaleString(2872));// Rakanishu
			} catch (e) {
				print(e);
				Attack.clear(25);
			}
			
			Pather.moveToPreset(me.area, 1, 737, myX, myY, true, true);	//260822
			
			if (!me.getQuest(4, 4) && me.findItem(525)) {		 //redportal already open
				stoneA = getUnit(2, 17);
				stoneB = getUnit(2, 18);
				stoneC = getUnit(2, 19);
				stoneD = getUnit(2, 20);
				stoneE = getUnit(2, 21);
				
				for (i = 0; i < 6; i += 1) {	//260812
					Misc.openChest(stoneA, true);
					Misc.openChest(stoneB, true);
					Misc.openChest(stoneC, true);
					Misc.openChest(stoneD, true);
					Misc.openChest(stoneE, true);
				}
			} else {
				while (!Pather.getPortal(38)) {
					Attack.clear(20);
					Pather.moveToPreset(me.area, 1, 737, myX, myY, true, true);	//260822
					delay(500);
				}
			}
			
			Pather.teleport = true;
			
			//print("rescue cain...");
			me.overhead("rescue cain...");

			for (i = 0; i < 15; i += 1) {
				if (Pather.usePortal(38)) {
					break;
				}
				
				delay(500);
			}

			delay(me.ping * 2 + 500);
			
			if (me.area !== 38) {
				//print("Redportal not found ");
				me.overhead("Redportal not found ");
				delay(1000);
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
			
			this.okCount();
			
			if (Leader) {
				Pather.makePortal();
				
				delay(3000);	//260727
				
				slave = getUnit(2, 26);
				
				if (!slave) {
					return false;
				}
				
				for (i = 0; i < 5; i += 1) {
					if (getDistance(me, slave) > 5) {
						Pather.moveToUnit(slave);
						Packet.flash(me.gid);
					}
				}
				
				Misc.openChest(slave);
				//delay(250);
				
				if (!Pather.usePortal(1, null)) {
					Town.goToTown();
				}
				
				D2Bot.printToConsole("=== CAIN ===", 7);
			} else { // Dark-f: other teams goto town.
				if (!Pather.usePortal(1, null)) {
					Town.goToTown();
				}
				
				while (!me.getQuest(4, 1)) {
					delay(500);
					sendPacket(1, 0x40); //fresh Quest state.
				}
			}
		}
		
		Town.move("akara");
		akara = getUnit(1, "akara");
		if (akara && akara.openMenu()) {
			me.cancel();
		}
		
		Town.move("cain");
		cain = getUnit(1, NPC.Cain);
		if (cain && cain.openMenu()) {
			me.cancel();
		}

		doneChores = false;
		
		return true;
	};

	this.trist = function () {
		var i,
			path = [25172, 5089,
						25168, 5189,
						25047, 5178,
						25054, 5099,
						25119, 5099,
						25123, 5140,
						25086, 5138]; //260728;
		
		print("ÿc4=== [TRIST] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		Pather.useWaypoint(4);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822
		this.waitForPartyMembers();
		Precast.doPrecast(true);

		Pather.moveToPreset(me.area, 1, 737, myX, myY, true, true);	//260822

		try {
			Attack.clear(25, 0, getLocaleString(2872));// Rakanishu
		} catch (e) {
			print(e);
			Attack.clear(25);
		}
		
		Pather.moveToPreset(me.area, 1, 737, myX, myY, true, true); //260719	//260822

		for (i = 0; i < 5; i += 1) {
			if (Pather.usePortal(38)) {
				break;
			}
			delay(1000);
		}

		//this.waitForPartyMembers();
		this.okCount();
		
		Precast.doPrecast(true);
		
		for (i = 0; i < path.length; i += 2) {	//260627
			Pather.moveTo(path[i] + myX, path[i + 1] + myY, 10, true);	//260822
			//Attack.clear(25);
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== TRIST ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};
	
	// add for Lv up when the partyLevel is less than the tristLvl
	this.outer = function () {
		
		print("ÿc4=== [OUTER] ===");
		
		if (!me.inTown) { // this.trist(); doesn't end in town.
			Town.goToTown();
		}
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!getWaypoint(4)) { // black marsh
			Pather.useWaypoint(5);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
			Precast.doPrecast(true);
			
			this.clearToExit(5, 6, 0);
			this.waitForPartyMembers();
			Precast.doPrecast(true);
		
			Pather.goWP(me.area, true);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822

			this.okCount();
			
			this.clickWP();
		} else {
			Pather.useWaypoint(6);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
		}
		
		Precast.doPrecast(true);

		this.clearToExit(6, 7, 0);
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		this.clearToExit(7, 26, 0);
		this.clearToExit(26, 27, 0);
		delay(250);
		this.waitForPartyMembers();
		Precast.doPrecast(true);
	
		Pather.goWP(me.area, true);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
		
		if (Leader) {
			D2Bot.printToConsole("=== OUTER ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.smith = function () {	//260531
		var smith;
		
		print("ÿc4=== [SMITH] ===");
		
		if (me.area !== 27) {
			Town.goToTown();
			
			if (!doneChores) {
				Town.doChores(true);
			}
			
			Pather.useWaypoint(27);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
		}
		
		Precast.doPrecast(true);
		
		this.clearToExit(27, 28, 0);
		
		smith = getPresetUnit(28, 2, 108);
		
		if (smith) {
			tick = getTickCount();
			while (getDistance(me.x, me.y, smith.roomx * 5 + smith.x, smith.roomy * 5 + smith.y) > 15) {
				if (getTickCount() - tick > 180 * 1000) {
					print("Failed to move Smith");
					break;
				}
				
				Pather.moveTo(smith.roomx * 5 + smith.x + myX, smith.roomy * 5 + smith.y + myY, 3, true);	//260822
			}
			
			if (getUnit(1, 402)) {
				try {
					Attack.clear(15, 0, getLocaleString(2889)); // The Smith
				} catch (e) {
					print(e);
					Attack.clear(15);
				}
			} else {
				print("Failed to getUnit Smith");
				return false;
			}
		} else {
			print("Failed to getPreset Smith");
			return false;
		}
		
		Pather.moveTo(smith.roomx * 5 + smith.x + myX, smith.roomy * 5 + smith.y + myY, 3, true);	//260822
		
		this.okCount();
		
		if (Leader) {
			D2Bot.printToConsole("=== SMITH ===", 7);
		}
		
		if (!me.getQuest(3,1)) {
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
				
				this.getQuestItem(89, 108);
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
			
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			
			this.malus();
			
			if (!getWaypoint(6)) {
				if (Leader) {
					Town.move("portalspot");
					Pather.usePortal(28, null);
					Pather.makePortal();
					
					me.overhead("tpReady");
					Messaging.sendToList(Team.Profiles, "tpReady");
				} else {
					while (!tpReady) {
						delay(250);
					}
					
					tpReady = false;
					
					Pather.usePortal(28, null);
				}
			}
		}
		
		doneChores = false;
		
		return true;
	};

	this.malus = function () {
		var i, target;
		
		print("ÿc4=== [MALUS] ===");
		
		if (me.act !== 1 || !me.inTown) {
			Town.goToTown(1);
		}
		
		this.okCount();
		
		if (me.findItem(89)) {
			Town.move("charsi");
			
			target = getUnit(1, "charsi");
			
			while (target && target.openMenu()) {
				me.cancel();
				sendPacket(1, 0x40);
				
				if (me.getQuest(3, 1)) { 
					break;
				}
				
				delay(me.ping * 2 + 200);
			}
		} else {
			for (i = 0 ; i < 100 ; i += 1) {
				sendPacket(1, 0x40);
				
				if (me.getQuest(3, 1)) {
					break;
				}
				
				if (i > 30) {
					print("malus failed");
					scriptBroadcast("quit");	//260909
				}
				
				delay(1000);
			}
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== MALUS ===", 7);
		}
		
		return true;
	};

	this.jail = function () {
		
		print("ÿc4=== [JAIL] ===");

		if (me.area !== 28) {
			if (me.area === 27) {
				Pather.goWP(me.area, true);
				Pather.moveTo(me.x + myX, me.y + myY);	//260822
				this.okCount();
			} else {
				Town.goToTown();
				
				if (!doneChores) {
					Town.doChores(true);
				}
				
				Pather.useWaypoint(27);
				Pather.moveTo(me.x + myX, me.y + myY);	//260822
				this.waitForPartyMembers();
			}
			
			Precast.doPrecast(true);
			
			this.clearToExit(27, 28, 0);
			this.waitForPartyMembers();
			Precast.doPrecast(true);
		}
		
		this.clearToExit(28, 29, 0);
		this.waitForPartyMembers();
		Precast.doPrecast(true);

		Pather.goWP(me.area, true);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
	
		if (Leader) {
			D2Bot.printToConsole("=== JAIL ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.inner = function () {
		
		print("ÿc4=== [INNER] ===");
		
		if (me.area !== 29) {
			Town.goToTown();
			
			if (!doneChores) {
				Town.doChores(true);
			}
			
			Pather.useWaypoint(29);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
		}
		
		Precast.doPrecast(true);

		while (me.area === 29) {
			this.clearToExit(29, 30, 0);
		}
		
		if (me.area === 30) {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.getPortal(1, null)) {
				Pather.makePortal();
			}
		} else {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.usePortal(1, null)) {
				Town.goToTown();
			}
			
			Town.move("portalspot");
			
			while (!Pather.usePortal(30, null)) {
				delay(250);
				
				if (this.playerIn()) {	//260411
					scriptBroadcast("quit");	//260909
				}
			}
		}
		
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		while (me.area === 30) {
			this.clearToExit(30, 31, 0);
		}
		
		if (me.area === 31) {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.getPortal(1, null)) {
				Pather.makePortal();
			}
		} else {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.usePortal(1, null)) {
				Town.goToTown();
			}
			
			Town.move("portalspot");
			
			while (!Pather.usePortal(31, null)) {
				delay(250);
				
				if (this.playerIn()) {	//260411
					scriptBroadcast("quit");	//260909
				}
			}
		}
		
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		while (me.area === 31) {
			this.clearToExit(31, 32, 0);
		}
		
		if (me.area === 32) {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.getPortal(1, null)) {
				Pather.makePortal();
			}
		} else {
			delay(me.ping * 2 + rand(100, 1000));
			
			if (!Pather.usePortal(1, null)) {
				Town.goToTown();
			}
			
			Town.move("portalspot");
			
			while (!Pather.usePortal(32, null)) {
				delay(250);
				
				if (this.playerIn()) {	//260411
					scriptBroadcast("quit");	//260909
				}
			}
		}
		
		this.waitForPartyMembers();

		Pather.goWP(me.area, true);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
		
		if (Leader) {
			D2Bot.printToConsole("=== INNER ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.cathedral = function () {
		
		print("ÿc4=== [CATHEDRAL] ===");
		
		if (me.area !== 32) {
			Town.goToTown();
			
			if (!doneChores) {
				Town.doChores(true);
			}
			
			Pather.useWaypoint(32);
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			this.waitForPartyMembers();
		}
		
		Pather.teleport = false;
		
		Precast.doPrecast(true);

		Pather.moveTo(20047, 4898, 10, true);

		try {
			Attack.clear(25, 0, getLocaleString(2878)); // Bone Ash
		} catch (e) {
			print(e);
			Attack.clear(25);
		}
		
		Pather.moveTo(20047, 4898, 10, true);
		
		//Attack.clear(25);
		
		this.clearToExit(33, 34, 0);
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		this.clearToExit(34, 35, 0);
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		Pather.goWP(me.area, true);
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
		
		if (!this.partyLevel(teleLvl)) {
			runAndy = 1;
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== CATHEDRAL ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.andy = function () {
		print("ÿc4=== [ANDY] ===");
		
		if (runAndy === 0) {
			Town.goToTown();
			
			if (!doneChores) {
				Town.doChores(true);
			}
			
			this.syncBO();
		}
		
		if (!me.getQuest(6, 1) || !this.partyLevel(teleLvl)) {	//260531
			if (me.diff === 0) {
				if (runAndy === 1) {
					this.clearToExit(35, 36, 0);
					this.waitForPartyMembers();
					Precast.doPrecast(true);
					
					this.clearToExit(36, 37, 0);
					this.waitForPartyMembers();
					Precast.doPrecast(true);

					Pather.moveTo(22594, 9641, 10, true);
					Pather.moveTo(22564, 9629, 10, true);
					Pather.moveTo(22533, 9641, 10, true);
				} else {
					if (Leader) {
						Pather.useWaypoint(35);
						Pather.moveToExit([36, 37], true);
						Pather.makePortal();
					} else {
						Town.move("portalspot");

						while (!Pather.usePortal(37, null)) {
							delay(250);
						}
					}
				
					Pather.teleport = false;
					
					this.waitForPartyMembers();
					Precast.doPrecast(true);
					
					Pather.moveTo(22594, 9641, 10, true);
					Pather.moveTo(22564, 9629, 10, true);
					Pather.moveTo(22533, 9641, 10, true);
				}
				
				if (Leader) {
					Pather.makePortal();
				}
				
				this.buffCount(1);

				Precast.doPrecast(true);
			
				Pather.moveTo(22548, 9582, 5, true);
				Pather.moveTo(22548, 9568, 5, true);
			} else {
				if (Leader) {
					this.travel(1);
				}
				
				this.buffCount(1);
				
				if (Leader) {
					Pather.useWaypoint(35);
					Pather.moveToExit([36, 37], true);
					Pather.moveTo(22548, 9520); //Dark-f: this is from running Andy
					Pather.makePortal();
				} else {
					Town.move("portalspot");

					while (!Pather.usePortal(37, null)) {
						delay(250);
					}
				}
				
				Pather.teleport = false;
				
				Attack.clear(20);
			}
			
			try {
				Attack.clear(25, 0, 156); // Andariel
			} catch (e) {
				print(e);
				//Attack.clear(25);
				//throw new Error("Failed to kill Andariel")
			}
			
			delay(me.ping * 2 + 2000); // Wait for minions to die.
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
			
			Pather.teleport = true;
		}
		
		if (!this.partyLevel(teleLvl)) {	//260914
			me.overhead("Not ready to start Act2.");
			scriptBroadcast("quit");	//260909
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== ANDY ===", 7);
		}

		this.changeAct(2);
		
		doneChores = false;
		
		return true;
	};


	this.cube = function () { // Only called in Normal Difficulty.
		var i, chest;

		print("ÿc4=== [CUBE] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (Leader) {
			Pather.useWaypoint(57); // Halls Of The Dead Level 2
			Precast.doPrecast(true);
			Pather.moveToExit(60, true);
			Pather.makePortal();
		} else {
			Town.move("portalspot");

			while (!Pather.usePortal(60, null)) {
				delay(250);
			}
			
			delay(250);
		}

		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		Pather.teleport = false;
		
		//Attack.clear(20);
		
		for (i = 0 ; i < 5 ; i += 1) {
			chest = getPresetUnit(60, 2, 354);

			if (chest) {
				break;
			}

			delay(me.ping * 2 + 250);
		}

		while (getDistance(me.x, me.y, chest.roomx * 5 + chest.x, chest.roomy * 5 + chest.y) > 10) {
			try {
				Pather.moveToPreset(60, 2, 354, 0, 0, 0, false);
			} catch (e) {
				print("Caught Error.");

				print(e);
			}
		}

		Attack.clear(25);
		
		while (!me.findItem(549)) {
			this.getQuestItem(549, 354);
		}
		
		//delay(me.ping * 2 + rand(100, 1000));

		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		delay(me.ping * 2 + 200);
		
		this.okCount();
		
		if (Leader) {
			D2Bot.printToConsole("=== CUBE ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.amulet = function () {
		var cain, drognan;
		
		print("ÿc4=== [AMULET] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.diff === 0) {
			if (Leader) {
				Pather.useWaypoint(44);
				Precast.doPrecast(true);
				Pather.moveToExit([45, 58], true);
				Pather.makePortal();
			} else {
				Town.move("portalspot");

				while (!Pather.usePortal(58, null)) {
					delay(250);
				}
				
				delay(250);
			}
			
			Pather.teleport = false;

			this.waitForPartyMembers();
			Precast.doPrecast(true);

			this.clearToExit(58, 61, 0); // Go to Claw Viper Temple Level 2
			this.waitForPartyMembers();
			Precast.doPrecast(true);
			
			Pather.teleport = true;
			
			if (Leader) {
				Pather.makePortal();
				Pather.moveTo(15044, 14045);
			} else {
				if (!Pather.usePortal(40, null)) {
					Town.goToTown();
				}
			}
		} else if (Leader) {
			Pather.useWaypoint(44);
			Pather.moveToExit([45, 58, 61], true);
			Pather.moveTo(15044, 14045);
			Pather.makePortal();
		}

		if (Leader) {
			this.getQuestItem(521, 149);

			delay(250);

			if (!Pather.usePortal(40, null)) {
				Town.goToTown();
			}
		
			if (me.findItem(521)) {
				Town.move("stash");
				delay(me.ping * 2 + 200);
				Town.openStash();
				Storage.Stash.MoveTo(me.findItem(521));
			}
		}

		Town.move("cain");	//260728
		cain = getUnit(1, NPC.Cain);
		if (cain && cain.openMenu()) {
			me.cancel();
		}

		Town.move("drognan");
		drognan = getUnit(1, "drognan");
		drognan.openMenu();
		me.cancel();

		if (Leader) {
			D2Bot.printToConsole("=== AMULET ===", 7);
		} else  {
			Town.move("portalspot");
		}
		
		doneChores = false;
		
		return true;
	};

	this.summoner = function () { // Teleporting Sorc will be at least level 18 as required by MAIN to reach this stage.
		var time, journal, drognan, i;

		print("ÿc4=== [SUMMONER] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 2 || !me.inTown) {
			Town.goToTown(2);
		}
		
		this.buffCount(2);
		
		if (Leader) {
			Town.move("waypoint");
			
			Pather.useWaypoint(74);
			Precast.doPrecast(true);

			journal = getPresetUnit(74, 2, 357);

			if (!journal) {
				throw new Error("AutoSmurf.summoner: No preset unit in Arcane Sanctuary.");
			}

			while (getDistance(me.x, me.y, journal.roomx * 5 + journal.x + 8, journal.roomy * 5 + journal.y + 8) > 10) {	//260411
				try {
					Pather.moveToPreset(74, 2, 357, 8, 8, false, false);	//260411
				} catch (e) {
					print("Caught Error.");

					print(e);
				}
			}
			
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
			
			Pather.moveTo(me.x - 11, me.y - 11);
		} else {
			Town.move("portalspot");
			
			while (me.inTown) {
				if (tpReady) {
					Pather.usePortal(74, null);
				}
				
				delay(250);
			}
			
			tpReady = false;
		}

		Pather.teleport = false;
		
		try {
			Attack.clear(10, 0, 250);	//Summoner
		} catch (e) {
			print(e);
			//Attack.clear(10);
			//throw new Error("Failed to kill Summoner")
		}
		
		print("Q12/0 " + me.getQuest(12, 0));
		print("Q12/1 " + me.getQuest(12, 1));
		print("Q13/0 " + me.getQuest(13, 0));
		print("Q13/1 " + me.getQuest(13, 1));
		print("Q13/14 " + me.getQuest(13, 14));

		journal = getPresetUnit(74, 2, 357);
		
		Attack.clearList(Attack.scanList(null, {x1: journal.roomx * 5 + journal.x - 10, x2: journal.roomx * 5 + journal.x + 15, y1: journal.roomy * 5 + journal.y - 10, y2: journal.roomy * 5 + journal.y + 15}), null, 1);
		
		Pather.moveToPreset(74, 2, 357, 3, 3);

		this.okCount();
	
		journal = getUnit(2, 357);
		
		for (i = 0; i < 3; i += 1) {
			if (Pather.getPortal(46)) {
				break;
			}
			
			if (journal) {
				sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);

				delay(me.ping * 2 + 1000);

				Misc.click(0, 0);
				//me.cancel();
			}
		}

		delay(me.ping * 2 + 200);
		
		me.cancel();
		
		print("Q12/0 " + me.getQuest(12, 0));
		print("Q12/1 " + me.getQuest(12, 1));
		print("Q13/0 " + me.getQuest(13, 0));
		print("Q13/1 " + me.getQuest(13, 1));
		print("Q13/14 " + me.getQuest(13, 14));

		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Town.move("atma");
		atma = getUnit(1, "atma");
		atma.openMenu();
		me.cancel();
		
		print("atma done");
		
		print("Q12/0 " + me.getQuest(12, 0));
		print("Q12/1 " + me.getQuest(12, 1));
		print("Q13/0 " + me.getQuest(13, 0));
		print("Q13/1 " + me.getQuest(13, 1));
		print("Q13/14 " + me.getQuest(13, 14));

		Town.move("portalspot");
		
		while (!Pather.usePortal(74, null)) {
			delay(me.ping * 2 + 200);
		}
		
		if (Leader) {
			Pather.makePortal();
		}
		
		while (me.area === 74) {
			//me.cancel();
			Pather.usePortal(46);
			delay(me.ping * 2 + 200);
		}
		
		//me.cancel();
		Pather.goWP(me.area);	//260611
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		this.clickWP();
		
		Pather.teleport = true;
		
		if (me.diff === 0) {
			delay(me.ping *2 + 1000);
		} else {
			if (Leader) {
				Pather.makePortal();
				Pather.useWaypoint(40);
			} else {
				var tick = getTickCount();
				
				while (!Pather.usePortal(null, null)) {
					delay(me.ping * 2 + 200);
					
					if (getTickCount() - tick > 3 * 1000) {
						Town.goToTown();
						delay(me.ping * 2 + 100);
						break;
					}
				}
			}
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== SUMMONER ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.tombs = function() {	//260603
		var i, j, chest;

		print("ÿc4=== [TOMBS] ===");
		
		if (me.area !== 46) {
			if (!doneChores) {
				Town.doChores(true);
			}
			
			if (getWaypoint(17)) {
				Pather.useWaypoint(46);
				
				if (Leader) {
					Pather.makePortal();
				}
			} else {
				if (me.act !== 2 || !me.inTown) {
					Town.goToTown(2);
				}
				
				Town.move("portalspot");
				
				while (!Pather.usePortal(46, null)) {
					delay(500);
				}
				
				delay(250);
				this.clickWP();
			}
			
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			
			this.waitForPartyMembers();
			Precast.doPrecast(true);
		}
		
		Pather.teleport = false;
		
		for (i = 66; i <= 72; i += 1) {
			if (this.partyLevel(tombsLvl)) {
				break;
			}
			
			if (i === getRoom().correcttomb) {
				continue;
			}
			
			if (me.area !== 46) {
				if (!me.inTown && !Pather.usePortal(null, null)) {
					Town.goToTown();
				}
				
				Town.doChores();
				Town.move("waypoint");
				Pather.useWaypoint(46);
				this.okCount();
			}
			
			while (me.area === 46) {
				Pather.moveToExit(i, true, true); // Go in the tomb.
			}

			this.okCount();
			Precast.doPrecast(true);
			
			chest = getPresetUnit(me.area, 2, 397);
			
			if (chest) {
				while (getDistance(me.x, me.y, chest.roomx * 5 + chest.x, chest.roomy * 5 + chest.y) > 25) {
					try {
						Pather.moveTo(chest.roomx * 5 + chest.x + myX, chest.roomy * 5 + chest.y + myY, 3, true);	//260822
					} catch (e) {
						print("Caught Error.");
						print(e);
					}
					
					delay(me.ping * 2 + 200);
					
					Packet.flash(me.gid);
				}
				
				Attack.openChests(10);
			} else {
				print("not found chest");
				continue;
			}

			if (chest.x < 5 && chest.y < 30) {
				Attack.clearList(Attack.scanList(null, {x1: chest.roomx * 5 - 25, x2: chest.roomx * 5 + 25, y1: chest.roomy * 5 + 20, y2: chest.roomy * 5 + 60}), null, 1);
			} else if (chest.x < 30 && chest.y < 5) {
				Attack.clearList(Attack.scanList(null, {x1: chest.roomx * 5 + 20, x2: chest.roomx * 5 + 60, y1: chest.roomy * 5 - 25, y2: chest.roomy * 5 + 25}), null, 1);
			} else if (chest.x > 5 && chest.y > 30) {
				Attack.clearList(Attack.scanList(null, {x1: chest.roomx * 5 - 20, x2: chest.roomx * 5 + 20, y1: chest.roomy * 5 + 15, y2: chest.roomy * 5 + 65}), null, 1);
			} else if (chest.x > 30 && chest.y > 5) {
				Attack.clearList(Attack.scanList(null, {x1: chest.roomx * 5 + 15, x2: chest.roomx * 5 + 65, y1: chest.roomy * 5 - 20, y2: chest.roomy * 5 + 20}), null, 1);
			} else {
				print("chest cord error");
				continue;
			}
			
			Precast.doPrecast(true);
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== TOMBS ===", 7);
		}
		
		while (!this.partyLevel(tombsLvl) && me.diff === 0) {
			//print("Not ready to start Duriel.");
			me.overhead("Not ready to start Duriel.");
			
			if (Leader) {
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
			
			delay(10000);
		}
		
		Pather.teleport = true;
		
		Pather.moveTo(me.x + myX, me.y + myY);	//260822
		
		this.okCount();
		
		doneChores = false;
		
		return true;
	};

	this.staff = function () { // Only the Teleporting Sorc does this. She will be at least level 18 as required by MAIN to reach this stage.
		var presetUnit;
		
		print("ÿc4=== [STAFF] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		Pather.useWaypoint(43);

		Precast.doPrecast(true);

		Pather.moveToExit([62, 63, 64], true);
		
		presetUnit = getPresetUnit(64, 2, 356);
		
		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15);

		this.getQuestItem(92, 356);

		Town.goToTown();

		if (me.findItem(92)) {
			Town.move("stash");
			delay(me.ping * 2 + 200);
			Town.openStash();
			Storage.Stash.MoveTo(me.findItem(92));
		}

		if (Leader) {
			D2Bot.printToConsole("=== STAFF ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.radament = function () {
		var i, book, atma, presetUnit,
			pathX = [5106, 5205, 5205, 5214, 5222],
            pathY = [5125, 5125, 5152, 5153, 5181];

		print("ÿc4=== [RADAMENT] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 2 || !me.inTown) {
			Town.goToTown(2);
		}
		
		if (!me.getQuest(9, 1)) {
			if (Leader) {
                if (getWaypoint(10)) {
					Town.move("waypoint");
					this.okCount();
                    Pather.useWaypoint(48);
                } else {
                    while (me.area !== 48) {
                        if (me.area === 47) {
                            try {
                                Pather.moveToExit(48, true);
                            } catch (e2) {
                                print(e2);
                                Town.goToTown(2);
                            }
                        } else if (me.area === 40) {
                            for (i = 0; i < pathX.length; i += 1) {
                                Pather.moveTo(pathX[i], pathY[i]);
                                Packet.flash(me.gid);
                                delay(me.ping * 2 + 200);
							}
							
							this.okCount();
							
                            try {
                                Pather.moveToExit(47, true);
                            } catch (e3) {
                                print(e3);
                                Town.goToTown(2);
                            }
                        }
						
                        Packet.flash(me.gid);
                        delay(me.ping * 2 + 200);
                    }
					
                    this.clickWP();
				}
				
				Pather.moveToExit(49, true);
				
				for (i = 0 ; i < 5 ; i += 1) {
					presetUnit = getPresetUnit(49, 2, 355); // Chest by Radament.
					
					if (presetUnit) {
						break;
					}
					
					delay(me.ping * 2 + 250);
				}
				
				while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 40) {
					try {
						Pather.moveToUnit(presetUnit, 10, 10, false);
					} catch (e) {
						print("Caught Error.");
						print(e);
					}
				}
				
				Pather.makePortal();
				
				me.overhead("tpReady");
				Messaging.sendToList(Team.Profiles, "tpReady");
			} else {
				Town.move("portalspot");
				this.okCount();
				
				while (me.inTown) {
					if (tpReady) {
						Pather.usePortal(49, null);
					}
					
					delay(250);
				}
				
				tpReady = false;
			}

			delay(me.ping * 2 + 200);
			
			Attack.clear(15);
			
			try {
				//Attack.clear(20, 0, 229); // Radament
				Attack.clearList(Attack.scanList(229), null, 1); // Radament
			} catch (e) {
				print(e);
				//throw new Error("Failed to kill Radament")
			}
			
			for (i = 0 ; i < 30 ; i += 1) {	//260806
				if (me.findItem(552)) {
					break;
				}
				
				if (i > 15 && Leader) {
					scriptBroadcast("quit");	//260909
				}
				
				this.getQuestItem(552);
				
				delay(1000);
			}
			
			book = me.findItem(552);
			
			if (book) {
				clickItem(1, book);
				print("ÿc4=== [BOOK] ===");
				D2Bot.printToConsole("!!! BOOK !!!", 8);
			}
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
		}
		
		this.okCount();

		if (Leader) {
			D2Bot.printToConsole("=== RADAMENT ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.duriel = function () {
		var i, orifice, hole, npc;
		
		print("ÿc4=== [DURIEL] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 2 || !me.inTown) {
			Town.goToTown(2);
		}
		
		if (!me.getQuest(14, 1) && !me.getQuest(14, 3) && !me.getQuest(14, 4)) {
			if (Leader) {
				Town.move("waypoint");
				this.okCount();
				
				Pather.useWaypoint(46);
				Precast.doPrecast(true);
				Pather.moveToExit(getRoom().correcttomb, true);

				for (i = 0 ; i < 5 ; i += 1) {
					orifice = getPresetUnit(getRoom().correcttomb, 2, 152);

					if (orifice) {
						break;
					}

					delay(me.ping * 2 + 250);
				}

				while (getDistance(me.x, me.y, orifice.roomx * 5 + orifice.x, orifice.roomy * 5 + orifice.y) > 10) {
					try {
						Pather.moveToPreset(getRoom().correcttomb, 2, 152, 0, 0, false, false);
					} catch (e) {
						print("Caught Error.");

						print(e);
					}
				}

				Pather.makePortal();

				me.overhead("tpReady");
				Messaging.sendToList(Team.Profiles, "tpReady");
			} else {
				Town.move("portalspot");
				this.okCount();
				
				//print("Waiting for Orifice TP.");
				me.overhead("Waiting for Orifice TP.");
				
				while (me.inTown) {
					if (tpReady) {
						Pather.usePortal(getRoom().correcttomb, null);
					}
					
					delay(250);
				}
				
				tpReady = false;
			}
			
			Config.Dodge.Enabled = false;	//260812
			Pather.teleport = false;

			//delay(me.ping * 2 + 250);
			
			//Attack.clear(10);	//260812
			
			orifice = getPresetUnit(getRoom().correcttomb, 2, 152);
			
			Attack.clearList(Attack.scanList(null, {x1: orifice.roomx * 5 + orifice.x - 16, x2: orifice.roomx * 5 + orifice.x + 25, y1: orifice.roomy * 5 + orifice.y - 16, y2: orifice.roomy * 5 + orifice.y + 25}), null, 1);	//260727
		
			Pather.moveToUnit(orifice);

			Precast.doPrecast(true);
			
			Config.Dodge.Enabled = true;	//260812
			
			//print("orifice cleared");	//260910
			
			if (Leader) {
				if (!me.getQuest(10, 0)) { //horadric staff
					print("placeStaff");	//260910
					this.placeStaff();
				}
				
				Pather.makePortal();
			}
			
			//print("before hole");	//260910
			while (!hole) {
				hole = getUnit(2, 100);
				
				Attack.clearList(Attack.scanList(null, {x1: orifice.roomx * 5 + orifice.x - 16, x2: orifice.roomx * 5 + orifice.x + 25, y1: orifice.roomy * 5 + orifice.y - 16, y2: orifice.roomy * 5 + orifice.y + 25}), null, 1);
				
				if (getDistance(me, orifice) > 8) {
					Pather.moveToUnit(orifice);
				}
				
				delay(500);
			}
			//print("after hole");	//260910
			Precast.doPrecast(true);
			
			if (!Pather.usePortal(40, null)) {
				//print("goToTown");	//260910
				Town.goToTown();
			}
			
			//print("okCount");	//260910
			this.okCount();
				
			if (Leader) {
				delay(me.ping * 2 + 3000);
				//print("use hole");	//260910
				Pather.usePortal(getRoom().correcttomb, null);
				
				Pather.useUnit(2, 100, 73);
				
				Pather.makePortal();
			} else {
				//print("Waiting for Duriel TP.");
				me.overhead("Waiting for Duriel TP.");
				
				while (!Pather.usePortal(73, null)) {
					delay(250);
				}
			}
			
			try {
				Attack.clearList(Attack.scanList(211), null, 1);	// Duriel
				//Attack.kill(211);	// Duriel
			} catch (e) {
				print(e);
				//throw new Error("Failed to kill Duriel")
			}
			
			Pather.moveTo(22579, 15706, 3, true);
			Pather.moveTo(22577, 15649, 10);
			Pather.moveTo(22577, 15609, 10);

			npc = getUnit(1, "tyrael");

			if (!npc) {
				return false;
			}

			for (i = 0; i < 5; i += 1) {
				if (getDistance(me, npc) > 3) {
					Pather.moveToUnit(npc);
				}

				npc.interact();
				delay(me.ping * 2 + 1000);
				me.cancel();

				if (Pather.getPortal(null)) {	//260911
					me.cancel();

					break;
				}
			}
			
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
			
			Pather.teleport = true;
		}

		if (Leader) {
			D2Bot.printToConsole("=== DURIEL ===", 7);
		}
		
		this.changeAct(3);

		doneChores = false;
		
		return true;
	};

	this.figurine = function () { // Perform the Golden Bird quest or wait for another character to do so, then drink the potion.
		var alkor, meshif, i, potion,
			tick = getTickCount();

/*	------- SiC-666 NOTES ------
		me.getQuest(20, 6) = ask cain about the jade figurine (persists after talking to cain)
		me.getQuest(20, 2) = Show Meshif the figurine (persists after talking to Meshif)
		me.getQuest(20, 16/19) = Ask cain about golden bird? need to check to see when these turn on. All i know is they are off before finding the figurine.
		me.getQuest(20, 4) = Give golden bird to Alkor
		me.getQuest(20, 1/28) = Return to Alkor for reward. 28 turns on once quest log is opened after reaching this stage.
		me.getQuest(20, 0) = Quest complete.
		me.getQuest(20, 5/12/13) = Quest complete/have potion? (16/19 persist at this stage, but 6/2/4/1 are off)
		me.getQuest(20, 5/12/13/16/19) = persists after drinking potion
	----------------------------
*/
		print("ÿc4=== [FIGURINE] ===");
		
		if (me.act !== 3 || !me.inTown) {
			Town.goToTown(3);
		}
		
		Town.move("cain");
		
		if (me.findItem(546)) { // Have A Jade Figurine.			
			Town.move("meshif");
			meshif = getUnit(1, "meshif");
			meshif.openMenu();
			me.cancel();
		}

		if (me.findItem(547)) { // Have The Golden Bird.			
			Town.move("alkor");
			alkor = getUnit(1, "alkor");
			alkor.openMenu();
			me.cancel();
		}
		
		if (!me.getQuest(20, 1) && !me.getQuest(20, 0)) {
			while (!me.getQuest(20, 1) && !me.getQuest(20, 0)) { // Haven't done the Jade Figurine quest yet. It's possible another character has the Jade Figurine. After checking myself for it and processing if it had it, I should wait here until the "Return to Alkor for reward" stage.
				sendPacket(1, 0x40); // This is likely required to refresh the status of me.getQuest(20, 1) as has been tested with me.getQuest(18, 0) in this.travincal()

				delay(1000);
			}
		}
		
		if (!me.getQuest(20, 0)) {	//260911
			while (leaderFigurine === false) {
				delay(1000);
			}
			
			delay(myPos * 15000 + 1);	//260916
			
			Town.move("alkor");
			alkor = getUnit(1, "alkor");
			
			for (i = 0 ; i < 100 ; i += 1) {
				if (i > 90) {
					D2Bot.printToConsole("Figurine Traffic", 9);
					//D2Bot.restart();
					scriptBroadcast("quit");	//260909
				}
				
				alkor.interact();
				if (alkor && alkor.openMenu()) {
					delay(500);
					me.cancel();
				}			
				
				if (me.findItem(545)) {
					break;
				}
				
				delay(500);
			}
			
			Messaging.sendToList(Team.Profiles, "leaderFigurine");
			
			potion = me.findItem(545);
			
			if (potion) {
				//print("potion");
				clickItem(1, potion);
				D2Bot.printToConsole("!!! POTION !!!", 8);
			}
			
			Town.move("figurine");
			Town.move("ormus");
			Town.move("portalspot");
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
		}

		this.okCount();

		figurine = false;
		leaderFigurine = false;

		if (Leader) {
			D2Bot.printToConsole("=== FIGURINE ===", 7);
		}

		return true;
	};

	
	this.tome = function () { // Teleporting Sorc walks over to Alkor and completes the quest for everyone via exploit.
		var alkor, target;

		print("ÿc4=== [TOME] ===");

		if (!me.findItem(548)) {	//260910
			if (!doneChores) {
				Town.doChores(true);
			}
			
			if (me.act !== 3 || !me.inTown) {
				Town.goToTown(3);
			}
			
			if (!Town.goToTown() || !Pather.useWaypoint(80)) {
				throw new Error("Lam Essen quest failed");
			}

			Precast.doPrecast(true);

			if (!Pather.moveToExit(94, true) || !Pather.moveToPreset(me.area, 2, 193)) {
				throw new Error("Lam Essen quest failed");
			}
			
			Pather.moveToExit(94, true);

			if (!Pather.moveToPreset(me.area, 2, 193)) {	//260815
				Pather.moveToPreset(me.area, 2, 193);
			}

			target = getUnit(2, 193);

			Misc.openChest(target);
			delay(300);

			target = getUnit(4, 548);
			Pickit.pickItem(target);
			Town.goToTown();
		} else {
			print("already have tome");	//260910
		}
		
		Town.move("alkor");

		target = getUnit(1, "alkor");

		while(target && target.openMenu()) {
			me.cancel();
			sendPacket(1, 0x40); //to refresh the status of me.getQuest(17, 0).
			
			if (me.getQuest(17, 0)) { // Have completed Lam Esen's Tome.
				break;
			}
		}
		
		D2Bot.printToConsole("=== TOME ===", 7);
		
		doneChores = false;
		
		return true;
	};

	this.eye = function () {
		var presetUnit;
		
		print("ÿc4=== [EYE] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!me.inTown) {
			Town.goToTown();
		}

		Pather.useWaypoint(76);
		Precast.doPrecast(true);
		Pather.moveToExit(85, true);

		presetUnit = getPresetUnit(85, 2, 407);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15);

		this.getQuestItem(553, 407);

		Town.goToTown();

		if (me.findItem(553)) {
			Town.move("stash");
			delay(me.ping * 2 + 200);
			Town.openStash();
			Storage.Stash.MoveTo(me.findItem(553));
			me.cancel();
		}

		if (Leader) {
			D2Bot.printToConsole("=== EYE ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.heart = function () {
		var presetUnit;
		
		print("ÿc4=== [HEART] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!me.inTown) {
			Town.goToTown();
		}

		Pather.useWaypoint(80);
		Precast.doPrecast(true);
		Pather.moveToExit([92, 93], true);

		presetUnit = getPresetUnit(93, 2, 405);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15);

		this.getQuestItem(554, 405);

		Town.goToTown();

		if (me.findItem(554)) {
			Town.move("stash");
			delay(me.ping * 2 + 200);
			Town.openStash();
			Storage.Stash.MoveTo(me.findItem(554));
			me.cancel();
		}

		if (Leader) {
			D2Bot.printToConsole("=== HEART ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.brain = function () {
		var presetUnit;
		
		print("ÿc4=== [BRAIN] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!me.inTown) {
			Town.goToTown();
		}

		Pather.useWaypoint(78);
		Precast.doPrecast(true);
		Pather.moveToExit([88, 89, 91], true);
	
		presetUnit = getPresetUnit(91, 2, 406);

		if (!presetUnit) {
			return false;
		}

		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15);
	
		this.getQuestItem(555, 406);

		Town.goToTown();

		if (me.findItem(555)) {
			Town.move("stash");
			delay(me.ping * 2 + 200);
			Town.openStash();
			Storage.Stash.MoveTo(me.findItem(555));
			me.cancel();
		}

		if (Leader) {
			D2Bot.printToConsole("=== BRAIN ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.travincal = function () {
		var cain, presetUnit;
		
		print("ÿc4=== [TRAVINCAL] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 3 || !me.inTown) {
			Town.goToTown(3);
		}
		
		//Pather.moveTo(5148 + myX, 5066 + myY, 5);	//260822
		
		if (!me.getQuest(21, 0)) {
			while (!cain || !cain.openMenu()) { // Try more than once to interact with Deckard Cain.
				Packet.flash(me.gid);
				Town.move("cain");
				cain = getUnit(1, NPC.Cain);	//260728
				delay(1000);
			}
			
			me.cancel();
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
		}
		
		this.okCount();
		
		if (Leader) { // I am the Teleporting Sorc, open a portal to Travincal next to the High Council.
			this.offEquip();
		
			Pather.useWaypoint(83);
			Precast.doPrecast(true);

			presetUnit = getPresetUnit(83, 2, 237);

			if (!presetUnit) {
				print("!presetUnit");
				return false;
			}

			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + 121, presetUnit.roomy * 5 + presetUnit.y - 92);
			
			Pather.makePortal();
		} else { // I am not a Sorc, enter the Sorc's Travincal portal.
			Town.move("portalspot");

			while (!Pather.usePortal(83, null)) {
				delay(250);
			}
		}
		
		presetUnit = getPresetUnit(83, 2, 237);

		if (!presetUnit) {
			print("!presetUnit");
			return false;
		}

		Pather.teleport = false;
		
		Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 108, x2: presetUnit.roomx * 5 + presetUnit.x + 129, y1: presetUnit.roomy * 5 + presetUnit.y - 102, y2: presetUnit.roomy * 5 + presetUnit.y - 81}), null, 1);
		Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 89, x2: presetUnit.roomx * 5 + presetUnit.x + 108, y1: presetUnit.roomy * 5 + presetUnit.y - 102, y2: presetUnit.roomy * 5 + presetUnit.y - 86}), null, 1);
		Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 68, x2: presetUnit.roomx * 5 + presetUnit.x + 89, y1: presetUnit.roomy * 5 + presetUnit.y - 102, y2: presetUnit.roomy * 5 + presetUnit.y - 81}), null, 1);
		Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 89, x2: presetUnit.roomx * 5 + presetUnit.x + 108, y1: presetUnit.roomy * 5 + presetUnit.y - 86, y2: presetUnit.roomy * 5 + presetUnit.y - 81}), null, 1);
		
		Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 63, x2: presetUnit.roomx * 5 + presetUnit.x + 140, y1: presetUnit.roomy * 5 + presetUnit.y - 81, y2: presetUnit.roomy * 5 + presetUnit.y - 65}), null, 1);
		
		//Attack.clearList(Attack.scanList([345, 346, 347], {x1: presetUnit.roomx * 5 + presetUnit.x + 63, x2: presetUnit.roomx * 5 + presetUnit.x + 140, y1: presetUnit.roomy * 5 + presetUnit.y - 102, y2: presetUnit.roomy * 5 + presetUnit.y - 65}), null, 1); // Kill the High Council
		
		var unit = getUnit(4, 546);
		
		if (unit) {
			this.getQuestItem(546);
		}
		
		Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + 109 + myX, presetUnit.roomy * 5 + presetUnit.y - 95 + myY);	//260822
		
		this.okCount();

		Pather.teleport = true;
		
		if (me.findItem(546) || me.findItem(547)) { // Have A Jade Figurine or The Golden Bird or need to Return to Alkor for Reward (possible if someone's Pickit then Town processes the Quest). Tell the Teleporting Sorc so she gets us to process it.
			Messaging.sendToList(Team.Profiles, "figurine");
			
			figurine = true;
			leaderFigurine = true;
		}
		
		if (Leader && !me.getQuest(18, 0)) { // I am the Teleporting Sorc and I have not completed Khalim's Will yet. Will smash the orb while the others keep the area clear.
			this.getQuestItem(173); // Pick up Khalim's Flail.

			this.cubeFlail(); // Make Khalim's Will if I have the ingredients.

			this.equipFlail(); // This function purposely throws an error if Khalim's Will isn't present or is lost in the process.
			
			Config.PacketCasting = 1;

			this.placeFlail();
		} else { // I am not the Teleporting Sorc or Khalim's Will has been completed. If it the latter is true the while loop on the next line will be skipped.
			while (!me.getQuest(18, 0)) { // I am not the Teleporting Sorc and have not completed Khalim's Will yet.
				sendPacket(1, 0x40); // This is required to refresh the status of me.getQuest(18, 0). Without it, me.getQuest(18, 0) will not == 1 until the Quest Tab is opened on the character.

				Attack.clearList(Attack.scanList(null, {x1: presetUnit.roomx * 5 + presetUnit.x + 68, x2: presetUnit.roomx * 5 + presetUnit.x + 129, y1: presetUnit.roomy * 5 + presetUnit.y - 102, y2: presetUnit.roomy * 5 + presetUnit.y - 86}), null, 1);

				Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + 109, presetUnit.roomy * 5 + presetUnit.y - 95);
				
				delay(1000);
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		if (Leader) {
			Equip.autoEquip(); // For Leader to re-equip her weapon.
		}

		Town.move("cain");
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		this.okCount();
		
		doneChores = false;
		
		return true;
	};

	this.mephisto = function (takeRedPortal) {
		var cain, i, redPortal;
		
		if (takeRedPortal === undefined) {
			takeRedPortal = false;
		}

		print("ÿc4=== [MEPHISTO] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		if (!takeRedPortal) {
			this.syncBO();
		}
		
		if (Leader) { // I am the Teleporting Sorc.
			Pather.useWaypoint(101);
			Precast.doPrecast(true);
			Pather.moveToExit(102, true);
			Pather.moveTo(17566, 8069);
			Pather.makePortal();
		} else {
			if (me.act !== 3 || !me.inTown) {
				Town.goToTown(3);
			}
			
			Town.move("cain");

			cain = getUnit(1, NPC.Cain);	//260728

			if (!cain || !cain.openMenu()) {
				return false;
			}

			me.cancel();

			Town.move("portalspot");

			while (!Pather.usePortal(102, null)) {
				delay(250);
			}
		}

		if (!takeRedPortal) {
			Pather.teleport = false;
			
			try {
				Attack.clearList(Attack.scanList(242), null, 1);	// Mephisto
				//Attack.kill(242);	// Mephisto
			} catch (e) {
				print(e);
				//throw new Error("Failed to kill Mephisto")
			}
			
			Pather.moveTo(17515 + myX, 8061 + myY, 3, true);	//260822
			Attack.clear(35);
			
			Pather.teleport = true;
		}

		if ((me.getQuest(22, 0) || me.getQuest(22, 12))) {
			for (i = 0 ; i < 5 ; i += 1) {
				redPortal = getPresetUnit(102, 2, 342);

				if (redPortal) {
					break;
				}

				delay(me.ping * 2 + 250);
			}

			while (getDistance(me.x, me.y, redPortal.roomx * 5 + redPortal.x, redPortal.roomy * 5 + redPortal.y) > 10) {
				try {
					Pather.moveToPreset(102, 2, 342, 0, 0, false, false);
				} catch (e) {
					print("Caught Error.");

					print(e);
				}
			}

			while (me.area === 102) {
				redPortal = getUnit(2, 342);
				Pather.usePortal(null, null, redPortal); // Go to Act 4.
				delay(me.ping * 2 + 1000);
			}
		} else {
			Town.goToTown();
			D2Bot.printToConsole("Mephisto quest failed", 5);
		}

		delay(me.ping * 2 + 500);

		if (Leader && !takeRedPortal) {
			D2Bot.printToConsole("=== MEPHISTO ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.izual = function () {
		var tyrael, presetUnit;
		
		print("ÿc4=== [IZUAL] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 4 || !me.inTown) {
			Town.goToTown(4);
		}

		if (!me.getQuest(25, 1)) {
			if (Leader) {
				Pather.useWaypoint(106);
				Precast.doPrecast(true);
				Pather.moveToExit(106, true);

				presetUnit = getPresetUnit(105, 1, 256);

				if (!presetUnit) {
					return false;
				}

				Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y, 15);
				Pather.makePortal();
				
				me.overhead("tpReady");
				Messaging.sendToList(Team.Profiles, "tpReady");
			} else {
				Town.move("portalspot");
				
				while (me.inTown) {
					if (tpReady) {
						Pather.usePortal(105, null);
					}
					
					delay(250);
				}
				
				tpReady = false;
			}
			
			Pather.teleport = false;
			
			delay(me.ping * 2 + 200);
			
			Attack.clear(20);
			
			try {
				//Attack.clear(30, 0, 256);	// Izual
				Attack.clearList(Attack.scanList(256), null, 1);	// Izual
			} catch (e) {
				print(e);
			}
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
		
			Pather.teleport = true;
		}
		
		this.okCount();

		Town.move("tyrael");

		tyrael = getUnit(1, "tyrael");

		tyrael.openMenu();

		me.cancel();

		if (Leader) {
			D2Bot.printToConsole("=== IZUAL ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.diablo = function () {
		// general functions
		this.getLayout = function (seal, value) {
			var sealPreset = getPresetUnit(108, 2, seal);

			if (!seal) {
				throw new Error("Seal preset not found. Can't continue.");
			}

			if (sealPreset.roomy * 5 + sealPreset.y === value || sealPreset.roomx * 5 + sealPreset.x === value) {
				return 1;
			}

			return 2;
		};

		this.initLayout = function () {
			this.vizLayout = this.getLayout(396, 5275);
			this.seisLayout = this.getLayout(394, 7773);
			this.infLayout = this.getLayout(392, 7893);
		};

		this.openSeal = function (classid) {
			var i, seal;
			
			seal = getUnit(2, classid);
			for (i = 0; i < 5; i += 1) {
				Pather.moveToPreset(me.area, 2, classid, classid === 394 ? 5 : 2, classid === 394 ? 5 : 0);
				
				if (!seal) {
					return false;
				}

				if (seal.mode) { // Other player opened Seal already.
					return true;
				}
				
				seal.interact();

				delay(classid === 394 ? 1000 : 500); // De Seis optimization

				if (!seal.mode) {
					if (classid === 394 && Attack.validSpot(seal.x - 5, seal.y)) { // De Seis optimization
						Pather.moveTo(seal.x - 5, seal.y);
					} else if (classid === 394 && Attack.validSpot(seal.x + 5, seal.y)) { // eom
						Pather.moveTo(seal.x + 5, seal.y);
					} else {
						Pather.moveTo(seal.x - 5, seal.y - 5);
					}
					delay(500);
				} else {
					return true;
				}
			}
		
			return false;
		};

		this.getBoss = function (name) {
			var i, boss,
				glow = getUnit(2, 131);

			for (i = 0; i < 50; i += 1) {
				boss = getUnit(1, name);
				
				if (boss) {
					return Attack.clear(35);
				}

				delay(Math.max(me.ping * 2, 200));
			}

			return !!glow;
		};

		this.seisSeal = function () {
			//print("Seis layout " + this.seisLayout);
			me.overhead("Seis layout " + this.seisLayout);

			this.followPath(this.seisLayout === 1 ? this.starToSeisA : this.starToSeisB);
			
			Precast.doPrecast(true);

			this.okCount();
			
			if (this.seisLayout === 1) {
				Pather.moveTo(7815, 5160, 5, true);	//260623
				Pather.moveTo(7815, 5195, 5, true);	//260623
				Pather.moveTo(7775, 5200, 5, true);	//260623
			} else {
				Pather.moveTo(7775, 5160, 5, true); //(7798, 5186); (7798, 5206)
			}
			
			if (Leader) {
				Pather.teleport = true;
				
				if (this.seisLayout === 1) {
					Pather.moveTo(7780, 5155, 5, true);
				} else {
					Pather.moveTo(7810, 5155, 5, true);
				}
				
				this.openSeal(394);
				
				if (this.seisLayout === 1) {
					Pather.moveTo(7775, 5210, 5, true); //(7771, 5196); (7771, 5216)
				} else {
					Pather.moveTo(7775, 5160, 5, true); //(7798, 5186); (7798, 5206)
				}
				
				Pather.teleport = false;
			}
			
			if (!this.getBoss(getLocaleString(2852))) {
				//print("Seis not found");
				me.overhead("Seis not found");
				
				if (Leader) {
					D2Bot.printToConsole("Seis not found");
				}
				return false;
			}
			
			try {
				Attack.clear(35, 0, getLocaleString(2852));
			} catch (e) {
				print(e);
				Attack.clear(35);
			}
			
			Precast.doPrecast(true);
			
			return true;
		};

		this.infectorSeal = function () {
			//print("Inf layout " + this.infLayout);
			me.overhead("Inf layout " + this.infLayout);

			this.followPath(this.infLayout === 1 ? this.starToInfA : this.starToInfB);
			
			Precast.doPrecast(true);

			this.okCount();
			
			if (Leader) {
				Pather.teleport = true;
				this.openSeal(393);
				this.openSeal(392);
				
				if (this.infLayout === 1) {
					Pather.moveTo(7890, 5295, 5, true);
				} else {
					Pather.moveTo(7935, 5295, 5, true);
				}
				
				Pather.teleport = false;
			} else {
				if (this.infLayout === 1) {
					Pather.moveTo(7890, 5295, 5, true);
				} else {
					Pather.moveTo(7935, 5295, 5, true);
				}
			}
			
			this.getBoss(getLocaleString(2853));
			
			try {
				Attack.clear(35, 0, getLocaleString(2853));
			} catch (e) {
				print(e);
				Attack.clear(35);
			}
			
			Precast.doPrecast(true);

			return true;
		};

		this.vizierSeal = function () {
			//print("Viz layout " + this.vizLayout);
			me.overhead("Viz layout " + this.vizLayout);

			this.followPath(this.vizLayout === 1 ? this.starToVizA : this.starToVizB);
			
			Precast.doPrecast(true);

			this.okCount();
			
			if (Leader) {
				Pather.teleport = true;
				this.openSeal(395);
				this.openSeal(396);
				
				if (this.vizLayout === 1) {
					Pather.moveTo(7680, 5295, 5, true);
				} else {
					Pather.moveTo(7675, 5315, 5, true);
				}
				
				Pather.teleport = false;
			} else {
				if (this.vizLayout === 1) {
					Pather.moveTo(7680, 5295, 5, true);
				} else {
					Pather.moveTo(7675, 5315, 5, true);
				}
			}
			
			this.getBoss(getLocaleString(2851));
			
			try {
				Attack.clear(35, 0, getLocaleString(2851));
			} catch (e) {
				print(e);
				Attack.clear(35);
			}
			
			return true;
		};

		this.diabloPrep = function () {
			var diabloTrap,
				tick = getTickCount();

			while (getTickCount() - tick < 30000) {
				if (getTickCount() - tick > 0) {
					if (getUnit(1, 243)) {
						return true;
					}

					switch (me.classid) {
					case 1: // Sorceress
						if ([51, 56, 59, 64].indexOf(Config.AttackSkill[1]) > -1) {
							if (me.getState(121)) {
								delay(500);
							} else {
								Skill.cast(Config.AttackSkill[1], 0, 7793 + rand(-1, 1), 5293 + rand(-1, 1));	//skillcast
							}

							break;
						}

						delay(500);

						break;
					case 3: // Paladin
						Skill.setSkill(Config.AttackSkill[2]);

						Skill.cast(Config.AttackSkill[1], 1);

						break;
					case 5: // Druid
						if (Config.AttackSkill[1] === 245) {
							Skill.cast(Config.AttackSkill[1], 0, 7793 + rand(-1, 1), 5293 + rand(-1, 1));	//skillcast

							break;
						}

						if (me.getSkill(249, 1)) { // Armageddon
							Skill.cast(249, 0);
						}

						delay(500);

						break;
					case 6: // Assassin
						if (Config.UseTraps) {
							diabloTrap = ClassAttack.checkTraps({x: 7793, y: 5293});

							if (diabloTrap) {
								ClassAttack.placeTraps({x: 7783, y: 5290}, 1);
								delay(150);
								ClassAttack.placeTraps({x: 7787, y: 5300}, 1);
								delay(150);
								ClassAttack.placeTraps({x: 7799, y: 5301}, 1);
								delay(150);
								ClassAttack.placeTraps({x: 7802, y: 5289}, 1);
								delay(150);
								ClassAttack.placeTraps({x: 7793, y: 5282}, 1);

								break;
							}
						}
						
						if (me.getSkill(256, 1)) { // shock-web
							Skill.cast(256, 0, 7793 + rand(-1, 1), 5293 + rand(-1, 1));	//skillcast
							
							break;
						}
						
						delay(500);

						break;
					default:
						delay(500);

						break;
					}
				}

				if (getUnit(1, 243)) {
					return true;
				}
			}

			//print("Diablo not found");
			me.overhead("Diablo not found");
			
			if (Leader) {
				D2Bot.printToConsole("Diablo not found");
			}
			return false;
		};

		this.followPath = function (path) {
			var i;
				
			for (i = 0; i < path.length; i += 2) {
				Pather.moveTo(path[i] + myX, path[i + 1] + myY, 3, true);	//260822
			}
		};

		// path coordinates
		this.entranceToStar = [7790,5520, 7790,5510, 7790,5500, 7790,5490, 
								7790,5480, 7780,5480, 7770,5480, 7770,5470, 
								7770,5460, 7770,5450, 7770,5440, 7770,5430, 
								7770,5420, 7780,5420, 7790,5420, 7800,5420, 
								7810,5420, 7820,5420, 7820,5410, 7820,5400, 
								7820,5390, 7820,5380, 7820,5370, 7820,5360, 
								7810,5360, 7800,5360, 7790,5360, 7780,5360, 
								7770,5360, 7770,5350, 7770,5340, 7770,5330, 
								7770,5320, 7770,5310];

		this.starToSeisA = [7815,5230, 7775,5230, 7775,5190, 7815,5190,
							7815,5150, 7785,5155];

		this.starToSeisB = [7775,5230, 7815,5230, 7815,5190, 7775,5190,
							7775,5150, 7805,5155];

		this.starToInfA = [7825,5295, 7850,5275, 7850,5315, 7930,5293,
							7885,5295];

		this.starToInfB = [7825,5295, 7855,5310, 7855,5275, 7930,5275,
							7920,5315];
		// A=Y						
		this.starToVizA = [7755,5290, 7720,5275, 7710,5315, 7660,5275,
							7660,5315];
		// B=L
		this.starToVizB = [7755,5290, 7720,5275, 7710,5315, 7660,5315,
							7655,5280];

		// start
		
		print("ÿc4=== [DIABLO] ===");
		
		Town.goToTown(4);
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(107);
			Precast.doPrecast(true);
			Pather.moveTo(7790, 5240, 10); // 7660, 5275
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			if (me.act !== 4 || !me.inTown) {
				Town.goToTown(4);
			}
			
			Town.move("portalspot");
			this.okCount();
			
			while (me.inTown) {
				if (tpReady) {
					Pather.usePortal(108, null);
				}
				
				delay(250);
			}
			
			tpReady = false;
		}
		
		Pather.teleport = false;

		Attack.clear(25);

		this.initLayout();

		//print("Started at Star.");

		this.seisSeal();
		
		Pather.moveTo(7790 + myX, 5290 + myY, 5, true);	//260822

		this.okCount();
		
		this.infectorSeal();
		
		Pather.moveTo(7790 + myX, 5290 + myY, 5, true);	//260822

		this.okCount();
		
		this.vizierSeal();

		Pather.teleport = true;
		
		switch (me.classid) {
		case 1:
			Pather.moveTo(7778, 5292, 5, true);
			if (getDistance(me.x, me.y, 7778, 5292) > 20) {
				Pather.walkTo(7778, 5292);
			}
			break;
		case 2:
		case 6:
			Pather.moveTo(7798, 5292, 5, true);
			break;
		case 3:
			Pather.moveTo(7791, 5297, 5, true);
			break;
		default:
			Pather.moveTo(7788, 5292, 5, true);
			break;
		}
		
		Pather.teleport = false;
		
		this.diabloPrep();
		
		try {
			Attack.clearList(Attack.scanList(243), null, 1); // Diablo
			//Attack.kill(243); // Diablo
		} catch (e) {
			print(e);
		}
		
		runDiablo = 1;
		
		if (Leader && !me.getQuest(28, 0)) {
			D2Bot.printToConsole("=== DIABLO ===", 7);
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		doneChores = false;
		
		return true; // Continue to Act 5 in expansion.
	};

	this.shenk = function () { // SiC-666 TODO: Rewrite this.
	
		print("ÿc4=== [SHENK] ===");
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.getQuest(35, 1)) {
			return true;
		}
		
		if (Leader) {
			if (!Pather.useWaypoint(111)) {
				throw new Error();
			}
			
			Pather.moveTo(3883, 5113, 5);
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			if (me.act !== 5 || !me.inTown) {
				Town.goToTown(5);
			}
			
			Town.move("portalspot");
			
			while (me.inTown) {
				if (tpReady) {
					Pather.usePortal(110, null);
				}
				
				delay(250);
			}
			
			tpReady = false;
		}
		
		Attack.clear(15);
		
		try {
			Attack.clear(20, 0, getLocaleString(22435)); // Shenk the Overseer
		} catch (e) {
			print(e);
			//throw new Error("Failed to kill Shenk")
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== SHENK ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.barbs = function() { // SiC-666 TODO: Rewrite this.
		var i, k, qual, door, tick,
			coords =[],
			barbSpots = [];
	
		print("ÿc4=== [BARBS] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (!me.getQuest(36,1) && Leader) {
			Pather.useWaypoint(111);
			Precast.doPrecast(true);
			barbSpots = getPresetUnits (me.area, 2, 473);

			if (!barbSpots) {
				return false;
			}
			
			for (i = 0 ; i < barbSpots.length ; i += 1) {
				coords.push({
					x: barbSpots[i].roomx * 5 + barbSpots[i].x - 3, //Dark-f: x-3
					y: barbSpots[i].roomy * 5 + barbSpots[i].y
				});
			}
			
            //Config.PacketCasting = 1;
			
			for (k = 0 ; k < coords.length ; k += 1) {
				//print("going to barbspot "+(k+1)+"/"+barbSpots.length);
				me.overhead("going to barbspot "+(k+1)+"/"+barbSpots.length);
				
				Pather.moveToUnit(coords[k], 0, 0);
				door = getUnit(1, 434);
				if (door) {
					Pather.moveToUnit(door, -5, 0);
					for (i = 0 ; i < 100 && door.hp ; i += 1) {
						if (me.getSkill(47, 1)) {	//fire ball
							Skill.cast(47, 0, door.x, door.y);
							delay(10);
						}
						
						if (!me.getSkill(47, 1) && me.getSkill(53, 1)) {	//chain lightning
							Skill.cast(53, 0, door.x, door.y);
							delay(10);
						}
						
						if (me.getSkill(51, 1) && me.getSkill(52, 1)) {	//fire wall
							Skill.cast(51, 0, door.x, door.y);
							delay(10);
						}
						
						if (me.getSkill(55, 1)) {	//glacial spike
							Skill.cast(55, 0, door.x, door.y);
							delay(10);
						}
						
						if (me.getSkill(64, 1)) {	//frozen orb
							Skill.cast(64, 0, door.x, door.y);
							delay(10);
						}
						
						delay(me.ping * 2 + 200);
                    }
				}
			}
		} else {
			Town.move("qual-kehk");
		}
		
		//260531
		tick = getTickCount();
		
		while (!me.getQuest(36,1)) {
			if (Leader && getTickCount() - tick > 10 * 1000) {
				break;
			}
			
			sendPacket(1, 0x40); // Refresh quest status
			
			delay(me.ping * 2 + 200); //barb going to town...
		}
		
		if (Leader) {
			Town.goToTown();		
			Town.move("qual-kehk");
		}
		
		qual = getUnit(1, "qual-kehk");
		
		for (i = 0 ; i < 10 ; i += 1) {
			if (i > 5) {
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}
			
			qual.interact();
			if (qual && qual.openMenu()) {
				delay(me.ping * 2 + 200);
				me.cancel();
			}
			
			sendPacket(1, 0x40); //fresh Quest state.
			
			if (me.getQuest(36,0)) {
				break;
			}
			
			delay(me.ping * 2 + 200);
		}
		
		if (Leader) {
			D2Bot.printToConsole("=== BARBS ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.anya = function () { // Dark-f: Rewrite this.
		var i, anya, malah, scroll, unit, waitAnya, larzuk;
	
		print("ÿc4=== [ANYA] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (me.act !== 5 || !me.inTown) {
			Town.goToTown(5);
		}
		
		Town.move("malah");
		malah = getUnit(1, "malah");
		malah.openMenu();
		me.cancel();

		if (!me.getQuest(37, 1)) {
			//print("anya start");	//260910
			if (Leader) {
				Pather.useWaypoint(113); 
				Precast.doPrecast(true);
				
				while (me.area !== 114) {	//260628
					Pather.moveToExit(114, true);
				}
				
				if (me.diff === 2 && getUnit(1, 639)) {	//260627
					print("Souls found");
					scriptBroadcast("quit");	//260909
				}
				
				while (true) {
					unit = getPresetUnit(me.area, 2, 460);
					Pather.moveToUnit(unit, 10, 10, false);
					
					anya = getUnit(2, 558);	
					if (anya && getDistance(me, anya) < 50) {
						break;
					}
				}
				
				if (me.diff === 2 && getUnit(1, 639)) {	//260910
					print("Souls found");
					scriptBroadcast("quit");	//260909
				}
				
				Pather.makePortal();
				
				me.overhead("tpReady");
				Messaging.sendToList(Team.Profiles, "tpReady");
			} else {
				Town.move("portalspot");
				
				while (me.inTown) {
					if (tpReady) {
						Pather.usePortal(114, null);
					}
					
					delay(250);
				}
				
				tpReady = false;
			}
			
			Attack.clear(25);
			
			unit = getPresetUnit(me.area, 2, 460); // don't delete this // eom
			Pather.moveToUnit(unit, 0, 0, false);
			
			Pather.moveTo(me.x + myX, me.y + myY);	//260822
			
			anya = getUnit(2, 558);
			if (anya) {
				if (Leader) {
					delay(500);
					Pather.moveToUnit(anya);
					for (i = 0; i < 3; i += 1) {
						if (getDistance(me, anya) > 3) {
							Pather.moveToUnit(anya);
						}
						anya.interact();
						//delay(300 + me.ping);
						delay(me.ping * 2 + 200);
						me.cancel();
					}

					if (!Pather.usePortal(109, null)) {
						Town.goToTown();
					}
					
					Town.move("malah");
					malah = getUnit(1, "malah");
					for (i = 0 ; i < 100 ; i += 1) {
						if (i > 5) {
							break;
						}
						
						malah.interact();
						
						if (malah && malah.openMenu()) {
							delay(500);
							me.cancel();
						}						
						
						if (me.findItem(644)) {
							break;
						}
						
						delay(500);
					}
					
					Town.move("portalspot");
					Pather.usePortal(114, null);
					Pather.makePortal();
				}
			}

			this.okCount();
			
			if (me.findItem(644)) {
				for (i = 0; i < 3; i += 1) {
					if (getDistance(me, anya) > 3) {
						Pather.moveToUnit(anya);
					}
					
					anya.interact();
					//delay(1000 + me.ping);
					delay(me.ping * 2 + 1000);
					me.cancel();
				}
			} else {
				delay(5000);
			}
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
			
			//260531
			Town.move("larzuk");
			larzuk = getUnit(1, "larzuk");
			
			larzuk.interact();
			if (larzuk && larzuk.openMenu()) {
				delay(me.ping * 2 + 200);
				//print("clear inventory: " + larzuk.openMenu());
				Town.clearInventory();
				delay(me.ping * 2 + 200);
				me.cancel();
			}
			
			Town.move("malah");
			
			malah = getUnit(1, "malah");
			for (i = 0 ; i < 100 ; i += 1) {
				if (i > 10) {
					//D2Bot.restart();
					scriptBroadcast("quit");	//260909
				}
				
				malah.interact();
				if (malah && malah.openMenu()) {
					delay(500);
					me.cancel();
				}
				
				if (me.findItem(646)) {
					break;
				}
				
				delay(500);
			}
		}

		scroll = me.findItem(646);
		if (scroll) {
			//print("scroll");
			clickItem(1, scroll);
			D2Bot.printToConsole("!!! SCROLL !!!", 8);
		}
		
		Town.move("anya");
		
		anya = getUnit(1, "anya");
		
		if (!anya) {
			for (waitAnya = 0; waitAnya < 30; waitAnya += 1) {
				delay(1000);
				anya = getUnit(1, "anya");
				
				if (anya) {
					//print("found anya");	//260910
					break;
				}
			}
		}
		
		if (anya) {
			//print("meet anya");	//260910
			Town.move("anya");
			anya.openMenu();
			me.cancel();
		}
		
		//print("anya cleared");	//260910
		
		Town.move("waypoint");
		Pather.moveTo(me.x + myX, me.y + myY);	//260822

		//this.okCount();

		if (Leader) {
			D2Bot.printToConsole("=== ANYA ===", 7);
		}
		
		doneChores = false;
		
		return true;
	};

	this.ancients = function () { // SiC-666 TODO: Rewrite this.

		print("ÿc4=== [ANCIENTS] ===");

		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (Leader) {
			Pather.useWaypoint(118);
			Pather.moveToExit(120, true);
			Pather.makePortal();
		} else {
			if (me.act !== 5 || !me.inTown) {
				Town.goToTown(5);
			}
			
			Town.move("portalspot");
			while(!Pather.usePortal(120, null)) {
				delay(1000);
			}
		}

		delay(me.ping * 2 + 1000);
		
		Pather.moveTo(10048 + myX, 12634 + myY);	//260822
	
		Precast.doPrecast(true);
		
		this.okCount();
		
		while (!me.getQuest(39,0)) {
			var altar = getUnit(2, 546);
		
			if (altar && Leader) {	//260724
				while (altar.mode !== 2) {
					Pather.moveToUnit(altar);
					altar.interact();
					delay(me.ping * 2 + 2000);
					me.cancel();
				}
			}

			while (!getUnit(1, 542)) {
				delay(250);
				//me.cancel();
			}
			
			Attack.clearList(Attack.scanList(null), null, 1);	//260722
			
			delay(me.ping * 2 + 1000);
			me.cancel();
			sendPacket(1, 0x40); //fresh Quest state.
			
			if (!me.getQuest(39,0)) {	//260719
				if (getUnit(1, 541)) {
					Attack.clearList(Attack.scanList(541), null, 1);	//260723
					//Attack.kill(541);
				}
				
				if (getUnit(1, 542)) {
					Attack.clearList(Attack.scanList(542), null, 1);	//260723
					//Attack.kill(542);
				}
				
				if (getUnit(1, 540)) {
					Attack.clearList(Attack.scanList(540), null, 1);	//260723
					//Attack.kill(540);
				}
				
				delay(me.ping * 2 + 1000);
				me.cancel();
				sendPacket(1, 0x40); //fresh Quest state.
			}
			
			Pather.moveTo(10048 + myX, 12634 + myY);	//260822
			
			Precast.doPrecast(true);
			
			this.okCount();
			
			me.cancel();
		}

		if (Leader) {
			D2Bot.printToConsole("=== ANCIENTS ===", 7);
		}
		
		if (Leader) {
			Misc.click(0, 0);
			me.cancel();	//260916
			Pather.makePortal();
			Pather.moveToExit([128, 129], true);
			this.clickWP();
			Pather.useWaypoint(109);
		} else {
			delay(me.ping * 2 + 5000);
			
			if (!Pather.usePortal(null, null)) {
				Town.goToTown();
			}
		}

		doneChores = false;
		
		return true;
	};

	this.baal = function () { // SiC-666 TODO: Rewrite this.
		var portal, resetTrap;
		
		this.preattack = function () {
			var baalTrap;

			switch (me.classid) {
			case 1: // Sorceress
				switch (Config.AttackSkill[1]) {
				case 49:	// Lightening
				case 51:	// Fire Wall
				case 53:	// Chain Lightening
				case 56:	// Meteor
				case 59:	// Blizzard
				case 64:	// Frozen Orb
					if (me.getState(121)) {
						while (me.getState(121)) {
							delay(100);
						}
					} else {
						return Skill.cast(Config.AttackSkill[1], 0, 15092 + rand(-5, 5), 5028);	//skillcast
					}

					break;
				}

				break;
			case 3: // Paladin
				if (Config.AttackSkill[3] === 112) { // 112	Blessed Hammer
					//if (Config.AttackSkill[4] > 0) {
						//Skill.setSkill(Config.AttackSkill[4], 0);
					//}
					if (me.getState(2) && me.getSkill(109, 1)) {
						Skill.setSkill(109, 0);
					} else if (Config.Meditation && me.getSkill(120, 1)) {
						Skill.setSkill(120, 0);
					} else if (Config.Cleansing && me.getSkill(109, 1)) {
						Skill.setSkill(109, 0);
					} else {
						Skill.setSkill(Config.AttackSkill[4], 0);
					}
					
					return Skill.cast(Config.AttackSkill[3], 1);
				}
				
				if (Config.Conviction && me.getSkill(123, 1)) {	//260915
					Skill.setSkill(123, 0);
				}

				break;
			case 5: // Druid
				if (Config.AttackSkill[3] === 245) {
					return Skill.cast(Config.AttackSkill[3], 0, 15092 + rand(-5, 5), 5028);	//skillcast
				}
				
				if (me.getSkill(249, 1)) { // Armageddon
					return Skill.cast(249, 0);
				}

				break;
			case 6: // Assassin
				if (Config.UseTraps) {
					if (resetTrap) {	// 260510
						ClassAttack.lastTrapPos = {};
						resetTrap = false;
					}
					
					baalTrap = ClassAttack.checkTraps({x: 15092, y: 5042});

					if (baalTrap) {
						ClassAttack.placeTraps({x: 15082, y: 5040}, 1);
						delay(150);
						ClassAttack.placeTraps({x: 15087, y: 5042}, 1);
						delay(150);
						ClassAttack.placeTraps({x: 15092, y: 5044}, 1);
						delay(150);
						ClassAttack.placeTraps({x: 15097, y: 5042}, 1);
						delay(150);
						ClassAttack.placeTraps({x: 15102, y: 5040}, 1);
					}
				}

				if (me.getSkill(256, 1)) { // Shock Web
					return Skill.cast(256, 0, 15094 + rand(-5, 5), 5028);	//skillcast
				}

				break;
			}

			return false;
		};

		this.checkHydra = function () {
			var monster = getUnit(1, "hydra");
			if (monster) {
				do {
					if (monster.mode !== 12 && monster.getStat(172) !== 2) {
						if (me.classid === 1) { // I'm a sorceress, dodge Hydras if
							Pather.moveTo(15074, 5002);
						} else {
							Pather.moveTo(15116, 5002);
						}
						while (monster.mode !== 12) {
							delay(500);
							if (!copyUnit(monster).x) {
								break;
							}
						}

						break;
					}
				} while (monster.getNext());
			}

			return true;
		};
		
		print("ÿc4=== [BAAL] ===");

		if (Leader) {
			if (farmingON || me.diff !== 2) {
				D2Bot.printToConsole("=== FARMING ===", 7);
			}
			
			if (!farmingON && me.diff === 2) {
				D2Bot.printToConsole("=== LEVELING ===", 7);
			}
		}
		
		if (Leader && me.getQuest(40, 0)) {
			baalMSG = 1;
		}
		
		if (!doneChores) {
			Town.doChores(true);
		}
		
		this.syncBO();
		
		if (Leader) {
			Pather.useWaypoint(129);
			
			Pather.moveToExit([130, 131], true);
			
			if (me.diff === 2 && getUnit(1, 641) && farmingON) {	//260903
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Souls found");

				while (!me.inTown) {
					Town.goToTown();
					delay(me.ping * 2 + 1000);
				}
				
				return true;
			}
			
			Pather.moveTo(15118, 5002);
			
			if (me.diff === 2 && getUnit(1, 641) && farmingON) {	//260903
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Souls found");

				while (!me.inTown) {
					Town.goToTown();
					delay(me.ping * 2 + 1000);
				}
				
				return true;
			}
			
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			if (me.act !== 5 || !me.inTown) {
				Town.goToTown(5);
			}
			
			Town.move("portalspot");
			
			while (me.inTown) {
				if (earlyReturn) {	//260627
					earlyReturn = false;
					print("earlyReturn: Souls found");
					
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 1000);
					}
					
					return true;
				}
				
				delay(250);
				
				if (tpReady) {
					Pather.usePortal(131, null);
				}
			}
			
			tpReady = false;
		}
		
		Attack.clear(25);	//260903
		
	BaalLoop:	//260629
		while (true) {
			if (!getUnit(1, 543)) {
				break BaalLoop;
			}
		
			if (!this.preattack()) {
				delay(100);
			}

			var wave = false,
				wave5 = false,
				monster = getUnit(1);

			if (monster) {
				do {
					if (monster.x >= 15072 && monster.x <= 15118 && monster.y >= 5002 && monster.y <= 5074 && Attack.checkMonster(monster)) {
						wave = true;
						
						if (monster.classid === 571) {
							wave5 = true;
							
							break;
						}
					}
				} while (monster.getNext());
			}

			if (wave) {
				Attack.clearList(Attack.scanList(null, {x1:15072, x2:15118, y1:5002, y2:5074}), null, 1);
				
				this.checkHydra();
				
				if (me.classid === 3) {	//pal
					Pather.moveTo(15092 + rand(-5, 5), 5030);	//260909
				} else if (me.classid === 4) {	//bar
					Pather.moveTo(15092, 5028);
					Precast.doPrecast(true);
				} else if (me.classid === 5) {	//dru
					Pather.moveTo(15092, 5018);	//260830
				} else {
					Pather.moveTo(15092, 5040);
				}
				
				Precast.doPrecast();
				
				if (me.classid === 6 && !wave5) {
					resetTrap = true;
				}
			}
			
			if (wave5) {
				break BaalLoop;
			}
			
			delay(me.ping * 2 + 200);
		}

		sendPacket(1, 0x40); 
		
		delay(me.ping * 2 + 200);

		if (!this.partyLevel(baalLvl) || (me.diff === 1 && (!this.partyLevel(baalLvlnm) || hireMerc))) { // If the team hasn't met the level requirement in Normal or Nightmare, don't kill baal.
			Pather.moveTo(15092, 5032);
			
			Precast.doPrecast(true);
			
			this.okCount();
			
			if (Leader) {
				if (!Pather.getPortal(null, null)) {
					Pather.makePortal();
				}
			}
			
			var tick = getTickCount();
			
			while (!Pather.usePortal(null, null)) {
				delay(me.ping * 2 + 200);
				
				if (getTickCount() - tick > 3 * 1000) {
					Town.goToTown();
					delay(me.ping * 2 + 100);
					break;
				}
			}
			
			if (hireMerc) {
				print("Merc not ready");
			} else {			
				//print("Not ready to kill Baal.");
				me.overhead("Not ready to kill Baal.");
			}
			
			doneChores = false;
			
			return true;
		}

		while (getUnit(1, 543)) {
			Attack.clearList(Attack.scanList(null, {x1:15072, x2:15118, y1:5002, y2:5074}), null, 1);
			delay(me.ping * 2 + 100);
			Pather.moveTo(15092, 5028);	//260810
		}

		portal = getUnit(2, 563);
		
		if (portal) {
			Pather.usePortal(null, null, portal);
		} else {
			throw new Error("Baal: Couldn't find portal.");
		}
		
		this.waitForPartyMembers();
		Precast.doPrecast(true);
		
		Pather.moveTo(15134, 5923);
		
		try {
			Attack.clearList(Attack.scanList(544), null, 1);	//260723
			//Attack.kill(544); // Baal
		} catch (e) {
			print(e);
			//throw new Error("Failed to kill Baal")
		}
		
		runBaal = 1;

		if (Leader && baalMSG === 0) {
			D2Bot.printToConsole("=== BAAL ===", 7);
		}
		
		this.okCount();

		Precast.doPrecast(true);
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
			
			//D2Bot.stop();	//stop
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		doneChores = false;
		
		return true;
	};

//FARMING
	this.farmingCountess = function() { 
		var poi;
		
		print("ÿc4=== [COUNTESS] ===");
		
		Town.doChores();
		
		this.syncBO();
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(6);
			Pather.moveToExit([20, 21, 22, 23, 24, 25], true);
			
			poi = getPresetUnit(me.area, 2, 580);

			switch (poi.roomx * 5 + poi.x) {
			case 12565:
				Pather.moveTo(12555, 11043);
				break;
			case 12526:
				Pather.moveTo(12548, 11060);
				break;
			}
			
			Pather.makePortal();
		} else {
			if (me.act !== 1 || !me.inTown) {
				Town.goToTown(1);
			}
			
			Town.move("portalspot");
			this.okCount();
			
			while (!Pather.usePortal(25, null)) {
				delay(250);
			}
		}

		Pather.teleport = false;

		try {
			Attack.clear(20, 0, getLocaleString(2875)); // Countess
		} catch (e) {
			print(e);
			Attack.clear(20);
		}
		
		Pather.moveToPreset(me.area, 2, 580, myX, myY, true, true);	//260822
		
		this.okCount();

		Precast.doPrecast(true);
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		return true;
	};

	this.farmingPit = function() { 
		
		print("ÿc4=== [PIT] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (Leader) {
			Pather.useWaypoint(6);
			Pather.moveToExit([7, 12, 16], true);
			Pather.makePortal();
		} else {
			if (me.act !== 1 || !me.inTown) {
				Town.goToTown(1);
			}
			
			Town.move("portalspot");
			
			while (!Pather.usePortal(16, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
	
		this.waitForPartyMembers();
		Precast.doPrecast(true);

		Pather.moveTo(7548, 14429, 5, true);	//260628
		Pather.moveTo(7558, 14465, 5, true);
		Pather.moveTo(7585, 14445, 5, true);
		Pather.moveTo(7575, 14401, 5, true);
		Pather.moveTo(7607, 14420, 5, true);
		Pather.moveTo(7600, 14431, 5, true);
		
		this.okCount();
		
		Precast.doPrecast(true);
		
		if (Leader) {
			Pather.makePortal();
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		return true;
	};

	this.farmingAndy = function() { 
		
		print("ÿc4=== [ANDY] ===");
		
		Town.doChores();

		this.syncBO();
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(35);
			Pather.moveToExit([36, 37], true);
			Pather.moveTo(22549, 9520);
			
			Pather.makePortal();
		} else {
			if (me.act !== 1 || !me.inTown) {
				Town.goToTown(1);
			}
			
			Town.move("portalspot");
			this.okCount();
			
			while (!Pather.usePortal(37, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
		
		Attack.clear(25);
	
		try {
			Attack.clear(25, 0, 156); // Andariel
		} catch (e) {
			print(e);
			Attack.clear(25);
		}
		
		delay(me.ping * 2 + 2000); // Wait for minions to die.
		
		Pather.moveTo(22549 + myX, 9520 + myY);	//260822
		
		this.okCount();
		
		Precast.doPrecast(true);
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		return true;
	};

	this.farmingCows = function () {	//260628
		var buildCowRooms = function () {
			var i, j, room, kingPreset, kingRoom, badRooms, badRooms2,
				finalRooms = [],
				indexes = [];

			kingPreset = getPresetUnit(me.area, 1, 773);
			kingRoom = getRoom(kingPreset.roomx * 5 + kingPreset.x, kingPreset.roomy * 5 + kingPreset.y); //260808
			badRooms = kingRoom.getNearby();
			
			indexes.push(kingRoom.x + "" + kingRoom.y);	//260808

			for (i = 0; i < badRooms.length; i += 1) {
				if (indexes.indexOf(badRooms[i].x + "" + badRooms[i].y) === -1) {
					indexes.push(badRooms[i].x + "" + badRooms[i].y);
				}
				
				badRooms2 = badRooms[i].getNearby();

				for (j = 0; j < badRooms2.length; j += 1) {
					if (indexes.indexOf(badRooms2[j].x + "" + badRooms2[j].y) === -1) {
						indexes.push(badRooms2[j].x + "" + badRooms2[j].y);
					}
				}
			}
			
			room = getRoom();

			do {
				if (indexes.indexOf(room.x + "" + room.y) === -1) {
					finalRooms.push([room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2]);
				}
			} while (room.getNext());

			return finalRooms;
		};
		
		var getDriverName = function () {
			var string, obj;
			
			while (!string || !obj || !obj.name) {
				string = Misc.fileAction("_cache/" + Team.Leader + ".json", 0);
				
				if (string) {
					obj = JSON.parse(string);
				}
				
				delay(me.ping * 2 + 100);
			}
			
			return obj.name;
		};
		
		var getDriverUnit = function (driverName) {
			var driver;
			
			if (!driverName) {
				print("driverName undefined");
				return false;
			}
			
			driver = getUnit(0, driverName);
			
			if (driver && copyUnit(driver).x) {
				//print("getUnit: " + driver.x + ", " + driver.y + "type: " + typeof driver.x + "mode: " + driver.mode);
				return driver;
			}
		
			//print("getDriverUnit failed");
			
			return false;
		};

		var followDriver = function () {	//260903
			var driver, result,
				driverName = getDriverName();
			
			me.overhead("followDriver start");
			
			while (!msgLeader) {
				if (earlyReturn) {
					earlyReturn = false;
					//print("earlyReturn");
					
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 200);
					}
					
					return false;
				}
				
				driver = getDriverUnit(driverName);
				
				if (driver) {
					me.overhead("driver: " + driver.x + "." + driver.y + " distance: " + Math.round(getDistance(me, driver)));
					//print("driver: " + driver.x + "." + driver.y + " distance: " + Math.round(getDistance(me, driver)));
					
					if (getDistance(me, driver) > 15) {
						Pather.moveTo(driver.x + myX, driver.y + myY);
						
						if (Boer && me.getSkill(149, 0)) {
							Skill.cast(149, 0); // Battle Orders
						}
					} else {
						if (!Attack.clear(25)) {
							print("clear failed");
							return false;
						}
					}
				} else {
					if (msgNode) {
						me.overhead("msgNode: " + msgNode[0] + "." + msgNode[1] + " distance: " + Math.round(getDistance(me, msgNode[0], msgNode[1])));
						//print("node: " + msgNode[0] + "." + msgNode[1] + " distance: " + Math.round(getDistance(me, msgNode[0], msgNode[1])));
						
						if (getDistance(me, msgNode[0], msgNode[1]) > 15) {
							Pather.moveTo(msgNode[0] + myX, msgNode[1] + myY);
							
							if (Boer && me.getSkill(149, 0)) {
								Skill.cast(149, 0); // Battle Orders
							}
						} else {
							if (!Attack.clear(25)) {
								print("clear failed");
								return false;
							}
						}
					} else {
						if (!Attack.clear(25)) {
							print("clear failed");
							return false;
						}
					}
				}
				
				//Packet.flash(me.gid);
				
				delay(me.ping * 2 + 200);
			}
			
			if (msgNode && getDistance(me, msgNode[0], msgNode[1]) > 15) {
				Pather.moveTo(msgNode[0] + myX, msgNode[1] + myY);
			}
			
			//msgLeader = false;
			
			me.overhead("followDriver end");
			
			return true;
		};

		var clearCowLevel = function (rooms) {
			var room, myRoom, node, result;
			
			function RoomSort(a, b) {	//260828
				return getDistance(myRoom[0], myRoom[1], a[0], a[1]) - getDistance(myRoom[0], myRoom[1], b[0], b[1]);
			}
			
			if (!rooms) {	//260824
				rooms = buildCowRooms();
			}

			while (rooms.length > 0) {
				if (earlyReturn) {
					earlyReturn = false;
					//print("earlyReturn");
					
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 200);
					}
					
					return false;
				}
				
				room = getRoom(me.x, me.y);
				
				if (room) {
					myRoom = [room.x * 5 + room.xsize / 2, room.y * 5 + room.ysize / 2];
				}

				rooms.sort(RoomSort);
				room = rooms.shift();
				node = Pather.getNearestWalkable(room[0], room[1], 20, 3);	//260826
				
				Messaging.sendToList(Team.Profiles, {x: node[0], y: node[1]}, 56);
				
				if (node && getDistance(me, node[0], node[1]) > 20) {	//260811
					
					result = Pather.moveTo(node[0], node[1], 3, true);
					
					if (result === "killMonsters") {
						return false;
					}
				}
				
				//Packet.flash(me.gid);
				
				delay(me.ping * 2 + 200);
			}

			return true;
		};

		//main
		print("ÿc4=== [COWS] ===");
		
		this.okCount();	//260824
		
		if (Leader) {
			if (me.getQuest(4, 10)) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Already killed the Cow King");
				
				return true;
			}

			if (!me.getQuest(4, 0)) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Cain quest incomplete");
				
				return true;
			}

			if (!me.getQuest(40, 0)) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Baal quest incomplete");
				
				return true;
			}
		} else {
			for (i = 0; i < 5; i += 1) {
				if (earlyReturn) {
					earlyReturn = false;
					print("earlyReturn: Quest condition");
					
					return true;
				}
				
				delay(me.ping * 2 + 200);
			}
		}
		
		//this.okCount();
		
		Town.doChores();
		
		this.syncBO(1);
		
		if (Leader) {
			var i, portal, wirt, legItem, gid, leg, tome, myTome, cowTome, akara;
			
			Pather.useWaypoint(4);

			//getLeg
			if (me.getItem(88)) {
				leg = me.getItem(88);
			} else {
				if (me.area !== 4) {
					Pather.useWaypoint(4);
				}
				
				Precast.doPrecast(true);
				Pather.moveToPreset(me.area, 1, 737, 8, 8);

				for (i = 0; i < 10; i += 1) {
					portal = Pather.getPortal(38);
					
					if (portal) {
						Pather.usePortal(null, null, portal);
						break;
					}
					
					delay(me.ping * 2 + 200);
				}

				if (!portal) {
					Messaging.sendToList(Team.Profiles, "earlyReturn");
					print("earlyReturn: Tristram portal not found");
						
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 200);
					}
					
					return true;
				}

				Pather.moveTo(25048, 5177);
				
				wirt = getUnit(2, 268);

				for (i = 0; i < 10; i += 1) {
					wirt.interact();
					delay(me.ping * 2 + 200);
					
					legItem = getUnit(4, 88);
					
					if (legItem) {
						gid = legItem.gid;
						
						Pickit.pickItem(legItem);
						Town.goToTown();
						delay(me.ping * 2 + 200);
						
						leg = me.getItem(-1, -1, gid);
						
						break;
					}
				}

				if (!leg) {
					Messaging.sendToList(Team.Profiles, "earlyReturn");
					print("earlyReturn: Failed to get the leg");
						
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 200);
					}
					
					return true;
				}
			}

			//getTome
			myTome = me.findItem("tbk", 0, 3);
			tome = me.getItem("tbk");

			if (tome) {
				do {
					if (!myTome || tome.gid !== myTome.gid) {
						cowTome = copyUnit(tome);
						
						break;
					}
				} while (tome.getNext());
			}

			if (!cowTome) {
				akara = Town.initNPC("Shop");

				if (!akara) {
					Messaging.sendToList(Team.Profiles, "earlyReturn");
					print("earlyReturn: Failed to init akara");
					
					return true;
				}

				cowTome = akara.getItem("tbk");

				if (cowTome && cowTome.buy()) {
					cowTome = me.getItem("tbk");
					
					if (cowTome) {
						do {
							if (!myTome || cowTome.gid !== myTome.gid) {
								cowTome = copyUnit(cowTome);
								
								break;
							}
						} while (cowTome.getNext());
					}
				}

				if (!cowTome) {
					Messaging.sendToList(Team.Profiles, "earlyReturn");
					print("earlyReturn: Failed to buy cowTome");
					
					return true;
				}
			}

			//openCowPortal
			me.cancel();
			Town.move("akara");

			if (!Cubing.emptyCube()) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Failed to empty cube");
				
				return true;
			}

			if (!Storage.Cube.MoveTo(leg) || !Storage.Cube.MoveTo(cowTome) || !Cubing.openCube()) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Failed to cube leg and tome");
				
				return true;
			}

			transmute();
			delay(me.ping * 2 + 500);

			for (i = 0; i < 10; i += 1) {
				if (Pather.getPortal(39)) {
					portal = true;
					
					break;
				}
				
				delay(me.ping * 2 + 200);
			}

			if (!portal) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Portal not found");
				
				return true;
			}
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			Pather.useWaypoint(1);
			
			Town.move("portalspot");
			
			while (!tpReady) {
				if (earlyReturn) {
					earlyReturn = false;
					print("earlyReturn: Failed to open portal");
					
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 200);
					}
					
					return true;
				}
				
				delay(me.ping * 2 + 1000);
			}

			tpReady = false;
		}
		
		this.okCount();
			
		if (Leader) {
			Pather.usePortal(39);

			var kingPreset = getPresetUnit(me.area, 1, 773);
			var kingX = kingPreset.roomx * 5 + kingPreset.x;
			var kingY = kingPreset.roomy * 5 + kingPreset.y;
			var rooms = buildCowRooms();
			var safeRooms = rooms.filter(function (r) { return getDistance(r[0], r[1], kingX, kingY) > 100; });
			
			//260902
			safeRooms = safeRooms.filter(function (r) {
				return !(getCollision(me.area, r[0] + 10, r[1] + 10) & 0x1)
					&& !(getCollision(me.area, r[0] + 10, r[1] - 10) & 0x1)
					&& !(getCollision(me.area, r[0] - 10, r[1] + 10) & 0x1)
					&& !(getCollision(me.area, r[0] - 10, r[1] - 10) & 0x1);
			});
			
			safeRooms.sort(function (a, b) { return getDistance(me.x, me.y, a[0], a[1]) - getDistance(me.x, me.y, b[0], b[1]); });

			if (safeRooms.length > 0) {
				var firstRoom = Pather.getNearestWalkable(safeRooms[0][0], safeRooms[0][1], 20, 3);	//260826
				if (firstRoom) {
					Pather.moveTo(firstRoom[0], firstRoom[1]);
				}
			}

			Pather.makePortal();
		} else {
			while (!Pather.usePortal(39, null)) {
				delay(me.ping * 2 + 200);
			}
		}
		
		Pather.teleport = false;
		
		Attack.clear(20);
		
		Precast.doPrecast(true);
		
		if (Leader) {
			if (!clearCowLevel(rooms)) {	//260824
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: clearCowLevel failed");
				
				while (!me.inTown) {
					Town.goToTown();
					delay(me.ping * 2 + 200);
				}
				
				this.okCount();
				
				Pather.teleport = true;
				//msgLeader = false;
				//msgFollower = {};
				earlyReturn = false;
				
				return true;
			}

			var tick = getTickCount();
			
			while (Object.keys(msgFollower).length < Team.Size - 1) {
				Messaging.sendToList(Team.Profiles, "msgLeader");
				delay(me.ping * 2 + 500);
				
				if (getTickCount() - tick > 30 * 1000) {
					break;
				}
			}
		} else {
			if (!followDriver()) {
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: followDriver failed");
				
				while (!me.inTown) {
					Town.goToTown();
					delay(me.ping * 2 + 200);
				}
				
				this.okCount();
				
				Pather.teleport = true;
				msgNode = false;	//260903
				//msgLeader = false;
				//msgFollower = {};
				earlyReturn = false;
				
				return true;
			}
		}
		
		this.okCount();
		
		Precast.doPrecast(true);
		
		if (Leader) {
			Pather.makePortal();
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;
		
		msgNode = false;	//260903
		msgLeader = false;
		msgFollower = {};
		earlyReturn = false;
		
		return true;
	};
	
	this.farmingSummoner = function() {
		var journal, i;
		
		print("ÿc4=== [SUMMONER] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(74);
			
			journal = getPresetUnit(74, 2, 357);

			if (!journal) {
				throw new Error("AutoSmurf.summoner: No preset unit in Arcane Sanctuary.");
			}

			while (getDistance(me.x, me.y, journal.roomx * 5 + journal.x + 8, journal.roomy * 5 + journal.y + 8) > 10) {
				try {
					Pather.moveToPreset(74, 2, 357, 8, 8, false, false);
				} catch (e) {
					print("Caught Error.");

					print(e);
				}
			}
			
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			if (me.act !== 2 || !me.inTown) {
				Town.goToTown(2);
			}
			
			Town.move("portalspot");
			this.okCount();
			
			while (me.inTown) {
				if (tpReady) {
					Pather.usePortal(74, null);
				}
				
				delay(250);
			}
			
			tpReady = false;
		}
		
		Pather.teleport = false;
		
		try {
			Attack.clear(10, 0, 250);	//Summoner
		} catch (e) {
			print(e);
			Attack.clear(10);
		}
		
		journal = getPresetUnit(74, 2, 357);
		
		Attack.clearList(Attack.scanList(null, {x1: journal.roomx * 5 + journal.x - 10, x2: journal.roomx * 5 + journal.x + 18, y1: journal.roomy * 5 + journal.y - 10, y2: journal.roomy * 5 + journal.y + 17}), null, 1);
		
		Pather.moveToPreset(74, 2, 357, 3, 3);

		this.okCount();
		
		journal = getUnit(2, 357);
		
		for (i = 0; i < 3; i += 1) {
			if (Pather.getPortal(46)) {
				break;
			}
			
			if (journal) {
				sendPacket(1, 0x13, 4, journal.type, 4, journal.gid);

				delay(me.ping * 2 + 1000);

				Misc.click(0, 0);
				//me.cancel();
			}
		}
		
		delay(me.ping * 2 + 200);
		
		me.cancel();
		
		while (me.area === 74) {
			//me.cancel();
			Pather.usePortal(46);
		}
		
		//me.cancel();
		
		this.clickWP();
		Pather.useWaypoint(1);
		
		Pather.teleport = true;
		
		this.okCount();
		
		return true;
	};

	this.farmingMephisto = function() {
		var redPortal;

		print("ÿc4=== [MEPHISTO] ===");
		
		Town.doChores();
		
		this.syncBO();
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(101);
			Pather.moveToExit(102, true);
			Pather.moveTo(17566, 8069);
			Pather.makePortal();
		} else {
			if (me.act !== 3 || !me.inTown) {
				Town.goToTown(3);
			}
			
			Town.move("portalspot");
			this.okCount();

			while (!Pather.usePortal(102, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
		
		try {
			Attack.clearList(Attack.scanList(242), null, 1);	// Mephisto
			//Attack.kill(242);	// Mephisto
		} catch (e) {
			print(e);
		}
		
		Pather.moveTo(17515 + myX, 8061 + myY, 3, true);	//260822
		Attack.clear(35)
		
		Pather.moveTo(17566 + myX, 8069 + myY); // reportal bridge	//260822
		
		this.okCount();

		Precast.doPrecast(true);

		redPortal = getPresetUnit(102, 2, 342);
		
		while (getDistance(me.x, me.y, redPortal.roomx * 5 + redPortal.x, redPortal.roomy * 5 + redPortal.y) > 10) {
			Pather.moveToPreset(102, 2, 342, 0, 0, false, false);
		}
		
		redPortal = getUnit(2, 342);
		
		while (me.area === 102) {
			Pather.usePortal(null, null, redPortal);
		}
	
		Pather.teleport = true;
		
		this.okCount();
	
		return true;
	};

	this.farmingAbaddon = function() {
		var presetUnit;
	
		print("ÿc4=== [ABADDON] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (me.act !== 5 || !me.inTown) {
			Town.goToTown(5);
		}
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(111);
			
			if (!Pather.moveToPreset(me.area, 2, 60) || !Pather.usePortal(125)) {
				throw new Error("moveToPreset failed: Abaddon");
			}
			
			Pather.makePortal();
		} else {
			Town.move("portalspot");
			this.okCount();
			
			while (!Pather.usePortal(125, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
		
		this.waitForPartyMembers();
		
		Precast.doPrecast(true);
		
		this.okCount();
		
		presetUnit = getPresetUnit(me.area, 2, 397);
		
		if (!presetUnit) {
			print("getPresetUnit failed: Abaddon");
			return false;
		}
		
		var fail = getTickCount();
		
		while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 15) {
			if (getTickCount() - fail > 180 * 1000) {
				print("moveTo failed: Abaddon");
				break;
			}
			
			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + myX, presetUnit.roomy * 5 + presetUnit.y + myY, 3, true);	//260822
			delay(me.ping * 2 + 200);
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;

		return true;
	};
	
	this.farmingPOA = function() {
		var presetUnit;
	
		print("ÿc4=== [POA] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (me.act !== 5 || !me.inTown) {
			Town.goToTown(5);
		}
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(112);
			
			if (!Pather.moveToPreset(me.area, 2, 60) || !Pather.usePortal(126)) {
				throw new Error("moveToPreset failed: POA");
			}
			
			Pather.makePortal();
		} else {
			Town.move("portalspot");
			this.okCount();
			
			while (!Pather.usePortal(126, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
		
		this.waitForPartyMembers();
		
		Precast.doPrecast(true);
		
		this.okCount();
		
		presetUnit = getPresetUnit(me.area, 2, 397);
		
		if (!presetUnit) {
			print("getPresetUnit failed: POA");
			return false;
		}
		
		var fail = getTickCount();
		
		while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 15) {
			if (getTickCount() - fail > 180 * 1000) {
				print("moveTo failed: POA");
				break;
			}
			
			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + myX, presetUnit.roomy * 5 + presetUnit.y + myY, 3, true);	//260822
			delay(me.ping * 2 + 200);
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;

		return true;
	};
	
	this.farmingInfernal = function() {
		var presetUnit;
	
		print("ÿc4=== [INFERNAL] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (me.act !== 5 || !me.inTown) {
			Town.goToTown(5);
		}
		
		if (Leader) {
			Town.move("waypoint");
			this.okCount();
			
			Pather.useWaypoint(117);
			
			if (!Pather.moveToPreset(me.area, 2, 60) || !Pather.usePortal(127)) {
				throw new Error("moveToPreset failed: Infernal");
			}
			
			Pather.makePortal();
		} else {
			Town.move("portalspot");
			this.okCount();
			
			while (!Pather.usePortal(127, null)) {
				delay(250);
			}
		}
		
		Pather.teleport = false;
		
		this.waitForPartyMembers();
		
		Precast.doPrecast(true);
		
		this.okCount();
		
		presetUnit = getPresetUnit(me.area, 2, 397);
		
		if (!presetUnit) {
			print("getPresetUnit failed: Infernal");
			return false;
		}
		
		var fail = getTickCount();
		
		while (getDistance(me.x, me.y, presetUnit.roomx * 5 + presetUnit.x, presetUnit.roomy * 5 + presetUnit.y) > 15) {
			if (getTickCount() - fail > 180 * 1000) {
				print("moveTo failed: Infernal");
				break;
			}
			
			Pather.moveTo(presetUnit.roomx * 5 + presetUnit.x + myX, presetUnit.roomy * 5 + presetUnit.y + myY, 3, true);	//260822
			delay(me.ping * 2 + 200);
		}
		
		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 3 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		Pather.teleport = true;

		return true;
	};
	
	this.farmingNihlathak = function() { 
		
		print("ÿc4=== [NIHLATHAK] ===");

		Town.doChores();
		
		this.syncBO();
		
		if (me.act !== 5 || !me.inTown) {
			Town.goToTown(5);
		}
		
		if (Leader) {
			Town.move("anya");
			this.okCount();
			
			Pather.usePortal(121);
			Pather.moveToExit([122, 123, 124], true);
			Pather.moveToPreset(me.area, 2, 462, 15, 15);
			
			if (me.diff === 2 && getUnit(1, 597)) {	//260627
				Messaging.sendToList(Team.Profiles, "earlyReturn");
				print("earlyReturn: Vipers found");

				while (!me.inTown) {
					Town.goToTown();
					delay(me.ping * 2 + 1000);
				}
				
				return true;
			}
			
			Pather.makePortal();
			
			me.overhead("tpReady");
			Messaging.sendToList(Team.Profiles, "tpReady");
		} else {
			Town.move("portalspot");
			this.okCount();
		
			while (me.inTown) {
				if (earlyReturn) {
					earlyReturn = false;
					print("earlyReturn: Vipers found");
					
					while (!me.inTown) {
						Town.goToTown();
						delay(me.ping * 2 + 1000);
					}
					
					return true;
				}
				
				delay(250);
				
				if (tpReady) {
					Pather.usePortal(124, null);
				}
			}
			
			tpReady = false;
		}
		
		Attack.clear(20);
		
		try {
			//Attack.clear(20, 0, 526); // Nihlathak
			Attack.clearList(Attack.scanList(526), null, 1); // Nihlathak
		} catch (e) {
			print(e);
			Attack.clear(20);
		}
		
		
		Pather.moveToPreset(me.area, 2, 462, myX, myY, true);	//260822

		this.okCount();
	
		Precast.doPrecast(true);

		if (Leader) {
			if (!Pather.getPortal(null, null)) {
				Pather.makePortal();
			}
		}
		
		var tick = getTickCount();
		
		while (!Pather.usePortal(null, null)) {
			delay(me.ping * 2 + 200);
			
			if (getTickCount() - tick > 5 * 1000) {
				Town.goToTown();
				delay(me.ping * 2 + 100);
				break;
			}
		}
		
		return true;
	};

//MESSAGING
	Messaging.sendToList = function(list, message, mode=55) {
	    return list.forEach((profileName) => {
	        if (profileName.toLowerCase() != me.profile.toLowerCase()) {
	            sendCopyData(null, profileName, mode, JSON.stringify({ nick: me.profile, msg: message }));
	        }
	    });
	};

	addEventListener("copydata", (id, data) => {
		var parsed, msg, nick;	//eom
		try {	//eom
			parsed = JSON.parse(data);
			msg = parsed.msg;
			nick = parsed.nick;
		} catch (e) {
			return;
		}
		
		if (imReady && Team.Size === 1) {
			teamReady = true;

			//print("teamReady");
			me.overhead("teamReady");

			Messaging.sendToList(Team.Profiles, "teamReady");
		}
		
		if (id == 56) {	//260903
			if (msg && typeof msg === "object" && typeof msg.x === "number" && typeof msg.y === "number") {
				msgNode = [msg.x, msg.y];
			}
			
			return;
		}
		
		if (id == 55) {
			switch (msg) {
			case "readyCount":
				readyCount += 1;

				//print("readyCount = " + readyCount);
				me.overhead("readyCount = " + readyCount);
				
				if (imReady && readyCount === Team.Size - 1) { // Doesn't count my ready because my messages are ignored. Subtract one from Team to account for this.
					if (!teamReady) { // Only need to change teamReady to true once.
						teamReady = true;
						Messaging.sendToList(Team.Profiles, "teamReady");
						//print("teamReady");
						me.overhead("teamReady");
					}
				}
				break;
			case "teamReady":
				if (!teamReady) { // Only need to change teamReady to true once.
					teamReady = true;
					//print("Team was ready");
					me.overhead("teamReady");
				}
				break;

			case "hireMerc":
				if (!hireMerc) {
					hireMerc = true;
					print("hireMerc");
					me.overhead("hireMerc");
				}
				break;
				
			case "giveGold":
				if (me.gold > 5000) {
					giveGold = 1;
				}
				break;
				
			case "farmingON":
				if (!farmingON) {
					farmingON = true;
					print("farmingON");
					me.overhead("farmingON");
				}
				break;
			case "essA":
				if (!essA) {
					essA = true;
					//print("essA");
					//me.overhead("essA");
				}
				break;
			case "essM":
				if (!essM) {
					essM = true;
					//print("essM");
					//me.overhead("essM");
				}
				break;
			case "keyT":
				if (!keyT) {
					keyT = true;
					//print("keyT");
					//me.overhead("keyT");
				}
				break;
			case "keyH":
				if (!keyH) {
					keyH = true;
					//print("keyH");
					//me.overhead("keyH");
				}
				break;
			case "keyD":
				if (!keyD) {
					keyD = true;
					//print("keyD");
					//me.overhead("keyD");
				}
				break;

			case "okCount":	//260510
				okCount += 1;
				break;
			case "teamOk":
				if (!teamOk) {
					teamOk = true;
				}
				break;
			case "teamCount":
				teamCount += 1;
				//print("teamCount = " + teamCount);
				break;
			
			case "syncBO":
				syncBO = true;
				break;
			case "syncWP":
				if (!syncWP) {
					syncWP = true;
				}
				break;
				
			case "BOing":
				Messaging.sendToList(Team.Profiles, "BOCount");
				BOing = true;
				break;
			case "BOed":
				Messaging.sendToList(Team.Profiles, "BOCount");
				BOed = true;
				break;
			case "BOCount":
				BOCount += 1;
				break;
			case "BOReady":
				BOReady = true;
				break;
				
			case "buffCount":
				buffCount += 1;
				//print("buffCount = " + buffCount);
				me.overhead("buffCount = " + buffCount);
				
				if (myBuff && buffCount === Team.Size - 1) {	//eom 260412
					if (!teamBuff) {
						teamBuff = true;
						Messaging.sendToList(Team.Profiles, "teamBuff");
						//print("teamBuff");
						me.overhead("teamBuff");
					}
				}
				break;
			case "teamBuff":
				if (!teamBuff) { // Only need to change teamReady to true once.
					teamBuff = true;
					//print("teamBuff");
					me.overhead("teamBuff");
				}
				break;
				
			case "tpReady":
				tpReady = true;
				me.overhead("tpReady");
				break;
			case "earlyReturn":
				earlyReturn = true;
				break;
				
			case "cube":
				cube = true;
				break;
			case "getCube":
				getCube = true;
				break;
			case "amulet":
				amulet = true;
				break;
			case "summoner":
				summoner = true;
				break;
			case "tombs":
				tombs = true;
				break;
			case "radament":
				radament = true;
				break;
			case "duriel":
				duriel = true;
				break;
				
			case "figurine":
				figurine = true;
				break;
			case "leaderFigurine":
				leaderFigurine = true;
				break;
			case "travincal":
				travincal = true;
				break;
			case "mephisto":
				mephisto = true;
				break;
			case "takeRedPortal":
				takeRedPortal = true;
				break;
				
			case "msgLeader":
				msgLeader = true;
				me.overhead("msgLeader");
				Messaging.sendToList(Team.Profiles, "msgFollower");
				break;
			case "msgFollower":
				msgFollower[nick] = true;
				me.overhead("msgFollower");
				break;
			}
		}
	});

//MAIN
	this.checkRole();
	
	this.okCount();
	
	this.start();
	
    //act1
	var runAndy = 0; //eom
	
    if (!me.getQuest(7, 0)) { // Andariel is not done.	 || !this.partyLevel(teleLvl)
        Town.goToTown(1);
		
		this.syncBO();
		
        if (!me.getQuest(1, 0)) {
            this.den();
        }
 
        if (me.diff === 0) { // Normal difficulty.
            if (!me.getQuest(2, 0) || !getWaypoint(2)) { // Haven't killed Blood Raven, have completed the Den of Evil and the party has reached the caveLvl requirement.
				this.blood();
            }
			
            if (!me.getQuest(4, 0)) { // Haven't completed The Search for Cain and the party has reached the caveLvl requirement.
				this.cain(); // Only rescues cain SiC-666 TODO: this is redundant, should grab the questing from autoladderreset or something to consolidate.
            }

            if (me.getQuest(4, 0) && !this.partyLevel(tristLvl)) { // Have completed The Search for Cain and the party hasn't reached the tristLvl requirement
				this.trist(); // area lv6
            }
			
			if (!getWaypoint(5)) {
				this.outer();
			}
			
			if (!this.partyLevel(tristLvl) || !me.getQuest(3, 1)) {
				this.smith(); // area lv9
			}
			
			if (!getWaypoint(6)) {
				this.jail(); // area lv10
			}
			
			if (!getWaypoint(7)) {
				this.inner(); // area lv10
			}
			
			if (!getWaypoint(8) || !this.partyLevel(teleLvl)) {
				this.cathedral(); // area lv11
			}
        } else { // Nightmare & Hell difficulty.
			if (!me.getQuest(4, 0)) { 	// Haven't completed The Search for Cain and the party has reached the caveLvl requirement.
				this.cain(); 			// Only rescues cain
            }
		}
		
		if (!me.getQuest(7, 0)) {	//260915
			this.andy();
		}
	};

	//act2
	if (!me.getQuest(15, 0) && me.getQuest(7, 0)) { // Duriel is not done and Andariel is.
		Town.goToTown(2);
		
		me.automap = true;	//260904

		this.syncBO();
		
		if (Leader) { // I am the Leader.
			if (!me.findItem(549) || getCube) { // No cube or team member is requesting cube or am not level 18 yet (required to teleport to the summoner).
				this.travel(2);	// Halls Of The Dead Level 2
				
				Messaging.sendToList(Team.Profiles, "cube");				
				this.cube();
			}

			if ((!me.findItem(521) && !me.findItem(91) && !me.getQuest(10, 0)) || !me.getQuest(11, 0)) { // No Amulet of the Viper/Horadric Staff and Horadric Staff quest (staff placed in orifice) is incomplete or The Tainted Sun quest is incomplete.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.travel(3); // Lost City
				
				Messaging.sendToList(Team.Profiles, "amulet");
				this.amulet();
			}

			if (!getWaypoint(16)) {
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.travel(4);
			}

			if ((!me.getQuest(13, 0) && me.getQuest(11 , 0) && getWaypoint(16)) || !getWaypoint(17)) { // Summoner quest incomplete but The Tainted Sun is complete.
				Messaging.sendToList(Team.Profiles, "summoner");
				this.summoner();
			}

			if (!this.partyLevel(tombsLvl) && me.diff === 0) {
				Messaging.sendToList(Team.Profiles, "tombs");
				this.tombs(); // eom
			}
			
			if (!me.findItem(92) && !me.findItem(91) && !me.getQuest(10, 0)) { // No Staff of Kings nor Horadric Staff and Horadric Staff quest (staff placed in orifice) not complete.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.staff();
			}

			if (me.findItem(92) && me.findItem(521) && me.findItem(549)) { // Have The Staff of Kings, The Viper Amulet, and The Horadric Cube.
				this.cubeStaff();
			}

			if (!me.getQuest(9, 1) && !me.getQuest(9, 0)) { // && me.diff <= 2) { // Haven't finished Radament's Lair.
				Messaging.sendToList(Team.Profiles, "radament");				
				this.radament();
			}

			if ((me.getQuest(9, 1) || me.getQuest(9, 0)) && !me.getQuest(14, 0) && this.partyLevel(tombsLvl)) { // Haven't completed Duriel and team has reached level goal or this isn't normal difficulty.
				Messaging.sendToList(Team.Profiles, "duriel");
				this.duriel();
			}
		} else { // Not the Leader.
			while (!me.getQuest(14, 0)) { // Haven't completed Duriel.
				if (cube) {
					this.cube();
					cube = false;
				}

				if (amulet) {
					this.amulet();
					amulet = false;
				}

				if (summoner) {
					this.summoner();
					summoner = false;
				}

				if (tombs) {
					this.tombs();
					tombs = false;
				}

				if (radament) {
					this.radament();
					radament = false;
				}

				if (duriel) {
					this.duriel();
					duriel = false;
				}
				
				if (syncBO) {
					this.syncBO();
					syncBO = false;
				}

				delay(250);
			}
		}
	};

	//act3
	if (!me.getQuest(23, 0) && me.getQuest(15, 0)) { // "Able to go to Act IV" (AKA haven't gone thru red portal to Act 4) is not done and Duriel is.
		Town.goToTown(3);
		
		me.automap = true;	//260904
		
		Pather.moveTo(5148 + myX, 5066 + myY, 5);	//260813	//260822

		if (Leader) { // I am the Teleporting Sorc
			if (figurine) { // Someone has the Jade Figurine!
				this.figurine();
			}

			//if (!me.getQuest(22, 0)) {
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
			//}
			
			this.travel(6); // Travel to all waypoints up to and including Travincal if I don't have them.

			if (!me.getQuest(17, 0)) { // Haven't completed Lam Esen's Tome.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.tome();
			}

			if (!me.findItem(553) && !me.findItem(174) && !me.getQuest(18, 0)) { // Don't have Eye and don't have Khalim's Will and haven't completed Khalim's Will.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.eye();
			}

			if (!me.findItem(554) && !me.findItem(174) && !me.getQuest(18, 0)) { // Don't have Heart and don't have Khalim's Will and haven't completed Khalim's Will.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.heart();
			}

			if (!me.findItem(555) && !me.findItem(174) && !me.getQuest(18, 0)) { // Don't have Brain and don't have Khalim's Will and haven't completed Khalim's Will.
				Messaging.sendToList(Team.Profiles, "syncBO");
				this.syncBO();
				
				this.brain();
			}

			if (me.findItem(174) || (me.findItem(553) && me.findItem(554) && me.findItem(555)) || !me.getQuest(20, 0) || !me.getQuest(21, 0)) { // Have Khalim's Will or have Eye, Heart, and Brain, or Golden Bird isn't complete, or The Blackened Temple isn't complete.
				Messaging.sendToList(Team.Profiles, "travincal");
				this.travincal();
			}

			if (figurine) { // Someone has the Jade Figurine!
				this.figurine();
			}
			
			if (!me.getQuest(20, 0) && me.getQuest(18, 0) && me.getQuest(21, 0)) {
				//print("figurine incomplited");
				me.overhead("figurine incomplited");
				//D2Bot.restart();
				scriptBroadcast("quit");	//260909
			}

			if (!me.getQuest(23, 0) && me.getQuest(18, 0) && me.getQuest(21, 0) ) { //no matter Golden bird && me.getQuest(20, 0)) { // Haven't been "Able to go to Act IV" yet and have completed Khalim's Will (AKA the stairs to Durance of Hate Level 1 are open), The Blackened Temple (AKA everyone can enter a Durance Of Hate Level 3 Town Portal), and Golden Bird.
				this.travel(7); // Travel to Durance Of Hate Level 2 Waypoint if I don't have it.
				
				if (!me.getQuest(22, 0)) {
					Messaging.sendToList(Team.Profiles, "mephisto");
					this.mephisto();
				} else {
					Messaging.sendToList(Team.Profiles, "takeRedPortal");
					this.mephisto(true);
				}
			}
		} else {
			while (!me.getQuest(23, 0)) { // Haven't completed "Able to go to Act IV" (AKA haven't gone thru red portal to Act 4)
				if (travincal) {
					this.travincal();
					travincal = false;
				}

				if (figurine) {
					this.figurine();
				}

				if (mephisto) {
					this.mephisto();
					mephisto = false;
				}

				if (takeRedPortal) { // I'm a straggler stuck in Act 3. Leader is going to help me thru the Red Portal to Act 4!
					this.mephisto(true);
					takeRedPortal = false;
				}

				if (syncBO) {
					this.syncBO();
					syncBO = false;
				}

				delay(250);
			}
		}
	};

	//act4
	var runDiablo = 0; // Dark-f: for running baal
	
	if (me.getQuest(23, 0) && !me.getQuest(28, 0)) { // eom
		Town.goToTown(4);

		if (Leader) { // I am the Teleporting Sorc
			var checkPartyAct;
			
			while (!checkPartyAct) { // Wait for everyone to get back to their Town, then record the lowest Town.
				checkPartyAct = this.partyAct();
				delay(250);
			}

			if (checkPartyAct === 3) { // If the lowest Town is Act 3.
				Messaging.sendToList(Team.Profiles, "takeRedPortal");
				D2Bot.printToConsole("Helping straggler complete Act 3", 5);
				this.mephisto(true);
			}
		}

		this.okCount();

		me.automap = true;	//260904
		
		this.syncBO();
		
		if (Leader && !getWaypoint(29)) {
			this.travel(8);	// Travel to all waypoints up to and including River of Flame if I don't have them.
		}
		
		if (!me.getQuest(25, 0)) { // The Fallen Angel is not done or it has been started.
			this.izual();
		}

		this.diablo();
		
		this.changeAct(5);
	};

	//act5
	if (me.getQuest(28, 0) && !me.getQuest(39, 0)) { // eom
		Town.goToTown(5);

		me.automap = true;	//260904
		
		this.syncBO();
		
		if (Leader && !getWaypoint(37)) {
			this.travel(9);
		}

		if (!me.getQuest(35, 1) && !me.getQuest(35, 0)) {
			this.shenk();
		}

		if ((!me.getQuest(36,0) || me.getQuest(36,1)) && me.diff === 0) {
			this.barbs();
		}

		if (!me.getQuest(37, 0)) { //Dark-f
			this.anya();
		} else {
			//this.okCount();	//260904 fallback for the next join desync
		}

		this.ancients();
	};

	var baalMSG = 0,
		runBaal = 0; //eom

	if (me.getQuest(39, 0)) {
		this.syncBO();
		
		if (Leader && !getWaypoint(38)) {
			this.travel(10);
		}

		this.baal(); // Won't kill Baal in Normal and Nightmare until the team has met the baalLvl or baalLvlnm requirement.
	};
	
	while (!me.getQuest(40, 0) && runBaal === 1 && me.diff !== 2) {
		sendPacket(1, 0x40); // Refresh quest status
		delay(1000);
	}
	
	if (me.getQuest(40, 0) && me.diff !== 2) {
		this.farmingCows();
	}
	
	//farming
	if (me.getQuest(39, 0) && (runBaal === 0 || me.diff === 2)) {
		if (me.diff === 0) {
			this.farmingAbaddon();
			this.farmingPOA();
			this.farmingInfernal();
		}
		
		if (me.diff === 1 && !hireMerc) {
			this.farmingAbaddon();
			this.farmingPOA();
			this.farmingInfernal();
		}
		
		if (me.diff === 2) {
			if (keyD || this.partyLevel(95)) {
				this.farmingNihlathak();
			}
			
			if (keyH) {
				this.farmingSummoner();
			}
			
			if (farmingON || keyT) {
				this.farmingCountess();
			}
			
			if (farmingON) {
				this.farmingPit();
			}
			
			if (farmingON || essA) {
				this.farmingAndy();
			}
			
			if (farmingON && this.partyLevel(90)) {
				this.farmingCows();
			}
			
			if (farmingON || essM) {
				this.farmingMephisto();
			}
		}
		
		if (runDiablo === 0 && ((me.diff === 0 && !this.partyLevel(diaLvl)) || (me.diff === 1 && !this.partyLevel(diaLvlnm)) || me.diff === 2)) {
			this.diablo();
		}
	};
	
	print("script ended");

	//while (!Leader) {
		//delay(10000);
	//};
	
	//D2Bot.restart();

	return true;
};
