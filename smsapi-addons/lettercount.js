/*
 * Character counting script for newsletter-sms-smsapi.
 * 
 * Copyright (c) 2016 Ayanami <ayanami@frater260.com>
 * Licensed under the Artistic License 2.0
 * https://opensource.org/licenses/Artistic-2.0
 */
function counter(counterElement, messageField) {
	// FIXME: implement actual counter
	counterElement.textContent = messageField.value.length;
}

function init() {
	var messageField = document.getElementById('message');
	if(messageField!= null) {
		var counterEl = document.createElement('P');
		messageField.parentElement.insertBefore(counterEl,messageField.nextElementSibling);
		if(messageField.addEventListener) {
			messageField.addEventListener( 'input', function(){counter(counterEl,messageField);}, false);
		} else if(messageField.attachEvent) {
			messageField.attachEvent( 'input', function(){counter(counterEl,messageF);});
		} else {
			console.error('unsupported browser');
		}
	}
}

if(window.addEventListener) {
	window.addEventListener('load', init, false);
} else if(window.attachEvent) {
	window.attachEvent('onload', init);
} else {
	console.error('unsupported browser!');
}
