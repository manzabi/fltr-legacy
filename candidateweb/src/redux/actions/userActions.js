import { USER_DATA } from '../../utils/apiEndpoints';
import { getAction } from './commonActions';

import {API} from '../config/axiosInstances';



// COMENT ACTION TYPES
export const ACTIONS = {
    FETCH_USER_DATA: 'fetch_user_data',

};

export function fetchCurrentUser (onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = USER_DATA;
        getAction(API, ACTIONS.FETCH_USER_DATA, URL, null, dispatch, onSuccess, onError);
    };
}
