const initialState = {
    nom: "",
};

const nomReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_NOM": {
            return {
                ...state,
                nom: action.nomAction,
            };
        }
        default: {
            return state;
        }
    }
};

export default nomReducer;
