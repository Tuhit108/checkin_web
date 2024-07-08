import {createSlice,  PayloadAction, Store} from '@reduxjs/toolkit'
import { combineReducers} from 'redux'
import { useSelector } from "react-redux";
import getStore from "../getStore";



const initialState = {};

const user = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state = action.payload
      if (action.payload) {
        console.log("vaodayne",action.payload)
        return action.payload

      }
    },
  }
});


export const constantReducer = combineReducers({
  user: user.reducer,
});
let _store: Store | undefined;

export const constantSetStore = (store) => {
  _store = store;
};

export const setUserAction = (data) => {

  _store.dispatch(user.actions.setUser(data))

};
export const useUser = () => {

  return useSelector((state) => {
    console.log("vaoday",state.constant.user)
    return state.constant.user
  });
};


