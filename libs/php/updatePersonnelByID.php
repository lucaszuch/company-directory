<?php
	// example use from browser
	// http://localhost/company/libs/php/updatePersonnelByID.php?
	// remove next two lines for production
	ini_set('display_errors', 'On');
	error_reporting(E_ALL);

	$executionStartTime = microtime(true);
	include("config.php");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {		
		$output['status']['code'] = "300";
		$output['status']['name'] = "failure";
		$output['status']['description'] = "database unavailable";
		$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output['data'] = [];
		
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}	

	$query = 'UPDATE personnel SET firstName ="' . $_REQUEST['editFirstName'] . '", lastName="' . $_REQUEST['editLastName'] . '", jobTitle ="' . $_REQUEST['editJobTitle'] . '", email ="' . $_REQUEST['editEmail'] . '", departmentID =' . $_REQUEST['editDepartment'] . ' WHERE id =' . $_REQUEST['targetID'];
	//$query = 'UPDATE personnel SET firstName ="' . $_POST['editFirstName'] . '", lastName="' . $_POST['editLastName'] . '", jobTitle ="' . $_POST['editJobTitle'] . '", email ="' . $_POST['editEmail'] . '", departmentID =' . $_POST['editDepartment'] . ' WHERE id =' . $_POST['targetID'];
	
	$result = $conn->query($query);
	
	if (!$result) {
		$output['status']['code'] = "400";
		$output['status']['name'] = "executed";
		$output['status']['description'] = "query failed";	
		$output['data'] = [];

		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}
   
  $data = [];

	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;

	header('Content-Type: application/json; charset=UTF-8');	
	mysqli_close($conn);
	echo json_encode($output); 
?>