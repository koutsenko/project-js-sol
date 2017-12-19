import   React                from 'react'                  ;
import   PropTypes            from 'prop-types'             ;
import { bindActionCreators } from 'redux'                  ;
import { connect }            from 'react-redux'            ;

import   actions              from 'actions/rules'          ;

import   MenuButton           from 'controls/menu/button'   ;

class ButtonRules extends React.PureComponent {
  render() {
    // TODO В этих и других кнопках, может проще прокинуть ...props напрямую? Можно будет не писать проптайпс. Но повысятся системные требования =(
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

const mapStateToProps = function() {
  return {};
};

const mapDispatchToProps = function(dispatch) {
  return {
    openRules: bindActionCreators(actions.open, dispatch)
  };
};

ButtonRules.propTypes = {
  btnIndex: PropTypes.number,
  btnCount: PropTypes.number,
  openRules: PropTypes.func,
  disabled: PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(ButtonRules);
