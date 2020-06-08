/*
// modular pattern for budget app example
var testModule = (function () {
  // private variable
  var x = 20;

  // private function
  function add(a) {
    return x + a;
  }

  // public function return as object and stored in testModule variable, works because of closure in JS
  // can call by using testModule.testPublic(5) => 25
  return {
    testPublic: function (b) {
      console.log(add(b));
    },
  };
})();
*/

// independant budget controller module, it is IIFE
var budgetController = (function () {
  // custom data model for expense using function constructor
  var Expense = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // custom data model for income using function constructor
  var Income = function (id, description, value) {
    this.id = id;
    this.description = description;
    this.value = value;
  };

  // budget app data structure
  var data = {
    allItems: {
      exp: [],
      inc: [],
    },
    totals: {
      exp: 0,
      inc: 0,
    },
  };

  // public functions of budget controller
  return {
    addItem: function (type, desc, val) {
      var newItem, ID;

      // ID = last element ID + 1
      if (data.allItems[type].length > 0) {
        ID = data.allItems[type][data.allItems[type].length - 1].id + 1;
      } else {
        ID = 0;
      }

      // create new item base ob 'inc' or 'exp' type
      if (type === 'exp') {
        newItem = new Expense(ID, desc, val);
      } else if (type === 'inc') {
        newItem = new Income(ID, desc, val);
      }

      // add newItem in its respective arrays of our datastructure
      data.allItems[type].push(newItem);

      // return new item
      return newItem;
    },
  };
})();

// independant user interface module, it is IIFE
var UIController = (function () {
  // private strings object
  var DOMStrings = {
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    inputButton: '.add__btn',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
  };

  // public function used in controller, always retured as object
  return {
    getInput: function () {
      return {
        // select type inc(+) / exp(-) from DOM
        type: document.querySelector(DOMStrings.inputType).value,
        // select description from DOM
        description: document.querySelector(DOMStrings.inputDescription).value,
        // select value from DOM
        value: document.querySelector(DOMStrings.inputValue).value,
      };
    },

    // return private object from public function
    getDOMStrings: function () {
      return DOMStrings;
    },

    // add newly created item to DOM
    /**
     * @param obj - newly created item ctrlAddItem function
     * @param type - inc or exp
     */
    addListItem: function (obj, type) {
      var html, newHtml, element;

      // create HTML string with placeholder text
      if (type === 'inc') {
        // select appropriate place in DOM for income i.e income__list class
        element = DOMStrings.incomeContainer;
        // create HTML string with placeholder text for income
        html =
          '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        // select appropriate place in DOM for expense i.e expenses__list class
        element = DOMStrings.expenseContainer;
        // create HTML string with placeholder text for expense
        html =
          '<div class="item clearfix" id="expense-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert HTMLinto the DOM
      // beforeend => insert as child of container
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },
  };
})();

// budget app controller module, communicationg with budgetController as well as UIController by passing them as argument to it
/**
 * @param budgetCtrl - refer to budgetController
 * @param UICtrl - refer to UIController
 */
var controller = (function (budgetCtrl, UICtrl) {
  // function containing all event listener
  var setupEventListener = function () {
    // get DOM strings from UIController
    var DOM = UICtrl.getDOMStrings();

    // event listener for add button by using css selector
    document
      .querySelector(DOM.inputButton)
      .addEventListener('click', ctrlAddItem);

    // keypress event not specific to any element but for overall document
    /**
     * @param event - automatically passed by browser when event happens, continuously in this case
     */
    document.addEventListener('keypress', function (event) {
      // if ENTER is pressed, keyCode => newer browser, which => older browser
      if (event.keyCode === 13 || event.which === 13) {
        ctrlAddItem();
      }
    });
  };

  // shared method called in both event listener below
  var ctrlAddItem = function () {
    var input, newItem;

    // get field input data, called function from UIController
    input = UICtrl.getInput();

    // add item to budget controller
    newItem = budgetCtrl.addItem(input.type, input.description, input.value);

    // add new item to UI
    UICtrl.addListItem(newItem, input.type);
    // calculate budget
    // display budget on UI
  };

  // public initialization function, always return as object outside IIFE
  return {
    init: function () {
      setupEventListener();
    },
  };
})(budgetController, UIController);

// initialization of budget app
controller.init();
