import {
    UPLOAD_IMAGE_FULFILLED,
    UPLOAD_IMAGE_REJECTED,
    UPLOAD_IMAGE_REQUEST,

    UPLOAD_FILE_FULFILLED,
    UPLOAD_FILE_REJECTED,
    UPLOAD_FILE_REQUEST
} from '../actions/actionTypes';

import {commonReducer, commonReducerReset, initial} from './commonReducer';


function uploadImage(state = initial, action) {

    return commonReducerReset(state, action, UPLOAD_IMAGE_REQUEST, UPLOAD_IMAGE_FULFILLED, UPLOAD_IMAGE_REJECTED, 'UPLOAD_IMAGE_RESET');

}

function uploadFile(state = initial, action) {

    return commonReducerReset(state, action, UPLOAD_FILE_REQUEST, UPLOAD_FILE_FULFILLED, UPLOAD_FILE_REJECTED, 'UPLOAD_FILE_RESET');

}



module.exports = {
    uploadImage,
    uploadFile
};




