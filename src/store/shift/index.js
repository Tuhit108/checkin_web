import { createDynamicReducer } from "../../utils/createDynamicReducers";

export const {
    reducer: shiftsReducer,
    setStore: setShiftsStore,
    useByKey: useShift,
    sync: syncShifts,
    setQueries: setShiftsQueries,
    useKeysByQuery: useShiftsIdsByQuery
} = createDynamicReducer('shift', 'id');
