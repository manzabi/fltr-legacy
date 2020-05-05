import {
    PROCESS_LIST_GET_FULFILLED,
    PROCESS_LIST_GET_REJECTED,
    PROCESS_LIST_GET_REQUEST,

} from '../actions/actionTypes';


var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');
import axios from 'axios';


export function fetchProcessUserList(id){
    return function (dispatch) {
        dispatch({type: PROCESS_LIST_GET_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.trello_process.replace('{id}', id))

            .then((response) => {

                dispatch({
                    type: PROCESS_LIST_GET_FULFILLED,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: PROCESS_LIST_GET_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}
