describe("GameLibrary", function(){
	var MyGameLibrary;
	var MyGameManager;
	beforeEach(function() {
		MyGameLibrary = new GameLibrary();
		MyGameManager = new GameManager();

	})

	it("A library type should be added when using GameLibrary.AddLibraryType()", function (){

		var newLibraryString = "My New Library"
		var _testAddLibraryType = function()
		{
			MyGameLibrary.AddLibraryType([newLibraryString])	
		}

		expect(_testAddLibraryType).not.toThrow();

		var libTypes = MyGameLibrary.GetLibraryTypes();

		expect(libTypes.indexOf(newLibraryString)).not.toBeLessThan(0);
	})
	it("Multiple library types should be able to be added using GameLibrary.AddLibraryType()", function (){

		var libraryStringCount = 10;

		var libraryTypeArray = []
		for (iiLibString = 0; iiLibString < libraryStringCount; iiLibString++)
		{
			libraryTypeArray.push("new library" + iiLibString)
		}

		var _testAddLibrarTypeMultipleTypes = function()
		{
			MyGameLibrary.AddLibraryType(libraryTypeArray);	
		}
		expect(_testAddLibrarTypeMultipleTypes).not.toThrow();

		var libTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLibType = 0; iiLibType < libraryStringCount; iiLibType++)
		{
			var libTypeIndex = libraryTypeArray.indexOf(libTypes[iiLibType])
			expect(libTypeIndex).not.toBeLessThan(0);
		}

	})
	it("A library type should be able to be removed using GameLibrary.RemoveLibraryType().", function(){

		var newLibraryString = "My New Library"
		MyGameLibrary.AddLibraryType([newLibraryString])	
		var libTypes = MyGameLibrary.GetLibraryTypes();

		var newLibIndex = libTypes.indexOf(newLibraryString);

		expect(newLibIndex).not.toBeLessThan(0);

		MyGameLibrary.RemoveLibraryType([newLibraryString])

		var newLibTypes = MyGameLibrary.GetLibraryTypes();
		var libIndex = newLibTypes.indexOf(newLibraryString);

		expect(libIndex).toBeLessThan(0);

	})
	it("Multiple types should be able to be removed using GameLibrary.RemoveLibraryType().", function (){
		var libraryStringCount = 10;

		var libraryTypeArray = []
		for (iiLibString = 0; iiLibString < libraryStringCount; iiLibString++)
		{
			libraryTypeArray.push("new library" + iiLibString)
		}

		MyGameLibrary.AddLibraryType(libraryTypeArray);	
		MyGameLibrary.RemoveLibraryType(libraryTypeArray)
		var newLibTypes = MyGameLibrary.GetLibraryTypes();

		for (iiLibType = 0; iiLibType < libraryStringCount; iiLibType++)
		{
			var libTypeIndex = newLibTypes.indexOf(libraryTypeArray[iiLibType])
			expect(libTypeIndex).toBeLessThan(0);
		}

	})
	it("When the attempt is made to remove a library type that doesn't exist, an error should be thrown", function (){
		var newLibraryString = "My New Library"

		var _testGameLibraryRemoveLibraryTypeThatDoesntExist_ThrowError = function()
		{
			MyGameLibrary.RemoveLibraryType([newLibraryString])
		}

		expect(_testGameLibraryRemoveLibraryTypeThatDoesntExist_ThrowError).toThrow(newLibraryString + " libraryType does not exist")

	})
	it("When a library type is added, it's name should be returned when using GameLibrary.GetLibraryTypes", function(){
		var newLibraryString = "My New Library"
		MyGameLibrary.AddLibraryType([newLibraryString])	
		var libTypes = MyGameLibrary.GetLibraryTypes();
		var newLibTypes = MyGameLibrary.GetLibraryTypes();

		var newLibIndex = libTypes.indexOf(newLibraryString);

		expect(newLibIndex).not.toBeLessThan(0);
	})
	it("When a library type is added, it should be returned when using GameLibrary.GetLibraries", function (){
		var newLibraryString = "My New Library"
		MyGameLibrary.AddLibraryType([newLibraryString])	

		var _gameLibraries = MyGameLibrary.GetLibraries();
		var libraryNames = Object.keys(_gameLibraries) 

		expect(libraryNames.indexOf(newLibraryString)).not.toBeLessThan(0);
	})
	it("Given the attempt to add a library type that already exists, an error should be thrown", function (){
		var newLibraryString = "My New Library"
		MyGameLibrary.AddLibraryType([newLibraryString])

		var _testAddLibraryTypeThatAlreadyExists_ThrowError = function()
		{
			MyGameLibrary.AddLibraryType([newLibraryString])	
		}

		expect(_testAddLibraryTypeThatAlreadyExists_ThrowError).toThrow(newLibraryString + ' libraryType already exists')

	})
	it("Given the attempt to add a library type that is undefined, an error should be thrown", function (){
		var newLibraryString;
		var _testAddLibrarTypeThatIsUndefined_ThrowError = function()
		{
			MyGameLibrary.AddLibraryType([newLibraryString])	
		}
		expect(_testAddLibrarTypeThatIsUndefined_ThrowError).toThrow("libraryType is invalid: " + newLibraryString)

	})
	it("Given the attempt to add a library type that is null, an error should be thrown", function (){
		var newLibraryString = null;
		var _testAddLibrarTypeThatIsNull_ThrowError = function()
		{
			MyGameLibrary.AddLibraryType([newLibraryString])	
		}
		expect(_testAddLibrarTypeThatIsNull_ThrowError).toThrow("libraryType is invalid: " + newLibraryString)

	})
	it("Given the attempt to add a library type that is an empty string, an error should be thrown", function () {
		var newLibraryString = '';
		var _testAddLibrarTypeThatIsAnEmptyString_ThrowError = function()
		{
			MyGameLibrary.AddLibraryType([newLibraryString])	
		}
		expect(_testAddLibrarTypeThatIsAnEmptyString_ThrowError).toThrow("libraryType is invalid: " + newLibraryString)		
	})
	it("Given the attempt that invalid input is used for a library's AddToLibrary() function, an error should be thrown", function (){
		var _newGameLibString = 'Game Pieces'
		var libStringArray = []
		libStringArray.push(_newGameLibString);

		MyGameLibrary.AddLibraryType(libStringArray);

		var _libArray = MyGameLibrary.GetLibrary(libStringArray);

		var testLibrary = _libArray[_newGameLibString];

		var _randomObject = {}

		var _randomFunction = function(){};

		var _testLibraryAddToLibraryInvalidInputString_ThrowError = function()
		{
			testLibrary.AddToLibrary(_newGameLibString);
		}
		var _testLibraryAddToLibraryInvalidInputNumber_ThrowError = function()
		{
			testLibrary.AddToLibrary(0);
		}
		var _testLibraryAddToLibraryInvalidInputObject_ThrowError = function()
		{
			testLibrary.AddToLibrary(_randomObject);
		}
		var _testLibraryAddToLibraryInvalidInputFunction_ThrowError = function()
		{
			testLibrary.AddToLibrary(_randomFunction);
		}
		var _testLibraryAddToLibraryInvalidInputBoolean_ThrowError = function()
		{
			testLibrary.AddToLibrary(true)
		}
		var _testLibraryAddToLibraryInvalidInputUndefined_ThrowError = function()
		{
			testLibrary.AddToLibrary(undefined)
		}

		expect(_testLibraryAddToLibraryInvalidInputNumber_ThrowError).toThrow("Parameter is invalid.")
		expect(_testLibraryAddToLibraryInvalidInputUndefined_ThrowError).toThrow("Parameter is invalid.")
	})
	describe(" -> gameObjects", function(){
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


		beforeEach(function(){
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
			_newTypeArray.push(gamePieceProto)			

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

		})
		it("Given an exisiting gameObject, it's reference should be able to be stored in a game library using the library's AddToLibrary() function", function (){
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);



			var _addtoLibArray = []

			_addtoLibArray.push(newGamePiece_Object)


			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			var testLibrary = _libArray[libStringArray];

			var _testLibraryAddToLibraryFunction = function()
			{
				testLibrary.AddToLibrary(_addtoLibArray);
			}

			expect(_testLibraryAddToLibraryFunction).not.toThrow();
		})
		it("Given an exisiting gameObject already in a library, it should be able to be removed using that library's RemoveFromLibrary() function", function (){

			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibArray = []

			_addtoLibArray.push(newGamePiece_Object)


			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			var testLibrary = _libArray[libStringArray];

			testLibrary.AddToLibrary(_addtoLibArray);
			var _testLibraryRemomveFromLibraryMultipleObjectsFunction = function() 
			{
				testLibrary.RemoveFromLibrary(_addtoLibArray)
			}

			expect(_testLibraryRemomveFromLibraryMultipleObjectsFunction).not.toThrow();

			expect(testLibrary.GetLength()).toEqual(0);
			
		})
		it("When a gameObject is removed from a library using it's RemoveFromLibrary() function, it should be returned by the function", function(){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibArray = []

			_addtoLibArray.push(newGamePiece_Object)


			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			var testLibrary = _libArray[libStringArray];

			testLibrary.AddToLibrary(_addtoLibArray);
			var _returnObjArray = testLibrary.RemoveFromLibrary(_addtoLibArray)

			expect(_returnObjArray[0]).toEqual(newGamePiece_Object);
			

		})
		it("Given multiple gameObjects existing, their references should be abled to be stored in a game library using the library's AddToLibrary() function", function (){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);
			var _cloneOptions = {
				'howMany': 10
			}
			var _cloneNewGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, _cloneOptions);
			
			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)
			var testLibrary = _libArray[libStringArray];
			
			var _testLibraryAddToLibraryMultipleObjectsFunction = function()
			{
				testLibrary.AddToLibrary(_cloneNewGamePieceArray);
			}

			expect(_testLibraryAddToLibraryMultipleObjectsFunction).not.toThrow();

		})
		it("Given multiple gameObjects already in a library, their references should be able to be removed using the library's RemoveFromLibrary() function", function (){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);
			var _cloneOptions = {
				'howMany': 10
			}
			var _cloneNewGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, _cloneOptions);
			
			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)
			var testLibrary = _libArray[libStringArray];
			
			testLibrary.AddToLibrary(_cloneNewGamePieceArray);
			testLibrary.RemoveFromLibrary(_cloneNewGamePieceArray);

			expect(testLibrary.GetLength()).toEqual(0);

		})
		it("When multiple gameobjects are removed from a library, they should all be returned by the function", function (){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);
			var _cloneOptions = {
				'howMany': 10
			}
			var _cloneNewGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, _cloneOptions);
			
			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)
			var testLibrary = _libArray[libStringArray];
			
			testLibrary.AddToLibrary(_cloneNewGamePieceArray);
			var _returnObjArray = testLibrary.RemoveFromLibrary(_cloneNewGamePieceArray);

			for (iiReturnObj = 0; iiReturnObj < _returnObjArray.length; iiReturnObj++)
			{
				var currentReturnObj = _returnObjArray[iiReturnObj];
				var returnObjIndex = _cloneNewGamePieceArray.indexOf(currentReturnObj);
				expect(returnObjIndex).not.toBeLessThan(0)
			}

		})
		it("Given an exisiting gameObject in a library, that gameObject cannot be added again using the library's AddToLibrary() function without throwing an error", function (){
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibArray = []

			_addtoLibArray.push(newGamePiece_Object)


			MyGameLibrary.AddLibraryType(libStringArray);

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			var testLibrary = _libArray[libStringArray];

			testLibrary.AddToLibrary(_addtoLibArray);
			var _testGameLibraryAddObjectThatAlreadyExists_ThrowError = function() 
			{
				testLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testGameLibraryAddObjectThatAlreadyExists_ThrowError).toThrow("Object " + newGamePiece_Object.typeName + " already exists in library " + _newGameLibString)

		})

	})
})