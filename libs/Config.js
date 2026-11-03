/**
*	@filename	Config.js
*	@author		kolton
*	@desc		config loading and default config values storage
*/

if (!isIncluded("Settings.js")) { include("Settings.js"); };
if (!isIncluded("libs/Cubing.js")) { include("libs/Cubing.js"); };
if (!isIncluded("libs/Prototypes.js")) { include("libs/Prototypes.js"); };
if (!isIncluded("libs/Runewords.js")) { include("libs/Runewords.js"); };
if (!isIncluded("libs/Misc.js")) { include("libs/Misc.js"); };

var Scripts = {
	AutoSmurf: true
};

var Config = {
	init: function (notify) {
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
						Misc.print("[Config] Failed: cache not found for " + me.profile);	//261103 log policy
					}
				}
			}
		} catch (e3) {
			Misc.print("[Config] Failed: Config.init");	//261103 log policy
			Misc.print("[Config] Failed: " + e3.toSource());	//261103 log policy
		}
	},

	//NIP
	PickitFiles: ["X.nip", "Y.nip", "Z.nip", "V.nip", "T.nip"],
	
	//Pathing
	OpenChests: 2,	// 2 = the full container list. Opened by Pather on clearPath moves
	UseKeys: false,	// key handling (need check, buying, keeping) apart from OpenChests. Off: only assassins open locked chests
	ScanShrines: [1, 2, 3],
	UseWells: true,
	
	DetourPath: 4,
	
	SafeTele: {
		Enabled: false,
		Range: 10,
		Angle: 75,
		Step: 5,
		Min: 10,
		Skip: [62, 63, 64, 120, 132],	//120 Arreat Summit, 132 Worldstone Chamber: boss approach, no sidestep at nodes
		Soul: false
	},

	Dodge: {
		Enabled: false,
		Range: 8,
		Move: 13,
		MinSkillRange: 10
	},
	
	//Gear
	Gear: {1: "Head", 2: "Neck", 3: "Body", 4: "ArmA", 5: "ArmB", 6: "RingA", 7: "RingB", 8: "Waist", 9: "Shoes", 10: "Hands"},	// names = nip gear keys ([head] [arma] etc)

	Tiered: false,
	
	TierGoal: {
		Head: 0,
		Neck: 0,
		Body: 0,
		ArmA: 0,
		ArmB: 0,
		RingA: 0,
		RingB: 0,
		Waist: 0,
		Shoes: 0,
		Hands: 0
	},

	TierNow: {
		Head: {tier: 0, str: 0, dex: 0},
		Neck: {tier: 0, str: 0, dex: 0},
		Body: {tier: 0, str: 0, dex: 0},
		ArmA: {tier: 0, str: 0, dex: 0},
		ArmB: {tier: 0, str: 0, dex: 0},
		RingA: {tier: 0, str: 0, dex: 0},
		RingB: {tier: 0, str: 0, dex: 0},
		Waist: {tier: 0, str: 0, dex: 0},
		Shoes: {tier: 0, str: 0, dex: 0},
		Hands: {tier: 0, str: 0, dex: 0}
	},

	//Merc
	UseMerc: false,
	UseMercHP: 0,
	UseMercRejuv: 0,
	
	MercWatch: false,
	MercChicken: 0,
	
	MercStat: {id: null, str: 0, dex: 0, lvl: 0},
	
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
		Head: {merc: 0, str: 0, dex: 0},
		Body: {merc: 0, str: 0, dex: 0},
		ArmA: {merc: 0, str: 0, dex: 0}
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
	Socketing: true,	// Town.socketGems and socket gem pickup (Pickit.socketTargets)
	
	SocketRecipe: {	// sapphire in Head/Body, Weapon order. gems for empty sockets of equipped tiered items: itemType (96-102) = any grade, classid (557-601) = that grade only. builds can override (e.g. Config.SocketRecipe.Head = [100])
		Head: [100, 99],
		Body: [100, 99],
		Shield: [97],
		Weapon: [96, 101, 98]
	},
	
	//Cubing
	Cubing: false,
	
	CubeRecipe: [
		[Recipe.Token],
		
		//[Recipe.Moser2],
		
		[Recipe.Punch.Weapon, "berserkeraxe"],
		[Recipe.Punch.Weapon, "ettinaxe"],
		[Recipe.Punch.Weapon, "naga"],
		
		[Recipe.Punch.Weapon, "greatpoleaxe"],
		[Recipe.Punch.Weapon, "crypticaxe"],
		[Recipe.Punch.Weapon, "giantthresher"],
		[Recipe.Punch.Weapon, "thresher"],
		
		[Recipe.Punch.Weapon, "archonstaff"],
		[Recipe.Punch.Weapon, "shillelagh"],
		[Recipe.Punch.Weapon, "elderstaff"],
		
		[Recipe.Punch.Weapon, "becdecorbin"],
		[Recipe.Punch.Weapon, "partizan"],
		[Recipe.Punch.Weapon, "bill"],
		[Recipe.Punch.Weapon, "battlescythe"],
		
		[Recipe.Punch.Weapon, "halberd"],
		[Recipe.Punch.Weapon, "poleaxe"],
		
		[Recipe.Punch.Armor, "archonplate", Roll.Eth],
		[Recipe.Punch.Armor, "sacredarmor", Roll.Eth],
		
		[Recipe.Punch.Shield, "sacredtarge"],
		[Recipe.Punch.Shield, "vortexshield"],
		
		[Recipe.Punch.Shield, "akaranrondache"],
		[Recipe.Punch.Shield, "akarantarge"],
		[Recipe.Punch.Shield, "aerinshield"],
		[Recipe.Punch.Shield, "heraldicshield"],
		[Recipe.Punch.Shield, "rondache"],
		[Recipe.Punch.Shield, "targe"],
		
		[Recipe.Punch.Weapon, "crystalsword"],
		[Recipe.Punch.Weapon, "broadsword"],
		[Recipe.Punch.Weapon, "claymore"],
		[Recipe.Punch.Weapon, "giantsword"],
		[Recipe.Punch.Weapon, "phaseblade"],
		
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
	Runewording: true,
	
	RunewordRecipe: [
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
		
		[Runeword.Edge, "shortwarbow"],
		[Runeword.Edge, "shortbattlebow"],
		[Runeword.Edge, "compositebow"],
		[Runeword.Edge, "longbow"],
		[Runeword.Edge, "hunter'sbow"],
		
		// Obedience
		//[Runeword.Obedience, "greatpoleaxe"],	// merc str too high
		[Runeword.Obedience, "crypticaxe"],
		//[Runeword.Obedience, "giantthresher"],	// merc str too high
		[Runeword.Obedience, "thresher"],
		
		// Insight
		//[Runeword.Insight, "greatpoleaxe"],	// merc str too high
		[Runeword.Insight, "crypticaxe"],
		//[Runeword.Insight, "giantthresher"],	// merc str too high
		[Runeword.Insight, "thresher"],
		
		[Runeword.Insight, "archonstaff"],
		[Runeword.Insight, "shillelagh"],		
		[Runeword.Insight, "elderstaff"],
		
		//[Runeword.Insight, "becdecorbin"],	// elite thresher/cryptic only
		//[Runeword.Insight, "partizan"],	// elite thresher/cryptic only
		//[Runeword.Insight, "bill"],	// elite thresher/cryptic only
		//[Runeword.Insight, "battlescythe"],	// elite thresher/cryptic only
		
		//[Runeword.Insight, "halberd"],	// elite thresher/cryptic only
		//[Runeword.Insight, "poleaxe"],	// elite thresher/cryptic only
		
		// Enigma
		//[Runeword.Enigma, "breastplate"],	// Enigma off
		
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
		//[Runeword.Stealth, "breastplate"],
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
	CastStatic: false,		// true = Static Field before the attack skills (any build that has it), false = off
	StaticHP: [25, 33, 50],		// stop at this hp % on other monsters [normal, nightmare, hell]
	StaticBossHP: [10, 33, 50],	// stop at this hp % on bosses (spectype & 0x7, the AttackSkill boss slot) [normal, nightmare, hell]
	StaticList: [],			// names or classids; empty = every monster
	Enchant: {
		Enabled: false,
		Player: [],			// build names (Settings.js), ex. ["M.BOWF"]
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
	Salvation: false,
	Meditation: false,
	Cleansing: false,
	Vigor: false,

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
