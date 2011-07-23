
var vocablist = {
	
	section_height: null,
	
	add: function() {

		var section = $('#vocab section:first-child').clone();
		section.find('input').val('');
		
		$('#vocab').append(section);
		
		section.find('input:first-child').focus();
	},
	
	inputFocus: function() {
		
		$('#vocab section.active').removeClass('active');
		
		var section = $(this).parent();
		section.addClass('active');
		
		$('#edit-tools').css({top: section.position().top + vocablist.section_height+1}).show();
	}
};

$(function() {


	// set position of edit vocab tool
	var edit_tool = $('#edit-tools');
	var container = $('#container');
	var left_position = (container.position().left + container.width())  - edit_tool.width()-16;
	$('#edit-tools').css({left: left_position});

	vocablist.section_height = $('#vocab section:first-child').height();

	// bind events

	$('#vocab section input').live('focus', vocablist.inputFocus);


	$('#vocab section:first-child input:first-child').trigger('focus');


	// set-up icons

	var paper = Raphael("icon-add", 32, 32);
	var hide = {fill: "#FFF", opacity: 0};

	var icon = paper.path(icon_add).attr({fill: "gray", stroke: "none"}); //#2DE04E
	var icon_hover = paper.path(icon_add).attr({fill: "#2AC747", stroke: "none", opacity: 0});
	
	paper
		.rect(0, 0, 32, 32)
		.attr(hide)
		.hover(function () {
	  		icon_hover.stop().animate({opacity: 1}, 200);
   		}, function () {
   			icon_hover.stop().attr({opacity: 0});
   		})
		.click(vocablist.add);
		
});


// Raphaël icons

var icon_add = "M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z";

