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

		var newProtoString = MyGameManager.CreateGameObjectType(gamePieceProto);

		var _gameObjProtos = MyGameManager.GetGameObjectTypes();

		var newProtoIndex = _gameObjProtos.indexOf(newProtoString);

		expect(newProtoIndex).toBeGreaterThan(-1);

	})
	it("When a gameObject type is created, GetGameObjectProtos() should return a list of references, which should contain the newly created gameObject type", function(){

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var newProtoString = MyGameManager.CreateGameObjectType(gamePieceProto);

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

		var _testInvalidDataValueProp = function() 
		{
			MyGameManager.CreateGameObjectType(gamePieceProto);
		}

		expect(_testInvalidDataValueProp).toThrow(gamePiece_invalidDataValueProp_test.dataValue + " is not a valid data type n00b. Try again. " + "\n\r" + MyGameManager.GetValidDataTypes())
	})
	it("Given a simple object with a single property, MyGameManager should be able to create an object Prototype succesfully without encountering an error.", function(){
		

		var gamePieceProto = {
			'typeName': 'gamePiece',
			'props':[gamePiece_prop_test]
		}

		var newProtoString = MyGameManager.CreateGameObjectType(gamePieceProto);

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
		var newProtoString = MyGameManager.CreateGameObjectType(gamePieceProto);

		var _testCreateGameObjectThrow = function()
		{
			MyGameManager.CreateGameObjectType(sameGamePieceProto)
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
			'typeName': 'requiredGamePiece',
			'props': [gamePiece_prop_samePropNameTest, gamePiece_prop_test]
		}
		

		var _testSamePropName_CreateGameTypeThrow = function ()
		{
			MyGameManager.CreateGameObjectType(samePropNameProto);
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

		var _testCreateGameObjectType_WithTypeNameProp = function()
		{
			MyGameManager.CreateGameObjectType(gamePieceProto)
		}

		expect(_testCreateGameObjectType_WithTypeNameProp).toThrow("Cannot name property typeName (regardless of capitalization or trickery). Make sure if you're setting the type name in the params.props variable to set it in params.typeName")
	})

	describe(" -> gameObject", function(){
		var gamePieceProto;
		var newProtoString;
		var newGamePiece_prop_test;


		beforeEach(function(){
			gamePieceProto = {
				'typeName': 'gamePiece',
				'props':[gamePiece_prop_test]
			}

			newProtoString = MyGameManager.CreateGameObjectType(gamePieceProto);

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

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece)

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newGamePiece_prop_test.propValue);
		})

		it('Given that a gameObject created from a gameObject prototype with a certain property exists, I should be able to set that property\'s value', function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece)

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newGamePiece_prop_test.propValue)
			
			var newValue = false;

			newGamePiece_Object.SetProperty(newGamePiece_prop_test.propName, newValue)

			expect(newGamePiece_Object.GetProperty(newGamePiece_prop_test.propName)).toEqual(newValue)
		})

		it("Given that a gameObject prototype exists and using valid input parameters, an object should be able to be created from that prototype", function(){
			

			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece)

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

			var _testCreateGameObjectThrow = function()
			{
				newGamePiece_Object = MyGameManager.CreateGameObject(badNewGamePiece)
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
			
			var requiredGamePiece_ProtoString = MyGameManager.CreateGameObjectType(requiredGamePieceProto);

			var _testRequiredCreateGameObjectThrow = function ()
			{
				var returnObj = MyGameManager.CreateGameObject(newGamePiece)
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

			var _testCreateGameObjectWithNonExistentProp = function()
			{
				MyGameManager.CreateGameObject(newGamePiece)
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

			var _testCreateGameObjectWithInvalidDataType = function ()
			{
				MyGameManager.CreateGameObject(newGamePiece)	
			}
			
			expect(_testCreateGameObjectWithInvalidDataType).toThrow("boolean and number are not equal types.")

		})
		it("After succesfully creating a gameObject from a gameObject prototype, it's label should be setable", function(){


			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece);

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

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece);

			var currentLabel = newGamePiece_Object.GetLabel();

			expect(currentLabel).toEqual(newGamePiece.objectLabel);
		})
		it("When an attempt is made to set a gameObject's type to a type that doesn't exist, throw an error", function(){
			var newGamePiece = {
				'typeName': 'gamePiece',
				'objectLabel': '',
				'props': [newGamePiece_prop_test]
			}

			var newGamePiece_Object = MyGameManager.CreateGameObject(newGamePiece);
			var _invalidTypeName = 'A type I know does not exist'
			var _testGameObjectSetTypeToInvalid = function()
			{
				newGamePiece_Object.SetType(_invalidTypeName)
			}

			expect(_testGameObjectSetTypeToInvalid).toThrow("typeName " + _invalidTypeName + " is not an exisiting gameObject prototype typeName.")

		})
	})





	
})