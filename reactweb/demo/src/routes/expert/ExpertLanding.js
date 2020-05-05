import React, {Component} from 'react';
import { connect } from 'react-redux';

import {
    moveTo, goToExpertCompleteProfile, goToExpertDashboard
} from '../../fltr/navigation/NavigationManager';
import {navigationRedirect} from '../../redux/actions/navigationActions';

@connect((state) => state)
export default class ExpertLanding extends Component {
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

        const {complete} = this.props.user.item.expertDetails;

        // console.log('--------------------------------------------' + redirect);

        if (complete !== true) {
            // console.log('complete is !== true')
            goToExpertCompleteProfile();
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
        goToExpertDashboard();
    }
    render () {
        return(
            <div></div>
        );
    }
}
