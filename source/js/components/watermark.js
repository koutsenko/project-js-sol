import React from 'react';

export default class Watermark extends React.Component {
  render() {
    return (
      <div className="wmark">
        <a href="mailto:koutsenko@gmail.com">©</a> Куценко Д. С., 2015
        <br />
        сборка для портала
        <br />
        <span>www.solo-games.ru</span>
      </div>
    );
  }
}