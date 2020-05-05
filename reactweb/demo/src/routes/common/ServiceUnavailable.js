import React, {Component} from 'react';
import SectionContainer from '../../common/components/dummy/SectionContainer';

import {Header, Text} from '../../layout/FluttrFonts';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import {connect} from 'react-redux';
import {fetchUserInfo} from '../../redux/actions/userActions';
import {goToExpertDashboard, goToLoginPage, goToRecruiterDashboard} from '../../fltr/navigation/NavigationManager';
import {doHandleDashboardBoarding, manageError, manageErrorMessage} from '../../common/utils';
import {checkOnlineStatusAndProceed} from '../../fltr/utils/errorUtils';

@connect(({user, userStatus}) => ({user, userStatus}))
export default class ServiceUnavailable extends Component {

    state = {
        offline: false
    };

    componentDidMount () {
        window.Raven.captureException(new Error('Service unavailable'));
        doHandleDashboardBoarding();
        this.userCheck();
    }

    checkStatus = () => {
        if (this.userCheckTimeout) {
            clearTimeout(this.userCheckTimeout);
        }
        const timeInterval = 60 *1000; // seconds * milliseconds
        this.userCheckTimeout = setTimeout(this.userCheck, timeInterval);
    };

    forceCheck = () => {
        this.userCheck();
    };

    userCheck = () => {
        checkOnlineStatusAndProceed(() => {
            this.setState({offline: false});
            this.props.dispatch(fetchUserInfo(this.onSuccess, this.onError));
        }, () => {
            this.setState({offline: true});
            this.checkStatus();
        });
    };

    onSuccess = (user) => {
        const {isRecruiter, isJudge} = user;
        if (isRecruiter) {
            goToRecruiterDashboard();
        } else if (isJudge) {
            goToExpertDashboard();
        }
    };
    onError = (error) => {
        if (error && error.status) {
            const enhancedError = {response: {...error}};
            if (error.status === 401) {
                goToLoginPage();
            } else {
                this.checkStatus();
                manageError(enhancedError, 'ServiceUnavailable', 'Service unavailable, we will check again in 1 minute');
            }
        } else {
            manageErrorMessage('ServiceUnavailable', 'Service unavailable, we will check again in 1 minute');
            this.checkStatus();
        }
    };

    render () {
        const {user: {isFetching: loading}} = this.props;
        const {offline} = this.state;
        return (
            <SectionContainer className='error-page'>
                <section className='error-page-content'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/unavailable.svg' />
                    <div>
                        <Header>Service not available</Header>
                        <Text size='md'>Probably we are doing some maintenance stuff, please try in a few minutes</Text>
                        <CrazyButton loading={loading && !offline} size='sidebar' text='Go back' action={this.forceCheck} inverse />
                    </div>
                </section>
            </SectionContainer>
        );
    }
}