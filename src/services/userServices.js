import axios from 'axios';

const apiEndpoint = 'http://178.128.126.128:9000' + '/user'

export const getUserById = async (id) => {
    return await axios.get(`${apiEndpoint}/${id}`);
}

export const getAllUser = async () => {
    return await axios.post(`https://us-central1-tcheckin.cloudfunctions.net/app/checkin/users/get`);
}

export const createUser = async (body) => {
    return await axios.post(`${apiEndpoint}`, {
        userName: body.userName,
        password: body.password,
        role: body.role,
        name: body.name,
        phone: body.phone,
        dob: body.dob
    });
}
export const updateUserById = async (id, body) => {
    return await axios.post(`${apiEndpoint}/${id}`, {
        userName: body.userName,
        password: body.password,
        role: body.role,
        name: body.name,
        phone: body.phone,
        dob: body.dob
    });
}
export const deleteUserById = async (id) => {
    return await axios.delete(`${apiEndpoint}/${id}`);
}
