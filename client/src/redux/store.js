import { legacy_createStore, combineReducers, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import { composeWithDevTools } from 'redux-devtools-extension';
import rootReducer from './rootReducer';
import axios from 'axios';

// Initial categories
const initialCategories = ['beer', 'wine', 'spirits', 'food', 'misc'];

const categoryReducer = (state = initialCategories, action) => {
    switch (action.type) {
      case 'ADD_CATEGORY':
        return [...state, action.payload];
      case 'REMOVE_CATEGORY':
        return state.filter(category => category !== action.payload);
      case 'LOAD_CATEGORIES':
        return action.payload;
      default:
        return state;
    }
  };
  

// Combine reducers
const finalReducer = combineReducers({
  rootReducer,
  categories: categoryReducer, 
});


const initialState = {
  selectedTable: null,
  tables: [],
  rootReducer: {
    cartItems: localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [],
    tabs: localStorage.getItem('tabs') 
      ? JSON.parse(localStorage.getItem('tabs')) 
      : [], 
  },
  categories: localStorage.getItem('categories') 
    ? JSON.parse(localStorage.getItem('categories')) 
    : initialCategories,
    settings: {
      barName: '',
      thankYouMessage: '',
      sales: [],
    },
};




export const loadCategories = () => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.get('http://localhost:3000/api/products/getcategories');
      dispatch({ type: 'LOAD_CATEGORIES', payload: response.data });
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  

  export const addCategory = (category) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      await axios.post('/api/products/addcategory', category);
      dispatch(loadCategories());
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  export const deleteCategory = (id) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      await axios.delete(`/api/products/deletecategory/${id}`);
      dispatch(loadCategories());
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };

  export const addTab = (tab) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      await axios.post('http://localhost:3000/api/tabs/add', tab);
      dispatch(loadTabs());
      
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };

  export const addSale = (sale) => async (dispatch) => {
    try {
      const { data } = await axios.post('http://localhost:3000/api/sales', sale);
      dispatch({ type: 'ADD_SALE', payload: data });
    } catch (error) {
      console.error('Error adding sale:', error.response.data); 
    }
  };

  
  
  export const loadTabs = () => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.get('http://localhost:3000/api/tabs/gettabs');
      console.log('Tabs response data:', response.data); 
      dispatch({ type: 'LOAD_TABS', payload: response.data.tabs }); 
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  export const updateTab = (tabId, newTabData) => ({
    type: 'tabs/updateTab',
    payload: { tabId, newTabData }
  });
  
  export const removeTab = (tabId) => async (dispatch, getState) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
  
      console.log('Removing tab with ID:', tabId);  
  

      await axios.delete(`http://localhost:3000/api/tabs/${tabId}`);
  
      
      dispatch({ 
        type: 'tabs/removeTab', 
        payload: tabId 
      });
  
      dispatch({ type: 'LOADING_HIDE' });
  
    
      localStorage.setItem('tabs', JSON.stringify(getState().rootReducer.tabs));
    } catch (error) {
      console.error('Failed to remove tab:', error);
      console.error('Error response:', error.response);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  
  export const closeTab = (tabData) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.put(`http://localhost:3000/api/tabs/closetab/${tabData.tabId}`, tabData);
      if (response.status === 200) {
        dispatch({
          type: 'CREATE_SALE',
          payload: {
            ...tabData,
            saleDate: new Date(), 
          },
        });
        dispatch({
          type: 'CLOSE_TAB',
          payload: tabData.tabId,
        });
      }
  
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error('Failed to close tab:', error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  

  
  export const getProductsByCategory = (categoryId) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.get(`/api/products/getproductsbycategory/${categoryId}`);
      dispatch({ type: 'LOAD_PRODUCTS_BY_CATEGORY', payload: response.data });
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  

  

  export const updateTableNoInTab = async (tabId, tableNo) => {
    try {
      const response = await fetch(`http://localhost:3000/api/tabs/updatetable/${tabId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ tableNo }),
      });
  
      const data = await response.json();
      return data;
    } catch (error) {
      console.error(error);
    }
  };

  export const saveTablePlan = (tablePlan) => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.post('/api/table-plans', tablePlan);
      dispatch({ type: 'SAVE_TABLE_PLAN', payload: response.data });
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };
  
  export const loadTablePlans = () => async (dispatch) => {
    try {
      dispatch({ type: 'LOADING_SHOW' });
      const response = await axios.get('/api/table-plans');
      dispatch({ type: 'LOAD_TABLE_PLANS', payload: response.data });
      dispatch({ type: 'LOADING_HIDE' });
    } catch (error) {
      console.error(error);
      dispatch({ type: 'LOADING_HIDE' });
    }
  };

  export const fetchTables = () => async dispatch => {
    try {
        const response = await axios.get('/api/table-plans');
        if (response.data && response.data.tables) {
            dispatch({ type: 'LOAD_TABLES', payload: response.data.tables });
        }
    } catch (error) {
        console.error("Error fetching tables:", error);
    }
};
  
  export const selectTable = (table) => {
    
    return {
      type: 'SELECT_TABLE',
      payload: table
      
    };
    
  };

  
  
  export const loadTables = (tables) => {
    return {
        type: 'LOAD_TABLES',
        payload: tables
    };
  };


export const fetchAllSales = () => {
  return async (dispatch) => {
    try {
      const response = await fetch('/api/sales'); 
      const data = await response.json();
      console.log('Data from fetchAllSales:', data);

      if (response.ok) {
        dispatch({ type: 'FETCH_ALL_SALES_SUCCESS', payload: data });
      } else {
        throw new Error('Failed to fetch sales');
      }
    } catch (error) {
      console.error('Fetch all sales failed:', error);
      dispatch({ type: 'FETCH_ALL_SALES_FAILURE' });
     
    }
  };
};


export const fetchXReport = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/sales/reports/x');
    dispatch({ type: 'FETCH_X_REPORT', payload: response.data });
  } catch (error) {
    console.error('Error fetching X report:', error);
  }
};


export const fetchZReport = () => async (dispatch) => {
  try {
    const response = await axios.get('/api/sales/reports/z');
    dispatch({ type: 'FETCH_Z_REPORT', payload: response.data });
  } catch (error) {
    console.error('Error fetching Z report:', error);
  }
};



export const clearSales = (startDate, endDate) => {
  return async (dispatch) => {
    try {
      const response = await axios.post('http://localhost:3000/api/sales/clear', {
        startDate,
        endDate
      });
      dispatch({
        type: 'SALES_CLEARED',
        payload: response.data
      });
    } catch (error) {
      throw new Error('Failed to clear sales');
    }
  };
};


// Middleware
const middleware = [thunk];

const store = legacy_createStore(
  finalReducer, 
  initialState,
  
  composeWithDevTools(applyMiddleware(...middleware))
);

store.subscribe(() => {
  localStorage.setItem('categories', JSON.stringify(store.getState().categories));
});

store.subscribe(() => {
  localStorage.setItem('tabs', JSON.stringify(store.getState().rootReducer.tabs));
});



export default store;