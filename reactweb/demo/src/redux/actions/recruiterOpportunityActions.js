import { listingAction, resetListingAction, postAction, getAction, putAction, postActionForId, putActionForId, deleteActionForId, getActionForId, resetGetAction } from './genericActions';
import Axios from '../../../node_modules/axios/index';
import { manageError } from '../../common/utils';
var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');
import ReactGA from 'react-ga';

export const TYPE_RECRUITER_CANDIDATES = 'RECRUITER_CANDIDATES';
export const TYPE_RECRUITER_CANDIDATES_OLD = 'RECRUITER_CANDIDATES_OLD';
export const TYPE_RECRUITER_CANDIDATE_ATTITUDE = 'TYPE_RECRUITER_CANDIDATE_ATTITUDE';
export const TYPE_RECRUITER_CANDIDATE_CHALLENGE = 'RECRUITER_CANDIDATE_CHALLENGE';
export const TYPE_RECRUITER_CANDIDATE_OVERVIEW = 'TYPE_RECRUITER_CANDIDATE_OVERVIEW';

export const TYPE_RECRUITER_CANDIDATES_NAME_LIST = 'RECRUITER_CANDIDATES_NAME_LIST';
export const TYPE_RECRUITER_USER_NOTES = 'RECRUITER_USER_NOTES';
export const TYPE_RECRUITER_OPPORTUNITIES = 'RECRUITER_OPPORTUNITIES';
export const TYPE_RECRUITER_CREATE_COMPANY = 'RECRUITER_CREATE_COMPANY';
export const TYPE_RECRUITER_GET_COMPANY = 'RECRUITER_GET_COMPANY';
export const TYPE_RECRUITER_UPDATE_COMPANY = 'TYPE_RECRUITER_UPDATE_COMPANY';
export const TYPE_RECRUITER_CREATE_OPPORTUNITY = 'RECRUITER_CREATE_OPPORTUNITY';
export const TYPE_RECRUITER_UPDATE_OPPORTUNITY = 'RECRUITER_UPDATE_OPPORTUNITY';
export const TYPE_RECRUITER_GET_OPPORTUNITY = 'RECRUITER_GET_OPPORTUNITY';
export const TYPE_RECRUITER_DELETE_OPPORTUNITY_DRAFT = 'RECRUITER_DELETE_OPPORTUNITY_DRAFT';
export const TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION = 'RECRUITER_GET_OPPORTUNITY_CONFIGURATION';
export const TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL = 'RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL';
export const TYPE_RECRUITER_SAVE_CONFIGURATION_EXPERT = 'RECRUITER_SAVE_CONFIGURATION_EXPERT';
export const TYPE_RECRUITER_SAVE_CONFIGURATION_CHALLENGE = 'RECRUITER_SAVE_CONFIGURATION_CHALLENGE';
export const TYPE_RECRUITER_CONFIGURATION_HOURS_DURATION = 'RECRUITER_CONFIGURATION_HOURS_DURATION';
export const TYPE_RECRUITER_CONFIGURATION_CONFIRM_TEST = 'RECRUITER_CONFIGURATION_CONFIRM_TEST';
export const TYPE_RECRUITER_CONFIGURATION_CONFIRM_ALL = 'RECRUITER_CONFIGURATION_CONFIRM_ALL';
export const TYPE_RECRUITER_BOOKMARK = 'RECRUITER_BOOKMARK';
export const TYPE_RECRUITER_DISCARD = 'RECRUITER_DISCARD';
export const TYPE_RECRUITER_CHALLENGE_INVITE = 'RECRUITER_CHALLENGE_INVITE';
export const TYPE_RECRUITER_REVIEW_CV = 'RECRUITER_REVIEW_CV';
export const TYPE_RECRUITER_REVIEW_CV_UPDATE = 'RECRUITER_REVIEW_CV_UPDATE';
export const TYPE_RECRUITER_EXTEND_TIMELINE = 'RECRUITER_EXTEND_TIMELINE';
export const TYPE_RECRUITER_NOTE_UPDATE = 'RECRUITER_NOTE_UPDATE';
export const TYPE_RECRUITER_NOTE_DELETE = 'RECRUITER_NOTE_DELETE';
export const TYPE_RECRUITER_NOTE_CREATE = 'RECRUITER_NOTE_CREATE';
export const TYPE_RECRUITER_TAG_CATEGORIES = 'TYPE_RECRUITER_TAG_CATEGORIES';
export const TYPE_RECRUITER_TAG_SKILLS = 'TYPE_RECRUITER_TAG_SKILLS';
export const TYPE_GET_TEMPLATES_BY_CRITERIA = 'TYPE_GET_TEMPLATES_BY_CRITERIA';
export const TYPE_RECRUITER_GET_CHALLENGE_BY_ID = 'TYPE_RECRUITER_GET_CHALLENGE_BY_ID';
export const TYPE_RECRUITER_USE_CHALLENGE = 'TYPE_RECRUITER_USE_CHALLENGE';
export const TYPE_RECRUITER_ALL_KILLER_ANSWERS = 'TYPE_RECRUITER_ALL_KILLER_ANSWERS';
export const TYPE_RECRUITER_ENABLE_CV = 'TYPE_RECRUITER_ENABLE_CV';
export const TYPE_RECRUITER_ENABLE_PHONE = 'TYPE_RECRUITER_ENABLE_PHONE';
export const TYPE_RECRUITER_CLEAN_NEW_CANDIDATES = 'TYPE_RECRUITER_CLEAN_NEW_CANDIDATES';

export const MATCH_ORDER_BY_POINTS = 'points';
export const MATCH_ORDER_BY_DATE = 'default';
export const MATCH_ORDER_BY_REVIEW = 'review';
export const MATCH_ORDER_BY_RANK = 'rank';
export const MATCH_ORDER_BY_CV = 'cv';
export const MATCH_ORDER_BY_BOOKMARK = 'bookmark';
export const MATCH_ORDER_BY_ACTIVE = 'active';
export const MATCH_ORDER_BY_DISCARDED = 'discard';
export const MATCH_ORDER_BY_DISQUALIFIED = 'disqualified';
export const MATCH_ORDER_BY_BOOKMARK_DISCARDED = 'bookmark_discarded';

export const FILTER_ALL_APPLICANTS = 'all';


export const FETCH_OPPORTUNITY_PROVIDERS = 'FETCH_OPPORTUNITY_PROVIDERS';
export const SAVE_OPPORTUNITY_PROVIDERS = 'SAVE_OPPORTUNITY_PROVIDERS';

export const FETCH_OPPORTUNITY_MATCH_STATS = 'FETCH_OPPORTUNITY_MATCH_STATS';
export const FETCH_CHALLENGE_MATCH_STATS = 'FETCH_CHALLENGE_MATCH_STATS';

export const CHANGE_OPPORTUNITY_TYPE = 'CHANGE_OPPORTUNITY_TYPE';

export const SKILLS_FOR_OPPORTUNITY = 'SKILLS_FOR_OPPORTUNITY';

export const TYPE_RECRUITER_ALL_SKILLS = 'TYPE_RECRUITER_ALL_SKILLS';

export const TYPE_RECRUITER_UPDATE_CHALLENGE = 'TYPE_RECRUITER_UPDATE_CHALLENGE';

export const SIZE_CANDIDATE_LIST = 36;
const SIZE_NOTE_LIST = 20;

export function resetRecruiterCandidates(onSuccess) {
    return function (dispatch) {
        resetListingAction(TYPE_RECRUITER_CANDIDATES, dispatch, onSuccess);
    };
}

export function fetchRecruiterCandidates(id, page, data = { sort: MATCH_ORDER_BY_POINTS }, userId = null, onSuccess = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match.toString().replace('{id}', id);
        let params = {
            page,
            ...data,
            filterUserId: userId,
            process: true
        };
        listingAction(TYPE_RECRUITER_CANDIDATES, url, params, dispatch, onSuccess, null);
    };
}

export function fetchRecruiterCandidatesOld(id, page, data = { sort: MATCH_ORDER_BY_POINTS }, userId = null, onSuccess = null) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_old.toString().replace('{id}', id);
        let params = {
            page,
            ...data,
            filterUserId: userId,
            process: true
        };
        listingAction(TYPE_RECRUITER_CANDIDATES_OLD, url, params, dispatch, onSuccess, null);
    };
}

export function fetchRecruiterCandidateAttitude(id, userId = null, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_attitude.toString().replace('{id}', id).replace('{userToReview}', userId);
        listingAction(TYPE_RECRUITER_CANDIDATE_ATTITUDE, url, {}, dispatch, onSuccess, onError);
    };
}

export function fetchRecruiterCandidateExperience(id, userId = null, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_experience.toString().replace('{id}', id).replace('{userId}', userId);
        listingAction(TYPE_RECRUITER_CANDIDATE_ATTITUDE, url, {}, dispatch, onSuccess, onError);
    };
}

export function getKillerAnswers(id, userId, onSuccess) {
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_killer_answers.replace('{id}', id).replace('{userID}', userId);
        getAction(TYPE_RECRUITER_ALL_KILLER_ANSWERS, url, {}, dispatch, onSuccess);
    };
}

export function fetchRecruiterCandidateChallenge(id, userId = null, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_challenge.toString().replace('{id}', id).replace('{userToReview}', userId);
        getAction(TYPE_RECRUITER_CANDIDATE_CHALLENGE, url, {}, dispatch, onSuccess, onError);
    };
}

export function fetchRecruiterCandidateOverview(id, userId = null, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_overview.toString().replace('{id}', id).replace('{userToReview}', userId);
        getAction(TYPE_RECRUITER_CANDIDATE_OVERVIEW, url, {}, dispatch, onSuccess, onError);
    };
}

export function fetchRecruiterCandidatesNames(id, sort = 'default', onSuccess, onError) {
    return function (dispatch) {
        let data = { sort };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_user_list.toString().replace('{id}', id);
        getAction(TYPE_RECRUITER_CANDIDATES_NAME_LIST, url, data, dispatch, onSuccess, onError);
    };
}

export function enableCv(id, value, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_enable_cv.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_ENABLE_CV, url, { value }, dispatch, onSuccess, onError);
    };
}

export function enablePhone(id, value, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_enable_phone.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_ENABLE_PHONE, url, { value }, dispatch, onSuccess, onError);
    };
}

export function cleanNewCandidates(id, trackId, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_clean_new_applicants.toString().replace('{id}', id).replace('{trackId}', trackId);
        postAction(TYPE_RECRUITER_CLEAN_NEW_CANDIDATES, url, {}, dispatch, onSuccess, onError);
    };
}

export function resetNotes() {
    return function (dispatch) {
        resetListingAction(TYPE_RECRUITER_USER_NOTES, dispatch);
    };
}

export function fetchNotes(id, playerId, page, sort = '') {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_user_notes.toString().replace('{id}', id).replace('{playerId}', playerId);
        let params = {
            page: page,
            size: SIZE_NOTE_LIST,
            sort: sort
        };

        listingAction(TYPE_RECRUITER_USER_NOTES, url, params, dispatch, null, null);
    };
}

export function resetRecruiterOpportunties() {
    return function (dispatch) {
        resetListingAction(TYPE_RECRUITER_OPPORTUNITIES, dispatch);
    };
}


export function createCompany(data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.company_create;
        postAction(TYPE_RECRUITER_CREATE_COMPANY, url, data, dispatch, onSuccess, onError);
    };
}
export function getCompanyById(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.company_get.toString().replace('{id}', id);
        let data = {};
        getAction(TYPE_RECRUITER_GET_COMPANY, url, data, dispatch, onSuccess, onError);
    };
}

export function updateCompany(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.company_update.toString().replace('{id}', id);
        putAction(TYPE_RECRUITER_UPDATE_COMPANY, url, data, dispatch, onSuccess, onError);
    };
}

export function getTagCategories(onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.tags_categories.toString();
        getAction(TYPE_RECRUITER_TAG_CATEGORIES, url, {}, dispatch, onSuccess, onError);
    };
}

export function getSkillsByTeamId(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_skills_by_team_id.toString().replace('{id}', id);
        getAction(TYPE_RECRUITER_TAG_SKILLS, url, {}, dispatch, onSuccess, onError);
    };
}

export function getAllSkills(onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.tag_list_complete.toString();
        getAction(TYPE_RECRUITER_ALL_SKILLS, url, {}, dispatch, onSuccess, onError);
    };
}

export function getChallengeById(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_challenge_by_id.toString().replace('{challengeId}', id);
        getAction(TYPE_RECRUITER_GET_CHALLENGE_BY_ID, url, {}, dispatch, onSuccess, onError);
    };
}

export function resetChallengeById(onSuccess = null) {
    return function (dispatch) {
        resetGetAction(TYPE_RECRUITER_GET_CHALLENGE_BY_ID, dispatch, onSuccess);
    };
}

export function getTemplatesByCriteria(data, page = 0, size = 10, sort = 'match', onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_templates_by_criteria;
        if (page) url += `&page=${page}`;
        if (size) url += `&size=${size}`;
        if (sort) url += `&sort=${sort}`;
        url = url.replace('&', '?');
        postAction(TYPE_GET_TEMPLATES_BY_CRITERIA, url, data, dispatch, onSuccess, onError);
    };
}

export function resetGetTemplatesByCriteria(onSuccess) {
    return function (dispatch) {
        resetGetAction(TYPE_GET_TEMPLATES_BY_CRITERIA, dispatch, onSuccess);
    };
}

export function createOpportunity(data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_create;
        postAction(TYPE_RECRUITER_CREATE_OPPORTUNITY, url, data, dispatch, onSuccess, onError);
    };
}

export function useChallenge(id, data, onSuccess, onError) {
    const success = () => {
        const trackingRoute = `/recruiter/opportunity/${id}/configuration/use`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        if (onSuccess) onSuccess();
    };
    const error = () => {
        const trackingRoute = `/recruiter/opportunity/${id}/configuration/use/error`;
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        if (onError) onError();
    };
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.use_challenge.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_USE_CHALLENGE, url, data, dispatch, success, error);
    };
}

export function updateOpportunity(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_update.replace('{id}', id);
        putAction(TYPE_RECRUITER_UPDATE_OPPORTUNITY, url, data, dispatch, onSuccess, onError);
    };
}

export function updateChallenge(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.get_challenge_by_id.toString().replace('{challengeId}', id);
        putAction(TYPE_RECRUITER_UPDATE_CHALLENGE, url, data, dispatch, onSuccess, onError);
    };
}

export function getOpportunityById(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_by_id.toString().replace('{id}', id);
        let data = {};
        getAction(TYPE_RECRUITER_GET_OPPORTUNITY, url, data, dispatch, onSuccess, onError);
    };
}

export function RemoveOpportunityById(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_by_id.toString().replace('{id}', id);
        deleteActionForId(id, TYPE_RECRUITER_DELETE_OPPORTUNITY_DRAFT, url, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityGetById(onSuccess) {
    return function (dispatch) {
        resetGetAction(TYPE_RECRUITER_GET_OPPORTUNITY, dispatch, onSuccess);
    };
}

export function resetOpportunity() {
    return function (dispatch) {
        resetListingAction(TYPE_RECRUITER_CREATE_OPPORTUNITY, dispatch);
    };
}

export function manageBookmark(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_bookmark.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(matchId, TYPE_RECRUITER_BOOKMARK, url, data, dispatch, onSuccess, onError);
    };
}

export function manageDiscard(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_discard.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(matchId, TYPE_RECRUITER_DISCARD, url, data, dispatch, onSuccess, onError);
    };
}

export function resetProcessForRecruiter(onSuccess) {
    return function (dispatch) {
        resetListingAction(TYPE_RECRUITER_CANDIDATES, dispatch, onSuccess = null);
    };
}

export function manageInviteChallenge(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_challenge_invite.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(matchId, TYPE_RECRUITER_CHALLENGE_INVITE, url, data, dispatch, onSuccess, onError);
    };
}

export function manageExtendTimeline(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_extend.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(matchId, TYPE_RECRUITER_EXTEND_TIMELINE, url, data, dispatch, onSuccess, onError);
    };
}

export function reviewCv(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_review_cv_create.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(matchId, TYPE_RECRUITER_REVIEW_CV, url, data, dispatch, onSuccess, onError);
    };
}

export function updateCv(matchId, id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_review_cv_update.toString().replace('{id}', id).replace('{playerId}', playerId);
        putActionForId(matchId, TYPE_RECRUITER_REVIEW_CV_UPDATE, url, data, dispatch, onSuccess, onError);
    };
}

export function createNote(id, playerId, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_note_create.toString().replace('{id}', id).replace('{playerId}', playerId);
        postActionForId(id, TYPE_RECRUITER_NOTE_CREATE, url, data, dispatch, onSuccess, onError);
    };
}

export function updateNote(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_note_update.toString().replace('{id}', id);
        putActionForId(id, TYPE_RECRUITER_NOTE_UPDATE, url, data, dispatch, onSuccess, onError);
    };
}

export function deleteNote(id, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_note_delete.toString().replace('{id}', id);
        deleteActionForId(id, TYPE_RECRUITER_NOTE_DELETE, url, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityConfiguration(onSuccess) {
    return function (dispatch) {
        resetGetAction(TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION, dispatch, onSuccess);
    };
}

export function getOpportunityConfiguration(onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration.toString();
        let data = {};
        getAction(TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION, url, data, dispatch, onSuccess, onError);
    };
}

export function resetOpportunityConfigurationDetail(onSuccess) {
    return function (dispatch) {
        resetGetAction(TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL, dispatch, onSuccess);
    };
}

export function getOpportunityConfigurationDetail(id, onSuccess, onError) {

    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_by_id.toString().replace('{id}', id);
        let data = {};
        getAction(TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL, url, data, dispatch, onSuccess, onError);
    };
}

export function saveOpportunityConfigurationExpert(opportunityExpertData, id, onSuccess, onError) {
    return function (dispatch) {
        let params = {
            external: opportunityExpertData['external'],
            internal: opportunityExpertData['internal'],
            internalJudges: opportunityExpertData['internalJudges'],
            selfJudge: opportunityExpertData['selfJudge']
        };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_save_expert_configuration.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_SAVE_CONFIGURATION_EXPERT, url, params, dispatch, onSuccess, onError);
    };
}

export function saveOpportunityConfigurationChallenge(opportunityChallengeConfigurationData, id, onSuccess, onError) {

    return function (dispatch) {
        let params = {
            expert: opportunityChallengeConfigurationData['expert'],
            recruiter: opportunityChallengeConfigurationData['recruiter'],
            userId: opportunityChallengeConfigurationData['userId'],
        };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_save_challenge_configuration.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_SAVE_CONFIGURATION_CHALLENGE, url, params, dispatch, onSuccess, onError);
    };
}

export function configureHoursTalent(id, hours, onSuccess, onError) {

    return function (dispatch) {
        // console.log("id " + id + "hours : " + hours + "onError " + onError);
        let params = {
            hoursDuration: hours
        };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_hours_duration.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_CONFIGURATION_HOURS_DURATION, url, params, dispatch, onSuccess, onError);
    };
}

export function confirmTest(id, onSuccess, onError) {

    return function (dispatch) {
        let params = {
        };
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_confirm_test.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_CONFIGURATION_CONFIRM_TEST, url, params, dispatch, onSuccess, onError);
    };
}

export function confirmChallengeConfiguration(id, data, onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_configuration_confirm.toString().replace('{id}', id);
        postAction(TYPE_RECRUITER_CONFIGURATION_CONFIRM_ALL, url, data, dispatch, onSuccess, onError);
    };
}

export const fetchOpportunityProviders = (id, onSuccess = null, onError = null) => {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_providers.toString().replace('{id}', id);
        getAction(FETCH_OPPORTUNITY_PROVIDERS, url, null, dispatch, onSuccess, onError);
    };
};

export const resetOpportunityProviders = (onSuccess = null) => {
    return function (dispatch) {
        resetGetAction(FETCH_OPPORTUNITY_PROVIDERS, dispatch, onSuccess);
    };
};

export const saveOpportunityProviders = (id, data, onSuccess = null, onError = null) => {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_providers.toString().replace('{id}', id);
        postAction(FETCH_OPPORTUNITY_PROVIDERS, url, data, dispatch, onSuccess, onError);
    };
};


export const opportunityChangeVisibility = (id, data, onSuccess = null, onError = null) => {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_change_visibility.toString().replace('{id}', id);
        postAction(CHANGE_OPPORTUNITY_TYPE, url, data, dispatch, onSuccess, onError);
    };
};

export const fetchSkillForOpportunity = (id, onSuccess = null, onError = null) => {
    return async function (dispatch) {
        const TYPE = SKILLS_FOR_OPPORTUNITY;
        dispatch({
            type: `${TYPE}_REQUEST`
        });
        try {
            const { data } = await Axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_skill_categories.toString().replace('{id}', id));
            dispatch({
                type: `${TYPE}_FULFILLED`,
                payload: data
            });
            if (onSuccess) {
                onSuccess(data);
            }
        } catch (error) {
            dispatch({
                type: `${TYPE}_REJECTED`,
                payload: error
            });
            manageError(error);
            if (onError) {
                onError(error);
            }
        }
    };
};

export const fetchSkillForCategory = (id, key, onSuccess = null, onError = null) => {
    return async function (dispatch) {
        const TYPE = `${SKILLS_FOR_OPPORTUNITY}_CATEGORY`;
        dispatch({
            type: `${TYPE}_REQUEST`
        });
        try {
            const { data } = await Axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_category_skills.toString().replace('{id}', id).replace('{categoryTag}', key));
            dispatch({
                type: `${TYPE}_FULFILLED`,
                payload: {
                    data,
                    category: key
                }
            });
            if (onSuccess) {
                onSuccess(data);
            }
        } catch (error) {
            dispatch({
                type: `${TYPE}_REJECTED`,
                payload: error
            });
            manageError(error);
            if (onError) {
                onError(error);
            }
        }
    };
};

export const fetchOpportunityMatchStats = (id, onSuccess = null, onError = null) => {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.opportunity_match_stats.toString().replace('{id}', id);
        getAction(FETCH_OPPORTUNITY_MATCH_STATS, url, null, dispatch, onSuccess, onError);
    };
};

export const resetOpportunityMatchStats = (onSuccess = null, onError = null) => {
    return function (dispatch) {
        resetGetAction(FETCH_OPPORTUNITY_MATCH_STATS, dispatch, onSuccess);
    };
};

export function fetchChallengeStats(onSuccess, onError) {
    return function (dispatch) {
        let url = Config.serverUrl + API_ENDPOINTS.challenge_match_stats;
        getAction(FETCH_CHALLENGE_MATCH_STATS, url, null, dispatch, onSuccess, onError);
    };
}
export function fetchRecruiterOpportunties(page, owned, filters, key) {
    return async function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.opportunity_search;
        const TYPE = `${TYPE_RECRUITER_OPPORTUNITIES}_CATEGORY`;
        const params = {
            page: page,
            owned: owned,
            ...filters,
            size: Global.LIST_SIZE
        };
        dispatch({
            type: `${TYPE}_REQUEST`
        });
        try {
            const response = await Axios.get(url, { params });
            dispatch({
                type: `${TYPE}_FULFILLED`,
                payload: {
                    data: response.data,
                    category: key
                }
            });
        } catch (error) {
            dispatch({
                type: `${TYPE}_REJECTED`,
                payload: error
            });
            manageError(error);
        }
    };
}