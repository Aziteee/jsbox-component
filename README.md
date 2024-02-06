# jsbox-component

在jsbox中实现ui组件化

## 如何使用

把`component.js`目录复制到你的项目中，即可导入使用

> components文件夹中有两个小demo，以供参考

## 定义组件

使用`defineComponent`函数可以定义一个组件

`defineComponent`接收一个对象，包含以下属性

### name

组件的名称

### props

组件的属性，值可以为一个数组，也可以是一个对象

当值为数组时，定义了该组件需要的属性名

```js
props: ["name"]
```

当值为对象时，可以定义某个属性的默认值

```js
props: {
	name: "Alice"
}
```

### events

组件的事件，值为一个数组，包含了事件名

```js
events: ["didClick"]
```

### methods

组件的方法，可以通过组件的实例调用

### watch

用于监听属性值的变化

### render（方法）

返回一个JSBox控件的对象

```js
render: function() {
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
```

## 渲染组件

使用`render`函数可以在页面上渲染创建的组件，使用方法与JSBox原生控件一致，但`type`字段要改为组件对象

```js
const { render } = require("component");

const GreetingButton = require("./components/GreetingButton");

render({
  views: [
    {
      type: GreetingButton,
      props: {
        name: "Alice"
      },
      layout: function(make, view) {
        make.center.equalTo(view.super)
        make.size.equalTo($size(150, 50))
      },
      events: {
        didClick() {
          console.log("clicked");
        }
      }
    }
  ]
});
```

## 获取和修改属性值

> 参考代码在`components/Accumulate.js`和`main.js`

使用`get`函数可以获取该组件的视图对象

```js
const { get } = rerquire("component");
const view = get("acc"); // 通过组件id获取视图对象
```

通过视图对象可以直接获取组件的属性值，也可以修改属性值

```js
console.log(view.value); // 10
view.value = 0;
```

通过视图对象可以调用`methods`中的定义方法

```js
view.reset();
console.log(view.value); // 0
```

## 监听属性值的变化

有时我们想在属性值变化时修改页面上的显示，这时可以通过在`defineComponent`时添加`watch`属性来监听属性值的变化。

```js
watch: {
  /**
   * 监听value属性的变化
   * @param {number} newValue 新值
   * @param {number} oldValue 旧值
   */
  value(newValue, oldValue) {
    this.events.didValueChanged(newValue); // 当值发生变化时通知事件
    this.view.get("label").text = newValue.toString(); // 通过this.view可以直接获得在页面上的视图对象
  }
}
```

