import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getFxHighlight from '../fx/highlight';

class Stack extends React.Component {
  render() {
    return (
      <div ref="stack" data-index={this.props.index} className={"stack holder " + getFxHighlight(this.props.highlights[this.props.index])}>
        {this.props.children}
      </div>
    );
  }
}

Stack.propTypes = {
  index: React.PropTypes.number.isRequired
};

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.stack_highlights
  };
}

export default connect(mapStateToProps)(Stack);