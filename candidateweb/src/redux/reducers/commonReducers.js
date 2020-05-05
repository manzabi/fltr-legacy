
export const initial = {isFetching: false, isError: false};

export function commonReducer (state = initial, action, actionType) {
    const requestAction = `${actionType}_request`;
    const fulFilledAction = `${actionType}_fulfilled`;
    const rejectedAction = `${actionType}_reject`;
    const resetAction = `${actionType}_reset`;
    switch (action.type) {
    case requestAction: {
        return Object.assign({}, state, {
            isFetching: true,
            isError: false
        });
    }
    case fulFilledAction: {
        if (action.onSuccess) {
            action.onSuccess(action.payload);
        }

        return Object.assign({}, state, {
            isFetching: false,
            isError: false,
            item: action.payload
        });
    }
    case rejectedAction:

        if (action.onError) {
            action.onError(action.payload);
        }

        // if (action.silent === undefined || !action.silent) {
        //     let message = action.payload;
        //     manageErrorMessage('reducer-error', message);
        // }

        return Object.assign({}, state, {
            isFetching: false,
            isError: true,
            err: action.payload
        });
    case resetAction:
        return Object.assign({}, state, {
            isFetching: true,
            isError: false,
            item: undefined
        });
    default:
        return state;
    }
}

export function comonListReducer (state = initial, action, type) {
    const requestAction = type + '_REQUEST';
    const fullfilledAction = type + '_FULFILLED';
    const rejectedAction = type + '_REJECTED';
    const resetAction = type + '_RESET';
    switch (action.type) {
    case resetAction: {
        return Object.assign({}, state, {
            isFetching: true,
            isError: false,
            item: null
        });
    }
    case requestAction: {
        return Object.assign({}, state, {
            isFetching: true,
            isError: false
        });
    }
    case fullfilledAction: {
        if (action.onSuccess) {
            action.onSuccess(action.payload);
        }

        if (action.payload.first) {
            // first page, replace item with first page result
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: action.payload,
                date: new Date()
            });
        } else {
            // other pages, concat elements
            return Object.assign({}, state, {
                isFetching: false,
                isError: false,
                item: (
                    Object.assign({},
                        action.payload,
                        {content: (!state.item) ? action.payload.content : state.item.content.concat(action.payload.content)})
                )

            });
        }
    }
    case rejectedAction:

        if (action.onError) {
            action.onError(action.payload);
        }

        // let message = action.payload;
        // manageErrorMessage('reducer-error', message);

        return Object.assign({}, state, {
            isFetching: false,
            isError: true,
            err: action.payload
        });
    default:
        return state;
    }
}
