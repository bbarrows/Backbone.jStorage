/**
 * Backbone jStorage Adapter
 * https://github.com/bbarrows/Backbone.jstorage
 */

(function() {

//GUID code form Backbone.localstorage, used to generate a "unique" id 
//for new models (aka models with no id).
function S4() {
   return (((1+Math.random())*0x10000)|0).toString(16).substring(1);
};
// Generate a pseudo-GUID by concatenating random hexadecimal.
function guid() {
   return (S4()+S4()+"-"+S4()+"-"+S4()+"-"+S4()+"-"+S4()+S4()+S4());
};

// The store is actually an array of models/collections under the
// name provided when instatiating a Backbone.jStorage
Backbone.jStorage = window.Store = function(name) {
  this.name = name;
  this.records = $.jStorage.get(this.name, []);
};

_.extend(Backbone.jStorage.prototype, {

  save: function() {
    $.jStorage.set(this.name, this.records);
  },

  create: function(model) {
    if (!model.id) model.id = model.attributes[model.idAttribute] = guid();
    this.records.push(model);
    this.save();
    return model;
  },

  // Update a model by replacing its copy in `this.data`.
  update: function(model) {
    var index = -1;
    var old = _(this.records).find( function(m) {
      index++;
      return (m.id == model.id);
    });
    if (old) {
      this.records[index] = model;
    } else {
      this.create(model);
    }
    
    this.save();
    return model;
  },

  // Retrieve a model from `this.data` by id.
  find: function(model) {
    return _(this.records).find( function(m) {
      return (m.id == model.id);
    });
  },

  // Return the array of all models currently in storage.
  findAll: function() {
    return this.records;
  },

  // Delete a model from `this.data`, returning it.
  destroy: function(model) {
    var index = -1;
    _(this.records).find(function(m) {
      index++;
      return m.cid == model.cid;
    });
    this.records.splice(index, 1);
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