import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../../actions/interact';
import { places } from '../../../constants/app';

import interact from 'interact.js';

import getFxHighlight from '../fx/highlight';

class Stack extends React.Component {
  onDragEnter(event) {
    this.props.dragEnterStack(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDragLeave(event) {
    this.props.dragLeaveStack(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDrop(event) {
    this.props.cardDropHandler(event.relatedTarget.dataset['id'], places.STACK, this.props.index);
  }

  componentDidMount() {
    interact(this.refs["stack"]).dropzone({
      accept: '.card',
      overlap: 0.1,
      ondragenter       : this.onDragEnter.bind(this),
      ondragleave       : this.onDragLeave.bind(this),
      ondrop            : this.onDrop.bind(this)
    });
  }
  render() {
    return (
      <div ref="stack" className={"stack" + this.props.index + " holder " + getFxHighlight(this.props.highlights[this.props.index])}>
        {this.props.children}
      </div>
    );
  }
}

Stack.propTypes = {
  index: React.PropTypes.number.isRequired,
  cardDropHandler: React.PropTypes.func.isRequired
};

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.stack_highlights
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEnterStack : bindActionCreators(interactActions.dragEnterStack, dispatch),
    dragLeaveStack : bindActionCreators(interactActions.dragLeaveStack, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stack);