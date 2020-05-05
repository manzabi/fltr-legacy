import {
    FETCH_JUDGE_INVITATION_SUMMARY_FULFILLED,
    FETCH_JUDGE_INVITATION_SUMMARY_REJECTED,
    FETCH_JUDGE_INVITATION_SUMMARY_REQUEST,
    PUT_JUDGE_INVITATION_FULFILLED,
    PUT_JUDGE_INVITATION_REJECTED,
    PUT_JUDGE_INVITATION_REQUEST,
    FORM_SUBMISSION_STARTED,
    FORM_SUBMISSION_FINISHED
} from '../actions/actionTypes';


import axios from 'axios';
import {manageErrorMessage, manageSuccess} from '../../common/utils';

var Config = require('Config');

var API_ENDPOINTS = require('../../common/api_endpoints');

export function fetchJudgeInvitationSummary(){
    return function (dispatch) {
        dispatch({type: FETCH_JUDGE_INVITATION_SUMMARY_REQUEST});
        setTimeout(function()
        {

            axios.get(Config.serverUrl + API_ENDPOINTS.judge_invitation_summary, {
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: FETCH_JUDGE_INVITATION_SUMMARY_FULFILLED,
                        payload: response.data

                    });
                })
                .catch(function (err) {
                    dispatch({
                        type: FETCH_JUDGE_INVITATION_SUMMARY_REJECTED,
                        payload: err
                    });
                });

        }, 0);

    };
}

export function putJudgeInvitation(request){
    return function (dispatch) {
        dispatch({type: PUT_JUDGE_INVITATION_REQUEST});
        dispatch({type: FORM_SUBMISSION_STARTED});

        setTimeout(function()
        {

            //var trimmedIBAN = bankInfoData['iban'].replace(/\s+/g, '');
            //save bank account info
            axios.put(Config.serverUrl + API_ENDPOINTS.judge_invitation_invite,
                {
                    judgesInvitationItem: request
                }, {

                    withCredentials: true
                })
                .then(function (response) {

                    dispatch({
                        type: PUT_JUDGE_INVITATION_FULFILLED,
                        payload: response.data

                    });

                    manageSuccess('expert-invite', 'Invitation sent!');

                    dispatch({
                        type: FETCH_JUDGE_INVITATION_SUMMARY_FULFILLED,
                        payload: response.data

                    });

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });
                })
                .catch(function (err) {

                    let message = 'Error in judge invitation';
                    if (err.response.data.message) {
                        message = err.response.data.message;
                    }

                    dispatch({
                        type: PUT_JUDGE_INVITATION_REJECTED,
                        payload: err
                    });

                    dispatch({
                        type: FORM_SUBMISSION_FINISHED,
                        payload: false
                    });

                    manageErrorMessage('expert-invitation-error', message);
                });

        }, 0);

    };
}
