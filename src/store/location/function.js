import axios from "axios";
import { syncLocations } from ".";

export const requestAllLocation= async () => {
   
    const config = {
        method: 'get',
        maxBodyLength: Infinity,
        url: 'http://178.128.126.128:9000/location',
        headers: { }
      };
      
     await axios.request(config)
      .then((response) => {
        if(response.data){
            console.log("location", response.data)
            syncLocations(response.data || [])
        }
        console.log(JSON.stringify(response.data));
      })
      .catch((error) => {
        return 0
      });
};