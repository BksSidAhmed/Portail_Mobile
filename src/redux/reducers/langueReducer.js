const initialState = {
    langue: "",
};

const langueReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_LANGUE": {
            return {
                ...state,
                langue: action.langueAction,
            };
        }
        default: {
            return state;
        }
    }
};

export default langueReducer;
