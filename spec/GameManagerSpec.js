describe("GameManager", function() {
	var MyGameManager;
	var gamePiece_prop_test;

	beforeEach(function(){
		MyGameManager = new GameManager();

		gamePiece_prop_test = {
			'propName':'test',
			'required': false,
			'dataValue': 'boolean',
			'defaultPropValue': false
		};
	})
	it("When an attempt is made to create a gameObject type without including a typeName property in the parameters, throw an error", function (){
		var gamePieceProto = {
			'props':[gamePiece_prop_test]
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var _testCreateGameObjectType_WithoutTypeName = function ()
		{
			MyGameManager.CreateGameObjectType(_typeArray);
		}

		expect(_testCreateGameObjectType_WithoutTypeName).toThrow("Invalid typeName " + undefined);
	})
	it("When an attempt is made to create a gameObject type with an empty typeName is made, throw an error", function (){
		var gamePieceProto = {
			'typeName': '',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var _testCreateGameObjectType_WithoutTypeName = function ()
		{
			MyGameManager.CreateGameObjectType(_typeArray);
		}

		expect(_testCreateGameObjectType_WithoutTypeName).toThrow("Invalid typeName " + '');	
	})
	it("When a gameObject type is created, GetGameObjectTypes() should return a list with that typeName included", function(){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0]

		var _gameObjProtos = MyGameManager.GetGameObjectTypes();

		var newProtoIndex = _gameObjProtos.indexOf(newProtoString);

		expect(newProtoIndex).toBeGreaterThan(-1);

	})
	it("When a gameObject type is created, GetGameObjectProtos() should return a list of references, which should contain the newly created gameObject type", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0]

		var _gameObjProtos = MyGameManager.GetGameObjectProtos();

		var objProto = _gameObjProtos[newProtoString];

		expect(objProto).toBeDefined();
		expect(objProto).not.toBeNull();

	})
	it("When the attempt is made to create a gameObject prototype which contains a property that isn't a valid data type, throw an error", function(){

		var gamePiece_invalidDataValueProp_test = {
			'propName':'test',
			'required': false,
			'dataValue': 'invalid data type',
			'defaultPropValue': false
		}

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_invalidDataValueProp_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var _testInvalidDataValueProp = function() 
		{
			MyGameManager.CreateGameObjectType(_typeArray);
		}

		expect(_testInvalidDataValueProp).toThrow(gamePiece_invalidDataValueProp_test.dataValue + " is an invalid data type " + "\n\r" + "The following data types are valid: " + MyGameManager.GetValidDataTypes().toString())
	})
	it("Given a simple object with a single property, MyGameManager should be able to create an object Prototype succesfully without encountering an error.", function(){
		

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);

		var newProtoString = newProtoStringArray[0]

		var _currentObjProtos = MyGameManager.GetGameObjectProtos();

		var currentObjProto = _currentObjProtos[newProtoString]
		var objProtoProps = currentObjProto.GetProps();

		expect(newProtoString).toEqual(gamePieceProto.typeName);

		expect(currentObjProto.GetTypeName()).toEqual(gamePieceProto.typeName);


	});

	it("Given that a gameObject type has already been created with a certain typeName, another object cannot be then created with the same typeName causing a Throw exception", function(){


		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		
		var sameGamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto, sameGamePieceProto)

		var _testCreateGameObjectThrow = function()
		{
			MyGameManager.CreateGameObjectType(_typeArray)
		}

		expect(_testCreateGameObjectThrow).toThrow("gameObject typeName already exists: " + sameGamePieceProto.typeName)
	});
	it("When an attempt to create a new objectType where the input contains the exact same property name for different properties twice happens, throw an error", function(){
		var gamePiece_prop_samePropNameTest = {
			'propName':'test',
			'required': true,
			'dataValue': 'boolean',
			'defaultPropValue': false
		}

		var samePropNameProto = {
			'typeName': 'gamePiece',
			'props': [gamePiece_prop_samePropNameTest, gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(samePropNameProto)

		var _testSamePropName_CreateGameTypeThrow = function ()
		{
			MyGameManager.CreateGameObjectType(_typeArray);
		}

		expect(_testSamePropName_CreateGameTypeThrow).toThrow(gamePiece_prop_samePropNameTest.propName + " property already exists in prototype gamePiece");

	})
	it("When an attempt is made to set a gameObject prototype's property name to typeName or any variation thereof, throw an error", function(){

		var gamePiece_prop_typeName_test = {
			'propName':'#tyPe&&*N*aM%e',
			'required': false,
			'dataValue': 'boolean',
			'defaultPropValue': false
		};

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_typeName_test]
		}
		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var _testCreateGameObjectType_WithTypeNameProp = function()
		{
			MyGameManager.CreateGameObjectType(_typeArray)
		}

		expect(_testCreateGameObjectType_WithTypeNameProp).toThrow("Cannot name proprety typeName or any variation thereof")
	})
	it("Given an exisiting object, one new gameObject like the original gamObject should be able to be created by using GameManager.CloneGameObject(originalGameObject)", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);

		var newGamePiece_prop_test = {
				'propName': 'test',
				'propValue': true
			}
	
		var newGamePiece = 	{
			'typeName': 'gamePiece',
			'objectLabel':'',
			'props':[newGamePiece_prop_test]
		}

		var _gameObjectArray = []
		_gameObjectArray.push(newGamePiece)

		var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gameObjectArray)	

		var newGamePiece_Object = newGamePiece_ObjectArray[0]

		var clonedGamePieceObject_array = MyGameManager.CloneGameObject(newGamePiece_Object)

		var clonedGamePiece_one = clonedGamePieceObject_array[0]

		var clonedGamePieceOne_type = typeof clonedGamePiece_one

		expect(clonedGamePiece_one).not.toBe(newGamePiece_Object)
		expect(clonedGamePieceOne_type).toBe('object')

	})
	it("Given an exisiting object, many new gameObjects exactly like the original gameObject should be able to be created by using GameManager.CloneGameObject(originalGameObject options.howMany)", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);

		var newGamePiece_prop_test = {
				'propName': 'test',
				'propValue': true
			}
	
		var newGamePiece = 	{
			'typeName': 'gamePiece',
			'objectLabel':'',
			'props':[newGamePiece_prop_test]
		}
		var _gameObjectArray = []
		_gameObjectArray.push(newGamePiece)

		var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gameObjectArray)

		var newGamePiece_Object = newGamePiece_ObjectArray[0];

		var gamePieceAmount = 100;

		var gamePieceCloneOptions = {
			'howMany': gamePieceAmount,
		}	

		var clonedGamePieceObject_array = MyGameManager.CloneGameObject(newGamePiece_Object, gamePieceCloneOptions)

		var checkedCloneObjs = [];

		for (iiClonedObj = 0; iiClonedObj < clonedGamePieceObject_array.length; iiClonedObj++)
		{
			var currentClonedObj = clonedGamePieceObject_array[iiClonedObj];

			var currentClonedObjType = typeof currentClonedObj
			
			expect(currentClonedObj).not.toBe(newGamePiece_Object)
			expect(currentClonedObjType).toBe('object')
			var currentClonedObj_index = checkedCloneObjs.indexOf(currentClonedObj);

			expect(currentClonedObj_index).toBeLessThan(0)

			checkedCloneObjs.push(currentClonedObj);
		}	

	})
	it("When creating multiple objects with GameManager.CloneGameObject, including labels is optional for each object.", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}


		var _typeArray = []
		_typeArray.push(gamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);

		var newGamePiece_prop_test = {
				'propName': 'test',
				'propValue': true
			}
	
		var newGamePiece = 	{
			'typeName': 'gamePiece',
			'objectLabel':'',
			'props':[newGamePiece_prop_test]
		}
		var _gameObjectArray = []
		_gameObjectArray.push(newGamePiece)

		var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gameObjectArray)

		var newGamePiece_Object = newGamePiece_ObjectArray[0];

		var gamePieceAmount = 100;

		var labelPieceAmount = 75;

		var objectLabel_array = []

		for (iiLabel = 0; iiLabel < labelPieceAmount; iiLabel++)
		{
			var newLabelString = 'newLabel';
			newLabelString += iiLabel;
			objectLabel_array.push(newLabelString)
		}

		var gamePieceCloneOptions = {
			'howMany': gamePieceAmount,
			'objectLabels':objectLabel_array
		}	

		var clonedGamePieceObject_array = MyGameManager.CloneGameObject(newGamePiece_Object, gamePieceCloneOptions)

		var checkedCloneObj_Labels = [];

		for (iiClonedObj = 0; iiClonedObj < clonedGamePieceObject_array.length; iiClonedObj++)
		{
			var currentClonedObj = clonedGamePieceObject_array[iiClonedObj];

			var currentClonedObjLabel = currentClonedObj.GetLabel();
			
			var currentClonedObjLabel_index = checkedCloneObj_Labels.indexOf(currentClonedObjLabel);

			expect(currentClonedObjLabel_index).toBeLessThan(0)

			if (currentClonedObjLabel)
			{
				checkedCloneObj_Labels.push(currentClonedObjLabel);
			}
		}

	})
	it("Adding multiple gameObject types in one function call should be possible", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}


		var differentGamePieceProto = {
			'typeName': 'differentGamePiece',
			'props':[gamePiece_prop_test]
		}
		var _typeArray = []
		_typeArray.push(gamePieceProto,differentGamePieceProto)

		var _testAddMultipleGameObjectProtos = function()
		{
			MyGameManager.CreateGameObjectType(_typeArray)
		}
		expect(_testAddMultipleGameObjectProtos).not.toThrow();	

	})
	it("Adding the same protoType typeName in a one function call should throw an error", function(){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var sameGamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		var _typeArray = []
		_typeArray.push(gamePieceProto,sameGamePieceProto)

		var _testAddMultipleGameObjectProtos = function()
		{
			MyGameManager.CreateGameObjectType(_typeArray)
		}
		expect(_testAddMultipleGameObjectProtos).toThrow();	

	})
	it("When multiple protoTypes are added in one function call, it should return their typeNames in an array", function (){
		
		var objProtoCount = 10;

		var _typeArray = []
		var _typeNameArray = []

		for (iiObjProto = 0; iiObjProto < objProtoCount; iiObjProto++)
		{
			var gamePieceProto = {
				'typeName': 'gamePiece' + iiObjProto,
				'props':[gamePiece_prop_test]
			}

			_typeArray.push(gamePieceProto)
			_typeNameArray.push(gamePieceProto.typeName)
		}

		var _gameObjectProtoTypeNameArray = MyGameManager.CreateGameObjectType(_typeArray)

		for (iiTypeName = 0; iiTypeName < _gameObjectProtoTypeNameArray.length; iiTypeName++)
		{
			var currentObjTypeName = _gameObjectProtoTypeNameArray[iiTypeName];
			var objTypeNameIndex = _typeNameArray.indexOf(currentObjTypeName)

			expect(objTypeNameIndex).toBeGreaterThan(-1);
		}
	})
	it("When a gameObject type is created, it's properties should be obtainable through prototype.GetProps()", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var newProto = _gameProtos[newProtoString]

		var protoProps = newProto.GetProps();
		var propKeys = Object.keys(protoProps);

		expect(propKeys.length).toBeGreaterThan(0);

	})
	it("When a gameObject type is created, it's protoType should be able to add new properties via protoType.AddProps() function", function (){
		
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		var _propArray = [];
		var _newPropCount = 10

		for (iiNewProp = 0; iiNewProp < _newPropCount; iiNewProp++)
		{
			var newProtoProp = {
				'propName': 'new property' + iiNewProp ,
				'required': false,
				'dataValue': 'boolean',
				'defaultPropValue': false
			}
			
			_propArray.push(newProtoProp)
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var newProto = _gameProtos[newProtoString]

		newProto.AddProps(_propArray);
		var protoProps = newProto.GetProps();
		var propKeys = Object.keys(protoProps)

		expect(propKeys.length).toEqual(_newPropCount + 1);

	})
	it("When an attempt is made using prototype.AddProps() to add properties that already exist, throw an error", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		var newProtoProp = {
			'propName': 'test',
			'required': false,
			'dataValue': 'boolean',
			'defaultPropValue': false
		}
		var _propArray = [];
		_propArray.push(newProtoProp)

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var newProto = _gameProtos[newProtoString]

		var _testProtoAddExisitingProp_ThrowError = function()
		{
			newProto.AddProps(_propArray)
		}

		expect(_testProtoAddExisitingProp_ThrowError).toThrow(newProtoProp.propName + " property already exists in prototype " + newProtoString)
	})
	it("When prototype.SetProps() is used, it will add new properties or overwriting existing ones if labeld as such in the function parameters", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}
		var newProtoProp = {
			'propName': 'new property',
			'required': false,
			'dataValue': 'boolean',
			'defaultPropValue': false
		}

		var overWriteExistingProp = {
			'propName': gamePiece_prop_test.propName,
			'required': false,
			'dataValue': 'number',
			'defaultPropValue': false
		}

		var _propArray = [];
		_propArray.push(newProtoProp, overWriteExistingProp)

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var newProto = _gameProtos[newProtoString]

		var newProtoProps = newProto.GetProps();
		var _originalPropertyDataValue = newProtoProps[gamePiece_prop_test.propName].dataValue;

		newProto.SetProps(_propArray)

		var _newPropertyDataValue = newProtoProps[gamePiece_prop_test.propName].dataValue;

		expect(_originalPropertyDataValue).not.toEqual(_newPropertyDataValue);
		expect(_newPropertyDataValue).toEqual(overWriteExistingProp.dataValue);

	})
	it("When prototype.GetTypeName is used, it will get the current prototype's typeName", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var newProto = _gameProtos[newProtoString]
		var protoTypeName = newProto.GetTypeName();

		expect(protoTypeName).toEqual(gamePieceProto.typeName);
	})
	it("Given an exisiting gameObject prototype, another prototype should be able to be created using the original as it's base", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var newGamePieceProto_prop = {
			'propName': 'new property',
			'dataValue': 'number',
			'required': false,
			'defaultPropValue': 0
		}

		var _propArray = [];
		_propArray.push(newGamePieceProto_prop)


		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': _propArray
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)

		var newProtoStringArray = MyGameManager.CreateGameObjectType(_typeArray);
		var newProtoString = newProtoStringArray[0];
		var _gameProtos = MyGameManager.GetGameObjectProtos();

		var newerProtoStringArray;

		var _testCreateprotoFromExisting_NoError = function()
		{
			newerProtoStringArray = MyGameManager.CreateProtoFromExisting(_newTypeArray);
		}
		
		expect(_testCreateprotoFromExisting_NoError).not.toThrow();
	})
	it("Given an existing gameObject prototype, another prototype should be able to be created adding or replacing previous properties on the old prototype", function (){
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var newGamePieceProto_prop = {
			'propName': 'test',
			'dataValue': 'number',
			'required': false,
			'defaultPropValue': 0
		}

		var _propArray = [];
		_propArray.push(newGamePieceProto_prop)


		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': _propArray
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)

		MyGameManager.CreateGameObjectType(_typeArray);
		var protoStringArray = MyGameManager.CreateProtoFromExisting(_newTypeArray)

		var _gameProtos = MyGameManager.GetGameObjectProtos();
		var _testProto = _gameProtos[protoStringArray[0]]
		var _protoProps = _testProto.GetProps();
		var _propKeys = Object.keys(_protoProps)
		var _propIndex = _propKeys.indexOf(newGamePieceProto_prop.propName)

		expect(_propIndex).not.toBeLessThan(0)
		expect(_protoProps[_propKeys[_propIndex]].dataValue).toEqual(newGamePieceProto_prop.dataValue)

	})
	it("After a gameObject prototype has been created using GameManager.CreateProtoFromExisting(), a new gameObject should be able to be created using GameManager.CreateGameObject()", function(){
		
		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var newGamePieceProto_prop = {
			'propName': 'new property',
			'dataValue': 'number',
			'required': false,
			'defaultPropValue': 0
		}

		var _propArray = [];
		_propArray.push(newGamePieceProto_prop)


		var newGamePieceProto = {
			'typeName': gamePieceProto.typeName + 1,
			'modelProto': gamePieceProto.typeName,
			'props': _propArray
		}

		var _typeArray = [];
		_typeArray.push(gamePieceProto);

		var _newTypeArray = [];
		_newTypeArray.push(newGamePieceProto)

		MyGameManager.CreateGameObjectType(_typeArray);
		MyGameManager.CreateProtoFromExisting(_newTypeArray);

		var newGamePiece_prop_test = {
			'propName': 'test',
			'propValue': true
		}

		var otherGamePiece_prop_test = {
			'propName': newGamePieceProto_prop.propName,
			'propValue': 1
		}

		var newGamePiece = {
			'typeName':newGamePieceProto.typeName,
			'objectLabel': '',
			'props': [newGamePiece_prop_test, otherGamePiece_prop_test ]
		}

		var _gamePieceArray = []
		_gamePieceArray.push(newGamePiece)

		var _testCreateGameObject_AfterUsingCreateProtoFromExisting_noError = function()
		{
			MyGameManager.CreateGameObject(_gamePieceArray);	
		}

		expect(_testCreateGameObject_AfterUsingCreateProtoFromExisting_noError).not.toThrow()

	})
	describe(" -> gameObject", function(){
		var gamePieceProto;
		var newProtoStringArray;
		var newProtoString;
		var newGamePiece_prop_test;


		beforeEach(function(){
			gamePieceProto = {
				'typeName': 'gamePiece',
				'props':[gamePiece_prop_test]
			}

			var _newTypeArray = [];
			_newTypeArray.push(gamePieceProto)			

			newProtoStringArray = MyGameManager.CreateGameObjectType(_newTypeArray);

			newProtoString = newProtoStringArray[0]

			newGamePiece_prop_test = {
				'propName': 'test',
				'propValue': true
			}


		})
		it("Given an exisiting GameObject with new properties added after it's creation, a new protoType should be able to be created from that gameObject", function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}
			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];
			var newerProp = {
				'propName': 'newer property',
				'propValue': 0
			}

			newGamePiece_Object.AddProperty([newerProp])

			var newProtoFromGameObjectParams = {
				'typeName': 'even newer gamePiece',
				'gameObject': newGamePiece_Object
			}
			var _testCreateProtoFromGameObject_NoError = function()
			{
				MyGameManager.CreateProtoFromGameObject(newProtoFromGameObjectParams);	
			}	
			expect(_testCreateProtoFromGameObject_NoError).not.toThrow();

			var gameProtos = MyGameManager.GetGameObjectProtos();
			var protoKeys = Object.keys(gameProtos);
			expect(protoKeys.indexOf(newProtoFromGameObjectParams.typeName)).not.toBeLessThan(0);

			var newerProto = gameProtos[newProtoFromGameObjectParams.typeName];
			var newerProtoProps = newerProto.GetProps();

			var newerProtoPropKeys = Object.keys(newerProtoProps)

			expect(newerProtoPropKeys.indexOf(newerProp.propName)).not.toBeLessThan(0);

		})
		it("When a prototype is created from a gameObject, the gameObject's typeName should change to the new proto", function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}
			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];
			var newerProp = {
				'propName': 'newer property',
				'propValue': 0
			}

			var newProtoFromGameObjectParams = {
				'typeName': 'even newer gamePiece',
				'gameObject': newGamePiece_Object
			}
			MyGameManager.CreateProtoFromGameObject(newProtoFromGameObjectParams);	

			expect(newGamePiece_Object.GetType()).toEqual(newProtoFromGameObjectParams.typeName)
		})
		it("Given a prototype created from a gameObject, another gameObject should be able to be made from the new prototype", function (){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}
			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newProtoFromGameObjectParams = {
				'typeName': 'even newer gamePiece',
				'gameObject': newGamePiece_Object
			}

			MyGameManager.CreateProtoFromGameObject(newProtoFromGameObjectParams);	

			var newerGamePiece = {
				'typeName': newProtoFromGameObjectParams.typeName,
				'objectLabel':'',
				'props': [newGamePiece_prop_test]
			}
			var _testCreateGameObjectFromProtoTypeFromGameObject_NoError = function()
			{
				MyGameManager.CreateGameObject([newerGamePiece])
			}
			expect(_testCreateGameObjectFromProtoTypeFromGameObject_NoError).not.toThrow();

		})
		it("Given that a gameObject created from a gameObject prototype with a certain property exists, that property's value should be obtainable", function(){	

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}
			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newGamePiece_prop_test.propValue);
		})

		it('Given that a gameObject created from a gameObject prototype with a certain property exists, I should be able to set that property\'s value', function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newGamePiece_prop_test.propValue);
			
			var newValue = false;

			newGamePiece_Object.SetProperty(newGamePiece_prop_test.propName, newValue);

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newValue);
		})

		it("Given that a gameObject prototype exists and using valid input parameters, an object should be able to be created from that prototype", function(){
			

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			expect(newGamePiece_Object.typeName).toEqual(newGamePiece.typeName)
			expect(newGamePiece_Object.DoesPropExist(newGamePiece_prop_test.propName)).toEqual(true)
			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newGamePiece_prop_test.propValue)

		})
		it("Given a gameObject prototype that doesn't exist, an object should not be created. Instead the CreateGameObject() function should throw an error", function(){	


			var badNewGamePiece = {
				'typeName': 'doesnt exist',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}
			var badNewGamePiece_Object;
			
			var _gamePieceArray = []
			_gamePieceArray.push(badNewGamePiece)


			var _testCreateGameObjectThrow = function()
			{
				var badNewGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray)
			}

			expect(_testCreateGameObjectThrow).toThrow();

		})
		it("Given a gameObject prototype that exists containing a property that exists and is required, an error should be thrown when creating an object without that property", function(){
			
			var gamePiece_prop_requiredTest = {
				'propName':'requiredTest',
				'required': true,
				'dataValue': 'boolean',
				'defaultPropValue': false
			}

			var requiredGamePieceProto = {
				'typeName': 'requiredGamePiece',
				'props': [gamePiece_prop_requiredTest, gamePiece_prop_test]
			}

			var newGamePiece = {
				'typeName': 'requiredGamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _newTypeArray = []
			_newTypeArray.push(requiredGamePieceProto)
			
			var requiredGamePiece_ProtoStringArray = MyGameManager.CreateGameObjectType(_newTypeArray);

			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var _testRequiredCreateGameObjectThrow = function ()
			{
				var returnObj = MyGameManager.CreateGameObject(_gamePieceArray)
				return returnObj;
			}

			expect(_testRequiredCreateGameObjectThrow).toThrow("missing the following required properties: requiredTest");

		})
		it("When an attempt is made to create a gameObject with a property that doesn't exist in the gameProtoType happens, throw an error", function(){
			
			var newGamePiece_propNonExist_test = {
				'propName': "donotexist",
				'propValue': false
			}

			var newGamePiece = {
				'typeName':'gamePiece',
				'objectLabel':'',
				'props':[newGamePiece_propNonExist_test]
			}

			var _gamePieceArray = []
			_gamePieceArray.push(newGamePiece)

			var _testCreateGameObjectWithNonExistentProp = function()
			{
				MyGameManager.CreateGameObject(_gamePieceArray)
			}

			expect(_testCreateGameObjectWithNonExistentProp).toThrow(newGamePiece_propNonExist_test.propName + " does not exist in GameObject Type " + newGamePiece.typeName);

		})
		it("When an attempt is made to create a gameObject with a property which contains a dataValue that does not match it's gameObject prototype's, throw an error", function(){

			var newGamePiece_propInvalidDataValue_test = {
				'propName': "test",
				'propValue': 4
			}

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_propInvalidDataValue_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var _testCreateGameObjectWithInvalidDataType = function ()
			{
				MyGameManager.CreateGameObject(_gamePieceArray)	
			}
			
			expect(_testCreateGameObjectWithInvalidDataType).toThrow("boolean and number are not equal types.")

		})
		it("After succesfully creating a gameObject from a gameObject prototype, it's label should be setable", function(){


			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newLabelString = 'this is my new label';
			newGamePiece_Object.SetLabel(newLabelString);
			var myNewLabel = newGamePiece_Object.GetLabel();

			expect(myNewLabel).toEqual(newLabelString);

		})
		it("When a gameObject of any prototype is created with a label, it should be obtainable by the newly created object", function(){

			var funNewLabel = 'I made this label while creating the object'
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': funNewLabel,
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var currentLabel = newGamePiece_Object.GetLabel();

			expect(currentLabel).toEqual(newGamePiece.objectLabel);
		})
		it("When an attempt is made to set a gameObject's type to a type that doesn't exist, throw an error", function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];


			var _invalidTypeName = 'A type I know does not exist'
			var _testGameObjectSetTypeToInvalid = function()
			{
				newGamePiece_Object.SetType(_invalidTypeName)
			}

			expect(_testGameObjectSetTypeToInvalid).toThrow("typeName " + _invalidTypeName + " is not an exisiting gameObject prototype typeName.")

		})
		it("Given a gameObject created from an exisiting prototype, that gameObject should be able to add a property to itself", function (){

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newGamePieceProp = {
				'propName':'newTestProperty',
				'propValue':true
			}

			var _gamePropArray = []
			_gamePropArray.push(newGamePieceProp)

			newGamePiece_Object.AddProperty(_gamePropArray)

			expect(newGamePiece_Object.DoesPropExist(newGamePieceProp.propName)).toEqual(true);
			expect(newGamePiece_Object.GetProperty(newGamePieceProp.propName)).toEqual(true);

		})
		it("Given a gameObject created from an exisiting prototype, that gameObject should be able to add a property with spaces in them", function (){

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newGamePieceProp = {
				'propName':'new Test property with SPACES!',
				'propValue':true
			}

			var _gamePropArray = []
			_gamePropArray.push(newGamePieceProp)

			 

			newGamePiece_Object.AddProperty(_gamePropArray);
			expect(newGamePiece_Object.DoesPropExist(newGamePieceProp.propName)).toEqual(true);
			expect(newGamePiece_Object.GetProperty(newGamePieceProp.propName)).toEqual(true);

		})
		it("Given a gameObject created from an existing prototype, that gameObject should be able to add multiple properties to itself", function(){

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newGamePieceProp_count = 10;

			var _gamePropArray = []

			var _propNameArray = []

			for (iiNewGamePieceProp = 0; iiNewGamePieceProp < newGamePieceProp_count; iiNewGamePieceProp++)
			{
				var newGamePieceProp = {
					'propName':'newTestProperty ' + iiNewGamePieceProp,
					'propValue':iiNewGamePieceProp
				}
				_propNameArray.push(newGamePieceProp.propName)
				_gamePropArray.push(newGamePieceProp)
			}
			newGamePiece_Object.AddProperty(_gamePropArray)

			for(iiTestProp = 0 ; iiTestProp < newGamePieceProp_count; iiTestProp++)
			{
				var _currentTestPropName = _propNameArray[iiTestProp];

				var currentPropKey = _currentTestPropName.charAt(_currentTestPropName.length - 1)

				expect(newGamePiece_Object.DoesPropExist(_currentTestPropName)).toEqual(true);
				expect(newGamePiece_Object.GetProperty(_currentTestPropName).toString()).toEqual(currentPropKey);
			}


		})
		it("Given a gameObject created from an existing prototype, that gameObject should not be able to add new properties of the same property name without throwing an error.", function (){

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var _gamePieceArray = [];
			_gamePieceArray.push(newGamePiece);

			var newGamePiece_ObjectArray = MyGameManager.CreateGameObject(_gamePieceArray);
			var newGamePiece_Object = newGamePiece_ObjectArray[0];

			var newGamePieceProp = {
				'propName':'test',
				'propValue':true
			}

			var _gamePropArray = []

			_gamePropArray.push(newGamePieceProp)

			var _testAddPropToExistingObjectWithExistingProp_Throw = function ()
			{
				newGamePiece_Object.AddProperty(_gamePropArray)
			}

			expect(_testAddPropToExistingObjectWithExistingProp_Throw).toThrow(newGamePieceProp.propName + " already exists in object " + newGamePiece_Object)

		})
	})

	
})