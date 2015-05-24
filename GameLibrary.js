function GameLibrary()
{
	var customLibs = {};

	//stand in object for the GameObserver, which must be intiated with a reference to the GameLibrary.
	var _gameObserver = null;

	this.SetGameObserver = SetGameObserver;

	var _myOwnDamnLibrary = "This is a random string I put in here that forces you to copy / change this in the understanding you are purposely using your own library instead of mine. Good luck with that."

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

			var newCustomLibrary = function()
			{
				var _objLibrary = [];
				var _objList = {}
				var _objLabelList = {}
				var _libName = libTypeString;

				this.DoesObjectExistInLibrary = DoesObjectExistInLibrary;
				this.DoesObjectTypeExistInLibrary = DoesObjectTypeExistInLibrary;
				
				this.AddToLibrary = AddToLibrary;
				this.GetFromLibrary = GetFromLibrary;
				this.RemoveFromLibrary = RemoveFromLibrary;

				this.GetName = GetName;
				this.GetLength = GetLength;

				function GetName()
				{
					return _libName;
				}
				function DoesObjectTypeExistInLibrary(inputObjectTypeName)
				{
					var _response = {};

					var currentObjTypeList = Object.keys(_objList)
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
				function DoesObjectLabelExistInLibrary(inputObjectLabelString)
				{
					var _response = {};

					var currentObjLabelList = Object.keys(_objLabelList);
					var inputLabelIndex = currentObjLabelList.indexOf(inputObjectLabelString);
					if (inputLabelIndex < 0)
					{
						_response = false;
					}
					else
					{
						_response = true;
					}
					return _response;
				}
				function AddToLibrary(inputObjectArray)
				{
					var responseArray = [];
					if (!inputObjectArray)
					{
						throw "Parameter is invalid."
						return;
					}				
					for (iiObject = 0; iiObject < inputObjectArray.length; iiObject++)
					{
						var inputObject = inputObjectArray[iiObject];
						var _doesObjExist = DoesObjectExistInLibrary(inputObject);

						if (!inputObject.typeName || inputObject.typeName == null || inputObject.typeName == '')
						{
							throw "inputObject must have a valid typeName."
							return;
						}

						if (_doesObjExist == false)
						{
							var _newObjectId = _objLibrary.length;
							_objLibrary.push(inputObject);

							var _doesObjTypeExistInLib = DoesObjectTypeExistInLibrary(inputObject.typeName)

							if (_doesObjTypeExistInLib == false)
							{
								_objList[inputObject.typeName] = [] 							
							}
							_objList[inputObject.typeName].push(_newObjectId)
							
							var inputObjectLabel = inputObject.GetLabel();
							if (inputObjectLabel)
							{
								var objLabelExist = DoesObjectLabelExistInLibrary(inputObjectLabel)

								if (objLabelExist == false)
								{
									_objLabelList[inputObjectLabel] = []
								}
								_objLabelList[inputObjectLabel].push(_newObjectId)
							}
						}
						else
						{
							throw "Object " + inputObject.typeName + " already exists in library " + _libName;
							return;
						}	
					}
				}

				function GetFromLibrary(params)
				{
					var thisLib = this;
					
					var paramsKeys = Object.keys(params)
					var paramsKeysLength = paramsKeys.length;
					var returnObjArray = [];
					var allObjsIndex = paramsKeys.indexOf('allObjs')
					if (allObjsIndex > -1)
					{
						if (params.allObjs == true)
						{
							var libLength = GetLength();
							for (iiObj = 0; iiObj < libLength; iiObj++)
							{
								returnObjArray[iiObj] = _objLibrary[iiObj];
							}
						}
					}
					var arrLength = returnObjArray.length
					if (arrLength > 0)
					{
						return returnObjArray;
					}
					for (iiParamKey = 0; iiParamKey < paramsKeysLength; iiParamKey++)
					{
						var currentParamKeyString = paramsKeys[iiParamKey];
						switch(currentParamKeyString)
						{
							case 'objectTypes':
								var objTypeArray = _GetFromLibraryByObjectType(params.objectTypes)
								var returnObjArrayLength = returnObjArray.length;
								for (iiObj = 0; iiObj < returnObjArrayLength; iiObj++)
								{
									var currentObj = objTypeArray[iiObj];
									var objIndex = returnObjArray.indexOf(currentObj);
									if (objIndex < 0)
									{
										returnObjArray.push(currentObj);
									}
								}
								break;
							case 'objectLabels':
								var objLabelArray = _GetFromLibraryByObjetLabel(params.objectLabels)
								var returnObjArrayLength = returnObjArray.length;
								for (iiObj = 0; iiObj < returnObjArrayLength; iiObj++)
								{
									var currentObj = objLabelArray[iiObj];
									var objIndex = returnObjArray.indexOf(currentObj);
									if (objIndex < 0)
									{
										returnObjArray.push(currentObj);
									}
								}
								break;
							case 'libIndex':
								var objLibIndexArr = params.libIndex;
								var objIndexLength = params.libIndex.length;
								for (iiObj = 0; iiObj < objIndexLength; iiObj++)
								{
									var currentObjIndex = objLibIndexArr[iiObj];
									var currentObj = _objLibrary[currentObjIndex];
									returnObjArray.push(currentObj)
								}
								break;
							default:
								throw "Invalid property for Getting objects from a library: " + currentParamKeyString;
								return;
								break;
						}
					}
					return returnObjArray;

					function _GetFromLibraryByObjectType(inputTypeNameArray)
					{
						var inputTypeNameArrayLength = inputTypeNameArray.length;
						var returnObjTypeArray = [];
						for (iiTypeName = 0; iiTypeName < inputTypeNameArrayLength; iiTypeName++)
						{
							var currentTypeName = inputTypeNameArray[iiTypeName];
							var typeNameExist = DoesObjectTypeExistInLibrary(currentTypeName);
							if (typeNameExist == true)
							{
								var objTypeIds = _objList[currentTypeName];
								var objTypeIdsLength = objTypeIds.length;
								for (iiObjId = 0; iiObjId < objTypeIdsLength; iiObjId++)
								{
									returnObjTypeArray.push(_objLibrary[iiObjId]);
								}
							}
						}

						return returnObjTypeArray;
					}

					function _GetFromLibraryByObjetLabel(inputLabelStringArray)
					{
						var inputLabelStringArrayLength = inputLabelStringArray.length;
						var returnObjLabelArray = [];
						for (iiObjLabel = 0; iiObjLabel < inputLabelStringArrayLength; iiObjLabel++)
						{
							var currentObjLabel = inputLabelStringArray[iiObjLabel];
							var objLabelExist = DoesObjectLabelExistInLibrary(currentObjLabel);
							if (objLabelExist == true)
							{
								var objLabelIdArray = _objLabelList[currentObjLabel];
								var labelIdArrayLength = objLabelIdArray.length;
								for (iiObjLabelId = 0; iiObjLabelId < labelIdArrayLength; iiObjLabelId++)
								{
									returnObjLabelArray.push(_objLibrary[objLabelIdArray[iiObjLabelId]])
								}
							}
						}
					}
				}
				function RemoveFromLibrary(params)
				{	
					var returnObjectArray = [];
					var paramsLength = params.length;
					for (iiObject = 0; iiObject < paramsLength; iiObject++)
					{
						var currentObject = params[iiObject]
						var inputObjectId = _objLibrary.indexOf(currentObject);

						if (inputObjectId < 0)
						{
							continue;
						}
						var objLabel;

						_objLibrary.splice(inputObjectId,1)

						var _typeNameIndex =_objList[currentObject.typeName].indexOf(inputObjectId)
						_objList[currentObject.typeName].splice(_typeNameIndex, 1)
						var typeNameEntryLength = _objList[currentObject.typeName].length;

						if (typeNameEntryLength <= 0)
						{
							delete _objList[currentObject.typeName]
						}
						
						if (currentObject.GetLabel())
						{
							objLabel = currentObject.GetLabel()
							var objLabelIndex = _objLabelList[objLabel].indexOf(inputObjectId)
							_objLabelList[objLabel].splice(objLabelIndex, 1)
							var objLabelListLength = _objLabelList[objLabel].length
							if (objLabelListLength <= 0)
							{
								delete _objLabelList[objLabel]
							}
						}
						
						returnObjectArray.push(currentObject);
					}			
					return returnObjectArray;
				}

				function GetLength()
				{
					var response = _objLibrary.length;
					return response;
				}
				function GetObjectTypeCount(params)
				{
					//TO DO: Fill this fucker out					
				}
				function GetObjectLabelCount(params)
				{
					//TO DO: Also fill this fucker out
				}

				function ClearLibrary()
				{
					_objLibrary = [];
					_objList = {};
					_objLabelList = {};
				}

				function DoesObjectExistInLibrary(inputObject)
				{
					var objIndex = _objLibrary.indexOf(inputObject)
					returnBool = {};
					if (objIndex < 0)
					{
						returnBool = false;
					}
					else
					{
						reutnrBool = true;
					}

					return returnBool;
				}

				function GetObjectId(inputObjectArray)
				{
					var returnObjectIdArray = [];
					var _inputObjectArrayLength = inputObjectArray.length
					for (iiObject = 0; iiObject < _inputObjectArrayLength; iiObject++)
					{
						var currentObjectId = _objLibrary.indexOf(currentObject)

						if (currentObjectId < 0)
						{
							continue;
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
				return this;
			}
			var newCustomLib = newCustomLibrary();
			customLibs[newCustomLib.GetName()] = newCustomLib;
		}
	}

	function RemoveLibraryType(libTypeArray)
	{
		var _libTypeArrayLength = libTypeArray.length
		for (iiLibType = 0; iiLibType < _libTypeArrayLength; iiLibType++)
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
		var typeStringArrayLength = typeStringArray.length;
		for (iiTypeString = 0; iiTypeString < typeStringArrayLength; iiTypeString++)
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