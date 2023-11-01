// Initial categories
const initialCategories = ['beer', 'wine', 'spirits', 'food', 'misc'];

// Category reducer
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

export default categoryReducer;
