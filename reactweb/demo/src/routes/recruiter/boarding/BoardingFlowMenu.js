import React, {Component} from 'react';

import steps from './boardingInformation';

export default class BoardingFlowMenu extends Component {
    constructor (props) {
        super(props);
        this.state = {
            ...steps
        };
    }
  handleClickMenu = (e) => {
      const element = e.target.id;
      const newActiveElement = element.split('.');
      this.props.handleChangeStep(...newActiveElement, true);
  }

  render () {
      const activeItem = `${this.props.step}.${this.props.subStep}`;
      return (
          <div className='boarding-flow-menu-container fluttr-text-big'>
              <ul>
                  {this.state.steps.map((element, index) => (
                      <section className={this.props.step === index + 1 ? 'category-active' : ''}>
                          <li id={`${index + 1}.0`}className={activeItem === `${index + 1}.0` ? ' step-active step' : 'step'} data-step={element.number} key={index} onClick={this.handleClickMenu}>{element.name}</li>
                          { element.chilldren &&
                <ul>
                    {
                        element.chilldren.map((element, innerIndex) => (
                            <li id={`${index + 1}.${innerIndex + 1}`}className={activeItem === `${index + 1}.${innerIndex + 1}` ? ' step-active chilldren-step' : 'chilldren-step'} data-step='' key={innerIndex} onClick={this.handleClickMenu}>{element.name}</li>
                        ))
                    }
                </ul>
                          }
                      </section>
                  ))}
                  <li className={activeItem === '5.0' ? ' step-active step' : 'step'} id='5.0' data-step='&#10004;' onClick={this.handleClickMenu}>
            Success
                  </li>
              </ul>
          </div>
      );
  }
}
