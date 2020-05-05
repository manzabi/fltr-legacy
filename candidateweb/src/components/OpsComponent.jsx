import React from 'react';

const OpsComponent = ({ title, content }) => (
    <div className="notfoundContainer">
        <div className="notfound">
            <div className="notfound-404">
                <h1>Oops!</h1>
            </div>
            <h2>{title}</h2>
            <p>{content}</p>
        </div>
    </div>
);

export default OpsComponent;