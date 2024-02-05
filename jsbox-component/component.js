const { allocateId } = require("./utils");

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

    const component = {
      name: "",
      props: {},
      methods: {},
      events: {}
    };

    component.name = template.name;

    if (template.props) {
      if (Array.isArray(template.props)) {
        template.props.forEach(propName => {
          if (propName in view.props) {
            component.props[propName] = view.props[propName];
          } else {
            component.props[propName] = null;
          }
        });
      } else {
        Object.keys(template.props).forEach((propName) => {
          if (propName in view.props) {
            component.props[propName] = view.props[propName];
          } else {
            component.props[propName] = template.props[propName];
          }
        })
      }
    }

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

    const renderedView = template.render.call(component);
    renderedView.layout = view.layout;

    bindEventsFunction(renderedView, component);

    const id = view.props?.id || allocateId(template.name);
    window.$components[id] = component;

    if (!renderedView.props) {
      renderedView.props = {}
    }
    renderedView.props.id = id

    return renderedView;
  }
}

module.exports = {
  defineComponent
}
