import { combineReducers } from 'redux';

import * as userReducers from './userReducers';
import * as processReducers from './processReducers';
import * as opportunityReducers from './opportunityReducers';

const store = combineReducers({
    ...userReducers,
    ...processReducers,
    ...opportunityReducers
});

export default store;
