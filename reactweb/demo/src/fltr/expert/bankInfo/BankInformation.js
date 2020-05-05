import React from 'react';
import { connect } from 'react-redux';

import {
    Row,
    Col
} from '@sketchpixy/rubix';


import {fetchBankInfo, deleteBankInfo} from '../../../redux/actions/bankInfoActions';

import Spinner from '../../Spinner';
import Warning from '../../Warning';

import BankInformationForm from './BankInformationForm';
import BankInfoView from './BankInfoView';
import PanelFluttrUserInfo from '../../user/PanelFluttrUserInfo';

@connect((state) => state)
export default class BankInformation extends React.Component {

    componentDidMount() {
        // load user only first time automatically
        if (this.props.bankInfo.item == null) {
            this.props.dispatch(fetchBankInfo());
        }
    }

    render() {
        return (
            <div id="bankInfo">
                <BankInfoForm bankInfo={this.props.bankInfo}/>
            </div>
        );
    }
}


@connect((state) => state)
class BankInfoForm extends React.Component {

    constructor(props) {

        super(props);

        this.state = {
            value: '',
            sepaCountries: [],
            userBankInfo: [],
            edit: false

        };
    }

    onChangeValid(edit){
        this.setState({edit: edit });
    }

    onDeleteBankInfo(){
        this.props.dispatch(deleteBankInfo());
    }

    componentWillReceiveProps(nextProps){

        if(nextProps.bankInfo.item && !nextProps.formSubmissionHandler.showLoader){

            this.setState({edit: !nextProps.bankInfo.item.valid });
        }
    }

    render() {

        let bankInfo = this.props.bankInfo;

        if (bankInfo == null || bankInfo.isFetching) {
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Spinner />
                </div>
            );
        } else if (bankInfo.isError) {
            return (
                <div style={{marginLeft: 20, paddingTop: 20}}>
                    <Warning />
                </div>
            );

        } else {
            // console.log("EDIT STATE : " + this.state.edit);

            if((this.state.edit || !bankInfo.item)){

                return (
                    <BankInformationForm bankInfo={bankInfo.item}/>
                );

            } else {

                return (
                    <BankInfoView bankInfoToShow={bankInfo.item} onChangeValid={::this.onChangeValid} onDeleteBankInfo={::this.onDeleteBankInfo} />
                );


            }

        }

    }
}

