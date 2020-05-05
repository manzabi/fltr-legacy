import Axios from 'axios';

const API_BASEPATH = '/bizAroundRest/web';
const API_OPEN_BASEPATH = '/bizAroundRest/open';

export const API = function () {
    return Axios.create({
        baseURL: `${process.env.serverUrl}${API_BASEPATH}`,
        timeout: 40000,
        headers: {'authorization': `bearer ${window.localStorage.getItem('auth')}`}
    });
};

export const OPEN_API = function () {
    return Axios.create({
        baseURL: `${process.env.serverUrl}${API_OPEN_BASEPATH}`,
        timeout: 40000
    });
};