function GameManager(){

	var _gameObjectTypes = new Array();
	var _gameObjectProtos = new Array();
	var _gameObjectId = 0;
	var _gameEmptyIndex = new Array();

	this.CreateGameObjectType = CreateGameObjectType;
	this.CreateGameObject = CreateGameObject;
	var _objTypes = ['string','number','boolean','array','object','function']

	var IsAllowedType = function (inputTypeString) 
	{
		var response;
		if (!inputTypeString || inputTypeString == null)
		{
			throw "inputType string is undefined or null" + "\n\r" + "inputTypeString = " + inputTypeString;
		}

		
		var isStringInArray = _objTypes.indexOf(inputTypeString)
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
		objsParams.props[] = an array with objects that contain the following two properties: (where i = property name)
			props[i].required = a boolean indicating whether or not the property in question will be required for an object when making new instances of it 
			props[i] = one of the _objTypes listed above as a private variable. Ctrl+F that shit.

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
			var requireType = typeof objParams.props[currentObjPropString].require;

			for (iiProp = 0; iiProp < objParamsProps.length; iiProp++)
			{
				var currentObjPropString = objParamsProps[iiProp]
				var cleanObjPropName = purifyString(currentObjPropString);
				// the following is done so in order to prevent any sort of property naming shenanigans do not include the typeName. I throw you the warning letting you know you're a dumbass and to try again
				if (cleanObjPropName == cleanTypeNameString)
				{
					throw "Cannot name property typeName (regardless of capitalization or trickery). Make sure if you're setting the type name in the params.props variable to set it in params.typeName"
				}
				else if (requireType != 'boolean')
				{
					throw 'objParams.require must be a boolean. Current = ' + requireType;
				}
				else
				{
					var currentObjKey = objParams.props[currentObjPropString]
					var isKeyTypeValid = IsAllowedType(currentObjKey);

					if(isKeyTypeValid == true)
					{
						returnObj[currentObjPropString] = currentObjKey;
						returnObj[currentObjPropString].require = objParams.props[currentObjPropString].require
					}
					else
					{
						throw currentObjKey + "is not a valid data type n00b. Try again. " + "\n\r" + _objTypes
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
					var typeName = inputParams.typeName;

					this.SetProperty = SetProperty;
					this.GetProperty = GetProperty;
					this.DoesPropExist = DoesPropExist;
					this.GetType = GetType;
					this.DeleteProperty = DeleteProp;

					var inputParamsProps = Object.keys(inputParams.props)

					for (iiProp == 0; iiProp < inputParamsProps.length; iiProp++)
					{
						var currentParamProp = inputParamsProps[iiProp];

						var propExist = DoesPropExistInProto(currentParamProp, typeName)

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
							throw currentParamProp + " does not exist in GameObject Type " + typeName;
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

					function GetType()
					{
						var response = typeName;
						return response;
					}

					function DeleteProp(inputPropString)
					{
						var doesPropExist = DoesPropExist(inputPropString)

						if (doesPropExist.bool == true)
						{
							delete props[inputPropString]
						}
						else
						{
							throw inputPropString + "does not exist in gameObject " + that;
						}
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
					this.SetProperty(inputProp, inputKeyValue);
				}
				newGameObject.prototype.GetProperty = (inputProp)
				{
					var response = this.GetProperty(inputProp);
					return response;
				}
				newGameObject.prototype.DoesPropExist = (inputPropString)
				{
					var response = this.DoesPropExist(inputPropString);
					return respsonse;
				}
				newGameObject.prototype.GetType = ()
				{
					var response = this.GetType();
					return response;
				}
				newGameObject.prototype.DeleteProperty = (inputPropString)
				{
					var response = this.DoesPropExist(inputPropString);
					return response;
				}


				returnObj = newGameObject;

			}
		}

		return returnObj;
		
	}

	function RemoveGameObjectType = function (objTypeString)
	{
		var cleanInputTypeString = objTypeString
		var doesObjExist = DoesGameObjectTypeExist(objTypeString)

		if (doesObjExist.bool == true)
		{
			_gameObjectProtos[doesObjExist.returnIndex] = null;
			_gameObjectTypes[doesObjTypeExist.returnIndex] = null;
			_gameEmptyIndex.push(doesObjTypeExist.returnIndex)

		}
		else
		{
			throw objTypeString + 'does not exist'
		}
	}
	/* Since you're going to be "setting" the object's type, inputParams for it's type require it's current typeName (in inputParams.typeName) and the properties you wish to add or remove from it in a similar
	fashion to how the objectType is added. The only real difference is that you have a new property called "command" that must be included that is either "add" or "remove", along with the propertyName as a property itself
	and it's type. This will decide whether or not the property will attempted to be added or removed.

	If you want to simply rename the game object type, just include the new name in the type name, then include a null property array.
	*/
	function SetGameObjectType = function(inputParams)
	{
		var cleanInputTypeString = inputParams.typeName;
		var doesObjExist = DoesGameObjectTypeExist(cleanInputTypeString)

		var currentObjProto;

		if (doesObjExist.bool == true)
		{

			currentObjProto = _gameObjectProtos[doesObjExist.returnIndex]

			if(!inputParams.typeName)
			{
				throw 'inputParams.typeName required'
			}

			else
			{
				for (ii = 0; ii < inputParams.props.length; ii++)
				{
					var inputObjProp = inputParams.props[ii];
					var objIntegrity = CheckObjIntegrity_SetGameObjType(inputObjProp)

					var pureCommand = purifyString(inputObjProp.command)

					if (objIntegrity == false)
					{
						throw "Error: Object properties invalid = " + inputObjProp.props;
					}
					switch (pureCommand)
					{
						case 'add':
						case 'set':
							if (inputObjProp.require == true)
							{	

								var objProp = GetPropFromObj_SetGameObjType(inputObjProp)

								objProp.require = true;

								var objKey = inputObjProp[objProp]
								currentObjProto[objProp] = objKey;
							}
							else
							{
								var objProp = GetPropFromObj_SetGameObjType(inputObjProp)

								objProp.require = false;

								var objKey = inputObjProp[objProp]
								currentObjProto[objProp] = objKey;
							}
							break;

						case 'remove':
							delete currentObjProto[objProp]
							break;
					}
				}


				
			}

		}
		else
		{
			throw inputParams.typeName + "is not a current type"
		}

		return currentObjProto;
	}

	function GetPropFromObj_SetGameObjType(objProp)
	{
		var inputProps = Object.keys(objProp)
		var requireIndex = inputProps.indexOf('require')
		var commandIndex = inputProps.indexOf('command')
		
		var numOne = commandIndex + requireIndex
		var currentPropNum;

		switch(numOne)
		{
			case 1:
				currentPropNum = 2
				break;
			case 2:
				currentPropNum = 1
				break;
			case 3:
				currentPropNum = 0
				break;
		}

		var currentProp = inputProps[currentPropNum]

		return currentProp;
	}

	function CheckObjIntegrity_SetGameObjType(inputObj)
	{
		var inputObjProp_reqFields = Object.keys(inputObj)
		var reqFields = inputObjProp_reqFields.length;
		var requireIndex = inputObjProp_reqFields('require')
		var commandIndex = inputObjProp_reqFields('command')
		var requireFieldType = typeof inputObjProp_reqFields[requireIndex]

		var pureCommand = purifyString(inputObjProp_reqFields[commandIndex])

		var response = false;

		if (commandIndex < 0)
		{
			throw "Error: command required as a property"
		}
		else if (requireIndex < 0)
		{
			throw "Error: require is required as a property"
		}
		else if (reqFields > 3)
		{
			throw "Error: Too many properties on object. Separate properties into objects in the props Array."
		}
		else if (reqFields < 3)
		{
			throw "Error: Missing property"
		}
		if (pureCommand != 'add' || pureCommand != 'remove' || pureCommand != 'set' )
		{
			throw "command property must be either 'add' or 'remove'"
		}
		else if (requireFieldType != 'boolean')
		{
			throw "require property must be a boolean"
		}
		else
		{
			response = true;
		}

		return response;
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