import React from 'react';

import {manageClickOnNotification} from '../../constants/notificationType';
import Col from '../../layout/layout/Col';
import Row from '../../layout/layout/Row';
import CrazyIcon from '../../layout/icons/CrazyIcon';
import {Text} from '../../layout/FluttrFonts';
import ProfilePic from '../../layout/uiUtils/ProfilePic';

export default class NotificationItem extends React.Component{

    constructor(props) {
        super(props);
    }

    manageLink = (e) => {
        manageClickOnNotification(this.props.data);
        this.props.onItemClick();
    };


    render() {

        return (
            <Row className='notification-item' onClick={this.manageLink}>
                <Col xs={10} className='notification-container' collapseLeft collapseRight>
                    <div className='notification-time-container' style={{paddingBottom: 0}}>
                        <Text size='sm' className='crazy-mediumgrey'>
                            <span className='time-elapsed'>{this.props.data.elapsed} ago</span>
                        </Text>
                    </div>
                    <div className='clearfix' />
                    <Text size='sm' bold className={`message-details fg-text ${this.props.data.flagNew && 'new-notification' || ''}`}>
                        {this.props.data.content}
                    </Text>
                    <div className='message-header'>
                        <Text size='sm' className='crazy-mediumgrey'>
                            {this.props.data.placeHolder
                                ? <span className='empty-notification' />
                                : <ProfilePic url={this.props.data.imageUrl} length='16' shape='circle' />
                            }{this.props.data.title}
                        </Text>
                    </div>
                </Col>
            </Row>
        );
    }

}