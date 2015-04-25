function Convertable() {}

Convertable.prototype.Schema =
	"<element name='ConvertPoints' a:help='Maximum Convert points'>" +
		"<ref name='positiveDecimal'/>" +
	"</element>" +
	"<element name='RegenRate' a:help='Number of Convert are regenerated per second in favour of the owner'>" +
		"<ref name='nonNegativeDecimal'/>" +
	"</element>";

Convertable.prototype.Init = function()
{
	// Cache this value 
	this.maxCp = +this.template.ConvertPoints;
	this.cp = [];
	this.startRegenTimer();
};

//// Interface functions ////

/**
 * Returns the current Convert points array
 */
Convertable.prototype.GetConvertPoints = function()
{
	return this.cp;
};

Convertable.prototype.GetMaxConvertPoints = function()
{
	return this.maxCp;
};

/**
 * Set the new Convert points, used for cloning entities
 * The caller should assure that the sum of Convert points
 * matches the max.
 */
Convertable.prototype.SetConvertPoints = function(ConvertPointsArray)
{
	this.cp = ConvertPointsArray;
};

/**
 * Reduces the amount of Convert points of an entity,
 * in favour of the player of the source
 * Returns the number of Convert points actually taken
 */
Convertable.prototype.Reduce = function(amount, playerID)
{
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	if (!cmpOwnership || cmpOwnership.GetOwner() == -1)
		return 0;

	var cmpPlayerSource = QueryPlayerIDInterface(playerID);
	if (!cmpPlayerSource)
		return 0;

	var enemiesFilter = function(v, i) { return v > 0 && !cmpPlayerSource.IsAlly(i); };
	var numberOfEnemies = this.cp.filter(enemiesFilter).length;

	if (numberOfEnemies == 0)
		return 0;

	// distribute the Convert points over all enemies
	var distributedAmount = amount / numberOfEnemies;
	for (let i in this.cp)
	{
		if (cmpPlayerSource.IsAlly(i))
			continue;
		if (this.cp[i] > distributedAmount)
			this.cp[i] -= distributedAmount;
		else
			this.cp[i] = 0;
	}

	// give all cp taken to the player
	var takenCp = this.maxCp - this.cp.reduce(function(a, b) { return a + b; });
	this.cp[playerID] += takenCp;

	this.startRegenTimer();

	Engine.PostMessage(this.entity, MT_ConvertPointsChanged, { "ConvertPoints": this.cp })

	if (this.cp[cmpOwnership.GetOwner()] > 0)
		return takenCp;

	// if all cp has been taken from the owner, convert it to the best player
	var bestPlayer = 0;
	for (let i in this.cp)
		if (this.cp[i] >= this.cp[bestPlayer])
			bestPlayer = +i;

	cmpOwnership.SetOwner(bestPlayer);

	return takenCp;
};

/**
 * Check if the source can (re)Convert points from this unit
 */
Convertable.prototype.CanConvert = function(playerID)
{
	var cmpPlayerSource = QueryPlayerIDInterface(playerID);

	if (!cmpPlayerSource)
		warn(source + " has no player component defined on its owner ");
	var cp = this.GetConvertPoints()
	var sourceEnemyCp = 0;
	for (let i in this.GetConvertPoints())
		if (!cmpPlayerSource.IsAlly(i))
			sourceEnemyCp += cp[i];
	return sourceEnemyCp > 0;
};

//// Private functions ////

Convertable.prototype.GetRegenRate = function()
{
	var regenRate = +this.template.RegenRate;
	regenRate = ApplyValueModificationsToEntity("Convertable/RegenRate", regenRate, this.entity);

	return regenRate;
};

Convertable.prototype.RegenConvertPoints = function()
{
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	if (!cmpOwnership || cmpOwnership.GetOwner() == -1)
		return;

	var takenCp = this.Reduce(this.GetRegenRate(), cmpOwnership.GetOwner())
	if (takenCp > 0)
		return;

	// no Convert points taken, stop the timer
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	cmpTimer.CancelTimer(this.regenTimer);
	this.regenTimer = 0;
};

/**
 * Start the regeneration timer when no timer exists
 * When nothing can be regenerated (f.e. because the
 * rate is 0, or because it is fully regenerated),
 * the timer stops automatically after one execution.
 */
Convertable.prototype.startRegenTimer = function()
{
	if (this.regenTimer)
		return;
	var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
	this.regenTimer = cmpTimer.SetInterval(this.entity, IID_Convertable, "RegenConvertPoints", 1000, 1000, null);
};

//// Message Listeners ////

Convertable.prototype.OnValueModification = function(msg)
{
	if (msg.component != "Convertable")
		return;

	var oldMaxCp = this.GetMaxConvertPoints();
	this.maxCp = ApplyValueModificationsToEntity("Convertable/Max", +this.template.Max, this.entity);
	if (oldMaxCp == this.maxCp)
		return;

	var scale = this.maxCp / oldMaxCp;
	for (let i in this.cp)
		this.cp[i] *= scale;
	Engine.PostMessage(this.entity, MT_ConvertPointsChanged, { "ConvertPoints": this.cp });
	this.startRegenTimer();
};

Convertable.prototype.OnOwnershipChanged = function(msg)
{
	this.startRegenTimer();

	// if the new owner has no Convert points, it means that either
	// * it's being initialised now, or
	// * it changed ownership for a different reason (defeat, atlas, ...)
	if (this.cp[msg.to])
		return;

	// initialise the Convert points when created
	this.cp = [];
	var cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
	for (let i = 0; i < cmpPlayerManager.GetNumPlayers(); ++i)
		if (i == msg.to)
			this.cp[i] = this.maxCp;
		else
			this.cp[i] = 0;
};

Engine.RegisterComponentType(IID_Convertable, "Convertable", Convertable);