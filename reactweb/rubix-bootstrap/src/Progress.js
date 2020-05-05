import React from 'react';
import classNames from 'classnames';
import ProgressBar from './BProgressBar';

ProgressBar.propTypes.children = React.PropTypes.arrayOf(React.PropTypes.element);

export default class Progress extends React.Component {
  static propTypes = {
    value: React.PropTypes.number,
    success: React.PropTypes.bool,
    info: React.PropTypes.bool,
    warning: React.PropTypes.bool,
    danger: React.PropTypes.bool,
    color: React.PropTypes.string,
    fgColor: React.PropTypes.string,
    collapseBottom: React.PropTypes.bool,
  };

  get value() {
    return this.props.value || this.props.now;
  }

  get min() {
    return this.props.min;
  }

  get max() {
    return this.props.max;
  }

  getValue() {
    console.warn("Progress.getValue() is deprecated in favor of Progress.value");
    return this.value;
  }
  getMin() {
    console.warn("Progress.getMin() is deprecated in favor of Progress.min");
    return this.min;
  }
  getMax() {
    console.warn("Progress.getMax() is deprecated in favor of Progress.max");
    return this.max;
  }

  render() {
    let props = { ...this.props };

    if (props.value) {
      props.now = props.value;
      delete props.value;
    }

    if (props.success) {
      props.bsStyle = 'success';
    }

    if (props.info) {
      props.bsStyle = 'info';
    }

    if (props.warning) {
      props.bsStyle = 'warning';
    }

    if (props.danger) {
      props.bsStyle = 'danger';
    }

    if (props.fgColor) {
      props.style = {
        ...props.style,
        color: props.fgColor
      };
    }

    if (props.collapseBottom) {
      props.className = classNames(props.className, 'progress-collapse-bottom');
    }

    return <ProgressBar {...props} />;
  }
}
