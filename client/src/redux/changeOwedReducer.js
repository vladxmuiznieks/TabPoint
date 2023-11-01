const initialState = 0;

export default function changeOwedReducer(state = initialState, action) {
  switch (action.type) {
    case 'SET_CHANGE_OWED':
      return action.payload;
    default:
      return state;
  }
}
