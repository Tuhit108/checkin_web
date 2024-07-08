import axios from "axios";
import {syncClientWifi, syncLocations} from ".";

export const requestAllClientWifi= async () => {

    let data = '';
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/wifi-client/gets',
        headers: { },
        data : data
    };

     await axios.request(config)
      .then((response) => {
        if(response.data){
            res = response.data.data;
            syncClientWifi(response.data.data || [])
        }
      })
      .catch((error) => {
        return 0
      });
     return res
};
export const requestAllLocationClient= async () => {

    let data = '';
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/location-client/gets',
        headers: { },
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
            return 0
        });
    return res
};
export const requestAddWifiClient= async (name, bssid) => {

    let data = JSON.stringify({
        "name": name,
        "BSSID": bssid
    });
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/add-wifi-client',
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                syncClientWifi(response.data.data || [])
            }
        })
        .catch((error) => {
            return []
        });
    return res
};
export const requestAddLocationClient= async (name, long, lat) => {

    let data = JSON.stringify({
        "name": name,
        "long": long,
        "lat": lat
    });
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/add-location-client',
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
export const requestUpdateWifiClient= async (clientId, name, bssid) => {

    let data = JSON.stringify({
        "name": name,
        "BSSID": bssid
    });
    let res = []

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://us-central1-tcheckin.cloudfunctions.net/app/checkin/wifi-client/update/${clientId}`,
        headers: {
            'Content-Type': 'application/json'
        },
        data : data
    };
    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                syncClientWifi(response.data.data || [])
            }
        })
        .catch((error) => {
            return []
        });
    return res
};
export const requestDeleteWifiClient= async (clientId) => {


    let res = []
    console.log("vao day")

    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `https://us-central1-tcheckin.cloudfunctions.net/app/checkin/wifi-client/delete/${clientId}`,
        headers: {
            'Content-Type': 'application/json'
        },
    };
    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
            }
        })
        .catch((error) => {
            return []
        });
    return res
};
