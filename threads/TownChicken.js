/**
*	@filename	TownChicken.js
*	@author		kolton
*	@desc		handle town chicken
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
	var townCheck = false;

	this.togglePause = function () {
		var i,	script,
			scripts = ["default.dbj"];

		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script) {
				if (script.running) {
					if (i === 0) { // default.dbj
						//print("ÿc1Pausing.");	//eom
						me.overhead("Pausing.");	//eom
					}

					script.pause();
				} else {
					if (i === 0) { // default.dbj
						//print("ÿc2Resuming.");	//eom
						me.overhead("Resuming.");	//eom
						
						script.resume();
					} else {
						script.resume();
					}
				}
			}
		}

		return true;
	};

	addEventListener("scriptmsg",
		function (msg) {
			if (msg === "townCheck") {
				//print("TownChicken recv: " + msg);  // 260531
				if (me.area === 136) {
					print("Can't tp from uber trist.");
				} else if (me.area === 120) {
					print("cannot open TP");
					D2Bot.printToConsole("cannot open TP");
				} else {
					townCheck = true;
					//print("townCheck: " + townCheck);
				}
			}
		});

	// Init config and attacks
	D2Bot.init();
	Config.init();
	Pickit.init();
	Attack.init();
	Storage.Init();
	Runewords.init();
	Cubing.init();

	while (true) {
		if (!me.inTown && (townCheck ||
			(Config.TownHP > 0 && me.hp < Math.floor(me.hpmax * Config.TownHP / 100)) ||
			(Config.TownMP > 0 && me.mp < Math.floor(me.mpmax * Config.TownMP / 100)))) {
			//print("while: " + townCheck);
			this.togglePause();

			while (!me.gameReady) {	//260525
				delay(100);
			}

			try {
				me.overhead("Going to town");
				print("Going to town");
				Town.visitTown();
			} catch (e) {
				Misc.errorReport(e, "TownChicken.js");
				scriptBroadcast("quit");

				return;
			} finally {
				this.togglePause();

				townCheck = false;
			}
		}

		delay(10);
	}
}