var counter={
	counter: function(messageField, counterElement) {
		// FIXME: implement actual counter
		counterElement.textContent = messageField.value.length;
	}

	init: function(){
		var messageField = document.getElementById('message');
		if(messageField != null) {
			var counterEl = document.createElement('P');
			messageField.insertBefore(counter);
			messageField.addEventListener(
				'input',
				function() {
					this.counter(messageField, counterEl);
				},
				false
			);
		}
	}
}
if(window.addEventListener) {
	window.addEventListener('load', counter.init, false);
} else if(window.attachEvent) {
	window.attachEvent('onload', counter.init);
} else {
	console.error('unsupported browser!');
}
