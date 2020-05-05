import React, { Component } from 'react';
import { connect } from 'react-redux';

import RecruiterOpportunityCard from '../opportunity/RecruiterOpportunityCard';
import AsynchContainer from '../../template/AsynchContainer';
import AsyncList from '../../template/AsyncList';
import { resetRecruiterOpportunties, fetchRecruiterOpportunties, fetchChallengeStats } from '../../../redux/actions/recruiterOpportunityActions';

import Intercom from '../../utils/Intercom';
import { Text } from '../../../layout/FluttrFonts';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { goToCreateTest } from '../../navigation/NavigationManager';
import MainContainer from '../../../common/components/MainContainer';
import { CrazySectionHeader } from '../../../layout/header/Header';
import Grid from '../../../layout/layout/Grid';
import Container from '../../../layout/layout/Container';

export const RECRUITER_DASHBOARD_CONFIRM_OPPORTUNITY_LIVE = 'opportunity_live';
export const RECRUITER_DASHBOARD_CONFIRM_OPPORTUNITY_CHALLENGE_LIVE = 'opportunity_challenge_live';

@connect((state) => state)
export default class RecruiterDashboardComponent extends Component {
    constructor(props) {
        super(props);
        this.state = {
            showOpportunityChallengeLive: false,
            opportunityFilter: 'all',
        };
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        this.props.dispatch(resetRecruiterOpportunties());
        this.callApi(0, this.state.opportunityFilter);
    }

    handleChangeFilter = (id) => {
        this.setState({
            opportunityFilter: id
        }, this.init);
    }

    renderList = (data) => {
        if (data && data.item) {
            const closedEmpty = <ClosedChallengesEmptyContent />;
            const draftEmpty = <DraftChallengesEmptyContent />;
            const activeEmpty = <ActiveChallengesEmptyContent />;
            switch (this.state.opportunityFilter) {
                case 'all': {
                    if (data.item.active && data.item.closed && data.item.draft) {
                        return (
                            <div className='no-filters-section'>
                                <section className='list-container'>
                                    <AsyncList
                                        spy={false}
                                        showEmpty={true}
                                        emptyContent={activeEmpty}
                                        showHeader={false}
                                        newHeader='ACTIVE'
                                        data={{ ...data, item: { ...data.item.active } }}
                                        onInit={this.init}
                                        onLoad={() => this.loadItems('active')}
                                        onCreateItem={this.createItem}
                                        fluid
                                    />
                                </section>
                                <section className='list-container'>
                                    <AsyncList
                                        spy={false}
                                        showEmpty={true}
                                        showHeader={false}
                                        newHeader='DRAFT'
                                        emptyContent={<div />}
                                        data={{ ...data, item: { ...data.item.draft } }}
                                        onInit={this.init}
                                        onLoad={() => this.loadItems('draft')}
                                        onCreateItem={this.createItem}
                                        fluid
                                        showHeaderOnEmpty={false}
                                    />
                                </section>
                                <section className='list-container'>
                                    <AsyncList
                                        spy={false}
                                        showEmpty={true}
                                        showHeader={false}
                                        newHeader='CLOSED'
                                        emptyContent={<div />}
                                        data={{ ...data, item: { ...data.item.closed } }}
                                        onInit={this.init}
                                        onLoad={() => this.loadItems('closed')}
                                        onCreateItem={this.createItem}
                                        fluid
                                        showHeaderOnEmpty={false}
                                    />
                                </section>
                            </div>
                        );
                    }
                    break;
                }

                default: {
                    const content = { empty: null, data: null };
                    let title;
                    if (this.state.opportunityFilter === 'active') {
                        content.empty = activeEmpty;
                        content.data = { ...data, item: { ...data.item.active } };
                        title = 'ACTIVE';
                    } else if (this.state.opportunityFilter === 'closed') {
                        content.empty = closedEmpty;
                        content.data = { ...data, item: { ...data.item.closed } };
                        title = 'CLOSED';
                    } else if (this.state.opportunityFilter === 'draft') {
                        content.empty = draftEmpty;
                        content.data = { ...data, item: { ...data.item.draft } };
                        title = 'DRAFT';
                    }

                    return (
                        <AsyncList
                            showEmpty={true}
                            emptyContent={content.empty}
                            showHeader={false}
                            newHeader={title}
                            data={content.data}
                            onInit={this.init}
                            onLoad={() => this.loadItems(this.state.opportunityFilter)}
                            onCreateItem={this.createItem}
                            scrollableElement='main-content'
                            offsetToLoad={500}
                            fluid
                            showHeaderOnEmpty
                        />
                    );
                }
            }
        }
    };

    getList = () => {
        return this.props.recruiterOpportunities;
    };

    callApi = (page, category) => {
        switch (category) {
            case 'active': {
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'status', status: 2 }, 'active'));
                break;
            }
            case 'closed': {
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'closed' }, 'closed'));
                break;
            }
            case 'draft': {
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'draft' }, 'draft'));
                break;
            }
            default: {
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'status', status: 2 }, 'active'));
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'closed' }, 'closed'));
                this.props.dispatch(fetchRecruiterOpportunties(page, 'recruiter', { type: 'draft' }, 'draft'));
                break;
            }
        }
        this.props.dispatch(fetchChallengeStats());
    }

    loadItems = (category) => {
        let page = 0;
        let list = this.getList();
        if (!list.isFetching) {
            if (list.item) {
                page = list.item[category].number + 1;
            }
            this.callApi(page, category);
        }
    }

    createItem = (data) => {
        return (<RecruiterOpportunityCard key={'opp_' + data.id} data={data} onRefresh={this.init} />);
    }

    renderChallengeStats = (type) => {
        const data = {
            type,
            text: null,
            number: null
        };
        const challengeStats = this.props.challengeStats.item;
        if (challengeStats) {
            switch (type) {
                case 'all':
                    data.text = 'All';
                    data.number = challengeStats.all;
                    break;
                case 'active':
                    data.text = 'Active';
                    data.number = challengeStats.active;
                    break;
                case 'closed':
                    data.text = 'Closed';
                    data.number = challengeStats.closed;
                    break;

                case 'draft':
                    data.text = 'Draft';
                    data.number = challengeStats.draft;
                    break;

                default:
                    break;
            }
        }
        return `${data.number !== null ? `${data.number}` : ''} ${data.text || ''}`;
    }

    renderHeader = () => {
        const items = [
            {
                text: this.renderChallengeStats('all'),
                value: 'all',
                disabled: false,
            },
            {
                text: this.renderChallengeStats('active'),
                value: 'active',
                disabled: false,
            },
            {
                text: this.renderChallengeStats('closed'),
                value: 'closed',
                disabled: false,
            },
            {
                text: this.renderChallengeStats('draft'),
                value: 'draft',
                disabled: false,
            }
        ];
        return (
            <CrazySectionHeader
                items={items}
                onChange={this.handleChangeFilter}
                active={this.state.opportunityFilter}
            />
        );
    };

    render() {
        let list = this.getList();

        return (
            <MainContainer
                header={() => this.renderHeader()}
                className='recruiterCandidatesComponent'
            >
                <Container className='recruiter-dashboard-component' fluid>
                    <Grid>
                        <AsynchContainer data={list} manageError={false} native>
                            {this.renderList(list)}
                        </AsynchContainer>
                    </Grid>
                </Container>
                <Intercom />
            </MainContainer>
        );
    }
}

class ActiveChallengesEmptyContent extends Component {
    render() {
        return (
            <section className='active-challenge-empty-content'>
                <Text size='sm'>There are no active tests.</Text>
                <Text size='sm' style={{ marginBottom: 26 }}>Select and customize a template to test your candidates and prove their skills.</Text>
                <CrazyButton
                    action={() => goToCreateTest()}
                    icon='icon-plus-big'
                    text='Create test'
                    size='sidebar'
                />
            </section>
        );
    }
}

class DraftChallengesEmptyContent extends Component {
    render() {
        return (
            <section className='active-challenge-empty-content'>
                <Text size='sm'>There are no drafts.</Text>
                <Text size='sm'>Once you have a test not finished to configure, you will see it here.</Text>
            </section>
        );
    }
}

class ClosedChallengesEmptyContent extends Component {
    render() {
        return (
            <section className='active-challenge-empty-content'>
                <Text size='sm'>There are no closed tests.</Text>
                <Text size='sm'>Once you close a test you will see it here.</Text>
            </section>
        );
    }
}