import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createDynamicReducer} from "../../utils/createDynamicReducers";
import { batch } from "react-redux";





const { setStore, reducer, sync, useByKey, setQueries, removeByKey, useKeysByQuery } =
createDynamicReducer("user", "id");

export const setUserStore = setStore;
export const userReducer = reducer;
export const useUser = useByKey;
export const syncUser = sync;
export const setUserQueries = setQueries;
export const removeUserByKey = removeByKey;
export const useUsersByQuery = useKeysByQuery;


export const syncAllUsers = (accessories) => {
    let query = {};
    let ids = [];

    for (let access of accessories) {
         ids.push(access.id.toString());
    }
    batch(() => {
        syncUser(accessories);
        setUserQueries({
            all: ids,
            ...query
        });
    });
};


export const useUserIds = () => {
    return useUsersByQuery("all") || [];
};
