import React, {Component} from 'react';
import { connect } from 'react-redux';

import AsyncList from '../../template/AsyncList';

import {goToEditTemplate, goToCreateNewTemplate, scrollFix} from '../../navigation/NavigationManager';

import {
    PanelContainer,
    Row,
    Col,
    Badge,
    OverlayTrigger,
    Tooltip
} from '@sketchpixy/rubix';

import {getChallengeTemplates, duplicateTemplate} from '../../../redux/actions/templateActions';
import CommonConfirmModal from '../../../common/components/CommonConfirmModal';

@connect((state) => state)
export default class ChallengeTemplatesPage extends Component {
    constructor() {
        super();
        this.state = {
            modalState: false
        };
    }
    componentDidMount () {
        this.init();
    }
    init = () => {
        this.props.dispatch(getChallengeTemplates());
    }
    loadItems = () => {
        let page = 0;
        let list = this.props.userTemplates;

        if (!list.isFetching) {
            if (list.item) {
                page = list.item.number + 1;
            }
            this.props.dispatch(getChallengeTemplates(page));
        }
    }

    handleOpenModal = ({target}) => {
        this.setState({
            modalState: true,
            selectedTemplate: target.id
        });
    }
    handleCloseModal = () => {
        this.setState({
            modalState: false
        });
    }

    handleEditTemplate = (event) => {
        const id = event.target.id;
        goToEditTemplate(id);
    }
    handleDuplicateTemplate = () => {
        const id = this.state.selectedTemplate;
        this.props.dispatch(duplicateTemplate(id, this.onDuplicateOk));
        this.setState({
            modalState: false,
            selectedTemplate: undefined
        });
    }

    onDuplicateOk = () => {
        this.init();
        scrollFix();
    }

    createItem = (data) => {
        return(
            <Row key={data.id} style={{padding: 20, display: 'flex', alignItems: 'strech'}}>
                <Col sm={12} md={4}>
                    <img src={data.cover.url} width='100%' />
                </Col>
                <Col sm={8} md={6}>
                    <h1>{data.title}<span style={{fontSize: 14}} >{` (${data.typeString} template)`}</span></h1>
                    <div>
                        {data.tagList.map((tag, innerIndex) => (
                            <Badge key={innerIndex} style={{marginRight: '5px', padding: '5px 10px', fontSize: '1.2em'}} className='tagFluttr' >
                                {tag.value}
                            </Badge>
                        ))}
                    </div>
                </Col>
                <Col sm={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <i className='fas fa-edit' id={data.id} onClick={this.handleEditTemplate} style={{cursor: 'pointer', fontSize: 30}} />
                </Col>
                <Col sm={2} style={{display: 'flex', justifyContent: 'center', alignItems: 'center'}}>
                    <i className='fas fa-copy' id={data.id} onClick={this.handleOpenModal} style={{cursor: 'pointer', fontSize: 30}} />
                </Col>
            </Row>
        );
    }
    render () {
        const list = this.props.userTemplates;
        return (
            <Row>
                <Col md={10} mdOffset={1} xs={12} xsOffset={0} className='nopaddingMobile'>
                    <PanelContainer>
                        <Col xs={12} className='nopaddingMobile' >
                            <Row style={{padding: 20}}>
                                <h1 className='challenge-form-label label-padding'>Add new template
                                    <OverlayTrigger placement='top' overlay={<Tooltip id='tooltip'>Use this to add new a template.</Tooltip>}>
                                        <i className='icon-entypo-info-with-circle challenge-form-info-icon' />
                                    </OverlayTrigger>
                                </h1>
                                <Col xs={12} onClick={goToCreateNewTemplate} id='requirementList' style={{height: '200px', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '1px solid grey' }}>
                                    <i className='fas fa-plus' style={{fontSize: '50px'  }}/>
                                </Col>
                            </Row>
                        </Col>
                        <AsyncList
                            showEmpty={false}
                            title='Templates'
                            data={list}
                            onInit={this.init}
                            onLoad={this.loadItems}
                            onCreateItem={this.createItem}
                        />
                    </PanelContainer>
                </Col>
                <CommonConfirmModal
                    open={this.state.modalState}
                    onReject={this.handleCloseModal}
                    onConfirm={this.handleDuplicateTemplate}
                    confirmTitle='Are you about to duplicate a template, are you sure of that?'
                    backdrop={false}
                />
            </Row>
        );
    }
}