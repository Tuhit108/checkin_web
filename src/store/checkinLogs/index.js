import { createSlice, PayloadAction, Store } from "@reduxjs/toolkit";
import { batch } from "react-redux";
import moment from "moment";
import {createDynamicReducer} from "../../utils/createDynamicReducers";
import getStore from "../getStore";





export const {
    reducer: checkinsReducer,
    setStore: setCheckinsStore,
    useByKey: useCheckin,
    sync: syncCheckins,
    setQueries: setCheckinsQueries,
    useKeysByQuery: useCheckinsIdsByQuery,
    getKeysByQuery: getCheckinsIdsByQuery
} = createDynamicReducer('checkin', 'id');


export const syncAllCheckins = (accessories) => {
    let query = {};
    let ids = [];

    for (let access of accessories) {
        const date = moment.unix(access.timestamp).format('DD-MM-YYYY');
        const key = `${date}_${access.userCode}`
        let tmpDate = query[key] || []
        ids.push(access.id.toString());
        query = {
            ...query,
            [key] :[...new Set([...tmpDate,access.id.toString()])]
        }
    }
    batch(() => {
        syncCheckins(accessories);
        setCheckinsQueries({
            all: ids,
            ...query
        });
    });
};


// export const useCheckinIds = () => {
//     return useCheckinsByQuery("all") || [];
// };


