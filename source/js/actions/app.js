import constantsActions from 'constants/actions'  ;
import constantsApp     from 'constants/app'      ;

export default {
  resize: function(md, size) {
    return function(dispatch, getState) {
      dispatch({
        layout  : {
          mini: md.phone() || size.w < 480 || size.h < 480,
          size: size
        },
        type    : constantsActions.FX_RESIZE
      });
    }
  }
};