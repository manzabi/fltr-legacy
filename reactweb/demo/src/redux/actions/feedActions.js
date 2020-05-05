import {
    FEED_REPLY_LIST_FULFILLED,
    FEED_REPLY_LIST_REJECTED,
    FEED_REPLY_LIST_REQUEST,

    FEED_REPLY_POST_FULFILLED,
    FEED_REPLY_POST_REJECTED,
    FEED_REPLY_POST_REQUEST

} from '../actions/actionTypes';
import axios from 'axios';

import {manageError, manageSuccess} from '../../common/utils';
import {resetListingAction} from './genericActions';
var Config = require('Config');
var API_ENDPOINTS = require('../../common/api_endpoints');
var Global = require('../../common/global_constants');

const ITEM_SIZE = 10;

export function fetchReplyList (id, page = 0, options={size: ITEM_SIZE}, onSuccess) {
    return function (dispatch) {
        dispatch({type: FEED_REPLY_LIST_REQUEST});

        axios.get(Config.serverUrl + API_ENDPOINTS.news_feed_reply.replace('{id}', id), {
            withCredentials: true,
            params: {
                page: page,
                ...options
            }
        })
            .then((response) => {
                dispatch({
                    type: FEED_REPLY_LIST_FULFILLED,
                    payload: response.data
                });
                if (onSuccess) {
                    onSuccess(response);
                }
            })
            .catch((err) => {
                dispatch({
                    type: FEED_REPLY_LIST_REJECTED,
                    payload: err,
                    silent: true
                });
            });
    };
}

export function resetReplyList (onSuccess) {
    return function (dispatch) {
        resetListingAction('FEED_REPLY_LIST_RESET', dispatch, onSuccess);
    };
}

export function postReply (id, request, onSuccess, onError) {
    return function (dispatch) {
        dispatch({type: FEED_REPLY_POST_REQUEST});
        setTimeout(function () {
            axios.post(Config.serverUrl + API_ENDPOINTS.news_feed_reply.replace('{id}', id),
                request,
                {

                    withCredentials: true
                })
                .then(function (response) {
                    dispatch({
                        type: FEED_REPLY_POST_FULFILLED,
                        payload: response.data

                    });
                    manageSuccess('feed-reply-ok', 'Comment posted');

                    if (onSuccess) {
                        onSuccess(response);
                    }
                })
                .catch(function (err) {
                    if (onError) {
                        onError(err);
                    }
                    dispatch({
                        type: FEED_REPLY_POST_REJECTED,
                        payload: err,
                        silent: true
                    });

                    let message = 'Error sending reply';
                    if (err.response.data.message) {
                        message = err.response.data.message;
                    }
                    manageError('feed-reply-ok', message);
                });
        }, 0);
    };
}
