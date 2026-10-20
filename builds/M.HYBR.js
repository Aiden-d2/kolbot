/*
	Base Stats
	----------
 	[0]Strength: 20		+53
 	[1]Energy: 15		+47
 	[2]Dexterity: 25	+85
 	[3]Vitality: 20		+320

	Skills				Levelreq			SkillID
	------------		--------			-------

*/

js_strict(true);

if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var AutoBuildTemplate = {

	BuildGoal: {
		Stats: [
			{stat: 0, target: 60, per: 3},	// Strength
			{stat: 2, target: 65},			// Dexterity
			{stat: 1, target: 62},			// Energy
			{stat: 3, target: 110},			// Vitality
			{stat: 2, target: 110, per: 3},	// Dexterity
			{stat: 0, target: 80},			// Strength
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 31, target: 1},			// Freezing Arrow
			{id: 21, target: 1},			// Ice Arrow
			{id: 32, target: 1},			// Valkyrie
			{id: 31, target: 20},			// Freezing Arrow
			{id: 11, target: 20},			// Cold Arrow
			{id: 21, target: 20},			// Ice ArrowPierce
			{id: 18, target: 6},			// Avoid
			{id: 13, target: 9},			// Dodge
			{id: 29, target: 9},			// Evade
			{id: 33, target: 8},			// Pierce
			{id: 22, target: 10},			// Guided Arrow
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
				}

				if (me.diff > 1) {
					Config.Gamble = true;
					
					Config.LifeChicken = 35;
					Config.UseHP = 85;
					Config.UseRejuvHP = 50;
					
					//Config.BeltColumn = ["hp", "mp", "rv", "rv"];
					Config.MPBuffer = 0;
					Config.RejuvBuffer = 2;
					
					Config.MercSkill = "Blessed Aim";
				}
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;									// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
				}
				
				Config.TierGoal.Head = 15;
				Config.TierGoal.Neck = 31;
				Config.TierGoal.Body = 21;
				//Config.TierGoal.ArmR = 21;
				Config.TierGoal.ArmL = 45;
				Config.TierGoal.RingR = 23;
				Config.TierGoal.RingL = 14;
				Config.TierGoal.Belt = 16;
				Config.TierGoal.Boots = 13;
				Config.TierGoal.Mitts = 23;
				
				Equip.updateTiers();
				Grant.updateTiers();
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 11, -1, 11, -1, -1, -1];		// Cold Arrow
			}
		},

	18:	{
			Update: function () {
				Config.MakeRoom =  true;
				Config.TownCheck = true;
				Config.TownHP = 40;
				Config.HPBuffer = 0;
				Config.UseMP = 30;
				Config.PacketCasting = 1;									// 0 = disable, 1 = packet teleport, 2 = full packet casting.
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				Config.Runewords.push([Runeword.Duress, "mageplate"]);
				Config.Runewords.push([Runeword.Duress, "lightplate"]);
				
				if (!Config.Tiered) {
					Config.Recipes.push([Recipe.Caster.Boots, "wyrmhideboots"]);
					Config.Recipes.push([Recipe.Caster.Belt, "sharkskinbelt"]);
					Config.Recipes.push([Recipe.Caster.Amulet]);
					Config.Recipes.push([Recipe.Caster.Ring]);
				}
			}
		},

	25:	{
			Update: function () {
				Config.Dodge.Enabled = true;	//261002 18 -> 25
			}
		},

	30:	{
			Update: function () {
				Config.AttackSkill = [-1, 31, -1, 31, -1, 0, -1];		// Freezing Arrow
				Config.LowManaSkill = [11, -1];
				Config.SummonValkyrie = true;
			}
		},

	80:	{
			Update: function () {
				Config.AttackSkill = [-1, 31, -1, 31, -1, 22, -1];		// Guided Arrow
				Config.LowManaSkill = [22, -1];
				Config.Decoy = true;
			}
		}
};
