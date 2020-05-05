import React, { Component } from 'react';
import { connect } from 'react-redux';

import { scrollFix } from '../../navigation/NavigationManager';
import {
    fetchRecruiterCandidates,
    resetRecruiterCandidates,
    MATCH_ORDER_BY_RANK,
    MATCH_ORDER_BY_BOOKMARK,
    MATCH_ORDER_BY_DISCARDED,
    MATCH_ORDER_BY_DISQUALIFIED,
    fetchRecruiterCandidatesNames,
    FILTER_ALL_APPLICANTS,
    resetOpportunityMatchStats,
    fetchOpportunityMatchStats,
    MATCH_ORDER_BY_ACTIVE,
    SIZE_CANDIDATE_LIST, MATCH_ORDER_BY_BOOKMARK_DISCARDED,
    cleanNewCandidates,
    getOpportunityById
} from '../../../redux/actions/recruiterOpportunityActions';

import RecruiterCandidateCard from './RecruiterCandidateCard';
import AsyncList from '../../template/AsyncList';
import AsynchContainer from '../../template/AsynchContainer';
import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import CrazyTooltip from '../../../layout/uiUtils/tooltip';
import Container from '../../../layout/layout/Container';
import { Text, Header } from '../../../layout/FluttrFonts';
import { isClosedJob, isLiveJob } from '../../../constants/opportunityStatus';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import CrazyDropdown from '../../../layout/dropdown/Dropdown';
import CrazySearchBar from '../../../layout/searchbar/Searchbar';
import CrazyIcon from '../../../layout/icons/CrazyIcon';
import SectionContainer from '../../../common/components/dummy/SectionContainer';
import {
    getAttitudeProcessTest,
    getChallengeProcessTest,
    getKillerQuestionProcessTest
} from '../../../constants/opportunityProcessType';
import {
    ASC,
    ATTITUDE,
    CHALLENGE,
    CV, DATE,
    DESC,
    MOTIVATION,
    NAME,
    QUESTIONS,
    RANK, REVIEW,
    STATUS, SUBMISSION
} from '../../../constants/candidateSorts';

import {
    TRACK_CANDIDATE_APP_UPDATES,
    TRACK_CANDIDATE_SUB_UPDATES,
    TRACK_CANDIDATE_ASS_UPDATES
} from '../../../constants/newTalentConstants';

import { CrazyLayoutSelector } from '../../../layout/uiUtils/switchers';
import { getCookie, createCookie } from '../../../common/utils';
import { GRID, LIST } from '../../../constants/viewTypes';
import Row from '../../../layout/layout/Row';


export const NO_ORDER = 'all';

@connect(({
    recruiterCandidates,
    recruiterOpportunityGet,
    opportunityStats,
    recruiterCandidatesNames
}) => ({
    recruiterCandidates,
    recruiterOpportunityGet,
    opportunityStats,
    recruiterCandidatesNames
}))
export default class RecruiterCandidatesComponent extends Component {
    constructor(props) {
        super(props);
        const selectedView = parseInt(getCookie('viewType')) || GRID;
        this.state = {
            defaultSort: RANK,
            sort: RANK,
            direction: DESC,
            filter: MATCH_ORDER_BY_ACTIVE,
            orderEnabled: true,
            userId: null,
            displayInviteModal: false,
            selectedView,
            favourites: false,
            discarded: false,
            loading: true
        };
    }

    componentDidMount() {
        this.init();
        this.initSearchBar();
        this.props.dispatch(resetOpportunityMatchStats());
    }

    componentWillUnmount() {
        this.init('reset');
    }

    init = (context = 'notDefined', callback) => {
        const id = this.getId();
        /**
         * 
         * @param {bool} reset When this is true requires a  candidate list reset
         * @param {bool} filters When this is true requires a filters update
         * @param {bool} list When this is true requires a reload of the candidates list
         */
        const useRefresh = ({ reset, filters, list }) => {
            if (reset) {
                this.props.dispatch(resetRecruiterCandidates());
                if (list) {
                    this.callApi(0);
                }
                scrollFix('main-content');
            } else {
                if (list) {
                    const list = this.getList();
                    const pages = list.item ? Math.ceil(list.item.content.length / SIZE_CANDIDATE_LIST) : 1;
                    const size = (pages) * SIZE_CANDIDATE_LIST;
                    this.callApi(0, size, callback);
                }
            }
            if (filters) { this.props.dispatch(fetchOpportunityMatchStats(id)); }
        };

        if (context === 'notDefined') {
            useRefresh(
                {
                    reset: true,
                    filters: true,
                    list: true
                });
        } else if (context === 'bookmark' && this.state.filter === MATCH_ORDER_BY_BOOKMARK) {
            useRefresh(
                {
                    reset: false,
                    filters: true,
                    list: true
                });
        } else if (context === 'bookmark') {
            useRefresh(
                {
                    reset: false,
                    filters: true,
                    list: false
                });
        } else if (context === 'discard') {
            useRefresh(
                {
                    reset: false,
                    filters: true,
                    list: true
                });
        } else if (context === 'rank' && this.state.sort === MATCH_ORDER_BY_RANK) {
            useRefresh(
                {
                    reset: true,
                    filters: true,
                    list: true
                });
        } else if (context === 'sort') {
            useRefresh(
                {
                    reset: false,
                    filters: false,
                    list: true
                });
        } else if (context === 'user') {
            useRefresh({
                reset: true,
                filters: false,
                list: true
            });
        } else if (context === 'evaluate') {
            useRefresh(
                {
                    reset: false,
                    filters: false,
                    list: true
                });
        } else if (context === 'reset') {
            useRefresh(
                {
                    reset: true,
                    filters: false,
                    list: false
                });
        }
    };

    initSearchBar = () => {
        this.props.dispatch(fetchRecruiterCandidatesNames(this.getId()));
    };

    getId = () => {
        return this.props.id;
    };

    changeSort = (sort, userId = null, filter) => {
        let refresh = false;
        if (this.state.userId && !userId) {
            refresh = true;
        }
        this.setState({
            sort,
            userId,
            direction: DESC,
            filter: filter || this.state.filter
        }, function () {
            this.init('user');
            if (refresh) {
                if (this.refs.searchBar) {
                    this.refs.searchBar.clear();
                }
            }
        });
    };

    changeFilter = (filter, userId = null) => {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true}, () => {
            let refresh = false;
            if (this.state.userId != null && userId == null) {
                refresh = true;
            }

            this.setState({
                filter,
                userId: userId
            }, function () {
                this.init();
                if (refresh) {
                    if (this.refs.searchBar) {
                        this.refs.searchBar.clear();
                    }
                }
            });
        });
    };

    manageSort = ({ currentTarget: { id } }) => {
        if (this.state.loading) {
            return;
        }
        this.setState({loading: true}, () =>{
            // THIS IS A LITTLE BIT TRICKY BUT WHEN DYNAMICALLY RENDERS ALL SORTS THE ID IT'S
            // COMPOSED WITH THE FOLLOWING STRUCTURE {id}_{LABEL} this way you can assign the same sort to different columns
            const curSort = id.split('_')[0];
            const { sort, direction } = this.getDirectionStatus(curSort);
            this.setState({ sort, direction }, this.init);
        });
    };

    getDirectionStatus = (sort) => {
        if (sort === this.state.sort) {
            switch (this.state.direction) {
                case DESC: {
                    return {
                        sort,
                        direction: ASC
                    };
                }
                case ASC: {
                    return {
                        sort: sort,
                        direction: DESC
                    };
                }
            }
        } else {
            return {
                sort,
                direction: DESC
            };
        }
    };

    manageListFilters = ({ target: { id } }) => {
        this.setState({
            [id]: !this.state[id]
        }, this.init);
    };

    renderSortMenu = (position = 'stickyMenu') => {
        const { recruiterOpportunityGet: { item: opportunity } } = this.props;
        const hasAttitude = !!getAttitudeProcessTest(opportunity);
        const hasChallenge = !!getChallengeProcessTest(opportunity);
        const hasQuestions = !!getKillerQuestionProcessTest(opportunity);
        const hasExperience = opportunity.commonDetail.enablecv !== undefined ? opportunity.commonDetail.enablecv : true;
        switch (this.state.selectedView) {
            case GRID: {
                if (position === 'top') {
                    const options = [
                        { value: DATE, text: 'Newest enrollments', selectedText:  'Enrollments'},
                        { value: SUBMISSION, text: 'Newest submissions', selectedText:  'Submissions'},
                        { value: REVIEW, text: 'Newest assessments', selectedText:  'Assessments'},
                        { separator: true },
                        { value: STATUS, text: 'Status' },
                        { separator: true },
                        { value: RANK, text: 'Total score' },
                        { value: MOTIVATION, text: 'Engagement score', active: hasChallenge || hasAttitude },
                        { value: ATTITUDE, text: 'Attitude score', active: hasAttitude },
                        { value: QUESTIONS, text: 'Questions score', active: hasQuestions },
                        { value: CHALLENGE, text: 'Challenge score', active: hasChallenge },
                        { value: CV, text: 'Experience score', active: hasExperience }
                    ];
                    return (
                        <div className='opportunity-filters-container' style={{marginLeft: 30}}>
                            <Text size='xs'>Sort by:</Text>
                            <CrazyDropdown
                                placeholder='Choose...'
                                value={this.state.sort || this.state.defaultSort}
                                onChange={(option) => { this.changeSort(option.value); }}
                                options={options}
                                style={{ width: 'max-content', paddingRight: 30 }}
                                fullHeight
                                noUpperCase
                            />
                        </div>
                    );
                } else {
                    return null;
                }
            }
            case LIST: {
                if (position === 'stickyMenu') {
                    return (
                        <CrazyDropdown
                            placeholder='DATE'
                            className={[DATE, SUBMISSION, REVIEW].includes(this.state.sort) ? 'active' : ''}
                            value={[DATE, SUBMISSION, REVIEW].includes(this.state.sort) ? this.state.sort : null}
                            resetIf={![DATE, SUBMISSION, REVIEW].includes(this.state.sort)}
                            onChange={(option) => { this.changeSort(option.value); }}
                            options={[
                                { value: DATE, text: 'Newest enrollments', selectedText:  'Enrollments'},
                                { value: SUBMISSION, text: 'Newest submissions', selectedText:  'Submissions'},
                                { value: REVIEW, text: 'Newest assessments', selectedText:  'Assessments'}
                            ]}
                            style={{ width: 'max-content', paddingRight: 30 }}
                            noUpperCase
                        />
                    );
                } else {
                    return null;
                }
            }
            default: return null;
        }
    };

    reloadOpportunity = () => {
        this.setState({ filter: MATCH_ORDER_BY_ACTIVE }, this.init);
        this.props.dispatch(getOpportunityById(this.getId()));
    };

    renderNewCandidatesBanner = (type) => {
        const { numberOfNewApplicants, numberOfNewSubmissions, numberOfNewAssessments } = this.props.recruiterOpportunityGet.item.recruiterDetail;
        const types = {
            enrolled: {
                color: 'blue',
                text: `New candidate${numberOfNewApplicants === 1 ? '' : 's'} enrolled`,
                property: numberOfNewApplicants,
                action: () => { this.props.dispatch(cleanNewCandidates(this.getId(), TRACK_CANDIDATE_APP_UPDATES, this.reloadOpportunity)); },
                filterType: 'new_applicants',
                sort: DATE
            },
            submitted: {
                color: 'green',
                text: `New test answer${numberOfNewSubmissions === 1 ? '' : 's'} submitted`,
                property: numberOfNewSubmissions,
                action: () => { this.props.dispatch(cleanNewCandidates(this.getId(), TRACK_CANDIDATE_SUB_UPDATES, this.reloadOpportunity)); },
                filterType: 'new_submissions',
                sort: SUBMISSION
            },
            assessed: {
                color: 'orange',
                text: `New answer${numberOfNewAssessments === 1 ? '' : 's'} assessed`,
                property: numberOfNewAssessments,
                action: () => { this.props.dispatch(cleanNewCandidates(this.getId(), TRACK_CANDIDATE_ASS_UPDATES, this.reloadOpportunity)); },
                filterType: 'new_assessments',
                sort: REVIEW
            }
        };
        const { color, property, text, action = () => { return; }, filterType, sort } = types[type];
        const allFilters = Object.values(types).map(({ filterType }) => filterType);
        const inactive = allFilters.includes(this.state.filter) && this.state.filter !== filterType;
        const className = `new-candidates-banner ${color} ${inactive ? ' inactive' : ''}`;
        return (
            <div className={className} onClick={() => { this.changeSort(sort, undefined, filterType); }}>
                <div className='left-side'>
                    <Header size='lg' bold style={{ marginRight: 19 }}>{property || 0}</Header>
                    <Text size='sm' bold>{text}</Text>
                </div>
                <div className='right-side'>
                    <Text
                        size='xs'
                        bold
                        style={{ visibility: this.state.filter === filterType ? 'hidden' : 'visible' }}
                    >
                        <u>see all</u>
                    </Text>
                    <Text
                        size='xs'
                        bold
                        style={{ marginLeft: 26 }}
                        onClick={(e) => { e.stopPropagation(); action(); }}
                    ><u>mark as viewed</u></Text>
                </div>
            </div>
        );
    };

    renderButtonOrder = () => {
        const initial = 0;
        let all = initial, active = initial, discarted = initial, disqualified = initial, bookmark = initial;
        const { numberOfNewApplicants, numberOfNewSubmissions, numberOfNewAssessments } = this.props.recruiterOpportunityGet.item.recruiterDetail;
        if (this.props.opportunityStats.item) {
            const { item } = this.props.opportunityStats;
            all = item.all >= 0 ? item.all : initial;
            active = item.active >= 0 ? item.active : initial;
            discarted = item.discarted >= 0 ? item.discarted : initial;
            disqualified = item.disqualified >= 0 ? item.disqualified : initial;
            bookmark = item.bookmark >= 0 ? item.bookmark : initial;
        }
        return (
            <Container fluid>
                {this.state.orderEnabled &&
                    <div className='notifications-container'>
                        {numberOfNewApplicants > 0 && this.renderNewCandidatesBanner('enrolled')}
                        {numberOfNewSubmissions > 0 && this.renderNewCandidatesBanner('submitted')}
                        {numberOfNewAssessments > 0 && this.renderNewCandidatesBanner('assessed')}
                    </div>
                }
                {this.state.orderEnabled &&
                    <div className='opportunity-filters' style={{ marginBottom: this.state.selectedView !== LIST ? 30 : 0 }}>
                        <div className='opportunity-filters-container'>
                            <Text style={{ fontSize: 12 }}>Filter by:</Text>
                            <div className='options-container'>
                                <CrazyTooltip width='max-content' position='bottom' color='darkside' messageChildren={<div className='filters-tooltip'>
                                    <strong>All candidates</strong><br />
                                    <p style={{ fontSize: 11 }}>
                                        See all candidates for this position
                                    </p>
                                </div>}>
                                    <CrazyButton
                                        className={this.state.filter === FILTER_ALL_APPLICANTS ? 'selected' : ''}
                                        action={() => this.changeFilter(FILTER_ALL_APPLICANTS)}
                                        text={`${all} All`} size='link'
                                    />
                                </CrazyTooltip>
                                <CrazyTooltip width='300px'
                                    position='bottom'
                                    color='darkside'
                                    messageChildren={
                                        <div className='filters-tooltip'>
                                            <strong>Active</strong><br />
                                            <p style={{ fontSize: 11 }}>
                                                Candidates who are in the process and have not been disqualified or discarded.
                                            </p>
                                        </div>
                                    }>
                                    <CrazyButton
                                        className={this.state.filter === MATCH_ORDER_BY_ACTIVE ? 'selected' : ''}
                                        action={() => this.changeFilter(MATCH_ORDER_BY_ACTIVE)}
                                        text={`${active} Active`} size='link'
                                    />
                                </CrazyTooltip>
                                <CrazyTooltip width='300px' position='bottom' color='darkside' messageChildren={<div className='filters-tooltip'>
                                    <strong>Disqualified</strong><br />
                                    <p style={{ fontSize: 11 }}>
                                        Candidates will be automatically removed from the process if they have not accepted the invitation to take the test or have not submitted the test on time.
                                    </p>

                                </div>}>
                                    <CrazyButton
                                        className={this.state.filter === MATCH_ORDER_BY_DISQUALIFIED ? 'selected' : ''}
                                        action={() => this.changeFilter(MATCH_ORDER_BY_DISQUALIFIED)}
                                        text={`${disqualified} Disqualified`} size='link'
                                    />
                                </CrazyTooltip>
                                <Text size='xs' style={{ color: '#cfd3dc', margin: '0 6px' }}>|</Text>
                                <CrazyTooltip position='bottom' color='darkside' messageChildren={<div className='filters-tooltip'>
                                    <strong>Favourite</strong><br />
                                    <p style={{ fontSize: 11 }}>
                                        All candidates marked as favourite
                                    </p>
                                </div>}>
                                    <CrazyButton
                                        className={this.state.filter === MATCH_ORDER_BY_BOOKMARK ? 'selected' : ''}
                                        action={() => this.changeFilter(MATCH_ORDER_BY_BOOKMARK)}
                                        text={`${bookmark} Favourite${bookmark > 1 ? 's' : ''}`} size='link'
                                    />
                                </CrazyTooltip>
                                <CrazyTooltip width='300px' position='bottom' color='darkside' messageChildren={<div className='filters-tooltip'>
                                    <strong>Discarded</strong><br />
                                    <p style={{ fontSize: 11 }}>
                                        All candidates marked as discarded. These candidates are no longer being considered for this position.
                                    </p>
                                </div>}>
                                    <CrazyButton
                                        className={this.state.filter === MATCH_ORDER_BY_DISCARDED ? 'selected' : ''}
                                        action={() => this.changeFilter(MATCH_ORDER_BY_DISCARDED)}
                                        text={`${discarted} Discarded`} size='link'
                                    />
                                </CrazyTooltip>
                            </div>
                            {this.renderSortMenu('top')}
                        </div>
                        <section style={{ display: 'flex', alignItems: 'center' }}>
                            <Text size='xs' style={{ margin: '0 6px' }}>View</Text>
                            <CrazyLayoutSelector
                                onChange={this.handleChangeViewType}
                                active={this.state.selectedView}
                            />
                            <div className='opportunity-filters-container last-filter' style={{ marginLeft: 35 }}>
                                {this.renderSearchBar()}
                            </div>
                        </section>
                    </div>
                }
            </Container>
        );
    };

    renderSearchBar = () => {
        return (
            <AsynchContainer data={this.props.recruiterCandidatesNames} manageError={false} native>
                {this.props.recruiterCandidatesNames && this.props.recruiterCandidatesNames.item ?
                    this.modifySearchbar(this.props.recruiterCandidatesNames.item.userList) : null}
            </AsynchContainer>
        );
    };

    modifySearchbar = (list) => {
        const options = [...list];
        options.forEach(element => {
            element.text = [element.completeName, '(' + element.nickname + ')'];
            element.url = element.imageUrl;
        });
        if (this.state.userId !== null) {
            const selectedUser = options.find(ele => ele.id === this.state.userId);
            return (
                <div className='fake-selected-member' onClick={() => { this.onSelectedUserSearch(null); }}>
                    <Text size='xs'>{selectedUser.completeName} <span>({selectedUser.nickname})</span></Text>
                    <CrazyIcon icon='icon-cancel' />
                </div>
            );
        }
        return (
            <CrazySearchBar
                options={options}
                icon='icon-search'
                placeholder='Type name or surname'
                onChange={this.onSelectedUserSearch}
                withPics
                openOnFocus
                id='candidate-searchbar'
            />
        );
    };

    onSelectedUserSearch = (selected) => {
        let userId = null;
        if (selected != null) {
            userId = selected.id;
        }
        this.manageUserSearch(userId);
    };

    manageUserSearch = (userId) => {
        this.setState({
            userId
        });
        if (userId == null) {
            this.changeFilter(MATCH_ORDER_BY_ACTIVE);
        } else {
            this.changeSort(this.state.sort, userId, FILTER_ALL_APPLICANTS);
        }
    };

    emptyContentWord = () => {
        switch (this.state.filter) {
            case 'active':
                return 'active';
            case 'discard':
                return 'discarded';
            case 'disqualified':
                return 'disqualified';
            case 'all':
                return '';
            case 'bookmark':
                return 'favorite';
            default:
                return '';
        }
    };

    getList = () => {
        return this.props.recruiterCandidates;
    };

    callApi = (page, size = SIZE_CANDIDATE_LIST, callback) => {
        let { id } = this.props;
        const { sort, filter, userId, direction, selectedView, favourites, discarded } = this.state;
        let selectedFilter = filter;
        // if (selectedView === LIST) {
        //     if (favourites && discarded) {
        //         selectedFilter = MATCH_ORDER_BY_BOOKMARK_DISCARDED;
        //     } else if (favourites) {
        //         selectedFilter = MATCH_ORDER_BY_BOOKMARK;
        //     } else if (discarded) {
        //         selectedFilter = FILTER_ALL_APPLICANTS;
        //     } else {
        //         selectedFilter = MATCH_ORDER_BY_ACTIVE;
        //     }
        // }
        const data = {
            sort: `${sort} ${direction || DESC}`.toLowerCase(),
            filter: selectedFilter,
            size
        };
        this.props.dispatch(fetchRecruiterCandidates(id, page, data, userId, () => {
            if (callback) {
                callback();
            }
            this.setState({loading: false});
        }));
    };

    loadItems = () => {
        let page = 0;
        let list = this.getList();

        if (!list.isFetching) {
            if (list.item) {
                page = Math.ceil(list.item.content.length / SIZE_CANDIDATE_LIST);
                // page = list.item.number + 1;
            }
            this.callApi(page);
        }
    };

    createItem = (data) => {
        const opportunity = this.props.recruiterOpportunityGet.item;
        let type;
        if (this.state.selectedView === LIST) {
            type = 'list';
        }
        return (
            <RecruiterCandidateCard
                key={data.id}
                data={{ ...data, opportunity }}
                onRefresh={this.init}
                cardType={type}
                selectedSort={this.state.sort}
            />
        );
    };

    handleChangeViewType = (selectedView) => {
        createCookie('viewType', selectedView);
        this.setState({ selectedView });
    };

    renderStickyMenu = () => {
        const { recruiterOpportunityGet: { item: opportunity } } = this.props;
        const hasAttitude = !!getAttitudeProcessTest(opportunity);
        const hasChallenge = !!getChallengeProcessTest(opportunity);
        const hasQuestions = !!getKillerQuestionProcessTest(opportunity);
        const hasExperience = opportunity.commonDetail.enablecv !== undefined ? opportunity.commonDetail.enablecv : true;

        const sorts = [
            {
                label: 'CANDIDATE',
                id: NAME,
            },
            {
                label: 'SCORE',
                id: RANK,
            },
            {
                label: 'STATUS',
                id: STATUS,
            },
            {
                label: 'QUESTIONS',
                id: QUESTIONS,
                enabled: hasQuestions
            },
            {
                label: 'ATTITUDE',
                id: ATTITUDE,
                enabled: hasAttitude
            },
            {
                label: 'CHALLENGE',
                id: CHALLENGE,
                enabled: hasChallenge

            },
            {
                label: 'ENGAGEMENT',
                id: MOTIVATION,
                enabled: hasChallenge || hasAttitude
            },
            {
                label: 'EXPERIENCE',
                id: CV,
                enabled: hasExperience
            },
        ];
        return (
            <section className='candidate-list-menu'>
                <section className='filters-container'>
                    {/*<CrazyTooltip*/}
                    {/*    color='darkside'*/}
                    {/*    messageChildren={<Text bold style={{ fontSize: 11 }}>Show only favorites</Text>}*/}
                    {/*    className='tooltip-icon-candidate-card'*/}
                    {/*    width='85px'*/}
                    {/*    position='bottom'*/}
                    {/*>*/}
                    {/*    <CrazyIcon*/}
                    {/*        icon={this.state.favourites ? 'icon-bookmark-plain' : 'icon-bookmark'}*/}
                    {/*        id='favourites'*/}
                    {/*        className={this.state.favourites ? 'active' : ''}*/}
                    {/*        onClick={this.manageListFilters}*/}
                    {/*    />*/}
                    {/*</CrazyTooltip>*/}
                    {/*<CrazyTooltip*/}
                    {/*    color='darkside'*/}
                    {/*    className='tooltip-icon-candidate-card'*/}
                    {/*    position='bottom'*/}
                    {/*    width='85px'*/}
                    {/*    messageChildren={<Text bold style={{ fontSize: 11 }}>Show/hide discarted</Text>}*/}
                    {/*>*/}
                    {/*    <CrazyIcon*/}
                    {/*        icon='icon-discard'*/}
                    {/*        className={this.state.discarded ? 'active' : ''}*/}
                    {/*        id='discarded'*/}
                    {/*        onClick={this.manageListFilters}*/}
                    {/*    />*/}
                    {/*</CrazyTooltip>*/}
                </section>
                {sorts.map((sort) => this.renderSort(sort))}
                {this.renderSortMenu()}
            </section>
        );
    };

    renderSort = ({ label, id, enabled = true }) => {
        if (enabled) {
            return (
                <div
                    key={label.toLowerCase()}
                    className={`sort-button-container ${id}_${label.toLowerCase()} ${id === this.state.sort ? 'enabled' : 'disabled'}`}
                >
                    <Text
                        size='xs'
                        bold
                        className='sort-button'
                        onClick={this.manageSort}
                        id={`${id}_${label.toLowerCase()}`}
                    >
                        {label} {this.state.sort === id && this.state.direction === ASC ?
                            <CrazyIcon icon='icon-arrow-drop-up' className='sort-arrow' /> :
                            <CrazyIcon icon='icon-arrow-drop-down' className='sort-arrow' />
                        }
                    </Text>
                </div>
            );
        } else {
            return null;
        }
    };

    renderList = () => {
        const { handleActivate, openInviteCandidate, activateLoading } = this.props;
        let list = this.getList();
        const opportunity = this.props.recruiterOpportunityGet.item;
        const { selectedView = GRID } = this.state;
        switch (selectedView) {
            case LIST: {
                return (
                    <SectionContainer fluid className='candidate-list-container'>
                        <AsyncList
                            stickyContent={this.renderStickyMenu}
                            container={true}
                            showHeader={false}
                            showEmpty={true}
                            scrollableElement='main-content'
                            className='list-view candidates-list'
                            emptyContent={
                                <CandidateListEmptyContent
                                    opportunity={opportunity}
                                    {...{
                                        handleActivate,
                                        openInviteCandidate,
                                        activateLoading,
                                        filter: this.state.filter,
                                        selectedView: selectedView
                                    }}
                                />}
                            title='Candidates applied to this position'
                            data={list}
                            onInit={this.init.bind(this)}
                            onLoad={this.loadItems}
                            onCreateItem={this.createItem}
                            showHeaderOnEmpty
                            fluid
                            renderOnLoading
                        />
                    </SectionContainer>
                );
            }
            case GRID: {
                return (
                    <AsyncList
                        container={true}
                        showHeader={false}
                        showEmpty={true}
                        scrollableElement='main-content'
                        className='grid-view candidates-list'
                        emptyContent={
                            <CandidateListEmptyContent
                                opportunity={opportunity}
                                {...{
                                    handleActivate,
                                    openInviteCandidate,
                                    activateLoading,
                                    filter: this.state.filter,
                                    selectedView: selectedView
                                }}
                            />}
                        title='Candidates applied to this position'
                        data={list}
                        onInit={this.init.bind(this)}
                        onLoad={this.loadItems}
                        onCreateItem={this.createItem}
                        showHeaderOnEmpty
                        fluid
                    />
                );
            }
            default: {
                return null;
            }
        }
    };

    render() {
        return (
            <div className='recruiterCandidatesComponent'>
                <section className='recruiterCandidatesComponentContent'>
                    {this.renderButtonOrder()}
                    {this.renderList()}
                </section>
            </div>
        );
    }
}

const CandidateListEmptyContent = ({ opportunity, handleActivate, openInviteCandidate, activateLoading, filter, selectedView }) => {
    const contentStyles = { display: 'flex', alignItems: 'center', flexDirection: 'column', margin: '62px 0 40px' };
    let content;
    if (filter === 'all' || filter === 'active') {
        if (isLiveJob(opportunity.statusId)) {
            content = (
                <section style={contentStyles}>
                    <Text size='sm' style={{textAlign: 'center'}}>
                        You don’t have any candidates onboard.<br />
                        Invite candidates to start testing them.
                    </Text>
                    <CrazyButton action={openInviteCandidate} text='Invite candidates' size='ceci' />
                </section>
            );
        } else if (isClosedJob(opportunity.statusId)) {
            content = (
                <section style={contentStyles}>
                    <Text size='sm' style={{textAlign: 'center'}}>
                        You don’t have any {filter} candidate.
                    </Text>
                </section>
            );
        } else {
            content = (
                <section style={contentStyles}>
                    <Text size='sm' style={{textAlign: 'center'}}>
                        Here you will screen your candidates.<br />
                        Activate the test to invite candidates and see them onboard.
                    </Text>
                    <CrazyButton action={handleActivate} text='Activate' color='orange' loading={activateLoading} size='ceci' />
                </section>
            );
        }
    } else {
        content = (
            <section style={contentStyles}>
                <Text size='sm' style={{textAlign: 'center'}}>
                    You don’t have any {filter} candidate.
                </Text>
            </section>
        );
    }
    return (
        <Container fluid>
            <Grid style={{ paddingBottom: 60 }}>
                {content}
                {selectedView === GRID &&
                    <Row revertMargin>
                        <Col xs='12' sm='6' md='4' lg='3' ><img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/card_placeholder.svg' width='100%' /></Col>
                        <Col xs='0' sm='6' md='4' lg='3' ><img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/card_placeholder.svg' width='100%' /></Col>
                        <Col xs='0' sm='0' md='4' lg='3' ><img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/card_placeholder.svg' width='100%' /></Col>
                        <Col xs='0' sm='0' md='0' lg='3' ><img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/card_placeholder.svg' width='100%' /></Col>
                    </Row> ||
                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/app/user/list-placeholder.svg' style={{ maxWidth: '83vw' }} />
                }
            </Grid>
        </Container>
    );
};