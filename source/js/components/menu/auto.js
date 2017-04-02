import React from 'react';
import gameActions from '../../actions/games';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MenuButton from '../../controls/menu/button';

class ButtonAuto extends MenuButton {
  render() {
    return (
      <MenuButton
        hint="Автозавершение игры, если открыты все карты"
        role="btn3"
        text="Автосбор"
        handler={this.props.completeGame}
        disabled={!this.props.canComplete}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {
    canComplete: state.gameCurrent.canComplete
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    completeGame: bindActionCreators(gameActions.completeGame, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAuto);
