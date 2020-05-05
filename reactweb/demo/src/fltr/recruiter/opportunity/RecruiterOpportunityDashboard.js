import React, {Component} from 'react';
import {
    Row,
    Col,
    Grid,
    Button,
    OverlayTrigger,
    Tooltip,
    Popover
} from '@sketchpixy/rubix';
import RC2 from 'react-chartjs2';

import {getDateString} from '../../../common/timerUtils';

class RecruiterOpportunityDashboard extends Component {
    constructor (props) {
        const randomDate = (start, end) => {
            return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime()));
        };
        const randomNum = (end) => {
            return Math.round(Math.random() * end);
        };
        const randomBool = () => {
            return !!Math.floor(Math.random() * 2);
        };
        let sampleNum = 31;
        let dates = Array(sampleNum).fill('String');
        const data = {
            applicants: Array(sampleNum).fill(randomNum(20)),
            submissions: Array(sampleNum).fill(randomNum(10)),
            score: Array(sampleNum).fill(randomNum(100)),
            reviewed: Array(sampleNum).fill(randomBool())
        };
        data.applicants = data.applicants.map(item => randomNum(20));
        data.submissions = data.submissions.map(item => randomNum(10));
        data.score = data.score.map(item => randomNum(100));
        data.reviewed = data.reviewed.map(item => randomBool());
        const newData = [data.applicants, data.submissions, data.score, data.reviewed];

        let dateInPast = new Date();
        dateInPast.setDate(dateInPast.getDate() - sampleNum);

        dates = dates.map((date, index) => {
        // console.log("MAP");
            //const newDate = randomDate(new Date(2017, 0, 1), new Date()).toLocaleDateString();
            let newDate = new Date();
            newDate.setDate(dateInPast.getDate() + index);
            // console.log(newDate);
            return getDateString(newDate, 'Do MMMM');
        });

        super(props);
        this.state = {
            testate: 'Candidates',
            fakedata: {
                dates: dates,
                data: newData,
                labels: ['applications', 'submissions', 'score', 'reviewed']
            }
        };
    }
    render () {
    // const datasets = this.state.fakedata.data.map((dataset, i) => (
    //   {
    //     backgroundColor: ['rgba(255,136,136,0.8)', 'rgba(136,214,255,0.8)', 'rgba(255,241,136,0.8)', 'rgba(152,255,136,0.8)', 'rgba(238,136,255,0.8)', 'rgba(169,136,255,0.8)'],
    //     borderColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
    //     borderWidth: 1,
    //     data: dataset,
    //     hoverBackgroundColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
    //     hoverBorderColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
    //     label: this.state.fakedata.labels[i]
    //   }
    // ));
        const datasets = [
            {
                backgroundColor: 'rgba(92, 205, 218,0.8)',
                borderColor: 'rgba(92, 205, 218,1)',
                borderWidth: 3,
                data: [...this.state.fakedata.data[0]],
                hoverBackgroundColor: 'rgba(92, 205, 218,1)',
                hoverBorderColor: 'rgba(92, 205, 218,1)',
                label: this.state.fakedata.labels[0],
                fill: false
            },
            {
                backgroundColor: 'rgba(135,255,100,0.8)',
                borderColor: 'rgba(135,255,100,1)',
                borderWidth: 3,
                data: [...this.state.fakedata.data[1]],
                hoverBackgroundColor: 'rgba(135,255,100,1)',
                hoverBorderColor: 'rgba(135,255,100,1)',
                label: this.state.fakedata.labels[1],
                fill: false
            }


        ];
        const chartData = datasets;
        // console.log(chartData);


        // first pie chart

        let dataFirstChart = {
            datasets: [{
                data: [30, 20, 10, 5],
                hoverBorderColor: ['rgba(135,255,100,0.8)', 'rgba(232, 48, 51,0.8)', 'rgba(92, 205, 218,0.8)', 'rgba(233, 203, 57, 0.8)'],
                borderColor: ['rgba(255,255,255,0.8)', 'rgba(255, 255, 255,0.8)', 'rgba(255, 255, 255,0.8)', 'rgba(255, 255, 255,0.8)'],
                backgroundColor: ['rgba(135,255,100,1)', 'rgba(232, 48, 51,1)', 'rgba(92, 205, 218,1)', 'rgba(233, 203, 57, 1)']
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Submitted',
                'Expired',
                'Accepted',
                'Pending'
            ]
        };

        let dataSecondChart = {
            datasets: [{
                data: [40, 20, 3, 1],
                hoverBorderColor: ['rgba(232, 48, 51,0.8)', 'rgba(233, 203, 57, 0.8)', 'rgba(135,255,100,0.8)', 'rgba(92, 205, 218,0.8)'],
                borderColor: ['rgba(255,255,255,0.8)', 'rgba(255, 255, 255,0.8)', 'rgba(255, 255, 255,0.8)', 'rgba(255, 255, 255,0.8)'],
                backgroundColor: ['rgba(232, 48, 51, 1)', 'rgba(233, 203, 57, 1)','rgba(135,255,100,1)', 'rgba(92, 205, 218,1)']
            }],

            // These labels appear in the legend and in the tooltips when hovering different arcs
            labels: [
                'Bad',
                'Normal',
                'Good',
                'Genius'
            ]
        };

        return (
            <div className='containerMaxSize'>
                <Grid>
                    <Row style={{paddingBottom: 20, backgroundColor:'white'}}>
                        <div className='container-fluid'>
                            <h2>History</h2>
                            <RC2 ref='canvas'
                                data={{
                                    labels: this.state.fakedata.dates,
                                    datasets: chartData
                                }}
                                options ={{
                                    tooltips: {
                                        mode: 'index',
                                        intersect: false
                                    },
                                    hover: {
                                        mode: 'x',
                                        intersect: false
                                    },
                                    scales: {
                                        xAxes: [{
                                            gridLines: {
                                                display:false
                                            }
                                        }],
                                        yAxes: [{
                                            gridLines: {
                                                display:true
                                            },
                                            ticks: {
                                                beginAtZero:true,
                                                stepSize: 5
                                            }
                                        }]
                                    }
                                }}
                                type='line' />
                        </div>
                    </Row>

                    <Row style={{marginTop: 20}}>
                        <Col xs={6} style={{padding:'0 5px 0 0',boxSizing:'border-box'}}>
                            <Grid style={{backgroundColor:'white'}}>
                                <h2>Status</h2>
                                <RC2 ref='canvas'
                                    data={dataFirstChart}
                                    options ={{}}
                                    type='doughnut' />
                                <br/>
                            </Grid>
                        </Col>
                        <Col xs={6} style={{padding:'0 0 0 5px',boxSizing:'border-box'}}>
                            <Grid style={{backgroundColor:'white'}}>
                                <h2>Quality</h2>
                                <RC2 ref='canvas'
                                    data={dataSecondChart}
                                    options ={{
                                    }}
                                    type='doughnut' />
                                <br/>
                            </Grid>
                        </Col>
                    </Row>
                </Grid>
            </div>
        );
    }
}

export default RecruiterOpportunityDashboard;
