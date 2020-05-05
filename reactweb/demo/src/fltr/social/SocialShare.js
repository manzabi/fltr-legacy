import React from 'react';

import * as ga from '../../constants/analytics';

export default class SocialShare extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            open: false
        };
    }

    click(href, action){
        ga.track(ga['OPPORTUNITY_CHALLENGE_LINK_SHARE_' + action]);
        let intWidth = '500';
        let intHeight = '400';
        let strResize = (true ? 'yes' : 'no');

        // Set title and open popup with focus on it
        let strTitle = 'Social Share';
        let strParam = 'width=' + intWidth + ',height=' + intHeight + ',resizable=' + strResize;
        window.open(href, strTitle, strParam).focus();
    }

    render(){
        const style = {
            marginRigh:10,
            marginLeft:20
        };

        let data = this.props.data;
        let show = false;
        if (data){
            show = true;
        }

        return (
            <span className="socialShare">
                {show &&
                <ul className="social-network social-circle">
                    <li style={style}><a onClick={() => this.click(data.shareFacebook, 'FACEBOOK')} href="#" className="icoFacebook" title="Facebook"><i className="icon-fontello-facebook"></i></a></li>
                    <li style={style}><a onClick={() => this.click(data.shareTextTwitter, 'TWITTER')} href="#" className="icoTwitter" title="Twitter"><i className="icon-fontello-twitter"></i></a></li>
                    <li style={style}><a onClick={() => this.click(data.shareLinkedin, 'LINKEDIN')} href="#" className="icoLinkedin" title="Linkedin"><i className="icon-fontello-linkedin"></i></a></li>
                    <li style={style}>
                        {this.props.children}
                    </li>
                </ul>
                }
            </span>
        );
    }
}
