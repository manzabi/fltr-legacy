import { initial, commonReducer } from './commonReducers';
import { ACTIONS } from '../actions/userActions';


export function user (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_USER_DATA);
}