const toolsLayout = {
  getWHLT: (el) => {
    const rect = el.getBoundingClientRect();

    const w = Math.round(rect.right - rect.left);
    const h = Math.round(rect.bottom - rect.top);
    const l = Math.round(rect.left);
    const t = Math.round(rect.top);

    return {w, h, l, t};
  }
}

export default toolsLayout;
