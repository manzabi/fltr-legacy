import { initial, commonReducer, comonListReducer } from './commonReducers';
import { ACTIONS } from '../actions/opportunityActions';


export function opportunityDetail (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_OPPORTUNITY_DATA);
}

export function processDetail (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_PROCESS_DATA);
}

export function opportunityChallenge (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_OPPORTUNITY_CHALLENGE);
}

export function userOportunities (state = initial, action) {
    return comonListReducer(state, action, ACTIONS.FETCH_USER_OPPORTUNITIES);
}

export function opportunityInvitation (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_INVITATION_LINK);
}

export function opportunityAttitudeLeaderboard (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_ATTITUDE_LEADERBOARD);
}