#!/bin/sh

usage() {
	echo 'Copies plugin files to WP_PLUGIN_DIR'
	echo 'and sets owner, group, and permissions.'
	echo 'Requires defined WP_PLUGINS_DIR enviroment variable.'
	echo 'example:'
	echo "sudo WP_PLUGINS_DIR=/var/www/hdtocs/wp-content/plugins/ ${0}"
}

install_smsapi_addons() {
	/usr/bin/install -o apache -g apache -m 775 -d "${WP_PLUGINS_DIR}/smsapi-addons"
	/usr/bin/install -o apache -g apache -m 664 'smsapi-addons/smsapi-addons.php' "${WP_PLUGINS_DIR}/smsapi-addons/"
	/usr/bin/install -o apache -g apache -m 664 'smsapi-addons/lettercount.js' "${WP_PLUGINS_DIR}/smsapi-addons/"
	/usr/bin/install -o apache -g apache -m 664 'smsapi-addons/charcounter-style.css' "${WP_PLUGINS_DIR}/smsapi-addons/"
}

if [ "x${WP_PLUGINS_DIR}" = 'x' ]; then
	echo ${WP_PLUGINS_DIR}
	usage
	exit 1
fi

# TODO add switch, extend usage for usual scenarios.
install_smsapi_addons
