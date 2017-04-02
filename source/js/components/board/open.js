import React from 'react';

export default class Open extends React.Component {
  render() {
    return (
      <div className="open holder">
        <div className="face"></div>
        {this.props.children}
      </div>
    );
  }
}
