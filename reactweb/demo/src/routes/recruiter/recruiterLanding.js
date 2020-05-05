import React, {Component} from 'react';
import { connect } from 'react-redux';

import {getCookie, COOKIE_RECRUITER_BOARDING} from '../../common/utils';
import {moveTo, goToRecruiterCompleteProfile, goToBoarding, goToRecruiterDashboard, goToRecruiterCompanyCreate} from '../../fltr/navigation/NavigationManager';
import {navigationRedirect} from '../../redux/actions/navigationActions';

@connect((state) => state)
class recruiterLanding extends Component {
    constructor () {
        super();
        this.state = {
            sample: true
        };
    }

    getRedirect(){
        return this.props.navigation.redirect;
    }

    manageRedirect(){
        const redirect = this.props.location.query.redirect;
        // redirect management
        if (redirect !== null && redirect !== undefined){
            // console.log("redirect to : " + redirect);
            // store in redux
            this.props.dispatch(navigationRedirect(redirect));
        }
        return redirect;
    }
    
    componentDidMount () {
        let redirect = this.manageRedirect();
        if (redirect === null || redirect === undefined) {
            redirect = this.getRedirect();
        }
        
        const {complete, company} = this.props.user.item.recruiterDetails;
        const {boarding} = this.props.user.item.recruiterDetails;
        // console.log('--------------------------------------------' + redirect);
        // console.log('boarding', boarding);
        // console.log(company, complete);
        if (complete !== true) {
            // console.log('complete is !== true')
            goToRecruiterCompleteProfile();
            return;
        }
        // redirect management
        if (redirect !== null && redirect !== undefined){
            // console.log('move to : ' + redirect);
            // clean redirect from redux
            this.props.dispatch(navigationRedirect(null));

            // do redirect
            moveTo(redirect);
            return;
        }
        if (company === null || company === undefined) {
            // console.log('company is not true')
            //if (boarding === false) {
                // console.log('no cookie found')
                goToRecruiterCompanyCreate();
                return;
            //}
        }
        else goToRecruiterDashboard();

    }
    render () {
        return null;
    }
}


export default recruiterLanding;
