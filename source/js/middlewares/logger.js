export default function() {
  return function(next) {
    return function(action) {
      console.log('action:', action.type);
      return next(action);
    };
  };
};
