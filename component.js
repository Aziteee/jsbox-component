'use strict';

function allocateId$1(name) {
  return name + '-' + new Date().getTime().toString(36) + '-' + Math.random().toString(36).substring(2, 11);
}

var utils = {
  allocateId: allocateId$1
};

const { allocateId } = utils;

/**
 * Change the reference of 'this' in event functions
 * @param {View} view 
 * @param {*} thisArg 
 */
function bindEventsFunction(view, thisArg) {
  if (view.events) {
    Object.keys(view.events).forEach((eventKey) => {
      view.events[eventKey] = view.events[eventKey].bind(thisArg);
    });
  }
  if (view.views) {
    for (let i in view.views) {
      bindEventsFunction(view.views[i], thisArg);
    }
  }
  return view;
}

/**
 * @typedef {Function} Render
 * @property {} view 
 */

/**
 * @typedef {Object} Template
 * @property {string} name Component name
 * @property {Object<string, any>|Array<string>} props Component properties
 * @property {Array<string>} events Component events
 * @property {Object<string, Function>} methods Component events
 * @property {Function} render 
 */

/**
 * @param {Template} template The template to define a component
 * @returns {ComponentBuilder} The builder function of the component
 * @example
 * // see component/Accumulator.js
 */
function defineComponent$1(template) {
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
        });
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
    });

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
      });
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

var component = {
  defineComponent: defineComponent$1
};

/**
 * Transform your custom component to the form that JSBox can recognize
 * @param {View} view 
 * @returns 
 */
function trans$1(view) {
  if (view.views) {
    for (let i in view.views) {
      view.views[i] = trans$1(view.views[i]);
    }
  }
  if (view.type && typeof view.type !== "string") {
    const ViewBuilder = view.type;
    view = ViewBuilder(view);
  }
  return view;
}

var trans_1 = {
  trans: trans$1
};

/**
 * Get the view instance on the screen (same as $("id") but it can approach some custom props or methods)
 * @param {*} id The id of the component (defined in props)
 * @returns 
 */
function get$1(id) {
  const component = window.$components[id];
  const view = $(id);
  if (component) {
    return new Proxy(view, {
      get(obj, propName) {
        if (propName.startsWith("_")) {
          return obj[propName];
        }
        
        if (propName in component.props) {
          return component.props[propName];
        } else if (propName in component.methods) {
          return component.methods[propName];
        } else return obj[propName];
      }
    })
  } else {
    return view;
  }
}

var get_1 = {
  get: get$1
};

const { defineComponent } = component;
const { trans } = trans_1;
const { get } = get_1;

/**
 * Render the view on the screen (same as $ui.render)
 * @param {View} view 
 */
function render(view) {
  view = trans(view);
  $ui.render(view);
}

/**
 * Same as $ui.push
 * @param {View} view 
 */
function push(view) {
  view = trans(view);
  $ui.push(view);
}

window.$components = {};

var jsboxComponent = {
  defineComponent,
  render,
  push,
  trans,
  get
};
var jsboxComponent_1 = jsboxComponent.defineComponent;
var jsboxComponent_2 = jsboxComponent.render;
var jsboxComponent_3 = jsboxComponent.push;
var jsboxComponent_4 = jsboxComponent.trans;
var jsboxComponent_5 = jsboxComponent.get;

exports.default = jsboxComponent;
exports.defineComponent = jsboxComponent_1;
exports.get = jsboxComponent_5;
exports.push = jsboxComponent_3;
exports.render = jsboxComponent_2;
exports.trans = jsboxComponent_4;
