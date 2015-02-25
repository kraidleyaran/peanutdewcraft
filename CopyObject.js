function MakeCopyOfObject(inputObject)
{
	var objType = typeof inputObject;
	var _primitives = ['string','number','boolean','null', 'function'];
	var objTypeIndex = _primitives.indexOf(objType);
	var returnObj;

	if (objTypeIndex < 0 && inputObject != null && inputObject != undefined)
	{
		switch(objType)
		{
			case 'object':
				returnObj = {};
				var objKeys = Object.keys(inputObject);
				var objKeysLength = objKeys.length
				for (iiProp = 0; iiProp < objKeysLength; iiProp++)
				{
					var currentPropString = objKeys[iiProp];
					var newProp = MakeCopyOfObject(inputObject[currentPropString])
					returnObj[currentPropString] = newProp;
				}
				break;
			case 'array':
				returnObj = [];
				var inputObjectLength = inputObject.length;
				for (iiObj = 0; iiObj < inputObjectLength; iiObj++)
				{
					var currentObj = inputObject[iiObj];
					var newObj = MakeCopyOfObject(currentObj);
					returnObj.push(newObj);
				}
				break;
			default:
				break;
		}
	}
	else
	{
		returnObj = inputObject;
	}

	return returnObj;
}