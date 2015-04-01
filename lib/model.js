/**
 * @providesModule fluxbone-model
 */

var _ = require('lodash');
var Backbone = require('backbone-sync-fetch');

var handleDispatcherEvents = require('./dispatcherEvents');

// @class Model
var Model = Backbone.Model.extend({
  initialize: function() {
    this.registerDispatcherEvents();
  }
});

// "Mixin" the dispatcherEvents handlers
_.extend(Model.prototype, handleDispatcherEvents);

module.exports = Model;
