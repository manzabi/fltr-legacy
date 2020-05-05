import React, { Component } from 'react';
import { connect } from 'react-redux';

import {
    confirmChallengeConfiguration, getOpportunityById, enableCv, enablePhone
} from '../../../redux/actions/recruiterOpportunityActions';

import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import { Header, Text } from '../../../layout/FluttrFonts';

import Datetime from 'react-datetime';
import { getSafeDate } from '../../../common/timerUtils';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { CrazyCheckBox, CrazyRadioButton } from '../../../layout/uiUtils/inputControls';
import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import CrazyBubblesInput from '../../../layout/fields/CrazyBubblesInput';
import ProfilePic from '../../../layout/uiUtils/ProfilePic';
import CrazyField from '../../../layout/fields/CrazyFields';
import CrazyDropdown from '../../../layout/dropdown/Dropdown';
import { CHALLENGE_DURATION } from '../../../constants/challengeDuration';
import { manageError } from '../../../common/utils';

import { updateChallengeSettings, updateTeamSettings, updateTeamMemberSettings } from '../../../redux/actions/opportunityActions';
import { INVITED, TO_INVITE, DECLINED, EXPIRED, ACCEPTED } from '../../../constants/opportunityJudgeStatus';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import OpportunityConfigurationDetailPage from './OpportunityConfigurationDetails';
import Row from '../../../layout/layout/Row';
import SectionContainer from '../../../common/components/dummy/SectionContainer';

export const COLUMN_LEFT = 4;
export const COLUMN_RIGHT = 8;

@connect((state) => state)
export default class OpportunityChallengeConfigurationSummaryComponent extends Component {
    constructor(props) {
        super(props);
        const isFirstJob = this.props.user.item.recruiterDetails.talenQuest === 1 ? true : false;
        this.state = {
            isFirstJob: isFirstJob
        };
    }

    onSubmitConfirm = (data) => {
        let id = this.props.opportunity.id;
        this.props.dispatch(confirmChallengeConfiguration(id, data, this.onConfirmOk, this.onError));
    };

    onError = (error) => {
        manageError(error, 'errorChallengeConfig');
    };

    onAutoUpdateSuccess = () => {
        const { id: opportunityId } = this.props.opportunity;
        this.props.dispatch(getOpportunityById(opportunityId));
    }

    render() {
        const { context } = this.props;
        if (context === 'team') {
            return (
                <TeamConfigurationComponent
                    onSubmitConfirm={this.onSubmitConfirm}
                    opportunity={this.props.opportunity}
                    user={this.props.user.item}
                    context={this.props.context}
                    onUpdate={this.onAutoUpdateSuccess}
                />
            );
        } else {
            return (
                <SettingsConfigurationComponent
                    onSubmitConfirm={this.onSubmitConfirm}
                    opportunity={this.props.opportunity}
                    user={this.props.user.item}
                    context={this.props.context}
                    onUpdate={this.onAutoUpdateSuccess}
                />
            );
        }
    }

}

@connect(({ dispatch }) => ({ dispatch }))
class TeamConfigurationComponent extends Component {
    constructor(props) {
        super(props);
        const data = props.opportunity.recruiterDetail.configuration;
        let ownExpert = false;
        let addExperts = false;
        let ownHiring = false;
        let addHiring = false;
        const showExperts = data.configurationExpert !== null;
        const showHiring = data.configurationMember !== null;
        const experts = !showExperts ? [] : [
            ...data.configurationExpert.experts.map((expert) => {
                const { user, status, statusString } = expert;
                let userData;
                if (user) { userData = { id: user.id, name: user.name, surname: user.surname, logo: user.imageUrl, email: user.email }; }
                else { userData = { email: expert.email, name: '', surname: '' }; }
                const isMe = userData.id === props.user.id;
                if (isMe) { ownExpert = true; }
                else { addExperts = true; }
                return { me: isMe, status, statusString, ...userData };
            })
        ];
        const members = !showHiring ? [] : [
            ...data.configurationMember.members.map((member) => {
                const { user, status, statusString } = member;
                let userData;
                if (user) { userData = { id: user.id, name: user.name, surname: user.surname, logo: user.imageUrl, email: user.email }; }
                else { userData = { email: member.email, name: '', surname: '' }; }
                const isMe = userData.id === props.user.id;
                if (isMe) { ownHiring = true; }
                else { addHiring = true; }
                return { me: isMe, status, statusString, ...userData };
            })
        ];
        const externalExpert = data.configurationExpert && data.configurationExpert.external || false;
        this.state = {
            expertModalStatus: false,
            emailInput: '',
            showExperts,
            showHiring,
            formData: {
                ownExpert,
                addExperts,
                experts,
                externalExpert,
                members,
                ownHiring,
                addHiring
            }
        };
    }

    componentWillReceiveProps(nextProps) {
        const nextData = nextProps.opportunity.recruiterDetail.configuration;
        const prevData = this.props.opportunity.recruiterDetail.configuration;
        if (nextData.update !== prevData.update) {
            let ownExpert = false;
            let addExperts = false;
            let ownHiring = false;
            let addHiring = false;
            const showExperts = nextData.configurationExpert !== null;
            const showHiring = nextData.configurationMember !== null;
            const experts = !showExperts ? [] : [
                ...nextData.configurationExpert.experts.map((expert) => {
                    const { user, status, statusString } = expert;
                    let userData;
                    if (user) { userData = { id: user.id, name: user.name, surname: user.surname, logo: user.imageUrl, email: user.email }; }
                    else { userData = { email: expert.email, name: '', surname: '' }; }
                    const isMe = userData.id === nextProps.user.id;
                    if (isMe) { ownExpert = true; }
                    else { addExperts = true; }
                    return { me: isMe, status, statusString, ...userData };
                })
            ];
            const members = !showHiring ? [] : [
                ...nextData.configurationMember.members.map((member) => {
                    const { user, status, statusString } = member;
                    let userData;
                    if (user) { userData = { id: user.id, name: user.name, surname: user.surname, logo: user.imageUrl, email: user.email }; }
                    else { userData = { email: member.email, name: '', surname: '' }; }
                    const isMe = userData.id === nextProps.user.id;
                    if (isMe) { ownHiring = true; }
                    else { addHiring = true; }
                    return { me: isMe, status, statusString, ...userData };
                })
            ];
            const externalExpert = nextData.configurationExpert && nextData.configurationExpert.external || false;
            this.setState({
                showExperts,
                showHiring,
                formData: {
                    ...this.state.formData,
                    externalExpert,
                    experts,
                    members,
                    ownExpert,
                    ownHiring,
                    addExperts,
                    addHiring
                }
            });
        }

    }

    handleOpenExpertModal = () => {
        this.setState({
            expertModalStatus: true
        });
    };

    handleOpenMemberModal = () => {
        this.setState({
            memberModalStatus: true
        });
    };

    handleCloseExpertModal = () => {
        this.setState({
            expertModalStatus: false
        });
    };

    handleCloseMemberModal = () => {
        this.setState({
            memberModalStatus: false
        });
    };

    handleAutoUpdate = (formNumber) => {
        this.handleSubmit(formNumber);
    };

    onAutoUpdateError = () => {
        const error = new Error('Error on auto update team data');
        const { formData } = this.state;
        if (window.Raven) {
            window.Raven.captureException(error, {
                extra: {
                    formData
                }
            });
        }
    };

    handleSubmit = (formNumber) => {
        const { id: opportunityId } = this.props.opportunity;
        if (formNumber === 1) {
            const expertList = this.state.formData.experts.map((expert) => {
                if (expert.id) {
                    const { id, email, name, surname } = expert;
                    return { id, email, name, surname };
                } else {
                    const { email } = expert;
                    return { email };
                }
            });
            const { externalExpert } = this.state.formData;
            const formData = {
                expertList,
                externalExpert
            };
            this.props.dispatch(updateTeamSettings(opportunityId, formData, this.props.onUpdate, this.onAutoUpdateError));
        } else if (formNumber === 2) {
            const memberList = this.state.formData.members.map((member) => {
                if (member.id) {
                    const { id, email, name, surname } = member;
                    return { id, email, name, surname };
                } else {
                    const { email } = member;
                    return {
                        email
                    };
                }
            });
            const formData2 = {
                memberList
            };
            this.props.dispatch(updateTeamMemberSettings(opportunityId, formData2, this.props.onUpdate, this.onAutoUpdateError));
        }
    };

    handleChangeCheckbox = ({ id, value }) => {
        const firstForm = ['ownExpert', 'addExperts', 'externalExpert'];
        const secondForm = ['ownMember', 'addMembers'];
        let formNumber;
        if (firstForm.includes(id)) {
            formNumber = 1;
        } else if (secondForm.includes(id)) {
            formNumber = 2;
        }

        switch (id) {
            case 'ownExpert': {
                this.handleOwnExpertChange({ value });
                break;
            }
            case 'ownMember': {
                this.handleOwnMemberChange({ value });
                break;
            }
            default: {
                this.setState({
                    formData: {
                        ...this.state.formData,
                        [id]: value
                    }
                }, () => { this.handleAutoUpdate(formNumber); });
            }
        }
    };

    handleOwnExpertChange = ({ value }) => {
        if (value) {
            const { id, completeName: name, imageUrl: logo, email } = this.props.user;
            const user = { me: true, id, name, logo, email };
            const newExperts = [...this.state.formData.experts, user];
            this.setState({
                formData: {
                    ...this.state.formData,
                    experts: newExperts,
                    ownExpert: true
                }
            }, () => { this.handleAutoUpdate(1); });
        } else {
            const experts = this.state.formData.experts.filter((expert) => expert.me !== true);
            this.setState({
                formData: {
                    ...this.state.formData,
                    experts,
                    ownExpert: false
                }
            }, () => { this.handleAutoUpdate(1); });
        }
    };

    handleOwnMemberChange = ({ value }) => {
        if (value) {
            const { id, completeName: name, imageUrl: logo, email } = this.props.user;
            const user = { me: true, id, name, logo, email };
            const newMembers = [...this.state.formData.members, user];
            this.setState({
                formData: {
                    ...this.state.formData,
                    members: newMembers,
                    ownMember: true
                }
            }, () => { this.handleAutoUpdate(2); });
        } else {
            const members = this.state.formData.members.filter((member) => member.me !== true);
            this.setState({
                formData: {
                    ...this.state.formData,
                    members,
                    ownMember: false
                }
            }, () => { this.handleAutoUpdate(2); });
        }
    };

    handleAddExpert = (experts) => {
        this.setState({
            emailInput: '',
            formData: {
                ...this.state.formData,
                experts
            }
        }, () => { this.handleAutoUpdate(1); });
    };

    handleAddMember = (members) => {
        this.setState({
            emailInput: '',
            formData: {
                ...this.state.formData,
                members
            }
        }, () => { this.handleAutoUpdate(2); });
    };

    onSaveTeamSettings = () => {
        return;
    }

    render() {
        return (
            <SectionContainer className='challenge-team-configuration'>
                {this.state.showExperts &&
                    <Row revertMargin>
                        <Header className='title' size='sm'>Assessment experts</Header>
                        <Text size='sm' style={{ margin: 0 }}>The experts will assess the answers and give score to the candidates. They will not know the identity of the candidates, they will only evaluate the test. Experts will also receive notifications of new answer submissions and reminders to assess the submissions.</Text>
                        <label htmlFor='ownExpert'>
                            <Col xs='12' ref='ownExperts' className='assign-myself'>
                                <CrazyTooltip
                                    color='darkside'
                                    messageChildren={<Text bold className='team-tooltip' style={{ fontSize: 11 }}>You'll receive notifications of new
                                        answer submitions and reminders
                                        to assess the submitions. To
                                        remove you from this role you
                                        need to add members to the team.</Text>}
                                >
                                    <CrazyCheckBox
                                        onChange={this.handleChangeCheckbox}
                                        label=' I’ll assess the challenge answers by myself'
                                        id='ownExpert'
                                        checked={this.state.formData.ownExpert}
                                    />
                                </CrazyTooltip>
                            </Col>
                        </label>
                        <ExpertList list={this.state.formData.experts} own />
                        <label className='special-wrapper' htmlFor='addExperts' onClick={() => { if (!this.state.formData.addExperts || this.state.formData.experts.some((expert) => !expert.me)) { this.handleOpenExpertModal(); } }}>
                            <Col xs='12' ref='internalExperts' className='assign-people'>
                                <CrazyCheckBox
                                    label=' I want to assign people to assess the answers'
                                    id='addExperts'
                                    checked={this.state.formData.experts.some((experts) => !experts.me) || (!this.state.formData.experts.some((experts) => !experts.me) && this.state.formData.experts.length > 1)}
                                    manually
                                />
                                <Text
                                    bold
                                    style={{ fontSize: 12 }}
                                    className='add-members-button'
                                >manage members</Text>
                            </Col>
                            <ExpertList list={this.state.formData.experts} external />
                        </label>
                        <div>
                            <label htmlFor='externalExpert' style={{ marginBottom: 10 }}>
                                <Col xs='12' ref='externalExperts' className='assign-external-experts'>
                                    <CrazyCheckBox
                                        onChange={this.handleChangeCheckbox}
                                        label=' I want Fluttr experts to assess the answers'
                                        id='externalExpert'
                                        checked={this.state.formData.externalExpert}
                                    />
                                    <div className='pro-tag'><Text>PRO</Text></div>
                                </Col>
                            </label>
                            <Text style={{ fontSize: 12, marginLeft: 34 }}>Professionals with a qualified experience will assess the submissions, giving feedback to all candidates and saving to you and company a lot of time. By checking this box we will contact you by email with more details.</Text>
                        </div>
                        <div className='separator' style={{ marginBottom: 30 }} />
                    </Row>
                }
                {this.state.showHiring &&
                    <Row revertMargin>
                        <Header className='title' size='sm'>Hiring members</Header>
                        <Text size='sm'>The hiring members will have access to all test process, candidates details,
                            submission answers, assessment scores, notes and candidate leaderboard. They will not be
                            requiered to assess and give a score to candidate answers.</Text>
                        <label htmlFor='ownMember'>
                            <Col xs='12' ref='ownMembers' className='assign-myself'>
                                <CrazyCheckBox
                                    onChange={this.handleChangeCheckbox}
                                    label=' I’m a hiring member'
                                    id='ownMembers'
                                    checked={this.state.formData.ownHiring}
                                    disabled={this.state.formData.ownHiring}
                                />
                            </Col>
                        </label>
                        <ExpertList list={this.state.formData.members} own />
                        <label htmlFor='addMembers' className='special-wrapper' onClick={() => {
                            if (!this.state.formData.addHiring || this.state.formData.members.some((member) => !member.me)) { this.handleOpenMemberModal(); }
                        }}>
                            <Col xs='12' ref='internalMembers' className='assign-people'>
                                <CrazyCheckBox
                                    label=' I want to add people as a hiring members'
                                    id='addMembers'
                                    checked={this.state.formData.members.some((members) => !members.me) || (!this.state.formData.members.some((members) => !members.me) && this.state.formData.members.length > 1)}
                                    manually
                                />
                                <Text
                                    bold
                                    style={{ fontSize: 12 }}
                                    className='add-members-button'
                                >manage members</Text>
                            </Col>
                            <ExpertList list={this.state.formData.members} external />
                        </label>
                    </Row>
                }
                <ExpertManagementModal
                    handleAddExpert={this.handleAddExpert}
                    expertModalStatus={this.state.expertModalStatus}
                    handleCloseExpertModal={this.handleCloseExpertModal}
                    experts={this.state.formData.experts}
                    type='expert'
                />
                <ExpertManagementModal
                    handleAddExpert={this.handleAddMember}
                    expertModalStatus={this.state.memberModalStatus}
                    handleCloseExpertModal={this.handleCloseMemberModal}
                    experts={this.state.formData.members}
                    type='member'
                />
            </SectionContainer>
        );
    }
}

@connect(({ dispatch }) => ({ dispatch }))
class SettingsConfigurationComponent extends Component {
    constructor(props) {
        super(props);
        const data = props.opportunity.recruiterDetail.configuration;
        const addTimeline = data.configurationTimeline !== null;
        const hoursCompleteTest = addTimeline ? data.configurationTimeline.hoursSubmission : CHALLENGE_DURATION[0].value;
        const initialData = this.getInitialData(props);
        const { enablecv: cvRequired = false, enablephone: phoneRequired = false } = props.opportunity.commonDetail;
        this.state = {
            ...initialData,
            expertModalStatus: false,
            updatePositionTitle: false,
            emailInput: '',
            formData: {
                hoursCompleteTest,
            },
            addTimeline,
            whoCanParticipate: null,
            cvRequired,
            phoneRequired
        };
    }

    getInitialData = (props) => {
        const data = props.opportunity.recruiterDetail.configuration;
        let expireSafeDate = getSafeDate(data.expire.expireDate);
        if (data.expire.isExpireDate) {
            expireSafeDate = getSafeDate(data.expire.expireDate);
        }
        return {
            date: this.getRightDate(props),
            dateDefault: this.getRightDateForInit(props),
            checkDate: expireSafeDate
        };

    };

    onChangeDate = (moment) => {
        this.setState({
            date: moment.format('DD/MM/YYYY'),
        }, () => { this.handleAutoUpdate(); });
    }

    getRightDate = (props) => {
        const data = props.opportunity.recruiterDetail.configuration;
        if (data.expire.isExpireDate) {
            return getSafeDate(data.expire.expireDate).format('DD/MM/YYYY');
        } else {
            return new moment().format('DD/MM/YYYY');
        }
    };

    getRightDateForInit = (props) => {
        const data = props.opportunity.recruiterDetail.configuration;
        if (data.expire.isExpireDate) {
            return getSafeDate(data.expire.expireDate);
        } else {
            return new moment();
        }
    };

    validDateInCalendar = (current) => {
        let now = Datetime.moment();
        return now.isBefore(current);
    };

    handleAutoUpdate = () => {
        this.handleSubmit();
    };

    handleSubmit = () => {
        const { hoursCompleteTest } = this.state.formData;
        const formData = {
            dateChallengeEnd: moment(this.state.date, 'DD/MM/YYYY').format('YYYY-MM-DD'),
            hoursCompleteTest
        };
        const { id: opportunityId } = this.props.opportunity;
        this.props.dispatch(updateChallengeSettings(opportunityId, formData, this.props.onUpdate));
    };

    handleSubmitRadio = (parameter) => {
        const value = this.state[parameter];
        const { id: opportunityId } = this.props.opportunity;
        switch (parameter) {
            case 'cvRequired': {
                this.props.dispatch(enableCv(opportunityId, value, this.props.onUpdate));
                break;
            }
            case 'phoneRequired': {
                this.props.dispatch(enablePhone(opportunityId, value, this.props.onUpdate));
                break;
            }
            default: {
                return null;
            }
        }
    };

    handleChangePlayerTime = ({ value: hoursCompleteTest }) => {
        this.setState({
            formData: {
                ...this.state.formData,
                hoursCompleteTest
            }
        }, () => { this.handleAutoUpdate(); });
    };

    onRadioChange = (type, id) => {
        this.setState({ [type]: id }, () => { this.handleSubmitRadio(type); });
    };

    render() {
        return (
            <SectionContainer className='challenge-configuration-summary'>
                <Header className='title' size='sm'>Test settings</Header>
                <Row revertMargin>
                    {this.state.addTimeline &&
                        [
                            <Text bold>Time to submit the answer</Text>,
                            <div className='time-wrapper'>
                                <Text size='sm'>Total hours to complete the test</Text>
                                <CrazyTooltip
                                    color='darkside'
                                    messageChildren={<Text style={{ fontSize: 11 }} bold className='settings-tooltip'>Time for the candidate to complete
                                        the challenge. The more time the
                                        higher the response rate.</Text>}
                                >
                                    <CrazyDropdown
                                        options={CHALLENGE_DURATION}
                                        value={this.state.formData.hoursCompleteTest}
                                        onChange={this.handleChangePlayerTime}
                                        icon={null}
                                    />
                                </CrazyTooltip>
                            </div>
                        ]
                    }
                    <div className='time-wrapper' style={{ marginBottom: 26 }}>
                        <Text style={{ marginRight: 23 }} size='sm'>Limit date to submit the answers </Text>
                        <CrazyTooltip
                            color='darkside'
                            position='bottom'
                            messageChildren={<Text style={{ fontSize: 11 }} bold className='settings-tooltip'>At 23:59 the challenge will be closed
                                        and candidates won't be able to
                                        submit their answers. We'll send
                                            reminders to keep them on time!</Text>}
                        >
                            <Datetime
                                isValidDate={this.validDateInCalendar}
                                dateFormat="DD/MM/YYYY"
                                onChange={this.onChangeDate}
                                timeFormat={false}
                                defaultValue={this.state.dateDefault}
                                closeOnSelect={true}
                            />
                        </CrazyTooltip>
                    </div>
                    <div className='separator' />
                </Row>
                <Text bold style={{ marginTop: 20 }}>Candidate CV</Text>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, height: 60 }}>
                    <CrazyRadioButton
                        id='CvNotRequired'
                        label='Candidate’s CV is not required.'
                        onChange={() => { this.onRadioChange('cvRequired', false); }}
                        checked={!this.state.cvRequired}
                    />
                    <CrazyRadioButton
                        id='CvRequired'
                        label='Candidate’s CV is required.'
                        onChange={() => { this.onRadioChange('cvRequired', true); }}
                        checked={this.state.cvRequired}
                    />
                </div>
                <div className='separator' />
                <Text bold style={{ marginTop: 20 }}>Candidate phone number</Text>
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, height: 60 }}>
                    <CrazyRadioButton
                        id='PhoneNotRequired'
                        label='Candidate’s phone number is not required.'
                        onChange={() => { this.onRadioChange('phoneRequired', false); }}
                        checked={!this.state.phoneRequired}
                    />
                    <CrazyRadioButton
                        id='PhoneRequired'
                        label='Candidate’s phone number is required.'
                        onChange={() => { this.onRadioChange('phoneRequired', true); }}
                        checked={this.state.phoneRequired}
                    />
                </div>
                <div className='separator' />
                <OpportunityConfigurationDetailPage opportunity={this.props.opportunity} />
                {/*
                    <Text bold style={{ marginTop: 20 }}>Who can participate?</Text>
                    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 20, height: 60 }}>
                        <CrazyRadioButton
                            id='private'
                            label=' Private test. Only candidates with invitation can participate'
                            onChange={() => { this.onRadioChange('whoCanParticipate', 'private'); }}
                            checked={this.state.whoCanParticipate === 'private'}
                        />
                        <CrazyRadioButton
                            id='open'
                            label='Open test. Candidates with or within invitation can participate'
                            onChange={() => { this.onRadioChange('whoCanParticipate','open'); }}
                            checked={this.state.whoCanParticipate === 'open'}
                        />
                    </div>
                    <div className='separator' />
                */}
            </SectionContainer>
        );
    }
}

class ExpertManagementModal extends Component {
    constructor(props) {
        super(props);
        this.state = {
            expertList: [],
            email: ''
        };
    }

    handleChangeInput = (id, value) => {
        this.setState({ email: value });
    };

    handleSubmit = () => {
        switch (this.props.type) {
            case 'expert':
                this.handleAddExperts();
                break;
            case 'member':
                this.handleAddMembers();
                break;
            default:
                return;
        }
    };

    handleAddExperts = () => {
        const { experts } = this.props;
        const expertList = [
            ...experts,
            ...this.state.expertList.map((expert) => ({ email: expert, name: '', surname: '', status: 0, statusString: 'to invite' }))
        ];
        this.props.handleAddExpert(expertList);
        this.props.handleCloseExpertModal();
        this.setState({ expertList: [] });
    };

    handleAddMembers = () => {
        const { experts } = this.props;
        const memberList = [
            ...experts,
            ...this.state.expertList.map((member) => ({ email: member, name: '', surname: '', status: 0, statusString: 'to invite' }))
        ];
        this.props.handleAddExpert(memberList);
        this.props.handleCloseExpertModal();
        this.setState({ expertList: [] });
    };

    handleChangeExperts = (expertList) => {
        this.props.handleAddExpert(expertList);
    };

    handleEnter = (expertList) => {
        this.setState({ expertList });
    };

    render() {
        return (
            <RecruiterCrazyModal
                show={this.props.expertModalStatus}
                onCloseButton={this.props.handleCloseExpertModal}
                className='add-members-modal'
                title='Assessment team members'
                size='md'
            >
                <Grid className='add-members-modal-children'>
                    <Text style={{ fontSize: 12 }}>Members <span>(one member minimum required)</span></Text>
                    <ExpertList
                        list={this.props.experts}
                        removable
                        handleRemoveExpert={this.handleChangeExperts}
                    />
                    <div className='separator' />
                    <Text style={{ fontSize: 12 }}>Add more members to assess the process</Text>
                    <CrazyBubblesInput
                        enterAction={this.handleEnter}
                        id='expertList'
                        list={this.state.expertList}
                        validation='email'
                        placeholder='Text emails'
                    />
                    <Col xs='12'>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                            <Text style={{ fontSize: 12 }}>
                                The invitation will be sent when the test goes active
                            </Text>
                            <CrazyButton
                                text='Add members'
                                size='small'
                                action={this.handleSubmit}
                                disabled={!this.state.expertList.length}
                                style={{ whiteSpace: 'nowrap' }}
                            />
                        </div>
                    </Col>
                </Grid>
            </RecruiterCrazyModal>
        );
    }
}

class ExpertList extends Component {

    state = {
        markedToRemove: []
    };

    handleSetRemoveExpert = (expert) => {
        this.setState({ markedToRemove: [...this.state.markedToRemove, { ...expert, validationField: '' }] });
    };

    isMarkedToRemove = (expert) => {
        const markedToRemove = this.state.markedToRemove.filter(({ email }) => expert.email === email)[0];
        if (markedToRemove) {
            return (
                <div className='remove-expert-section'>
                    <Text style={{ fontSize: 12 }}>Are you sure to remove this member? Please type the email address to remove</Text>
                    <div className='field-and-buttons-wrapper'>
                        <CrazyField
                            onFieldChange={(field, value) => this.handleChangeRemoveExpertField(value, expert)}
                            text={markedToRemove.validationField}
                            placeholder=''
                            label={null}
                        />
                        <div className='buttons-wrapper'>
                            <Text
                                bold
                                style={{ fontSize: 12 }}
                                onClick={() => this.handleCancelRemove(expert)}
                            >cancel</Text>
                            <Text
                                bold
                                style={{ fontSize: 12 }}
                                onClick={() => { if (markedToRemove.email === markedToRemove.validationField) { this.handleConfirmRemove(expert); } }}
                                className={markedToRemove.email !== markedToRemove.validationField ? 'disabled' : ''}
                            >remove</Text>
                        </div>
                    </div>
                </div>
            );
        } else { return null; }
    };

    handleChangeRemoveExpertField = (value, expert) => {
        const expertsToRemove = this.state.markedToRemove;
        const expertToUpdate = expertsToRemove.findIndex(({ email }) => expert.email === email);
        expertsToRemove[expertToUpdate].validationField = value.toLowerCase();
        this.setState({ markedToRemove: expertsToRemove });
    };

    handleConfirmRemove = (expert) => {
        const markedToRemove = this.state.markedToRemove.find(({ email }) => email === expert.email);
        const valid = markedToRemove.email === markedToRemove.validationField;
        if (valid) {
            const expertList = this.props.list.filter((expert) => expert.email !== markedToRemove.email);
            this.props.handleRemoveExpert(expertList);
        }
    };

    handleCancelRemove = (expert) => {
        this.setState({
            markedToRemove: this.state.markedToRemove.filter(({ email }) => expert.email !== email)
        });
    };

    getExpertStatusString = (expert) => {
        switch (expert.status) {
            case TO_INVITE: {
                return <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>Pending to invite</Text>;
            }
            case INVITED: {
                return <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>Waiting confirmation</Text>;

            }
            case DECLINED: {
                return <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>Invitation declined</Text>;

            }
            case EXPIRED: {
                return <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>Invitation expired</Text>;

            }
            case ACCEPTED: {
                return <Text style={{ fontSize: 12 }}>{expert.name} {expert.surname}</Text>;
            }
            default: {
                return <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>Pending to invite</Text>;
            }
        }
    };

    render() {
        const { list, external, own, removable } = this.props;
        let expertList;
        if (external && !own) { expertList = list.filter((expert) => expert.me !== true); }
        else if (!external && own) { expertList = list.filter((expert) => expert.me === true); }
        else { expertList = list; }
        let mainCol = { xs: '12' },
            secCol = null;
        if (removable) {
            mainCol = {
                xs: '9'
            };
            secCol = {
                xs: '3'
            };
        }
        if (expertList && expertList.length) {
            return (
                <section className='judge-list-container'>
                    {expertList.map((expert) => (
                        <Grid key={expert.email} className='judge-list-whole-item'>
                            <Col {...mainCol} className='judge-list-item'>
                                <ProfilePic
                                    shape='circle'
                                    url={expert.logo || 'https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder_profile_square.svg'}
                                    className={expert.me === true ? 'own-picture' : ''}
                                    length='32px'
                                />
                                <div>
                                    {this.getExpertStatusString(expert)}
                                    <Text style={{ fontSize: 12 }} className='crazy-mediumgrey'>{expert.email}</Text>
                                </div>
                            </Col>
                            {secCol && !expert.me &&
                                <Col {...secCol} style={{ margin: 'auto 0' }}>
                                    <Text
                                        bold
                                        style={{ fontSize: 12 }}
                                        className='remove-members-button'
                                        onClick={() => { this.handleSetRemoveExpert(expert); }}
                                    >remove</Text>
                                </Col>
                            }
                            {this.isMarkedToRemove(expert)}
                        </Grid>
                    ))}
                </section>
            );
        } else { return null; }
    }
}