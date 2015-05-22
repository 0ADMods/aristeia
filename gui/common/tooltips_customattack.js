function getAttackTypeLabel(type)
{
	if (type === "Charge") return translate("Charge Attack:");
	if (type === "Melee") return translate("Melee Attack:");
	if (type === "Ranged") return translate("Ranged Attack:");
	if (type === "Capture") return translate("Capture Attack:");
	if (type === "Convert") return translate("Convert Attack:");

	warn(sprintf("Internationalization: Unexpected attack type found with code ‘%(attackType)s’. This attack type must be internationalized.", { attackType: type }));
	return translate("Attack:");
}