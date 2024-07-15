import axios from "axios";
import {syncRequests} from "../request";
import {syncShifts} from "./index";

export const requestAllShift= async () => {

    let data = '';
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/shift/get',
        headers: { },
        data : data
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                syncShifts(response.data.data || [])
            }
        })
        .catch((error) => {
            return 0
        });
    return res
};
