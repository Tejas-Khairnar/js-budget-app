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
    this.percentage = -1;
  };

  // add new method using prototype property so that all its instances can access it
  Expense.prototype.calPercentage = function (totalIncome) {
    if (totalIncome > 0) {
      this.percentage = Math.round((this.value / totalIncome) * 100);
    } else {
      this.percentage = -1;
    }
  };

  // return above calculated percentage
  Expense.prototype.getPercentage = function () {
    return this.percentage;
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
    budget: 0,
    percentage: -1,
  };

  /**
   * calculate total
   * @param type - either inc or exp
   */
  var calculateTotal = function (type) {
    var sum = 0;
    data.allItems[type].forEach((current) => {
      sum += current.value;
    });

    // store sum to respective attributes
    data.totals[type] = sum;
  };

  // public functions of budget controller
  return {
    // add new item
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

    /**
     * delete existing item
     * @param type - either inc or exp
     * @param id - unique id of selected item
     */
    deleteItem: function (type, id) {
      var ids, index;

      // Array.map => return new array
      ids = data.allItems[type].map(function (current, index, array) {
        return current.id;
      });

      // find index of item to be deleted
      index = ids.indexOf(id);

      // delete item on that specific index
      // Array.splice(position, number of items to delete, number of items to add)
      if (index !== -1) {
        data.allItems[type].splice(index, 1);
      }
    },

    // logic for calculate budget
    calculateBudget: function () {
      // calculate total income and expenses
      calculateTotal('inc'); // total for income
      calculateTotal('exp'); // total for expense

      // calculate budget => income - expense
      data.budget = data.totals.inc - data.totals.exp;

      // calculate percentage for income that we spent
      // check to avoid divide by zero case
      if (data.totals.inc > 0) {
        data.percentage = Math.round((data.totals.exp / data.totals.inc) * 100);
      } else {
        data.percentage = -1;
      }
    },

    // logic for calculate expense percentages on total income
    calculatePercentage: function () {
      // Array.forEach => loop through array only
      data.allItems.exp.forEach(function (current) {
        current.calPercentage(data.totals.inc);
      });
    },

    getPercentages: function () {
      // Array.map => loop through array and return new array
      var allPer = data.allItems.exp.map(function (current) {
        return current.getPercentage();
      });
      return allPer;
    },

    // return calculated budget
    getBudget: function () {
      return {
        budget: data.budget,
        totalInc: data.totals.inc,
        totalExp: data.totals.exp,
        percentage: data.percentage,
      };
    },

    // testing of data structure
    testing: function () {
      console.log(data);
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
    budgetLabel: '.budget__value',
    incomeLabel: '.budget__income--value',
    expenseLabel: '.budget__expenses--value',
    percentageLabel: '.budget__expenses--percentage',
    container: '.container',
    expensePercentageLabel: '.item__percentage',
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
        // parseFloat => convert string to number
        value: parseFloat(document.querySelector(DOMStrings.inputValue).value),
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
          '<div class="item clearfix" id="inc-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      } else if (type === 'exp') {
        // select appropriate place in DOM for expense i.e expenses__list class
        element = DOMStrings.expenseContainer;
        // create HTML string with placeholder text for expense
        html =
          '<div class="item clearfix" id="exp-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__percentage">21%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
      }

      // replace placeholder text with actual data
      newHtml = html.replace('%id%', obj.id);
      newHtml = newHtml.replace('%description%', obj.description);
      newHtml = newHtml.replace('%value%', obj.value);

      // insert HTMLinto the DOM
      // beforeend => insert as child of container
      document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);
    },

    /**
     * delete item from DOM
     * @param selectorId - id of target element
     */
    deleteListItem: function (selectorId) {
      // select target element here
      var el = document.getElementById(selectorId);
      // we need to target parent element to remove its child element i.e target element
      el.parentNode.removeChild(el);
    },

    // clearing input fields when click on add btn OR ENTER key
    clearFields: function () {
      var fields, fieldArr;

      // querySelectorAll => return node list
      fields = document.querySelectorAll(
        DOMStrings.inputDescription + ', ' + DOMStrings.inputValue
      );

      // convert node list into array
      fieldArr = Array.prototype.slice.call(fields);
      /**
       * forEach gives 3 things inside its callback function
       * current => currentElement
       * index => index from 0 to Array.length - 1
       * array => full array
       */
      fieldArr.forEach(function (current, index, array) {
        current.value = ''; // clear description ans value here
      });

      // after clear first field is focused
      fieldArr[0].focus();
    },

    /**
     * display budget on UI
     * @param obj - budget obj from budget controller
     */
    displayBudget: function (obj) {
      // display budget
      document.querySelector(DOMStrings.budgetLabel).textContent = obj.budget;
      // display total income
      document.querySelector(DOMStrings.incomeLabel).textContent = obj.totalInc;
      // display total expenses
      document.querySelector(DOMStrings.expenseLabel).textContent =
        obj.totalExp;

      if (obj.percentage > 0) {
        // display expenses percentage
        document.querySelector(DOMStrings.percentageLabel).textContent =
          obj.percentage + '%';
      } else {
        document.querySelector(DOMStrings.percentageLabel).textContent = '---';
      }
    },

    /**
     *
     * @param percentagesArr - all percentages array from budget controller
     */
    displayPercentages: function (percentagesArr) {
      var fields = document.querySelectorAll(DOMStrings.expensePercentageLabel);

      // this callback function get called for each iteration when this function get called
      var nodeListForEach = function (list, callback) {
        for (var i = 0; i < list.length; i++) {
          callback(list[i], i);
        }
      };

      // custom forEach function for nodeList return from document.querySelectorAll
      nodeListForEach(fields, function (current, index) {
        if (percentagesArr[index] > 0) {
          // change textContent on DOM for each iteration
          current.textContent = percentagesArr[index] + '%';
        } else {
          current.textContent = '---';
        }
      });
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

    // event delegation for delete item
    document
      .querySelector(DOM.container)
      .addEventListener('click', ctrlDeleteItem);
  };

  // update budget
  var updateBudget = function () {
    // calculate budget
    budgetCtrl.calculateBudget();

    // return budget
    var budget = budgetCtrl.getBudget();

    // display budget on UI
    UICtrl.displayBudget(budget);
  };

  // update percentages in app when new item add or any item delete
  var updatePercentages = function () {
    // calculate percentages
    budgetCtrl.calculatePercentage();

    // read percentages from budget controller
    var percentages = budgetCtrl.getPercentages();

    // update the UI with new percentages
    UICtrl.displayPercentages(percentages);
  };

  // shared method called in both event listener below
  var ctrlAddItem = function () {
    var input, newItem;

    // get field input data, called function from UIController
    input = UICtrl.getInput();

    // check for empty fields
    if (input.description !== '' && !isNaN(input.value) && input.value > 0) {
      // add item to budget controller
      newItem = budgetCtrl.addItem(input.type, input.description, input.value);

      // add new item to UI
      UICtrl.addListItem(newItem, input.type);

      // clear the input fields
      UICtrl.clearFields();

      // calculate and update budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  /**
   * shared method to delete item fromour data structure
   * @param event.target - want to know target element on which event triggerd first
   */
  var ctrlDeleteItem = function (event) {
    // get parent element from target element
    // console.log(event.target.parentNode.parentNode.parentNode.parentNode.id);

    var itemId, splitID, type, ID;
    // parent id of target element
    itemId = event.target.parentNode.parentNode.parentNode.parentNode.id;

    if (itemId) {
      // split string at - (here format is => inc-1)
      splitID = itemId.split('-');
      type = splitID[0];
      // convert string to number here
      ID = parseInt(splitID[1]);

      // delete the item from data structure
      budgetCtrl.deleteItem(type, ID);

      // delete item from UI
      UICtrl.deleteListItem(itemId);

      // update and show new budget
      updateBudget();

      // calculate and update percentages
      updatePercentages();
    }
  };

  // public initialization function, always return as object outside IIFE
  return {
    init: function () {
      console.log('Application started...');

      // reset all budget on UI initially
      UICtrl.displayBudget({
        budget: 0,
        totalInc: 0,
        totalExp: 0,
        percentage: -1,
      });

      // setup all initial event listeners
      setupEventListener();
    },
  };
})(budgetController, UIController);

// initialization of budget app
controller.init();
