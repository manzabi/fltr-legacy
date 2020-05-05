import Config from 'Config';

import axios from 'axios';

import API_ENDPOINTS from '../../common/api_endpoints';

export function uploadImage (type, file) {
    const filename = file.name;
    let data = new FormData();
    data.append('file', file, filename);
    return axios.post(Config.serverUrl + API_ENDPOINTS.upload_image.toString().replace('{type}', type), data);
}

export function uploadFile (type, file) {
    const filename = file.name;
    let data = new FormData();
    data.append('file', file, filename);
    return axios.post(Config.serverUrl + API_ENDPOINTS.upload_file.toString().replace('{type}', type), data);
}
