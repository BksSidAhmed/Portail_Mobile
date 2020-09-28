// Initial State
const initialState = {
    pointing: [],
};
  
  // Reducers (Modifies The State And Returns A New State)
  const pointingReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_POINTING': {
        return {
          // State
          ...state,
          // Redux Store
          pointing: action.pointingAction,
        }
      } 
      // case 'RESET_TABLE_ACTION': {
      //   return {
      //     // State
      //     ...state,
      //     // Redux Store
      //     pointing: [...state.pointing.filter(

      //     )]
      //   }
      // } 
      // reset store
      case 'RESET' : {
          return initialState
      }
      // Default
      default: {
        return state;
      }
    }
  };
  
  // Exports
  export default pointingReducer;