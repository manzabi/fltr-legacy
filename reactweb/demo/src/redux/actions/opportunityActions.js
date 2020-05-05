import {
    FETCH_INREVIEW_OPPORTUNITY_LIST_FULFILLED,
    FETCH_INREVIEW_OPPORTUNITY_LIST_REJECTED,
    FETCH_INREVIEW_OPPORTUNITY_LIST_REQUEST,

    FETCH_ABOUTTOSTART_OPPORTUNITY_LIST_FULFILLED,
    FETCH_ABOUTTOSTART_OPPORTUNITY_LIST_REJECTED,
    FETCH_ABOUTTOSTART_OPPORTUNITY_LIST_REQUEST,

    FETCH_CLOSED_OPPORTUNITY_LIST_FULFILLED,
    FETCH_CLOSED_OPPORTUNITY_LIST_REJECTED,
    FETCH_CLOSED_OPPORTUNITY_LIST_REQUEST,

    FETCH_OPPORTUNITY_SUMMARY_FULFILLED,
    FETCH_OPPORTUNITY_SUMMARY_REJECTED,
    FETCH_OPPORTUNITY_SUMMARY_REQUEST,

    FETCH_PENDING_OPPORTUNITIES_SUMMARY_FULFILLED,
    FETCH_PENDING_OPPORTUNITIES_SUMMARY_REJECTED,
    FETCH_PENDING_OPPORTUNITIES_SUMMARY_REQUEST,

    RECRUITER_OPPORTUNITY_LIST_FULFILLED,
    RECRUITER_OPPORTUNITY_LIST_REJECTED,
    RECRUITER_OPPORTUNITY_LIST_REQUEST,

    RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_FULFILLED,
    RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REJECTED,
    RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REQUEST,

    RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_FULFILLED,
    RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_REJECTED,
    RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_REQUEST,

    RECRUITER_OPPORTUNITY_SAVE_TAGS_FULFILLED,
    RECRUITER_OPPORTUNITY_SAVE_TAGS_REJECTED,
    RECRUITER_OPPORTUNITY_SAVE_TAGS_REQUEST,

    RECRUITER_OPPORTUNITY_CREATE_CHALLENGE_FULFILLED,
    RECRUITER_OPPORTUNITY_CREATE_CHALLENGE_REJECTED,
    RECRUITER_OPPORTUNITY_CREATE_CHALLENGE_REQUEST,
    RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_FULFILLED,
    RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_REJECTED,
    RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_REQUEST,
    RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_RESET,

    EXPERT_ACCEPT_PENDING_OPPORTUNITY_FULFILLED,
    EXPERT_ACCEPT_PENDING_OPPORTUNITY_REJECTED,
    EXPERT_ACCEPT_PENDING_OPPORTUNITY_REQUEST,

    EXPERT_DECLINE_PENDING_OPPORTUNITY_FULFILLED,
    EXPERT_DECLINE_PENDING_OPPORTUNITY_REJECTED,
    EXPERT_DECLINE_PENDING_OPPORTUNITY_REQUEST,

    UPLOAD_IMAGE_FULFILLED,

    UPLOAD_FILE_FULFILLED,

    RESET_EXPERT_OPPORTUNITY_LIST,

    EXPERT_OPPORTUNITY_LIST_FULFILLED,
    EXPERT_OPPORTUNITY_LIST_REJECTED,
    EXPERT_OPPORTUNITY_LIST_REQUEST,

    EXPERT_OPPORTUNITY_ARCHIVED_LIST_FULFILLED,
    EXPERT_OPPORTUNITY_ARCHIVED_LIST_REJECTED,
    EXPERT_OPPORTUNITY_ARCHIVED_LIST_REQUEST

} from '../actions/actionTypes';

export const OPPORTUNITY_TIMELINE = 'OPPORTUNITY_TIMELINE';
export const OPPORTUNITY_TIMELINE_EXTEND = 'OPPORTUNITY_TIMELINE_EXTEND';

export const OPPORTUNITY_CLOSE = 'OPPORTUNITY_CLOSE';

export const OPPORTUNITY_HIRED = 'OPPORTUNITY_HIRED';

export const ACTIONS = {
    OPPORTUNITY_CHALLENGE_SETTINGS: 'OPPORTUNITY_CHALLENGE_SETTINGS',
    OPPORTUNITY_TEAM_SETTINGS: 'OPPORTUNITY_TEAM_SETTINGS',
    OPPORTUNITY_TEAM_MEMBER_SETTINGS: 'OPPORTUNITY_TEAM_MEMBER_SETTINGS',
    OPPORTUNITY_SLACK_CONNECT_INFO: 'OPPORTUNITY_SLACK_CONNECT_INFO',
    OPPORTUNITY_SLACK_BINDINGS: 'OPPORTUNITY_SLACK_BINDINGS',
    OPPORTUNITY_SLACK_BINDING_DELETE : 'OPPORTUNITY_SLACK_BINDING_DELETE',
};

import {browserHistory} from 'react-router';
import {deleteActionForId, getAction, postAction, putAction, resetGetAction} from './genericActions';

import axios from 'axios';

var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');

import {resetUploadImage, resetUploadFile} from './uploadActions';
import {goToExpertCreateChallenge} from '../../fltr/navigation/NavigationManager';
import ReactGA from 'react-ga';

export const TYPE_OPPORTUNITY_CREATE_TEST = 'OPPORTUNITY_CREATE_TEST';
export const TYPE_OPPORTUNITY_UPDATE_TEST = 'OPPORTUNITY_UPDATE_TEST';

const OPPORTUNITY_SEARCH_SIZE = 10;

export function createChallengeTest (opportunityChallengeData, id, onSuccess, onError) {
    return function (dispatch) {
        let params = {...opportunityChallengeData};
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_create_challenge.toString().replace('{id}', id);
        postAction(TYPE_OPPORTUNITY_CREATE_TEST, url, params, dispatch, onSuccess, onError);
    };
}

export function updateChallengeTest (opportunityChallengeData, id, onSuccess, onError) {
    return function (dispatch) {
        const params = {...opportunityChallengeData};
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_update_challenge.toString().replace('{id}', id);
        putAction(TYPE_OPPORTUNITY_UPDATE_TEST, url, params, dispatch, onSuccess, onError);
    };
}

export function fetchOpportunitiesCompleteTagList () {
    return function (dispatch) {
        dispatch({type: RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REQUEST});
        axios.get(Config.serverUrl + API_ENDPOINTS.tag_list_complete, {
            withCredentials: true
        })
            .then(function (response) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_FULFILLED,
                    payload: response.data

                });
            })
            .catch(function (err) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REJECTED,
                    payload: err
                });
            });
    };
}

export function fetchOpportunitiesForExperts (page, type) {
    return function (dispatch) {
        let owned = 'judge';

        let actionRequest = null;
        let actionFulfilled = null;
        let actionRejected = null;

        if (type == 'review') {
            // console.log('review api call');
            actionRequest = EXPERT_OPPORTUNITY_LIST_REQUEST;
            actionFulfilled = EXPERT_OPPORTUNITY_LIST_FULFILLED;
            actionRejected = EXPERT_OPPORTUNITY_LIST_REJECTED;
        } else if (type == 'archived') {
            actionRequest = EXPERT_OPPORTUNITY_ARCHIVED_LIST_REQUEST;
            actionFulfilled = EXPERT_OPPORTUNITY_ARCHIVED_LIST_FULFILLED;
            actionRejected = EXPERT_OPPORTUNITY_ARCHIVED_LIST_REJECTED;
        }

        dispatch({type: actionRequest});

        setTimeout(function () {
            axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_search, {
                withCredentials: true,
                params: {
                    page: page,
                    owned: owned,
                    type: type,
                    status: null,
                    size: OPPORTUNITY_SEARCH_SIZE
                }
            })
                .then((response) => {
                    dispatch({
                        type: actionFulfilled,
                        payload: response.data
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: actionRejected,
                        payload: err
                    });
                });
        }, 0);
    };
}

export function fetchOpportunitiesForRecruiters (page, owned, type) {
    return function (dispatch) {
        let actionRequest = RECRUITER_OPPORTUNITY_LIST_REQUEST;
        let actionFulfilled = RECRUITER_OPPORTUNITY_LIST_FULFILLED;
        let actionRejected = RECRUITER_OPPORTUNITY_LIST_REJECTED;

        dispatch({type: actionRequest});

        setTimeout(function () {
            axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_search, {
                withCredentials: true,
                params: {
                    page: page,
                    owned: owned,
                    type: type,
                    status: null,
                    size: OPPORTUNITY_SEARCH_SIZE
                }
            })
                .then((response) => {
                    dispatch({
                        type: actionFulfilled,
                        payload: response.data
                        /*
                         payload:
                         */
                    });
                })
                .catch((err) => {
                    dispatch({
                        type: actionRejected,
                        payload: err
                    });
                });
        }, 0);
    };
}

export function fetchRecruiterOpportunityCurrentTags (id) {
    return function (dispatch) {
        dispatch({type: RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_REQUEST});
        axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_current_tags.toString().replace('{id}', id), {
            withCredentials: true
        })
            .then(function (response) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_FULFILLED,
                    payload: response.data

                });
            })
            .catch(function (err) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_REJECTED,
                    payload: err
                });
            });
    };
}

export function fetchExpertPendingOpportunities () {
    return function (dispatch) {
        dispatch({type: FETCH_PENDING_OPPORTUNITIES_SUMMARY_REQUEST});
        axios.get(Config.serverUrl + API_ENDPOINTS.expert_pending_list, {
            withCredentials: true
        })
            .then(function (response) {
                dispatch({
                    type: FETCH_PENDING_OPPORTUNITIES_SUMMARY_FULFILLED,
                    payload: response.data

                });
            })
            .catch(function (err) {
                dispatch({
                    type: FETCH_PENDING_OPPORTUNITIES_SUMMARY_REJECTED,
                    payload: err
                });
            });
    };
}

export function saveOpportunityTags (opportunityTagsData, id, onSuccess) {
    return function (dispatch) {
        dispatch({type: RECRUITER_OPPORTUNITY_SAVE_TAGS_REQUEST});
        axios.post(Config.serverUrl + API_ENDPOINTS.opportunity_current_tags.toString().replace('{id}', id),
            {
                tagList: opportunityTagsData

            }, {
                withCredentials: true
            })
            .then(function (response) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_SAVE_TAGS_FULFILLED,
                    payload: response.data

                });

                let payload = {};
                payload['tags'] = response.data.tagList;

                dispatch({
                    type: RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_FULFILLED,
                    payload: payload

                });

                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch(function (err) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_SAVE_TAGS_REJECTED,
                    payload: err
                });
            });
    };
}

export function fetchOpportunityChallenge (id, onSuccess) {
    return function (dispatch) {
        dispatch({type: RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_RESET});
        dispatch({type: RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_REQUEST});
        axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_get_challenge.toString().replace('{id}', id),
            {
                withCredentials: true
            })
            .then(function (response) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_FULFILLED,
                    payload: response.data

                });

                if (onSuccess) {
                    onSuccess();
                }

                var payload = {};

                payload['url'] = response.data.imageUrl;
                payload['id'] = response.data.imageId;

                dispatch({
                    type: UPLOAD_IMAGE_FULFILLED,
                    payload: payload

                });

                dispatch({
                    type: UPLOAD_FILE_FULFILLED,
                    payload: response.data.file

                });
            })
            .catch(function (err) {
                dispatch({
                    type: RECRUITER_OPPORTUNITY_FETCH_CHALLENGE_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}

export function acceptExpertPendingOpporunity (id, onSuccess) {
    return function (dispatch) {
        dispatch({type: EXPERT_ACCEPT_PENDING_OPPORTUNITY_REQUEST});
        axios.post(Config.serverUrl + API_ENDPOINTS.expert_accept_pending_opportunity.toString().replace('{id}', id), {
            withCredentials: true
        })
            .then(function (response) {
                dispatch({
                    type: EXPERT_ACCEPT_PENDING_OPPORTUNITY_FULFILLED,
                    payload: response.data

                });

                if (response.data.manageChallenge) {
                    goToExpertCreateChallenge(id);
                } else {
                    if (onSuccess) {
                        onSuccess();
                    }
                }
            })
            .catch(function (err) {
                dispatch({
                    type: EXPERT_ACCEPT_PENDING_OPPORTUNITY_REJECTED,
                    payload: err
                });

                dispatch(fetchExpertPendingOpportunities());
            });
    };
}

export function declineExpertPendingOpporunity (id, onSuccess) {
    return function (dispatch) {
        dispatch({type: EXPERT_DECLINE_PENDING_OPPORTUNITY_REQUEST});
        axios.post(Config.serverUrl + API_ENDPOINTS.expert_decline_pending_opportunity.toString().replace('{id}', id), {
            withCredentials: true
        })
            .then(function (response) {
                dispatch({
                    type: EXPERT_DECLINE_PENDING_OPPORTUNITY_FULFILLED,
                    payload: response.data

                });

                if (onSuccess) {
                    onSuccess();
                }
            })
            .catch(function (err) {
                dispatch({
                    type: EXPERT_DECLINE_PENDING_OPPORTUNITY_REJECTED,
                    payload: err
                });

                dispatch(fetchExpertPendingOpportunities());
            });
    };
}

export const resetOpportunityCurrentTagList = () => {
    return dispatch => {
        dispatch({
            type: 'RECRUITER_OPPORTUNITY_CURRENT_TAG_LIST_RESET'

        });
    };
};

export const setOpportunityTimeline = (id, data, onSuccess) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_timeline.toString().replace('{id}', id);
        postAction(OPPORTUNITY_TIMELINE, url, data, dispatch, onSuccess);
    };
};

export const extendOpportunityTimeline = (id, data, onSuccess, onError) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_extend.toString().replace('{id}', id);
        postAction(OPPORTUNITY_TIMELINE_EXTEND, url, data, dispatch, onSuccess, onError);
    };
};

export const closeOpportunity = (id, data, onSuccess, onError) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_close.toString().replace('{id}', id);
        postAction(OPPORTUNITY_CLOSE, url, data, dispatch, onSuccess, onError);
    };
};

export const hireOpportunity = (id, data, onSuccess, onError) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_hire.toString().replace('{id}', id);
        postAction(OPPORTUNITY_HIRED, url, data, dispatch, onSuccess, onError);
    };
};

// ALL OF THESE UPDATES THE RIBONSITO
export const updateChallengeSettings = (id, data, onSuccess=null, onError= null) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_general_settings.replace('{id}', id);
        postAction(ACTIONS.OPPORTUNITY_CHALLENGE_SETTINGS, url, data, dispatch, onSuccess, onError, 2000);
    };
};

export const updateTeamSettings = (id, data, onSuccess=null, onError= null) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_team_settings.replace('{id}', id);
        postAction(ACTIONS.OPPORTUNITY_TEAM_SETTINGS, url, data, dispatch, onSuccess, onError, 2000);
    };
};

export const updateTeamMemberSettings = (id, data, onSuccess=null, onError= null) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_team_member_settings.replace('{id}', id);
        postAction(ACTIONS.OPPORTUNITY_TEAM_MEMBER_SETTINGS, url, data, dispatch, onSuccess, onError, 2000);
    };
};

// END OF RIBONSITO

export const activateChallengeForOpportunity = (opportunityId, onSuccess, onError) => {
    const success  = () => {
        const trackingRoute = `/recruiter/opportunity/${opportunityId}/configuration/activate`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        if (onSuccess) onSuccess();
    };
    const error  = () => {
        const trackingRoute = `/recruiter/opportunity/${opportunityId}/configuration/activate/error`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        if (onError) onError();
    };
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_challenge_activate.replace('{id}', opportunityId);
        postAction(ACTIONS.OPPORTUNITY_TEAM_SETTINGS, url, {}, dispatch, success, error);
    };
};

export const getSlackConnectButton = (opportunityId, onSuccess, onError) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.slack_link_info.replace('{id}', opportunityId);
        getAction(ACTIONS.OPPORTUNITY_SLACK_CONNECT_INFO, url, {}, dispatch, onSuccess, onError);
    };
};

export const resetSlackConnectButton = (onSuccess) => {
    return dispatch => {
        resetGetAction(ACTIONS.OPPORTUNITY_SLACK_CONNECT_INFO, dispatch, onSuccess);
    };
};

export const getSlackBindings = (opportunityId, onSuccess, onError) => {
    return dispatch => {
        const url = Config.serverUrl + API_ENDPOINTS.slack_bindings.replace('{id}', opportunityId);
        getAction(ACTIONS.OPPORTUNITY_SLACK_BINDINGS, url, {}, dispatch, onSuccess, onError);
    };
};

export const resetSlackBindings = (onSuccess) => {
    return dispatch => {
        resetGetAction(ACTIONS.OPPORTUNITY_SLACK_BINDINGS, dispatch, onSuccess);
    };
};

export function deleteSlackBinding(id, bindingId, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.slack_binding_delete.toString().replace('{id}', id).replace('{bindingId}', bindingId);
        deleteActionForId(id, ACTIONS.OPPORTUNITY_SLACK_BINDING_DELETE, url, dispatch, onSuccess, onError);
    };
}

export function resetAutosveStatus() {
    return function (dispatch) {
        resetGetAction(ACTIONS.OPPORTUNITY_TEAM_MEMBER_SETTINGS, dispatch);
    }
}