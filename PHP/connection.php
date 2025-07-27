<?php
    $host = "localhost";
    $user = "root";
    $password = "";
    $db = "teamup";

    // Create connection
    $con = mysqli_connect($host, $user, $password, $db);

    // Check connection
    if (!$con) {
        echo "Connection failed: " ;
    }
    else {
        echo "Connected successfully";
    }
?>