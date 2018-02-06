import   React                from 'react'                            ;
import   PropTypes            from 'prop-types'                       ;
import { connect }            from 'react-redux'                      ;

import   selectorsLayout      from 'selectors/layout'                 ;

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
      <div style={this.props.holderStyle} data-id={this.props.id} className={className}/>
    );
  }
}

const mapStateToProps = (state, ownProps) => ({
  holderStyle: selectorsLayout.holderStyle(ownProps.id, state.fx.layout)
});

Holder.propTypes = {
  id              : PropTypes.string.isRequired,
  className       : PropTypes.string.isRequired,
  declined        : PropTypes.bool.isRequired,
  hovered         : PropTypes.string,
  holderStyle     : PropTypes.object
};

export default connect(mapStateToProps)(Holder);
