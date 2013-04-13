/**
 * Beard tests
 *
 * Hairy templates
 *
 * http://asbjornenge.com/beard
 * @asbjornenge
 *
 * BSD
 **/

tmpl.load()

module("Basic")

test("Replace text", function() {
	var t = tmpl('text', {text:"My text"})
	equal(t.text(), "My text")
});

test("Replace attribute", function() {
	var t = tmpl('attribute', {value:"Some value"})
	equal(t.find('input').val(), "Some value")
});

// TODO
test("Replace html", function() {
  ok( 1 == "1", "Passed!" );
});

test("Filters", function() {
	var time = new Date().getTime();
	var correct = new Date().toJSON().slice(0,10)

	tmpl.filters['fixdate'] = function(data) {
		data.extracted = correct
	}

	var t = tmpl('filters', {value:time})
	notEqual(t.find('input:first').val(), correct)
	equal(t.find('input:last').val(), correct)
});

module("databind")

var change = document.createEvent('HTMLEvents');
change.initEvent('change', false, false);

test("Databind", function() {
	var obj = {
		name  : "Asbjorn",
		drink : "Coffee"
	}
	var t = tmpl('databind', obj);
	t.find('input').val("Pourover by Chemex Coffee");
	t.find('input')[0].dispatchEvent(change);
	equal(obj.drink, "Pourover by Chemex Coffee");
});



