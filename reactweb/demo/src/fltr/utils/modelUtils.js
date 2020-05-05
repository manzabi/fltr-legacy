import {
    getAttitudeProcessTest,
    getChallengeProcessTest,
    getKillerQuestionProcessTest,
    PROCESS_TYPE_ATTITUDE,
    PROCESS_TYPE_CHALLENGE,
    PROCESS_TYPE_QUESTIONS
} from '../../constants/opportunityProcessType';
import {getSafeDate, getTimeString} from '../../common/timerUtils';
import {TYPE_STATUS_DISQUALIFIED} from '../../constants/candidateOpportunityStatus';

/**
 *
 * @param data {object} candidate data
 * @constructor
 */
export function candidateModel(data) {
    const { user, ...application } = data;
    // Defining user data
    this.name = user.completeName;
    this.image = user.imageUrl;
    this.phone = user.phone;
    this.email = user.email;
    this.cv = user.cv;
    this.social = user.social;
    this.id = user.id;
    // Defining general application data
    this.bookmark = application.bookmark;
    this.status = application.statusCandidate;
    const { motivation, notes, rank, reviewAttitude: attitude, reviewTalent: challenge, reviewKillerQuestion: questions, reviewCv: experience } = application.review;
    this.details = {
        notes
    };
    // Defining team opportunity data
    try {
        const { configuration: {
            challengeStatus,
            configurationExpert: { experts },
            configurationMember: { members: recruiters }
        } } = data.opportunity.recruiterDetail;

        this.opportunity = {
            challengeStatus,
            experts: {
                number: experts.length,
                list: experts.length ? experts : null
            },
            recruiters: {
                number: recruiters.length,
                list: recruiters.length ? recruiters : null
            }

        };
    } catch (error) {
        this.opportunity = null;
    }
    // defining scores
    const scores = { attitude, challenge, experience };
    Object.keys(scores).forEach((key) => {
        if (scores[key]) {
            if (!scores[key].score) {
                scores[key].score = scores[key].stars ? (scores[key].stars * 100) / 5 : 0;
                delete scores[key].stars;
            }
        }
    });
    if (challenge && challenge.judgeReviews) {
        challenge.judgeReviews = challenge.judgeReviews.map((review) => {
            const judgeId = review.judge.id;
            const judge = this.opportunity.experts.list.find((element) => element && element.user && element.user.id === judgeId);
            review.judge.email = judge.email || judge.user.email;
            return review;
        });
    }
    if (questions && questions.answers) {
        let score = 0;
        questions.answers.forEach((answer) => {
            if (answer.valid) {
                score += 1;
            }
        });
        questions.score = questions.answers.length ? (score * 100) / questions.answers.length : 0;
    }

    this.score = {
        rank,
        motivation,
        questions,
        ...scores
    };
    // Defining application specific to challenge
    try {
        const { enabled, done, discarded, doneDate, acceptedDate, accepted } = getChallengeProcessTest(application);
        // Getting time since candidate events
        const timeAccepted = moment(getSafeDate(acceptedDate), 'DD/MM/YYYY HH:mm').fromNow();
        const timeDone = moment(getSafeDate(doneDate), 'DD/MM/YYYY HH:mm').fromNow();
        // Defining challenge details
        this.challenge = {
            enabled,
            discarded,
            done: {
                status: done,
                time: done ? timeDone : null
            },
            accepted: {
                status: accepted,
                time: accepted ? timeAccepted : null
            }
        };
    }
    catch (error) {
        this.challenge = null;
    }

    // Defining challenge submission
    try {
        this.challenge.submission = application.opportunity.recruiterDetail.challengeTest.challenge;
    } catch (error) {
        // Candidate without challenge
    }
    // Defining attitude submission data
    try {
        const attitudeResults = attitude.ranking;
        const variationFacets = attitudeResults.playerRanking.reduce((acc, element, index) => {
            if (acc[element.domain]) {
                acc[element.domain].variations.push(attitudeResults.differences[index]);
            } else {
                acc[element.domain] = {
                    domain: element.domain,
                    domainName: element.domainName,
                    variations: [attitudeResults.differences[index]]

                };
            }
            return acc;
        }, {});
        Object.keys(variationFacets).forEach((domain) => {
            variationFacets[domain].variations = variationFacets[domain].variations.reduce((total, value) => total + value) / variationFacets[domain].variations.length;
        });
        this.score.attitude.modelVariations = Object.keys(variationFacets).map((key) => variationFacets[key]);

        if (this.score && this.score.attitude && this.score.attitude.ranking && this.score.attitude.ranking.playerRanking) {

            const attitudeArray = [...this.score.attitude.ranking.playerRanking];
            const attitudeScores = {
                neuroticism: 0,
                extraversion: 0,
                openness: 0,
                agree: 0,
                conscient: 0
            };
            const attitudeAmounts = {
                neuroticism: 0,
                extraversion: 0,
                openness: 0,
                agree: 0,
                conscient: 0
            };
            attitudeArray.forEach(({ domain, score, facetName }) => {
                if (facetName !== 'root') {
                    switch (domain) {
                        case 'N':
                            attitudeScores.neuroticism += score;
                            attitudeAmounts.neuroticism += 20;
                            break;
                        case 'E':
                            attitudeScores.extraversion += score;
                            attitudeAmounts.extraversion += 20;
                            break;
                        case 'O':
                            attitudeScores.openness += score;
                            attitudeAmounts.openness += 20;
                            break;
                        case 'A':
                            attitudeScores.agree += score;
                            attitudeAmounts.agree += 20;
                            break;
                        case 'C':
                            attitudeScores.conscient += score;
                            attitudeAmounts.conscient += 20;
                            break;
                        default:
                            break;
                    }
                }
            });
            const maxValue = Math.max(...Object.values(attitudeScores));
            const maxDomain = Object.keys(attitudeScores).find(key => attitudeScores[key] === maxValue);
            this.score.attitude.ranking.mostOutstandingValue = {
                domain: maxDomain[0].toUpperCase() + maxDomain.substring(1),
                value: maxValue,
                totalAmount: attitudeAmounts[maxDomain]
            };
        }

        if (this.score) {
            const types = ['attitude', 'challenge', 'experience', 'questions'];
            types.forEach(type => {
                const scoreObj = this.score[type];
                if (scoreObj && scoreObj.score) {

                    let scoreText;
                    if (scoreObj.score >= 90) {
                        scoreText = 'High';
                    } else if (scoreObj.score >= 75) {
                        scoreText = 'Medium';
                    } else {
                        scoreText = 'Low';
                    }

                    scoreObj.scoreText = scoreText;
                }
            });
        }
    } catch (error) {
        // Candidate without attitude
    }
}

/**
 *
 * @param data {object} candidate data
 * @constructor
 */
export function candidateModelList(data) {
    const { user, ...application } = data;
    // Defining user data
    this.role = user.completePosition;
    this.nickname = user.nickname;
    this.name = user.completeName;
    this.image = user.imageUrl;
    this.email = user.email;
    this.phone = user.phone;
    this.id = user.id;
    this.matchId = application.id;
    this.cv = user.cv;
    this.social = user.social;
    // Defining general application data
    this.bookmark = application.bookmark;
    const {
        completed = false,
        declined = false,
        discarted = false,
        live = false
    } = application.process;
    this.status = {
        statusCandidate: application.statusCandidate,
        disqualified: application.statusCandidate === TYPE_STATUS_DISQUALIFIED,
        completed,
        declined,
        discarted,
        live
    };
    const { motivation,
        rank,
        reviewAttitude: attitude,
        reviewAttitudeStars: attitudeStars,
        reviewTalent: challenge,
        reviewTalentStars: challengeStars,
        reviewKillerQuestion: questions,
        reviewKillerQuestionStars: questionsStars,
        reviewCv: experience,
        reviewCvStars: experienceStars,
        numDoneReviews,
        numTotalReviews } = application.review;
    const scores = { attitude, challenge, challengeStars, experience, attitudeStars, questionsStars, experienceStars };
    this.score = {
        rank,
        motivation,
        questions,
        numDoneReviews,
        numTotalReviews,
        ...scores
    };
    const { id, commonDetail, applied, processSteps, recruiterDetail, challengeDetail } = application.opportunity;
    const { configurationExpert } = recruiterDetail.configuration;
    this.opportunity = {
        experts: {
            number: configurationExpert && configurationExpert.experts ? configurationExpert.experts.length : 0
        },
        id, commonDetail, applied, processSteps, challengeDetail
    };
    const getStepData = (type, step) => {
        let tempData = {};
        if (step) {
            const { type: stepType, typeString, referenceId } = step;
            tempData = {
                stepType,
                typeString,
                referenceId
            };
        }
        switch (type || step && step.type) {
            case PROCESS_TYPE_ATTITUDE: {
                const processStep = getAttitudeProcessTest(application.opportunity);
                const stepData = getAttitudeProcessTest(data);
                tempData.status = !!stepData;
                if (stepData || tempData) {
                    if (stepData) {
                        tempData = { ...tempData, ...stepData };
                    } else {
                        tempData = { ...stepData, status: true };
                    }
                    if (tempData) {
                        tempData.typeString = 'Attitude';
                        tempData.score = this.score.attitude;
                        tempData.starsScore = this.score.attitudeStars;
                    }
                }
                tempData.processStep = processStep;
                if (!tempData.type) {
                    tempData.type = PROCESS_TYPE_ATTITUDE;
                }
                break;
            }
            case PROCESS_TYPE_QUESTIONS: {
                const processStep = getKillerQuestionProcessTest(application.opportunity);
                const stepData = getKillerQuestionProcessTest(data);
                tempData.status = !!stepData;
                if (stepData || tempData) {
                    if (stepData) {
                        tempData = { ...tempData, ...stepData };
                    } else {
                        tempData = { ...stepData, status: true };
                    }
                    if (tempData) {
                        tempData.typeString = 'Questions';
                        tempData.score = this.score.questions;
                        tempData.starsScore = this.score.questionsStars;

                    }
                }
                tempData.processStep = processStep;
                if (!tempData.type) {
                    tempData.type = PROCESS_TYPE_QUESTIONS;
                }
                break;
            }
            case PROCESS_TYPE_CHALLENGE: {
                const processStep = getChallengeProcessTest(application.opportunity);
                const stepData = getChallengeProcessTest(data);
                tempData.status = !!stepData;
                if (stepData || tempData) {
                    if (stepData) {
                        tempData = { ...tempData, ...stepData };
                    } else {
                        tempData = { ...stepData, status: true };
                    }
                    if (tempData) {
                        tempData.score = this.score.challenge;
                        tempData.starsScore = this.score.challengeStars;
                        tempData.typeString = 'Challenge';
                        if (tempData.accepted && !tempData.done && tempData.expireDate) {
                            tempData.expireTime = getSafeDate(tempData.expireDate).fromNow();
                        } else {
                            tempData.expireTime = null;
                        }
                    }
                }
                tempData.processStep = processStep;
                if (!tempData.type) {
                    tempData.type = PROCESS_TYPE_CHALLENGE;
                }
                break;
            }
            default: {
                return null;
            }
        }
        if (tempData) {
            const { enabled = false,
                done = false,
                discarted: discarded = false,
                doneDate = null,
                acceptedDate = null,
                accepted = false,
                expired = false,
                expiredDate = null,
                enabledDate = null,
                expireTime,
                status,
                ...rest } = tempData;
            const timeAccepted = accepted ? moment(getSafeDate(acceptedDate), 'DD/MM/YYYY HH:mm').fromNow() : null;
            const timeDone = done ? moment(getSafeDate(doneDate), 'DD/MM/YYYY HH:mm').fromNow() : null;
            const timeExpired = expired ? moment(getSafeDate(expiredDate), 'DD/MM/YYYY HH:mm').fromNow() : null;
            const timeEnabled = enabled ? moment(getSafeDate(expiredDate), 'DD/MM/YYYY HH:mm').fromNow() : null;
            return {
                enabled: {
                    status: enabled,
                    timeEnabled,
                    enabledDate
                },
                discarded,
                done: {
                    status: done,
                    time: timeDone,
                    doneDate
                },
                accepted: {
                    status: accepted,
                    time: timeAccepted,
                    acceptedDate
                },
                expired: {
                    status: expired,
                    time: timeExpired,
                    expireTime,
                    expiredDate
                },
                name,
                status,
                ...rest
            };
        } else { return null; }
    };

    this.process = {
        steps: [
            ...application.opportunity.processSteps.map((step) => getStepData(null, step))
        ]
    };
    this.time = new Date().getTime();
    // METHODS
    this.getStepData = function (type) {
        const { process } = this;
        switch (type) {
            case PROCESS_TYPE_ATTITUDE: {
                return getAttitudeProcessTest({ process });
            }

            case PROCESS_TYPE_QUESTIONS: {
                return getKillerQuestionProcessTest({ process });
            }

            case PROCESS_TYPE_CHALLENGE: {
                return getChallengeProcessTest({ process });
            }
            default: {
                return null;
            }
        }
    };

    this.getPositionText = (value, max) => {
        if (value === 1) {
            return 'This candidate is the best one!';
        }
        if (value === +max) {
            return 'This candidate is the worst one.';
        }
        return `This candidate scored above than ${Math.round(100 * (max - value) / max)}% of candidates.`;
    };

    this.getExperienceSentence = (value, max = 100) => {
        const score = +value / max;
        if (score >= 0.8)  {
            return 'Almost perfect score, outstanding result!';
        }
        if (score >= 0.5)  {
            return 'Good score, above the minimum required';
        }
        return 'Bad score, below the minimum required';
    };

    this.getScoreText = (score) => {
        if (score >= 85) {
            return 'High';
        } else if (score >= 60) {
            return 'Medium';
        } else {
            return 'Low';
        }
    };
    this.statusTypes = {
        candidate: 0,
        challenge: 1
    };

    this.getStatusClass = (type = this.statusTypes.candidate) => {
        const { completed, declined, discarted } = this.status;
        let expired = false;
        if (this.process.steps) {
            expired = this.process.steps[this.process.steps.length - 1].expired.status;
        }
        switch (type) {
            case this.statusTypes.candidate: {
                if (completed) {
                    return 'crazy-correct';
                } else if (declined || discarted || expired) {
                    return 'crazy-red';
                } else {
                    return '';
                }
            }
            case this.statusTypes.challenge: {
                const { accepted, done, enabled, expired } = this.getStepData(PROCESS_TYPE_CHALLENGE);
                const { declined } = this.status;
                if (expired && expired.status) {
                    return 'crazy-red';
                } else if (declined) {
                    return 'crazy-red';
                } else if (done && done.status) {
                    return 'crazy-correct';

                } else if (accepted && accepted.status) {
                    return 'crazy-correct';

                } else if (enabled && enabled.status) {
                    return '';
                } else {
                    return '';
                }
            }
            default: {
                const error = new Error(`The type {${type}} doesn't exist`);
                // eslint-disable-next-line no-console
                console.error(error.stack);
            }
        }

    };
    this.getStatusText = (type = this.statusTypes.candidate) => {
        const { completed, declined, discarted } = this.status;
        let expired = false;
        if (this.process.steps) {
            expired = this.process.steps[this.process.steps.length - 1].expired.status;
        }
        switch (type) {
            case this.statusTypes.candidate: {
                if (completed) {
                    return 'Answer submitted';
                } else if (declined) {
                    return 'Declined';
                } else if (discarted) {
                    return 'Discarded';
                } else if (expired) {
                    return 'Expired';
                } else {
                    return 'Pending';
                }
            }
            case this.statusTypes.challenge: {
                const { accepted, done, enabled, expired } = this.getStepData(PROCESS_TYPE_CHALLENGE);
                const { declined } = this.status;
                if (expired && expired.status) {
                    return 'Challenge expired';
                } else if (declined) {
                    return 'Declined';
                } else if (done && done.status) {
                    return 'Challenge submitted';
                } else if (accepted && accepted.status) {
                    return 'Challenge Accepted';
                } else if (enabled && enabled.status) {
                    return 'Pending to accept';
                } else {
                    return 'Pending';
                }
            }
            default: {
                const error = new Error(`The type {${type}} doesn't exist`);
                // eslint-disable-next-line no-console
                console.error(error.stack);
            }
        }
    };


    // challenge status
    const { accepted = false, done = false, enabled = false, expired = false } = this.getStepData(PROCESS_TYPE_CHALLENGE) || {};
    this.challengeStatus = {
        accepted: accepted.status,
        done: done.status,
        enabled: enabled.status,
        expired: expired.status,
        declined, live
    };
    const doneSteps = this.process.steps.filter((step) => step.done.status);
    const lastStep = doneSteps[doneSteps.length - 1];
    this.dates = {
        apply: getTimeString(application.creation, 'DD MMM - HH:mm'),
        lastReview: application.review && application.review.dateLastReview ? getTimeString(application.review.dateLastReview, 'DD MMM - HH:mm') : null,
        submission: lastStep && lastStep.done.status ? getTimeString(lastStep.done.doneDate, 'DD MMM - HH:mm') : null
    };
}