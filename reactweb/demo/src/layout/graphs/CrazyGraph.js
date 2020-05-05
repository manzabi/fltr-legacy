import React from 'react';
import { Header } from '../FluttrFonts';

export const CircleChart = ({ value = 0, maxValue = 100, valueString = '', color = 'green', radius = 70, stroke = 8, zindex = 0 }) => {

    const progress = value / maxValue;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = (1 - progress) * circumference;
    return (<div className='crazy-circle-chart'>
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{ zIndex: zindex }}
        >
            <circle
                fill='transparent'
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={color}
            />
        </svg>
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{ position: 'absolute', zIndex: zindex - 1 }}
        >
            <circle
                fill='transparent'
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: 0 }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className='inner-circle'
            />
        </svg>
        <Header size='lg'>{valueString}</Header>
    </div>);
};

export const DividedCircle = ({ value = 0, maxValue = 3, color = 'green', radius = 70, stroke = 8, zindex = 0, separator = '/' }) => {

    const progress = 1 / maxValue;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 2 * Math.PI;
    const strokeDashoffset = (1 - progress) * circumference;
    const moveBy = 2 * maxValue;
    return (<div className='crazy-dividedcircle-chart'>
        <svg
            height={radius * 2 + moveBy}
            width={radius * 2 + moveBy}
            style={{ zIndex: zindex }}
        >
            {Array(maxValue).fill('').map((e, i) => (
                <circle
                    fill='transparent'
                    strokeWidth={stroke}
                    strokeDasharray={circumference + ' ' + circumference}
                    style={{
                        strokeDashoffset,
                        transform: `rotate(${180 + (90 / maxValue) * (4 * i - 1)}deg)`
                    }}
                    r={normalizedRadius + moveBy}
                    cx={radius + (moveBy / 2)}
                    cy={radius + (moveBy / 2)}
                    className={i < value ? color : 'lightgrey'}
                />
            ))}
        </svg>
        <Header size='lg'>{value + separator + maxValue}</Header>
    </div>);
};

export const LinesChart = ({ data = [0], maxValue = 100 }) => {
    const numberOfColumns = maxValue / 10;

    const colors = ['orange', 'primary', 'lightgrey'];

    const renderSeparator = (value, index) => {
        const numberOfDigits = (10 * index).toString().length;
        return (
            <div
                className='separator'
                style={{ left: `calc(${index} * (100% / ${numberOfColumns}))` }}
                key={'separator-' + value + index}
            >
                <div
                    className='separator-number'
                    style={{ left: numberOfDigits === 1 ? -3 : numberOfDigits === 2 ? -6 : -8 }}
                >
                    {10 * index}
                </div>
            </div>
        );
    };

    const renderBar = (value, index) => (<div className='bar-container' key={'bar-' + value + index}>
        <div className='bar'>
            <div className={`bar-content ${colors[index % colors.length]}`} style={{ width: `calc(${value / maxValue * 100}%)` }} />
            <div className={`bar-value ${colors[index % colors.length]}`}>{value}</div>
        </div>
    </div>);

    return (<div className='crazy-lines-chart'>
        {Array(numberOfColumns + 1).fill('').map((value, index) => renderSeparator(value, index))}
        {data.map((value, index) => renderBar(value, index))}
    </div>);
};

export const HalfCircleChart = ({ value = 0, maxValue = 100, color = 'green', radius = 70, stroke = 8, zindex = 0, hidden = false, separator = '/' }) => {

    const progress = value / maxValue;
    const normalizedRadius = radius - stroke * 2;
    const circumference = normalizedRadius * 4 * Math.PI / 3;
    const strokeDashoffset = (1 - progress) * circumference;

    return (<div className='crazy-half-circle-chart'>
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{ zIndex: zindex }}
        >
            <circle
                fill='transparent'
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={hidden ? 'transparent' : color}
            />
        </svg>
        <svg
            height={radius * 2}
            width={radius * 2}
            style={{ position: 'absolute', zIndex: zindex - 1 }}
        >
            <circle
                fill='transparent'
                strokeWidth={stroke}
                strokeDasharray={circumference + ' ' + circumference}
                style={{ strokeDashoffset: 0 }}
                r={normalizedRadius}
                cx={radius}
                cy={radius}
                className={`inner-half-circle${hidden ? 'hidden' : ''}`}
            />
        </svg>
        <Header size='lg'>{value}<span>{separator + maxValue}</span></Header>
    </div>);
};