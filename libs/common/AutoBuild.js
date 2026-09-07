/**
*	@title	:	AutoBuild.js
*
*	@author	:	alogwe
*
*	@desc	:	This script is included when any script includes libs/common/Config.js and calls Config.init().
*				If enabled, loads a threaded helper script that will monitor changes in character level and
*				upon level up detection, it will spend skill and stat points based on a configurable
*				character build template file located in libs/config/Builds/*.
*
*				Any skill and stat points obtained as quest rewards are currently
*				invisible to this script and must be spent manually.
*
*	@todo	:	Make this file "libs/config/Builds/README.txt"
*/
js_strict(true);

if (!isIncluded("common/Cubing.js")) { include("common/Cubing.js"); };
if (!isIncluded("common/Prototypes.js")) { include("common/Prototypes.js"); };
if (!isIncluded("common/Runewords.js")) { include("common/Runewords.js"); };
if (!isIncluded("user/Build.js")) { include("user/Build.js"); };
if (!isIncluded("common/Pickit.js")) { include("common/Pickit.js"); };

var AutoBuild = new function AutoBuild () {

	if (Config.AutoBuild.DebugMode) { Config.AutoBuild.Verbose = true; }

	var debug = !!Config.AutoBuild.DebugMode,
		verbose = !!Config.AutoBuild.Verbose,
		configUpdateLevel = 0;


	// Apply all Update functions from the build template in order from level 1 to me.charlvl.
	// By reapplying all of the changes to the Config object, we preserve
	// the state of the Config file without altering the saved char config.
	
	function applyConfigUpdates () {	// 260516
		if (debug) { this.print("Updating Config from level "+configUpdateLevel+" to "+me.charlvl)}
		while (configUpdateLevel < me.charlvl) {
			configUpdateLevel += 1;
			if (AutoBuildTemplate[configUpdateLevel] && AutoBuildTemplate[configUpdateLevel].Update) {	// 260516
				AutoBuildTemplate[configUpdateLevel].Update.apply(Config);
			}
		}
		
		var buildconfig = {};	//260803
		for (var key in Config) {
			if (typeof Config[key] !== "function") {
				buildconfig[key] = Config[key];
			}
		}
		
		Misc.fileAction("_cache/config." + me.profile + ".json", 1, JSON.stringify(buildconfig));	//260803
	};
	
	function getCurrentScript () {
		return getScript(true).name.toLowerCase();
	};


	function getLogFilename () {
		var d = new Date();
		var dateString = d.getMonth()+"_"+d.getDate()+"_"+d.getFullYear();
		return "logs/AutoBuild."+me.realm+"."+me.charname+"."+dateString+".log";
	};


	function getTemplateFilename () {
		//var classname = ["M", "S", "N", "P", "B", "D", "A"][me.classid];
		var build = Build.getBuildType();
		//var template = "build/"+classname+"."+build+".js";
		var template = "build/" + build + ".js";	//260902
		return template.toLowerCase();
	};


	function initialize () {
		var currentScript = getCurrentScript();
		var classname = ["M", "S", "N", "P", "B", "D", "A"][me.classid];	// 260902
		
		if (String(Build.getBuildType()).split(".")[0] !== classname) {	// 260902
			throw new Error("Mismatched class: " + Build.getBuildType() + " vs " + classname);	// 260902
		}
		
		var template = getTemplateFilename();
		
		if (currentScript === "default.dbj") {	//260803
			var nipName = template.match(/[^/]+(?=\.js$)/)[0];
			var nipFile = nipName.toUpperCase() + ".nip";
			
			if (Config.PickitFiles.indexOf(nipFile) === -1) {
				Config.PickitFiles.push(nipFile);
			}
			
			Pickit.init(true);
		}
		
		if (!include(template)) {
			throw new Error("Failed to include template: " + template);
		}

		if (currentScript === "default.dbj") {	//260903
			print("Loaded ÿc9[" + Build.getBuildType() + ".js]");
		}
		
		// Only load() helper thread from default.dbj if it isn't loaded
		if (currentScript === "default.dbj" && !getScript("tools\\autobuildthread.js")) {
			load("tools/autobuildthread.js");
		}

		// All threads except autobuildthread.js use this event listener
		// to update their thread-local Config object
		if (currentScript !== "tools\\autobuildthread.js") {
			addEventListener("scriptmsg", levelUpHandler);
		}

		// Resynchronize our Config object with all past changes
		// made to it by AutoBuild system
		//applyConfigUpdates();	//260803
		
		if (currentScript === "default.dbj") {	//260803
			applyConfigUpdates();
		}
	};


	function levelUpHandler (obj) {
		if (typeof obj === "object" && obj.hasOwnProperty("event") && obj["event"] === "level up") {
			applyConfigUpdates();
		}
	};


	function log (message) { FileTools.appendText(getLogFilename(), message+"\n"); };


	// Only print to console from autobuildthread.js,
	// but log from all scripts
	function myPrint () {
		var args = Array.prototype.slice.call(arguments);
		args.unshift("AutoBuild:");
		var result = args.join(" ");
		if (verbose) { print.call(this, result); }
		if (debug) { log.call(this, result); }
	};


	this.print = myPrint;
	this.initialize = initialize;
	this.applyConfigUpdates = applyConfigUpdates;

};
