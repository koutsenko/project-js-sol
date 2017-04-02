import React from 'react';

import ButtonDeal     from './menu/deal'    ;
import ButtonUndo     from './menu/undo'    ;
import ButtonAuto     from './menu/auto'    ;
import ButtonRules    from './menu/rules'   ;
import ButtonRecords  from './menu/records' ;

export default class Menu extends React.Component {
  render() {
    return (
      <div id="menu">
        <ButtonDeal     />
        <ButtonUndo     />
        <ButtonAuto     />
        <ButtonRules    />
        <ButtonRecords  />
      </div>
    );
  }
}