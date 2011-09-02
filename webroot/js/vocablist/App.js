window.VocabList = {
	View: {},
	Model: {}
};

// Hack: This needs is defined before MyApp exists 
window.LastFocused = null;

$(function(){

	Backbone.Model.prototype.idAttribute = "_id";

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	window.VocabList.Collection = Backbone.Collection.extend({

	  // Reference to this collection's model.
	  model: VocabList.Model.VocabPair,

	  // Save all of the todo items under the `"todos"` namespace.
	  localStorage: new TinyBrowserCouch.LocalStorage("vocablist"),
		//localStorage: new Store('vocablist'),
	
		// Data is synced with CouchDB
		couchDB: new TinyBrowserCouch.CouchDB("/api/0.1/")
	});
	
	window.MyApp = new VocabList.View.App;
	window.MyApp.list.fetch();
  //window.MyApp.list.fetch({success: function() {
	
		// Pull latest data from remote server after loading local data.
		/*
		console.log('pulling data from couch');
		window.MyApp.list.localStorage.replicator.pull(window.MyApp.list.couchDB);
		window.MyApp.list.reset();
		window.MyApp.list.fetch();
		*/
		//window.MyApp.render();
	//}});

	$('#vocab section:first-child input:first-child').trigger('focus');
});
