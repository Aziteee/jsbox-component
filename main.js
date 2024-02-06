const $jc = require("./jsbox-component");

const Accumulator = require("./components/Accumulator");
const TabLayout = require("./components/TabLayout");

$jc.render({
  views: [
    {
      type: "button",
      props: {
        title: "Reset"
      },
      layout(make, view) {
        make.top.left.inset(15);
        make.width.equalTo(60);
      },
      events: {
        tapped() {
          /**
           * 通过get函数可以拿到某个组件的视图对象
           * 拿到视图对象后可以调用methods中定义的方法
           */
          $jc.get("acc").reset();
        }
      }
    },
    {
      type: Accumulator,
      props: {
        id: "acc",
        value: 10
      },
      layout(make, view) {
        make.left.inset(15);
        make.top.equalTo(view.prev.bottom).offset(10);
        make.height.equalTo(30);
        make.width.equalTo(100);
      },
      events: {
        didValueChanged(value) {
          console.log(value);
        }
      }
    },
    {
      type: TabLayout,
      props: {
        index: 0,
        tabs: [
          {
            title: "Home",
            icon: "102"
          },
          {
            title: "Favorite",
            icon: "061"
          },
          {
            title: "Settings",
            icon: "002"
          }
        ]
      },
      layout(make, view) {
        make.bottom.right.left.equalTo(view.super.safeArea);
        make.height.equalTo(50);
      },
      events: {
        onTabChanged: (index, title) => {
          console.log(index, title);
        }
      }
    }
  ]
})
