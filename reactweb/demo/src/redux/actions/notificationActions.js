import {
    FETCH_NOTIFICATION_DETAIL_FULFILLED,
    FETCH_NOTIFICATION_DETAIL_REJECTED,
    FETCH_NOTIFICATION_DETAIL_REQUEST,
    FETCH_NOTIFICATION_DETAIL_FORCED,

    FETCH_NOTIFICATION_FULFILLED,
    FETCH_NOTIFICATION_REJECTED,
    FETCH_NOTIFICATION_REQUEST,

    FETCH_NOTIFICATION_READ_FULFILLED,
    FETCH_NOTIFICATION_READ_REJECTED,
    FETCH_NOTIFICATION_READ_REQUEST,

    FETCH_NOTIFICATION_READ_ALL_FULLFILLDED,

    FETCH_NOTIFICATION_READ_BY_ID_FULFILLED,
    FETCH_NOTIFICATION_READ_BY_ID_REJECTED,
    FETCH_NOTIFICATION_READ_BY_ID_REQUEST,
} from '../actions/actionTypes';

var Config = require('Config');

var API_ENDPOINTS = require('../../common/api_endpoints');

import axios from 'axios';
import parser from 'uri-template';
import { checkOnlineStatusAndProceed } from '../../fltr/utils/errorUtils';

const NOTIFICATION_SIZE = 10;

export function fetchNotificationDetail(page = 0){
    return function (dispatch) {
        dispatch({type: FETCH_NOTIFICATION_DETAIL_REQUEST});

        function proceed () {
            axios.get(Config.serverUrl + API_ENDPOINTS.notifications_list, {
                withCredentials: true,
                params: {
                    page: page,
                    size: NOTIFICATION_SIZE
                }
            })
                .then(function (response) {
    
                    dispatch({
                        type: FETCH_NOTIFICATION_DETAIL_FULFILLED,
                        payload: response.data
    
                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_NOTIFICATION_DETAIL_REJECTED,
                        payload: err
                    });
                });
        }
        checkOnlineStatusAndProceed(proceed);
    };
}

export function forceCallNotificationList(){
    return function (dispatch) {
        dispatch({type: FETCH_NOTIFICATION_DETAIL_FORCED});
        dispatch(fetchNotificationDetail(0));
    };
}

export function fetchNotification(){
    return function (dispatch) {
        dispatch({type: FETCH_NOTIFICATION_REQUEST});
        function proceed () {
            axios.get(Config.serverUrl + API_ENDPOINTS.notifications, {
                withCredentials: true
            })
                .then(function (response) {
    
                    dispatch({
                        type: FETCH_NOTIFICATION_FULFILLED,
                        payload: response.data
    
                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_NOTIFICATION_REJECTED,
                        payload: err
                    });
                });
        }
        checkOnlineStatusAndProceed(proceed);
    };
}

export function readNotifications(onSuccess, onError){
    return function (dispatch) {
        dispatch({type: FETCH_NOTIFICATION_READ_REQUEST});
        function proceed () {
            axios.post(Config.serverUrl + API_ENDPOINTS.notifications_mark_all_read, {
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: FETCH_NOTIFICATION_READ_FULFILLED,
                        payload: response.data
                    });
    
                    dispatch({
                        type: FETCH_NOTIFICATION_READ_ALL_FULLFILLDED,
                        payload: response.data
                    });
                    if (onSuccess) {
                        onSuccess(response.data);
                    }
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_NOTIFICATION_READ_REJECTED,
                        payload: err
                    });
                    if (onError) {
                        onError(err);
                    }
                });
        }
        checkOnlineStatusAndProceed(proceed);
    };
}

export function readNotificationById(id){
    return function (dispatch) {
        dispatch({type: FETCH_NOTIFICATION_READ_BY_ID_REQUEST});

        // decode url
        let url = Config.serverUrl + API_ENDPOINTS.notifications_read_by_id;
        let urlTpl = parser.parse(url);
        url = urlTpl.expand({ id: id});

        function proceed () {
            axios.post(url, {
                withCredentials: true
            })
                .then(function (response) {
    
                    dispatch({
                        type: FETCH_NOTIFICATION_READ_BY_ID_FULFILLED,
                        payload: id
                    });
    
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_NOTIFICATION_READ_BY_ID_REJECTED,
                        payload: err
                    });
                });
        }
        checkOnlineStatusAndProceed(proceed);
    };
}