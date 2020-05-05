import React, {Component} from 'react';
import PropTypes from 'prop-types';

// import Warning from '../../fltr/Warning';

import InfScroller from 'redux-infinite-scroll-maintanable';
import Spinner from '../../common/components/Spinner';

export default class AsynchList extends Component {
    componentDidMount(){
        this.id = Math.random();
    }

    render(){
        let createItem = this.props.onCreateItem;
        const {data, onLoad, onInit, title, showEmpty, container, showHeader, elementIsScrollable, containerHeight} = this.props;
        let last = true;
        if (data !== null && data.item){
            last = data.item.last;
        }

        let emptyContent = '';
        if (showEmpty) {
            emptyContent = <span><br />No items</span>;
            if (this.props.emptyContent !== undefined) emptyContent = this.props.emptyContent;
        }

        const loader = <Spinner />;

        let items = [];
        if (data != null && data.item != null) {
            if(data.item.content.length === 0){
                return (
                    <div  >
                        {emptyContent}
                    </div>
                );

            }else{

                data.item.content.map((currentItem) => {
                    items.push(createItem(currentItem));
                });

                if (container){
                    let newItems = [];
                    newItems.push(<div id={this.id}>{items}</div>);
                    items = newItems;
                }

                /*
                let threshold = 100;
                if (this.props.threshold !== undefined) threshold = this.props.threshold;
                */
                return (
                    <div style={{width: '100%'}}>
                        {showHeader &&
                        <div style={{marginBottom:10, textAlign:'left'}}>
                            <span className="summaryTitle listSummaryTitle">
                                {data.item.totalElements} {title}
                            </span>
                            {/* <Button bsStyle="link" onClick={() => onInit()} style={{outline: 'none', fontSize: '1em', verticalAlign: 'top'}}> */}

                        </div>
                        }
                        <InfScroller
                            loadMore={onLoad.bind(this)}
                            hasMore={!last}
                            loadingMore={data.isFetching}
                            loader={loader}
                            showLoader = {true}
                            items={items}
                            elementIsScrollable = {elementIsScrollable}
                            containerHeight = {containerHeight}
                            className={this.props.className + ' ' + !elementIsScrollable && 'disable-scroll'}
                        />

                        { !last && !data.isFetching &&
                        <div style={{textAlign:'center', marginTop: 20}}>
                            <button  className='btn btn-green' onClick={() => onLoad()} >
                                Show more
                            </button>
                        </div>
                        }
                    </div>
                );

            }
        }else{
            if (data.isError) {
                // return (<Warning/>);
                return <h3>Warning</h3>;
            } else {
                return (<div></div>);
            }
        }

    }
}

AsynchList.propTypes = {
    data: PropTypes.shape({
        isFetching: PropTypes.bool.isRequired,
        isError: PropTypes.bool.isRequired
    }),
    onLoad: PropTypes.func.isRequired,
    onCreateItem: PropTypes.func.isRequired,
    onInit: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired,
    showHeader: PropTypes.bool,
    showEmpty: PropTypes.bool,
    emptyContent: PropTypes.node,
    container: PropTypes.bool,
    containerHeight: PropTypes.string,
    elementIsScrollable: PropTypes.bool
};

AsynchList.defaultProps = {
    showHeader: true,
    showEmpty: true,
    container: false,
    containerHeight: '100%',
    elementIsScrollable: false
};