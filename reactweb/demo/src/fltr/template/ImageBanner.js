import React from 'react';

export default class ImageBanner extends React.Component {

    constructor(props) {
        super(props);
    }

    render() {
        let image = this.props.src;

        return (
            <div className="reviewCompletedBanner" style={this.props.style}>
                <div className="wrap">
                    <img src={image} style={{width:'100%'}} />
                    <div className="text_over_image">
                        {this.props.children}
                    </div>
                </div>
            </div>
        );
    }

}
