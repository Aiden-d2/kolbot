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
			OOGLog.stop("No account info");	//261001
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
		
		ControlAction.timeoutDelay("Create account wait", (profile.indexOf(me.profile) + 1) * 20000);	//261002

		return ControlAction.makeAccount(info);	//261001 the starter printed "Invalid account: X - create"
	},

	// 42 empty character select, 12 character select without the profile character (the starter checked the list)	//261001
	character: function () {
		var location = getLocation();

		if (location !== 42 && location !== 12) {	//261001 12 added
			return false;
		}

		var control = getControl(6, 33, 528, 168, 60);

		if (!control || control.disabled === 4) { // greyed out: 42 = realm down, 12 = all slots used	//261001
			if (location === 12 && control) {
				OOGLog.stop("Character slots full: " + Profile(me.profile).character);
			}

			return false;
		}

		var info = this.getInfo();

		if (!info || !info.charName) {
			OOGLog.stop("No character info");	//261001
		}

		if (ControlAction.charNameTaken) {	//261001 the name was taken and it is still not in the list -> another account has it
			OOGLog.stop("Character name taken: " + info.charName + " \"" + ControlAction.charNameTaken + "\"");
		}

		OOGLog.print("Create character: " + info.charName + " " + info.charClass);	//261001

		return ControlAction.makeCharacter(info);
	}
};