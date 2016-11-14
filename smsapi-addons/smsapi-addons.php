<?php
/* 
Plugin Name: SMSAPI plugin extensions
Description: Custom extensions to the Newsletter SMS - SMSAPI 
plugin, like e.g. counting characters.
Version:     1.0.0-rc1
Author:	     Ayanami <ayanami@frater260.com>
Depends:     Newsletter SMS - SMSAPI
License:     Artistic License 2.0

Copyright (c) 2016 Ayanami <ayanami@frater260.com>
Licensed under the Artistic License 2.0
https://opensource.org/licenses/Artistic-2.0
*/
defined('ABSPATH') or die('No direct access please.');
define('SMSAPI_ADDONS_PATH', plugins_url('smsapi-addons'));
define('SMSAPI_PLUGIN_PATH', plugins_url('newsletter-sms-smsapi'));

require_once SMSAPI_PLUGIN_PATH . 'gateway.php';
require_once SMSAPI_PLUGIN_PATH . 'routing.php';

// TODO activate hook to activate newsletter-sms-smsapi along with this plugin
// TODO newsletter-sms-smsapi deactivate hook, to also deactivate this plugin

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

function action_addons_gateway() {
	action_gateway();
	wp_enqueue_style('smsapi-addons-lettercount-css',SMSAPI_ADDONS_PATH.'/charcounter-style.css');
	wp_enqueue_script('smsapi-addons-lettercount-js',SMSAPI_ADDONS_PATH.'/lettercount.js');
}

function smsapi_addons_gateway_routing() {
    $recipientsNumbers = session_get_once('gateway_recipients', array());

    try {
        action_addons_gateway($recipientsNumbers);
    } catch (\SMSApi\Exception\SmsapiException $error) {
        handle_smsapi_exception($error);
    }
}

add_action('admin_menu', 'modify_smsapi_menu',999);

?>
