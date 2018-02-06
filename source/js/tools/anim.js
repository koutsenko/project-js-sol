/**
 * https://davidwalsh.name/css-animation-callback
 */
export default {
  getTransitionEvent: () => {
    const el = document.createElement('fakeelement');
    const transitions = {
      'transition':'transitionend',
      'OTransition':'oTransitionEnd',
      'MozTransition':'transitionend',
      'WebkitTransition':'webkitTransitionEnd'
    }

    for(const t in transitions){
      if( el.style[t] !== undefined ){
        return transitions[t];
      }
    }
  }
};
