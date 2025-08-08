<?php
    session_start();
    include 'connection.php';

    $email = $_POST['email'];
    $password = $_POST['password'];

    // Use prepared statements to prevent SQL injection
    $query = "SELECT id, password FROM register_info WHERE email = ?";
    
    $check_user_query = mysqli_prepare($con, $query);
    mysqli_stmt_bind_param($check_user_query, "s", $email);
    mysqli_stmt_execute($check_user_query);
    $query_result = mysqli_stmt_get_result($check_user_query);

    if (mysqli_num_rows($query_result) > 0) {
        $user_data = mysqli_fetch_assoc($query_result);
        $db_password_hash = $user_data['password'];

        // Verify the hashed password
        if (password_verify($password, $db_password_hash)) {
            // Password is correct, set the server-side session.
            $_SESSION['uid'] = $user_data['id'];

            // === MODIFIED PART ===
            // Instead of a PHP header redirect, we echo JavaScript to the browser.
            // This allows us to set the sessionStorage item before changing the page.
            echo "<script>
                    // Set the flag in sessionStorage to remember the login for this browser tab.
                    sessionStorage.setItem('isLoggedIn', 'true');
                    // Now, redirect the user to the dashboard.
                    window.location.href = '../HTML/dashboard.php';
                  </script>";
            exit(); // Stop the script from running further.

        } else {
            // Invalid password, redirect back with an error code.
            header("Location: ../HTML/login.html?error=invalidpassword");
            exit();
        }
    } else {
        // User does not exist, redirect back with an error code.
        header("Location: ../HTML/login.html?error=nouser");
        exit();
    }

    mysqli_stmt_close($check_user_query);
    mysqli_close($con);
?>
