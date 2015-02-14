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
		it("Given the attempt that an input for GameLibrary.AddToLibrary() contains a libraryType property that doesn't exist or is undefined, an error should be thrown", function (){

			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object
			}

			var _addtoLibArray = []

			_addtoLibArray.push(_addtoLibParams)

			MyGameLibrary.AddLibraryType(libStringArray);


			var _testAddGameObjectToLibrary = function ()
			{
				MyGameLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testAddGameObjectToLibrary).toThrow("Library type " + undefined + " does not exist");
		})
		it("Given the attempt that an input for GameLibrary.AddToLibrary() contains a libraryType property that's an empty string, an error should be thrown", function (){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object,
				'libraryType':''
			}

			var _addtoLibArray = []

			_addtoLibArray.push(_addtoLibParams)

			MyGameLibrary.AddLibraryType(libStringArray);


			var _testAddGameObjectToLibrary = function ()
			{
				MyGameLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testAddGameObjectToLibrary).toThrow("Library type " + '' + " does not exist");
		})
		it("Given the attempt that an input for GameLibrary.AddToLibrary() contains a libraryType property that's null, an error should be thrown", function () {
	
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object,
				'libraryType':null
			}

			var _addtoLibArray = []

			_addtoLibArray.push(_addtoLibParams)

			MyGameLibrary.AddLibraryType(libStringArray);


			var _testAddGameObjectToLibrary = function ()
			{
				MyGameLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testAddGameObjectToLibrary).toThrow("Library type " + null + " does not exist");	
		})
		it("Given an existing gameObject, it's reference should be able to be stored in a game library using GameLibrary.AddToLibrary()", function(){
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object,
				'libraryType': _newGameLibString
			}

			var _addtoLibArray = []

			_addtoLibArray.push(_addtoLibParams)

			MyGameLibrary.AddLibraryType(libStringArray);


			var _testAddGameObjectToLibrary = function ()
			{
				MyGameLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testAddGameObjectToLibrary).not.toThrow();

			var _currentLibs = MyGameLibrary.GetLibrary(libStringArray)

			var testLibrary = _currentLibs[libStringArray[0]];

			expect(testLibrary.objectLib[0]).toEqual(newGamePiece_Object);
		})
		it("Given a gameObject has been added to a game Library, it should be able to be removed using GameLibrary.RemoveFromLibrary() function", function (){
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object,
				'libraryType': _newGameLibString
			}

			var _addtoLibArray = []

			_addtoLibArray.push(_addtoLibParams)


			MyGameLibrary.AddLibraryType(libStringArray);

			MyGameLibrary.AddToLibrary(_addtoLibArray);

			var _libGameObjArray = [newGamePiece_Object]


			var _testGameLibraryRemoveFromLibraryFunction = function()
			{
				MyGameLibrary.RemoveFromLibrary(_addtoLibArray)	
			}

			expect(_testGameLibraryRemoveFromLibraryFunction).not.toThrow();

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			expect(_libArray[libStringArray[0]].objectLib.length).not.toBeGreaterThan(0)

		})
		it("Given multple existing gameObjects, their references should be able to be stored in a game library using GameLibrary.AddToLibrary()", function(){
			
			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);
			var _cloneOptions = {
				'howMany': 10
			}
			var _cloneNewGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, _cloneOptions);
			
			var _addtoLibParamsArray = [];

			for (iiCloneObj = 0; iiCloneObj < _cloneNewGamePieceArray.length; iiCloneObj++)
			{
				var _addToLibParams = {
					'inputObject': _cloneNewGamePieceArray[iiCloneObj],
					'libraryType': _newGameLibString
				}

				_addtoLibParamsArray.push(_addToLibParams);
			}

			MyGameLibrary.AddLibraryType(libStringArray);
			
			var _testLibraryAddToLibraryMultipleObjectsFunction = function()
			{
				MyGameLibrary.AddToLibrary(_addtoLibParamsArray);
			}

			expect(_testLibraryAddToLibraryMultipleObjectsFunction).not.toThrow();

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)
			var testLibrary = _libArray[libStringArray];

			expect(testLibrary.objectLib.length).toEqual(_addtoLibParamsArray.length);

		})
		it("Given multiple existing gameObjects that have been added to a game Library, they should be able to be removed using GameLibrary.RemoveFromLibary() function ", function (){

			var _newGameLibString = 'Game Pieces'
			var libStringArray = []
			libStringArray.push(_newGameLibString);
			var _cloneOptions = {
				'howMany': 10
			}
			var _cloneNewGamePieceArray = MyGameManager.CloneGameObject(newGamePiece_Object, _cloneOptions);

			var _addtoLibParamsArray = [];

			for (iiCloneObj = 0; iiCloneObj < _cloneNewGamePieceArray.length; iiCloneObj++)
			{
				var _addToLibParams = {
					'inputObject': _cloneNewGamePieceArray[iiCloneObj],
					'libraryType': _newGameLibString
				}

				_addtoLibParamsArray.push(_addToLibParams);
			}

			MyGameLibrary.AddLibraryType(libStringArray);

		 	MyGameLibrary.AddToLibrary(_addtoLibParamsArray);
			

			var _testGameLibraryRemoveFromLibraryMultipleObjectsFunction = function()
			{
				MyGameLibrary.RemoveFromLibrary(_addtoLibParamsArray)	
			}

			expect(_testGameLibraryRemoveFromLibraryMultipleObjectsFunction).not.toThrow();

			var _libArray = MyGameLibrary.GetLibrary(libStringArray)

			expect(_libArray[_newGameLibString].objectLib.length).not.toBeGreaterThan(0)

		})
		it("Given an exisiting gameObject already in a library, it cannot be added again using GameLibrary.AddToLibrary() again without throwing an error", function (){
			var _newGameLibString = 'Game Pieces'

			var libStringArray = []
			libStringArray.push(_newGameLibString);

			var _addtoLibParams = {
				'inputObject':newGamePiece_Object,
				'libraryType': _newGameLibString
			}
			var _addtoLibArray = []
			_addtoLibArray.push(_addtoLibParams)


			MyGameLibrary.AddLibraryType(libStringArray);
			MyGameLibrary.AddToLibrary(_addtoLibArray);

			var _testGameLibraryAddObjectThatAlreadyExists_ThrowError = function() 
			{
				MyGameLibrary.AddToLibrary(_addtoLibArray);
			}
			expect(_testGameLibraryAddObjectThatAlreadyExists_ThrowError).toThrow("Object " + newGamePiece_Object + " already exists in library " + _newGameLibString)
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

			expect(testLibrary.objectLib.length).toEqual(0);
			
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

			expect(testLibrary.objectLib.length).toEqual(0);

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
			expect(_testGameLibraryAddObjectThatAlreadyExists_ThrowError).toThrow("Object " + newGamePiece_Object + " already exists in library " + _newGameLibString)

		})


	})
})