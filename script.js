'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP

//////////// SECTION DATA
const account1 = {
  owner: 'Jonas Schmedtmann',
  movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
  interestRate: 1.2, // %
  pin: 1111,
};

const account2 = {
  owner: 'Jessica Davis',
  movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
  interestRate: 1.5,
  pin: 2222,
};

const account3 = {
  owner: 'Steven Thomas Williams',
  movements: [200, -200, 340, -300, -20, 50, 400, -460],
  interestRate: 0.7,
  pin: 3333,
};

const account4 = {
  owner: 'Sarah Smith',
  movements: [430, 1000, 700, 50, 90],
  interestRate: 1,
  pin: 4444,
};

const accounts = [account1, account2, account3, account4];

//////////// SECTION ELEMENTS
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

//////////// SECTION APP

/// SUB SECTION DISPLAY MOVEMENTS
const displayMov = function (movment, sort = false) {
  containerMovements.innerHTML = '';
  // .textcontect = 0
  const movs = sort ? movment.slice().sort((a, b) => a - b) : movment;
  movs.forEach(function (mov, i) {
    const type = mov > 0 ? 'deposit' : 'withdrawal';
    const html = `
    <div class="movements__row">
        <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
        <div class="movements__value">${mov}€</div>
    </div>`;
    containerMovements.insertAdjacentHTML('afterbegin', html);
  });
};

/// SUB SECTION CLACULATE AND DISPLAY THE SUMMERY
const calcDisplaySummery = function (account) {
  const incomes = account.movements
    .filter(mov => mov > 0)
    .reduce((acc, cur) => cur + acc, 0);
  labelSumIn.textContent = `${incomes}€`;
  const out = account.movements
    .filter(mov => mov < 0)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumOut.textContent = `${Math.abs(out)}€`;
  const interest = account.movements
    .filter(mov => mov > 0)
    .map(mov => (mov * account.interest) / 100)
    .filter(mov => mov >= 1)
    .reduce((acc, cur) => acc + cur, 0);
  labelSumInterest.textContent = `${interest}€`;
};
/// SUB SECTION CLACULATE AND DISPLAY THE BALANCE
const calcDisplayBalance = function (account) {
  account.balance = account.movements.reduce((acc, mov) => acc + mov, 0);
  labelBalance.textContent = `${account.balance}€`;
};

/// SUB SECTION CREAT USERNAME
const cretUserNames = function (accounts) {
  accounts.forEach(function (account) {
    account.userName = account.owner
      .toLocaleLowerCase()
      .split(' ')
      .map(name => name[0])
      .join('');
  });
};
cretUserNames(accounts);

/// SUB SECTION UPDATE
const updateUi = function (acc) {
  // display movements
  displayMov(acc.movements);
  // display balance
  calcDisplayBalance(acc);
  // displaysummery
  calcDisplaySummery(acc);
};
/// SUB SECTION   EVENT HANDLER
let curacc;
btnLogin.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('login');
  curacc = accounts.find(acc => acc.userName === inputLoginUsername.value);

  console.log(curacc);
  if (curacc?.pin === Number(inputLoginPin.value)) {
    // display ui and a welcome message
    labelWelcome.textContent = `Welcome back, ${curacc.owner.split(' ')[0]}`;
    containerApp.style.opacity = 100;
    // empty the input field
    inputLoginPin.value = inputLoginUsername.value = '';
    inputLoginPin.blur();
    updateUi(curacc);
  }
});

/// SUB SECTION TRANSFER
btnTransfer.addEventListener('click', function (e) {
  e.preventDefault();
  const amount = Number(inputTransferAmount.value);
  const resiveracc = accounts.find(
    acc => acc.userName === inputTransferTo.value
  );
  inputTransferAmount.value = inputTransferTo.value = '';
  // is the amount positive?
  // dose the current user have the amount?
  // shouldnt be able to to transfer to tha same acc
  if (
    amount > 0 &&
    resiveracc &&
    amount <= curacc.balance &&
    resiveracc?.userName !== curacc.userName
  ) {
    // add apositve to resiver
    resiveracc.movements.push(amount);
    // add a negetive to sender
    curacc.movements.push(-amount);
    updateUi(curacc);
  }
});

/// SUB SECTION CLOSING A ACCOUNT
btnClose.addEventListener('click', function (e) {
  e.preventDefault();
  console.log('delete');
  if (
    curacc.userName === inputCloseUsername.value &&
    curacc.pin === Number(inputClosePin.value)
  ) {
    const index = accounts.findIndex(acc => acc.userName == curacc.userName);
    console.log(index);
    accounts.splice(index, 1);

    labelWelcome.textContent = `Log in to get started`;
    containerApp.style.opacity = 0;
  }
  inputCloseUsername.value = inputClosePin.value = '';
});

/// SUB SECTION LOAN
btnLoan.addEventListener('click', function (e) {
  e.preventDefault();

  const amount = Number(inputLoanAmount.value);
  if (amount > 0 && curacc.movements.some(mov => mov >= amount * 0.1)) {
    // add the movement
    curacc.movements.push(amount);
    updateUi(curacc);
  }
  inputLoanAmount.value = '';
});

/// SUB SECTION SORT
let sorted = false;
btnSort.addEventListener('click', function (e) {
  e.preventDefault();
  displayMov(curacc.movements, !sorted);
  sorted = !sorted;
});
