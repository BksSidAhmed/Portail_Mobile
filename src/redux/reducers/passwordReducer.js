const initialState = {
    password: "",
};

const passwordReducer = (state = initialState, action) => {
    switch (action.type) {
      	case 'SAVE_PASSWORD': {
			return {
				...state,
				password: action.passwordAction,
			}
      	}
      	default: {
        	return state;
      	}
    }
};

export default passwordReducer;