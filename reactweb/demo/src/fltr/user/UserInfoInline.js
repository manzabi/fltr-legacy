import React from 'react';

import {doLogout} from '../../common/utils';
import { Entity } from '@sketchpixy/rubix/lib/L20n';


export default class UserInfoInline extends React.Component {

    constructor(props) {
        super(props);
    }

    handleLogout(e) {
        doLogout();
    }

    render() {
        let user = this.props.user;

        if (user == null || user.isFetching){
            return (
                <div />
            );
        } else if (user.isError){
            return (
                <div />
            );

        } else {
            return (
                <div style={{marginTop: -8}}>
                    <img src={user.item.imageUrl} height='30' width='30'
                        style={{marginLeft: 10, marginRight: 10, borderRadius: 100}}/>
                    {/* {user.item.completeName} */}
                </div>
            );
        }
    }
}

