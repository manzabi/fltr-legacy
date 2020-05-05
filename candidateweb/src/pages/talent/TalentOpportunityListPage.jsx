import React, {Component} from 'react';
import { fetchUserOpportunties } from '../../redux/actions/opportunityActions';
import {connect} from 'react-redux';
import AsynchList from '../../components/asyncComponents/AsynchList';
import TalentOpportunityFullCardComponen from './TalentOpportunityFullCardComponent';
import FluttrButton from '../../common/components/FluttrButton';
import { navigateToUrl, getForApplicants } from '../../utils/navigationManager';

class TalentOpportunityListPage extends Component {
    
    componentDidMount () {
        this.init();
    }

    createItem = (opportunity) => {
        return <TalentOpportunityFullCardComponen key={opportunity.id} opportunity={opportunity} />;
    };

    init = () => {
        this.callApi(0);
    }
    
    callApi = (page) => {
        this.props.dispatch(fetchUserOpportunties(page));
    }

    loadItems = () => {
        let page = 0;
        let list = this.getList();

        if (!list.isFetching) {
            if (list.item) {
                page = list.item.number + 1;
            }
            this.callApi(page);
        }
    }

    getList(){
        return this.props.userOportunities;
    }

    emptyContent = () => {
        return (
            <section className='empty-opportunity-list' style={{textAlign: 'center'}}>
                <h1>Search for a job and apply to an opportunity</h1>
                <p>It seems like you haven’t applied to any opportunity yet.</p>
                <p>Apply to an oppotunity and it will show up here.</p>
                <FluttrButton action={() => navigateToUrl(getForApplicants())}>
                Search
                </FluttrButton>
            </section>
        );
    }

    render () {
        const list = this.props.userOportunities;
        // console.log(JSON.stringify(list));
        return (
            <section className='candidate-opportunity-list'>
                <h1 className='opportunity-list-title'>
                    My opportunity
                </h1>
                <AsynchList
                    showHeader={false}
                    showEmpty={true}
                    emptyContent={this.emptyContent()}
                    title='Your opportunities'
                    data={list}
                    onLoad={this.loadItems}
                    onInit={this.init}
                    onCreateItem={this.createItem}
                    
                />
            </section>
        );
    }
}

function mapStateToProps ({userOportunities}) {
    return {
        userOportunities
    };
}

export default connect(mapStateToProps)(TalentOpportunityListPage);