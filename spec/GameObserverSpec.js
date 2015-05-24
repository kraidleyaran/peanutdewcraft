describe("GameObserver", function (){
	var MyGameLibrary;
	var MyGameManager;
	var MyGameObserver;
	var gamePiece_prop_test;
	var gamePieceProto;
	var _newTypeArray;
	var newProtoStringArray;
	var newProtoString;
	var newGamePiece_prop_test;
	var newGamePiece;
	var _gamePieceArray;
	var newGamePiece_ObjectArray;
	var newGamePiece_Object;
	var gamePieceLibString;
	var _gameLibs;
	var _gamePieceLib;

	var clonedGamePieceArray;
	var cloneGamePieceOptions;
	var cloneGamePieceLabels;

	var _addGameObjectsArray;

	beforeEach(function()
	{
		MyGameLibrary = new GameLibrary();
		MyGameManager = new GameManager();
		MyGameObserver = new GameObserver(MyGameLibrary, MyGameManager);
		_gameLibs = MyGameLibrary.GetLibraries();

		gamePiece_prop_test = {
			'propName':'test',
			'required': false,
			'dataValue': 'boolean',
			'defaultPropValue': false
		};

		gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		_newTypeArray = [];
		_newTypeArray.push(gamePieceProto);	
		newProtoStringArray = MyGameManager.CreateGameObjectType(_newTypeArray);
		newProtoString = newProtoStringArray[0]

		newGamePiece_prop_test = {
			'propName': 'test',
			'propValue': true
		}
		newGamePiece = {
			'typeName': 'gamePiece',
			'objectLabel': '',
			'props': [newGamePiece_prop_test]
		}
		_gamePieceArray = []
		_gamePieceArray.push(newGamePiece)

		newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
		newGamePiece_Object = newGamePiece_ObjectArray[0];

		cloneGamePieceLabels = ['Test Label 1','Test Label 1','Test Label 1','Test Label 2','Test Label 3']
		cloneGamePieceOptions = {
			'howMany': 10,
			'objectLabels': cloneGamePieceLabels
		}

		clonedGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, cloneGamePieceOptions)

		_addGameObjectsArray = clonedGamePieceArray.concat(newGamePiece_ObjectArray);
		gamePieceLibString = 'Game Pieces'
		MyGameLibrary.AddLibraryType([gamePieceLibString]);
		_gamePieceLib = _gameLibs[gamePieceLibString];
		_gamePieceLib.AddToLibrary(_addGameObjectsArray)
	})
	it("When the GameObserver is instantiated, gameObject prototypes should contain a reference to that GameObserver", function(){
		var gameObjectProtos = MyGameManager.GetGameObjectProtos();
		var protoKeys = Object.keys(gameObjectProtos);
		var gameObjectTypes = MyGameManager.GetGameObjectTypes();

		for (iiProto = 0; iiProto < protoKeys.length; iiProto++)
		{
			var currentProto = gameObjectProtos[protoKeys[iiProto]];
			expect(currentProto.GetObserver()).toEqual(MyGameObserver);
		}
	})
	it("GameObjects in any gameLibrary should be able to receive a message", function(){

		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray
		}

		var _testGameObserverSendingMessage_NoError = function()
		{
			MyGameObserver.SendMessage(messageObject)	
		}
		expect(_testGameObserverSendingMessage_NoError).not.toThrow();

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			var _currentTestLibLength = _currentTestLib.GetLength();
			var _libObjs = _currentTestLib.GetFromLibrary({'allObjs':true});
			for (iiObject = 0; iiObject < _currentTestLibLength; iiObject++)
			{
				var _currentTestObject = _libObjs[iiObject];
				expect(_currentTestObject.GetProperty('test')).toEqual(false)
			}
		}
		
	})
	it("Messages should be able to be sent to gameObjects in certain libraries", function(){

		var NewerGamePieceLabel = 'newer gamepiece'
		var cloneNewerGamePieceOptions = {
			'howMany': 1,
			'objectLabels':[NewerGamePieceLabel]
		};
		var newerGamePieceObjectArray = MyGameManager.CloneGameObject(newGamePiece_Object, cloneNewerGamePieceOptions);
		var newerGamePieceLibString = 'Newer Game Pieces';
		MyGameLibrary.AddLibraryType([newerGamePieceLibString]);
		var newerGameLib = _gameLibs[newerGamePieceLibString];
		console.log(_gameLibs);
		newerGameLib.AddToLibrary(newerGamePieceObjectArray);

		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'objectLibraries':[newerGamePieceLibString]
			}
		}

		MyGameObserver.SendMessage(messageObject)

		var _currentTestLib = _gameLibs[gamePieceLibString]
		var _currentTestLibLength = _currentTestLib.GetLength();
		var _libObjs = _currentTestLib.GetFromLibrary({'allObjs':true})
		for (iiObject = 0; iiObject < _currentTestLibLength; iiObject++)
		{
			var _currentTestObject = _libObjs[iiObject];
			expect(_currentTestObject.GetProperty('test')).toEqual(true)
		}

		expect(newerGameLib.objectLib[0].GetProperty('test')).toEqual(false)
	})
	it("Messages should be able to be sent to gameObjects with a certain objectLabel", function(){
	
		var messageArray = [];
		
		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}
		var knownObjectLabel = 'Test Label 1' 
		var messageObject = {
			'message': messageArray,
			'receiver':{
				'objectLabels':['Test Label 1']
			}
		}

		MyGameObserver.SendMessage(messageObject)

		var _currentTestLib = _gameLibs[gamePieceLibString];

		for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
		{
			var _currentTestObject = _currentTestLib.objectLib[iiObject];
			if (_currentTestObject.GetLabel() == knownObjectLabel)
			{
				expect(_currentTestObject.GetProperty('test')).toEqual(false);	
			}
			else
			{
				expect(_currentTestObject.GetProperty('test')).toEqual(true);
			}
		}
	})
	it("Messages should be able to be sent to gameObjects of a certain gameObject type", function(){
		var _propArray = [];
		_propArray.push(gamePiece_prop_test);

		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': []
		}


		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)
		MyGameManager.CreateProtoFromExisting(_newTypeArray)

		var awesomeGamePiece = {
			'typeName': gamePieceProto.typeName + 1,
			'objectLabel': '',
			'props': [newGamePiece_prop_test]
		}

		var awesomeGameObjectArray = MyGameManager.CreateGameObject([awesomeGamePiece])
		_gamePieceLib.AddToLibrary(awesomeGameObjectArray);

		var messageArray = [];
		
		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'gameObjectTypes':[awesomeGamePiece.typeName]
			}
		}

		MyGameObserver.SendMessage(messageObject);
		var _currentTestLib = _gameLibs[gamePieceLibString];
		for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
		{
			var _currentTestObject = _currentTestLib.objectLib[iiObject];
			if (_currentTestObject.GetType() == awesomeGamePiece.typeName)
			{
				expect(_currentTestObject.GetProperty('test')).toEqual(false);	
			}
			else
			{
				expect(_currentTestObject.GetProperty('test')).toEqual(true);
			}
		}
	})
	it("GameObjects in any gameLibrary should return the values of their properties when using the Get command", function(){
		var _propArray = [];
		_propArray.push(gamePiece_prop_test);

		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': []
		}


		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)
		MyGameManager.CreateProtoFromExisting(_newTypeArray)

		var awesomeGamePiece = {
			'typeName': gamePieceProto.typeName + 1,
			'objectLabel': '',
			'props': [newGamePiece_prop_test]
		}

		var awesomeGameObjectArray = MyGameManager.CreateGameObject([awesomeGamePiece])
		_gamePieceLib.AddToLibrary(awesomeGameObjectArray);

		var messageArray = [];
		
		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'get'
		}

		var messageObject = {
			'message': messageArray,
		}

		var receivedArray = MyGameObserver.SendMessage(messageObject);
		var receivedArrayLength = receivedArray.length;
		for (iiResponse = 0; iiResponse < receivedArrayLength; iiResponse++)
		{
			var currentResponse = receivedArray[iiResponse];
			expect(currentResponse).toEqual(true);
		}
	})
	it("GameObjects in any gameLibrary should return the value of 'null' when they do not have a property requested by the GameObserver", function(){
		var _propArray = [];
		_propArray.push(gamePiece_prop_test);

		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': []
		}


		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)
		MyGameManager.CreateProtoFromExisting(_newTypeArray)

		var awesomeGamePiece = {
			'typeName': gamePieceProto.typeName + 1,
			'objectLabel': '',
			'props': [newGamePiece_prop_test]
		}

		var awesomeGameObjectArray = MyGameManager.CreateGameObject([awesomeGamePiece])
		_gamePieceLib.AddToLibrary(awesomeGameObjectArray);

		var messageArray = [];
		
		messageArray[0]  = {
			'peer':'value',
			'propertyName':'a property that does not exist',
			'command':'get'
		}

		var messageObject = {
			'message': messageArray,
		}

		var receivedArray = MyGameObserver.SendMessage(messageObject);
		var receivedArrayLength = receivedArray.length;
		for (iiResponse = 0; iiResponse < receivedArrayLength; iiResponse++)
		{
			var currentResponse = receivedArray[iiResponse];
			expect(currentResponse).toEqual(null);
		}

	})
	it("Using the 'set' command, a property's value should be set regardless of peer", function(){
		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)	

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];
				expect(_currentTestObject.GetProperty('test')).toEqual(false);
			}
		}
		
	})
	it("Using the 'add' command with 'property' as the peer will add a property to the gameObject", function(){
		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'property',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': true
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)	

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];
				expect(_currentTestObject.GetProperty(newPropertyString)).toEqual(true);
			}
		}

	})
	it("Using the 'add' command with' property' when a property already exists should not throw an error", function (){
		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'property',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': 1
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)

		var _testGameObserverAddSamePropertyInMessage_NoError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}

		expect(_testGameObserverAddSamePropertyInMessage_NoError).not.toThrow()
	})
	it("Using the 'add' command with 'value' as the peer will add the commandValue to the property's current value", function (){
		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'property',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': 1
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)

		messageArray[0]  = {
			'peer':'value',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': 1
		}

		MyGameObserver.SendMessage(messageObject)	

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];
				expect(_currentTestObject.GetProperty(newPropertyString)).toEqual(2);
			}
		}

	})
	it("Using the 'remove' command with 'property' as peer will remove the property from the gameObject", function (){
		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'property',
			'propertyName':'test',
			'command':'remove',
			'commandValue': null
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];
				var _testCurrentObjectGetPropertyThatWasRemoved_ThrowError = function()
				{
					_currentTestObject.GetProperty('test')
				}
				expect(_testCurrentObjectGetPropertyThatWasRemoved_ThrowError).toThrow('Property test does not exist in object');
			}
		}

	})
	it("Using the 'remove' command with 'value' as the peer will set the property's value to null", function (){

		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'remove',
			'commandValue': null
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)
		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];			
				expect(_currentTestObject.GetProperty('test')).toEqual(null)
			}
		}
	})
	it("Using the 'execute' command with any peer will execute a property as a function", function(){
		var messageArray = [];
		var newFunction = _setThisToFalse;
		function _setThisToFalse()
		{
			return function(){
				this['_masterGameObject'].SetProperty('test', false)
			}
		}
		messageArray[0]  = {
			'peer':'property',
			'propertyName':'SetTestToFalse',
			'command':'add',
			'commandValue': newFunction,
		}

		var messageObject = {
			'message': messageArray
		}

		MyGameObserver.SendMessage(messageObject)

		messageArray[0]  = {
			'peer':'property',
			'propertyName':'SetTestToFalse',
			'command':'execute',
			'commandValue': null
		}
		MyGameObserver.SendMessage(messageObject)

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];	
				expect(_currentTestObject.GetProperty('test')).toEqual(false)
			}
		}	

	})
	it("Using the 'execute' command with any peer on a property that is not a function should throw an error", function(){
		var messageArray = [];
		messageArray[0]  = {
			'peer':'property',
			'propertyName':'test',
			'command':'execute',
			'commandValue': null,
		}

		var messageObject = {
			'message': messageArray
		}

		var _testExecuteCommandOnNonFunction_NoError = function()
		{
			MyGameObserver.SendMessage(messageObject)	
		}
		expect(_testExecuteCommandOnNonFunction_NoError).toThrow();
		
	})
	it("If a message is sent to a gameLibrary, gameObjecttype, and objectLabel that a gameObject is all a part of, the gameObject should only receive the message once", function(){
		var messageArray = [];
		var newPropertyString = 'new property'
		messageArray[0]  = {
			'peer':'property',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': 1
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'objectLabels':['Test Label 1'],
				'objectLibraries':[gamePieceLibString],
				'gameObjectTypes':['gamePiece']
			}
		}

		MyGameObserver.SendMessage(messageObject)

		messageArray[0]  = {
			'peer':'value',
			'propertyName':newPropertyString,
			'command':'add',
			'commandValue': 1
		}
		MyGameObserver.SendMessage(messageObject)

		var gameLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
		{
			var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
			for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
			{
				var _currentTestObject = _currentTestLib.objectLib[iiObject];
				expect(_currentTestObject.GetProperty(newPropertyString)).toEqual(2);
			}
		}

	})
	it("If a message is sent to a library type that doesn't exist, throw an error", function (){

		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'objectLibraries':['type that doesn\'t exist']
			}
		}

		var _testSendMessageToLibraryThatDoesntExist_ToThrow = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageToLibraryThatDoesntExist_ToThrow).toThrow('Library Type ' + 'type that doesn\'t exist' + ' does not exist');	
	})
	it("If a message is sent to a gameObject type that doesn't exist, an error should not be thrown", function (){
		
		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'gameObjectTypes':['type that doesn\'t exist']
			}
		}

		var _testSendMessageToGameObjectTypeThatDoesntExist_NoError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageToGameObjectTypeThatDoesntExist_NoError).not.toThrow();

	})
	it("If a message is sent to an objectLabel that doesn't exist, an error should not be thrown", function (){

		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
			'receiver':{
				'objectLabels':['type that doesn\'t exist']
			}
		}
		MyGameObserver.SendMessage(messageObject)
		var _testSendMessageToObjectLabelThatDoesntExist_NoError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageToObjectLabelThatDoesntExist_NoError).not.toThrow();
	})
	it("If a message is sent without a peer, throw an error",function(){
		var messageArray = [];

		messageArray[0]  = {
			'propertyName':'test',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
		}

		var _testSendMessageWithoutPeer_ThrowError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageWithoutPeer_ThrowError).toThrow('Peer is invalid.');
	})
	it("If a message is sent without a propertyName, throw an error", function(){
		
		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'command':'set',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
		}

		var _testSendMessageWithoutpropertyName_ThrowError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageWithoutpropertyName_ThrowError).toThrow('No propertyName in message');		
	})
	it("If a message is sent without a command, throw an error", function(){
		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'commandValue': false
		}

		var messageObject = {
			'message': messageArray,
		}

		var _testSendMessageWithoutcommand_ThrowError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageWithoutcommand_ThrowError).toThrow('No command in message');		
	})
	it("If a message meant to add a property's value does not contain a commandValue property, throw an error", function(){
		var messageArray = [];

		messageArray[0]  = {
			'peer':'value',
			'propertyName':'test',
			'command':'add'
		}

		var messageObject = {
			'message': messageArray,
		}

		var _testSendMessageIntendedToSetProperty_WithoutcommandValue_ThrowError = function()
		{
			MyGameObserver.SendMessage(messageObject)
		}
		expect(_testSendMessageIntendedToSetProperty_WithoutcommandValue_ThrowError).toThrow('commandValue required when adding to a property\'s value');		
	})
	describe(" -> GameObject Prototype changes propagate to GameObjects", function(){
		it("When a gameObject Prototype adds a property, GameObjects of that prototype should also change accordingly", function (){

			var gameObjectProtos = MyGameManager.GetGameObjectProtos();
			var testObjectProto = gameObjectProtos[gamePieceProto.typeName]

			var newProtoProp =	{
				'propName':'new property',
				'required': false,
				'dataValue': 'boolean',
				'defaultPropValue': true
			};
			testObjectProto.AddProps([newProtoProp])

			var gameLibTypes = MyGameLibrary.GetLibraryTypes();

			for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
			{
				var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
				for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
				{
					var _currentTestObject = _currentTestLib.objectLib[iiObject];
					expect(_currentTestObject.GetProperty(newProtoProp.propName)).toEqual(true);
				}
			}	
		})
		it("When a gameObject Prototype sets a property, GameObjects of that prototype should also change accordingly", function(){

			var gameObjectProtos = MyGameManager.GetGameObjectProtos();
			var testObjectProto = gameObjectProtos[gamePieceProto.typeName]

			var newProtoProp =	{
				'propName':'test',
				'required': false,
				'dataValue': 'number',
				'defaultPropValue': 0
			};
			testObjectProto.SetProps([newProtoProp])

			var gameLibTypes = MyGameLibrary.GetLibraryTypes();

			for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
			{
				var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
				for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
				{
					var _currentTestObject = _currentTestLib.objectLib[iiObject];
					expect(_currentTestObject.GetProperty('test')).toEqual(0);
				}
			}			
		})
		it("When a gameObject prototype removes a property, GameObjects of that prototype should also change accordingly", function (){
			var gameObjectProtos = MyGameManager.GetGameObjectProtos();
			var testObjectProto = gameObjectProtos[gamePieceProto.typeName]


			testObjectProto.RemoveProps(['test'])

			var gameLibTypes = MyGameLibrary.GetLibraryTypes();

			for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
			{
				var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
				for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
				{
					var _currentTestObject = _currentTestLib.objectLib[iiObject];
					var _testGetPropertyAfterMessageFromProtoRemoved_ThrowError = function()
					{
						_currentTestObject.GetProperty('test')	
					}
					expect(_testGetPropertyAfterMessageFromProtoRemoved_ThrowError).toThrow("Property " + 'test' + " does not exist in object");
				}
			}

		})
		it("When a gameObject prototype changes it's name, GameObjects of that prototype should also change their typeNames accordingly", function (){
			var gameObjectProtos = MyGameManager.GetGameObjectProtos();
			var testObjectProto = gameObjectProtos[gamePieceProto.typeName]
			var newTypeNameString = 'new gameObject type name'
			
			testObjectProto.SetTypeName(newTypeNameString)
			
			var gameLibTypes = MyGameLibrary.GetLibraryTypes();

			for (iiLib = 0; iiLib < gameLibTypes.length; iiLib++)
			{
				var _currentTestLib = _gameLibs[gameLibTypes[iiLib]]
				for (iiObject = 0; iiObject < _currentTestLib.objectLib.length; iiObject++)
				{
					var _currentTestObject = _currentTestLib.objectLib[iiObject];
					expect(_currentTestObject.GetType()).toEqual(newTypeNameString)
				}
			}	
		})
	})

})