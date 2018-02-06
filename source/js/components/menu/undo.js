import   React                from 'react'                ;
import   PropTypes            from 'prop-types'           ;
import { connect }            from 'react-redux'          ;
import { bindActionCreators } from 'redux'                ;

import   MenuButton           from 'controls/menu/button' ;

import   actionsGame          from 'actions/game'         ;
import   constantsGame        from 'constants/game'       ;
import   selectorsGame        from 'selectors/game'       ;

class ButtonUndo extends React.PureComponent {
  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        hint="Отмена последнего сделанного хода"
        role="btn2"
        text="Ход назад"
        handler={this.props.revertTurn}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const game = selectorsGame.getCurrentGame(state.game);

  return {
    disabled: !state.turn.previous || (game.status === constantsGame.gameState.STATE_COMPLETED)
  };
};

const mapDispatchToProps = (dispatch) => ({
  revertTurn: bindActionCreators(actionsGame.revertTurn, dispatch)
});

ButtonUndo.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  revertTurn: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonUndo);
