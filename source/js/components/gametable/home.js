import React from 'react';

export default class Open extends React.Component {
  render() {
    return (
      <div className={"home" + this.props.index}>
        <div className="face">Т</div>
        {this.props.children}
      </div>
    );
  }
}
