import {
    TYPE_NAVIGATION_REDIRECT
} from '../actions/navigationActions';

const initial = {redirect:null};

function navigation(state = initial, action) {
    // update entities management
    if (action.type == TYPE_NAVIGATION_REDIRECT) {
        let redirect = action.payload.redirect;
        return {
            ...state,
            redirect: redirect
        };
    }
    return state;
}

module.exports = {
    navigation
};
