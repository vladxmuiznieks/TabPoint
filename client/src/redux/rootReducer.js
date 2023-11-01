import { combineReducers } from 'redux';
import loadingReducer from './loadingReducer';
import cartItemsReducer from './cartItemsReducer';
import productsReducer from './productsReducer';
import tabsReducer from './tabsReducer';
import totalAmountDueReducer from './totalAmountDueReducer';
import amountPaidReducer from './amountPaidReducer';
import changeOwedReducer from './changeOwedReducer';
import tablesReducer from './tablesReducer'; 
import selectedTableReducer from './selectedTableReducer';
import shortCutReducer from './shortCutReducer';

const rootReducer = combineReducers({
  loading: loadingReducer,
  cartItems: cartItemsReducer,
  products: productsReducer,
  totalAmountDue: totalAmountDueReducer,
  amountPaid: amountPaidReducer,
  changeOwed: changeOwedReducer,
  tables: tablesReducer,
  selectedTable: selectedTableReducer,
  tabs: tabsReducer,
  shortcuts: shortCutReducer,
});

export default rootReducer;
