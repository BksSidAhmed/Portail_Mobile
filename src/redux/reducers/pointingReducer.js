const initialState = {
    pointing: [],
};

const pointingReducer = (state = initialState, action) => {
    switch (action.type) {
        case "SAVE_POINTING": {
            return {
                ...state,
                pointing: action.pointingAction,
            };
        }
        case "RESET": {
            return initialState;
        }
        default: {
            return state;
        }
    }
};

export default pointingReducer;
