import { createDynamicReducer } from "../../utils/createDynamicReducers";

export const {
    reducer: clientsWifiReducer,
    setStore: setClientsWifiStore,
    useByKey: useClientWifi,
    sync: syncClientWifi,
    setQueries: setClientsWifiQueries,
    useKeysByQuery: useClientsWifiIdsByQuery
  } = createDynamicReducer('clientWifi', 'id');
