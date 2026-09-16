/*
	Base Stats
	----------
 	[0]Strength: 30
 	[1]Energy: 10
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
			{stat: 0, target: 60},			// Strength
			{stat: 2, target: 35},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 155, target: 1},			// Battle Command
			{id: 154, target: 1},			// War Cry
			{id: 153, target: 1},			// Natural Resistance
			{id: 149, target: 20},			// Battle Orders
			{id: 153, target: 7},			// Natural Resistance
			{id: 138, target: 1},			// Shout
			{id: 154, target: 20},			// War Cry
			{id: 130, target: 20},			// Howl
			{id: 137, target: 20, from: 31},// Taunt
			{id: 146, target: 20, from: 31},// Battle Cry
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 0, -1, 0, -1];
				Config.LowManaSkill = [0];
				
				Config.LowGold = me.charlvl * 500;
				Config.StashGold = 1000;
				
				if (me.charlvl >= 2) {
					Config.MinColumn = [4, 4, 4, 4];
				}
				
				if (me.charlvl >= 18) {
					Config.LowGold = me.charlvl * 1000;
					Config.StashGold = me.charlvl * 1000;
					
					Config.BeltColumn = ["hp", "hp", "hp", "mp"];
				}
				
				if (me.charlvl >= 24) {
					Config.UseHP = 70;
					//Config.UseMP = 30;
				}
				
				if (me.charlvl >= 45) {
					Config.RejuvBuffer = 4;
				}					
				
				if (me.charlvl >= 30) {
					Config.BeltColumn = ["hp", "mp", "mp", "mp"];
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
				
				if (me.profile === Team.Leader) {
					Config.PublicMode = 3;									// 1 = invite and accept, 2 = accept only, 3 = invite only, 0 = disable
				}
				
				Config.TierGoal.Head = 15;
				Config.TierGoal.Neck = 17;
				Config.TierGoal.Body = 21;
				Config.TierGoal.ArmR = 35;
				Config.TierGoal.ArmL = 35;
				Config.TierGoal.RingR = 14;
				Config.TierGoal.RingL = 14;
				Config.TierGoal.Belt = 16;
				Config.TierGoal.Boots = 13;
				Config.TierGoal.Mitts = 13;
				
				Equip.updateTiers();
				Grant.updateTiers();
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
				Config.LowManaSkill = [-1];
				Config.PacketCasting = 1;								// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.AttackSkill = [130, 0, -1, 0, -1];				// Howl
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				Config.Runewords.push([Runeword.Lionheart, "mageplate"]);
				Config.Runewords.push([Runeword.Lionheart, "lightplate"]);
				
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
				Config.AttackSkill = [130, 154, -1, 154, -1];			// War Cry
				Config.LowManaSkill = [130];
			}
		}
};
