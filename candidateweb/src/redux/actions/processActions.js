import { PROCESS_DATA, PROCESS_ATTITUDE, PROCESS_ATTITUDE_NO_PROCESS } from '../../utils/apiEndpoints';
import { getAction, postAction } from './commonActions';

import {API} from '../config/axiosInstances';



// PROCESS ACTION TYPES
export const ACTIONS = {
    FETCH_PROCESS_DATA: 'fetch_process_data',
    SUBMIT_PROCESS_DATA: 'submit_process_data',
    SUBMIT_ATTITUDE_TEST: 'submit_attitude_test',
    SUBMIT_ATTITUDE_TEST_NO_PROCESS: 'submit_attitude_test_no_process'
};

export function fetchProcessData (processId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = PROCESS_DATA.replace('{id}', processId);
        getAction(API, ACTIONS.FETCH_PROCESS_DATA, URL, null, dispatch, onSuccess, onError);
    };
}

export function submitProcessData (processId, data, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = PROCESS_DATA.replace('{id}', processId);
        postAction(API, ACTIONS.SUBMIT_PROCESS_DATA, URL, data, dispatch, onSuccess, onError);
    };
}

export function submitAttitudeTest (processId, data, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = PROCESS_ATTITUDE.replace('{id}', processId);
        postAction(API, ACTIONS.SUBMIT_ATTITUDE_TEST, URL, data, dispatch, onSuccess, onError);
    };
}

export function submitAttitudeTestNoProcess (data, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = PROCESS_ATTITUDE_NO_PROCESS;
        postAction(API, ACTIONS.SUBMIT_ATTITUDE_TEST_NO_PROCESS, URL, data, dispatch, onSuccess, onError);
    };
}