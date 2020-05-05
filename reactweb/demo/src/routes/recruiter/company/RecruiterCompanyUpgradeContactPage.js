import React, {Component} from 'react';

const Config = require('Config');
import { HP_DEV } from '../../../constants/plans';
import { goToContactSuccess } from '../../../fltr/navigation/NavigationManager';
import {Header, Text} from '../../../layout/FluttrFonts';

import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import Offset from '../../../layout/layout/Offset';

export default class PricingContactPage extends Component {
    componentDidMount () {
        const s = document.createElement('script');
        s.type = 'text/javascript';
        s.src = '//js.hsforms.net/forms/v2.js';
        document.getElementsByTagName('head')[0].appendChild(s);
        const hubspotConfig = {
            portalId: '4048999',
            formId: undefined,
            target: '#form-container',
            onFormSubmit: goToContactSuccess
        };
        if (Config.ENV !== 'production') {
            hubspotConfig.formId = HP_DEV;
        }

        function checkAndLoadForm () {
            setTimeout(() => {
                if (window.hbspt && window.hbspt.forms) {
                    window.hbspt.forms.create(hubspotConfig);
                } else checkAndLoadForm();
            }, 100);
        }
        checkAndLoadForm();
    }
    render () {
        return (
            <Grid>
                <Offset  smOffset='3' />
                <Col xs='12' sm='6'>
                    <Header>Contact us</Header>
                    <Text>Questions about plans? Get in touch and we’ll be happy to help you out.</Text>
                    <div style={{width: '100%'}} id='form-container' />
                </Col>
            </Grid>
        );
    }
}