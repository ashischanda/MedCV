<?php
$mysqli = new mysqli("localhost", "root", "", "seer_database");
if($mysqli->connect_error) {
  exit('Could not connect');
}

$sql = "SELECT code_length, claims FROM code_table WHERE code_id = ? ";       // LIKE %?%");   didn't work

$stmt = $mysqli->prepare($sql);

//$param = "%" .  $_GET['q'] . "%";      // get the q parameter from URL

$stmt->bind_param("s",    $_GET['q']); 
$stmt->execute();
$stmt->store_result();
$stmt->bind_result($code_length, $claims);

$stmt->fetch();
$stmt->close();

// Concatenation Of String 
$c = $code_length. "=".$claims; 
  
echo $c ;

?>