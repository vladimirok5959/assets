function AjaxErrorBadStatusCode(message) { this.name = 'AjaxErrorBadStatusCode'; this.message = message; };
AjaxErrorBadStatusCode.prototype = new Error();

var ajax = {loaded: false};

ajax.callTagsBefore = function(tag) {};
ajax.callTagsAfter = function(tag) {};
ajax.callFormsBefore = function(form) {};
ajax.callFormsAfter = function(form) {};
ajax.callCheckboxesBefore = function(box) {};
ajax.callCheckboxesAfter = function(box) {};

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

ajax.send = function(url, callback, method, data, async, multipart) {
	if(async === undefined) {
		async = true;
	};
	if(multipart === undefined) {
		multipart = false;
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
	if(method == 'PUT' || method == 'POST') {
		if(!multipart) {
			a.setRequestHeader('Content-type', 'application/x-www-form-urlencoded');
		};
	};
	a.send(data);
};

ajax.del = function(url, data, callback, async) {
	var query = [];
	for(var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	};
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'DELETE', null, async);
};

ajax.delJSON = function(url, data, callbackSuccess, callbackError, async) {
	ajax.del(url, data, function(method, data, readyState, status, responseText) {
		if(readyState == 4) {
			if(status == 200) {
				try {
					var r = JSON.parse(responseText);
					if(callbackSuccess) {
						callbackSuccess(method, data, readyState, status, r);
					};
				} catch(e) {
					if(callbackError) {
						callbackError(method, data, readyState, status, e);
					};
				};
			} else {
				if(callbackError) {
					var e = new AjaxErrorBadStatusCode('Bad status code '+status);
					callbackError(method, data, readyState, status, e);
				};
			};
		};
	}, async);
};

ajax.get = function(url, data, callback, async) {
	var query = [];
	for(var key in data) {
		query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
	};
	ajax.send(url + (query.length ? '?' + query.join('&') : ''), callback, 'GET', null, async);
};

ajax.getJSON = function(url, data, callbackSuccess, callbackError, async) {
	ajax.get(url, data, function(method, data, readyState, status, responseText) {
		if(readyState == 4) {
			if(status == 200) {
				try {
					var r = JSON.parse(responseText);
					if(callbackSuccess) {
						callbackSuccess(method, data, readyState, status, r);
					};
				} catch(e) {
					if(callbackError) {
						callbackError(method, data, readyState, status, e);
					};
				};
			} else {
				if(callbackError) {
					var e = new AjaxErrorBadStatusCode('Bad status code '+status);
					callbackError(method, data, readyState, status, e);
				};
			};
		};
	}, async);
};

ajax.put = function(url, data, callback, async, multipart) {
	if(multipart) {
		ajax.send(url, callback, 'PUT', data, async, multipart);
	} else {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		};
		ajax.send(url, callback, 'PUT', query.join('&'), async, multipart);
	};
};

ajax.putJSON = function(url, data, callbackSuccess, callbackError, async, multipart) {
	ajax.put(url, data, function(method, data, readyState, status, responseText) {
		if(readyState == 4) {
			if(status == 200) {
				try {
					var r = JSON.parse(responseText);
					if(callbackSuccess) {
						callbackSuccess(method, data, readyState, status, r);
					};
				} catch(e) {
					if(callbackError) {
						callbackError(method, data, readyState, status, e);
					};
				};
			} else {
				if(callbackError) {
					var e = new AjaxErrorBadStatusCode('Bad status code '+status);
					callbackError(method, data, readyState, status, e);
				};
			};
		};
	}, async, multipart);
};

ajax.post = function(url, data, callback, async, multipart) {
	if(multipart) {
		ajax.send(url, callback, 'POST', data, async, multipart);
	} else {
		var query = [];
		for (var key in data) {
			query.push(encodeURIComponent(key) + '=' + encodeURIComponent(data[key]));
		};
		ajax.send(url, callback, 'POST', query.join('&'), async, multipart);
	};
};

ajax.postJSON = function(url, data, callbackSuccess, callbackError, async, multipart) {
	ajax.post(url, data, function(method, data, readyState, status, responseText) {
		if(readyState == 4) {
			if(status == 200) {
				try {
					var r = JSON.parse(responseText);
					if(callbackSuccess) {
						callbackSuccess(method, data, readyState, status, r);
					};
				} catch(e) {
					if(callbackError) {
						callbackError(method, data, readyState, status, e);
					};
				};
			} else {
				if(callbackError) {
					var e = new AjaxErrorBadStatusCode('Bad status code '+status);
					callbackError(method, data, readyState, status, e);
				};
			};
		};
	}, async, multipart);
};

ajax.loadTag = function(tag, url, func, field) {
	if((typeof window[func] === 'function') || field != null) {
		if(!!!tag.className.match(new RegExp('(\\s|^)loading(\\s|$)'))) {
			ajax.callTagsBefore(tag);
			tag.className += " loading";
			ajax.getJSON(url, {}, function(method, data, readyState, status, responseData) {
				try {
					if(typeof window[func] === 'function') {
						var html = window[func](tag, responseData);
						tag.innerHTML = html;
					} else if(field != null) {
						tag.innerHTML = responseData[field];
					};
				} catch(e) {
					console.log('ajax.loadTag', 'e', e);
				};
				tag.className = tag.className.replace(new RegExp('(\\s|^)loading(\\s|$)'), ' ').trim();
				ajax.callTagsAfter(tag);
			}, function(method, data, readyState, status, responseData) {
				tag.className = tag.className.replace(new RegExp('(\\s|^)loading(\\s|$)'), ' ').trim();
				ajax.callTagsAfter(tag);
			});
		};
	};
};

ajax.processTag = function(tag) {
	var get = tag.getAttribute('data-ajax-get');
	var func = tag.getAttribute('data-ajax-func');
	var field = tag.getAttribute('data-ajax-field');
	var delay = tag.getAttribute('data-ajax-delay');
	if((get && get != null) && ((func && func != null) || (field && field != null))) {
		if(delay == null) {
			ajax.loadTag(tag, get, func, field);
		} else {
			setTimeout(function() {
				ajax.loadTag(tag, get, func, field);
			}, delay);
		};
	};
};

ajax.processTags = function() {
	var tags = document.querySelectorAll('[data-ajax-get]');
	for(var key in tags) if(tags.hasOwnProperty(key)) {
		var tag = tags[key];
		ajax.processTag(tag);
	};
};

ajax.reloadTag = function(tag) {
	ajax.processTag(tag);
};

ajax.reloadTagById = function(id) {
	var tag = document.getElementById(id)
	if(tag != null) {
		ajax.reloadTag(tag);
	};
};

ajax.processFormSubmit = function(event) {
	if(!event) var event = window.event;
	event.preventDefault();
	var form = event.target;
	var func = form.getAttribute('data-ajax-func');
	var put = form.getAttribute('data-put');
	if(func && func != null && typeof window[func] === 'function') {
		if(!!!form.className.match(new RegExp('(\\s|^)loading(\\s|$)'))) {
			ajax.callFormsBefore(form);
			form.className += " loading";
			var data = null;
			var inputs = form.querySelectorAll("input,select,textarea");
			var files = form.querySelectorAll("input[type=file]");
			var multipart = files.length > 0;
			if(!multipart) {
				data = {};
				var inputs = form.querySelectorAll("input,select,textarea");
				for(var i=0,m=inputs.length-1; i<=m; i++) {
					data[inputs[i].name] = inputs[i].value;
				};
			} else {
				data = new FormData();
				var inputs = form.querySelectorAll("input,select,textarea");
				for(var i=0,m=inputs.length-1; i<=m; i++) {
					if(inputs[i].type != 'file') {
						data.append(inputs[i].name, inputs[i].value);
					} else {
						if(!multipart) {
							multipart = true;
						};
					};
				};
				var files = form.querySelectorAll("input[type=file]");
				for(var i=0,m=files.length-1; i<=m; i++) {
					for(var j=0,k=files[i].files.length-1; j<=k; j++) {
						data.append(files[i].name, files[i].files[j]);
					};
				};
			};
			var ajaxFunc = ajax.get;
			if(form.method == "post") { ajaxFunc = ajax.post; };
			if(put && put != null && put == "true") { ajaxFunc = ajax.put; };
			ajaxFunc(form.action, data, function(method, data, readyState, status, responseText) {
				if(readyState == 4) {
					var error = (status != 200);
					var responseData = responseText;
					try {
						var responseData = JSON.parse(responseText);
					} catch(e) {
						console.log('ajax.processFormSubmit', 'e', e);
					};
					try {
						window[func](form, responseData, error, status);
					} catch(e) {
						console.log('ajax.processFormSubmit', 'e', e);
					};
					form.className = form.className.replace(new RegExp('(\\s|^)loading(\\s|$)'), ' ').trim();
					ajax.callFormsAfter(form);
				};
			}, true, multipart);
		};
	};
};

ajax.processForm = function(form) {
	var is = form.getAttribute('data-ajax-form');
	var func = form.getAttribute('data-ajax-func');
	if((is && is != null && is == "true") && (func && func != null)) {
		if(window.attachEvent) {
			form.attachEvent('onsubmit', ajax.processFormSubmit);
		} else if(window.addEventListener) {
			form.addEventListener('submit', ajax.processFormSubmit, false);
		};
	};
};

ajax.processForms = function() {
	var forms = document.querySelectorAll('[data-ajax-form]');
	for(var key in forms) if(forms.hasOwnProperty(key)) {
		var form = forms[key];
		ajax.processForm(form);
	};
};

ajax.processCheckboxClick = function(event) {
	if(!event) var event = window.event;
	var checkbox = event.target;
	var on = checkbox.getAttribute('data-ajax-on');
	var off = checkbox.getAttribute('data-ajax-off');
	var func = checkbox.getAttribute('data-ajax-func');
	var box = checkbox.parentNode;
	if(!!box.className.match(new RegExp('(\\s|^)loading(\\s|$)'))) {
		event.preventDefault();
		event.stopPropagation();
		return false;
	};
	ajax.callCheckboxesBefore(box);
	box.className += " loading";
	ajax.post(checkbox.checked ? on : off, {}, function(method, data, readyState, status, responseText) {
		if(readyState == 4) {
			var error = (status != 200);
			var responseData = responseText;
			try {
				var responseData = JSON.parse(responseText);
			} catch(e) {
				console.log('ajax.processCheckboxClick', 'e', e);
			};
			try {
				window[func](checkbox, responseData, error, status);
			} catch(e) {
				console.log('ajax.processCheckboxClick', 'e', e);
			};
			if(error) {
				checkbox.checked = !checkbox.checked;
			};
			box.className = box.className.replace(new RegExp('(\\s|^)loading(\\s|$)'), ' ').trim();
			ajax.callCheckboxesAfter(box);
		};
	});
	return true;
};

ajax.processCheckbox = function(checkbox) {
	var is = checkbox.getAttribute('data-ajax-checkbox');
	var on = checkbox.getAttribute('data-ajax-on');
	var off = checkbox.getAttribute('data-ajax-off');
	var func = checkbox.getAttribute('data-ajax-func');
	if((is && is != null && is == "true") && (on && on != null) && (off && off != null) && (func && func != null)) {
		if(window.attachEvent) {
			checkbox.attachEvent('onclick', ajax.processCheckboxClick);
		} else if(window.addEventListener) {
			checkbox.addEventListener('click', ajax.processCheckboxClick, false);
		};
	};
};

ajax.processCheckboxes = function() {
	var checkboxes = document.querySelectorAll('[data-ajax-checkbox]');
	for(var key in checkboxes) if(checkboxes.hasOwnProperty(key)) {
		var checkbox = checkboxes[key];
		ajax.processCheckbox(checkbox);
	};
};

ajax.load = function() {
	if(!ajax.loaded) {
		ajax.loaded = true;
		ajax.processTags();
		ajax.processForms();
		ajax.processCheckboxes();
	};
};

if(window.attachEvent) {
	window.attachEvent('onload', ajax.load);
} else if(window.addEventListener) {
	window.addEventListener('load', ajax.load, false);
};
