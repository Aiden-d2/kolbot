/*
	Base Stats
	----------
 	[0]Strength: 20
 	[1]Energy: 25
 	[2]Dexterity: 20
 	[3]Vitality: 20

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
			{id: 258, target: 1},			// Burst of Speed
			{id: 267, target: 1},			// Fade
			{id: 251, target: 1},			// Fire Blast
			{id: 252, target: 1},			// Claw Mastery
			{id: 271, target: 20},			// Lightning Sentry
			//{id: 273, target: 1},			// Mind Blast
			{id: 261, target: 20},			// Charged Bolt Sentry
			{id: 256, target: 20},			// Shock Web
			{id: 268, target: 1},			// Shadow Warrior
			{id: 276, target: 20},			// Death Sentry
			{id: 267, target: 12},			// Fade
			{id: 251, target: 12, from: 9},	// Fire Blast
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
					
					Config.MercSkill = "Blessed Aim";
				}
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;									// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
				}
				
				//Config.PickitFiles.push("A.TRAP.nip");
				
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
				Config.AttackSkill = [-1, 251, -1, 251, -1, -1, -1];		// Fire Blast
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 256, -1, 256, -1, 251, -1];		// Shock Web
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
				Config.Dodge.Enabled = true;
				Config.MakeRoom =  true;
				Config.TownCheck = true;
				Config.TownHP = 40;
				Config.HPBuffer = 0;
				Config.UseMP = 30;
				Config.LowManaSkill = [-1, -1];
				Config.PacketCasting = 1;									// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.SummonShadow = "Warrior";
				Config.UseBoS = false;
				Config.UseFade = true;	
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
				
				Config.Traps = [271, 271, 271, 271, 271];
				Config.BossTraps = [271, 271, 271, 271, 271];
			}
		}
};
