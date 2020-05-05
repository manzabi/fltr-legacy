import React from 'react';
import { Accordion, AccordionItem } from 'react-sanfona'

import {Text} from '@billingfluttr/crazy-ui';

import features from './Features';

const Features = props => (
    <div className='row feature-container component'>
        {
            features.map((feature, i) => (
                <div id={feature.id} key={feature.id} className={i % 2 !== 0 ? 'feature-list flex-reverse col-xs-12 row vertical-center component' : 'feature-list col-xs-12 row'}>
                    <div className='hiw-feature-section col-xs-12 col-md-6'>
                        <h3 className='fluttr-header-md'>
                            {feature.title}
                        </h3>
                        {
                        feature.description.map((item, key) => (
                            <p className='fluttr-text-md' key={key}>
                            {item}
                            </p>
                            ))
                        }
                        <Accordion allowMultiple className='crazy-acordion'>
                            {feature.features.map((item, i) => {
                                return (
                                    <AccordionItem title={item.title} key={i} titleClassName='fluttr-text-big'>
                                            {Array.isArray(item.description) ?
                                            item.description.map((description) => (
                                                <Text>
                                                    {description}
                                                </Text>
                                            )) :
                                            <Text>
                                                {item.description}
                                            </Text>
                                            }
                                    </AccordionItem>
                                );
                            })}
                        </Accordion>
                    </div>
                    <div className='feature-section col-xs-12 col-md-6'>
                        <video className='featured-image' width='100%' height='100%' loop autoPlay playsInline muted poster={feature.videos.gif}>
                            <source src={feature.videos.webm} type='video/webm' />
                            <source src={feature.videos.mp4} type='video/mp4' />
                        </video>
                    </div>
                </div>
            ))
        }
    </div>
);
                
export default Features;
                