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
	The "message" object is an array with objects which are the message. The objects are the following

	Peer indicates whether you're modifying the value of the property, or the actual property itself

	commandValue is the value of whatever you're setting. If the 'peer' == 'value', then you're going to set the property's value on the bject
		If the 'peer' == 'value' and the 'command' == 'execute', then 'value' will be the param or params in an array.
			If you you're going to
		
	

	Available commands:
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


	
	The receiver contains 4 properties
		receiver.receiveType = ['gameObject', 'gameLibrary', 'objectLabel' 'protoGameObject']
			- receiveType is an array indicating up to all 3 of thoe types
		receiver.gameObject = ['objectType1','objectType2']
			- gameObject is the property containg the gameObject types you wish to send to
		receiver.gameLibrary = ['libraryType1', 'libraryType2']
			- gameLibrary is the property containing the libraries you wish to send to
		receiver.objectLabel = ['customLabelForObject1','customLabelForObject2']
			- objectLabel is the property containing the label or labels you wish to send the message to

		'protoGameObject' does not have a receiver property, but does affect the gameObject receivers. This allows you to set a property on a proto, and have the change broadcasted to each gameObject type of that proto.

	
	*/

	function SendMessage(receiver, message)
	{
		if (receiver)
		{
			for (iiRecType = 0; iiRecType < receiver.receiveType; iiRecType++)
			switch (receiver.receiveType)
			{
				case 'gameObject':
					break;
				case 'gameLibrary':
					break;
				case 'objectLabel':
					break;
				case 'protoGameObject':

					break;
				case null:
				case undefined:
					break;
				default:
					throw "receiveType does not exist"
					break;
			}
		}
		else
		{

		}
	}

}