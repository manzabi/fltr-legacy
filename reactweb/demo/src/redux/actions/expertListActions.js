import {
    EXPERT_LIST_GET_FULFILLED,
    EXPERT_LIST_GET_REJECTED,
    EXPERT_LIST_GET_REQUEST
} from '../actions/actionTypes';


var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
import axios from 'axios';


export function fetchExpertList(id){
    return function (dispatch) {
        dispatch({type: EXPERT_LIST_GET_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.get_expert_user_list.replace('{id}', id))

            .then((response) => {

                dispatch({
                    type: EXPERT_LIST_GET_FULFILLED,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: EXPERT_LIST_GET_REJECTED,
                    payload: err,
                    silent: true
                });
            });


    };
}