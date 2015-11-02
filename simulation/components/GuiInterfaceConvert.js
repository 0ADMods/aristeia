
/**
 * Get common entity info, often used in the gui
 */
GuiInterface.prototype.GetEntityState = function(player, ent)
{
	var cmpTemplateManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_TemplateManager);

	// All units must have a template; if not then it's a nonexistent entity id
	var template = cmpTemplateManager.GetCurrentTemplateName(ent);
	if (!template)
		return null;

	var ret = {
		"id": ent,
		"template": template,

		"alertRaiser": null,
		"builder": null,
		"identity": null,
		"fogging": null,
		"foundation": null,
		"garrisonHolder": null,
		"gate": null,
		"guard": null,
		"mirage": null,
		"pack": null,
		"player": -1,
		"position": null,
		"production": null,
		"rallyPoint": null,
		"resourceCarrying": null,
		"rotation": null,
		"trader": null,
		"unitAI": null,
		"visibility": null,
	};

	var cmpMirage = Engine.QueryInterface(ent, IID_Mirage);
	if (cmpMirage)
		ret.mirage = true;

	var cmpIdentity = Engine.QueryInterface(ent, IID_Identity);
	if (cmpIdentity)
	{
		ret.identity = {
			"rank": cmpIdentity.GetRank(),
			"classes": cmpIdentity.GetClassesList(),
			"visibleClasses": cmpIdentity.GetVisibleClassesList(),
			"selectionGroupName": cmpIdentity.GetSelectionGroupName()
		};
	}
	
	var cmpPosition = Engine.QueryInterface(ent, IID_Position);
	if (cmpPosition && cmpPosition.IsInWorld())
	{
		ret.position = cmpPosition.GetPosition();
		ret.rotation = cmpPosition.GetRotation();
	}

	var cmpHealth = QueryMiragedInterface(ent, IID_Health);
	if (cmpHealth)
	{
		ret.hitpoints = Math.ceil(cmpHealth.GetHitpoints());
		ret.maxHitpoints = cmpHealth.GetMaxHitpoints();
		ret.needsRepair = cmpHealth.IsRepairable() && (cmpHealth.GetHitpoints() < cmpHealth.GetMaxHitpoints());
		ret.needsHeal = !cmpHealth.IsUnhealable();
	}

	var cmpCapturable = QueryMiragedInterface(ent, IID_Capturable);
	if (cmpCapturable)
	{
		ret.capturePoints = cmpCapturable.GetCapturePoints();
		ret.maxCapturePoints = cmpCapturable.GetMaxCapturePoints();
	}

	var cmpConvertable = Engine.QueryInterface(ent, IID_Convertable);
	if (cmpConvertable)
	{
		ret.convertPoints = cmpConvertable.GetConvertPoints();
		ret.maxConvertPoints = cmpConvertable.GetMaxConvertPoints();
	}

	var cmpBuilder = Engine.QueryInterface(ent, IID_Builder);
	if (cmpBuilder)
		ret.builder = true;

	var cmpPack = Engine.QueryInterface(ent, IID_Pack);
	if (cmpPack)
	{
		ret.pack = {
			"packed": cmpPack.IsPacked(),
			"progress": cmpPack.GetProgress(),
		};
	}

	var cmpProductionQueue = Engine.QueryInterface(ent, IID_ProductionQueue);
	if (cmpProductionQueue)
	{
		ret.production = {
			"entities": cmpProductionQueue.GetEntitiesList(),
			"technologies": cmpProductionQueue.GetTechnologiesList(),
			"queue": cmpProductionQueue.GetQueue(),
		};
	}

	var cmpTrader = Engine.QueryInterface(ent, IID_Trader);
	if (cmpTrader)
	{
		ret.trader = {
			"goods": cmpTrader.GetGoods(),
			"requiredGoods": cmpTrader.GetRequiredGoods()
		};
	}

	var cmpFogging = Engine.QueryInterface(ent, IID_Fogging);
	if (cmpFogging)
	{
		if (cmpFogging.IsMiraged(player))
			ret.fogging = {"mirage": cmpFogging.GetMirage(player)};
		else
			ret.fogging = {"mirage": null};
	}

	var cmpFoundation = QueryMiragedInterface(ent, IID_Foundation);
	if (cmpFoundation)
	{
		ret.foundation = {
			"progress": cmpFoundation.GetBuildPercentage(),
			"numBuilders": cmpFoundation.GetNumBuilders()
		};
	}

	var cmpOwnership = Engine.QueryInterface(ent, IID_Ownership);
	if (cmpOwnership)
	{
		ret.player = cmpOwnership.GetOwner();
	}

	var cmpRallyPoint = Engine.QueryInterface(ent, IID_RallyPoint);
	if (cmpRallyPoint)
	{
		ret.rallyPoint = {'position': cmpRallyPoint.GetPositions()[0]}; // undefined or {x,z} object
	}

	var cmpGarrisonHolder = Engine.QueryInterface(ent, IID_GarrisonHolder);
	if (cmpGarrisonHolder)
	{
		ret.garrisonHolder = {
			"entities": cmpGarrisonHolder.GetEntities(),
			"allowedClasses": cmpGarrisonHolder.GetAllowedClasses(),
			"capacity": cmpGarrisonHolder.GetCapacity(),
			"garrisonedEntitiesCount": cmpGarrisonHolder.GetGarrisonedEntitiesCount()
		};
	}

	var cmpUnitAI = Engine.QueryInterface(ent, IID_UnitAI);
	if (cmpUnitAI)
	{
		ret.unitAI = {
			"state": cmpUnitAI.GetCurrentState(),
			"orders": cmpUnitAI.GetOrders(),
			"hasWorkOrders": cmpUnitAI.HasWorkOrders(),
			"canGuard": cmpUnitAI.CanGuard(),
			"isGuarding": cmpUnitAI.IsGuardOf(),
			"possibleStances": cmpUnitAI.GetPossibleStances(),
			"isIdle":cmpUnitAI.IsIdle(),
		};
		// Add some information needed for ungarrisoning
		if (cmpUnitAI.IsGarrisoned() && ret.player !== undefined)
			ret.template = "p" + ret.player + "&" + ret.template;
	}

	var cmpGuard = Engine.QueryInterface(ent, IID_Guard);
	if (cmpGuard)
	{
		ret.guard = {
			"entities": cmpGuard.GetEntities(),
		};
	}

	var cmpResourceGatherer = Engine.QueryInterface(ent, IID_ResourceGatherer);
	if (cmpResourceGatherer)
	{
		ret.resourceCarrying = cmpResourceGatherer.GetCarryingStatus();
	}

	var cmpGate = Engine.QueryInterface(ent, IID_Gate);
	if (cmpGate)
	{
		ret.gate = {
			"locked": cmpGate.IsLocked(),
		};
	}

	var cmpAlertRaiser = Engine.QueryInterface(ent, IID_AlertRaiser);
	if (cmpAlertRaiser)
	{
		ret.alertRaiser = {
			"level": cmpAlertRaiser.GetLevel(),
			"canIncreaseLevel": cmpAlertRaiser.CanIncreaseLevel(),
			"hasRaisedAlert": cmpAlertRaiser.HasRaisedAlert(),
		};
	}

	var cmpRangeManager = Engine.QueryInterface(SYSTEM_ENTITY, IID_RangeManager);
	ret.visibility = cmpRangeManager.GetLosVisibility(ent, player);

	return ret;
};

GuiInterface.prototype.CanConvert = function(player, data)
{
	var cmpAttack = Engine.QueryInterface(data.entity, IID_Attack);
	if (!cmpAttack)
		return false;

	var owner = QueryOwnerInterface(data.entity).GetPlayerID();
	var cmpConvertable = Engine.QueryInterface(data.target, IID_Convertable);

	if (cmpConvertable && cmpConvertable.CanConvert(owner) && cmpAttack.GetAttackTypes().indexOf("Convert") != -1)
		return cmpAttack.CanAttack(data.target);

	return false;
};

// List the GuiInterface functions that can be safely called by GUI scripts.
// (GUI scripts are non-deterministic and untrusted, so these functions must be
// appropriately careful. They are called with a first argument "player", which is
// trusted and indicates the player associated with the current client; no data should
// be returned unless this player is meant to be able to see it.)
var exposedFunctions = {
	
	"GetSimulationState": 1,
	"GetExtendedSimulationState": 1,
	"GetRenamedEntities": 1,
	"ClearRenamedEntities": 1,
	"GetEntityState": 1,
	"GetExtendedEntityState": 1,
	"GetAverageRangeForBuildings": 1,
	"GetTemplateData": 1,
	"GetTechnologyData": 1,
	"IsTechnologyResearched": 1,
	"CheckTechnologyRequirements": 1,
	"GetStartedResearch": 1,
	"GetBattleState": 1,
	"GetIncomingAttacks": 1,
	"GetNeededResources": 1,
	"GetNextNotification": 1,
	"GetTimeNotifications": 1,

	"GetAvailableFormations": 1,
	"GetFormationRequirements": 1,
	"CanMoveEntsIntoFormation": 1,
	"IsFormationSelected": 1,
	"GetFormationInfoFromTemplate": 1,
	"IsStanceSelected": 1,

	"SetSelectionHighlight": 1,
	"GetAllBuildableEntities": 1,
	"SetStatusBars": 1,
	"GetPlayerEntities": 1,
	"DisplayRallyPoint": 1,
	"SetBuildingPlacementPreview": 1,
	"SetWallPlacementPreview": 1,
	"GetFoundationSnapData": 1,
	"PlaySound": 1,
	"FindIdleUnits": 1,
	"GetTradingRouteGain": 1,
	"GetTradingDetails": 1,
	"CanCapture": 1,
	"CanConvert": 1,

	"CanAttack": 1,
	"GetBatchTime": 1,

	"IsMapRevealed": 1,
	"SetPathfinderDebugOverlay": 1,
	"SetObstructionDebugOverlay": 1,
	"SetMotionDebugOverlay": 1,
	"SetRangeDebugOverlay": 1,

	"GetTraderNumber": 1,
	"GetTradingGoods": 1,
};

Engine.ReRegisterComponentType(IID_GuiInterface, "GuiInterface", GuiInterface);