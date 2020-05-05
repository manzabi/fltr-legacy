import {
    EXPERT_LIST_GET_FULFILLED,
    EXPERT_LIST_GET_REJECTED,
    EXPERT_LIST_GET_REQUEST
} from '../actions/actionTypes';

import {commonReducer, initial} from './commonReducer';

function expertListForOpportunity(state = initial, action) {
    return commonReducer(state, action, EXPERT_LIST_GET_REQUEST, EXPERT_LIST_GET_FULFILLED, EXPERT_LIST_GET_REJECTED);
}


module.exports = {
    expertListForOpportunity,
};