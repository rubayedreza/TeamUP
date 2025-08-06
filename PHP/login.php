<?php
    
    include 'connection.php';

    
        $useremail = $_POST['email'];
        $userpassword = $_POST['password'];

        // Check if the user already exists
        $checkUserSql = "SELECT id,password FROM register_info WHERE email='$useremail'";
        $checkUserResult = mysqli_query($con, $checkUserSql);

        if (mysqli_num_rows($checkUserResult) > 0) {
            // User exists, verify password
            $user = mysqli_fetch_assoc($checkUserResult);

            if ($userpassword === $user['password']) {
                $sql = "INSERT INTO login_info (email, password) VALUES ('$useremail', '$userpassword')";
                $result = mysqli_query($con, $sql);

                session_start();
                $_SESSION['uid'] = $user['id'];


                header("Location: ../HTML/dashboard.php");
                exit();
            } else {
                header("Location: ../HTML/login.html");
                //show alert
                echo "<script>alert('Invalid password');</script>";
                echo "Invalid password.";
                exit();
            }
        } else {
            // User does not exist, redirect to registration page
            header("Location: ../HTML/register.html");
            //show alert
            echo "<script>alert('User does not exist. Please register first.');</script>";
            echo "User does not exist.";
            exit();
        }


?>