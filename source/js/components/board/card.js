import   React                from 'react'                            ;
import   PropTypes            from 'prop-types'                       ;
import { connect }            from 'react-redux'                      ;

import   selectorsLayout      from 'selectors/layout'                 ;

import   constantsBoard       from 'constants/board'                  ;

import   toolsAnim            from 'tools/anim'                       ;

const buildClassName = (props) => {
  let className = props.className;
  if (props.shifted) {
    className += ' moving';
  }
  if (props.flips.indexOf(props.id)+1) {
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
  constructor(props) {
    super(props);

    this.animationCallback = this.animationCallback.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.indexInOwner !== this.props.indexInOwner || this.props.ownerId !== nextProps.ownerId) {
      console.log(`изменилось место карты ${this.props.id}: ${this.props.ownerId}:${this.props.indexInOwner} -> ${nextProps.ownerId}:${nextProps.indexInOwner}`);
    }
    const positionChanged = (nextProps.indexInOwner !== this.props.indexInOwner) || (nextProps.ownerId !== this.props.ownerId);
    if (this.state.positionChanged !== positionChanged) {
      this.setState({
        positionChanged: positionChanged
      });
    }
  }
  animationCallback() {
    console.log(`${this.props.id}: animationCallback called, marking position as unchaged`);

    this.setState({
      positionChanged: false
    });
  }

  render() {
    const className = buildClassName(this.props, this.state);

    const eventName = toolsAnim.getTransitionEvent();
    const eventProp = 'on' + eventName[0].toUpperCase() + eventName.substr(1);

    return (
      <div {...{
        [eventProp]: this.animationCallback
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

const mapStateToProps = (state, ownProps) => ({
  cardStyle: (componentState) => selectorsLayout.cardStyle(
    ownProps.id,
    ownProps.flips,
    ownProps.ownerId,
    ownProps.indexInOwner,
    state.fx.layout,
    ownProps.shifted,
    ownProps.deltas,
    componentState.positionChanged
  )
});

Card.propTypes = {
  declined      : PropTypes.bool.isRequired,
  className     : PropTypes.string.isRequired,
  id            : PropTypes.string.isRequired,
  flips         : PropTypes.array.isRequired,  // массив id открытых карт под текущей включительно.
  selected      : PropTypes.bool.isRequired,
  hovered       : PropTypes.string.isRequired,
  ownerId       : PropTypes.string.isRequired,
  indexInOwner  : PropTypes.number.isRequired,
  shifted       : PropTypes.array,
  cardStyle     : PropTypes.func // перепутал с object, придумать правило именования булек, функций, объектов, строк, чисел
};

export default connect(mapStateToProps)(Card);
