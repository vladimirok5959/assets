var helper = {};
helper.toHtmlObject = function(htmlCode) {
	var div = document.createElement('div');
	div.innerHTML = htmlCode;
	return div.firstChild;
};

helper.removeClass = function(obj, className) {
	if(helper.hasClass(obj, className)) {
		var reg = new RegExp('(\\s|^)' + className + '(\\s|$)');
		obj.className = obj.className.replace(reg, ' ').trim();
	};
};

helper.hasScrollBar = function(tag) {
	return (Math.max(tag.scrollHeight, tag.offsetHeight) > window.innerHeight);
};

helper.hasClass = function(obj, className) {
	return !!obj.className.match(new RegExp('(\\s|^)' + className + '(\\s|$)'));
};

helper.getScrollWidth = function() {
	var outer = document.createElement('div');
	outer.style.visibility = 'hidden';
	outer.style.width = '100px';
	outer.style.msOverflowStyle = 'scrollbar';
	document.body.appendChild(outer);
	var widthNoScroll = outer.offsetWidth;
	outer.style.overflow = 'scroll';
	var inner = document.createElement('div');
	inner.style.width = '100%';
	outer.appendChild(inner);
	var widthWithScroll = inner.offsetWidth;
	outer.parentNode.removeChild(outer);
	return widthNoScroll - widthWithScroll;
};

helper.addClass = function(obj, className) {
	if(!helper.hasClass(obj, className)) obj.className += " " + className;
};
