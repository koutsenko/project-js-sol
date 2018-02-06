import   React                from 'react'                ;
import   PropTypes            from 'prop-types'           ;
import { connect }            from 'react-redux'          ;
import { bindActionCreators } from 'redux'                ;

import   MenuButton           from 'controls/menu/button' ;

import   actionsGame          from 'actions/game'         ;
import   constantsGame        from 'constants/game'       ;
import   selectorsGame        from 'selectors/game'       ;
import   toolsHash            from 'tools/hash'           ;

class ButtonDeal extends React.PureComponent {
  constructor(props) {
    super(props);

    this.generateNewGame = this.generateNewGame.bind(this);
  }

  generateNewGame() {
    if (toolsHash.getHashCmd() === 'deal') {
      this.props.newGame(toolsHash.getHashParm() || Date.now());
    } else {
      this.props.newGame(Date.now());
    }
  }

  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        hint="Начать новый расклад, текущий будет закрыт"
        role="btn1"
        text="Разложить"
        handler={this.generateNewGame}
        disabled={this.props.disabled}
      />
    );
  }
}

const mapStateToProps = (state) => {
  const game    = selectorsGame.getCurrentGame(state.game) || {};

  return {
    disabled: !game.status || (game.status === constantsGame.gameState.STATE_CREATED)
  };
};

const mapDispatchToProps = (dispatch) => ({
  newGame: bindActionCreators(actionsGame.deal, dispatch)
});

ButtonDeal.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  newGame: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonDeal);
