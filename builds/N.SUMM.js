/*
	Base Stats
	----------
 	[0]Strength: 15
 	[1]Energy: 25
 	[2]Dexterity: 25
 	[3]Vitality: 15

	Skills				Levelreq			SkillID
	------------		--------			-------

*/

js_strict(true);

if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var AutoBuildTemplate = {

	BuildGoal: {
		Stats: [
			{stat: 0, target: 60},			// Strength
			{stat: 3, target: 330},			// Vitality
			{stat: 2, target: 35},			// Dexterity
			{stat: 3, target: "max"},		// Vitality
		],
		
		Skills: [
			{id: 66, target: 1},			// Amplify Damage
			{id: 69, target: 1},			// Skeleton Mastery
			{id: 67, target: 1},			// Teeth
			{id: 75, target: 1},			// Clay Golem
			{id: 70, target: 8},			// Raise Skeleton
			{id: 68, target: 1, from: 24},	// Bone Armor
			{id: 95, target: 20},			// Revive
			{id: 91, target: 9},			// Lower Resist
			{id: 87, target: 1},			// Decrepify
			{id: 89, target: 1},			// Summon Resist
			{id: 74, target: 20, from: 46},	// Corpse Explosion
			{id: 70, target: 20, from: 50},	// Raise Skeleton
			{id: 69, target: 20, from: 50},	// Skeleton Mastery
			{id: 89, target: 8, from: 50},	// Summon Resist
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
					Config.UseMP = 30;
				}
				
				if (me.charlvl >= 45) {
					Config.RejuvBuffer = 4;
				}					
				
				if (me.diff > 0) {
					Config.BeltColumn = ["hp", "mp", "mp", "rv"];
					Config.UseHP = 80;
					
					Config.MercSkill = "Thorns";
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
				
				Config.Skeletons = "max";
				Config.SkeletonMages = "max";
				Config.Revives = "max";
				Config.ActiveSummon = true;
				
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
				Config.Curse[0] = 66;
			}
		},

	6:	{
			Update: function () {
				Config.AttackSkill = [-1, 67, -1, 67, -1, -1, -1];
				Config.LowManaSkill = [-1, -1];
				Config.Golem = "Clay";
			}
		},

	12:	{
			Update: function () {
				Config.Curse[1] = 66;
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
				Config.PacketCasting = 1;								// 0 = disable, 1 = packet teleport, 2 = full packet casting.
				
				Config.AttackSkill = [-1, 500, -1, 500, -1, -1, -1];
				//Config.AttackSkill = [-1, 3, -1, 3, -1, -1, -1];
			}
		},

	24:	{
			Update: function () {
				Config.Cubing = true;
				Config.Runewords.push([Runeword.Bone, "mageplate"]);
				Config.Runewords.push([Runeword.Bone, "lightplate"]);
				
				if (!Config.Tiered) {
					Config.Recipes.push([Recipe.Moser2]);
					Config.Recipes.push([Recipe.Caster.Boots, "wyrmhideboots"]);
					Config.Recipes.push([Recipe.Caster.Belt, "sharkskinbelt"]);
					Config.Recipes.push([Recipe.Caster.Amulet]);
					Config.Recipes.push([Recipe.Caster.Ring]);
				}
				
				Config.Curse[0] = 87;
				Config.Curse[1] = 87;
			}
		},

	30:	{
			Update: function () {
				Config.Curse[0] = 91;
				Config.Curse[1] = 91;
			}
		},

	46:	{
			Update: function () {
				Config.ExplodeCorpses = 74;
			}
		}
};
