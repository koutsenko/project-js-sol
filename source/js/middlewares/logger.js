export default function() {
  return function(next) {
    return function(action) {
      console.log(action.type);
      return next(action);
    };
  };
};
