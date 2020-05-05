import {
    DASHBOARD_CHANGE_TAB_KEY
} from '../actions/actionTypes';

export function changeDashboardTab(key){
    return function (dispatch, onSuccess) {
        dispatch({type: DASHBOARD_CHANGE_TAB_KEY, payload: key});

        if (onSuccess){
            onSuccess();
        }
    };
}