import React from 'react';
import app from '../../app';

export default class Records extends React.Component {
  buildTable() {
      // // временно? проверка валидности данных.
      // if ((move === undefined) || (time === undefined)) {
      //   name = 'Гость';
      //   time = '99:99';
      //   move = '500';
      //   app.data.records[i] = 'Гость,500,99:99';
      // }

    var recordsCount = Math.min(app.data.records.length, 5);
    var recordsDisplayed = app.data.records.slice(0, recordsCount-1);

    var emptiesCount = 5 - app.data.records.length;

    return (
      <span>
        <span className="number head">#</span>
        <span className="login head">игрок</span>
        <span className="move head">ходы</span>
        <span className="time head">время</span>
        <br/>
        {recordsDisplayed.map(function(record, index) {
          var highlight = (app.data.currentRecord === index) ? ' your' : ''; // надо ли подсветить запись как текущий рекорд?
          return (
            <span>
              <span className={"number" + highlight}>{index + 1}</span>
              <span className={"login" + highlight}>{record.split(',')[0]}</span>
              <span className={"move" + highlight}>{record.split(',')[1]}</span>
              <span className={"time" + highlight}>{record.split(',')[2]}</span>
              <br/>
            </span>
          );
        })}
        {app.data.currentRecord = undefined}
        {Array.apply(null, Array(emptiesCount)).map(function(item, i){                                        
          return (
            <span>
              <span className="number">{i + 1 + app.data.records.length}</span>
              <span className="login">-</span>
              <span className="move">-</span>
              <span className="time">-</span>
              <br/>
            </span>
          );                
        }, this)}
        <span className="fill">...</span>
        <br/>
        {app.data.records[5] && (
          <span>
            <span className="number your">?</span>
            <span className="login your">{app.data.records[5].split(',')[0]}</span>
            <span className="move your">{app.data.records[5].split(',')[1]}</span>
            <span className="time your">{app.data.records[5].split(',')[2]}</span>
            <br/>
          </span>
        )}
      </span>
    );
  }

  render() {
    // document.cookie = "record_diman=198,00:45; path=/; expires=" + (new Date((new Date).getTime() + 31536E6)).toUTCString();
    return (
      <div className="records">
        <span className="header-top">Рейтинг *</span><div className="recordstable">{this.buildTable()}</div>
          <span className="header-top">Cтатистика</span><div className="recordstable">
          <span className="key">расклады</span><span className="value">{app.data.games}</span><span className="dummy">&nbsp;</span><br/>
          <span className="key">% побед</span><span className="value">{(app.data.games === 0 ? 0 : Math.ceil(100 * app.data.wins / app.data.games))}%</span><span className="dummy">&nbsp;</span><br/></div>
        <div className="close">&times;</div><div className="note">* на данном устройстве</div>
        <div className="recordsmask"></div>
        <div className="prompt"><span>Новый рекорд!</span><br/><input type="text" value="игрок"/><br/><div className="submit">Записать</div></div>
      </div>
    );
  }
}