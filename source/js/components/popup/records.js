import   React                from 'react'            ;
import { bindActionCreators } from 'redux'            ;
import { connect }            from 'react-redux'      ;

import   actionsRecords       from 'actions/records'  ;
import   Popup                from 'controls/popup'   ;
import   gameSelectors        from 'selectors/game'   ;

class Records extends React.PureComponent {
  buildTable() {
    var records           = this.props.records;
    var result            = this.props.result;
    var recordsCount      = Math.min(records.length, 5);
    var recordsDisplayed  = records.slice(0, recordsCount);
    var emptiesCount      = 5 - records.length;

    // Собираем верстку таблицы по кусочкам...
    var layout = {};
    layout.head = [
      <span className="number head" >#       </span> ,
      <span className="login head"  >игрок   </span> ,
      <span className="move head"   >ходы    </span> ,
      <span className="time head"   >время   </span> ,
      <br   />
    ];
    layout.records = recordsDisplayed.map(function(r, index) {
      var highlight = this.props.resultIndex === index ? ' your' : '';
      var displayIndex = index + 1;
      return [
        <span className={"number" + highlight}>{displayIndex} </span>  ,
        <span className={"login"  + highlight}>{r.nick}       </span>  ,
        <span className={"move"   + highlight}>{r.moves}      </span>  ,
        <span className={"time"   + highlight}>{r.time}       </span>  ,
        <br   />
      ];
    }.bind(this));
    layout.empties = Array.apply(null, Array(emptiesCount)).map(function(item, index) {
      var displayIndex = index + 1 + recordsCount;
      return [
        <span className="number">{displayIndex} </span>  ,
        <span className="login" >{"-"}          </span>  ,
        <span className="move"  >{"-"}          </span>  ,
        <span className="time"  >{"-"}          </span>  ,
        <br   />
      ];
    }, this);
    layout.fill = [
      <span className="fill" style={{lineHeight: '0.1em'}}>...</span>,
      <br   />
    ];
    layout.weak = this.props.resultIndex === 5 ? [
      <span className="number your">  ?            </span> ,
      <span className="login  your">  {this.props.result.nick}  </span> ,
      <span className="move   your">  {this.props.result.moves} </span> ,
      <span className="time   your">  {this.props.result.time}  </span> ,
      <br   />
    ] : [
      <span className="number" >-</span> ,
      <span className="login"  >-</span> ,
      <span className="move"   >-</span> ,
      <span className="time"   >-</span> ,
      <br   />
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
    return (
      <Popup role="records" visible={this.props.recordsVisible} handler={this.props.closeRecords} caption="Рекорды *">
        <div style={{position: 'absolute', left: 0, right: 0, color: 'black', backgroundColor: 'yellow', textAlign: 'center', top: '-2.75em'}}>{this.props.recordsCongrats ? 'поздравляем, пасьянс сложился!' : ''}</div>
        {this.buildTable()}
        <hr/>
        {this.buildStats()}
        <hr/>
        <div className="note">* на данном устройстве</div>
      </Popup>
    );
  }
}

const mapDispatchToProps = function(dispatch) {
  return {
    closeRecords: bindActionCreators(actionsRecords.close, dispatch)
  }
};

const mapStateToProps = function(state) {
  let game = gameSelectors.getCurrentGame(state) || {};

  return {
    recordsCongrats : state.popup.recordsCongrats ,
    recordsVisible  : state.popup.recordsVisible  , /** Флаг открытости попапа с рекордами                */
    result          : game.result                 , /** Текущая или последняя игра                        */
    resultIndex     : game.index                  , /** Индекс этой игры в таблице рекордов               */
    gamesCount      : state.stats.gamesCount      , /** Общее кол-во сыгранных игр на данном устройстве   */
    records         : state.stats.records         , /** Массив текущих рекордов на данном устройстве      */
    winsCount       : state.stats.winsCount         /** Кол-во побед среди сыгранных на устройстве игр    */
  };
}

export default connect(mapStateToProps, mapDispatchToProps)(Records);