/**
 * Beard
 *
 * Hairy templates
 *
 * http://asbjornenge.com/beard
 * @asbjornenge
 *
 * BSD
 **/

var tmpl = function render(name, obj) {
//	console.time('tmpl.js')
	if (!tmpl.templates.hasOwnProperty(name)) return;
	var tmp   = $(tmpl.templates[name]).clone()
	items = tmp[0].getElementsByTagName("*");
	for (var i = items.length; i--;) {  
	    tmpl.handle_attributes(items[i],obj);
	    tmpl.handle_textnodes(items[i],obj);
	}
	tmpl.handle_attributes(tmp[0],obj);
	tmpl.handle_textnodes(tmp[0],obj);
//	console.timeEnd('tmpl.js')
	return tmp;
}

/* PROPERTIES
 *------------------------------ */

tmpl.reg = /{{(.*?)}}/g
tmpl.templates = {};

/* EVENTS
 *------------------------------ */

tmpl.events = {}
tmpl.events.init = function() {
	var databind = document.createEvent('HTMLEvents');
    databind.initEvent('databind', false, false);
    tmpl.events['databind'] = databind;
}
tmpl.events.init();

/* FILTERS 
 *------------------------------ */

tmpl.filters = {
	extract  : function(data) {
		data.extracted = tmpl.engine.eval(data.obj,data.prop);
	},
	null     : function(data) {
		if (data.extracted == null) data.extracted = '';
	},
	undef    : function(data) {
		if (data.extracted == undefined) data.extracted = '';
	},
	databind : function(data) {
		if (data.type != 'attribute') {
			if (typeof(console) == 'object') console.log("Databind only supported for attributes");
			return;
		}
		data.node.addEventListener('change', function() {
			tmpl.engine.eval(data.obj,data.prop,this.value);
			data.node.dispatchEvent(tmpl.events.databind);
		})
	},
	replace  : function(data) {
		if (data.type == 'attribute') {
			var attr = data.node.attributes[data.attribute];
			attr.value = attr.value.replace(data.expr,data.extracted);
		}
		if (data.type == 'text') {
			var child = data.child;
			child.textContent = child.textContent.replace(data.expr,data.extracted);
		}
	},
	'default' : '@null@undef'
}

/* MATCHER 
 *------------------------------ */

tmpl.match = function(str) {
	var m = str.match(tmpl.reg)
	if (m == null || m.length == 0) return;
	var matches = []
	for (var i=m.length; i--;) {
		var match   = {filters:[],expr:m[i]}
		var filters = []
		var expr  = m[i].slice(2,-2).split('@')
		for (var j=expr.length; j--;) {
			if (j == 0) match['prop'] = expr[j]
			else filters.push(expr[j])
		}
		filters = tmpl.filters['default'].split('@').concat(filters)
		for (var k=filters.length; k--;) {
			if (tmpl.filters[filters[k]] != undefined) match.filters.push(tmpl.filters[filters[k]])
		}
		match.filters.reverse()
		matches.push(match)
	}
	return matches;
}

/* ATTRIBUTE HANDLER
 *------------------------------ */

tmpl.handle_attributes = function(node, obj) {
	var attributes = node.attributes;
	for (var j=attributes.length; j--;) {
		var matches = tmpl.match(attributes[j].value)
		if (!matches || matches.length == 0) continue;
		for (var k=matches.length;k--;) {
			var data = {
				node : node,
				obj  : obj,
				prop : matches[k].prop,
				expr : matches[k].expr,
				type : 'attribute',
				attribute : attributes[j].name
			}
			tmpl.filters.extract(data);
			for (var f in matches[k].filters) {
				matches[k].filters[f](data);
			}
			tmpl.filters.replace(data);
		}
	}
}

/* TEXTNODE HANDLER
 *------------------------------ */

tmpl.handle_textnodes = function(node, obj) {
	var childNodes = node.childNodes;
	for (var j=childNodes.length; j--;) {
		var child = childNodes[j];
		if (child.nodeType == 3) {
			var matches = tmpl.match(child.textContent)
			if (!matches || matches.length == 0) continue;
			for (var k=matches.length;k--;) {
				var data = {
					node : node,
					obj  : obj,
					prop : matches[k].prop,
					expr : matches[k].expr,
					type : 'text',
					child : child
				}
				tmpl.filters.extract(data);
				for (var f in matches[k].filters) {
					matches[k].filters[f](data);
				}
				tmpl.filters.replace(data);
			}
		}
	}
}

/* LOADER
 *------------------------------ */

tmpl.load = function() {
	$('[template]').each(function(i,t) {
		var tp = $(t);
		var id = tp.attr('template');
		tp.removeAttr('template');
		tmpl.templates[id] = tp[0];
		$(t).remove();
	})
}

/* EVAL ENGINE
 *------------------------------ */

tmpl.engine = {}
tmpl.engine.eval = function(obj,expr,val) {
	o = obj;
    s = expr.replace(/\[(\w+)\]/g, '.$1'); // convert indexes to properties
    s = expr.replace(/^\./, '');           // strip a leading dot
    var a = expr.split('.');
    var p;
    while (a.length) {
        var n = a.shift();
        if (n in o) {
        	p = o;
            o = o[n];
        } else {
            return;
        }
    }
    if (val != undefined && typeof(p) == 'object') p[n] = val;
    return o;
}


