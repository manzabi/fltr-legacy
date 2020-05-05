'use strict';

import React, { Component } from 'react';
import Grid from '../layout/Grid';
import Col from '../layout/Col';
import Container from '../layout/Container';
import CrazyField from '../fields/CrazyFields';
import CrazyButton from '../buttons/CrazyButtons';
import { Header, Text } from '../FluttrFonts';
import * as ga from '../../constants/analytics';
import { putRecruiterUserInfo } from '../../redux/actions/userActions';
import { getTagCategories } from '../../redux/actions/recruiterOpportunityActions';
import { goToRecruiterLandingPage } from '../../fltr/navigation/NavigationManager';
import AsynchContainer from '../../fltr/template/AsynchContainer';
import { connect } from 'react-redux';
import CrazyDropdown from '../dropdown/Dropdown';
import ReactGA from 'react-ga';
import Offset from '../layout/Offset';

@connect(({ recruiterTagCategories }) => ({ recruiterTagCategories }))
export default class ProfileCreationPage extends Component {

    componentDidMount() {
        if (!this.props.recruiterTagCategories || !this.props.recruiterTagCategories.item) {
            this.props.dispatch(getTagCategories());
        }
    }

    sendInfo = (form, success, error) => {
        this.props.dispatch(putRecruiterUserInfo(form, success, error));
    }

    render() {
        return (<AsynchContainer data={this.props.user} native>
            <AsynchContainer data={this.props.recruiterTagCategories}>
                <ProfileCreation user={this.props.user.item} sendInfo={this.sendInfo} tagCategories={this.props.recruiterTagCategories.item} />
            </AsynchContainer>
        </AsynchContainer>);
    }
}


class ProfileCreation extends Component {
    constructor(props) {
        super(props);
        const { name, surname, role, email } = props.user;
        const { tagCategories } = props;
        this.state = {
            YourName: name.trim() || '',
            YourWorkEmail: email || '',
            YourLastName: surname.trim() || '',
            YourTeam: role || '',
            loading: false,
            showMessages: false,
            tagCategories,
            mainSkillId: null
        };
        ga.track(ga.PROFILE_CREATION_LANDING);
    }

    submitCallback = () => {
        const { YourName, YourLastName, YourTeam, mainSkillId } = this.state;
        this.setState({ loading: true }, () => {
            const proceed = !(!YourName.trim().length || !YourLastName.trim().length || !YourTeam.trim().length);
            if (proceed) {
                const form = {
                    name: YourName,
                    surname: YourLastName,
                    mainSkillId
                };
                this.props.sendInfo(form, this.onSuccess, this.onError);
            } else {
                this.setState({ loading: false, showMessages: true });
            }
        });
    }

    fieldsOnChange = (fieldId, value) => {
        const id = fieldId.replace(/\s/g, '');
        this.setState({ [id]: value });
    }

    onSuccess = () => {
        ga.track(ga.BOARDING_PERSONAL_INFO_END);
        goToRecruiterLandingPage();
    }

    onError = () => {
        const trackingRoute = '/recruiter/profile/complete/error';
        ReactGA.set({ page: trackingRoute });
        ReactGA.pageview(trackingRoute);
        this.setState({ loading: false });
    }

    dropdownOnchange = ({ text, id }) => {
        this.setState({ YourTeam: text, mainSkillId: id });
    }

    render() {
        const { YourName, YourWorkEmail, YourLastName, YourTeam, loading, showMessages, tagCategories } = this.state;
        const firstNameConfig = {
            error: {
                condition: (text) => {
                    return !text.trim().length;
                },
                message: 'First name is required'
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };
        const lastNameConfig = {
            error: {
                condition: (text) => {
                    return !text.trim().length;
                },
                message: 'Last name is required'
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };

        const emailConfig = {
            error: {
                condition: () => { return false; },
                message: ''
            },
            success: {
                condition: () => {
                    return true;
                },
                message: ''
            }
        };

        const roleOptions = Object.keys(tagCategories).map((element) => {
            const { id, value } = tagCategories[element];
            let text = value.charAt(0).toUpperCase() + value.slice(1);
            if (text === 'It') text = text.toUpperCase();
            return ({
                text,
                id
            });
        });

        return (
            <Container fluid>
                <Grid className='crazy-profile-creation'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' />
                    <Offset smOffset='4' />
                    <Col sm='4' xs='12'>
                        <div className='crazy-profile-creation-form'>
                            <Header size='lg'>Welcome {YourName}</Header>
                            <Text size='sm' >Now that you are signed up, let us know a bit about you</Text>
                            <div className='name-fields-wrapper'>
                                <CrazyField showMessages={showMessages}
                                    onFieldChange={this.fieldsOnChange}
                                    text={YourName}
                                    label='Your Name'
                                    placeholder='First name'
                                    config={firstNameConfig}
                                    enterAction={this.submitCallback}
                                />
                                <CrazyField
                                    showMessages={showMessages}
                                    onFieldChange={this.fieldsOnChange}
                                    text={YourLastName}
                                    label='Your Last Name'
                                    placeholder='Last name'
                                    config={lastNameConfig}
                                    enterAction={this.submitCallback}
                                />
                                <p className='dropdown-label'>Your Team</p>
                            </div>
                            <CrazyDropdown
                                placeholder='Choose your team'
                                options={roleOptions}
                                onChange={this.dropdownOnchange}
                                defaultText={YourTeam}
                                className={`team-dropdown${!YourTeam.length && showMessages ? ' error' : YourTeam.length && showMessages ? ' success' : ''}`}
                            />
                            {!YourTeam.length && showMessages ? <div className='drop-error' >Choose an option</div> : <div className='drop-filler' />}
                            <CrazyField
                                showMessages={showMessages}
                                onFieldChange={this.fieldsOnChange}
                                label='Your Work Email'
                                placeholder={YourWorkEmail}
                                text={YourWorkEmail}
                                config={emailConfig}
                                blocked
                                style={{ marginTop: 15 }}
                            />
                            <CrazyButton size='large' text='Continue' action={this.submitCallback} loading={loading} />
                        </div>
                    </Col>
                </Grid>
            </Container>
        );
    }
}