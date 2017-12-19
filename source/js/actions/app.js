import constantsActions from 'constants/actions'  ;

export default {
  resize: function(md, size) {
    return {
      layout  : {
        mini: md.phone() || size.w < 480 || size.h < 480,
        size: size
      },
      type    : constantsActions.FX_RESIZE
    };
  }
};
