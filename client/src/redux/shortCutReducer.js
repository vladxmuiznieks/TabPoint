const initialState = [];

const shortCutReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'ADD_SHORTCUT':
    
      return [...state, action.payload];
    
    case 'REMOVE_SHORTCUT':
     
      return state.filter(shortcut => shortcut.id !== action.payload);

    default:
      return state;
  }
};

export default shortCutReducer;
