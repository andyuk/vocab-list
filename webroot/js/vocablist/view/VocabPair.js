$(function(){

	// The DOM element for a todo item...
	window.VocabList.View.VocabPair = Backbone.View.extend({

	  //... is a list tag.
	  tagName:  "section",

	  // Cache the template function for a single item.
	  template: _.template($('#vocabpair-template').html()),

	  // The DOM events specific to an item.
	  events: {
	    "focus input":     "focus"
		/*
	    "click .check"              : "toggleDone",
	    "dblclick div.todo-content" : "edit",
	    "click span.todo-destroy"   : "clear",
	    "keypress .todo-input"      : "updateOnEnter"
			*/
	  },

		height: null,	// set height (set in CSS) on load.

	  // The TodoView listens for changes to its model, re-rendering. Since there's
	  // a one-to-one correspondence between a **Todo** and a **TodoView** in this
	  // app, we set a direct reference on the model for convenience.
	  initialize: function() {
	    _.bindAll(this, 'render', 'close');
	    this.model.bind('change', this.render);
	    this.model.view = this;
	  },

		getHeight: function() {
		
			if (this.height !== null) {
				return this.height;
			}
			this.height = $('#vocab section:first-child').height();
		
			return this.height;
		},

	  // Re-render the contents of the todo item.
	  render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));
	    //this.setContent();
	    return this;
	  },

	  // To avoid XSS (not that it would be harmful in this particular app),
	  // we use `jQuery.text` to set the contents of the todo item.
	  /*
		setContent: function() {
	    var content = this.model.get('content');
	    this.$('.todo-content').text(content);
	    this.input = this.$('.todo-input');
	    this.input.bind('blur', this.close);
	    this.input.val(content);
	  },*/

	  // Switch this view into `"editing"` mode, displaying the input field.
	  edit: function() {
	    $(this.el).addClass("editing");
	    this.input.focus();
	  },

	  // Close the `"editing"` mode, saving changes to the todo.
	  close: function() {
	    this.model.save({content: this.input.val()});
	    $(this.el).removeClass("editing");
	  },

	  focus: function(e) {

			$('#vocab section.active').removeClass('active');
		
			var section = $(this.el);
			section.addClass('active');

			$('#edit-tools').css({top: section.position().top + this.getHeight()+1}).show();
		
			MyApp.focused_pair = this;
	  },

	  // If you hit `enter`, we're through editing the item.
	  /*updateOnEnter: function(e) {
	    if (e.keyCode == 13) this.close();
	  },*/

	  // Remove this view from the DOM.
	  remove: function() {
	    $(this.el).remove();
	  },

	  // Remove the item, destroy the model.
	  clear: function() {
	    this.model.clear();
	  }

	});
	
});