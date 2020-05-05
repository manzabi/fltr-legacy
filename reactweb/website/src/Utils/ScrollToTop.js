import {Component} from 'react';
import {withRouter} from 'react-router-dom'

class ScrollToTop extends Component {
  componentDidUpdate (prevProps) {
    if (this.props.location !== prevProps.location) {
      document.documentElement.style.overflow = 'auto';  // firefox, chrome
      document.body.scroll = 'yes'; // ie only
      window.scrollTo(0, 0);
    }
  }

  render () {
    return this.props.children;
  }
}

export default withRouter(ScrollToTop);
