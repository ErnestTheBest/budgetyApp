let DOM = {
    inputBtn: '.add__btn',
    budgetValue: '.budget__value',
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value'
};
let budgetController = (function () {

});

let UIController = (function () {
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: document.querySelector(DOM.inputValue).value
            }
        }
    }
});

let controller = (function (budgetCtrl, UICtrl) {

    let setupEventListeners = function () {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        })
    };

    let ctrlAddItem = function () {

        // 1. Get input
        let input = UICtrl.getInput();
        console.log(input);

        // 2. Add item to budget controller

        // 3. Add item to UI

        // 4. Calculate the budget

        // 5. Display the budget on the UI
    };

    return {
        init: function () {
            setupEventListeners();
            console.log('App starter.');
        }
    }
})(budgetController, UIController);

controller.init();