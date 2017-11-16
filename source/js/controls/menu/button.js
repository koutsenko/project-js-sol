import   React            from 'react'            ;
import { connect }        from 'react-redux'      ;

import   interact         from 'interactjs'       ;

import   selectorsLayout  from 'selectors/layout' ;


class MenuButton extends React.PureComponent {
  componentDidMount() {
    interact(this.refs[this.props.role]).on('tap', this.handlePress.bind(this));
  }

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
      <div title={this.props.hint} style={this.props.style} className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '') + (this.state.pressed ? ' pressed' : '')} ref={this.props.role}>
        <div>{this.props.text}</div>
      </div>
    );
  }
}

MenuButton.propTypes = {
  btnIndex  : React.PropTypes.number.isRequired,
  btnCount  : React.PropTypes.number.isRequired,
  disabled  : React.PropTypes.bool.isRequired,
  handler   : React.PropTypes.func.isRequired,
  hint      : React.PropTypes.string.isRequired,
  role      : React.PropTypes.string.isRequired,
  text      : React.PropTypes.string.isRequired
};

const mapStateToProps = function(state, ownProps) {
  return {
    style : selectorsLayout.menuButtonStyle(state.fx.layout, ownProps.btnCount, ownProps.btnIndex)
  };
}

export default connect(mapStateToProps)(MenuButton);
