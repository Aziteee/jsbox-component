const { defineComponent } = require("../jsbox-component");

module.exports = defineComponent({
  name: "ViewPager",
  props: {
    pages: [],
    index: 0
  },
  events: ["onPageChanged"],
  methods: {
    scrollToPage(pageIndex) {
      const x = pageIndex * this.view.frame.width;
      if (this.view.contentOffset.x !== x) {
        this.view.scrollToOffset($point(x, 0));
      }
    }
  },
  watch: {
    index(newIndex) {
      this.methods.scrollToPage(newIndex);
    }
  },
  render() {
    return {
      type: "scroll",
      props: {
        alwaysBounceVertical: false,
        showsVerticalIndicator: false,
        showsHorizontalIndicator: false,
        pagingEnabled: true
      },
      events: {
        layoutSubviews(view) {
          let frame = view.frame;
          view.contentSize = $size(frame.width * this.props.pages.length, frame.height);
          view.views.forEach((item, index) => {
            item.frame = $rect(index * frame.width, 0, frame.width, frame.height);
          });
        },
        ready(sender) {
          const frame = sender.frame;
          this.props.pages.forEach((item, index) => {
            if (item.layout) delete item.layout;
            item.type = "view";
            if (!item.props) item.props = {};
            item.props.frame = $rect(
              index * frame.width,
              0,
              frame.width,
              frame.height
            );
            sender.add(item);
          });
          sender.contentSize = $size(
            frame.width * this.props.pages.length,
            frame.height
          );
          sender.scrollToOffset($point(this.props.index * frame.width, 0));
        },
        didEndDecelerating(sender) {
          sender.views.forEach((item, index) => {
            if (index * sender.frame.width === sender.contentOffset.x) {
              this.props.index = index;
              this.events.onPageChanged(index);
            }
          });
        }
      }
    }
  }
})
