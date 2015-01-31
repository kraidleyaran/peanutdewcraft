var GameObserver = function GameObserver()
{
	// Instead of adding objects to the gameObserver, I thought it more simple to Observe all objects in the Library.
	var _gameLibs = GameLibrary.GetLibraries();
	var _libTypes = GameLibrary.GetLibraryTypes();

	var _gameObjectTypes = GameManager.GetGameObjectTypes();
	var _gameObjectProtos = GameManager.GetGameObjectProtos();

	/*
	The GameObserver sends a message to all the objects in the game libaries. To do this, it receives a *message* containing what properties an object or objects should change, or retrieve the current key of that property.
		message[propertyName].command can be any of the following: get, set, or remove.
		message[propertyName].
		Get returns the key of the property
		Set the key of the property
	The other object, the *receiver*, details a few things. The first is in a property called receiveType, which indicates if it's an gameObject Type (sends to all objects of that equal the same gameObject.TypeName)
	, gameLibrary type(all objects in a given library), or an objectLabel type (unique specific lables given to a specific object). This allows versatility with the sendMessage, along with the ability to long who was suppose
	to receive the message. Alternatively, you can not send a receiver at all to send to all objects in the game Library.
	*/
	function sendMessage(message, receiver)
	{
		if (receiver)
		{
			switch (receiver.receiveType)
			{
				case 'gameObject':
					break;
				case 'gameLibrary':
					break;
				case 'objectLabel':
					break;
			}
		}
		else
		{

		}
	}

}