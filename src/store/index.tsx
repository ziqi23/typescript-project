import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import eventReducer from './event';

const preloadedState = {};

const rootReducer = combineReducers({
    event: eventReducer
});

let enhancer : any;
if (process.env.NODE_ENV === 'production') {
    enhancer = applyMiddleware(thunk)
} else {
    const logger = require('redux-logger').default
    // const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
    enhancer = compose(applyMiddleware(thunk, logger))
}

const configureStore = () => {
    return createStore(rootReducer, preloadedState, enhancer);
};

export default configureStore;