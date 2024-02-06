
/**
 * The view object to be rendered in JSBox
 * @typedef {Object} View
 * @property {string|ComponentBuilder} type 
 * @property {Object<string, any>} props
 * @property {Function} layout
 * @property {Array<View>} views
 * @property {Object<string, Function>} events
 */

/**
 * Return of the 'defineComponent' method
 * @typedef {Function} ComponentBuilder
 * @property {View} view
 * @return {View}
 */
