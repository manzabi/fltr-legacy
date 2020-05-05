import React, {Component} from 'react';
import {connect} from 'react-redux';
import {browserHistory, withRouter, Link} from 'react-router';
import { fetchNotification, forceCallNotificationList, readNotificationById, readNotifications } from '../../redux/actions/notificationActions';
import { manageSuccess, manageErrorMessage } from '../../common/utils';
import {isMobile} from 'react-device-detect';
import * as webPlatforms from '../../constants/webPlatforms';
import {manageClickOnNotification} from "../../constants/notificationType";
import CrazyIcon from '../../layout/icons/CrazyIcon';

@withRouter
@connect(({notificationList, notifications}) => ({notificationList, notifications}))
export default class NotificationMenuNew extends Component {
    componentDidMount () {
        this.timerID = setInterval(
            () => this.reloadNotifications(),
            //120000
            120000
        );
        this.reloadNotifications();
    }
    componentWillUnmount () {
        clearInterval(this.timerId);
    }
    componentWillReceiveProps(nextProps) {
        if (nextProps.notifications.forceListCall) {
            this.reloadNotificationList();
        }
    }
    reloadNotifications = () => {
        this.props.dispatch(fetchNotification());
    };


    reloadNotificationList = () => {
        this.props.dispatch(forceCallNotificationList());
    };

    markNotificationsAsRead = () => {
        this.props.dispatch(readNotifications(
            function (){
                manageSuccess('notification-read', 'Notifications marked as read');
            },
            function (error) {
                manageErrorMessage('notification-read', error);
            }
        ));
    };

    render () {
        const notifications = this.props.notificationList;
        let unreadNumber = 0;
        let unreadList = [];
        if (notifications.item) {
            const list = notifications.item.content;
            unreadList = list.filter((notification) => notification.flagNew);
            unreadNumber = unreadList.length;
            if (unreadNumber > 0) {
                if (!document.title.includes('*')) {
                    document.title = `* ${document.title}`;
                }
            } else if (document.title.includes('*')) {
                document.title = document.title.split('* ').join('');
            }
        }
        if (notifications.item !== undefined) {
            return (
                <div className='menuitem'>
                    <CrazyIcon icon='icon-bell' style={{fontSize: 19}} />
                    {unreadNumber > 0 &&
                    <span className='notification-number'>{unreadNumber}</span>
                    }
                </div>
            );
        } else {
            return null;
        }
    }
}