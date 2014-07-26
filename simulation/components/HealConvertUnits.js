



/**
 * Heal the target entity. This should only be called after a successful range 
 * check, and should only be called after GetTimers().repeat msec has passed 
 * since the last call to PerformHeal.
 */
Heal.prototype.ConvertHeal = function(target, source)
{
    //warn[(]'PerformHeal in HealConvertUnits.js  '+ source +' tries to heal-convert ' + target);
	var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
	if (!cmpOwnership)
		return;

    // The Healing Unit:
	var source_cmpOwnership = Engine.QueryInterface(source, IID_Ownership);
	if (!source_cmpOwnership)
		return;
 
    if (source_cmpOwnership != cmpOwnership) {
        var prevOwner = cmpOwnership.GetOwner();
	    cmpOwnership.SetOwner(source_cmpOwnership.GetOwner());
        //warn[(]'Unit ' + target + ' from Player '+ prevOwner +'  converted to Player ' + source_cmpOwnership.GetOwner() + ' by Healer: ' + source);//1); //<-- TODO make dynamic, add to converting player.
    }
    else
        //warn[(]'Unit ' + target + ' already belongs to Player ' + prevOwner);

};

