import React from 'react';

import {
    Row,
    Col,
    Grid
} from '@sketchpixy/rubix';

import {goToReviewForExpert} from '../../navigation/NavigationManager';

import OpportunityHeaderPanel from '../../opportunity/OpportunityHeaderPanel';
import OpportunityTimer from '../../opportunity/OpportunityTimer';

export default class ExpertActiveChallengeItem extends React.Component {

    constructor(props) {
        super(props);
    }

    renderActiveChallengeContent(){
        let data = this.props.data;
        let reviewLeft = 0;
        if (data.expertDetail != null){
            reviewLeft = data.expertDetail.reviewLeft;
        }

        if (reviewLeft > 0){
            return (
                <Row>
                    <Col xs={10} xsOffset={1} className="panel-detail">
                        <span className="fluttrDarkOrange">
                            {reviewLeft} Pending review{reviewLeft > 1 ? 's' : ''}
                        </span>
                    </Col>
                </Row>
            );
        } else {
            return (
                <Row>
                    <Col xs={10} xsOffset={1} className="panel-detail">
                        <span className="fluttrGreen">
                            No pending reviews
                        </span>
                    </Col>
                </Row>
            );
        }
    }

    renderActiveChallengeFooter(){
        let data = this.props.data;
        let reviewLeft = 0;
        if (data.expertDetail != null){
            reviewLeft = data.expertDetail.reviewLeft;
        }

        return(
            <Row className="vertical-align">
                <Col xs={6} xsOffset={1} className="vertical-flex vertical-flex-align-left noPadding">
                    <span className="panel-action-button">
                        <OpportunityTimer role="expert" key={data.id} data={data} ends={true} colorNormal="#333333" dayLimit={3}/>
                    </span>
                </Col>
                <Col xs={5} className="vertical-flex vertical-flex-align-right">
                    {reviewLeft > 0 &&
                    <span className="panel-action-button" ><i style={{fontSize:'2em'}} className="icon-entypo-pencil fluttrOrange" /> REVIEW</span>
                    }
                    {reviewLeft == 0 &&
                    <span className="panel-action-button" ><i style={{fontSize:'2em'}} className="icon-entypo-magnifying-glass" /> VIEW</span>
                    }
                </Col>
            </Row>
        );
    }

    onClick(){
        let data = this.props.data;
        goToReviewForExpert(data.id);
    }

    render() {
        let data = this.props.data;

        return (
            <Grid className="panel-container" onClick={() => this.onClick()}>
                <Row>
                    <Col xs={10} xsOffset={1} className="noPadding">
                        <OpportunityHeaderPanel data={data} />
                    </Col>
                </Row>
                {this.renderActiveChallengeContent()}
                {this.renderActiveChallengeFooter()}
            </Grid>
        );
    }

}