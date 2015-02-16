function GameObserver(_gameLibrary, _gameManager)
{
	var that = this;
	if (!_gameLibrary)
	{
		throw "Missing GameLibrary Reference"
	}
	if (!_gameManager)
	{
		throw "Missing GameManager Reference"
	}

	var libCheck = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own library instead of mine. Good luck with that."
	var gmCheck = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own GameManager instead of mine. Good luck with that."

	var isLibValid = _gameLibrary.IsLibValid(libCheck)
	var isGMValid = _gameManager.IsGameManagerValid(gmCheck)

	if (isLibValid == false)
	{
		throw "GameLibrary is not valid"
	}
	if (isGMValid == false)
	{
		throw "GameManager is not valid"
	}

	_gameLibrary.SetGameObserver(that)
	_gameManager.SetGameObserver(that)

	// Instead of adding objects to the gameObserver, I thought it more simple to Observe all objects in the Library.
	var _gameLibs = _gameLibrary.GetLibraries();
	var _libTypes = _gameLibrary.GetLibraryTypes();

	var _gameObjectTypes = _gameManager.GetGameObjectTypes();
	var _gameObjectProtos = _gameManager.GetGameObjectProtos();

	this.SendMessage = SendMessage;

	/*
		SendMessage sends a message to all objects of a given library, gameObject type, or containing a given gameObject label.

		When using SendMessage, you must include a receiver object, and a message object.

		The receiver object should contain 1 to 3 of the following properties:
			'objectLibraries': ['libraryName1', 'libraryName2', 'libraryName3'],
			'gameObjectTypes': ['gameObjectTypeName1', 'gameObjectTypeName2', 'gameObjectTypeName3'],
			'objectLabels': ['objectLabel1', 'objectLabel2', 'objectLabel3']

		If a receiver object is absent, the message is sent to all gameObjects in every gameLibrary

		The message object is an array with objects that should contain the following properties:
			message[0] = {
				'peer': this should be 'property' or 'value'
					'property' indicates fo
				'propertyName': name of the property on the gameObject
				'command': set, add, execute, or remove
					set - sets a property's value regardless of peer

					add - depends on peer:
						if peer is 'property', add's a new property to the object with propertyName as it's name, and commandValue as it's value
						if peer is 'value', add's the commandValue to the current value
						(trust me, I know this shit is dangerous, but it's easy? ugh....)

					remove - depends on peer:
						if peer is 'property', remove's property from object
						if peer is 'value', set's property value to 'null'
					execute - executes the property as if it were a function regardless of peer

				'commandValue': the value the property is being set to, or parameter used if the command is 'execute'
				;
			}
	*/

	function SendMessage(receiverMessageObject)
	{
		if (!receiverMessageObject.message)
		{
			throw "No message";
			return;
		}
		var message = receiverMessageObject.message;
		var receivedList = {
				'gameObjects':[],
				'objectLibraries':[],
		}

		if (receiverMessageObject.receiver)
		{
			var receiver = receiverMessageObject.receiver;
			if (!receiver.objectLibraries)
			{
				receiver.objectLibraries = [];
			}
			if (!receiver.gameObjectTypes)
			{
				receiver.gameObjectTypes = [];
			}
			if (!receiver.objectLabels)
			{
				receiver.objectLabels = [];
			}

			if (receiver.objectLibraries.length > 0)
			{
				for (iiLibType = 0; iiLibType < receiver.objectLibraries.length; iiLibType++)
				{
					var currentLibType = receiver.objectLibraries[iiLibType];
					var doesLibTypeExist = _gameLibrary.DoesLibraryTypeExist(currentLibType)
					if (doesLibTypeExist == false)
					{
						throw 'Library Type ' + currentLibType + ' does not exist';
						return;
					}

					var currentLib = _gameLibs[currentLibType];
					var libRecIndex = receivedList.objectLibraries.indexOf(currentLib.libName);
					if (libRecIndex < 0)
					{
						for (iiObject = 0; iiObject < currentLib.objectLib.length; iiObject++)
						{
							var currentObject = currentLib.objectLib[iiObject];
							var objRecIndex = receivedList.gameObjects.indexOf(currentObject);
							if (objRecIndex < 0)
							{
								currentObject.Receive(message);
								receivedList.gameObjects.push(currentObject);	
							}
							
						}
						receivedList.objectLibraries.push(currentLibType);						
					}
				}
			}

			if (receiver.gameObjectTypes.length > 0)
			{
				for (iiObjType = 0; iiObjType < receiver.gameObjectTypes.length; iiObjType++)
				{
					var currentObjType = receiver.gameObjectTypes[iiObjType];
					var _libTypes = _gameLibrary.GetLibraryTypes();

					for (iiLib = 0; iiLib < _libTypes.length; iiLib++)
					{
						var currentLibNameString = _libTypes[iiLib];
						var libNameIndex = receivedList.objectLibraries.indexOf(currentLibNameString);
						
						var currentLib = _gameLibs[currentLibNameString];

						var objTypeExistInLib = currentLib.DoesObjectTypeExistInLibrary(currentObjType);

						if (objTypeExistInLib == false || libNameIndex >= 0)
						{
							continue;
						}
						
						var currentObjType_List = currentLib.objList[currentObjType];

						for (iiObj = 0; iiObj < currentObjType_List.length; iiObj++)
						{
							
							var currentObj = currentObjType_List[iiObj];

							var objIndex = receivedList.gameObjects.indexOf(currentObj);
							if (objIndex >= 0)
							{
								continue;
							}
							currentObj.Receive(message);
							receivedList.gameObjects.push(currentObject);
						}
					}
				}	
			}

			if(receiver.objectLabels.length > 0)
			{
				for (iiObjLabel = 0; iiObjLabel < receiver.objectLabels.length; iiObjLabel++)
				{
					var currentObjLabel = receiver.objectLabels[iiObjLabel];
					var _libTypes = _gameLibrary.GetLibraryTypes();

					for (iiLib = 0; iiLib < _libTypes.length; iiLib++)
					{
						var currentLibNameString = _libTypes[iiLib];
						var libNameIndex = receivedList.objectLibraries.indexOf(currentLibNameString);
						
						var currentLib = _gameLibs[currentLibNameString];
						
						if (libNameIndex >= 0)
						{
							continue;
						}
						
						var currentObjLabelList = currentLib.objLabelList[currentObjLabel]

						for (iiObj = 0; iiObj < currentObjLabelList.length; iiObj++)
						{
							var currentObj = currentObjLabelList[iiObj];
							var objIndex = receivedList.gameObjects.indexOf(currentObj);

							if (objIndex >= 0)
							{
								continue;
							}
							currentObj.Receive(message);
							receivedList.gameObjects.push(currentObj);
						}
					}
				}
			}
		}
		else
		{	
			var _libTypes = _gameLibrary.GetLibraryTypes();
			for (iiLib = 0; iiLib < _libTypes.length; iiLib++)
			{
				var currentLib = _gameLibs[_libTypes[iiLib]]
				var libRecIndex = receivedList.objectLibraries.indexOf(currentLib.libName);
				if (libRecIndex < 0)
				{
					for (iiObject = 0; iiObject < currentLib.objectLib.length; iiObject++)
					{
						var currentObject = currentLib.objectLib[iiObject];
						var objRecIndex = receivedList.gameObjects.indexOf(currentObject);
						if (objRecIndex < 0)
						{
							currentObject.Receive(message);
							receivedList.gameObjects.push(currentObject);
						}
					}
					receivedList.objectLibraries.push(currentLib.libName);				
				}
			}
		}
	}
}