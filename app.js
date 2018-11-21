let DOM = {
    inputBtn: '.add__btn',
    budgetValue: '.budget__value',
    budgetIncomeValue: '.budget__income--value',
    budgetExpenseValue: '.budget__expenses--value',
    budgetExpensePercentage: '.budget__expenses--percentage',
    inputType: '.add__type',
    inputDescription: '.add__description',
    inputValue: '.add__value',
    incomeContainer: '.income__list',
    expenseContainer: '.expenses__list',
    container: '.container'
};

let budgetController = (function () {

    // Expense item constructor
    let Expense = function (type, id, desc, value) {
        this.type = type;
        this.id = id;
        this.description = desc;
        this.value = value;
        this.percentage = -1;
    };

    Expense.prototype.calcPercentage = function (totalIncome) {
        if (totalIncome > 0) {
            this.percentage = Math.round(this.value / totalIncome * 100);
        }
    };

    Expense.prototype.getPercentage = function () {
        return this.percentage;
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

        deleteItem: function (type, id) {
            let ids, itemId;

            ids = data.allItems[type].map(element => element.id);

            itemId = ids.indexOf(id);

            if (itemId !== -1) {
                data.allItems[type].splice(itemId, 1);
            }
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
        },

        calculatePercentages: function () {
            data.allItems.expense.forEach(e => e.calcPercentage(data.totals.income));
        },

        getPercentages: function () {
            let perc = data.allItems.expense.map(e => e.getPercentage());
            return perc;
        },

        getBudget: function () {
            return {
                budget: data.budget,
                percentage: data.percentage,
                income: data.totals.income,
                expense: data.totals.expense
            }
        },

        testDB: function () {
            return {
                data
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

        deleteListItem(selector) {
            let elem = document.getElementById(selector);

            elem.parentNode.removeChild(elem);
        },

        clearInput: function () {
            document.querySelectorAll(`${DOM.inputDescription}, ${DOM.inputValue}`)
                .forEach(e => e.value = "");
            document.querySelector(DOM.inputDescription).focus();
        },

        displayBudget: function (budget) {
            document.querySelector(DOM.budgetValue).textContent = budget.budget;
            document.querySelector(DOM.budgetIncomeValue).textContent = budget.income;
            document.querySelector(DOM.budgetExpenseValue).textContent = budget.expense;

            if (budget.percentage > 0) {
                document.querySelector(DOM.budgetExpensePercentage).textContent = budget.percentage + '%';
            } else {
                document.querySelector(DOM.budgetExpensePercentage).textContent = '---';
            }
        },

        displayPercentages: function() {
            
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
        });

        document.querySelector(DOM.container).addEventListener('click', ctrlDeleteItem)
    };

    let updateBudget = function () {
        // 1. Calculate the budget
        budgetCtrl.calculateBudget();

        // 2. Return the budget
        let budget = budgetCtrl.getBudget();

        // 3. Display the budget on the UI
        UICtrl.displayBudget(budget);
    };

    let updatePercentages = function () {
        // 1. Calculate percentages
        budgetCtrl.calculatePercentages();

        // 2. Get percentages
        let percentages = budgetCtrl.getPercentages();

        // 3. Update UI with percentages

        console.log(percentages);
    };

    let ctrlAddItem = function () {
        let input, newItem;

        // 1. Get input
        input = UICtrl.getInput();

        // If input is not empty
        if (input.description !== "" && !isNaN(input.value) && input.value > 0) {

            // 2. Add item to budget controller
            newItem = budgetCtrl.addItem(input.type, input.description, input.value);

            // 3. Add item to UI
            UICtrl.addListItem(newItem);

            // 4. Clear fields
            UICtrl.clearInput();

            // 5. Calculate and update budget
            updateBudget();

            // 6. Update percentages
            updatePercentages();
        }
    };

    let ctrlDeleteItem = function (event) {
        let itemID, splitID, type, ID;
        itemID = event.target.parentNode.parentNode.parentNode.parentNode.id;

        if (itemID) {
            splitID = itemID.split('-');
            type = splitID[0];
            ID = parseInt(splitID[1]);

            // 1. Remove item from DB
            budgetCtrl.deleteItem(type, ID);

            // 2. Delete the item from UI
            UICtrl.deleteListItem(itemID);

            // 3. Update and show new budget
            updateBudget();

            // 4. Update percentages
            updatePercentages();
        }
    };

    return {
        init: function () {
            setupEventListeners();
            UICtrl.displayBudget(budgetCtrl.getBudget());
            console.log('App starter.');
        }
    }
})(budgetController, UIController);

controller.init();