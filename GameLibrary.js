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
	this.GetLibraryFromType = GetLibraryFromType;
	this.GetLibraryTypes = GetLibraryTypes;
	this.GetLibraries = GetLibraries;

	this.IsLibValid = IsLibValid;

	function AutoSort()
	{
		customLibs.emptyIndex.sort(function(a,b) {return a-b})
	}

	function assignId(libraryType)
	{
		var doesLibExist = DoesLibraryTypeExist(libraryType);

		var response;

		if (doesLibExist == true)
		{
			if (customLibs[libraryType].emptyIndex.length == 0)
			{
				var returnId = customLibs[libraryType].objectLib.length;
				response = returnId;
			}
			else
			{
				var returnId = customLibs[libraryType].emptyIndex.shift();
				response = returnId;
			}

			return response;
		}
		else
		{
			throw libraryType + " libraryType does not exist";
		}
	}
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

	function AddToLibrary(libraryType, inputObject)
	{
		var doesObjExist = DoesObjectExistInLibrary(libraryType, inputObject);

		if (!inputObject.typeName || inputObject.typeName == null)
		{
			throw "inputObject must have a typeName. How did you even get here with that crap? I need to look at my code."
		}
		else
		{
			var response = {};

			if (doesObjExist.bool == true)
			{
				throw libraryType + " already contains this object in index " + doesObjExist.returnIndex
			}
			else
			{
				var doesLibExist = DoesLibraryTypeExist(libraryType)
				if (doesLibExist == false)
				{
					throw "Library type " + libraryType + " does not exist"
				}
				else
				{
					var currentLib = customLibs[libraryType];
					var _libResponse = currentLib.AddToLibrary(inputObject);

					response.libId = _libResponse.libId;
					response.libName = _libResponse.libName;
				}

			}
		}

		return response;
	}

	function RemoveFromLibrary(libraryType, objectId)
	{
		var doesLibExist = DoesLibraryTypeExist(libraryType);

		if (doesLibExist == true)
		{
			var currentLib = customLibs[libraryType].objectLib;
			var currentObj = currentLib[objectId]
			if (currentObj || currentObj != null)
			{
				var removedOjbectId = currentLib.splice(1, objectId)
				currentLib.emptyIndex.push(objectId);
				currentLib.objList[currentObj.typeName] -= 1
			}
			else
			{
				throw "object at index" + objectId + "for libraryType " +  libraryType + " does not exist";
			}
		}


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

	function AddLibraryType(libTypeString)
	{

		var response;

		var doesLibExist = DoesLibraryTypeExist(libTypeString)
		if (doesLibExist == true)
		{
			throw typeString + 'libraryType already exists at index ' + doesLibExist.returnIndex;
		}
		else 
		{				
			var newCustomLib = {
				'objectLib': [],
				'emptyIndex':[],
				'objList': {},
				'libName': libTypeString
			}

			newCustomLib.DoesObjectTypeExistInLibrary = function (inputObjectTypeName)
			{
				var _response = {};

				var currentObjTypeList = Object.keys(newCustomLib.objList)
				var inputObjIndex = currentObjTypeList.indexOf(inputObjectTypeName)
				if (inputObjIndex > 0)
				{
					_response = true;
				}
				else
				{
					_response = false;
				}

				return _response;
			}
			newCustomLib.AddToLibrary = function (inputObject)
			{
				var _doesObjExist = DoesObjectExistInLibrary(this.libName, inputObject);
				var response = {};
				if (_doesObjExist.bool == false)
				{
					var newObjectId = assignId(this.libName)
					response.libId = newObjectId;
					response.libName = this.libName;
					this.objectLib[newObjectId] = inputObject;

					var _doesObjTypeExistInLib = this.DoesObjectTypeExistInLibrary(inputObject.typeName)
					if (_doesObjTypeExistInLib == true)
					{
						this.objList[inputObject.typeName] += 1
					}
					else
					{
						this.objList[inputObject.typeName] = 1
					}
				}
				else
				{
					throw "Object " + inputObject + " already exists in library " + this.libName;
				}

				return response;
			}

			customLibs[libTypeString] = newCustomLib;

			response = libTypeString
		}

		return response;

	}

	function RemoveLibraryType(typeString)
	{
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

	function GetLibraryFromType(typeString)
	{
		var response;

		var doesLibExist = DoesLibraryTypeExist(typeString)
		if(doesLibExist == true)
		{
			response = customLibs[typeString];
		}
		else
		{
			throw typeString + " libraryType does not exist"
		}

		return response;
	}

	function GetLibraries()
	{
		var response;
		var libLength = Object.keys(customLibs).length;
		if (libLength > 0)
		{
			response = customLibs;
		}
		else
		{
			response = null;
		}

		return response;
	}

	function GetLibraryTypes()
	{
		var response;
		var customLibTypes = Object.keys(customLibs)
		if (customLibTypes.length > 0)
		{
			response = customLibTypes
		}
		else
		{
			response = null;
		}

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
GameLibrary.prototype.GetObjectFromLibrary = function(libraryType, objectId) 
{
	var response = this.GetFromLibrary(libraryType, objectId)
	return response;
}
GameLibrary.prototype.AddObjectToLibrary = function(libraryType, inputObject)
{
	var response = this.GetFromLibrary(libraryType, inputObject)
	return response;
}

GameLibrary.prototype.RemoveObjectFromLibrary = function(libraryType, objectId)
{
	var response = this.RemoveFromLibrary(libraryType, inputObject)
	return response;
}

GameLibrary.prototype.AddNewLibrary = function(libraryType)
{
	var response = this.AddLibraryType(libraryType);
	return response;
}

GameLibrary.prototype.RemoveLibrary = function(libraryType)
{
	var response = this.RemoveLibraryType(libraryType)
	return response;
}

GameLibrary.prototype.GetLibraryFromType = function(libraryType)
{
	var response = this.GetLibraryFromType(libraryType)
	return response;
}
GameLibrary.prototype.GetLibraryTypes = function()
{
	var response = this.GetLibraryTypes()
	return response;
}
GameLibrary.prototype.GetLibraries = function()
{
	var response = this.GetLibraries()
	return response;
}
GameLibrary.prototype.IsLibValid = function(inputLibString)
{
	var response = this.IsLibValid(inputLibString)
	return response;
}
GameLibrary.prototype.SetGameObserver = function(inputGameObserver)
{
	this.SetGameObserver(inputGameObserver)
}

function purifyString(inputString)
{
	inputString = inputString.replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}