const initialState = {
    email: "",
};

const emailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_EMAIL": {
            return {
                ...state,
                email: action.emailAction,
            };
        }
        default: {
            return state;
        }
    }
};

export default emailReducer;
