// Initial State
const initialState = {
    emails: [],
};
  
  // Reducers (Modifies The State And Returns A New State)
  const listeEmailReducer = (state = initialState, action) => {
    switch (action.type) {
      case 'SAVE_LISTE_EMAIL': {
        return {
          // State
          ...state,
          // Redux Store
          emails: [...state.emails, action.listeEmailAction],
        }
      } 
        // reset store
        case 'RESET_LISTE_EMAIL' : {
          return initialState
      }
      // Default
      default: {
        return state;
      }
    }
  };
  
  // Exports
  export default listeEmailReducer;