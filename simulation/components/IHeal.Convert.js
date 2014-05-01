



/**
 * Heal the target entity. This should only be called after a successful range 
 * check, and should only be called after GetTimers().repeat msec has passed 
 * since the last call to PerformHeal.
 */
Heal.prototype.PerformHeal = function(target)
{
    warn('PerformHeal in IHeal.Convert.js');
    var cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
    if (!cmpPlayerManager)
        return;
    var playerEnt = cmpPlayerManager.GetPlayerByID(input.player);
    if (playerEnt == INVALID_ENTITY)
        return;
    var cmpPlayer = Engine.QueryInterface(playerEnt, IID_Player);
    if (!cmpPlayer)
        return;

	var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
	if (!cmpOwnership)
		return;

    warn('Old owner: ' + cmpOwnership.getOwner() );
	cmpOwnership.SetOwner(target + ' converted to player ' + cmpPlayer.getOwner());//1); //<-- TODO make dynamic, add to converting player.
};

