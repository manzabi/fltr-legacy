import {
    DASHBOARD_CHANGE_TAB_KEY
} from '../actions/actionTypes';

const initialDashboard = {key: 1};

function dashboard(state = initialDashboard, action) {
    // console.log(state);
    // console.log("Action retrieved in reducer : " + action.type + " payload : " + action.payload);
    switch(action.type) {
    case DASHBOARD_CHANGE_TAB_KEY: {
        return Object.assign({}, state, {
            key: action.payload
        });
    }

    default:
        return state;
    }
}

module.exports = {
    dashboard,
};