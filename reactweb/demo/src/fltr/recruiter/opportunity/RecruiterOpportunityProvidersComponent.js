import React, {Component} from 'react';
import { PUBLIC, PRIVATE } from '../../../constants/opportunityType';
import ButtonBarComponent from '../../../common/components/ButtonBarComponent';

export default class RecruiterOpportunityProvidersComponent extends Component {
    constructor (props) {
        super(props);
        this.state = {
            providers: props.providers,
            opportunityType: props.opportunity.type,
            loading: false
        };
    }

    handleChangeProvider = (event) => {
        let {providers} = this.state;
        providers = providers.map((provider) => {
            if (provider.id === event.id) {
                provider.enabled = event.value;
            }
            return provider;
        });
        this.setState({
            providers
        });
    }
    
    handleSave = (event) => {
        event.preventDefault();
        if (this.state.opportunityType === PUBLIC) {
            const objectStored = {
                providerList: this.state.providers.map(({id, enabled}) => {
                    return {
                        id,
                        enabled
                    };
                })
            };
            this.props.handleSaveProviders(objectStored);
        } else {
            this.props.onNext();
        }
    }

    onChangeOpportunityStatusOk = ({type}) => {
        if (type === PRIVATE) {
            this.state.providers.forEach((provider) => {
                document.getElementById(provider.name).checked = false;
            });
        } else if (type === PUBLIC) {
            this.state.providers.forEach((provider) => {
                document.getElementById(provider.name).checked = provider.enabled;
            });
        }
        this.setState({
            opportunityType: type,
            loading: false
        });
    }

    handleChangeVisibility = ({target}) => {
        const {checked} = target;
        this.setState({
            loading: true
        });
        this.props.changeOpportunityVisibility(checked, this.onChangeOpportunityStatusOk);
    }
    render () {
        return (
            <section className='fluttr-provider-component containerMaxSize'>
                <h1 className='fluttr-header-md'>
                    Reach out to more candidates
                </h1>
                <p className='fluttr-text-md'>
                    Would you like to publish your job post on other job boards? Choose the ones that you prefer and we will make it happen for you. No worries, you will see all candidates on Fluttr! 
                </p>
                { !this.props.isCreate &&
                    <form className='opportunity-visibility-toggle'>
                        <span className='fluttr-text-md'>Multi post enabled</span>
                        <input
                            defaultChecked={this.props.opportunity.type === PUBLIC}
                            type='checkbox'
                            onChange={this.handleChangeVisibility}
                            disabled={this.state.loading}
                        />
                    </form>
                }
                <section className='providers-section'>
                    {this.state.providers.map((provider, i) => (
                        <ProviderItem
                            provider={provider}
                            handleChangeProvider={this.handleChangeProvider}
                            isCreate={this.props.isCreate}
                            key={i}
                            disabled={this.state.opportunityType === PRIVATE}
                        />
                    ))}
                </section>
                <ButtonBarComponent
                    fowardButtonText={this.state.isCreation || this.state.opportunityType === PRIVATE ? 'Next' : 'Save'}
                    onFoward={this.handleSave}
                    backButtonText='Go back'
                    loading={this.state.loading}
                />
            </section>
        );
    }
}

const ProviderItem = ({provider, handleChangeProvider, isCreate, disabled}) => {
    return (
        <div key={provider.id} className='fluttr-provider-item'>
            <p className='provider-prize fluttr-text-md'>Free</p>
            <img
                src={`https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/providers/provider_${provider.id}_logo.png`}
                alt='Provider image'
            />
            <section className='provider-actions'>
                <div className='provider-stadistics'>
                    {!isCreate && provider.activable && 
                        [
                            <span key='views'>{`${provider.views} views`}</span>,
                            <span key='applications'>{`${provider.applications} candidates`}</span>
                        ]
                    }
                </div>
                <form action="">
                    <input
                        id={provider.name}
                        defaultChecked={provider.activable && !disabled ? provider.enabled : false}
                        disabled={!provider.activable || disabled}
                        type='checkbox'
                        onChange={(event) => handleChangeProvider({id: provider.id, value: event.target.checked})}
                    />
                </form> 
                { !provider.activable && !disabled &&
                    <div className='provider-disabled'>
                        <p>
                            {provider.message}
                        </p>
                    </div>
                }
            </section>
        </div>
    );
};