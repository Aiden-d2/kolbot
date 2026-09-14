/**
*	@filename	HeartBeat.js
*	@author		kolton
*	@desc		Keep a link with d2bot#. If it's lost, the d2 window is killed
*/

function main() {
	include("tools/OOG.js");
	include("tools/json2.js");
	include("libs/Misc.js");
	D2Bot.init();
	print("Heartbeat loaded");

	function togglePause() {
		var script = getScript();

		if (script) {
			do {
				if (script.name.indexOf(".dbj") > -1) {
					if (script.running) {
						print("ÿc1Pausing ÿc0" + script.name);
						script.pause();
					} else {
						print("ÿc2Resuming ÿc0" + script.name);
						script.resume();
					}
				}
			} while (script.getNext());
		}

		return true;
	}

	// Event functions
	function KeyEvent(key) {
		switch (key) {
		case 19:
			if (me.ingame) {
				break;
			}

			togglePause();

			break;
		}
	}
	
	function ScriptEvent(msg) {	// 260903
		if (msg !== "reload") {
			return;
		}

		if (getScript("threads/Reload.js")) {
			Messaging.sendToScript("threads/Reload.js", "reload");
		} else {
			load("threads/Reload.js");
		}
	}	
	
	addEventListener("scriptmsg", ScriptEvent);
	addEventListener("keyup", KeyEvent);

	while (true) {
		D2Bot.heartBeat();
		delay(1000);
	}
}