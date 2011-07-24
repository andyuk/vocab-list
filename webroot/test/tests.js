// documentation on writing tests here: http://docs.jquery.com/QUnit
// example tests: https://github.com/jquery/qunit/blob/master/test/same.js

// below are some general tests but feel free to delete them.

module("example tests");
test('HTML5 Boilerplate is sweet',function(){
  expect(1);
  equals('boilerplate'.replace('boilerplate','sweet'),'sweet','Yes. HTML5 Boilerplate is, in fact, sweet');
  
})

// these test things from plugins.js
test('localStorage Tests',function(){
  expect(2);

	window.VocabList = new VocabList;
	//console.log(VocabList.toJSON());

	var pair = new VocabPair ({a: 'der Tisch', b:'table'});
	
	var pair = VocabList.create(pair);
	//console.log(t1);
	
	ok(pair.id !== undefined, 'created record, id set ok');

	pair.destroy({success: function(model, response) {
	  ok(true, 'successfully destroyed');
	}});
})

