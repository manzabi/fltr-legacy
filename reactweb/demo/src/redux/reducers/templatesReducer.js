import { actions } from '../actions/templateActions';

import { initial, commonReducerReset, commonResetList, commonReducer, commonListReducer } from './commonReducer';
import { manageErrorMessage } from '../../common/utils';

function userTemplates(state = initial, action) {
    return commonResetList(state, action, actions.FETCH_USER_TEMPLATES);
}

function templateData(state = initial, action) {
    return commonReducerReset(state, action, `${actions.FETCH_TEMPLATE}_REQUEST`, `${actions.FETCH_TEMPLATE}_FULFILLED`, `${actions.FETCH_TEMPLATE}_REJECTED`, `${actions.FETCH_TEMPLATE}_RESET`);
}

export function opportunityTemplates(state = initial, action) {
    const type = actions.FETCH_OPPORTUNITY_TEMPLATES;
    let requestAction = type + '_REQUEST';
    let fulFilledAction = type + '_FULFILLED';
    let rejectedAction = type + '_REJECTED';
    let resetAction = type + '_RESET';
    let updateAction = type + '_UPDATE';

    switch (action.type) {
        case resetAction: {
            return {
                isFetching: true,
                isError: false,
                item: null
            };
        }
        case requestAction: {
            return {
                ...state,
                isFetching: true,
                isError: false
            };
        }
        case fulFilledAction: {
            if (action.onSuccess) {
                action.onSuccess(action.payload);
            }
            const content = state.item ? state.item.content : [];
            return {
                isFetching: false,
                isError: false,
                item: {
                    ...state.item,
                    ...action.payload,
                    content: [...content, ...action.payload.content]
                },
                date: new Date()
            };
        }
        case rejectedAction:

            if (action.onError) {
                action.onError(action.payload);
            }

            manageErrorMessage('template-error', action.payload);

            return {
                isFetching: false,
                isError: true,
                err: action.payload
            };

        case updateAction: {
            let returnedState = { ...state };
            const { id } = action.payload;
            let returnedStateControlled = returnedState.item && returnedState.item.content || [];
            const updatedState = returnedStateControlled.map((template) => {
                if (template.template.id === id) {
                    return {
                        ...template,
                        template: action.payload
                    };
                } else return template;
            });
            returnedStateControlled = updatedState;
            return returnedStateControlled;
        }
        default:
            return state;
    }
}

function opportunityChallenge(state = initial, action) {
    return commonReducerReset(state, action, `${actions.FETCH_OPPORTUNITY_CHALLENGE}_REQUEST`, `${actions.FETCH_OPPORTUNITY_CHALLENGE}_FULFILLED`, `${actions.FETCH_OPPORTUNITY_CHALLENGE}_REJECTED`, `${actions.FETCH_OPPORTUNITY_CHALLENGE}_RESET`);
}

function opportunityChallengesOld(state = initial, action) {
    const requestAction = `${actions.FETCH_OPPORTUNITY_CHALLENGES_OLD}_REQUEST`,
        fulfilledAction = `${actions.FETCH_OPPORTUNITY_CHALLENGES_OLD}_FULFILLED`,
        rejectedAction = `${actions.FETCH_OPPORTUNITY_CHALLENGES_OLD}_REJECTED`,
        resetAction = `${actions.FETCH_OPPORTUNITY_CHALLENGES_OLD}_RESET`;
    return commonReducerReset(state, action, requestAction, fulfilledAction, rejectedAction, resetAction);
}

function opportunitySlots(state = initial, action) {
    return commonReducer(state, action, `${actions.OPPORTUNITY_TEMPLATE_SLOTS}_REQUEST`, `${actions.OPPORTUNITY_TEMPLATE_SLOTS}_FULFILLED`, `${actions.OPPORTUNITY_TEMPLATE_SLOTS}_REJECTED`);
}

function challengeTemplateData(state = initial, action) {
    return commonReducerReset(state, action, `${actions.FETCH_CHALLENGE_TEMPLATE}_REQUEST`, `${actions.FETCH_CHALLENGE_TEMPLATE}_FULFILLED`, `${actions.FETCH_CHALLENGE_TEMPLATE}_REJECTED`, `${actions.FETCH_CHALLENGE_TEMPLATE}_RESET`);
}

// CUSTOM REDUCERS

function templateDraft(state = null, action) {
    const baseType = 'TEMPLATE_DRAFT';
    switch (action.type) {
        case `${baseType}_RESET`:
            return null;
        case `${baseType}_SAVE`:
            return { ...action.payload };
        default:
            return state;
    }
}

module.exports = {
    userTemplates,
    templateData,
    opportunityTemplates,
    opportunityChallenge,
    opportunityChallengesOld,
    opportunitySlots,
    challengeTemplateData,
    templateDraft
};