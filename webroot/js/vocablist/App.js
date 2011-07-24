window.VocabList = {
	View: {},
	Model: {}
};

// Hack: This needs is defined before MyApp exists 
window.LastFocused = null;

$(function(){

	// The collection of todos is backed by *localStorage* instead of a remote
	// server.
	window.VocabList.Collection = Backbone.Collection.extend({

	  // Reference to this collection's model.
	  model: VocabList.Model.VocabPair,

	  // Save all of the todo items under the `"todos"` namespace.
	  localStorage: new Store("vocablist")

	});
	 
	window.MyApp = new VocabList.View.App;
  window.MyApp.list.fetch();

	$('#vocab section:first-child input:first-child').trigger('focus');

});
