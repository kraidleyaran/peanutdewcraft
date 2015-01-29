function GameLibrary()
{
	var customLibs = new Array();

	customLibs.libTypeNames = new Array();
	customLibs.emptyIndex = new Array();

	this.AddToLibrary = AddToLibrary;
	this.GetFromLibrary = GetFromLibrary;
	this.RemoveFromLibrary = RemoveFromLibrary;

	this.AddLibraryType = AddLibraryType;
	this.RemoveLibraryType = RemoveLibraryType;
	this.GetLibraryFromType = GetLibraryFromType;

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
			if (customLibs[doesLibExist.returnIndex].emptyIndex.length == 0)
			{
				var returnId = customLibs.length;
				response.objectId = returnId;
			}
			else
			{
				var returnId = customLibs[doesLibExist.returnIndex].emptyIndex.shift();
				response.objectId = returnId;
			}

			return response;
		}
		else
		{
			throw libraryType + " libraryType does not exist";
		}
	}

	function GetFromLibrary(libraryType, objectIndex)
	{
		var returnObj;

		var doesLibExist =  DoesLibraryTypeExist(libraryType);
		if (doesLibExist.bool == true)
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

		}

		var response;

		if (doesObjExist.bool == true)
		{
			throw libraryType + "already contains this object in index" + doesObjExist.returnIndex
		}
		else
		{
			var newObjectIndex	 = assignId(libraryType);

			response.returnIndex = newObjectIndex;

			var doesLibExist = DoesLibraryTypeExist(libraryType)
			var libIndex = doesLibExist.returnIndex;

			var currentLib = customLibs[libIndex]

			currentLib[newObjectIndex] = inputObject;
		}

		return response;
	}

	function RemoveFromLibrary(libraryType, objectId)
	{
		var doesLibExist = DoesLibraryTypeExist(libraryType);

		if (doesLibExist.bool == true)
		{
			var currentLib = customLibs[doesLibExist.returnIndex]
			var currentObj = currentLib[objectId]
			if (currentObj || currentObj != null)
			{
				var removedOjbectId = currentLib.splice(1, objectId)
				currentLib.emptyIndex.push(objectId);
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
		if (doesLib.bool == true)
		{
			var objIndex = customLibs[doesLib.returnIndex].indexOf(inputObject)
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
		var libIndex = customLibs.libTypeNames.indexOf(typeString)
		var response = {};

		if (libIndex < 0)
		{
			response.bool = false;
			return response;
		}
		else
		{
			response.bool = true;
			response.returnIndex = libIndex;
			return response;
		}


	}

	function AddLibraryType(typeString)
	{
		typeString = purifyString(typeString)

		var response = {};
		var newLibId;

		var doesLibExist = DoesLibraryTypeExist(typeString)
		if (doesLibExist.bool == true)
		{
			throw typeString + 'libraryType already exists at index ' + doesLibExist.returnIndex;
		}
		else 
		{				
			var newCustomLib = new Array();
			newCustomLib.emptyIndex = new Array();
			newCustomLib.typeName = typeString;

			newCustomLib.objTypeCount = new Array();
			
			if (customLibs.emptyIndex.length == 0)
			{
				newLibId = customLibs.length;
				customLibs[newLibId] = newCustomLib;
				customLibs.libTypeNames[newLibId] = typeString;
			}
			else
			{
				AutoSort();
				newLibId = customLibs.emptyIndex.shift()
				customLibs[newLibId] = newCustomLib;
				response.returnIndex = newLibId;
			}

			response.returnTypeName = typeString
		}

		return response;

	}

	function RemoveLibraryType(typeString)
	{
		typeString = purifyString(typeString);

		var doesLibExist = DoesLibraryTypeExist(typeString)
		if (doesLibExist.bool == true)
		{
			customLibs[doesLibExist.returnIndex] = null;
			AutoSort();
			customLibs.emptyIndex.push(doesLibExist.returnIndex)
		}
		else			
		{
			throw typeString + " libraryType does not exist"
		}
	}

	function GetLibraryFromType(typeString)
	{
		typeString = purifyString(typeString);

		var response = {};

		var doesLibExist = DoesLibraryTypeExist(typeString)
		if(doesLibExist.bool == true)
		{
			response.returnLibrary = customLibs[doesLibExist.returnIndex];
		}
		else
		{
			throw typeString + " libraryType does not exist"
		}

		return response;
	}

}
GameLibrary.prototype.GetObjectFromLibrary = function(libraryType, objectId) 
{
	var response = this.GetFromLibrary(libraryType, objectId)
	return response;
}
GameLibrary.prototype.AddObjectToLibrary = function(libraryType, inputOjbect)
{
	var response = this.GetFromLibrary(libraryType, inputOjbect)
	return response;
}

GameLibrary.prototype.RemoveObjectFromLibrary = function(libraryType, objectId)
{
	var response = this.RemoveFromLibrary(libraryType, inputOjbect)
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

function purifyString(inputString)
{
	inputString = inputString.replace(/[^a-zA-Z0-9]/g,'')
	inputString = inputString.toLowerCase()

	return inputString;
}