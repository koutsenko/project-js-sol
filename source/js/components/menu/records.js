import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions/records';

import MenuButton from '../../controls/menu/button';
  
class ButtonRecords extends MenuButton {
  render() {
    return (
      <MenuButton
        hint="Авторизация, статистика, рекорды"
        role="btn5"
        text="Рекорды"
        handler={this.props.openRecords}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    openRecords: bindActionCreators(actions.open, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRecords);