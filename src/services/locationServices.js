import axios from 'axios';
const apiEndpoint = 'http://178.128.126.128:9000' + '/location'

export const getLocationById = async (id) => {
    return await axios.get(`${apiEndpoint}/${id}`);
}

export const getAllLocation = async () => {
    return await axios.get(`${apiEndpoint}`);
}

export const createLocation = async (body) => {
    return await axios.post(`${apiEndpoint}`, {
        name: body.name,
        latitude: body.latitude,
        longtitude: body.longtitude
    });
}

export const updateLocationById = async (id, body) => {
    return await axios.post(`${apiEndpoint}/${id}`,  {
        name: body.name,
        latitude: body.latitude,
        longtitude: body.longtitude
    });
}

export const deleteLocationById = async (id) => {
    return await axios.delete(`${apiEndpoint}/${id}`);
}
