import {actions} from '../actions/killerActions';

import {initial, commonReducerReset, commonResetList, commonReducer, commonListReducer} from './commonReducer';

function killerQuestionsData (state = initial, action) {
    return commonReducerReset(state, action, `${actions.FETCH_KILLER_QUESTIONS}_REQUEST`, `${actions.FETCH_KILLER_QUESTIONS}_FULFILLED`, `${actions.FETCH_KILLER_QUESTIONS}_REJECTED`, `${actions.FETCH_KILLER_QUESTIONS}_RESET`);
}

module.exports = {
    killerQuestionsData
};