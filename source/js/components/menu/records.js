import   React                from 'react'                  ;
import   PropTypes            from 'prop-types'             ;
import { bindActionCreators } from 'redux'                  ;
import { connect }            from 'react-redux'            ;

import   actions              from 'actions/records'        ;

import   MenuButton           from 'controls/menu/button'   ;

class ButtonRecords extends React.PureComponent {
  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        disabled={false}
        hint="Авторизация, статистика, рекорды"
        role="btn4"
        text="Рекорды"
        handler={this.props.openRecords}
      />
    );
  }
}

const mapDispatchToProps = (dispatch) => ({
  openRecords: bindActionCreators(actions.open, dispatch)
});

ButtonRecords.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  openRecords: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(null, mapDispatchToProps)(ButtonRecords);
