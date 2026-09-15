/*
	Base Stats
	----------
 	[0]Strength: 25
 	[1]Energy: 15
 	[2]Dexterity: 20
 	[3]Vitality: 25

	Skills				Levelreq			SkillID
	------------		--------			-------

*/

js_strict(true);

if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var AutoBuildTemplate = {

	BuildGoal: {
		Stats: [
			{stat: 3, target: 45},			// Vitality
			{stat: 0, target: 60},			// Strength
			{stat: 3, target: 215},			// Vitality
			{stat: 2, target: 75},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 114, target: 1},			// Holy Freeze
			{id: 117, target: 1},			// Holy Shield
			{id: 119, target: 1},			// Sanctuary
			{id: 101, target: 10},			// Holy Bolt
			{id: 98, target: 1},			// Might
			{id: 123, target: 20},			// Conviction
			{id: 121, target: 20},			// Fist
			{id: 101, target: 20, from: 50},// Holy Bolt
			{id: 118, target: 20, from: 50},// Holy Shock
			{id: 117, target: 18, from: 81},// Holy Shield
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 0, -1, 0, -1, -1, -1];
				Config.LowManaSkill = [0, -1];
				
				Config.LowGold = me.charlvl * 500;
				Config.StashGold = 1000;
				
				if (me.charlvl >= 2) {
					//Config.BeltColumn = ["hp", "hp", "mp", "mp"];
					Config.MinColumn = [4, 4, 4, 4];
				}
				
				if (me.charlvl >= 18) {
					Config.LowGold = me.charlvl * 1000;
					Config.StashGold = me.charlvl * 1000;
					
					Config.BeltColumn = ["hp", "hp", "mp", "mp"];
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
				}
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;									// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
				}
				
				Config.TierGoal.Head = 15;
				Config.TierGoal.Neck = 17;
				Config.TierGoal.Body = 21;
				Config.TierGoal.ArmR = 31;
				Config.TierGoal.ArmL = 41;
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
				Config.AttackSkill = [-1, 0, 98, 0, 98, -1, -1];
				Config.LowManaSkill = [0, 98];
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 101, 98, 101, 98, 0, 98];
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
				Config.PacketCasting = 1;								// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.AttackSkill = [-1, 101, 114, 101, 114, 0, 114];
				Config.Vigor = true;
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				
				if (!Config.Tiered) {
					Config.Recipes.push([Recipe.Caster.Boots, "wyrmhideboots"]);
					Config.Recipes.push([Recipe.Caster.Belt, "sharkskinbelt"]);
					Config.Recipes.push([Recipe.Caster.Amulet]);
					Config.Recipes.push([Recipe.Caster.Ring]);
				}
			}
		},

	30:	{
			Update: function () {
				Config.AttackSkill = [-1, 121, 123, 121, 123, 101, 123];	// Blessed Hammer + Conviction
				Config.Conviction = true;
			}
		}
};
