import { createSlice } from '@reduxjs/toolkit';
// @ts-ignore
import _ from 'lodash';
import { useSelector } from 'react-redux';
export const createDynamicReducer = (name, mainKey, initialState = { byKey: {}, query: {} }) => {
  const { actions, reducer } = createSlice({
    name,
    initialState: initialState,
    reducers: {
      multiSet(state, action) {
        console.log("hiha",action.payload)
        return Object.assign(Object.assign({}, state), { byKey: Object.assign(Object.assign({}, state.byKey), _.fromPairs(action.payload.map(item => [item[mainKey], item]))) });
      },
      setQueries(state, action) {
        return Object.assign(Object.assign({}, state), { query: Object.assign(Object.assign({}, state.query), action.payload) });
      },
      remove(state, action) {
        let _byKey = Object.assign({}, state.byKey);
        delete _byKey[action.payload];
        return Object.assign(Object.assign({}, state), { byKey: _byKey });
      },
      reset() {
        return Object.assign({}, initialState);
      },
    },
  });
  const useByKey = (key) => {
    // @ts-ignore
    return useSelector(state => state[name].byKey[key]);
  };
  const emptyArray = [];
  const useKeysByQuery = (query = 'default') => {
    // @ts-ignore
    return useSelector(state => state[name].query[query]) || emptyArray;
  };
  let _store;
  const setStore = (store) => {
    _store = store;
  };
  const _getStore = () => {
    if (!_store) {
      throw new Error('You need to run setStore right after init store to use this function');
    }
    return _store;
  };
  const getByKey = (key) => {
    return _getStore().getState()[name].byKey[key];
  };
  const getKeysByQuery = (query) => {
    return _getStore().getState()[name].query[query] || emptyArray;
  };
  const sync = (items) => {
    return _getStore().dispatch(actions.multiSet(items));
  };
  const setQueries = (queries) => {
    return _getStore().dispatch(actions.setQueries(queries));
  };
  const removeByKey = (keys) => {
    return _getStore().dispatch(actions.remove(keys));
  };
  const reset = () => {
    return _getStore().dispatch(actions.reset());
  };
  return {
    name,
    actions,
    reducer,
    useByKey,
    useKeysByQuery,
    getByKey,
    getKeysByQuery,
    setStore,
    sync,
    setQueries,
    removeByKey,
    reset,
  };
};
