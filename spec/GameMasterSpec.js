describe("GameMaster", function(){
	var MyGameMaster;
	beforeEach(function(){

		MyGameMaster = new GameMaster();

	})
	describe(" -> CreateGameObjectConditions", function(){
		it("Given valid parameters, a GameObject condition can be created from GameMaster.CreateGameObjectConditions()", function(){
		var newGameObjectConditionArray = [];

		var newGameObjectConditionParam = {
			"receivers":{},
			"propertyNames":['test'],
			"operative":"<",
			"conditionValue":"",
			"nameLabel": "new name"
		}

		newGameObjectConditionArray.push(newGameObjectConditionParam);
		MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
		var _testSingleCreateGameObjectConditions_NoError = function()
		{
			MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
		}

		expect(_testSingleCreateGameObjectConditions_NoError).not.toThrow();

		})
		it("Given valid parameters, many GameObject conditions can be created from GameMaster.CreateGameObjectConditions()", function(){

			var newGameConditionCount = 10;
			var newGameObjectConditionArray = [];
			var nameLabelArray = [];
			for (iiNewGameCondition = 0; iiNewGameCondition < newGameConditionCount; iiNewGameCondition++)
			{
				var newGameObjectConditionParam = {
					"receivers":{},
					"propertyNames":['test'],
					"operative":">",
					"conditionValue":"",
					"nameLabel": "new name " + iiNewGameCondition
				}
				newGameObjectConditionArray.push(newGameObjectConditionParam)
				nameLabelArray.push(newGameObjectConditionParam.nameLabel);
			}

			var _testMultipleCreateGameObjectConditions_NoError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			}
			expect(_testMultipleCreateGameObjectConditions_NoError).not.toThrow();
			var conditionNames = MyGameMaster.GetConditionNames();
			var conditionNamesLength = conditionNames.length;

			for (iiName = 0; iiName < conditionNamesLength; iiName++)
			{
				var currentName = conditionNames[iiName];
				var currentNameIndex = nameLabelArray.indexOf(currentName);
				expect(currentNameIndex).not.toBeLessThan(-1)
			}

		})
		it("When a gameObjectCondition is created, it should include a property named 'conditionType', with the value set to 'gameobject'", function(){
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":"<",
				"conditionValue":"",
				"nameLabel": "new name"
			}
			newGameObjectConditionArray.push(newGameObjectConditionParam)
			var newConditionArray = MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			var newCondition = newConditionArray[0];

			expect(newCondition.conditionType).toEqual('gameobject')

		})
		it("If a newGameObjectCondition parameter has an empty object for it's receivers property, an error should NOT be thrown", function(){

			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":"<",
				"conditionValue":"",
				"nameLabel": "new name"
			}

			newGameObjectConditionArray.push(newGameObjectConditionParam);
			var _testCreateGameObjectConditions_EmptyReceiversObject_NoError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			}

			expect(_testCreateGameObjectConditions_EmptyReceiversObject_NoError).not.toThrow();

		})
		it("If a new newGameObjectCondition parameter has an empty string for the conditionValue, an error should NOT be thrown", function(){
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":"<",
				"conditionValue":"",
				"nameLabel": "new name"
			}

			newGameObjectConditionArray.push(newGameObjectConditionParam);
			var _testCreateGameObjectConditions_EmptyConditionValue_NoError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			}

			expect(_testCreateGameObjectConditions_EmptyConditionValue_NoError).not.toThrow();			
		})
		it("If a newGameObjectCondition parameter has an empty string for a nameLabel, throw an error", function(){

			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":"<",
				"conditionValue":"",
				"nameLabel": ""
			}

			newGameObjectConditionArray.push(newGameObjectConditionParam);
			var _testCreateGameObjectConditions_EmptyNameLabel_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			}

			expect(_testCreateGameObjectConditions_EmptyNameLabel_ThrowError).toThrow("Condition Name must be more than 0 characters: " + newGameObjectConditionParam.nameLabel);
		})
		it("If a newGameObjectCondition parameter has invalid or empty operative string, throw an error", function(){

			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":"x",
				"conditionValue":"",
				"nameLabel": "new name"
			}

			newGameObjectConditionArray.push(newGameObjectConditionParam);
			var _testCreateGameObjectConditions_InvalidOperative_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray);
			}

			expect(_testCreateGameObjectConditions_InvalidOperative_ThrowError).toThrow("Operative is invalid: " + newGameObjectConditionParam.operative)
		})
		it("If the parameter for a newGameObjectCondition has an empty array for it's propertyNames property, throw an error", function(){

			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":[],
				"operative":">",
				"conditionValue":"",
				"nameLabel": "new name"
			}

			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_EmptyPropertyNamesArray_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_EmptyPropertyNamesArray_ThrowError).toThrow()
		})
		it("If the parameter for a newGameObjectCondition is missing the receivers property, throw an error", function(){
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"propertyNames":['test'],
				"operative":">",
				"conditionValue":"",
				"nameLabel": "new name"
			}
	
			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_MissingReceiversProperty_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_MissingReceiversProperty_ThrowError).toThrow("Missing properties: receivers")
		})
		it("If the parameter for a newGameObjectCondition is missing the propertNames property, throw an error", function(){
			
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"operative":">",
				"conditionValue":"",
				"nameLabel": "new name"
			}
	
			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_MissingPropertyNamesProperty_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_MissingPropertyNamesProperty_ThrowError).toThrow("Missing properties: propertyNames")

		})
		it("If the parameter for a newGameObjectCondition is missing the operative property, throw an error", function(){
			
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"conditionValue":"",
				"nameLabel": "new name"
			}
	
			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_MissingOperativeProperty_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_MissingOperativeProperty_ThrowError).toThrow("Missing properties: operative")

		})
		it("If the parameter for a newGameObjectCondition is missing the conditionValue property, throw an error", function(){
			
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":">",
				"nameLabel": "new name"
			}
	
			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_MissingCondtionValueProperty_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_MissingCondtionValueProperty_ThrowError).toThrow("Missing properties: conditionValue")

		})
		it("If the parameter for a newGameObjectCondition is missing the nameLabel property, throw an error", function(){
			
			var newGameObjectConditionArray = [];

			var newGameObjectConditionParam = {
				"receivers":{},
				"propertyNames":['test'],
				"operative":">",
				"conditionValue":""
			}
	
			newGameObjectConditionArray.push(newGameObjectConditionParam)

			var _testCreateGameObjectCondition_MissingNameLabelProperty_ThrowError = function()
			{
				MyGameMaster.CreateGameObjectConditions(newGameObjectConditionArray)
			}

			expect(_testCreateGameObjectCondition_MissingNameLabelProperty_ThrowError).toThrow("Missing properties: nameLabel")
		})
	})
	describe(" -> CreateInputButtonConditions", function(){
		it("Given valid parameters, a newInputButtonCondition should be created when using GameMaster.CreateInputConditions() without throwing an error", function(){

			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new button condition'
			}

			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCodition_NewButtonCondition_NoError = function()
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray);
			}
			expect(_testCreateInputButtonCodition_NewButtonCondition_NoError).not.toThrow();

		})
		it("Given valid parameteres, many newInputButtonCondition objects should be able to be created when using GameMaster.CreateInputConditions() without throwing an error", function(){

			var newInputButtonConditionArray = [];
			var newInputButtonCount = 10;
			for (iiNewInputButtonCondition = 0; iiNewInputButtonCondition < newInputButtonCount; iiNewInputButtonCondition++)
			{
				var newInputButtonConditionParam = {
					'deviceType': 'keyboard',
					'inputCodes':[0],
					'eventType':'down',
					'nameLabel': 'new button condition ' + iiNewInputButtonCondition
				}

				newInputButtonConditionArray.push(newInputButtonConditionParam);		
			}

			var _testCreateMultipleInputButtonCodition_NewButtonCondition_NoError = function()
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray);
			}
			expect(_testCreateMultipleInputButtonCodition_NewButtonCondition_NoError).not.toThrow();

		})
		it("When a new inputButtonCondition is created, it should be added to _condtions under it's nameLabel", function(){
			
			var _newInputButtonConditionArray = [];

			var _newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new button condition'
			}

			_newInputButtonConditionArray.push(_newInputButtonConditionParam);

			var createConditionArray = MyGameMaster.CreateInputButtonConditions(_newInputButtonConditionArray)
			var conditionNameArray = []
			conditionNameArray.push(_newInputButtonConditionParam.nameLabel)
			var getConditionArray = MyGameMaster.GetConditions(conditionNameArray)

			expect(getConditionArray[0]).toEqual(createConditionArray[0])

		})
		it("When a new inputButtonCondition is created, it's conditionType should be 'input' + deviceType + 'Button'", function(){
			var newInputButtonConditionArray = [];

			var newInputButtonKeyboardConditionParam = {
				'deviceType': 'keyboard',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new keyboard button condition'
			}

			var newInputButtonMouseConditionParam = {
				'deviceType': 'mouse',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new mouse button condition'
			}
			var newInputButtonPadConditionParam = {
				'deviceType': 'pad',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new pad button condition'
			}

			newInputButtonConditionArray.push(newInputButtonKeyboardConditionParam, newInputButtonMouseConditionParam, newInputButtonPadConditionParam);

			var createConditionArray = MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray);
			var createConditionArrayLength = createConditionArray.length;
			var validConditionTypeArray = ['inputkeyboardButton', 'inputmouseButton','inputpadButton']		
			for (iiCondition = 0; iiCondition < createConditionArrayLength; iiCondition++)
			{
				var currentCondition = createConditionArray[iiCondition]
				var conditionTypeIndex = validConditionTypeArray.indexOf(currentCondition.conditionType)
				expect(conditionTypeIndex).not.toBeLessThan(0)
			}
		})
		it("When an inputButtonCondition parameter contains an invalid deviceType, throw an error", function(){

			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'non existant device type',
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new button condition'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_InvalidDeviceType_ThrowError = function()	
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)
			}
			expect(_testCreateInputButtonCondition_InvalidDeviceType_ThrowError).toThrow('Invalid device type: ' + newInputButtonConditionParam.deviceType)

		})
		it("When an inputButtonCondition parameter does not contain a deviceType property, throw an error", function(){

			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'inputCodes':[0],
				'eventType':'down',
				'nameLabel': 'new button condition 1'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_NoDeviceTypeProperty_ThrowError = function()	
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)
			}
			expect(_testCreateInputButtonCondition_NoDeviceTypeProperty_ThrowError).toThrow("Missing properties: deviceType")
		
		})
		it("When an inputButton condition parameter does not contain an 'inputCodes' property, throw an error", function (){
			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'eventType':'down',
				'nameLabel': 'new button condition 1'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_NoInputCodesProperty_ThrowError = function()	
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)
			}
			expect(_testCreateInputButtonCondition_NoInputCodesProperty_ThrowError).toThrow("Missing properties: inputCodes")

		})
		it("When an inputButtonCondition parameter does not contain an 'eventType' property, throw an error", function(){
			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'inputCodes':[0],
				'nameLabel': 'new button condition 1'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_NoEventTypeProperty_ThrowError = function()	
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)
			}
			expect(_testCreateInputButtonCondition_NoEventTypeProperty_ThrowError).toThrow("Missing properties: eventType")
		})
		it("When an inputButtonCondition parameter does not contain a nameLabel property, throw an error", function(){
			
			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'eventType':'down',
				'inputCodes':[0]
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_NoNameLabelProperty_ThrowError = function()	
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)
			}
			expect(_testCreateInputButtonCondition_NoNameLabelProperty_ThrowError).toThrow("Missing properties: nameLabel")

		})
		it("If the 'inputCodes' property on the inputButtonCondition object does not contain anything in it's array, an error should be thrown", function (){

			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'eventType':'down',
				'inputCodes':[],
				'nameLabel': 'new button condition 1'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_InvalidInputCodeArray_ThrowError = function()		
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)

			}
			expect(_testCreateInputButtonCondition_InvalidInputCodeArray_ThrowError).toThrow('inputCodes must contain at least one input code');

		})
		it("If an eventType property's value on an inputButtonCondition parameter is anything else but 'up' or 'down', throw an error", function(){
			var newInputButtonConditionArray = [];

			var newInputButtonConditionParam = {
				'deviceType': 'keyboard',
				'eventType':'left',
				'inputCodes':[],
				'nameLabel': 'new button condition 1'
			}
			newInputButtonConditionArray.push(newInputButtonConditionParam);

			var _testCreateInputButtonCondition_InvalidEventTypeArray_ThrowError = function()		
			{
				MyGameMaster.CreateInputButtonConditions(newInputButtonConditionArray)

			}
			expect(_testCreateInputButtonCondition_InvalidEventTypeArray_ThrowError).toThrow('Invalid Button Event: ' + newInputButtonConditionParam.eventType);			
		})
		
	})

})