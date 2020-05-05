import axios from 'axios';

import { putAction, postAction, controlAction } from './genericActions';

import {userError} from '../../fltr/utils/errorUtils';

import {
    FETCH_USER_INFO_FULFILLED,
    FETCH_USER_INFO_REJECTED,
    FETCH_USER_INFO_REQUEST
} from '../actions/actionTypes';
import { createCookie } from '../../common/utils';

var Config = require('Config');

var API_ENDPOINTS = require('../../common/api_endpoints');

export const PUT_USER_INFO = 'PUT_USER_INFO';
export const RECRUITER_COMPLETE_BOARDING = 'RECRUITER_COMPLETE_BOARDING';
export const USER_UPDATE_STATUS = 'USER_UPDATE_STATUS';

export function fetchUserInfo(onSuccess, onError) {
    return function (dispatch) {
        dispatch({ type: FETCH_USER_INFO_REQUEST });

        axios.get(Config.serverUrl + API_ENDPOINTS.user_info)
            // { headers: { 'Authorization': AuthStr } })
            .then((response) => {
                if (response && response.data && response.data.id) {
                    createCookie('userId', response.data.id, 800);
                }
                dispatch({
                    type: FETCH_USER_INFO_FULFILLED,
                    payload: response.data
                    /*
          payload:
          */
                });

                if (onSuccess) {
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: FETCH_USER_INFO_REJECTED,
                    payload: err
                });
                if (onError && err && err.response) {
                    onError(err.response);
                } else {
                    onError(err);
                }
            });
    };
}

export function checkUserUpdate(status, force, onSuccess, successWithTime) {
    return function (dispatch) {
        function onShouldUpdate() {
            dispatch(fetchUserInfo(onSuccess, userError)); 
        }
        controlAction(USER_UPDATE_STATUS, status, onShouldUpdate, dispatch, force, successWithTime);
    };
}

export function putRecruiterUserInfo(data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.recruiter_info;
        putAction(PUT_USER_INFO, url, data, dispatch, onSuccess, onError);
    };
}

export function putExpertUserInfo(data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.expert_info;
        putAction(PUT_USER_INFO, url, data, dispatch, onSuccess, onError);
    };
}

export function recruiterCompleteBoardingFlow(onSuccess) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.recruiter_complete_boarding;
        const data = {};
        postAction(RECRUITER_COMPLETE_BOARDING, url, data, dispatch, onSuccess);
    };
}
