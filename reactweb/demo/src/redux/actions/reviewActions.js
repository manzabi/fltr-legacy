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

export const actions = {
    PLAYER_ANSWER: 'PLAYER_ANSWER',
    REVIEW_USER_GET: 'REVIEW_USER_GET'
};

const Config = require('Config');
const API_ENDPOINTS = require('../../common/api_endpoints');
const Global = require('../../common/global_constants');
import axios from 'axios';
import {getAction, resetListingAction} from './genericActions';
import {manageErrorMessage} from '../../common/utils';


export function fetchReviewUserList(id, onSuccess){
    return function (dispatch) {
        dispatch({type: REVIEW_USER_LIST_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.get_user_list_to_review.replace('{id}', id))

            .then((response) => {
                if (onSuccess) {
                    onSuccess(response);
                }
                dispatch({
                    type: REVIEW_USER_LIST_FULFILLED,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: REVIEW_USER_LIST_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}

export function fetchLeaderBoard(id){
    return function (dispatch) {
        dispatch({type: LEADERBOARD_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.get_leaderboard.replace('{id}', id))

            .then((response) => {

                dispatch({
                    type: LEADERBOARD_FULFILLED,
                    payload: response.data
                });
            })
            .catch((err) => {
                dispatch({
                    type: LEADERBOARD_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}

export function resetUserForReview(){
    return function(dispatch) {
        resetListingAction('REVIEW_USER_GET', dispatch);
    };
}

export function fetchUserForReview(id, userId, onSuccess){
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_user_to_review.replace('{id}', id).replace('{userId}', userId);
        getAction(actions.REVIEW_USER_GET, url, {}, dispatch, onSuccess);
    };
}

export function resetUserAnswer(){
    return function(dispatch) {
        resetListingAction(actions.PLAYER_ANSWER, dispatch);
    };
}

export function fetchUserAnswer(id, userId, onSuccess){
    return function (dispatch) {
        const url = Config.serverUrl + API_ENDPOINTS.get_user_answer.replace('{id}', id).replace('{userId}', userId);
        getAction(actions.PLAYER_ANSWER, url, {}, dispatch, onSuccess);
    };
}

export function resetGetOpportunity(onSuccess){
    return function(dispatch) {
        resetListingAction('REVIEW_OPPORTUNITY_GET', dispatch, onSuccess);
    };
}

export function getOpportunity(id, onSuccess){
    return function (dispatch) {
        dispatch({type: REVIEW_OPPORTUNITY_GET_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.opportunity_by_id.replace('{id}', id))

            .then((response) => {

                dispatch({
                    type: REVIEW_OPPORTUNITY_GET_FULFILLED,
                    payload: response.data
                });

                if(onSuccess){
                    onSuccess(response.data);
                }
            })
            .catch((err) => {
                dispatch({
                    type: REVIEW_OPPORTUNITY_GET_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}

export function postReview(id, userId, request, onSuccess, isEdit) {


    return function (dispatch) {
        dispatch({type: REVIEW_USER_POST_REQUEST});
        setTimeout(function () {
            const url = Config.serverUrl + API_ENDPOINTS.post_user_to_review.replace('{id}', id).replace('{userId}', userId);
            const method = isEdit ? 'PUT' : 'POST';
            // console.log(url, method, isEdit, request)
            axios({
                method: method,
                url: url,
                data: request,
                withCredentials: true
            })
                .then(function (response) {

                    dispatch({
                        type: REVIEW_USER_POST_FULFILLED,
                        payload: response.data

                    });

                    /*
                    Messenger().post({
                        id: 'review-ok',
                        type: 'info',
                        singleton: false,
                        message: 'Evaluation correctly submitted',
                        showCloseButton: true,
                        hideAfter: Global.MESSAGE_INFO_DURATION
                    });
                    */

                    if(onSuccess){
                        onSuccess();
                    }

                })
                .catch(function (err) {

                    dispatch({
                        type: REVIEW_USER_POST_REJECTED,
                        payload: err,
                        silent: true
                    });

                    let message = 'Error submitting evaluation';
                    if (err.response && err.response.data && err.response.data.message) {
                        message = err.response.data.message;
                    }

                    manageErrorMessage('review-error', message);
                });

        }, 0);

    };

}
