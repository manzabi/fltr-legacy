// DEVELOPMENT
import {createStore, applyMiddleware} from 'redux';
import {createLogger} from 'redux-logger';
import thunk from 'redux-thunk';
import {composeWithDevTools} from 'redux-devtools-extension';

import rootReducer from '../reducers';
const enhancer = composeWithDevTools(
    applyMiddleware(thunk, createLogger())
);
let configureStore;
if (process.env.ENV !== 'production') {
    configureStore = (initialState) => {
        return createStore(rootReducer, initialState, enhancer);
    }
} else {
   configureStore = (initialState) => {
      return createStore(rootReducer, initialState, applyMiddleware(thunk))
    };

}

export default configureStore;