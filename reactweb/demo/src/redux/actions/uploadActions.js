import {

    UPLOAD_IMAGE_FULFILLED,
    UPLOAD_IMAGE_REJECTED,
    UPLOAD_IMAGE_REQUEST,

    UPLOAD_FILE_FULFILLED,
    UPLOAD_FILE_REJECTED,
    UPLOAD_FILE_REQUEST

} from '../actions/actionTypes';

import axios from 'axios';

var Config = require('Config');

var API_ENDPOINTS = require('../../common/api_endpoints');

export function uploadImageSync (uploadType, file, filename = 'image.jpg') {
    return new Promise(
        (resolve, reject) => {
            let data = new FormData();
            data.append('file', file, filename);
            axios.post(Config.serverUrl + API_ENDPOINTS.upload_image.toString().replace('{type}', uploadType), data)
                .then((response) => {
                    let newResponse = {data: {link: response.data.url}};
                    resolve(newResponse);
                })
                .catch(function (err) {
                    // console.log("ko")
                    reject('Error uploading image');
                });
        }
    );
}

export function uploadImage (uploadType, file, filename = 'image.jpg', onSuccess) {
    return function (dispatch) {
        dispatch({type: UPLOAD_IMAGE_REQUEST});
        let data = new FormData();
        data.append('file', file, filename);
        // dPace.restart();
        let config = {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
            },
            withCredentials: true
        };
        axios.post(Config.serverUrl + API_ENDPOINTS.upload_image.toString().replace('{type}', uploadType), data, config)
            .then(function (res) {
                // console.log("ok " + res.data.url)
                dispatch({
                    type: UPLOAD_IMAGE_FULFILLED,
                    payload: res.data
                });

                if (onSuccess) {
                    onSuccess(res.data);
                }
            })
            .catch(function (err) {
                // console.log("ko")
                dispatch({
                    type: UPLOAD_IMAGE_REJECTED,
                    payload: err
                });
            });
    };
}

export function uploadFile (uploadType, file) {
    return function (dispatch) {
        dispatch({type: UPLOAD_FILE_REQUEST});
        let data = new FormData();
        data.append('file', file);
        let config = {
            onUploadProgress: function (progressEvent) {
                let percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                // console.log("percentCompleted: " + percentCompleted);
            },
            withCredentials: true
        };
        axios.post(Config.serverUrl + API_ENDPOINTS.upload_file.toString().replace('{type}', uploadType), data, config)
            .then(function (res) {
                // console.log("ok " + res.data.url)
                dispatch({
                    type: UPLOAD_FILE_FULFILLED,
                    payload: res.data

                });
            })
            .catch(function (err) {
                // console.log("ko")
                dispatch({
                    type: UPLOAD_FILE_REJECTED,
                    payload: err
                });
            });
    };
}

export const resetUploadImage = () => {
    return dispatch => {
        dispatch({
            type: 'UPLOAD_IMAGE_RESET'

        });
    };
};

export const resetUploadFile = () => {
    return dispatch => {
        dispatch({
            type: 'UPLOAD_FILE_RESET'

        });
    };
};
