function get(id) {
  const component = window.$components[id];
  const view = $(id);
  if (component) {
    return new Proxy(view, {
      get(obj, propName) {
        if (propName.startsWith("_")) {
          return obj[propName];
        }
        
        if (propName in component.props) {
          return component.props[propName];
        } else if (propName in component.methods) {
          return component.methods[propName];
        } else return obj[propName];
      }
    })
  } else {
    return view;
  }
}

module.exports = {
  get
}