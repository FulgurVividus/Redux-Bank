// Pure Redux Code

import { combineReducers, createStore } from "redux";

const initialStateAccount = {
  balance: 0,
  loan: 0,
  loanPurpose: "",
};

const initialStateCustomer = {
  fullName: "",
  nationalID: "",
  createdAt: "",
};

// reducers are not allowed to modify existing state and do any asynchronous logic or other side effects.
// the difference between the useReducer's reducer and this one's, is that here we directly pass in the initialState as the default state.
function accountReducer(state = initialStateAccount, action) {
  // the actions that gonna be dispatched to this reducer or actually to the Redux Store, they will have to have shape of type and payload.
  switch (action.type) {
    // state_domain / event_name
    case "account/deposit":
      return { ...state, balance: state.balance + action.payload };
    case "account/withdraw":
      return { ...state, balance: state.balance - action.payload };
    case "account/requestLoan":
      if (state.loan > 0) return state;
      return {
        ...state,
        loan: action.payload.amount,
        loanPurpose: action.payload.purpose,
        balance: state.balance + action.payload.amount,
      };
    case "account/payLoan":
      return {
        ...state,
        loan: 0,
        loanPurpose: "",
        balance: state.balance - state.loan,
      };

    default:
      // in Redux, it's not advised to 'throw new Error', just return current state
      return state;
  }
}

//

function customerReducer(state = initialStateCustomer, action) {
  switch (action.type) {
    case "customer/createCustomer":
      return {
        ...state,
        fullName: action.payload.fullName,
        nationalID: action.payload.nationalID,
        createdAt: action.payload.createdAt,
      };
    case "customer/updateName":
      return { ...state, fullName: action.payload };

    default:
      return state;
  }
}

//# creating Redux Store
// it will return 'store'. If we have more than 1 'reducer', we gotta create a 'root reducer' and pass it in 'createReducer()'
const rootReducer = combineReducers({
  account: accountReducer,
  customer: customerReducer,
});

const store = createStore(rootReducer);

//# on the 'store' we can dispatch actions. Works the same as in useReducer().
// store.dispatch({ type: "account/deposit", payload: 500 });
// store.dispatch({ type: "account/withdraw", payload: 200 });

//# this will show the current state of our store
// console.log(store.getState());

// store.dispatch({
//   type: "account/requestLoan",
//   payload: { amount: 1000, purpose: "Buy a car" },
// });
// console.log(store.getState());

// store.dispatch({ type: "account/payLoan" });
// console.log(store.getState());

//# in Redux, we don't manually write the action in the dispatch, instead we make Action Creator function to automate this process.
function deposit(amount) {
  return { type: "account/deposit", payload: amount };
}

function withdraw(amount) {
  return { type: "account/withdraw", payload: amount };
}

function requestLoan(amount, purpose) {
  return {
    type: "account/requestLoan",
    payload: { amount, purpose },
  };
}

function payLoan() {
  return { type: "account/payLoan" };
}

store.dispatch(deposit(500));
store.dispatch(withdraw(200));
console.log(store.getState());

store.dispatch(requestLoan(1000, "Buy a car"));
console.log(store.getState());

store.dispatch(payLoan());
console.log(store.getState());

//

function createCustomer(fullName, nationalID) {
  return {
    type: "customer/createCustomer",
    payload: { fullName, nationalID, createdAt: new Date().toISOString() },
  };
}

function updateName(fullName) {
  return { type: "customer/updateName", payload: fullName };
}

store.dispatch(createCustomer("Murodjon Muzaffarov", "12345ADB"));
console.log(store.getState());
