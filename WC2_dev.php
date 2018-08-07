<!DOCTYPE html>
<?
$t = time();

$isCLI = (php_sapi_name() == "cli");
if($isCLI){
	$tsync = '?_t='.$t;
}else{
	$tsync = '';
}
?>
<!--
2015-04-23 : 제작시작
임의사용 금지.

-->
<html lang="ko" <? if($isCLI): ?>manifest="WC2.appcache.php<?=$tsync?>"<? endif; ?>>
	<head>
		<link rel="manifest" href="./manifest.json">
		<meta charset="utf-8">
		<meta http-equiv="X-UA-Compatible" content="IE=edge">
		<!-- 뷰포트 -->
		<meta id="viewport" name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
		<!-- 위 3개의 메타 태그는 *반드시* head 태그의 처음에 와야합니다; 어떤 다른 콘텐츠들은 반드시 이 태그들 *다음에* 와야 합니다 -->
		<link rel="shortcut icon" href="img/favicon.ico" type="image/x-icon" />
		<title>WC2</title>
		<!-- 풀스크린 페이지 런칭 -->
		<meta name="apple-touch-fullscreen" content="yes">
		<meta name="apple-mobile-web-app-capable" content="yes">
		<meta name="mobile-web-app-capable" content="yes">
		<!-- 기타 -->
		<meta name="google" content="notranslate">
		<meta name="format-detection" content="telephone=no">
		<meta name="apple-mobile-web-app-status-bar-style" content="black">
		<meta name="apple-mobile-web-app-title" content="WC2-WebCanvas2">

		<link rel="icon" href="img/apple-touch-icon.png">
		<link rel="apple-touch-icon" href="img/apple-touch-icon.png">
		<link rel="apple-touch-icon-precomposed" href="img/apple-touch-icon.png">
		<link rel="apple-touch-startup-image" href="img/apple-touch-icon.png">

		<meta name="description" content="WC2 , 웹 캔버스 2 , 웹 드로잉 ">
		<meta property="fb:app_id" content="1089054314479874" />
		<meta property="og:title" content="WC2-웹 캔버스 2">
		<meta property="og:image" content="http://www.mins01.com/WC2/img/apple-touch-icon.png">
		<meta property="og:image:width" content="129" />
		<meta property="og:image:height" content="129" />
		<meta property="og:site_name" content="WC2-웹 캔버스 2">
		<meta property="og:type" content="website">



		<!-- jQuery (부트스트랩의 자바스크립트 플러그인을 위해 필요합니다) -->
		<!-- <script src="https://ajax.googleapis.com/ajax/libs/jquery/1.11.2/jquery.min.js"></script> -->
		<script src="http://code.jquery.com/jquery-2.1.3.min.js"></script>

		<!-- Latest compiled and minified CSS -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap.min.css" integrity="sha384-BVYiiSIFeK1dGmJRAkycuHAHRg32OmUcww7on3RYdg4Va+PmSTsz/K68vbdEjh4u" crossorigin="anonymous">

		<!-- Optional theme -->
		<link rel="stylesheet" href="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/css/bootstrap-theme.min.css" integrity="sha384-rHyoN1iRsVXV4nD0JutlnGaslCJuC7uwjduW9SVrLvRYooPp2bWYgmgJQIXwl/Sp" crossorigin="anonymous">

		<!-- 드롭다운 메뉴 확장용 CSS https://github.com/behigh/bootstrap_dropdowns_enhancement/blob/master/dist/css/dropdowns-enhancement.css -->
		<link rel="stylesheet" href="./bootstrap/css/dropdowns-enhancement.css">

		<!-- jquery-ui -->
		<link rel="stylesheet" href="http://code.jquery.com/ui/1.11.4/themes/smoothness/jquery-ui.css">
		<!-- <link rel="stylesheet" href="/resources/demos/style.css"> -->
		<!-- spectrum.css on jquery -->
		<link rel="stylesheet" href="jquery/spectrum.css">
		<!-- <link rel="stylesheet" type="text/css" href="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.6.1/spectrum.min.css"> -->
		<!-- image area select http://odyniec.net/projects/imgareaselect/ -->
		<link rel="stylesheet" type="text/css" href="jquery/odyniec-imgareaselect/distfiles/css/imgareaselect-default.css" />

		<!-- IE8 에서 HTML5 요소와 미디어 쿼리를 위한 HTML5 shim 와 Respond.js -->
		<!-- WARNING: Respond.js 는 당신이 file:// 을 통해 페이지를 볼 때는 동작하지 않습니다. -->
		<!--[if lt IE 9]>
		  <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
		  <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
		<![endif]-->

		<link rel="stylesheet" type="text/css" href="./css/WebCanvasBundle.css<?=$tsync?>" charset="utf-8" />
		<link rel="stylesheet" type="text/css" href="./css/WC2.css<?=$tsync?>" charset="utf-8" />
	</head>
	<body spellcheck="false">

			<div id="dev_text">

			</div>
			<div id="container">
				<header>
					<nav id="topMenu" class="navbar navbar-default navbar-fixed-top">
					  <div class="container-fluid">
						<!-- Brand and toggle get grouped for better mobile display -->
						<div class="navbar-header">
						  <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#top-navbar">
							<span class="sr-only">Toggle navigation</span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
							<span class="icon-bar"></span>
						  </button>

						<button type="button" class="navbar-toggle  glyphicon glyphicon-list-alt" title="Setting"
						data-toggle="show" data-target="#propPanel"></button>
						<script>
						$(function(){
							$("[data-toggle='show'][data-target]").on('click',function(){
								var $dataTarget = $($(this).attr('data-target'));
								$dataTarget.each(function(){
									if($(this).hasClass('show')){
										$(this).removeClass('show')
									}else{
										$(this).addClass('show')
									}
								})
							})
						});
						</script>

						<button type="button" class="navbar-toggle  glyphicon glyphicon-pencil" title="Tool"
						data-toggle="show" data-target="#toolPanel" aria-expanded="true"></button>

						<button type="button" class="navbar-toggle glyphicon glyphicon-fullscreen" title="FullScreen" onclick="wc2.toggleFullScreen();" ></button>

						<!--
						<a class="navbar-brand" href="http://mins01.com" target="_blank">
							<img alt="Brand" src="http://www.mins01.com/img/logo.gif">
						</a>
						-->
						</div>

						<!-- Collect the nav links, forms, and other content for toggling -->
						<div class="collapse navbar-collapse" id="top-navbar" onclick="/*wc2.closeOnclickNavbar(event)*/">
							<ul class="nav navbar-nav">
								<li class="dropdown">
								  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">File <span class="caret"></span></a>
								  <ul class="dropdown-menu" role="menu">
									<li><a href="#" class="glyphicon glyphicon-file" data-wc-menu="file-new" >New</a></li>
									<li><a href="#" class="glyphicon glyphicon-folder-open" data-wc-menu="file-open">Open</a></li>
									<li><a href="#" class="glyphicon glyphicon-save-file" data-wc-menu="file-save" onclick="wc2.btnFileSavePreview();">Save / <span class="glyphicon glyphicon-cloud-upload not-active"> </span>Upload</a></li>
									<li><a href="#" class="glyphicon glyphicon-picture"  onclick="wc2.viewImage()">View</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-remove-circle" onclick="wc2.cmdWcb('close')">Close</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-copy" onclick="wc2.saveWcbLocalStorage()" ><span class="small-text">T</span>Temp Save</a></li>
									<li><a href="#" class="glyphicon glyphicon-paste" onclick="wc2.openWcbLocalStorage()" ><span class="small-text">T</span>Temp Open</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-paste" onclick="wc2.openAutoWcbLocalStorage()" ><span class="small-text">T</span>AutoSave Open</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-exclamation-sign" onclick="if(confirm('Exit?')){ self.close()};return false" >Exit</a></li>

								  </ul>
								</li>
								<li class="dropdown">
								  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Edit <span class="caret"></span></a>
								  <ul class="dropdown-menu" role="menu">
									<li><a href="#" class="glyphicon glyphicon-chevron-left" onclick="wc2.cmdWcb('undo');">Undo</a></li>
									<li><a href="#" class="glyphicon glyphicon-chevron-right" onclick="wc2.cmdWcb('redo');">Redo</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-wrench" data-wc-menu="edit-preferences">Preferences</a></li>
									<li class="divider"></li>
									<li><a href="#" class="glyphicon glyphicon-fullscreen" onclick="wc2.toggleFullScreen();">FullScreen</a></li>
								  </ul>
								</li>

								<li class="dropdown">
								  <a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Image <span class="caret"></span></a>
									<ul class="dropdown-menu" role="menu">
										<li><a href="#" class="glyphicon glyphicon-refresh" onclick="wc2.cmdWcb('clear');return false;">Clear</a></li>
										<li><a href="#" class="glyphicon glyphicon-info-sign"  data-wc-menu="image-rename">Rename</a></li>
										<li><a href="#" class="glyphicon glyphicon-fullscreen" data-wc-menu="image-resize">Image Resize</a></li>
										<li><a href="#" class="glyphicon glyphicon-fullscreen" data-wc-menu="image-adjustSize">Canvas Resize</a></li>

										<li class="divider"></li>
										<li class="dropdown-submenu">
											<a href="#" tabindex="-1" data-toggle="dropdown" ><span class="glyphicon glyphicon-repeat"></span>Rotate</a>
											<ul class="dropdown-menu" role="menu">
											<li><a href="#" onclick="wc2.cmdWcb('rotate90To',90);return false;" class="glyphicon glyphicon-arrow-right">90ºCW</a></li>
											<li><a href="#" onclick="wc2.cmdWcb('rotate90To',180);return false;" class="glyphicon glyphicon-arrow-down">180º</a></li>
											<li><a href="#" onclick="wc2.cmdWcb('rotate90To',270);return false;" class="glyphicon glyphicon-arrow-left">90ºCCW</a></li>
											</ul>
										</li>
										<li class="dropdown-submenu">
											<a href="#" tabindex="-1" data-toggle="dropdown"><span  class="glyphicon glyphicon-object-align-vertical"></span>Flip</a>
											<ul class="dropdown-menu" role="menu">
											<li><a href="#" onclick="wc2.cmdWcb('flip',true,false);return false;" class="glyphicon glyphicon-object-align-vertical">Vertical</a></li>
											<li><a href="#" onclick="wc2.cmdWcb('flip',false,true);return false;" class="glyphicon glyphicon-object-align-horizontal">Horizontal</a></li>
											<li><a href="#" onclick="wc2.cmdWcb('flip',true,true);return false;" class="glyphicon glyphicon-object-align-vertical">+ <span  class="glyphicon glyphicon-object-align-horizontal"></span>Vertical+Horizontal</a></li>
											</ul>
										</li>
										<li class="divider"></li>
										<li><a href="#" class="glyphicon glyphicon-th" data-wc-menu="image-guideLine">guideLinee</a></li>
									</ul>
								</li>

								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Layer <span class="caret"></span></a>
									<ul class="dropdown-menu" role="menu">
										<li><a href="#layer-add" class="glyphicon glyphicon-plus-sign" onclick="wc2.cmdLayer('new')">Add</a></li>
										<li><a href="#layer-remove" class="glyphicon glyphicon-minus-sign" onclick="confirm('remove Layer?')?wc2.cmdLayer('remove'):'';">Remove</a></li>
										<li><a href="#" class="glyphicon glyphicon-duplicate" onclick="wc2.cmdLayer('duplicate')">Duplicate</a></li>
										<li><a href="#" class="glyphicon glyphicon-arrow-down" onclick="confirm('merge-down Layer?')?wc2.cmdLayer('mergeDown'):'';">MergeDown</a></li>
										<li><a href="#" class="glyphicon glyphicon-erase" onclick="wc2.cmdLayer('clear');return false;">Clear</a></li>
										<li class="divider"></li>
										<li><a href="#" class="glyphicon glyphicon-eye-close" onclick="wc2.cmdLayer('toggleHide');return false;">Toggle Hide</a></li>
										<li class="divider"></li>
										<li><a href="#" class="glyphicon glyphicon-info-sign"  data-wc-menu="layer-rename">Rename</a></li>
										<li><a href="#" class="glyphicon glyphicon-save-file" onclick="wc2.cmdLayer('save')">Save</a></li>
								  </ul>
								</li>
								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Filter <span class="caret"></span></a>
									<ul class="dropdown-menu" role="menu">
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-invert">Invert</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-grayscale">Grayscale</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-brightness">Brightness &amp; Contrast</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-colorize">Colorize</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-threshold">Threshold</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-sharpen">Sharpen</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-gaussianblur">GaussianBlur</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-sobel">Sobel &amp; Laplace</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-above">Above</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-distortsine">DistortSine</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-applyPalette">ApplyPalette</a></li>
										<li><a href="#" class="glyphicon glyphicon-flash"  data-wc-menu="layer-filter-applyColorDepth">ApplyColorDepth</a></li>
								  </ul>
								</li>
								<li class="dropdown">
									<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Automation <span class="caret"></span></a>
									<ul class="dropdown-menu" role="menu">
										<li class="dropdown-submenu">
											<a href="#" tabindex="-1" data-toggle="dropdown"><span  class="glyphicon glyphicon-fullscreen"></span>Resize</a>
												<ul class="dropdown-menu" role="menu">
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-horizontal"  onclick="wc2.automation('resize',600,null);return false;">width=600px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-horizontal"  onclick="wc2.automation('resize',400,null);return false;">width=400px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-horizontal"  onclick="wc2.automation('resize',300,null);return false;">width=300px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-horizontal"  onclick="wc2.automation('resize',200,null);return false;">width=200px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-horizontal"  onclick="wc2.automation('resize',100,null);return false;">width=100px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-vertical"  onclick="wc2.automation('resize',null,600);return false;">height=600px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-vertical"  onclick="wc2.automation('resize',null,400);return false;">height=400px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-vertical"  onclick="wc2.automation('resize',null,300);return false;">height=300px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-vertical"  onclick="wc2.automation('resize',null,200);return false;">height=200px</a></li>
													<li><a href="#" class="glyphicon glyphicon glyphicon glyphicon-resize-vertical"  onclick="wc2.automation('resize',null,100);return false;">height=100px</a></li>
												</ul>
										</li>
									</ul>
								</li>
						  </ul>
						  <ul class="nav navbar-nav navbar-right">
							<li class="dropdown">
							<a href="#" class="dropdown-toggle" data-toggle="dropdown" role="button" aria-expanded="false">Help <span class="caret"></span></a>
							<ul class="dropdown-menu" role="menu">
								<li><a href="#" class="glyphicon glyphicon-question-sign"  data-wc-menu="help-help">Help</a></li>
								<li><a href="http://mins01.com" target="_blank" class="glyphicon glyphicon-user">공대여자HOME</a></li>
								<li><a href="./WC2.html" target="_blank" onclick="try{window.applicationCache.update();}catch(e){alert(e)}document.location.reload(true);return false;" class="glyphicon glyphicon-refresh">Reload</a></li>
							</ul>
							</li>
						 </ul>
						</div><!-- /.navbar-collapse -->
					  </div><!-- /.container-fluid -->
					</nav>
				</header>


				<aside id="toolPanel" class="wc2-panel show" aria-expanded="true">
					<div class="panel panel-default">
						<div class="panel-heading">Tool</div>
						<div class="panel-body">
							<button class="btn btn-default glyphicon glyphicon-move" data-wc-tool="move" type="button" title="Move"></button>
							<button class="btn btn-default glyphicon glyphicon-screenshot" data-wc-tool="spuit"  type="button" title="Spuit"></button>
							<button class="btn btn-default glyphicon glyphicon-pencil active" data-wc-tool="pen"  type="button" title="Pen"><span class="small-text tiny-text">P</span></button>
							<button class="btn btn-default glyphicon glyphicon-erase" data-wc-tool="eraser" type="button"   title="Eraser"></button>
							<button class="btn btn-default glyphicon glyphicon-pencil" data-wc-tool="brush"  type="button" title="Brush Set1"><span class="small-text tiny-text">B</span></button>
							<button class="btn btn-default glyphicon glyphicon-pencil" data-wc-tool="brush2"  type="button" title="Brush Set2"><span class="small-text  tiny-text">B2</span></button>
							<button class="btn btn-default glyphicon glyphicon-pencil" data-wc-tool="brush3"  type="button" title="Brush Set3"><span class="small-text  tiny-text">B3</span></button>

							<button class="btn btn-default glyphicon glyphicon-fullscreen" data-wc-tool="transform"  type="button" title="Transform"></button>
							<button class="btn btn-default glyphicon glyphicon-scissors " data-wc-tool="crop"  type="button" title="Crop"></button>
							<button class="btn btn-default glyphicon no-glyphicon " data-wc-tool="line" type="button" title="Line">⁄</button>
							<button class="btn btn-default glyphicon no-glyphicon"  data-wc-tool="curve" type="button" title="Curve">∼</button>
							<button class="btn btn-default glyphicon no-glyphicon" data-wc-tool="rect" type="button" title="Rect">□</button>
							<button class="btn btn-default glyphicon no-glyphicon" data-wc-tool="circle" type="button" title="Circle">○</button>
							<button class="btn btn-default glyphicon glyphicon-font" data-wc-tool="text" type="button" title="Text"></button>
							<button class="btn btn-default glyphicon glyphicon-picture" data-wc-tool="image"  type="button" title="Image"></button>
							<button class="btn btn-default glyphicon glyphicon-th" data-wc-tool="pattern"  type="button" title="pattern"></button>
							<button class="btn btn-default glyphicon no-glyphicon" data-wc-tool="concentratedLineRadial"  type="button" title="ConcentratedLineRadial">
								<div class="icon-wc-tool-concentratedLineRadial  glyphicon no-glyphicon">
									<div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div><div class="line"></div>
								</div>
							</button>
							<button class="btn btn-default glyphicon no-glyphicon" data-wc-tool="concentratedLineLinear"  type="button" title="ConcentratedLineLinear">
								<div class="icon-wc-tool-concentratedLineLinear  glyphicon no-glyphicon">
									<div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line">&nbsp;</div><div class="line">&nbsp;</div>
								</div>
							</button>

							<hr class="soften">
							<button class="btn btn-default glyphicon glyphicon-chevron-left" onclick="wc2.cmdWcb('undo');" type="button" title="Undo"></button>
							<button class="btn btn-default glyphicon glyphicon-chevron-right" onclick="wc2.cmdWcb('redo');" type="button" title="Redo"></button>
						</div>
					</div>
				</aside>
				<aside id="propPanel"  class="wc2-panel " aria-expanded="false" >
					<div class="panel panel-default">
						<div class="panel-heading">Property</div>
						<div class="panel-body">
							<form name="formStrokStyle" id="formStrokStyle" action="javascript:void(0)" class="wc-tool wc-tool-line wc-tool-curve wc-tool-pen wc-tool-rect wc-tool-circle  wc-save-setting" onsubmit="return false">
								<div class="panel panel-default">
									<div  class="panel-heading">Line</div>
									<div  class="panel-body">
										<table class="">
											<col width="100">
											<col>
											<tr>
												<th>line</th>
												<td><div class="showRangeValue" data-unit="px"><input type="range" min="1" max="100" value="5" size="3" name="lineWidth" ></div></td>
											</tr>
											<tr>
												<th>alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="globalAlpha"  ></div></td>
											</tr>
											<tr>
												<th>line-join</th>
												<td>
													<select name="lineJoin" style="width:90%">
														<option value="round" selected="selected">round(원)</option>
														<option value="bevel">bevel(마름모)</option>
														<option value="miter">miter(사각형)</option>
													</select>
												</td>
											</tr>
											<tbody class="wc-tool wc-tool-rect  wc-tool-circle">
												<tr>
													<th>use-line</th>
													<td>
														<label><input type="radio" value="0" checked name="disableStroke"> <span class="glyphicon glyphicon-ok-circle"></span></label>
														<label><input type="radio" value="1" name="disableStroke"> <span class="glyphicon glyphicon-ban-circle"></span></label>
													</td>
												</tr>
												<tr>
													<th>use-fill</th>
													<td>
														<label><input type="radio" value="0" checked name="disableFill"> <span class="glyphicon glyphicon-ok-circle"></span></label>
														<label><input type="radio" value="1" name="disableFill"> <span class="glyphicon glyphicon-ban-circle"></span></label>
													</td>
												</tr>
											</tbody>
										</table>
									</div>
								</div>
							</form>


							<form name="formPropImage" action="javascript:void(0)" class="wc-tool wc-tool-image" onsubmit="return false" onchange="wc2.cmdTool('predraw')" oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">Image</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="60">
											<col width="">
											<tr>
												<th colspan="2" >
													<div class="overflow-scrolly" style="width:100%; margin:5px auto; height:60px; background-color:#eee;padding:1px;"><img src="./img/bg.gif" class="bg-grid" id="imageNode" /></div>
												</th>
											</tr>
											<tr>
												<th>alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="globalAlpha"  ></div></td>
											</tr>
											<tr>
												<th>in PC</th>
												<td><input type="file" name="inputImageFile" style="width:90%" accept="image/*" onchange="wc2Helper.selectFileAndView(event,document.getElementById('imageNode'))"></td>
											</tr>
											<tr>
												<th>URL</th>
												<td><input type="text" name="inputImageFile" style="width:90%" placeHolder="URL/dataURL/clipboard" onpaste="wc2.onpasteFromClipboardForInput(event,function(){},function(dataURL,type,event){document.getElementById('imageNode').src=dataURL});" onchange="document.getElementById('imageNode').src=wc2.converURL(this.value)"></td>
											</tr>
										</table>
									</div>
								</div>
							</form>

							<form name="formPropConcentratedLineRadial" action="javascript:void(0)" class="wc-tool wc-tool-concentratedLineRadial" onsubmit="return false" onchange="wc2.cmdTool('predraw')" oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">concentratedLineRadial</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="60">
											<col width="">
											<tr>
												<th>alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="globalAlpha"  ></div></td></td>
											</tr>
											<tr>
												<th>lineWidth</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="100" value="3" step="1" name="lineWidth"  ></div></td>
											</tr>
											<tr>
												<th>X</th>
												<td><div class="showRangeValue"><input type="range" min="-1000" max="1000" value="0" step="1" name="x"  ></div></td>
											</tr>
											<tr>
												<th>Y</th>
												<td><div class="showRangeValue"><input type="range" min="-1000" max="1000" value="0" step="1" name="y"  ></div></td>
											</tr>
											<tr>
												<th>multi</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="1000" value="150" step="1" name="multi"  ></div></td>
											</tr>
											<tr>
												<th>lineLength</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="100" value="1" step="1" name="lineLength"  ></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formPropConcentratedLineRadialColorStops" action="javascript:void(0)" class="wc-tool wc-tool-concentratedLineRadial" onsubmit="return false" onchange="wc2.cmdTool('predraw')" oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">colorStops</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="50%">
											<col width="">
											<thead class="dev_ColorStops">
												<tr>
													<th>position</th>
													<th>opacity</th>
												</tr>
											</thead>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_pos1"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_opacity1"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.2" step="0.01" name="colorStops_pos2"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_opacity2"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.8" step="0.01" name="colorStops_pos3"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.8" step="0.01" name="colorStops_opacity3"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="colorStops_pos4"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="colorStops_opacity4"  ></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formPropConcentratedLineLinear" action="javascript:void(0)" class="wc-tool wc-tool-concentratedLineLinear" onsubmit="return false" onchange="wc2.cmdTool('predraw')" oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">concentratedLineLinear</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="60">
											<col width="">
											<tr>
												<th>alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="globalAlpha"  ></div></td></td>
											</tr>
											<tr>
												<th>lineWidth</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="100" value="3" step="1" name="lineWidth"  ></div></td>
											</tr>
											<tr>
												<th>X</th>
												<td><div class="showRangeValue"><input type="range" min="-1000" max="1000" value="0" step="0" name="x"  ></div></td>
											</tr>
											<tr>
												<th>Y</th>
												<td><div class="showRangeValue"><input type="range" min="-1000" max="1000" value="0" step="0" name="y"  ></div></td>
											</tr>
											<tr>
												<th>multi</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="1000" value="150" step="1" name="multi"  ></div></td>
											</tr>
											<tr>
												<th>lineLength</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="10000" value="1000" step="1" name="lineLength"  ></div></td>
											</tr>
											<tr>
												<th>gapY</th>
												<td><div class="showRangeValue"><input type="range" min="1" max="100" value="10" step="1" name="gapY"  ></div></td>
											</tr>
											<tr>
												<th>deg</th>
												<td><div class="showRangeValue"><input type="range" min="-360" max="360" value="45" step="1" name="deg"  ></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formPropConcentratedLineLinearColorStops" action="javascript:void(0)" class="wc-tool wc-tool-concentratedLineLinear" onsubmit="return false" onchange="wc2.cmdTool('predraw')" oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">colorStops</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="50%">
											<col width="">
											<thead class="dev_ColorStops">
												<tr>
													<th>position</th>
													<th>opacity</th>
												</tr>
											</thead>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_pos1"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_opacity1"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.2" step="0.01" name="colorStops_pos2"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0" step="0.01" name="colorStops_opacity2"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.8" step="0.01" name="colorStops_pos3"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.8" step="0.01" name="colorStops_opacity3"  ></div></td>
											</tr>
											<tr>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="colorStops_pos4"  ></div></td>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="colorStops_opacity4"  ></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>


							<form name="formPropText" id="formPropText" action="javascript:void(0)" class="wc-tool wc-tool-text wc-save-setting" onsubmit="return false" onchange="wc2.cmdTool('predraw')"  oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">text</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="60">
											<col width="">
											<tr>
												<th colspan="2" >
													<textarea name="textareaText" cols="10" rows="4" wrap="hard" id="textareaText" style="width:95%">안녕하세요.</textarea>
												</th>
											</tr>
											<tr>
												<th>alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="globalAlpha" onchange="this.title=(this.value*100)+'%'" ></div></td>
											</tr>
											<tr>
												<th>size</th>
												<td><div class="showRangeValue"><input type="range" name="fontSize" style="width:90%" min="1" max="100" value="12" title="12px" onchange="this.title=this.value+'px'"></div></td>
											</tr>
											<tr>
												<th>font</th>
												<td><select style="width:90%;font-family: 돋움, dotum, Helvetica, AppleGothic, sans-serif;" name="fontFamily" onchange="this.form.textareaText.style.fontFamily=this.value" >
													<option value="default">시스템글꼴</option>
													<optgroup label="한글">
														<option value="'돋움',dotum,Helvetica,AppleGothic,sans-serif" selected="selected">'돋움',dotum,Helvetica,AppleGothic,sans-serif</option>
														<option value="'바탕',batang,Georgia,Arial">'바탕',batang,Georgia,Arial</option>
														<option value="'궁서',Gungsuh,Viner Hand ITC,Arial">'궁서',Gungsuh,Viner Hand ITC,Arial</option>
													</optgroup>
													<optgroup label="영어">
														<option value="Helvetica,dotum,AppleGothic,sans-serif">Helvetica,dotum,AppleGothic,sans-serif</option>
														<option value="Georgia,batang,Arial">Georgia,batang,Arial</option>
														<option value="Viner Hand ITC,Gungsuh,Arial">Viner Hand ITC,Gungsuh,Arial</option>
													</optgroup>
													<optgroup label="기타">
														<option value="Webdings">Webdings</option>
														<option value="WingDings">WingDings</option>
													</optgroup>
												</select></td>
											</tr>
											<tr>
												<th colspan="2">
													<div class="btn-group  btn-group-xs" onclick="wc2.cmdTool('predraw')">
														<button class="btn btn-default glyphicon active" value="start" title="start : Align to the start edge of the text (left side in left-to-right text, right side in right-to-left text)." onclick="clickBtnTextAlign(this)">S</button>
														<button class="btn btn-default glyphicon glyphicon-align-left" value="left"  onclick="clickBtnTextAlign(this)"></button>
														<button class="btn btn-default glyphicon glyphicon-align-center" value="center"  onclick="clickBtnTextAlign(this)"></button>
														<button class="btn btn-default glyphicon glyphicon-align-right" value="right"  onclick="clickBtnTextAlign(this)"></button>
														<button class="btn btn-default glyphicon " value="end" title="end : Align to the end edge of the text (right side in left-to-right text, left side in right-to-left text)."  onclick="clickBtnTextAlign(this)">E</button>
													</div>
													<input type="hidden" name="textAlign">
													<script>
													function clickBtnTextAlign(btn){
														btn.form.textAlign.value = btn.value;
														$(btn.parentNode).find("button.btn").each(
															function(idx,el){
																$(this).removeClass("active");
															}
														);
														$(btn).addClass("active");
														if(btn.onchange) btn.onchange();
														btn.blur();
													}
													</script>
												</th>
											</tr>
											<tr>
												<th>baseline</th>
												<td>
													<select name="textBaseline" style="width:90%">
														<option  value="top" selected="selected">top</option>
														<option value="hanging">hanging</option>
														<option value="middle">middle</option>
														<option value="alphabetic">alphabetic</option>
														<option value="ideographic">ideographic</option>
														<option value="bottom">bottom</option>
													</select>
												</td>
											</tr>
											<tr>
												<th>lineHeight</th>
												<td>
													<select name="lineHeight"  style="width:90%;">
														<option value="0.5">50%</option>
														<option value="0.7">70%</option>
														<option value="1" selected>100%</option>
														<option value="1.2">120%</option>
														<option value="1.5">150%</option>
														<option value="1.7">170%</option>
														<option value="2">200%</option>
														<option value="2.5">250%</option>
														<option value="3">300%</option>
														<option value="3.5">350%</option>
													</select>
												</td>
											</tr>
											<tr>
												<th>line</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="100" value="1" size="3" name="lineWidth" ></div></td>
											</tr>
											<tr>
												<th>use-line</th>
												<td>
													<label><input type="radio" value="0" checked name="disableStroke"> <span class="glyphicon glyphicon-ok-circle"></span></label>
													<label><input type="radio" value="1" name="disableStroke"> <span class="glyphicon glyphicon-ban-circle"></span></label>
												</td>
											</tr>
											<tr>
												<th>use-fill</th>
												<td>
													<label><input type="radio" value="0" checked name="disableFill"> <span class="glyphicon glyphicon-ok-circle"></span></label>
													<label><input type="radio" value="1" name="disableFill"> <span class="glyphicon glyphicon-ban-circle"></span></label>
												</td>
											</tr>

										</table>
									</div>
								</div>
							</form>
							<form name="formPropTransformProperty" action="javascript:void(0)" class="wc-tool wc-tool-image wc-tool-transform wc-tool-text" onsubmit="return false" onchange="wc2.cmdTool('predraw')"  oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">Transform Property</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="60">
											<col width="">
											<tr>
												<th>X</th>
												<td><div class="showRangeValue"><input type="range" name="x0" value="0" min="-999" max="999" step="1" style="width:90%"></div></td>
											</tr>
											<tr>
												<th>Y</th>
												<td><div class="showRangeValue"><input type="range" name="y0" value="0" min="-999" max="999" step="1" style="width:90%"></div></td>
											</tr>
											<tr>
												<th>Sacle</th>
												<td><div class="showRangeValue"><input type="range" name="sc" value="1" min="0.01" max="10" step="0.01" style="width:90%"></div></td>
											</tr>
											<tr>
												<th>Rotate</th>
												<td><div class="showRangeValue"><input type="range" name="deg" value="0" min="-360" max="360" step="1" style="width:90%"></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formMoveImageTip" action="javascript:void(0)" class="wc-tool wc-tool-image wc-tool-transform" onsubmit="return false">
								<div class="panel panel-default">
									<div  class="panel-heading">Tip</div>
									<div  class="panel-body">
										<table class="" style="width:100%">
											<col width="80">
											<col width="">
											<tr>
												<th>mouse</th>
												<td>move</td>
											</tr>
											<tr>
												<th>wheel</th>
												<td>scale up &amp; down</td>
											</tr>
											<tr>
												<th>alt+wheel</th>
												<td>rotate</td>
											</tr>
										</table>
									</div>
								</div>
							</form>

							<form name="formToolSpuit" action="javascript:void(0)" class="wc-tool wc-tool-spuit" onsubmit="return false">
								<div class="panel panel-default">
									<div  class="panel-heading">Spuit</div>
									<div  class="panel-body">
										<table class="">
											<col width="50%">
											<col width="50%">
											<tr>
												<th>Selected</th>
												<th>Preview</th>
											</tr>
											<tr class="bg-grid">
												<th ><div style="width:50px;height:50px; border:2px outset #999; background-color:#000000; margin:0 auto;" id="divSelectedColorSpuit"></div></th>
												<th ><div style="width:50px;height:50px; border:2px outset #999; background-color:#000000;  margin:0 auto;" id="divPreviewColorSpuit"></div></th>
											</tr>
											<tr>
												<th><button class="btn btn-default btn-sm" onclick="wc2.setSpuitColorTo('stroke')">set<br>line color</button></th>
												<th><button class="btn btn-default btn-sm" onclick="wc2.setSpuitColorTo('fill')">set<br>fill color</button></th>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formToolEraser" id="formToolEraser"  action="javascript:void(0)" class="wc-tool wc-tool-eraser wc-save-setting" onsubmit="return false" onchange="wc2.syncEraser()"  oninput="this.onchange()">
								<div class="panel panel-default">
									<div  class="panel-heading">Eraser</div>
									<div  class="panel-body">
										<table class="">
											<col width="60">
											<col width="">
											<tr class="bg-grid" >
												<th colspan="2" height="100" id="formToolEraserCanvasBox" align="center" ></th>
											</tr>
											<tr>
												<th>Size</th>
												<td><div class="showRangeValue" data-unit="px"><input type="range" min="1" max="100" value="5" size="5" name="brushWidth" ></div></td>
											</tr>
											<tr>
												<th>R0</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" step="0.01" name="r0p" value="0" ></div></td>
											</tr>
											<tr>
												<th>Alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="1" step="0.01" name="brushGlobalAlpha"  ></div></td>
											</tr>
											<tr>
												<th>Spacing</th>
												<td><div class="showRangeValue"><input type="range"  min="0.5" max="10" value="0.5" step="0.01" name="brushSpacing"  ></div></td>
											</tr>
										</table>
									</div>
									<div  class="panel-heading">Pressure</div>
									<div  class="panel-body">
										<table class="">
											<col width="60">
											<col width="">
											<tr>
												<th>Diameter</th>
												<td>
													<label><input type="radio" value="0" checked name="brushDisablePressureDiameter"> <span class="glyphicon glyphicon-ok-circle"></span></label>
													<label><input type="radio" value="1" name="brushDisablePressureDiameter"> <span class="glyphicon glyphicon-ban-circle"></span></label>
												</td>
											</tr>
											<tr>
												<th>Minimum<br />Diameter</th>
												<td ><div class="showRangeValue"><input type="range"  min="0" max="1" value="0.1" step="0.01" name="brushMinimumPressureDiameter"  ></div></td>
											</tr>
											<tr>
												<th>Alpha</th>
												<td>
													<label><input type="radio" value="0" checked name="brushDisablePressureAlpha"> <span class="glyphicon glyphicon-ok-circle"></span></label>
													<label><input type="radio" value="1" name="brushDisablePressureAlpha"> <span class="glyphicon glyphicon-ban-circle"></span></label>
												</td>
											</tr>
											<tr>
												<th>Minimum<br />Alpha</th>
												<td ><div class="showRangeValue"><input type="range"  min="0" max="1" value="0.1" step="0.01" name="brushMinimumPressureAlpha"  ></div></td>
											</tr>
										</table>
									</div>
								</div>
							</form>
							<form name="formToolBrushFormCanvasBox" id="formToolBrushFormCanvasBox" action="javascript:void(0)" class="wc-tool wc-tool-brush wc-tool-brush2 wc-tool-brush3 " onsubmit="this.onchange();return false"  oninput="this.onchange()">
									<div class="panel panel-default">
										<div  class="panel-heading">Brush</div>
										<div class="panel-body">
											<div colspan="2" class="bg-grid"  height="100" id="formToolBrushCanvasBox" ></div>
										</div>
										<!-- <table class="">
											<col width="50%">
											<col width="50%">
											<tr class="bg-grid" >
												<th colspan="2" height="100" id="formToolBrushCanvasBox" align="center" ></th>
											</tr>
										</table> -->
									</div>
							</form>
							<form name="formToolBrush" id="formToolBrush" action="javascript:void(0)" class="wc-tool wc-tool-brush wc-save-setting" onsubmit="this.onchange();return false"  data-shown="onchange" onchange="wc2.syncBrush(this)"  oninput="this.onchange()">
								<input type="hidden" name="imageSmoothingEnabled" value="1">
								<div class="panel panel-default">
									<div  class="panel-heading">Brush Set%d</div>
									<div  class="panel-body">
										<table class="">
											<col width="60">
											<col width="">
											<tr>
												<th>Size</th>
												<td><div class="showRangeValue" data-unit="px"><input type="range" min="1" max="100" size="5" step="1" name="brushWidth" maxlength="5" value="3" ></div></td>
											</tr>
											<tr>
												<th>R0</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" step="0.01" name="r0p" value="0" ></div></td>
											</tr>
											<tr>
												<th>Alpha</th>
												<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.5" step="0.01" name="brushGlobalAlpha"  ></div></td>
											</tr>
											<tr>
												<th>Spacing</th>
												<td><div class="showRangeValue"><input type="range"  min="0.5" max="10" value="0.5" step="0.01" name="brushSpacing"  ></div></td>
											</tr>
											</table>
										</div>
										<div  class="panel-heading">Pressure%d</div>
										<div  class="panel-body">
											<table class="">
												<col width="60">
												<col width="">
												<tr>
													<th>Diameter</th>
													<td>
														<label><input type="radio" value="0" checked name="brushDisablePressureDiameter"> <span class="glyphicon glyphicon-ok-circle"></span></label>
														<label><input type="radio" value="1" name="brushDisablePressureDiameter"> <span class="glyphicon glyphicon-ban-circle"></span></label>
													</td>
												</tr>
												<tr>
													<th>Minimum<br />Diameter</th>
													<td ><div class="showRangeValue"><input type="range"  min="0" max="1" value="0.1" step="0.01" name="brushMinimumPressureDiameter"  ></div></td>
												</tr>
												<tr>
													<th>Alpha</th>
													<td>
														<label><input type="radio" value="0" checked name="brushDisablePressureAlpha"> <span class="glyphicon glyphicon-ok-circle"></span></label>
														<label><input type="radio" value="1" name="brushDisablePressureAlpha"> <span class="glyphicon glyphicon-ban-circle"></span></label>
													</td>
												</tr>
												<tr>
													<th>Minimum<br />Alpha</th>
													<td ><div class="showRangeValue"><input type="range"  min="0" max="1" value="0.1" step="0.01" name="brushMinimumPressureAlpha"  ></div></td>
												</tr>
											</table>
										</div>
									</div>
								</form>
								<script>
								//브러시 툴박스 설정
								!function(){

									var fcl = document.formToolBrush.cloneNode(true);
									fcl.id +='2';
									fcl.name +='2';
									$(fcl).find('.panel-heading').each(function(){
										$(this).text($(this).text().replace("%d",2))
									});
									$(fcl).removeClass('wc-tool-brush').addClass('wc-tool-brush2');
									document.formToolBrush.parentNode.appendChild(fcl);
									var fcl = document.formToolBrush.cloneNode(true);
									fcl.id +='3';
									fcl.name +='3';
									$(fcl).find('.panel-heading').each(function(){
										$(this).text($(this).text().replace("%d",3))
									});
									$(fcl).removeClass('wc-tool-brush').addClass('wc-tool-brush3');
									document.formToolBrush.parentNode.appendChild(fcl);

									var fcl = document.formToolBrush;
									$(fcl).find('.panel-heading').each(function(){
										$(this).text($(this).text().replace("%d",1))
									});

								}()
								</script>
								<form name="formToolPattern" action="javascript:void(0)" class="wc-tool wc-tool-pattern" onsubmit="this.onchange();return false" onchange="wc2.syncBrush();"  oninput="this.onchange()">
									<div class="panel panel-default">
										<div  class="panel-heading">Pattern</div>
										<div  class="panel-body">
											<table class="">
												<col width="60">
												<col width="">
												<tr class="bg-grid" >
													<th colspan="2" height="100" id="formToolPatternCanvasBox" align="center" ><img id="imagePattern" src="img/bg.gif"></th>
												</tr>
												<tr>
													<th>Size</th>
													<td><div class="showRangeValue"><input type="range" min="1" max="100" size="5" name="width" maxlength="5" value="10" ></div></td>
												</tr>
												<tr>
													<th>alpha</th>
													<td><div class="showRangeValue"><input type="range" min="0" max="1" value="0.5" step="0.01" name="globalAlpha"  ></div></td>
												</tr>
												<tr>
													<th>Spacing</th>
													<td><div class="showRangeValue"><input type="range"  min="0.5" max="10" value="1" step="0.1" name="brushSpacing"  ></div></td>
												</tr>
											</table>
											<div id="toolPatternList">

											</div>

										</div>
									</div>
								</form>
								<form name="formToolCrop" action="javascript:void(0)" class="wc-tool wc-tool-crop" onsubmit="return false">
									<div class="panel panel-default">
										<div  class="panel-heading">Crop</div>
										<div  class="panel-body">
											<table class="" style="width:100%">
												<col width="60">
												<col width="">
												<tr>
													<th>X</th>
													<th><input type="text" class="form-control readonly" name="x" value="0" readonly></th>
												</tr>
												<tr>
													<th>Y</th>
													<th><input type="text" class="form-control readonly" name="y" value="0" readonly></th>
												</tr>
												<tr>
													<th>Width</th>
													<th><input type="text" class="form-control readonly" name="width" value="0" readonly></th>
												</tr>
												<tr>
													<th>Height</th>
													<th><input type="text" class="form-control readonly" name="height" value="0" readonly></th>
												</tr>
											</table>
										</div>
									</div>
								</form>
								<form name="formConfirmInitPreview" action="javascript:void(0)" class="wc-tool wc-tool-image wc-tool-text wc-tool-transform wc-tool-concentratedLineRadial wc-tool-concentratedLineLinear" onsubmit="return false">
									<div class="panel panel-default">
										<div  class="panel-heading">Confirm/Init</div>
										<div  class="panel-body">
											<table class="" style="width:100%">
												<col width="50%">
												<col width="50%">
												<tr>
													<th><button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" onclick="wc2.cmdTool('confirm')"  type="button"> confirm</button></th>
													<th><button class="btn btn-default btn-sm  glyphicon glyphicon-ban-circle" onclick="wc2.cmdTool('initPreview')"  type="button"> init</button></th>
												</tr>
											</table>
										</div>
									</div>
								</form>
								<form name="formConfirm" action="javascript:void(0)" class="wc-tool wc-tool-crop" onsubmit="return false">
									<div class="panel panel-default">
										<div  class="panel-heading">Confirm/Reset</div>
										<div  class="panel-body">
											<table class="" style="width:100%">
												<col width="50%">
												<col width="50%">
												<tr>
													<th><button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" onclick="wc2.cmdTool('confirm')"  type="button"> confirm</button></th>
													<th><button class="btn btn-default btn-sm  glyphicon glyphicon-ban-circle" onclick="wc2.cmdTool('reset')"  type="button"> reset</button></th>
												</tr>
											</table>
										</div>
									</div>
								</form>

								<form name="formMove" action="javascript:void(0)" class="wc-tool wc-tool-move" onsubmit="return false">
									<div class="panel panel-default">
										<div  class="panel-heading">Move</div>
										<div  class="panel-body">
											<table class="" style="width:100%">
												<col width="50%">
												<col width="50%">
												<tr>
													<th colspan="2"><button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" onclick="wc2.cmdTool('confirm')"  type="button"> center</button></th>
												</tr>
											</table>
										</div>
									</div>
								</form>

								<!-- wc-save-setting  를 사용하지 않는다. wc2.syncColor();에서 처리된다. -->
								<form name="formToolColor" id="formToolColor" action="javascript:void(0)" class="wc-tool wc-tool-line  wc-tool-curve wc-tool-pen wc-tool-rect  wc-tool-circle wc-tool-text wc-tool-spuit wc-tool-brush  wc-tool-brush2 wc-tool-brush3 wc-tool-concentratedLineRadial wc-tool-concentratedLineLinear  " onsubmit="return false" onchange="wc2.syncColor();" oninput="this.onchange()" >
									<div class="panel panel-default">
										<div  class="panel-heading">Color</div>
										<div  class="panel-body">
											<table class="" style="width:100%">
												<col width="40%">
												<col width="20%">
												<col width="40%">
												<tr>
													<th>Line</th>
													<th></th>
													<th>Fill</th>
												</tr>
												<tr>
													<th><input type="hidden" name="strokeStyle" id="strokeStyle" value="rgb(0,0,0)">
													</th>
													<th><button class="btn btn-default btn-xs glyphicon glyphicon-resize-horizontal" type="button" onclick="wc2.exchangeColor();wc2.syncBrush();wc2.cmdTool('predraw')" title="exchange color"></button></th>
													<th><input type="hidden" name="fillStyle" id="fillStyle" value="rgb(255,255,255)"></th>
												</tr>
											</table>
										</div>
									</div>
								</form>



								<form name="formPropHidden" action="javascript:void(0)" class="wc-tool wc-tool-line2" onsubmit="return false">
									테스트용 폼. 보이면 안된다.
								</form>
								<hr class="soften">
								<form name="formPropLayer" action="javascript:void(0)" onsubmit="return false">
									<div style="min-height:50px" >
										<div class="panel panel-default">
											<div  class="panel-heading">Layer</div>
											<div  class="panel-body">
												<div class="panel-body btn-group-xs" role="group">
													<button type="button" class="btn btn-default glyphicon glyphicon-plus-sign" onclick="wc2.cmdLayer('new')"></button>
													<button type="button" class="btn btn-default glyphicon glyphicon-minus-sign" onclick="confirm('remove Layer?')?wc2.cmdLayer('remove'):''" ></button>
													<button type="button" class="btn btn-default glyphicon glyphicon-circle-arrow-up" onclick="wc2.cmdLayer('moveUp')"></button>
													<button type="button" class="btn btn-default glyphicon glyphicon-circle-arrow-down"  onclick="wc2.cmdLayer('moveDown')"></button>
												</div>
												<div class="panel-body btn-group-xs" role="group">
													<button type="button" class="btn btn-default btn-sm glyphicon glyphicon-duplicate" onclick="wc2.cmdLayer('duplicate')" title="Duplicate"></button>
													<button type="button" class="btn btn-default btn-sm glyphicon glyphicon-arrow-down" onclick="confirm('merge-down Layer?')?wc2.cmdLayer('mergeDown'):''"  title="MergeDown"></button>
													<button type="button" class="btn btn-default btn-sm glyphicon glyphicon-erase" onclick="wc2.cmdLayer('clear')"  title="Clear"></button>
													<select name="layerOpacity"  class="btn btn-default btn-sm" style="width:5em" onchange="wc2.cmdLayer('opacity',this.value)">
														<option value="1">100%</option>
														<option value="0.9">90%</option>
														<option value="0.8">80%</option>
														<option value="0.7">70%</option>
														<option value="0.6">60%</option>
														<option value="0.5">50%</option>
														<option value="0.4">40%</option>
														<option value="0.3">30%</option>
														<option value="0.2">20%</option>
														<option value="0.1">10%</option>
														<option value="0.0">0%</option>
													</select>
												</div>
												<div class="panel-body btn-group-xs" role="group">
													<label><input type="checkbox" name="layerNotHide" value="1" onchange="wc2.cmdLayer('hide',!this.checked)">Show</label>
												</div>
												<div class="wc2-prop-list ">
													<ul class="list-group overflow-scrolly" id="propLayerList">
														<li class="list-group-item wc-prop-layer wc-prop-layer-empty">#EMPTY#</li>
													</ul>
												</div>
											</div>
										</div>
									</div>
								</form>
								<hr class="soften">
								<div style="min-height:50px" >
									<div class="panel panel-default">
										<div  class="panel-heading">History</div>
										<div  class="panel-body">
											<div class="wc2-prop-list ">
												<ul class="list-group overflow-scrolly" id="propHistoryList">
													<li class="list-group-item  wc-prop-history wc-prop-history-empty">#EMPTY#</li>
												</ul>
											</div>
										</div>
									</div>
								</div>
							</div>
						</div>
				</aside>


				<div id="rootArea">
					<article id="contentArea" >
						<div id="tabs">
							<table style="width:100%;height:100%; table-layout:fixed">
							<tr>
								<td height="10">
									<ul id="tabsTitle">
									<li style="float:right"><a href="#tabs-1" onclick="$('#btn_new').trigger('click');return false" title="quick new file" id="btnQuickNewFile">+</a></li>
									</ul>
								</td>
							</tr>
							<tr>
								<td height="*" style="height:100%">
									<div id="tabsContent">
									<!-- 이곳에 WebCanvasBundle 기반의 tabFrame이 추가된다. -->
									<div id="tabs-1" style="text-align:center; padding:10px;">New or Open</div>
									</div>
								</td>
							</tr>
							</table>
						</div>
					</article>
				</div> <!-- <div id="rootArea"> -->


				<!-- 이 속의 내용은 안보여준다. 노드를 복사해서 사용할려고 만든것이다.-->
				<article id="hiddenArea" >
					<div id="defaultTabContent">
						<div class="wcb-frame">
							<div class="wcb-move">
								<div class="wcb-box">
								</div>
							</div>
						</div>
						<select class="btn btn-default wcb-zoom">
							<option value="1" disabled>Zoom</option>
							<option value="0.1">10%</option>
							<option value="0.2">20%</option>
							<option value="0.3">30%</option>
							<option value="0.4">40%</option>
							<option value="0.5">50%</option>
							<option value="0.6">60%</option>
							<option value="0.7">70%</option>
							<option value="0.8">80%</option>
							<option value="0.9">90%</option>
							<option value="1" selected>100%</option>
							<option value="1.1">110%</option>
							<option value="1.2">120%</option>
							<option value="1.5">150%</option>
							<option value="2">200%</option>
							<option value="2.5">250%</option>
							<option value="3">300%</option>
							<option value="4">400%</option>
							<option value="5">500%</option>
						</select>
					</div>
				</article>
				<!-- //이 속의 내용은 안보여준다.-->

				<!-- 메뉴 상세 부분 -->
				<article id="menuDetailArea" class="overflow-scrolly" >
				    <script>
				    function newImage(w,h){
				    var f = document.formMenuDetailFileNew;
				      f.width.value = w;
				      f.height.value = h;
				      $(f.width).trigger('change');
				      $(f.height).trigger('change');
				      $('#btn_new').trigger('click');
				    }
				    </script>
				    <form name="formMenuDetailFileNew"  id="formMenuDetailFileNew" action="javascript:void(0)" class="wc-mdetail wc-mdetail-file-new wc-save-setting" >
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">New File</div>
				        <div  class="panel-body">
				            <ul class="list-group " onclick="return wc2.btnHideMenuDetail(event,'a'); ">
				              <li class="list-group-item list-group-item-success">Manual</li>
				              <li class="list-group-item">
				                <div class="form-inline">
				                  <input class="form-control" type="number" name="width" maxlength="6" min="1" max="99999" value="300" placeholder="width.."> X
				                  <input class="form-control" type="number" name="height" maxlength="6" min="1" max="99999" value="300" placeholder="height..">
				                  <button  type="button" id="btn_new" class="btn btn-default glyphicon glyphicon-file" onclick="wc2.cmdWcb('new',this.form.width.value,this.form.height.value);wc2.hideMenuDetail();" >New</button>
				                  <button  type="button" class="btn btn-default glyphicon glyphicon-remove-circle"  onclick="wc2.hideMenuDetail();" >Close</button>
				                </div>
				              </li>
				              <li class="list-group-item list-group-item-success">Rect</li>
				              <li class="list-group-item"><a href="#" onclick="newImage(100,100);false;">100x100</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(200,200);false;">200x200</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(300,300);false;">300x300</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(400,400);false;">400x400</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(500,500);false;">500x500</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(600,600);false;">600x600</a></li>
				              <li class="list-group-item"><a href="#" class="btn btn-default glyphicon glyphicon-remove-circle" onclick="return false;"> Close</a></li>


				              <li class="list-group-item list-group-item-success">3:4</li>
				              <li class="list-group-item"><a href="#" onclick="newImage(640,480);return false;">640x480 (VGA)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(800,600);return false;">800x600 (SVGA)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(1024,768);return false;">1024x768 (XGA)</a></li>
				              <li class="list-group-item list-group-item-success">16:9</li>
				              <li class="list-group-item"><a href="#" onclick="newImage(1360,768);return false;">1360x768 (HD)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(1600,900);return false;">1600x900 (HD+)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(1920,1080);return false;">1920x1080 (FHD)</a></li>
				              <li class="list-group-item list-group-item-success">Smart Phone</li>
				              <li class="list-group-item"><a href="#" onclick="newImage(320,480);return false;">320x480 (iphone3)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(480,800);return false;">480x800 (galaxyS1)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(640,960);return false;">640x960 (iphone4)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(640,1136);return false;">640x1136 (iphone5)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(720,1280);return false;">720x1280 (galaxyS3)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(800,1280);return false;">800x1280 (galaxynote1)</a></li>
				              <li class="list-group-item"><a href="#" onclick="newImage(1080,1920);return false;">1080x1920 (galaxynote3)</a></li>
				              <li class="list-group-item"><a href="#" class="btn btn-default glyphicon glyphicon-remove-circle" onclick="return false;"> Close</a></li>
				            </ul>

				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailFileOpen" action="javascript:void(0)" class="wc-mdetail wc-mdetail-file-open" onreset="wc2.hideMenuDetail();">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">File Open</div>
				        <div  class="panel-body">
				            <ul class="list-group " onclick="return wc2.btnHideMenuDetail(event,'a'); ">
				              <li class="list-group-item list-group-item-success">Select File</li>
				              <li class="list-group-item">
				                <div class="input-group">
				                  <span class="input-group-addon" id="formMenuDetailFileOpen-url-0">URL/DataUrl</span>
				                  <input type="text" class="form-control" name="url" spellcheck="false"  placeholder="Image URL..." onchange="wc2.btnFileOpenPreviewImage(this)"  >
				                  <span class="input-group-btn">
				                  <button class="btn btn-default" type="button" onclick="wc2.btnFileOpenPreviewImage(this.form.url);">Load</button>
				                  </span>
				                </div>
				              </li>
				              <li class="list-group-item">
				                <div class="input-group">
				                  <span class="input-group-addon" id="formMenuDetailFileOpen-url-0">From PC</span>
				                  <input type="file" class="form-control" name="fileInPC"  placeholder="Image URL..." accept="image/*,.wcbjson,.wcblzs" nchange="wc2.btnFileOpenPreviewImage(this)" >
				                  <span class="input-group-btn">
				                  <button class="btn btn-default" type="button" onclick="wc2.btnFileOpenPreviewImage(this.form.fileInPC);">Load</button>
				                  </span>
				                </div>
				              </li>
				              <li class="list-group-item">
				                <div class="input-group">
				                  <span class="input-group-addon" id="formMenuDetailFileOpen-url-0">From Clipboard</span>
				                  <input type="text" class="form-control" placeholder="on Paste. 붙여넣기 하세요."  disabled="disabled"  onpaste="wc2.btnFileOpenPreviewImageFromPaste(event)" onchange="this.value=''" onblur="this.value=''" >
				                  <span class="input-group-btn">
				                  <button class="btn btn-default" type="button" disabled="disabled">Load</button>
				                  </span>
				                </div>
				              </li>
				              <li class="list-group-item">
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="reset" onclick="wc2.cmdWcb('open',document.getElementById('formMenuDetailFileOpenPreview'));"> Open</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="reset"> Cancel</button>
				              </li>
				              <li class="list-group-item list-group-item-success">PreView</li>
				              <li class="list-group-item">
				                <img id="formMenuDetailFileOpenPreview" src="img/bg.gif" class="bg-grid" />
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailFileSave" action="javascript:void(0)" class="wc-mdetail wc-mdetail-file-save">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">File Save</div>
				        <div  class="panel-body">
				            <ul class="list-group">
				              <li class="list-group-item list-group-item-success">Setting File</li>
				              <li class="list-group-item">
				                <div class="input-group">
				                  <input type="text" class="form-control" name="saveFileName"  placeholder="Image URL..." axlength="50"  id="formMenuDetailFileSave-saveFileName" >
				                   <span class="input-group-addon">
				                    <select name="saveFileType" style="width:5em" onchange="this.form.saveFileQuality.disabled = (this.value == 'png'||this.value == 'wcbjson'); this.onblur()" onblur="wc2.btnFileSavePreview();">
				                      <option value="png" class="image-type-png">.png</option>
				                      <option value="jpg" class="image-type-jpg">.jpg</option>
				                      <option value="gif" class="image-type-gif">.gif</option>
				                      <option value="webp" class="image-type-webp">.webp</option>
				                      <option value="wcbjson">.wcbjson</option>
				                      <option disabled value="wcblzs">.wcblzs</option>
				                    </select>
				                    <select name="saveFileQuality" style="width:5em" disabled class="disabled" title="quality" onchange="this.onblur();" onblur="wc2.btnFileSavePreview();">
				                      <option value="1">100%</option>
				                      <option value="0.9">90%</option>
				                      <option value="0.8">80%</option>
				                      <option value="0.7">70%</option>
				                      <option value="0.6">60%</option>
				                      <option value="0.5">50%</option>
				                      <option value="0.4">40%</option>
				                      <option value="0.3">30%</option>
				                      <option value="0.2">20%</option>
				                      <option value="0.1">10%</option>
				                    </select>
				                  </span>
				                </div>

				              </li>

				              <li class="list-group-item text-danger hide">
				                <strong>webp</strong> is supported by only Chrome.<br>
				                <strong>jpg</strong> is not supported by old browser.<br>
				                <strong>wcbjson</strong> : support multi-Layer.(json file) <br>
				                <strong>wcblzs</strong> wcbjson is compressed by <a href="http://pieroxy.net/blog/pages/lz-string/index.html" target="_blank">LZ-String</a> <br>(wcblzs is binary file, reduce 7~9% then wcbjson ) <br>
				                Recommend using the latest version browser.<br>
				                The upload file will not be overwritten. Instead stored under a new name.
				              </li>

				              <li class="list-group-item">
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-floppy-save" type="button" onclick="wc2.btnFileSave(this.form);wc2.hideMenuDetail();"> Save In Local Disk</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-cloud-upload" type="button" onclick="wc2.btnFileUpload(this.form);wc2.hideMenuDetail();"> Upload In Web</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-picture hide" id="btnFileSaveCallback" type="button" onclick="wc2.btnFileSaveCallback(this.form);wc2.hideMenuDetail();"> Save Callback</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				              <li class="list-group-item">
				                <div id="formMenuDetailFileSave-preview-size">0 KB</div>
				                <div  style="max-height:200px;overflow:auto;padding:10px;background-color:#ccc;">
				                <img class="bg-grid" src="about:blank" id="formMenuDetailFileSave-preview" />
				                </div>
				                <!-- <button class="btn btn-default btn-sm  glyphicon glyphicon-picture" type="button" onclick="wc2.btnFileSavePreview(this.form);return false;"> Preview</button> -->
				              </li>

				            </ul>
				        </div>
				      </div>
				    </form>
						<form name="formMenuDetailFileView" action="javascript:void(0)" class="wc-mdetail wc-mdetail-file-view">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">View Image</div>
				        <div  class="panel-body">
				            <ul class="list-group">
											<li class="list-group-item list-group-item-info" id="wc-mdetail-file-view-title"></li>
											<li class="list-group-item list-group-item-info" id="wc-mdetail-file-view-info"></li>
				              <li class="list-group-item no-padding" id="wc-mdetail-file-view-image"></li>
				              <li class="list-group-item text-center">
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailHelpHelp" action="javascript:void(0)" class="wc-mdetail wc-mdetail-help-help">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Help</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">Hello!</li>
				              <li class="list-group-item" style="text-align:left">
				                <h3>Tested Browsers</h3>
				                <ul>
				                  <li>Chrome :42.0.2311.135</li>
				                  <li>FireFox : 33.0</li>
				                  <li>IE : 11.0.9600.17728 (11.0.18)</li>
				                </ul>
				              </li>
				              <li class="list-group-item"  style="text-align:left">
				                <h3>Info</h3>
				                <ul>
				                  <li>공대여자 : <a href="http://www.mins01.com/" target="_blank">Homepage</a></li>
				                  <li>URL : <a href="http://www.mins01.com/WC2/WC2.html" target="_blank">http://www.mins01.com/WC2/WC2.html</a></li>
				                  <li>github : <a href="https://github.com/mins01/WC2/" target="_blank">https://github.com/mins01/WC2/</a></li>
				                  <li>readme : <a href="readme.txt" target="_blank">readme.txt</a></li>
				                  <li>"공대여자는 이쁘다."</li>
				                  <li>계속 수정중.</li>
				                </ul>
				              </li>
				              <li class="list-group-item text-danger">
				                <strong>webp</strong> is supported by only Chrome.<br>
				                <strong>jpg</strong> is not supported by old browser.<br>
				                <strong>jcbjson</strong> is multi-layer file. (Json)<br>
				                Recommend using the latest version browser.
				              </li>
				              <li class="list-group-item">
				                <div>
				                  <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>
				                </div>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailImageRename" action="javascript:void(0)" class="wc-mdetail wc-mdetail-image-rename" onsubmit="wc2.cmdWcb('rename',this.renameName.value);wc2.hideMenuDetail();">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Image Rename</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">name</li>
				              <li class="list-group-item" style="text-align:left">
				                <div class="input-group">
				                  <span class="input-group-addon" id="formMenuDetailFileOpen-url-0">name</span>
				                  <input type="text" class="form-control" name="renameName" maxlength="50" placeholder="name..." >
				                </div>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit"> Rename</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerRename" action="javascript:void(0)" class="wc-mdetail wc-mdetail-layer-rename" onsubmit="wc2.cmdLayer('rename',this.renameName.value);wc2.hideMenuDetail();">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Layer Rename</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">name</li>
				              <li class="list-group-item" style="text-align:left">
				                <div class="input-group">
				                  <span class="input-group-addon" id="formMenuDetailFileOpen-url-0">name</span>
				                  <input type="text" class="form-control" name="renameName" maxlength="50" placeholder="name..." >
				                </div>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit"> Rename</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailImageResize" action="javascript:void(0)" class="wc-mdetail wc-mdetail-image-resize" onsubmit="wc2.cmdWcb('resize',this.width.value,this.height.value);wc2.hideMenuDetail();return false;">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Image Resize (Scale Image)</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">setting</li>
				              <li class="list-group-item" style="text-align:left">
				                <div class="row">
				                  <div class="col-lg-6">
				                    <div class="input-group">
				                      <span class="input-group-addon">
				                        <span class="glyphicon glyphicon-resize-horizontal"></span>
				                        width
				                      </span>
				                      <input type="number" min="1" max="99999" step="any" name="width" placeholder="width..." class="form-control" onkeyup="this.onchange();"
				                      onchange="if(this.form.sameProportion.checked){
				                        if(isNaN(this.form.width.value)){return false;}
				                        this.form.height.value = Math.round(this.form.height.defaultValue*(this.form.width.value/this.form.width.defaultValue));
				                      }"
				                      >
				                    </div>
				                  </div>
				                  <div class="col-lg-6">
				                    <div class="input-group">
				                      <span class="input-group-addon">
				                        <span class="glyphicon glyphicon-resize-vertical"></span>
				                        height
				                      </span>
				                      <input type="number" min="1" max="99999" step="any" name="height" placeholder="height..." class="form-control" onkeyup="this.onchange()" onchange="if(this.form.sameProportion.checked){
				                        if(isNaN(this.form.height.value)){return false;}
				                        this.form.width.value = Math.round(this.form.width.defaultValue*(this.form.height.value/this.form.height.defaultValue));
				                      }">
				                    </div>
				                  </div>
				                </div>
				              </li>
				              <li class="list-group-item checkbox" >
				                <label><input type="checkbox" checked name="sameProportion" value="1" >same proportion</label>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default  btn-sm  glyphicon glyphicon-refresh" type="reset"> Reset</button>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit"> Resize</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailImageAdjustSize" action="javascript:void(0)" class="wc-mdetail wc-mdetail-image-adjustSize" onsubmit="wc2.cmdWcb('adjustSize',this.width.value,this.height.value,this.controlPoint.value);wc2.hideMenuDetail();return false;" onreset="formMenuDetailImageAdjustSizeButtons(this,0)">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Canvas Resize (Adjust Size)</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">setting</li>
				              <li class="list-group-item" style="text-align:left">
				                <div class="row">
				                  <div class="col-lg-6">
				                    <div class="input-group">
				                      <span class="input-group-addon">
				                        <span class="glyphicon glyphicon-resize-horizontal"></span>
				                        width
				                      </span>
				                      <input type="number" min="1" max="99999" step="any" name="width" placeholder="width..." class="form-control" onkeyup="this.onchange()"  onchange="if(this.form.sameProportion.checked){
				                        if(isNaN(this.form.width.value)){return false;}
				                        this.form.height.value = Math.round(this.form.height.defaultValue*(this.form.width.value/this.form.width.defaultValue));
				                      }">
				                    </div>
				                  </div>
				                  <div class="col-lg-6">
				                    <div class="input-group">
				                      <span class="input-group-addon">
				                        <span class="glyphicon glyphicon-resize-vertical"></span>
				                        height
				                      </span>
				                      <input type="number" min="1" max="99999" step="any" name="height" placeholder="height..." class="form-control" onkeyup="this.onchange()" onchange="if(this.form.sameProportion.checked){
				                        if(isNaN(this.form.height.value)){return false;}
				                        this.form.width.value = Math.round(this.form.width.defaultValue*(this.form.height.value/this.form.height.defaultValue));
				                      }">
				                    </div>
				                  </div>
				                </div>
				              </li>
				              <li class="list-group-item checkbox" >
				                <label><input type="checkbox" checked name="sameProportion" value="1" >same proportion</label>
				              </li>
				              <li class="list-group-item" >
				                <div style="margin-bottom:2px;">
				                <select name="controlPoint" class="btn btn-default " >
				                  <option value="0" selected>↖: Left Top</option>
				                  <option value="1">↑: Center Top</option>
				                  <option value="2">↗: Right Top</option>
				                  <option value="3">←: Left Middle</option>
				                  <option value="4">◎: Center Middle</option>
				                  <option value="5">→: Right Middle</option>
				                  <option value="6">↙: Left Bottom</option>
				                  <option value="7">↓: Center Bottom</option>
				                  <option value="8">↘: Right Bottom</option>
				                </select>
				                </div>
				                  <div>
				                      <div>
				                      <button type="button" class="btn btn-default no-glyphicon active"  name="controlPointR" value="0" checked>↖</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="1" >↑</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="2" >↗</button>
				                      </div>
				                      <div>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="3" >←</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="4" >◎</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="5" >→</button>
				                      </div>
				                      <div>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="6" >↙</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="7" >↓</button>
				                      <button type="button" class="btn btn-default no-glyphicon"  name="controlPointR" value="8" >↘</button>
				                      </div>
				                  </div>
				                <script>

				                function formMenuDetailImageAdjustSizeButtons(f,n){
				                  $(f).find("button[name='controlPointR']").each(
				                    function(idx,el){
				                      $(el).removeClass("active");
				                    }
				                  )
				                  $(f).find("button[name='controlPointR'][value="+n+"]").each(
				                    function(idx,el){
				                    $(el).addClass("active");
				                    }
				                  )
				                }
				                $(document.formMenuDetailImageAdjustSize).on("click","button[name='controlPointR']",function(event){
				                  var f = event.target.form;
				                  f.controlPoint.value = event.target.value;
				                  formMenuDetailImageAdjustSizeButtons(f,event.target.value);
				                });
				                $(document.formMenuDetailImageAdjustSize.controlPoint).bind("click",function(event){
				                  var f = event.target.form;
				                  formMenuDetailImageAdjustSizeButtons(f,event.target.value);

				                });
				                </script>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default  btn-sm  glyphicon glyphicon-refresh" type="reset"> Reset</button>
				              </li>
				              <li class="list-group-item" >
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit"> Resize</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>
						<form name="formMenuDetailGuideLine" action="javascript:void(0)" class="wc-mdetail wc-mdetail-image-guideLine" oninput="wc2.cmdWcb('guideLine',this.width.value);" onsubmit="this.oninput();wc2.hideMenuDetail();return false;">
							<div class="panel panel-default wc2-panel" >
								<div  class="panel-heading">Guide Line</div>
								<div  class="panel-body">
										<ul class="list-group ">
											<li class="list-group-item list-group-item-success">setting</li>
											<li class="list-group-item text-center" >
												<div class="row">
													<div class="col-xs-3"><label>width/height</label></div>
													<div class="col-xs-9"><div class="showRangeValue" data-val="128"><input type="range" name="width" value="0" min="0" max="1000" step="1"></div></div>
												</div>
											</li>
											<li class="list-group-item  text-center">
												<div class="row">
													<div class="col-xs-3"><label>sample</label></div>
													<div class="col-xs-9 text-center">
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='4';this.form.oninput()">4px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='5';this.form.oninput()">5px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='7';this.form.oninput()">7px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='10';this.form.oninput()">10px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='20';this.form.oninput()">20px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='30';this.form.oninput()">30px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='40';this.form.oninput()">40px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='50';this.form.oninput()">50px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='100';this.form.oninput()">100px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='150';this.form.oninput()">150px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='200';this.form.oninput()">200px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='250';this.form.oninput()">250px</button>
														<button type="button" class="btn btn-xs btn-default" onclick="this.form.width.value='300';this.form.oninput()">300px</button>
													</div>
												</div>
											</li>
											<li class="list-group-item" >
												<button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit"> Confirm</button>
											</li>
										</ul>
								</div>
							</div>
						</form>
				    <form name="formMenuDetailEditPreferences"  id="formMenuDetailEditPreferences" action="javascript:void(0)" class="wc-mdetail wc-mdetail-edit-preferences" onsubmit="wc2.preferencesByForm(this);return false;" onreset="">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Preferences</div>
				        <div  class="panel-body">
				            <ul class="list-group ">
				              <li class="list-group-item list-group-item-success">setting</li>
				              <li class="list-group-item">
				                <div  class="form-inline">
				                  <span>Use Preview Image At Layer Info? : </span>
				                  <select class="form-control" name="usePreviewImageAtLayerInfo">
				                    <option value="0" selected>Auto (by Width)</option>
				                    <option value="1">Use</option>
				                    <option value="2">Not Use (Fast)</option>
				                  </select>
				                </div>
				                <div class="form-inline">
				                  <span>select Input device : </span>
				                  <select  class="form-control"  name="usePointerType">
				                    <option value="ALL">ALL</option>
				                    <option value="mouse">mouse</option>
				                    <option value="pen">pen</option>
				                    <option value="touch">touch</option>
				                  </select>
				                </div>
				                <div>
				                  (for PointerEvent chrome 55+)
				                </div>
				              </li>
				              <li class="list-group-item list-group-item-success">change viewport content sacle for Mobile-Device</li>
				              <li class="list-group-item" >
				                <div  class="form-inline">
				                  <select  class="form-control"  name="viewportContentScale">
				                    <option value="1">default</option>
				                    <option value="0.667">x1.5</option>
				                    <option value="0.5">x2</option>
				                    <option value="0.333">x3</option>
				                    <option value="0.25">x4</option>
				                    <option value="0.20">x5</option>
				                    <option value="">Web 1:1</option>
				                  </select>
				                  <br>Tested by Mobile Chrome 41.0.2272.96
				                </div>
				                <button class="btn btn-default  btn-sm  glyphicon glyphicon-refresh" type="button" onclick="this.form.reset();this.form.onsubmit()"> Default</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-ok-circle" type="submit" onclick="wc2.hideMenuDetail();"> Confirm</button>
				                <button class="btn btn-default btn-sm  glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Cancel</button>
				              </li>
				              <li class="list-group-item list-group-item-success">Clear saved setting</li>
				              <li class="list-group-item" >
				                <button class="btn btn-default  btn-sm  glyphicon glyphicon-remove" type="button" onclick="wc2.clearSavedSetting();"> Reset?</button>
				              </li>
				            </ul>
				        </div>
				      </div>
				    </form>


				    <form name="formMenuDetailLayerFilterPreview" action="javascript:void(0)"
				      class="wc-mdetail wc-mdetail-layer-filter-preview" >
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Preview</div>
				        <div  class="panel-body" id="filterCanvasBox">
				          BOX
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterInvert" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-invert" onsubmit="wc2.cmdFilter(this.cmd.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="invert">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Invert</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button"  onclick="wc2.cmdPreviewFilter('reset');" > Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterColorize" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-colorize" onsubmit="wc2.cmdFilter(this.cmd.value,this.R.value,this.G.value,this.B.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.R.value,this.G.value,this.B.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="colorize">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Colorize</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button"  onclick="wc2.cmdPreviewFilter('reset');" > Reset</button>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>R</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="R" value="0" min="-255" max="255"   step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>G</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="G" value="0" min="-255" max="255"   step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>B</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="B" value="0" min="-255" max="255"   step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterGrayscale" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-grayscale" onsubmit="wc2.cmdFilter(this.cmd.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value);"  oninput="this.onchange()" >
				      <!-- <input type="hidden" name="cmd" value="grayscale"> -->
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Grayscale</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <select class="form-control" name="cmd">
				                <option value="grayscale">grayscale</option>
				                <option value="grayscaleAvg">grayscaleAvg</option>
				                <option value="luminance">luminance</option>
				              </select>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterSharpen" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-sharpen" onsubmit="wc2.cmdFilter(this.cmd.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="sharpen">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">sharpen</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterBrightnessContrast" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-brightness" onsubmit="wc2.cmdFilter(this.cmd.value,this.brightness.value,this.contrast.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.brightness.value,this.contrast.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="brightness">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Brightness &amp; Contrast</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Brightness</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="brightness" value="0" min="-1" max="1"   step="0.01"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Contrast</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="contrast" value="1" min="-1" max="1"  step="0.01"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterThreshold" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-threshold" onsubmit="wc2.cmdFilter(this.cmd.value,this.threshold.value,this.thresholdLow.value,this.thresholdHigh.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.threshold.value,this.thresholdLow.value,this.thresholdHigh.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="threshold">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">threshold</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Threshold</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="threshold" value="128" min="0" max="255" step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Low</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="thresholdLow" value="0" min="0" max="255" step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Hight</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="thresholdHigh" value="255" min="0" max="255" step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterGaussianBlur" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-gaussianblur" onsubmit="wc2.cmdFilter(this.cmd.value,this.diameter.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.diameter.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="gaussianBlur">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">GaussianBlur</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Diameter</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="diameter" value="0" min="0" max="128" step="0.1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterSobel" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-sobel" onsubmit="wc2.cmdFilter(this.cmd.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value);"  oninput="this.onchange()" >
				      <!-- <input type="hidden" name="cmd" value="sobel"> -->
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Sobel &amp; Laplace</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <select class="form-control" name="cmd">
				                <option value="sobel">sobel</option>
				                <option value="laplace">laplace</option>
				              </select>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterAbove" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-above" onsubmit="wc2.cmdFilter(this.cmd.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="above">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">Above</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterSistortSine" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-distortsine" onsubmit="wc2.cmdFilter(this.cmd.value,this.amount.value,this.yamount.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.amount.value,this.yamount.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="distortSine">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">DistortSine</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>X-Amount</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="amount" value="0.5" min="-5" max="5" step="0.1" ></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>Y-Amount</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="yamount" value="0.5" min="-5" max="5" step="0.1" onchange="$('#spanYamount').html(this.value);"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterApplyPalette" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-applyPalette" onsubmit="wc2.cmdFilter(this.cmd.value,this.palette.value,this.is_optimize.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.palette.value,this.is_optimize.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="applyPalette">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">ApplyPalette</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <select class="form-control" name="palette" id="wc-mdetail-layer-filter-applyPalette-palette">
				                <option value="color_1bit">color_1bit</option>
				              </select>
				              <script>
				              $(function(){
				                var t = document.getElementById('wc-mdetail-layer-filter-applyPalette-palette');
				                $(t).html("");
				                for(var k in colorPalette.palettes){
				                  $(t).append('<option value="'+k+'">'+k+' ('+colorPalette.palettes[k].length+' colors)</option>')
				                }
				              })
				              </script>
				            </li>
				            <li class="list-group-item">
				                <div class="form-inline">
				                  <select class="form-control" name="is_optimize">
				                    <option value="0">none</option>
				                    <option value="1">colorLimitByPalette</option>
				                    <option value="2">median cout</option>
				                  </select>
				                </div>
				              </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				    <form name="formMenuDetailLayerFilterApplyColorDepth" action="javascript:void(0)"  class="wc-mdetail wc-mdetail-layer-filter-applyColorDepth" onsubmit="wc2.cmdFilter(this.cmd.value,this.depthR.value,this.depthG.value,this.depthB.value);wc2.hideMenuDetail();return false;" onchange="wc2.cmdPreviewFilter(this.cmd.value,this.depthR.value,this.depthG.value,this.depthB.value);"  oninput="this.onchange()" >
				      <input type="hidden" name="cmd" value="applyColorDepth">
				      <div class="panel panel-default wc2-panel" >
				        <div  class="panel-heading">ApplyColorDepth</div>
				        <div  class="panel-body" >
				          <ul class="list-group ">
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>R depth</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="depthR" value="0" min="2" max="256" step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>G depth</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="depthG" value="0" min="2" max="256" step="1"></div></div>
				              </div>
				            </li>
				            <li class="list-group-item">
				              <div class="row">
				                <div class="col-xs-3"><label>B depth</label></div>
				                <div class="col-xs-9"><div class="showRangeValue"><input type="range" name="depthB" value="0" min="2" max="256" step="1"></div></div>
				              </div>
				            </li>

				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-flash" type="button" onclick="this.form.onchange()"> Preview</button>
				              <button class="btn btn-default glyphicon glyphicon-refresh" type="button" onclick="wc2.cmdPreviewFilter('reset');"> Reset</button>
				            </li>
				            <li class="list-group-item">
				              <button class="btn btn-default glyphicon glyphicon-ok-circle" type="submit" > OK</button>
				              <button class="btn btn-default glyphicon glyphicon-remove-circle" type="button" onclick="wc2.hideMenuDetail();"> Close</button>

				            </li>
				          </ul>
				        </div>
				      </div>
				    </form>
				</article>
				<!-- //메뉴 상세 부분 -->



			</div> <!-- <div id="container"> -->

			<!-- 합쳐지고 최소화된 최신 자바스크립트 -->
			<script src="http://maxcdn.bootstrapcdn.com/bootstrap/3.3.7/js/bootstrap.min.js"></script>
			<!-- 드롭다운 메뉴 확장용 JS https://github.com/behigh/bootstrap_dropdowns_enhancement/blob/master/dist/js/dropdowns-enhancement.js -->
			<script src="./bootstrap/js/dropdowns-enhancement.js"></script>
			<!-- jquery-ui -->
			<script src="http://code.jquery.com/ui/1.11.4/jquery-ui.js"></script>

			<!-- spectrum on jquery https://bgrins.github.io/spectrum/ -->
			<script src="jquery/spectrum.js"></script>
			<!-- <script src="https://cdnjs.cloudflare.com/ajax/libs/spectrum/1.6.2/spectrum.min.js"></script> -->

			<!-- https://github.com/phstc/jquery-dateFormat -->
			<script src="jquery/jquery-dateFormat.min.js"></script>

			<!-- https://github.com/jquery/jquery-mousewheel -->
			<script src="jquery/jquery.mousewheel.js"></script>

			<!-- image area select http://odyniec.net/projects/imgareaselect/ -->
			<script type="text/javascript" src="jquery/odyniec-imgareaselect/jquery.imgareaselect.min.js"></script>

			<!-- https://github.com/ccampbell/mousetrap -->
			<script src="etcmodule/mousetrap.min.js"></script>
			<!-- https://github.com/eligrey/FileSaver.js -->
			<!--<script src="etcmodule/FileSaver.min.js"></script>-->
			<script src="etcmodule/FileSaver.js"></script>
			<!-- https://github.com/pieroxy/lz-string/ -->
			<script src="etcmodule/lz-string.min.js"></script>
			<!-- https://github.com/kig/canvasfilters -->
			<script src="etcmodule/filters.js"></script>
			<!-- https://github.com/jnordberg/gif.js -->
			<script src="etcmodule/gif/gif.js"></script>

			<script src="jquery/jquery-helper.js"></script>
			<!-- http://touchpunch.furf.com/ -->
			<!-- <script src="jquery/jquery.ui.touch-punch.min.js"></script> -->


			<script src="node_modules/rgbquant/src/rgbquant.js"></script>
			<script src="js/colorPalette.js<?=$tsync?>"></script>
			<script src="js/colorPalette.palettes.js<?=$tsync?>"></script>
			<script src="js/js-canvas-ConcentratedLine/ConcentratedLine.js<?=$tsync?>"></script>


			<!-- WC2 -->
			<script src="js/class.WebCanvas.js<?=$tsync?>"></script>
			<script src="js/class.WebCanvasBundle.js<?=$tsync?>"></script>
			<script src="js/wc2.js<?=$tsync?>"></script>
			<script src="js/wc2Tool.js<?=$tsync?>"></script>
			<script src="js/wc2Brush.js<?=$tsync?>"></script>
			<!-- <script src="js/wc2BrushList.js"></script> -->
			<script src="js/wc2PatternList.js<?=$tsync?>"></script>
			<script src="js/wc2Filter.js<?=$tsync?>"></script>
			<script src="js/wc2Helper.js<?=$tsync?>"></script>
			<script>
					wc2Helper.convertGif_workerScript = './etcmodule/gif/gif.worker.js';
			</script>
			<!-- -->



				<script>
				/*
			$(function() {
				wc2.init(); //초기화
				//wc2.showMenuDetail('file-save');
				//wc2.showMenuDetail('file-new');
				//wc2.showMenuDetail('help-help');
				if(document.location.search.length>4){ //입력된 URL의 QueryString을 기준으로 자동 처리한다.
					wc2.initByQueryString(document.location.search);
				}else{
					wc2.cmdWcb("new",300,300);
				}

				//wc2.showMenuDetail('file-new');
				//wc2.showMenuDetail('edit-preferences');
				wc2.hideMenuDetail();
				//wc2.showMenuDetail('image-resize');
				//wc2.setTool("crop");
			});
			*/
			$(function() {

				if (window.applicationCache.status == window.applicationCache.UPDATEREADY) {
					// Browser downloaded a new app cache.
					if (confirm('A new version of this site is available. Load it?')) {
						console.log("앱캐시 갱신 질문")
						window.location.reload(true);
					}
				} else {
					console.log("앱캐시 변경내역 없음.")
					// Manifest didn't changed. Nothing new to server.
				}

				wc2.init(); //초기화
				wc2Helper.attachTdRangeValueBox();
				//wc2.showMenuDetail('file-save');
				//wc2.showMenuDetail('file-new');
				//wc2.showMenuDetail('help-help');
				try{
					var init_loaded = false;
					if(document.location.search.length>4){ //입력된 URL의 QueryString을 기준으로 자동 처리한다.
						wc2.initByQueryString(document.location.search);
						init_loaded = true;
					}
					try{
						if(opener && "WC2CB" in opener){ //WC2 callback 객체
							wc2.initByWC2CB(opener.window.WC2CB);
							init_loaded = true;
						}
					}catch(e){
						console.log(e);
					}

					if(!init_loaded){
						//wc2.cmdWcb("new",300,300);
						$('#btn_new').trigger('click');
					}
				}catch(e){
					alert(e.name+":"+e.message);
					$('#btn_new').trigger('click');
				}


				//wc2.showMenuDetail('file-new');
				//wc2.showMenuDetail('edit-preferences');
				wc2.hideMenuDetail();
				//wc2.showMenuDetail('image-resize');
				//wc2.setTool("crop");
				// wc2.showMenuDetail('file-open');

			});
			</script>
	</body>
</html>
