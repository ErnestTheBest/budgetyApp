let DOM = {
    inputBtn: '.add__btn',
    budgetValue: '.budget__value',
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list'
};

let budgetController = (function () {

    // Expense item constructor
    let Expense = function (type, id, desc, value) {
        this.type = type;
        this.id = id;
        this.description = desc;
        this.value = value;
    };

    // Income item constructor
    let Income = function (type, id, desc, value) {
        this.type = type;
        this.id = id;
        this.description = desc;
        this.value = value;
    };

    // "DB" model to store all data
    let data = {
        allItems: {
            expense: [],
            income: []
        },
        totals: {
            expense: 0,
            income: 0
        },
        budget: 0,
        percentage: -1
    };

    function calculateArraySum(arr) {
        let sum = 0;
        arr.forEach(e => sum += e.value);
        return sum;
    }

    // Give global access to budget controller
    return {
        addItem: function (type, desc, val) {
            let newItem, ID;
            data.allItems[type].length > 0 ?
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 :
                ID = 0;

            if (type === 'expense') {
                newItem = new Expense(type, ID, desc, val);
            } else if (type === 'income') {
                newItem = new Income(type, ID, desc, val);
            }

            data.allItems[type].push(newItem);
            return newItem;
        },

        calculateBudget: function () {
            // Calculate total income and expense
            data.totals.income = calculateArraySum(data.allItems.income);
            data.totals.expense = calculateArraySum(data.allItems.expense);

            // Calculate budget: income - expense
            data.budget = data.totals.income - data.totals.expense;

            // Calculate % of income that we spent
            if (data.totals.income > 0) {
                data.percentage = Math.round(data.totals.expense / data.totals.income * 100);
            }

            console.log(data);
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                income: data.totals.income,
                expense: data.totals.expense
            }
        }
    }
})();

let UIController = (function () {
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: parseFloat(document.querySelector(DOM.inputValue).value)
            }
        },

        addListItem: function (obj) {
            let html, element;

            // Create HTML
            if (obj.type === 'income') {
                element = document.querySelector(DOM.incomeContainer);
                html =
                    `<div class="item clearfix" id="income-${obj.id}">
                    <div class="item__description">${obj.description}</div>\
                    <div class="right clearfix">
                    <div class="item__value">${obj.value}</div>
                    <div class="item__delete">
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>
                    </div></div></div>`;
            } else if (obj.type === 'expense') {
                element = document.querySelector(DOM.expenseContainer);
                html =
                    `<div class="item clearfix" id="expense-${obj.id}">\
                    <div class="item__description">${obj.description}</div>\
                    <div class="right clearfix">\
                    <div class="item__value">${obj.value}</div>\
                    <div class="item__percentage">21%</div>\
                    <div class="item__delete">\
                    <button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button>\
                    </div></div></div>`;
            }

            // Insert HTML into DOM
            element.insertAdjacentHTML('beforebegin', html)
        },

        clearInput: function () {
            document.querySelectorAll(`${DOM.inputDescription}, ${DOM.inputValue}`)
                .forEach(e => e.value = "");
            document.querySelector(DOM.inputDescription).focus();
        }
    }
})();

let controller = (function (budgetCtrl, UICtrl) {

    // Setup event listeners for elements
    let setupEventListeners = function () {
        document.querySelector(DOM.inputBtn).addEventListener('click', ctrlAddItem);

        document.addEventListener('keypress', function (event) {
            if (event.keyCode === 13) {
                ctrlAddItem();
            }
        })
    };

    let updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
    };

    let ctrlAddItem = function () {
        let input, newItem;

        // 1. Get input
        input = UICtrl.getInput();
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI
            UICtrl.addListItem(newItem);

            // 4. Clear fields
            UICtrl.clearInput();

            // 5. Calculate and update budget
            updateBudget();
        }
    };

    return {
        init: function () {
            setupEventListeners();
            console.log('App starter.');
        }
    }
})(budgetController, UIController);

controller.init();