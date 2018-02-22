const preAristeiaInit = init;
init = function(initData, hotloadData)
{
	preAristeiaInit(initData, hotloadData);

	Engine.GetGUIObjectByName("mainMenu").children[4].children[0].caption = sprintf("%(name)s\n(%(version)s)\n\n%(warning)s", {
		// Translation: Game/Mod name as displayed on lower part of the main menu seen on game start
		"name": setStringTags(sprintf(translate("%(title)s:\n%(subtitle)s"), {
			"title": translate("Aristeia Bronziron"),
			"subtitle": translate("Peril of Nations")
		}), { "font": "sans-bold-16" }),
		"version": translate("0 A.D. Alpha XXIII"), 
		"warning": "WARNING: This is an early development version of the game. Many features have not been added yet."
	});
}
