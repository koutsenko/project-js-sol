import   React                from 'react'                ;
import { connect }            from 'react-redux'          ;
import { bindActionCreators } from 'redux'                ;

import   MenuButton           from 'controls/menu/button' ;

import   actionsGame          from 'actions/games'        ;
import   constantsGame        from 'constants/game'       ;
import   selectorsGame        from 'selectors/game'       ;
import   toolsRules           from 'tools/rules'          ;

class ButtonAuto extends React.PureComponent {
  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        hint="Автозавершение игры, если открыты все карты"
        role="btn3"
        text="Автосбор"
        handler={this.props.completeGame}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = function(state) {
  let game = selectorsGame.getCurrentGame(state) || {};

  return { 
    disabled: (game.status !== constantsGame.gameState.STATE_STARTED) || !toolsRules.canComplete(state)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    completeGame: bindActionCreators(actionsGame.completeGame, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAuto);
