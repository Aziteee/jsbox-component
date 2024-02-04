const { allocateId, deepClone } = require("./utils");

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
  return function (arg) {
    if (typeof arg === "string") {
      const id = arg;

      if (!Array.isArray(template.props)) {
        return new Proxy($(id), {
          get(obj, prop) {
            if (template.props && template.props[prop]?.get) {
              return template.props[prop].get(obj);
            } else if (template.methods && template.methods[prop]) {
              return function (value) {
                return template.methods[prop](obj, value);
              }
            } else return obj[prop];
          },
          set(obj, prop, value) {
            if (template.props && template.props[prop]?.set) {
              template.props[prop].set(obj, value);
            } else {
              obj[prop] = value;
            }
          }
        });
      } else {
        return $(id);
      }
    } else {
      const view = arg;
      const component = deepClone(template);

      if (view.props && template.props) {
        let keyIterator = [];
        if (Array.isArray(template.props)) {
          component.props = {};
          keyIterator = template.props;
        } else {
          keyIterator = Object.keys(template.props);
        }
        for (let propKey of keyIterator) {
          if (template.props[propKey]?.value) {
            component.props[propKey] = template.props[propKey].value;
          }
          if (view.props[propKey]) {
            component.props[propKey] = view.props[propKey];
          }
        }
      }

      if (view.events && template.events) {
        component.events = {};
        for (let eventKey of template.events) {
          if (view.events[eventKey]) {
            component.events[eventKey] = view.events[eventKey];
          }
        }
      }

      const renderedView = component.render();
      renderedView.layout = view.layout;

      bindEventsFunction(renderedView, component);

      if (!renderedView.props) {
        renderedView.props = {}
      }
      renderedView.props.id = view.props?.id || allocateId(template.name);

      return renderedView;
    }
  }
}

module.exports = {
  defineComponent
}
