import React     from 'react'     ;
import PropTypes from 'prop-types';
import interact  from 'interactjs';

class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setState({
      checked  : this.props.checked
    });
  }

  componentWillUpdate(nextProps) {
    this.setState({
      checked: nextProps.checked
    });
  }

  componentDidMount() {
    interact(this.inputRef).on('tap', this.handleCheckboxClick.bind(this));
  }

  handleCheckboxClick() {
    if (!this.props.disabled) {
      this.props.handler();
    }
  }

  render() {
    return (
      <div ref={(el) => { this.inputRef = el }} className={"checkbox" + (this.state.checked ? " checked" : "") + (this.props.disabled ? " disabled" : "")}>
        <span>{this.props.label}</span>
      </div>
    );
  }
}

Checkbox.propTypes = {
  disabled  : PropTypes.bool              ,
  checked   : PropTypes.bool.isRequired   ,
  label     : PropTypes.string.isRequired ,
  handler   : PropTypes.func.isRequired
};

export default Checkbox;
