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
		calculateBudget: function(){
	

			//caculate total income and expenses
			caculateTotal('inc');
			caculateTotal('exp');

	
			//calculate the budget: income - expenses
			data.budget = data.totals.inc - data.totals.exp;

			//calcule the percentagem of income that we spent
			data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
		},
		getBudget: function(){
			return{
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
			budgetValue: 'budget__value',
			budgetInc: 'budget__income--text'
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
					html = ' <div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'
				}else if(type === 'exp'){
					element = DOMstrings.expensesContainer;
					html = '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>'		
				}

				//replace the placeholder text with some actual data
				newHtml = html.replace('%id%', obj.id);
				newHtml = newHtml.replace('%description%', obj.description);
				newHtml = newHtml.replace('%value%', obj.value);

				//insert the html into the dom
				document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
			},
			clearFields:function(){
				// var fields, fieldsArr;

				// fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);

				// console.log(fields);
				// fieldsArr = Array.prototype.slice.call(fields);

				// console.log(fieldsArr);
				// fieldsArr.forEach(function(current, index, array){
				// 	current.value = "";

				// });
				// console.log(fieldsArr);

				// fieldsArr[0].focus();

				document.querySelector(DOMstrings.inputDescription).value = "";
				document.querySelector(DOMstrings.inputValue).value = "";
				document.querySelector(DOMstrings.inputDescription).focus();

			},
			// changeValues: function(obj){
			// 	document.querySelector(DOMstrings.budgetInc).value = obj.inc;

			// },
			getDOMstrings:function(){
				return DOMstrings;
			}			
		};

}();

var controller = function(budgetCtrL,UICtrl){

	var setUpEventListeners = function(){

		var dom = UICtrl.getDOMstrings();
		document.querySelector(dom.inputBtn).addEventListener("click",ctrlAddItem);
		document.addEventListener('keypress',function(event){
		if(event.keyCode === 13){
				ctrlAddItem();
			}
		});
	}

	var updateBudget = function(){

		budgetCtrL.calculateBudget();

		var budget = budgetCtrL.getBudget();

		console.log(budget);
	}

	var ctrlAddItem = function(){
		
		//1- get the field input data
		var input = UICtrl.getInput();
		

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
				//UIcontroller.changeValues
		}
	}

	return {
		init:function(){
			setUpEventListeners();
			updateBudget();
		}
	}

}(budgetController,UIcontroller);

controller.init();