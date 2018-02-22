
const preAristeiaInit = init;
init = function(initData, hotloadData)
{
	preAristeiaInit(initData, hotloadData);

	// top_panel/label.xml
	// Remember to update pregame/mainmenu.xml in sync with this:
	// Translation: Game/Mod name as found at the top of the in-game user interface
	Engine.GetGUIObjectByName("alphaLabel").caption = sprintf(translate("%(title)s : %(subtitle)s"), {
		"title": translate("Aristeia Bronziron"),
		"subtitle": translate("Peril of Nations")
	});
}
