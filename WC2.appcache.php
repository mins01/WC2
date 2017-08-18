<?
header("Pragma: no-cache");
header("Cache-Control: no-cache,must-revalidate");
header('Content-Type: text/cache-manifest');

require('WC2.appcache');
echo "\n\n#".time();
