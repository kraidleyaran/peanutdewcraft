function GameLibrary()
{
	var customLibs = {};

	//stand in object for the GameObserver, which must be intiated with a reference to the GameLibrary.
	var _gameObserver = null;

	this.SetGameObserver = SetGameObserver;

	var _myOwnDamnLibrary = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own library instead of mine. Good luck with that."

	this.AddToLibrary = AddToLibrary;
	this.GetFromLibrary = GetFromLibrary;
	this.RemoveFromLibrary = RemoveFromLibrary;

	this.AddLibraryType = AddLibraryType;
	this.RemoveLibraryType = RemoveLibraryType;
	this.GetLibrary = GetLibrary;
	this.GetLibraryTypes = GetLibraryTypes;
	this.GetLibraries = GetLibraries;

	this.IsLibValid = IsLibValid;
	this.DoesLibraryTypeExist = DoesLibraryTypeExist;

	function IsLibValid(inputLibString)
	{
		var response;

		if (inputLibString != _myOwnDamnLibrary)
		{
			response = false;
		}
		else
		{
			response = true;
		}

		return response;
	}

	function GetFromLibrary(libraryType, objectIndex)
	{
		var returnObj;

		var doesLibExist = DoesLibraryTypeExist(libraryType);
		if (doesLibExist == true)
		{
			var currentLib = customLibs[doesLibExist.returnIndex]
			returnObj = currentLib[objectIndex];

		}
		else
		{
			throw currentLib + " is not a current library"
		}


		return currentObj;
	}

	function AddToLibrary(inputParamsArray)
	{
		var objectArray = {};
		for (iiParam = 0; iiParam < inputParamsArray.length; iiParam++)
		{
			var currentParam = inputParamsArray[iiParam];

			var inputObject = currentParam.inputObject;
			var libraryType = currentParam.libraryType;
			
			var doesLibExist = DoesLibraryTypeExist(libraryType)

			if (doesLibExist == false)
			{
				throw "Library type " + libraryType + " does not exist"
				return;
			}
			if (!objectArray[libraryType])
			{
				objectArray[libraryType] = []	
			}
			objectArray[libraryType].push(inputObject)

		}
		var objArrayKeys = Object.keys(objectArray);
		var currentLibArray = this.GetLibrary(objArrayKeys);

		for (iiLibType = 0; iiLibType < objArrayKeys.length; iiLibType++)
		{
			var currentLib = currentLibArray[objArrayKeys[iiLibType]]
			var libObjArray = objectArray[objArrayKeys[iiLibType]]
			currentLib.AddToLibrary(libObjArray)

		}
			
	}

	function RemoveFromLibrary(inputParamsArray)
	{
		var objectArray = {};
		for (iiParam = 0; iiParam < inputParamsArray.length; iiParam++)
		{
			var currentParam = inputParamsArray[iiParam];

			var currentObject = currentParam.inputObject;
			var libraryType = currentParam.libraryType;

			var doesLibExist = DoesLibraryTypeExist(libraryType);
			if (doesLibExist == true)
			{
				if(!objectArray[libraryType])
				{
					objectArray[libraryType] = []
				}
				objectArray[libraryType].push(currentObject)
			}
			else
			{
				throw "Library type " + libraryType + " does not exist."
				return;
			}	
		}

		var objLibKeys = Object.keys(objectArray);

		var returnObjects = []

		for (iiLib = 0; iiLib < objLibKeys.length; iiLib++)
		{
			var _removedObjArray = customLibs[objLibKeys[iiLib]].RemoveFromLibrary(objectArray[objLibKeys[iiLib]]);
			returnObjects = returnObjects.concat(_removedObjArray);
		}

		return returnObjects;
	}
	function DoesObjectExistInLibrary(libraryType, inputObject)
	{
		var doesLib = DoesLibraryTypeExist(libraryType);
		if (doesLib == true)
		{
			var objIndex = customLibs[libraryType].objectLib.indexOf(inputObject)
			var response = {};

			if (objIndex < 0)
			{
				response.bool = false;
				return response
			}
			else
			{
				response.bool = true;
				response.returnIndex = objIndex
				return response;
			}
		}
		else
		{
			throw libraryType + " libraryType does not exist";
		}
	}

	function DoesLibraryTypeExist(typeString)
	{
		var response = customLibs.hasOwnProperty(typeString)
		return response;
	}

	function AddLibraryType(libTypeArray)
	{
		var responseArray = [];
		for (iiLibType = 0; iiLibType < libTypeArray.length; iiLibType++)
		{	
			var libTypeString = libTypeArray[iiLibType];

			var doesLibExist = DoesLibraryTypeExist(libTypeString)

			if (doesLibExist == true)
			{
				throw libTypeString + ' libraryType already exists'
				return;
			}
			if (!libTypeString || libTypeString == '')
			{
				throw "libraryType is invalid: " + libTypeString;
			}

			var newCustomLib = {
				'objectLib': [],
				'objList': {},
				'objLabelList' : {},
				'libName': libTypeString
			}

			newCustomLib.DoesObjectTypeExistInLibrary = function(inputObjectTypeName)
			{
				var _response = {};

				var currentObjTypeList = Object.keys(newCustomLib.objList)
				var inputObjIndex = currentObjTypeList.indexOf(inputObjectTypeName)
				if (inputObjIndex < 0)
				{
					_response = false;
				}
				else
				{
					_response = true;
				}

				return _response;
			}
			newCustomLib.AddToLibrary = function(inputObjectArray)
			{
				var responseArray = [];
				if (!inputObjectArray)
				{
					throw "Parameter is invalid."
					return;
				}
				var paramType = typeof inputObjectArray
				
				if (paramType == 'string' || !inputObjectArray.length)
				{
					throw "Parameter must be an array."
					return;
				}
				for (iiObject = 0; iiObject < inputObjectArray.length; iiObject++)
				{
					var inputObject = inputObjectArray[iiObject];
					var _doesObjExist = DoesObjectExistInLibrary(this.libName, inputObject);

					if (!inputObject.typeName || inputObject.typeName == null || inputObject.typeName == '')
					{
						throw "inputObject must have a valid typeName."
						return;
					}

					if (_doesObjExist.bool == false)
					{
						this.objectLib.push(inputObject);

						var _doesObjTypeExistInLib = this.DoesObjectTypeExistInLibrary(inputObject.typeName)

						if (_doesObjTypeExistInLib == false)
						{
							this.objList[inputObject.typeName] = [] 							
						}
						this.objList[inputObject.typeName].push(inputObject)
						var inputObjectLabel = inputObject.GetLabel();
						if (inputObjectLabel != null)
						{
							var currentObjLabels = Object.keys(this.objLabelList)
							var objLabelIndex = currentObjLabels.indexOf(inputObjectLabel)

							if (objLabelIndex < 0)
							{
								this.objLabelList[inputObjectLabel] = []
								this.objLabelList[inputObjectLabel].push(inputObject)
							}
							else
							{
								this.objLabelList[inputObjectLabel].push(inputObject)
							}
						}
					}
					else
					{
						throw "Object " + inputObject + " already exists in library " + this.libName;
						return;
					}	
				}
			}
			newCustomLib.RemoveFromLibrary = function (inputObjectArray)
			{	
				var returnObjectArray = [];
				for (iiObject = 0; iiObject < inputObjectArray.length; iiObject++)
				{
					var currentObject = inputObjectArray[iiObject]
					var inputObjectId = this.objectLib.indexOf(currentObject);

					if (inputObjectId < 0)
					{
						throw currentObject + " does not exist in library " + this.libName ;
						return;
					}
					var objLabel;

					this.objectLib.splice(inputObjectId,1)

					this.objList[currentObject.typeName] -= 1

					if (this.objList[currentObject.typeName] <= 0)
					{
						delete this.objList[currentObject.typeName]
					}
					
					if (currentObject.GetLabel())
					{
						objLabel = currentObject.GetLabel()
						var objLabelIndex = this.objLabelList[objLabel].indexOf(currentObject)
						this.objLabelList[objLabel].splice(objLabelIndex, 1)

						if (this.objLabelList[objLabel].length <= 0)
						{
							delete this.objLabelList[objLabel]
						}
					}
					
					returnObjectArray.push(currentObject);
				}			
				return returnObjectArray;
			}
			newCustomLib.GetObjectId = function (inputObjectArray)
			{
				var returnObjectIdArray = [];
				for (iiObject = 0; iiObject < inputObjectArray.length; iiObject++)
				{
					var currentObjectId = this.objectLib.indexOf(currentObject)

					if (currentObjectId < 0)
					{
						throw currentObject + " does not exist in library " + this.libName;
						return;
					}

					var currentObject = inputObjectArray[iiObject];
					
					var returnObject = {
						'gameObject': currentObject,
						'objectId': currentObjectId
					}
					returnObjectArray.push(returnObject);
				}

				return returnObjectIdArray;
			}

			customLibs[libTypeString] = newCustomLib;
			responseArray.push(libTypeString);

		}
		return responseArray;
	}

	function RemoveLibraryType(libTypeArray)
	{
		for (iiLibType = 0; iiLibType < libTypeArray.length; iiLibType++)
		{
			var typeString = libTypeArray[iiLibType];

			var doesLibExist = DoesLibraryTypeExist(typeString)
			if (doesLibExist == true)
			{
				delete customLibs[typeString];
			}
			else			
			{
				throw typeString + " libraryType does not exist"
			}	
		}

	}

	function GetLibrary(typeStringArray)
	{
		var responseObj = {};
		for (iiTypeString = 0; iiTypeString < typeStringArray.length; iiTypeString++)
		{
			var typeString = typeStringArray[iiTypeString];

			var doesLibExist = DoesLibraryTypeExist(typeString)
			if(doesLibExist == true)
			{
				responseObj[typeString] = customLibs[typeString];
			}
			else
			{
				throw typeString + " libraryType does not exist"
				return;
			}	
		}
		return responseObj;
	}

	function GetLibraries()
	{
		var response = customLibs;
		return response;
	}

	function GetLibraryTypes()
	{
		var response = Object.keys(customLibs)
		return response;
	}

	function SetGameObserver(gameObserver)
	{
		if (!_gameObserver)
		{
			_gameObserver = gameObserver;	
		}
		else
		{
			throw "GameObserver already exists = " + _gameObserver;
		}
		
	}

}

function purifyString(inputString)
{
	inputString = inputString.replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}