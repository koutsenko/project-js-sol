import React from 'react';
import { highlights } from '../../../constants/app';

export default class Highlight extends React.Component {
  render() {
    return (
      (this.props.value !== undefined) ? (
        <div className="mark" style={{
          backgroundColor: {
            [ highlights.ACCEPT ] : 'lime',
            [ highlights.DENY   ] : 'red'
          }[this.props.value]
        }}></div>
      ) : null
    );
  };
}
