import React          from 'react'                    ;

import ButtonDeal     from 'components/menu/deal'     ;
import ButtonUndo     from 'components/menu/undo'     ;
import ButtonAuto     from 'components/menu/auto'     ;
import ButtonRules    from 'components/menu/rules'    ;
import ButtonRecords  from 'components/menu/records'  ;
import ButtonOptions  from 'components/menu/options'  ;

export default class Menu extends React.Component {
  render() {
    return (
      <div id="menu">
        <ButtonDeal     />
        <ButtonUndo     />
        <ButtonAuto     />
        <ButtonRules    />
        <ButtonRecords  />
        <ButtonOptions  />
      </div>
    );
  }
}