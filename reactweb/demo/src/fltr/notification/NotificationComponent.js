import React from 'react';
import { connect } from 'react-redux';

import NotificationItem from './NotificationItem';

import {
    readNotifications, readNotificationById, fetchNotificationDetail, fetchNotification
} from '../../redux/actions/notificationActions';
import AsyncList from '../template/AsyncList';
import {manageErrorMessage, manageSuccess} from '../../common/utils';

import Row from '../../layout/layout/Row';
import CrazyButton from '../../layout/buttons/CrazyButtons';
import {Text} from '../../layout/FluttrFonts';
import SectionContainer from '../../common/components/dummy/SectionContainer';


@connect((state) => state)
export default class NotificationComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.callApi(0);
    };

    getList = () => {
        return this.props.notificationList;
    };

    callApi = (page) => {
        this.props.dispatch(fetchNotificationDetail(page));
    };

    loadItems = () => {
        let page = 0;
        let list = this.getList();

        if (!list.isFetching) {
            if (list.item) {
                page = list.item.number + 1;
            }
            this.callApi(page);
        }
    };

    createItem = (data) => {
        return (<NotificationItem key={`not_${data.id}_${Math.random()*1000}`} data={data} onItemClick={() => this.onItemClick(data)}/>);
    };

    /* Custom method */
    markNotificationsAsRead = () => {
        this.props.dispatch(readNotifications(this.onSuccess, this.onError));

    };

    onSuccess = () => {
        manageSuccess('notification-read', 'Notifications marked as read');
        this.props.dispatch(fetchNotification());
    };

    onError = (error) => {
        manageErrorMessage('notification-error', error);
    };

    onItemClick = (notification) => {
        if (!notification.read) {
            this.props.dispatch(readNotificationById(notification.id));
        }

    };

    render() {
        let list = this.getList();

        const emptyContent = <EmptyNotifications /> ;

        return(
            <SectionContainer className='notifications-page'>
                { list && list.item && list.item.totalElements > 0 &&
                    <section className='notification-header-container'>
                        <CrazyButton
                            action={this.markNotificationsAsRead}
                            text='Mark all read'
                            size='link'
                        />
                    </section>
                }
                <AsyncList
                    showEmpty={true}
                    emptyContent={emptyContent}
                    showHeader={false}
                    data={list}
                    onInit={this.init}
                    onLoad={this.loadItems}
                    onCreateItem={this.createItem}
                    className='notification-list'
                />
            </SectionContainer>
        );
    }
}

const EmptyNotifications = () => (
    <Row className='notifications-empty'>
        <Text>You don’t have any notifications yet.</Text>
        <div className='placeholder-item'>
            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-notifications.svg' width='100%' />
        </div>
        <div className='placeholder-item'>
            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-notifications.svg' width='100%' />
        </div>
        <div className='placeholder-item'>
            <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-notifications.svg' width='100%' />
        </div>
    </Row>
)

