/* tmpl.js
 * ---------- */

var tmpl = function render(name, args) {
	if (!tmpl.templates.hasOwnProperty(name)) return;
	var tmp = $(tmpl.templates[name]).clone().wrap('<div>').parent().html();
	if (args != undefined) {
		$.each(args, function(i,a) {
			tmp = tmp.replace('{{'+i+'}}', a);
		})
	}
	return $(tmp);
}

tmpl.templates = {};

tmpl.load = function() {
	$('[template]').each(function(i,t) {
		var tp = $(t);
		var id = tp.attr('template');
		tp.removeAttr('template');
		tmpl.templates[id] = tp[0];
		$(t).remove();
	})
}
