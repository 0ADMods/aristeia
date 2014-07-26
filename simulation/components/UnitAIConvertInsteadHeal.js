// Leave away the prototype for per object overwriting. Then the prototype still offers the base class.
UnitAI.prototype.CanHeal = function(target)
{
	// Formation controllers should always respond to commands
	// (then the individual units can make up their own minds)
	if (this.IsFormationController())
		return true;

	// Verify that we're able to respond to Heal commands
	var cmpHeal = Engine.QueryInterface(this.entity, IID_Heal);
	if (!cmpHeal)
		return false;

	// Verify that the target is alive
	if (!this.TargetIsAlive(target))
		return false;

	// Verify that the target is owned by the same player as the entity or of an ally
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	if (!cmpOwnership)
		return false;
    
    if (!(IsOwnedByPlayer(cmpOwnership.GetOwner(), target) || IsOwnedByAllyOfPlayer(cmpOwnership.GetOwner(), target)))
        //TODO Improve algorithm here. Best create separate function.
        // Best use global shared variable to cumulate unit influence. Alternatively use entity.attribute. 
        return this.CanConvert(target);
    
	// Verify that the target is not unhealable (or at max health)
	var cmpHealth = Engine.QueryInterface(target, IID_Health);
	if (!cmpHealth || cmpHealth.IsUnhealable())
		return false;

	// Verify that the target has no unhealable class
	var cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;
	for each (var unhealableClass in cmpHeal.GetUnhealableClasses())
	{
		if (cmpIdentity.HasClass(unhealableClass) != -1)
		{
			return false;
		}
	}

	// Verify that the target is a healable class
	var healable = false;
	for each (var healableClass in cmpHeal.GetHealableClasses())
	{
		if (cmpIdentity.HasClass(healableClass) != -1)
		{
			healable = true;
		}
	}
	if (!healable)
		return false;

	return true;

    

};


// Set up a range query for all own or ally units within LOS range
// which can be healed.
// This should be called whenever our ownership changes.
UnitAI.prototype.SetupHealRangeQuery = function()
{
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	var owner = cmpOwnership.GetOwner();

	var rangeMan = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	var playerMan = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);

	if (this.losHealRangeQuery)
		rangeMan.DestroyActiveQuery(this.losHealRangeQuery);

	var players = [];//owner];

	if (owner != -1)
	{
		// If unit not just killed, get ally players via diplomacy
		var cmpPlayer = Engine.QueryInterface(playerMan.GetPlayerByID(owner), IID_Player);
		var numPlayers = playerMan.GetNumPlayers();
		for (var i = 1; i < numPlayers; ++i)
		{
			// Exclude gaia and enemies
			//if (cmpPlayer.IsAlly(i)) // TODO add setting for if Units should be allowed to convert Gaia units/animals.
				players.push(i);
		}
	}

	var range = this.GetQueryRange(IID_Heal);

	this.losHealRangeQuery = rangeMan.CreateActiveQuery(this.entity, range.min, range.max, players, IID_Health, rangeMan.GetEntityFlagMask("injured"));
	rangeMan.EnableActiveQuery(this.losHealRangeQuery);
};


//TODO This is only for getting nearby entities that could influence the conversion process. See if there is a better way.
// Set up a range query for all own or ally units within LOS range
// which can be healed.
// This should be called whenever our ownership changes.
UnitAI.prototype.SetupConversionRangeQuery = function()
{
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	var owner = cmpOwnership.GetOwner();

	var rangeMan = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	var playerMan = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);

	if (this.losHealRangeQuery)
		rangeMan.DestroyActiveQuery(this.losHealRangeQuery);

	var players = [owner];

	if (owner != -1)
	{
		// If unit not just killed, get ally players via diplomacy
		var cmpPlayer = Engine.QueryInterface(playerMan.GetPlayerByID(owner), IID_Player);
		var numPlayers = playerMan.GetNumPlayers();
		for (var i = 1; i < numPlayers; ++i)
		{
			// Exclude gaia and enemies
			if (cmpPlayer.IsAlly(i))
				players.push(i);
		}
	}

	var range = this.GetQueryRange(IID_Heal);

	this.losHealRangeQuery = rangeMan.CreateActiveQuery(this.entity, range.min, range.max, players, IID_Health, rangeMan.GetEntityFlagMask("injured"));
	rangeMan.EnableActiveQuery(this.losHealRangeQuery);
};


UnitAI.prototype.CanConvert = function(target)
{
    //warn[(]'Wrong CanConvert reached. ');
    
    // The healthier the capturing unit the easier for it to capture a target. 
	var cmpHealth = Engine.QueryInterface(this.entity, IID_Health);
	if (!cmpHealth)// || cmpHealth.IsUnhealable()) //<-- include this right side or in the formula.
        return false;
    var health_normalized = cmpHealth.GetHitpoints() / cmpHealth.GetMaxHitpoints();

    // The healthier a unit the more difficult to capture it. 
	// Verify that the target is not at max health. Then a unit has to come pretty close: 
    // TODO replace with formula that takes distance into account. Include all enemy units.
	var target_cmpHealth = Engine.QueryInterface(target, IID_Health);
	if (!target_cmpHealth)// || cmpHealth.IsUnhealable()) //<-- include this right side or in the formula.
        return false;
    var target_health_normalized = target_cmpHealth.GetHitpoints() / target_cmpHealth.GetMaxHitpoints();

    // Nearby units get captured easier.
    var distance = DistanceBetweenEntities(this.entity, target);
/*TODO  Get distance for every unit close by. If performance allows.
 * var thisCmpPosition = Engine.QueryInterface(this.entity, IID_Position);
	var s = thisCmpPosition.GetPosition();

	var t = targetCmpPosition.GetPosition();

	var h = s.y-t.y+range.elevationBonus;
	var maxRangeSq = 2*range.max*(h + range.max/2);

	if (maxRangeSq < 0)
		return false;

	var cmpUnitMotion = Engine.QueryInterface(this.entity, IID_UnitMotion);
	return cmpUnitMotion.IsInTargetRange(target, range.min, Math.sqrt(maxRangeSq));
	return maxRangeSq >= distanceSq && range.min*range.min <= distanceSq;
*/
    var this_moveDirection_normalized = 1 ;//cmpUnitMotion.GetDirection(); //or determine yourself from last and this location.
    var target_moveDirection_normalized = 1;// assume enemy is not fleeing for now.



    // Units which are surrounded by many enemies and few friendly units get captured easier.
/*	var cmpRanged = Engine.QueryInterface(this.entity, iid);
	if (!cmpRanged)
		return false;*/
	//var range = cmpRanged.GetRange(type);
    //GetUnitsInRange(); TODO
    var friendlyToEnemyWithinRangeRatio = 1;

    // fleeing units get captured more easily.
	var cmpUnitMotion = Engine.QueryInterface(this.entity, IID_UnitMotion);
    var easyCatchBonus = 0;
    if (target_moveDirection_normalized == -1 * this_moveDirection_normalized) { 
	    //return cmpUnitMotion.IsInTargetRange(target, range.min, range.max);
        easyCatchBonus = 10;
    }
    var base_chance = 50;
    //warn[(]friendlyToEnemyWithinRangeRatio + ' * distance: ' + distance + '  health_normalized: ' + health_normalized + ' - ' + target_health_normalized + ' target_health_normalized');
    // Is this all enough to capture the unit and make it prisoner of the unit that captured it? (use Guard function for this in the meantime, but only for units)
    var chanceForConversionSuccess = friendlyToEnemyWithinRangeRatio * (base_chance + (health_normalized - target_health_normalized) * 100 - distance + easyCatchBonus);
    /*
    var captureLuck = 50;
    var toBeCapturedLuck = 50;
    if (toBeCapturedLuck > 90) {
    }
    */   
    //warn[(]'Chance for Conversion Success: ' + chanceForConversionSuccess);
    var chanceIncreaseByRandomLastHopeOppositionBoost = 5; //TODO randomize.
    var chanceMinimumForConversionSuccess = 30;
    if (chanceForConversionSuccess < (chanceMinimumForConversionSuccess + chanceIncreaseByRandomLastHopeOppositionBoost)) {
        return false;
    }
    // I had a formula somewhere in the Forum. Have to look for it.



	// Verify that the target has no unconvertible class (e.g. a Hero?)
    //
	// Verify that we're able to respond to Heal commands
	var cmpHeal = Engine.QueryInterface(this.entity, IID_Heal);
	if (!cmpHeal) 
        return false;

    // TODO create those classes (schema + xml). For now use healable classes.
	var cmpIdentity = Engine.QueryInterface(target, IID_Identity);
	if (!cmpIdentity)
		return false;
	for each (var unhealableClass in cmpHeal.GetUnhealableClasses())
	{
		if (cmpIdentity.HasClass(unhealableClass) != -1)
		{
			return false;
		}
	}

	// Verify that the target is a convertible class:
	var convertible = false;
	for each (var convertibleClass in cmpHeal.GetHealableClasses())//GetConvertibleClasses())
	{
		if (cmpIdentity.HasClass(convertibleClass) != -1)
		{
			convertible = true;
		}
	}
	if (!convertible)
		return false;


    //warn[(]'Conversion was successful.');
	return true;

};








UnitAI.prototype.UnitFsmSpec.INDIVIDUAL
        .HEAL
            .HEALING
                .Timer = function(msg) {

                    var target = this.order.data.target;
                    //warn(this.CanHeal(target) + ' can heal target : ' + target);
                    // Check the target is still alive and healable
                    if (this.TargetIsAlive(target) && this.CanHeal(target))
                    {
                        // Check if we can still reach the target
                        if (this.CheckTargetRange(target, IID_Heal))
                        {         
                             var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
                             this.lastHealed = cmpTimer.GetTime() - msg.lateness;

                             this.FaceTowardsTarget(target);

                             var cmpHeal = Engine.QueryInterface(this.entity, IID_Heal);
                             var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
                             // An enemy entity?
                             if (!(IsOwnedByPlayer(cmpOwnership.GetOwner(), target) || IsOwnedByAllyOfPlayer(cmpOwnership.GetOwner(), target))) {
                                 // => enemy
                                 //warn[(]'Enemy: ' + target + ' . Trying to convert.');
                                 cmpHeal.ConvertHeal(target, this.entity);
                             }
                             else {     
                                 // => friendly unit.
                                 //warn[(]'Friendly: ' + target + ' . Trying to heal.');
                                 cmpHeal.PerformHeal(target);
                             }
 
                             if (this.resyncAnimation)
                             {
                                 this.SetAnimationSync(this.healTimers.repeat, this.healTimers.repeat);
                                 this.resyncAnimation = false;
                             }
                             return;
                         }
                         // Can't reach it - try to chase after it
                         if (this.ShouldChaseTargetedEntity(target, this.order.data.force))
                         {
                             if (this.MoveToTargetRange(target, IID_Heal))
                             {
                                 this.SetNextState("HEAL.CHASING");
                                 return;
                             }
                         }
                    }
					// Can't reach it, healed to max hp or doesn't exist any more - give up
					if (this.FinishOrder())
						return;

					// Heal another one
					if (this.FindNewHealTargets())
						return;
					
					// Return to our original position
					if (this.GetStance().respondHoldGround)
						this.WalkToHeldPosition();
				};
