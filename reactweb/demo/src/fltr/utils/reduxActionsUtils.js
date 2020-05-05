export function getActionStatus (action) {
    const actionStatus = {
        requestAction: `${action}_REQUEST`,
        fulfilledAction: `${action}_FULFILLED`,
        rejectedAction: `${action}_REJECTED`,
        resetAction: `${action}_RESET`,
    };
    return actionStatus;
}