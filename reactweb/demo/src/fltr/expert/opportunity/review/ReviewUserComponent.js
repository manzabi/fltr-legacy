import React from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';

import {
    Row,
    Col,
    Grid,
    Form,
    FormControl,
    FormGroup,
    Modal,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

import Truncate from 'react-truncate';
import Button from 'react-bootstrap-button-loader';
import StarRatingComponent from 'react-star-rating-component';

import AsynchContainer from '../../../template/AsynchContainer';
import FeedReplyListComponent from '../../../feed/FeedReplyListComponent';

import {getRatingString, getRatingDefault} from '../../../../constants/reviewStars';
import {fetchUserForReview, postReview, resetUserForReview} from '../../../../redux/actions/reviewActions';

import {
    goToReviewUserForExpert, goToReviewForExpert, goToExpertDashboard,
    goToApplicants,
    scrollFix,
} from '../../../navigation/NavigationManager';

import PanelContainer, { PanelContainerContent, PanelContainerCustom } from '../../../template/PanelContainer';

import DOMPurify from 'dompurify';
import OpportunityHeaderReviewCardDetail from '../../../opportunity/OpportunityHeaderReviewCardDetail';
import OpportunityHeaderReviewCardMobileDetail from '../../../opportunity/OpportunityHeaderReviewCardMobileDetail';
import FeedComponent from '../../../feed/FeedComponent';
import OpportunityChallengeModal from '../../../opportunity/challenge/OpportunityChallengeModal';
import ExpertPublicFeedbackModal from './ExpertPublicFeedbackModal';
import {getTimeString} from '../../../../common/timerUtils';

// import Intercom from '../../../utils/Intercom';
import { openModalFix, closeModalFix } from '../../../../common/uiUtils';
import { isMobile } from 'react-device-detect';
import CommonModal from '../../../../common/components/CommonModal';
import FluttrButton from '../../../../common/components/FluttrButton';

@connect((state) => state)
export default class ReviewUserComponent extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;
        let userId = this.props.userId;

        this.props.dispatch(resetUserForReview());
        this.props.dispatch(fetchUserForReview(id, userId));
    }

    componentWillUnmount(){
        this.props.dispatch(resetUserForReview());
    }

    render() {

        const id = this.props.id;
        const userId = this.props.userId;
        const objectStored = this.props.reviewUser;
        const source = this.props.source;
        const edit = this.props.edit;

        return (
            <AsynchContainer data={objectStored} manageError={false}>
                <ReviewUserContent id={id} userId={userId} data={objectStored} source={source} edit={edit} user={this.props.user.item} />
            </AsynchContainer>
        );
    }

}

@connect((state) => state)
class ReviewUserContent extends React.Component{

    constructor(props) {
        super(props);

        const response = this.getExpertReview(this.props.data);
        this.state = {
            enabled: true,
            openMobileFeedback: false,
            hideFeedback: true,
            openPublicFeedback: false,
            showModal: false,
            height: 0,
            startHeight: 0,
            feedbackHeight: 0,
            isEdit: props.edit,
            ...response
        };
    }
    // componentWillMount () {
    //     if (this.state.isEdit) {
    //         this.getExpertReview(this.props.data);
    //     }
    // }
    componentDidMount() {
        let root = this;
        scrollFix();
        $('.dv-star-rating-star')
            .mouseenter( function(){
                if (root.state.enabled) {
                    let hiddenField = $(this).attr('for');
                    let numberOfStars = parseInt($('#'+hiddenField).val(), 10);
                    let ratingString = getRatingString(numberOfStars);
                    $('#textRating').html(ratingString);
                    root.setState({
                        selectedStars: numberOfStars
                    });
                }
            } )
            .mouseleave( function(){
                if (root.state.enabled) {
                    if (root.state.openFeedback){
                        $('#textRating').html(getRatingString(root.state.stars));
                    } else {
                        $('#textRating').html(getRatingDefault());
                    }

                }
                root.setState({
                    selectedStars: 0
                });
            } );
        this.updateHeight(true);
    }

    onFetchExpertFeedbackSucess = (response) => {

    }

    onStarClick = (nextValue, prevValue, name) => {
        this.setState({
            enabled: true,
            openFeedback: true,
            hideFeedback: false,
            stars : nextValue
        });
    }

    onMobileStarClick = (nextValue) => {
        openModalFix();
        this.setState({
            enabled: true,
            openMobileFeedback: true,
            stars : nextValue
        });
    }

    onCancel(){
        this.setState({
            enabled: true,
            openFeedback: false,
            stars: 0,
            height: this.state.startHeight
        });
        $('#textRating').html(getRatingDefault());
    }

    onShowChallenge = e => {
        openModalFix();
        this.setState(
            {
                showModal: true
            }
        );
    }
    onHideChallenge= e => {
        closeModalFix();
        this.setState(
            {
                showModal: false
            }
        );
    }

    closeModal = () => {
        this.props.onClose();
    }

    onClickBack = () => {
        let id = this.props.id;
        let source = this.props.source;
        if (source == 'recruiter') {
            goToApplicants(id);
        } else if (source === 'normal') {
            goToExpertDashboard();
        } else {
            goToReviewForExpert(id);
        }
    }
    updateHeight = firstLoad => {
        let startHeight = 0;
        if (firstLoad) {
            if (this.refs.reviewContainer){
                startHeight = this.refs.reviewContainer.clientHeight;
            }
        }
        let height = 0;
        if(this.refs.reviewContainer) {
            height = this.refs.reviewContainer.clientHeight;
        }
        if (height !== this.state.height) {
            if (startHeight) {
                this.setState({
                    height: height,
                    startHeight: startHeight,
                });
            }
            if (startHeight !== height) {
                this.setState({
                    height: height,
                    feedbackHeight: height
                });
            }
            else {
                this.setState ({
                    height: height
                });
            }
        }
    }
    onPublicFeedback = e => {
        e.preventDefault();
        this.setState({
            openPublicFeedback : true
        });
    }
    onCloseModalPublicFeedback = () => {
        this.setState({
            openPublicFeedback : false
        });
    }

    handleChangeMobileFeedback = (event) => {
        this.setState({
            expertFeedback: event.target.value
        });
    }

    hideFeedback = (e) => {
        if (e) e.preventDefault();
        if (!this.state.hideFeedback) {
            this.setState({
                hideFeedback: true,
                height: this.state.startHeight

            });
            this.updateHeight();
        }
    }
    showFeedback = (e) => {
        if (e) e.preventDefault();
        this.setState({
            hideFeedback: false,
            height: this.state.feedbackHeight
        });
    }
    getExpertReview = (data) => {
        const {id} = this.props.user.item;
        if (id && data) {
            const review = data.item.review.judgeReviews.filter(review => review.judge.id === id);
            if (review.length) {
                // console.log(review)
                const {stars, feedback} = data.item.review.judgeReviews[0];
                return {
                    openFeedback: true,
                    stars: stars,
                    selectedStars: stars,
                    expertFeedback: feedback
                };
            } else {
                return {
                    openFeedback: true,
                    stars: 0,
                    selectedStars: 0,
                    expertFeedback: ''
                };
            }
        }
    }
    handleClickReviewContainer = e => {
        e.stopPropagation();
        if (this.state.hideFeedback) {
            this.showFeedback();
        }
    }
    handleClickReviewUserComponent = e => {
        if (!this.state.hideFeedback) {
            this.hideFeedback();
        }
    }

    handleHideMobileExpertFeedback = () => {
        closeModalFix();
        this.setState({
            openMobileFeedback: false
        });
    }

    submitExpertFeedback = (event) => {
        event.preventDefault();
        this.setState({
            loading: true
        });
        let id = this.props.id;
        let userId = this.props.userId;
        let stars = this.state.stars;
    
    
        // code you want to do
        if ($('#user-review-form').valid()) {
    
            let contentHr = $('#privateFeedback').val();
    
            let formObj = {
                stars: stars,
                contentHr: contentHr
            };
    
            // console.log(JSON.stringify(formObj));
    
            this.props.dispatch(postReview(id, userId, formObj, this.onSuccessReview, this.props.isEdit));
    
        }
    }

    onSuccessReview = () => {
        this.setState({
            loading: false
        });
        const source = this.props.source;
        const id = this.props.id;
        const next = this.props.data.item.next;
        const isEdit = this.props.isEdit;

        if (isEdit) {
            this.props.onBackButton();
        } else if (next){
            if (source == 'recruiter') {
                this.openModal();
            } else {
                goToReviewUserForExpert(id, next.id);
            }
        } else {
            if (source == 'recruiter') {
                browserHistory.goBack();
            } else {
                // partial success
                goToReviewForExpert(id);
            }
        }
    }

    handleChangeFeedback = (event) => {
        event.preventDefault();
        const {value} = event.target;
        this.setState({
            expertFeedback: value
        });
    }

    renderReviewBottomBar = (centerTitle, arrow, next, order, number, review, id, userId, source, isEdit) => {
        if (!isMobile) {
            return(
                <div className={!this.state.hideFeedback && 'bottomReviewContainer' || 'bottomReviewContainer bottomReviewContainerHidden' } ref="reviewContainer" onClick={this.handleClickReviewContainer}>
                    <Grid>
                        <Row className="vertical-align">
                            <Col xs={12} sm={centerTitle ? 12 : 12} className="vertical-flex" >
                                <div style={{width:'100%', textAlign: 'center'}}>

                                    <div className='expert-review-arrows' style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center'}}>
                                        <div style={{minWidth: 110}}>
                                            {next !== null && !isEdit &&
                                                <span className="header-values-label">Candidate {order} of {number}</span>
                                            }
                                        </div>
                                        <p className='fluttr-text-big' style={{margin: 0}} id="textRating">{getRatingDefault(this.state.isEdit)}</p>
                                        <div style={{minWidth: 110}}>
                                            {next !== null && !isEdit &&
                                                <a href="#" onClick={() => goToReviewUserForExpert(id, next.id)} style={{minWidth: 110, display: 'block'}} className="buttonSkip">
                                                    Skip <i className="fal fa-angle-right"></i>
                                                </a>
                                            }
                                        </div>
                                    </div>
                                    {(!this.state.openFeedback || this.state.hideFeedback) &&
                                            <p style={{margin: 0,minWidth: 110}}>
                                                The candidate will only see the overall score.
                                            </p>
                                    }
                                    <div style={{fontSize:'2em'}}>
                                        <StarRatingComponent
                                            name="rate1"
                                            starCount={5}
                                            value={this.state.selectedStars || this.state.stars || '0'}
                                            editing={this.state.enabled}
                                            onStarClick={this.onStarClick}
                                        />
                                    </div>
                                </div>
                            </Col>
                        </Row>
                        {this.state.openFeedback &&
                                <Row>
                                    <Col xs={12} md={12}>
                                        <div className={this.state.openFeedback && !this.state.hideFeedback && 'expert-feedback-show' || 'expert-feedback-hide'}>
                                            <ReviewUserForm
                                                handleChangeFeedback={this.handleChangeFeedback}
                                                onPublicFeedback={this.onPublicFeedback}
                                                updateHeight={this.updateHeight}
                                                review={review}
                                                stars={this.state.stars}
                                                id={id}
                                                userId={userId}
                                                onCancel={() => this.onCancel()}
                                                next={next}
                                                source={source}
                                                number={number}
                                                feedback={this.state.expertFeedback}
                                                isEdit={this.state.isEdit}
                                                onBackButton={this.onClickBack}
                                            />

                                        </div>
                                    </Col>
                                </Row>
                        }
                    </Grid>
                </div>
            );
        } else {
            return (
                [
                    <div style={{marginTop: 150}} />,
                    <div className='mobile-review-bar'>
                        <p className='fluttr-text-md section-header'>{this.state.stars ? getRatingString(this.state.stars) : getRatingDefault(this.state.isEdit)}</p>
                        <StarRatingComponent
                            name="rate1"
                            starCount={5}
                            value={this.state.selectedStars || this.state.stars || '0'}
                            editing={this.state.enabled}
                            onStarClick={this.onMobileStarClick}
                        />
                        {
                            this.state.openMobileFeedback && 
                        <CommonModal
                            open={true}
                            onClose={this.handleHideMobileExpertFeedback}
                        >
                            <section className='mobile-expert-review-modal'>

                                <p className='fluttr-text-md section-header' id='textRating'>{this.state.stars ? getRatingString(this.state.stars) : getRatingDefault(this.state.isEdit)}</p>
                                <StarRatingComponent
                                    name="rate1"
                                    starCount={5}
                                    value={this.state.selectedStars || this.state.stars || '0'}
                                    editing={this.state.enabled}
                                    onStarClick={this.onMobileStarClick}
                                />
                                <p style={{fontSize: 12, color: '#95a5a6'}}>
                                    The candidate will only see the overall score
                                </p>
                                <form id='user-review-form'>
                                    <textarea
                                        // onMouseOver={() => {
                                        //     $('head meta[name=viewport]').remove();
                                        //     $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=12.0, minimum-scale=.25, user-scalable=yes">');
                                        // }}
                                        // onMouseDown={() => {
                                        //     $('head meta[name=viewport]').remove();
                                        //     $('head').prepend('<meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=0">');
                                        // }}
                                        onChange={this.handleChangeMobileFeedback}
                                        name='review'
                                        value={this.state.expertFeedback}
                                        id='privateFeedback'
                                        cols='30'
                                        rows='8'
                                        placeholder='Write to the hiring team what do you think of this candidate´s response.'
                                        style={{border: this.state.expertFeedback.length >= 3 ? 'solid 2px #2ecc71' : 'solid 2px #95a5a6', fontSize:16 }}
                                    />
                                </form>
                                {/* <ReviewUserForm onPublicFeedback={this.onPublicFeedback} updateHeight={this.updateHeight} review={review} stars={this.state.stars} id={id} userId={userId} onCancel={() => this.onCancel()} next={next} source={source} number={number} feedback={this.state.expertFeedback} isEdit={this.state.isEdit} onBackButton={() => this.onClickBack()}/> */}
                                <div style={{display: 'flex', justifyContent: 'space-around', width: '100%'}}>
                                    <FluttrButton
                                        action={this.handleHideMobileExpertFeedback}
                                        inverse={true}
                                        size='xSmall'
                                        type='link'
                                    >
                                        Cancel
                                    </FluttrButton>
                                    <FluttrButton
                                        action={this.submitExpertFeedback}
                                        inverse={this.state.stars > 2 && this.state.expertFeedback.length <= 3}
                                        size='xSmall'
                                        disabled={this.state.stars > 2 && this.state.expertFeedback.length < 3}
                                    >
                                        Submit
                                    </FluttrButton>
                                </div>
                                
                            </section>
                        </CommonModal>
                        }
                        {next != null &&
                            <div style={{display: 'flex', justifyContent: 'space-between', width: '100%', margin: '0 44px 0 0'}}>
                                <p className='fluttr-text-md'>
                                    {this.props.data.item.order} of {this.props.data.item.number} 
                                </p>
                                {this.props.data.item.number && <span className='fluttr-text-big' onClick={() => goToReviewUserForExpert(id, next.id)}>
                                    <span className='fluttr-text-md'>Skip </span><i className='fal fa-angle-right' />
                                </span>}
                            </div>
                        }
                    </div>
                ]
            );
        }
    }

    renderJobDetail = (opportunity) => {
        if(!isMobile) {
            return <OpportunityHeaderReviewCardDetail onViewChallenge={this.onShowChallenge} data={opportunity} />;
        } else {
            return <OpportunityHeaderReviewCardMobileDetail onViewChallenge={this.onShowChallenge} data={opportunity} />;
        }
    }

    render(){
        let source = this.props.source;
        let id = this.props.id;
        let userId = this.props.userId;
        let item = this.props.data;

        let user = item.item.user;
        let feed = item.item.feed;
        let reviewed = item.item.reviewed;
        let order = item.item.order;
        let review = item.item.review;
        let next = item.item.next;
        let number = item.item.number;
        let opportunity = item.item.opportunity;
        let submissionDate = getTimeString(item.item.challenge.creation);
        let arrow;
        if (this.state.openFeedback && this.state.hideFeedback) arrow = 'up';
        else if (this.state.openFeedback && !this.state.hideFeedback) arrow = 'down';
        let showReview = false;
        if (!reviewed || this.state.isEdit) showReview = true;
        let centerTitle = false;
        const isEdit = this.state.isEdit;
        if (isEdit) centerTitle = true;
        if (!next) centerTitle = true;

        // console.log('review user item : ' + JSON.stringify(item));
        // console.log('review user item/user : ' + JSON.stringify(user));

        if (item.isError){
            return(
                <PanelContainer back={true} onBackButton={() => goToReviewForExpert(id)} size="big">
                    <PanelContainerContent>
                        <Col xs={12} className="noPadding">
                            <div style={{textAlign:'center'}}>
                                <span className="summaryTitle">
                                    Information not available
                                </span>
                            </div>
                        </Col>
                    </PanelContainerContent>
                    {/* <Intercom /> */}
                </PanelContainer>
            );

        }

        let placeholder = 'If you would like to ask more details to ' + user.name +' you can do it here.';


        return (
            <div style={{marginTop: '36px'}} className={(!this.state.hideFeedback && this.state.openFeedback) ? 'reviewUserComponent reviewUserComponentHidden' : 'reviewUserComponent' } style={{paddingBottom: !isMobile ? this.state.height : 0}} onClick={this.handleClickReviewUserComponent}>
                <div style={{marginTop: '36px'}}>
                    <PanelContainer back={!isMobile} onBackButton={this.onClickBack} size="big">
                        {isMobile &&
                        <p className='fluttr-text-big' style={{marginTop: 20}} onClick={this.onClickBack}>
                            <i className='fal fa-angle-double-left' /> <span className='fluttr-text-md'>Back</span>
                        </p>
                        }
                        {this.renderJobDetail(opportunity)}
                        <PanelContainerCustom style={{paddingTop:30, paddingBottom:10}}>
                            <Col xs={12} style={{textAlign:'center'}}>
                                {order > 0 &&
                                <span className="fluttr-header-small">
                                    Candidate {order} of {number}
                                    <br/>
                                </span>
                                }
                                <span className="fluttr-text-small">
                                    {user.name}
                                </span>
                                <p className='fluttr-submitted fluttr-text-small'>
                                    {`Submitted on ${submissionDate}`}
                                </p>

                            </Col>
                        </PanelContainerCustom>
                        <PanelContainerContent padding={false} style={{margin: 0}}>
                            <Col xs={12} className="noPadding" style={{marginBottom: 100}}>
                                <FeedComponent data={feed}/>
                            </Col>
                        </PanelContainerContent>
                        <p style={{textAlign: 'center', marginTop: '40px'}}>Do you want to write to the candidate?<br /><a href='#' onClick={this.onPublicFeedback}> Click here</a></p>
                        {/*
                        <PanelContainerCustom style={{paddingTop:20}}>
                            <Grid className="noPadding">
                                <Row>
                                    <Col xs={12}>
                                        <span className="summaryTitle">
                                            Comments
                                        </span>
                                    </Col>
                                </Row>
                                  <FeedReplyWriteComponent id={feed.id} placeholder={placeholder}/>
                            </Grid>
                        </PanelContainerCustom>
                        */}
                        <PanelContainerCustom style={{paddingTop:20}}>
                            <Grid className="noPadding">
                                <FeedReplyListComponent id={feed.id} />
                            </Grid>
                        </PanelContainerCustom>
                    </PanelContainer>
                </div>
                {showReview &&
                    this.renderReviewBottomBar(centerTitle, arrow, next, order, number, review, id, userId, source, isEdit)
                }
                <OpportunityChallengeModal open={this.state.showModal} onClose={this.onHideChallenge} id={id}/>
                <ExpertPublicFeedbackModal hideFeedback={this.hideFeedback} open={this.state.openPublicFeedback} onClose={this.onCloseModalPublicFeedback} user={user} feed={feed} />
                {/* { centerTitle &&
                    <Intercom />
                } */}
            </div>
        );
    }
}

@connect((state) => state)
class ReviewUserForm extends React.Component{
    constructor(props) {
        super(props);
        const {feedback, stars} = props;
        const valid = (feedback && feedback.trim && parseInt(stars) >= 3) || (parseInt(stars) && parseInt(stars) < 3);
        this.state = {
            loading: false,
            showModal: false,
            feedback: props.feedback,
            valid: valid
        };
    }

    componentWillReceiveProps (props) {
        if (!this.state.feedback && this.state.feedback !== props.feedback) {
            this.setState({
                feedback: props.feedback
            });
        } if (props.stars !== this.props.stars) {
            this.handleCheckValidations(props);
        }
    }

    closeModal = () => {
        this.setState({ showModal: false });
    }

    cancelModal = () => {
        this.closeModal();
        browserHistory.goBack();
    }

    openModal = () => {
        this.setState({ showModal: true });
    }

    componentDidMount(){
        // if (this.showForm()){
        //     $('#user-review-form').validate({
        //         errorClass: 'validation-error-class',
        //         // 1. validation rules.
        //         rules: {
        //             privateFeedback: {
        //                 required: true,
        //             }
        //         },
        //         submitHandler: function (form) {
        //             return false;
        //         }
        //     });
        // }
        this.props.updateHeight();
    }
    // shouldComponentUpdate(nextProps, nextState){
    //     return this.props.stars !== nextProps.stars || this.state.feedback !== nextState.feedback;
    // }
    // componentWillUpdate(nextProps, nextState){
    //     $('#user-review-form').data('validator') && $('#user-review-form').data('validator').destroy();
    //     $('#user-review-form').validate({
    //         errorClass: 'validation-error-class',
    //         // 1. validation rules.
    //         rules: {
    //             privateFeedback: {
    //                 required: nextProps.stars < 3 ? false : true,
    //             }
    //         },
    //         submitHandler: function (form) {
    //             return false;
    //         }
    //     });
    // }


    handleCheckValidations = (props, newFeedback) => {
        let stars = this.props.stars;
        if (props) stars = props.stars;
        let {feedback} = this.state;
        if (newFeedback !== undefined) feedback = newFeedback;
        if ((feedback && feedback.trim && parseInt(stars) >= 3) || (parseInt(stars) && parseInt(stars) < 3)) {
            this.setState({
                valid: true
            });
            return true;
        } else {
            this.setState({
                valid: false
            });
            return false;
        }
    }

    submitUserReview = (event) => {
        event.preventDefault();
        this.setState({
            loading: true,
        });

        // new validation
        const {id, userId, stars} = this.props;
        const {feedback} = this.state;
        const valid = this.handleCheckValidations();
        if (valid) {
            let formObj = {
                stars: stars,
                content: '',
                contentHr: feedback
            };
            this.props.dispatch(postReview(id, userId, formObj, this.onSuccessReview, this.props.isEdit));
        }
    }

    handleChangeFeedback = (event) => {
        event.preventDefault();
        const feedback = event.target.value;
        const valid = this.handleCheckValidations(null, feedback);
        this.setState({
            feedback,
            valid
        });
    }

    showForm(){
        let stars = this.props.stars;
        return (stars >= 3);
    }

    onSuccessReview = () => {
        this.setState({
            loading: false
        });
        const source = this.props.source;
        const id = this.props.id;
        const next = this.props.next;
        const isEdit = this.props.isEdit;

        if (isEdit) {
            this.props.onBackButton();
        } else if (next){
            if (source == 'recruiter') {
                this.openModal();
            } else {
                goToReviewUserForExpert(id, next.id);
            }
        } else {
            if (source == 'recruiter') {
                browserHistory.goBack();
            } else {
                // partial success
                goToReviewForExpert(id);
            }
        }
    }

    continue = () => {
        this.closeModal();
        let id = this.props.id;
        let next = this.props.next;
        goToReviewUserForExpert(id, next.id);
    }
    expertIsRecruiter = () => {
        const user = this.props.user.item.id;
        const recruiter = this.props.reviewUser.item.opportunity.user.id;
        return user === recruiter;
    }

    render(){
        let onCancel = this.props.onCancel;
        let onBackButton = this.props.onBackButton;
        let review = this.props.review;
        let number = this.props.number;

        if (number > 0){
            number = number -1 ;
        }

        let privateJudgeList = [];
        review.judgeReviews.map((evaluation) => {
            privateJudgeList.push(evaluation);
        });
        privateJudgeList = privateJudgeList.filter(review => review.judge.id !== this.props.user.item.id);

        let textAreaSize= 8;

        let textAreaStyle = {
            padding: 20,
            overflow:'hidden'
        };

        return (
            <Form id='user-review-form'>
                <div className='expert-review-container'>
                    <Row style={{height: '100%'}}>
                        <Col xs={12} md={8} className='expert-review-component'>
                            <div>
                                <Row>
                                    <div>
                                        { this.expertIsRecruiter() &&
                                  <p className="feedbackLabels feedback-section-title">{this.props.isEdit && 'Edit' || 'Write'} your comments about this candidate</p> ||
                                  <p className="feedbackLabels feedback-section-title">{this.props.isEdit && 'Edit' || 'Write'} your comment to <strong>{this.props.reviewUser.item.opportunity.user.name} and the hiring team</strong></p>
                                        }
                                    </div>
                                </Row>
                                <FormGroup>
                                    <FormControl rows={textAreaSize}
                                        componentClass='textarea'
                                        id="privateFeedback"
                                        name="privateFeedback"
                                        placeholder="Write to the hiring team what do you think of this candidate's response."
                                        value={this.state.feedback}
                                        onChange={this.handleChangeFeedback}
                                        style={textAreaStyle}
                                        autoFocus
                                    />
                                </FormGroup>
                                <div className='form-submission-buttons'>
                                    <OverlayTrigger placement="top"
                                        overlay={<Tooltip id='tooltip'>{!this.props.isEdit && 'You will cancel your comment and reset your stars evaluation' || 'You will cancel any change to the evaluation or stars of the candidate'}</Tooltip>}>
                                        <FluttrButton type='link' size='small' action={!this.props.isEdit && onCancel || onBackButton}>
                                            Cancel
                                        </FluttrButton>
                                    </OverlayTrigger>
                                    <FluttrButton disabled={!this.state.valid} loading={this.state.loading} action={this.submitUserReview}>
                                        Submit
                                    </FluttrButton>
                                </div>
                            </div>
                        </Col>
                        <Col xs={12} md={4} style={{textAlign:'center', paddingTop:2, backgroundColor: '#ecf0f1', padding: '20px'}} className='expert-review-component'>
                            <div>
                                <JudgeReviewContainer data={privateJudgeList} isEdit={this.props.isEdit} userId={this.props.user.item.id}/>
                            </div>
                            <div className='candidate-comment-request'>
                                <p>
                                    Do you want to write to the candidate? &nbsp;
                                    <a href='#' onClick={this.props.onPublicFeedback}>
                                        Click here
                                    </a>
                                </p>
                            </div>
                        </Col>
                        <Col xs={4} style={{'display': 'none'}}>
                            <FormGroup>
                                <FormControl rows={textAreaSize}
                                    componentClass='textarea'
                                    id="publicFeedback"
                                    name="publicFeedback"
                                    placeholder="Congratulate her/him and help the candidate understanding their areas for improvement. You comments will be shared with the candidate and publicly visible."
                                    defaultValue=""
                                    style={textAreaStyle}
                                />
                            </FormGroup>
                        </Col>
                    </Row>
                </div>
                {this.state.showModal &&
                <Modal show={this.state.showModal} onHide={this.cancelModal} lg
                    aria-labelledby="contained-modal-title-lg">
                    <Modal.Body className="noPadding">
                        <Grid className="noPadding">
                            <Row className="fluttrGreyBg" style={{padding:0,margin:0}}>
                                <Col xs={12} style={{textAlign: 'center'}}>
                                    <span className="textStrong" style={{fontSize:'2.5em'}}>Start clearing your backlog!</span>
                                </Col>
                            </Row>
                            <Row style={{marginTop:20}}>
                                <Col xs={4} xsOffset={4} style={{textAlign: 'center'}}>
                                    <img style={{width:'100%'}} src="/imgs/app/modal/modalRecruiterExpert.jpg" className="img-rounded"></img>
                                </Col>
                            </Row>
                            <Row style={{marginTop:20}}>
                                <Col xs={4} xsOffset={4} style={{textAlign: 'center'}}>
                                    <span className="textStrong" style={{fontSize:'2em',lineHeight: '1.3em'}}>Do you want to complete now the <strong>{number} missing review{number > 1 ? 's' : ''}</strong> that you have pending?</span>
                                </Col>
                            </Row>
                            <Row style={{marginTop:30}}>
                                <Col xs={12} style={{textAlign: 'center'}}>
                                    <FluttrButton action={this.submitUserReview} loading={this.state.loading}>
                                        Start now
                                    </FluttrButton>
                                </Col>
                            </Row>
                            <Row style={{marginTop:10, marginBottom:20}}>
                                <Col xs={12} style={{textAlign: 'center'}}>
                                    <FluttrButton type='link' action={this.cancelModal}>No thanks</FluttrButton>
                                </Col>
                            </Row>
                        </Grid>
                    </Modal.Body>
                </Modal>
                }
                {/* <Intercom /> */}
            </Form>
        );
    }
}

class JudgeReviewContainer extends React.Component {
    constructor(props) {
        super(props);

        let judgeReviewList = props.data;
        let selectedCard = -1;
        if (judgeReviewList.length > 0) {
            selectedCard = judgeReviewList[0].judge.id;
        }
        // console.log('selected card : ' + selectedCard + " size : " + judgeReviewList.length + " data : " + props.data);

        this.state = {
            selectedCard: selectedCard
        };
    }

    agree(name){

        let arrayStrings = [];
        arrayStrings.push('I agree with '+name+'\'s feedback about this candidate.');
        arrayStrings.push('The interpretation of '+name+' about this applicant\'s answer is correct and I share it too.');
        arrayStrings.push('I share '+name+'\'s view of this candidate.');
        arrayStrings.push(name + ' said it well about this candidate and I share the same considerations.');
        arrayStrings.push('I feel '+name+' is correct about this applicant. Nothing more to add.');
        arrayStrings.push(name+' expressed quite well also my point of view.');
        arrayStrings.push('Reading ' + name + '\'s feedback about this candidate, I feel I can only be in agreement.');

        var item = arrayStrings[Math.floor(Math.random()*arrayStrings.length)];

        $('#privateFeedback').val(item);
    }

    onNextCard(id, identifier){
        // console.log('next: ' + id);
        $('#' + identifier).addClass('swipe-right');
        return setTimeout(() => {
            this.changeCard(id);
            $('#' + identifier).removeClass('swipe-right');
        }, 300);
    }

    onClick(id){
        // console.log('click : ' + id);
        var card = $('#expertCard_' + id);
        this.changeCard(id);
    }

    changeCard(id){
        this.setState({
            selectedCard: id
        });
    }

    render(){
        // console.log('this.state.selectedCard : ' + this.state.selectedCard);
        let judgeReviewList = this.props.data;
        let cardsList = [];

        let counter = 1;
        judgeReviewList.map((evaluation) => {
            let currId = evaluation.judge.id;
            if (this.state.selectedCard != currId) {
                cardsList.push(this.generateCard(evaluation, false, counter, null));
                counter++;
            } else {
                if (this.state.selectedCard != -1){
                    cardsList.push(this.generateTipsCard(null, false));
                }
            }
        });

        let counterForNext = 0;
        let next = null;
        judgeReviewList.map((evaluation) => {
            let currId = evaluation.judge.id;
            if (this.state.selectedCard == currId) {
                if (counterForNext < judgeReviewList.length - 1){
                    next = judgeReviewList[counterForNext +1].judge.id;
                } else if (counterForNext == (judgeReviewList.length -1) && judgeReviewList.length >= 1){
                    next = -1;
                }
                cardsList.push(this.generateCard(evaluation, true, 0,  next));
            }
            counterForNext++;
        });

        // if the card selected is the tip card, put the card as first
        if (this.state.selectedCard == -1) {
            let nextToTips = null;
            if (judgeReviewList.length > 0) {
                nextToTips = judgeReviewList[0].judge.id;
            }
            cardsList.push(this.generateTipsCard(nextToTips, true));
        }

        return(
            <div className="stack">
                {cardsList}
            </div>
        );
    }

    generateCard(evaluation, selected, order, next){
        let currId = evaluation.judge.id;
        let styleNext = {
            cursor:'pointer',
            padding: 7,
            marginTop: -7
        };

        if (next == null) {
            styleNext = {
                visibility:'hidden'
            };
        }


        let navigation =
            <nav>
                <a style={{visibility:'hidden'}} className="prev"><i className="icon-entypo-controller-fast-backward"/></a>
                <a onClick={() => this.agree(evaluation.judge.completeName)} style={{cursor:'pointer'}}>AGREE</a>
                <a style={styleNext} onClick={() => this.onNextCard(next, 'expertCard_' + evaluation.judge.id)} className="next"><i className="icon-entypo-controller-fast-forward"/></a>
            </nav>;

        return (
            <JudgeReviewCard onClick={() => this.onClick(currId)} key={evaluation.judge.id} id={evaluation.judge.id} data={evaluation} navigation={navigation} selected={selected} order={order}/>
        );
    }

    generateTipsCard(next, selected){
        let styleNext = {cursor:'pointer'};

        if (next == null) {
            styleNext = {
                visibility:'hidden'
            };
        }

        let navigation =
            <nav>
                <a style={{visibility:'hidden'}} className="prev"><i className="icon-entypo-controller-fast-backward"/></a>
                <a style={{visibility:'hidden'}} href="#"></a>
                <a style={styleNext} onClick={() => this.onNextCard(next, 'tipsCard')} className="next"><i className="icon-entypo-controller-fast-forward"/></a>
            </nav>;

        return (
            <TipsCard key={Math.random()} navigation={navigation} selected={selected}/>
        );
    }
}

class JudgeReviewCard extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            showModal: false
        };
    }

    openModal(){
        this.setState({
            showModal: true
        });
    }

    closeModal(){
        this.setState({
            showModal: false
        });
    }

    render(){
        let id = this.props.id;
        let data = this.props.data;
        let navigation = this.props.navigation;
        let order = this.props.order;
        let selected = this.props.selected;
        let style = {};
        if (!selected) {
            let rotation = 0;
            //order = Math.floor(Math.random() * 4);
            order = ((id + order) % 4) + 1;
            // console.log("id : " + id + " order : " + order);
            if (order === 0) {
                rotation = -4;
            } else if (order === 1) {
                rotation = -3;
            } else if (order === 2) {
                rotation = -2;
            } else if (order === 3) {
                rotation = -1;
            }
            //let rotation = Math.floor(Math.random() * 6) + 1;
            style = {
                transform: 'rotate(' + rotation + 'deg) scale(1, 1.15)',
                opacity: '0.6'
            };
        }

        let contentHtml = data.feedbackHtml;
        //onClick={() => this.props.onClick()}
        return(
            <div id={'expertCard_' + id} className="card" style={style}>
                <h4>{data.judge.completeName}</h4>
                <div className="card-content">
                    <Truncate lines={3} ellipsis={<span>... <a href="#" onClick={() => this.openModal()}>Read more</a></span>}>
                        <span className="textLittle" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(contentHtml)}}></span>
                    </Truncate>
                </div>
                {navigation}
                <JudgeReviewModal data={data} showModal={this.state.showModal} onClose={() => this.closeModal()} privateFeedback={true} />
            </div>
        );
    }
}

class TipsCard extends React.Component {

    constructor(props) {
        super(props);

    }

    render(){
        let selected = this.props.selected;
        let navigation = this.props.navigation;
        let style = {};
        if (!selected) {
            let rotation = -2;
            style = {
                transform: 'rotate(' + rotation + 'deg) scale(1, 1.15)',
                opacity: '0.6'
            };
        }

        return(
            <div id="tipsCard" className="card" style={style}>
                <h3>TIPS</h3>
                <div className="card-content-tip">
                    <span className="feedbackLabels">
                        What are the key strengths you could see?
                    </span><br/>
                    <div style={{marginTop:15}}></div>
                    <span className="feedbackLabels" >
                        Any gap shown in their answer?
                    </span><br/>
                    <div style={{marginTop:15}}></div>
                    <span className="feedbackLabels">
                        What should be further explored during the interview?
                    </span>
                </div>
                {navigation}
            </div>
        );
    }
}


class JudgeReviewModal extends React.Component {

    constructor(props) {
        super(props);

    }

    closeModal = () => {
        if (this.props.onClose !== undefined){
            this.props.onClose();
        }
    }


    render(){
        let data = this.props.data;
        let privateFeedback = this.props.privateFeedback;

        let contentHtml = '';
        if (privateFeedback){
            contentHtml = data.feedbackHtml;
        } else {
            contentHtml = data.feedbackPublicHtml;
        }

        return(

            <Modal show={this.props.showModal} onHide={this.closeModal}>
                <Modal.Body>
                    <Grid>
                        <Row>
                            <Col xs={12} >
                                <div style={{paddingBottom:0}}>
                                    <Grid>
                                        <Row>
                                            <Col xs={12} md={12} className="noPadding">
                                                <Grid>
                                                    <Row className="vertical-align">
                                                        <Col xs={2} md={2} style={{textAlign: 'center'}} className="vertical-flex noPadding">
                                                            <img src={data.judge.imageUrl} width='40' height='40' className="img-rounded"/>
                                                        </Col>
                                                        <Col xs={10} md={10} className="vertical-flex vertical-flex-left" style={{paddingRight:0}}>
                                                            <Grid>
                                                                <Row className="div-no-overflow">
                                                                    <span className="userName">{data.judge.completeName}</span>
                                                                </Row>
                                                                <Row className="div-no-overflow">
                                                                    <span className="position">{data.judge.completePosition}</span>
                                                                </Row>
                                                            </Grid>
                                                        </Col>
                                                    </Row>
                                                </Grid>
                                            </Col>
                                        </Row>
                                        <Row style={{paddingTop:30, minHeight:60}}>
                                            <Col xs={12} md={12} className="noPadding textLittle">
                                                <span dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(contentHtml)}}></span>
                                            </Col>
                                        </Row>
                                    </Grid>
                                </div>
                            </Col>
                        </Row>
                    </Grid>
                </Modal.Body>
                <Modal.Footer style={{textAlign:'center'}}>
                    <Button onClick={this.closeModal}>Close</Button>
                </Modal.Footer>
            </Modal>

        );
    }
}
