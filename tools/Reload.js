/**
*	@filename	Reload.js
*	@desc		Restart in-game scripts without leaving the game
*	@note		heartbeat and the starter (.dbj) are intentionally excluded
*/

function main () {
	var reloadFlag = true,
		scripts = [
			"tools/autobuildthread.js",
			"tools/toolsthread.js",
			"tools/townchicken.js",
			"default.dbj"
		];

	function stopAll () {
		var i, script;

		for (i = 0; i < scripts.length; i += 1) {
			script = getScript(scripts[i]);

			if (script) {
				script.stop();
			}
		}

		return true;
	}

	addEventListener("scriptmsg", function (msg) {
		if (msg === "reload") {
			reloadFlag = true;
		}
	});

	while (me.ingame) {
		if (reloadFlag) {
			reloadFlag = false;

			print("ÿc2D2BSÿc0 :: Stopping scripts");
			stopAll();
			delay(3000);

			print("ÿc2D2BSÿc0 :: Reloading default.dbj");
			load("default.dbj");
		}

		delay(1000);
	}

	print("Script ended, cleaning up");
	stopAll();

	return true;
}