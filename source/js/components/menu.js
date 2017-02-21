import React from 'react';

export default class Menu extends React.Component {
  render() {
    return (
      <div className="menu">
        <div className="buttons">
          <div title="Начать новый расклад, текущий будет закрыт" className="btn1"> <div className="face"><div>Разложить</div></div></div><span>&nbsp;</span>
          <div title="Отмена последнего сделанного хода" className="btn2"> <div className="face"><div>Ход назад</div></div></div><span>&nbsp;</span>
          <div title="Автозавершение игры, если открыты все карты" className="btn3"> <div className="face"><div>Автосбор </div></div></div><span>&nbsp;</span>
          <div title="Как играть в пасьянс-косынку" className="btn4"> <div className="face"><div>Правила  </div></div></div><span>&nbsp;</span>
          <div title="Авторизация, статистика, рекорды" className="btn5"> <div className="face"><div>Рекорды  </div></div></div><span>&nbsp;</span>
        </div>
      </div>
    );
  }
}