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
		S.FIRE - Soceress / Fire Ball + Meteor
		S.COLD - Soceress / Blizzard + Glacial Spike
		P.CONC - Paladin / Blessed Hammer + Concentration
		P.CONV - Paladin / Blessed Hammer + Conviction
		A.TRAP - Assassin / Lightning Sentry
		D.FGOM - Druid / Werebear + Armageddon + Shock Wave
		N.SUMM - Necromancer / Summoning + Lower Resist + Corpse Explosion
		B.WCRY - Barbarian / War Cry
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
			return "P.CONC";
			
		case profiles[3]:
			return "P.CONV";
			
		case profiles[4]:
			return "A.TRAP";
			
		case profiles[5]:
			return "D.FGOM";
			
		case profiles[6]:
			return "N.SUMM";
			
		case profiles[7]:
			return "B.WCRY";
			
		default:
			return false;
		}
	}
};
