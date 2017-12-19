import React     from 'react'     ;
import PropTypes from 'prop-types';

class RadioButton extends React.PureComponent {
  render() {
    return (
      <div className={"radio" + (this.props.checked ? " checked" : "") + (this.props.disabled ? " disabled" : "")}>
        <span>{this.props.label}</span>
      </div>
    );
  }
}

RadioButton.propTypes = {
  disabled  : PropTypes.bool              ,
  checked   : PropTypes.bool.isRequired   ,
  label     : PropTypes.string.isRequired
};

export default RadioButton;
