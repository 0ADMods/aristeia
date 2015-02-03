// Return a boolean on whether a unit can be converted or not
UnitAI.prototype.CanCapture = function(target)
{
	// Verify that we're able to respond to Heal commands (if you can heal it, you can convert it)
	var cmpHeal = Engine.QueryInterface(this.entity, IID_Heal);
	if (!cmpHeal) 
        return false;

	var cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;
	}

	// Verify that the target is a convertible (read: Healable) class
	var convertible = false;
	for each (var convertibleClass in cmpHeal.GetHealableClasses())
	{
		if (cmpIdentity.HasClass(convertibleClass) != -1)
		{
			convertible = true;
		}
	}
	if (!convertible)
		return false;

    warn('The unit '+ target +' can be captured by ' + this.entity + ' .');
	return true;

};

Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);