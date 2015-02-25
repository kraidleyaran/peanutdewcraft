function GameMaster(_gameObserver, _inputDevice){

	var GameObserver = _gameObserver;
	var _conditions = {};
	var _actions = {};
	var _rules = {};
	var _states = {};

	var inputDevice = _inputDevice || {};
	if (inputDevice)
	{
		this.keyCodes = inputDevice.KeyCodes;
		this.mouseCodes = inputDevice.MouseCodes;
		this.padCodes = inputDevice.PadCodes;		
	}


	this.CreateGameObjectConditions = CreateGameObjectConditions;
	this.CreateInputButtonConditions = CreateInputButtonConditions;
	this.CreateInputPositionConditions = CreateInputPositionConditions;
	this.GetConditionNames = GetConditionNames;
	this.GetConditions = GetConditions;

	function IsOperativeValid(inputOperative)
	{
		var validOperatives = ['<', '>', '<=', '>=', '==', '!=']
		var operativeIndex = validOperatives.indexOf(inputOperative);
		var returnBool;
		if (operativeIndex < 0)
		{
			returnBool = false;
		}
		else
		{
			returnBool = true;
		}

		return returnBool;
	}

	function DoesConditionNameExist(inputConditionName)
	{
		var currentConditionNames = GetConditionNames();
		var conditionNameIndex = currentConditionNames.indexOf(inputConditionName);
		var returnResult;
		if (conditionNameIndex < 0)
		{
			returnResult = false;
		}
		else
		{
			returnResult = true;
		}

		return returnResult;
	}
	function IsDeviceTypeValid(inputDeviceTypeString)
	{
		var _validDeviceTypes = ['keyboard', 'mouse', 'pad'];
		var _inputTypeIndex = _validDeviceTypes.indexOf(inputDeviceTypeString);
		var returnBool = false;
		if (_inputTypeIndex < 0)
		{
			throw "Invalid device type: " + inputDeviceTypeString;
			return;
		}
		else
		{
			returnbool = true;
		}

		return;
	}
	function GetConditions(inputConditionNameArray)
	{
		var inputConditionNameArrayLength = inputConditionNameArray.length;
		var returnConditionArray = [];
		for (iiConditionName = 0; iiConditionName < inputConditionNameArrayLength; iiConditionName++)
		{
			var _currentConditionName = inputConditionNameArray[iiConditionName];
			var _conditionNameExist = DoesConditionNameExist(_currentConditionName)
			{
				if (_conditionNameExist == false)
				{
					throw "Condition name does not exist: " + _currentConditionName
					return;
				}
			}
			returnConditionArray.push(_conditions[_currentConditionName]);
		}

		return returnConditionArray;
	}
	/*
		inputPositionConditionArray[i] = {
			"deviceType": "keyboard", "pad", or "mouse",
			"positionValues"= [array of values for positions]
			"nameLabel": string containing the name of the condition
		}
	*/
	function CreateInputPositionConditions(params)
	{
		var returnConditionArray = [];
		var paramsLength = params.length;

		for (iiInputPositionCondition = 0; iiInputPositionCondition < paramsLength; iiInputPositionCondition++)		
		{
			var newInputPositionConditionObj = {};
			var currentInputPositionCondition = params[iiInputPositionCondition];
			_CheckInputPositionProps(currentInputPositionCondition);
			var inputPosKeys = Object.keys(currentInputPositionCondition);
			var inputPosKeysLength = inputPosKeys.length;
			var _propCount = inputPosKeysLength - 1;

			for (iiInputPosProp = 0; iiInputPosProp < inputPosKeysLength; iiInputPosProp++)
			{
				var _currentPosPropString = inputPosKeys[iiInputPosProp];
				var _currentPosProp = currentInputPositionCondition[_currentPosPropString];
				newInputPositionConditionObj[_currentPosPropString] = MakeCopyOfObject(_currentPosProp);
			}
			if (iiInputPosProp == _propCount)
			{
				newInputConditionObj["conditionType"] = "input" + currentInputCodeObj["deviceType"] + "Position"
				returnConditionArray.push(newInputPositionConditionObj);
				_conditions[newInputPositionConditionObj.nameLabel] = newInputPositionConditionObj;
			}
		}
		function _CheckInputPositionProps(inputPositionConditionParams)
		{
			var _inputConditionKeys = Object.keys(inputPositionConditionParams);
			var _inputConditionKeyLength = _inputConditionKeys.length;
			var reqInputConditionProps = ['inputCodes','deviceType', 'nameLabel']
			var returnArray = [];

			for (iiProp = 0; iiProp < _inputConditionKeyLength; iiProp++)
			{
				var _currentProp = _inputConditionKeys[iiProp];
				var _currentPropValidIndex = reqInputConditionProps.indexOf(_currentProp);
				if (_currentPropValidIndex < 0)
				{
					throw "Invalid Property " + _currentProp;
					return;
				}
				switch(_currentProp)
				{
					case 'nameLabel':
						var conditionNameExist = DoesConditionNameExist(_currentProp);
						if (conditionNameExist == true)
						{
							throw "Condition Name " + _currentProp + " already exisits."
							return;
						}
						else if(_currentProp.length <= 0)
						{
							throw "Condition name must be more than 0 characters: " + _currentProp;
							return;
						}
						break;
					case 'deviceType':
						var validDeviceType = IsDeviceTypeValid(_currentProp);
						if (validDeviceType == false || _currentProp == 'keyboard')
						{
							throw 'Invalid device type: ' + _currentProp;
							return;
						}
						break;
					case 'positionValues':
						var _currentPropLength = _currentProp.length;
						if (_currentPropLength < 0)
						{
							throw "positionValues must contain at least one value"
							return;
						}
						switch(inputPositionConditionParams['deviceType'])
						{
							case 'mouse':
								if (_currentPropLength > 2)
								{
									throw "mouse positionValues cannot be more than two"
									return;
								}
								break;
							case 'pad':
								if (_currentPropLength > 6)
								{
									throw "pad positionValues cannot be more than six"
									return;
								}
								break;
						}

						break;
					default:
						break;

				}
				returnArray.push(reqInputConditionProps.splice(_currentPropValidIndex, 1))
			}

			if (reqInputConditionProps.length > 0)
			{
				throw "Missing properties: " + reqInputConditionProps.toString();
				return;
			}


			return returnArray;			
		}
	}
	/*
		inputButtonConditionArray[i] = {
			"inputCodes": [array of input coes]
			"deviceType": "keyboard", "pad", or "mouse",
			"eventType": "up" or "down" - button is up or button is down, it's that simple.
			"nameLabel": string containing the name of the condition
		}
	*/
	function CreateInputButtonConditions(params)
	{
		var returnConditionArray = [];
		var paramsLength = params.length;

		for (iiInputCode = 0; iiInputCode < paramsLength; iiInputCode++)
		{
			var currentInputCodeObj = params[iiInputCode];
			_CheckInputButtonProps(currentInputCodeObj)
			var _reqProps = Object.keys(currentInputCodeObj)
			var _reqPropsLength = _reqProps.length;
			var _propCount = _reqPropsLength - 1;
			var newInputConditionObj = {};
			for (iiInputProp = 0; iiInputProp < _reqPropsLength; iiInputProp++)
			{	
				var currentProp = _reqProps[iiInputProp]

				newInputConditionObj[currentProp] = MakeCopyOfObject(currentInputCodeObj[currentProp])		
			}

			newInputConditionObj["conditionType"] = "input" + currentInputCodeObj["deviceType"] + "Button"
			_conditions[newInputConditionObj.nameLabel] = newInputConditionObj;
			returnConditionArray.push(newInputConditionObj)

		}

		function _CheckInputButtonProps(inputButtonConditionParams)
		{
			var _inputConditionKeys = Object.keys(inputButtonConditionParams);
			var _inputConditionKeyLength = _inputConditionKeys.length;
			var reqInputConditionProps = ['inputCodes','deviceType','eventType', 'nameLabel']
			var returnArray = [];

			for (iiProp = 0; iiProp < _inputConditionKeyLength; iiProp++)
			{
				var _currentPropString = _inputConditionKeys[iiProp];
				var _currentPropValidIndex = reqInputConditionProps.indexOf(_currentPropString);
				if (_currentPropValidIndex < 0)
				{
					throw "Invalid Property " + _currentProp;
					return;
				}
				var _currentProp = inputButtonConditionParams[_currentPropString]
				switch(_currentPropString)
				{
					case 'nameLabel':
						var conditionNameExist = DoesConditionNameExist(_currentProp);
						if (conditionNameExist == true)
						{
							throw "Condition Name " + _currentProp + " already exists."
							return;
						}
						else if(_currentProp == 'undefined')
						{
							throw "Condition name is invalid: " + _currentProp;
						}
						else if(_currentProp.length <= 0)
						{
							throw "Condition name must be more than 0 characters: " + _currentProp;
							return;
						}
						break;
					case 'deviceType':
						var validDeviceType = IsDeviceTypeValid(_currentProp);
						if (validDeviceType == false)
						{
							throw 'Invalid device type: ' + _currentProp;
							return;
						}
						break;
					case 'inputCodes':
						var _currentPropLength = _currentProp.length;
						if (_currentPropLength == 0)
						{
							throw "inputCodes must contain at least one input code"
							return;
						}
						break;
					case 'eventType':
						var validButtonEvents = ['up', 'down']
						var eventTypeIndex = validButtonEvents.indexOf(_currentProp);
						if (eventTypeIndex < 0)
						{
							throw "Invalid Button Event: " + _currentProp;
							return;
						}
						break;
					default:
						break;

				}
				var _collectedPropArray = reqInputConditionProps.splice(_currentPropValidIndex, 1)
				returnArray.push(_collectedPropArray[0])
			}

			if (reqInputConditionProps.length > 0)
			{
				throw "Missing properties: " + reqInputConditionProps.toString();
				return;
			}


			return returnArray;			
		}
		return returnConditionArray;
	}
	/*
	gameObjectsArray[i] = {
		"receivers": {
			"objectLibraries":[],
			"objectTypes":[],
			"objectLabels":[]
		},
		"propertyNames": [array of propertyNames of the gameObjects for comparison]
		"opreative": opreative for comparison (<, >, <=, >=, ==, !=)
		"conditionValue": the value you're comparing the gameObject's property to
		"nameLabel": string containing the name of the condition
		}
	*/
	function CreateGameObjectConditions(params)
	{
		var returnConditionArray = [];
		var paramsLength = params.length;
		for (iiGameObject = 0; iiGameObject < paramsLength; iiGameObject++)
		{
			var currentGameObject = params[iiGameObject];
			_CheckGameObjectProps(currentGameObject)
			var gameObjectKeys = Object.keys(currentGameObject);
			var gameObjectKeysLength = gameObjectKeys.length;

			var newGameObjConditionObj = {};
			var _propCount = gameObjectKeysLength - 1;

			for (iiInputProp = 0; iiInputProp < gameObjectKeysLength; iiInputProp++)
			{	
				var currentGameObjPropString = gameObjectKeys[iiInputProp];

				var currentProp = currentGameObject[currentGameObjPropString]
				newGameObjConditionObj[currentProp] = MakeCopyOfObject(currentGameObject[currentProp])

				if(iiInputProp == _propCount)
				{
					newGameObjConditionObj["conditionType"] = "gameobject"
					_conditions[newGameObjConditionObj.nameLabel] = newGameObjConditionObj;
					returnConditionArray.push(newGameObjConditionObj)
				}
			}
		
		}

		function _CheckGameObjectProps(inputCondition)
		{
			var _inputConditionKeys = Object.keys(inputCondition);
			var _inputConditionKeyLength = _inputConditionKeys.length;
			var reqGameObjConditionProps = ['receivers', 'propertyNames','operative','conditionValue', 'nameLabel']
			var returnObj = {};

			for (iiProp = 0; iiProp < _inputConditionKeyLength; iiProp++)
			{
				returnObj.gameObjConditionProps = []

				var _currentPropString = _inputConditionKeys[iiProp];

				var _currentPropValidIndex = reqGameObjConditionProps.indexOf(_currentPropString);
				if (_currentPropValidIndex < 0)
				{
					throw "Invalid Property " + _currentPropString;
					return;
				}
				else
				{
					var _currentProp = inputCondition[_currentPropString]
					switch(_currentPropString)
					{
						case "receivers":
							var recObjKeys = Object.keys(_currentProp)
							var recObjKeysLength = recObjKeys.length;
							var reqRecNames = ['objectLibraries', 'objectTypes', 'objectLabels']
							for (iiRecArray = 0; iiRecArray < recObjKeysLength; iiRecArray++)
							{
								var currentRecArrayString = recObjKeys[iiRecArray];
								var recArrayIndex = reqRecNames.indexOf(currentRecArrayString);
								if (recArrayIndex < 0)
								{
									throw "Invalid receiver " + currentRecArrayString;
									return;
								}
							}
							break;
						case "propertyNames":
							var propNameLength = _currentProp.length
							if (propNameLength == 0)
							{
								throw "Must include at least one property name: " + _currentProp.toString();
								return;
							}
							break;
						case "nameLabel":
							var conditionNameExist = DoesConditionNameExist(_currentProp);
							if (conditionNameExist == true)
							{
								throw "Condition Name " + _currentProp + " already exisits."
								return;
							}
							else if (_currentProp.length <= 0)
							{
								throw "Condition Name must be more than 0 characters: " + _currentProp;
								return;
							}
							break;
						case "operative":
							var isOpValid = IsOperativeValid(_currentProp)
							if (isOpValid == false)
							{
								throw "Operative is invalid: " + _currentProp;
								return;
							}
							break;
						default:
							break;
					}
					reqGameObjConditionProps.splice(_currentPropValidIndex, 1)

				}
			}

			if (reqGameObjConditionProps.length > 0)
			{
				throw "Missing properties: " + reqGameObjConditionProps.toString();
				return;
			}
		}

		return returnConditionArray;
	}
	function CreateActions(params)
	{

	}
	function CreateRules(params)
	{

	}
	function CreateStates(params)
	{

	}
	function GetConditionNames()
	{
		var currentConditionNames = Object.keys(_conditions);
		return currentConditionNames;
	}


}