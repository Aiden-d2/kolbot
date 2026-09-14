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
	var obj, action,
		mapThread = getScript("threads/MapThread.js");

	//Config.init();
	Pickit.init();
	Storage.Init();
	addEventListener("scriptmsg", function (msg) {
		action = msg;
	});

	while (true) {
		if (getUIFlag(0x09)) {
			delay(100);

			if (mapThread.running) {
				print("pause mapthread");
				mapThread.pause();
			}
		} else {
			if (!mapThread.running) {
				print("resume mapthread");
				mapThread.resume();
			}
		}

		if (action) {
			try {
				obj = JSON.parse(action);

				if (obj) {
					switch (obj.type) {
					case "area":
						Pather.moveToExit(obj.dest, true);

						break;
					case "unit":
						Pather.moveToUnit(obj.dest, true);

						break;
					case "wp":
						Pather.getWP(me.area);

						break;
					}
				}
			} catch (e) {

			}

			action = false;
		}

		delay(20);
	}
}