import {listingAction, resetListingAction, postAction, getAction, putAction, postActionForId, putActionForId, deleteActionForId, getActionForId, resetGetAction} from './genericActions';
var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');

import * as teamRole from '../../constants/teamRole';

export const TYPE_RECRUITER_OPPORTUNITY_TEAM_HIRING = 'RECRUITER_OPPORTUNITY_TEAM_HIRING';
export const TYPE_RECRUITER_OPPORTUNITY_TEAM_EXPERT = 'RECRUITER_OPPORTUNITY_TEAM_EXPERT';
export const TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_HIRING = 'RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_HIRING';
export const TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_EXPERT = 'RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_EXPERT';
export const TYPE_RECRUITER_OPPORTUNITY_TEAM_ADD_MEMBER = 'RECRUITER_OPPORTUNITY_TEAM_ADD_MEMBER';
export const TYPE_RECRUITER_OPPORTUNITY_TEAM_REMOVE_MEMBER = 'RECRUITER_OPPORTUNITY_TEAM_REMOVE_MEMBER';


const SIZE_TEAM_LIST = 12;

export function resetRecruiterOpportunityTeam(roleId){
    return function(dispatch) {
        let action = '';
        if (roleId == teamRole.EXPERT){
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_EXPERT;
        } else if (roleId == teamRole.HIRING){
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_HIRING;
        }
        resetListingAction(action, dispatch);
    };
}

export function fetchRecruiterOpportunityTeam(id, roleId, page, sort = '') {
    return function(dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_team.toString().replace('{id}', id).replace('{roleId}', roleId);
        let params = {
            page: page,
            size: SIZE_TEAM_LIST,
            sort: sort
        };

        let action = '';
        if (roleId == teamRole.EXPERT){
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_EXPERT;
        } else if (roleId == teamRole.HIRING){
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_HIRING;
        }

        listingAction(action, url, params, dispatch, null, null);
    };
}

export function fetchRecruiterTeamSuggestions(id, roleId, onSuccess, onError) {
    return function(dispatch) {
        let action ='';
        if (roleId == teamRole.HIRING) {
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_HIRING;
        } else if (roleId == teamRole.EXPERT) {
            action = TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_EXPERT;
        }
        let data = {};
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_team_suggestion.toString().replace('{id}', id).replace('{roleId}', roleId);
        getAction(action, url, data, dispatch, onSuccess, onError);
    };
}

export function addTeamMember(opportunityId,data, onSuccess, onError){
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_team_add_member.toString().replace('{id}', opportunityId);
        postAction(TYPE_RECRUITER_OPPORTUNITY_TEAM_ADD_MEMBER, url, data, dispatch, onSuccess, onError);
    };
}

export function deleteTeamMember(opportunityId, teamUserId, roleId, onSuccess, onError){
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_team_remove_member.toString().replace('{id}', opportunityId).replace('{teamUserId}', teamUserId).replace('{roleId}', roleId);
        deleteActionForId(teamUserId, TYPE_RECRUITER_OPPORTUNITY_TEAM_REMOVE_MEMBER, url, dispatch, onSuccess, onError);
    };
}


