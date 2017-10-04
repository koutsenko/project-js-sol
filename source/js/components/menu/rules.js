import   React                from 'react'                  ;
import { bindActionCreators } from 'redux'                  ;
import { connect }            from 'react-redux'            ;

import   actions              from 'actions/rules'          ;

import   MenuButton           from 'controls/menu/button'   ;
  
class ButtonRules extends React.PureComponent {
  render() {
    return (
      <MenuButton
        btnIndex={this.props.btnIndex}
        btnCount={this.props.btnCount}
        disabled={false}
        hint="Как играть в пасьянс-косынку"
        role="btn6"
        text="Об игре"
        handler={this.props.openRules}
      />
    );
  }
}

const mapStateToProps = function(state) {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    openRules: bindActionCreators(actions.open, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRules);