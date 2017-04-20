import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../actions/interact';
import boardActions from '../../actions/board';

import interact from 'interact.js';

import { places } from '../../constants/app';

import getFxHighlight from './fx/highlight';

class Card extends React.Component {
  dndEnabled() {
    return !this.props.card.flip;
  }

  componentDidMount() {
    // TODO планируется добавить туда еще одну дропзону (с контекстом stack и флагом для поддержки 2-х interactions)
    let ir = interact(this.refs["card"]);
    ir.styleCursor(false); // Workaround для проблемы https://github.com/taye/interact.js/issues/497
    ir.dropzone({
      accept      : '.card',
      overlap     : 0.1,
      ondragenter : this.onDragEnter.bind(this),
      ondragleave : this.onDragLeave.bind(this),
      ondrop      : this.onDrop.bind(this)
    });
    ir.draggable({
      onmove      : this.onDragMove.bind(this),
      onend       : this.onDragEnd.bind(this),
      enabled     : !this.dndEnabled(),
      manualStart : true
    });
    ir.on('move', function(event) {
      let interaction = event.interaction;
      if (interaction.pointerIsDown && !interaction.interacting() && this.dndEnabled()) {
        let rect = event.currentTarget.getBoundingClientRect();
        this.clone = event.currentTarget.cloneNode(true);
        this.clone.className += " moving";
        this.clone.style.width = rect.right - rect.left + 'px';
        this.clone.style.height = rect.bottom - rect.top + 'px';
        this.clone.style.webkitTransform = this.clone.style.transform = 'translate(' + rect.left + 'px, ' + rect.top + 'px)';
        this.clone.setAttribute('data-x', rect.left);
        this.clone.setAttribute('data-y', rect.top);
        document.body.appendChild(this.clone);
        this.origin = event.currentTarget;
        this.origin.style.display = 'none';
        interaction.start({ name: 'drag' }, event.interactable, this.clone);
      }
    }.bind(this));
    ir.on(['doubletap'], this.handleDoubleClick.bind(this));
    ir.on(['tap'], this.handleSingleClick.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.card.flip !== this.props.card.flip) {
      interact(this.refs["card"]).draggable(this.dndEnabled());
    }
  }

  onDragEnter(event) {
    this.props.dragEnterCard(event.relatedTarget.dataset['id'], this.props.card.id);
  }

  onDragLeave(event) {
    this.props.dragLeaveCard(event.relatedTarget.dataset['id'], this.props.card.id);
  }

  onDrop(event) {
    this.props.cardDropHandler(event.relatedTarget.dataset['id'], this.props.card.place.owner.type, this.props.card.place.owner.index);
  }

  onDragEnd(event) {
    document.body.removeChild(this.clone);
    this.origin.style.display = null;
    this.props.dragEndCard();
  }

  onDragMove(event) {
    var target = event.target;
    // var target = event.currentTarget;
    // keep the dragged position in the data-x/data-y attributes
    var x = (parseFloat(target.getAttribute('data-x')) || 0) + event.dx;
    var y = (parseFloat(target.getAttribute('data-y')) || 0) + event.dy;

    // translate the element
    target.style.webkitTransform = target.style.transform = 'translate(' + x + 'px, ' + y + 'px)';

    // update the posiion attributes
    target.setAttribute('data-x', x);
    target.setAttribute('data-y', y);
  }

  handleSingleClick(event) {
    if (this.props.card.place.owner.type === places.DECK) {
      // console.log('OWNER = DECK, одиночный клик допущен!');
      this.props.singleClickHandler();
    }
    event.preventDefault();
    event.stopPropagation();
  }

  hasChildrenCards() {
    return this.refs['card'].querySelectorAll('.card').length > 0;
  }

  handleDoubleClick(event) {
    if (((this.props.card.place.owner.type === places.OPEN) || (this.props.card.place.owner.type === places.STACK)) && (!this.hasChildrenCards())) {
      // console.log('OWNER = OPEN|STACK, двойной клик допущен!');
      this.props.doubleClickHandler(this.props.card.id);
    }
    event.preventDefault();
    event.stopPropagation();
  }

  render() {
    return (
      <div ref="card" data-id={this.props.card.id} className={"card _"+this.props.card.id + (this.props.card.flip ? ' flipped ' : ' ') + getFxHighlight(this.props.highlights[this.props.card.id])}>
        {this.props.children}
      </div>
    );
  }

}

Card.propTypes = {
  card: React.PropTypes.object.isRequired,
  doubleClickHandler: React.PropTypes.func.isRequired,
  singleClickHandler: React.PropTypes.func.isRequired
};

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.card_highlights
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEndCard     : bindActionCreators(interactActions.dragEndCard, dispatch),
    dragEnterCard   : bindActionCreators(interactActions.dragEnterCard, dispatch),
    dragLeaveCard   : bindActionCreators(interactActions.dragLeaveCard, dispatch),
    cardDropHandler : bindActionCreators(boardActions.cardDrop, dispatch)
  };
};


export default connect(mapStateToProps, mapDispatchToProps)(Card);