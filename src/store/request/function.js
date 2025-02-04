import axios from "axios";
import {syncClientWifi} from "../clientWifi";
import {syncRequests} from "./index";

export const requestAllRequest= async () => {

    let data = '';
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/request/get',
        headers: { },
        data : data
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                syncRequests(response.data.data || [])
            }
        })
        .catch((error) => {
            return 0
        });
    return res
};
export const requestApprovedRequestInMonth= async (id) => {

    let data = JSON.stringify({
        "requestApprovedID": id
    });

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/request/approved',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

   const res =  await axios.request(config)
        .then((response) => {
                return response.data.data;
        })
        .catch((error) => {
            return {}
        });
    return res
};
