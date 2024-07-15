import axios from "axios";
import {setClientsQueries, syncClients} from "./index";

export const requestAllClients= async () => {

    const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/client/gets',
        headers: {
            'Content-Type': 'application/json'
        },
        data : {}
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                console.log("location", response.data)
                syncClients(response.data.data || [])
                setClientsQueries({
                    all: (response.data.data || []).map((client) => client.id),
                });
            }
        })
        .catch((error) => {
            return 0
        });
};
