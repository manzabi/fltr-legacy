import React, {Component} from 'react'; 
import { connect } from 'react-redux';

import { fetchCurrentUser } from '../../redux/actions/userActions';

import Spinner from '../../common/components/Spinner';
import { redirectToLoginPage } from '../../utils/navigationManager';

export default (WrappedComponent) => {
    class WithAuthorization extends Component {
        constructor(props) {
            super(props);
            if (!props.user.item) {
                this.state = {
                    user: false,
                    fetching: false
                };
            } else if (props.user.item) {
                this.state = {
                    user: true,
                    fetching: false
                };
            }
        }

        componentDidMount () {
            if (!this.state.fetching && !this.state.user) {
                this.setState({
                    fetching: true
                }, () => {
                    this.props.dispatch(fetchCurrentUser(this.onFetchUserSuccess, this.onFetchUserRejected));
                });
            }
        }
        
        onFetchUserSuccess = () => {
            this.setState({
                user: true,
                fetching: false
            });
        };

        onFetchUserRejected = () => {
            if (!this.props.location.search.includes('auth=')) {
                this.setState({
                    user: false
                });
                redirectToLoginPage();
            }
        };

        render() {
            if (this.state.user) {
                return <WrappedComponent {...this.props} />;
            } else if (this.state.fetching) {
                return (<Spinner />);
            } else {
                return null;
            }
        }
    
    }
    function mapStateToProps ({user}) {
        return {
            user
        };
    }
    return connect(mapStateToProps)(WithAuthorization);
};