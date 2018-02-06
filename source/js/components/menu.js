import   React            from  'react'                    ;
import   PropTypes        from  'prop-types'               ;
import { connect }        from  'react-redux'              ;
import   selectorsLayout  from  'selectors/layout'         ;
import   ButtonAuto       from  'components/menu/auto'     ;
import   ButtonDeal       from  'components/menu/deal'     ;
import   ButtonOptions    from  'components/menu/options'  ;
import   ButtonRecords    from  'components/menu/records'  ;
import   ButtonRules      from  'components/menu/rules'    ;
import   ButtonUndo       from  'components/menu/undo'     ;

class Menu extends React.PureComponent {
  render() {
    // FIXME придумать другое решение о расчете размеров кнопки исходя из их кол-ва
    const length = 6;

    return (
      <div id="mxwsol-menu" style={this.props.style}>
        <ButtonDeal     btnCount={length} btnIndex={0} />
        <ButtonUndo     btnCount={length} btnIndex={1} />
        <ButtonAuto     btnCount={length} btnIndex={2} />
        <ButtonRecords  btnCount={length} btnIndex={3} />
        <ButtonOptions  btnCount={length} btnIndex={4} />
        <ButtonRules    btnCount={length} btnIndex={5} />
      </div>
    );
  }
}

const mapStateToProps = (state) => ({
  style  : selectorsLayout.menuStyle(6, state.fx.layout),
  layout : state.fx.layout
});

Menu.propTypes = {
  style: PropTypes.object
};

export default connect(mapStateToProps)(Menu);
