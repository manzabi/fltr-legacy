import {postAction, getAction} from './genericActions';
var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');


export const TYPE_ATTITUDE_TEST = 'ATTITUDE_TEST';

export function submitAttitudeTest(id, userId, data, onSuccess, onError){
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.attitude_test.replace('{id}', id).replace('{userId}', userId);
        postAction(TYPE_ATTITUDE_TEST, url, data, dispatch, onSuccess, onError);
    };
}

export function getAttitude(id, onSuccess, onError){
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.attitude_user.toString().replace('{id}', id);
        let data = {};
        getAction(TYPE_ATTITUDE_TEST, url, data, dispatch, onSuccess, onError);
    };
}


