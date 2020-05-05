import React from 'react';

const Config = require('Config');

import {Header, Text} from '../../layout/FluttrFonts';

import SectionContainer from '../../common/components/dummy/SectionContainer';
import CrazyButton from '../../layout/buttons/CrazyButtons';

const NotFoundPage = () => {

    const goHome = () => {
        window.location.href = Config.serverUrl;
    };
    return (
        <SectionContainer className='not-found-page error-page'>
            <section className='not-found-content error-page-content'>
                <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/cdn/img/common/error.svg' />
                <div>
                    <Header>Error 404</Header>
                    <Text size='md'>Page not found</Text>
                    <CrazyButton size='sidebar' text='Go back' action={goHome} inverse />
                </div>
            </section>
        </SectionContainer>
    );
};

export default NotFoundPage;