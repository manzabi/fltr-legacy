import React, { Component } from 'react';

const Config = require('Config');
import { goToRecruiterConfigure } from '../../../fltr/navigation/NavigationManager';
import { Header, Text } from '../../../layout/FluttrFonts';

import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import { HP_TEST_ID, HP_PROD_ID } from '../../../constants/opportunityRequestTemplate';
import { manageSuccess } from '../../../common/utils';
import Container from '../../../layout/layout/Container';

// TEST
// https://share.hsforms.com/1tOP6CTzfTQGEOb3YifRV-A2es87

// PROD
// https://share.hsforms.com/1-A6qqX-ERXO7vOcw929VAQ2es87

export default class ChallengeRequestTemplatePage extends Component {
    componentDidMount() {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//js.hsforms.net/forms/shell.js';
        document.getElementsByTagName('head')[0].appendChild(s);
        const hubspotConfig = {
            portalId: '4048999',
            formId: undefined,
            target: '#form-container',
            onFormSubmit: () => {
                manageSuccess(undefined, 'Request successfully sent!');
                goToRecruiterConfigure(this.props.opportunity.id, 'templates', { templaterequest: 'success' });
            }
        };
        if (Config.ENV !== 'production') {
            hubspotConfig.formId = HP_TEST_ID;
        } else {
            hubspotConfig.formId = HP_PROD_ID;
        }

        function checkAndLoadForm() {
            setTimeout(() => {
                if (window.hbspt && window.hbspt.forms) {
                    if (!document.getElementsByClassName('hs-form-iframe').length) {
                        window.hbspt.forms.create(hubspotConfig);
                    }
                } else checkAndLoadForm();
            }, 100);
        }
        checkAndLoadForm();
    }

    onClose = () => {
        this.props.changeTab('templates');
    };
    
    render() {
        return (
            <Container>
                <Grid className='request-template-page'>
                    <div className='close-button-wrapper'>
                        <Text size='sm' onClick={this.onClose} className='close-button' >Cancel</Text>
                    </div>
                    <Col xs='12' className='request-template-card'>
                        <Header>Contact us</Header>
                        <Text>Questions about templates? Get in touch and we’ll be happy to help you out.</Text>
                        <div style={{ width: '100%' }} id='form-container' />
                    </Col>
                </Grid>
            </Container>
        );
    }
}