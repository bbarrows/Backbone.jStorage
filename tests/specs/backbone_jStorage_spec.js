(function() {
	describe('Functional Tests', function() {
		describe('Models', function() {
			it('saves, fetches, destroys, and updates models', function() {

				//Clear out jStorage
				var x = $.jStorage.index(); for (k in x) { $.jStorage.deleteKey(x[k]) }
				$.jStorage.flush();

				var Book = Backbone.Model.extend({
					initialize: function(attributes, options) {
						attributes = attributes || {};
						this.attributes.title = attributes.title;
					},					
					jStorage: new Backbone.jStorage("BooksTest4"),
				});	

				runs(function() {
					this.firstBook = new Book({title: 'Catch-22'});

					//When using this in your own projects you will probably want to set the 
					//model's id so that you load and save the same object everytime you save
					//and fetch
					//this.firstBook.set('id', "SameIDEverytime");
					
					expect(this.firstBook.attributes.title).toEqual('Catch-22');
					this.firstBook.attributes.title = "Changed";
					this.firstBook.save();
					expect(this.firstBook.attributes.title).toEqual('Changed');

					//Model.save generates an ID for a model if it dosen't have one
					//which means it isNew to backbone

					this.loadedBook = new Book({title: 'Catch-22'});
					this.loadedBook.set('id', this.firstBook.id);
					this.loadedBook.fetch();
					expect(this.loadedBook.attributes.title).toEqual('Changed');

					this.loadedBook.attributes.title = "Changed again!";
					this.loadedBook.save();
					expect(this.loadedBook.attributes.title).toEqual('Changed again!');
					
					this.thirdBook = new Book({title: 'Catch-22'});
					this.thirdBook.set('id', this.firstBook.id);
					this.thirdBook.fetch();
					expect(this.thirdBook.attributes.title).toEqual('Changed again!');

					this.destroyableBook = new Book({title: 'Destroyable'});
					this.destroyableBook.set('id', "destroyableID");
					this.destroyableBook.save();
					expect(this.destroyableBook.attributes.title).toEqual('Destroyable');
					this.destroyableBook.attributes.title = "ChangedIt";
					this.destroyableBook.fetch();
					//expect(this.destroyableBook.attributes.title).toEqual('Destroyable');
					this.destroyableBook.destroy();

					this.destroyableBook = new Book({title: 'ShouldBeGone'});
					this.destroyableBook.set('id', "destroyableID");	
					this.destroyableBook.fetch();
					expect(this.destroyableBook.attributes.title).toEqual('ShouldBeGone');

				});
			});
		});

		describe('Collections', function() {
			it('saves, fetches, and updates collections. deletes models from collections', function() {

				var Book = Backbone.Model.extend({
					initialize: function(attributes, options) {
						attributes = attributes || {};
						this.attributes.title = attributes.title;
					},					
					//jStorage: new Backbone.jStorage("BooksTest"),
				});

				var Library = Backbone.Collection.extend({
					model: Book,
					jStorage: new Backbone.jStorage("LibraryTest6")
				});				

				runs(function() {
					this.firstLibrary = new Library();
					expect(this.firstLibrary.length).toEqual(0);
					this.firstLibrary.add( {title: "TestBookTitle"} );
					expect(this.firstLibrary.length).toEqual(1);
					var firstBook = this.firstLibrary.models[0];
					firstBook.set('id', "firstBook");
					firstBook.save();

					this.firstLibrary.add( {title: "Another"} );
					var secondBook = this.firstLibrary.models[1];
					secondBook.set('id', "secondBook");
					secondBook.save();
					expect(this.firstLibrary.length).toEqual(2);
					expect(secondBook.attributes.title).toEqual("Another");

					this.secondLibrary = new Library();
					this.secondLibrary.fetch();
					expect(this.secondLibrary.length).toEqual(2);
				});
			});
		});

	});
}).call(this);
