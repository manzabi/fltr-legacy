import navigation from './navigationReducer';
import user from './userReducer';
import userStatus from './userReducer';
import bankInfo from './bankInfoReducer';
import sepaCountryList from './bankInfoReducer';
import validateBankInfo from './bankInfoReducer';
import saveBankInfo from './bankInfoReducer';
import deleteBankInfo from './bankInfoReducer';
import notificationList from './notificationReducer';
import opportunityList from './opportunityReducer';
import opportunitySummary from './opportunityReducer';
import dashboard from './dashboardReducer';
import judgeInvitationSummary from './judgeInvitationReducer';
import putJudgeInvitation from './judgeInvitationReducer';
import triggerValidationError from './formReducer';
import formSubmissionFinished from './formReducer';

import recruiterCandidates from './recruiterOpportunityReducer';
import recruiterCandidatesNames from './recruiterOpportunityReducer';
import recruiterOpportunities from './recruiterOpportunityReducer';
import recruiterOpportunityCreate from './recruiterOpportunityReducer';
import recruiterOpportunityGet from './recruiterOpportunityReducer';
import recruiterOpportunityUpdate from './recruiterOpportunityReducer';
import recruiterUserNotes from './recruiterOpportunityReducer';
import opportunitiesCompleteTagList from './opportunityReducer';
import recruiterCompanyGet from './recruiterOpportunityReducer';
import opportunityProviders from './recruiterOpportunityReducer';
import opportunitySkillsByCategory from './recruiterOpportunityReducer';

import recruiterOpportunityTeamHiring from './recruiterTeamReducer';
import recruiterOpportunityTeamExpert from './recruiterTeamReducer';
import recruiterOpportunityTeamSuggestionHiring from './recruiterTeamReducer';
import recruiterOpportunityTeamSuggestionExpert from './recruiterTeamReducer';

import opportunityStats from './opportunityReducer';
import challengeStats from './opportunityReducer';

import recruiterOpportunityCurrentTagList from './opportunityReducer';
import opportunitiesConfiguration from './opportunityReducer';

import opportunityConfiguration from './opportunityReducer';

import saveOpportunityTags from './opportunityReducer';

import saveOpportunityExpertConfiguration from './opportunityReducer';

import saveOpportunityChallengeConfiguration from './opportunityReducer';

import expertPendingOpportunities from './opportunityReducer';

import createOpportunityChallenge from './opportunityReducer';

import fetchOpportunityChallenge from './opportunityReducer';

import acceptPendingOpportunity from './opportunityReducer';

import declinePendingOpportunity from './opportunityReducer';

import uploadImage from './uploadReducer';

import uploadFile from './uploadReducer';

import deleteImage from './uploadReducer';

import deleteFile from './uploadReducer';

import expertListForOpportunity from './expertListReducer';
import reviewUserList from './reviewReducer';
import feedReply from './feedReducer';

import processUserList from './trelloReducer';

import userTemplates from './templatesReducer';
import templateData from './templatesReducer';
import opportunityTemplates from './templatesReducer';
import opportunityChallenge from './templatesReducer';
import opportunityChallengesOld from './templatesReducer';
import opportunitySlots from './templatesReducer';
import challengeTemplateData from './templatesReducer';
import templateDraft from './templatesReducer';

import userSidebar from './sidebarReducer';

import recruiterChallengeById from './recruiterOpportunityReducer';
import killerQuestionsData from './killerQuestionsEditReducer';
import slackButton from './opportunityReducer';
import slackBindings from './opportunityReducer';
import opportunityAutoUpdateStatus from './recruiterOpportunityReducer';

// UI REDUCERS
import limitBannerStatus from './uiReducers';
import mainScrollStatus from './uiReducers';
import headerTitle from './uiReducers';

// TODO: NEW REDUCERS IMPORT EXPORT STANDARD SHOULD BE IMPLEMENTED
module.exports = {
    ...navigation,
    ...user,
    ...userStatus,
    ...bankInfo,
    ...sepaCountryList,
    ...validateBankInfo,
    ...saveBankInfo,
    ...deleteBankInfo,
    ...notificationList,
    ...dashboard,
    ...judgeInvitationSummary,
    ...putJudgeInvitation,
    ...triggerValidationError,
    ...formSubmissionFinished,
    ...opportunityList,
    ...opportunitySummary,
    ...opportunitiesCompleteTagList,
    ...opportunitiesConfiguration,
    ...opportunityConfiguration,
    ...opportunityProviders,
    ...opportunitySkillsByCategory,
    ...opportunityStats,
    ...opportunityTemplates,
    ...opportunityChallenge,
    ...opportunityChallengesOld,
    ...opportunitySlots,
    ...saveOpportunityTags,
    ...uploadImage,
    ...uploadFile,
    ...deleteImage,
    ...deleteFile,
    ...saveOpportunityExpertConfiguration,
    ...createOpportunityChallenge,
    ...saveOpportunityChallengeConfiguration,
    ...expertPendingOpportunities,
    ...acceptPendingOpportunity,
    ...declinePendingOpportunity,
    ...fetchOpportunityChallenge,
    ...expertListForOpportunity,
    ...reviewUserList,
    ...feedReply,
    ...processUserList,
    ...recruiterOpportunityCurrentTagList,
    ...recruiterCandidates,
    ...recruiterOpportunities,
    ...recruiterOpportunityCreate,
    ...recruiterOpportunityGet,
    ...recruiterOpportunityUpdate,
    ...recruiterUserNotes,
    ...recruiterCandidatesNames,
    ...recruiterOpportunityTeamHiring,
    ...recruiterOpportunityTeamExpert,
    ...recruiterOpportunityTeamSuggestionHiring,
    ...recruiterOpportunityTeamSuggestionExpert,
    ...recruiterCompanyGet,
    ...userTemplates,
    ...templateData,
    ...killerQuestionsData,
    ...userSidebar,
    ...challengeTemplateData,
    ...limitBannerStatus,
    ...mainScrollStatus,
    ...challengeStats,
    ...templateDraft,
    ...headerTitle,
    ...recruiterChallengeById,
    ...slackButton,
    ...slackBindings,
    ...opportunityAutoUpdateStatus
};
