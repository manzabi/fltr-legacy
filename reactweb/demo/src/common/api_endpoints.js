const API_BASEPATH = '/bizAroundRest/web';
const API_OPEN_BASEPATH = '/bizAroundRest/open';

module.exports = {

    user_info: API_BASEPATH + '/user',
    recruiter_info: API_BASEPATH + '/recruiter',
    recruiter_complete_boarding: API_BASEPATH + '/recruiter/boarding',
    expert_info: API_BASEPATH + '/expert',

    company_create: API_BASEPATH + '/company',
    company_get: `${API_BASEPATH}/company/{id}`,
    company_update: `${API_BASEPATH}/company/{id}`,

    opportunity_create: API_BASEPATH + '/opportunity',
    opportunity_update: API_BASEPATH + '/opportunity/{id}',

    opportunity_by_id: API_BASEPATH + '/opportunity/{id}',
    killer_questions_opportunity: API_BASEPATH + '/opportunity/{id}/killerquestion',
    opportunity_search: API_BASEPATH + '/opportunity/search',

    opportunity_summary: API_BASEPATH + '/user/summary',

    opportunity_team: API_BASEPATH + '/opportunity/{id}/team/role/{roleId}',
    opportunity_team_suggestion: API_BASEPATH + '/opportunity/{id}/team/role/{roleId}/suggestions',
    opportunity_team_add_member: API_BASEPATH + '/opportunity/{id}/team',
    opportunity_team_remove_member: API_BASEPATH + '/opportunity/{id}/team/{teamUserId}/role/{roleId}',

    opportunity_match_old: API_BASEPATH + '/opportunity/{id}/match',
    opportunity_match_attitude: API_BASEPATH + '/opportunity/{id}/user/{userToReview}/attitude',
    opportunity_match_experience: API_BASEPATH + '/opportunity/{id}/user/{userId}/experience',
    opportunity_match_challenge: API_BASEPATH + '/opportunity/{id}/user/{userToReview}/challenge',
    opportunity_match_overview :API_BASEPATH + '/opportunity/{id}/user/{userToReview}/overview/activity',
    opportunity_match: API_BASEPATH + '/opportunity/{id}/match/optimized',
    opportunity_match_user_list: API_BASEPATH + '/opportunity/{id}/match/list',
    opportunity_match_bookmark: API_BASEPATH + '/opportunity/{id}/match/{playerId}/bookmark',
    opportunity_match_discard: API_BASEPATH + '/opportunity/{id}/match/{playerId}/discard',
    opportunity_match_challenge_invite: API_BASEPATH + '/opportunity/{id}/match/{playerId}/challenge/invite',
    opportunity_match_extend: API_BASEPATH + '/opportunity/{id}/match/{playerId}/expireDate',
    opportunity_review_cv_create: API_BASEPATH + '/opportunity/{id}/user/{playerId}/review/cv',
    opportunity_review_cv_update: API_BASEPATH + '/opportunity/{id}/user/{playerId}/review/cv',
    opportunity_note_create: API_BASEPATH + '/opportunity/{id}/user/{playerId}/note',
    opportunity_note_update: API_BASEPATH + '/opportunity/note/{id}',
    opportunity_note_delete: API_BASEPATH + '/opportunity/note/{id}',
    opportunity_user_notes: API_BASEPATH + '/opportunity/{id}/user/{playerId}/note',
    opportunity_extend: API_BASEPATH + '/opportunity/{id}/timeline/extend',
    opportunity_close: API_BASEPATH + '/opportunity/{id}/close',
    opportunity_hire: API_BASEPATH + '/opportunity/{id}/hired',
    notifications: API_BASEPATH + '/user/updates',
    notifications_list: API_BASEPATH + '/user/updates/detail',
    notifications_mark_all_read: API_BASEPATH + '/user/updates/detail/read',
    notifications_read_by_id: API_BASEPATH + '/user/updates/detail/{id}/read',

    bank_info_sepa_countries: API_BASEPATH + '/bankAccount/sepaCountries',
    bank_info: API_BASEPATH + '/user/bankAccount',
    bank_info_validate: API_BASEPATH + '/bankAccount/validate',

    judge_invitation_summary: API_BASEPATH + '/user/judgeInvitation/summary',
    judge_invitation_invite: API_BASEPATH + '/user/judgeInvitation',

    tag_list_complete: API_BASEPATH + '/tags',
    opportunity_current_tags: API_BASEPATH + '/opportunity/{id}/tags',
    opportunity_skill_categories: API_BASEPATH + '/opportunity/{id}/tag/category',
    opportunity_category_skills: API_BASEPATH + '/opportunity/{id}/tag/category/{categoryTag}',
    opportunity_providers: API_BASEPATH + '/opportunity/{id}/provider',
    opportunity_change_visibility: API_BASEPATH + '/opportunity/{id}/type',


    opportunity_configuration: API_BASEPATH + '/opportunity/configuration',
    opportunity_configuration_by_id: API_BASEPATH + '/opportunity/{id}/configuration',
    opportunity_save_expert_configuration: API_BASEPATH + '/opportunity/{id}/configuration/judge',
    opportunity_save_challenge_configuration: API_BASEPATH + '/opportunity/{id}/configuration/challenge',
    opportunity_configuration_hours_duration: API_BASEPATH + '/opportunity/{id}/configuration/deadline',
    opportunity_configuration_confirm_test: API_BASEPATH + '/opportunity/{id}/configuration/test/confirm',
    opportunity_configuration_confirm: API_BASEPATH + '/opportunity/{id}/challenge/configure',
    opportunity_configuration_timeline: API_BASEPATH + '/opportunity/{id}/configuration/autoenable',
    opportunity_configuration_enable_cv: API_BASEPATH + '/opportunity/{id}/configuration/enablecv',
    opportunity_configuration_enable_phone: API_BASEPATH + '/opportunity/{id}/configuration/enablephone',
    opportunity_clean_new_applicants: API_BASEPATH + '/opportunity/{id}/readUpdates/{trackId}',

    opportunity_get_challenge: API_BASEPATH + '/opportunity/{id}/challenge',
    opportunity_create_challenge: API_BASEPATH + '/opportunity/{id}/challenge',
    opportunity_update_challenge: API_BASEPATH + '/opportunity/{id}/challenge',

    opportunity_match_stats: API_BASEPATH + '/opportunity/{id}/match/stats',
    challenge_match_stats: API_BASEPATH + '/opportunity/stats',

    opportunity_create_challenge_template: API_BASEPATH + '/template',
    get_all_user_templates: API_BASEPATH + '/template',
    get_template_by_id: API_BASEPATH + '/template/{id}',
    get_template_by_id_for_ooportunity: API_BASEPATH + '/opportunity/{id}/template/{templateId}',
    get_challenge_template_by_id_for_ooportunity: API_BASEPATH + '/opportunity/{id}/challenge/template/{challengeId}',
    get_challenge_by_id: API_BASEPATH + '/challenge/{challengeId}',
    get_opportunity_templates: API_BASEPATH + '/opportunity/{id}/template',
    unlock_template_for_opportunity: API_BASEPATH + '/opportunity/{id}/template/{templateId}/unlock',
    unlock_template: API_BASEPATH + '/opportunity/template/{templateId}/unlock',
    opportunity_apply_template: API_BASEPATH + '/opportunity/{id}/challenge/draft',
    create_challenge_apply_template: API_BASEPATH + '/opportunity/challenge/draft',
    get_slots_for_opportunity: API_BASEPATH + '/opportunity/{id}/template/slots',
    get_opportunity_challenge: API_BASEPATH + '/opportunity/{id}/challenge',
    get_opportunity_challenges_old: API_BASEPATH + '/opportunity/{id}/challenge/template',
    get_opportunity_old_challenges: API_BASEPATH + '/opportunity/{id}/challenge/template/search',
    apply_old_challenge: API_BASEPATH + '/opportunity/{id}/challenge/template/{challengeId}/apply',
    duplicate_template: API_BASEPATH + '/template/{id}/duplicate',
    upload_file: API_BASEPATH + '/upload/files/{type}/upload',
    upload_image: API_BASEPATH + '/upload/images/{type}/upload',
    use_challenge: API_BASEPATH + '/opportunity/{id}/challenge/use',

    expert_pending_list: API_BASEPATH + '/opportunity/expert/pending',
    expert_accept_pending_opportunity: API_BASEPATH + '/opportunity/{id}/expert/accept',
    expert_decline_pending_opportunity: API_BASEPATH + '/opportunity/{id}/expert/decline',

    get_user_list_to_review: API_BASEPATH + '/opportunity/{id}/toReview',
    get_expert_user_list: API_BASEPATH + '/opportunity/{id}/expert',
    get_leaderboard: API_BASEPATH + '/opportunity/{id}/leaderboard',
    get_user_to_review: API_BASEPATH + '/opportunity/{id}/user/{userId}/review',
    post_user_to_review: API_BASEPATH + '/opportunity/{id}/user/{userId}/review',
    get_user_answer: API_BASEPATH + '/opportunity/{id}/user/{userId}/answer',
    get_killer_answers: API_BASEPATH + '/opportunity/{id}/user/{userID}/killerquestion',

    news_feed_reply: API_BASEPATH + '/newsfeed/{id}/reply',
    news_feed_reply_post: API_BASEPATH + '/newsfeed/{id}/reply',

    trello_process: API_BASEPATH + '/opportunity/{id}/process',

    attitude_test: API_OPEN_BASEPATH + '/opportunity/{id}/user/{userId}/attitude',
    attitude_user: API_BASEPATH + '/user/{id}/attitude',
    tags_categories: API_BASEPATH + '/tags/category',
    get_skills_by_team_id: API_BASEPATH + '/tags/category/{id}/all',
    get_templates_by_criteria: API_BASEPATH + '/template/search',

    opportunity_general_settings: `${API_BASEPATH}/opportunity/{id}/challenge/configure`,
    opportunity_team_settings: `${API_BASEPATH}/opportunity/{id}/challenge/expert/configure`,
    opportunity_team_member_settings: `${API_BASEPATH}/opportunity/{id}/challenge/member/configure`,
    opportunity_challenge_activate: `${API_BASEPATH}/opportunity/{id}/challenge/activate`,

    slack_link_info: `${API_BASEPATH}/opportunity/{id}/slack/button`,
    slack_bindings: `${API_BASEPATH}/opportunity/{id}/slack`,
    slack_binding_delete: `${API_BASEPATH}/opportunity/{id}/slack/{bindingId}`
};
