const { defineComponent } = require("./component");
const { trans } = require("./trans");

function render(view) {
  view = trans(view);
  $ui.render(view);
}

module.exports = {
  defineComponent,
  render,
  trans
};
