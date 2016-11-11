<?php
/* 
Plugin Name: SMSAPI plugin extensions
Description: Custom extensions to the SMSAPI newsletter plugin, like e.g. counting characters.
Version:     1.0.0-dev
Author:	     Ayanami <ayanami@frater260.com>
*/
defined('ABSPATH') or die('No direct access please.');
add_action('admin_menu', 'modify_smsapi_menu',999);

function modify_smsapi_menu() {
	$menu = remove_submenu_page('smsapi-settings','smsapi-send-sms');
	if($menu !== false) {
		add_submenu_page('smsapi-settings',
			'SMSAPI - sendsms',
			__('Send SMS', 'smsapi'),
			'manage_options', 
			'smsapi-revised-sms',
			'smsapi_addons_gateway_routing'
		);	
	}
}

function smsapi_addons_gateway_routng() {
	smsapi_gateway_routing();
	enqueue_script('smsapi-addons-lettercount-js',SMSAPI_ADDONS_PATH."/lettercount.js");
}

?>
