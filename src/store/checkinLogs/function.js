import axios from "axios";
import {syncAllCheckins, useCheckinsIdsByQuery} from ".";
import getStore from "../getStore";
import {store} from "../index";
import moment from "moment";

export const requestAllCheckinsByUser= async (userCode) => {
    let data = JSON.stringify({
        "userCode": userCode
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/user/get',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

    const res = await axios.request(config)
      .then((response) => {
        if(response.data){
            console.log("location", response.data)
            syncAllCheckins(response.data.data || [])
            return response.data.data
        }
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        return 0
      });
    return res
};
export const useCheckinByDateAndUser = (date) => {
    const listID = useCheckinsIdsByQuery(date)
    const byId = store.getState().checkin.byKey
    return listID.map(item =>byId[item])
};
export const getCheckinByDateAndUser = (date) => {
    const listID = store.getState().checkin.query[date]
    const byId = store.getState().checkin.byKey
    if (listID){
    return listID.map((item) => (byId[item]))
            .sort((a, b) => a.timestamp - b.timestamp)
    }
    else return []
};
