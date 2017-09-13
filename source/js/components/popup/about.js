import   React                from 'react'          ;
import { bindActionCreators } from 'redux'          ;
import { connect }            from 'react-redux'    ;

import   actions              from 'actions/about'  ;
import   Popup                from 'controls/popup' ;

class Rules extends React.PureComponent {
  wrapUrl(url, desc) {
    return (
      <a href={url} target="_blank">{desc}</a>
    );
  }

  render() {
    let ps = {textIndent: '1.5em'};
    let m2w_url = this.wrapUrl('http://min2win.ru', 'min2win.ru');
    let m3w_url = this.wrapUrl('http://min3win.ru', 'min3win.ru');
    let sg_url  = this.wrapUrl('http://solo-games.ru', 'solo-games.ru');
    return (
      <Popup role="about" visible={this.props.aboutVisible} handler={this.props.closeAbout} header="Об игре">
        <p style={ps}>Клондайк, он же косынка - простая разновидность пасьянса родом из 90-х. Созданный для обучения работе с мышью, стал популярен сам по себе!</p>
        <p style={ps}>Это версия создана для порталов {m3w_url}, {m2w_url}, {sg_url}. Работает на компьютере, телефоне, планшете..</p>
        <p style={ps}>Ваши пожелания и отзывы ждём по адресу <a href="mailto:koutsenko@gmail.com">koutsenko@gmail.com</a> :)</p>
        <p style={ps}>Версия 1.1, © 2017</p>
      </Popup>
    );
  }
}

const mapStateToProps = function(state) {
  return {
    aboutVisible: state.popup.aboutVisible
  };
}

const mapDispatchToProps = function(dispatch) {
  return {
    closeAbout: bindActionCreators(actions.close, dispatch)
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Rules);