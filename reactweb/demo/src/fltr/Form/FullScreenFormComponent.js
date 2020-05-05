import React, {Component} from 'react';

import * as formUtils from '../../fltr/utils/FormUtils';

export default class FullScreenFormComponent extends Component {
    constructor (props) {
        super(props);
        const fields = [
            {
                id: 'companyName',
                name: 'Company name',
                type: 'text',
                required: true,
                defaultValue: '',
                value: '',
                placeholder: 'Insert your company name',
                validationType: 'input',
                error: false
            },
            {
                id: 'companyDescription',
                name: 'Company description',
                type: 'text',
                required: true,
                defaultValue: '',
                value: '',
                placeholder: 'Company description',
                validationType: 'input',
                error: false
            }
        ];
        this.state = {
            active: 0,
            form: fields.map(field => field.id),
            fields: [...fields],
            formValidation: fields.reduce((acc, field) => {
                // console.log(acc, field)
                const isRequired = field.required;
                if (isRequired) {
                    acc = {
                        ...acc,
                        [field.id]: formUtils[`REQUIRED_${field.validationType.toUpperCase()}`]
                    };
                }
                return acc;
            }, {})
        };
    }
    componentWillMount () {
        document.addEventListener('keydown', this.handleEnterKey, false);
    }
  handleChange = (event) => {
      const state = {...this.state};
      state.fields[state.active].value = event.target.value;
      state.fields[state.active].error = false;
      this.setState(state);
  }
  handleSubmit = () => {
      const fieldValue = this.state.fields[this.state.active].value;
      if (fieldValue && fieldValue.trim().length > 2) {
          this.setState({
              active: ++this.state.active
          });
      } else {
          const state = {...this.state};
          state.fields[state.active].error = true;
          this.setState(state);
      }
  }
  handleEnterKey = event => {
      if (event.keyCode === 13) {
          this.handleSubmit();
      }
  }
  render () {
      return (
          <div className='full-screen-form'>
              <form onSubmit={this.handleSubmit}>
                  { this.state.fields.map((field, index) => (
                      <div>
                          <h2 className={`animated ${index === this.state.active ? 'animation-active' : 'animation-hide'} animated-fullscreen-form`}>{this.state.fields[index].name}</h2>
                          <input
                              className={`animated ${index === this.state.active ? 'animation-active' : 'animation-hide'} animated-fullscreen-form${field.error ? ' field-error' : '' }`}
                              onChange={this.handleChange}
                              value={this.state.fields[this.state.active].value}
                              type={this.state.fields[this.state.active].type}
                              id={this.state.fields[this.state.active].id}
                              name={this.state.fields[this.state.active].id}
                              placeholder={this.state.fields[this.state.active].placeholder}
                              required={this.state.fields[this.state.active].required}
                              value={this.state.fields[this.state.active].value}
                          />
                      </div>
                  ))
                  }
              </form>
          </div>
      );
  }
}
