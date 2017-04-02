import React from 'react';
import gameActions from '../../actions/games';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import MenuButton from '../../controls/menu/button';

class ButtonDeal extends MenuButton {
  render() {
    return (
      <MenuButton
        hint="Начать новый расклад, текущий будет закрыт"
        role="btn1"
        text="Разложить"
        handler={this.props.newGame}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {
    disabled: !state.gameCurrent.canNewGame
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    newGame: bindActionCreators(gameActions.deal, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeal);
