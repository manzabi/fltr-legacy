import React from 'react';

import { connect } from 'react-redux';

import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Image
} from '@sketchpixy/rubix';

import AsynchContainer from '../../../template/AsynchContainer';


import {fetchExpertList} from '../../../../redux/actions/expertListActions';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import PanelContainer, {PanelContainerContent} from '../../../template/PanelContainer';
import PlayerHidden from '../../../user/PlayerHidden';
import ExpertCard from '../../../user/ExpertCard';

@connect((state) => state)
export default class ExpertListComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;

        this.props.dispatch(fetchExpertList(id));
    }

    render() {

        let id = this.props.id;
        let objectStored = this.props.expertListForOpportunity;

        return (
            <div className="expertListComponent">
                <AsynchContainer data={objectStored} manageError={false}>
                    <UserToReviewContent id={id} data={objectStored} />
                </AsynchContainer>
            </div>
        );
    }

}

class UserToReviewContent extends React.Component{

    constructor(props) {
        super(props);
    }

    render(){

        let id = this.props.id;
        let item = this.props.data;

        if (item.isError){
            return(
                <div style={{marginTop:50,textAlign:'center'}}>
                    <span className="summaryTitle">
                        Experts are not available
                    </span>
                </div>
            );

        }

        let userList = item.item;

        let expertListToShow = userList.map(function(content){
            return (
                <PanelContainerContent padding={false} key={content.id}>
                    <ExpertCard user={content}/>
                </PanelContainerContent>);
        });

        return (
            <Grid>
                <Col xs={12} className="noPadding">
                    <span className="summaryTitle">
                        {expertListToShow.length} Experts participating
                    </span>
                    <br/><br/>
                    <Grid>
                        {expertListToShow}
                    </Grid>
                </Col>
            </Grid>
        );
    }
}
