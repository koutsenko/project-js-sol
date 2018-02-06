import { connect }            from 'react-redux'      ;
import   interact             from 'interactjs'       ;
import   React                from 'react'            ;
import   PropTypes            from 'prop-types'       ;

import   constantsBoard       from 'constants/board'  ;
import   selectorsTurn        from 'selectors/turn'   ;
import   toolsRules           from 'tools/rules'      ;

/**
 * Компонент-часть Board без своей видимой DOM составляющей.
 * Отвечает за управление элементами-целями.
 * Поддерживается DropZone-часть Drag'n'Drop и тапы/клики.
 */
class Target extends React.PureComponent {
  constructor(props) {
    super(props);

    this.ir = interact(this.props.selector);
    this.ir.styleCursor(false);
    this.ir.on('tap', this.tapHandler.bind(this));

    this.irDrop = interact(this.props.selector);
    this.irDrop.styleCursor(false);
    this.toggleDnd(this.props.dndEnabled);

    this.state = {
      hovered_card_id   : undefined,  // дропзона с которой осуществляется (физическое) взаимодействие (холдер или любая карта в нем - как навели мышь - не угадаешь)
      target_card_id    : undefined,  // дропзона - ВЕРХНЯЯ карта для (логического) взаимодействия, если есть
      target_holder_id  : undefined,  // дропзона - холдер для (логического) взаимодействия
      source_card_id    : undefined,  // источник - карта, который осуществляет взаимодействие
      source_holder_id  : undefined,  // источник - холдер, карта из которого осуществляет взаимодействие
    };
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.dndEnabled !== nextProps.dndEnabled) {
      this.toggleDnd(nextProps.dndEnabled);
    }
  }

  toggleDnd(state) {
    if (state) {
      this.irDrop.dropzone({
        accept      : this.props.selector,
        overlap     : 0.1,
        ondragenter : this.onDragEnter.bind(this),
        ondragleave : this.onDragLeave.bind(this),
        ondrop      : this.onDrop.bind(this)
      });
    } else {
      this.irDrop.ondragenter = null;
      this.irDrop.ondragleave = null;
      this.irDrop.ondrop      = null;
      this.irDrop.dropzone(false);
    }
  }

  updateIds(source_card_id, hovered_id) {
    const source_holder_id = selectorsTurn.getHolderId(this.props.turn, source_card_id);
    let hovered_card_id;
    let target_holder_id;

    if (constantsBoard.isCard(hovered_id)) {
      hovered_card_id = hovered_id;
      target_holder_id = selectorsTurn.getHolderId(this.props.turn, hovered_card_id);
    } else {
      hovered_card_id = undefined;
      target_holder_id = hovered_id;
    }

    const target_card_id = selectorsTurn.getLastCard(this.props.turn, target_holder_id);

    // eslint-disable-next-line react/no-direct-mutation-state
    this.state = {
      hovered_card_id   : hovered_card_id,
      source_card_id    : source_card_id,
      source_holder_id  : source_holder_id,
      target_card_id    : target_card_id,
      target_holder_id  : target_holder_id
    };
  }

  onDragEnter(event) {
    // console.log('в дропзону вошли');
    this.updateIds(event.relatedTarget.dataset['id'], event.target.dataset['id']);

    if (this.state.source_holder_id === this.state.target_holder_id) {
      // console.log('игнорим, т.к. исходная позиция');
      return;
    }

    const acceptable = toolsRules.canAcceptDrop(
      this.state.source_card_id   ,
      this.state.source_holder_id ,
      this.state.target_card_id   ,
      this.state.target_holder_id
    );

    const highlight = acceptable ? constantsBoard.highlights.ACCEPT : constantsBoard.highlights.DENY;

    this.props.api.targetHover(this.state.target_card_id || this.state.target_holder_id, highlight);
  }

  onDragLeave(event) {
    // console.log('из дропзоны вышли');
    this.updateIds(event.relatedTarget.dataset['id'], event.target.dataset['id']);
    if (this.state.source_holder_id === this.state.target_holder_id) {
      // console.log('игнорим, т.к. исходная позиция');
      return;
    }
    this.props.api.targetUnhover();
  }

  onDrop(event) {
    // console.log('дропнули в дропзону')
    this.updateIds(event.relatedTarget.dataset['id'], event.target.dataset['id']);
    if (this.state.source_holder_id === this.state.target_holder_id) {
      // console.log('игнорим, т.к. исходная позиция');
      this.props.api.cardUnshift();
      return;
    }

    const acceptable = toolsRules.canAcceptDrop(
      this.state.source_card_id   ,
      this.state.source_holder_id ,
      this.state.target_card_id   ,
      this.state.target_holder_id
    );

    if (!acceptable) {
      console.log('игнорим, т.к. недопустимая цель');
      console.log('и почистим подсветку.');
      this.props.api.cardUnshift();
      this.props.api.targetUnhover();
      this.props.api.alertFlash(this.state.target_card_id || this.state.target_holder_id);
      return;
    }

    this.props.api.cardMove(this.state.source_card_id, event.target.dataset['id']);
    this.props.api.cardUnshift();
    this.props.api.targetUnhover();
  }

  handleDoubleClick(event) {
    const target = event.target;
    const id = target.dataset['id'];
    if (!constantsBoard.isCard(id)) {
      return;
    }

    const holderId = selectorsTurn.getHolderId(this.props.turn, id);
    if (((holderId === constantsBoard.places.OPEN) || constantsBoard.isStackPlace(holderId)) && (selectorsTurn.getChildCards(this.props.turn, id).length===1)) {
      this.props.api.cardDoubleClick(id);
    }
  }

  isTappable() {
    return !!this.props.selected;
  }

  tapHandler(event) {
    if (this.isTappable()) {
      console.log('target tapped');

      const source_id = this.props.selected;

      this.updateIds(source_id, event.target.dataset['id']);

      if (this.state.source_card_id === this.state.target_card_id) {
        console.log('повторный клик на выбранную карту - раньше это был дабл-клик хэндлер');
        this.handleDoubleClick(event);
      } else {
        console.log('что-то уже было выбрано и был клик на  потенциальную цель, думаем - ок и дроп куда-то ИЛИ фэйл..');

        if (toolsRules.canAcceptDrop(
          this.state.source_card_id,
          this.state.source_holder_id,
          this.state.target_card_id,
          this.state.target_holder_id
        )) {
          this.props.api.cardSelectCancel();
          this.props.api.cardMove(source_id, event.target.dataset['id']);
        } else {
          this.props.api.alertFlash(event.target.dataset['id']);
        }
      }
    } else {
      console.log('target tapped but ignored, because it is disabled');
    }
  }

  render() {
    return null;
  }
}

const mapStateToProps = (state) => state;

Target.propTypes = {
  selected      : PropTypes.string,  /** Ранее выбранные source-цели, нужны для обработчика тапов */
  selector      : PropTypes.string.isRequired,
  dndEnabled    : PropTypes.bool.isRequired,
  api           : PropTypes.object.isRequired,
  turn          : PropTypes.object
};

export default connect(mapStateToProps)(Target);
