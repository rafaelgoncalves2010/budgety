var budgetController = function(){

	var Expense = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var Income = function(id, description, value){
		this.id = id;
		this.description = description;
		this.value = value;
	};

	var caculateTotal = function(type){

		var sum = 0;
		data.allItens[type].forEach(function(cur){
			sum += cur.value;
		});

		data.totals[type] = sum;
	}

	var data = {
		allItens:{
			exp: [],
			inc: []
		},
		totals:{
			exp:0,
			inc:0
		},
		budget: 0,
		percentage: -1
	}

	return {
		addItem: function(type,des,val){
			var newItem, ID;

			//Create new ID
			if (data.allItens[type].length > 0) {
				ID = data.allItens[type][data.allItens[type].length - 1].id+1;
			}else{
				ID = 0;
			}

			//Create new item based on 'inc' or 'exp' type
			if(type === 'exp'){
				newItem = new Expense(ID, des, val);
			}else if( type === 'inc'){
				newItem = new Income(ID, des, val);
			}

			//Push it into our data structure
			data.allItens[type].push(newItem);
			
			//return the new element
			return newItem;
		},
		removeItem: function(type,id){
			// var item = data.allItens[type].id = id;
			// item.delete();

		},
		calculateBudget: function(){

			//caculate total income and expenses
			caculateTotal('inc');
			caculateTotal('exp');

	
			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//calcule the percentagem of income that we spent
			if(data.totals.inc > 0){
				data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);			
			}else{
				data.percentage = -1;
			}
		},
		getBudget: function(){
			return {
				budget: data.budget,
				totalInc: data.totals.inc,
				totalExp: data.totals.exp,
				percentage: data.percentage
			}
		},
		testing:function(){
			console.log(data);

		}
	}
}();


var UIcontroller = function(){

		var DOMstrings = {
			inputType: '.add__type',
			inputDescription:'.add__description',
			inputValue:'.add__value',
			inputBtn:'.add__btn',
			incomeContainer: '.income__list',
			expensesContainer: '.expenses__list',
			budgetLabel: '.budget__value',
			incomeLabel: '.budget__income--value',
			expensesLabel: '.budget__expenses--value',
			percentageLabel: '.budget__expenses--percentage',
			container: '.container'
		};

		return {
			getInput:function(){
				return{
					type:document.querySelector(DOMstrings.inputType).value,
					description:document.querySelector(DOMstrings.inputDescription).value,
					value: parseFloat(document.querySelector(DOMstrings.inputValue).value)
				}
			},

			addListItem: function(obj,type){

				//create html string with plalceholder text
				var html, newHtml, element;

				if(type === 'inc'){
					element = DOMstrings.incomeContainer;
					html = ' <div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				}else if(type === 'exp'){
					element = DOMstrings.expensesContainer;
					html = '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'		
				}

				//replace the placeholder text with some actual data
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%description%', obj.description);
				newHtml = newHtml.replace('%value%', obj.value);

				//insert the html into the dom
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			},
			removeListItem: function(){
				//document.querySelector(DOMstrings.delete
			},
			clearFields:function(){

				document.querySelector(DOMstrings.inputDescription).value = "";
				document.querySelector(DOMstrings.inputValue).value = "";
				document.querySelector(DOMstrings.inputDescription).focus();

			},
			displayBudget: function(obj){
				 document.querySelector(DOMstrings.budgetLabel).textContent = obj.budget;
				 document.querySelector(DOMstrings.incomeLabel).textContent = obj.totalInc;
				 document.querySelector(DOMstrings.expensesLabel).textContent = obj.totalExp;
				 
				 if(obj.percentage > 0 ){
					document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "%";						
				 }else{
					document.querySelector(DOMstrings.percentageLabel).textContent = obj.percentage + "---";
				 }
			},
			getDOMstrings:function(){
				return DOMstrings;
			}			
		};

}();

var controller = function(budgetCtrL,UICtrl){

	var setUpEventListeners = function(){

		var dom = UICtrl.getDOMstrings();
		document.querySelector(dom.inputBtn).addEventListener("click",ctrlAddItem);
		
		document.querySelector(dom.container).addEventListener("click", ctrlDeleteItem);

		document.addEventListener('keypress',function(event){
		if(event.keyCode === 13){
				ctrlAddItem();
			}
		});
	}

	var updateBudget = function(){

		budgetCtrL.calculateBudget();

		var budget = budgetCtrL.getBudget();

		UICtrl.displayBudget(budget);
	}

	var ctrlAddItem = function(){
		
		//1- get the field input data
		var input = UICtrl.getInput();
		
		var d = budgetCtrL.getBudget();

		if(input.description!=="" && !isNaN(input.value) && input.value > 0){

				//2- add the item to the budget controller
				var one = budgetCtrL.addItem(input.type, input.description, input.value);

				//3- add the item to UI
				UIcontroller.addListItem(one, input.type);
		
				//4- Clear the fields 
				UICtrl.clearFields();

				//4- Calcule the budget
				updateBudget();

				//5- display the budget on the UI 				
		}
	}

	var ctrlDeleteItem = function(event){
		
		var itemID, splitID, type, ID;

		itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;
		console.log(itemID);

		if(itemID){
			splitID = itemID.split("-");

			type = splitID[0];
			ID = splitID[1];
		}
	
	}

	return {
		init:function(){
			setUpEventListeners();			
		}
	}

}(budgetController,UIcontroller);

controller.init();