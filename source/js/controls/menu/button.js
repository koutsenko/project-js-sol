import   React            from 'react'            ;
import   PropTypes        from 'prop-types'       ;
import { connect }        from 'react-redux'      ;

import   interact         from 'interactjs'       ;

import   selectorsLayout  from 'selectors/layout' ;

class MenuButton extends React.PureComponent {
  componentDidMount() {
    interact(this.btnRef).on('tap', this.handlePress.bind(this));
  }

  constructor(props) {
    super(props);
    this.state = {
      pressed: false
    };
  }

  handlePress() {
    if (this.props.disabled) {
      return;
    }

    this.setState({
      pressed: true
    });
    setTimeout(() => {
      this.setState({
        pressed: false
      });
    }, 250);
    this.props.handler();
  }

  render() {
    return (
      <div
        className={this.props.role + " button" + (this.props.disabled ? ' disabled' : '') + (this.state.pressed ? ' pressed' : '')}
        ref={(el) => { this.btnRef = el }}
        style={this.props.style}
        title={this.props.hint}
      >
        <div>{this.props.text}</div>
      </div>
    );
  }
}

MenuButton.propTypes = {
  btnIndex  : PropTypes.number.isRequired,
  btnCount  : PropTypes.number.isRequired,
  disabled  : PropTypes.bool.isRequired,
  handler   : PropTypes.func.isRequired,
  hint      : PropTypes.string.isRequired,
  role      : PropTypes.string.isRequired,
  style     : PropTypes.object,
  text      : PropTypes.string.isRequired
};

const mapStateToProps = (state, ownProps) => ({
  style: selectorsLayout.menuButtonStyle(state.fx.layout, ownProps.btnCount, ownProps.btnIndex)
});

export default connect(mapStateToProps)(MenuButton);
