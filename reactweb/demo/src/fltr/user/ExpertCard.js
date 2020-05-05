import React from 'react';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Image
} from '@sketchpixy/rubix';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

export default class ExpertCard extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let user = this.props.user;

        let mailto = 'mailto:' + user.email;

        return (
            <Grid>
                <Row className="vertical-align" style={{padding:20}}>
                    <Col xs={4} md={3} style={{textAlign: 'center', paddingLeft:10, paddingRight:10}} className="vertical-flex">
                        <div>
                            <img src={user.imageUrl} width='80' height='80' className="img-rounded"/>
                        </div>
                    </Col>
                    <Col xs={8} md={8} className="vertical-flex vertical-flex-align-left" style={{paddingRight:0}}>
                        <Grid fluid={false}>
                            <Row className="div-no-overflow">
                                <Col xs={12}>
                                    <span className="userName">{user.completeName}</span>
                                </Col>
                            </Row>
                            <Row>
                                <Col xs={12}>
                                    <span className="position">{user.completePosition}</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                    <Col xs={12} md={1} className="button-action">
                        <div style={{textAlign:'center'}}>
                            {user.social.linkedin &&
                            <a className="black" href={user.social.linkedin} target="_blank">
                                <i className="icon-fontello-linkedin-squared" style={{fontSize: 2 + 'em', verticalAlign: 'middle', color: '#007bb6'}}></i>
                            </a>
                            }
                            {user.social.linkedin == null &&
                            <a className="black" target="_blank" style={{visibility:'hidden'}}>
                                <i className="icon-fontello-linkedin-squared" style={{fontSize: 2 + 'em', verticalAlign: 'middle', color: '#007bb6'}}></i>
                            </a>
                            }
                            <OverlayTrigger placement="left" overlay={<Tooltip id='tooltip'>Send an email to <strong>{user.completeName}</strong></Tooltip>}>
                                <a className="grey" href={mailto}>
                                    <i className="icon-entypo-mail icon-right-padding" style={{fontSize: 2 + 'em', verticalAlign: 'middle'}}> </i>
                                </a>
                            </OverlayTrigger>
                        </div>
                    </Col>
                </Row>
            </Grid>
        );
    }
}

