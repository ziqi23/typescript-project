import {createStore, combineReducers, applyMiddleware, compose} from 'redux'
import thunk from 'redux-thunk'
import ticketReducer from './ticket';
import stadiumReducer from './stadium';
import selectedSectionReducer from './selectedSection';
import eventReducer from './event'
import { configureStore } from '@reduxjs/toolkit';
import logger from 'redux-logger';

// Apply middleware based on application environment
// let enhancer : any;
// if (process.env.NODE_ENV === 'production') {
//     enhancer = applyMiddleware(thunk)
// } else {
//     const logger = require('redux-logger').default
//     enhancer = compose(applyMiddleware(thunk, logger))
// }

// Pass in combined reducers and applied middleware to create global store
// const preloadedState = {};
// const configureStore = () => {
//     return createStore(rootReducer, preloadedState, enhancer);
// };
const store = configureStore({ 
    reducer: {
        ticket: ticketReducer,
        stadium: stadiumReducer,
        selectedSection: selectedSectionReducer,
        event: eventReducer
    },
    // middleware: (defaultMiddleware) => defaultMiddleware().concat([thunk, logger])
});


export type RootState = ReturnType<typeof store.getState>
export type AppDispatch = typeof store.dispatch;
export default store;