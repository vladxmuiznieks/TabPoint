const initialState = [];

export default function cartItemsReducer(state = initialState, action) {
 
  switch (action.type) {
    case 'ADD_TO_CART': {
      console.log('Current State:', state);
      console.log('Adding:', action.payload);
      console.log("Action received:", action); 
      const existingCartItem = state.find(item => item._id === action.payload._id);
      if (existingCartItem) {
        return state.map(item => item._id === action.payload._id ? { ...item, quantity: item.quantity + 1 } : item);
      } else {
        return [...state, { ...action.payload, quantity: 1 }];
      }
      
    }
    
    case 'UPDATE_CART':
      return state.map(item => item._id === action.payload._id ? { ...item, quantity: action.payload.quantity } : item);
    case 'DELETE_CART':
      return state.filter(item => item._id !== action.payload._id);
    case 'CLEAR_CART':
      return [];
    default:
      return state;
  }
}
