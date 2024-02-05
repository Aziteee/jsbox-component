const { defineComponent } = require("../jsbox-component");

module.exports = defineComponent({
  name: "Accumulator",

  // props定义了一系列在组件可传入的属性，可直接通过视图对象获取
  props: {
    value: 0 // 属性 'value' 的默认值为0
  },

  // methods定义了一系列方法，可直接通过视图对象调用
  methods: {

    /**
     * 将值的变化显示到页面上
     * @param {*} view 视图对象
     */
    _update(view) {
      this.events.didValueChanged(this.props.value); // 当值发生变化时通知事件
      view.get("label").text = this.props.value.toString();
    },

    /**
     * 给value加上一个数
     * @param {*} view 视图对象
     * @param {number} value 增加的值
     */
    increase(view, value = 1) {
      this.props.value += value;
      this.methods._update(view);
    },

    /**
     * 重置value属性的值
     * @param {*} view 视图对象
     * @param {number} value 初始值
     */
    reset(view, value = 0) {
      this.props.value = value;
      this.methods._update(view);
    }
  },

  // events定义了组件支持的一系列事件
  events: ["didValueChanged"],

  render() {
    return {
      type: "view",

      // 当组合多个组件时，要用一个父组件包裹起来
      views: [
        {
          type: "button",
          props: {
            title: "+ 1"
          },
          layout(make, view) {
            make.left.inset(0);
            make.centerY.equalTo(view.super);
          },
          events: {
            tapped(sender) {
              this.methods.increase(sender.super); // 调用methods里的increase方法
            }
          }
        },
        {
          type: "label",
          props: {
            text: this.props.value.toString(),
            align: $align.left
          },
          layout(make, view) {
            make.centerY.equalTo(view.super);
            make.left.equalTo(view.prev.right).offset(5);
          }
        }
      ]
    }
  }
})
