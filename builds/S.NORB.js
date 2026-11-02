/**
	Base Stats
	----------
 	[0]Strength: 10		+50
 	[1]Energy: 35		+65
 	[2]Dexterity: 25	+10
 	[3]Vitality: 10		+380

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
			{id: 58, target: 1, from: 46},		// Energy Shield
			{id: 59, target: 1},				// Blizzard
			{id: 55, target: 1},				// Glacial Spike
			{id: 50, target: 1},				// Shiver Armor
			{id: 45, target: 1},				// Ice Blast
			{id: 39, target: 1},				// Ice Bolt
			{id: 40, target: 1},				// Frozen Armor
			{id: 54, target: 1},				// Teleport
			{id: 43, target: 1},				// Telekinesis
			{id: 37, target: 1},				// Warmth
			{id: 64, target: 20},				// Frozen Orb
			{id: 65, target: 16},   			// Cold Mastery
			{id: 63, target: 1, from: 46},		// Lightning Mastery
			{id: 48, target: 20, from: 46},		// Nova
			{id: 63, target: 20, from: 46},		// Lightning Mastery
			{id: 39, target: 20, from: 46},		// Ice Bolt
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 36, -1, 36, -1, -1, -1];			// Fire Bolt
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
					
					Config.LowGold = me.charlvl * 3000;
					Config.StashGold = me.charlvl * 2000;
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
					
					//Config.BeltColumn = ["hp", "mp", "rv", "rv"];
					Config.MPBuffer = 0;
					Config.RejuvBuffer = 2;
					
					Config.MercSkill = "Prayer";
				}
				
				Config.TierGoal.Helm = 15;	//261028 renamed
				Config.TierGoal.Amulet = 17;	//261028 renamed
				Config.TierGoal.Armor = 31;	//261028 renamed
				Config.TierGoal.ArmG = 31;	//261028 renamed
				Config.TierGoal.ArmB = 25;	//261028 renamed
				Config.TierGoal.RingG = 14;	//261028 renamed
				Config.TierGoal.RingB = 14;	//261028 renamed
				Config.TierGoal.Belt = 16;
				Config.TierGoal.Boots = 13;
				Config.TierGoal.Gloves = 13;	//261028 renamed
				
				Equip.updateTiers();
				Grant.updateTiers();
			}
		},

	2:	{
			Update: function () {
				Config.AttackSkill = [-1, 39, -1, 39, -1, -1, -1];		// Ice Bolt
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 45, -1, 45, -1, -1, -1];		// Ice Blast
			}
		},

	18:	{
			Update: function () {
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
				
				if (!Config.Tiered) {
					Config.CubeRecipe.push([Recipe.Moser2]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Boots, "wyrmhideboots"]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Belt, "sharkskinbelt"]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Amulet]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Ring]);	//261023 Recipes -> CubeRecipe
				}
				
				Config.AttackSkill = [-1, 59, 55, 59, 55, -1, -1];		// Blizzard + Glacial Spike
			}
		},

	25:	{
			Update: function () {
				Config.Dodge.Enabled = true;	//261002 18 -> 25
			}
		},

	30:	{
			Update: function () {
				Config.AttackSkill = [-1, 64, -1, 64, -1, -1, 43];		// Frozen Orb
			}
		},

	65:	{
			Update: function () {
				Config.AttackSkill = [-1, 64, 48, 64, 48, -1, 43];		// Frozen Orb + Nova
			}
		}
};
