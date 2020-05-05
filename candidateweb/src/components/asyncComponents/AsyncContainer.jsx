import React, { Component } from 'react';
import propTypes from 'prop-types';
import Spinner from '../../common/components/Spinner';

export default class AsyncContainer extends Component {
    state = {
        loading: true,
        error: false
    };

    render() {
        let loaded = false;
        let error = false;
        const isArray = Array.isArray(this.props.data);
        
        if (isArray) {
            loaded = this.props.data.every((action) => !action.isFetching && action.item !== undefined);
            error = this.props.data.some((action) => action.isError);
        } else {
            if (!this.props.data.isFetching && !this.props.data.isError && this.props.data.item !== undefined) {
                loaded = true;
            } else if (this.props.data.isError) {
                error = true;
            }
        }
        if (!loaded && !error) {
            return (
                <Spinner />
            );
        } else if (error) {
            return (
                <h1 style={{textAlign: 'center'}}>Something went wrong</h1>
            );
        }
        else if (loaded && !error) {
            const { children } = this.props;

            // const childrenWithProps = React.Children.map(children, child =>
            //     React.cloneElement(child, { data: [...this.props.data] }));

            return <div>{children}</div>;
        }
    }
    static propTypes = {
        children: propTypes.element.isRequired,
        data: propTypes.oneOfType([
            propTypes.arrayOf(propTypes.shape({
                isFetching: propTypes.bool.isRequired,
                isError: propTypes.bool.isRequired,
            })),
            propTypes.shape({
                isFetching: propTypes.bool.isRequired,
                isError: propTypes.bool.isRequired,
            })
        ])
    };
}