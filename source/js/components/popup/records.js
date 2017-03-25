import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import actions from '../../actions/records';
import Popup from '../../controls/popup';

class Records extends Popup {
  buildTable() {
    var records = this.props.records;
    var result = this.props.result;
    var recordsCount = Math.min(records.length, 5);
    var recordsDisplayed = records.slice(0, recordsCount);
    var emptiesCount = 5 - records.length;

    // Собираем верстку таблицы по кусочкам...
    var layout = {};
    layout.head = [
      <span key="h1" className="number head" >#       </span> ,
      <span key="h2" className="login head"  >игрок   </span> ,
      <span key="h3" className="move head"   >ходы    </span> ,
      <span key="h4" className="time head"   >время   </span> ,
      <br   key="h5"/>
    ];
    layout.records = recordsDisplayed.map(function(r, index) {
      var highlight = this.props.resultIndex === index ? ' your' : '';
      var displayIndex = index + 1;
      return [
        <span key={"r1_"+index} className={"number" + highlight}>{displayIndex} </span>  ,
        <span key={"r2_"+index} className={"login"  + highlight}>{r.nick}       </span>  ,
        <span key={"r3_"+index} className={"move"   + highlight}>{r.moves}      </span>  ,
        <span key={"r4_"+index} className={"time"   + highlight}>{r.time}       </span>  ,
        <br   key={"r5_"+index}/>
      ];
    }.bind(this));
    layout.empties = Array.apply(null, Array(emptiesCount)).map(function(item, index) {
      var displayIndex = index + 1 + recordsCount;
      return [
        <span key={"e1_"+index} className="number">{displayIndex} </span>  ,
        <span key={"e2_"+index} className="login" >{"-"}          </span>  ,
        <span key={"e3_"+index} className="move"  >{"-"}          </span>  ,
        <span key={"e4_"+index} className="time"  >{"-"}          </span>  ,
        <br   key={"e5_"+index}/>
      ];
    }, this);
    layout.fill = [
      <span key="f1" className="fill" style={{lineHeight: '0.1em'}}>...</span>,
      <br   key="f2" />
    ];
    layout.weak = this.props.resultIndex === 5 ? [
      <span key="w1" className="number your">  ?            </span> ,
      <span key="w2" className="login  your">  {this.props.result.nick}  </span> ,
      <span key="w3" className="move   your">  {this.props.result.moves} </span> ,
      <span key="w4" className="time   your">  {this.props.result.time}  </span> ,
      <br   key="w5"/>
    ] : [
      <span key="h1" className="number" >-</span> ,
      <span key="h2" className="login"  >-</span> ,
      <span key="h3" className="move"   >-</span> ,
      <span key="h4" className="time"   >-</span> ,
      <br   key="h5"/>
    ];

    return (
      <div className="recordstable" style={{marginBottom: '0.5em'}}>
        {layout.head}
        {layout.records}
        {layout.empties}
        {layout.fill}
        {layout.weak}
      </div>
    );
  }

  buildStats() {
    var winsPercentage = (this.props.gamesCount === 0) ? 0 : Math.ceil(100 * this.props.winsCount / this.props.gamesCount);
    return (
      <div className="recordstable">
        <span className="key">расклады</span>
        <span className="value">{this.props.gamesCount}</span>
        <br/>
        <span className="key">% побед</span>
        <span className="value">{winsPercentage}%</span>
        <br/>
      </div>
    );
  }

  render() {
    // console.log('рендеринг таблицы рекордов');
    return (
      <Popup role="records" visible={this.props.recordsVisible} handler={this.props.closeRecords}>
        <div style={{position: 'absolute', left: 0, right: 0, color: 'black', backgroundColor: 'yellow', textAlign: 'center', top: '-2.75em'}}>{this.props.result ? 'поздравляем, пасьянс сложился!' : ''}</div>
        <span className="header-top">Рейтинг *</span>
        {this.buildTable()}
        <span className="header-top">Cтатистика</span>
        {this.buildStats()}
        <div className="note">* на данном устройстве</div>
      </Popup>
    );
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    closeRecords: bindActionCreators(actions.close, dispatch)
  }
};

const mapStateToProps = function(state) {
  return {
    recordsVisible : state.popup.recordsVisible,  /** Флаг открытости попапа с рекордами */
    result      : state.game.result,        /** Выигранная только что игра                        */
    resultIndex : state.game.index,         /** Индекс этой игры в таблице рекордов               */
    gamesCount  : state.stats.gamesCount,   /** Общее кол-во сыгранных игр на данном устройстве   */
    records     : state.stats.records,      /** Массив текущих рекордов на данном устройстве      */
    winsCount   : state.stats.winsCount     /** Кол-во побед среди сыгранных на устройстве игр    */
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Records);