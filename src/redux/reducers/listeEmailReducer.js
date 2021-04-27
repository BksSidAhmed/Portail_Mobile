const initialState = {
    emails: [],
};

const listeEmailReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_LISTE_EMAIL": {
            return {
                ...state,
                emails: [...state.emails, action.listeEmailAction],
            };
        }
        case "RESET_LISTE_EMAIL": {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default listeEmailReducer;
