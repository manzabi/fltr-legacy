'use strict';

import React, { Component } from 'react';
import { connect } from 'react-redux';

import { Header, Text } from '../FluttrFonts';
import { CrazySwitcherTransparent } from '../uiUtils/switchers';

import {
    goToExpertDashboard,
    goToExpertEditProfile,
    goToRecruiterCompanyCreate,
    goToRecruiterDashboard,
    goToUpgrade
} from '../../fltr/navigation/NavigationManager';
import { doLogout, manageErrorMessage, manageSuccess } from '../../common/utils';
import { getChallengeAvailableSlots } from '../../fltr/utils/planUtils';
import { getCompanyImage } from '../../fltr/utils/urlUtils';
import ProfilePic from '../uiUtils/ProfilePic';
import DropdownMenu from './DropdownMenu';
import CrazyButton from '../buttons/CrazyButtons';
import HeaderLimitBanner from '../../common/HeaderLimitBanner';
import { Link } from 'react-router';
import CrazyTooltip from '../uiUtils/tooltip';
import RecruiterCrazyModal from '../modal/RecruiterCrazyModal';
import CrazyField from '../fields/CrazyFields';
import CrazyDropdown from '../dropdown/Dropdown';
import CrazyIcon from '../icons/CrazyIcon';
import UploadButton from '../../common/components/UploadButton';
import { resetUploadImage, uploadImage } from '../../redux/actions/uploadActions';
import * as imageType from '../../constants/imageUploadType';
import { putRecruiterUserInfo } from '../../redux/actions/userActions';
import AsynchContainer from '../../fltr/template/AsynchContainer';
import { getTagCategories, updateCompany } from '../../redux/actions/recruiterOpportunityActions';
import CrazyTextarea from '../fields/CrazyTextarea';
import { isValidUrl } from '../../fltr/utils/FormUtils';
import CrazySeparator from '../layout/CrazySeparator';
import Intercom from '../../fltr/utils/Intercom';

@connect(({ headerTitle, user, recruiterTagCategories }) => ({ headerTitle, user, recruiterTagCategories }))
export default class CrazyHeader extends Component {
    state = {
        showRecruiterProfileEditModal: false,
        showCompanyEditModal: false
    }

    componentDidMount() {
        if (!this.props.recruiterTagCategories || !this.props.recruiterTagCategories.item) {
            this.props.dispatch(getTagCategories());
        }
    }

    renderMenuItem = (text, action, selected = false) => {
        let className = 'header-menu-item';
        if (selected) { className += ' selected'; }

        return (<div className={className} onClick={action}>
            <div className='header-menu-item-content'>{text}</div>
        </div>);
    };

    showUpgradeButton = () => {
        const user = this.props.user.item;
        if (user.recruiterDetail && user.recruiterDetails.company) {
            const availablePlans = getChallengeAvailableSlots(user);
            return Object.values(availablePlans).some((value) => value === 0);
        }
        return false;
    };

    onLogoClick() {
        const user = this.props.user.item;
        const isRecruiter = user.isRecruiter;

        if (isRecruiter) {
            goToRecruiterDashboard();
        } else {
            goToExpertDashboard();
        }
    }

    extractRichers = (text) => {
        const varTypes = ['tooltip', 'color'];
        return varTypes.reduce((acc, element) => {
            acc = [...acc, this.extractVar(text, element) || {}];
            return acc;
        }, [{ content: text.split(':color')[0].split(':tooltip')[0], type: 'text' }]);
    };

    extractVar = (content, variable) => {
        const rx = eval('/\:' + variable + '=(.*?)?(:|$)/g');
        const arr = rx.exec(content);
        return arr && { type: variable, content: arr[1].trim() } || null;
    }

    renderRichers = (richers) => {
        const hasTooltip = richers.some((element) => element.type === 'tooltip');
        const hasRibbonsito = richers.some((element) => element.type === 'color');
        if (hasRibbonsito && hasTooltip) {
            return (
                <span className='header-element'>
                    {richers.find((element) => element.type === 'text').content}
                    {hasRibbonsito && hasTooltip &&
                        <CrazyTooltip color='darkside' position='right' messageChildren={<span style={{ fontSize: 11, width: 'max-content', padding: 10 }}>{richers.find((element) => element.type === 'tooltip').content}</span>}>
                            <span className={`element-ribbon ribbon-${richers.find((element) => element.type === 'color').content}`} />
                        </CrazyTooltip>
                    }
                </span>
            );
        }
        return (
            <span>
                {richers.find((element) => element.type === 'text').content}
            </span>
        );
    };

    onShowRecruiterProfileModal = () => {
        this.setState({ showRecruiterProfileEditModal: true });
    };

    onHideRecruiterProfileModal = () => {
        this.setState({ showRecruiterProfileEditModal: false });
    };

    onShowCompanyModal = () => {
        this.setState({ showCompanyEditModal: true });
    };

    onHideCompanyModal = () => {
        this.setState({ showCompanyEditModal: false });
    };

    render() {
        const { item: user } = this.props.user;
        const { headerTitle: [category, ...rest] } = this.props;
        const { showRecruiterProfileEditModal, showCompanyEditModal } = this.state;
        return (
            <HeaderLimitBanner>
                <div className={`crazy-header${this.props.noSidebar ? ' no-sidebar' : ''}`} id='crazy-header'>
                    {this.props.noSidebar &&
                        <div className='crazy-header-brand' onClick={() => this.onLogoClick()}>
                            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/onlyLogo.png' style={{ margin: 'auto', display: 'block' }} height='40px' />
                        </div>
                    }
                    <section className='header-container'>
                        <Header size='sm' className='header-breadcrumb'>
                            {category && category.id && category.path &&
                                <Link key={category.id} to={category.path}>{category.text}</Link>
                            }
                            {rest.length > 0 &&
                                <span>/</span>
                            }
                            {
                                rest.map((element, index) => {
                                    const richers = this.extractRichers(element.text);
                                    return <span key={element.id}>{this.renderRichers(richers)}{(index + 1) < rest.length && '/'}</span>;
                                })
                            }
                        </Header>
                        {/* El contenido lo discutimos con Dela */}
                        <section className='header-right-section'>
                            {user.recruiterDetails && user.recruiterDetails.company && this.showUpgradeButton() &&
                                <CrazyButton color='pink' action={goToUpgrade} size='small' text='Upgrade Now' />
                            }
                            <UserProfileMenu
                                user={user}
                                onShowRecruiterProfileModal={this.onShowRecruiterProfileModal}
                                showCompanyEditModal={this.onShowCompanyModal}
                            />
                        </section>
                    </section>
                    {showRecruiterProfileEditModal &&
                        <AsynchContainer data={this.props.recruiterTagCategories}>
                            <RecruiterProfileEditModal
                                showRecruiterProfileEditModal={showRecruiterProfileEditModal}
                                onHideRecruiterProfileModal={this.onHideRecruiterProfileModal}
                                teamOptions={this.props.recruiterTagCategories.item}
                            />
                        </AsynchContainer>}
                    {showCompanyEditModal &&
                        <CompanyEditModal
                            onHideModal={this.onHideCompanyModal}
                            showModal={showCompanyEditModal}
                        />}
                </div>
            </HeaderLimitBanner>
        );
    }
}
@connect(({ user, uploadImage }) => ({ user, uploadImage }))
class RecruiterProfileEditModal extends Component {

    state = {
        active: 0,
        name: '',
        lastName: '',
        role: '',
        profilePic: '',
        team: { id: null, url: '', value: '', key: '' },
        loading: false,
        showMessages: false,
        imageId: null,
        email: ''
    }

    componentDidMount() {
        resetUploadImage();
        this.prefillUserData(this.props.user.item);
    }

    prefillUserData = ({ imageUrl, name, surname, position, mainSkill, email }) => {
        let newForm = {
            profilePic: imageUrl,
            name,
            lastName: surname,
            role: position,
            team: mainSkill,
            email
        };
        this.setState(newForm);
    };

    onFieldChange = (field, value) => {
        this.setState({ [field]: value });
    };

    onUpdateProfile = () => {
        const { name, lastName, role, imageId, team, profilePic } = this.state;
        const proceed = Object.values({ name, lastName, role, profilePic }).every(el => !!el);

        this.setState({ loading: true, showMessages: true }, () => {
            if (proceed) {
                this.updateCallback({ name, lastName, role, imageId, team });
            } else {
                this.setState({ loading: false });
            }
        });
    };

    updateCallback = ({ name, lastName, role, imageId, team }) => {
        const param = {
            imageId,
            name,
            surname: lastName,
            role,
            mainSkill: team.id
        };
        this.props.dispatch(putRecruiterUserInfo(param, this.onSaveOk, this.onError));
    };

    onSaveOk = () => {
        this.setState({ loading: false }, () => { manageSuccess(undefined, 'Profile updated successfully'); });
    };

    onError = () => {
        this.setState({ loading: false }, () => { manageErrorMessage(undefined, 'Oops, something went wrong.'); });
    };

    onCrop = (profilePic) => {
        if (this.props.uploadImage.item) {
            this.deleteImage();
        }

        this.props.dispatch(uploadImage(imageType.USERS, profilePic, 'profile_picture.png', this.onUploadOk));
    };

    onUploadOk = ({ url, id }) => {
        this.setState({ profilePic: url, imageId: id });
    };

    deleteImage = () => {
        this.props.dispatch(resetUploadImage());
    };

    onForceOpenCrop = () => {
        this.refs['profile-upload-pic'].forceClick();
    };

    onTeamChange = (team) => {
        this.setState({ team });
    }

    renderContent = () => {
        const { active, name, lastName, role, profilePic, loading, showMessages, team, email } = this.state;
        const config = {
            error: { condition: (text) => !text, message: 'Please fill this field' },
            success: { condition: (text) => !!text, message: '' }
        };
        const options = Object.values(this.props.teamOptions).map(({ id, key, url, value }) => ({ id, key, url, value, text: value }));
        switch (active) {
            case 0: {
                return (<div className='recruiter-profile-content' style={{ padding: '0 26px 20px' }}>
                    <div style={{ margin: '30px 0' }}>
                        <Text size='xs'>Your photo</Text>
                        <div className='profile-content-photo'>
                            <div style={{ position: 'relative' }}>
                                <div
                                    className={`profile-content-photo-button${profilePic ? ' transparent-hover' : ''}`}
                                    style={{ position: profilePic ? 'absolute' : 'relative' }}
                                    onClick={this.onForceOpenCrop}
                                >
                                    <CrazyIcon icon='icon-plus-thin' />
                                </div>
                                {profilePic && <ProfilePic url={profilePic} shape='circle' length={100} />}
                            </div>
                            <div style={{ marginLeft: 20, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                <UploadButton
                                    type='profile'
                                    ref='profile-upload-pic'
                                    label={<Text
                                        bold
                                        className='crazy-primary'
                                        size='xs'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {profilePic ? 'Change photo' : 'Upload your photo'}
                                    </Text>}
                                    crop
                                    onCrop={this.onCrop}
                                />
                                <Text size='xs' style={{ marginBottom: 3 }}>Photos help members recognize <br /> you in Fluttr</Text>
                            </div>
                        </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 30 }}>
                        <CrazyField
                            label='Your name'
                            placeholder='Type your name'
                            onFieldChange={(a, value) => { this.onFieldChange('name', value); }}
                            text={name}
                            style={{ width: 'calc(50% - 8px)' }}
                            config={config}
                            showMessages={showMessages}
                        />
                        <CrazyField
                            label='Your last name'
                            placeholder='Type your last name'
                            onFieldChange={(a, value) => { this.onFieldChange('lastName', value); }}
                            text={lastName}
                            style={{ width: 'calc(50% - 8px)' }}
                            showMessages={showMessages}
                            config={config}
                        />
                    </div>
                    <CrazyField
                        label='Your email'
                        text={email}
                        style={{ marginBottom: 30, width: '100%' }}
                        blocked
                    />
                    <Text size='xs' style={{ marginBottom: 6 }}>Your team</Text>
                    <CrazyDropdown
                        placeholder='Choose your team'
                        style={{ marginBottom: 30 }}
                        value={team.value}
                        onChange={this.onTeamChange}
                        options={options}
                    />
                    <CrazyField
                        label='Your role'
                        placeholder='Type your role'
                        onFieldChange={(a, value) => { this.onFieldChange('role', value); }}
                        text={role}
                        style={{ marginBottom: 30, width: '100%' }}
                        showMessages={showMessages}
                        config={config}
                    />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <CrazyButton
                            text='Update'
                            action={this.onUpdateProfile}
                            size='ceci'
                            loading={loading}
                        />
                    </div>
                </div>);
            }
            case 1: {
                return null;
            }
            case 2: {
                return null;
            }
            default: {
                return null;
            }
        }
    }

    onChangeTab = (value) => {
        if (value !== this.state.active) {
            this.setState({ active: value, showMessages: false, loading: false });
        }
    };

    render() {
        const { showRecruiterProfileEditModal, onHideRecruiterProfileModal } = this.props;
        return (<RecruiterCrazyModal
            show={showRecruiterProfileEditModal}
            onCloseButton={onHideRecruiterProfileModal}
            scrollable
            title={<div className='recruiter-profile-edit-modal-title'>
                <Header bold>My profile settings</Header>
                <CrazySwitcherTransparent
                    options={[
                        { text: 'PROFILE', value: 0 },
                        // { text: 'NOTIFICATIONS', value: 1 },
                        // { text: 'ACCOUNT', value: 2 }
                    ]}
                    onChange={this.onChangeTab}
                />
            </div>}
            size='md'
            className='recruiter-profile-edit-modal'
        >
            {this.renderContent()}
        </RecruiterCrazyModal>);
    }
}

@connect(({ user, uploadImage }) => ({ user, uploadImage }))
class CompanyEditModal extends Component {

    state = {
        active: 0,
        showMessages: false,
        loading: false,
        companyName: '',
        description: '',
        companyPic: '',
        imageId: null,
        website: '',
        companyId: null
    }

    componentDidMount() {
        resetUploadImage();
        this.prefillUserData(this.props.user.item.recruiterDetails.company);
    }

    prefillUserData = ({ name, description, logo, website, id }) => {
        let newForm = {
            companyName: name,
            description,
            companyPic: logo.url,
            website,
            imageId: logo.id,
            companyId: id
        };
        this.setState(newForm);
    };

    onFieldChange = (field, value) => {
        this.setState({ [field]: value });
    };

    onCrop = (companyLogo) => {
        if (this.props.uploadImage.item) {
            this.deleteImage();
        }

        this.props.dispatch(uploadImage(imageType.COMPANY, companyLogo, 'company_logo.png', this.onUploadOk));
    };

    onUploadOk = ({ url, id }) => {
        this.setState({ companyPic: url, imageId: id });
    };

    deleteImage = () => {
        this.props.dispatch(resetUploadImage());
    };

    onForceOpenCrop = () => {
        this.refs['company-upload-pic'].forceClick();
    };

    onUpdateCompany = () => {
        const { companyName, website, companyPic, description, imageId } = this.state;

        const proceed = Object.values({ companyName, website, companyPic, description }).every(el => !!el) && isValidUrl(website);

        this.setState({ loading: true, showMessages: true }, () => {
            if (proceed) {
                this.updateCallback({ companyName, website, description, imageId });
            } else {
                this.setState({ loading: false });
            }
        });
    };

    updateCallback = ({ companyName, website, description, imageId }) => {
        const param = {
            logoId: imageId,
            name: companyName,
            description,
            website
        };
        this.props.dispatch(updateCompany(this.state.companyId, param, this.onSaveOk, this.onError));
    };

    onSaveOk = () => {
        this.setState({ loading: false }, () => { manageSuccess(undefined, 'Company updated successfully'); this.props.onHideModal(); });
    };

    onError = () => {
        this.setState({ loading: false }, () => { manageErrorMessage(undefined, 'Oops, something went wrong.'); });
    };

    askIntercom = () => {
        if (window.Intercom) {
            window.Intercom('showNewMessage', '');
        }
    };

    cancelPlan = () => {
        if (window.Intercom) {
            window.Intercom('showNewMessage', 'Hello, I would like to cancel my subscription please!');
        }
    };

    renderTypeSlots = (type) => {
        const types = {
            challenge: 'slotChallenges',
            talent: 'slotTalents',
            template: 'slotTemplates',
            seat: 'slotBusinessUsers'
        };
        const selectedType = types[type];
        const availablePlans = getChallengeAvailableSlots(this.props.user.item);
        switch (type) {
            case 'challenge':
                return <Text size='sm' style={{ fontFamily: 'Lato, sans-serif', color: '#adb4c3' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`active test${availablePlans[selectedType] !== 1 ? 's' : ''} available`}
                </Text>;
            case 'talent':
                return <Text size='sm' style={{ fontFamily: 'Lato, sans-serif', color: '#adb4c3' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`candidate${availablePlans[selectedType] !== 1 ? 's' : ''} slot${availablePlans[selectedType] > 1 ? 's' : ''} left`}
                </Text>;
            default:
                return <Text size='sm' style={{ fontFamily: 'Lato, sans-serif', color: '#adb4c3' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`${type}${availablePlans[selectedType] !== 1 ? 's' : ''} available`}
                </Text>;
        }
    };

    renderContent = () => {
        const { active, companyName, showMessages, loading, website, companyPic, description } = this.state;
        const { user } = this.props;
        const config = {
            error: { condition: (text) => !text, message: 'Please fill this field' },
            success: { condition: (text) => !!text, message: '' }
        };
        const urlConfig = {
            error: { condition: (text) => !text || !isValidUrl(text), message: 'Please, type a valid url' },
            success: { condition: (text) => !!text && isValidUrl(text), message: '' }

        };
        const company = user.item && user.item.recruiterDetails && user.item.recruiterDetails.company || null;
        switch (active) {
            case 0: {
                return (<div className='company-edit-content' style={{ padding: '0 26px 20px' }}>
                    <div style={{ margin: '30px 0' }}>
                        <Text size='xs'>Company logo</Text>
                        <div className='profile-content-photo'>
                            <div style={{ position: 'relative' }}>
                                <div
                                    className={`profile-content-photo-button${companyPic ? ' transparent-hover' : ''}`}
                                    style={{ position: companyPic ? 'absolute' : 'relative' }}
                                    onClick={this.onForceOpenCrop}
                                >
                                    <CrazyIcon icon='icon-plus-thin' />
                                </div>
                                {!!companyPic && <ProfilePic url={companyPic} length={100} />}
                            </div>
                            <div style={{ marginLeft: 20, display: 'flex', justifyContent: 'flex-end', flexDirection: 'column' }}>
                                <UploadButton
                                    ref='company-upload-pic'
                                    label={<Text
                                        bold
                                        className='crazy-primary'
                                        size='xs'
                                        style={{ cursor: 'pointer' }}
                                    >
                                        {companyPic ? 'Change logotype' : 'Upload logotype'}
                                    </Text>}
                                    crop
                                    onCrop={this.onCrop}
                                />
                                <Text size='xs' style={{ marginBottom: 3 }}>Logotypes help candidates and invited<br /> members to recognize your company</Text>
                            </div>
                        </div>
                    </div>
                    <CrazyField
                        label='Company name'
                        placeholder='Your company name'
                        onFieldChange={(a, value) => { this.onFieldChange('companyName', value); }}
                        text={companyName}
                        style={{ marginBottom: 30, width: '100%' }}
                        showMessages={showMessages}
                        config={config}
                    />
                    <CrazyTextarea
                        label='Company description'
                        placeholder='Add company description'
                        value={description}
                        onChange={({ value }) => { this.onFieldChange('description', value); }}
                        style={{ width: '100%', minHeight: 168, marginBottom: 20 }}
                    />
                    <CrazyField
                        label='Company website'
                        placeholder='Your company website'
                        onFieldChange={(a, value) => { this.onFieldChange('website', value); }}
                        text={website}
                        style={{ marginBottom: 30, width: '100%' }}
                        showMessages={showMessages}
                        config={urlConfig}
                    />
                    <div style={{ display: 'flex', width: '100%', justifyContent: 'flex-end' }}>
                        <CrazyButton
                            text='Update'
                            action={this.onUpdateCompany}
                            size='ceci'
                            loading={loading}
                        />
                    </div>
                </div>);
            }
            case 1: {
                return (<div className='company-edit-content' style={{ padding: '0 26px 20px' }}>
                    <Text size='xs' style={{ marginTop: 23 }}>Current plan</Text>
                    <div className='current-plan'>
                        <Text bold>{company.plan.typeString}</Text>
                        <CrazyButton
                            size='small'
                            color='pink'
                            text='upgrade plan'
                            action={goToUpgrade}
                            inverse
                        />
                    </div>
                    {this.renderTypeSlots('seat')}
                    {this.renderTypeSlots('challenge')}
                    {this.renderTypeSlots('template')}
                    <CrazySeparator style={{ margin: '0 auto 7px' }} />
                    <Text size='xs' style={{ margin: 0 }}>Subscription</Text>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Text size='sm' style={{ margin: 0 }}>You are currently subscribed to {company.plan.typeString}</Text>
                        <Text
                            size='xs'
                            bold
                            className='crazy-pink'
                            style={{ cursor: 'pointer', visibility: company.plan.typeString === 'Freemium' ? 'hidden' : 'visible' }}
                            onClick={this.cancelPlan}
                        >cancel plan</Text>
                    </div>
                    <CrazySeparator style={{ margin: '0 auto 7px' }} />
                    <Text
                        size='xs'
                        className='crazy-mediumgrey'
                        style={{ textDecoration: 'underline', cursor: 'pointer' }}
                        onClick={this.askIntercom}
                    >Have a question? Contact Fluttr support</Text>
                </div>);
            }
            default: {
                return null;
            }
        }
    }

    onChangeTab = (value) => {
        if (value !== this.state.active) {
            this.setState({ active: value, showMessages: false, loading: false });
        }
    };

    render() {
        const { showModal, onHideModal } = this.props;
        return (<RecruiterCrazyModal
            show={showModal}
            onCloseButton={onHideModal}
            scrollable
            title={<div className='company-edit-modal-title'>
                <Header bold>Company settings</Header>
                <CrazySwitcherTransparent
                    options={[
                        { text: 'GENERAL', value: 0 },
                        { text: 'BILLING', value: 1 }
                    ]}
                    onChange={this.onChangeTab}
                />
            </div>}
            size='md'
            className='company-edit-modal'
        >
            {this.renderContent()}
            <Intercom />
        </RecruiterCrazyModal>);
    }
}

export const CrazySectionHeader = ({ items, active, onChange, className, ...rest }) => {
    return (
        <nav className={`crazy-section-header ${className}`}>
            <CrazySwitcherTransparent options={items} active={active} onChange={onChange} />
            <section className='nav-elements' {...rest} />
        </nav>
    );
};

const UserProfileMenu = ({ user, onShowRecruiterProfileModal, showCompanyEditModal }) => {

    const handleEditCompany = () => {
        showCompanyEditModal();
    };

    const handleLogout = () => {
        doLogout();
    };

    const renderTypeSlots = (type) => {
        const types = {
            challenge: 'slotChallenges',
            talent: 'slotTalents',
            template: 'slotTemplates',
            seat: 'slotBusinessUsers'
        };
        const selectedType = types[type];
        const availablePlans = getChallengeAvailableSlots(user);
        switch (type) {
            case 'challenge':
                return <Text style={{ fontFamily: 'Lato, sans-serif', color: 'inherit' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`active test${availablePlans[selectedType] > 1 ? 's' : ''} available`}
                </Text>;
            case 'talent':
                return <Text style={{ fontFamily: 'Lato, sans-serif', color: 'inherit' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`candidate${availablePlans[selectedType] > 1 ? 's' : ''} slot${availablePlans[selectedType] > 1 ? 's' : ''} left`}
                </Text>;
            default:
                return <Text style={{ fontFamily: 'Lato, sans-serif', color: 'inherit' }}>
                    <span style={{ display: 'inline-block', width: availablePlans[selectedType] !== -1 ? 23 : 'auto' }}>
                        {`${availablePlans[selectedType] !== -1 ? availablePlans[selectedType] : 'Unlimited '}`}
                    </span>
                    &nbsp;{`${type}${availablePlans[selectedType] > 1 ? 's' : ''} available`}
                </Text>;
        }
    };

    const onProfileEdit = () => {
        const isRecruiter = user.isRecruiter;

        if (isRecruiter) {
            onShowRecruiterProfileModal();
        } else {
            goToExpertEditProfile();
        }
    };

    const renderUserDropdownContent = () => {
        const isRecruiter = user.isRecruiter;
        const company = user && user.recruiterDetails && user.recruiterDetails.company || null;
        return (
            <section className='company-dropdown'>
                <div>
                    {company ?
                        <div className='company-information' onClick={handleEditCompany}>
                            {company.logo &&
                                <div className='profile-pic-wrapper'>
                                    <img src={getCompanyImage(company)} alt='company logo' className='company-logo' />
                                </div>
                            }
                            <div className='company-details'>
                                <p style={{ marginBottom: 0 }}>{company.name}</p>
                            </div>
                        </div> : (isRecruiter ?
                            <div className='company-information no-company' onClick={goToRecruiterCompanyCreate}>
                                <div className='company-placeholder' />
                                <p>Your Company</p>
                                <p className='update-button'>Update</p>
                            </div>
                            :
                            <div />
                        )
                    }

                    {isRecruiter &&
                        <hr />
                    }

                    {company ?
                        <div className='company-use-information'>
                            <div className='company-plan' onClick={goToUpgrade}>
                                <p>{company.plan.typeString}</p>
                                <CrazyButton
                                    size='small'
                                    color='pink'
                                    text='upgrade plan'
                                    action={goToUpgrade}
                                />
                            </div>
                            {renderTypeSlots('challenge')}
                            {renderTypeSlots('template')}
                            {renderTypeSlots('seat')}
                            {renderTypeSlots('talent')}
                        </div> : (isRecruiter ?
                            <div className='company-use-information'>
                                <p>Update your company information to start evaluating candidates</p>
                            </div>
                            :
                            <div />
                        )

                    }

                    {isRecruiter &&
                        <hr />
                    }

                </div>
                <div className='dropdown-button-container'>
                    <div className='link-menu-button' onClick={onProfileEdit}>
                        My profile settings
                    </div>
                    <div className='link-menu-button' onClick={handleLogout}>
                        Log out
                    </div>
                </div>
            </section>
        );
    };

    return (
        <DropdownMenu
            content={renderUserDropdownContent}
        >
            <div className='profile-pic-wrapper'>
                <ProfilePic
                    shape='circle'
                    url={user.imageUrl}
                    length='40'
                />
            </div>
        </DropdownMenu>
    );
};