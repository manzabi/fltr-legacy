import { commonResetList, commonResponseNoContentWrapperWithReset, initial, commonReducer, commonReducerReset } from './commonReducer';
import { } from './opportunityReducer';
import { ACTIONS } from '../actions/opportunityActions';
import {
    TYPE_RECRUITER_CANDIDATES,
    TYPE_RECRUITER_CANDIDATES_NAME_LIST,
    TYPE_RECRUITER_OPPORTUNITIES,
    TYPE_RECRUITER_CREATE_OPPORTUNITY,
    TYPE_RECRUITER_GET_OPPORTUNITY,
    TYPE_RECRUITER_UPDATE_OPPORTUNITY,
    TYPE_RECRUITER_BOOKMARK,
    // TYPE_RECRUITER_DISCARD,
    TYPE_RECRUITER_CHALLENGE_INVITE,
    TYPE_RECRUITER_EXTEND_TIMELINE,
    TYPE_RECRUITER_REVIEW_CV,
    TYPE_RECRUITER_REVIEW_CV_UPDATE,
    TYPE_RECRUITER_USER_NOTES,
    TYPE_RECRUITER_NOTE_UPDATE,
    TYPE_RECRUITER_NOTE_DELETE,
    TYPE_RECRUITER_NOTE_CREATE,
    TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION,
    TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL,
    TYPE_RECRUITER_CONFIGURATION_HOURS_DURATION,
    TYPE_RECRUITER_GET_COMPANY,
    FETCH_OPPORTUNITY_PROVIDERS,
    SKILLS_FOR_OPPORTUNITY,
    FETCH_OPPORTUNITY_MATCH_STATS,
    FETCH_CHALLENGE_MATCH_STATS,
    TYPE_RECRUITER_TAG_CATEGORIES,
    TYPE_RECRUITER_TAG_SKILLS,
    TYPE_GET_TEMPLATES_BY_CRITERIA,
    RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REQUEST,
    TYPE_RECRUITER_GET_CHALLENGE_BY_ID,
    TYPE_RECRUITER_ALL_SKILLS,
    TYPE_RECRUITER_ENABLE_CV,
    TYPE_RECRUITER_ENABLE_PHONE
} from '../actions/recruiterOpportunityActions';
import { ERROR_SAVING, INITIALISING, SAVED, SAVING } from '../../constants/saveStatus';
import { getActionStatus } from '../../fltr/utils/reduxActionsUtils';

function recruiterCandidates(state = initial, action) {
    return commonResetList(state, action, TYPE_RECRUITER_CANDIDATES);
}

function recruiterCandidatesNames(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_CANDIDATES_NAME_LIST);
}

function recruiterTagCategories(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_TAG_CATEGORIES);
}
function recruiterTagSkillsById(state = initial, action) {
    if (action && action.type && action.type.includes(TYPE_RECRUITER_TAG_SKILLS)) {
        return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_TAG_SKILLS);
    } else if (action && action.type && action.type.includes(TYPE_RECRUITER_ALL_SKILLS)) {
        return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_ALL_SKILLS);
    } else {
        return state;
    }
}

function recruiterTemplatesByCriteria(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_GET_TEMPLATES_BY_CRITERIA);
}

function recruiterAllTagList(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, RECRUITER_OPPORTUNITY_COMPLETE_TAG_LIST_REQUEST);
}

function recruiterChallengeById(state = initial, action) {
    const request = TYPE_RECRUITER_GET_CHALLENGE_BY_ID + '_REQUEST';
    const fulfilled = TYPE_RECRUITER_GET_CHALLENGE_BY_ID + '_FULFILLED';
    const rejected = TYPE_RECRUITER_GET_CHALLENGE_BY_ID + '_REJECTED';
    const reset = TYPE_RECRUITER_GET_CHALLENGE_BY_ID + '_RESET';
    return commonReducerReset(state, action, request, fulfilled, rejected, reset);
}

function recruiterUserNotes(state = initial, action) {

    // update entities management
    if (action.type == TYPE_RECRUITER_NOTE_UPDATE + '_FULFILLED') {

        // console.log('action.payload : ' + JSON.stringify(action.payload));
        return {
            ...state,
            item: {
                ...state.item,
                content: state.item.content.map(note => note.id === action.payload.id ?
                    // select the item with the specified id and change the value of read field
                    action.payload.value :
                    // otherwise returns the original item with no changes
                    note
                )
            }
        };
    }

    if (action.type == TYPE_RECRUITER_NOTE_DELETE + '_FULFILLED') {
        let arrayContent = [];
        state.item.content.map((note) => {
            if (note.id != action.payload.id) {
                arrayContent.push(note);
            }
        });

        return {
            ...state,
            item: {
                ...state.item,
                content: arrayContent
            }
        };
    }

    if (action.type == TYPE_RECRUITER_NOTE_CREATE + '_FULFILLED') {
        let arrayContent = [];
        arrayContent.push(action.payload.value);
        state.item.content.map((note) => {
            arrayContent.push(note);
        });

        return {
            ...state,
            item: {
                ...state.item,
                content: arrayContent
            }
        };
    }

    return commonResetList(state, action, TYPE_RECRUITER_USER_NOTES);
}


function recruiterOpportunityCreate(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_CREATE_OPPORTUNITY);
}

function recruiterOpportunityUpdate(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_UPDATE_OPPORTUNITY);
}

function recruiterOpportunityGet(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_GET_OPPORTUNITY);
}

function recruiterOpportunityConfiguration(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION);
}

function recruiterOpportunityConfigurationDetail(state = initial, action) {

    if (action.type == TYPE_RECRUITER_CONFIGURATION_HOURS_DURATION + '_FULFILLED') {
        return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_CONFIGURATION_HOURS_DURATION);
    }

    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_GET_OPPORTUNITY_CONFIGURATION_DETAIL);
}
function recruiterCompanyGet(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_GET_COMPANY);
}

function opportunityProviders(state = initial, action) {
    const requestAction = `${FETCH_OPPORTUNITY_PROVIDERS}_REQUEST`;
    const fulfilledAction = `${FETCH_OPPORTUNITY_PROVIDERS}_FULFILLED`;
    const rejectedAction = `${FETCH_OPPORTUNITY_PROVIDERS}_REJECTED`;
    const resetAction = `${FETCH_OPPORTUNITY_PROVIDERS}_RESET`;
    return commonReducerReset(state, action, requestAction, fulfilledAction, rejectedAction, resetAction);
}

function opportunityStats(state = initial, action) {
    const requestAction = `${FETCH_OPPORTUNITY_MATCH_STATS}_REQUEST`;
    const fulfilledAction = `${FETCH_OPPORTUNITY_MATCH_STATS}_FULFILLED`;
    const rejectedAction = `${FETCH_OPPORTUNITY_MATCH_STATS}_REJECTED`;
    const resetAction = `${FETCH_OPPORTUNITY_MATCH_STATS}_RESET`;
    return commonReducerReset(state, action, requestAction, fulfilledAction, rejectedAction, resetAction);
}

function challengeStats(state = initial, action) {
    const requestAction = `${FETCH_CHALLENGE_MATCH_STATS}_REQUEST`;
    const fulfilledAction = `${FETCH_CHALLENGE_MATCH_STATS}_FULFILLED`;
    const rejectedAction = `${FETCH_CHALLENGE_MATCH_STATS}_REJECTED`;
    const resetAction = `${FETCH_CHALLENGE_MATCH_STATS}_RESET`;
    return commonReducerReset(state, action, requestAction, fulfilledAction, rejectedAction, resetAction);
}


function opportunitySkillsByCategory(state = initial, action) {
    switch (action.type) {
        case `${SKILLS_FOR_OPPORTUNITY}_RESET`: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false,
                item: null
            });
        }
        case `${SKILLS_FOR_OPPORTUNITY}_REQUEST`: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case `${SKILLS_FOR_OPPORTUNITY}_FULFILLED`: {
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: action.payload
            });
        }
        case `${SKILLS_FOR_OPPORTUNITY}_REJECTED`:
            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });
        case `${SKILLS_FOR_OPPORTUNITY}_CATEGORY_REQUEST`:
            return Object.assign({}, state, {
                ...state,
                isFetching: true,

            });
        case `${SKILLS_FOR_OPPORTUNITY}_CATEGORY_FULFILLED`: {
            const { payload } = action;
            const selectedCategory = payload.category;
            const { data } = payload;
            state.item.map((category) => {
                if (category.key === selectedCategory) {
                    category.skills = data;
                }
            });
            return Object.assign({}, state, {
                ...state,
                isFetching: false,
            });
        }
        case `${SKILLS_FOR_OPPORTUNITY}_CATEGORY_REJECTED`:
            return Object.assign({}, state, {
                ...state,
                isFetching: false,
                isError: true

            });
        default:
            return state;
    }
}

function recruiterOpportunities(state = initial, action) {
    switch (action.type) {
        case `${TYPE_RECRUITER_OPPORTUNITIES}_RESET`: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false,
                item: null
            });
        }
        case `${TYPE_RECRUITER_OPPORTUNITIES}_REQUEST`: {
            return Object.assign({}, state, {
                isFetching: true,
                isError: false
            });
        }
        case `${TYPE_RECRUITER_OPPORTUNITIES}_FULFILLED`: {
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: action.payload
            });
        }
        case `${TYPE_RECRUITER_OPPORTUNITIES}_REJECTED`:
            return Object.assign({}, state, {
                isFetching: false,
                isError: true,
                err: action.payload
            });
        case `${TYPE_RECRUITER_OPPORTUNITIES}_CATEGORY_REQUEST`:
            return Object.assign({}, state, {
                ...state,
                isFetching: true,

            });
        case `${TYPE_RECRUITER_OPPORTUNITIES}_CATEGORY_FULFILLED`: {
            const { payload } = action;
            const selectedCategory = payload.category;
            const { data } = payload;
            let { item } = state;
            const stateContent = item && item[selectedCategory] && item[selectedCategory].content || [];
            if (item === null) { item = {}; }

            item[selectedCategory] = {
                ...data,
                content: [
                    ...stateContent,
                    ...data.content
                ]
            };
            return Object.assign({}, state, {
                item: { ...item },
                isFetching: false,
            });
        }
        case `${TYPE_RECRUITER_OPPORTUNITIES}_CATEGORY_REJECTED`:
            return Object.assign({}, state, {
                ...state,
                isFetching: false,
                isError: true

            });
        default:
            return state;
    }
}

export function opportunityAutoUpdateStatus(state = INITIALISING, action) {
    const settingActions = getActionStatus(TYPE_RECRUITER_UPDATE_OPPORTUNITY);
    const teamActions = getActionStatus(ACTIONS.OPPORTUNITY_TEAM_SETTINGS);
    const teamMemberActions = getActionStatus(ACTIONS.OPPORTUNITY_TEAM_MEMBER_SETTINGS);
    const opportunityChallenge = getActionStatus(ACTIONS.OPPORTUNITY_CHALLENGE_SETTINGS);
    const enableCv = getActionStatus(TYPE_RECRUITER_ENABLE_CV);
    const enablePhone = getActionStatus(TYPE_RECRUITER_ENABLE_PHONE);
    if ([settingActions.requestAction, teamActions.requestAction, teamMemberActions.requestAction, opportunityChallenge.requestAction, enableCv.requestAction, enablePhone.requestAction].includes(action.type)) {
        return SAVING;
    } else if ([settingActions.fulfilledAction, teamActions.fulfilledAction, teamMemberActions.fulfilledAction, opportunityChallenge.fulfilledAction, enableCv.fulfilledAction, enablePhone.fulfilledAction].includes(action.type)) {
        return SAVED;
    } else if ([settingActions.rejectedAction, teamActions.rejectedAction, teamMemberActions.rejectedAction, opportunityChallenge.rejectedAction, enableCv.rejectedAction, enablePhone.rejectedAction].includes(action.type)) {
        return ERROR_SAVING;
    } else if ([settingActions.resetAction, teamActions.resetAction, teamMemberActions.resetAction, opportunityChallenge.resetAction, enableCv.resetAction, enablePhone.resetAction].includes(action.type)) {
        return INITIALISING;
    } else {
        return state;
    }
}

module.exports = {
    recruiterCandidates,
    recruiterOpportunities,
    recruiterOpportunityCreate,
    recruiterOpportunityGet,
    recruiterOpportunityUpdate,
    recruiterUserNotes,
    recruiterOpportunityConfiguration,
    recruiterOpportunityConfigurationDetail,
    recruiterCandidatesNames,
    recruiterCompanyGet,
    opportunityProviders,
    opportunitySkillsByCategory,
    opportunityStats,
    challengeStats,
    recruiterTagCategories,
    recruiterTagSkillsById,
    recruiterTemplatesByCriteria,
    recruiterAllTagList,
    recruiterChallengeById,
    opportunityAutoUpdateStatus
};