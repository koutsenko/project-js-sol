import   React                from 'react'                      ;
import   PropTypes            from 'prop-types'                 ;
import   interact             from 'interactjs'                 ;
import { bindActionCreators } from 'redux'                      ;
import { connect }            from 'react-redux'                ;

import   Checkbox             from 'controls/popup/checkbox'    ;
import   RadioButton          from 'controls/popup/radiobutton' ;
import   Popup                from 'controls/popup'             ;

import   actions              from 'actions/options'            ;

class Options extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = this.buildState(props);
    this.toggleDndState = this.toggleDndState.bind(this);
  }

  componentDidMount() {
    interact(this.applyButton).on('tap', this.applyChanges.bind(this));
  }

  componentWillUpdate(nextProps) {
    if (nextProps.optionsVisible && !this.props.optionsVisible) {
      this.setState(this.buildState(nextProps));
    }
  }

  /**
   * Метод-генератор начального внутреннего состояния на основе глобального.
   * Задействован при создании окна и повторном его открытии.
   */
  buildState(props) {
    return {
      dndEnabled: props.dndEnabled
    };
  }

  toggleDndState() {
    this.setState({
      dndEnabled: !this.state.dndEnabled
    });
  }

  applyChanges() {
    const checked = this.state.dndEnabled;
    if (this.props.dndEnabled !== checked) {
      this.props.toggleDnd(checked);
    }

    this.props.closeOptions();
  }

  render() {
    const ws = {
      boxShadow: '0 0 0.2em 0.01em black',
      display: 'inline-block',
      marginRight: '0.25em',
      paddingRight: '0.5em'
    }
    return (
      <Popup role="options" visible={this.props.optionsVisible} handler={this.props.closeOptions} caption="Настройки">
        <div style={{marginTop: '1em', marginBottom: '0.5em'}}>игровые правила</div>
        <hr/>
        <div style={ws}>
          <RadioButton label="игра на очки" checked={false} disabled={true}/>
          <RadioButton label="на деньги" checked={false} disabled={true}/>
          <RadioButton label="без счета" checked={true} disabled={true}/>
        </div>
        <div style={{display: 'inline-block', position: 'absolute'}}>
          <Checkbox label="учет времени" checked={true} disabled={true} handler={()=>null}/>
        </div>
        <div style={ws}>
          <RadioButton label="сдача по одной" checked={true} disabled={true}/>
          <RadioButton label="сдача по три" checked={false} disabled={true}/>
        </div>
        <div style={{marginTop: '1.5em', marginBottom: '0.5em'}}>разное</div>
        <hr/>
        <Checkbox label="перетаскивание карт" checked={this.state.dndEnabled} handler={this.toggleDndState}/>
        <Checkbox label="эффекты анимации" checked={true} disabled={true} handler={()=>null}/>
        <div className="buttonBar">
          <div className="button" ref={(el) => { this.applyButton = el }}>Применить</div>
        </div>
      </Popup>
    );
  }
}

const mapStateToProps = (state) => ({
  dndEnabled      : state.fx.dndEnabled,
  optionsVisible  : state.popup.optionsVisible
});

const mapDispatchToProps = (dispatch) => ({
  closeOptions  : bindActionCreators(actions.close      , dispatch),
  toggleDnd     : bindActionCreators(actions.toggleDnd  , dispatch)
});

Options.propTypes = {
  optionsVisible: PropTypes.bool,
  dndEnabled    : PropTypes.bool,
  toggleDnd     : PropTypes.func,
  closeOptions  : PropTypes.func
};

export default connect(mapStateToProps, mapDispatchToProps)(Options);
