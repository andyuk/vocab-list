$(function() {

	// set-up icons using Raphael
	
	var paper = Raphael("add-button", 32, 32);
	var hide = {fill: "#FFF", opacity: 0};

	var icon = paper.path(icon_add).attr({fill: "gray", stroke: "none"}); //#2DE04E
	var icon_hover = paper.path(icon_add).attr({fill: "#2AC747", stroke: "none", opacity: 0});
	
	paper
		.rect(0, 0, 32, 32)
		.attr(hide);
		//.bind('touchend', vocablist.add)
		/*
		Hover is detected as click on touch devices
		.hover(function () {
	  		icon_hover.stop().animate({opacity: 1}, 200);
	 		}, function () {
	 			icon_hover.stop().attr({opacity: 0});
	 		})*/
		//.click(vocablist.add);
});

// Raphaël icons

var icon_add = "M25.979,12.896 19.312,12.896 19.312,6.229 12.647,6.229 12.647,12.896 5.979,12.896 5.979,19.562 12.647,19.562 12.647,26.229 19.312,26.229 19.312,19.562 25.979,19.562z";

