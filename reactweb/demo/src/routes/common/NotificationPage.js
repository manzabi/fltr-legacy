import React from 'react';
import NotificationComponent from '../../fltr/notification/NotificationComponent';
import {getCategory, NOTIFICATIONS, RECRUITER_DASHBOARD} from '../../constants/headerConstants';
import {setHeaderTitle} from '../../redux/actions/uiActions';
import {connect} from 'react-redux';


@connect(({dispatch}) => ({dispatch}))
export default class NotificationPage extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const newHeader = [
            getCategory(NOTIFICATIONS)
        ];
        this.props.dispatch(setHeaderTitle(newHeader));
    }

    componentWillUnmount() {
        this.props.dispatch(setHeaderTitle());
    }

    render() {
        return (
            <NotificationComponent />
        );
    }
}