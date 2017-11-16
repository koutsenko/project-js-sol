import   React                from 'react'                            ;
import { connect }            from 'react-redux'                      ;
import { bindActionCreators } from 'redux'                            ;

import   selectorsLayout      from 'selectors/layout'                 ;

import   constantsBoard       from 'constants/board'                  ;
import   boardActions         from 'actions/board'                    ;

import   toolsAnim            from 'tools/anim'                       ;

function buildClassName(props, state) {
  let className = props.className;
  if (props.shifted) {
    className += ' moving';
  }
  if (props.flipped) {
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

class Card extends React.PureComponent {
  componentWillReceiveProps(nextProps) {
    if (nextProps.indexInOwner !== this.props.indexInOwner || this.props.ownerId !== nextProps.ownerId) {
      console.log(`изменилось место карты ${this.props.id}: ${this.props.ownerId}:${this.props.indexInOwner} -> ${nextProps.ownerId}:${nextProps.indexInOwner}`);
    }
    let positionChanged = (nextProps.indexInOwner !== this.props.indexInOwner) || (nextProps.ownerId !== this.props.ownerId);
    if (this.state.positionChanged !== positionChanged) {
      this.setState({
        positionChanged: positionChanged
      });
    }
  }
  animationCallback(event) {
    console.log(`${this.props.id}: animationCallback called, marking position as unchaged`);

    this.setState({
      positionChanged: false
    });
  }

  render() {
    let className = buildClassName(this.props, this.state);

    let eventName = toolsAnim.getTransitionEvent();
    let eventProp = 'on' + eventName[0].toUpperCase() + eventName.substr(1);

    return (
      <div {...{
        [eventProp]: this.animationCallback.bind(this)
      }}
        className = {className}
        data-id   = {this.props.id}
        style     = {this.props.cardStyle(this.state)}
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
  flipped       : React.PropTypes.bool.isRequired,
  selected      : React.PropTypes.bool.isRequired,
  hovered       : React.PropTypes.string.isRequired,
  ownerId       : React.PropTypes.string.isRequired,
  indexInOwner  : React.PropTypes.number.isRequired,
  shifted       : React.PropTypes.array
};

const mapStateToProps = function(state, ownProps) {
  return {
    cardStyle : function(componentState) {
      return selectorsLayout.cardStyle(
        ownProps.id,
        state.turn,
        state.fx.layout,
        ownProps.shifted,
        ownProps.deltas,
        componentState.positionChanged
      );
    }
  };
};

export default connect(mapStateToProps)(Card);
