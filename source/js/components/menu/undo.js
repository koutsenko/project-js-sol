import   React                from 'react'                ;
import { connect }            from 'react-redux'          ;
import { bindActionCreators } from 'redux'                ;

import   MenuButton           from 'controls/menu/button' ;

import   actionsGames         from 'actions/games'        ;
import   constantsGame        from 'constants/game'       ;
import   selectorsGame        from 'selectors/game'       ;

class ButtonUndo extends React.PureComponent {
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
  let game = selectorsGame.getCurrentGame(state);

  return {
    disabled: (state.board.previous === undefined) || (game.status === constantsGame.gameState.STATE_COMPLETED)
  };
};

const mapDispatchToProps = function(dispatch) {
  return {
    revertTurn: bindActionCreators(actionsGames.revertTurn, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUndo);
