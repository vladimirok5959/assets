var helper = {};
helper.hasClass = function(obj, className) {
	return !!obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

helper.addClass = function(obj, className) {
	if(!helper.hasClass(obj, className)) obj.className += " " + className;
};

helper.removeClass = function(obj, className) {
	if(helper.hasClass(obj, className)) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ').trim();
	};
};
