function Attack() {}

Attack.prototype.Schema =
"<a:help>Controls the attack abilities and strengths of the unit.</a:help>" +
	"<a:example>" +
		"<Melee>" +
			"<Hack>10.0</Hack>" +
			"<Pierce>0.0</Pierce>" +
			"<Crush>5.0</Crush>" +
			"<MaxRange>4.0</MaxRange>" +
			"<RepeatTime>1000</RepeatTime>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Civ>pers</Civ>" +
					"<Classes>Infantry</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</Bonus1>" +
				"<BonusCavMelee>" +
					"<Classes>Cavalry Melee</Classes>" +
					"<Multiplier>1.5</Multiplier>" +
				"</BonusCavMelee>" +
			"</Bonuses>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<PreferredClasses datatype=\"tokens\">Cavalry Infantry</PreferredClasses>" +
		"</Melee>" +
		"<Ranged>" +
			"<Hack>0.0</Hack>" +
			"<Pierce>10.0</Pierce>" +
			"<Crush>0.0</Crush>" +
			"<MaxRange>44.0</MaxRange>" +
			"<MinRange>20.0</MinRange>" +
			"<ElevationBonus>15.0</ElevationBonus>" +
			"<PrepareTime>800</PrepareTime>" +
			"<RepeatTime>1600</RepeatTime>" +
			"<ProjectileSpeed>50.0</ProjectileSpeed>" +
			"<Spread>2.5</Spread>" +
			"<Bonuses>" +
				"<Bonus1>" +
					"<Classes>Cavalry</Classes>" +
					"<Multiplier>2</Multiplier>" +
				"</Bonus1>" +
			"</Bonuses>" +
			"<RestrictedClasses datatype=\"tokens\">Champion</RestrictedClasses>" +
			"<Splash>" +
				"<Shape>Circular</Shape>" +
				"<Range>20</Range>" +
				"<FriendlyFire>false</FriendlyFire>" +
				"<Hack>0.0</Hack>" +
				"<Pierce>10.0</Pierce>" +
				"<Crush>0.0</Crush>" +
			"</Splash>" +
		"</Ranged>" +
		"<Charge>" +
			"<Hack>10.0</Hack>" +
			"<Pierce>0.0</Pierce>" +
			"<Crush>50.0</Crush>" +
			"<MaxRange>24.0</MaxRange>" +
			"<MinRange>20.0</MinRange>" +
		"</Charge>" +
		"<Slaughter>" +
			"<Hack>1000.0</Hack>" +
			"<Pierce>0.0</Pierce>" +
			"<Crush>0.0</Crush>" +
			"<MaxRange>4.0</MaxRange>" +
		"</Slaughter>" +
	"</a:example>" +
	"<optional>" +
		"<element name='Melee'>" +
			"<interleave>" +
				"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" + // TODO: it shouldn't be stretched
					"<data type='positiveInteger'/>" +
				"</element>" +
				bonusesSchema +
				preferredClassesSchema +
				restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Ranged'>" +
			"<interleave>" +
				"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MinRange' a:help='Minimum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<optional>"+
					"<element name='ElevationBonus' a:help='give an elevation advantage (in meters)'><ref name='nonNegativeDecimal'/></element>" +
				"</optional>" +
				"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation'>" +
					"<data type='nonNegativeInteger'/>" +
				"</element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" +
					"<data type='positiveInteger'/>" +
				"</element>" +
				"<element name='ProjectileSpeed' a:help='Speed of projectiles (in metres per second). If unspecified, then it is a melee attack instead'>" +
					"<ref name='nonNegativeDecimal'/>" +
				"</element>" +
				"<element name='Spread' a:help='Radius over which missiles will tend to land (when shooting to the maximum range). Roughly 2/3 will land inside this radius (in metres). Spread is linearly diminished as the target gets closer.'><ref name='nonNegativeDecimal'/></element>" +
				bonusesSchema +
				preferredClassesSchema +
				restrictedClassesSchema +
				"<optional>" +
					"<element name='Splash'>" +
						"<interleave>" +
							"<element name='Shape' a:help='Shape of the splash damage, can be circular or linear'><text/></element>" +
							"<element name='Range' a:help='Size of the area affected by the splash'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='FriendlyFire' a:help='Whether the splash damage can hurt non enemy units'><data type='boolean'/></element>" +
							"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
							"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
							bonusesSchema +
						"</interleave>" +
					"</element>" +
				"</optional>" +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Charge'>" +
			"<interleave>" +
				"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MaxRange'><ref name='nonNegativeDecimal'/></element>" + // TODO: how do these work?
				"<element name='MinRange'><ref name='nonNegativeDecimal'/></element>" +
				bonusesSchema +
				preferredClassesSchema +
				restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>" +
	"<optional>" +
		"<element name='Slaughter' a:help='A special attack to kill domestic animals'>" +
			"<interleave>" +
				"<element name='Hack' a:help='Hack damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Pierce' a:help='Pierce damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='Crush' a:help='Crush damage strength'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MaxRange'><ref name='nonNegativeDecimal'/></element>" + // TODO: how do these work?
				bonusesSchema +
				preferredClassesSchema +
				restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>"+
	// TODO: finish the convert attack
	"<optional>" +
		"<element name='Convert'>" +
			"<interleave>" +
				"<element name='MaxRange' a:help='Maximum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<element name='MinRange' a:help='Minimum attack range (in metres)'><ref name='nonNegativeDecimal'/></element>" +
				"<optional>"+
					"<element name='ElevationBonus' a:help='give an elevation advantage (in meters)'><ref name='nonNegativeDecimal'/></element>" +
				"</optional>" +
				"<element name='PrepareTime' a:help='Time from the start of the attack command until the attack actually occurs (in milliseconds). This value relative to RepeatTime should closely match the \"event\" point in the actor&apos;s attack animation'>" +
					"<data type='nonNegativeInteger'/>" +
				"</element>" +
				"<element name='RepeatTime' a:help='Time between attacks (in milliseconds). The attack animation will be stretched to match this time'>" +
					"<data type='positiveInteger'/>" +
				"</element>" +
				bonusesSchema +
				preferredClassesSchema +
				restrictedClassesSchema +
			"</interleave>" +
		"</element>" +
	"</optional>";

Attack.prototype.GetAttackTypes = function()
{
	var ret = [];
	if (this.template.Charge) ret.push("Charge");
	if (this.template.Melee) ret.push("Melee");
	if (this.template.Ranged) ret.push("Ranged");
	if (this.template.Convert) ret.push("Convert");
	return ret;
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

		var targetVelocity = Vector3D.sub(targetPosition, previousTargetPosition).div(this.turnLength);
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

		var playerId = Engine.QueryInterface(this.entity, IID_Ownership).GetOwner()
		var cmpTimer = Engine.QueryInterface(SYSTEM_ENTITY, IID_Timer);
 		cmpTimer.SetTimeout(this.entity, IID_Attack, "MissileHit", timeToTarget*1000, {"type": type, "target": target, "position": realTargetPosition, "direction": missileDirection, "projectileId": id, "playerId":playerId});
	// TODO: improve convert
	else if (type == "Convert")
	{
		var cmpOwnership = Engine.QueryInterface(target, IID_Ownership);
		if (!cmpOwnership)
			return;

		var cmpOwnership2 = Engine.QueryInterface(this.entity, IID_Ownership);
		if (!cmpOwnership2)
			return;
		cmpOwnership.SetOwner(cmpOwnership2.GetOwner());
	}
	else
	{
		// Melee attack - hurt the target immediately
		this.CauseDamage({"type": type, "target": target});
	}
	// TODO: charge attacks (need to design how they work)
};

Attack.prototype.GetNearbyEntities = function(startEnt, range, friendlyFire)
{
	var cmpPlayerManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_PlayerManager);
	var cmpOwnership = Engine.QueryInterface(this.entity, IID_Ownership);
	var owner = cmpOwnership.GetOwner();
	var cmpPlayer = Engine.QueryInterface(cmpPlayerManager.GetPlayerByID(owner), IID_Player);
	var numPlayers = cmpPlayerManager.GetNumPlayers();
	var players = [];
	
	for (var i = 1; i < numPlayers; ++i)
	{	
		// Only target enemies unless friendly fire is on
		if (cmpPlayer.IsEnemy(i) || friendlyFire)
			players.push(i);
	}
	
	var rangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	return rangeManager.ExecuteQuery(startEnt, 0, range, players, IID_DamageReceiver);
}