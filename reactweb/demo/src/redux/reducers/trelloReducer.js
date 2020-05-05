import {
    PROCESS_LIST_GET_FULFILLED,
    PROCESS_LIST_GET_REJECTED,
    PROCESS_LIST_GET_REQUEST,
} from '../actions/actionTypes';

import {commonReducer, initial} from './commonReducer';


function processUserList(state = initial, action) {
    return commonReducer(state, action, PROCESS_LIST_GET_REQUEST, PROCESS_LIST_GET_FULFILLED, PROCESS_LIST_GET_REJECTED);
}

module.exports = {
    processUserList
};