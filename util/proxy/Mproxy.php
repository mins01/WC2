<?
/**
* 단순한 프록시 클래스
* proxy.php 에서 사용법을 확인바람.
* 이 클래스 파일은 수정하지 말고, proxy.php에서 설정 수정으로 사용하라!
* PHP5 이상 지원
*/
class Mproxy{
	var $conn_timeout = 5; //연결시간 타임아웃
	var $exec_timeout = 5; //실행시간 타임아웃

	/**
	* 생성자
	*/
	function __construct(){
		$this->init();
	}
	function Mproxy(){
		$this->__construct();
	}
	/**
	* 초기화
	*/
	function init(){
		if(!function_exists('curl_init')){
			exit('ERROR : required CURL');
		}
	}
	function http_build_cookie($cookies){
		$ts = array();
		foreach($cookies as $k=>$v){
			$ts[] = $k.'='.rawurlencode($v);
		}
		return implode('; ',$ts);
	}
	function stripslashesForArray($arr){
		if(!get_magic_quotes_gpc()){return $arr;}

		foreach ($arr as $k => $v) {
			$nk = stripslashes($k);
			if ($nk != $k) {
				$arr[$nk] = $v;
				unset($arr[$k]);
			}
			if (is_array($v)) {
				$arr[$nk] = $this->stripslashesForArray($v);
			} else {
				$arr[$nk] = stripslashes($v);
			}
		}
		return $arr;
	}
	function getRequestBody()
	{
		return @file_get_contents('php://input');
	}
	function proxy($url){

		$headers=getallheaders();
		// print_r($headers);
		//print_r($_SERVER);
		if(!isset($headers['Content-Type'])){
			$postRaw = $this->getRequestBody();
		}elseif($headers['Content-Type']=='application/x-www-form-urlencoded'){
			$postRaw = http_build_query($this->stripslashesForArray($_POST));
		}else if($headers['Content-Type']=='multipart/form-data-encoded'){ //불완전, 현재 파일 업로드 지워안됨.
			$postRaw = http_build_query($this->stripslashesForArray($_POST));
		}else{ //그외의 경우 RAW POST값을 바로 사용한다.
			$postRaw = $this->getRequestBody();
		}
		// $headers = array();
		$headers['Content-Length'] = strlen($postRaw);
		// unset($headers['Accept-Encoding']); //압축처리 등을 안할려면 주석을 풀어라.

		$cookieRaw = stripslashes($this->http_build_cookie($this->stripslashesForArray($_COOKIE)));

		$opts = array();
		$opts[CURLOPT_SSL_VERIFYPEER]=false;
		$opts[CURLOPT_SSL_VERIFYHOST]=false;
		// $opts[CURLOPT_FOLLOWLOCATION]=true;
		// $opts[CURLOPT_AUTOREFERER]=true;

		if($_SERVER['SERVER_PROTOCOL']=='HTTP/1.1'){
			$opts[CURLOPT_HTTP_VERSION] = CURL_HTTP_VERSION_1_1; //HTTP 1.1 사용
		}else{
			$opts[CURLOPT_HTTP_VERSION] = CURL_HTTP_VERSION_1_0; //HTTP 1.0 사용
		}
		$opts[CURLOPT_FAILONERROR] = false;
		//exit;
		//$opts[CURLOPT_HTTP_VERSION] = CURL_HTTP_VERSION_1_0; //HTTP 1.0 사용 //테스트용
		$res = null;
		switch($_SERVER['REQUEST_METHOD']){
			case 'GET':
				$res =  $this->get($url,$cookieRaw,$headers, $opts);
				if($res['httpcode']==301 || $res['httpcode']==302){
					$matches = array();
					preg_match('/(Location: )(.*)/i',$res['header'],$matches);
					if(isset($matches[2])){
						$url = trim($matches[2]);
						$res =  $this->get($url,$cookieRaw,$headers, $opts);	
					}
					
				}
			
			break;
			case 'POST':
				$res = $this->post($url,$postRaw,$cookieRaw,$headers, $opts);
			break;
			case 'PUT':
				$res = $this->put($url,$postRaw,$cookieRaw,$headers, $opts);
			break;
			default:
				$res = $this->getContent($url,$postRaw,$cookieRaw,$headers, $opts);
			break;
		}
		return $this->printResult($res);
		
	}
	/**
	* CURL을 사용해서 페이지를 긁어온다.
	* $postRaw : XXX=yyy&ZZZ=aaa  형식
	* $cookieRaw : xxx=yyy; zzz=aaa;  형식
	* $opt : CURL의 curl_setopt 설정, 설정값이 있다면 덮어 씌운다.
	*/
	function getContent($url,$postRaw=null,$cookieRaw=null,$headers=array(), $opts = array())
	{
		$fp = null;
		$result = array();
		$result['header'] = '';
		$result['body'] = '';
		$result['errormsg'] = '';
		$result['errorno'] = '';
		$result['httpcode'] = '404';
		//return $result; //에러처리

		$c_url = $url;


		$conn = curl_init($c_url);
		$conn_timeout	=	$this->conn_timeout;
		$exec_timeout	 =	$this->exec_timeout;

		//--- Host빼오기
		$ts = parse_url($url);

		$headers['Host'] = $ts['host']; //목적지 URL을 기준으로 Host 변경

		//--- 수동 해더 설정
		$c_headers = array();


		foreach($headers as $k=>$v){
			//if($k=='Host'){continue;}
			$c_headers[] = $k.': '.$v;
			//Accept-Encoding , Accept-Language 빼는걸 생각해보자
		}
		$c_headers[] = 'X-Forwarded-For: '.(isset($_SERVER['REMOTE_ADDR'][0])?$_SERVER['REMOTE_ADDR']:'CLI'); //요청자IP
		$c_headers[] = 'X-Forwarded-Server: '.(isset($_SERVER['SERVER_ADDR'][0])?$_SERVER['SERVER_ADDR']:'CLI'); //프록시서버 아이피
		$c_headers[] = 'Expect:';//불필요 HTTP코드 제외 (http code 100 같은것)
		//$c_headers[] = "\r\n";
		curl_setopt($conn, CURLOPT_HTTPHEADER, $c_headers);
		//print_r($url);
		//print_r($c_headers);

		curl_setopt($conn, CURLOPT_FAILONERROR, 1);



		//curl_setopt( $conn, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_0);
		//curl_setopt( $conn, CURLOPT_HTTP_VERSION, CURL_HTTP_VERSION_1_1);



		curl_setopt($conn, CURLOPT_HEADER, true); //응답헤더 OFF. ON 할경우 받는 파일에 헤더가 붙음.
		curl_setopt($conn, CURLOPT_RETURNTRANSFER , true); //응답 내용 가져올지 여부. TRUE면 내용을 리턴. FALSE면 직접 브라우저에 출력
		//curl_setopt($conn, CURLOPT_USERAGENT,"Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/37.0.2062.102 Safari/537.36"); //User Agent 설정
		curl_setopt($conn, CURLOPT_CONNECTTIMEOUT, $conn_timeout); //서버 접속시 timeout 설정
		curl_setopt($conn, CURLOPT_TIMEOUT, $exec_timeout); //서버 접속시 timeout 설정
		//curl_setopt($conn, CURLOPT_TIMEOUT, $timeout); // curl exec 실행시간 timeout 설정
		
		if(isset($opts[CURLOPT_PUT]) && $opts[CURLOPT_PUT] == true){ // PUT으로 동작시
			if(isset($postRaw[0])){
				$len = strlen($postRaw);
				// $fp = fopen('php://temp/maxmemory:'.$len, 'w');
				$fp = tmpfile();
				if (!$fp) 
				{
				    die('could not open temp memory data');
				}
				fwrite($fp, $postRaw);
				fseek($fp, 0); 

				curl_setopt($conn, CURLOPT_BINARYTRANSFER, true);
				curl_setopt($conn, CURLOPT_INFILE, $fp); // file pointer
				curl_setopt($conn, CURLOPT_INFILESIZE, $len);   
			}

			/** use a max of 256KB of RAM before going to disk */


		}else if(isset($postRaw[0])){
			//curl_setopt( $conn, CURLOPT_CUSTOMREQUEST, 'POST');
			curl_setopt($conn, CURLOPT_POST, TRUE);				//POST 전송
			curl_setopt($conn, CURLOPT_POSTFIELDS, $postRaw);		//POST값 세팅
			//echo '========='.$postRaw.'-------------------';
		}

		if(isset($cookieRaw[0])){
			curl_setopt($conn, CURLOPT_COOKIE, $cookieRaw);		//cookie값 세팅
		}
		foreach($opts as $k=>$v){
		  curl_setopt($conn, $k, $v);		//기타 설정
		}
	  //exit;


		$data = curl_exec($conn);
		//echo ($data);		exit;
		$split_result = explode("\r\n\r\n", $data, 2);
		$result['header'] = isset($split_result[0])?$split_result[0]:'';
		$result['body'] = isset($split_result[1])?$split_result[1]:'';
		$result['errormsg'] = curl_error($conn);
		$result['errorno'] = curl_errno($conn);
		$result['httpcode'] = curl_getinfo($conn,CURLINFO_HTTP_CODE);
		$result['curl_info'] = array(
				 'CURLINFO_TOTAL_TIME' => curl_getinfo($conn,CURLINFO_TOTAL_TIME)
				,'CURLINFO_NAMELOOKUP_TIME' => curl_getinfo($conn,CURLINFO_NAMELOOKUP_TIME)
				,'CURLINFO_CONNECT_TIME' => curl_getinfo($conn,CURLINFO_CONNECT_TIME)
				,'CURLINFO_PRETRANSFER_TIME' => curl_getinfo($conn,CURLINFO_PRETRANSFER_TIME)
				,'CURLINFO_STARTTRANSFER_TIME' => curl_getinfo($conn,CURLINFO_STARTTRANSFER_TIME)
				,'CURLINFO_REDIRECT_TIME' => curl_getinfo($conn,CURLINFO_REDIRECT_TIME)
			);
		@curl_close($conn);

		if(isset($fp)){
			@fclose($fp);
		}

		//print_r($result);
		//exit();

		return $result;
	}


	// === method 별 메소드처리
	public function get($url,$cookieRaw=null,$headers=array(), $opts = array()){
		return $this->getContent($url,null,$cookieRaw,$headers, $opts);
	}

	public function post($url,$postRaw=null,$cookieRaw=null,$headers=array(), $opts = array()){
		$opts[CURLOPT_POST] = true;
		return $this->getContent($url,$postRaw,$cookieRaw,$headers, $opts);
	}

	public function put($url,$postRaw=null,$cookieRaw=null,$headers=array(), $opts = array()){
		$opts[CURLOPT_PUT] = true;
		return $this->getContent($url,$postRaw,$cookieRaw,$headers, $opts);
	}

	/**
	* getContent로 입력받은 내용을 출력시킴
	*/
	function printResult($result){
		 // print_r($result);
		 // exit;
		// if($result['errorno']){
		// 	header("HTTP/1.0 500 Internal Server Error");
		// 	print_r($result);
		// 	echo 'ERROR:Internal Server Error';
		// 	return $result;
		// }

		//-- 해더 재출력
		//print_r($result['header']);
		$c_headers = explode("\r\n",trim($result['header']));
		$c_headers[] = 'X-Forwarded-Server: '.(isset($_SERVER['SERVER_ADDR'][0])?$_SERVER['SERVER_ADDR']:'CLI'); //프록시서버 아이피
		foreach($result['curl_info'] as $k=>$v){
			$c_headers[] =  'X-'.$k.': '.$v;			//-- cURL 추가정보중 실행 시간 출력
		}
		foreach($c_headers as $v){
			if(stripos($v,'Transfer-Encoding')===0){ //Transfer-Encoding 는 해더로 재출력하면 안된다.
				continue;
			}
			header($v);
			//echo $v."\n<br>";
		}
		$body = $result['body'];
		echo $body."\r\n"."\r\n";
		return $result;
	}
}
