const initialState = {
    prenom: "",
};

const prenomReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_PRENOM": {
            return {
                ...state,
                prenom: action.prenomAction,
            };
        }
        default: {
            return state;
        }
    }
};

export default prenomReducer;
