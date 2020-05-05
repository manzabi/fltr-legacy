import React, { Component } from 'react';
import Fragment from 'react-dot-fragment';


export class Grid extends Component {
    render() {
        return (
            <section className='fluttr-grid'>
                {this.props.children}
            </section>
        );
    }
}

export class Row extends Component {
    render() {
        return (
            <section className='fluttr-row'>
                {this.props.children}
            </section>
        );
    }
}

export class Col extends Component {
    render() {
        const params = {
            col: {
                style: this.props.style,
                className: ''
            },
            offset: {
                className: ''
            }
        };
        const { xs, sm, md, lg, xsOffset, smOffset, mdOffset, lgOffset } = this.props;
        if (xs) params.col.className += (' fluttr-col-xs-' + xs);
        if (sm) params.col.className += (' fluttr-col-sm-' + sm);
        if (md) params.col.className += (' fluttr-col-md-' + md);
        if (lg) params.col.className += (' fluttr-col-lg-' + lg);
        if (xsOffset) params.offset.className += (' fluttr-col-xs-offset-' + xsOffset);
        if (smOffset) params.offset.className += (' fluttr-col-sm-offset-' + smOffset);
        if (mdOffset) params.offset.className += (' fluttr-col-md-offset-' + mdOffset);
        if (lgOffset) params.offset.className += (' fluttr-col-lg-offset-' + lgOffset);
        return (<Fragment>
            <section key='offset' {...params.offset} />
            <section key='col' {...params.col}>
                {this.props.children}
            </section>
        </Fragment >);
    }
}