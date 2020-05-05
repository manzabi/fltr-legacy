import React, { Component } from 'react';
import * as ga from '../../Utils/analytics';

import LandingHeader from '../../Components/LandingHeader';
import Slider from '../../Components/Slider';
import CompanyLogo from './CompanyLogo';
import Awards from '../../Components/Awards';
import Features from './Features';
import ReviewsContainer from './Reviews';
// import HomeMeta from './HomeMeta';
import hubSpot from '../../Utils/HubSpot';

import Intercom from '../../Components/Intercom';

import { getRecruiterAccess, userSignup, redirectTo } from '../../Utils/NavigationManager';

const fluttrLogo = 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/google%20optimized/cbf7168e2f947f3635100683c2f26300.png';

class Home extends Component {
  constructor() {
    super();
    this.state = {
      shouldCollapse: false,
      collapseHeight: 1000,
      images: {
        companies: [
          `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/asics-logo.png`,
          `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-kpmg.png`,
          `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-meller-min.png`,
          `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-badi-min-new.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/schibsted_spain_logo.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/hotel-balneari-vichy-catalan.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/Logo_kantox-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-yugo-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-cornerjob-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-propertista-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo_socialcar-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/logo-draagu-min.png`,
          // `${process.env.FluttrFilesBaseUrl}all/website/images/homepage/companies/whisbi_logo.png`
        ],
        features: [
          {
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/features/feature_image_2_v2-min.jpg',
            title: 'Turning candidate testing into a seamless experience for HR',
            body: ['- See the efficiency benefits of a centralized and automated testing system.', '- Redirect from what’s written on the CV to focus on actual skills.', '- Offer your potential future employees a better candidate experience and introduction to your company.']
          },
          {
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/features/feature_image_3_v3-min.jpg',
            title: 'Hiring teams save precious time and energies',
            body: ['- Get started quickly using and editing our challenge templates. Or directly add your own tests.', '- Maximise candidates’ response rates and review all their responses from a centralized location.', '- With an engaged team, enjoy an evaluation process that is fast and collaborative.']
          },
          {
            image: 'https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/features/feature_image_1_v2-min.jpg',
            title: "Focusing on actual skills and objective data, companies get a true sense of how candidates will perform.",
            body: ['- Gain quantifiable insight to inform your decision making', '- Discover high potential candidates that might have gone unnoticed', '- Eliminate bias - see the talent behind the CV.']
          }
        ],
        fluttrLogo: fluttrLogo
      }
    };
    this.collapseHeightUpdate = this.collapseHeightUpdate.bind(this);
    this.handleCloseModal = this.handleCloseModal.bind(this);
    this.handleOpenModal = this.handleOpenModal.bind(this);
  }
  collapseHeightUpdate(newHeight) {
    this.setState(prevstate => (prevstate.collapseHeight = newHeight));
  }
  switchInto() {
    this.setState(prevstate => (prevstate.shouldCollapse = true));
  }

  // transition Start
  switchStart() {
    this.setState(prevstate => (prevstate.shouldCollapse = false));
  }
  componentWillMount() {
    const root = this;
    window.onscroll = function (e) {
      const shouldCollapse = window.scrollY < root.state.collapseHeight;
      if (!shouldCollapse && !root.state.shouldCollapse) {
        root.switchInto();
      } else if (shouldCollapse && root.state.shouldCollapse) {
        root.switchStart();
      }
    };
    hubSpot();
  }

  componentDidMount() {
    ga.track(ga.HOMEPAGE_LANDING);
  }
  handleOpenModal(e) {
    e.preventDefault();
    e.stopPropagation();
    const trackingAction = e.target.id;
    ga.track(ga[trackingAction]);
    this.setState(prevState => (prevState.modalState = true));
  }
  handleCloseModal(e) {
    e.preventDefault();
    e.stopPropagation();
    this.setState(prevState => (prevState.modalState = false));
  }

  goToSignup = () => {
    redirectTo(userSignup('recruiter'));
  }

  render() {
    return (
      <div className='home'>
        {/* <HomeMeta /> */}
        <LandingHeader shouldCollapse={this.state.shouldCollapse} handleOpenModal={this.handleOpenModal} />
        <Slider colapseHeightUpdate={this.collapseHeightUpdate} collapseHeight={this.state.collapseHeight} backgroundImage='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/homepage/slider/Header_images-small-min.jpg'>
          <div>
            <div className='slider-content col-xs-10' id='slider-content'>
              <h1 className='fluttr-header-big'>Assess Candidates Better. Faster. <br/>Without bias.</h1>
              <p className='fluttr-text-big'>
                Fluttr is the digital hiring platform that ensures you focus <br/> on the right candidates. Always.
              </p>
            </div>
            <div className='col-xs-12 col-sm-6 col-md-5 button-container'>
              <a className='unstyled-link' href={getRecruiterAccess()} target='_top'>
                <button type='button' className='btn btn-green' id='BUTTON_FREEMIUM_SLIDER' onClick={this.goToSignup}>
                  Get started free
                </button>
              </a>
            </div>
          </div>
        </Slider>
        <div className='demo-section'>
          <div className='container'>
            <div className='row component '>
              <div className='feature-section col-xs-12 col-md-6'>
                <h2 className='fluttr-header-md feature-title'>For the hiring needs of the most innovative companies.</h2>
                <p className='fluttr-text-big feature-body'>Use job simulations (‘challenges’) to test candidates across a range of positions. Start from one of our templates or add your own. Identify the lead candidates for roles in software engineering, sales, customer success, human resources and more.</p>
              </div>
              <div className='col-xs-10 col-sm-8 col-md-6 demo'>
                <video className='featured-image' id='sampleMovie' width='100%' height='100%' loop autoPlay playsInline muted poster='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/homepage/homepage_demo_long.gif'>
                  <source src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/homepage/homepage_demo_long.webm' type='video/mp4' />
                  <source src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/videos/homepage/homepage_demo_long.mp4' type='video/webm' />
                </video>
              </div>
            </div>
          </div>
        </div>
        <div className='company-info-section'>
          <div className='container'>
            <CompanyLogo companies={this.state.images.companies} />
            <div className='col-xs-12 component'>
              <h2 className='section-title fluttr-header-md'>Our awards</h2>
              <Awards awards={this.state.images.awards} />
            </div>
          </div>
        </div>
        <div className='container'>
          <h2 className='fluttr-header-md section-title component'>
            The perfect platform to automate, centralize and streamline the candidate testing process
          </h2>
        </div>
        <div className='container component'>
          <Features features={this.state.images.features} />
        </div>
        <ReviewsContainer />
        <div className='container'>
          <div className='landing-bottom component'>
            <h2 className='section-title fluttr-header-md'>
              What are you waiting for? <br />
              More than 200 early adopters have already signed up!
            </h2>
            <div className='col-xs-12 col-sm-6 button-container'>
              <a className='unstyled-link' href={getRecruiterAccess()} target='_top'>
                <button type='button' className='btn btn-green btn-center' id='BUTTON_FREEMIUM_BOTTOM' onClick={this.goToSignup}>
                  Get started free
                </button>
              </a>
            </div>
          </div>
        </div>
        <Intercom />
      </div>
    );
  }
}

export default Home;
