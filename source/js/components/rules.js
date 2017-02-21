import React from 'react';

export default class Rules extends React.Component {
  render() {
    return (
      <div className="rules">
        <div className="close">&times;</div>
        &nbsp;&nbsp;&nbsp;&nbsp;Как играть?<br /><br />
        &nbsp;&nbsp;&nbsp;&nbsp;Цель - заполнить все четыре дома картами одной масти, сначала тузы, далее двойки, тройки и так до короля.
        <div className="image"></div><br /><br />&nbsp;&nbsp;&nbsp;&nbsp;Карты берутся из колоды или со стола.
        Открытые карты стола Вы можете перемещать по принципу: короля - на пустую стопку, не короля - на карту выше рангом и другого цвета.<br /><br />
        &nbsp;&nbsp;&nbsp;&nbsp;Сойдется ли пасьянс? Все как в жизни - зависит от везения и Вашего мастерства...
      </div>
    );
  }
}