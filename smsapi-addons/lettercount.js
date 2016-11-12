/*
 * Character counting script for newsletter-sms-smsapi.
 * 
 * Copyright (c) 2016 Ayanami <ayanami@frater260.com>
 * Licensed under the Artistic License 2.0
 * https://opensource.org/licenses/Artistic-2.0
 */

var sms_max_parts = 6;

sms_counter = function($textarea) {
	this.$textarea = $textarea;
	this.$info;
	this.$parts;
	this.$left;
	this.sms_count;
	this.chars_left;
	this.chars_total;
	this.lang = (function(){
		if(window.language && ['en','pl','ru'].indexOf(window.language)) {
			console.log('1');
			return window.language;
		} else {
			console.log('2');
			return 'en';
		}
	}());
	console.log(this);
}
sms_counter.prototype = {
// copypaste from smsapi.pl
	plurals_configuration: {
		en: ['', 's'],
		pl: ['', 'i', 'ów'],
		ru: ['', 'а', 'ов']
	},
	sms_textarea_information: {
		en: {
			sms_name: 'SMS',
			sms_name_plural: '',
			sms_char_name: 'character',
			sms_counter_right_text: 'left.'
		},
		pl: {
			sms_name: 'SMS',
			sms_name_plural: 'y',
			sms_char_name: 'znak',
			sms_counter_right_text: 'do końca części.'
		},
		ru: {
			sms_name: 'SMS',
			sms_name_plural: '',
			sms_char_name: 'символ',
			sms_counter_right_text: 'до конца части.'
		}
	},
	get_plural: function(language_iso, n) {
		var plural = 0;
		if (language_iso === 'pl') {
			plural = n == 1 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2;
		} else  if (language_iso === 'ru') {
			plural = (n % 10 == 1 && n % 100 != 11 ? 0 : n % 10 >= 2 && n % 10 <= 4 && (n % 100 < 10 || n % 100 >= 20) ? 1 : 2);
		}
		return plural;
	},
	pluralize: function pluralize(word, pluralEndLetter, n) {
		if (this.lang === 'en') {
			return (n === 1 ? word : (pluralEndLetter === '' ? word : word + this.plurals_configuration[this.lang][1]));
		}
		var endLetter = pluralEndLetter || pluralEndLetter === '' ? pluralEndLetter : this.plurals_configuration[this.lang][1],
		plural = this.get_plural(this.lang, n);
		return plural === 0 ? word : (plural === 1 ? word + endLetter : (pluralEndLetter === '' ? word : (word + this.plurals_configuration[this.lang][2])));
	},
// end copypaste

	get_max_chars: function(ascii) {
		var max_chars;
		if (sms_max_parts == 1) {
			max_chars = (ascii == 1) ? 160 : 70;
		} else {
			max_chars = ((ascii == 1) ? 153 : 67) * sms_max_parts;
		}
		return max_chars;
	},
	get_parts_count: function(sms_length, ascii) {
		if (ascii == 0) {
			return sms_length <= 70 ? 1 : Math.ceil(sms_length / 67);
		}
		return sms_length <= 160 ? 1 : Math.ceil(sms_length / 153);
	},

	is_ascii: function(str) {
		return /^\[\u0000-\u007f]$/.test(str);
	},

	count_left_characters: function(ascii, sms_content_length, sms_parts) {
		var unicode = !ascii;
		var smsSettings = {},
		smsPartsCount = sms_parts,
		smsContentLength = sms_content_length,
		charactersLeft;

		if (unicode === 1) {
			smsSettings = {
				singleSmsLength: 70,
				secondSmsLength: 64,
				manySmsLength: 67
			}
		} else {
			smsSettings = {
				singleSmsLength: 160,
				secondSmsLength: 146,
				manySmsLength: 153
			}
		}
		if (sms_max_parts === 1) {
			if (smsContentLength >= smsSettings.singleSmsLength) {
				smsContentLength = smsSettings.singleSmsLength;
			}
		} else {
			if (smsContentLength >= sms_max_parts * smsSettings.manySmsLength) {
				smsContentLength = sms_max_parts * smsSettings.manySmsLength;
			}
		}

		if (smsPartsCount === 1) {
			charactersLeft = smsSettings.singleSmsLength - (smsContentLength);
		} else if (smsPartsCount === 2) {
			charactersLeft = smsSettings.secondSmsLength - (smsContentLength - smsSettings.singleSmsLength);
		} else if (smsPartsCount > 2) {
			charactersLeft = smsSettings.manySmsLength  - (smsContentLength - smsSettings.manySmsLength  * (smsPartsCount - 1));
		}

		return charactersLeft;
	},

	recount: function() {
		var content = this.$textarea.value;
		var max_chars = this.get_max_chars(this.is_ascii(content));
		var parts = Math.min(
				sms_max_parts,
				this.get_parts_count(content.length, this.is_ascii(content))
		);
		var left = this.chars_left = this.count_left_characters(
				this.is_ascii(content),
				content.length,
				parts
		);

		console.log(this.sms_textarea_information);
		console.log(this.lang);
		console.log(this);
        this.$info.innerHTML = '<span id="sms-parts-count">' + parts + '</span> ' 
			+ this.pluralize(
					this.sms_textarea_information[this.lang].sms_name, 
					this.sms_textarea_information[this.lang].sms_name_plural, 
					parts
			) + ', <span id="sms-chars-left">' +  left + '</span> ' +
            this.pluralize(
					this.sms_textarea_information[this.lang].sms_char_name, 
					this.plurals_configuration[this.lang][1], 
					left
			) + ' ' + 
			this.sms_textarea_information[this.lang].sms_counter_right_text;
		this.$parts = document.getElementById('sms-parts-count');
		this.$left = document.getElementById('sms-chars-left');

		// TODO: handle max parts (6), and going over the limit
	},
	init: function() {
		console.log(this);
		this.$info = document.createElement('P');
		this.$info.id = 'sms-char-counter';
		this.$textarea.parentElement.insertBefore(
				this.$info,
				this.$textarea.nextElementSibling
		);
	}
}

function init() {
	var messageField = document.getElementById('message');
	if(messageField!= null) {
		var _sms_counter = new sms_counter(messageField);
		_sms_counter.init();

		if(messageField.addEventListener) {
			messageField.addEventListener( 'input', function(){_sms_counter.recount();}, false);
		} else if(messageField.attachEvent) {
			messageField.attachEvent( 'input', function(){_sms_counter.recount();});
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
