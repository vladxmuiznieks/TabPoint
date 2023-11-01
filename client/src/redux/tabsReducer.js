const initialState = {
  tabs: [],

};

const tabsReducer = (state = initialState, action) => {
  switch (action.type) {
    case 'LOAD_TABS':
      return {
        ...state,
        tabs: action.payload
      };
    case 'tabs/updateTab':
      return {
        ...state,
        tabs: state.tabs.map(tab =>
          tab._id === action.payload.tabId ? { ...tab, ...action.payload.newTabData } : tab
        )
      };
    case 'tabs/removeTab':
      return {
        ...state,
        tabs: state.tabs.filter(tab => tab._id !== action.payload)
      };
      case 'CLOSE_TAB':
        return {
          ...state,
          tabs: state.tabs.map(tab =>
            tab._id === action.payload ? { ...tab, dateClosed: new Date() } : tab
          )
        };
      

    default:
      return state; 
  }
};
  
  export default tabsReducer;