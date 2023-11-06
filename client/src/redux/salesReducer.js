const initialState = {
    sales: [],
    loading: false,
    error: null
  };
  
  function salesReducer(state = initialState, action) {
    switch (action.type) {
      case 'FETCH_SALES_REQUEST':
        return {
          ...state,
          loading: true,
          error: null 
        };
      case 'FETCH_ALL_SALES_SUCCESS':
        return {
          ...state,
          sales: action.payload,
          loading: false
        };
      case 'FETCH_SALES_FAILURE':
        return {
          ...state,
          loading: false,
          error: action.payload
        };

      default:
        return state;
    }
  }
  
  export default salesReducer;
  