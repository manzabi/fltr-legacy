import React from 'react';
const WhyUs = () => (
    <div className='component row vertical-align '>
        <div className='col-xs-12 col-md-7 why-us'>
            <h3 className='fluttr-header-md'>
                So, why us?
            </h3>
            <div className='why-us-container fluttr-text-md'>
                <div className='why-us-section'>
                    <h3 className='fluttr-text-md'>40% faster</h3>
                    <p>
                        Reach your recruitment decisions faster thanks to our efficient assessment system. See your applicants side by side, ranked according to skill sets, motivation and experience.
                    </p>
                </div>
                <div className='why-us-section'>
                    <h3 className='fluttr-text-md'>Zero recruitment bias</h3>
                    <p>
                        Empower diversity. Hire the best person for the job, not the best CV. Using our system, personal preferences are secondary to actual and quantifiable data.          </p>
                </div>
                <div className='why-us-section'>
                    <h3 className='fluttr-text-md'>Understand which candidates will be good in real life and not just good on paper.</h3>
                    <p>
                        Candidates with the best CVs do not automatically make the best new hires. Using data science you can look beyond CVs to actual abilities and soft skills.
                    </p>
                </div>
                <div className='why-us-section'>
                    <h3 className='fluttr-text-md'>100% certainty</h3>
                    <p>
                        Feel confidence in your selection knowing that it’s based on actual data not a ‘gut feeling’.
                    </p>
                </div>
            </div>
        </div>
        <div className='col-xs-8 col-md-5'>
            <img className='hiw-feature-image img img-responsive' src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/how-it-works/features/star-system_800x600px-min.png' alt='why us' />
        </div>
    </div>
);

export default WhyUs;
