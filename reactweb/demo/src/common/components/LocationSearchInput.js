import React, {Component} from 'react';
import PropTypes from 'prop-types';

import PlacesAutocomplete, {
    geocodeByAddress,
    getLatLng,
} from 'react-places-autocomplete';
import { manageErrorMessage } from '../utils';

/**
 * @param address: PropTypes.string,
 * @param focusElement: PropTypes.func,
 * @param handleChangeLocationQuery: PropTypes.func.isRequired,
 * @param handleChangeLocation: PropTypes.func.isRequired
 */
export default class LocationSearchInput extends Component {
    constructor(props) {
        super(props);
        this.state = {
            address: '',
            loading: false
        };
    }

    componentWillReceiveProps (nextProps) {
        if (nextProps.address)
            this.setState({
                address: nextProps.address
            });
    }
    
    handleChange = address => {
        this.props.handleChangeLocationQuery(address);
    };

    handleSelect = address => {
        this.setState({
            loading: true
        });
        this.props.handleChangeLocationQuery(address);
        geocodeByAddress(address)
            .then(results => getLatLng(results[0]))
            .then(latLng => {
                const geocoder = new window.google.maps.Geocoder;
                geocoder.geocode({'location': latLng}, (response) => {
                    const {address_components ,geometry} = response[0];
                    const {lat, lng} = geometry.location;
                    const location = address_components.reduce((acc, item) => {
                        if (item.types.indexOf('locality') !== -1) {
                            const {long_name} = item;
                            acc = {
                                ...acc,
                                city: long_name
                            };
                        } else if (item.types.indexOf('postal_town') !== -1 && !acc.city) {
                            const {long_name} = item;
                            acc = {
                                ...acc,
                                city: long_name
                            };
                        } else if (item.types.indexOf('administrative_area_level_2') !== -1) {
                            const {long_name} = item;
                            acc = {
                                ...acc,
                                stateProvince: long_name
                            };
                        } else if (item.types.indexOf('administrative_area_level_1') !== -1) {
                            const {long_name} = item;
                            acc = {
                                ...acc,
                                region: long_name
                            };
                        } else if (item.types.indexOf('country') !== -1) {
                            const {long_name, short_name} = item;
                            acc = {
                                ...acc,
                                country: long_name,
                                countryShort: short_name
                            };
                        } else if (item.types.indexOf('postal_code') !== -1) {
                            const {long_name} = item;
                            acc = {
                                ...acc,
                                zipCode: long_name
                            };
                        }
                        acc.query = address;
                        this.setState({
                            loading: false
                        });
                        return acc;
                    },
                    {
                        latitude: lat(),
                        longitude: lng(),
                        city: 'not-defined',
                        country: 'not-defined',
                        countryShort: 'not-defined',
                        query: 'not-defined',
                        region: 'not-defined',
                        stateProvince: 'not-defined',
                        zipCode: 'not-defined'
                    });
                    const validation = Object.keys(location).map((key) => ({key, value:location[key]})).filter(({value}) => value === 'not-defined');
                    const isValid = !validation.length;

                    if (!isValid) {
                        const objectMappings = {
                            city: 'locality',
                            country: 'country',
                            countryShort: 'country',
                            region: 'administrative_area_level_1',
                            stateProvince: 'administrative_area_level_2',
                            zipCode: 'postal_code'
                        };
                        response.shift();
                        const addressComponents = [];
                        response.forEach(({address_components}) => {address_components.forEach(ele => {addressComponents.push(ele);});});
                        validation.forEach(({key}) => {
                            const newValue = addressComponents.find((address) => address.types.indexOf(objectMappings[key]) !== -1);
                            if (newValue) {
                                if (key === 'countryShort') {
                                    location[key] = newValue.short_name;
                                } else  location[key] = newValue.long_name;

                            }
                        });
                    }
                    this.props.handleChangeLocation(location);
                    const objectCheck = Object.keys(location).map((key) => {
                        return {key, value: location[key]};
                    }
                    );

                    const fieldsWithError = objectCheck.filter((field) => {
                        return field.value === 'not-defined';
                        
                    });
                    if (fieldsWithError.length) {
                        const err = new Error();
                        window.Raven.captureException(err, {extra: location});
                    }
                });
            })
            .catch(() => {
                this.setState({
                    loading: false
                });
                manageErrorMessage('mapError', 'Error searching the provided city, try again');
            });
    };

    handleFocusElement = (event) => {
        if (this.props.focusElement) {
            this.props.focusElement(event);
        }
    }
    
    render() {
        return (
            <PlacesAutocomplete
                value={this.props.address}
                onChange={this.handleChange}
                onSelect={this.handleSelect}
                searchOptions={{types: ['(cities)']}}
            >
                {({ getInputProps, suggestions, getSuggestionItemProps, loading }) => (
                    <div className={`location-search-input fluttr-input ${this.state.loading ? 'loading' : ''}`}>
                        <input
                            {...getInputProps({
                                id: 'locationInput',
                                placeholder: 'Search Places ...',
                                className: 'location-search-input',
                                disabled: this.state.loading,
                                onFocus: this.props.focusElement
                            })}
                        />
                        <div className="pac-container">
                            {loading && <div>Loading...</div>}
                            {suggestions.map(suggestion => {
                                const className = `pac-item ${suggestion.active ? 'pac-item-active' : ''}`;
                                // inline style for demonstration purpose
                                const city = suggestion.description.split(',')[0];
                                const decoration = suggestion.description.split(',').filter((item, index) => index !== 0).join(',');
                                return (
                                    <div
                                        {...getSuggestionItemProps(suggestion, {
                                            className
                                        })}
                                    >   
                                        <i className='fas fa-map-marker-alt' /><span className='pac-matched'>{city}</span><span className='pac-item-query'>{decoration}</span>
                                    </div>
                                );
                            })}
                            { (suggestions.length || loading) &&
                                <div className='pac-logo'>
                                    <img src='https://s3.eu-west-3.amazonaws.com/fluttr-files/all/website/images/common/powered_by_google_on_white_hdpi.png' alt='Google atribution logo'/>
                                </div>
                            }
                        </div>
                    </div>
                )}
            </PlacesAutocomplete>
        );
    }
}

LocationSearchInput.PropTypes = {
    address: PropTypes.string,
    focusElement: PropTypes.func,
    handleChangeLocationQuery: PropTypes.func.isRequired,
    handleChangeLocation: PropTypes.func.isRequired


};

LocationSearchInput.defaultProps = {
    address: ''
};