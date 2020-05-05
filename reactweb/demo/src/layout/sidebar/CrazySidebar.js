// EXTERNAL LIBRARIES
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Link } from 'react-router';
// OWN COMPONENTS IMPORT
import CrazyButton from '../buttons/CrazyButtons';
import CrazyIcon from '../icons/CrazyIcon';
import ProfilePic from '../uiUtils/ProfilePic';

// NAVIGATION IMPORTS
import {
    getExpertActiveChallenges,
    getExpertDashboard, getExpertManageTemplates, getRecruiterDashboard,
    goToCreateTest, goToExpertDashboard, goToRecruiterDashboard
} from '../../fltr/navigation/NavigationManager';
import NotificationMenuNew from '../../fltr/notification/NotificationMenuNew';
import { Text } from '../FluttrFonts';


@connect(({ user }) => ({ user }))
export default class CrazySidebar extends Component {
    state = {
        open: false
    }

    handleOpen = () => {
        this.setState({
            open: true
        });
    }

    handleClose = () => {
        this.setState({
            open: false
        });
    }

    onLogoClick() {
        const { item: user } = this.props.user;
        const isRecruiter = user.isRecruiter;

        if (isRecruiter) {
            goToRecruiterDashboard();
        } else {
            goToExpertDashboard();
        }
    }

    renderHead = (s) => {
        const { open } = this.state;
        const logoSrc = open ? 'https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' : 'https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/onlyLogo.png';
        return (
            <div className='item-wrapper logo' onClick={() => this.onLogoClick()}>
                <img src={logoSrc} style={{ margin: 'auto', display: 'block' }} height='40px' />
            </div>
        );
    };

    renderItem = (route, text, crazyIcon, fontSize) => {
        const { open } = this.state;
        return (
            <Link className='item-wrapper' activeClassName='selected' to={route}>
                {crazyIcon && <div className='menuitem'><CrazyIcon icon={crazyIcon} style={{fontSize}} className='menu-icon' /></div>}
                {text && open && <p>{text}</p>}
            </Link>
        );
    };

    renderNotifications = () => {
        const { open } = this.state;
        return (

            <Link className='item-wrapper' activeClassName='selected' to='/notifications'>
                <NotificationMenuNew />
                {open && <p>NOTIFICATIONS</p>}
            </Link>
        );
    };

    render() {
        const { item: user } = this.props.user;
        const { open } = this.state;
        if (user) {
            const isExpert = user.isJudge;
            const isRecruiter = user.isRecruiter;
            let canCreateTemplate = false;
            if (isExpert) {
                canCreateTemplate = user.expertDetails.template;
            }
            return (
                <nav
                    id='crazy-sidebar'
                    className={`crazy-sidebar ${open ? 'open' : 'closed'}${this.props.bannerStatus ? ' banner-active' : ''}`}
                    onMouseEnter={this.handleOpen}
                    onMouseLeave={this.handleClose}
                >
                    <div className='sidebar-block sidebar-topitems-container'>
                        {this.renderHead()}
                    </div>
                    <div className='sidebar-block sidebar-middleitems-container'>
                        <div className='nav-group notifications-container'>
                            {isRecruiter && this.renderItem(getRecruiterDashboard(), 'MY TESTS', 'icon-tests', 17)}
                            {isExpert && this.renderItem(getExpertActiveChallenges(), 'TESTS TO ASSESS', 'icon-assessment', 14)}
                            {isExpert && this.renderItem(getExpertDashboard(), 'PENDING TASKS', 'icon-pending-tasks', 20)}
                            {isExpert && canCreateTemplate && this.renderItem(getExpertManageTemplates(), 'MANAGE TEMPLATES', 'icon-tests', 19)}
                            {this.renderNotifications()}
                        </div>
                    </div>

                    <div className='sidebar-block sidebar-bottomitems-container'>
                        {isRecruiter &&
                            <div className='button-wrapper'>
                                <CrazyButton
                                    text={open ? 'New test' : ''}
                                    icon='icon-plus-big'
                                    size={open && 'sidebar' || ''}
                                    circle={!open}
                                    action={goToCreateTest}
                                />
                            </div>
                        }
                        {/*{this.renderItem(undefined, 'FAQs & help', false, 'icon-plus-big')}*/}
                    </div>
                </nav>
            );
        } else return null;
    }
}