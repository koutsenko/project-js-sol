import   React            from 'react'                    ;
import { connect }        from 'react-redux'              ;

import   selectorsLayout  from 'selectors/layout'         ;

import   ButtonDeal       from 'components/menu/deal'     ;
import   ButtonUndo       from 'components/menu/undo'     ;
import   ButtonAuto       from 'components/menu/auto'     ;
import   ButtonRules      from 'components/menu/rules'    ;
import   ButtonRecords    from 'components/menu/records'  ;
import   ButtonOptions    from 'components/menu/options'  ;

class Menu extends React.PureComponent {
  render() {
    // FIXME придумать другое решение о расчете размеров кнопки исходя из их кол-ва
    let length = 6;
    let buttons = [
      <ButtonDeal     btnCount={length} btnIndex={0} />,
      <ButtonUndo     btnCount={length} btnIndex={1} />,
      <ButtonAuto     btnCount={length} btnIndex={2} />,
      <ButtonRecords  btnCount={length} btnIndex={3} />,
      <ButtonOptions  btnCount={length} btnIndex={4} />,
      <ButtonRules    btnCount={length} btnIndex={5} />
    ];

    return (
      <div id="mxwsol-menu" style={this.props.style}>
        {buttons}
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    style  : selectorsLayout.menuStyle(6, state.fx.layout),
    layout : state.fx.layout
  };
}

export default connect(mapStateToProps)(Menu);
