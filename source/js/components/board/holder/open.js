import React from 'react';

class Open extends React.Component {
  render() {
    return (
      <div className={"open holder" + (this.props.risen ? " raised": "")}>
        {this.props.children}
      </div>
    );
  }
}

Open.propTypes = {
  risen: React.PropTypes.bool.isRequired
};

export default Open;