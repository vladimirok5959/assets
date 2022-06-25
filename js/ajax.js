var ajax = {};
ajax.create = function() {
	if(typeof XMLHttpRequest !== 'undefined') {
		return new XMLHttpRequest();
	};
	var versions = [
		"MSXML2.XmlHttp.6.0",
		"MSXML2.XmlHttp.5.0",
		"MSXML2.XmlHttp.4.0",
		"MSXML2.XmlHttp.3.0",
		"MSXML2.XmlHttp.2.0",
		"Microsoft.XmlHttp"
	];
	var xhr;
	for(var i = 0; i < versions.length; i++) {
		try {
			xhr = new ActiveXObject(versions[i]);
			break;
		} catch(e) {
			// Silent
		};
	};
	return xhr;
};

ajax.send = function(url, callback, method, data, async) {
	if(async === undefined) {
		async = true;
	};
	var a = ajax.create();
	a.open(method, url, async);
	a.onreadystatechange = function() {
		// a.readyState:
		// 0 - UNSENT
		// 1 - OPENED
		// 2 - HEADERS_RECEIVED
		// 3 - LOADING
		// 4 - DONE
		callback(method, data, a.readyState, a.status, a.responseText);
	};
	if(method == 'POST') {
		a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
	};
	a.send(data);
};

ajax.get = function(url, data, callback, async) {
	var query = [];
	for(var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	};
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
};

ajax.post = function(url, data, callback, async) {
	var query = [];
	for (var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	};
	ajax.send(url, callback, 'POST', query.join('&'), async);
};
