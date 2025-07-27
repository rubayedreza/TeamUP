<?php
    
    include 'connection.php';

    
        $email = $_POST['email'];
        $password = $_POST['password'];

        $sql = "INSERT INTO login_info (email, password) VALUES ('$email', '$password')";
        $result = mysqli_query($con, $sql);

?>