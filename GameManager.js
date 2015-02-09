function GameManager(){

	//var _gameObjectTypes = {};
	var _gameObjectProtos = {};
	
	//these were used for storing Object protos efficiently, but I found a better way using associate arrays aka actual objects.
	//var _gameObjectId = 0;
	//var _gameEmptyIndex = new Array();

	var _gameObserver = null;

	var theGameManager = this;

	this.SetGameObserver = SetGameObserver;

	var _myOwnDamneGameManager = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own GameManager instead of mine. Good luck with that."

	
	this.CreateGameObject = CreateGameObject;

	this.CreateGameObjectType = CreateGameObjectType;
	this.SetGameObjectType = SetGameObjectType; //needs GameObserver update
	this.RemoveGameObjectType = RemoveGameObjectType; //needs GameObserver update
	this.GetGameObjectTypes = GetGameObjectTypes;

	this.CreateProtoFromExisting = CreateProtoFromExisting;
	this.GetGameObjectProtos = GetGameObjectProtos;

	this.IsGameManagerValid = IsGameManagerValid;

	this.CloneGameObject = CloneGameObject;

	this.DoesGameObjectTypeExist = DoesGameObjectTypeExist;

	var _objTypes = ['string','number','boolean','array','object','function']

	this.GetValidDataTypes = function ()
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
			response.bool = false;
		}
		else
		{
			response.bool = true;
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

			var newObjProtoType = {};

			if (!paramsTypeName || paramsTypeName == null)
			{
				throw "Object Parameters requires valid type name" + "\n\r" + "objParams.typeName = " + paramsTypeName;
			}
			
			var doesObjTypeExist = DoesGameObjectTypeExist(paramsTypeName);

			if (doesObjTypeExist == false)
			{
				var cleanParamsTypeName = purifyString(paramsTypeName);

				newObjProtoType.typeName = paramsTypeName;
				
				var objPropKeys = Object.keys(objParams.props)

				var checkTypeNameString = "typeName"
				var cleanTypeNameString = purifyString(checkTypeNameString);

				for (iiProp = 0; iiProp < objPropKeys.length; iiProp++)
				{
					var currentInputProp = objParams.props[iiProp]

					var currentObjPropString = currentInputProp.propName;

					var _currentPropExist = newObjProtoType.hasOwnProperty(currentObjPropString)

					if (_currentPropExist == true)
					{
						throw "Property " + currentObjPropString + " already exists in prototype. Check input object for same property names."
						return;
					}
					var cleanObjPropName = purifyString(currentObjPropString);
					// the following is done so in order to prevent any sort of property naming shenanigans do not include the typeName. I throw you the warning letting you know you're a dumbass and to try again
					if (cleanObjPropName == cleanTypeNameString)
					{
						throw "Cannot name property typeName (regardless of capitalization or trickery). Make sure if you're setting the type name in the params.props variable to set it in params.typeName"
					}
					else
					{
						var currentPropDataValue = currentInputProp.dataValue;
						var isKeyTypeValid = IsAllowedType(currentPropDataValue);
						if(isKeyTypeValid.bool == true)
						{
							newObjProtoType[currentObjPropString] = {};
							newObjProtoType[currentObjPropString].required = currentInputProp.required
							newObjProtoType[currentObjPropString].dataValue = currentPropDataValue
							newObjProtoType[currentObjPropString].defaultPropValue = currentInputProp.defaultPropValue;
						}
						else
						{
							throw currentPropDataValue + " is not a valid data type n00b. Try again. " + "\n\r" + _objTypes
						}
						
					}

				}
			}
			else
			{
				throw "gameObject Type " + paramsTypeName + " already exists"
			}

			_gameObjectProtos[paramsTypeName] = newObjProtoType;
			returnObjTypeNames.push(paramsTypeName);
		}
		return returnObjTypeNames;
	}
		

		
	/*

		inputParamsNewProto.typeName
		inputParamsNewProto.props = []
		inputParamsNewProto.props[0] = {
			'propName' = 'object property name'
			'required' = true
			'dataValue' = type of data the property will be set to
			'defaultPropValue' = the default value that will be set if nothing is sent during creation. This does not affect properties that are 'required.'
			'command' = 'add', 'remove', or 'set'
		}
			The props array for creating a proto from an existing proto will let you add more properties from the proto you've already created or assure you do not carry over certain properties from the base
			
	*/
	function CreateProtoFromExisting(baseProtoString, inputParamsNewProto)
	{
		var baseProto;
		var newProto = {}

		var newTypeName = inputParamsNewProto.typeName;

		var _typeExist = DoesGameObjectTypeExist(baseProtoString)

		if (_typeExist == true)
		{
			baseProto = _gameObjectProtos[baseProtoString];
		}
		else
		{
			throw "Base gameObject prototype does not exist: " + baseProtoString;
			return;
		}

		var inputProps;
		var skipProps = [];

		if(inputParamsNewProto.props)
		{
			inputProps = inputParamsNewProto.props;
		}
		else
		{
			inputProps = [];
		}

		for (iiInputProp = 0; iiInputProp < inputProps.length; iiInputProp++)
		{
			var currentInputProp = inputProps[iiInputProp];

			var checkTypeNameString = 'typename'
			var cleanPropName = purifyString(currentInputProp.propName)
			var doesBaseHaveProp = baseProto.hasOwnProperty(currentInputProp.propName)

			switch(currentInputProp.command)
			{
				case 'add':
					if (doesBaseHaveProp == true)
					{
						throw 'Cannot add ' + currentInputProp.propName + ' because it already exists in the base proto game object.'
						return;
					}
					else if (cleanPropName == checkTypeNameString)
					{
						throw 'Cannot add property named "typeName" or any variation thereof.'
						return;
					}
					newProto[currentInputProp.propName] = {
						'dataValue': currentInputProp.dataValue,
						'defaultPropValue': currentInputProp.defaultPropValue,
						'required': currentInputProp.required
					}
					break;
				case 'remove':
					if (doesBaseHaveProp == false)
					{
						throw 'Cannot delete property ' + currentInputProp.propName + ' because it does not exist in ' + baseProto;
						return;
					}
					skipProps.push(currentInputProp.propName);
					break;
				case 'set':
					if (doesBaseHaveProp == false)
					{
						throw 'Cannot set property ' + currentInputProp.propName + ' because it does not exist';
						return;
					}
					if (currentProp.dataValue)
					{
						newProto[currentProp.propName].dataValue = currentProp.dataValue;
					}
					if (currentProp.defaultPropValue)
					{
						newProto[currentProp.propName].defaultPropValue = currentProp.defaultPropValue
					}
					if (currentProp.required != null)
					{
						newProto[currentProp.propName].required = currentProp.required;
					}
					break;
				default:
					throw 'Invalid command: ' + currentInputProp.command;
					return;
					break; 
			}
		}

		var baseProps = Object.keys(baseProto)
		for (iiBaseProp = 0; iiBaseProp < baseProps.length ; iiBaseProp++)
		{
			var currentBasePropString = baseProps[iiBaseProp]

			var newProtoHasProp = newProto.hasOwnProperty(currentBasePropString)
			var isPropSkippedIndex = skipProps.indexOf(currentBasePropString)

			if (newProtoHasProp == false && isPropSkippedIndex < 0)
			{
				newProto[currentBasePropString] = baseProto[currentBasePropString];
			}

		}

		_gameObjectProtos[newTypeName] = newProto;
		return newTypeName;
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
			else
			{
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


						this.receive = receive;

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
								
								var protoPropType = currentProto[currentParamPropObj.propName].dataValue;
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
							var _propsInProto = Object.keys(currentProto)

							for (iiProtoProp = 0; iiProtoProp < _propsInProto.length; iiProtoProp++)
							{
								var _currentProtoPropString = _propsInProto[iiProtoProp]
								var _currentProtoProp = currentProto[_currentProtoPropString]

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
								throw "Property " + inputProp + " does not exist in object " + that;
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
								var objProtoProps = Object.keys(objProto)

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
						function receive(message)
						{
							for (iiProperty = 0; iiProperty < message.length; iiProperty++)
							{
								var currentProperty = message[iiProperty];
								var currentPropName = currentProperty.propertyName;

								var currentValue = currentProperty.commandValue;
								var currentCommand = currentProperty.command;
								var currentPeer = currentProperty.peer;
								if (!currentPeer || currentPeer != 'property' || currentPeer != 'value')
								{
									throw 'No peer'
									return;
								}
								if (!currentPropName)
								{
									throw 'No propertyName'
									return;
								}
								if (!currentValue)
								{
									throw 'No currentValue'
									return;
								}
								if (!currentCommand)
								{
									throw 'No currentCommand'
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
													props[currentPropName] = currentValue	
												}
												else
												{
													throw 'Property ' + currentPropName + ' already exists'
													return;
												}
												break;
											case 'value':
												if (doesInputPropExist == true)
												{
													props[currentPropName] += currentValue;	
												}
												break;
											default:
												throw 'Invalid command';
												return;
												break;
										}
										break;
									case 'set':
										switch (currentPeer)									
										{
											case 'property':
												throw 'Why are you setting a non-protype\'s property dataType?';
												return;	
											case 'value':
												if (doesInputPropExist == true)
												{
													that.SetProperty(props[currentPropName], currentValue)	
												}
												break;
											default:
												throw 'Peer is invalid.'
										}
										
										break;
									case 'execute':
										if (currentPeer == 'property')
										{
											throw 'Cannot execute on a property.'
											return;
										}
										/*
										else if (doesInputPropExist.bool == false)
										{
											throw 'Property does not exist'
										}
										*/
										else if (doesInputPropExist == true)
										{
											var objProp = props[currentPropName]
											objProp.apply(that, currentValue)
										}
										break;
									case 'remove':
										if (currentPeer != 'property')
										{
											throw 'Can only remove a property. If you\'re setting a value, then set peer to \'value\' '
											return;
										}
										else if(doesInputPropExist == true)
										{
											DeleteProp(currentPropName)
										}
										break;
									default:
										throw 'Invalid command ' + currentCommand;
										return;
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
					returnObjArray.push(newGameObject)
				}
				else
				{
					var _objectTypes = Object.keys(_gameObjectProtos);
					throw "gameObject type " + inputParams.typeName + " does not exist in prototype list " + _objectTypes;
				}
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
				'command': operation you want to perform ('add','set', or 'remove')
				'commandValue': the value type you'll be setting the property to (can be left undefined or null for 'remove' command)
				'defaultPropValue': the value that will be set for all objects, otherwise they will be set to 'null'
				'required': a boolean that indicates whether or not the property is required for gameObjects created from this proto
			}
	*/
	function SetGameObjectType(inputParams)
	{
		var doesObjExist = DoesGameObjectTypeExist(inputParams.typName)

		var currentObjProto;

		if (doesObjExist == true)
		{
			if(!inputParams.typeName)
			{
				throw 'inputParams.typeName required'
			}
			else
			{
				currentObjProto = _gameObjectProtos[inputParams.typeName]

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
						case 'set':
							var protoPropStrings = Object.keys(currentObjProto)
							var inputPropIndex = protoPropStrings.indexOf(inputParams.propName)
							if (inputPropIndex < 0 )
							{
								throw "Property does not exist to use 'set' command on. = " + inputParams.propName
								return;
								break;
							}
						case 'add':
							if (inputObjProp.required == true)
							{
								currentObjProto[inputObjProp.propName].required = true;

							}
							else if (inputObjProp.required == false)
							{
								currentObjProto[inputObjProp.propName].required = false;
							}
							else
							{
								throw "Invalid Require property on input Object = " + inputObjProp.required;
								return;
								break;
							}

							var objKey = inputObjProp.commandValue;
							currentObjProto[inputObjProp.propName].dataValue = objKey;

							if (inputObjProp.defaultPropValue)
							{
								currentObjProto[inputObjProp.propName].defaultPropValue = inputObjProp.defaultPropValue;	
							}
							else
							{
								currentObjProto[inputObjProp.propName].defaultPropValue = null;
							}			
							break;
						case 'remove':
							delete currentObjProto[inputObjProp.propName];
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

	function CheckObjIntegrity_SetGameObjType(inputObj)
	{
		var inputObjProp_reqFields = Object.keys(inputObj)
		var reqFields = inputObjProp_reqFields.length;
		var requireIndex = inputObjProp_reqFields('required')
		var commandIndex = inputObjProp_reqFields('command')
		var valueTypeIndex = inputObjProp_reqFields('valueType')

		var _setThisValueForMaxPropsOnObject = 4

		var pureCommand = purifyString(inputObjProp_reqFields[commandIndex])

		var response = false;

		if (commandIndex < 0)
		{
			throw "Error: command required as a property"
		}
		else if (requireIndex < 0)
		{
			throw "Error: required is required as a property"
		}
		else if (reqFields > _setThisValueForMaxPropsOnObject)
		{
			throw "Error: Too many properties on object. Separate properties into objects in the props Array."
		}
		else if (reqFields < _setThisValueForMaxPropsOnObject)
		{
			throw "Error: Missing property"
		}
		if (pureCommand != 'add' || pureCommand != 'remove' || pureCommand != 'set' )
		{
			throw "command property must be either 'add' or 'remove'"
		}
		else
		{
			response = true;
		}

		return response;
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

	function receive(message)
	{

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