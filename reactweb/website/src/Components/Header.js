import React, {Component} from 'react';
import {Link, withRouter} from 'react-router-dom';
import PropTypes from 'prop-types';

import {getAbout, getForApplicants, userLogin, getHowItWoks, getHome, redirectTo, getPricing, getBlog} from '../Utils/NavigationManager';

const fluttrLogo = 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/logo_white-min.png';

class Header extends Component {
    constructor () {
        super();
        this.state = {
            toggle: false,
            menuItems: [
                {
                    type: 'internal',
                    label: 'Employers',
                    target: null,
                    link: getHome(),
                    show: true
                },
                {
                    type: 'internal',
                    label: 'How it works',
                    target: '_top',
                    link: getHowItWoks(),
                    show: true
                },
                {
                    type: 'external',
                    label: 'Blog',
                    target: '_blank',
                    link: getBlog(),
                    show: true
                },
                {
                    type: 'external',
                    label: 'Pricing',
                    target: '_top',
                    link: getPricing(),
                    activeUrl: '/pricing',
                    show: true
                },
                {
                    type: 'external',
                    label: 'About us',
                    target: '_top',
                    link: getAbout(),
                    show: true
                }
                
            ]
        };
        this.toggleMenu = this.toggleMenu.bind(this);
        this.reloadScrollBars = this.reloadScrollBars.bind(this);
        this.unloadScrollBars = this.unloadScrollBars.bind(this);
        this.redirectToLogin = this.redirectToLogin.bind(this)
    }
    
    toggleMenu () {
        if (this.state.toggle) {
            this.reloadScrollBars();
        } else {
            this.unloadScrollBars();
        }
        this.setState(prevstate => (prevstate.toggle = !prevstate.toggle));
    }
    
    reloadScrollBars () {
        document.documentElement.style.overflow = 'auto'; // firefox, chrome
        document.body.scroll = 'yes'; // ie only
    }
    
    unloadScrollBars () {
        document.documentElement.style.overflow = 'hidden'; // firefox, chrome
        document.body.scroll = 'no'; // ie only
    }
    
    activeElement (item) {
        const {pathname} = this.props.location;
        const {link, activeUrl} = item;
        const isActive = [link, activeUrl].some((element) => element === pathname)
        if (isActive) return 'menu-active';
    }
    
    redirectToLogin (event) {
        event.preventDefault();
        redirectTo(userLogin());
    }
    
    render () {
        return (
            <div className='fluttr-navbar'>
            <div className='header-container'>
            <div className={this.state.toggle ? 'menu-container toggle' : 'menu-container'}>
            <Link to={getHome()}><img src={fluttrLogo} alt='Fluttr logo' className='brand-image' height='40' /></Link>
            {
                this.state.menuItems.map((item, index) => {
                    if (item.type === 'internal' && item.show) return (<Link to={item.link} className={this.activeElement(item)} key={index}>{item.label}</Link>);
                    else if (item.type === 'external' && item.show) return (<a href={item.link} className={this.activeElement(item)} target={item.target} key={index}>{item.label}</a>);
                })
            }
            <button className='unstyled-link btn btn-small btn-blue' onClick={this.redirectToLogin} target='_top'>Log in</button>
            <a href='javascript:void(0);' className='menu-toggle' onClick={this.toggleMenu}>&#9776;</a>
            </div>
            </div>
            </div>
            );
        }
    }
    
    export default withRouter(Header);
    