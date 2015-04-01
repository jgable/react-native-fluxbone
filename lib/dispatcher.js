/**
 * @providesModule fluxbone-dispatcher
 */

var _ = require('lodash');
var Flux = require('flux');
var FluxDispatcher = Flux.Dispatcher;

/**
 * A simplified api around the basic Flux Dispatcher
 *
 * @constructor
 */
function SimpleDispatcher() {
  this.dispatcher = new FluxDispatcher();
}

_.extend(SimpleDispatcher.prototype, /** @lends SimpleDispatcher.prototype */ {
  /**
   * Register a collection of callbacks to action types
   * @param {Object} events - A mapping of action types to callbacks
   * @param {Object} [context=null] - The context applied to the callback
   * @returns {string} The dispatcher token to use for unregister or waitFor
   */
  register: function (events, context) {
    if (!_.isObject(events)) {
      console.warn('Only registration objects can be passed to dispatcher.register()');
      return;
    }

    return this.dispatcher.register(function (payload) {
      // Switch statements be damned...
      if (events[payload.type]) {
        events[payload.type].apply(context || null, [payload.data]);
      }
    });
  },

  /**
   * Unregister a callback by token
   *
   * @param {string} token - The dispatch token returned from the register call
   */
  unregister: function (token) {
    this.dispatcher.unregister(token);
  },

  /**
   * Unregister all callback for this dispatcher (Mostly for testing)
   */
  unregisterAll: function () {
    // A bit heavy handed here...
    this.dispatcher = new FluxDispatcher();
  },

  /**
   * Dispatch an action by name
   *
   * @param {string} type - Name of the action
   * @param {Object|string|number|boolean} data - The payload of the action
   */
  dispatch: function (type, data) {
    if (!_.isString(type)) {
      console.warn('Action types are required when calling dispatcher.dispatch()');
      return;
    }

    this.dispatcher.dispatch({
      type: type,
      data: data
    });
  },

  /**
   * Wait for another callback to occur before continuing
   *
   * @param {string|string[]|Store} token - The collection of dispatch tokens to wait on
   */
  waitFor: function (token) {
    var tokens = token;
    if (!_.isArray(tokens)) {
      tokens = [tokens];
    }

    tokens = tokens.map(function (token) {
      // Allow passing stores straight and we grab the dispatcherToken
      return token.dispatcherToken || token;
    });

    return this.dispatcher.waitFor(tokens);
  }
});

module.exports = new SimpleDispatcher();
