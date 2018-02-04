import   interact             from 'interactjs'       ;
import   React                from 'react'            ;
import   PropTypes            from 'prop-types'       ;
import   matches              from 'matches-selector' ;

/**
 * Компонент-часть Board без своей видимой DOM составляющей.
 * Ловит взаимодействия с Board ("пустая" часть игрового экрана).
 * Пока это только тап при условии наличия ранее выбранной карты.
 * TODO Мог быть еще и дроп карты, но это мне показалось ресурсоемко...
 * Хотя наверное сделаю - ради чистоты кода
 */
class Background extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ir = interact(this.props.selector);
    this.ir.styleCursor(false);
    this.ir.on('tap', this.tapHandler.bind(this));
  }

  isTappable(element) {
    const selected = !!this.props.selected;
    const acceptable = !matches(element, this.props.ignoreSelector);

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
}

Background.propTypes = {
  selected      : PropTypes.string,  /** Ранее выбранные source-цели, нужны для обработчика тапов */
  selector      : PropTypes.string,
  ignoreSelector: PropTypes.string,
  api           : PropTypes.object.isRequired
};

export default Background;
