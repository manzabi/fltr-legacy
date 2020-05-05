import React, { Component } from 'react';

import { RemoveOpportunityById } from '../../../redux/actions/recruiterOpportunityActions';
import { closeModalFix } from '../../../common/uiUtils';
import { closeOpportunity, extendOpportunityTimeline, hireOpportunity } from '../../../redux/actions/opportunityActions';
import { checkUserUpdate } from '../../../redux/actions/userActions';
import { manageErrorMessage, manageSuccess } from '../../../common/utils';
import Datetime from 'react-datetime';
import * as opportunityStatus from '../../../constants/opportunityStatus';
import FluttrButton from '../../../common/components/FluttrButton';
import RecruiterOpportunityCloseModal from './RecruiterOpportunityCloseModal';
import CommonModal from '../../../common/components/CommonModal';
import ContextMenu from '../../../common/components/ContextMenu';
import Col from '../../../layout/layout/Col';
import { connect } from 'react-redux';
import {goToRecruiterConfigure, goToRecruiterDashboard} from '../../navigation/NavigationManager';
import { DISABLED, WAITING_TEST } from '../../../constants/opportunityChallengeProcessStatus';
import FullScreen from '../../template/FullScreen';
import RecruiterOpportunityLivePage from './RecruiterChallengeLivePage';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import ReactDOM from 'react-dom';
import {withRouter} from 'react-router';

@withRouter
@connect(({ userStatus }) => ({ userStatus }))
export class OpportunityContextMenu extends Component {
    constructor(props) {
        super(props);
        const isDashboard = props.location.pathname === '/recruiter/dashboard';
        this.state = {
            show: false,
            target: null,
            inviteLink: '',
            showTagHandler: false,
            showMenu: false,
            showExtendModal: false,
            showCloseOppModal: false,
            showInviteModal: false,
            showActivateModal: false,
            extendLoading: false,
            activateLoading: false,
            isDashboard
        };
    }

    closeOpportunity = () => {
        this.setState({ showCloseOppModal: true });
    };

    handleDeleteDraft = () => {
        const { id } = this.props.opportunity;
        this.props.dispatch(RemoveOpportunityById(id, this.onDeleteDraftSuccess));
    };

    onDeleteDraftSuccess = () => {
        //todo scroll
        if (this.state.isDashboard) {
            const offset = ReactDOM.findDOMNode(this).getBoundingClientRect().top;
            this.props.onRefresh(offset);
        } else {
            goToRecruiterDashboard();
        }
    };

    closeCloseOpportunity = (refresh) => {
        closeModalFix();
        this.setState({ showMenu: false, showCloseOppModal: false });
        //refresh
        if (refresh) {
            this.props.onRefresh();
        }
    };

    closeOpportunityAction = (value) => {
        const { id } = this.props.opportunity;

        const data = {
            value
        };
        this.props.dispatch(closeOpportunity(id, data, this.onCloseOppSuccess, this.onCloseOppError));
    };

    hireOpportunityAction = (list) => {
        const { id } = this.props.opportunity;

        const userList = list.map(({ id }) => id);
        const data = {
            userList
        };

        this.props.dispatch(hireOpportunity(id, data, this.onCloseOppSuccess, this.onCloseOppError));
    };

    onCloseOppSuccess = () => {
        this.props.dispatch(checkUserUpdate(this.props.userStatus, true));
        manageSuccess(undefined, 'The opportunity has been closed succesfully!');
        this.closeCloseOpportunity(true);
    };

    onCloseOppError = (err) => {
        manageErrorMessage(undefined, 'Oops, something went wrong!');
        this.closeCloseOpportunity(true);
    };

    extendOpportunity = () => {
        this.setState({ showExtendModal: true });
    };

    closeExtendOpportunity = (refresh) => {
        closeModalFix();
        this.setState({ showMenu: false, showExtendModal: false });
        if (refresh) {
            this.props.onRefresh();
        }
    };

    extendOpportunityAction = () => {
        this.setState({ extendLoading: true }, () => {

            const { expireTime, expireDate } = this.state;
            const { id } = this.props.opportunity;
            const date = expireDate || this.getExpirationDate();
            const time = expireTime || this.getExpirationTime();
            const value = `${date} ${time}`;
            const data = {
                value
            };

            this.props.dispatch(extendOpportunityTimeline(id, data, this.onExtendSuccess, this.onExtendError));
        });
    };

    onExtendSuccess = () => {
        manageSuccess(undefined, 'Closing time has been extended succesfully!');
        this.props.dispatch(checkUserUpdate(this.props.userStatus, true));
        this.setState({ extendLoading: false });
        this.closeExtendOpportunity(true);
    };

    onExtendError = (err) => {
        manageErrorMessage(undefined, 'Oops, something went wrong!');
        this.setState({ extendLoading: false });
    };

    inviteCandidate = () => {
        this.setState({ showInviteModal: true });
    };

    closeInviteCandidate = () => {
        this.setState({ showMenu: false, showInviteModal: false });
    };

    activateOpportunity = () => {
        this.setState({ showActivateModal: true });
    };

    closeActivateOpportunity = (refresh) => {
        closeModalFix();
        this.setState({ showMenu: false, showActivateModal: false });
        //refresh page
        if (refresh) {
            this.props.onRefresh();
        }
    };

    activateOpportunityAction = () => {
        this.setState({ activateLoading: true }, () => {

            const { expireTime, expireDate } = this.state;
            const { id } = this.props.opportunity;
            const date = expireDate || Datetime.moment().add(7, 'days').format('DD/MM/YYYY');
            const time = expireTime || this.getExpirationTime();
            const value = `${date} ${time}`;
            const data = {
                value
            };
            this.props.dispatch(extendOpportunityTimeline(id, data, this.onActivateSuccess, this.onActivateError));
        });
    };

    onActivateSuccess = () => {
        manageSuccess(undefined, 'The test has been activated correctly!');
        this.closeActivateOpportunity(true);
        this.setState({ activateLoading: false });
    };

    onActivateError = (err) => {
        manageErrorMessage(undefined, 'Oops, something went wrong!');
        this.setState({ activateLoading: false });
    };

    getExpirationDate = () => {
        const { expireDateUTC } = this.props.opportunity.expire;
        if (expireDateUTC) {
            let date = expireDateUTC.split(' ')[0];
            date = date.split('-');
            const [year, month, day] = date;
            return `${day}/${month}/${year}`;
            // return getSafeDate(expireDateUTC).format('DD/MM/YYYY');
        }
        const now = new Date();
        const month = now.getUTCMonth() + 1;
        const day = now.getUTCDate();
        const year = now.getUTCFullYear();
        return `${day}/${month}/${year}`;
    };

    formatExpirationDate = () => {
        const date = this.getExpirationDate();

        return moment(date, 'DD/MM/YYYY');
    };

    getExpirationTime = () => {
        const { expireDateUTC } = this.props.opportunity.expire;
        if (expireDateUTC) {
            const time = expireDateUTC.split(' ')[1];
            const removeSeconds = time.split(':');
            const [hour, minutes] = removeSeconds;
            return hour + ':' + minutes;
            // return getSafeDate(expireDateUTC).format('HH:mm');

        }
        const now = new Date();
        const hours = now.getHours();
        const minutes = now.getMinutes();
        return `${hours}:${minutes}`;
    };

    manageExpirationTime = ({ target: { value: expireTime } }) => {
        this.setState({ expireTime });
    };

    manageExpirationDate = ({ target: { value: expireDate } }) => {
        this.setState({ expireDate });
    };

    validDateInCalendarAfter = (current) => {
        let now = Datetime.moment();
        return now.isBefore(current);
    };

    onChangeDate = (moment) => {
        this.setState({
            expireDate: moment.format('DD/MM/YYYY'),
        });
    };

    onChangeTime = (moment) => {
        this.setState({
            expireTime: moment.format('HH:mm')
        });
    };

    renderContextMenu = () => {
        const { opportunity } = this.props;
        switch (opportunity.statusId) {
            case opportunityStatus.TO_INIT: {
                const settingsEnabled = ![DISABLED, WAITING_TEST].includes(opportunity.challengeDetail.status);
                const additionalItems = [];
                if (settingsEnabled) {
                    additionalItems.push({ text: 'Add team members', onclick: () => goToRecruiterConfigure(opportunity.id, 'team') });
                }
                return (
                    <ContextMenu
                        buttonClassname='crazy-icon-dots'
                        items={
                            [
                                { text: 'Delete draft', onclick: this.handleDeleteDraft },
                                ...additionalItems
                            ]
                        }
                    />
                );
            }
            case opportunityStatus.LIVE: {
                return (<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                    <CrazyIcon icon='icon-invite-candidate' onClick={this.inviteCandidate}/>
                    <ContextMenu
                        buttonClassname='crazy-icon-dots'
                        items={
                            [
                                { text: 'Invite candidate', onclick: this.inviteCandidate },
                                { text: 'Close test', onclick: this.closeOpportunity },
                                { text: 'Manage closing time', onclick: () => goToRecruiterConfigure(opportunity.id, 'settings') },
                                { text: 'Add team members', onclick: () => goToRecruiterConfigure(opportunity.id, 'team') },
                            ]
                        }
                    />
                </div>
                );
            }
            case opportunityStatus.CLOSE: {
                return (
                    <ContextMenu
                        buttonClassname='crazy-icon-dots'
                        items={
                            [
                                { text: 'Activate test', onclick: this.activateOpportunity },
                                { text: 'Configure test', onclick: () => goToRecruiterConfigure(opportunity.id, 'settings') },
                                { text: 'Add team members', onclick: () => goToRecruiterConfigure(opportunity.id, 'team') },
                            ]
                        }
                    />
                );
            }
            default: {
                return <div />;
            }
        }
    };

    render() {
        const { opportunity } = this.props;
        return (
            <span className='opportunity-context-menu'>
                {this.renderContextMenu()}
                <Col xs='0' sm='0' md='0' lg='0'>
                    <CommonModal open={this.state.showExtendModal} onClose={this.closeExtendOpportunity} showClose={true}>
                        <div className='extend-modal'>
                            <div className='extend-modal-flex-container'>
                                <h1><b>Extend</b> the opportunity closing time</h1>
                                <p className='fluttr-text-md'>You are about to extend the active time of the opportunity.<br />Set the closing date below</p>
                                <div className='extend-times-container'>
                                    <Datetime
                                        isValidDate={this.validDateInCalendarAfter}
                                        dateFormat="DD MMMM YYYY"
                                        onChange={this.onChangeDate}
                                        timeFormat={false}
                                        defaultValue={this.formatExpirationDate()}
                                        closeOnSelect={true}
                                    />
                                    <Datetime
                                        isValidDate={() => false}
                                        dateFormat={false}
                                        onChange={this.onChangeTime}
                                        timeFormat="HH:mm"
                                        defaultValue={this.getExpirationTime()}
                                        closeOnSelect={true}
                                    />
                                </div>
                                <FluttrButton size='medium' loading={this.state.extendLoading} action={this.extendOpportunityAction} >EXTEND</FluttrButton>
                            </div>
                        </div>
                    </CommonModal>
                    <RecruiterOpportunityCloseModal
                        showCloseOppModal={this.state.showCloseOppModal}
                        closeCloseOpportunity={this.closeCloseOpportunity}
                        closeOpportunityAction={this.closeOpportunityAction}
                        hireOpportunityAction={this.hireOpportunityAction}
                        id={opportunity.id}
                    />
                    <CommonModal open={this.state.showActivateModal} onClose={this.closeActivateOpportunity} showClose={true}>
                        <div className='extend-modal'>
                            <div className='extend-modal-flex-container'>
                                <h1><b>Extend</b> the opportunity closing time</h1>
                                <p className='fluttr-text-md'>You are about to extend the active time of the opportunity.<br />Set the closing date below</p>

                                <div className='extend-times-container'>
                                    <Datetime
                                        isValidDate={this.validDateInCalendarAfter}
                                        dateFormat="DD MMMM YYYY"
                                        onChange={this.onChangeDate}
                                        timeFormat={false}
                                        defaultValue={Datetime.moment().add(7, 'days')}
                                        closeOnSelect={true}
                                    />
                                    <Datetime
                                        isValidDate={() => false}
                                        dateFormat={false}
                                        onChange={this.onChangeTime}
                                        timeFormat="HH:mm"
                                        defaultValue={Datetime.moment()}
                                        closeOnSelect={true}
                                    />
                                </div>

                                <FluttrButton size='medium' loading={this.state.activateLoading} action={this.activateOpportunityAction} >EXTEND</FluttrButton>
                            </div>
                        </div>
                    </CommonModal>
                </Col>
                <FullScreen open={this.state.showInviteModal} className='opportunity-live' manageUiFix>
                    <RecruiterOpportunityLivePage opportunity={opportunity} disableModal onClose={this.closeInviteCandidate} />
                </FullScreen>
            </span>
        );
    }
}