var bugetController = function(){

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

	var data = {
		allItens:{
			exp: [],
			inc: []
		},
		totals:{
			exp:0,
			inc:0
		}
	}

	return{
		addItem: function(type,des,val){
			var newItem, ID;

			//Create new ID
			if (data.allItens[type].length > 0) {
				ID = data.allItens[type][data.allItens[type].length - 1].ID+1;
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
			inputBtn:'.add__btn'
		};


		return{
			getInput:function(){
				return{
					type:document.querySelector(DOMstrings.inputType).value,
					description:document.querySelector(DOMstrings.inputDescription).value,
					value: document.querySelector(DOMstrings.inputValue).value	
				}
			},

			addListItem: function(obj,type){

				//create html string with plalceholder text

				//replace the placeholder text with some actual data

				//insert the html into the dom
			},

			getDOMstrings:function(){
				return DOMstrings;
			}			
		};

}();

var controller = function(bugetCtrL,UICtrl){

	var setUpEventListeners = function(){

		var dom = UICtrl.getDOMstrings();
		document.querySelector(dom.inputBtn).addEventListener("click",ctrlAddItem);
		document.addEventListener('keypress',function(event){
		if(event.keyCode === 13){
				ctrlAddItem();
			}
		});
	}

	var ctrlAddItem = function(){
		
		var input = UICtrl.getInput();
		
		console.log(input.type);
		var one = bugetCtrL.addItem(input.type, input.description, input.value);

		bugetController.testing();
	}

	return{
		init:function(){
			setUpEventListeners();
		}
	}

}(bugetController,UIcontroller);

controller.init();