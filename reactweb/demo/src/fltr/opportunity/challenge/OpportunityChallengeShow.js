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

import AsynchContainer from '../../template/AsynchContainer';

import {fetchOpportunityChallenge} from '../../../redux/actions/opportunityActions';
import {goToRecruiterConfigure, goToRecruiterEditChallenge} from '../../navigation/NavigationManager';

import DOMPurify from 'dompurify';
import Lightbox from 'react-image-lightbox';

import PanelContainer, {PanelContainerContent} from '../../template/PanelContainer';

import AttachmentList from '../../../common/components/AtachmentsList';


@connect((state) => state)
export default class OpportunityChallengeShow extends React.Component {

    constructor(props) {
        super(props);
    }

    componentDidMount() {
        let id = this.props.id;
        this.props.dispatch(fetchOpportunityChallenge(id));
    }

    render() {
        let id = this.props.id;
        let challengeDetail = this.props.fetchOpportunityChallenge;

        return (
            <AsynchContainer data={challengeDetail} manageError={false}>
                <OpportunityChallengeShowContent id={id} data={challengeDetail} back={this.props.back} canUpdate={this.props.canUpdate} showWrapper={this.props.showWrapper} bordered={this.props.bordered}/>
            </AsynchContainer>
        );
    }

}

class OpportunityChallengeShowContent extends React.Component{

    constructor(props) {
        super(props);
        this.state = {
            isOpen: false
        };
    }

    componentDidMount(){
        $('#challengeContentContainer').find('a').attr('target','_blank');
    }
    
    renderContent(){
        let id = this.props.id;
        let challengeDetail = this.props.data;

        if (challengeDetail.isError){
            return(
                <div style={{marginTop:50,textAlign:'center'}}>
                    <span className="summaryTitle">
                        Challenge Test is not available
                    </span>
                </div>
            );
        }

        const isOpen = this.state.isOpen;
        const customStyles = {
            overlay: {
                zIndex:1099
            }
        };

        let canUpdate = false;
        if (this.props.canUpdate !== undefined){
            canUpdate = this.props.canUpdate;
        } else {
            if (challengeDetail.item.canUpdate) {
                canUpdate = challengeDetail.item.canUpdate;
            }
        }

        let showImage = false;
        if (challengeDetail.item.imageUrl && !challengeDetail.item.imagePlaceholder ){
            showImage = true;
        }
        return (
            <Grid className="challenge-preview-page" style={{padding: '20px 15px'}}>
                {challengeDetail.item.cover &&
                <Row className="sectionInternal">
                    <Col xs={12} className="nopaddingMobile">
                        <img className='challenge-cover-image' src={challengeDetail.item.cover.url} width='100%' alt='Challenge cover image'/>
                    </Col>
                </Row>
                }
                <Row className="sectionInternal">
                    <Col xs={12} className="nopaddingMobile">
                        <span className="fluttr-header-big">{challengeDetail.item.title}</span>
                    </Col>
                </Row>

                <Row className="sectionInternal">
                    <Col xs={12}>
                        <span id="challengeContentContainer" className="section-content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(challengeDetail.item.contentHtml)}}></span>
                    </Col>
                </Row>
                {challengeDetail.item.requirementList &&
                    <Row className="sectionInternal">
                        <Col xs={12} className="nopaddingMobile">
                            <div>
                                <h3 className='fluttr-header-md'>Required Tasks</h3>
                                {challengeDetail.item.requirementList.map((requirement, index) => (
                                    <div>
                                        <h4 className='fluttr-header-small'>{`Task ${index + 1} (${requirement.required ? 'Required' : 'Optional'})`}</h4>
                                        <span key={requirement.id} id="challengeContentContainer" className="fluttr-text-md" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(requirement.content)}}></span>
                                    </div>
                                ))}
                            </div>
                        </Col>
                    </Row>
                }
                {challengeDetail.item.submissionRequirement &&
                    <Row className="sectionInternal">
                        <Col xs={12} className="nopaddingMobile">
                            <h3 className='section-title'>Submission requirements</h3>
                            <span  id="challengeContentContainer" className="section-content" dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(challengeDetail.item.submissionRequirement)}}></span>
                        </Col>
                    </Row>
                }

                {challengeDetail.item.fileList.length > 0 &&
                    <AttachmentList
                        files={challengeDetail.item.fileList}
                    />
                }

                {showImage &&
                <div>
                    <Row className="sectionInternal" id="imagePreview" style={{fontSize: '1.5em'}}>
                        <Col xs={12}><i className="icon-entypo-image" /> Image</Col>
                    </Row>
                    <Row className="sectionInternal">
                        <Col xs={12}>
                            <Image className="zoomable"
                                onClick={() => this.setState({ isOpen: true })}
                                src={challengeDetail.item.imageUrl} thumbnail />
                        </Col>
                    </Row>
                </div>
                }
                {canUpdate &&
                    <Row className="sectionInternal" id="imagePreview" style={{fontSize: '1.5em'}}>
                        <OverlayTrigger placement="top"
                            overlay={<Tooltip id='tooltip'>Edit the test</Tooltip>}>
                            <Button onClick={() => goToRecruiterConfigure(id, 'edit', {challengeId: challengeDetail.item.id})}
                                bsStyle='fluttrBlue outlined'>
                                <i className="icon-entypo-cog" style={{fontSize: 1 + 'em'}} /> Edit
                            </Button>
                        </OverlayTrigger>
                    </Row>
                }
                {isOpen &&
                <Lightbox
                    reactModalStyle={customStyles}
                    mainSrc={challengeDetail.item.imageUrl}
                    onCloseRequest={() => this.setState({ isOpen: false })}
                />
                }
            </Grid>
        );
    }

    render(){
        let showWrapper = true;
        if (this.props.showWrapper !== undefined){
            showWrapper = this.props.showWrapper;
        }

        if (showWrapper){
            let back = false;
            if (this.props.back !== undefined){
                back = this.props.back;
            }
            return (
                <PanelContainer size="medium" back={back}>
                    <PanelContainerContent bordered={this.props.bordered} padding={true} style={{marginTop: 10, marginBottom:60}}>
                        <Grid className="noPadding">
                            {this.renderContent()}
                        </Grid>
                    </PanelContainerContent>
                </PanelContainer>
            );
        } else {
            return (
                <div>
                    {this.renderContent()}
                </div>
            );
        }


    }
}
