import   React      from 'react'          ;
import   interact   from 'interactjs'     ;
import { connect }  from 'react-redux'    ;

class Popup extends React.Component {
  componentDidMount() {
    let ir = interact(this.refs["closeButton"]);
    ir.on('tap', this.props.handler.bind(this));
  }

  render() {
    return (
      <div className={this.props.role + ' popup' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
        <div className="header">{this.props.header}</div>
        {this.props.children}
        <div className="close" ref="closeButton">&times;</div>
      </div>
    );
  }
};

Popup.propTypes = {
  header  : React.PropTypes.string.isRequired,
  handler : React.PropTypes.func.isRequired
};

export default Popup;