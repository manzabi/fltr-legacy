import React, { Component } from 'react';
import RecruiterCrazyModal from '../../../layout/modal/RecruiterCrazyModal';
import StarRatingComponent from 'react-star-rating-component';
import { Text } from '../../../layout/FluttrFonts';
import { getRatingDefault, getRatingString } from '../../../constants/reviewStars';
import CrazyTextarea from '../../../layout/fields/CrazyTextarea';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import { reviewCv, updateCv } from '../../../redux/actions/recruiterOpportunityActions';
import { connect } from 'react-redux';
import { manageError } from '../../../common/utils';


@connect(({ dispatch }) => ({ dispatch }))
export class ReviewCandidateCvModal extends Component {
    constructor(props) {
        super(props);
        const { review, isEdit } = props;
        let formData = { stars: 0, reviewFeedback: '' };
        if (isEdit && review) {
            formData.stars = review.stars;
            formData.reviewFeedback = review.content;
        }
        this.state = {
            formData,
            starsPreview: formData.stars,
            isEdit: this.props.isEdit || false,
            loading: false
        };
    }

    handleChangeStars = (newValue) => {
        this.setState({
            formData: {
                ...this.state.formData,
                stars: newValue
            }
        });
    };

    handleHoverStars = (newValue) => {
        this.setState({ starsPreview: newValue });
    };

    resetPreviewStars = () => {
        this.setState({ starsPreview: this.state.formData.stars });
    };

    handleChange = ({ value: reviewFeedback }) => {
        this.setState({
            formData: {
                ...this.state.formData,
                reviewFeedback
            }
        });
    };

    isValid = () => {
        const { stars } = this.state.formData;
        return !!(stars && parseInt(stars));
    };

    handleSave = () => {
        let valid = this.isValid();
        if (valid) {
            this.setState({
                loading: true
            });
            const { id, matchId, opportunity: { id: opportunityId } } = this.props.candidate;
            const { stars, reviewFeedback: content } = this.state.formData;
            let data = {
                stars,
                content
            };
            if (this.state.isEdit) {
                this.props.dispatch(updateCv(matchId, opportunityId, id, data, this.onSaveReview, this.onError));
            } else {
                this.props.dispatch(reviewCv(matchId, opportunityId, id, data, this.onSaveReview, this.onError));
            }

        }
    };

    onSaveReview = () => {
        this.setState({ loading: false });
        this.props.onRefresh();
        this.props.onClose();
    };

    onError = (error) => {
        manageError(error);
        this.setState({ loading: false });
        if (window.Raven) {
            window.Raven.captureException(error.stack);
        }
    };

    render() {
        return (
            <RecruiterCrazyModal
                manageUiFix={false}
                title='Experience assessment'
                show={this.props.open}
                onCloseButton={this.props.onClose}
                className='assess-candidate-modal'
                size='md'
            >
                <section className='assess-candidate-modal-content'>
                    <Text size='sm'>
                        {this.state.formData.stars === 0 && this.state.starsPreview === this.state.formData.stars &&
                            getRatingDefault(this.state.isEdit) ||
                            getRatingString(this.state.starsPreview)
                        }
                    </Text>
                    <StarRatingComponent
                        name='candidate-rate-cv'
                        onStarClick={this.handleChangeStars}
                        onStarHover={this.handleHoverStars}
                        onStarHoverOut={this.resetPreviewStars}
                        starCount={5}
                        value={this.state.starsPreview}
                        emptyStarColor='#ffb400'
                        renderStarIcon={(index, value) => {
                            return (
                                <span>
                                    <i className={index <= value ? 'fas fa-star' : 'fal fa-star'} />
                                </span>
                            );
                        }}
                    />
                    <CrazyTextarea
                        value={this.state.formData.reviewFeedback}
                        onChange={this.handleChange}
                        placeholder='Evaluate the experience of the candidate for this role'
                    />
                    <div className='modal-footer-container'>
                        <Text size='xs'>
                            Your evaluation and notes are only visible to you and the rest of the hiring team
                        </Text>
                        <CrazyButton
                            size='ceci'
                            action={this.handleSave}
                            text='Save'
                            loading={this.state.loading}
                            disabled={!this.isValid()}
                            color='orange'
                        />
                    </div>
                </section>
            </RecruiterCrazyModal>
        );
    }
}