

Attack.prototype.bonusesSchema = 
	"<optional>" +
		"<element name='Bonuses'>" +
			"<zeroOrMore>" +
				"<element>" +
					"<anyName/>" +
					"<interleave>" +
						"<optional>" +
							"<element name='Civ' a:help='If an entity has this civ then the bonus is applied'><text/></element>" +
						"</optional>" +
						"<element name='Classes' a:help='If an entity has all these classes then the bonus is applied'><text/></element>" +
						"<element name='Multiplier' a:help='The attackers attack strength is multiplied by this'><ref name='nonNegativeDecimal'/></element>" +
					"</interleave>" +
				"</element>" +
			"</zeroOrMore>" +
		"</element>" +
	"</optional>";

Attack.prototype.preferredClassesSchema =
	"<optional>" +
		"<element name='PreferredClasses' a:help='Space delimited list of classes preferred for attacking. If an entity has any of theses classes, it is preferred. The classes are in decending order of preference'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

Attack.prototype.restrictedClassesSchema =
	"<optional>" +
		"<element name='RestrictedClasses' a:help='Space delimited list of classes that cannot be attacked by this entity. If target entity has any of these classes, it cannot be attacked'>" +
			"<attribute name='datatype'>" +
				"<value>tokens</value>" +
			"</attribute>" +
			"<text/>" +
		"</element>" +
	"</optional>";

// Extend the Attack component schema:
Attack.prototype.Schema += 
	// TODO: finish the convert attack
  	"<optional>" +
		"<element name='Convert'>" +
			"<interleave>" +
				"<element name='Value' a:help='Convert points value'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MaxRange' a:help='Maximum attack range (in meters)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
					"<data type='positiveInteger'/>" +
				"</element>" +
				Attack.prototype.bonusesSchema +
				Attack.prototype.preferredClassesSchema +
				Attack.prototype.restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>";

Attack.prototype.GetAttackTypes = function()
{
	var ret = [];
	if (this.template.Charge) ret.push("Charge");
	if (this.template.Melee) ret.push("Melee");
	if (this.template.Ranged) ret.push("Ranged");
	if (this.template.Capture) ret.push("Capture");
	if (this.template.Convert) ret.push("Convert");
	return ret;
};

Attack.prototype.GetAttackStrengths = function(type)
{
	// Work out the attack values with technology effects
	var self = this;

	var template = this.template[type];
	var splash = "";
	if (!template)
	{
		template = this.template[type.split(".")[0]].Splash;
		splash = "/Splash";
	}
	
	var applyMods = function(damageType)
	{
		return ApplyValueModificationsToEntity("Attack/" + type + splash + "/" + damageType, +(template[damageType] || 0), self.entity);
	};

	if (type == "Capture")
		return {value: applyMods("Value")};

	if (type == "Convert")
		return {value: applyMods("Value")};

	return {
		hack: applyMods("Hack"),
		pierce: applyMods("Pierce"),
		crush: applyMods("Crush")
	};
};

/**
 * Attack the target entity. This should only be called after a successful range check,
 * and should only be called after GetTimers().repeat msec has passed since the last
 * call to PerformAttack.
 */
Attack.prototype.PerformAttack = function(type, target)
{
	// If this is a ranged attack, then launch a projectile
	if (type == "Ranged")
	{
		var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
		var turnLength = cmpTimer.GetLatestTurnLength()/1000;
		// In the future this could be extended:
		//  * Obstacles like trees could reduce the probability of the target being hit
		//  * Obstacles like walls should block projectiles entirely

		// Get some data about the entity
		var horizSpeed = +this.template[type].ProjectileSpeed;
		var gravity = 9.81; // this affects the shape of the curve; assume it's constant for now

		var spread = +this.template.Ranged.Spread;
		spread = ApplyValueModificationsToEntity("Attack/Ranged/Spread", spread, this.entity);

		//horizSpeed /= 2; gravity /= 2; // slow it down for testing

		var cmpPosition = Engine.QueryInterface(this.entity, IID_Position);
		if (!cmpPosition || !cmpPosition.IsInWorld())
			return;
		var selfPosition = cmpPosition.GetPosition();
		var cmpTargetPosition = Engine.QueryInterface(target, IID_Position);
		if (!cmpTargetPosition || !cmpTargetPosition.IsInWorld())
			return;
		var targetPosition = cmpTargetPosition.GetPosition();

		var relativePosition = Vector3D.sub(targetPosition, selfPosition);
		var previousTargetPosition = Engine.QueryInterface(target, IID_Position).GetPreviousPosition();

		var targetVelocity = Vector3D.sub(targetPosition, previousTargetPosition).div(turnLength);
		// the component of the targets velocity radially away from the archer
		var radialSpeed = relativePosition.dot(targetVelocity) / relativePosition.length();

		var horizDistance = targetPosition.horizDistanceTo(selfPosition);

		// This is an approximation of the time ot the target, it assumes that the target has a constant radial 
		// velocity, but since units move in straight lines this is not true.  The exact value would be more 
		// difficult to calculate and I think this is sufficiently accurate.  (I tested and for cavalry it was 
		// about 5% of the units radius out in the worst case)
		var timeToTarget = horizDistance / (horizSpeed - radialSpeed);

		// Predict where the unit is when the missile lands.
		var predictedPosition = Vector3D.mult(targetVelocity, timeToTarget).add(targetPosition);

		// Compute the real target point (based on spread and target speed)
		var range = this.GetRange(type);
		var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
		var elevationAdaptedMaxRange = cmpRangeManager.GetElevationAdaptedRange(selfPosition, cmpPosition.GetRotation(), range.max, range.elevationBonus, 0);
		var distanceModifiedSpread = spread * horizDistance/elevationAdaptedMaxRange;

		var randNorm = this.GetNormalDistribution();
		var offsetX = randNorm[0] * distanceModifiedSpread * (1 + targetVelocity.length() / 20);
		var offsetZ = randNorm[1] * distanceModifiedSpread * (1 + targetVelocity.length() / 20);

		var realTargetPosition = new Vector3D(predictedPosition.x + offsetX, targetPosition.y, predictedPosition.z + offsetZ);

		// Calculate when the missile will hit the target position
		var realHorizDistance = realTargetPosition.horizDistanceTo(selfPosition);
		var timeToTarget = realHorizDistance / horizSpeed;

		var missileDirection = Vector3D.sub(realTargetPosition, selfPosition).div(realHorizDistance);

		// Make the arrow appear to land slightly behind the target so that arrows landing next to a guys foot don't count but arrows that go through the torso do
		var graphicalPosition = Vector3D.mult(missileDirection, 2).add(realTargetPosition);
		// Launch the graphical projectile
		var cmpProjectileManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_ProjectileManager);
		var id = cmpProjectileManager.LaunchProjectileAtPoint(this.entity, realTargetPosition, horizSpeed, gravity);

		var playerId = Engine.QueryInterface(this.entity, IID_Ownership).GetOwner();
		var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
 		cmpTimer.SetTimeout(this.entity, IID_Attack, "MissileHit", timeToTarget*1000, {"type": type, "target": target, "position": realTargetPosition, "direction": missileDirection, "projectileId": id, "playerId":playerId});
	}
	else if (type == "Capture")
	{
		var multiplier = this.GetAttackBonus(type, target);
		var cmpHealth = Engine.QueryInterface(target, IID_Health);
		if (!cmpHealth || cmpHealth.GetHitpoints() == 0)
			return;
		multiplier *= cmpHealth.GetMaxHitpoints() / cmpHealth.GetHitpoints();

		var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
		if (!cmpOwnership || cmpOwnership.GetOwner() == -1)
			return;
		var owner = cmpOwnership.GetOwner();
		var cmpCapturable = Engine.QueryInterface(target, IID_Capturable);
		if (!cmpCapturable || !cmpCapturable.CanCapture(owner))
			return;
		
		var strength = this.GetAttackStrengths("Capture").value * multiplier;
		if(cmpCapturable.Reduce(strength, owner))
			Engine.PostMessage(target, MT_Attacked, {"attacker":this.entity, "target":target, "type":type, "damage":strength});
	}
	else if (type == "Convert")
	{
		var multiplier = this.GetAttackBonus(type, target);
		var cmpHealth = Engine.QueryInterface(target, IID_Health);
		if (!cmpHealth || cmpHealth.GetHitpoints() == 0)
			return;
		multiplier *= cmpHealth.GetMaxHitpoints() / cmpHealth.GetHitpoints();

		var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
		if (!cmpOwnership || cmpOwnership.GetOwner() == -1)
			return;
		var owner = cmpOwnership.GetOwner();
		var cmpConvertable = Engine.QueryInterface(target, IID_Convertable);
		if (!cmpConvertable || !cmpConvertable.CanConvert(owner))
			return;
		
		var strength = this.GetAttackStrengths("Convert").value * multiplier;
		if(cmpConvertable.Reduce(strength, owner))
			Engine.PostMessage(target, MT_Attacked, {"attacker":this.entity, "target":target, "type":type, "damage":strength});
	}
	else
	{
		// Melee attack - hurt the target immediately
		Damage.CauseDamage({"strengths":this.GetAttackStrengths(type), "target":target, "attacker":this.entity, "multiplier":this.GetAttackBonus(type, target), "type":type});
	}
	// TODO: charge attacks (need to design how they work)
};

Engine.ReRegisterComponentType(IID_Attack, "Attack", Attack);