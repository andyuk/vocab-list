$(function(){

  // Our overall **AppView** is the top-level piece of UI.
  window.VocabList.View.App = Backbone.View.extend({

    // Instead of generating a new element, bind to the existing skeleton of
    // the App already present in the HTML.
    el: $("#container"),

		focused_pair: null,	// this is set when a row is highlighted

    // Our template for the line of statistics at the bottom of the app.
    //statsTemplate: _.template($('#stats-template').html()),

    // Delegated events for creating new items, and clearing completed ones.
    events: {
      "click #add-button":  "create",
      "click #remove-button": "remove"
    },

    // At initialization we bind to the relevant events on the `Todos`
    // collection, when items are added or changed. Kick things off by
    // loading any preexisting todos that might be saved in *localStorage*.
    initialize: function() {
			// make sure this refers to this AppView
      _.bindAll(this, 'addOne', 'addAll', 'render');

      //this.input    = this.$("#new-todo");

      MyList.bind('add',     this.addOne);
      MyList.bind('reset',   this.addAll);
      MyList.bind('all',     this.render);

      MyList.fetch();
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
      MyList.each(this.addOne);
    },

    create: function(e) {
      //if (e.keyCode != 13) return;
      MyList.create(this.newAttributes());
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
			
			this.focused_pair.clear();
			
			// TODO: handle case if this is the last item
			this.$('section:first-child input:first-child').trigger('focus');
		},

/*
    // If you hit return in the main input field, create new **Todo** model,
    // persisting it to *localStorage*.
    createOnEnter: function(e) {
      if (e.keyCode != 13) return;
      Todos.create(this.newAttributes());
      this.input.val('');
    },

    // Clear all done todo items, destroying their models.
    clearCompleted: function() {
      _.each(Todos.done(), function(todo){ todo.clear(); });
      return false;
    },

    // Lazily show the tooltip that tells you to press `enter` to save
    // a new todo item, after one second.
    showTooltip: function(e) {
      var tooltip = this.$(".ui-tooltip-top");
      var val = this.input.val();
      tooltip.fadeOut();
      if (this.tooltipTimeout) clearTimeout(this.tooltipTimeout);
      if (val == '' || val == this.input.attr('placeholder')) return;
      var show = function(){ tooltip.show().fadeIn(); };
      this.tooltipTimeout = _.delay(show, 1000);
    }*/

  });
});