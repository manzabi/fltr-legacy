import { initial, commonReducer } from './commonReducers';
import { ACTIONS } from '../actions/processActions';


export function process (state = initial, action) {
    return commonReducer(state, action, ACTIONS.FETCH_PROCESS_DATA);
}