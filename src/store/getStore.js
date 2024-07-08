import { Store } from "@reduxjs/toolkit";

let _store

export const getStore = () => {
  if (!_store) {
    throw new Error('Please implement setStore before using this function');
  }

  return _store;
}
export const setStore = (store) => {
  _store = store;
}
export default getStore;
