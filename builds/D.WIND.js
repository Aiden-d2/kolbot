/*
	Base Stats
	----------
 	[0]Strength: 15
 	[1]Energy: 20
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
			{stat: 0, target: 65},			// Strength
			{stat: 3, target: 330},			// Vitality
			{stat: 2, target: 35},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],

		Skills: [
			{id: 245, target: 1},			// Tornado
			{id: 240, target: 1},			// Twister
			{id: 235, target: 1},			// Cyclone Armor
			{id: 237, target: 1},			// Summon Dire Wolf
			{id: 226, target: 20, to: 16},	// Oak Sage
			{id: 226, target: 20, from: 19},// Oak Sage
			{id: 227, target: 1},			// Summon Spirit Wolf
			{id: 247, target: 1},			// Summon Grizzly
			{id: 250, target: 1},			// Hurricane
			{id: 245, target: 20, to: 28},	// Tornado
			{id: 245, target: 20, from: 31},// Tornado
			{id: 240, target: 20},			// Twister
			{id: 250, target: 20},			// Hurricane
			{id: 235, target: 20, from: 31},// Cyclone Armor
			{id: 237, target: 6},			// Summon Dire Wolf
		]
	},

	1:	{	
			Update: function () {
				Config.AttackSkill = [-1, 0, -1, 0, -1, -1, -1];
				Config.LowManaSkill = [0, -1];
				
				Config.LowGold = me.charlvl * 500;
				Config.StashGold = 1000;
				
				if (me.charlvl >= 6) {
					Config.BeltColumn = ["hp", "hp", "hp", "mp"];
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
					
					Config.MercSkill = "Might";
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

	6:	{
			Update: function () {
				Config.SummonSpirit = "Oak Sage";
				Config.SummonAnimal = "Spirit Wolf";
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
				
				Config.AttackSkill = [-1, 240, -1, 240, -1, -1, -1];	// Twister
				Config.SummonAnimal = "Dire Wolf";
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
				
				Config.AttackSkill = [-1, 245, -1, 245, -1, -1, -1];  // Tornado
			}
		},

	30:	{
			Update: function () {
				Config.SummonAnimal = "Grizzly";
			}
		}
};
