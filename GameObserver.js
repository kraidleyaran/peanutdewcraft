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

	/*
	Sending messages to gameObjects is done by using the following message format for gameObjects (sending to gameObjects, gameLibaries, or ObjectLabel)

	Peer indicates whether you're modifying the value of the property, or the actual property itself

	commandValue is the value of whatever you're setting. If the 'peer' == 'value', then you're going to set the property's value on the bject
		If the 'peer' == 'value' and the 'command' == 'execute', then 'value' will be the param or params in an array.
			If you you're going to	

	Available commands for GameObjects (using gameObject, objectLabel, or gameLibrary):
		Properties - 'add','set' and 'remove'
			Add - adds a property to receipients of message
			Set - sets a property's data type ('string','number','boolean','array','object','function') - Only works with protos objects.
			Remove - Remvoes the property from the object
		Keys - 'exeucte', 'add', and 'set'
			Add - adds the message's value to the current value (only works if datatypes are same, and is a string, number, or an array)
			Set - sets the property's value
			Execute - if the property is a function, it will execute the function.
				CommandValue will be an array containing paramters to be passed into the function

		message[0] = {
			'propertyName':'my property',
			'peer': 'property',
			'command': 'set',
			'commandValue': 'string'
		}
		message[1] = {
			'propertyName': 'my property',
			'peer': 'value',
			'command': 'set',
			'commandValue': 'this is my value'
		}
		message[2] = {
			'propertyName': 'some function I have',
			'peer':'value',
			'command':'execute',
			'commandValue': ['firstParam', 'secondParam']

		}



	
	The receiver contains 1 property, which contains four arrays.
		receiver = {
			'gameObjectTypes':[],
			'objectLibrary':[], 
			'objectLabel':[],
			'protoGameObject':[],
			'gameManager':,
			'gameLibrary':
		}
		receiver.gameObjectTypes = ['objectType1','objectType2']
			- gameObject is the property containg the gameObject types you wish to send to
		receiver.objectLibraries = ['libraryType1', 'libraryType2']
			- objectLibraries is the property containing the libraries you wish to send to
		receiver.objectLabel = ['customLabelForObject1','customLabelForObject2']
			- objectLabel is the property containing the label or labels you wish to send the message to
		receiver.protoGameObject = [gameObjectype1, gameObjectype2
			- Makes changes in the protoGameObject, which THEN APPLIES ALL CHANGES TO OBJECTS OF THAT GAME TYPE
				(the gameManager.)

	
	*/

	function SendMessage(receiver, message)
	{

		if (receiver)
		{

			var receivedList = {
				'gameObject':[],
				'objectLibraries':[],
			}
			
			var receiverTypeStrings = Object.keys(receiver.receiveTypes);
			/*
			SendMessage first checks to see if any library types are present. After that, it checks for gameObject types
			Once both of those are done, it goes through the rest which should be receiving messages separately anyway due
			to their different methods.

			Once an object receives the message, it is put on the receivedList to assure it does not receive the message again.
			*/
			if (receiver.objectLibraries.length > 0)
			{
				for (iiLibType = 0; iiLibType < receiver.objectLibraries.length; iiLibType++)
				{
					var currentLibType = receiver.objectLibraries[iiLibType];
					var doesLibTypeExist = _gameLibrary.DoesLibrarTypeExist(currentLibType)
					if (doesLibTypeExist == false)
					{
						throw 'Library Type ' + currentLibType + ' does not exist';
						return;
					}

					var currentLib = _gameLibs[currentLibType];

					for (iiObject = 0; iiObject < currentLibType.length; iiOBject++)
					{
						var currentObject = currentLib[iiObject];
						currentObject.receieve(message);

						receivedList.gameObjects.push(currentObject);
					}

					receivedList.objectLibraries.push(currentLibType);
				}

				var objectLibraryIndex = receiverTypeStrings.indexOf('objectLibraries');
				receiverTypeStrings.splice(objectLibraryIndex, 1)
			}
			// Removes the objectLibrary from the list of keys because we already sent to the object libraries above.
			// Check gameObjectTypes, then send messages to any gameObjectTypes in the parameters
			if (receiver.gameObjectTypes.length >  0)
			{
				for (iiObjType = 0; iiObjType < receiver.gameObjectTypes.length; iiObjType++)
				{
					var currentObjType = receiver.gameObjectTypes[iiObjType];

					for (iiLib = 0; iiLib < _libTypes.length; iiLib++)
					{
						var currentLibNameString = _libTypes[iiLib];
						var libNameIndex = receivedList.objectLibraries.indexOf(currentLibNameString);
						
						var currentLib = _gameLibs[currentLibNameString];

						var objTypeExistInLib = currentLib.DoesObjectTypeExistInLibrary(currentObjType);

						if (objTypeExistInLib == false || libNameIndex > 0)
						{
							continue;
						}

						for (iiObj = 0; iiObj < currentLib.objList[currentObjType].length; iiObj++)
						{
							var currentObjIndex = currentLib.objList[currentObjType].indexOf(iiObj)

							var currentObj = currentLib.objectLib[iiObj];
							var objIndex = receivedList.gameObject.indexOf(currentObj);

							if (objIndex > 0)
							{
								continue;
							}
							
							currentObj.receive(message);
							receivedList.gameObjects.push(currentObject);
						}
					}
				}
				var gameObjectTypeIndex = receiverTypeStrings.indexOf('gameObjectTypes');
				receiverTypeStrings.splice(gameObjectTypeIndex, 1)				
			}
			//Begin For & Switch statement for the rest of the cases
			for (iiReceiver = 0; iiReceiver < receiverTypeStrings.length; iiReceiver++)
			{
				var currentReceiverString = receiverTypeStrings[iiReceiver]
				var currentReceiver = receiver[currentReceiverString]
				
				switch (currentReceiverString)
				{
					case 'objectLabel':
						for (iiObjLabel = 0; iiObjLabel < currentReceiver.length; iiObjLabel++)
						{
							var currentObjLabel = currentReceiver[iiObjLabel];

							for (iiLib = 0; iiLib < _libTypes.length; iiLib++)
							{
								var currentLibNameString = _libTypes[iiLib];
								var libNameIndex = receivedList.objectLibraries.indexOf(currentLibNameString);
								
								var currentLib = _gameLibs[currentLibNameString];
								
								if (libNameIndex > 0)
								{
									continue;
								}
								
								var currentObjLabelList = currentLib.objLabelList[currentObjLabel]

								for (iiObj = 0; iiObj < currentObjLabelList.length; iiObj++)
								{
									var currentObjIndex = currentObjLabelList[iiObj];

									var currentObj = currentLib.objectLib[currentObjIndex];

									var objIndex = receivedList.gameObject.indexOf(currentObj);

									if (objIndex > 0)
									{
										continue;
									}
									currentObj.receive(message);
									receivedList.gameObjects.push(currentObject);
								}
							}
						}
						break;
					case 'gameManager':
						break;
					case 'gameLibrary':
						break;
					case null:
					case undefined:
						break;
					default:
						throw "Receiver Type does not exist"
						break;
				}
			}
		}
		else
		{
			throw "No receiver?"
			return;
		}
	}

}