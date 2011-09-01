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

		// set width of text boxes via JS since CSS cannot calculate 50% of screen + 10px padding.
		/*resizeTextBoxes: function() {
			
			var input_width = ($('body').width()-42/2); // 42 is magic number
			console.log('setting width as ' + input_width)
			$('#vocab-list li input').css('width', input_width);
		},*/

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
	
			// hide deleted rows
			if ("_deleted" in pair.attributes) {
				return;
			}
	
      var view = new VocabList.View.VocabPair({model: pair});

      this.$("#vocab-list").append(view.render().el);
    },

    // Add all items in the **Todos** collection at once.
    addAll: function() {
      this.list.each(this.addOne);
    },

    create: function(e) {
      
			var new_pair = this.list.create(this.newAttributes());
			MyApp.$('li:last-child input:first-child').focus();
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
			var next_pair = $(this.focused_pair.el).next('li').find('input:first-child');
			
			if (next_pair.length === 0) {
				
				next_pair = $(this.focused_pair.el).prev('li').find('input:first-child');
			}

			console.log('removing line');						
			this.focused_pair.clear();

			if (next_pair.length > 0) {
				
				next_pair.trigger('focus');
				
			}	else {
				
				this.create();
			}
		}
		
  });
});