const { render } = require("./jsbox-component");

// const GreetingButton = require("./components/GreetingButton");

// render({
//   views: [
//     {
//       type: GreetingButton,
//       props: {
//         name: "Alice"
//       },
//       layout: function(make, view) {
//         make.center.equalTo(view.super)
//         make.size.equalTo($size(150, 50))
//       },
//       events: {
//         didClick() {
//           console.log("clicked");
//         }
//       }
//     }
//   ]
// });

const TodoList = require("./components/TodoList");

render({
  views: [
    {
      type: TodoList,
      props: {
        id: "todolist",
        data: ["do something..."]
      },
      events: {
        didInsertItem(text) {
          console.log(`new item ${text}`);
        },
        didSelectItem(title) {
          console.log(title)
          $clipboard.text = title;
          $device.taptic();
          $ui.toast("Copied");
        },
        didDeleteItem(sender, indexPath) {
          console.log(`index ${indexPath.row} deleted`)
        }
      },
      layout: $layout.fill
    }
  ]
})
