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
			{id: 58, target: 1, from: 43},		// Energy Shield
			{id: 50, target: 1},				// Shiver Armor
			{id: 45, target: 1},				// Ice Blast
			{id: 39, target: 1},				// Ice Bolt
			{id: 40, target: 1},				// Frozen Armor
			{id: 54, target: 1},				// Teleport
			{id: 43, target: 1},				// Telekinesis
			{id: 61, target: 1},				// Fire Mastery
			{id: 51, target: 20},				// Fire Wall
			{id: 42, target: 16, from: 18},		// Static Field
			{id: 61, target: 20},				// Fire Mastery
			{id: 52, target: 20, from: 50},		// Enchant
			{id: 37, target: 20, from: 50},		// Warmth
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
					
					Config.MercSkill = "Holy Freeze";
				}

				if (me.diff > 1) {
					Config.Gamble = true;
					
					Config.LifeChicken = 35;
					Config.UseHP = 85;
					Config.UseRejuvHP = 50;
					
					//Config.BeltColumn = ["hp", "mp", "rv", "rv"];
					Config.MPBuffer = 0;
					Config.RejuvBuffer = 2;
				}
				
				Config.TierGoal.Head = 15;
				Config.TierGoal.Neck = 17;
				Config.TierGoal.Body = 31;
				Config.TierGoal.ArmA = 31;
				Config.TierGoal.ArmB = 25;
				Config.TierGoal.RingA = 14;
				Config.TierGoal.RingB = 14;
				Config.TierGoal.Waist = 16;
				Config.TierGoal.Shoes = 13;
				Config.TierGoal.Hands = 13;
				
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
				Config.PacketCasting = 1;									// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.AttackSkill = [-1, 51, -1, 51, -1, -1, -1];			// Fire Wall
				
				Config.CastStatic = true;
				//Config.StaticHP = [25, 33, 50];
				//Config.StaticBossHP = [10, 33, 50];
				Config.StaticList = ["Andariel", "Duriel", "Mephisto", "Izual", "Diablo", "Baal"];
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				
				if (!Config.Tiered) {
					Config.CubeRecipe.push([Recipe.Moser2]);
					//Config.CubeRecipe.push([Recipe.Caster.Boots, "wyrmhideboots"]);
					Config.CubeRecipe.push([Recipe.Caster.Boots, "demonhideboots"]);
					Config.CubeRecipe.push([Recipe.Caster.Belt, "sharkskinbelt"]);
					Config.CubeRecipe.push([Recipe.Caster.Amulet]);
					Config.CubeRecipe.push([Recipe.Caster.Ring]);
				}
			}
		},

	25:	{
			Update: function () {
				Config.Dodge.Enabled = true;
			}
		},

	46:	{
			Update: function () {
				Config.AttackSkill = [-1, 51, -1, 51, -1, -1, 43];			// Fire Wall + Telekinesis
				//Config.CastStatic = true;
				//Config.StaticHP = [25, 33, 50];
				//Config.StaticBossHP = [10, 33, 50];
				Config.StaticList = [];	//every monster
			}
		},

	65:	{
			Update: function () {
				Config.Enchant.Enabled = true,
				Config.Enchant.Player = ["M.BOWF"];
				Config.Enchant.Merc = [338];
				Config.Enchant.Pet = [357, 417, 428];
				//Config.Enchant.Revive = true;
			}
		}
};
