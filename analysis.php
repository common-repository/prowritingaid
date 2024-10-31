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

        if( false != ( $fs = @fsockopen($host, $port, $errno, $errstr, 10) ) ) {                 
                fwrite( $fs, $http_request );

                while ( ! feof( $fs ) )
                        $response .= fgets( $fs );

                fclose( $fs );
                $response = explode( "\r\n\r\n", $response, 2 );
        }
        return $response;
}

/* 
 *  The action handler used by admin-ajax.php
 */
function PWA_redirect_call() {
    $postText = trim(  file_get_contents( 'php://input' )  );
	$options = get_option('pwa_options');
	$licenceCode = '';
	if (array_key_exists ('licenceCode_string', $options)){
		$licenceCode = $options['licenceCode_string'];
	}
	$data = PWA_http_post($postText . "&licence=".$licenceCode, 'uat.holidayprofessor.com', '/InlineAnalysis.aspx');
	echo $data[1];
    die();
}
