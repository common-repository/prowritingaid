<?php
/*
 *  Make a call to the PWA service
 */

function PWA_http_post( $request, $host, $path, $port = 80 ) {
        $http_request  = "POST $path HTTP/1.0\r\n";
        $http_request .= "Host: $host\r\n";
        $http_request .= "Content-Type: application/x-www-form-urlencoded\r\n";
        $http_request .= "Content-Length: " . strlen($request) . "\r\n";
        $http_request .= "User-Agent: PWA/0.1\r\n";
        $http_request .= "\r\n";
        $http_request .= $request;            
	
        $response = '';                 
		echo 'start';
		echo $http_request;
        if( false != ( $fs = @fsockopen($host, $port, $errno, $errstr, 10) ) ) {                 
                echo 'read';
				fwrite( $fs, $http_request );

                while ( ! feof( $fs ) )
                        $response .= fgets( $fs );

                fclose( $fs );
                $response = explode( "\r\n\r\n", $response, 2 );
        }
                echo $errno;
                echo $errstr;
        return $response;
}

function pwa_do_post_request($url, $data, $optional_headers = null)
{
  $params = array('http' => array(
              'method' => 'POST',
              'content' => $data
            ));
  if ($optional_headers !== null) {
    $params['http']['header'] = $optional_headers;
  }
  $ctx = stream_context_create($params);
  $fp = @fopen($url, 'r', false, $ctx);
  if (!$fp) {
    throw new Exception("Problem with $url, $php_errormsg");
  }
  $response = @stream_get_contents($fp);
  if ($response === false) {
    throw new Exception("Problem reading data from $url, $php_errormsg");
  }
  return $response;
}

/* 
 *  The action handler used by admin-ajax.php
 */
function PWA_redirect_call() {
        //if ( $_SERVER['REQUEST_METHOD'] === 'POST' )
        //        $postText = trim(  file_get_contents( 'php://input' )  );

		$postText = file_get_contents('php://input');
        //$url = '/InlineAnalysis.aspx';
		//$postText = "report=overused&text=bollox";
//	$service = 'http://localhost';
	//$user = wp_get_current_user();
	//CDB need to change the port here as well to 80 from 2028
        //$data = PWA_http_post( $postText , $service, $url, 2028 );
		//$postText = '{action:"PWA_redirect_call",report:"overused",text:"Grammar is an essential"}';
		//$postText = 'action=PWA_redirect_call';
		$data = PWA_http_post($postText, 'uat.holidayprofessor.com', '/InlineAnalysis.aspx');
		//$data = pwa_do_post_request('http://uat.holidayprofesor.com/InlineAnalysis.aspx', $postText);
		//echo $postTest;
		//$data = $postText;
		//echo "hello <span class='pwa' title='testing 123'>this is some text</span>";
        //header( 'Content-Type: text/plain' );
        //echo $data[1];
		echo $data[1];
		//echo 'post=';
		//echo $post;
        die();
}

PWA_redirect_call();