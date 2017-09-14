import   React                from 'react'                  ;
import { bindActionCreators } from 'redux'                  ;
import { connect }            from 'react-redux'            ;

import   actions              from 'actions/options'        ;

import   MenuButton           from 'controls/menu/button'   ;
  
class ButtonOptions extends React.PureComponent {
  render() {
    return (
      <MenuButton
        disabled={false}
        hint="Настройки правил, управления и анимаций"
        role="btn5"
        text="Настройки"
        handler={this.props.openOptions}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    openOptions: bindActionCreators(actions.open, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonOptions);