import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions/rules';

import MenuButton from '../../controls/menu/button';
  
class ButtonRules extends MenuButton {
  render() {
    return (
      <MenuButton
        hint="Как играть в пасьянс-косынку"
        role="btn4"
        text="Правила"
        handler={this.props.openRules}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    openRules: bindActionCreators(actions.open, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRules);