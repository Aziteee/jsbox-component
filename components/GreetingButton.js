const { defineComponent } = require("../jsbox-component");

module.exports = defineComponent({
  name: "GreetingButton",
  props: {
    name: "stranger" // default value
  },
  events: ["didClick"],
  render() {
    return {
      type: "button",
      props: {
        title: "Greeting " + this.props.name
      },
      events: {
        tapped(sender) {
          $ui.toast(`Hello ${this.props.name} !`);
          if (this.events.didClick) {
            this.events.didClick();
          }
        }
      }
    }
  }
});
