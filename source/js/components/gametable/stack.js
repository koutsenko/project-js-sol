import React from 'react';

export default class Stack extends React.Component {
  render() {
    return (
      <div className={"stack" + this.props.index}>
        <div className="face">К</div>
        {this.props.children}
      </div>
    );
  }
}
