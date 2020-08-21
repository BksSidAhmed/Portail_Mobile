import { combineReducers } from 'redux';

// Imports: Reducers
import emailReducer from './reducers/emailReducer'
import passwordReducer from './reducers/passwordReducer'

// Redux: Root Reducer
const rootReducer = combineReducers({
    emailReducer: emailReducer,
    passwordReducer : passwordReducer
});

// Exports
export default rootReducer;