import axios from 'axios';

import { getAction, listingAction, postAction, putAction, resetGetAction } from './genericActions';

import { DEFAULT_LIST_SIZE } from '../../constants/global';
import { manageError } from '../../common/utils';

const API_ENDPOINTS = require('../../common/api_endpoints');

const Global = require('../../common/global_constants');
var Config = require('Config');

export const actions = {
    FETCH_USER_TEMPLATES: 'FETCH_USER_TEMPLATES',
    FETCH_TEMPLATE: 'FETCH_TEMPLATE',
    FETCH_CHALLENGE_TEMPLATE: 'FETCH_CHALLENGE_TEMPLATE',
    CREATE_CHALLENGE_TEMPLATE: 'CREATE_CHALLENGE_TEMPLATE',
    EDIT_TEMPLATE_BY_ID: 'EDIT_TEMPLATE_BY_ID',
    FETCH_OPPORTUNITY_TEMPLATES: 'FETCH_OPPORTUNITY_TEMPLATES',
    OPPORTUNITY_UNLOCK_TEMPLATE: 'OPPORTUNITY_UNLOCK_TEMPLATE',
    OPPORTUNITY_APPLY_TEMPLATE: 'OPPORTUNITY_APPLY_TEMPLATE',
    OPPORTUNITY_APPLY_CHALLENGE_OLD: 'OPPORTUNITY_APPLY_CHALLENGE_OLD',
    FETCH_OPPORTUNITY_CHALLENGE: 'FETCH_OPPORTUNITY_CHALLENGE',
    FETCH_OPPORTUNITY_CHALLENGES_OLD: 'FETCH_OPPORTUNITY_CHALLENGES_OLD',
    DUPLICATE_TEMPLATE: 'DUPLICATE_TEMPLATE',
    OPPORTUNITY_TEMPLATE_SLOTS: 'OPPORTUNITY_TEMPLATE_SLOTS'
};

export function getChallengeTemplates(page = 0, onSuccess = null, onError = null) {
    return function (dispatch) {
        let params = {
            page,
            size: DEFAULT_LIST_SIZE
        };
        let url = Config.serverUrl + API_ENDPOINTS.get_all_user_templates.toString();
        listingAction(actions.FETCH_USER_TEMPLATES, url, params, dispatch, onSuccess, onError);
    };
}

export function getTemplateById(id, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_template_by_id.toString().replace('{id}', id);
        getAction(actions.FETCH_TEMPLATE, url, null, dispatch, onSuccess, onError);
    };
}

export function getTemplateForOpportunity(id = null, templateId, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url;
        if (id !== null) url = Config.serverUrl + API_ENDPOINTS.get_template_by_id_for_ooportunity.toString().replace('{id}', id).replace('{templateId}', templateId);
        else url = Config.serverUrl + API_ENDPOINTS.get_template_by_id.replace('{id}', templateId);
        getAction(actions.FETCH_TEMPLATE, url, null, dispatch, onSuccess, onError);
    };
}
export function getChallengeTemplateForOpportunity(id, challengeId, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_challenge_template_by_id_for_ooportunity.toString().replace('{id}', id).replace('{challengeId}', challengeId);
        getAction(actions.FETCH_CHALLENGE_TEMPLATE, url, null, dispatch, onSuccess, onError);
    };
}

export function createChallengeTemplate(templateData, onSuccess, onError) {
    return function (dispatch) {
        let data = {
            ...templateData
        };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_create_challenge_template.toString();
        postAction(actions.CREATE_CHALLENGE_TEMPLATE, url, data, dispatch, onSuccess, onError);
    };
}


export function editChallengeId(templateData, id, onSuccess, onError) {
    return function (dispatch) {
        let data = {
            ...templateData
        };
        let url = Config.serverUrl + API_ENDPOINTS.get_template_by_id.toString().replace('{id}', id);
        putAction(actions.EDIT_TEMPLATE_BY_ID, url, data, dispatch, onSuccess, onError);
    };
}

export function resetTemplateData(onSuccess = null, onError = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_TEMPLATE, dispatch, onSuccess, onError);
    };
}

export function resetChallengeTemplateData(onSuccess = null, onError = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_CHALLENGE_TEMPLATE, dispatch, onSuccess, onError);
    };
}

export function resetChallengeData(onSuccess = null, onError = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_OPPORTUNITY_CHALLENGE, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityTemplates(onSuccess = null, onError = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_OPPORTUNITY_TEMPLATES, dispatch, onSuccess, onError);
    };
}
export function getOpportunityTemplates(id, page, onSuccess = null, onError = null) {
    console.log(id, page);
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_opportunity_templates.toString().replace('{id}', id);
        const params = {
            sort: 'match',
            page: page,
            size: 12
        };
        getAction(actions.FETCH_OPPORTUNITY_TEMPLATES, url, params, dispatch, onSuccess, onError);
    };
}

export function fetchTemplateSlots(opportunityId) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_slots_for_opportunity.replace('{id}', opportunityId);
        getAction(actions.OPPORTUNITY_TEMPLATE_SLOTS, url, null, dispatch);
    };
}

export function unlockTemplate(opportunity, templateId, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url;
        if (opportunity) url = Config.serverUrl + API_ENDPOINTS.unlock_template_for_opportunity.toString().replace('{id}', opportunity).replace('{templateId}', templateId);
        else  url = Config.serverUrl + API_ENDPOINTS.unlock_template.replace('{templateId}', templateId);
        const data = {
        };
        axios.post(url, data)
            .then(({ data }) => {
                if (onSuccess) onSuccess(data);
                dispatch({
                    type: `${actions.FETCH_OPPORTUNITY_TEMPLATES}_UPDATE`,
                    payload: data
                });
            });
        // .catch((err) => {
        //   manageError(err, 'unlockTemplate',  'Unable to unlock template')
        // })
    };
}

export function opportunityApplyTemplate(opportunityId = null, templateId = null, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url;
        if (opportunityId) url = Config.serverUrl + API_ENDPOINTS.opportunity_apply_template.toString().replace('{id}', opportunityId).replace('{templateId}', templateId);
        else url = Config.serverUrl + API_ENDPOINTS.create_challenge_apply_template.replace('{templateId}', templateId);
        const data = {
            templateId: templateId || undefined
        };
        postAction(actions.OPPORTUNITY_APPLY_TEMPLATE, url, data, dispatch, onSuccess, onError);
    };
}

export function getOpportunityChallege(id, onSuccess = null, onError = null) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_opportunity_challenge.toString().replace('{id}', id);
        getAction(actions.FETCH_OPPORTUNITY_CHALLENGE, url, null, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityChallege(onSuccess = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_OPPORTUNITY_CHALLENGE, dispatch, onSuccess);
    };
}

export function editOpportunityChallenge(id, data, onSuccess = null, onError = null) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_opportunity_challenge.toString().replace('{id}', id);
        putAction(actions.FETCH_OPPORTUNITY_CHALLENGE, url, data, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityChallengesOld(onSuccess = null, onError = null) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_OPPORTUNITY_CHALLENGES_OLD, dispatch, onSuccess, onError);
    };
}
export function getOpportunityChallegesOld(id, page, onSuccess = null, onError = null) {
    return function (dispatch) {
        let params = {
            page,
            size: DEFAULT_LIST_SIZE
        };
        let url = Config.serverUrl + API_ENDPOINTS.get_opportunity_challenges_old.toString().replace('{id}', id);
        listingAction(actions.FETCH_OPPORTUNITY_CHALLENGES_OLD, url, params, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityOldChallenges(onSuccess, onError) {
    return function (dispatch) {
        resetGetAction(actions.FETCH_OPPORTUNITY_CHALLENGES_OLD, dispatch, onSuccess, onError);
    };
}

export function getOpportunityOldChallenges(id, data, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_opportunity_old_challenges.toString().replace('{id}', id);
        postAction(actions.FETCH_OPPORTUNITY_CHALLENGES_OLD, url, data, dispatch, onSuccess, onError);
    };
}

export function opportunityApplyChallengeOld(opportunityId, challengeId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.apply_old_challenge.toString().replace('{id}', opportunityId).replace('{challengeId}', challengeId);
        const data = {
            foo: 'Hola que ase'
        };
        postAction(actions.OPPORTUNITY_APPLY_CHALLENGE_OLD, url, data, dispatch, onSuccess, onError);
    };
}

export function duplicateTemplate(templateId, onSuccess = null, onError = null) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.duplicate_template.toString().replace('{id}', templateId);
        const data = {
            foo: 'Hola que ase'
        };
        postAction(actions.DUPLICATE_TEMPLATE, url, data, dispatch, onSuccess, onError);
    };
}