import ReactGA from 'react-ga';

export const BOARDING_COMPANY_CREATION_START = { category: 'boarding', action: 'company_creation_start' };
export const BOARDING_COMPANY_CREATION_END = { category: 'boarding', action: 'company_creation_end' };
export const BOARDING_COMPANY_CREATION_ERROR = { category: 'boarding', action: 'company_creation_error' };
export const BOARDING_FLOW_START = { category: 'boarding', action: 'flow_start' };
export const BOARDING_FLOW_END = { category: 'boarding', action: 'flow_end' };
export const TOUR_FLOW_START = { category: 'tour', action: 'flow_start' };
export const TOUR_FLOW_END = { category: 'tour', action: 'flow_end' };
export const BOARDING_FLOW_SKIP_MOBILE = { category: 'boarding', action: 'flow_skip_mobile' };
export const BOARDING_PERSONAL_INFO_START = { category: 'boarding', action: 'personal_info_start' };
export const BOARDING_PERSONAL_INFO_ERROR = { category: 'boarding', action: 'personal_info_error' };
export const BOARDING_PERSONAL_INFO_FIELD = { category: 'boarding', action: 'personal_info_field' };
export const BOARDING_PERSONAL_INFO_END = { category: 'boarding', action: 'personal_info_end' };
export const BOARDING_JOB_CREATION_START = { category: 'boarding', action: 'job_creation_start' };
export const BOARDING_JOB_CREATION_END = { category: 'boarding', action: 'job_creation_end' };
export const BOARDING_JOB_CREATION_ERROR = { category: 'boarding', action: 'job_creation_error' };
export const BOARDING_CHALLENGE_CREATION_START = { category: 'boarding', action: 'challenge_creation_start' };
export const BOARDING_CHALLENGE_CREATION_ERROR = { category: 'boarding', action: 'challenge_creation_error' };
export const BOARDING_CHALLENGE_CREATION_END = { category: 'boarding', action: 'challenge_creation_end' };
export const PROFILE_CREATION_LANDING = { category: 'boarding', action: 'profile_creation_landing' };
export const COMPANY_DETAILS_LANDING = { category: 'boarding', action: 'company_details_landing' };

export const OPPORTUNITY_JOB_CREATION_START = { category: 'opportunity', action: 'job_creation_start' };
export const OPPORTUNITY_JOB_CREATION_END = { category: 'opportunity', action: 'job_creation_end' };
export const OPPORTUNITY_JOB_CREATION_ERROR = { category: 'opportunity', action: 'job_creation_error' };
export const OPPORTUNITY_JOB_CONFIGURATION_TAGS_START = { category: 'opportunity', action: 'job_configuration_tags_start' };
export const OPPORTUNITY_JOB_CONFIGURATION_TAGS_END = { category: 'opportunity', action: 'job_configuration_tags_end' };
export const OPPORTUNITY_CHALLENGE_CREATION_START = { category: 'opportunity', action: 'challenge_creation_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_START = { category: 'opportunity', action: 'challenge_configuration_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_START_ERROR = { category: 'opportunity', action: 'challenge_configuration_start_error' };
export const OPPORTUNITY_CHALLENGE_CREATION_START_NO_SLOT = { category: 'opportunity', action: 'challenge_creation_start_no_slot' };
export const OPPORTUNITY_CHALLENGE_CREATION_END = { category: 'opportunity', action: 'challenge_creation_end' };
export const OPPORTUNITY_CHALLENGE_LIVE_PAGE = { category: 'opportunity', action: 'challenge_live_page' };
export const OPPORTUNITY_CHALLENGE_INVITE_EXPERTS_START = { category: 'opportunity', action: 'challenge_invite_experts_start' };
export const OPPORTUNITY_CHALLENGE_INVITE_EXPERTS_END = { category: 'opportunity', action: 'challenge_invite_experts_end' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_EXPERT_START = { category: 'opportunity', action: 'challenge_configuration_expert_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_EXPERT_WIZARD_START = { category: 'opportunity', action: 'challenge_configuration_expert_wizard_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_EXPERT_END = { category: 'opportunity', action: 'challenge_configuration_expert_end' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_SELECT_OWN = { category: 'opportunity', action: 'challenge_configuration_select_own' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_SELECT_WIZARD = { category: 'opportunity', action: 'challenge_configuration_select_wizard' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_SELECT_EXPERT = { category: 'opportunity', action: 'challenge_configuration_select_expert' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_OWNER_START = { category: 'opportunity', action: 'challenge_configuration_owner_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_OWNER_WIZARD_START = { category: 'opportunity', action: 'challenge_configuration_owner_wizard_start' };
export const OPPORTUNITY_CHALLENGE_CONFIGURATION_OWNER_END = { category: 'opportunity', action: 'challenge_configuration_owner_end' };
export const OPPORTUNITY_CHALLENGE_TEST_CONFIRM = { category: 'opportunity', action: 'challenge_test_confirm' };
export const OPPORTUNITY_CHALLENGE_LINK_SHARE_FACEBOOK = { category: 'opportunity', action: 'challenge_link_share_facebook' };
export const OPPORTUNITY_CHALLENGE_LINK_SHARE_TWITTER = { category: 'opportunity', action: 'challenge_link_share_twitter' };
export const OPPORTUNITY_CHALLENGE_LINK_SHARE_LINKEDIN = { category: 'opportunity', action: 'challenge_link_share_linkedin' };
export const OPPORTUNITY_JOB_LINK = { category: 'opportunity', action: 'job_link_share' };
// COMPANY CREATION DEBUG
export const COMPANY_USER_STARTS_FULFILL_FIELD_COMPANY = { category: 'company', action: 'user_starts_fulfill_field_company' };
export const COMPANY_USER_STARTS_FULFILL_FIELD_COMPANYDESCRIPTION = { category: 'company', action: 'user_starts_fulfill_field_companydescription' };
export const COMPANY_USER_STARTS_FULFILL_FIELD_COMPANYWEBSITE = { category: 'company', action: 'user_starts_fulfill_field_companywebsite' };
export const COMPANY_LOGO_CHANGED = { category: 'company', action: 'logo_changed' };
export const COMPANY_SUBMIT_WITH_ERRORS = { category: 'company', action: 'submit_with_errors' };
// COMPANY CREATION DEBUG END

export const ASSESS_CV_START = { category: 'assess', action: 'cv_start' };
export const ASSESS_CV_END = { category: 'assess', action: 'cv_end' };
export const UPDATE_CV_STARS_START = { category: 'assess', action: 'update_cv_stars_start' };
export const UPDATE_CV_NOTE_START = { category: 'assess', action: 'update_cv_note_start' };
export const UPDATE_CV_END = { category: 'assess', action: 'update_cv_end' };

export const track = action => {
    ReactGA.event({
        category: action.category,
        action: `${action.category}_${action.action}`
    });
};

export const trackField = (action, field) => {
    ReactGA.event({
        category: action.category,
        action: `${action.category}_${action.action}_${field}`
    });
};

export const trackBoarding = (action) => {
    const { step, category, direct } = action;
    const event = {
        category: category,
        action: `${category}_${direct ? 'direct_' : ''}step_${step}`
    };
    // console.log('event:', event)
    ReactGA.event(event);
};

export const skipBoarding = (action) => {
    const { step, category } = action;
    const event = {
        category: category,
        action: `${category}_skip${step ? '_at_step_' + step : ''}`
    };
    ReactGA.event(event);
};
