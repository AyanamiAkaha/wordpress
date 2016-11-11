<?php
/* 
Plugin Name: SMSAPI plugin extensions
Description: Custom extensions to the SMSAPI newsletter plugin, like e.g. counting characters.
Version:     1.0.0-dev
Author:	     Ayanami <ayanami@frater260.com>
*/
defined('ABSPATH') or die('No direct access please.');
define('SMSAPI_ADDONS_PATH',plugin_dir_path(__FILE__));
define('SMSAPI_PLUGIN_PATH', plugins_url('newsletter-sms-smsapi'));

require_once SMSAPI_PLUGIN_PATH . 'gateway.php';
require_once SMSAPI_PLUGIN_PATH . 'routing.php';

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
	enqueue_script('smsapi-addons-lettercount-js',SMSAPI_ADDONS_PATH."/lettercount.js");
	action_gateway();
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
