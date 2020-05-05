import React, { Component } from 'react';

import Grid from './layout/Grid';
import Row from './layout/Row';
import Col from './layout/Col';
import Container from './layout/Container';
import { Header, Text } from './FluttrFonts';
import CrazyButton from './buttons/CrazyButtons';
import CrazyIcon from './icons/CrazyIcon';
import crzIcons from './icons/crazyIcons';
import CrazySidebar from './sidebar/CrazySidebar';
import { CrazyCheckBox, CrazyRadioButton } from './uiUtils/inputControls';
import CrazyHeader from './header/Header';
import CrazyDropdown from './dropdown/Dropdown';
import CrazyField from './fields/CrazyFields';
import CrazySearchBar from './searchbar/Searchbar';
import { CrazySwitcher, CrazySwitcherTransparent, CrazyLayoutSelector } from './uiUtils/switchers';
import FavoriteButton from './buttons/FavoriteButton';

export default class LayoutTest extends Component {
    state = {
        'E-mail': '',
        showMessages: true
    }

    fieldsOnChange = (fieldId, value) => {
        const id = fieldId.replace(/\s/g, '');
        this.setState({ [id]: value });
    }

    render() {
        return (
            <section>
                <CrazySidebar open={false} />
                <div style={{ marginLeft: 60 }}>
                    <CrazyHeader />
                    <Container fluid>
                        <Grid>
                            <Header size='lg'>Grid system sample</Header>
                            <Col xs='12' sm='6' md='4' lg='3' style={{ backgroundColor: 'blue' }}>
                                <h1>Hello world</h1>
                            </Col>
                            <Col xs='12' sm='6' md='4' lg='3' style={{ backgroundColor: 'red' }}>
                                <h1>Hello world</h1>
                            </Col>
                            <Col xs='12' sm='6' md='4' lg='3' style={{ backgroundColor: 'purple' }}>
                                <h1>Hello world</h1>
                            </Col>
                            <Col xs='12' sm='6' md='4' lg='3' style={{ backgroundColor: 'orange' }}>
                                <h1>Hello world</h1>
                            </Col>
                            <Row>
                                <Col xs='10' sm='6' xsOffset='1' smOffset='3'>
                                    <Header size='lg'>Header Fonts (Large)</Header>
                                    <Header size='md'>Header Fonts (Medium)</Header>
                                    <Header size='sm'>Header Fonts (Small)</Header>
                                </Col>
                                <Col xs='12' sm='6'>
                                    <Text size='lg'>Text Fonts (Large)</Text>
                                    <Text size='md'>Text Fonts (Medium)</Text>
                                    <Text size='sm'>Text Fonts (Small)</Text>
                                </Col>
                            </Row>
                            <Row>
                                {crzIcons.map(iconName => <Col xs='1'><CrazyIcon className='fluttrRed fluttr-header-big' icon={iconName} /></Col>)}
                            </Row>
                            <Row>
                                Disabled:
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' disabled size='large' />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 2' disabled color='orange' size='variable' />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 3' disabled icon='icon-plus-big' />
                                </Col>

                            </Row>
                            <Row>
                                Inverse:
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' size='large' inverse/>
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 2' color='orange' size='variable' inverse/>
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 3' icon='icon-plus-big' inverse/>
                                </Col>

                            </Row>
                            <Row>
                                Default:
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' size='large' />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 2' color='orange' size='variable' />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 3' icon='icon-plus-big' />
                                </Col>
                            </Row>
                            <Row>
                                Loader:
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' size='large' loading />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 2' color='orange' loading size='variable' />
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 3' icon='icon-plus-big' loading />
                                </Col>
                            </Row>
                            <Row>
                                White:
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' color='white'/>
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' color='white' disabled/>
                                </Col>
                                <Col xs='12' sm='6' md='4' lg='3'>
                                    <CrazyButton text='Button 1' color='white' loading/>
                                </Col>
                            </Row>
                            <Row>
                                Disabled:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 1' size='small' disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 2' size='small' color='orange' disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 3' size='small' color='pink' disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 4' size='small' color='white' disabled />
                                </Col>
                            </Row>
                            <Row>
                                Default:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 1' size='small' />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 2' size='small' color='orange' />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 3' size='small' color='pink' />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 4' size='small' color='white' />
                                </Col>
                            </Row>
                            <Row>
                                Small + Icon:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 1' size='small' icon='icon-plus-big' disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyButton text='Button 2' size='small' icon='icon-plus-big' />
                                </Col>

                            </Row>
                            <Row>
                                Dropdowns: Normal, Search(doing), Header
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyDropdown />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyDropdown type='search' />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyDropdown type='header' header='HEADING' />
                                </Col>
                            </Row>
                            <Row>
                                Searchbar without pictures (Write "option" for testing):
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySearchBar />
                                </Col>
                            </Row>
                            <Row>
                                Searchbar with pictures (Write "option" for testing):
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySearchBar withPics />
                                </Col>
                            </Row>
                            <Row>
                                Searchbar disabled:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySearchBar disabled />
                                </Col>
                            </Row>
                            <Row>
                                Input Controls:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyCheckBox />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyCheckBox disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyRadioButton />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyRadioButton disabled />
                                </Col>
                            </Row>
                            <Row>
                                Normal field (type "error" or "success"):
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyField onFieldChange={this.fieldsOnChange} text={this.state['E-mail']} showMessages={this.state.showMessages}/>
                                </Col>
                            </Row>
                            <Row>
                                Disabled field:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyField blocked />
                                </Col>
                            </Row>
                            <Row>
                                Menu switchers 1:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySwitcher />
                                </Col>
                            </Row>
                            <Row>
                                Menu switchers 2:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySwitcherTransparent />
                                </Col>
                            </Row>
                            <Row>
                                Menu switchers 2 disabled:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazySwitcherTransparent disabled />
                                </Col>
                            </Row>
                            <Row>
                                Menu switchers 3:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyLayoutSelector />
                                </Col>
                            </Row>
                            <Row>
                                Menu switchers 3 disabled:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <CrazyLayoutSelector disabled />
                                </Col>
                            </Row>
                            <Row>
                                Favorite Button:
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <FavoriteButton />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <FavoriteButton disabled />
                                </Col>
                                <Col xs='12' sm='8' md='2' lg='2'>
                                    <FavoriteButton active />
                                </Col>
                            </Row>
                        </Grid>
                    </Container>
                </div>
            </section>
        );
    }
}
