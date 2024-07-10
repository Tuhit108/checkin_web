import axios from "axios";

export const requestGetTimesheet= async () => {

    let res = []


    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/timesheet/get',
        headers: { }
    };

    await axios.request(config)
        .then((response) => {
            if(response.data){
                res = response.data.data;
                localStorage.setItem('timesheet', JSON.stringify(response.data?.data || ""));

                // syncClientWifi(response.data.data || [])
            }
        })
        .catch((error) => {
            return []
        });
    return res
};
