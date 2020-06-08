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
var budgetController = (function () {})();

// independant user interface module, it is IIFE
var UIController = (function () {})();

// budget app controller module, communicationg with budgetController as well as UIController by passing them as argument to it
/**
 * @param budgetCtrl - refer to budgetController
 * @param UICtrl - refer to UIController
 */
var controller = (function (budgetCtrl, UICtrl) {
  // shared method called in both event listener below
  var ctrlAddItem = function () {
    // get field input data
    // add item to budget controller
    // add new item to UI
    // calculate budget
    // display budget on UI
  };

  // event listener for add button by using css selector
  document.querySelector('.add__btn').addEventListener('click', ctrlAddItem);

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
})(budgetController, UIController);
