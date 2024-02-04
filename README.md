# jsbox-component

在jsbox中实现ui组件化

## 如何使用

把`jsbox-component`目录复制到你的项目中，再导入即可使用

> components文件夹中有两个小demo，以供参考

## 定义组件

使用`defineComponent`函数可以定义一个组件

`defineComponent`接收一个对象，包含以下属性

### name

组件的名称

### props

组件的属性，值可以为一个数组，也可以是一个对象

当值为数组时，定义了该组件需要的属性名

```json
props: ["name"]
```

当值为对象时，可以定义某个属性的默认值

```json
props: {
	name: "Alice"
}
```

### events

组件的事件，值为一个数组，包含了事件名

```json
events: ["didClick"]
```

### methods

组件的方法，可以通过组件的实例调用

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
const { render } = require("./jsbox-component");

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

## 修改属性值

> 参考`TodoList.js`

