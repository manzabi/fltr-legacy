import { getAction, listingAction, postAction, putAction, resetGetAction } from './genericActions';

import { DEFAULT_LIST_SIZE } from '../../constants/global';
import { manageError } from '../../common/utils';

const API_ENDPOINTS = require('../../common/api_endpoints');

const Global = require('../../common/global_constants');
var Config = require('Config');

export const actions = {
    FETCH_KILLER_QUESTIONS: 'FETCH_KILLER_QUESTIONS',
    SUBMIT_KILLER_QUESTIONS: 'SUBMIT_KILLER_QUESTIONS'
};

export function getKillerQuestionsOpportunity(id, onSuccess = null, onError = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.killer_questions_opportunity.toString().replace('{id}', id);
        getAction(actions.FETCH_KILLER_QUESTIONS, url, null, dispatch, onSuccess, onError);
    };
}

export function submitKillerQuestionsOpportunity(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.killer_questions_opportunity.toString().replace('{id}', id);
        postAction(actions.SUBMIT_KILLER_QUESTIONS, url, data, dispatch, onSuccess, onError);
    };
}