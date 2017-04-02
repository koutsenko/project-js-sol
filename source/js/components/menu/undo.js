import React from 'react';
import gameActions from '../../actions/games';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MenuButton from '../../controls/menu/button';

class ButtonUndo extends MenuButton {
  render() {
    return (
      <MenuButton
        hint="Отмена последнего сделанного хода"
        role="btn2"
        text="Ход назад"
        handler={this.props.revertTurn}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {
    disabled: state.gameCurrent.prevBoard === undefined || state.gameCurrent.completed
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    revertTurn: bindActionCreators(gameActions.revertTurn, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUndo);
