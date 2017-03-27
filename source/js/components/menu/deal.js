import React from 'react';
import gameActions from '../../actions/games';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { getHashCmd, getHashParm } from '../../tools/hash';

import MenuButton from '../../controls/menu/button';

class ButtonDeal extends MenuButton {
  generateNewGame() {
    if (getHashCmd() === 'deal') {
      this.props.newGame(getHashParm() || Date.now());
    } else {
      this.props.newGame(Date.now());
    }
  }

  render() {
    return (
      <MenuButton
        hint="Начать новый расклад, текущий будет закрыт"
        role="btn1"
        text="Разложить"
        handler={this.generateNewGame.bind(this)}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {
    disabled: !state.menu.gameCreateEnabled
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    newGame: bindActionCreators(gameActions.deal, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeal);
