const initialState = [];

const tablesReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'LOAD_TABLES':
            return action.payload;
        case 'ADD_TABLE':
            return [...state, action.payload];
        case 'UPDATE_TABLE':
            return state.map(table => table._id === action.payload._id ? action.payload : table);
        case 'DELETE_TABLE':
            return state.filter(table => table._id !== action.payload);
        
        default:
            return state;
    }
};

export default tablesReducer;
