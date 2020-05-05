import {actions} from '../actions/sidebarActions';

const initial = {
    status: true,
    mobile: false
};

export function userSidebar (state = initial, action) {
    const {USER_SIDEBAR_SHOW, USER_SIDEBAR_HIDE, USER_SIDEBAR_TOGGLE, MOBILE_USER_SIDEBAR_HIDE} = actions;

  
    switch (action.type) {
    case USER_SIDEBAR_SHOW: {
        return {
            status: true,
            mobile: false
        };
    }
    case USER_SIDEBAR_HIDE: {
        return {
            status: false,
            mobile: false
        };
    }
    case USER_SIDEBAR_TOGGLE: {
        return {
            status: !state.status,
            mobile: !state.mobile
        };
    }
    case MOBILE_USER_SIDEBAR_HIDE: {
        return {
            status: state.status,
            mobile: false
        };
    }
    default:
        return state;
    }
}


module.exports = {
    userSidebar
};