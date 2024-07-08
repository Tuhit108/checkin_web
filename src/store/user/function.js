import axios from "axios";
import {syncAllCheckins} from "../checkinLogs";
import {syncAllUsers, syncUser} from "./index";
export const requestAddUser= async (params) => {


    let data = JSON.stringify({
        "name": params.name,
        "email":params.email,
        "password": params.password, "userCode": params.userCode, "role": params.role
    });
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/register',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                // syncClientWifi(response.data.data || [])
            }
        })
        .catch((error) => {
            return []
        });
    return res
};

export const requestAllUser= async () => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/users/get',
        headers: { }
    };

    axios.request(config)
        .then((response) => {
            syncAllUsers(response.data.data)
        })
        .catch((error) => {
            console.log(error);
        });

};
