const initialState = false;

export default function loadingReducer(state = initialState, action) {
  switch (action.type) {
    case 'LOADING_SHOW':
      return true;
    case 'LOADING_HIDE':
      return false;
    default:
      return state;
  }
}
