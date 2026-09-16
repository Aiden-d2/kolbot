/* 
	# Autosmurf SMART by EOM
	# This is the 5th generation updated on Sep, 2026
	
	# You may need at least one Soceress build for Pather
	
	# [PROFILE]
	# prefix "x" = prefix of profile name, ex. "a"
	# names "n" = sequence of profile name, ex. "1", "2", "3", ...
	# prefix + name = final profile name from your D2Bot manager, ex. a1, a2, a3, ...
	
	# [BUILD]
	# case profiles[n] = profiles defined as above, the first one is [0] and the last one is [7]
	# return "C.BBBB" = Available build types as below
	# C is a class, [M=Amazon, S=Sorceress, N=Necromancer, P=Paladin, B=Barbarian, D=Druid, A=Assassin]
		A.TRAP - Assassin / Lightning Sentry
		B.WCRY - Barbarian / War Cry
		D.FGOM - Druid / Werebear + Armageddon + Shock Wave
		D.WIND - Druid / Hurricane + Tornado + Oak Sage
		N.SUMM - Necromancer / Summoning + Lower Resist + Corpse Explosion
		P.CONC - Paladin / Blessed Hammer + Concentration
		P.CONV - Paladin / Blessed Hammer + Conviction
		P.FIST - Paladin / Fist Of The Heavens + Conviction
		S.COLD - Soceress / Blizzard + Glacial Spike
		S.FIRE - Soceress / Fire Ball + Meteor
		S.LTNG - Soceress / Lightning + Chain Lightning
		S.STFO - Soceress / Frozen Orb + Static Field
		S.STFW - Soceress / Fire Wall + Static Field
*/

var prefix = "a";
var names = ["1", "2", "3", "4", "5", "6", "7", "8"];
var profiles = names.map(function (name) {
  return prefix + name;
});

var Team = {
		Size: profiles.length,
		Profiles: profiles,
		Leader: profiles[0],
		Boer: profiles[7]
};

var Build = {
	getBuildType: function () {
		var build = me.profile;
		
		switch (build) {
		case profiles[0]:	//profile name
			return "S.FIRE";	//build type
			
		case profiles[1]:
			return "S.COLD";
		
		case profiles[2]:
			return "S.LTNG";
			
		case profiles[3]:
			return "S.LTNG";
			
		case profiles[4]:
			return "S.STFO";
			
		case profiles[5]:
			return "S.STFW";
			
		case profiles[6]:
			return "N.SUMM";
			
		case profiles[7]:
			return "B.WCRY";
			
		default:
			return false;
		}
	}
};
