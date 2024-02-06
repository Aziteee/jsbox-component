const { allocateId } = require("./utils");
const { get } = require("./get");

function bindEventsFunction(view, thisArg) {
  if (view.events) {
    for (let eventKey of Object.keys(view.events)) {
      view.events[eventKey] = view.events[eventKey].bind(thisArg);
    }
  }
  if (view.views) {
    for (let i in view.views) {
      bindEventsFunction(view.views[i], thisArg);
    }
  }
  return view;
}

function defineComponent(template) {
  return function (view) {
    if (!view.props) view.props = {};
    if (!view.events) view.events = {};

    let component = {
      name: template.name,
      id: view.props?.id || allocateId(template.name),
      props: {},
      methods: {},
      events: {}
    };

    if (template.props) {
      if (Array.isArray(template.props)) {
        template.props.forEach(propName => {
          if (propName in view.props && !propName.startsWith("_")) {
            component.props[propName] = view.props[propName];
          } else {
            component.props[propName] = null;
          }
        });
      } else {
        Object.keys(template.props).forEach((propName) => {
          if (propName in view.props && !propName.startsWith("_")) {
            component.props[propName] = view.props[propName];
          } else {
            component.props[propName] = template.props[propName];
          }
        })
      }
    }

    component.props = new Proxy(component.props, {
      set(props, propName, value) {
        const oldValue = props[propName];
        props[propName] = value;
        if (template.watch && propName in template.watch) {
          template.watch[propName].call(component, value, oldValue);
        }
      }
    })

    if (template.events) {
      template.events.forEach(eventName => {
        if (eventName in view.events) {
          component.events[eventName] = view.events[eventName];
        } else {
          component.events[eventName] = new Function();
        }
      });
    }

    if (template.methods) {
      Object.keys(template.methods).forEach((methodName) => {
        component.methods[methodName] = template.methods[methodName].bind(component);
      })
    }

    component = new Proxy(component, {
      get(obj, propName) {
        if (propName === "view") {
          return $(obj.id);
        } else return obj[propName];
      }
    });

    const renderedView = template.render.call(component);
    renderedView.layout = view.layout;

    bindEventsFunction(renderedView, component);

    window.$components[component.id] = component;

    if (!renderedView.props) renderedView.props = {};
    renderedView.props.id = component.id;

    return renderedView;
  }
}

module.exports = {
  defineComponent
}
