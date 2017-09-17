import   React      from 'react'          ;
import   interact   from 'interactjs'     ;
import { connect }  from 'react-redux'    ;

class Popup extends React.PureComponent {
  componentDidMount() {
    interact(this.refs["closeButton"]).on('tap', this.props.handler.bind(this));
  }

  render() {
    return (
      <div className={this.props.role + ' popup' + (this.props.visible ? ' visible' : '')} ref={this.props.role}>
        <div className="header">
          <div className="caption">{this.props.caption}</div>
          <div className="close" ref="closeButton">&times;</div>
        </div>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
};

Popup.propTypes = {
  caption   : React.PropTypes.string.isRequired,
  handler   : React.PropTypes.func.isRequired
};

export default Popup;