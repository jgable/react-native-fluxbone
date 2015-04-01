/**
 * @providesModule fluxbone-dispatcherEvents
 */

var _ = require('lodash');
var dispatcher = require('./dispatcher');

/**
 * A mixin that provides methods to register and unregister dispatcher
 * events.
 */
module.exports = {
  /**
   * Registers the dispatcherEvents hash
   */
  registerDispatcherEvents: function () {
    // Allow using a function or an object
    var events = _.result(this, 'dispatcherEvents');

    if (_.isUndefined(events) || _.isEmpty(events)) {
      // Bug out early if no dispatcherEvents
      return;
    }

    var registrations = {};
    _.each(events, function (funcOrName, actionType) {
      // Quick sanity check for whether there is a problem with the function/name passed
      if (!(_.isFunction(funcOrName) || _.isFunction(this[funcOrName]))) {
        console.warn('dispatcherEvent: "' + funcOrName + '" is not a function');
        return;
      }

      if (_.isFunction(funcOrName)) {
        registrations[actionType] = funcOrName;
      } else {
        registrations[actionType] = this[funcOrName];
      }

    }.bind(this));

    this.dispatcherToken = dispatcher.register(registrations, this);
  },

  /**
   * Unregisters all the dispatcherEvents
   */
  unregisterDispatcherEvents: function () {
    if (!this.dispatcherToken) {
      return;
    }

    dispatcher.unregister(this.dispatcherToken);
    this.dispatcherToken = undefined;
  }

};
