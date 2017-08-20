<?
header("Pragma: no-cache");
header("Cache-Control: no-cache,must-revalidate");
header('Content-Type: text/cache-manifest');

require('WC2.appcache');
echo "\n\n#".time().str_repeat('m',date('n')).str_repeat('d',date('j')).str_repeat('h',date('G')).str_repeat('h',date('G')).str_repeat('_',rand(0,60));
