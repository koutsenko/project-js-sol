import React            from 'react'            ;
import constantsLayout  from 'constants/layout' ;

/**
 * Класс водяного знака с копирайтом.
 */
class Watermark extends React.PureComponent {
  render() {
    return (
      <div id={constantsLayout.watermarkIdName}>
        <div>Версия v1.1d © 2017</div>
        <div>дата сборки 16.11.2017</div>
        <div>создано для порталов</div>
        <div className="bigger">min2win <small>&</small> min3win</div>
      </div>
    );
  }
}

export default Watermark;
