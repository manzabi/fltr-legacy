import React, {Component} from 'react';
import OpportunityTags from './tag/OpportunityTags';
import { getCompanyImage } from '../utils/urlUtils';

export default class OpportunityHeaderReviewCardMobileDetail extends Component {

    constructor(props) {
        super(props);
        this.state = {
            toggle: false
        };
    }

    onViewChallenge(){
        if (this.props.onViewChallenge !== undefined) {
            this.props.onViewChallenge();
        }
    }

    handleToggle = () => {
        this.setState({
            toggle: !this.state.toggle
        });
    }

    render() {
        const {roleTitle, company, tagList, commonDetail, levelSeniority} = this.props.data;
        return (
            <section className='opportunity-header-mobile'>
                <div className='fluttr-text-md opportunity-header'>
                    <div className='company-details'>
                        <img src={getCompanyImage(company)} width='66px' />
                        <p>{company.name}<br/>{roleTitle}</p>
                    </div>
                    <div>
                        { this.state.toggle ?
                            <i onClick={this.handleToggle} className='fal fa-angle-up' style={{fontSize: '20px'}} /> :
                            <i onClick={this.handleToggle} className='fal fa-angle-down' style={{fontSize: '20px'}} />
                        }
                    </div>
                </div>
                { this.state.toggle &&
                    <div className='opportunity-details'>
                        {tagList && tagList.length &&
                            <OpportunityTags showIcon={false} numberOfTags={tagList.length} taglist={tagList} hideEdit />
                        }
                        <p style={{color: '#95a5a6'}} className='fluttr-text-small'>
                            Total submissions: <span className='fluttr-text-md' style={{color: 'black'}}>{commonDetail.submittedChallenges}</span>
                        </p>
                        <p style={{color: '#95a5a6'}} className='fluttr-text-small'>
                            Position type: <span className='fluttr-text-md' style={{color: 'black'}}>{levelSeniority}</span>
                        </p>
                        <a href="#" onClick={() => this.onViewChallenge()} style={{fontWeight: 'bold'}} className="fluttrBlue fluttr-text-md">
                            <i className="icon-entypo-book" ></i> View Challenge
                        </a>
                    </div>
                }
            </section>
        );
    }

}