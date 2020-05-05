import React from 'react';
import { connect } from 'react-redux';

import {
    Grid,
    Row,
    Col,
    Image
} from '@sketchpixy/rubix';

import {fetchReplyList} from '../../redux/actions/feedActions';
import {getTimeString} from '../../common/timerUtils';

import DOMPurify from 'dompurify';
import Lightbox from 'react-image-lightbox';

import { Entity } from '@sketchpixy/rubix/lib/L20n';

import AsyncList from '../template/AsyncList';

@connect((state) => state)
export default class FeedReplyListComponent extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        this.init();
    }

    init = () => {
        let id = this.props.id;

        this.props.dispatch(fetchReplyList(id));
    };

    loadItems = () => {
        let id = this.props.id;
        let page = 0;
        let list = this.props.feedReply;

        if (!list.isFetching) {
            if (list.item) {
                page = list.item.number + 1;
            }
            this.props.dispatch(fetchReplyList(id, page));
        }
    };

    createItem = (data) => {
        return (<FeedReplyItem key={data.id} data={data} />);
    };

    render() {
        let list = this.props.feedReply;

        return(
            <AsyncList
                showEmpty={false}
                title='Comments'
                data={list}
                onInit={this.init}
                onLoad={this.loadItems}
                onCreateItem={this.createItem}
            />
        );
    }
}

class FeedReplyItem extends React.Component {

    constructor(props) {
        super(props);

        this.state = {
            isOpen: false
        };
    }

    render(){
        let reply = this.props.data;
        let user = reply.user;

        let name = user.completeName;
        let role = user.completePosition;
        if (user.hideUser){
            name = user.name;
            role = '';
        }

        const customStyles = {
            overlay: {
                zIndex:1099
            }
        };


        return (
            <section className='feed-reply-item-container'>
                <div className='user-image-container'>
                    <img src={user.imageUrl} width='100%' />
                </div>
                <div className='reply-container'>
                    <div className='user-description-container'>
                        <p className='userName'>{name}</p>
                        <p>{role}</p>
                        <p className='textLittle'>{getTimeString(reply.creation)}</p>
                    </div>
                    <div className='fluttr-text-small' dangerouslySetInnerHTML={{__html: DOMPurify.sanitize(reply.contentHtml)}} />
                    <div>
                        {reply.imageUrl &&
                        <div>
                            <Image className='zoomable'
                                onClick={() => this.setState({ isOpen: true })}
                                src={reply.imageUrl} thumbnail     
                            />
                        </div>
                        }
                        {this.state.isOpen &&
                            <Lightbox
                                reactModalStyle={customStyles}
                                mainSrc={reply.imageUrl}
                                onCloseRequest={() => this.setState({ isOpen: false })}
                            />
                        }

                    </div>
                </div>
            </section>
        );
    }

}
