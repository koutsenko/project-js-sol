import React from 'react';

import ButtonNewGame      from './menu/newgame';
import ButtonUndoMove     from './menu/undomove';
import ButtonAutoComplete from './menu/autocomplete';
import ButtonGameRules    from './menu/gamerules';
import ButtonGameRecords  from './menu/gamerecords';

export default class Menu extends React.Component {
  render() {
    return (
      <div className="menu">
        <div className="buttons">
          <ButtonNewGame />
          <span>&nbsp;</span>
          <ButtonUndoMove />
          <span>&nbsp;</span>
          <ButtonAutoComplete />
          <span>&nbsp;</span>
          <ButtonGameRules />
          <span>&nbsp;</span>
          <ButtonGameRecords />
          <span>&nbsp;</span>
        </div>
      </div>
    );
  }
}