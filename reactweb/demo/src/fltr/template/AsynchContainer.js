import React from 'react';

import Spinner from '../../fltr/Spinner';
import Warning from '../../fltr/Warning';


export default class AsynchContainer extends React.Component {

    renderChild = () => {
        let native = false;
        if (this.props.native !== undefined) native = this.props.native;

        if (!native) {
            return (
                <div>
                    {React.cloneElement(this.props.children, { ...this.props })}
                </div>
            );
        } else {
            return (
                <div>
                    {this.props.children}
                </div>
            );
        }
    }

    render() {
        let locked = false;
        if (this.props.locked !== undefined) {
            locked = this.props.locked;
        }

        let enabled = true;
        if (this.props.enabled !== undefined) enabled = this.props.enabled;

        let data = this.props.data;
        let manageError = true;
        if (this.props.manageError !== undefined) manageError = this.props.manageError;

        if (locked) {
            return (<div></div>);
        }

        if (!enabled) {
            return this.renderChild();
        }

        if (data === null || (data.isFetching && data.item == null) || data.item == null) {
            return (
                <div style={{ padding: 20 }}>
                    <Spinner />
                </div>
            );
        } else if (data.isError) {
            if (manageError) {
                return (
                    <div style={{ textAlign: 'center' }}>
                        <Warning />
                    </div>
                );
            } else {
                return this.renderChild();
            }
        } else {
            return this.renderChild();
        }
    }
}




