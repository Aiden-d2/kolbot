/*
*	@title	:	AutoBuildThread.js
*/

js_strict(true);

if (!isIncluded("libs/Config.js")) { include("libs/Config.js"); };
if (!isIncluded("libs/Cubing.js")) { include("libs/Cubing.js"); };
if (!isIncluded("libs/Prototypes.js")) { include("libs/Prototypes.js"); };
if (!isIncluded("libs/Runewords.js")) { include("libs/Runewords.js"); };
if (!isIncluded("libs/Town.js")) { include("libs/Town.js"); };

Config.init(); // includes AutoBuild.js

var	debug				= 	!!Config.AutoBuild.DebugMode;
var	prevLevel			= 	me.charlvl;
const SPEND_POINTS		= 	true;						// For testing, it actually allows skill and stat point spending.
const STAT_ID_TO_NAME	=	[getLocaleString(4060),		// Strength
							getLocaleString(4069),		// Energy
						 	getLocaleString(4062),		// Dexterity
						 	getLocaleString(4066)];		// Vitality


// Will check if value exists in an Array
Array.prototype.contains = function (val) { return this.indexOf(val) > -1; };


function skillInValidRange (id) {
	switch (me.classid) {
		case 0:	return	6 <= id && id <= 35;	// Amazon
		case 1: return 36 <= id && id <= 65;	// Sorceress
		case 2:	return 66 <= id && id <= 95;	// Necromancer
		case 3:	return 96 <= id && id <= 125;	// Paladin
		case 4:	return 126 <= id && id <= 155;	// Barbarian
		case 5:	return 221 <= id && id <= 250;	// Druid
		case 6:	return 251 <= id && id <= 280;	// Assassin
		default:
	}
	return false;
};


function gainedLevels () { return me.charlvl - prevLevel; };


function getItemStat (id) {	// 260530
	var bonus = 0;
	var item = me.getItem(-1, 1);
	
	if (item) {
		do {
			bonus += item.getStat(id);
		} while (item.getNext());
	}
	
	return me.getStat(id) - bonus;
};


function spendStats () {	//260516
	var goal = AutoBuildTemplate.BuildGoal;
	if (!goal || !goal.Skills) {
		if (gainedLevels() > 0) {
			if (AutoBuildTemplate[me.charlvl] && AutoBuildTemplate[me.charlvl].StatPoints) { spendStatPoints(); }	// 260610
		}
		return;
	}
	//if (me.getStat(4) <= 0) { return; }
	var stats = goal.Stats;
	
	do {	//260917
		var totalSpents = 0;	// 260915
		for (var i = 0; i < stats.length; i++) {
			var entry = stats[i];
			var id = entry.stat, target = entry.target, per = entry.per || 0;
			var spent = 0;
			if (target !== "max" && getItemStat(id) >= target) { continue; }	//260530
			while (me.getStat(4) > 0) {
				if (totalSpents >= 5) { totalSpents = 0; i = -1; break; }	// 260917
				if (target !== "max" && getItemStat(id) >= target) { break; }	//260530
				if (per > 0 && spent >= per) { break; }
				var pointSpent = spendStatPoint(id);
				if (!pointSpent) {
					AutoBuild.print("spendStats: failed on " + STAT_ID_TO_NAME[id]);
					return;
				}
				
				if (debug) { AutoBuild.print("spendStats: Increased " + STAT_ID_TO_NAME[id] + " from " + (me.getStat(id) - 1) + " to " + me.getStat(id)); }  // 260625
				
				spent += 1;
				totalSpents += 1;	//260915
			}
		}
	} while (totalSpents > 0 && me.getStat(4) > 0);
};


function spendSkills () {	//260516
	var goal = AutoBuildTemplate.BuildGoal;
	if (!goal || !goal.Skills) {
		if (gainedLevels() > 0) {
			if (AutoBuildTemplate[me.charlvl] && AutoBuildTemplate[me.charlvl].SkillPoints) { spendSkillPoints(); }	// 260610
		}
		return;
	}
	var skills = goal.Skills;
	for (var i = 0; i < skills.length; i++) {
		var entry = skills[i];
		var id = entry.id, target = entry.target;
		if (me.getStat(5) <= 0) { return; }
		if (me.getSkill(id, 0) >= target) { continue; }
		var requiredLevel = getBaseStat("skills", id, 176);
		if (me.charlvl < requiredLevel) { continue; }
		if (entry.from && me.charlvl < entry.from) { continue; }
		if (entry.to && me.charlvl > entry.to) { continue; }
		if (!skillInValidRange(id)) { continue; }			// 260517
		var prereqs = getRequiredSkills(id);
		for (var j = 0; j < prereqs.length; j++) {
			if (me.getStat(5) <= 0) { return; }
			if (!me.getSkill(prereqs[j], 0)) {
				var prereqSpent = spendSkillPoint(prereqs[j]);
				if (!prereqSpent) {
					AutoBuild.print("spendSkills: failed on prereq " + prereqs[j]);
					return;
				}
			}
		}
		var maxSkillLvl = me.charlvl - requiredLevel + 1;	// 260517
		while (me.getStat(5) > 0 && me.getSkill(id, 0) < target && me.getSkill(id, 0) < maxSkillLvl) {	// 260517
			var pointSpent = spendSkillPoint(id);
			if (!pointSpent) {
				AutoBuild.print("spendSkills: failed on skill " + id);
				return;
			}
			
			if (debug) { AutoBuild.print("spendSkills: Increased " + getSkillById(id) + " ("+id+") from " + (me.getSkill(id, 0) - 1) + " to " + me.getSkill(id, 0)); }  // 260625
		}
	}
};


function spendStatPoint (id) {
	var unusedStatPoints = me.getStat(4);
	if (SPEND_POINTS) {
		useStatPoint(id);
		AutoBuild.print("useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]);
	} else {
		AutoBuild.print("Fake useStatPoint("+id+"): "+STAT_ID_TO_NAME[id]);
	}
	
	delay(Math.max(me.ping * 3, 300));	//260921
	
	return (unusedStatPoints - me.getStat(4) === 1);	// Check if we spent one point
};


function spendStatPoints () {
	var stats = AutoBuildTemplate[me.charlvl].StatPoints;
	var errorMessage = "\nInvalid stat " + Build.getBuildType() + " level " + me.charlvl;	// 260902
	var spentEveryPoint = true;
	var unusedStatPoints = me.getStat(4);
	var len = stats.length;

	if (len > unusedStatPoints) {
		len = unusedStatPoints;
		AutoBuild.print("Warning: Number of stats specified in your build template at level "+me.charlvl+" exceeds the available unused stat points"+
			"\nOnly the first "+len+" stats "+stats.slice(0, len).join(", ")+" will be added");
	}

	// We silently ignore stats set to -1
	for (var i = 0; i < len; i++) {
		var id = stats[i];
		var statIsValid = (typeof id === "number") && (0 <= id && id <= 3);

		if (id === -1) { continue; }
		else if (statIsValid) {
			var preStatValue = me.getStat(id);
			var pointSpent = spendStatPoint(id);
			if (SPEND_POINTS) {
				if (!pointSpent) {
					spentEveryPoint = false;
					AutoBuild.print("Attempt to spend point "+(i+1)+" in "+STAT_ID_TO_NAME[id]+" may have failed!");
				} else if (debug) {
					AutoBuild.print("Stat ("+(i+1)+"/"+len+") Increased "+STAT_ID_TO_NAME[id]+" from "+preStatValue+" to "+me.getStat(id));
				}
			}
		} else {
			throw new Error("Stat id must be one of the following:\n0:"+STAT_ID_TO_NAME[0] +
				",\t1:"+STAT_ID_TO_NAME[1]+",\t2:"+STAT_ID_TO_NAME[2]+",\t3:"+STAT_ID_TO_NAME[3] + errorMessage);
		}
	}

	return spentEveryPoint;
};


function getRequiredSkills (id) {

	function searchSkillTree (id) {
		var results = [];
		var skillTreeRight	= getBaseStat("skills", id, 181);
		var skillTreeMiddle	= getBaseStat("skills", id, 182);
		var skillTreeLeft	= getBaseStat("skills", id, 183);

		results.push(skillTreeRight);
		results.push(skillTreeMiddle);
		results.push(skillTreeLeft);

		for (var i = 0; i < results.length; i++) {
			var skill = results[i];
			//var skillInValidRange = (0 < skill && skill <= 280) && (![217, 218, 219, 220].contains(skill));	//260625
			var hardPointsInSkill = me.getSkill(skill, 0);

			//if (skillInValidRange && !hardPointsInSkill) {
			if (skillInValidRange(skill) && ![217, 218, 219, 220].contains(skill) && !hardPointsInSkill) {  // 260625
				requirements.push(skill);
				searchSkillTree(skill);	// search children;
			}
		}
	};

	var requirements = [];
	searchSkillTree(id);
	function increasing (a, b) { return a-b; };
	return requirements.sort(increasing);
};


function spendSkillPoint (id) {
	var unusedSkillPoints = me.getStat(5);
	var skillName = getSkillById(id)+" ("+id+")";		// TODO: Use let ?
	if (SPEND_POINTS) {
		useSkillPoint(id);
		AutoBuild.print("useSkillPoint(): "+skillName);
	} else {
		AutoBuild.print("Fake useSkillPoint(): "+skillName);
	}
	
	delay(Math.max(me.ping * 3, 300));	//260921
	
	return (unusedSkillPoints - me.getStat(5) === 1);	// Check if we spent one point
};


function spendSkillPoints () {
	var skills = AutoBuildTemplate[me.charlvl].SkillPoints;
	var errInvalidSkill = "\nInvalid skill " + Build.getBuildType() + " level " + me.charlvl;	// 260902
	var spentEveryPoint = true;
	var unusedSkillPoints = me.getStat(5);
	var len = skills.length;

	if (len > unusedSkillPoints) {
		len = unusedSkillPoints;
		AutoBuild.print("Warning: Number of skills specified in your build template at level "+me.charlvl+" exceeds the available unused skill points"+
			"\nOnly the first "+len+" skills "+skills.slice(0, len).join(", ")+" will be added");
	}

	// We silently ignore skills set to -1
	for (var i = 0; i < len; i++) {
		var id = skills[i];								// TODO: Use let ?

		if (id === -1) { continue; }
		else if (!skillInValidRange(id)) {
			throw new Error("Skill id "+id+" is not a skill for your character class"+errInvalidSkill);
		}

		var skillName = getSkillById(id)+" ("+id+")";	// TODO: Use let ?
		var requiredSkills = getRequiredSkills(id);
		if (requiredSkills.length > 0) {
			throw new Error("You need prerequisite skills "+requiredSkills.join(", ")+" before adding "+skillName+errInvalidSkill);
		}

		var requiredLevel = getBaseStat("skills", id, 176);
		if (me.charlvl < requiredLevel) {
			throw new Error("You need to be at least level "+requiredLevel+" before you get "+skillName+errInvalidSkill);
		}

		var pointSpent = spendSkillPoint(id);

		if (SPEND_POINTS) {
			if (!pointSpent) {
				spentEveryPoint = false;
				AutoBuild.print("Attempt to spend skill point "+(i+1)+" in "+skillName+" may have failed!");
			} else if (debug) {
				var actualSkillLevel = me.getSkill(id, 1);
				AutoBuild.print("Skill ("+(i+1)+"/"+len+") Increased "+skillName+" by one (level: ", actualSkillLevel+")");
			}
		}

		//delay(200);	// TODO: How long should we wait... if at all?	//260625
	}

	return spentEveryPoint;
};


/*
*	TODO: determine if changes need to be made for
*	the case of gaining multiple levels at once so as
*	not to bombard the d2bs event system
*/

// AutoBuildThread.js — main()
// after (260516)

function main () {
	try {
		AutoBuild.print("Loaded helper thread");
		//spendStats();	// 260516
		//spendSkills();	// 260516

		while (true) {	//260625
			var levels = gainedLevels();
			
			spendStats();
			spendSkills();
			
			if (levels > 0) {
				AutoBuild.print("Level up detected (", prevLevel, "-->", me.charlvl, ")");
				
				//AutoBuild.applyConfigUpdates();	//260803 order change with broadcast	//260807 disabled
				scriptBroadcast({event: "level up"});	//260803

				prevLevel += 1;
			}

			delay(1e3);
		}
	} catch (err) {
		print("Something broke!");
		print("Error:"+ err.toSource());
		print("Stack trace: \n"+ err.stack);
		return false;
	}

	return true;
};
