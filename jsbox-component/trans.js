
function trans(view) {
  if (view.views) {
    for (let i in view.views) {
      view.views[i] = trans(view.views[i]);
    }
  }
  if (view.type && typeof view.type !== "string") {
    const ViewBuilder = view.type;
    view = ViewBuilder(view);
  }
  return view;
}

module.exports = {
  trans
}
