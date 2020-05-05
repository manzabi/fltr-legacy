import React from 'react';
import { connect } from 'react-redux';

import PendingOpportunityRow from '../../fltr/expert/opportunity/PendingOpportunityRow';
import {fetchExpertPendingOpportunities} from '../../redux/actions/opportunityActions';

import AsynchContainer from '../../fltr/template/AsynchContainer';

import FullScreenExpertCompleteComponent from '../../fltr/expert/confirm/FullScreenExpertCompleteComponent';
import EmptyBanner from '../../fltr/template/EmptyBanner';


import Container from '../../layout/layout/Container';
import Grid from '../../layout/layout/Grid';
import Col from '../../layout/layout/Col';
import Row from '../../layout/layout/Row';
import { Header, Text } from '../../layout/FluttrFonts';
import {CHALLENGE} from '../../constants/opportunityJudgePendingType';
import {EXPERT_DASHBOARD, getCategory} from '../../constants/headerConstants';
import {setHeaderTitle} from '../../redux/actions/uiActions';
import SectionContainer from '../../common/components/dummy/SectionContainer';

@connect(({expertPendingOpportunities}) => ({expertPendingOpportunities}))
export default class ExpertDashboard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showFullScreen: false
        };
    }

    componentDidMount() {
        const newHeader = [
            getCategory(EXPERT_DASHBOARD)
        ];
        this.props.dispatch(setHeaderTitle(newHeader));
        this.loadPendingTasks();
        // this.loadActiveChallenges();

        // console.log('location path variables ' + JSON.stringify());
        if (this.props.location.query.completed){
            this.openFullScreen();
        }
    }

    componentWillUnmount() {
        this.props.dispatch(setHeaderTitle());
    }

    loadPendingTasks(){
        this.props.dispatch(fetchExpertPendingOpportunities());
    }

    openFullScreen(){
        // console.log(this.props)
        this.setState({
            showFullScreen : true
        });
    }

    onCloseFullScreen(){
        this.setState({
            showFullScreen : false
        });
    }

    render() {
        let {expertPendingOpportunities} = this.props;
        // let expertActiveChallenges = this.props.expertActiveChallenges;

        return (
            <SectionContainer className='dashboard'>
                {this.state.showFullScreen &&
                    <FullScreenExpertCompleteComponent onClose={() => this.onCloseFullScreen()}/>
                }
                <AsynchContainer data={expertPendingOpportunities} manageError={false}>
                    <PendingTasksComponent data={expertPendingOpportunities}/>
                </AsynchContainer>
            </SectionContainer>
        );
    }
}


const PendingTasksComponent = ({data}) => {

    let items = [];
    for(let i = 0; i < Object.keys(data.item).length; i++){
        if (data.item[i].type !== CHALLENGE) {
            items.push(
                <PendingOpportunityRow key={data.item[i].opportunity.id} data={data.item[i]} />
            );
        }
    }

    if (items.length === 0){
        return (
            <Row className='empty-tasks-container' revertMargin>
                <Text>You don’t have any pending tasks.</Text>
                <div className='placeholder-item'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-task.svg' width='100%' />
                </div>
                <div className='placeholder-item'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-task.svg' width='100%' />
                </div>
                <div className='placeholder-item'>
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/placeholder-task.svg' width='100%' />
                </div>
            </Row>
        );
    } else {
        return (
            <section className='expert-tasks-container'>
                <Header size='lg'>
                    Your pending tasks
                </Header>
                <div className='noPadding'>
                    {items}
                </div>
            </section>

        );
    }
}
