require("./types");

const { defineComponent } = require("./component");
const { trans } = require("./trans");
const { get } = require("./get");

/**
 * Render the view on the screen (same as $ui.render)
 * @param {View} view 
 */
function render(view) {
  view = trans(view);
  $ui.render(view);
}

/**
 * Same as $ui.push
 * @param {View} view 
 */
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
