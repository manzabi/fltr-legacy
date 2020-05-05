export const actions = {
    USER_SIDEBAR_SHOW: 'USER_SIDEBAR_SHOW',
    USER_SIDEBAR_HIDE: 'USER_SIDEBAR_HIDE',
    MOBILE_USER_SIDEBAR_HIDE: 'MOBILE_USER_SIDEBAR_HIDE',
    USER_SIDEBAR_TOGGLE: 'USER_SIDEBAR_TOGGLE'

};

export function showUserSidebar () {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SIDEBAR_SHOW,
        });
    };
}
export function hideUserSidebar () {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SIDEBAR_HIDE,
        });
    };
}

export function hideMobileUserSidebar () {
    return function (dispatch) {
        dispatch({
            type: actions.MOBILE_USER_SIDEBAR_HIDE,
        });
    };
}

export function toggleUserSidebar () {
    return function (dispatch) {
        dispatch({
            type: actions.USER_SIDEBAR_TOGGLE,
        });
    };
}