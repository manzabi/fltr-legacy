import React from 'react';

import { getSafeDate } from '../../../common/timerUtils';
import PlayerUserInfo from '../../user/PlayerUserInfo';
import Datetime from 'react-datetime';
import { manageError, manageErrorMessage, manageSuccess } from '../../../common/utils';
import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import { Text } from '../../../layout/FluttrFonts';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { PROCESS_TYPE_CHALLENGE } from '../../../constants/opportunityProcessType';
import { manageExtendTimeline } from '../../../redux/actions/recruiterOpportunityActions';
import { connect } from 'react-redux';
import CrazySeparator from '../../../layout/layout/CrazySeparator';

@connect(({ dispatch }) => ({ dispatch }))
export default class RecruiterReviewExtendTimelineModal extends React.Component {

    constructor(props) {
        super(props);
        this.state = this.getInitialData(props);
    }

    init = () => {
        this.setState(this.getInitialData(this.props));
    };

    getInitialData = (props) => {
        const { candidate } = props;
        const challenge = props.candidate.getStepData(PROCESS_TYPE_CHALLENGE);
        let expireSafeDate = getSafeDate(candidate.opportunity.challengeDetail.expire.expireDate);
        return {
            date: this.getRightDate({ ...candidate, challengeStep: challenge }),
            dateDefault: this.getRightDateForInit({ ...candidate, challengeStep: challenge }),

            time: this.getRightTime({ ...candidate, challengeStep: challenge }),
            timeDefault: this.getRightTimeForInit({ ...candidate, challengeStep: challenge }),

            checkDate: expireSafeDate
        };

    };

    getRightTime = (candidate) => {
        if (candidate.challengeStatus.expired) {
            return getSafeDate(candidate.opportunity.challengeDetail.expire.expireDate).format('HH:mm');
        } else {
            return new moment().format('HH:mm');
        }
    };

    getRightDate = (candidate) => {
        if (candidate.challengeStatus.expired) {
            return getSafeDate(candidate.opportunity.challengeDetail.expire.expireDate).format('DD/MM/YYYY');
        } else {
            return new moment().format('DD/MM/YYYY');
        }
    };

    getRightTimeForInit = (candidate) => {
        if (candidate.challengeStatus.expired) {
            return getSafeDate(candidate.opportunity.challengeDetail.expire.expireDate).format('HH:mm');
        } else {
            return new moment().format('HH:mm');
        }
    };

    getRightDateForInit = (candidate) => {
        if (candidate.challengeStatus.expired) {
            return getSafeDate(candidate.opportunity.challengeDetail.expire.expireDate).format('DD/MM/YYYY');
        } else {
            return new moment().format('DD/MM/YYYY');
        }
    };

    onChangeDate = (moment) => {
        this.setState({
            date: moment.format('DD/MM/YYYY'),
        });
    };

    onChangeTime = (moment) => {
        this.setState({
            time: moment.format('HH:mm')
        });

    };

    validCompleteDate = () => {
        let currentHour = this.state.date + ' ' + this.state.time;
        let date = moment(currentHour, 'DD/MM/YYYY HH:mm');
        let now = Datetime.moment();
        return date.isBefore(this.state.checkDate) && now.isBefore(date);
    };

    validDateInCalendar = (current) => {
        let now = Datetime.moment();
        return current.isBefore(this.state.checkDate) && now.isBefore(current);
    };

    updateTime = () => {
        let valid = this.validCompleteDate();

        if (valid) {
            const { id: candidateId, matchId, opportunity: { id: opportunityId } } = this.props.candidate;
            const data = {
                expireDate: this.state.date + ' ' + this.state.time
            };
            this.props.dispatch(manageExtendTimeline(matchId, opportunityId, candidateId, data, this.onSuccess, this.onError));
        } else {
            // date is not compatible
            let message = 'The date should be in the future (maximum allowed date is ' + this.state.checkDate.format('DD MMMM YYYY HH:mm') + ')';
            manageErrorMessage('timeline-error', message);
        }
    };

    onSuccess = () => {
        manageSuccess('candidateExtendedChallengeTL', 'Successfully extended candidate\'s challenge timeline.');
        this.props.onRefresh();
        this.props.onClose();
    };

    onError = (error) => {
        manageError(error);
        if (window.Raven) {
            window.Raven.captureException(error.stack);
        }
    };

    render() {
        return (
            <RecruiterCrazyModal
                size='md'
                show={this.props.show}
                onHide={this.closeModal}
                onCloseButton={this.props.onClose}
                title='Extend the limit date to submit the answer'
                manageUiFix={false}
            >
                <section className='extend-candidate-modal-content'>
                    <Text size='xs'>Candidate</Text>
                    <PlayerUserInfo candidate={this.props.candidate} />
                    <CrazySeparator style={{ marginTop: 0, marginBottom: 18 }} />
                    <Text size='xs'>This candidate will not be able to submit his/her answer after the date you set below</Text>
                    <section className='timeline-selectors'>
                        <Datetime
                            isValidDate={this.validDateInCalendar}
                            dateFormat="DD MMMM YYYY"
                            onChange={this.onChangeDate}
                            timeFormat={false}
                            defaultValue={this.state.dateDefault}
                            closeOnSelect={true}
                        />
                        <Datetime
                            isValidDate={false}
                            dateFormat={false}
                            onChange={this.onChangeTime}
                            timeFormat="HH:mm"
                            defaultValue={this.state.timeDefault}
                            closeOnSelect={true}
                            className='time'
                        />
                    </section>
                    <CrazySeparator />
                    <div className='button-container'>
                        <CrazyButton className='submit-button' size='small' text='Extend' action={this.updateTime} />
                    </div>
                </section>
            </RecruiterCrazyModal>
        );
    }
}
