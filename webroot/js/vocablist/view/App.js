$(function(){

  // Our overall **AppView** is the top-level piece of UI.
  window.VocabList.View.App = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#container"),

		focused_pair: null,	// this is set when a row is highlighted
		list: null, 

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #add-button":  "create",
      "click #remove-button": "remove"
    },

    initialize: function() {
			// make sure this refers to this AppView
      _.bindAll(this, 'addOne', 'addAll', 'render');

			this.list = new VocabList.Collection; 

      this.list.bind('add',     this.addOne);
      this.list.bind('reset',   this.addAll);
      this.list.bind('all',     this.render);

			this.initEditTools();			
    },

		initEditTools: function() {
			
			var edit_tool = $('#edit-tools');
			var container = this.el;
			var left_position = (container.position().left + container.width())  - edit_tool.width()-16;
			$('#edit-tools').css({left: left_position});
		},

    // Re-rendering the App just means refreshing the statistics -- the rest
    // of the app doesn't change.
    render: function() {
      /*this.$('#todo-stats').html(this.statsTemplate({
        total:      Todos.length,
        done:       Todos.done().length,
        remaining:  Todos.remaining().length
      }));*/
    },

    addOne: function(pair) {
      var view = new VocabList.View.VocabPair({model: pair});

      this.$("#vocab").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.list.each(this.addOne);
    },

    create: function(e) {
      
			var new_pair = this.list.create(this.newAttributes());
			MyApp.$('section:last-child input:first-child').focus();
    },
		
    // Generate the attributes for a new Todo item.
    newAttributes: function() {
      return {
        a: '',
				b: ''
        //order:   Todos.nextOrder()
      };
    },

		remove: function() {
			
			// find next pair to focus on
			var next_pair = $(this.focused_pair.el).next('section').find('input:first-child');
			
			if (next_pair.length === 0) {
				
				next_pair = $(this.focused_pair.el).prev('section').find('input:first-child');
			}
						
			this.focused_pair.clear();

			if (next_pair.length > 0) {
				
				next_pair.trigger('focus');
				
			}	else {
				
				this.create();
			}
		}
		
  });
});