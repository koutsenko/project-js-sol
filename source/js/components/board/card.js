import   React                from 'react'                            ;
import { Motion, spring }     from 'react-motion'                     ;
import { connect }            from 'react-redux'                      ;
import { bindActionCreators } from 'redux'                            ;

import   constantsBoard       from 'constants/board'                  ;
import   boardActions         from 'actions/board'                    ;

function buildClassName(props) {
  let className = props.className;
  if (props.shifted) {
    className += ' moving';
  }
  if (props.flip) {
    className += ' flipped';
  }
  if (props.selected) {
    className += ' selected';
  } else if (props.declined) {
    className += ' declined';
  } else {
    if (props.hovered === constantsBoard.highlights.ACCEPT) {
      className += ' hovered yes';
    } else if (props.hovered === constantsBoard.highlights.DENY) {
      className += ' hovered no';
    }
  }
  
  return className;
}

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
    let options = this.state.debug ? {
      stiffness : 10
    } : {
      damping   : 30,
      precision : 1.0,
      stiffness : 300
    };

    let dx = spring(this.props.x, options);
    let dy = spring(this.props.y, options);

    /**
     * Также выключаем анимацию перемещения если изменились размеры (явно делается ресайз окна)
     */
    if ((this.state.previousW !== this.props.width) || (this.state.previousH !== this.props.height)) {
      dx = this.props.x;
      dy = this.props.y;
    }

    /**
     * Также выключаем анимацию перемещения если идет ручное двигание карты 
     */
    if (this.props.shifted) {
      dx = this.props.x;
      dy = this.props.y;
    }

    let className = buildClassName(this.props);

    return (
      <Motion defaultStyle={{
        dx      : this.state.previousX,
        dy      : this.state.previousY
      }} style={{
        dx      : dx,
        dy      : dy
      }}>
        {
          function(interpolatingStyle) {
            let dx = Math.round(this.state.deltas.x + interpolatingStyle.dx);
            let dy = Math.round(this.state.deltas.y + interpolatingStyle.dy);
            let dr = this.state.deltas.r;

            // Оставили 9 слоев, с запасом - для холдеров и их псевдоэлементов
            let style = {
              zIndex          : this.props.index + 10 + (this.props.shifted ? 100 : 0),
              width           : this.props.width  + 'px',
              height          : this.props.height + 'px',
              webkitTransform : `translate(${dx}px,${dy}px) rotate(${dr}deg)`,
              transform       : `translate(${dx}px,${dy}px) rotate(${dr}deg)`
            };

            return (
              <div 
                className = {className}
                data-id   = {this.props.id}
                style     = {style}
              >
                <div className="face"/>
                <div className="back"/>
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