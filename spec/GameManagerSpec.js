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

		expect(_testInvalidDataValueProp).toThrow(gamePiece_invalidDataValueProp_test.dataValue + " is not a valid data type n00b. Try again. " + "\n\r" + MyGameManager.GetValidDataTypes())
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

		expect(newProtoString).toEqual(gamePieceProto.typeName);

		expect(currentObjProto.typeName).toEqual(gamePieceProto.typeName);


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

		expect(_testCreateGameObjectThrow).toThrow("gameObject Type " + sameGamePieceProto.typeName + " already exists")
	});
	it("When an attempt to create a new objectType where the input contains the exact same property name for different properties twice happens, throw an error", function(){
		var gamePiece_prop_samePropNameTest = {
			'propName':'test',
			'required': true,
			'dataValue': 'boolean',
			'defaultPropValue': false
		}

		var samePropNameProto = {
			'typeName': 'typeName ',
			'props': [gamePiece_prop_samePropNameTest, gamePiece_prop_test]
		}

		var _typeArray = []
		_typeArray.push(samePropNameProto)

		var _testSamePropName_CreateGameTypeThrow = function ()
		{
			MyGameManager.CreateGameObjectType(_typeArray);
		}

		expect(_testSamePropName_CreateGameTypeThrow).toThrow("Property " + gamePiece_prop_test.propName + " already exists in prototype. Check input object for same property names.");

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

		expect(_testCreateGameObjectType_WithTypeNameProp).toThrow("Cannot name property typeName (regardless of capitalization or trickery). Make sure if you're setting the type name in the params.props variable to set it in params.typeName")
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

		it("Given that a gameObject created from a gameObject protoype with a certain property exists, that property's value should be obtainable", function(){	

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