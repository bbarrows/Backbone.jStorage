QUnit.done = function(results){
  if (results.failed)
    console.log("failed")
  else
    console.log("success")
};

$(document).ready(function() {
    var Library = Backbone.Collection.extend({
        jStorage: new Backbone.jStorage("libraryStore")
    });

    var attrs = {
        title  : 'The Tempest',
        author : 'Bill Shakespeare',
        length : 123
    };
    
    var library = null;
    
    module("jStorage on collections", {
        setup: function() { 
            $.jStorage.flush();
            library = new Library();
        }
    });
    
    test("should be empty initially", function() {
        equals(library.length, 0, 'empty initially');
        console.log("Before fetch!!")
        library.fetch();
        console.log("Library Length: " + library.length);
        equals(library.length, 0, 'empty read');
    });
    
    test("should create item", function() {
        library.create(attrs);
        equals(library.length, 1, 'one item added');
        equals(library.first().get('title'), 'The Tempest', 'title was read');
        equals(library.first().get('author'), 'Bill Shakespeare', 'author was read');
        equals(library.first().get('length'), 123, 'length was read');
    });
  
  test("should discard unsaved changes on fetch", function() {
        library.create(attrs);
        library.first().set({ 'title': "Wombat's Fun Adventure" });
        equals(library.first().get('title'), "Wombat's Fun Adventure", 'title changed, but not saved');
        library.fetch();
        equals(library.first().get('title'), 'The Tempest', 'title was read');
  });
  
  test("should persist changes", function(){
        library.create(attrs);
        equals(library.first().get('author'), 'Bill Shakespeare', 'author was read');
        console.log("Before the save!!!!!")
        library.first().save({ author: 'William Shakespeare' });
        console.log("After the save")
        library.fetch();
        equals(library.first().get('author'), 'William Shakespeare', 'verify author update');
  });
    
    test("should allow to change id", function() {
        library.create(attrs);
        library.first().save({id: '1-the-tempest', author: 'William Shakespeare'});
        equals(library.first().get('id'), '1-the-tempest', 'verify ID update');
        equals(library.first().get('title'), 'The Tempest', 'verify title is still there');
        equals(library.first().get('author'), 'William Shakespeare', 'verify author update');
        equals(library.first().get('length'), 123, 'verify length is still there');
    
    library.fetch();
    equals(library.length, 2, 'should not auto remove first object when changing ID');
    });
    
    test("should remove from collection", function() {
        _(23).times(function(index) {
            library.create({id: index});
        });
        _(library.toArray()).chain().clone().each(function(book) {
            book.destroy();
        });
        equals(library.length, 0, 'item was destroyed and library is empty');
        library.fetch()
        equals(library.length, 0, 'item was destroyed and library is empty even after fetch');
    });
  
    test("should load from session store without server request", function() {
        library.create(attrs);
        
        secondLibrary = new Library();
        secondLibrary.fetch();
        equals(1, secondLibrary.length);
    });
    
    test("should cope with arbitrary idAttributes", function() {
        var Model = Backbone.Model.extend({
            idAttribute: '_id'
        });
        var Collection = Backbone.Collection.extend({
            model: Model,
            jStorage: new Store('strangeID')
        });
        
        var collection = new Collection();
        collection.create({});
        equals(collection.first().id, collection.first().get('_id'));
    });

  
    module("jStorage on models", {
    setup: function() {
            $.jStorage.flush();
      book = new Book();
    }
    });
  
    var Book = Backbone.Model.extend({
        defaults: {
            title  : 'The Tempest',
            author : 'Bill Shakespeare',
            length : 123
        },
    jStorage : new Backbone.jStorage('TheTempest')
    });
  
  var book = null;
    
  test("should overwrite unsaved changes when fetching", function() {
    book.save()
        book.set({ 'title': "Wombat's Fun Adventure" });
        book.fetch();
        equals(book.get('title'), 'The Tempest', 'model created');
  });
  
  test("should persist changes", function(){
        book.save({ author: 'William Shakespeare'});
        book.fetch();
        equals(book.get('author'), 'William Shakespeare', 'author successfully updated');
        equals(book.get('length'), 123, 'verify length is still there');
  });

  test("should remove book when destroying", function() {
    book.save({author: 'fnord'})
    equals(Book.prototype.jStorage.findAll().length, 1, 'book removed');
    book.destroy()
    equals(Book.prototype.jStorage.findAll().length, 0, 'book removed');
  });

  test("Book should use local sync", function()
  {
    var method = Backbone.getSyncMethod(book);
    equals(method, Backbone.localSync);
  });

  var MyRemoteModel = Backbone.Model.extend();

  var remoteModel = new MyRemoteModel();

  test("remoteModel should use ajax sync", function()
  {
    var method = Backbone.getSyncMethod(remoteModel);
    equals(method, Backbone.ajaxSync);
  });
});