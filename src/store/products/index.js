import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import { combineReducers } from "redux";
import { createDynamicReducer} from "../../utils/createDynamicReducers";
import { batch } from "react-redux";





const { setStore, reducer, sync, useByKey, setQueries, removeByKey, useKeysByQuery } =
createDynamicReducer("product", "_id");

export const setProductStore = setStore;
export const productReducer = reducer;
export const useProduct = useByKey;
export const syncProduct = sync;
export const setProductQueries = setQueries;
export const removeProductByKey = removeByKey;
export const useProductsByQuery = useKeysByQuery;


export const syncAllProducts = (accessories) => {
    let query = {};
    let ids = [];
    console.log(accessories)

    for (let access of accessories) {
         ids.push(access._id.toString());
    }
    batch(() => {
        syncProduct(accessories);
        setProductQueries({
            all: ids,
            ...query
        });
    });
};


export const useProductIds = () => {
    return useProductsByQuery("all") || [];
};
