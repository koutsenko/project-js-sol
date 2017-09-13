import   React      from 'react'          ;

class RadioButton extends React.PureComponent {
  render() {
    return (
      <div ref="radiobutton" className={"radio" + (this.props.checked ? " checked" : "") + (this.props.disabled ? " disabled" : "")}>
        <span>{this.props.label}</span>
      </div>
    );
  }
};

RadioButton.propTypes = {
  disabled  : React.PropTypes.bool              ,
  checked   : React.PropTypes.bool.isRequired   ,
  label     : React.PropTypes.string.isRequired
};

export default RadioButton;