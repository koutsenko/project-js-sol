import React      from 'react';
import app        from '../../app';

import GameTable  from './gametable';
import Menu       from './menu';
import Records    from './records';
import Rules      from './rules';
import Version    from './version';
import Watermark  from './watermark';

export default class App extends React.Component {
  render() {
    return (
      <div className="game">
        <Version />
        <Watermark />
        <Menu />
        <GameTable />
        <Records />
        <Rules />
        <div className="mark"></div>
        <div className="mask"></div>
      </div>
    );
  }
};