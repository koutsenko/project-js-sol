import React from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

import getFxHighlight from '../fx/highlight';

class Home extends React.Component {
  render() {
    return (
      <div ref="home" data-index={this.props.index} className={"home holder " + getFxHighlight(this.props.highlights[this.props.index]) + (this.props.risen ? " raised" : "")}>
        {this.props.children}
      </div>
    );
  }
}

Home.propTypes = {
  index: React.PropTypes.number.isRequired,
  risen: React.PropTypes.bool.isRequired
}

const mapStateToProps = function(state) {
  return {
    highlights: state.fx.home_highlights
  };
}

export default connect(mapStateToProps)(Home);