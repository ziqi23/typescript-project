import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import ticketReducer from './ticket';
import stadiumReducer from './stadium';

// Combine reducers
const rootReducer = combineReducers({
    ticket: ticketReducer,
    stadium: stadiumReducer
});

// Apply middleware based on application environment
let enhancer : any;
if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk)
} else {
    const logger = require('redux-logger').default
    enhancer = compose(applyMiddleware(thunk, logger))
}

// Pass in combined reducers and applied middleware to create global store
const preloadedState = {};
const configureStore = () => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;