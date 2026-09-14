/**
*	@filename	PartyThread.js
*	@desc		party invite/accept + team presence watchdog
*/	//260908

js_strict(true);

include("tools/json2.js");
include("tools/OOG.js");
include("libs/Config.js");
include("libs/Misc.js");
include("libs/Prototypes.js");
include("Settings.js");

Config.init();

var teamFormed = false,
	retry = 0,
	teamNames = [],
	lost = [];

function partyCheck () {	//260907
	var party;

	if (!me.gameReady) {
		return;
	}

	party = getParty();

	if (!party) {
		return;
	}

	while (party.getNext()) {
		if (me.profile === Team.Leader) {	// Invite others but never accept
			if (getPlayerFlag(me.gid, party.gid, 8)) {
				if (party.partyflag === 4) {
					clickParty(party, 2);
					delay(100);
				}

				continue;
			}

			if (party.partyflag !== 4 && party.partyflag !== 2 && party.partyid === 65535) {
				clickParty(party, 2);
				delay(100);
			}
		} else {	// Accept invites
			if (party.partyflag === 2) {
				clickParty(party, 2);
				delay(100);
			}
		}
	}
};

function partyInGame () {	//260908
	var party, myPartyId, i, names, exist,
		count = 0;

	if (!me.gameReady) {
		return;
	}

	party = getParty();

	if (!party) {
		return;
	}
	
	myPartyId = party.partyid;
	
	if (myPartyId === 65535 && !teamFormed) {
		return;
	}
	
	if (!teamNames.length) {
		for (i = 0; i < Team.Size; i += 1) {
			teamNames.push(Profile(Team.Profiles[i]).character);
		}
	}

	names = teamNames.slice();
	
	if (myPartyId !== 65535) {
		do {
			if (party.partyid === myPartyId) {
				count += 1;
				exist = names.indexOf(party.name);
				
				if (exist > -1) {
					names.splice(exist, 1);
				}
			}
		} while (party.getNext());
	}

	if (count === Team.Size) {
		teamFormed = true;
		retry = 0;
		lost = [];

		return;
	}

	if (!teamFormed) {
		return;
	}
	
	//scriptBroadcast("quit");

	retry += 1;
	
	if (retry === 1) {
		lost = names;
	} else {
		lost = lost.filter(function (n) {
			return names.indexOf(n) > -1;
		});
	}

	if (retry > 2) {
		print("party has left: " + (lost.length ? lost.join(", ") : names.join(", ")));
		scriptBroadcast("quit");
	}
};

function main () {
	while (true) {
		try {
			partyCheck();
			partyInGame();
		} catch (e) {
			Misc.errorReport(e, "PartyThread.js");
		}

		delay(100);	//260910
	}
};