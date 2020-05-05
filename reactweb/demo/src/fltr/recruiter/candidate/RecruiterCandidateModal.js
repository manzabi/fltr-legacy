import React, { Component } from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';

import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import CrazyContentSidebar from '../../../layout/sidebar/CrazyContentSidebar';
import { Header, Text } from '../../../layout/FluttrFonts';
import { CircleChart, HalfCircleChart, LinesChart, DividedCircle } from '../../../layout/graphs/CrazyGraph';
import RecruiterCandidateCard from './RecruiterCandidateCard';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import StarsViewComponent from '../../../common/components/StarsViewComponent';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import { fetchUserAnswer, resetUserAnswer } from '../../../redux/actions/reviewActions';
import AsynchContainer from '../../template/AsynchContainer';
import FullheightIframe from '../../../common/components/FullheightIframe';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import CrazyCard from '../../../layout/uiUtils/crazyCard';
import FullscreenFile from '../../../layout/layout/FullscreenFile';

import Chart from 'react-chartjs2';
import Spinner from '../../Spinner';
import {
    fetchRecruiterCandidateAttitude,
    fetchRecruiterCandidateChallenge, fetchRecruiterCandidateExperience,
    fetchRecruiterCandidateOverview,
    getKillerAnswers
} from '../../../redux/actions/recruiterOpportunityActions';
import {
    PROCESS_TYPE_ATTITUDE,
    PROCESS_TYPE_CHALLENGE,
    PROCESS_TYPE_QUESTIONS
} from '../../../constants/opportunityProcessType';
import { closeModalFix } from '../../../common/uiUtils';
import { calculateScore, getDomain } from '../../test/attitude/evaluator';
import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import CrazySeparator from '../../../layout/layout/CrazySeparator';
import { getTimeString } from '../../../common/timerUtils';
import { DMonthTime } from '../../../constants/timeFormats';
import Row from '../../../layout/layout/Row';
import Container from '../../../layout/layout/Container';
import { ChallengeStatusWidget, RecruiterExperienceWidget, RecruiterReviewWidget } from './CandidateDetailWidgets';
import { downloadFile } from '../../utils/fileUtils';
import AsyncList from '../../template/AsyncList';
import { fetchReplyList, resetReplyList } from '../../../redux/actions/feedActions';
import { checkAllObjectParams } from '../../../common/utils';

@withRouter
@connect(({ playerAnswer, user }) => ({ playerAnswer, user }))
export default class RecruiterCandidateModal extends Component {
    constructor(props) {
        super(props);
        const { candidate, screen } = props;
        const tabData = {};
        tabData.attitude = candidate.attitude;
        tabData.score = candidate.score;
        tabData.challenge = candidate.challenge;
        tabData.opportunity = candidate.opportunity;
        const hasChallenge = !!candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        const hasQuestion = !!candidate.getStepData(PROCESS_TYPE_QUESTIONS);
        const hasAttitude = !!candidate.getStepData(PROCESS_TYPE_ATTITUDE);
        const hasMotivation = hasChallenge || hasAttitude;
        const hasExperience = candidate.opportunity.commonDetail.enablecv;

        this.state = {
            fullscreenOpen: false,
            activeTab: screen,
            candidate,
            initializedTab: {
                challenge: false,
                attitude: false,
                experience: false,
                overview: false,
                motivation: false,
                questions: false
            },
            activeTabs: {
                challenge: hasChallenge,
                attitude: hasAttitude,
                questions: hasQuestion,
                motivation: hasMotivation,
                experience: hasExperience,
                overview: true
            },
            showAttitudeDetails: {
                neuroticism: false,
                extraversion: false,
                'openness to experience': false,
                conscientiousness: false,
                agreeableness: false
            },
            tabData
        };
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.candidate.time !== this.props.candidate.time) {
            this.setState({ candidate: nextProps.candidate });
        }
    }

    componentDidMount() {
        const activeTab = this.state.activeTabs[this.state.activeTab] ? this.state.activeTab : 'overview';
        this.changeTab(activeTab);
    }

    changeTab = (newTab) => {
        const initializedTab = this.state.initializedTab[newTab];
        document.getElementsByClassName('scrollable-modal')[0].scrollTop = 0;
        this.setState({
            activeTab: newTab,
            fullscreenOpen: false
        }, () => {
            if (!initializedTab) {
                this.onLoadTab(newTab);
            }
        });

    };

    onRefreshTab = (tab, reset) => {
        this.props.onRefresh('discard');
        if (reset) {
            const state = { ...this.state };
            state.initializedTab[tab] = false;
            state.tabData[tab] = undefined;
            this.setState({
                state
            });
        }
        this.onLoadTab(tab);
    };

    onLoadTab = (tab) => {
        const newState = { ...this.state };
        const { params: { id } } = this.props;
        const userId = this.state.candidate.id;
        switch (tab) {
            case 'attitude':
                this.props.dispatch(fetchRecruiterCandidateAttitude(id, userId, (data) => {
                    newState.initializedTab[tab] = true;
                    newState.tabData[tab] = data;
                    this.setState(newState);
                }));
                break;
            case 'challenge': {
                const data = this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
                if (data && data.done.status) {
                    this.props.dispatch(resetUserAnswer());
                    this.props.dispatch(fetchUserAnswer(id, userId));
                    this.props.dispatch(fetchRecruiterCandidateChallenge(id, userId, (data) => {
                        newState.initializedTab[tab] = true;
                        newState.tabData[tab] = data;
                        this.setState(newState);
                    }));
                } else {
                    newState.initializedTab[tab] = true;
                    newState.tabData[tab] = data;
                    this.setState(newState);
                }
                break;
            }
            case 'overview':
                this.props.dispatch(fetchRecruiterCandidateOverview(id, userId, (data1) => {
                    newState.tabData[tab] = {
                        activity: data1
                    };
                    this.props.dispatch(fetchRecruiterCandidateAttitude(id, userId, (data2) => {
                        newState.tabData[tab].attitude = data2;
                        const data = this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
                        if (data && data.done.status) {
                            this.props.dispatch(resetUserAnswer());
                            this.props.dispatch(fetchUserAnswer(id, userId));
                            this.props.dispatch(fetchRecruiterCandidateChallenge(id, userId, (data3) => {
                                newState.tabData[tab].challenge = data3;
                                this.setState(newState);
                            }));
                        } else {
                            newState.tabData[tab].challenge = data;
                        }
                        newState.initializedTab[tab] = true;
                        this.setState(newState);
                    }));
                }));
                break;
            case 'experience': {
                this.props.dispatch(fetchRecruiterCandidateExperience(id, userId, (data) => {
                    newState.tabData[tab] = data;
                    newState.initializedTab[tab] = true;
                    this.setState(newState);
                }));
                break;
            }
            case 'motivation': {
                newState.initializedTab[tab] = true;
                this.setState(newState);
                break;
            }
            case 'questions': {
                this.props.dispatch(getKillerAnswers(id, userId, (data) => {
                    newState.initializedTab[tab] = true;
                    newState.tabData[tab] = data;
                    this.setState(newState);
                }));
                break;
            }
            default:
                break;
        }
    };



    renderReport = () => {
        return (Object.keys(this.state.showAttitudeDetails).map((domainName) => this.renderDomainSummary(domainName)));
    };

    renderDomainSummary = (domain) => {
        const data = [];
        const { playerRanking, modelRanking, differences } = this.state.tabData.attitude.ranking;
        let diff;
        const candidateValue = playerRanking.find(({ facetName, domainName }, index) => {
            if (facetName === 'root' && domainName.toLowerCase() === domain.toLowerCase()) {
                diff = differences[index];
                return true;
            }
            return false;
        });
        const modelValue = modelRanking.find(({ facetName, domainName }) => facetName === 'root' && domainName.toLowerCase() === domain.toLowerCase());
        data[0] = candidateValue.score;
        data[1] = modelValue.score;
        const calcScore = calculateScore(playerRanking)[domain[0].toUpperCase()].result;
        const domainInfo = getDomain(domain[0].toUpperCase());
        const description = domainInfo.results.find(({ score }) => score === calcScore).text;

        //temporal, a manija
        diff = Math.abs(data[0] - data[1]);
        //fin de temporal
        return (
            <div className='domain-summary' >
                <div className='header-wrapper'>
                    <Text bold style={{ fontSize: 15, textTransform: 'capitalize' }}>{domain}</Text>
                    <div className='right-texts-wrapper'>
                        <Text bold size='sm' className='first-text'>{Math.round(100 - ((diff * 100) / 120))}% model match</Text>
                        <Text bold size='sm' className='second-text'>{candidateValue.score}/120</Text>
                    </div>
                </div>
                <Text size='sm' style={{ marginBottom: 45 }}>{description}</Text>
                <div style={{ width: 'calc(100% - 50px)', margin: '0 0 0 auto' }}>
                    <LinesChart maxValue={120} data={data} />
                </div>
                <div className='show-details-wrapper' onClick={() => { this.onToggleDetails(domain); }}>
                    <Text className='show-details'>Show details</Text>
                    <CrazyIcon icon={this.state.showAttitudeDetails[domain.toLowerCase()] ? 'icon-arrow-drop-up' : 'icon-arrow-drop-down'} />
                </div>
                {this.state.showAttitudeDetails[domain.toLowerCase()] && this.renderDomainDetail(domain)}
            </div >
        );
    };

    renderDomainDetail = (domain) => {
        const { playerRanking, modelRanking } = this.state.tabData.attitude.ranking;
        const domainInfo = getDomain(domain[0].toUpperCase());
        return (
            <div className='domain-detail'>
                {playerRanking.map((ele, i) => {
                    if (domain === ele.domainName.toLowerCase() && ele.facetName !== 'root') {
                        return this.renderFacetDetail(ele, modelRanking[i], domainInfo.facets);
                    }
                })}
            </div>
        );
    };

    renderFacetDetail = (player, model, facets) => {
        const { facetName, scoreText, score } = player;
        const description = facets.find(({ title }) => title.toLowerCase() === facetName.toLowerCase()).text;
        return (
            <div className='facet-detail'>
                <Text bold style={{ fontSize: 15 }}>{facetName}</Text>
                <Text size='sm' style={{ marginBottom: 10 }}>{this.state.candidate.name}'s level of {facetName.toLowerCase()} is {scoreText}</Text>
                <Text size='sm' style={{ marginBottom: 25 }}>{description}</Text>
                <div style={{ width: 'calc(100% - 100px)', margin: '0 auto' }}>
                    <LinesChart maxValue={20} data={[score, model.score]} />
                </div>
            </div>
        );
    };

    onToggleDetails = (domain) => {
        const showAttitudeDetails = { ...this.state.showAttitudeDetails };
        showAttitudeDetails[domain.toLowerCase()] = !this.state.showAttitudeDetails[domain.toLowerCase()];
        this.setState({ showAttitudeDetails });
    };

    handleCloseFullscreen = () => {
        this.setState({
            fullscreenOpen: false
        });
    };
    handleOpenFullscreen = (file = 'cv') => {
        this.setState({
            fullscreenOpen: file
        });
    };

    getScoreText = (score) => {
        if (score >= 85) {
            return 'High';
        } else if (score >= 60) {
            return 'Medium';
        } else {
            return 'Low';
        }
    };

    onClose = () => {
        closeModalFix();
        this.props.onClose();
    };

    renderEmptyTab = (tab) => {
        const titles = {
            attitude: 'Attitude test · Soft skills',
            challenge: 'Challenge review',
            questions: 'Questionnaire'
        };

        switch (tab) {
            case 'attitude': {
                return (
                    <div className='attitude-content'>
                        <Header size='sm'>{titles[tab] || ''}</Header>
                        <Grid className='small-graphs-wrapper' style={{ marginTop: 30 }}>
                            <Col className='small-graph-card' md='4' sm='12'>
                                <Text bold style={{ margin: 0 }} className='graph-card-title'>MODEL MATCH</Text>
                                <CircleChart valueString='-' zindex={1} />
                                <Header size='sm' style={{ textAlign: 'center', margin: '0 0 5px' }}>Not complete it</Header>
                                <Text size='sm' className='graph-card-subtitle' style={{ margin: 0, textAlign: 'center' }}>Pending to submit</Text>
                            </Col>
                            {Array(2).fill('').map((e, i) => (<Col md='4' sm='12' className='small-placeholder' key={`attitude_placeholder_${i}`}>
                                <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/attitude-card-placeholder.png' />
                            </Col>))}
                        </Grid>
                    </div>
                );
            }
            case 'challenge': {
                return (
                    <div className='tab-content'>
                        <Header size='sm'>{titles[tab] || ''}</Header>
                        <Grid className='small-graphs-wrapper' style={{ marginTop: 30 }}>
                            <Col className='small-graph-card' md='4' sm='12'>
                                <Text bold style={{ margin: 0 }} className='graph-card-title'>CHALLENGE</Text>
                                <CircleChart valueString='-' zindex={1} />
                                <Header size='sm' style={{ textAlign: 'center', margin: '0 0 5px' }}>Pending to start</Header>
                                <Text size='sm' className='graph-card-subtitle' style={{ margin: 0, textAlign: 'center' }}>Pending to submit</Text>
                            </Col>
                            {Array(2).fill('').map((e, i) => (<Col md='4' sm='12' className='small-placeholder' key={`attitude_placeholder_${i}`}>
                                <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/attitude-card-placeholder.png' />
                            </Col>))}
                        </Grid>
                    </div>
                );
            }
            default: {
                return (
                    <div className='attitude-content'>
                        <Header size='sm'>{titles[tab] || ''}</Header>
                        <Grid className='small-graphs-wrapper' style={{ marginTop: 30 }}>
                            {Array(3).fill('').map((e, i) => (<Col md='4' sm='12' className='small-placeholder' key={`attitude_placeholder_${i}`}>
                                <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/attitude-card-placeholder.png' />
                            </Col>))}
                        </Grid>
                    </div>
                );
            }
        }
    };

    getLineData = () => {
        const { playerRanking, modelRanking } = this.state.tabData.attitude.ranking;
        const playerRootsOut = playerRanking.filter(({ facetName }) => facetName !== 'root');
        const modelRootsOut = modelRanking.filter(({ facetName }) => facetName !== 'root');
        const labels = playerRootsOut.map(({ facetName }) => facetName);
        const playerScores = playerRootsOut.map(({ score }) => score);
        const modelScores = modelRootsOut.map(({ score }) => score);
        return {
            labels,
            datasets: [{
                label: 'Candidate',
                borderColor: '#FFB500',
                backgroundColor: '#FFB500',
                data: playerScores,
                radius: 1,
                fill: false,
                lineTension: 0.1
            }, {
                label: 'Model',
                fill: false,
                backgroundColor: '#8A81E1',
                borderColor: '#8A81E1',
                data: modelScores,
                radius: 1,
                lineTension: 0.1
            }]
        };
    };

    renderOverviewStatus = () => {
        const { activity } = this.state.tabData.overview;
        const notRenderTypes = [4, 6, 13];

        return (
            <div className='overview-status'>
                {activity.map(step => { if (!notRenderTypes.includes(step.type)) { return this.renderActivityStep(step); } })}
            </div>
        );
    };

    renderActivityStep = ({ creation, type, done, description, user, typeString }) => {

        const doneColors = ['blue', 'blue', 'red', undefined, 'green', undefined, 'orange', 'orange', 'red', 'green', 'green', 'red', undefined, 'red', 'blue'];
        let newDescription = description;
        if (type === 7) { newDescription = 'Assessed CV'; }
        if (type === 8) { newDescription = 'Assessed Challenge'; }
        if (type === 12) { newDescription = 'Discarded candidate'; }
        if (user && (newDescription.includes('Assessed Challenge') || newDescription.includes('Assessed CV'))) {
            newDescription += ` by ${user.completeName}`;
        }
        let creationDate = '-';
        if (creation) {
            creationDate = getTimeString(creation, DMonthTime);
        }
        const challengeStep = this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        const attitudeStep = this.state.candidate.getStepData(PROCESS_TYPE_ATTITUDE);
        const questionsStep = this.state.candidate.getStepData(PROCESS_TYPE_QUESTIONS);
        const notRender = (!(challengeStep && challengeStep.status) && newDescription.includes('Challenge')) ||
            ((!attitudeStep || !creation) && newDescription.includes('Attitude')) ||
            (!questionsStep && newDescription.includes('Questions')) ||
            (!creation && newDescription.includes('Disqualified')) ||
            (!creation && newDescription.includes('Discarded candidate')) ||
            (!creation && newDescription.includes('Declined')) ||
            (!creation && newDescription.includes('Expired')) ||
            (!creation && newDescription.includes('Extended')) ||
            (!creation && challengeStep && challengeStep.status && newDescription.includes('Challenge') && newDescription !== 'Accepted Challenge');
        if (notRender) { return null; }
        return (
            <div className='overview-status-step' key={`status_step_${type}_${Math.round(10 * Math.random())}`}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-start' }}>
                    <div className={`step-ribbonsito ${done ? (doneColors[type - 1] || 'green') : 'orange'}`} />
                    <Text size='xs' className='status-step-date'>{creationDate}</Text>
                </div>
                <div>
                    <Text size='xs'>{newDescription}</Text>
                </div>
            </div>
        );
    };

    updateChallengeWidget = (data) => {
        this.setState({ challengeWidgetData: data });
    };

    renderContent = () => {
        const { activeTab, tabData, initializedTab, candidate } = this.state;
        const { challenge, opportunity, attitude, overview, questions } = tabData;
        if (!initializedTab[activeTab]) {
            return <Spinner />;
        }
        switch (activeTab) {
            case 'attitude': {
                if (attitude && attitude.done) {
                    const { score: attitudeScore, ranking: { mostOutstanding, bestMatch, playerRanking, modelRanking } } = attitude;
                    const scoreText = this.getScoreText(attitudeScore);
                    const candidateRoots = playerRanking.filter(({ facetName }) => facetName === 'root');
                    const candidateData = candidateRoots.map(({ score }) => score);
                    const modelRoots = modelRanking.filter(({ facetName }) => facetName === 'root');
                    const modelData = modelRoots.map(({ score }) => score);
                    let description = '';
                    if (mostOutstanding && mostOutstanding.domain) {
                        description = getDomain(mostOutstanding.domain).description;
                    }
                    const attitudeRadarData = {
                        labels: [
                            'Neuroticism',
                            'Extraversion',
                            'Openness to experience',
                            'Agreeableness',
                            'Conscientiousness'
                        ],
                        datasets: [
                            {
                                label: 'Candidate',
                                backgroundColor: 'rgba(255,181,0,0.15)',
                                borderColor: '#FFB500',
                                borderWidth: 3,
                                data: candidateData
                            }, {
                                label: 'Model',
                                borderColor: '#8A81E1',
                                backgroundColor: 'transparent',
                                borderWidth: 3,
                                data: modelData
                            }
                            // , {
                            //     label: 'Group',
                            //     borderColor: '#D8D8D8',
                            //     backgroundColor: 'transparent',
                            //     borderWidth: 3,
                            //     data: [52, 84, 86, 102, 75]
                            // }
                        ]
                    };
                    const attitudeRadarOptions = {
                        animation: false,
                        legend: {
                            display: false
                        },
                        scale: {
                            reverse: false,
                            gridLines: {
                                color: '#d1d1d1'
                            },
                            ticks: {
                                beginAtZero: true,
                                max: 120
                            },
                            pointLabels: {
                                fontSize: 14,
                                fontStyle: 'bold',
                                fontColor: '#333333',
                                fontFamily: 'Lato',
                                callback: (label, i, labels) => {
                                    switch (i) {
                                        case 0:
                                            return [label, ' '];
                                        case 1:
                                            return [' ' + label, ' '];
                                        case 2:
                                            return [' ' + label, ' '];
                                        case 3:
                                            return [label + ' ', ' '];
                                        case 4:
                                            return [label + ' ', ' '];
                                        default:
                                            return label;
                                    }
                                }
                            }
                        },
                        tooltips: {
                            mode: 'index',
                            intersect: false,
                            callbacks: {
                                labelColor: (tooltipItem, chart) => {
                                    if (tooltipItem.datasetIndex === 0) {
                                        return {
                                            borderColor: '#FFB500',
                                            backgroundColor: '#FFB500'
                                        };
                                    } else {
                                        return {
                                            borderColor: '#8A81E1',
                                            backgroundColor: '#8A81E1'
                                        };
                                    }
                                }
                            }
                        },
                        hover: {
                            mode: 'x',
                            intersect: false
                        }
                    };
                    const lineData = this.getLineData();
                    const lineOptions = {
                        fillStyle: 'transparent',
                        responsive: true,
                        animation: false,
                        maintainAspectRatio: true,
                        layout: {
                            padding: {
                                right: 20,
                                left: 10
                            }
                        },
                        legend: {
                            display: false
                        },
                        tooltips: {
                            enabled: false,
                            mode: 'index',
                            intersect: false,
                            position: 'nearest'
                        },
                        hover: {
                            mode: 'x',
                            intersect: false
                        },
                        scales: {
                            yAxes: [{
                                stacked: false,
                                ticks: {
                                    min: 0,
                                    stepSize: 5,
                                    fontSize: 12,
                                    fontFamily: 'Lato'
                                }
                            }],
                            xAxes: [{
                                ticks: {
                                    padding: 20,
                                    autoSkip: false,
                                    maxRotation: 90,
                                    minRotation: 90
                                }
                            }]
                        }
                    };
                    return (
                        <div className='attitude-content'>
                            <Header size='sm'>Attitude test · Soft skills</Header>
                            {!!description && <Text size='sm' className='summary'>{description}</Text>}
                            <Grid className='small-graphs-wrapper' style={{ maxWidth: 'unset' }}>
                                <Col className='small-graph-card' md='4'>
                                    <Text bold className='graph-card-title'>MODEL MATCH</Text>
                                    <CircleChart value={attitudeScore} valueString={`${attitudeScore}%`} zindex={1} />
                                    <Header size='sm' style={{ textAlign: 'center' }}>{scoreText}</Header>
                                    <Text size='sm' className='graph-card-subtitle' style={{ textAlign: 'center' }}>{scoreText} similarity with the model</Text>
                                </Col>
                                {mostOutstanding && <Col className='small-graph-card' md='4'>
                                    <Text bold className='graph-card-title'>MOST OUTSTANDING VALUE</Text>
                                    <HalfCircleChart value={mostOutstanding.score} maxValue={120} zindex={1} color='blue' radius={80} />
                                    <Header size='sm' style={{ textAlign: 'center', marginTop: 5 }}>{mostOutstanding.domainName}</Header>
                                    <Text size='sm' className='graph-card-subtitle' style={{ textAlign: 'center' }}>Close to maximum</Text>
                                </Col>}
                                {bestMatch && <Col className='small-graph-card' md='4'>
                                    <Text bold className='graph-card-title'>BEST MATCH VALUE</Text>
                                    <CircleChart value={Math.round(100 - 5 * bestMatch.difference)} valueString={`${Math.round(100 - 5 * bestMatch.difference)}%`} zindex={1} color='pink' />
                                    <Header size='sm' style={{ textAlign: 'center' }}>{bestMatch.facetName}</Header>
                                    <Text size='sm' className='graph-card-subtitle' style={{ textAlign: 'center' }}>Almost exact to the model</Text>
                                </Col>}
                            </Grid>
                            <CrazyCard className='overview-card'>
                                <Text bold className='overview-title'>OVERVIEW</Text>
                                <div className='overview-legend'>
                                    <div className='legend-element'>
                                        <div className='legend-color orange' />
                                        <Text className='legend-text'>Candidate</Text>
                                    </div>
                                    <div className='legend-element'>
                                        <div className='legend-color primary' />
                                        <Text className='legend-text'>Model</Text>
                                    </div>
                                    {/* <div className='legend-element'>
                                        <div className='legend-color lightgrey' />
                                        <Text className='legend-text'>Group</Text>
                                    </div> */}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <Chart
                                        ref='model-comparison-radar'
                                        data={attitudeRadarData}
                                        type='radar'
                                        options={attitudeRadarOptions}
                                    />
                                    {Array(5).fill('').map((ele, index) => {
                                        let style = { position: 'absolute' };
                                        style.top = `calc(54% - 51% * ${Math.sin(2 * Math.PI * (index + 1) / 5 + 0.32)})`;
                                        style.left = `calc(48% - 29% * ${Math.cos(2 * Math.PI * (index + 1) / 5 + 0.32)})`;
                                        return (
                                            <Text bold style={style} key={`radar-${index}`} id={`radar-${index}`}>
                                                <span className='first-number'>{attitudeRadarData.datasets[0].data[index]}</span>
                                                <span className='second-number'>{attitudeRadarData.datasets[1].data[index]}</span>
                                            </Text>
                                        );
                                    })}
                                </div>
                            </CrazyCard>
                            <CrazyCard className='summary-report'>
                                <Text bold className='facets-title'>SUMMARY REPORT</Text>
                                <div className='overview-legend'>
                                    <div className='legend-element'>
                                        <div className='legend-color orange' />
                                        <Text className='legend-text'>Candidate</Text>
                                    </div>
                                    <div className='legend-element'>
                                        <div className='legend-color primary' />
                                        <Text className='legend-text'>Model</Text>
                                    </div>
                                    {/* <div className='legend-element'>
                                        <div className='legend-color lightgrey' />
                                        <Text className='legend-text'>Group</Text>
                                    </div> */}
                                </div>
                                <div style={{ position: 'relative' }}>
                                    <div
                                        style={{ position: 'relative', height: '84%', display: 'flex', top: 72, marginBottom: 72, left: 80, width: '86%', zIndex: '1' }}
                                    >
                                        <Chart
                                            ref='facets-line'
                                            data={lineData}
                                            type='line'
                                            options={lineOptions}
                                        />
                                        {['Neuroticism', 'Extraversion', 'Openness', 'Agreeableness', 'Conscientiousness'].map((domain, i) => (
                                            <div
                                                key={`column_${i}`}
                                                style={{
                                                    width: '17.5%',
                                                    backgroundColor: !(i % 2) && 'rgba(246,246,246,0.7)',
                                                    zIndex: '-1',
                                                    position: 'absolute',
                                                    height: '100%',
                                                    left: `calc(${i} * 17.5% + 7.5%)`
                                                }}
                                            >
                                                <Text size='xs' bold style={{ textAlign: 'center', marginTop: 10 }}>{domain}</Text>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </CrazyCard>
                            <CrazyCard className='detailed-report-card'>
                                <Text bold className='detailed-report-title'>DETAILED REPORT</Text>
                                <div className='overview-legend'>
                                    <div className='legend-element'>
                                        <div className='legend-color orange' />
                                        <Text className='legend-text'>Candidate</Text>
                                    </div>
                                    <div className='legend-element'>
                                        <div className='legend-color primary' />
                                        <Text className='legend-text'>Model</Text>
                                    </div>
                                    {/* <div className='legend-element'>
                                        <div className='legend-color lightgrey' />
                                        <Text className='legend-text'>Group</Text>
                                    </div> */}
                                </div>
                                {this.renderReport()}
                            </CrazyCard>
                        </div>
                    );
                } else {
                    return (
                        <div className='empty-tab-content'>
                            {this.renderEmptyTab('attitude')}
                        </div>
                    );
                }
            }
            case 'challenge': {
                const challengeStep = this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
                if (challenge && challengeStep && challengeStep.enabled.status) {
                    return <ChallengeTabContent {...{
                        challenge,
                        playerAnswer: this.props.playerAnswer,
                        feedReply: this.props.feedReply,
                        opportunity,
                        candidate,
                        fullscreenOpen: this.state.fullscreenOpen,
                        handleCloseFullscreen: this.handleCloseFullscreen,
                        handleOpenFullscreen: this.handleOpenFullscreen,
                        onRefresh: () => this.onRefreshTab('challenge'),
                        updateParent: this.updateChallengeWidget,
                        data: this.state.challengeWidgetData
                    }}
                    />;
                } else {
                    return (
                        <div className='empty-tab-content'>
                            {this.renderEmptyTab('challenge')}
                        </div>
                    );
                }
            }
            case 'overview': {
                const attitudeScore = overview.attitude && overview.attitude.score;
                const positionStr = overview.challenge && overview.challenge.positionStr;
                const cardsData = [candidate.score.motivation, challenge && challenge && challenge.starsScore ? challenge.starsScore : null, attitudeScore, candidate.score.experience];
                const challengeStep = this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
                return (
                    <div className='overview-content'>
                        <Header size='sm' className='overview-content-title'>Overview</Header>
                        <Container fluid style={{ marginTop: 24 }}>
                            <Grid revertMargin>
                                <Col className='overview-summary' lg='4' md='6' sm='12'>
                                    <div className='summary-row' style={{ marginBottom: 5 }}>
                                        <Text bold style={{ fontSize: 12 }}>TOTAL SCORE</Text>
                                        <Header size='lg'>{candidate.score && candidate.score.rank || '-'}</Header>
                                    </div>
                                    <CrazySeparator style={{ margin: '8px auto' }} />
                                    {!!this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE) &&
                                        <div className='summary-row' style={{ marginBottom: 5, marginTop: 5 }}>
                                            <Text bold style={{ fontSize: 12 }}>LEADERBOARD POSITION</Text>
                                            <Header size='lg'>{overview.challenge && challengeStep && challengeStep.status && positionStr ? positionStr : '-'} </Header>
                                        </div>
                                    }
                                    {!!this.state.candidate.getStepData(PROCESS_TYPE_CHALLENGE) && <CrazySeparator style={{ margin: '8px auto' }} />}
                                    <div style={{ marginTop: 14 }}>
                                        <Text bold style={{ fontSize: 12 }}>STATUS</Text>
                                        {this.renderOverviewStatus()}
                                    </div>
                                </Col>
                                <Col lg='8' md='6' sm='12'>
                                    <Row revertMargin>
                                        {this.state.activeTabs.challenge &&
                                            <Col lg='6' xs='12'>
                                                <CrazyCard className='small-graph-card overview-content-card' onClick={() => this.changeTab('motivation')}>
                                                    <Text bold className='overview-summary-title'>ENGAGEMENT SCORE</Text>
                                                    <CircleChart value={cardsData[0]} valueString={`${cardsData[0]}%`} zindex={1} color='orange' />
                                                    <Header size='sm' style={{ textAlign: 'center' }}>{this.getScoreText(cardsData[0])}</Header>
                                                    <Text size='sm' className='graph-card-subtitle crazy-mediumgrey' style={{ textAlign: 'center' }}>
                                                        {candidate.getExperienceSentence(cardsData[0])}
                                                    </Text>
                                                </CrazyCard>
                                            </Col>
                                        }
                                        {this.state.activeTabs.challenge &&
                                            <Col lg='6' xs='12'>
                                                <ChallengeStatusWidget
                                                    candidate={candidate}
                                                    total='1'
                                                    color='orange'
                                                    onClick={() => this.changeTab('challenge')}
                                                    data={this.state.challengeWidgetData}
                                                    updateParent={this.updateChallengeWidget}
                                                    onRefresh={this.props.onRefresh}
                                                />
                                            </Col>
                                        }
                                        {tabData.overview.attitude && tabData.overview.attitude.done &&
                                            <Col lg='6' xs='12'>
                                                <CrazyCard className='small-graph-card overview-content-card' style={{ marginTop: 0 }} onClick={() => this.changeTab('attitude')}>
                                                    <Text bold className='overview-summary-title'>ATTITUDE SCORE</Text>
                                                    <CircleChart value={cardsData[2]} valueString={cardsData[2] ? `${cardsData[2]}%` : '-'} zindex={1} color='orange' />
                                                    <Header size='sm' style={{ textAlign: 'center' }}>{this.getScoreText(cardsData[2])}</Header>
                                                    <Text size='sm' className='graph-card-subtitle crazy-mediumgrey' style={{ textAlign: 'center' }}>
                                                        {candidate.getExperienceSentence(cardsData[2])}
                                                    </Text>
                                                </CrazyCard>
                                            </Col>
                                        }
                                        {this.state.activeTabs.experience &&
                                            <Col lg='6' xs='12'>
                                                <RecruiterExperienceWidget
                                                    candidate={candidate}
                                                    onClick={() => this.changeTab('experience')}
                                                    total='1'
                                                />
                                            </Col>
                                        }
                                    </Row>
                                </Col>
                            </Grid>
                        </Container>
                    </div>
                );
            }
            case 'experience': {
                return <ExperienceTabContent {...{
                    opportunity,
                    candidate: { ...candidate, reviewData: this.state.tabData.experience },
                    open: this.state.fullscreenOpen,
                    handleCloseFullscreen: this.handleCloseFullscreen,
                    handleOpenFullscreen: this.handleOpenFullscreen,
                    user: this.props.user.item,
                    onRefresh: () => this.onRefreshTab('experience')
                }} />;
            }
            case 'motivation': {
                const { motivation } = candidate.score;
                return (<div className='motivation-content'>
                    <Header size='sm'>Engagement</Header>
                    <Text size='sm' className='summary'>We mesure the level of engagement with Artificial Intelligence. Based on users' activity in every different stage of the process, we analyze the number of sessions, frequency and duration to predict the engagement of the user.</Text>
                    <CrazyCard className='small-graph-card' total='3'>
                        <Text bold className='motivation-title'>ENGAGEMENT SCORE</Text>
                        <CircleChart value={motivation} valueString={motivation ? `${motivation}%` : '-'} zindex={1} color='orange' />
                        <Header size='sm' style={{ textAlign: 'center' }}>{this.getScoreText(motivation)}</Header>
                        <Text size='sm' className='graph-card-subtitle crazy-mediumgrey' style={{ textAlign: 'center' }}>
                            {candidate.getExperienceSentence(motivation)}
                        </Text>
                    </CrazyCard>
                </div>);
            }
            case 'questions': {
                if (questions && questions.done) {
                    const { answers } = questions;
                    return (
                        <section className='killer-questions-content'>
                            <Header size='sm'>Questionnaire</Header>
                            {!!answers &&
                                <div className='summary'>
                                    <Text>{`${answers.filter((question) => question.valid).length}/${answers.length} answers are correct`}</Text>
                                </div>
                            }
                            {answers && answers.map((question, index) => {
                                return (
                                    <div className='question-overview' key={`kq_${index}`}>
                                        <Text>{(index + 1) + '.' + question.question}</Text>
                                        <Text bold>
                                            {question.answerBoolean ? 'Yes' : 'No'}
                                            <span>
                                                {question.valid ?
                                                    <i className='fas fa-check-circle fluttrGreen' /> :
                                                    <i className='fas fa-times-circle fluttrRed' />
                                                }
                                            </span>
                                        </Text>
                                    </div>
                                );
                            })}
                        </section>
                    );
                } else {
                    return (<div className='empty-tab-content'>
                        {this.renderEmptyTab('questions')}
                    </div>);
                }
            }
            default: return null;
        }
    };


    render() {
        const sidebarElements = [
            {
                id: 'overview',
                name: 'OVERVIEW',
                action: () => this.changeTab('overview')
            },
            {
                id: 'questions',
                name: 'QUESTIONNAIRE',
                action: () => this.changeTab('questions'),
                disabled: !this.state.activeTabs.questions
            },
            {
                id: 'attitude',
                name: 'ATTITUDE TEST',
                action: () => this.changeTab('attitude'),
                disabled: !this.state.activeTabs.attitude
            },
            {
                id: 'challenge',
                name: 'CHALLENGE',
                action: () => this.changeTab('challenge'),
                disabled: !this.state.activeTabs.challenge
            },
            {
                id: 'motivation',
                name: 'ENGAGEMENT',
                action: () => this.changeTab('motivation'),
                disabled: !this.state.activeTabs.motivation
            },
            {
                id: 'experience',
                name: 'EXPERIENCE',
                action: () => this.changeTab('experience'),
                disabled: !this.state.activeTabs.experience
            }
        ];
        const { activeTab } = this.state;
        const { show } = this.props;
        return (
            <RecruiterCrazyModal
                size='lg'
                show={show}
                className='candidate-modal'
                scrollable={!this.state.fullscreenOpen}
                manageUiFix
            >
                <CrazyContentSidebar elements={sidebarElements} active={activeTab}>
                    <RecruiterCandidateCard
                        cardType='small'
                        onRefresh={this.props.onRefresh}
                        candidate={this.state.candidate}
                        handleOpenFullscreen={() => this.handleOpenFullscreen('cv')}
                    />
                </CrazyContentSidebar>
                <section className='candidate-content'>
                    <div className='close-button-wrapper'>
                        <Text size='sm' onClick={this.onClose} className='close-button'>Close</Text>
                    </div>
                    {this.renderContent()}
                </section>
                {this.state.fullscreenOpen === 'cv' && <FullscreenFile
                    file={this.state.candidate.cv}
                    open={!!this.state.fullscreenOpen}
                    onClose={this.handleCloseFullscreen}
                />}
            </RecruiterCrazyModal>
        );
    }
}

const CandidateChallenge = ({ data: { item: { challenge } }, open, handleOpenFullscreen, handleCloseFullscreen }) => {
    try {
        const playerSubmission = challenge.playerDetails.newsFeed;
        const file = playerSubmission.file && playerSubmission.file.url || null;
        const handleDownloadChallenge = () => {
            if (file) {
                downloadFile(playerSubmission.file.url, '_blank');
            }
        };
        return (
            <div>
                <section className='sub-content'>
                    <Text bold className='sub-section-title' size='xs'>TEXT</Text>
                    <div className='crazy-darkside' dangerouslySetInnerHTML={{ __html: playerSubmission.contentHtml }} />
                </section>
                {file !== null &&
                    <section className='sub-content'>
                        <Text bold className='sub-section-title' size='xs'>ATTACHMENT</Text>
                        <div className='submission-links'>
                            <CrazyButton
                                size='link'
                                text='Download attachment'
                                icon='icon-download'
                                style={{ display: 'block' }}
                                action={handleDownloadChallenge}
                            />
                            <CrazyButton
                                size='link'
                                text='Open full screen'
                                icon='icon-search'
                                action={handleOpenFullscreen}
                                style={{ display: 'block' }}
                            />
                        </div>

                        <FullheightIframe url={playerSubmission.file.url} />
                        {open === 'challenge' &&
                            <FullscreenFile
                                file={playerSubmission.file.url}
                                open={!!open}
                                onClose={handleCloseFullscreen}
                            />}
                    </section>
                }
            </div>
        );
    } catch (e) {
        return null;
    }
};

const ReviewDetail = ({ judge, user, ...review }) => {
    if (judge) {
        return (
            <section className='expert-review-content'>
                <section className='expert-profile'>
                    <div className='expert-details'>
                        <ProfilePic length='45' shape='circle' url={judge.imageUrl} />
                        <div>
                            <Text size='lg'>{judge.completeName}</Text>
                            <Text size='sm' className='crazy-mediumgrey'>{judge.email}</Text>
                        </div>
                    </div>
                    <div>
                        <StarsViewComponent align='right' activeColor='#fdc185' starsWidth={13} starsValue={review.stars} />
                        <Text size='sm'>{getTimeString(review.creation)}</Text>
                    </div>
                </section>
                <section className='review-container'>
                    <Text size='sm' dangerouslySetInnerHTML={{ __html: review.feedbackHtml }} />
                </section>
            </section>
        );
    } else if (user) {
        return (
            <section className='expert-review-content'>
                <section className='expert-profile'>
                    <div className='expert-details'>
                        <ProfilePic length='45' shape='circle' url={user.imageUrl} />
                        <div>
                            <Text size='lg'>{user.completeName}</Text>
                            <Text size='sm'>{user.email}</Text>
                        </div>
                    </div>
                    <div>
                        <StarsViewComponent activeColor='#fdc185' starsWidth={13} starsValue={review.stars} />
                    </div>
                </section>
                <section className='review-container'>
                    <Text size='sm' dangerouslySetInnerHTML={{ __html: review.contentHtml }} />
                </section>
            </section>
        );
    }
};

const ChallengeTabContent = ({
    challenge,
    playerAnswer,
    opportunity,
    candidate,
    fullscreenOpen,
    handleCloseFullscreen,
    handleOpenFullscreen,
    onRefresh,
    updateParent,
    data
}) => {
    const challengeScore = challenge;
    const { numDoneReviews, numTotalReviews } = candidate.score;
    const allExpertsReview = numDoneReviews === numTotalReviews;
    const remainingReviews = numTotalReviews - numDoneReviews;
    const testStatus = <span>{candidate.getStatusText(candidate.statusTypes.challenge)}</span>;
    const positionText = candidate.challengeStatus.enabled && challenge.position ? candidate.getPositionText(challenge.position, opportunity.applied) : null;
    const handleOpenChallenge = () => {
        handleOpenFullscreen('challenge');
    };
    return (
        <div className='tab-content'>
            <Text size='sm'>Test status: {testStatus}</Text>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Header size='sm' className='challenge-title'>Challenge review</Header>
                {candidate.challengeStatus.done && checkAllObjectParams(playerAnswer, 'item', 'challenge', 'playerDetails', 'newsFeed', 'file') &&
                    <Text className='see-answer' onClick={handleOpenChallenge}>See challenge answer</Text>
                }
            </div>
            <Container fluid>
                <Grid revertMargin style={{ marginTop: 24 }} className='small-graphs-wrapper'>
                    <Col md='4'>
                        <ChallengeStatusWidget
                            candidate={candidate}
                            onRefresh={onRefresh}
                            color='orange'
                            total='1'
                            updateParent={updateParent}
                            data={data}
                        />
                    </Col>

                    {candidate.challengeStatus.done &&
                        <Col md='4'>
                            <CrazyCard style={{ marginBottom: 0 }}>
                                <Text size='xs' bold className='graph-card-title'>CHALLENGE POSITION</Text>
                                <HalfCircleChart
                                    value={challenge.positionStr}
                                    maxValue={opportunity.applied}
                                    zindex={1}
                                    color='blue'
                                    hidden
                                    separator='of '
                                />
                                <Text size='sm' className='crazy-mediumgrey' style={{ textAlign: 'center', marginBottom: 7 }}>{positionText}</Text>
                            </CrazyCard>
                        </Col>
                    }
                    {candidate.challengeStatus.done &&
                        <Col md='4'>
                            <CrazyCard>
                                <Text size='xs' bold className='graph-card-title' style={{ marginBottom: 4 }}>ASSESSMENT STATUS</Text>
                                <DividedCircle
                                    value={challengeScore.judgeReviews.length}
                                    maxValue={opportunity.experts.number}
                                    separator=' of '
                                    zindex={1}
                                    color='pink'
                                />
                                <Header size='sm' style={{ textAlign: 'center' }}>{allExpertsReview && 'Completed' || 'Assessing'}</Header>
                                <Text size='sm' className='graph-card-subtitle crazy-mediumgrey' style={{ textAlign: 'center' }}>
                                    {allExpertsReview &&
                                        'All experts reviewed the submision' ||
                                        `${remainingReviews} pending review${remainingReviews > 1 ? 's' : ''} from your experts.`
                                    }
                                </Text>
                            </CrazyCard>
                        </Col>

                    }
                </Grid>
            </Container>
            {challengeScore.judgeReviews && !!challengeScore.judgeReviews.length &&
                <div className='content-card'>
                    <Text bold size='xs' className='detailed-report-title'>
                        REVIEWS FOR THE HIRING TEAM
                    </Text>
                    {challengeScore.judgeReviews.map((review) => <ReviewDetail key={`rev_${review.id}`} {...review} />)}
                </div>
            }
            {candidate.challengeStatus.done &&
                <AsynchContainer data={playerAnswer}>
                    <ChallengeFeedItem candidate={candidate} />
                </AsynchContainer>
            }
            {candidate.challengeStatus.done &&
                <div className='content-card willchange'>
                    <Text bold className='detailed-report-title' size='xs'>CHALLENGE ANSWER</Text>
                    <AsynchContainer data={playerAnswer}>
                        <CandidateChallenge
                            open={fullscreenOpen}
                            handleCloseFullscreen={handleCloseFullscreen}
                            handleOpenFullscreen={handleOpenChallenge}
                        />
                    </AsynchContainer>
                </div>
            }
        </div>
    );
};

const ExperienceTabContent = ({ opportunity, candidate, handleOpenFullscreen, user, onRefresh }) => {
    function handleDownloadCv() {
        downloadFile(candidate.cv, '_blank');
    }
    const currentUser = user;
    const { reviewData: { reviews: reviewsList } } = candidate;
    const teamReviews = reviewsList.filter((review) => review.user.id !== currentUser.id);
    const handleOpenCv = () => {
        handleOpenFullscreen('cv');
    };
    return (
        <div className='tab-content'>
            <Header size='sm' className='tab-title'>Experience - CV</Header>
            <div className='small-graphs-wrapper'>
                <RecruiterExperienceWidget candidate={candidate} />
                <RecruiterReviewWidget onRefresh={onRefresh} candidate={candidate} />
            </div>
            {teamReviews && !!teamReviews.length &&
                <div className='content-card'>
                    <Text bold className='detailed-report-title'>REVIEWS</Text>
                    {teamReviews.map((review) => <ReviewDetail key={`rev_${review.id}`} {...review} />)}
                </div>
            }
            <div className='content-card'>
                <Text bold className='detailed-report-title' size='xs'>CV</Text>
                <section className='sub-section'>
                    <div className='submission-links'>
                        <CrazyButton size='link' text='Download attachment' icon='icon-download' action={handleDownloadCv} style={{ display: 'block' }} />
                        <CrazyButton size='link' text='Open full screen' icon='icon-search' action={handleOpenCv} style={{ display: 'block' }} />
                    </div>
                    <FullheightIframe url={candidate.cv} />
                </section>
            </div>
        </div>
    );
};

@connect(({ playerAnswer, feedReply }) => ({ playerAnswer, feedReply }))
class ChallengeFeedItem extends Component {

    state = {
        completeFeedLoaded: false,
        showMore: false,
        loading: false
    };

    componentDidMount() {
        this.props.dispatch(resetReplyList(this.callApi));
    }

    callApi = (page = 0, options = { size: 2 }, onSuccess) => {
        const id = this.props.playerAnswer.item.challenge.playerDetails.newsFeedId;
        this.props.dispatch(fetchReplyList(id, page, options, onSuccess));
    };

    onLoadAll = () => {
        if (!this.state.loading) {
            if (!this.state.completeFeedLoaded) {
                this.setState({ loading: true });
                const { feedReply: { item: feed } } = this.props;
                const options = {
                    size: feed.totalElements - feed.size
                };
                this.callApi(1, options, () => {
                    this.setState({
                        showMore: true,
                        completeFeedLoaded: true,
                        loading: false
                    });
                });
            } else {
                this.setState({
                    showMore: !this.state.showMore
                });
            }
        }
    };

    renderFeedItem = ({ user: { imageUrl, id, player: isPlayer, hidePlayer, completeName: name, nickname }, contentHtml, creation }) => {
        return (
            <div className='challenge-feed-item'>
                {isPlayer ?
                    <CrazyIcon icon='icon-arrow-right' className='crazy-primary' /> :
                    <ProfilePic url={imageUrl} shape='circle' length='28' />
                }
                <div className='feed-content'>
                    <Text size='sm' bold>{`${isPlayer && hidePlayer ? nickname : name}${isPlayer ? ' (Candidate)' : ''}`}</Text>
                    <Text size='sm' dangerouslySetInnerHTML={{ __html: contentHtml }} />
                </div>
                <Text className='challenge-feed-date' size='sm'>{getTimeString(creation)}</Text>
            </div>
        );
    };

    render() {
        let { feedReply: list } = this.props;
        list = JSON.parse(JSON.stringify(list));
        if (!this.state.showMore && this.state.completeFeedLoaded) {
            const [a, b] = list.item.content;
            list.item.content = [a, b];
        }
        if (list && list.item && list.item.content.length > 0) {
            return (
                <div className='content-card challenge-tab-feed'>
                    <Text size='xs' bold>
                        CONVERSATION WITH THE CANDIDATE
                    </Text>
                    <div className='challenge-tab-feed-content'>
                        <AsyncList onCreateItem={this.renderFeedItem} data={list} showHeader={false} />
                    </div>
                    {list && list.item && list.item.totalPages > 1 ? !this.state.loading &&
                        <Text size='xs' className='crazy-mediumgrey show-more-button' onClick={this.onLoadAll}>
                            {this.state.showMore && !this.state.loading && <span>Show first comments <CrazyIcon icon='icon-arrow-drop-up' /></span>}
                            {!this.state.showMore && !this.state.loading && <span>Show all comments <CrazyIcon icon='icon-arrow-drop-down' /></span>}
                        </Text>
                        : null
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}