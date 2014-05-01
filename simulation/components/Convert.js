function Convert() {}

Convert.prototype.Schema = 
	"<a:help>Controls the healing abilities of the unit.</a:help>" +
	"<a:example>" +
		"<Range>20</Range>" +
		"<HP>5</HP>" +
		"<Rate>2000</Rate>" +
		"<UnhealableClasses datatype=\"tokens\">Cavalry</UnhealableClasses>" +
		"<HealableClasses datatype=\"tokens\">Support Infantry</HealableClasses>" +
	"</a:example>" +
	"<element name='Range' a:help='Range (in metres) where healing is possible'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='HP' a:help='Hitpoints healed per Rate'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='Rate' a:help='A heal is performed every Rate ms'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='UnhealableClasses' a:help='If the target has any of these classes it can not be healed (even if it has a class from HealableClasses)'>" +
		"<attribute name='datatype'>" +
			"<value>tokens</value>" +
		"</attribute>" +
		"<text/>" +
	"</element>" +
	"<element name='HealableClasses' a:help='The target must have one of these classes to be healable'>" +
		"<attribute name='datatype'>" +
			"<value>tokens</value>" +
		"</attribute>" +
		"<text/>" +
	"</element>";

Convert.prototype.Init = function()
{
};

Convert.prototype.Serialize = null; // we have no dynamic state to save

Convert.prototype.GetTimers = function()
{
	var prepare = 1000;
	var repeat = +this.template.Rate;

	repeat = ApplyValueModificationsToEntity("Heal/Rate", repeat, this.entity);
	
	return { "prepare": prepare, "repeat": repeat };
};

Convert.prototype.GetRange = function()
{
	var min = 0;
	var max = +this.template.Range;
	
	max = ApplyValueModificationsToEntity("Heal/Range", max, this.entity);

	return { "max": max, "min": min };
};

Convert.prototype.GetUnhealableClasses = function()
{
	var classes = this.template.UnhealableClasses._string;
	return classes ? classes.split(/\s+/) : [];
};

Convert.prototype.GetHealableClasses = function()
{
	var classes = this.template.HealableClasses._string;
	return classes ? classes.split(/\s+/) : [];
};

/**
 * Heal the target entity. This should only be called after a successful range 
 * check, and should only be called after GetTimers().repeat msec has passed 
 * since the last call to PerformHeal.
 */
Convert.prototype.PerformHeal = function(target)
{
    
	var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
	if (!cmpOwnership)
		return;
    warn('PerformHeal: ' + cmpOwnership);
	cmpOwnership.SetOwner(1);
};

Engine.RegisterComponentType(IID_Convert, "Convert", Convert);
