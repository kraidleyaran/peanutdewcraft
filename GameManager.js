function GameManager(){

	var _gameObjectProtos = {};	

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

	this.CreateProtoFromGameObject = CreateProtoFromGameObject;

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
	/*
			example:
				var objParams = {
					'typeName': 'gameObject prototype name'
					'props': []
				}
			
				objParams.props[0] = {
					'propsName' = name of property
					'required' = boolean indicating whether or not a value is required when creating a gameObject of this type
					'dataValue' = type of data the property will be set to
					'defaultPropValue' = the default value that will be set if nothing is sent during creation. This does not affect properties that are 'required.'
				}
				
			CreateGameObjectType[objParamArray]

		Please note that an object cannot contain typename or any variation there of as a property name unless another word is before, between, or after type and name. That includes any symbol attached to typeName
		*/
	function CreateGameObjectType(objParamArray)
	{
		var returnObjTypeNames = [];
		var objParamArrayLength = objParamArray.length
		for (iiObjParam = 0; iiObjParam < objParamArrayLength; iiObjParam++)
		{
			var objParams = objParamArray[iiObjParam]
			var paramsTypeName = objParams.typeName;
			if (!paramsTypeName || paramsTypeName.length == 0)
			{
				throw "Invalid typeName " + paramsTypeName;
				return;
			}
			var doesObjTypeExist = DoesGameObjectTypeExist(paramsTypeName);

			if (doesObjTypeExist == false)
			{
				function newObjectProto ()
				{
					var _protoObjs = _gameObjectProtos;
					var _protoGameManager = theGameManager;
					var _typeName;
					var _props = {}
					var _protoObserver = _gameObserver || {
						'SendMessage':function()
						{
							return;
						}
					};

					this.GetProps = GetProps;
					this.AddProps = AddProps;
					this.SetProps = SetProps;
					this.RemoveProps = RemoveProps;

					this.GetTypeName = GetTypeName;
					this.SetTypeName = SetTypeName;

					this.SetObserver = SetObserver;
					this.GetObserver = GetObserver;

					function GetProps()
					{
						return _props;
					}
					function AddProps(propArray)
					{
						var _addPropsToChildObjectsMessage = [];
						var propArrayLength = propArray.length;

						for (iiPropItem = 0; iiPropItem < propArrayLength; iiPropItem++)
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
								var newPropObj = MakeCopyOfObject(currentProp);
								_props[currentProp.propName] = {
									'dataValue': newPropObj.dataValue,
									'defaultPropValue': newPropObj.defaultPropValue,
									'required': newPropObj.required
								}
								var newMessage = {
									'peer':'property',
									'propertyName': newPropObj.propName,
									'command':'add',
									'commandValue': newPropObj.defaultPropValue
								}
								_addPropsToChildObjectsMessage.push(newMessage)

							}

						}

						var messageObject = {
							'message':_addPropsToChildObjectsMessage,
							'receiver':{
								'gameObjectTypes':[_typeName]
							}
						}
						_protoObserver.SendMessage(messageObject)
					}
					function SetProps(propArray)
					{	
						var _addPropsToChildObjectsMessage = [];
						var propArrayLength = propArray.length
						for (iiPropItem = 0; iiPropItem < propArrayLength; iiPropItem++)
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
								var newObjProp = MakeCopyOfObject(currentProp);
								_props[currentProp.propName] = {
									'dataValue': newObjProp.dataValue,
									'defaultPropValue': newObjProp.defaultPropValue,
									'required': newObjProp.required
								}
								var newMessage = {
									'peer':'property',
									'propertyName': newObjProp.propName,
									'command':'set',
									'commandValue': newObjProp.defaultPropValue
								}
								_addPropsToChildObjectsMessage.push(newMessage)
							}							
						}

						var messageObject = {
							'message':_addPropsToChildObjectsMessage,
							'receiver':{
								'gameObjectTypes':[_typeName]
							}
						}
						_protoObserver.SendMessage(messageObject)
					}
					function RemoveProps(propStringArray)
					{
						var _removePropsFromChildObjectsMessage = [];
						var _propKeys = Object.keys(_props);
						var propStringArrayLength = propStringArray.length;
						for (iiPropString = 0; iiPropString < propStringArrayLength; iiPropString++)
						{
							var currentPropString = propStringArray[iiPropString];
							var propStringIndex = _propKeys.indexOf(currentPropString)
							if (propStringIndex < 0)
							{
								throw "Property does not exist on GameObject Prototype " + _typeName;
								return;
							}
							delete _props[currentPropString];
							var newMessage = {
								'peer':'property',
								'propertyName': currentPropString,
								'command':'remove'
							}
							_removePropsFromChildObjectsMessage.push(newMessage);
						}
						var messageObject = {
							'message': _removePropsFromChildObjectsMessage,
							'receiver':{
								'gameObjectTypes':[_typeName]
							}
						}
						_protoObserver.SendMessage(messageObject)
					}
					function GetTypeName()
					{
						return _typeName;
					}
					function SetTypeName(inputTypeNameString)
					{
						var _typeNameExist = _protoGameManager.DoesGameObjectTypeExist(inputTypeNameString)
						if (_typeNameExist == false)
						{
							var currentTypeName = GetTypeName();
							var _currentTypeNameExist = _protoGameManager.DoesGameObjectTypeExist(currentTypeName);
							if (_currentTypeNameExist == true)
							{											
								delete _protoObjs[_typeName];
								_typeName = inputTypeNameString;	
								_protoObjs[inputTypeNameString] = this;

								var messageArray = []
								messageArray[0] = {
									'peer':'typeName',
									'command':'set',
									'commandValue':inputTypeNameString
								}

								var messageObject = {
									'message':messageArray,
									'receiver':{
										'gameObjectTypes': [currentTypeName]
									}
								}
								_protoObserver.SendMessage(messageObject)
							}
							else
							{
								_typeName = inputTypeNameString;	
								_protoObjs[inputTypeNameString] = this;
							}

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
					function SetObserver(inputGameObserver)
					{
						_protoObserver = inputGameObserver;
					}
					function GetObserver()
					{
						return _protoObserver;
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
			var modelProtoPropStringArrayLength = modelProtoProps_Strings.length;
			for (iiProp = 0; iiProp < modelProtoPropStringArrayLength; iiProp++)
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
		var inputParamArrayLength = inputParamArray.length;
		for (iiInputParam = 0; iiInputParam < inputParamArrayLength; iiInputParam++)
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
					props['_masterGameObject'] = this;
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

					var _inputParamsPropsLength = inputParamsProps.length;
					for (iiProp = 0; iiProp < _inputParamsPropsLength; iiProp++)
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
								
								if (!currentParamPropObj.propValue && protoProps[currentParamPropObj].required != true)
								{
									currentParamPropObj.propValue = MakeCopyOfObject(protoProps[currentParamPropObj.propName].defaultPropValue);
								}
								_addPropsArray.push(currentParamPropObj)
							}
							else
							{
								throw protoPropType + " and " + currentPropType + " are not equal types.";
								return;
							}
							
						}					
						else if (propExistInProto == false && currentParamPropObj.propName != '_masterGameObject')
						{
							throw currentParamPropObj.propName + " does not exist in GameObject Type " + inputParams.typeName;
							return 
						}
						else if (propExistInProps == true && currentParamPropObj.propName != '_masterGameObject')
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
						var _propsInProtoLength = _propsInProto.length
						for (iiProtoProp = 0; iiProtoProp < _propsInProtoLength; iiProtoProp++)
						{
							var _currentProtoPropString = _propsInProto[iiProtoProp]
							var _currentProtoProp = protoProps[_currentProtoPropString]

							var _doesCurrentPropExistInInput = props.hasOwnProperty(_currentProtoPropString)

							if (_doesCurrentPropExistInInput == false && _currentProtoProp.required == true && !props[_currentProtoPropString])
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
							props[inputProp] = MakeCopyOfObject(inputKeyValue);
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
							_typeName = newTypeNameString;
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
						var _inputPropArrayLength = inputPropArray.length
						for (iiNewProp = 0; iiNewProp < _inputPropArrayLength; iiNewProp++)
						{
							var currentPropObj = inputPropArray[iiNewProp];

							var currentPropName = currentPropObj.propName;

							var doesPropExist = DoesPropExist(currentPropName)

							if (doesPropExist == false)
							{
								props[currentPropName] = MakeCopyOfObject(currentPropObj.propValue);
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
						var returnValue;
						var _otherPeerTypes = ['typeName', 'proto', 'objectLabel']
						var messageArrayLength = messageArray.length
						for (iiMessage = 0; iiMessage < messageArrayLength; iiMessage++)
						{
							var currentMessage = messageArray[iiMessage];

							var currentPropName = currentMessage.propertyName;
							var currentValue = currentMessage.commandValue;
							var currentCommand = currentMessage.command;

							var currentPeer = currentMessage.peer;
							var otherPeerTypeIndex = _otherPeerTypes.indexOf(currentPeer)

							if (!currentPeer || currentPeer != 'property' && currentPeer != 'value' && otherPeerTypeIndex < 0)
							{
								throw 'Peer is invalid.'
								return;
							}
							if (!currentPropName && otherPeerTypeIndex < 0)
							{
								throw 'No propertyName in message'
								return;
							}
							if (!currentCommand)
							{
								throw 'No command in message'
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
													'propValue': currentValue || null
												}
												that.AddProperty([newObjProp])	
											}
											break;
										case 'value':
											if (doesInputPropExist == true)
											{
												if (currentValue)
												{
													props[currentPropName] += currentValue;		
												}
												else
												{
													throw 'commandValue required when adding to a property\'s value'
													return;
												}
											}
											break;
										default:
											break;
									}
									break;
								case 'get':
									if (doesInputPropExist == true)
									{
										returnValue = that.GetProperty(currentPropName);
									}
									else
									{
										returnValue = null;
									}
								case 'set':
									if (doesInputPropExist == true)
									{
										if (otherPeerTypeIndex < 0)
										{
											that.SetProperty(currentPropName, currentValue)			
										}
									}
									else if (otherPeerTypeIndex > -1)
									{
										switch (currentPeer)
										{
											case 'typeName':
												that.SetType(currentValue)
												break;
											case 'proto':
												that.SetObjectProto(currentValue)
												break;
											case 'objectLabel':
												that.SetLabel(currentValue)
												break;
											default:
												break;
										}
									}
									break;
								case 'execute':
									if (doesInputPropExist == true)
									{
										var objProp = props[currentPropName]
										
										var objFunction = objProp()
										var runFunction = objFunction.bind(props)
										runFunction(currentValue);			
										
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
						return returnValue;
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
			throw inputParams.typeName + " is not a current gameObject type"
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
			var objPropsStringLength = objPropStrings.length

			for (iiProp = 0; iiProp < objPropsStringLength; iiProp++)
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

	function CreateProtoFromGameObject(paramsObj)
	{
		var protoNameExist = DoesGameObjectTypeExist(paramsObj.typeName)
		if (!paramsObj.typeName)
		{
			throw 'typeName required for new GameObject prototype'
			return;
		}
		if (protoNameExist == true)
		{
			throw "GameObject prototype name " + paramsObj.typeName + " already exists."
			return;
		}
		if (!paramsObj.gameObject)
		{
			throw "GameObject required for new GameObject prototype"
			return;
		}
		var currentObj = paramsObj.gameObject;
		var objProps = currentObj.GetAllProperties();
		var objKeys = Object.keys(objProps)
		var newProtoProps = [];
		/*
		props[0] = {
					'propsName' = name of property
					'required' = boolean indicating whether or not the object is required
					'dataValue' = type of data the property will be set to
					'defaultPropValue' = the default value that will be set if nothing is sent during creation. This does not affect properties that are 'required.'
				}
		*/
		for (iiObjProp = 0; iiObjProp < objKeys.length; iiObjProp++)
		{
			if (objKeys[iiObjProp] == '_masterGameObject')
			{
				continue;
			}
			var valueType = typeof objProps[objKeys[iiObjProp]];
			var propsObj = {
				'propName': objKeys[iiObjProp],
				'required': true,
				'dataValue': valueType,
				'defaultPropValue': MakeCopyOfObject(objProps[objKeys[iiObjProp]])
			}
			newProtoProps.push(propsObj)
		}
		var newGameObjectProto = {
			'typeName': paramsObj.typeName,
			'props':newProtoProps
		}
		var returnObjectTypeArray = CreateGameObjectType([newGameObjectProto]);
		currentObj.SetType(paramsObj.typeName)
		return returnObjectTypeArray[0];
	}

	function GetGameObjectTypes()
	{
		var response;

		var objTypes = Object.keys(_gameObjectProtos)
		if (objTypes.length > 0)
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
			var protoKeys = Object.keys(_gameObjectProtos)
			var protoKeysLength = protoKeys.length
			for (iiProto = 0; iiProto < protoKeysLength; iiProto++)
			{
				var currentProto = _gameObjectProtos[protoKeys[iiProto]]
				currentProto.SetObserver(gameObserver);
			}
		}
		else
		{
			throw "GameObserver has already been set"
			return;
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