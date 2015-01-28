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

	var MyGameLibrary = new GameLibrary();

	var MyGameManager = new GameManager();

	var gamePieceObjParams = {
		typeName: 'gamePiece'
		props:{
			pieceName:{
				required: true;
				
			}
		}
	}

	var newGamePiece = MyGameManager.CreateGame

	var testTypeNameString = MyGameLibrary.AddLibraryType('gamePiece')
	var myGamePieceLibrary = MyGameLibrary.GetLibraryFromType('gamePiece')
	console.log(myGamePieceLibrary);
	MyGameLibrary.RemoveLibraryType(testTypeNameString.returnTypeName);
	myGamePieceLibrary = MyGameLibrary.GetLibraryFromType('gamePiece')
	console.log(myGamePieceLibrary);




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