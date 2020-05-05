import React from 'react';
import ReactDOM from 'react-dom';
import RC2 from 'react-chartjs2';

export default class TestResults extends React.Component {
    constructor (props) {
        super(props);
        this.state = {
            results: [],
            innerHeight: 300,
            innerWidth: 1200,
            stats: [
                {
                    values: []
                }
            ]
        };
        this.readMore = this.readMore.bind(this);
        this.fitToParentSize = this.fitToParentSize.bind(this);
    }

    getData () {
    // console.log('data :  ' + JSON.stringify(this.props.data));
        return this.props.data;
    }

    componentDidMount () {
        this.fitToParentSize();
        window.addEventListener('resize', this.fitToParentSize);
        let data = this.getData();
        const stats = [
            {
                values: Object.assign(data.map(s => ({ x: `${s.title} (${s.score})`, y: s.score })))
            }
        ];
        this.setState({ results: data, stats: stats });

    /*
    setTimeout(function(){
        // console.log('init shit');
        $('.rd3-barchart-xaxis').each(function(elem){
            // console.log('inner shit');
            // console.log('elem : ' + this);
            let oldAttr = $(this).attr('transform');
            // console.log('oldAttr : ' + oldAttr);
            $(this).css('height', "200px");
        });

    }, 1000);
    */
    }
    fitToParentSize () {
        const elem = ReactDOM.findDOMNode(this.refs.resultchart);
        if (elem) {
            let w = elem.offsetWidth - 20;
            this.setState({innerWidth: w});
        }
    }
    readMore (e) {
        const name = e.currentTarget.getAttribute('name');
        if (!this.state[name] || this.state[name] === 'none') {
            this.setState({ [name]: 'block' });
        } else {
            this.setState({ [name]: 'none' });
        }
    }
  GetBarChartDataset = data => {
      if (!Array.isArray(data)) {
          console.error('Invalid data received, data should be an array');
          return null;
      }
      const dataset = [{
          backgroundColor: ['rgba(255,136,136,0.8)', 'rgba(136,214,255,0.8)', 'rgba(255,241,136,0.8)', 'rgba(152,255,136,0.8)', 'rgba(238,136,255,0.8)', 'rgba(169,136,255,0.8)'],
          borderColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
          borderWidth: 1,
          data: data,
          hoverBackgroundColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
          hoverBorderColor: ['rgba(255,136,136,1)', 'rgba(136,214,255,1)', 'rgba(255,241,136,1)', 'rgba(152,255,136,1)', 'rgba(238,136,255,1)', 'rgba(169,136,255,1)'],
          label: 'Your score'
      }];
      return dataset;
  }
  GetRadarChartDataset = data => {
      if (!Array.isArray(data)) {
          console.error('Invalid data received, data should be an array');
          return null;
      }
      const dataset = [{
          backgroundColor: ['rgba(255,136,136,0.5)'],
          borderColor: ['rgba(255,136,136,1)'],
          borderWidth: 3,
          data: data,
          hoverBackgroundColor: ['rgba(255,136,136,1)'],
          hoverBorderColor: ['rgba(255,136,136,1)'],
          label: 'Your score'
      }];
      return dataset;
  }

  GetBarChartOptions = (maxValue, stepSize) => {
      const options = {
          legend: {
              display: false
          },
          scales: {
              xAxes: [{
                  ticks: {
                      min: 0,
                      max: maxValue,
                      stepSize: stepSize,
                  }
              }]
          }
      };
      return options;
  }
  GetRadarChartOptions = (maxValue, stepSize) => {
      const options = {
          legend: {
              display: false
          },
          scale: {
              ticks: {
                  min: 0,
                  max: maxValue,
                  stepSize: stepSize,
              }
          }
      };
      return options;
  }
  render () {
      return (
          <div className='testResult'>
              <div>
                  <p className='question'>Test results</p>
                  <p className='title2'>Domains</p>
                  <RC2 data={{
                      labels: this.state.stats[0].values.map(item => item.x),
                      datasets: this.GetRadarChartDataset(this.state.results.map(item => item.score))
                  }}
                  options={this.GetRadarChartOptions(120, 20)}
                  type='radar' />
                  {
                      this.state.results.map(d =>
                          <div key={d.title} id={'domain-' + d.domain} className='domain-section'>
                              <h2 className='group-result'>{d.title}</h2>
                              <div className='facet-content'>
                                  <p>
                                      <span dangerouslySetInnerHTML={{__html: d.shortDescription}} />
                                      <br />maxValue
                                      <br />
                                      <div style={{display: this.state[d.domain] || 'none'}}><span dangerouslySetInnerHTML={{__html: d.description}} /></div>
                                      <div className='visible-print-block'><span dangerouslySetInnerHTML={{__html: d.description}} /></div>
                                      <span className='hidden-print' name={d.domain} onClick={this.readMore} style={{textTransform: 'lowercase', color: '#5991ff'}}>
                                          {this.state[d.domain] === 'block' ? '...read less' : `... read more (${d.description.split(' ').length} words)`}
                                      </span>
                                  </p>
                                  <p><span dangerouslySetInnerHTML={{__html: d.text}} /> </p>
                                  <p>Your level of <i>{d.title.toLowerCase()}</i> is <b>{d.scoreText} ({d.score}/{d.count * 5})</b></p>
                                  <RC2 ref='chart-general' data={{
                                      labels: d.facets.map(facet => (facet.title + ` (${facet.score})`)),
                                      datasets: this.GetBarChartDataset(d.facets.map(facet => facet.score))
                                  }}
                                  options={this.GetBarChartOptions(20, 1)}
                                  type='horizontalBar' />
                                  {
                                      d.facets.map(f =>
                                          <span key={f.title}>
                                              <p className='facet-title'>{f.title}</p>
                                              <p><span dangerouslySetInnerHTML={{__html: f.text}} /></p>
                                              <p>Your level of <i>{f.title.toLowerCase()}</i> is <b>{f.scoreText} ({f.score}/{f.count * 5})</b></p>
                                          </span>
                                      )
                                  }
                              </div>
                          </div>
                      )
                  }
              </div>
              <div className='dev-example visible-print-block'>
                  <h2>The following content it's for development purpouses ignore it</h2>
                  <code>{JSON.stringify(this.props.choices.map(choice => (choice.score)))}</code>
                  <h4>{`Time to complete the test: ${this.props.timeElapsed} seconds`}</h4>
              </div>
          </div>
      );
  }
}
