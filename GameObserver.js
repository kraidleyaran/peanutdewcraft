function GameObserver(_gameLibrary, _gameManager)
{
	var that = this;
	if (!_gameLibrary)
	{
		throw "Missing GameLibrary Reference"
		return;
	}
	if (!_gameManager)
	{
		throw "Missing GameManager Reference"
		return;
	}

	var libCheck = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own library instead of mine. Good luck with that."
	var gmCheck = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own GameManager instead of mine. Good luck with that."

	var isLibValid = _gameLibrary.IsLibValid(libCheck)
	var isGMValid = _gameManager.IsGameManagerValid(gmCheck)

	if (isLibValid == false)
	{
		throw "GameLibrary is not valid"
		return;
	}
	if (isGMValid == false)
	{
		throw "GameManager is not valid"
		return;
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
		var returnValueArray = [];
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
			if (!receiver["objectLibraries"])
			{
				receiver.objectLibraries = [];
			}
			if (!receiver["gameObjectTypes"])
			{
				receiver.gameObjectTypes = [];
			}
			if (!receiver["objectLabels"])
			{
				receiver.objectLabels = [];
			}
			var recObjLibsLength = receiver["objectLibraries"].length
			if (recObjLibsLength > 0)
			{
				for (iiLibType = 0; iiLibType < recObjLibsLength; iiLibType++)
				{
					var currentLibType = receiver.objectLibraries[iiLibType];
					var doesLibTypeExist = _gameLibrary.DoesLibraryTypeExist(currentLibType)
					if (doesLibTypeExist == false)
					{
						throw 'Library Type ' + currentLibType + ' does not exist';
						return;
					}

					var currentLib = _gameLibs[currentLibType];
					var getFromLibParams = {
						"allObjs": true
					}
					var libObjs = currentLib.GetFromLibrary(getFromLibParams)
					var libRecIndex = receivedList.objectLibraries.indexOf(currentLib.libName);
					if (libRecIndex < 0)
					{
						var objLibLength = currentLib.GetLength();
						for (iiObject = 0; iiObject < objLibLength; iiObject++)
						{
							var currentObject = libObjs[iiObject];
							var objRecIndex = receivedList.gameObjects.indexOf(currentObject);
							if (objRecIndex < 0)
							{
								var recValue = currentObject.Receive(message);
								returnValueArray.push(recValue)
								receivedList.gameObjects.push(currentObject);	
							}
							
						}
						receivedList.objectLibraries.push(currentLibType);						
					}
				}
			}
			var recGameObjectLength = receiver.gameObjectTypes.length;
			if (receiver.gameObjectTypes.length > 0)
			{
				for (iiObjType = 0; iiObjType < recGameObjectLength; iiObjType++)
				{
					var currentObjType = receiver.gameObjectTypes[iiObjType];
					var _libTypes = _gameLibrary.GetLibraryTypes();

					var libLength = _libTypes.length

					for (iiLib = 0; iiLib < libLength; iiLib++)
					{
						var currentLibNameString = _libTypes[iiLib];
						
						var currentLib = _gameLibs[currentLibNameString];

						var objTypeExistInLib = currentLib.DoesObjectTypeExistInLibrary(currentObjType);
						if (objTypeExistInLib == false)
						{
							continue;
						}
						
						var currentObjType_List = currentLib.GetFromLibrary({'objectTypes':[currentObjType]})
						var objTypeListLength = currentObjType_List.length
						for (iiObj = 0; iiObj < objTypeListLength; iiObj++)
						{
							
							var currentObj = currentObjType_List[iiObj];

							var objIndex = receivedList.gameObjects.indexOf(currentObj);
							if (objIndex < 0)
							{
								var recValue = currentObj.Receive(message);
								returnValueArray.push(recValue)
								receivedList.gameObjects.push(currentObject);
							}
						}
					}
				}	
			}
			var recLabelLength = receiver["objectLabels"].length
			if(recLabelLength > 0)
			{
				var recObjLabels = receiver['objectLabels'];

				for (iiObjLabel = 0; iiObjLabel < recLabelLength; iiObjLabel++)
				{
					var currentObjLabel = recObjLabels[iiObjLabel];
					var _libTypes = _gameLibrary.GetLibraryTypes();

					var _libTypesLength = _libTypes.length;
					for (iiLib = 0; iiLib < _libTypesLength; iiLib++)
					{
						var currentLibNameString = _libTypes[iiLib];
						var libNameIndex = receivedList.objectLibraries.indexOf(currentLibNameString);
						if (libNameIndex >= 0)
						{
							continue;
						}
						var currentLib = _gameLibs[currentLibNameString];

						var objLibLabels = currentLib.GetObjLabelList();
						var objLabelIndex = objLibLabels.indexOf(currentObjLabel);
						if (objLabelIndex < 0)
						{
							continue;
						}

						var labelObjArray = currentLib.GetFromLibrary({'objectLabels':[currentObjLabel]});
						var labelObjArrayLength = labelObjArray.length;

						for (iiObj = 0; iiObj < labelObjArrayLength; iiObj++)
						{
							var currentObj = labelObjArray[iiObj];
							var objIndex = receivedList.gameObjects.indexOf(currentObj);
							
							if (objIndex >= 0)
							{
								continue;
							}

							var recValue = currentObj.Receive(message);
							returnValueArray.push(recValue);
							receivedList.gameObjects.push(currentObj);
						}
					}
				}
			}
		}
		var lengthTotals = recLabelLength + recObjLibsLength + recGameObjectLength;
		if (!lengthTotals || lengthTotals == 0)
		{	
			var _libTypes = _gameLibrary.GetLibraryTypes();
			var libtypesLength = _libTypes.length
			for (iiLib = 0; iiLib < libtypesLength; iiLib++)
			{
				var currentLib = _gameLibs[_libTypes[iiLib]]
				var libRecIndex = receivedList.objectLibraries.indexOf(currentLib.libName);
				if (libRecIndex < 0)
				{
					var objLibLength = currentLib.GetLength();
					var _getFromLibParams = {
						'allObjs': true
					}
					var libObjs = currentLib.GetFromLibrary(_getFromLibParams)
					for (iiObject = 0; iiObject < objLibLength; iiObject++)
					{
						var currentObject = libObjs[iiObject];
						var objRecIndex = receivedList.gameObjects.indexOf(currentObject);
						if (objRecIndex < 0)
						{
							var recValue = currentObject.Receive(message);
							returnValueArray.push(recValue)
							receivedList.gameObjects.push(currentObject);
						}
					}
					receivedList.objectLibraries.push(currentLib.libName);				
				}
			}
		}

		return returnValueArray;
	}
}