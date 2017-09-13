import   React     from 'react'       ;
import { connect } from 'react-redux' ;

class Mask extends React.PureComponent {
  render() {
    return (
      <div className={"mask" + (this.props.visible ? " visible" : "")}/>
    );
  }
};

const mapStateToProps = function(state) {
  return {
    visible : state.fx.maskVisible
  };
}

export default connect(mapStateToProps)(Mask);