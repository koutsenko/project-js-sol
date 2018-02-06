import   React                from 'react'            ;
import   PropTypes            from 'prop-types'       ;
import { bindActionCreators } from 'redux'            ;
import { connect }            from 'react-redux'      ;

import   actionsRecords       from 'actions/records'  ;
import   Popup                from 'controls/popup'   ;
import   selectorsGame        from 'selectors/game'   ;

class Records extends React.PureComponent {
  buildTable() {
    const records           = this.props.records;
    const recordsCount      = Math.min(records.length, 5);
    const recordsDisplayed  = records.slice(0, recordsCount);
    const emptiesCount      = 5 - records.length;

    // Собираем верстку таблицы по кусочкам...
    // TODO Жуткие костыли с ключами, временно.
    // TODO Но надо дождаться поддержки <Fragment> в Preact
    const layout = {};
    layout.head = [
      <span key={0} className="number head" >#       </span> ,
      <span key={1} className="login head"  >игрок   </span> ,
      <span key={2} className="move head"   >ходы    </span> ,
      <span key={3} className="time head"   >время   </span> ,
      <br   key={4} />
    ];
    layout.records = recordsDisplayed.map((r, index) => {
      const highlight = this.props.resultIndex === index ? ' your' : '';
      const displayIndex = index + 1;
      return [
        <span key={(index+1)*10+0} className={"number" + highlight}>{displayIndex} </span>  ,
        <span key={(index+1)*10+1} className={"login"  + highlight}>{r.nick}       </span>  ,
        <span key={(index+1)*10+2} className={"move"   + highlight}>{r.moves}      </span>  ,
        <span key={(index+1)*10+3} className={"time"   + highlight}>{r.time}       </span>  ,
        <br   key={(index+1)*10+4} />
      ];
    });
    layout.empties = Array.apply(null, Array(emptiesCount)).map((item, index) => {
      const displayIndex = index + 1 + recordsCount;
      return [
        <span key={(index+1)*100+0} className="number">{displayIndex} </span>  ,
        <span key={(index+1)*100+1} className="login" >{"-"}          </span>  ,
        <span key={(index+1)*100+2} className="move"  >{"-"}          </span>  ,
        <span key={(index+1)*100+3} className="time"  >{"-"}          </span>  ,
        <br   key={(index+1)*100+4} />
      ];
    }, this);
    layout.fill = [
      <span key={1001} className="fill" style={{lineHeight: '0.1em'}}>...</span>,
      <br   key={1002} />
    ];
    layout.weak = this.props.resultIndex === 5 ? [
      <span key={1003} className="number your">  ?            </span> ,
      <span key={1004} className="login  your">  {this.props.result.nick}  </span> ,
      <span key={1005} className="move   your">  {this.props.result.moves} </span> ,
      <span key={1006} className="time   your">  {this.props.result.time}  </span> ,
      <br   key={1007} />
    ] : [
      <span key={1008} className="number" >-</span> ,
      <span key={1009} className="login"  >-</span> ,
      <span key={1010} className="move"   >-</span> ,
      <span key={1011} className="time"   >-</span> ,
      <br   key={1012} />
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
    const winsPercentage = (this.props.gamesCount === 0) ? 0 : Math.ceil(100 * this.props.winsCount / this.props.gamesCount);
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

const mapDispatchToProps = (dispatch) => ({
  closeRecords: bindActionCreators(actionsRecords.close, dispatch)
});

const mapStateToProps = (state) => {
  const game = selectorsGame.getCurrentGame(state.game) || {};

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

Records.propTypes = {
  records         : PropTypes.array,
  resultIndex     : PropTypes.number,
  result          : PropTypes.object,
  gamesCount      : PropTypes.number,
  winsCount       : PropTypes.number,
  recordsVisible  : PropTypes.bool,
  closeRecords    : PropTypes.func,
  recordsCongrats : PropTypes.bool
};

export default connect(mapStateToProps, mapDispatchToProps)(Records);
