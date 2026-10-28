/*
	Base Stats
	----------
 	[0]Strength: 20		+40
 	[1]Energy: 25		+75
 	[2]Dexterity: 20	+15
 	[3]Vitality: 20		+375

	Skills				Levelreq			SkillID
	------------		--------			-------

*/

js_strict(true);

if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var AutoBuildTemplate = {

	BuildGoal: {
		Stats: [
			{stat: 1, target: 100},			// Energy
			{stat: 0, target: 60},			// Strength
			{stat: 3, target: 260},			// Vitality
			{stat: 2, target: 35},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 273, target: 1, from: 46},	// Mind Blast
			{id: 268, target: 1},			// Shadow Warrior
			{id: 271, target: 20},			// Lightning Sentry
			{id: 261, target: 20},			// Charged Bolt Sentry
			{id: 256, target: 1},			// Shock Web
			{id: 251, target: 1},			// Fire Blast
			{id: 258, target: 1},			// Burst of Speed
			{id: 252, target: 1},			// Claw Mastery
			{id: 267, target: 8},			// Fade
			{id: 256, target: 20, from: 46},// Shock Web
			{id: 276, target: 20, from: 46},// Death Sentry
			{id: 268, target: 15, from: 46},// Shadow Warrior
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 0, -1, 0, -1, -1, -1];
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
					//Config.UseMP = 30;
				}
				
				if (me.charlvl >= 45) {
					Config.RejuvBuffer = 4;
					
					Config.LowGold = me.charlvl * 3000;
					Config.StashGold = me.charlvl * 2000;
				}					
				
				if (me.diff > 0) {
					Config.BeltColumn = ["hp", "mp", "mp", "rv"];
					Config.UseHP = 80;
					
					Config.MercSkill = "Holy Freeze";
				}

				if (me.diff > 1) {
					Config.Gamble = true;
					
					Config.LifeChicken = 35;
					Config.UseHP = 85;
					Config.UseRejuvHP = 50;
					
					Config.BeltColumn = ["hp", "mp", "rv", "rv"];
					Config.MPBuffer = 0;
					Config.RejuvBuffer = 2;
					
					//Config.MercSkill = "Blessed Aim";
				}
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;									// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
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
				Config.AttackSkill = [-1, 251, -1, 251, -1, -1, -1];		// Fire Blast
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 256, -1, 256, -1, -1, -1];		// Shock Web
				Config.UseBoS = true;
			}
		},

	12:	{
			Update: function () {
				Config.UseTraps = true;
				Config.Traps = [261, 261, 261, 261, 261];
				Config.BossTraps = [261, 261, 261, 261, 261];
			}
		},

	18:	{
			Update: function () {
				Config.MakeRoom =  true;
				Config.TownCheck = true;
				Config.TownHP = 40;
				Config.HPBuffer = 0;
				Config.UseMP = 30;
				Config.LowManaSkill = [-1, -1];
				Config.PacketCasting = 1;									// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.UseBoS = false;
				Config.UseFade = true;
				
				Config.SummonShadow = "Warrior";
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				Config.RunewordRecipe.push([Runeword.Lionheart, "mageplate"]);	//261023 Runewords -> RunewordRecipe
				Config.RunewordRecipe.push([Runeword.Lionheart, "lightplate"]);	//261023 Runewords -> RunewordRecipe
				
				if (!Config.Tiered) {
					Config.CubeRecipe.push([Recipe.Moser2]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Boots, "wyrmhideboots"]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Belt, "sharkskinbelt"]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Amulet]);	//261023 Recipes -> CubeRecipe
					Config.CubeRecipe.push([Recipe.Caster.Ring]);	//261023 Recipes -> CubeRecipe
				}
				
				Config.Traps = [271, 271, 271, 271, 271];
				Config.BossTraps = [271, 271, 271, 271, 271];
			}
		},

	25:	{
			Update: function () {
				Config.Dodge.Enabled = true;	//261002 18 -> 25
			}
		},

	46:	{
			Update: function () {
				Config.AttackSkill = [-1, 256, -1, 256, -1, 273, -1];		// Mind Blast
			}
		}
};
