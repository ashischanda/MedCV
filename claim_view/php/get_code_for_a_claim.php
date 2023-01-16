<?php
$mysqli = new mysqli("localhost", "root", "", "seer_database");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "SELECT codes FROM claim_table WHERE claim_id = ? ";       // LIKE %?%");   didn't work

$stmt = $mysqli->prepare($sql);

//$param = "%" .  $_GET['q'] . "%";      // get the q parameter from URL

$stmt->bind_param("s",    $_GET['q']); 
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($codes);

$stmt->fetch();
$stmt->close();
  
echo $codes ;

?>