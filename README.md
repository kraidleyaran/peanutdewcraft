# peanutdewcraft
The beginning of it all....


main.html is the file I'm using to get everything going.

So far I have two objects called GameManager and GameLibrary.

GameManager creates object prototypes and the objects themselves.

Private Variables:

	_gameObjectTypes = A list of gameObjectTypes that are remo
	_gameObjectProtos = An array of object prototypes. We check an object against and basically use it as the copy of the object we want.
	
	_gameObjectId - An ID I'm not really using... but may switch to? I dk. It may be useful later, so it's there.
	_gameEmptyIndex = Array of empty Arrays. This is taking the place of what Id could do, without creating too many spots in an
	array. We'll keep both for now in case this doesn't work out.
	
	
Private functions (not made public):

IsAllowedType
DoesGameObjectTypeExist
Private function in CreateGameObject():
-SetProperty
-GetProperty
-DoesPropExist
-DoesPropExistInProto

GameManager.CreateGameObjectType(objParams)
  objParams contains the following:
  
  objParams.typeName - The object type's name. Please note that spaces, symbols, and capitalization do not give an object
  it's unique name. They are removed upon creation of the library. All names are stored in lower case with the above removed.
  This only applies to objParams.typeName
  
  objParams.props - Contains the properties of the object AS properties. In the property name store any of the following 6 types:
    
      string, number, boolean, array, object, & function
    
    For example:
    objParams.props.playerName = 'string'
    objParams.props.playerHealth = 'number'
    objParams.props.TakeDamage = 'function'
    
  
  Since this is only creating the object type, you just have to say what type it will be. This type is checked upon creating
  a new version of this object where we accept the same parameters, but instead have the actual strings, numbers, functions,
  arrays etc.
  
  GameManager.CreateGameObject(inputParams) - Similar to creating an object's type, creating an object requires you to list
  typeName as a property of the parameter. As mentioned before, you will be attaching the actual objects to this object. This
  gives us the ability to create an game object subclass then variations of that with little effort on our part. Think of it
  like an interface :)
  
  inputParams.typeName = an existing object's type.

GameLibrary adds and removes objects from various libraries. You can add, get, or remove a library type and/or it's objects.

  GameLibrary.AddObjectToLibrary()
