const UPDATE_SETTINGS = 'UPDATE_SETTINGS';

const initialState = {
  barName: '',
  thankYouMessage: '',
};

const settingsReducer = (state = initialState, action) => {
  switch (action.type) {
    case UPDATE_SETTINGS:
      return {
        ...state,
        ...action.payload,
      };
    default:
      return state;
  }
};

export default settingsReducer;

export const updateSettings = (settings) => ({
  type: UPDATE_SETTINGS,
  payload: settings,
});
