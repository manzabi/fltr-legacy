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

import {doLogout} from '../../common/utils';
import { Entity } from '@sketchpixy/rubix/lib/L20n';


export default class PlayerHidden extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLogout(e) {
        doLogout();
    }

    render() {
        let user = this.props.user;
        // console.log('player hiden : ' + JSON.stringify(user));

        let name = user.completeName;
        if (user.hideUser){
            name = user.name;
        }

        let fluid = true;
        if (this.props.fluid !== undefined) fluid = this.props.fluid;


        return (
            <Grid fluid={fluid}>
                <Row className="vertical-align">
                    <Col xs={12} sm={2} style={{textAlign: 'center'}} className="vertical-flex">
                        <div>
                            <img src={user.imageUrl} width='50' height='50' className="img-rounded"/>
                        </div>
                    </Col>
                    <Col xs={12} sm={3} className="vertical-flex vertical-flex-align-left" style={{paddingRight:0, paddingLeft:0}}>
                        <Grid>
                            <Row className="div-no-overflow">
                                <Col xs={12}>
                                    <span className="userNameLittle">{name}</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                    {this.props.submissionDate &&
                    <Col xs={12} sm={3} className="vertical-flex vertical-flex-align-left" style={{paddingRight:0, paddingLeft:0}}>
                        <Grid>
                            <Row className="div-no-overflow">
                                <Col xs={12}>
                                    <span className="userNameLittle">{`Submitted on ${this.props.submissionDate}`}</span>
                                </Col>
                            </Row>
                        </Grid>
                    </Col>
                    }
                </Row>
            </Grid>
        );
    }
}
