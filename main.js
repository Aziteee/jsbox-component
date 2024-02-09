const $jc = require("./jsbox-component");

const GreetingButton = require("./components/GreetingButton")
const Accumulator = require("./components/Accumulator");
const TabLayout = require("./components/TabLayout");
const ViewPager = require("./components/ViewPager");

const components = [
  {
    name: "Accumulator",
    page: {
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
        }
      ]
    }
  },
  {
    name: "TabLayout",
    page: {
      views: [
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
            onTabChanged: (index, tab) => {
              console.log(index, tab);
            }
          }
        }
      ]
    }
  },
  {
    name: "ViewPager",
    page: {
      views: [
        {
          type: ViewPager,
          props: {
            pages: [
              {
                props: {
                  bgcolor: $color("lightGray")
                },
                views: [
                  {
                    type: GreetingButton,
                    props: {
                      name: "Alice"
                    },
                    layout(make, view) {
                      make.center.equalTo(view.super);
                      make.width.equalTo(130);
                    }
                  }
                ]
              },
              {
                props: {
                  bgcolor: $color("lightGray")
                },
                views: [
                  {
                    type: "label",
                    props: {
                      text: "Page2"
                    },
                    layout: $layout.center
                  }
                ]
              },
              {
                props: {
                  bgcolor: $color("lightGray")
                },
                views: [
                  {
                    type: "label",
                    props: {
                      text: "Page3"
                    },
                    layout: $layout.center
                  }
                ]
              }
            ]
          },
          layout: $layout.fill,
          events: {
            onPageChanged: index => {
              console.log(index);
            }
          }
        }
      ]
    }
  }
];

const tests = [
  {
    name: "在template中使用组件",
    page: {
      views: [
        {
          type: "list",
          props: {
            template: [
              {
                type: Accumulator,
                props: {
                  id: "acc"
                },
                layout(make, view) {
                  make.right.inset(100);
                  make.centerY.equalTo(view.super);
                }
              }
            ],
            data: [
              {
                label: {
                  text: "0"
                }
              },
              {
                label: {
                  text: "1"
                }
              },
              {
                label: {
                  text: "2"
                }
              }
            ]
          },
          layout: $layout.fill
        }
      ]
    }
  }
];

const data = [
  {
    title: "示例组件",
    rows: components.map(function (item) {
      return item.name;
    })
  },
  {
    title: "测试",
    rows: tests.map(function (item) {
      return item.name;
    })
  }
];

$jc.render({
  views: [
    {
      type: "list",
      props: {
        stickyHeader: false,
        data: data
      },
      layout: $layout.fill,
      events: {
        didSelect: function (tableView, indexPath, item) {
          if (indexPath.section == 0) {
            $jc.push(components[indexPath.row].page)
          } else {
            $jc.push(tests[indexPath.row].page)
          };
        }
      }
    }
  ]
});
