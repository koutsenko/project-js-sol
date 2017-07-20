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
      <div className={this.props.role + ' window' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
        {this.props.children}
        <div className="close" ref="closeButton">&times;</div>
      </div>
    );
  }
};

Popup.propTypes = {
  handler: React.PropTypes.func.isRequired
};

export default Popup;