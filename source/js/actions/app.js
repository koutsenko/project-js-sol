import constantsActions from 'constants/actions'  ;
import toolsLayout      from 'tools/layout'       ;
import MobileDetect     from 'mobile-detect'      ;

const md = new MobileDetect(window.navigator.userAgent);
const isPhone = md.phone();

export default {
  resize: (el) => {
    const size = toolsLayout.getWHLT(el);

    return {
      layout  : {
        mini: isPhone || size.w < 480 || size.h < 480,
        size: size
      },
      type    : constantsActions.FX_RESIZE
    };
  }
};
