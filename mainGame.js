var mainGame = (function () {
	function mainGame(){

	}

	TurbulenzEngine = WebGLTurbulenzEngine.create({
						canvas: document.getElementById("mainCanvas")
	});

	TurbulenzEngine.onerror = function gameErrorFn (msg)
	{
		window.alert(msg)
	}

	var graphicsDevice = TurbulenzEngine.createGraphicsDevice({})

	var draw2d = Draw2D.create
	({
		graphicsDevice: graphicsDevice
	})

	

	var MyGameManager = new GameManager();
	var MyGameLibrary = new GameLibrary();
	var MyGameObserver = new GameObserver(MyGameLibrary,MyGameManager);

	var gamePiece_prop_positionX = {
		'propName':'positionX',
		'required': true,
		'dataValue': 'number',
		'defaultPropValue': 0
	}
	var gamePiece_prop_positionY = {
		'propName':'positionY',
		'required': true,
		'dataValue': 'number',
		'defaultPropValue': 0
	}

	var gamePieceProto = {
		'typeName': 'gamePiece',
		'props':[gamePiece_prop_positionX, gamePiece_prop_positionY]
	}

	var gamePieceProto_stringName = MyGameManager.CreateGameObjectType(gamePieceProto);


	var newGamePiece_positionX_prop = {
		'propName': 'positionX',
		'propValue': 0
	}

	var newGamePiece_positionY_prop = {
		'propName': 'positionY',
		'propValue': 0
	}

	var newGamePiece_Test = {
		'typeName' : 'gamePiece',
		'objectLabel':'my new test game piece',
		'props':[newGamePiece_positionX_prop,newGamePiece_positionY_prop]
	}

	var newGamePieceObject = MyGameManager.CreateGameObject(newGamePiece_Test)

	console.log(newGamePieceObject.GetProperty('positionY'))

	var testGamePiece_libName = MyGameLibrary.AddLibraryType('TestGamePiece');

	var newGamePiece_Id = MyGameLibrary.AddToLibrary(testGamePiece_libName, newGamePieceObject);
	
	var player_HealthProp = {
		'propName': 'positionx',
		'required': true,
		'dataValue': 'number',
		'defaultPropValue': 0,
		'command': 'add'
	}
	var playerGamePiece_Proto = {
		'typeName': 'playerGamePiece',
		'props': [player_HealthProp]
	}

	var playerGamePiece_Proto_Name = MyGameManager.CreateProtoFromExisting(gamePieceProto_stringName, playerGamePiece_Proto)


	var evenNewerTestGamePieceObject_InColor = MyGameManager.CloneGameObject(newGamePieceObject, 'In Color')

	console.log(evenNewerTestGamePieceObject_InColor.GetAllProperties(), newGamePieceObject.GetAllProperties())
	console.log(evenNewerTestGamePieceObject_InColor.GetLabel(), newGamePieceObject.GetLabel())


	


	function update()
	{

		if (graphicsDevice.beginFrame())
		{
			var bgColor = [0,1,1,0];
			graphicsDevice.clear(bgColor, 1.0)
			/* Render Code */
			draw2d.begin()
			draw2d.end()

			graphicsDevice.endFrame();
		}
	}
	TurbulenzEngine.setInterval(update, 1000 / 60)
})

function purifyString(inputString)
{
	inputString = replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}