import   React                from 'react'                            ;
import { bindActionCreators } from 'redux'                            ;
import { connect }            from 'react-redux'                      ;
import { Motion, spring }     from 'react-motion'                     ;

import   boardActions         from 'actions/board'                    ;
import   constantsBoard       from 'constants/board'                  ;

class Holder extends React.Component {
  constructor(props) {
    super(props);
    this.timeout = null;
  }

  getRef(element) {
    this.Ref = element;
  }

  render() {
    return (
      <Motion defaultStyle={{
        dColor: +!this.props.declined
      }} style={{
        dColor: spring(+!this.props.declined)
      }}>
        {
          function(interpolatingStyle) {
            let style = this.props.declined ? {
              boxShadow: `0 0 0.1em 0.3em rgba(255, 0, 0, ${interpolatingStyle.dColor})`
            } : {};

            let className = this.props.className;
            if (this.props.hovered === constantsBoard.highlights.ACCEPT) {
              className += ' hovered yes';
            } else if (this.props.hovered === constantsBoard.highlights.DENY) {
              className += ' hovered no';
            }

            return (
              <div ref={this.getRef.bind(this)} style={style} data-index={this.props.index} data-id={this.props.id} className={className}/>
            );
          }.bind(this)
        }
      </Motion>
    );
  }
};

Holder.propTypes = {
  cards           : React.PropTypes.array.isRequired,
  dndEnabled      : React.PropTypes.bool.isRequired,
  id              : React.PropTypes.string.isRequired,
  className       : React.PropTypes.string.isRequired,
  declined        : React.PropTypes.bool.isRequired,
  index           : React.PropTypes.number,
  cbFlushDeclined : React.PropTypes.func
};

export default Holder;