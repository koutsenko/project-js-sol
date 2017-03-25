import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../actions/interact';
import Highlight from './fx/highlight';

import { places } from '../../constants/app';

import interact from 'interact.js';

class Home extends React.Component {
  onDragEnter(event) {
    this.props.dragEnterHome(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDragLeave(event) {
    this.props.dragLeaveHome(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDrop(event) {
    this.props.cardDropHandler(event.relatedTarget.dataset['id'], places.HOME, this.props.index);
  }

  componentDidMount() {
    interact(this.refs["home"]).dropzone({
      accept: '.card',
      overlap: 0.1,
      ondragenter       : this.onDragEnter.bind(this),
      ondragleave       : this.onDragLeave.bind(this),
      ondrop            : this.onDrop.bind(this)

    });
  }

  render() {
    return (
      <div ref="home" className={"home" + this.props.index + " holder"}>
        <div className="face">Т</div>
        <Highlight value={this.props.highlights[this.props.index]} />
        {this.props.children}
      </div>
    );
  }
}

Home.propTypes = {
  cardDropHandler: React.PropTypes.func.isRequired
};

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.home_highlights
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEnterHome : bindActionCreators(interactActions.dragEnterHome, dispatch),
    dragLeaveHome : bindActionCreators(interactActions.dragLeaveHome, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);