import axios from 'axios';
const apiEndpoint = 'http://178.128.126.128:9000' + '/checkin/filter?status=ACCEPT'


export const getAllCheckins = async () => {
    let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://us-central1-tcheckin.cloudfunctions.net/app/checkin/get',
        headers: { }
    };

    const res = await axios.request(config)
        .then((response) => {
            console.log(JSON.stringify(response.data));
            return response.data
        })
        .catch((error) => {
            console.log(error);
        });
    return res
}
