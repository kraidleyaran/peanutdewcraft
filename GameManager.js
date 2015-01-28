function GameManager(){

	var _gameObjectTypes = new Array();
	var _gameObjectProtos = new Array();
	var _gameObjectId = 0;
	var _gameEmptyIndex = new Array();

	this.CreateGameObjectType = CreateGameObjectType;
	this.CreateGameObject = CreateGameObject;

	var IsAllowedType = function (inputTypeString) 
	{
		var response;
		if (!inputTypeString || inputTypeString == null)
		{
			throw "inputType string is undefined or null" + "\n\r" + "inputTypeString = " + inputTypeString;
		}

		var objTypes = ['string','number','boolean','array','object','function']
		var isStringInArray = objTypes.indexOf(inputTypeString)
		if (isStringInArray < 0)
		{
			response.bool = false;
		}
		else
		{
			response.bool = true;
		}

		return response;
	}
	/*When creating a new GameObject type, you must include the following in objParams:
		objsParams.typeName = "game object type name" -
		objsParams.props[] = an array with objects that contain the following two properties:
			props.required = a boolean indicating whether or not the property in question will be required for an object when making new instances of it 
			props.keyType = one of seven types: string, number, boolean, array, object, function

		Please note that an object cannot contain typename or any variation there of as a property name unless another word is before, between, or after type and name. That includes any symbol attached to typeName
		*/
	function CreateGameObjectType(objParams)
	{
		var returnObj = new Object();

		var paramsTypeName = objParams.typeName

		if (!paramsTypeName || paramsTypeName == null)
		{
			throw "Object Parameters requires valid type name" + "\n\r" + "objParams.typeName = " + paramsTypeName;
		}
		
		var doesObjTypeExist = DoesGameObjectTypeExist(paramsTypeName);

		if (doesObjTypeExist.bool == false)
		{
			var cleanParamsTypeName = purifyString(paramsTypeName);

			returnObj.typeName = paramsTypeName;

			_gameObjectTypes[_gameObjectTypes.length] = cleanParamsTypeName

			var objParamsProps = Object.keys(objParams.props);
			var checkTypeNameString = "typeName"
			var cleanTypeNameString = purifyString(checkTypeNameString);

			for (iiProp = 0; iiProp < objParamsProps.length; iiProp++)
			{
				var currentObjProp = objParamsProps[iiProp]
				var cleanObjPropName = purifyString(currentObjProp);
				// the following is done so in order to prevent any sort of property naming shenanigans do not include the typeName. I throw you the warning letting you know you're a dumbass and to try again
				if (cleanObjPropName == cleanTypeNameString)
				{
					throw "Cannot name property typeName (regardless of capitalization or trickery). Make sure if you're setting the type name in the params.props variable to set it in params.typeName"
				}
				else
				{
					var currentObjKey = objParams.props[currentObjProp].keyType
					var isKeyTypeValid = IsAllowedType(currentObjKey);
					if(isKeyTypeValid == true)
					{
						returnObj[currentObjProp] = currentObjKey;	
					}
					else
					{
						throw currentObjKey + "is not a valid dataType n00b. Try again."
					}
					
				}

			}
		}
		else
		{
			throw "gameObject Type " + paramsTypeName + " already exists"
		}

		_gameObjectProtos[_gameObjectId] = returnObj;
		return paramsTypeName;
	}

	function DoesGameObjectTypeExist(inputObjType)
	{
		var response;
		var cleanInputObjType = purifyString(inputObjType);
		var objIndex = _gameObjectTypes.indexOf(cleanInputObjType)

		try
		{
			if (objIndex < 0)
			{
				response.bool = false;
			}
			else
			{
				response.bool = true
				response.returnIndex = objIndex;
			}
		}
		catch(err)
		{
			throw err;
		}
		return response;

	}
	/*This requires the same rules as creating it's type - typeName must be a separate property that's not in the props property, but the inputParams.prop[property name] key needs to be what you wanted
	to set it to when you created the gameObject type.
	*/
	function CreateGameObject(inputParams)
	{
		var returnObj;
		if (!inputParams.typeName || inputParams.typeName == null)
		{
			throw "Parameter for typeName must be valid";
		}
		else
		{
			var doesGameObjTypeExist = DoesGameObjectTypeExist(inputParams.typeName);

			if (doesGameObjTypeExist.bool == true)
			{
				var newGameObject = function()
				{
					var props = {}
					var that = this;

					this.SetProperty = SetProperty();
					this.GetProperty = GetProperty();
					this.DoesPropExist = DoesPropExist();

					var inputParamsProps = Object.keys(inputParams.props)

					for (iiProp == 0; iiProp < inputParamsProps.length; iiProp++)
					{
						var currentParamProp = inputParamsProps[iiProp];

						var propExist = DoesPropExistInProto(currentParamProp, inputParams.typeName)

						if (propExist.bool == true)
						{
							var protoPropType = _gameObjectProtos[doesGameObjTypeExist.returnIndex][currentParamProp]
							var currentPropType = typeof inputParams.props[currentParamProp]

							if (protoPropType == currentPropType)
							{
								props[currentParamProp] = inputParams.props[currentParamProp]
							}
							else
							{
								throw protoPropType + " and " + currentPropType + "are not equal types. And if they are, boy are you in for some digging... - Past Alex";
							}
							
						}
						else
						{
							throw currentParamProp + " does not exist in GameObject Type" + inputParams.typeName;
						}

					}

					function SetProperty(inputProp, inputKeyValue)
					{
						var doesCurrentPropExist = DoesPropExist(inputProp)
						if (doesCurrentPropExist.bool == true)
						{
							props[inputProp] = inputKeyValue;
						}
						else
						{
							throw "Property " + inputProp + " does not exist in object " + that;
						}
					}

					function GetProperty(inputProp)
					{
						var doesCurrentPropExist = DoesPropExist(inputProp)
						
						var response;
						if (doesCurrentPropExist.bool == true)
						{
							response.returnKey = props[inputProp];
						}
						else
						{
							throw "Property " + inputProp + " does not exist in object"
						}
					}
					function DoesPropExist(inputPropString)
					{
						var currentProps = Object.keys(props)
						var propIndex = currentProps.indexOf(inputPropString)

						var response;

						if (propIndex < 0)
						{
							response.bool = false;
						}
						else
						{
							response.bool = true;
							response.returnIndex = propIndex;
						}

						return response;
					}

					function DoesPropExistInProto(inputPropString, objTypeString)
					{
						var response;

						var cleaninputPropString = purifyString(inputPropString);
						var cleanObjTypeString = purifyString(objTypeString);

						var doesObjTypeExist = DoesGameObjectTypeExist(cleanObjTypeString)
						if (doesObjTypeExist.bool == true)
						{
							var objProto  = _gameObjectProtos[doesObjTypeExist.returnIndex]
							var objProtoProps = Object.keys(objProto)

							var propIndex = objProtoProps.indexOf(inputPropString)

							if (propIndex < 0)
							{
								response.bool = false;

							}
							else
							{
								response.bool = true;
								response.returnIndex = propIndex;
							}
						}
						
						return response;
					}

				}
				newGameObject.prototype.SetProperty = (inputProp, inputKeyValue)
				{
					this.SetProperty(inputProp, inputKeyValue)
				}
				newGameObject.prototype.GetProperty = (inputProp)
				{
					var response = this.GetProperty(inputProp)
					return response;
				}
				newGameObject.prototype.DoesPropExist = (inputPropString)
				{
					var response = this.DoesPropExist
					return respsonse;
				}

				returnObj = newGameObject;

			}
		}

		return returnObj;
		
	}

}

GameManager.prototype.CreateGameObjectType =  function (inputParams)
{
	var response = this.CreateGameObjectType(inputParams);
	return response;
}

GameManager.prototype.CreateGameObject = function (inputParams)
{
	var response = this.CreateGameObject(inputParams);
	return response;
}

}

function purifyString(inputString)
{
	inputString = inputString.replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}