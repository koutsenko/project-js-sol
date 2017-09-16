import   React                from 'react'                            ;
import { bindActionCreators } from 'redux'                            ;
import { connect }            from 'react-redux'                      ;

import   boardActions         from 'actions/board'                    ;
import   constantsBoard       from 'constants/board'                  ;

class Holder extends React.PureComponent {
  render() {
    let className = this.props.className;
    if (this.props.declined) {
      className += ' declined';
    } else {
      if (this.props.hovered === constantsBoard.highlights.ACCEPT) {
        className += ' hovered yes';
      } else if (this.props.hovered === constantsBoard.highlights.DENY) {
        className += ' hovered no';
      }
    }

    return (
      <div data-id={this.props.id} className={className}/>
    );
  }
};

Holder.propTypes = {
  id              : React.PropTypes.string.isRequired,
  className       : React.PropTypes.string.isRequired,
  declined        : React.PropTypes.bool.isRequired,
  hovered         : React.PropTypes.string
};

export default Holder;