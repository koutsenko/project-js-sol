import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import interactActions from '../../actions/interact';

import interact from 'interact.js';

class Home extends React.Component {
  onDragEnter(event) {
    this.props.dragEnterHome(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDragLeave(event) {
    this.props.dragLeaveHome(event.relatedTarget.dataset['id'], this.props.index);
  }

  onDrop(event) {
    this.props.dropHome(event.relatedTarget.dataset['id'], this.props.index);
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
      <div ref="home" className={"home" + this.props.index}>
        <div className="face">Т</div>
        {this.props.children}
        {this.props.accepts.home[this.props.index] !== null ? (
          <div className="mark" style={{backgroundColor: this.props.accepts.home[this.props.index] ? 'lime' : 'red'}}></div>
        ) : null}
      </div>
    );
  }
}

const mapStateToProps = function(state) {
  return state;
}

const mapDispatchToProps = function(dispatch) {
  return {
    dragEnterHome : bindActionCreators(interactActions.dragEnterHome, dispatch),
    dragLeaveHome : bindActionCreators(interactActions.dragLeaveHome, dispatch),
    dropHome      : bindActionCreators(interactActions.dropHome, dispatch)
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Home);