import   React                from 'react'            ;
import { Motion, spring }     from 'react-motion'     ;
import { connect }            from 'react-redux'      ;
import { bindActionCreators } from 'redux'            ;

import   constantsBoard       from 'constants/board'  ;
import   boardActions         from 'actions/board'    ;

function randomize(dispersion) {
  return Math.round((Math.random()-0.5) * dispersion);
};

function scaleDeltas(deltas, oldWidth, newWidth) {
  return {
    x: deltas.x / oldWidth * newWidth,
    y: deltas.y / oldWidth * newWidth,
    r: deltas.r
  };
};

function generateDeltas(width) {
  return {
    e: width === 0,
    x: randomize(width/15),
    y: randomize(width/15),
    r: randomize(5),
  };
};

class Card extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      debug     : false,
      deltas    : generateDeltas(this.props.width),
      previousX : this.props.x,
      previousY : this.props.y,
      previousF : this.props.flip
    };
    this.timeout = null;
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      deltas    : this.state.deltas.e ? generateDeltas(nextProps.width) : scaleDeltas(this.state.deltas, this.props.width, nextProps.width),
      previousX : this.props.x,
      previousY : this.props.y,
      previousF : this.props.flip
    });
    clearTimeout(this.timeout);
    if (nextProps.highlight === constantsBoard.highlights.DENY) {
      setTimeout(function() {
        this.props.flushWrongHighlight()
      }.bind(this), 500);
    }
  }

  render() {
    let rFace = -180*(+!this.props.flip);
    let rBack = 180*(+this.props.flip);

    let options = this.state.debug ? {
      stiffness : 10
    } : {
      damping   : 30,
      precision : 1.0,
      stiffness : 300
    };

    return (
      <Motion defaultStyle={{
        dx      : this.state.previousX,
        dy      : this.state.previousY,
        do      : +!this.props.highlight,
        drFace  : this.state.previousF ? rFace : rBack,
        drBack  : this.state.previousF ? rBack : rFace
      }} style={{
        dx      : spring(this.props.x, options),
        dy      : spring(this.props.y, options),
        do      : spring(+!!this.props.highlight, options),
        drFace  : spring(rFace, options),
        drBack  : spring(rBack, options),
      }}>
        {
          function(interpolatingStyle) {
            let dx = Math.round(this.state.deltas.x + interpolatingStyle.dx);
            let dy = Math.round(this.state.deltas.y + interpolatingStyle.dy);
            let dr = this.state.deltas.r;

            let highlight = {
              [constantsBoard.highlights.ACCEPT]   : `0 0 0.1em 0.3em rgba(32,  255, 0, ${interpolatingStyle.do})`,
              [constantsBoard.highlights.DENY]     : `0 0 0.1em 0.3em rgba(255, 0,   0, ${interpolatingStyle.do})`,
            }[this.props.highlight];

            let style = {
              boxShadow       : highlight,
              zIndex          : this.props.index,
              width           : this.props.width  + 'px',
              height          : this.props.height + 'px',
              transform       : `translate(${dx}px,${dy}px) rotate(${dr}deg)`,
            };

            return (
              <div data-id={this.props.id} className="card" style={style}>
                <div className="face" style={{transform: `rotateY(${interpolatingStyle.drFace}deg)`}}/>
                <div className="back" style={{transform: `rotateY(${interpolatingStyle.drBack}deg)`}}/>
              </div>
            );
          }.bind(this)
        }
      </Motion>
    );
  }
}

Card.propTypes = {
  card          : React.PropTypes.object.isRequired,
  id            : React.PropTypes.string.isRequired,
  index         : React.PropTypes.number,
  flip          : React.PropTypes.bool.isRequired,
  isStack       : React.PropTypes.bool,
  parentElement : React.PropTypes.object
};

const mapStateToProps = function(state, ownProps) {
  let highlight = state.board.selected[ownProps.id];
  let height    = 0;
  let width     = 0;
  let x         = 0;
  let y         = 0;

  if ((ownProps.parentElement !== null ) && (ownProps.parentElement !== undefined)) {
    let rect  = ownProps.parentElement.getBoundingClientRect();
    height    = Math.round(rect.bottom - rect.top);
    width     = Math.round(rect.right - rect.left);
    x         = Math.round(rect.left);
    y         = Math.round(rect.top + (ownProps.isStack ? ((height/(ownProps.mini ? 3 : 5)) * (ownProps.index)) : 0));
  }
  
  return { x, y, height, width, highlight };
};

const mapDispatchToProps = function(dispatch) {
  return {
    flushWrongHighlight: bindActionCreators(boardActions.flushWrongHighlight, dispatch)
  }
}

export default connect(mapStateToProps, mapDispatchToProps)(Card);