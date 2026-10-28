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
	PickitFiles: ["X.nip", "Y.nip", "Z.nip", "V.nip", "T.nip"],
	
	//Pathing
	OpenChests: 2,	//260928 2 = the full container list (what Attack.clear used to open). Opened by Pather on clearPath moves
	UseKeys: false,	//260928 key handling (need check, buying, keeping) apart from OpenChests. Off: only assassins open locked chests
	ScanShrines: [1, 2, 3],
	UseWells: true,	//260806
	
	DetourPath: 4,
	
	SafeTele: {	//261019
		Enabled: false,
		Range: 10,
		Angle: 75,	//261022 60 -> 75 (back to the 10-03 value: compare the lag with the landing check moved after the monster count)
		Step: 5,	//261022 7 -> 5
		Min: 10,	//261022 7 -> 10
		Skip: [62, 63, 64, 120, 132],	//120 Arreat Summit, 132 Worldstone Chamber: boss approach, no sidestep at nodes
		Soul: false
	},

	Dodge: {
		Enabled: false,
		Range: 8,	//261008
		Move: 13,	//261008
		MinSkillRange: 10	//261008
	},
	
	//Gear
	Gear: {1: "Helm", 2: "Amulet", 3: "Armor", 4: "ArmG", 5: "ArmB", 6: "RingG", 7: "RingB", 8: "Belt", 9: "Boots", 10: "Gloves"},  //260804	//261028 names: nip gear keys [helm] [armg] etc

	Tiered: false,
	
	TierGoal: {
		Helm: 0,	//261028 renamed
		Amulet: 0,	//261028 renamed
		Armor: 0,	//261028 renamed
		ArmG: 0,	//261028 renamed
		ArmB: 0,	//261028 renamed
		RingG: 0,	//261028 renamed
		RingB: 0,	//261028 renamed
		Belt: 0,
		Boots: 0,
		Gloves: 0	//261028 renamed
	},

	TierNow: {
		Helm: {tier: 0, str: 0, dex: 0},   //260804	//261028 renamed
		Amulet: {tier: 0, str: 0, dex: 0},	//261028 renamed
		Armor: {tier: 0, str: 0, dex: 0},	//261028 renamed
		ArmG: {tier: 0, str: 0, dex: 0},	//261028 renamed
		ArmB: {tier: 0, str: 0, dex: 0},	//261028 renamed
		RingG: {tier: 0, str: 0, dex: 0},	//261028 renamed
		RingB: {tier: 0, str: 0, dex: 0},	//261028 renamed
		Belt: {tier: 0, str: 0, dex: 0},
		Boots: {tier: 0, str: 0, dex: 0},
		Gloves: {tier: 0, str: 0, dex: 0}	//261028 renamed
	},

	//Merc
	UseMerc: false,
	UseMercHP: 0,
	UseMercRejuv: 0,
	
	MercWatch: false,
	MercChicken: 0,
	
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
		Helm: {merc: 0, str: 0, dex: 0},   //260804	//261028 renamed
		Armor: {merc: 0, str: 0, dex: 0},	//261028 renamed
		ArmG: {merc: 0, str: 0, dex: 0}	//261028 renamed
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
	QuiverPercent: 20,
	
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
		DebugMode: false
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
	
	//Socketing
	Socketing: true,	//261023 new switch: Town.socketGems and socket gem pickup (Pickit.socketTargets)
	
	SocketRecipe: {	//261023 SocketGems -> SocketRecipe, sapphire in Head/Body, Weapon order. gems for empty sockets of equipped tiered items: itemType (96-102) = any grade, classid (557-601) = that grade only. builds can override (e.g. Config.SocketRecipe.Head = [100])
		Head: [100, 99],	//261023
		Body: [100, 99],	//261023
		Shield: [97],	//261023
		Weapon: [101, 98, 99, 100]	//261023
	},
	
	//Cubing
	Cubing: false,
	
	CubeRecipe: [	//261023 Recipes -> CubeRecipe
		[Recipe.Token],
		
		//[Recipe.Moser2],
		
		[Recipe.Punch.Weapon, "berserkeraxe"],	//261023 Recipe.Socket -> Recipe.Punch
		[Recipe.Punch.Weapon, "ettinaxe"],	//261023
		[Recipe.Punch.Weapon, "naga"],	//261023
		
		[Recipe.Punch.Weapon, "greatpoleaxe"],	//261023
		[Recipe.Punch.Weapon, "crypticaxe"],	//261023
		[Recipe.Punch.Weapon, "giantthresher"],	//261023
		[Recipe.Punch.Weapon, "thresher"],	//261023
		
		[Recipe.Punch.Weapon, "archonstaff"],	//261023
		[Recipe.Punch.Weapon, "shillelagh"],	//261023
		[Recipe.Punch.Weapon, "elderstaff"],	//261023
		
		[Recipe.Punch.Weapon, "becdecorbin"],	//261023
		[Recipe.Punch.Weapon, "partizan"],	//261023
		[Recipe.Punch.Weapon, "bill"],	//261023
		[Recipe.Punch.Weapon, "battlescythe"],	//261023
		
		[Recipe.Punch.Weapon, "halberd"],	//261023
		[Recipe.Punch.Weapon, "poleaxe"],	//261023
		
		[Recipe.Punch.Armor, "archonplate", Roll.Eth],	//261023
		[Recipe.Punch.Armor, "sacredarmor", Roll.Eth],	//261023
		
		[Recipe.Punch.Shield, "sacredtarge"],	//261023
		[Recipe.Punch.Shield, "vortexshield"],	//261023
		
		[Recipe.Punch.Shield, "akaranrondache"],	//261023
		[Recipe.Punch.Shield, "akarantarge"],	//261023
		[Recipe.Punch.Shield, "aerinshield"],	//261023
		[Recipe.Punch.Shield, "heraldicshield"],	//261023
		[Recipe.Punch.Shield, "rondache"],	//261023
		[Recipe.Punch.Shield, "targe"],	//261023
		
		[Recipe.Punch.Weapon, "crystalsword"],	//261023
		[Recipe.Punch.Weapon, "broadsword"],	//261023
		[Recipe.Punch.Weapon, "claymore"],	//261023
		[Recipe.Punch.Weapon, "giantsword"],	//261023
		[Recipe.Punch.Weapon, "phaseblade"],	//261023
		
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
	Runewording: true,	//261023 MakeRunewords -> Runewording
	
	RunewordRecipe: [	//261023 Runewords -> RunewordRecipe
		// Zephyr
		[Runeword.Zephyr, "ceremonialbow"],
		[Runeword.Zephyr, "ashwoodbow"],
		[Runeword.Zephyr, "reflexbow"],
		[Runeword.Zephyr, "stagbow"],
		
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
		[Runeword.Edge, "ceremonialbow"],
		[Runeword.Edge, "ashwoodbow"],
		[Runeword.Edge, "reflexbow"],
		[Runeword.Edge, "stagbow"],
		
		[Runeword.Edge, "runebow"],
		[Runeword.Edge, "shortsiegebow"],
		[Runeword.Edge, "doublebow"],
		[Runeword.Edge, "cedarbow"],
		[Runeword.Edge, "razorbow"],
		[Runeword.Edge, "edgebow"],
		
		[Runeword.Edge, "shortbow"],
		
		// Obedience
		//[Runeword.Obedience, "greatpoleaxe"],	//261023 merc str too high
		[Runeword.Obedience, "crypticaxe"],
		//[Runeword.Obedience, "giantthresher"],	//261023 merc str too high
		[Runeword.Obedience, "thresher"],
		
		// Insight
		//[Runeword.Insight, "greatpoleaxe"],	//261023 merc str too high
		[Runeword.Insight, "crypticaxe"],
		//[Runeword.Insight, "giantthresher"],	//261023 merc str too high
		[Runeword.Insight, "thresher"],
		
		[Runeword.Insight, "archonstaff"],
		[Runeword.Insight, "shillelagh"],		
		[Runeword.Insight, "elderstaff"],
		
		//[Runeword.Insight, "becdecorbin"],	//261023 elite thresher/cryptic only
		//[Runeword.Insight, "partizan"],	//261023 elite thresher/cryptic only
		//[Runeword.Insight, "bill"],	//261023 elite thresher/cryptic only
		//[Runeword.Insight, "battlescythe"],	//261023 elite thresher/cryptic only
		
		//[Runeword.Insight, "halberd"],	//261023 elite thresher/cryptic only
		//[Runeword.Insight, "poleaxe"],	//261023 elite thresher/cryptic only
		
		// Enigma
		//[Runeword.Enigma, "breastplate"],	//261023 Enigma off
		
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
		
		// Sanctuary
		[Runeword.Sanctuary, "kiteshield"],
		[Runeword.Sanctuary, "largeshield"],
		[Runeword.Sanctuary, "gothicshield"],
		
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
	Decoy: false,

	//Sorceress
	UseTelekinesis: false,
	CastStatic: false,
	StaticList: [],
	Enchant: {	//261019
		Enabled: false,
		Player: [],			// build names (Settings.js), ex. ["M.HYBR"]	//261028 was class ids
		Merc: [],			// 271=act1, 338=act2, 561=act5
		Pet: [],
							// 289=claygolem, 290=bloodgolem, 291=irongolem, 292=firegolem
							// 357=valkyrie
							// 363=necroskeleton
							// 417=shadowwarrior, 418=shadowmaster
							// 420=spiritwolf, 421=fenris(direwolf), 428=druidbear(grizzly)
		Revive: false
	},

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
