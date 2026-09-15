/*
	# Account / Character auto creation
	# 260902
*/

var AutoCreate = {
	password: "123",

	classMap: {
		"M": "amazon", "S": "sorceress", "N": "necromancer",
		"P": "paladin", "B": "barbarian", "D": "druid", "A": "assassin"
	},

	getInfo: function () {
		var build = Build.getBuildType();

		if (!build) {
			return false;
		}

		var charClass = this.classMap[String(build).split(".")[0]];

		if (!charClass) {
			return false;
		}

		return {
			account: Profile(me.profile).username,
			password: this.password,
			realm: String(Profile(me.profile).gateway).toLowerCase(),
			charName: Profile(me.profile).character,
			charClass: charClass,
			ladder: true,
			expansion: true,
			hardcore: false
		};
	},

	account: function () {
		var info = this.getInfo();

		if (!info || !info.account) {
			D2Bot.printToConsole("AutoCreate: no account info", 9);
			return false;
		}

		ControlAction.click(6, 335, 412, 128, 35); // dismiss login error

		var tick = getTickCount();

		while (getLocation() === 10 && getTickCount() - tick < 5000) {
			delay(100);
		}

		if (getLocation() === 10) {
			return false;
		}
		
		var profile = profiles.slice().reverse();
		
		delay(profile.indexOf(me.profile) * 5000 + 1000);	//260915
		
		D2Bot.printToConsole("AutoCreate: creating account " + info.account, 7);

		return ControlAction.makeAccount(info);
	},

	character: function () {
		if (getLocation() !== 42) {
			return false;
		}

		var control = getControl(6, 33, 528, 168, 60);

		if (!control || control.disabled === 4) { // greyed out = realm down
			return false;
		}

		var info = this.getInfo();

		if (!info || !info.charName) {
			D2Bot.printToConsole("AutoCreate: no character info", 9);
			return false;
		}

		D2Bot.printToConsole("AutoCreate: creating " + info.charClass + " " + info.charName, 7);

		return ControlAction.makeCharacter(info);
	}
};