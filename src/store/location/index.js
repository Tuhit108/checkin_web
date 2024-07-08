import { createDynamicReducer } from "../../utils/createDynamicReducers";

export const {
    reducer: locationsReducer,
    setStore: setLocationsStore,
    useByKey: useLocation,
    sync: syncLocations,
    setQueries: setLocationsQueries,
    useKeysByQuery: useLocationsIdsByQuery
  } = createDynamicReducer('checkin_location', 'id');
  