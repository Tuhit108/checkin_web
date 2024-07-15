import { createDynamicReducer } from "../../utils/createDynamicReducers";

export const {
    reducer: clientsReducer,
    setStore: setClientsStore,
    useByKey: useClient,
    getByKey: getClient,
    sync: syncClients,
    setQueries: setClientsQueries,
    useKeysByQuery: useClientsIdsByQuery
} = createDynamicReducer('client', 'id');
