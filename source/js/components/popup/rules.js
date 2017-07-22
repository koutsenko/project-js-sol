import   React                from 'react'          ;
import { bindActionCreators } from 'redux'          ;
import { connect }            from 'react-redux'    ;

import   actions              from 'actions/rules'  ;
import   Popup                from 'controls/popup' ;

class Rules extends React.Component {
  render() {
    let ps = {textIndent: '1.5em'};
    return (
      <Popup role="rules" visible={this.props.rulesVisible} handler={this.props.closeRules} header="Правила">
        <p style={ps}>Цель игры - заполнить все четыре дома картами одной масти, сначала тузы, далее двойки, тройки и так до короля.</p>
        <div className="image"></div>
        <p style={ps}>Карты берутся из колоды или со стола.
        Открытые карты стола Вы можете перемещать по принципу: короля - на пустую стопку, не короля - на карту выше рангом и другого цвета.</p>
        <p style={ps}>Сойдется ли пасьянс? Все как в жизни - зависит от везения и Вашего мастерства...</p>
      </Popup>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    rulesVisible: state.popup.rulesVisible
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    closeRules: bindActionCreators(actions.close, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);