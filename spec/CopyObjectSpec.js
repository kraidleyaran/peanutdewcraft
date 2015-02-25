describe("CopyObject", function(){
	it("Given an object with a property that is an object, a whole new object should be created that is not a reference to the copied object", function(){
		var newObj = {
			"testProperty":{
				"newProperty":0
			}
		}

		var sameObj = {
			"testProperty":{
				"newProperty":0
			}
		}

		var newSameObj = sameObj;

		var newerObj = MakeCopyOfObject(newObj);

		newerObj.testProperty["newer property"] = false;

		expect(newerObj.testProperty).not.toEqual(newObj.testProperty);
	})
	it("Given an object with a property that is an array, a whole new array with new variables (including those of non primitive types) should be created in the new object", function(){

		var testObj = {
			"testProp": "lol"
		}
		var testFunction = function()
		{
			return function()
			{
				return;
			}
		}
		var newObj = [testFunction, testObj, 'string', 'string2']

		var newerObj = MakeCopyOfObject(newObj);
	
		expect(newObj).not.toEqual(newerObj);

	})
	it("Given a primitive type, a new object should be created when using MakeCopyOfObject", function(){

		var newArray = []
		var testString = "string";
		var testNumber = 0;
		var testBool = true;
		var testNull = null;
		var testFunction = function()
		{
			return function()
			{
				return;
			}
		}
		newArray.push(testString, testNumber, testNumber, testBool, testNull, testFunction)
		var newArrayLength = newArray.length
		for (iiObj = 0; iiObj < newArrayLength; iiObj++)
		{
			var currentObj = newArray[iiObj];
			var copyCurrentObj = MakeCopyOfObject(currentObj);
			expect(currentObj).toEqual(copyCurrentObj)

			switch(currentObj)
			{
				case newArray:
					newArray.push("a")
					copyCurrentObj.push("b")
					expect(newArray).not.toEqual(copyCurrentObj)
					break;
				case testString:
					copyCurrentObj += " new"
					expect(testString).not.toEqual(copyCurrentObj);
					break;
				case testNumber:
					copyCurrentObj += 1;
					expect(testNumber).not.toEqual(copyCurrentObj);
					break;
				case testBool:
					copyCurrentObj = false;
					expect(copyCurrentObj).not.toEqual(testBool);
					break;
				default:
					break;
			}

		}

	})
})