import { OPPORTUNITY_DATA, OPPORTUNITY_PROCESS_DATA, OPPORTUNITY_CHALLENGE, OPPORTUNITY_SEARCH, OPPORTUNITY_CHALLENGE_ACCEPT, OPPORTUNITY_INVITATION, OPPORTUNITY_ATTITUDE_LEADERBOARD } from '../../utils/apiEndpoints';
import { getAction, listingAction, postAction } from './commonActions';

import {API, OPEN_API} from '../config/axiosInstances';

// PROCESS ACTION TYPES
export const ACTIONS = {
    FETCH_OPPORTUNITY_DATA: 'fetch_opportunity_data',
    FETCH_PROCESS_DATA: 'fetch_process_data',
    FETCH_OPPORTUNITY_CHALLENGE: 'fetch_opportunity_challenge',
    FETCH_USER_OPPORTUNITIES: 'fetch_user_opportunities',
    CANDIDATE_ACCEPT_CHALLENGE: 'candidate_accept_challenge',
    FETCH_INVITATION_LINK: 'fetch_invitation_link',
    FETCH_ATTITUDE_LEADERBOARD: 'fetch_attitude_leaderboard'
};

/* OPEN */
export function fetchOpportunityDataOpen (opportunityId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_DATA.replace('{id}', opportunityId);
        getAction(OPEN_API, ACTIONS.FETCH_OPPORTUNITY_DATA, URL, null, dispatch, onSuccess, onError);
    };
}

export function fetchInvitationLinkOpen (opportunityId, code, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_INVITATION.replace('{id}', opportunityId).replace('{code}', code);
        getAction(OPEN_API, ACTIONS.FETCH_INVITATION_LINK, URL, null, dispatch, onSuccess, onError);
    };
}

/* WEB */

export function fetchOpportunityData (opportunityId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_DATA.replace('{id}', opportunityId);
        getAction(API, ACTIONS.FETCH_OPPORTUNITY_DATA, URL, null, dispatch, onSuccess, onError);
    };
}

export function fetchOpportunityProcessData (opportunityId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_PROCESS_DATA.replace('{id}', opportunityId);
        getAction(API, ACTIONS.FETCH_PROCESS_DATA, URL, null, dispatch, onSuccess, onError);
    };
}

export function fetchOpportunityChallenge (opportunityId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_CHALLENGE.replace('{id}', opportunityId);
        getAction(API, ACTIONS.FETCH_OPPORTUNITY_CHALLENGE, URL, null, dispatch, onSuccess, onError);
    };
}

export function fetchOpportunityAttitudeLeaderboard (opportunityId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_ATTITUDE_LEADERBOARD.replace('{id}', opportunityId);
        getAction(API, ACTIONS.FETCH_ATTITUDE_LEADERBOARD, URL, null, dispatch, onSuccess, onError);
    };
}

export function candidateAcceptChallenge (processId, data,  onSuccess = null, onError = null) {
    return function (dispatch) {
        const URL = OPPORTUNITY_CHALLENGE_ACCEPT.replace('{id}', processId);
        postAction(API, ACTIONS.CANDIDATE_ACCEPT_CHALLENGE, URL, data, dispatch, onSuccess, onError);
    };
}

export function fetchUserOpportunties(page, owned = 'partecipant', type = 'all') {
    return function(dispatch) {
        let url = OPPORTUNITY_SEARCH;
        let params = {
            page: page,
            owned: owned,
            type: type,
            status: null,
            size: 1
        };
        listingAction(API, ACTIONS.FETCH_USER_OPPORTUNITIES, url, params, dispatch, null, null);
    };
}