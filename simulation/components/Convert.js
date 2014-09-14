function Convert() {}

Convert.prototype.Schema = 
	"<a:help>Controls the conversion abilities of the unit.</a:help>" +
	"<a:example>" +
		"<Range>20</Range>" +
		"<LP>5</LP>" +
		"<Rate>2000</Rate>" +
		"<UnconvertibleClasses datatype=\"tokens\">Cavalry</UnconvertibleClasses>" +
		"<ConvertibleClasses datatype=\"tokens\">Support Infantry</ConvertibleClasses>" +
	"</a:example>" +
	"<element name='Range' a:help='Range (in metres) where converting is possible'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='LP' a:help='Loyalty points reduced per Rate (conversion strength, e.g. how convincing your priests are)'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='Rate' a:help='A heal is performed every Rate ms'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>" +
	"<element name='UnconvertibleClasses' a:help='If the target has any of these classes it can not be healed (even if it has a class from ConvertibleClasses)'>" +
		"<attribute name='datatype'>" +
			"<value>tokens</value>" +
		"</attribute>" +
		"<text/>" +
	"</element>" +
	"<element name='ConvertibleClasses' a:help='The target must have one of these classes to be convertible'>" +
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

	repeat = ApplyValueModificationsToEntity("Convert/Rate", repeat, this.entity);
	
	return { "prepare": prepare, "repeat": repeat };
};

Convert.prototype.GetRange = function()
{
	var min = 0;
	var max = +this.template.Range;
	
	max = ApplyValueModificationsToEntity("Convert/Range", max, this.entity);

	return { "max": max, "min": min };
};

Convert.prototype.GetUnconvertibleClasses = function()
{
	var classes = this.template.UnconvertibleClasses._string;
	return classes ? classes.split(/\s+/) : [];
};

Convert.prototype.GetConvertibleClasses = function()
{
	var classes = this.template.ConvertibleClasses._string;
	return classes ? classes.split(/\s+/) : [];
};

/**
 * Convert the target entity (lowering the resistance/loyalty at least). This should only be called after a successful range 
 * check, and should only be called after GetTimers().repeat msec has passed 
 * since the last call to PerformConvert.
 */
Convert.prototype.PerformConvert = function(target)
{
    
	var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
	if (!cmpOwnership)
		return;
    //warn[(]'PerformHeal: ' + cmpOwnership);
	cmpOwnership.SetOwner(1);
};

Engine.RegisterComponentType(IID_Convert, "Convert", Convert);

