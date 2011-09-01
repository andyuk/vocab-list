$(function(){

	// The DOM element for a todo item...
	window.VocabList.View.VocabPair = Backbone.View.extend({

	  tagName:  "li",

	  template: _.template($('#vocabpair-template').html()),

	  events: {
	    "focus input":     "focus",
			"keypress input":  "moveNextOnEnter"
	  },

		height: null,	// set height (set in CSS) on load.

	  initialize: function() {
	    _.bindAll(this, 'render');
	    //this.model.bind('change', this.render);
	
	    this.model.view = this;
	  },

		getHeight: function() {
		
			if (this.height !== null) {
				return this.height;
			}
			this.height = $('#vocab-list li:first-child').height();
		
			return this.height;
		},

	  // Re-render the contents of the todo item.
	  render: function() {
	    $(this.el).html(this.template(this.model.toJSON()));

			// must mannually bind blur since it is not a delagate-able event.
			this.$('input').bind('blur', this.blur);

	    return this;
	  },

		moveNextOnEnter: function(e) {
			
			if (e.keyCode == 13) { 
				// manually trigger blur since it didn't happen
				this.blur();

				this.moveNext(); 
			}
			
		},

		moveNext: function() {
			
			var next_pair = $(this.el).next('li').find('input:first-child');
			
			if (next_pair.length > 0) {
				
				next_pair.focus();

			} else {
				
				MyApp.create();				
			}
		},

	  focus: function(e) {

			$('#vocab-list li.active').removeClass('active');
		
			var li = $(this.el);
			li.addClass('active');

			$('#edit-tools').css({top: li.position().top + this.getHeight()+1}).show();
		
			MyApp.focused_pair = this;
	  },
	
		// automatically save when the user has finished editing a word
		blur: function(e) {
			
			// unfortunately "blur" does not work for delegate-able events.
			// let's manually set "this"
			var self = MyApp.focused_pair;
			
			var update = {
					a: self.$('input[name=a]').val(),
					b: self.$('input[name=b]').val()
			};

			self.model.save(update);
			
			console.log('blurred, saved: ' + JSON.stringify(self.model));
		},

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