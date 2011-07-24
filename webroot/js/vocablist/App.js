window.VocabList = {
	View: {},
	Model: {}
};

$(function(){

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	window.VocabList.Collection = Backbone.Collection.extend({

	  // Reference to this collection's model.
	  model: VocabList.Model.VocabPair,

	  // Save all of the todo items under the `"todos"` namespace.
	  localStorage: new Store("vocablist")

	});

  window.MyList = new VocabList.Collection;  
	window.MyApp = new VocabList.View.App;

});
