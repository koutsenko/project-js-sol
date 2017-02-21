import React from 'react';

export default class GameTable extends React.Component {
  render() {
    return (
      <div className="table">
        <div className="deck"><div className="face"></div></div>
        <div className="open"><div className="face"></div></div>
        <div className="status">"Косынка"<br />классика<br /><div className="counter"></div></div>
        <div className="home1"><div className="face">Т</div></div>
        <div className="home2"><div className="face">Т</div></div>
        <div className="home3"><div className="face">Т</div></div>
        <div className="home4"><div className="face">Т</div></div>
        <div className="stack1"><div className="face">К</div></div>
        <div className="stack2"><div className="face">К</div></div>
        <div className="stack3"><div className="face">К</div></div>
        <div className="stack4"><div className="face">К</div></div>
        <div className="stack5"><div className="face">К</div></div>
        <div className="stack6"><div className="face">К</div></div>
        <div className="stack7"><div className="face">К</div></div>
      </div>
    );
  }
}