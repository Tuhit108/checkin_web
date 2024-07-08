import axios from 'axios';
const apiEndpoint = 'http://178.128.126.128:9000' + '/config'

export const getConfig = async () => {
    return await axios.get(`${apiEndpoint}`);
}

export const updateConfig= async (data) => {
    return await axios.post(`${apiEndpoint}`,  {
        distance: data
    });
}
