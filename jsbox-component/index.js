const { defineComponent } = require("./component");
const { trans } = require("./trans");

function render(view) {
  view = trans(view);
  $ui.render(view);
}

function push(view) {
  view = trans(view);
  $ui.push(view);
}

function get(id) {
  const component = window.$components[id];
  const view = $(id);
  if (component) {
    return new Proxy(view, {
      get(obj, propName) {
        if (propName in component.props) {
          return component.props[propName];
        } else if (propName in component.methods) {
          return function (value) {
            return component.methods[propName](obj, value);
          }
        } else return obj[propName];
      }
    })
  } else {
    return view;
  }
}

window.$components = {};

module.exports = {
  defineComponent,
  render,
  push,
  trans,
  get
};
