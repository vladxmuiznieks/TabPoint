const initialState = [];

export default function productsReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOAD_PRODUCTS':
      return action.payload;
    case 'REMOVE_PRODUCT':
      return state.filter(product => product._id !== action.payload._id);
    default:
      return state;
      case 'LOAD_PRODUCTS_BY_CATEGORY':
  return {
    ...state,
    products: action.payload,
  };
  }
}
