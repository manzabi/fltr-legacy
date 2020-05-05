import React from 'react';
import { connect } from 'react-redux';
import { Link, withRouter } from 'react-router';

import {
    NavDropdownHover,
    MenuItem,
    Badge,
    Button,
    Icon,
    Grid,
    Row,
    Col
} from '@sketchpixy/rubix';

import Spinner from '../Spinner';
import Warning from '../Warning';
import NotificationItem from  './NotificationItem';

import l20n, { Entity } from '@sketchpixy/rubix/lib/L20n';

const NOTIFICATION_DEFAULT_SIZE = 4;

import {
    forceCallNotificationList,
    fetchNotification,
    readNotifications,
    readNotificationById} from '../../redux/actions/notificationActions';

import {manageSuccess, manageErrorMessage} from '../../common/utils';

@connect((state) => state)
@withRouter
export default class NotificationsMenu extends React.Component {

    componentDidMount(){
        if (this.props.notifications.item == null) {
            this.reloadNotifications();
        }

        this.timerID = setInterval(
            () => this.reloadNotifications(),
            //120000
            120000
        );
    }

    componentWillUnmount() {
        clearInterval(this.timerID);
    }

    reloadNotifications() {
        this.props.dispatch(fetchNotification());
    }

    reloadNotificationList(){
        this.props.dispatch(forceCallNotificationList());
    }

    onItemClick (notification) {
        if (!notification.read) {
            // console.log('call READ notification with id : ' + notification.id);
            this.props.dispatch(readNotificationById(notification.id));
        }
    }

    printInternalNotificationBox() {
        let managedNotificationList = this.props.notificationList;

        if (managedNotificationList == null || managedNotificationList.isFetching){
            return (
                <div style={{padding: 20, textAlign: 'center'}}>
                    <Spinner />
                </div>
            );
        } else if (managedNotificationList.isError){
            return (
                <div style={{padding: 20, textAlign: 'center'}}>
                    <Warning />
                </div>
            );

        } else {
            if (managedNotificationList.item.totalElements == 0) {
                return (<div style={{padding: 15}}>No Notifications</div>);
            } else {
                return (
                    managedNotificationList.item.content.slice(0, NOTIFICATION_DEFAULT_SIZE).map(notification =>
                        <NotificationItem key={notification.id} data={notification} onItemClick={() => this.onItemClick(notification)}/>
                    )
                );
            }
        }
    }

    getTotalNotifications(){
        let managedNotifications = this.props.notifications;

        if (managedNotifications == null || managedNotifications.isFetching){
            return (
                0
            );
        } else if (managedNotifications.isError){
            return (
                0
            );

        } else {

            return (
                managedNotifications.item.notificationCenter.count
            );
        }
    }

    componentWillReceiveProps(nextProps) {
        if (nextProps.notifications.forceListCall) {
            this.reloadNotificationList();
        }
    }

    markNotificationsAsRead(){

        this.props.dispatch(readNotifications(
            function (){
                manageSuccess('notification-read', 'Notifications marked as read');
            },
            function (error) {
                manageErrorMessage('notification-read', error);
            }
        ));

    }

    getPath(path) {
        var dir = this.props.location.pathname.search('recruiter') !== -1 ? 'recruiter' : 'judge';
        path = `/${dir}/${path}`;
        return path;
    }

    render() {
        const bullhornIcon = (
            <span style={{marginLeft: 15}}>
                <Icon bundle='entypo' glyph='bell' style={{fontSize: 18}}/>
                <Badge className='fg-white bg-red notification-badge' style={{display: this.getTotalNotifications() > 0 ? '' : 'none' }}>{this.getTotalNotifications()}</Badge>
            </span>
        );

        return (
            <NavDropdownHover noCaret eventKey={6} title={bullhornIcon} id='notifications-menu' className='header-menu collapse-left'>

                <MenuItem header>
                    <Entity entity='notificationsMenuHeading' />
                </MenuItem>

                {this.printInternalNotificationBox()}

                <MenuItem noHover>
                    <Grid style={{marginBottom: -10}}>
                        <Row>
                            <Col xs={12} sm={6} collapseLeft collapseRight>
                                <Button block className='notification-footer-btn left-btn' onClick={::this.markNotificationsAsRead} >MARK ALL READ </Button>
                            </Col>
                            <Col xs={12} sm={6} collapseLeft collapseRight>
                                <Button block className='notification-footer-btn right-btn' to={this.getPath('notification')} componentClass={Link}>VIEW ALL</Button>
                            </Col>
                        </Row>
                    </Grid>
                </MenuItem>

            </NavDropdownHover>
        );
    }

}
