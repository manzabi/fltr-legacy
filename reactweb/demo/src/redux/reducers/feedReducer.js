import {
    FEED_REPLY_LIST_FULFILLED,
    FEED_REPLY_LIST_REJECTED,
    FEED_REPLY_LIST_REQUEST,

    FEED_REPLY_POST_FULFILLED,
    FEED_REPLY_POST_REJECTED,
    FEED_REPLY_POST_REQUEST,

} from '../actions/actionTypes';

import {commonReducer, commonListReducer, initial} from './commonReducer';

function feedReply(state = initial, action) {
    return commonListReducer(state, action, FEED_REPLY_LIST_REQUEST, FEED_REPLY_LIST_FULFILLED, FEED_REPLY_LIST_REJECTED);
}

function postReply(state = initial, action) {
    return commonReducer(state, action, FEED_REPLY_POST_REQUEST, FEED_REPLY_POST_FULFILLED, FEED_REPLY_POST_REJECTED);
}

module.exports = {
    feedReply,
    postReply
};