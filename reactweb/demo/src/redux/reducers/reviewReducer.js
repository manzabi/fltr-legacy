import {
    REVIEW_USER_LIST_FULFILLED,
    REVIEW_USER_LIST_REJECTED,
    REVIEW_USER_LIST_REQUEST,

    REVIEW_USER_GET_FULFILLED,
    REVIEW_USER_GET_REJECTED,
    REVIEW_USER_GET_REQUEST,

    REVIEW_USER_POST_FULFILLED,
    REVIEW_USER_POST_REJECTED,
    REVIEW_USER_POST_REQUEST,

    REVIEW_OPPORTUNITY_GET_FULFILLED,
    REVIEW_OPPORTUNITY_GET_REJECTED,
    REVIEW_OPPORTUNITY_GET_REQUEST,

    LEADERBOARD_FULFILLED,
    LEADERBOARD_REJECTED,
    LEADERBOARD_REQUEST,

    PLAYER_ANSWER_FULFILLED,
    PLAYER_ANSWER_REJECTED,
    PLAYER_ANSWER_REQUEST
} from '../actions/actionTypes';

import {commonReducer, commonReducerReset, initial} from './commonReducer';

function reviewUserList(state = initial, action) {
    return commonReducer(state, action, REVIEW_USER_LIST_REQUEST, REVIEW_USER_LIST_FULFILLED, REVIEW_USER_LIST_REJECTED);
}

function reviewUser(state = initial, action) {
    return commonReducerReset(state, action, REVIEW_USER_GET_REQUEST, REVIEW_USER_GET_FULFILLED, REVIEW_USER_GET_REJECTED, 'REVIEW_USER_GET_RESET');
}

function reviewOpportunity(state = initial, action) {
    return commonReducer(state, action, REVIEW_OPPORTUNITY_GET_REQUEST, REVIEW_OPPORTUNITY_GET_FULFILLED, REVIEW_OPPORTUNITY_GET_REJECTED);
}

function postReviewUser(state = initial, action) {
    return commonReducer(state, action, REVIEW_USER_POST_REQUEST, REVIEW_USER_POST_FULFILLED, REVIEW_USER_POST_REJECTED);
}

function reviewLeaderboard(state = initial, action) {
    return commonReducer(state, action, LEADERBOARD_REQUEST, LEADERBOARD_FULFILLED, LEADERBOARD_REJECTED);
}

function playerAnswer(state = initial, action) {
    return commonReducerReset(state, action, PLAYER_ANSWER_REQUEST, PLAYER_ANSWER_FULFILLED, PLAYER_ANSWER_REJECTED, 'PLAYER_ANSWER_RESET');
}


module.exports = {
    reviewUserList,
    reviewLeaderboard,
    reviewUser,
    postReviewUser,
    reviewOpportunity,
    playerAnswer
};