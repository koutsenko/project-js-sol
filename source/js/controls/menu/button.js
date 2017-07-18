import React  from 'react'          ;
import Hammer from 'react-hammerjs' ;

class MenuButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
  }

  handlePress(event) {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      pressed: true
    });
    setTimeout(function() {
      this.setState({
        pressed: false
      });
    }.bind(this), 250);
    this.props.handler();
  }

  render() {
    return (
      <Hammer onTap={this.handlePress.bind(this)}>
        <div title={this.props.hint} className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '') + (this.state.pressed ? ' pressed' : '')} ref={this.props.role}>
          <div>{this.props.text}</div>
        </div>
      </Hammer>
    );
  }
}

MenuButton.propTypes = {
  disabled  : React.PropTypes.bool.isRequired,
  handler   : React.PropTypes.func.isRequired,
  hint      : React.PropTypes.string.isRequired,
  role      : React.PropTypes.string.isRequired,
  text      : React.PropTypes.string.isRequired
};

export default MenuButton;
