export default {
  flatten: function(array2d) {
    return [].concat.apply([], array2d);
  }
};