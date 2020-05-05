import React from 'react';

import {
    Row,
    Col,
    Grid
} from '@sketchpixy/rubix';

import * as pendingTypes from '../../../constants/opportunityJudgePendingType';
import {goToPendingInvitations} from '../../navigation/NavigationManager';

import OpportunityHeaderPanel from '../../opportunity/OpportunityHeaderPanel';

import { Entity } from '@sketchpixy/rubix/lib/L20n';


export default class ExpertPendingInvitationItem extends React.Component {

    constructor(props) {
        super(props);
    }

    renderInvitationContent(){
        let data = this.props.data;

        switch(data.type){
        case pendingTypes.EXPERT:
            return (
                <Row>
                    <Col xs={10} xsOffset={1} className="panel-detail">
                        <span className="fluttrBlack">
                            Participate as an expert
                        </span>
                    </Col>
                </Row>
            );
        case pendingTypes.CHALLENGE:
            return (
                <Row>
                    <Col xs={10} xsOffset={1} className="panel-detail">
                        <span className="fluttrBlue">
                            Create the challenge
                        </span>
                    </Col>
                </Row>
            );
        default:
            return (<div></div>);
        }

    }

    onClick(){
        let data = this.props.data;
        switch(data.type){
        case pendingTypes.EXPERT:
            goToPendingInvitations();
            break;
        case pendingTypes.CHALLENGE:
            goToPendingInvitations();
            break;
        default:
            break;
        }

    }

    render() {
        let data = this.props.data;

        return (
            <Grid className="panel-container" onClick={() => this.onClick()}>
                <Row>
                    <Col xs={10} xsOffset={1} className="noPadding">
                        <OpportunityHeaderPanel data={data.opportunity} />
                    </Col>
                </Row>
                {this.renderInvitationContent()}
                <Row>
                    <Col xs={12} style={{textAlign:'right'}}>
                        <span className="panel-action-button" ><i style={{fontSize:'2em'}} className="icon-entypo-magnifying-glass" /> DETAILS</span>
                    </Col>
                </Row>
            </Grid>
        );
    }

}