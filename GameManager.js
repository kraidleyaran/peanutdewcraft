function GameManager(){

	var _gameObjectProtos = {};

	Object.defineProperty(_gameObjectProtos, 'orphan', {
		'value': null,
		'writable': false
	})
	

	var _gameObserver = null;

	var theGameManager = this;

	this.SetGameObserver = SetGameObserver;

	var _myOwnDamneGameManager = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own GameManager instead of mine. Good luck with that."

	
	this.CreateGameObject = CreateGameObject;

	this.CreateGameObjectType = CreateGameObjectType;
	this.SetGameObjectType = SetGameObjectType;
	this.RemoveGameObjectType = RemoveGameObjectType; 
	this.GetGameObjectTypes = GetGameObjectTypes;

	this.CreateProtoFromExisting = CreateProtoFromExisting;
	this.GetGameObjectProtos = GetGameObjectProtos;

	this.IsGameManagerValid = IsGameManagerValid;

	this.CloneGameObject = CloneGameObject;

	this.DoesGameObjectTypeExist = DoesGameObjectTypeExist;

	theGameManager.GetValidDataTypes = GetValidDataTypes;

	var _objTypes = ['string','number','boolean','array','object','function', 'null']

	function GetValidDataTypes()
	{
		return _objTypes;
	}

	function IsAllowedType(inputTypeString) 
	{
		var response = {};
		if (!inputTypeString || inputTypeString == null)
		{
			throw "inputType string is undefined or null" + "\n\r" + "inputTypeString = " + inputTypeString;
		}
		
		var isStringInArray = _objTypes.indexOf(inputTypeString)
		if (isStringInArray < 0)
		{
			response = false;
		}
		else
		{
			response = true;
		}

		return response;
	}
	/*When creating a new GameObject type, you must include the following in objParams:
		objsParams.typeName = the prototypes gameObject type. This is used to group objects together for updating or broadcasting changes.
		objsParams.props[] = an array with objects that contain the following two properties: (where i = property name)
			props[i].required = a boolean indicating whether or not the property in question will be required for an object when making new instances of it 
			props[i].dataValue = one of the _objTypes listed above as a private variable. Ctrl+F that shit.

			example:
				var newPropName = 'health'
				var objParams = {
					'typeName': 'gameObject prototype name'
					'props': []
				}
			
				props[0] = {
					'propsName' = name of property
					'required' = boolean indicating whether or not the object is required
					'dataValue' = type of data the property will be set to
					'defaultPropValue' = the default value that will be set if nothing is sent during creation. This does not affect properties that are 'required.'
				}
				


		Please note that an object cannot contain typename or any variation there of as a property name unless another word is before, between, or after type and name. That includes any symbol attached to typeName
		*/
	function CreateGameObjectType(objParamArray)
	{
		var returnObjTypeNames = [];
		for (iiObjParam = 0; iiObjParam < objParamArray.length; iiObjParam++)
		{
			var objParams = objParamArray[iiObjParam]
			var paramsTypeName = objParams.typeName;
			if (!paramsTypeName || paramsTypeName.length == 0)
			{
				throw "Invalid typeName " + paramsTypeName;
				return;
			}
			var doesObjTypeExist = DoesGameObjectTypeExist(paramsTypeName);

			var newObjProtoType = {};
			if (doesObjTypeExist == false)
			{
				function newObjectProto ()
				{
					var _protoObjs = _gameObjectProtos;
					var _protoGameManager = theGameManager;
					var _typeName;
					var _props = {}

					this.GetProps = function()
					{
						return _props;
					}
					this.AddProps = function(propArray)
					{
						for (iiPropItem = 0; iiPropItem < propArray.length; iiPropItem++)
						{
							var checkTypeNameString = "typeName"
							var cleanTypeNameString = purifyString(checkTypeNameString);

							var currentProp = propArray[iiPropItem];

							var cleanPropNameString = purifyString(currentProp.propName);
							var isDataValueValid = IsAllowedType(currentProp.dataValue);

							var doesPropExist = _props.hasOwnProperty(currentProp.propName);

							if (cleanPropNameString == cleanTypeNameString)
							{
								throw "Cannot name proprety typeName or any variation thereof"
								return;
							}
							else if (isDataValueValid == false)
							{
								throw currentProp.dataValue + " is an invalid data type " + "\n\r" + "The following data types are valid: " + GetValidDataTypes().toString();
								return;
							}
							else if (doesPropExist == true)
							{
								throw currentProp.propName + " property already exists in prototype " + _typeName;
								return;
							}
							else
							{
								_props[currentProp.propName] = {
									'dataValue': currentProp.dataValue,
									'defaultPropValue': currentProp.defaultPropValue,
									'required': currentProp.required
								}
							}							
						}
					}
					this.SetProps = function(propArray)
					{	
						for (iiPropItem = 0; iiPropItem < propArray.length; iiPropItem++)
						{
							var checkTypeNameString = "typeName"
							var cleanTypeNameString = purifyString(checkTypeNameString);

							var currentProp = propArray[iiPropItem];

							var cleanPropNameString = purifyString(currentProp.propName);
							var isDataValueValid = IsAllowedType(currentProp.dataValue);

							if (cleanPropNameString == checkTypeNameString)
							{
								throw "Cannot name proprety typeName or any variation thereof"
								return;
							}
							else if (isDataValueValid == false)
							{
								throw currentProp.dataValue + " is an invalid data type " + "\n\r" + "The following data types are valid: " + GetValidDataTypes().toString();
								return;
							}
							else
							{
								_props[currentProp.propName] = {
									'dataValue': currentProp.dataValue,
									'defaultPropValue': currentProp.defaultPropValue,
									'required': currentProp.required
								}
							}							
						}
					}
					this.GetTypeName = function()
					{
						return _typeName;
					}
					this.SetTypeName = function(inputTypeNameString)
					{
						var _typeNameExist = _protoGameManager.DoesGameObjectTypeExist(paramsTypeName)
						if (_typeNameExist == false)
						{
							var currentTypeName = _typeName;
							_protoObjs[currentTypeName] = null,

							_typeName = inputTypeNameString;
							_protoObjs[inputTypeNameString] = this;
						}
						else if (!inputTypeNameString || inputTypeNameString.length == 0)
						{
							throw "Invalid typeName " + inputTypeNameString;
							return;
						}
						else
						{
							throw "gameObject typeName already exists: " + paramsTypeName;
							return;
						}
						
					}


					this.SetTypeName(objParams.typeName);
					this.AddProps(objParams.props);

				}
				var newObjProto = new newObjectProto();
				_gameObjectProtos[paramsTypeName] = newObjProto;
				returnObjTypeNames.push(paramsTypeName)
			}
			else
			{
				throw "gameObject typeName already exists: " + paramsTypeName;
				return;
			}	
		}

		return returnObjTypeNames;
	}
			
	/*
	   currentInput = {
			typeName: gameObject type name (string)
			modelProto: name of the prototype that already exists (string)
			props: []
			}
		currentInput.props[0] = {
			'propName' = name of property (string)
			'required' = boolean indicating whether or not the object is required (boolean)
			'dataValue' = type of data the property will be set to (string)
			'defaultPropValue' = the default value that will be set if nothing is sent during creation. This does not affect properties that are 'required.' (valid data type)
		}
			
	*/
	function CreateProtoFromExisting(inputArray)
	{
		var returnStringArray = [];
		for (iiInput = 0; iiInput < inputArray.length; iiInput++)
		{
			var currentInput = inputArray[iiInput];
			var doesTypeExist = DoesGameObjectTypeExist(currentInput.typeName)
			if (doesTypeExist == true)
			{
				throw "gameObject typeName " + currentInput.typeName + " already exists"
				return;
			}

			var modelPrototype = _gameObjectProtos[currentInput.modelProto]

			var modelProto_props = modelPrototype.GetProps();

			var modelProtoProps_Strings = Object.keys(modelProto_props)

			var modelProtoProps_Array = []

			for (iiProp = 0; iiProp < modelProtoProps_Strings.length; iiProp++)
			{
				var currentModelProp = modelProto_props[modelProtoProps_Strings[iiProp]]
				currentModelProp.propName = modelProtoProps_Strings[iiProp]

				modelProtoProps_Array.push(currentModelProp)
			}

			var _newProtoInputModel = {
				'typeName': currentInput.typeName,
				'props': modelProtoProps_Array
			}

			var _inputArray = []
			_inputArray.push(_newProtoInputModel)

			var _tempStringArray = CreateGameObjectType(_inputArray)

			var newProto = _gameObjectProtos[_tempStringArray[0]]

			newProto.SetProps(currentInput.props);
			returnStringArray.push(newProto.GetTypeName());
		}

		return returnStringArray;
	}

	function DoesGameObjectTypeExist(inputObjType)
	{
		var response;
		var objTypeVar = _gameObjectProtos[inputObjType]
		if (objTypeVar != null || objTypeVar != undefined)
		{
			response = true
		}
		else
		{
			response = false;
		}
		return response;

	}
	/*
		inputParams.typeName
		inputParams.props = []
		inputParams.props[0] = {
			'propName': 'new proprety'
			'propValue': 'prop value'
		}

	When creating a gameObject, it can be given a label which can either uniquley identify IT, or be able identify another group in the observer that is not a gameLibrary or gameObject.
	*/
	function CreateGameObject(inputParamArray)
	{
		var returnObjArray = [];
		for (iiInputParam = 0; iiInputParam < inputParamArray.length; iiInputParam++)
		{
			var inputParams = inputParamArray[iiInputParam];

			var newObjProtoType;
			if (!inputParams.typeName || inputParams.typeName == null)
			{
				throw "Parameter for typeName must be valid";
			}
			var doesGameObjTypeExist = DoesGameObjectTypeExist(inputParams.typeName);

			if (doesGameObjTypeExist == true) 
			{
				
				function NewGameObject()
				{
					var props = {}
					var that = this;
					var objectLabel = inputParams.objectLabel || null;
					var _typeName = inputParams.typeName;
					var _currentLib = null

					var _gameManager = theGameManager;

					this.currentLib = GetLibrary();
					this.SetLibrary = SetLibrary;

					this.typeName = GetType();
					this.SetType = SetType;


					this.Receive = Receive;

					//var _gjGameObserver = null;
					this.SetProperty = SetProperty;
					this.GetProperty = GetProperty;
					this.DoesPropExist = DoesPropExist;

					this.DeleteProperty = DeleteProp;
					this.AddProperty = AddProp;


					this.GetType = GetType;

					this.GetAllProperties = GetAllProperties;

					this.GetLabel = GetLabel;
					this.SetLabel = SetLabel;

					var inputParamsProps = inputParams.props			

					var currentProto = _gameObjectProtos[inputParams.typeName]

					var protoProps = currentProto.GetProps();

					this.objectProto = GetObjectProto();
					//this.SetObjectProto = SetObjectProto;

					var _addPropsArray = []

					for (iiProp = 0; iiProp < inputParamsProps.length; iiProp++)
					{
						var currentParamPropObj = inputParamsProps[iiProp];
						var propExistInProto = DoesPropExistInProto(currentParamPropObj.propName, inputParams.typeName)
						var propExistInProps = DoesPropExist(currentParamPropObj.propName)
						if (propExistInProto == true && propExistInProps == false)
						{
							
							var protoPropType = protoProps[currentParamPropObj.propName].dataValue;
							var currentPropType = typeof currentParamPropObj.propValue;

							if (protoPropType == currentPropType)
							{
								//props[currentParamPropObj.propName] = currentParamPropObj.propValue
								_addPropsArray.push(currentParamPropObj)
							}
							else
							{
								throw protoPropType + " and " + currentPropType + " are not equal types.";
								return;
							}
							
						}
						
						else if (propExistInProto == false)
						{
							throw currentParamPropObj.propName + " does not exist in GameObject Type " + inputParams.typeName;
							return 
						}
						else if (propExistInProps == true)
						{
							throw currentParamPropObj.propName + " already exists in input gameObject. Check property names and try again."
							return;
						}

					}

					AddProp(_addPropsArray);

					function MissingProps()
					{
						var returnArray = [];
						var _propsInProto = Object.keys(protoProps)

						for (iiProtoProp = 0; iiProtoProp < _propsInProto.length; iiProtoProp++)
						{
							var _currentProtoPropString = _propsInProto[iiProtoProp]
							var _currentProtoProp = protoProps[_currentProtoPropString]

							var _doesCurrentPropExistInInput = props.hasOwnProperty(_currentProtoPropString)

							if (_doesCurrentPropExistInInput == false && _currentProtoProp.required == true && _currentProtoProp != 'typeName')
							{
								returnArray.push(_currentProtoPropString)
							}
						}

						return returnArray;
					}

					var missingProps = MissingProps();
					
					if (missingProps.length > 0)
					{
						var missingPropsString = missingProps.toString();
						throw "missing the following required properties: " + missingPropsString;
						newObjProtoType = missingPropsString;
						return;
					}


					function SetLabel(inputLabelString)
					{
						objectLabel = inputLabelString
					}

					function GetLabel()
					{
						var response = objectLabel;
						return response;
					}

					function SetProperty(inputProp, inputKeyValue)
					{
						var doesCurrentPropExist = DoesPropExist(inputProp)

						if (doesCurrentPropExist == true)
						{
							props[inputProp] = inputKeyValue;
						}
						else
						{
							throw "Property " + inputProp + " does not exist in object " + props;
						}
					}

					function GetProperty(inputProp)
					{
						var doesCurrentPropExist = DoesPropExist(inputProp)

						var response;

						if (doesCurrentPropExist == true)
						{
							response = props[inputProp];
						}
						else
						{
							throw "Property " + inputProp + " does not exist in object"
						}

						return response;
					}
					function DoesPropExist(inputPropString)
					{
						var response = props.hasOwnProperty(inputPropString)
						return response;
					}

					function GetType()
					{
						var response = _typeName;
						return response;
					}
					function SetType(newTypeNameString)
					{
						var typeNameExist = _gameManager.DoesGameObjectTypeExist(newTypeNameString)
						if (typeNameExist == true)
						{
							_typeName = newTypeNameString	
						}
						else
						{
							throw "typeName " + newTypeNameString + " is not an exisiting gameObject prototype typeName."
							return;
						}
					}
					function GetLibrary()
					{
						var response = _currentLib;
						return response;
					}

					function SetLibrary(libNameString)
					{
						_currnetLib = libNameString
					}

					function AddProp (inputPropArray)
					{
						for (iiNewProp = 0; iiNewProp < inputPropArray.length; iiNewProp++)
						{
							var currentPropObj = inputPropArray[iiNewProp];

							var currentPropName = currentPropObj.propName;

							var doesPropExist = DoesPropExist(currentPropName)

							if (doesPropExist == false)
							{
								props[currentPropName] = currentPropObj.propValue;
							}
							else
							{
								throw currentPropName + " already exists in object " + that;
							}
						}
						
					}

					function DeleteProp(inputPropString)
					{
						var doesPropExist = DoesPropExist(inputPropString)

						if (doesPropExist == true)
						{
							delete props[inputPropString]
						}
						else
						{
							throw inputPropString + "does not exist in gameObject " + that;
						}
					}

					function GetAllProperties()
					{
						var __response;
						__response = props;

						return __response;
					}


					function DoesPropExistInProto(inputPropString, objTypeString)
					{
						var response = {}

						var cleaninputPropString = purifyString(inputPropString);
						var cleanObjTypeString = purifyString(objTypeString);

						var doesObjTypeExist = DoesGameObjectTypeExist(objTypeString)
						if (doesObjTypeExist == true)
						{
							var objProto  = _gameObjectProtos[objTypeString]
							var objProtoProps = Object.keys(objProto.GetProps())

							var propIndex = objProtoProps.indexOf(inputPropString)

							if (propIndex < 0)
							{
								response = false;

							}
							else
							{
								response = true;
							}
						}
						
						return response;
					}

					function SetGameObserver(inputGameObserver)
					{
						if (!_gjGameObserver)
						{
							_gjGameObserver = inputGameObserver
						}
						else
						{
							throw "Game Observer already exists on GameObject"
						}
					}

					function GetObjectProto()
					{
						return currentProto;
					}

					function SetObjectProto(newObjectProto)
					{
						if(!newObjectProto)
						{
							throw "Invalid Input Object proto"
							return;
						}
						currentProto = newObjectProto;
					}
					/*
							message.commandValue
							message.command
							message.peer
							message.propertyName;
					*/
					function Receive(messageArray)
					{
						for (iiMessage = 0; iiMessage < messageArray.length; iiMessage++)
						{
							var currentMessage = messageArray[iiMessage];
							var currentPropName = currentMessage.propertyName;
							var currentValue = currentMessage.commandValue;
							var currentCommand = currentMessage.command;
							var currentPeer = currentMessage.peer;
							if (!currentPeer || currentPeer != 'property' && currentPeer != 'value')
							{
								throw 'Peer is invalid.'
								return;
							}
							if (!currentPropName)
							{
								throw 'No propertyName in message'
								return;
							}
							if (!currentCommand)
							{
								throw 'No currentCommand in message'
								return;
							}
							var doesInputPropExist = DoesPropExist(currentPropName)

							switch (currentCommand)
							{
								case 'add':
									switch (currentPeer)
									{
										case 'property':
											if (doesInputPropExist == false)
											{
												var newObjProp = {
													'propName':currentPropName,
													'propValue': currentValue
												}
												that.AddProperty([newObjProp])	
											}
											break;
										case 'value':
											if (doesInputPropExist == true)
											{
												props[currentPropName] += currentValue;	
											}
											break;
										default:
											break;
									}
									break;
								case 'set':
									if (doesInputPropExist == true)
									{
										that.SetProperty(currentPropName, currentValue)	
									}
									break;
								case 'execute':
									if (doesInputPropExist == true)
									{
										var objProp = props[currentPropName]
										objProp(currentValue);	
									}
									break;
								case 'remove':
									if (currentPeer != 'property')
									{
										that.SetProperty(currentPropName, null)
									}
									else if(doesInputPropExist == true)
									{
										DeleteProp(currentPropName)
									}
									break;
								default:
									break;
								}
							}
						}
						return this;
					}
					var newGameObject = new NewGameObject();
					
					NewGameObject.prototype.SetProperty = function(inputProp, inputKeyValue)
					{
						this.SetProperty(inputProp, inputKeyValue);
					}
					NewGameObject.prototype.GetProperty = function(inputProp)
					{
						var response = this.GetProperty(inputProp);
						return response;
					}
					NewGameObject.prototype.DoesPropExist = function(inputPropString)
					{
						var response = this.DoesPropExist(inputPropString);
						return respsonse;
					}
					NewGameObject.prototype.GetType = function()
					{
						var response = this.GetType();
						return response;
					}
					NewGameObject.prototype.DeleteProperty = function(inputPropString)
					{
						var response = this.DeleteProp(inputPropString);
						return response;
					}
					NewGameObject.prototype.GetAllProperties = function()
					{
						var response = this.GetAllProperties();
						return response;
					}
					
					newObjProtoType = newGameObject;
					returnObjArray.push(newGameObject);
				}
				else
				{
					var _objectTypes = Object.keys(_gameObjectProtos);
					throw "gameObject type " + inputParams.typeName + " does not exist in prototype list " + _objectTypes;
				}
		}
		return returnObjArray;	
	}

	function RemoveGameObjectType(objTypeString)
	{
		var cleanInputTypeString = objTypeString
		var doesObjExist = DoesGameObjectTypeExist(objTypeString)

		if (doesObjExist == true)
		{
			_gameObjectProtos[objTypeString] = null;
		}
		else
		{
			throw objTypeString + 'does not exist'
			return;
		}
	}
	/*
		inputParams.typeName = 'gameObject type name as listed in _gameObjectProtos'
		inputParams.props = [] <-- array for objects which contain:
			inputParams.props[0] = {
				'propName':'name of property on gameObject',
				'dataValue': 
				'defaultPropValue': the value that will be set for all objects, otherwise they will be set to 'null'
				'required': a boolean that indicates whether or not the property is required for gameObjects created from this proto
			}
	*/
	function SetGameObjectType(inputParams)
	{
		var doesObjTypeExist = DoesGameObjectTypeExist(inputParams.typName)

		var returnTypeSet = false;

		if (doesObjTypeExist == true)
		{
			if(!inputParams.typeName)
			{
				throw 'typeName parameter required'
				return;
			}
			else
			{
				var currentObjProto = _gameObjectProtos[inputParams.typeName]

				for (ii = 0; ii < inputParams.props.length; ii++)
				{
					var inputObjProp = inputParams.props[ii];
					var cleanTypeNameString = 'typename'
					var cleanObjPropName = purifyString(inputObjProp.propName);
					var propIntegrity = CheckPropObjIntegrity(inputObjProp);
					if (propIntegrity == false)
					{
						throw 'Invalid Property parameter'
						return;
					}
					else if (cleanTypeNameString -= cleanObjPropName)
					{
						throw "Cannot set property to typeName or any variation thereof"
					}
					else
					{
						currentObjProto[inputObjProp.propName] = {
							'dataValue': inputObjProp.dataValue,
							'defaultPropValue': inputObjProp.defaultPropValue,
							'required': inputObjProp.required
						}	
					}
				}
				returnTypeSet = true;		
			}
		}
		else
		{
			throw inputParams.typeName + "is not a current gameObject type"
		}

		return returnTypeSet;

		function CheckPropObjIntegrity(inputObjProp)
		{
			var returnValue = false;

			var inputObjPropKeys = Object.keys(inputObjProp);

			var dataValueIndex = inputObjPropKeys.indexOf('dataValue');
			var defaultPropValueIndex = inputObjPropKeys.indexOf('defaultPropValue');
			var requiredIndex = inputObjPropKeys.indexOf('required')

			if (dataValueIndex < 0 )
			{
				throw "Missing 'dataValue' property";
				return;
			}
			else if (defaultPropValueIndex < 0)
			{
				throw "Missing 'defaultPropValue' property";
				return;
			}
			else if (requiredIndex < 0)
			{
				throw "Missing 'required' preoperty";
				return;
			}
			else
			{
				returnValue = true;
			}

			return returnValue;

		}
	}

	/*
		options object has the following properties:

		var optionObject = {
			objectLabels = []
			howMany = 1
		}

		objectLabels is an array of strings containing object label names. As you can see, if a label is not provided, it uses the label of the object that is being cloned

		howMany is a number indicating how many objects you want. It must be at least 1 or else nothing will be returned.

		CloneGameObject returns an array filled with the new cloned objects.
	*/

	function CloneGameObject(inputGameObject, options)
	{
		var getPropsType = typeof inputGameObject.GetAllProperties;
		var objProps = {};
		if (getPropsType != 'function')
		{
			throw "Invalid inputGameObject properties. Expected function, received " + getPropsType;
			return;
		}
		else
		{
			objProps = inputGameObject.GetAllProperties();
		}
		var objPropStrings = Object.keys(objProps)

		var _options;

		if (!options)
		{
			_options = {
				'howMany': 1,
				'objectLabels': []
			};
		}
		else if (!options.howMany && !options.objectLabels)
		{
			_options = {
				'howMany': 1,
				'objectLabels': []
			}

		}
		else if (!options.howMany)
		{
			_options = options;
		 	_options.howMany = 1;

		}

		else if (!options.objectLabels)
		{
			_options = options;
			_options.objectLabels = [];
		}
		else
		{
			_options = options;
		}

		var objParamsArray = [];

		for (iiObject = 0; iiObject < _options.howMany; iiObject++)
		{
			var newObjLabel;
			var newObjProps = [];
			var testCount = iiObject;

			for (iiProp = 0; iiProp < objPropStrings.length; iiProp++)
			{
				newObjProps[iiProp] = {
					'propName': objPropStrings[iiProp],
					'propValue': objProps[objPropStrings[iiProp]]
				}
			}

			if (_options.objectLabels[iiObject])
			{
				newObjLabel = _options.objectLabels[iiObject];
			}
			else
			{
				newObjLabel = inputGameObject.GetLabel();
			}

			var newGameObject_params = {
				'typeName': inputGameObject.typeName,
				'objectLabel': newObjLabel,
				'props': newObjProps
			}
			objParamsArray.push(newGameObject_params)
		}

		var returnArray = CreateGameObject(objParamsArray)
		return returnArray;
	}

	function GetGameObjectTypes()
	{
		var response;

		var objTypes = Object.keys(_gameObjectProtos)
		if (objTypes.length > 0 )
		{
			response = objTypes;
		}
		else
		{
			response = null;
		}

		return response;

	}

	function GetGameObjectProtos()
	{
		var response;
		var objTypes = Object.keys(_gameObjectProtos)

		if (objTypes.length > 0 )
		{
			response = _gameObjectProtos;
		}
		else
		{
			response = null;
		}
		return response;
	}

	function IsGameManagerValid(inputCheckString)
	{
		var response;
		if (inputCheckString != _myOwnDamneGameManager)
		{
			response = false;
		}
		else
		{
			response = true;
		}

		return response;
	}

	function SetGameObserver(gameObserver)
	{
		if (!_gameObserver)
		{
			_gameObserver = gameObserver
		}
		else
		{
			throw "GameObserver has already been set"
		}
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
GameManager.prototype.GetGameObjectTypes = function ()
{
	var response = this.GetGameObjectTypes();
	return response;
}
GameManager.prototype.GetGameObjectProtos = function()
{
	var response = this.GetGameObjectProtos();
	return response;
}
GameManager.prototype.IsGameManagerValid = function(inputCheckString)
{
	var response = this.IsGameManagerValid(inputCheckString);
	return response;
}
GameManager.prototype.SetGameObserver = function(gameObserver)
{
	this.SetGameObserver(gameObserver);
}
GameManager.prototype.CloneGameObject = function(inputGameObject, options)
{
	var response = this.CloneGameObject(inputGameObject, options)
	return response;
}


function purifyString(inputString)
{
	inputString = inputString.replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}