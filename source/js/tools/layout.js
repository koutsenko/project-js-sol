const toolsLayout = {
  getWHLT: function(el) {
    let rect = el.getBoundingClientRect();

    let w = Math.round(rect.right - rect.left);
    let h = Math.round(rect.bottom - rect.top);
    let l = Math.round(rect.left);
    let t = Math.round(rect.top);

    return {w, h, l, t};
  }
}

export default toolsLayout;
