import React from 'react';

class Card extends React.Component {
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
      <div className={"card "+this.props.card.suit+this.props.card.rank + (this.props.card.flip ? ' flipped' : ' ')}>
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
      </div>
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object.isRequired
};

export default Card;
