import { combineReducers } from "redux";
import emailReducer from "./reducers/emailReducer";
import passwordReducer from "./reducers/passwordReducer";
import pointingReducer from "./reducers/pointingReducer";
import listeEmailReducer from "./reducers/listeEmailReducer";
import langueReducer from "./reducers/langueReducer";

const rootReducer = combineReducers({
    emailReducer: emailReducer,
    passwordReducer: passwordReducer,
    pointingReducer: pointingReducer,
    listeEmailReducer: listeEmailReducer,
    langueReducer: langueReducer,
});

export default rootReducer;
