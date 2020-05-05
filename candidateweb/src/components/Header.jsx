import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import { getAbout, userLogin, getHome, navigateToUrl, handleGoDashboard, goToLogout, goToEditProfile, getToDashboard } from '../utils/navigationManager';

const fluttrLogo = 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/logo_white-min.png';

class Header extends Component {
    constructor() {
        super();

        let items = [
            {
                type: 'external',
                label: 'Employers',
                target: null,
                link: getHome(),
                show: true
            }];

        items.push(...this.getCandidateRoute());

        this.state = {
            toggle: false,
            userToggle: false,
            menuItems: items,
            logged: false
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.reloadScrollBars = this.reloadScrollBars.bind(this);
        this.unloadScrollBars = this.unloadScrollBars.bind(this);
    }

    componentWillReceiveProps(props) {
        let oldAuth = false;
        if (this.props && this.props.user) {
            oldAuth = this.props.user.item !== undefined && this.props.user.isError !== true;
        }
        let newAuth = false;
        if (props && props.user) {
            newAuth = props.user.item !== undefined && props.user.isError !== true;
        }
        if (oldAuth !== newAuth) {

            let items = [
                {
                    type: 'external',
                    label: 'Employers',
                    target: null,
                    link: this.goEmployer(),
                    show: true
                }];

            items.push(...this.getCandidateRoute(props));

            this.setState({
                menuItems: items
            });
        }
    }

    goEmployer = () => {
        const BASE_URL = getHome();
        return `${BASE_URL}/employers`;
    }

    toggleMenu() {
        if (this.state.toggle) {
            this.reloadScrollBars();
        } else {
            this.unloadScrollBars();
        }
        this.setState(prevstate => (prevstate.toggle = !prevstate.toggle));
    }

    goCandidateDashboard = () => {
        handleGoDashboard();
    }

    toggleUserMenu = () => {
        this.setState({
            userToggle: !this.state.userToggle
        });
    }

    renderUser = () => {
        let withAuth = false;
        if (this.props && this.props.user) {
            withAuth = this.props.user.item !== undefined && this.props.user.isError !== true;
        }
        if (withAuth) {
            const user = this.props.user.item;
            return (
                <section className={`user-menu ${this.state.userToggle ? 'toggle' : ''}`}>
                    <div className='user-details' onClick={this.toggleUserMenu}>
                        <img width='40' src={user.imageUrl} alt="" />
                        <div className='name-container'>{user.completeName}</div>
                        <i className={`fas ${this.state.userToggle ? 'fa-sort-up' : 'fa-sort-down'}`} />
                    </div>
                    <section className='dropdown-menu'>
                        <div className='menu-item' onClick={goToEditProfile}>
                            Edit profile
                        </div>
                        <div className='menu-item' onClick={goToLogout}>
                            Log out
                        </div>
                    </section>
                </section>
            );
        } else {
            return <button className='btn btn-small btn-blue' onClick={() => navigateToUrl(userLogin())} target='_top'>Log in</button>;
        }
    }

    getCandidateRoute = (props) => {
        let Props;
        if (props !== undefined) {
            Props = props;
        } else {Props = this.props;}
        let withAuth = false;
        if (Props && Props.user) {
            withAuth = Props.user.item !== undefined && Props.user.isError !== true;
        }
        if (withAuth) {
            return [{
                type: 'internal',
                label: 'My opportunities',
                target: null,
                link: getToDashboard(),
                show: true
            }];
        } else {
            return [
                {
                    type: 'external',
                    label: 'About us',
                    target: '_top',
                    link: getAbout(),
                    show: true
                }];
        }
    }

    reloadScrollBars() {
        document.documentElement.style.overflow = 'auto'; // firefox, chrome
        document.body.scroll = 'yes'; // ie only
    }

    unloadScrollBars() {
        document.documentElement.style.overflow = 'hidden'; // firefox, chrome
        document.body.scroll = 'no'; // ie only
    }


    activeElement(item) {
        if (this.props.location.pathname === item.link) {
            return 'menu-active';
        }
    }

    render() {
        return (
            <div className='fluttr-navbar'>
                <div className='header-container'>
                    <div className={this.state.toggle ? 'menu-container toggle' : 'menu-container'}>
                        <a href={getHome()}><img src={fluttrLogo} alt='Fluttr logo' className='brand-image' height='40' /></a>
                        {
                            this.state.menuItems.map((item, index) => {
                                if (item.type === 'internal' && item.show) {return (<Link to={item.link} className={this.activeElement(item)} key={index}>{item.label}</Link>);}
                                else if (item.type === 'external' && item.show) {return (<a href={item.link} className={this.activeElement(item)} target={item.target} key={index}>{item.label}</a>);}
                            })
                        }
                        {
                            this.renderUser()
                        }
                        <a href='javascript:void(0);' className='menu-toggle' onClick={this.toggleMenu}>&#9776;</a>
                    </div>
                </div>
            </div>
        );
    }
}

function mapStateToProps({ user }) {
    return {
        user
    };
}

export default withRouter(connect(mapStateToProps)(Header));
