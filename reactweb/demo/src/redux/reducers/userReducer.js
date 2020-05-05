import {
    FETCH_USER_INFO_FULFILLED,
    FETCH_USER_INFO_REJECTED,
    FETCH_USER_INFO_REQUEST,
    PUT_USER_INFO_FULFILLED
} from '../actions/actionTypes';

import {RECRUITER_COMPLETE_BOARDING, USER_UPDATE_STATUS} from '../actions/userActions';

const initialUser = {isFetching: true, isError: false};

function user (state = initialUser, action) {
    // console.log(state);
    // console.log("Action retrieved in reducer : " + action.type + " payload : " + action.payload);
    switch (action.type) {
    case FETCH_USER_INFO_REQUEST: {
        return Object.assign({}, state, {
            isFetching: true,
            isError: false
        });
    }
    case FETCH_USER_INFO_FULFILLED: {
        return Object.assign({}, state, {
            isFetching: false,
            isError: false,
            item: action.payload
        });
    }
    case FETCH_USER_INFO_REJECTED:
        return Object.assign({}, state, {
            isFetching: false,
            isError: true,
            err: action.payload
        });
    case PUT_USER_INFO_FULFILLED: {
        return Object.assign({}, state, {
            isFetching: false,
            isError: false,
            item: action.payload
        });
    }
    case RECRUITER_COMPLETE_BOARDING + '_FULFILLED': {
        return Object.assign({}, state, {
            isFetching: false,
            isError: false,
            item: action.payload
        });
    }
    default:
        return state;
    }
}

function userStatus (state = {}, action) {
    switch (action.type) {
    case USER_UPDATE_STATUS: {
        return Object.assign({}, state, {
            nextUpdate: action.payload.nextUpdate
        });
    }
    
    default:
        return state;
    }
}

module.exports = {
    user,
    userStatus
};
