export default function() {
  return (next) => (action) => {
    console.log('action:', action.type);
    return next(action);
  };
}
