const initialState = null;

export default function selectedTableReducer(state = initialState, action) {
  switch (action.type) {
    case 'SELECT_TABLE':
      return action.payload;
    default:
      return state;
  }
}
