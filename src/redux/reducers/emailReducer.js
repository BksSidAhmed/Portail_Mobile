// Initial State
const initialState = {
    email: "",
};
  
  // Reducers (Modifies The State And Returns A New State)
  const emailReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_EMAIL': {
        return {
          // State
          ...state,
          // Redux Store
          email: action.emailAction,
        }
      }
      // Default
      default: {
        return state;
      }
    }
  };
  
  // Exports
  export default emailReducer;