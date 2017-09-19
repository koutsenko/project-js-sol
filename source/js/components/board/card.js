import   React                from 'react'                            ;
import { connect }            from 'react-redux'                      ;
import { bindActionCreators } from 'redux'                            ;

import   constantsBoard       from 'constants/board'                  ;
import   boardActions         from 'actions/board'                    ;

import   toolsAnim            from 'tools/anim'                       ;

/**
 * Определяем необходимость анимации перемещения
 */
function needMoveAnimation(props, state) {
  let result = true;

  if (props.shifted) {
    result = false;
  } else if ((state.previousW !== props.width) || (state.previousH !== props.height)) {
    result = false;
  } else if ((state.previousX === props.x) && (state.previousY === props.y)) {
    result = false;
  }

  return result;
}

function buildClassName(props, state) {
  let className = props.className;
  if (props.shifted) {
    className += ' moving';
  }
  if (props.flip) {
    className += ' flipped';
  }
  if (needMoveAnimation(props, state)) {
    className += ' animated';
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
    this.state = {
      deltas    : this.state.deltas === undefined ? generateDeltas(props.width) : (this.state.deltas.e ? generateDeltas(nextProps.width) : scaleDeltas(this.state.deltas, props.width, nextProps.width)),
      previousX : props.x,
      previousY : props.y,
      previousF : props.flip,
      previousW : props.width,
      previousH : props.height
    };
  }

  constructor(props) {
    super(props);
    this.event = toolsAnim.getTransitionEvent();
    this.updateState(props); 
  }

  componentWillReceiveProps(nextProps) {
    this.updateState(this.props, nextProps);
  }

  getElementRef(element) {
    this.cardRef = element;
  }
  
  render() {
    let className = buildClassName(this.props, this.state);
    
    let dx = Math.round(this.state.deltas.x + this.props.x);
    let dy = Math.round(this.state.deltas.y + this.props.y);
    let dr = this.state.deltas.r;
    // Оставили 9 слоев, с запасом - для холдеров и их псевдоэлементов
    let style = {
      zIndex          : this.props.index + 10 + (this.props.shifted ? 100 : 0),
      width           : this.props.width  + 'px',
      height          : this.props.height + 'px'
    };
    style.webkitTransform = style.transform = `translate(${dx}px,${dy}px) rotate(${dr}deg)`;
    this.cardRef && this.cardRef.addEventListener(toolsAnim.getTransitionEvent(), function(event) {
      this.cardRef.classList.remove('animated');
    }.bind(this));

    return (
      <div ref={this.getElementRef.bind(this)}
        className = {className}
        data-id   = {this.props.id}
        style     = {style}
      >
        <div className="face"/>
        <div className="back"/>
      </div>
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