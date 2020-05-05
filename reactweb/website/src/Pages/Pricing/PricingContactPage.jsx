import React, {Component} from 'react';
import { HP_DEV, HP_PROD } from '../../constants/plans';

import {
    Header as Title,
    Grid,
    Container,
    Col,
    Text,
    CrazyButton
} from '@billingfluttr/crazy-ui';
import { goToPricing } from '../../Utils/NavigationManager';

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
            redirectUrl: `${process.env.serverUrl}/pricing?contact=success`
        };
        if (process.env.ENV !== 'production') {
            hubspotConfig.formId = HP_DEV;
        } else {
            const {id} = this.props.match.params;
            hubspotConfig.formId = HP_PROD[id] || HP_DEV;
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
            <section className='contact-page'>
                <div className='header-container'>
                    <img height='32px' src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/logo_fluttr.png' alt='fluttr logo'/>
                    <CrazyButton color='white' text='close' action={goToPricing} />
                </div>
                <Container fluid>
                    <Grid>
                        <Col xs='12' sm='6' smOffset='3'>
                            <Title>Contact us</Title>
                            <Text>Questions about plans? Get in touch and we’ll be happy to help you out.</Text>
                            <div style={{width: '100%'}} id='form-container' />
                        </Col>
                    </Grid>
                </Container>
            </section>
        )
    }
}