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
var controller = (function (budgetCtrl, UICtrl) {
  // some code here
})(budgetController, UIController);
