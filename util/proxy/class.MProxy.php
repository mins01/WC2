<?
require_once(dirname(__FILE__).'/Mproxy.php');


if(class_exists('MProxy') != true)
  {
    class MProxy extends Mproxy{

    }
    
  }