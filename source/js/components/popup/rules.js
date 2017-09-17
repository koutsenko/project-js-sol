import   React                from 'react'          ;
import { bindActionCreators } from 'redux'          ;
import { connect }            from 'react-redux'    ;

import   actions              from 'actions/rules'  ;
import   Popup                from 'controls/popup' ;

class Rules extends React.PureComponent {
  render() {
    let ps = {textIndent: '1.5em'};
    return (         
      <Popup role="rules" visible={this.props.rulesVisible} handler={this.props.closeRules} caption="Об игре">
        <p style={ps}>Клондайк, он же косынка - простой пасьянс родом из 90-х. Был создан для обучения работе с мышью, но стал популярен сам по себе!</p>
        <p style={ps}>Цель - заполнить дома картами одной масти, сначала тузы, далее двойки, тройки и так до королей.</p>
        <div className="image"></div>
        <p style={ps}>Вы берете карты из колоды или со стола. Открытые карты перемещаете: короля - на пустую стопку, не короля - на карту выше рангом и другого цвета.</p>
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