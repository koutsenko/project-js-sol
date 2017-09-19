import React from 'react';

/**
 * Класс водяного знака с копирайтом.
 */
class Watermark extends React.PureComponent {
  render() {
    return (
      <div className="watermark">        
        <div>Версия v1.1b © 2017</div>
        <div>сборка для порталов</div>
        <div className="bigger">min2win <small>&</small> min3win</div> 
      </div>
    );
  }
}

export default Watermark;
