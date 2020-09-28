import { combineReducers } from 'redux';

// Imports: Reducers
import emailReducer from './reducers/emailReducer'
import passwordReducer from './reducers/passwordReducer'
import pointingReducer from './reducers/pointingReducer'
import listeEmailReducer from './reducers/listeEmailReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
    emailReducer: emailReducer,
    passwordReducer : passwordReducer,
    pointingReducer : pointingReducer,
    listeEmailReducer : listeEmailReducer
});

// Exports
export default rootReducer;