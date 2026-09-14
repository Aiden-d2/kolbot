/*
	Base Stats
	----------
 	[0]Strength: 10
 	[1]Energy: 35
 	[2]Dexterity: 25
 	[3]Vitality: 10

	Skills				Levelreq			SkillID
	------------		--------			-------

*/

js_strict(true);

if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var AutoBuildTemplate = {

	BuildGoal: {
		Stats: [
			{stat: 0, target: 60},			// Strength
			{stat: 1, target: 100, per: 2},	// Energy
			{stat: 3, target: 260},			// Vitality
			{stat: 2, target: 35},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 43, target: 1},			// Telekinesis
			{id: 50, target: 1},			// Shiver Armor
			{id: 54, target: 1},			// Teleport
			{id: 44, target: 1, from: 23},	// Frost Nova
			{id: 58, target: 1, from: 43},	// Energy Shield
			{id: 39, target: 1},			// Ice Bolt
			{id: 40, target: 1},			// Frozen Armor
			{id: 37, target: 1},			// Warmth
			{id: 45, target: 1},			// Ice Blast
			{id: 39, target: 20, to: 16},	// Ice Bolt
			{id: 65, target: 1},   			// Cold Mastery
			{id: 59, target: 20},			// Blizzard
			{id: 55, target: 20},			// Glacial Spike
			{id: 39, target: 20, from: 19},	// Ice Bolt
			{id: 45, target: 20, from: 19},	// Ice Blast
			{id: 65, target: 20},			// Cold Mastery
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 36, -1, 36, -1, -1, -1];		// Fire Bolt
				Config.LowManaSkill = [0, -1];
				
				Config.LowGold = me.charlvl * 500;
				Config.StashGold = 1000;
				
				if (me.charlvl >= 2) {
					Config.BeltColumn = ["hp", "hp", "mp", "mp"];
					Config.MinColumn = [4, 4, 4, 4];
				}
				
				if (me.charlvl >= 18) {
					Config.LowGold = me.charlvl * 1000;
					Config.StashGold = me.charlvl * 1000;
					
					Config.BeltColumn = ["hp", "mp", "mp", "mp"];
				}
				
				if (me.charlvl >= 24) {
					Config.UseHP = 70;
					Config.UseMP = 30;
				}
				
				if (me.charlvl >= 45) {
					Config.RejuvBuffer = 4;
				}					
				
				if (me.diff > 0) {
					Config.BeltColumn = ["hp", "mp", "mp", "rv"];
					Config.UseHP = 80;
				}

				if (me.diff > 1) {
					Config.Gamble = true;
					
					Config.LifeChicken = 35;
					Config.UseHP = 85;
					Config.UseRejuvHP = 50;
					
					Config.BeltColumn = ["hp", "mp", "rv", "rv"];
					Config.MPBuffer = 0;
					Config.RejuvBuffer = 2;
					
					Config.MercSkill = "Prayer";
				}
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;								// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
				}
				
				//Config.PickitFiles.push("S.COLD.nip");
				
				Config.TierGoal.Head = 15;
				Config.TierGoal.Neck = 17;
				Config.TierGoal.Body = 21;
				Config.TierGoal.ArmR = 31;
				Config.TierGoal.ArmL = 21;
				Config.TierGoal.RingR = 14;
				Config.TierGoal.RingL = 14;
				Config.TierGoal.Belt = 16;
				Config.TierGoal.Boots = 13;
				Config.TierGoal.Mitts = 13;
				
				Equip.updateTiers();
				Grant.updateTiers();
			}
		},

	2:	{
			Update: function () {
				Config.AttackSkill = [-1, 39, -1, 39, -1, -1, -1];		// Ice Bolt
			}
		},

	18:	{
			Update: function () {
				Config.Dodge.Enabled = true;
				Config.MakeRoom =  true;
				Config.TownCheck = true;
				Config.TownHP = 40;
				Config.HPBuffer = 0;
				Config.UseMP = 50;
				Config.LowManaSkill = [-1, -1];
				Config.PacketCasting = 1;								// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.AttackSkill = [-1, 55, -1, 55, -1, -1, -1];		// Glacial Spike
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				Config.Runewords.push([Runeword.Lionheart, "mageplate"]);
				Config.Runewords.push([Runeword.Lionheart, "lightplate"]);
				
				if (!Config.Tiered) {
					Config.Recipes.push([Recipe.Moser2]);
					Config.Recipes.push([Recipe.Caster.Boots, "wyrmhideboots"]);
					Config.Recipes.push([Recipe.Caster.Belt, "sharkskinbelt"]);
					Config.Recipes.push([Recipe.Caster.Amulet]);
					Config.Recipes.push([Recipe.Caster.Ring]);
				}
				
				Config.AttackSkill = [-1, 59, 55, 59, 55, -1, 43];		// Blizzard + Glacial Spike
			}
		}
};
