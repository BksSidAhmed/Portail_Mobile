// Initial State
const initialState = {
    password: "",
};
  
  // Reducers (Modifies The State And Returns A New State)
  const passwordReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_PASSWORD': {
        return {
          // State
          ...state,
          // Redux Store
          password: action.passwordAction,
        }
      }
      // Default
      default: {
        return state;
      }
    }
  };
  
  // Exports
  export default passwordReducer;