import React, {Component} from 'react';
import Intercom from 'react-intercom';
const Config = require('Config');
import { connect } from 'react-redux';

@connect((state) => state)
class IntercomComponent extends Component {
    constructor (props) {
        super(props);
        const user = {
            user_id:this.props.user.item.id,
            user_hash:this.props.user.item.intercomHMAC,
            name:this.props.user.item.completeName,
            position:this.props.user.item.completePosition || null,
            company:this.props.user.item.recruiterDetails && this.props.user.item.recruiterDetails.company && this.props.user.item.recruiterDetails.company.name || null
        };
        if (user.position) user.name = user.name + ' is ' + user.position;
        if (user.company) user.name = user.name + ' at ' + user.company;
        const isProduction = Config.env === 'production';
        this.state = {user};
    }
    render () {
        return (
            <Intercom appID={Config.intercomKey} {...this.state.user} />
        );
    }
}

export default IntercomComponent;
