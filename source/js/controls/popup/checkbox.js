import   React      from 'react'          ;
import   interact   from 'interactjs'     ;

class Checkbox extends React.PureComponent {
  constructor(props) {
    super(props);
    this.setState({
      checked  : this.props.checked
    });
  }

  componentWillUpdate(nextProps) {
    this.setState({
      checked: nextProps.checked
    });
  }

  componentDidMount() {
    interact(this.refs["checkbox"]).on('tap', this.handleCheckboxClick.bind(this));
  }

  handleCheckboxClick() {
    if (!this.props.disabled) {
      this.props.handler();
    }
  }

  render() {
    return (
      <div ref="checkbox" className={"checkbox" + (this.state.checked ? " checked" : "") + (this.props.disabled ? " disabled" : "")}>
        <span>{this.props.label}</span>
      </div>
    );
  }
};

Checkbox.propTypes = {
  disabled  : React.PropTypes.bool              ,
  checked   : React.PropTypes.bool.isRequired   ,
  label     : React.PropTypes.string.isRequired ,
  handler   : React.PropTypes.func.isRequired
};

export default Checkbox;