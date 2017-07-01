import React from 'react';

class MenuButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    }
  }

  componentDidMount() {
    // let ir = interact(this.refs[this.props.role]);
    // ir.styleCursor(false);
    // ir.preventDefault('always');
    // ir.on('tap', this.handlePress.bind(this));
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
      <div title={this.props.hint} className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '') + (this.state.pressed ? ' pressed' : '')} ref={this.props.role}>
        <div>{this.props.text}</div>
      </div>
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
