import   React                from 'react'                            ;
import { Motion, spring }     from 'react-motion'                     ;
import { connect }            from 'react-redux'                      ;
import { bindActionCreators } from 'redux'                            ;

import   constantsBoard       from 'constants/board'                  ;
import   boardActions         from 'actions/board'                    ;

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

class Card extends React.PureComponent {
  updateState(props, nextProps) {
    this.setState({
      deltas    : this.state.deltas === undefined ? generateDeltas(props.width) : (this.state.deltas.e ? generateDeltas(nextProps.width) : scaleDeltas(this.state.deltas, props.width, nextProps.width)),
      previousX : props.x,
      previousY : props.y,
      previousF : props.flip,
      previousW : props.width,
      previousH : props.height
    });
  }

  constructor(props) {
    super(props);
    this.updateState(props); 
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(this.props, nextProps);
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

    /**
     * N.B. spring ведет себя странно если совпадают начальная и конечные координаты.
     * Поэтому в таком случае недопускаем spring данного параметра в верстку вообще.
     */
    let dx = (this.props.x === this.state.previousX) ? this.props.x : spring(this.props.x, options);
    let dy = (this.props.y === this.state.previousY) ? this.props.y : spring(this.props.y, options);

    /**
     * Также выключаем анимацию перемещения если изменились размеры (явно делается ресайз окна)
     */
    if ((this.state.previousW !== this.props.width) || (this.state.previousH !== this.props.height)) {
      dx = this.props.x;
      dy = this.props.y;
    }

    /**
     * Также выключаем анимацию если идет ручное двигание карты 
     */
    if (this.props.shifted) {
      dx = this.props.x;
      dy = this.props.y;
    }

    return (
      <Motion defaultStyle={{
        dColor  : +!this.props.declined,
        dx      : this.state.previousX,
        dy      : this.state.previousY,
        do      : +!this.props.selected,
        drFace  : this.state.previousF ? rFace : rBack,
        drBack  : this.state.previousF ? rBack : rFace
      }} style={{
        dColor  : spring(+!this.props.declined),
        dx      : dx,
        dy      : dy,
        do      : spring(+!!this.props.selected, options),
        drFace  : spring(rFace, options),
        drBack  : spring(rBack, options),
      }}>
        {
          function(interpolatingStyle) {
            let dx = Math.round(this.state.deltas.x + interpolatingStyle.dx);
            let dy = Math.round(this.state.deltas.y + interpolatingStyle.dy);
            let dr = this.state.deltas.r;

            let select = `0 0 0.1em 0.3em rgba(32,  255, 0, ${interpolatingStyle.do})`;
            let decline = `0 0 0.1em 0.3em rgba(255, 0, 0, ${interpolatingStyle.dColor})`;

            // Оставили 9 слоев, с запасом - для холдеров и их псевдоэлементов
            let style = {
              boxShadow       : this.props.declined ? decline : (this.props.selected ? select : null),
              zIndex          : this.props.index + 10 + (this.props.shifted ? 100 : 0),
              width           : this.props.width  + 'px',
              height          : this.props.height + 'px',
              webkitTransform : `translate(${dx}px,${dy}px) rotate(${dr}deg)`,
              transform       : `translate(${dx}px,${dy}px) rotate(${dr}deg)`
            };

            let className = this.props.className;
            if (this.props.shifted) {
              className += ' moving';
            }
            if (this.props.hovered === constantsBoard.highlights.ACCEPT) {
              className += ' hovered yes';
            } else if (this.props.hovered === constantsBoard.highlights.DENY) {
              className += ' hovered no';
            }

            return (
              <div 
                className = {className}
                data-id   = {this.props.id}
                style     = {style}
              >
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
  declined      : React.PropTypes.bool.isRequired,
  className     : React.PropTypes.string.isRequired,
  id            : React.PropTypes.string.isRequired,
  index         : React.PropTypes.number,
  flip          : React.PropTypes.bool.isRequired,
  selected      : React.PropTypes.bool.isRequired,
  hovered       : React.PropTypes.string.isRequired,
  width         : React.PropTypes.number.isRequired,
  height        : React.PropTypes.number.isRequired,
  x             : React.PropTypes.number.isRequired,
  y             : React.PropTypes.number.isRequired
};

export default Card;