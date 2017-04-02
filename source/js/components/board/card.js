import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../actions/interact';

import interact from 'interact.js';

class Card extends React.Component {
  componentDidMount() {
    interact(this.refs["card"]).draggable({
      onmove      : this.onDragMove.bind(this),
      onend       : this.onDragEnd.bind(this),
      enabled     : !this.props.card.flip,
      manualStart : true
    }).on('move', function(event) {
      let interaction = event.interaction;
      if (interaction.pointerIsDown && !interaction.interacting()) {
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
        this.origin.style.visibility = 'hidden';
        interaction.start({ name: 'drag' }, event.interactable, this.clone);
      } else {
        interaction.start({ name: 'drag' }, event.interactable, event.currentTarget);
      }
    }.bind(this));
  }

  componentDidUpdate(prevProps) {
    if (prevProps.card.flip !== this.props.card.flip) {
      interact(this.refs["card"]).draggable(!this.props.card.flip);
    }
  }

  onDragEnd(event) {
    document.body.removeChild(this.clone);
    this.origin.style.visibility = 'visible';
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

  render() {
    var rank = {
      'A': 'Т',
      'K': 'К',
      'Q': 'Д',
      'J': 'В',
      '=': '=',
      '9': '9',
      '8': '8',
      '7': '7',
      '6': '6',
      '5': '5',
      '4': '4',
      '3': '3',
      '2': '2'
    }[this.props.card.rank];

    var suit = {
        'H': '\u2665',
        'S': '\u2660',
        'C': '\u2663',
        'D': '\u2666'
    }[this.props.card.suit];

    var isFace = !!(['K', 'Q', 'J'].indexOf(this.props.card.suit) + 1);
    var center = {
      '2': suit + '\n\n' + suit,
      '3': suit + '\n\n' + suit + '\n\n' + suit,
      '4': suit + ' ' + suit + '\n\n' + suit + ' ' + suit,
      '5': suit + ' ' + suit + '\n ' + suit + ' \n' + suit + ' ' + suit,
      '6': suit + ' ' + suit + '\n\n' + suit + ' ' + suit + '\n\n' + suit + ' ' + suit,
      '7': suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit,
      '8': suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit,
      '9': suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit + '\n' + suit + '\n' + suit + ' ' + suit,
      '=': [
        <span key={"1"} style={{float: 'right'}}>{suit}</span>,
        <span key={"2"}>{'\n'}{suit}{'\n'}{suit} {suit}{'\n'}{suit}{'\n'}{suit} {suit}{'\n'}{suit}{'\n'}{suit} {suit}</span>,
      ],
      'A': (
        <span style={{fontSize: '3em'}}>{suit}</span>
      )
    }[this.props.card.rank];


    return (
      <div ref="card" data-id={this.props.card.id} className={"card "+this.props.card.id + (this.props.card.flip ? ' flipped' : ' ')}>
        <div className="back">
        </div>
        <div className="face">
          <span className="corner">
            {rank}{suit}<br/>{suit}
          </span>
          {!isFace && (
            <span className="center">
              {center}
            </span>
          )}
        </div>
        {this.props.children}
        {([null, undefined].indexOf(this.props.accepts.card[this.props.card.id]) === -1) ? (
          <div className="mark" style={{backgroundColor: this.props.accepts.card[this.props.card.id] ? 'lime' : 'red'}}></div>
        ) : null}
      </div>
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object.isRequired
};

const mapStateToProps = function(state) {
  return state;
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEndCard   : bindActionCreators(interactActions.dragEndCard, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Card);