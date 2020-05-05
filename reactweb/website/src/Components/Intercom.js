import React, {Component} from 'react';
import Intercom, { IntercomAPI } from 'react-intercom';

class IntercomComponent extends Component {
  constructor (props) {
    super(props);
    let user = null;
    if (props) user = {...props};
    const isProduction = process.env.env === 'production';
    this.state = {
      user,
      production: isProduction
    };
  }
  render () {
    return (
      <Intercom appID={!this.state.production ? 'xpow9zok' : 'vfa97weq'} user={this.state.user} />
    );
  }
}

export default IntercomComponent;
