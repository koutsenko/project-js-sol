import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../actions/interact';

import interact from 'interact.js';

class Stack extends React.Component {
  onDragEnter(event) {
    this.props.dragEnterStack(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDragLeave(event) {
    this.props.dragLeaveStack(event.relatedTarget.dataset['id'], this.props.index);
  }

  componentDidMount() {
    interact(this.refs["stack"]).dropzone({
      accept: '.card',
      overlap: 0.1,
      ondragenter       : this.onDragEnter.bind(this),
      ondragleave       : this.onDragLeave.bind(this)
    });
  }
  render() {
    var mark = this.props.accepts.stack[this.props.index] !== null ? (
      <div className="mark" style={{backgroundColor: this.props.accepts.stack[this.props.index] ? 'lime' : 'red'}}></div>
    ) : null;

    return (
      <div ref="stack" className={"stack" + this.props.index + " holder"}>
        <div className="face">К</div>
        {this.props.children ? this.props.children : mark}
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return state;
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEnterStack : bindActionCreators(interactActions.dragEnterStack, dispatch),
    dragLeaveStack : bindActionCreators(interactActions.dragLeaveStack, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Stack);