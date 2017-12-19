import React     from 'react'     ;
import interact  from 'interactjs';
import PropTypes from 'prop-types';

class Popup extends React.PureComponent {
  componentDidMount() {
    interact(this.componentRef).on('tap', this.props.handler.bind(this));
  }

  render() {
    return (
      <div className={this.props.role + ' popup' + (this.props.visible ? ' visible' : '')}>
        <div className="header">
          <div className="caption">{this.props.caption}</div>
          <div className="close" ref={(el) => { this.componentRef = el }}>&times;</div>
        </div>
        <div className="content">
          {this.props.children}
        </div>
      </div>
    );
  }
}

Popup.propTypes = {
  children  : PropTypes.array,
  caption   : PropTypes.string.isRequired,
  handler   : PropTypes.func.isRequired,
  role      : PropTypes.string.isRequired,
  visible   : PropTypes.bool
};

export default Popup;
