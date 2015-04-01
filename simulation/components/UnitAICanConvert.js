// Return a boolean on whether a unit can be converted or not
UnitAI.prototype.CanConvert = function(target)
{
	warn("checking for conversion");
	// Verify that we're able to respond to Heal commands (if you can heal it, you can convert it)
	var cmpUnitAI = Engine.QueryInterface(this.entity, IID_UnitAI);
	if (!cmpUnitAI) 
        return false;

    warn("cmpUnitAI");

	var cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;

	warn("cmpIdentity");

	// Verify that the target is a convertible (read: Healable) class
	/*var convertible = false;
	warn(uneval(cmpHeal.GetHealableClasses()));
	for each (var convertibleClass in cmpHeal.GetHealableClasses())
	{
		if (cmpIdentity.HasClass(convertibleClass) != -1)
		{
			convertible = true;
		}
	}
	warn(convertible);
	if (!convertible)
		return false;
	*/
    warn('The unit '+ target +' can be captured by ' + this.entity + ' .');
	return true;
};
Engine.ReRegisterComponentType(IID_UnitAI, "UnitAI", UnitAI);