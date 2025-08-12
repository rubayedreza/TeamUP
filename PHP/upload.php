<?php
    session_start();
    $imgname = $_SESSION['uid'];

// upload.php

    if (isset($_FILES['image']) && $_FILES['image']['error'] == 0) {
        $targetDir = "../img/";
        $targetFile = $targetDir . $_SESSION['uid'] . "pp.png";
        $uploadOk = 1;
        $imageFileType = strtolower(pathinfo($targetFile, PATHINFO_EXTENSION));

        // Check file size
        if ($_FILES['image']['size'] > 500000) {
            $uploadOk = 0;
        }

        

        // Check if $uploadOk is set to 0 by an error
        if ($uploadOk == 0) {
            header("Location: ../HTML/dashboard.php");
        } else {
            // If everything is ok, try to upload file
            if (move_uploaded_file($_FILES['image']['tmp_name'], $targetFile)) {
                header("Location: ../HTML/dashboard.php");
            } else {
                header("Location: ../HTML/dashboard.php");
            }
        }
    } else {
        header("Location: ../HTML/dashboard.php");
    }

?>