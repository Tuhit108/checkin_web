import { createDynamicReducer } from "../../utils/createDynamicReducers";

export const {
    reducer: requestsReducer,
    setStore: setRequestsStore,
    useByKey: useRequest,
    sync: syncRequests,
    setQueries: setRequestsQueries,
    useKeysByQuery: useRequestsIdsByQuery
} = createDynamicReducer('request', 'id');
