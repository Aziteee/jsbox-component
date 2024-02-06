const { defineComponent } = require("../jsbox-component");

module.exports = defineComponent({
  name: "TabLayout",
  props: {
    tabs: [],
    tabColor: $color("gray"),
    tabSelectedColor: $color("black"),
    index: 0
  },
  events: ["onTabChanged"],
  methods: {
    changeTab(tabIndex) {
      this.props.index = tabIndex;
    }
  },
  watch: {
    index(newIndex, oldIndex) {
      const data = this.view.data;
      data[newIndex].title.textColor = this.props.tabSelectedColor;
      data[newIndex].icon.icon = $icon(
        this.props.tabs[newIndex].icon,
        this.props.tabSelectedColor,
        $size(50, 50)
      );
      data[oldIndex].title.textColor = this.props.tabColor;
      data[oldIndex].icon.icon = $icon(
        this.props.tabs[oldIndex].icon,
        this.props.tabColor,
        $size(50, 50)
      );
      this.view.data = data;
      this.events.onTabChanged(newIndex, this.props.tabs[newIndex]);
    }
  },
  render() {
    // map函数内this的指向会改变，因此先把要props提取出来
    const props = this.props;
    const data = props.tabs.map(function (item, index) {
      const color = index === props.index ? props.tabSelectedColor : props.tabColor;
      return {
        icon: {
          icon: $icon(
            item.icon,
            color,
            $size(50, 50)
          )
        },
        title: {
          text: item.title,
          textColor: color,
        }
      };
    });
    return {
      type: "matrix",
      props: {
        columns: this.props.tabs.length,
        itemHeight: 60,
        spacing: 0,
        scrollEnabled: false,
        bgcolor: $color("clear"),
        template: [
          {
            type: "image",
            props: { id: "icon", bgcolor: $color("clear") },
            layout(make, view) {
              make.centerX.equalTo(view.super);
              make.width.height.equalTo(25);
              make.top.inset(7);
            }
          },
          {
            type: "label",
            props: { id: "title", font: $font(10) },
            layout(make, view) {
              make.centerX.equalTo(view.prev);
              make.bottom.inset(13);
            }
          },
          {
            type: "canvas",
            layout(make, view) {
              make.top.inset(0);
              make.height.equalTo(1 / $device.info.screen.scale);
              make.left.right.inset(0);
            },
            events: {
              draw(view, ctx) {
                var width = view.frame.width;
                var scale = $device.info.screen.scale;
                ctx.strokeColor = $color("gray");
                ctx.setLineWidth(1 / scale);
                ctx.moveToPoint(0, 0);
                ctx.addLineToPoint(width, 0);
                ctx.strokePath();
              }
            }
          }
        ],
        data
      },
      events: {
        didSelect: (sender, indexPath, item) => {
          this.methods.changeTab(indexPath.item);
        }
      }
    }
  }
})
