/**
 * Backbone jStorage Adapter
 * https://github.com/bbarrows/Backbone.jstorage
 * Forked from backbone.localStorage.
 * All the same code really except I switched out localStorage with jStorage
 * 
 */

(function() {
// A simple module to replace `Backbone.sync` with *localStorage*-based
// persistence. Models are given GUIDS, and saved into a JSON object. Simple
// as that.

// Generate four random hex digits.
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};

// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// Our Store is represented by a single JS object in *jStorage*. Create it
// with a meaningful name, like the name you'd give a table.
// window.Store is deprectated, use Backbone.jStorage instead
Backbone.jStorage = window.Store = function(name) {
  this.name = name;
  this.records_order = $.jStorage.get(this.name, []);
};

_.extend(Backbone.jStorage.prototype, {

  // Save the current state of the **Store** to *jStorage*.
  save: function() {
    $.jStorage.set(this.name, this.records_order);
  },

  // Add a model, giving it a (hopefully)-unique GUID, if it doesn't already
  // have an id of it's own.
  create: function(model) {
    if (!model.id) model.id = model.attributes[model.idAttribute] = guid();
    $.jStorage.set(this.name+"-"+model.id, model);
    this.records_order.push(model.id.toString());
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    $.jStorage.set(this.name+"-"+model.id, model);
    if (!_.include(this.records_order, model.id.toString())) {
      this.records_order.push(model.id.toString());
    }
    this.save();
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return $.jStorage.get(this.name+"-"+model.id);
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return _(this.records_order).chain()
        .map(function(id){return $.jStorage.get(this.name+"-"+id);}, this)
        .compact()
        .value();
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    $.jStorage.deleteKey(this.name+"-"+model.id);
    this.records_order = _.reject(this.records_order, function(record_id){return record_id == model.id.toString();});
    this.save();
    return model;
  },

});

// localSync delegate to the model or collection's
// *jStorage* property, which should be an instance of `Store`.
// window.Store.sync and Backbone.localSync is deprectated, use Backbone.jStorage.sync instead
Backbone.jStorage.sync = window.Store.sync = Backbone.localSync = function(method, model, options, error) {
  var store = model.jStorage || model.collection.jStorage;

  // Backwards compatibility with Backbone <= 0.3.3
  if (typeof options == 'function') {
    options = {
      success: options,
      error: error
    };
  }

  var resp;
  
  switch (method) {
    case "read":    resp = model.id != undefined ? store.find(model) : store.findAll(); break;
    case "create":  resp = store.create(model);                            break;
    case "update":  resp = store.update(model);                            break;
    case "delete":  resp = store.destroy(model);                           break;
  }

  if (resp) {
    options.success(resp);
  } else {
    options.error("Record not found");
  }
};

Backbone.ajaxSync = Backbone.sync;

Backbone.getSyncMethod = function(model) {
	if(model.jStorage || (model.collection && model.collection.jStorage))
	{
		return Backbone.localSync;
	}

	return Backbone.ajaxSync;
};

// Override 'Backbone.sync' to default to localSync,
// the original 'Backbone.sync' is still available in 'Backbone.ajaxSync'
Backbone.sync = function(method, model, options, error) {
	Backbone.getSyncMethod(model).apply(this, [method, model, options, error]);
};

})();