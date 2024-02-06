
/**
 * Transform your custom component to the form that JSBox can recognize
 * @param {View} view 
 * @returns 
 */
function trans(view) {
  if (view.views) {
    for (const i in view.views) {
      view.views[i] = trans(view.views[i]);
    }
  }
  if (view.type) {
    if (typeof view.type !== "string") {
      const ViewBuilder = view.type;
      view = ViewBuilder(view);
    } else if (view.type === "list" || view.type === "matrix") {
      if (view.props?.template) {
        if (Array.isArray(view.props.template)) {
          for (const i in view.props.template) {
            view.props.template[i] = trans(view.props.template[i]);
          }
        } else {
          view.props.template = trans(view.props.template);
        }
      }
    } else if (view.type === "gallery") {
      if (view.props?.items) {
        for (const i in view.props.items) {
          view.props.items[i] = trans(view.props.items[i]);
        }
      }
    }
  }
  return view;
}

module.exports = {
  trans
}
