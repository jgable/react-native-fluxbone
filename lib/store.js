/**
 * @providesModule fluxbone-store
 */

var _ = require('lodash');
var Backbone = require('backbone-sync-fetch');

var handleDispatcherEvents = require('./dispatcherEvents');

/** @class Store */
var Store = Backbone.Collection.extend(/** @lends Store.prototype */ {

  /**
   * Instantiate a new store from the passed in models and options.  Will attempt to load models
   * from `getInitialData` if none are passed in.
   *
   * @constructor
   * @param {Object[]} models - The models for this collection
   * @param {Object} options - The options for this collection
   */
  constructor: function (models, options) {
    models = models || this.getInitialData();

    return Backbone.Collection.apply(this, [models, options]);
  },

  /**
   * Initialize the store (called automatically on instantiation).  Registers the dispatcherEvents
   * and loads the store with
   */
  initialize: function () {
    this.registerDispatcherEvents();
  },

  /**
   * Get initial data for this collection if models aren't passed to the constructor.  Usually used
   * to load initial data from `window.PAGEDATA`.
   *
   * @example
   *
   * function () {
   *   return window.PAGEDATA && window.PAGEDATA.focusAreas;
   * }
   *
   * @returns {Object[]} The models to load
   */
  getInitialData: _.noop,

  /**
   * Get all models in plain objects.
   *
   * @returns {Object[]} All models as plain JSON
   */
  getAll: function () {
    return this.toJSON();
  },

  /**
   * Get a model by id
   *
   * @param {string} id - Id of the model to retrieve
   * @returns {Object} - A plain JSON version of the model
   */
  getSingle: function (id) {
    var found = this.get(id);

    if (found) {
      return found.toJSON();
    }
  },

  /**
   * Get a model by some criteria
   *
   * @param {Object} criteria - A hash of properties to match models on
   * @returns {Object[]} - The matching models data or an empty array
   */
  getWhere: function (criteria) {
    var found = this.where(criteria);

    if (_.isEmpty(found)) {
      return [];
    }

    return _.invoke(found, 'toJSON');
  },

  /**
   * Get a single model by some criteria
   *
   * @param {Object} criteria - A hash of properties to match models on
   * @returns {Object} - The matching model data or undefined
   */
  getSingleWhere: function (criteria) {
    var found = this.findWhere(criteria);

    return found && found.toJSON();
  }
});

// "Mixin" the dispatcherEvents handlers
_.extend(Store.prototype, handleDispatcherEvents);

module.exports = Store;
