<?php
    session_start();
    session_unset();
    session_destroy();

    echo "<script>
            sessionStorage.removeItem('isLoggedIn');
            window.location.href = '../index.php';
          </script>";
    exit();
?>
