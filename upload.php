<?php
	ini_set('upload_max_filesize', '5000000M');
	header('Content-Type: application/json');
	$file = $_FILES['file'];
	$ret = [];

	$path = 'uploads/';
	if(isset($_POST['path'])) {
		if (!is_dir($path.$_POST['path']))
			mkdir($path.$_POST['path']);
		$path = $path.$_POST['path'].'/';
	}

	if (file_exists($path.$file['name'])) {
		header("HTTP/1.0 400");
	    $ret["name"] = $file['name'];
	    $ret["message"] = 'Já existe esse arquivo.';
	} else if(move_uploaded_file($file['tmp_name'],$path.$file['name'])){
	    $ret["path"] = $path . $file['name'];
	    $ret["name"] = $file['name'];
	}else{
		header("HTTP/1.0 400");
	    $ret["name"] = $file['name'];
	}

	echo json_encode($ret, JSON_PRETTY_PRINT);
