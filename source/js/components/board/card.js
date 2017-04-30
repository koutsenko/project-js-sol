import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import { places } from '../../constants/app';
import getFxHighlight from './fx/highlight';

class Card extends React.Component {
  render() {
    return (
      <div ref="card" data-id={this.props.card.id} className={"card _"+this.props.card.id + (this.props.card.flip ? ' flipped ' : ' ') + getFxHighlight(this.props.highlights[this.props.card.id]) + (this.props.darkened ? " darkened" : "")}>
        {this.props.children}
      </div>
    );
  }
}

Card.propTypes = {
  card: React.PropTypes.object.isRequired,
};

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.card_highlights
  };
}

export default connect(mapStateToProps)(Card);