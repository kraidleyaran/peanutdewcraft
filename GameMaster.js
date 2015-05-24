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
	this.CreateInputMoveConditions = CreateInputMoveConditions;

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
	function DoesActionNameExist(inputActionName)
	{
		var currentActionNames = GetActionNames();
		var actionNameIndex = currentActionNames.indexOf(inputActionName);
		var returnResult;
		if (actionNameIndex < 0)
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
		inputButtonConditionArray[i] = {
			"inputCodes": [array of input codes]
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

			newInputConditionObj["conditionType"] = "button"
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
				if (!_currentProp)
				{
					throw "Undefined is an invalid property value: " + _currentPropString;
					return;
				}

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
	inputMoveConditionParamsArray[i] = {
		"position":[array of x,y or z variables (pad has z variables for the squeeze triggers)]
			- When the deviceType is mouse, only 2 numbers can be passed in at max or an error will be thrown
			- When the device type is pad,  only 6 numbers can be passed in at max or an error will be thrown
		"deviceType": "pad" or "mouse",
		"nameLabel": string containing the name of the condition
	}
	*/
	function CreateInputMoveConditions(params)
	{
		var paramsLength = params.length;
		var returnConditionArray = [];

		for (iiMoveCondition = 0; iiMoveCondition < paramsLength; iiMoveCondition++)
		{
			var currentMoveCondition = params[iiMoveCondition];
			_CheckInputMoveCondition(currentMoveCondition);
			var moveConditionKeys = Object.keys(currentMoveCondition);
			var moveConditionKeyLength = moveConditionKeys.length;
			var newMoveCondition = {};

			for (iiMoveConditionKey = 0; iiMoveConditionKey < moveConditionKeyLength; iiMoveConditionKey++)
			{
				var moveConditionPropName = moveConditionKeys[iiMoveConditionKey];
				var moveConditionProp = currentMoveCondition[moveConditionPropName];
				newMoveCondition[moveConditionPropName] = MakeCopyOfObject(moveConditionProp);
			}
			newMoveCondition['conditionType'] = 'move'
			_conditions[newMoveCondition.nameLabel] = newMoveCondition;
			returnConditionArray.push(newMoveCondition);

		}

		function _CheckInputMoveCondition(inputCondition)
		{
			var inputConditionKeys = Object.keys(inputCondition);
			var conditionKeyLength = inputConditionKeys.length;
			var _knownMoveDeviceTypes = ['pad', 'mouse']
			var _knownInputMoveProps = ['position', 'deviceType', 'nameLabel'];
			var knownMovePropLength = _knownInputMoveProps.length;
			for (iiMoveProp = 0; iiMoveProp < knownMovePropLength; iiMoveProp++)
			{
				var _currentKnownPropName = _knownInputMoveProps[iiMoveProp]
				var _knownPropIndex = inputConditionKeys.indexOf(_currentKnownPropName)
				if (_knownPropIndex < 0)
				{
					throw "Missing Input Move Condition property: " + _currentKnownPropName;
					return;
				}
			}

			for (iiConditionKey = 0; iiConditionKey < conditionKeyLength; iiConditionKey++)
			{
				var currentPropName = inputConditionKeys[iiConditionKey];
				switch (currentPropName)
				{
					case 'position':
						switch(inputCondition.deviceType)
						{
							case 'pad':
								var padPositionArrayLength = inputCondition[currentPropName].length;
								if (padPositionArrayLength < 0 || padPositionArrayLength > 6)
								{
									throw "Invalid Pad Position Array Length: " + padPositionArrayLength;
									return;
								}
								break;
							case 'mouse':
								var mousePositionArrayLength = inputCondition[currentPropName].length;
								if (mousePositionArrayLength < 0 || mousePositionArrayLength > 2)
								{
									throw "Invalid Mouse Position Array Lenth: " + mousePositionArrayLength;
									return;
								}
								break;
							default:
								throw "Invalid deviceType for position: " + inputCondition.deviceType;
								return;
								break;
						}
					case 'deviceType':
						var currentDeviceType = inputCondition.deviceType
						var deviceTypeIndex = _knownMoveDeviceTypes.indexOf(currentDeviceType);
						if (deviceTypeIndex < 0)
						{
							throw "Invalid deviceType: " + currentDeviceType;
							return;
						}
						break;
					case 'nameLabel':
						var currentNameLabel = inputCondition.nameLabel
						var nameLabelExist = DoesConditionNameExist(currentNameLabel)
						if (nameLabelExist == true)
						{
							throw "nameLabel already exists: " + currentNameLabel;
							return;
						}
						break;
					default:
						throw "Invalid Input Move Condition Property: " + inputCondition;
						break;
				}
			}
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
	/*
		gameObjectActionParamsArray[i] = {
			objectArray:{
				objectType:[],
				libraryType:[],
				objectLabel:[]
  				conditionObjects: boolean indicating true or false for including objects from the conditions this action is attached to in a given rule
			},
			propertyName: name of property action is being taken one
			operative: "add", "set", or "subtract"
			propertValue: value which the property will be used to operate on the property value
			nameLabel: name of the action
			
		}
	*/
	function CreateGameObjectActions(params)
	{
		var returnActionArray = [];
		var paramsLength = params.length;

		for (iiGameObjectAction = 0; iiGameObjectAction < paramsLength; iiGameObjectAction++)
		{
			var currentGameObjectAction = params[iiGameObjectAction];
			_ChecktGameObjectAction(currentGameObjectAction);

			var newGameObjectAction = MakeCopyOfObject(currentGameObjectAction);

			newGameObjectAction['actionType'] = 'gameObject'
			_actions[newGameObjectAction.nameLabel] = newGameObjectAction;
			returnActionArray.push(newGameObjectAction);
		}

		function _ChecktGameObjectAction(inputGameObjectAction)
		{
			var keysOfAction = Object.keys(inputGameObjectAction)
			var keysLength = keysOfAction.length;
			for (iiKey = 0; iiKey < keysLength; iiKey++)
			{
				var currentKeyName = keysOfAction[iiKey];
				var currentKey = inputGameObjectAction[currentKeyName];
				switch (currentKeyName)
				{
					case 'objectArray':
						var objectArrayKeys = Object.keys(currentKey)
						var objectArrayKeysLength = objectArrayKeys.length;
						for (iiObjectArrayKey = 0; iiObjectArrayKey < objectArrayKeysLength; iiObjectArrayKey)
						{
							var currentObjArrayKeyName = objectArrayKeys[iiObjectArrayKey];
							var currentObjArrayKey = currentKey[currentObjArrayKeyName];
							switch (currentObjArrayKeyName)
							{
								case 'conditionObjects':
									var isBoolean = typeof currentObjArrayKey;
									if (isBoolean != 'boolean')
									{
										throw "Invalid conditionObjects property"
										return;
									}
									break;
								case 'objectType':
									break;
								case 'libraryType':
									break;
								case 'objectLabel':
									break;
								default:
									throw "Invalid objetArray property: " + currentObjArrayKeyName;
									return;
									break;
							}
						}
						break;
					case 'propertyName':
						break;
					case 'operative':
						var _validOperatives = ['add','subtract','set']
						var validOperativeKeyIndex = _validOperatives.indexOf(currentKey)
						if (validOperativeKeyIndex < 0)
						{
							throw "Invalid operative: " + currentKey;
							return;
						}
						break;
					case 'propertyValue':
						break;
					case 'nameLabel':
						var nameLabelExist = DoesActionNameExist(currentKey);
						if (nameLabelExist == true)
						{
							throw "Action name " + currentKey + " already exists."
							return;
						}
						break;
				}
			}
		}
		return returnActionArray;
	}
	/*
		gameLibaryActionParams[i] = {
			inputObjects:{
				objectType:[],
				libraryType:[], (yes, you can add other librarie's objects into other libraries via a game action)
				objectLabel:[],
				conditionObjects: boolean indicating whether or not to include the gameObjects from the condition(s) attached to the same game rule the action is attached to.
			}
			libraryNames:[] array of libraries that will be affected
			operative: 'add' or 'remove' (you can only add objects to a library or remove them from that library)
		}
	*/
	function CreateGameLibraryAction(params)
	{
		var returnActionArray = [];
		var paramsLength = params.length;
		for (iiGameLibAction = 0; iiGameLibAction < paramsLength; iiGameLibAction++)
		{
			var currentGameLibAction = params[iiGameLibAction];

		}

		function _CheckGameLibraryAction(inputGameLibAction)
		{
			var libActionKeys = Object.keys(inputGameLibAction);
			var libActionKeysLength = libActionKeys.length;
			for (iiLibActionProp = 0; iiLibActionProp < libActionKeysLength; iiLibActionProp++)
			{
				var currentLibActionPropName = libActionKeys[iiLibActionProp];
				var currentLibActionProp = inputGameLibAction[currentLibActionPropName];
				switch(currentLibActionPropName)
				{

				}
			}
		}
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
	function GetActionNames()
	{
		var currentActionNames = Object.keys(_actions)
		return currentActionNames;
	}


}