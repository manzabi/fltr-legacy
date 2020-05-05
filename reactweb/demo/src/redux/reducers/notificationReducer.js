import {
    FETCH_NOTIFICATION_DETAIL_FULFILLED,
    FETCH_NOTIFICATION_DETAIL_REJECTED,
    FETCH_NOTIFICATION_DETAIL_REQUEST,
    FETCH_NOTIFICATION_DETAIL_FORCED,

    FETCH_NOTIFICATION_FULFILLED,
    FETCH_NOTIFICATION_REJECTED,
    FETCH_NOTIFICATION_REQUEST,

    FETCH_NOTIFICATION_READ_FULFILLED,
    FETCH_NOTIFICATION_READ_REJECTED,
    FETCH_NOTIFICATION_READ_REQUEST,

    FETCH_NOTIFICATION_READ_ALL_FULLFILLDED,

    FETCH_NOTIFICATION_READ_BY_ID_FULFILLED,
    FETCH_NOTIFICATION_READ_BY_ID_REJECTED,
    FETCH_NOTIFICATION_READ_BY_ID_REQUEST,
} from '../actions/actionTypes';

import {commonListReducer, commonReducer, initial} from './commonReducer';

function notificationList(state = initial, action) {
    if (action.type == FETCH_NOTIFICATION_READ_BY_ID_FULFILLED) {
        return {
            ...state,
            item: {...state.item,
                content: state.item.content.map(notification => notification.id === action.payload ?
                    // select the item with the specified id and change the value of read field
                    { ...notification, flagNew: false } :
                    // otherwise returns the original item with no changes
                    notification
                )
            }
        };
    } else if (action.type == FETCH_NOTIFICATION_READ_ALL_FULLFILLDED) {
        return {
            ...state,
            item: {...state.item,
                content: state.item.content.map( notification =>
                    ({ ...notification, flagNew: false })
                )
            }
        };
    }
    return commonListReducer(state, action, FETCH_NOTIFICATION_DETAIL_REQUEST, FETCH_NOTIFICATION_DETAIL_FULFILLED, FETCH_NOTIFICATION_DETAIL_REJECTED);
}

const initialNotifications = Object.assign({}, initial, {forceListCall : false});
function notifications(state = initialNotifications, action) {

    // I added this piece of code because I want to manage a change of value in notifications availables with an auto-triggered notification list reload
    if (action.type == FETCH_NOTIFICATION_FULFILLED){
        let oldCounter = -1;
        if (state.item && state.item.notificationCenter) {
            oldCounter = state.item.notificationCenter.count;
        }
        let newCounter = action.payload.notificationCenter.count;
        if (newCounter != oldCounter) {
            // console.log('old status is : ' + oldCounter + " new is : " + newCounter);
            state = Object.assign({}, state, {
                forceListCall: true
            });
        }
    } else if (action.type == FETCH_NOTIFICATION_DETAIL_FORCED) {
        // console.log('fetch notification detail forced');
        state = Object.assign({}, state, {
            forceListCall: false
        });
    } else if (action.type == FETCH_NOTIFICATION_READ_BY_ID_FULFILLED){
        // in this case I should scale the number of notifications
        let oldCounter = state.item.notificationCenter.count;
        if (oldCounter > 0) {
            state = Object.assign({}, state, {
                item: Object.assign({}, state.item, {
                    notificationCenter: Object.assign({}, state.item.notificationCenter,
                        { count : oldCounter - 1}
                    )
                })
            });
        }
    } else if (action.type == FETCH_NOTIFICATION_READ_ALL_FULLFILLDED) {
        state = Object.assign({}, state, {
            item: Object.assign({}, state.item, {
                notificationCenter: Object.assign({}, state.item.notificationCenter,
                    { count : 0}
                )
            })
        });
    }
    return commonReducer(state, action, FETCH_NOTIFICATION_REQUEST, FETCH_NOTIFICATION_FULFILLED, FETCH_NOTIFICATION_REJECTED);

}

function notificationRead(state = initial, action) {
    return commonReducer(state, action, FETCH_NOTIFICATION_READ_REQUEST, FETCH_NOTIFICATION_READ_FULFILLED, FETCH_NOTIFICATION_READ_REJECTED);
}

module.exports = {
    notificationList,
    notifications,
    notificationRead
};