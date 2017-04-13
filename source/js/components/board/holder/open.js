import React from 'react';

export default class Open extends React.Component {
  render() {
    return (
      <div className="open holder">
        {this.props.children}
      </div>
    );
  }
}
