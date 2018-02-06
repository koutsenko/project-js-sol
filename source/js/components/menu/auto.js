import   React                from 'react'                ;
import   PropTypes            from 'prop-types'           ;
import { connect }            from 'react-redux'          ;
import { bindActionCreators } from 'redux'                ;

import   MenuButton           from 'controls/menu/button' ;

import   actionsGame          from 'actions/game'         ;
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

const mapStateToProps = (state) => {
  const game = selectorsGame.getCurrentGame(state.game) || {};

  return {
    disabled: (game.status !== constantsGame.gameState.STATE_STARTED) || !toolsRules.canComplete(state)
  };
};

const mapDispatchToProps = (dispatch) => ({
  completeGame: bindActionCreators(actionsGame.completeGame, dispatch)
});

ButtonAuto.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  completeGame: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonAuto);
