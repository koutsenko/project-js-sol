import   React                from 'react'                  ;
import   PropTypes            from 'prop-types'             ;
import { bindActionCreators } from 'redux'                  ;
import { connect }            from 'react-redux'            ;

import   actions              from 'actions/options'        ;

import   MenuButton           from 'controls/menu/button'   ;

class ButtonOptions extends React.PureComponent {
  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        disabled={false}
        hint="Настройки правил, управления и анимаций"
        role="btn5"
        text="Настройки"
        handler={this.props.openOptions}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  openOptions: bindActionCreators(actions.open, dispatch)
});

ButtonOptions.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  openOptions: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(null, mapDispatchToProps)(ButtonOptions);
