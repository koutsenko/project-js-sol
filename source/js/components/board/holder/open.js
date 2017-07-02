import React from 'react';

class Open extends React.Component {
  render() {
    return (
      <div className={"open holder"}>
        {this.props.children}
      </div>
    );
  }
}

export default Open;