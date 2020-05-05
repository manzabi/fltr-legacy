import React, { Component } from 'react';
import Container from '../layout/Container';
import Grid from '../layout/Grid';
import Col from '../layout/Col';
import { Header, Text } from '../FluttrFonts';
import CrazyButton from '../buttons/CrazyButtons';
import CrazyIcon from '../icons/CrazyIcon';
import CrazyTooltip from '../uiUtils/tooltip';
import AsynchContainer from '../../fltr/template/AsynchContainer';
import { connect } from 'react-redux';
import {goToCreateTest} from '../../fltr/navigation/NavigationManager';
import Row from '../layout/Row';
import { isMobile } from 'react-device-detect';
import Offset from '../layout/Offset';

@connect((state) => state)
export default class RecruiterDashboardCreateChallenge extends Component {
    render() {
        return (<AsynchContainer data={this.props.user}>
            <DashboardCreateChallengeContent user={this.props.user.item} />
        </AsynchContainer>);
    }
}

class DashboardCreateChallengeContent extends Component {
    createChallenge = () => {
        goToCreateTest();
    }

    renderInstruction = (index, title, text) => {
        return (<div className='instruction'>
            <Text className='instruction-title' bold><span className='instruction-number'><b>{index}</b></span> {title}</Text>
            <Text className='instruction-text' bold size='sm' style={{ fontSize: 12 }}>{text}</Text>
        </div>);
    }

    render() {
        const { name } = this.props.user;
        const instructions = [
            {
                title: 'Create & issue your test',
                text: 'Select from a range of role-specific tests from our extensive library, or create one from scratch.'
            },
            {
                title: 'Collect & assess candidate responses',
                text: 'Evaluate your findings and measure your applicants in terms of skill, experience and motivation.'
            },
            {
                title: 'Select your preferred candidates',
                text: 'Using our unbiased and detailed reporting, identify the best candidates for you.'
            }
        ];

        return (<Container className='recruiter-dashboard-create-challenge' fluid>
            <Grid>
                <Row>
                    <Offset smOffset='1' />
                    {isMobile ?
                        <Col xs='12' sm='7' className='main-panel'>
                            <Header size='lg'>Welcome to Fluttr, {name.trim()}.</Header>
                            <Text>First things first, let’s get you up and running with your first challenge.</Text>
                            <CreateNewItemButton action={this.createChallenge} />
                            <CrazyTooltip
                                activateWithHover={false}
                                show
                                position='top'
                                messageChildren={<TooltipChildren />}
                                width='250px'
                                color='orange'
                            >
                                <CrazyButton text='Create test' icon action={this.createChallenge} />
                            </CrazyTooltip>
                        </Col> :
                        <Col xs='12' sm='7' className='main-panel'>
                            <Header size='lg'>Welcome to Fluttr, {name.trim()}.</Header>
                            <Text>First things first, let’s get you up and running with your first test.</Text>
                            <CrazyTooltip
                                activateWithHover={false}
                                show
                                position='right'
                                messageChildren={<TooltipChildren />}
                                width='250px'
                                color='orange'
                            >
                                <CreateNewItemButton action={this.createChallenge} />
                            </CrazyTooltip>
                            <CrazyButton text='Create test' size='sidebar' icon='icon-plus-thin' action={this.createChallenge} />
                        </Col>

                    }
                    <Offset smOffset='1' />
                    <Col xs='12' sm='3' className='instructions-side-bar'>
                        {instructions.map(({ title, text }, index) => this.renderInstruction(index + 1, title, text))}
                    </Col>
                </Row>
            </Grid>
        </Container>);
    }
}

class CreateNewItemButton extends Component {
    render() {
        const { action } = this.props;
        return (<div className='create-new-item-button' onClick={action}>
            <CrazyIcon icon='icon-plus-thin' />
        </div>);
    }
}

class TooltipChildren extends Component {
    render() {
        return (
            <div className='create-challenge-tooltip'>
                <Text bold>Let’s create a test</Text>
                <Text size='sm'>Click here to get started</Text>
                <CrazyButton color='white' size='small' text='Got it' action={this.props.onClose} />
            </div>
        );
    }
}