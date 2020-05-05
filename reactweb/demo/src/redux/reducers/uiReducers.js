import {actions} from '../actions/uiActions';

export function limitBannerStatus (state = false, action) {
      
    switch (action.type) {
        case actions.LIMIT_BANNER_SHOW: {
            return true;
        }
        case actions.LIMIT_BANNER_HIDE: {
            return false;
        }
        default:
            return state;
    }
}

export function mainScrollStatus (state = true, action) {

    switch (action.type) {
        case actions.MAIN_SCROLL_SHOW: {
            return true;
        }
        case actions.MAIN_SCROLL_HIDE: {
            return false;
        }
        default:
            return state;
    }
}

const initial = [];

function headerTitle(state = initial, action) {
    switch (action.type) {

        case `${actions.HEADER_SET_TITLE}_RESET`:
            return initial;

        case `${actions.HEADER_SET_TITLE}_SET`:
            return action.payload;

        default:
            return state;
    }
}



module.exports = {
    limitBannerStatus,
    mainScrollStatus,
    headerTitle
};