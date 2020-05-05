import React, { Component } from 'react';

import Grid from '../../../layout/layout/Grid';
import Col from '../../../layout/layout/Col';
import CrazyButton from '../../../layout/buttons/CrazyButtons';
import {
    Header as Title,
    Text
} from '../../../layout/FluttrFonts';

import { Accordion, AccordionItem } from 'react-sanfona';



export default class PricingFAQComponent extends Component {
    render() {
        return (
            <Grid className='pricing-faq-container'>
                <Title>Frequently asked questions</Title>
                <Accordion allowMultiple className='crazy-acordion'>
                    <AccordionItem expanded title='How can I get started using Fluttr? ' titleClassName='fluttr-text-big'>
                        <p>
                            You can start using Fluttr with the free plan. This allows you to invite up to 30 candidates for one or more challenges. Using the free plan, you can have one challenge open at any one time with up to 4 members.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='Using the free plan, do I have to invite candidates to apply in a set time period?' titleClassName='fluttr-text-big'>
                        <p>
                            No, there are no time limits. You can create a challenge this month and invite 5 candidates to apply. Next month you can create another challenge, inviting 5 more candidates, continuing until you’ve reached maximum 30 candidates. Once you’ve reached this number, we’ll ask you to consider switching to a paid plan.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='What does ‘active challenge’ mean?' titleClassName='fluttr-text-big'>
                        <p>
                            A active challenge is a testing process that you have started and that is currently “open” in our system. The number of challenges you can have open at any given time depend on the plan to which you have subscribed.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='What forms of payment do you accept?' titleClassName='fluttr-text-big'>
                        <p>
                            You can use your credit card to pay for any plan. If you sign up for an Annual subscription and plan to spend at least €1,200, we can invoice you annually. Contact us to start the process.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='How secure is Fluttr?' titleClassName='fluttr-text-big'>
                        <p>
                            Protecting your data  is Fluttr’s first priority. Fluttr uses physical, procedural, and technical safeguards to preserve the integrity and security of your information. We regularly back up your data to prevent data loss and aid in recovery. Additionally, we host data in secure SSAE 16 / SOC1 certified data centers, implement firewalls and access restrictions on our servers to better protect your information. Finally we work with third party security researchers to ensure our practices are secure.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='Is support included in the price, or is it an extra fee?' titleClassName='fluttr-text-big'>
                        <p>
                            Chat, email and phone support are available to all paying customers. Users on the free plan can contact us and find help via our chat service.
                        </p>
                    </AccordionItem>
                    <AccordionItem title='Upgrade or Downgrade plan' titleClassName='fluttr-text-big'>
                        <p>
                            Your initial plan choice may not be your final plan choice. Depending on your business needs you may upgrade or downgrade your plan accordingly.  
                        </p>
                    </AccordionItem>
                    <AccordionItem title='We need to add another challenge on top of our plan. How will that be billed?' titleClassName='fluttr-text-big'>
                        <p>
                            You can create new challenges before changing your subscription and without being charged. We will subsequently ask you to correct your subscription to cover current usage.  
                        </p>
                    </AccordionItem>
                    <AccordionItem title='How should I upgrade my plan?' titleClassName='fluttr-text-big'>
                        <p>
                            After surpassing your thresholds we will notify you via email and with product notifications. You will be able to change your plan using one of the call to action links or buttons included in our communications to you.  
                        </p>
                    </AccordionItem>
                    <AccordionItem title='How should I downgrade my plan?' titleClassName='fluttr-text-big'>
                        <p>
                            Simply contact us when you wish to downgrade your plan. We will carry out required changes within 24 hours.  
                        </p>
                    </AccordionItem>
                    <AccordionItem title='How can I end my subscription?' titleClassName='fluttr-text-big'>
                        <p>
                            To end your suscription, simply contact us and we will carry out your request within 24 hours.
                        </p>
                    </AccordionItem>
                </Accordion>
                <Text size='small' className='faq-contact-section'>
                    Have you got more questions? We are here, we have answers
                    <a onClick={() => window.Intercom('showNewMessage', '')}>Contact support</a>
                </Text>
            </Grid>
        );
    }
}