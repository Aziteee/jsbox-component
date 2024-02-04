const { defineComponent } = require("../jsbox-component");

module.exports = defineComponent({
  name: "TodoList",
  props: {
    data: {
      value: [],
      get(view) {
        return view.get("TodoList__list").data;
      },
      set(view, value) {
        view.get("TodoList__list").data = value;
      }
    }
  },
  events: ["didInsertItem", "didDeleteItem", "didSelectItem"],
  methods: {
    insertItem(sender, value) {
      sender.get("TodoList__list").insert({
        index: 0,
        value: value
      });
    }
  },
  render() {
    return {
      type: "view",
      views: [
        {
          type: "input",
          props: {
            id: "TodoList__input",
            placeholder: "Type item here..."
          },
          layout({top, height}) {
            top.left.right.inset(10);
            height.equalTo(32);
          },
          events: {
            returned(sender) {
              $("TodoList__list").insert({
                index: 0,
                value: sender.text
              });
              this.events.didInsertItem(sender.text);
              sender.blur();
              sender.text = "";
            }
          }
        },
        {
          type: "list",
          props: {
            id: "TodoList__list",
            actions: [
              {
                title: "delete",
                handler: this.events.didDeleteItem
              }
            ],
            data: this.props.data || []
          },
          layout({left, top}) {
            left.bottom.right.equalTo(0);
            top.equalTo($("TodoList__input").bottom).offset(10);
          },
          events: {
            didSelect(sender, indexPath, title) {
              this.events.didSelectItem(title);
            }
          }
        }
      ]
    }
  }
})
