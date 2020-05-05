import React from 'react';

import {
    Row,
    Col,
} from '@sketchpixy/rubix';

import UserInfo from './UserInfo';

export default class PanelFluttrUserInfo extends React.Component {
    render() {
        return (
            <Row style={{backgroundColor: 'white'}} className={this.props.className}>
                <Col sm={12} >

                    <UserInfo user={this.props.user}/>

                </Col>
            </Row>
        );
    }
}