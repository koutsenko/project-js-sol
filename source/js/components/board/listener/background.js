import { bindActionCreators } from 'redux'            ;
import { connect }            from 'react-redux'      ;
import   interact             from 'interactjs'       ;
import   React                from 'react'            ;
import   ReactDOM             from 'react-dom'        ;
import   matches              from 'matches-selector' ;

import   constantsBoard       from 'constants/board'  ;

/**
 * Компонент-часть Board без своей видимой DOM составляющей.
 * Ловит взаимодействия с Board ("пустая" часть игрового экрана).
 * Пока это только тап при условии наличия ранее выбранной карты.
 * TODO Мог быть еще и дроп карты, но это мне показалось ресурсоемко...
 * Хотя наверное сделаю - ради чистоты кода
 */
class Background extends React.PureComponent {
  // странный Workaround на неготовность ("не отрисованность") refs props.selector...
  componentWillReceiveProps(nextProps) {
    if (!this.props.selector && nextProps.selector) {
      this.ir = interact(nextProps.selector);
      this.ir.styleCursor(false);
      this.ir.on('tap', this.tapHandler.bind(this));
    }
  }
  
  isTappable(element) {
    let selected = !!this.props.selected;
    let acceptable = !matches(element, this.props.ignoreSelector);

    return selected && acceptable;
  }

  tapHandler(event) {
    if (this.isTappable(event.target)) {
      this.props.api.cardSelectCancel();
    }
  }

  render() {
    return null;
  }
};

Background.propTypes = {
  selected      : React.PropTypes.string,  /** Ранее выбранные source-цели, нужны для обработчика тапов */  
  selector      : React.PropTypes.object,
  ignoreSelector: React.PropTypes.string,
  api           : React.PropTypes.object.isRequired
};

export default Background;