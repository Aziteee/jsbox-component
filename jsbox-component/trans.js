
/**
 * Transform your custom component to the form that JSBox can recognize
 * @param {View} view 
 * @returns 
 */
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
