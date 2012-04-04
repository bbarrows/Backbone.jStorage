# Backbone jstorage Adapter v1.0

TODO
Current Issues you need to set a models ID so you know where to find it however if you do it wants to update not create

I started with Backbone.localStorage (http://documentup.com/jeromegn/backbone.localStorage) and used (https://github.com/andris9/jStorage) so that I would have local persisting model/collections that should work wiht IE6+

## Usage

Include Backbone.jStorage after having included Backbone.js:

```html
<script type="text/javascript" src="backbone.js"></script>
<script type="text/javascript" src="jstorage.js"></script>
<script type="text/javascript" src="backbone.jstorage.js"></script>
```

Create a collection or model with a jStorage attribute:

```javascript
var Book = Backbone.Model.extend({
	initialize: function(attributes, options) {
		attributes = attributes || {};
		this.attributes.title = attributes.title;
	},					
	jStorage: new Backbone.jStorage("Books"),
});	
```

This should not interfere with url based fetching.

NOTE: To use this in your applicaiton you will probably want to set the Model's id attribute
so that you load and save the same object. Otherwise this library creates a new random id for 
your object. For example:

var best_book = new Book({ title: "My Book" })
best_book.set('id',"LatestBook");

Now I can save it:
best_book.save()

and also retreive it:
best_book.fetch()

and it will actually be the same object.

## Credits
Started from http://documentup.com/jeromegn/backbone.localStorage

## Licensed

Licensed under MIT license

Copyright (c) 2012 Brad Barrows

Permission is hereby granted, free of charge, to any person obtaining
a copy of this software and associated documentation files (the
"Software"), to deal in the Software without restriction, including
without limitation the rights to use, copy, modify, merge, publish,
distribute, sublicense, and/or sell copies of the Software, and to
permit persons to whom the Software is furnished to do so, subject to
the following conditions:

The above copyright notice and this permission notice shall be
included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND,
EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND
NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE
LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION
OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION
WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.