/**
*	@filename	Config.js
*	@author		kolton
*	@desc		config loading and default config values storage
*/

if (!isIncluded("Settings.js")) { include("Settings.js"); };
if (!isIncluded("libs/Cubing.js")) { include("libs/Cubing.js"); };
if (!isIncluded("libs/Prototypes.js")) { include("libs/Prototypes.js"); };
if (!isIncluded("libs/Runewords.js")) { include("libs/Runewords.js"); };
if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };	//260803

var Scripts = {
	AutoSmurf: true
};

var Config = {
	init: function (notify) {	//260803
		try {
			var currentScript = getScript(true).name.toLowerCase();
			if (Config.AutoBuild.Enabled === true) {
				if (currentScript === "default.dbj" || currentScript === "threads\\autobuildthread.js") {
					if (!isIncluded("libs/AutoBuild.js") && include("libs/AutoBuild.js")) {
						AutoBuild.initialize();
					}
				} else {
					var cached = Misc.fileAction("_cache/config." + me.profile + ".json", 0);
					if (cached) {
						var parsed = JSON.parse(cached);
						for (var key in parsed) {
							if (parsed.hasOwnProperty(key)) {
								Config[key] = parsed[key];
							}
						}
						addEventListener("scriptmsg", function (obj) {
							if (typeof obj === "object" && obj.hasOwnProperty("event") && obj["event"] === "level up") {
								var p, updated, attempts = 0;
								while (attempts < 30) {
									try {
										updated = Misc.fileAction("_cache/config." + me.profile + ".json", 0);
										if (updated) {
											p = JSON.parse(updated);
											for (var k in p) {
												if (p.hasOwnProperty(k)) { Config[k] = p[k]; }
											}
										}
										break;
									} catch (e) {
										attempts += 1;
										delay(100);
									}
								}
							}
						});
					} else {
						print("ÿc8Error: Config cache not found for " + me.profile);
					}
				}
			}
		} catch (e3) {
			print("ÿc8Error in Config.init");
			print(e3.toSource());
		}
	},

	//NIP
	PickitFiles: ["X.nip", "Y.nip", "Z.nip", "V.nip"],
	
	//Pathing
	OpenChests: false,
	ScanShrines: [1, 2, 3],
	UseWells: true,	//260806
	
	NoSkipArea: [17],	//8, 38, 131	//260916
	DetourPath: 4,
	
	SafeTele: {	//eom 260525
		Enabled: true,
		Range: 9,
		Count: 1,
		Angle: 60,
		Step: 5,
		Min: 15,
		Skip: [62, 63, 64, 120, 132]
	},

	Dodge: {
		Enabled: false,
		Range: 13,
		Count: 1,
		HP: 100,
		Step: 5
	},
	
	//Gear
	Gear: {1: "Head", 2: "Neck", 3: "Body", 4: "ArmR", 5: "ArmL", 6: "RingR", 7: "RingL", 8: "Belt", 9: "Boots", 10: "Mitts"},  //260804

	Tiered: false,
	
	TieredGear: {	//260805
		Head: false,
		Neck: false,
		Body: false,
		ArmR: false,
		ArmL: false,
		RingR: false,
		RingL: false,
		Belt: false,
		Boots: false,
		Mitts: false
	},

	TierGoal: {
		Head: 0,
		Neck: 0,
		Body: 0,
		ArmR: 0,
		ArmL: 0,
		RingR: 0,
		RingL: 0,
		Belt: 0,
		Boots: 0,
		Mitts: 0
	},

	TierNow: {
		Head: {tier: 0, str: 0, dex: 0},   //260804
		Neck: {tier: 0, str: 0, dex: 0},
		Body: {tier: 0, str: 0, dex: 0},
		ArmR: {tier: 0, str: 0, dex: 0},
		ArmL: {tier: 0, str: 0, dex: 0},
		RingR: {tier: 0, str: 0, dex: 0},
		RingL: {tier: 0, str: 0, dex: 0},
		Belt: {tier: 0, str: 0, dex: 0},
		Boots: {tier: 0, str: 0, dex: 0},
		Mitts: {tier: 0, str: 0, dex: 0}
	},

	//Merc
	UseMerc: false,
	UseMercHP: 0,
	UseMercRejuv: 0,
	
	MercWatch: false,
	MercChicken: 0,
	MercMinGold: 200000,
	
	MercStat: {id: null, str: 0, dex: 0, lvl: 0},  //260804
	
	MercSkill: "",
										// "Fire Arrow": 7 (Act1)
										// "Cold Arrow": 11 (Act1)
										// "Prayer": 99 (Act2 Normal/Hell Combat)
										// "Defiance": 104 (Act2 Normal/Hell Defensive)
										// "Blessed Aim": 108 (Act2 Normal/Hell Offensive)
										// "Thorns": 103 (Act2 Nightmare Combat)
										// "Holy Freeze": 114 (Act2 Nightmare Defensive)
										// "Might": 98 (Act2 Nightmare Offensive)
										// "Fire Ball": 47 (Act3)
										// "Lightning": 49 (Act3)
										// "Glacial Spike": 55 (Act3)
										// "Bash": 126 (Act5)
	
	TierMerc: {
		Head: {merc: 0, str: 0, dex: 0},   //260804
		Body: {merc: 0, str: 0, dex: 0},
		ArmR: {merc: 0, str: 0, dex: 0}
	},
	
	//Time
	MinGameTime: 300,
	MaxGameTime: 1800,

	//Chicken
	LifeChicken: 20,
	ManaChicken: 0,
	IronGolemChicken: 0,
	
	TownHP: 0,
	TownMP: 0,
	
	//Healing
	UseHP: 50,
	UseMP: 20,
	
	UseRejuvHP: 40,
	UseRejuvMP: 0,
	
	HealStatus: true,

	HealHP: 90,
	HealMP: 90,
	
	//Inventory
	LowGold: 0,
	StashGold: 0,
	
	Cube: [
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1],
		[1, 1, 1]
	],
	
	Stash: [
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1]
	],
	
	Inventory: [
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1],
		[1, 1, 1, 1, 1, 1, 1, 1, 1, 1]
	],
	
	HPBuffer: 4,
	MPBuffer: 4,
	RejuvBuffer: 0,
	
	BeltColumn: ["hp", "hp", "hp", "hp"],
	MinColumn: [1, 1, 1, 1],
	
	PingQuit: [{Ping: 0, Duration: 0}],
	
	//Party
	PublicMode: 2,
	
	//Town
	Gamble: false,
	GambleItems: [520, 522],
	GambleGoldStart: 2000000,
	GambleGoldStop: 500000,
	
	MiniShopBot: false,
	
	TownCheck: false,
	MakeRoom: false,
	
	RepairPercent: 40,
	
	//Fastmod
	FCR: 0,
	FHR: 0,
	FBR: 0,
	IAS: 0,
	PacketCasting: 0,
	PacketShopping: true,
	
	//Auto
	AutoEquip: true,
	AutoBuild: {
		Enabled: true,
		Verbose: false,
		DebugMode: true
	},

	//Logs
	SkipLogging: [],
	
	Debug: false,
	LogExperience: true,
	LogCubingInfo: true,

	ItemInfo: true,
	ItemInfoQuality: [0, 1, 2, 3, 4, 5, 6, 7, 8],

	LogEssences: false,
	LogKeys: true,
	LogOrgans: true,
	
	LogLowRunes: false,
	LogMiddleRunes: false,
	LogHighRunes: true,
	
	LogLowGems: false,
	LogHighGems: false,
	
	//Cubing
	Cubing: false,
	
	Recipes: [
		[Recipe.Token],
		
		//[Recipe.Moser2],
		
		[Recipe.Socket.Weapon, "berserkeraxe"],
		[Recipe.Socket.Weapon, "ettinaxe"],
		[Recipe.Socket.Weapon, "naga"],
		
		[Recipe.Socket.Weapon, "greatpoleaxe"],
		[Recipe.Socket.Weapon, "crypticaxe"],
		[Recipe.Socket.Weapon, "giantthresher"],
		[Recipe.Socket.Weapon, "thresher"],
		
		[Recipe.Socket.Weapon, "archonstaff"],
		[Recipe.Socket.Weapon, "shillelagh"],
		[Recipe.Socket.Weapon, "elderstaff"],
		
		[Recipe.Socket.Weapon, "becdecorbin"],
		[Recipe.Socket.Weapon, "partizan"],
		[Recipe.Socket.Weapon, "bill"],
		[Recipe.Socket.Weapon, "battlescythe"],
		
		[Recipe.Socket.Weapon, "halberd"],
		[Recipe.Socket.Weapon, "poleaxe"],
		
		[Recipe.Socket.Armor, "archonplate", Roll.Eth],
		[Recipe.Socket.Armor, "sacredarmor", Roll.Eth],
		
		[Recipe.Socket.Shield, "sacredtarge"],
		[Recipe.Socket.Shield, "vortexshield"],
		
		[Recipe.Socket.Shield, "akaranrondache"],
		[Recipe.Socket.Shield, "akarantarge"],
		[Recipe.Socket.Shield, "aerinshield"],
		[Recipe.Socket.Shield, "heraldicshield"],
		[Recipe.Socket.Shield, "rondache"],
		[Recipe.Socket.Shield, "targe"],
		
		[Recipe.Socket.Weapon, "crystalsword"],
		[Recipe.Socket.Weapon, "broadsword"],
		[Recipe.Socket.Weapon, "claymore"],
		[Recipe.Socket.Weapon, "giantsword"],
		[Recipe.Socket.Weapon, "phaseblade"],
		
		//[Recipe.Caster.Amulet],
		//[Recipe.Caster.Ring],
		//[Recipe.Caster.Belt, "sharkskinbelt"],
		//[Recipe.Caster.Boots, "wyrmhideboots"],
		
		//[Recipe.Blood.Amulet],
		//[Recipe.Blood.Ring],
		//[Recipe.Blood.Helm, "armet"],
		//[Recipe.Blood.Gloves, "vampirebonegloves"],
		//[Recipe.Blood.Belt, "meshbelt"],
		
		[Recipe.Reroll.Magic, 603]
	],
	
	//Runewording
	MakeRunewords: true,
	
	Runewords: [
		// Moser
		[Runeword.Moser, "roundshield"],
		
		// Grief
		[Runeword.Grief, "berserkeraxe"],
		
		// Death
		[Runeword.Death, "berserkeraxe", Roll.Eth],
		[Runeword.Death, "ettinaxe", Roll.Eth],
		
		// Oath
		[Runeword.Oath, "berserkeraxe", Roll.Eth],
		[Runeword.Oath, "ettinaxe", Roll.Eth],
		
		// Kingslayer
		[Runeword.Kingslayer, "berserkeraxe", Roll.NonEth],
		[Runeword.Kingslayer, "ettinaxe", Roll.NonEth],
		[Runeword.Kingslayer, "warspike", Roll.NonEth],
		
		// CrescentMoon
		[Runeword.CrescentMoon, "berserkeraxe", Roll.NonEth],
		[Runeword.CrescentMoon, "ettinaxe", Roll.NonEth],
		[Runeword.CrescentMoon, "warspike", Roll.NonEth],
		[Runeword.CrescentMoon, "naga", Roll.NonEth],
		//[Runeword.CrescentMoon, "twinaxe", Roll.NonEth],
		//[Runeword.CrescentMoon, "cleaver", Roll.NonEth],
		
		// Passion
		//[Runeword.Passion, "berserkeraxe", Roll.NonEth],
		//[Runeword.Passion, "ettinaxe", Roll.NonEth],
		//[Runeword.Passion, "warspike", Roll.NonEth],
		//[Runeword.Passion, "naga", Roll.NonEth],
		
		// Honor
		[Runeword.Honor, "berserkeraxe", Roll.NonEth],
		[Runeword.Honor, "ettinaxe", Roll.NonEth],
		[Runeword.Honor, "warspike", Roll.NonEth],
		[Runeword.Honor, "naga", Roll.NonEth],
		
		// Steel
		[Runeword.Steel, "waraxe"],
		[Runeword.Steel, "militarypick"],
		[Runeword.Steel, "doubleaxe"],
		[Runeword.Steel, "axe"],
		
		// Edge
		[Runeword.Edge, "shortbow"],
		[Runeword.Edge, "longbow"],
		
		// Obedience
		[Runeword.Obedience, "greatpoleaxe"],
		[Runeword.Obedience, "crypticaxe"],
		[Runeword.Obedience, "giantthresher"],
		[Runeword.Obedience, "thresher"],
		
		// Insight
		[Runeword.Insight, "greatpoleaxe"],
		[Runeword.Insight, "crypticaxe"],
		[Runeword.Insight, "giantthresher"],
		[Runeword.Insight, "thresher"],
		
		[Runeword.Insight, "archonstaff"],
		[Runeword.Insight, "shillelagh"],		
		[Runeword.Insight, "elderstaff"],
		
		[Runeword.Insight, "becdecorbin"],
		[Runeword.Insight, "partizan"],
		[Runeword.Insight, "bill"],
		[Runeword.Insight, "battlescythe"],
		
		[Runeword.Insight, "halberd"],
		[Runeword.Insight, "poleaxe"],
		
		// Enigma
		[Runeword.Enigma, "breastplate"],
		
		// Smoke
		//[Runeword.Smoke, "archonplate"],
		[Runeword.Smoke, "mageplate"],
		[Runeword.Smoke, "ghostarmor"],
		[Runeword.Smoke, "serpentskinarmor"],
		[Runeword.Smoke, "demonhidearmor"],
		[Runeword.Smoke, "lightplate"],
		
		// Lionheart
		//[Runeword.Lionheart, "archonplate"],
		//[Runeword.Lionheart, "mageplate"],
		//[Runeword.Lionheart, "lightplate"],

		// Principle
		//[Runeword.Principle, "archonplate"],
		//[Runeword.Principle, "mageplate"],
		//[Runeword.Principle, "lightplate"],

		// Bone
		//[Runeword.Bone, "archonplate"],
		//[Runeword.Bone, "mageplate"],
		//[Runeword.Bone, "lightplate"],

		// Duress
		//[Runeword.Duress, "archonplate"],
		
		// Spirit Shield
		[Runeword.Spirit, "akaranrondache"],
		[Runeword.Spirit, "akarantarge"],
		[Runeword.Spirit, "aerinshield"],
		[Runeword.Spirit, "heraldicshield"],
		[Runeword.Spirit, "rondache"],
		[Runeword.Spirit, "targe"],
		
		[Runeword.Spirit, "sacredtarge"],
		[Runeword.Spirit, "monarch"],
		
		// Spirit Sword
		[Runeword.Spirit, "crystalsword"],
		[Runeword.Spirit, "broadsword"],
		[Runeword.Spirit, "claymore"],
		[Runeword.Spirit, "giantsword"],
		[Runeword.Spirit, "phaseblade"],
		
		// Rhyme
		[Runeword.Rhyme, "grimshield"],
		
		// AncientsPledge
		[Runeword.AncientsPledge, "kiteshield"],
		[Runeword.AncientsPledge, "largeshield"],
		[Runeword.AncientsPledge, "gothicshield"],
		
		[Runeword.AncientsPledge, "akaranrondache"],
		[Runeword.AncientsPledge, "akarantarge"],
		[Runeword.AncientsPledge, "aerinshield"],
		[Runeword.AncientsPledge, "heraldicshield"],
		[Runeword.AncientsPledge, "rondache"],
		[Runeword.AncientsPledge, "targe"],
		
		// Stealth
		[Runeword.Stealth, "breastplate"],
		[Runeword.Stealth, "studdedleather"],
		
		// HeartoftheOak
		[Runeword.HeartoftheOak, "flail"],
		
		// Gemmed
		[Runeword.FortitudeGem, "sacredarmor"],
		[Runeword.FortitudeGem, "archonplate"],
		[Runeword.FortitudeGem, "wirefleece"],
		[Runeword.FortitudeGem, "wyrmhide"],
		[Runeword.FortitudeGem, "duskshroud"],
		
		[Runeword.CallToGem, "crystalsword"]
	],
	
	/*KeepRunewords: [
		"[type] == sword # [IAS] >= 80",// FireClaw
		"[name] == roundshield # [fireresist] >= 45",// Moser's
		"[type] == bow # [IAS] == 35",// Edge
		"[type] == axe # [enhanceddamage] >= 160",// Passion, Honor, CrescentMoon, Kingslayer, Oath, Death
		"[type] == axe # [IAS] == 25",// Steel
		"[type] == polearm # [FHR] == 40",// Obedience
		"([type] == polearm || [type] == staff) # [meditationaura] >= 1",// Insight Poor
		"[type] == polearm # [meditationaura] >= 17",// Insight
		"[type] == armor # [frw] >= 45",// Enigma
		"[type] == armor # [fireresist] == 50",// Smoke
		"[type] == armor # [maxhp] == 50",// Lionheart
		"[type] == armor # [paladinskills] == 2",// Principle
		"[type] == armor # [necromancerskills] == 2",// Bone
		"[type] == armor # [FHR] == 40",// Duress
		"[type] == auricshields # [FHR] == 55",// Spirit Shield
		//"[name] == sacredtarge # [FCR] == 35 && [FHR] == 55",// Spirit Shield
		"[name] == monarch # [FCR] == 35 && [FHR] == 55",// Spirit Shield
		"[type] == sword # [FHR] == 55",// Spirit Sword
		"[type] == shield # [itemgoldbonus] == 50",// Rhyme
		"([type] == shield || [type] == auricshields) # [itemdamagetomana] == 10",// AncientsPledge
		"[type] == armor # [FRW] == 25",// Stealth
		"[name] == flail # [FCR] >= 40",// HeartoftheOak
		"[type] == armor # [PlusDefense] == 15",// FortitudeGem
		"[type] == sword # [ItemMagicBonus] == 30"// CallToGem
	],*/
	
	//Attack
	PrimarySlot: -1,
	AttackSkill: [],
	LowManaSkill: [],
	CustomAttack: {},
	BossPriority: false,
	
	SkipEnchant: [],
	SkipImmune: [],
	SkipAura: [],
	SkipException: [],
	
	//Amazon
	LightningFuryDelay: 0,
	SummonValkyrie: false,

	//Sorceress
	UseTelekinesis: false,
	CastStatic: false,
	StaticList: [],

	//Necromancer
	Golem: 0,
	ActiveSummon: false,
	Skeletons: 0,
	SkeletonMages: 0,
	Revives: 0,
	ReviveUnstackable: false,
	PoisonNovaDelay: 1,
	Curse: [],
	ExplodeCorpses: 0,

	//Paladin
	Redemption: [0, 0],
	Conviction: false,
	Vigor: false,
	Cleansing: false,
	Meditation: false,

	//Barbarian
	FindItem: false,
	FindItemSwitch: 1,

	//Druid
	Wereform: 0,
	SummonRaven: 0,
	SummonAnimal: 0,
	SummonVine: 0,
	SummonSpirit: 0,

	//Assassin
	UseTraps: false,
	Traps: [],
	BossTraps: [],
	UseFade: false,
	UseBoS: false,
	UseVenom: false,
	UseCloakofShadows: false,
	AggressiveCloak: false,
	SummonShadow: false
};
