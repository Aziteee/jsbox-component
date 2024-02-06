const { defineComponent } = require("./component");
const { trans } = require("./trans");
const { get } = require("./get");

function render(view) {
  view = trans(view);
  $ui.render(view);
}

function push(view) {
  view = trans(view);
  $ui.push(view);
}

window.$components = {};

module.exports = {
  defineComponent,
  render,
  push,
  trans,
  get
};
