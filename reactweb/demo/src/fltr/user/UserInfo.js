import React from 'react';

import {
    Grid,
    Row,
    Col,
} from '@sketchpixy/rubix';

import Spinner from '../Spinner';
import Warning from '../Warning';

export default class UserInfo extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let user = this.props.user;
        // console.log("render utente");
        // console.log(this.props);
        // console.log(user);

        if (user == null || user.isFetching){
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Spinner />
                </div>
            );
        } else if (user.isError){
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Warning />
                </div>
            );

        } else {
            return (
                <Grid>
                    <Row className="vertical-align user-info-box">
                        <Col xs={4} md={2} className="vertical-flex" style={{padding:0}}>
                            <img src={user.item.imageUrl} height='100' width='100'
                                style={{marginLeft: 10, borderRadius: 100, border: '2px solid #fff'}}/>
                        </Col>
                        <Col xs={8} md={10} className="vertical-flex vertical-flex-align-left" style={{padding:0}}>
                            <Grid fluid={false}>
                                <Row>
                                    <Col xs={12}>
                                        <div className='fg-darkgrayishblue75 user-info-name'>
                                            <span className="userName" style={{fontSize:22}}>{user.item.completeName}</span>
                                        </div>

                                        <div className='fg-text user-info-position'>
                                            <span className="position" style={{fontSize:20}}>{user.item.completePosition}</span>
                                        </div>
                                    </Col>
                                </Row>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>
            );
        }
    }
}

