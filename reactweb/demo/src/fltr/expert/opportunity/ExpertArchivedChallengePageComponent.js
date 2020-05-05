import React from 'react';
import { connect } from 'react-redux';

import OpportunityExpertCard from './OpportunityExpertCard';
import {fetchOpportunitiesForExperts} from '../../../redux/actions/opportunityActions';
import AsyncList from '../../template/AsyncList';
import EmptyBanner from '../../template/EmptyBanner';

@connect(({expertArchivedChallenges}) => ({expertArchivedChallenges}))
export default class ExpertArchivedChallengePageComponent extends React.Component {
    componentDidMount() {
        this.init();
    }

    init = ()  => {
        this.callApi(0);
    };

    getList = () => {
        return this.props.expertArchivedChallenges;
    };

    callApi = (page) => {
        this.props.dispatch(fetchOpportunitiesForExperts(page, 'archived'));
    };

    loadItems = () => {
        let id = this.props.id;
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
        return (<OpportunityExpertCard key={data.id} data={data} />);
    };

    render(){
        let list = this.getList();

        const emptyContent = <EmptyBanner text="No Archived Challenges"/>;

        return(
            <AsyncList
                showEmpty={true}
                emptyContent={emptyContent}
                title='Archived Challenges'
                data={list}
                onInit={this.init}
                onLoad={this.loadItems}
                onCreateItem={this.createItem}
            />
        );
    }

}
