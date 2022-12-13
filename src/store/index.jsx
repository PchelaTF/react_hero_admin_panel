import { createStore, combineReducers, compose, applyMiddleware } from 'redux';
import heroesReducer from '../reducers/heroesReducer';
import filtersReducer from '../reducers/filtersReducer';
import thunk from 'redux-thunk';

const strtingMiddleware = (store) => (next) => (action) => {
    if (typeof action === 'string') {
        return next({
            type: action
        })
    }

    return next(action)
}

// eslint-disable-next-line  
const enhancer = (createStore) => (...arg) => {
    const store = createStore(...arg)

    const oldDispatch = store.dispatch

    store.dispatch = (action) => {
        if (typeof action === 'string') {
            return oldDispatch({
                type: action
            })
        }

        return oldDispatch(action)
    }

    return store
}

const mainRedusers = combineReducers({ heroesReducer, filtersReducer })

const store = createStore(mainRedusers, compose(applyMiddleware(thunk, strtingMiddleware), window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()))

export default store;