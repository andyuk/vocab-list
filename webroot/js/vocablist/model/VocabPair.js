$(function(){

	window.VocabList.Model.VocabPair = Backbone.Model.extend({

	  defaults: {
	    a: '',
			b: ''
	  },

	  initialize: function() {
	    if (!this.get("a")) {
	      this.set({"a": this.defaults.a});
	    }
	    if (!this.get("b")) {
	      this.set({"b": this.defaults.b});
	    }
	  },

    // Remove this Todo from *localStorage* and delete its view.
    clear: function() {
      this.destroy();
      this.view.remove();
    }
	});
	
});