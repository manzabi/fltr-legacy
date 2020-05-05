import {commonResetList, commonResponseNoContentWrapperWithReset, initial} from './commonReducer';
import {
    TYPE_RECRUITER_OPPORTUNITY_TEAM_HIRING,
    TYPE_RECRUITER_OPPORTUNITY_TEAM_EXPERT,
    TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_HIRING,
    TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_EXPERT
} from '../actions/recruiterTeamActions';

function recruiterOpportunityTeamHiring(state = initial, action) {
    return commonResetList(state, action, TYPE_RECRUITER_OPPORTUNITY_TEAM_HIRING);
}

function recruiterOpportunityTeamExpert(state = initial, action) {
    return commonResetList(state, action, TYPE_RECRUITER_OPPORTUNITY_TEAM_EXPERT);
}

function recruiterOpportunityTeamSuggestionHiring(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_HIRING);
}

function recruiterOpportunityTeamSuggestionExpert(state = initial, action) {
    return commonResponseNoContentWrapperWithReset(state, action, TYPE_RECRUITER_OPPORTUNITY_TEAM_SUGGESTIONS_EXPERT);
}


module.exports = {
    recruiterOpportunityTeamSuggestionHiring,
    recruiterOpportunityTeamSuggestionExpert,
    recruiterOpportunityTeamHiring,
    recruiterOpportunityTeamExpert
};