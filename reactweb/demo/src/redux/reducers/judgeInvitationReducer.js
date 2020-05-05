import {
    FETCH_JUDGE_INVITATION_SUMMARY_FULFILLED,
    FETCH_JUDGE_INVITATION_SUMMARY_REJECTED,
    FETCH_JUDGE_INVITATION_SUMMARY_REQUEST,
    PUT_JUDGE_INVITATION_FULFILLED,
    PUT_JUDGE_INVITATION_REJECTED,
    PUT_JUDGE_INVITATION_REQUEST
} from '../actions/actionTypes';

import {commonReducer, initial} from './commonReducer';

function judgeInvitationSummary(state = initial, action) {
    return commonReducer(state, action, FETCH_JUDGE_INVITATION_SUMMARY_REQUEST, FETCH_JUDGE_INVITATION_SUMMARY_FULFILLED, FETCH_JUDGE_INVITATION_SUMMARY_REJECTED);
}

function putJudgeInvitation(state = initial, action) {

    return commonReducer(state, action, PUT_JUDGE_INVITATION_REQUEST, PUT_JUDGE_INVITATION_FULFILLED, PUT_JUDGE_INVITATION_REJECTED);

}

module.exports = {
    judgeInvitationSummary,
    putJudgeInvitation
};




