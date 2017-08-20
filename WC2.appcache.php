<?
// 과거의 날짜
header("Expires: Mon, 26 Jul 1997 05:00:00 GMT");

// 항상 변경됨
header("Last-Modified: " . gmdate("D, d M Y H:i:s") . " GMT");

// HTTP/1.1
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Cache-Control: post-check=0, pre-check=0", false);

// HTTP/1.0
header("Pragma: no-cache");

header('Content-Type: text/cache-manifest');

require('WC2.appcache');

$t_m_ = filemtime('./');
$t_m_js = filemtime('./js');
$t_m_css = filemtime('./css');
echo "\n\n#".date('Y-m-d H:i:s,',$t_m_).date('Y-m-d H:i:s,',$t_m_js).date('Y-m-d H:i:s,',$t_m_css);
