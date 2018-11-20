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
    let Expense = function (type, id, description, value) {
        this.type = type;
        this.id = id;
        this.description = description;
        this.value = value;
    };

    // Income item constructor
    let Income = function (type, id, description, value) {
        this.type = type;
        this.id = id;
        this.description = description;
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
        }
    };

    // Give global access to budget controller
    return {
        addItem: function (type, desc, val) {
            let newItem, ID;
            data.allItems[type].length > 0 ?
                ID = data.allItems[type][data.allItems[type].length - 1].id + 1 :
                ID = 0;

            if (type === 'expense') {
                newItem = new Expense(type, ID, desc, val);
                ID++;
            } else if (type === 'income') {
                newItem = new Income(type, ID, desc, val);
                ID++;
            }

            data.allItems[type].push(newItem);
            return newItem;
        }
    }
})();

let UIController = (function () {
    return {
        getInput: function () {
            return {
                type: document.querySelector(DOM.inputType).value,
                description: document.querySelector(DOM.inputDescription).value,
                value: document.querySelector(DOM.inputValue).value
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

    let ctrlAddItem = function () {
        let input, newItem;

        // 1. Get input
        input = UICtrl.getInput();
        console.log(input);

        // 2. Add item to budget controller
        newItem = budgetCtrl.addItem(input.type, input.description, input.value);
        console.log(newItem);

        // 3. Add item to UI
        UICtrl.addListItem(newItem);

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